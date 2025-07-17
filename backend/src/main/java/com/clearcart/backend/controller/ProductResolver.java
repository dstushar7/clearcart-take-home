package com.clearcart.backend.controller;

import com.clearcart.backend.dto.ProductInput;
import com.clearcart.backend.dto.RentProductInput;
import com.clearcart.backend.dto.UserDashboard;
import com.clearcart.backend.entity.Category;
import com.clearcart.backend.entity.Product;
import com.clearcart.backend.service.CategoryService;
import com.clearcart.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class ProductResolver {
    private final ProductService productService;
    private final CategoryService categoryService;

    // Query Resolvers
    @QueryMapping
    public List<Product> products() {
        return productService.getAllAvailableProducts();
    }

    @QueryMapping
    public Product product(@Argument String id) {
        return productService.getProductById(Integer.parseInt(id));
    }

    @QueryMapping
    public List<Product> myProducts() {
        return productService.getMyProducts();
    }

    @QueryMapping
    public List<Category> categories() {
        return categoryService.getAllCategories();
    }

    @QueryMapping
    public UserDashboard dashboard() {
        return productService.getUserDashboard();
    }

    // Mutation Resolvers
    @MutationMapping
    public Product createProduct(@Argument ProductInput input) {
        return productService.createProduct(input);
    }

    @MutationMapping
    public Product updateProduct(@Argument String id, @Argument ProductInput input) {
        return productService.updateProduct(Integer.parseInt(id), input);
    }

    @MutationMapping
    public Boolean deleteProduct(@Argument String id) {
        return productService.deleteProduct(Integer.parseInt(id));
    }

    @MutationMapping
    public Product buyProduct(@Argument String productId) {
        return productService.buyProduct(Integer.parseInt(productId));
    }

    @MutationMapping
    public Product rentProduct(@Argument RentProductInput input) {
        return productService.rentProduct(input);
    }
}

