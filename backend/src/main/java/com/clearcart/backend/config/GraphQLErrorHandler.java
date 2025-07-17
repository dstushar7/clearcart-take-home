package com.clearcart.backend.config;

import com.clearcart.backend.exceptions.DuplicateUsernameException;
import com.clearcart.backend.exceptions.InvalidCredentialsException;
import com.clearcart.backend.exceptions.ResourceNotFoundException;
import com.clearcart.backend.util.ErrorCode;
import graphql.ErrorType;
import graphql.GraphQLError;
import graphql.schema.DataFetchingEnvironment;
import jakarta.validation.ConstraintViolationException;
import org.springframework.graphql.execution.DataFetcherExceptionResolverAdapter;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;

import java.util.Collections;

@Component
public class GraphQLErrorHandler extends DataFetcherExceptionResolverAdapter {

    @Override
    protected GraphQLError resolveToSingleError(@NonNull Throwable ex, @NonNull DataFetchingEnvironment env) {
        // Map custom exceptions to GraphQLError with specific error types and extensions
        if (ex instanceof ResourceNotFoundException) {
            return buildError(ErrorCode.USER_NOT_FOUND, ex.getMessage(), env);
        } else if (ex instanceof InvalidCredentialsException) {
            return buildError(ErrorCode.INVALID_CREDENTIALS, ex.getMessage(), env);
        } else if (ex instanceof DuplicateUsernameException) {
            return buildError(ErrorCode.DUPLICATE_USERNAME, ex.getMessage(), env);
        } else if (ex instanceof ConstraintViolationException) {
            return buildError(ErrorCode.VALIDATION_ERROR, "Validation failed: " + ex.getMessage(), env);
        }
        // Fallback for unhandled exceptions
        return buildError(ErrorCode.INTERNAL_SERVER_ERROR, "An unexpected error occurred: " + ex.getMessage(), env);
    }

    private GraphQLError buildError(ErrorCode errorCode, String message, DataFetchingEnvironment env) {
        return GraphQLError.newError()
                .errorType(ErrorType.DataFetchingException)
                .message(message)
                .path(env.getExecutionStepInfo().getPath())
                .extensions(Collections.singletonMap("code", errorCode.getCode()))
                .build();
    }
}
