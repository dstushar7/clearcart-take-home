package com.clearcart.backend.exceptions;

public class UnauthorizedException extends RuntimeException {
  public UnauthorizedException(String message) {
    super("Unauthorized access :"+message );
  }
}
