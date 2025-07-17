package com.clearcart.backend.util;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    RESOURCE_NOT_FOUND("RESOURCE_NOT_FOUND", "Resource not found"),
    UNAUTHORIZED_ACCESS("UNAUTHORIZED ACCESS", "Invalid access"),
    BAD_REQUEST("BAD_REQUEST", "Wrong Request"),
    VALIDATION_ERROR("VALIDATION_ERROR", "Validation failed"),
    INTERNAL_SERVER_ERROR("INTERNAL_SERVER_ERROR", "An unexpected error occurred");

    private final String code;
    private final String defaultMessage;
}