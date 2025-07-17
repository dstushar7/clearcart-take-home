package com.clearcart.backend.dto;

import com.clearcart.backend.entity.Product;
import lombok.Data;
import java.util.List;

@Data
public class UserDashboard {
    private List<Product> bought;
    private List<Product> sold;
    private List<Product> rented;
    private List<Product> lent;
}