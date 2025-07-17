package com.clearcart.backend.exceptions;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String resourceName) {
        super("Resource not found: " + resourceName);
    }
}
