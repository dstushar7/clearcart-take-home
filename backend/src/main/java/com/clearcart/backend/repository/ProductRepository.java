package com.clearcart.backend.repository;

import com.clearcart.backend.entity.Product;
import com.clearcart.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Integer> {
    List<Product> findByOwnerId(Integer ownerId);
    List<Product> findByStatus(String status);
}
