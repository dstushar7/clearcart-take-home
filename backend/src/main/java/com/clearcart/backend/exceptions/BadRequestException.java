package com.clearcart.backend.exceptions;

public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super("Bad Request: " + message);
    }
}
