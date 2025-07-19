package com.clearcart.backend.service;

import com.clearcart.backend.constants.ProductStatus;
import com.clearcart.backend.constants.TransactionType;
import com.clearcart.backend.dto.ProductInput;
import com.clearcart.backend.dto.RentProductInput;
import com.clearcart.backend.dto.UserDashboard;
import com.clearcart.backend.entity.Category;
import com.clearcart.backend.entity.Product;
import com.clearcart.backend.entity.Transaction;
import com.clearcart.backend.entity.User;
import com.clearcart.backend.exceptions.BadRequestException;
import com.clearcart.backend.exceptions.ResourceNotFoundException;
import com.clearcart.backend.exceptions.UnauthorizedException;
import com.clearcart.backend.repository.CategoryRepository;
import com.clearcart.backend.repository.ProductRepository;
import com.clearcart.backend.repository.TransactionRepository;
import com.clearcart.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final TransactionRepository transactionRepository;
    private final UserService userService;


    public Product createProduct(ProductInput input) {
        try {
            User owner = userService.getCurrentUser();

            Product product = new Product();
            product.setName(input.getName());
            product.setDescription(input.getDescription());
            product.setPriceForRent(input.getPriceForRent());
            product.setPriceForSale(input.getPriceForSale());
            product.setOwner(owner);
            product.setStatus(ProductStatus.AVAILABLE);
            product.setCreatedAt(OffsetDateTime.now());

            // Add categories if provided
            if (!input.getCategoryIds().isEmpty()) {
                Set<Category> categories = categoryRepository.findByIdIn(input.getCategoryIds());
                product.setCategories(categories);
            }
            return productRepository.save(product);
        } catch (Exception e) {
            log.error("An unexpected error occurred while creating product '{}'", input.getName(), e);
            throw new RuntimeException("Unexpected Error occured");
        }
    }

    public Product updateProduct(Integer productId, ProductInput input) {
        User currentUser = userService.getCurrentUser();
        log.info("User ID {} is attempting to update product ID {}", currentUser.getId(), productId);


        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        // Check ownership
        if (!product.getOwner().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You can only edit your own products");
        }

        // Can't edit if product is sold
        if (ProductStatus.SOLD.equals(product.getStatus())) {
            throw new BadRequestException("Cannot edit sold products");
        }

        product.setName(input.getName());
        product.setDescription(input.getDescription());
        product.setPriceForRent(input.getPriceForRent());
        product.setPriceForSale(input.getPriceForSale());
        product.setUpdatedAt(OffsetDateTime.now());

        // Update categories
        if (!input.getCategoryIds().isEmpty()) {
            Set<Category> categories = categoryRepository.findByIdIn(input.getCategoryIds());
            product.setCategories(categories);
        }

        return productRepository.save(product);
    }

    public boolean deleteProduct(Integer productId) {
        User currentUser = userService.getCurrentUser();
        log.info("User ID {} is attempting to delete product ID {}", currentUser.getId(), productId);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        // Check ownership
        if (!product.getOwner().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You can only delete your own products");
        }

        // Can't delete if product is rented or sold
        if (!ProductStatus.AVAILABLE.equals(product.getStatus())) {
            throw new BadRequestException("Cannot delete products that are rented or sold");
        }

        productRepository.delete(product);
        return true;
    }

    public Product buyProduct(Integer productId) {
        User buyer = userService.getCurrentUser();

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (!ProductStatus.AVAILABLE.equals(product.getStatus())) {
            throw new BadRequestException("Product is not available for purchase");
        }

        if (product.getOwner().getId().equals(buyer.getId())) {
            throw new BadRequestException("You cannot buy your own product");
        }

        // Update product status
        product.setStatus(ProductStatus.SOLD);
        product.setUpdatedAt(OffsetDateTime.now());

        // Create transaction record
        Transaction transaction = new Transaction();
        transaction.setProduct(product);
        transaction.setActor(buyer);
        transaction.setOwner(product.getOwner());
        transaction.setType(TransactionType.PURCHASE);
        transaction.setTotalPrice(product.getPriceForSale());
        transaction.setCreatedAt(OffsetDateTime.now());

        transactionRepository.save(transaction);
        return productRepository.save(product);
    }

    public Product rentProduct(RentProductInput input) {
        User renter = userService.getCurrentUser();

        Product product = productRepository.findById(input.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        // Validation
        if (!ProductStatus.AVAILABLE.equals(product.getStatus())) {
            throw new BadRequestException("Product is not available for rent");
        }

        if (product.getOwner().getId().equals(renter.getId())) {
            throw new BadRequestException("You cannot rent your own product");
        }

        if (input.getRentStartDate().isBefore(LocalDate.now())) {
            throw new BadRequestException("Start date cannot be in the past");
        }

        if (input.getRentEndDate().isBefore(input.getRentStartDate())) {
            throw new BadRequestException("End date must be after start date");
        }

        // Check if product is already rented for these dates
        List<Transaction> overlappingRentals = transactionRepository.findOverlappingRentals(
                input.getProductId(),
                input.getRentStartDate(),
                input.getRentEndDate()
        );

        if (!overlappingRentals.isEmpty()) {
            throw new BadRequestException("Product is already booked for some or all of the selected dates. Please choose a different period.");
        }

        // Calculate rental cost
        long days = ChronoUnit.DAYS.between(input.getRentStartDate(), input.getRentEndDate()) + 1;
        BigDecimal totalCost = product.getPriceForRent().multiply(BigDecimal.valueOf(days));

        // Update product status if rental starts today
        if (input.getRentStartDate().equals(LocalDate.now())) {
            product.setStatus(ProductStatus.RENTED);
            product.setUpdatedAt(OffsetDateTime.now());
        }

        // Create transaction record
        Transaction transaction = new Transaction();
        transaction.setProduct(product);
        transaction.setActor(renter);
        transaction.setOwner(product.getOwner());
        transaction.setType(TransactionType.RENT);
        transaction.setRentStartDate(input.getRentStartDate());
        transaction.setRentEndDate(input.getRentEndDate());
        transaction.setTotalPrice(totalCost);
        transaction.setCreatedAt(OffsetDateTime.now());

        transactionRepository.save(transaction);
        return productRepository.save(product);
    }

    public List<Product> getMyProducts() {
        User currentUser = userService.getCurrentUser();
        return productRepository.findByOwner(currentUser);
    }

    public UserDashboard getUserDashboard() {
        User currentUser = userService.getCurrentUser();
        List<Transaction> transactions = transactionRepository.findByActorOrOwner(currentUser);

        UserDashboard dashboard = new UserDashboard();

        // Products I've bought
        dashboard.setBought(transactions.stream()
                .filter(t -> t.getActor().getId().equals(currentUser.getId())
                        && TransactionType.PURCHASE.equals(t.getType()))
                .map(Transaction::getProduct)
                .collect(Collectors.toList()));

        // Products I've sold
        dashboard.setSold(transactions.stream()
                .filter(t -> t.getOwner().getId().equals(currentUser.getId())
                        && TransactionType.PURCHASE.equals(t.getType()))
                .map(Transaction::getProduct)
                .collect(Collectors.toList()));

        // Products I've rented
        dashboard.setRented(transactions.stream()
                .filter(t -> t.getActor().getId().equals(currentUser.getId())
                        && TransactionType.RENT.equals(t.getType()))
                .map(Transaction::getProduct)
                .collect(Collectors.toList()));

        // Products I've lent
        dashboard.setLent(transactions.stream()
                .filter(t -> t.getOwner().getId().equals(currentUser.getId())
                        && TransactionType.RENT.equals(t.getType()))
                .map(Transaction::getProduct)
                .collect(Collectors.toList()));

        return dashboard;
    }


    public List<Product> getAllAvailableProducts() {
        User currentUser = userService.getCurrentUser();
        return productRepository.findAvailableProductsForOtherUsers(
                ProductStatus.AVAILABLE,
                currentUser.getId()
        );
//        return productRepository.findAvailableProducts(ProductStatus.AVAILABLE);
    }

    public Product getProductById(Integer id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
    }
}
