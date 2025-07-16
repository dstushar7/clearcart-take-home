package com.clearcart.backend.util;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    USER_NOT_FOUND("USER_NOT_FOUND", "User not found"),
    INVALID_CREDENTIALS("INVALID_CREDENTIALS", "Invalid username or password"),
    DUPLICATE_USERNAME("DUPLICATE_USERNAME", "Username already exists"),
    VALIDATION_ERROR("VALIDATION_ERROR", "Validation failed"),
    INTERNAL_SERVER_ERROR("INTERNAL_SERVER_ERROR", "An unexpected error occurred");

    private final String code;
    private final String defaultMessage;
}