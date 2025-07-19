package com.clearcart.backend.components;

import com.clearcart.backend.exceptions.BadRequestException;
import com.clearcart.backend.exceptions.UnauthorizedException;
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
            return buildError(ErrorCode.RESOURCE_NOT_FOUND, ex.getMessage(), env);
        } else if (ex instanceof UnauthorizedException) {
            return buildError(ErrorCode.UNAUTHORIZED_ACCESS, ex.getMessage(), env);
        } else if (ex instanceof BadRequestException) {
            return buildError(ErrorCode.BAD_REQUEST, ex.getMessage(), env);
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
