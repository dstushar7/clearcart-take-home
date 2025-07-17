package com.clearcart.backend.repository;

import com.clearcart.backend.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Set;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
    Set<Category> findByIdIn(Set<Integer> ids);
}
