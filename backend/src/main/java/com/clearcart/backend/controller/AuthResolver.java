package com.clearcart.backend.controller;

import com.clearcart.backend.dto.AuthResponse;
import com.clearcart.backend.dto.RegisterUserInput;
import com.clearcart.backend.entity.User;
import com.clearcart.backend.service.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;


@Controller
@RequiredArgsConstructor
//@CrossOrigin(origins = "*", allowCredentials = "true")
public class AuthResolver {
    private final UserService userService;

    // Query Resolver
    @QueryMapping
    public User currentUser(){
        return userService.getCurrentUser();
    }

    // Mutation Resolver
    @MutationMapping
    public User register(@Argument("input") @Valid RegisterUserInput input) {
        return userService.registerUser(input);
    }

    @MutationMapping
    public AuthResponse login(@Argument @NotBlank String email, @Argument @NotBlank String password) {
        return userService.login(email, password);
    }

    @MutationMapping
    public String logout() {
        userService.logout();
        return "Logout successful";
    }
}
