package com.clearcart.backend.repository;

import com.clearcart.backend.entity.Transaction;
import com.clearcart.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Integer> {
    List<Transaction> findByActor(User actor);
    List<Transaction> findByOwner(User owner);

    @Query("SELECT t FROM Transaction t WHERE t.actor = :user OR t.owner = :user")
    List<Transaction> findByActorOrOwner(@Param("user") User user);

    @Query("SELECT t FROM Transaction t WHERE t.product.id = :productId AND t.type = 'RENT' " +
            "AND :date BETWEEN t.rentStartDate AND t.rentEndDate")
    List<Transaction> findActiveRentals(@Param("productId") Integer productId, @Param("date") LocalDate date);
}
