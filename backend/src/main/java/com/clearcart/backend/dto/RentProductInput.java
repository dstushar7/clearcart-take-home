package com.clearcart.backend.dto;


import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class RentProductInput {
    @NotNull
    private Integer productId;
    @NotNull
    private LocalDate rentStartDate;
    @NotNull
    private LocalDate rentEndDate;
}
