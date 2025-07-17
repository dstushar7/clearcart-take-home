package com.clearcart.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Data
public class ProductInput {
    @NotBlank
    private String name;
    private String description;
    @NotNull
    @Positive
    private BigDecimal priceForRent;
    @NotNull
    @Positive
    private BigDecimal priceForSale;
    private Set<Integer> categoryIds = new HashSet<>();
}


