package com.clearcart.backend.controller;

import com.clearcart.backend.entity.User;
import com.clearcart.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class UserGraphQLController {
    private final UserService userService;

    @MutationMapping
    public User register(User user) {
        return null;
    }
}
