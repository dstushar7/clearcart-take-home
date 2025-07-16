package com.clearcart.backend.repository;

import com.clearcart.backend.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Integer> {
    List<Transaction> findByActorId(Integer actorId);
    List<Transaction> findByOwnerId(Integer ownerId);
}
