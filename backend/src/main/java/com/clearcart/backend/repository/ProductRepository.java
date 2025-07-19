package com.clearcart.backend.repository;

import com.clearcart.backend.entity.Product;
import com.clearcart.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Integer> {
    List<Product> findByOwner(User owner);
    List<Product> findByStatus(String status);

    @Query("SELECT p FROM Product p WHERE p.status = :status")
    List<Product> findAvailableProducts(@Param("status") String status);

    @Query("SELECT p FROM Product p WHERE p.status = :status AND p.owner.id != :userId")
    List<Product> findAvailableProductsForOtherUsers(
            @Param("status") String status,
            @Param("userId") Integer userId
    );
}
