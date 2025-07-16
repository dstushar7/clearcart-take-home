package com.clearcart.backend.dto;

import com.clearcart.backend.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AuthResponse {
    private User user;
    private String message;
}