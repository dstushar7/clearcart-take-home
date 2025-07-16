package com.clearcart.backend.exceptions;

public class DuplicateUsernameException extends RuntimeException {
    public DuplicateUsernameException(String message) {
        super("Username already exists: " + message);
    }
}
