package com.clearcart.backend.controller;

import com.clearcart.backend.dto.AuthResponse;
import com.clearcart.backend.entity.User;
import com.clearcart.backend.service.AuthService;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class AuthGraphQLController {
    private final AuthService authService;

    @MutationMapping
    public User register(@Argument @NotBlank String username, @Argument @NotBlank String password) {
        return authService.registerUser(username, password);
    }

    @MutationMapping
    public AuthResponse login(@Argument @NotBlank String username, @Argument @NotBlank String password) {
        return authService.login(username, password);
    }

    @MutationMapping
    public String logout() {
        authService.logout();
        return "Logout successful";
    }

    @QueryMapping
    public User currentUser() {
        return authService.getCurrentUser();
    }
}
