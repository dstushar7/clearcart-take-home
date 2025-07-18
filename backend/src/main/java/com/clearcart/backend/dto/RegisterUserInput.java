package com.clearcart.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RegisterUserInput {
    @NotNull
    private String firstName;
    @NotNull
    private String lastName;
    @NotNull
    private String email;
    @NotNull
    private String password;
}
