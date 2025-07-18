package com.clearcart.backend.service;

import com.clearcart.backend.dto.AuthResponse;
import com.clearcart.backend.dto.RegisterUserInput;
import com.clearcart.backend.entity.User;
import com.clearcart.backend.exceptions.BadRequestException;
import com.clearcart.backend.exceptions.UnauthorizedException;
import com.clearcart.backend.exceptions.ResourceNotFoundException;
import com.clearcart.backend.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final HttpSession httpSession;

    public AuthResponse login(String email, String password) {
        log.info("Login attempt for email: {}", email);
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            throw new ResourceNotFoundException("User not found: " + email);
        }

        if(!password.equals(user.getPassword())) {
            log.warn("Failed login for user ID {}: Invalid password", user.getId());
            throw new UnauthorizedException("Wrong password");
        }
        // Storing session in-memory
        httpSession.setAttribute("loggedInUser", user);
        log.info("User ID {} logged in successfully.", user.getId());
        return new AuthResponse(user,"Login Successful");
    }

    public User registerUser(RegisterUserInput input){
        log.info("Attempting to register new user with email: {}", input.getEmail());
        if (userRepository.findByEmail(input.getEmail()).isPresent()) {
            throw new BadRequestException(input.getEmail()+" already exists");
        }

        User newUser = new User();
        newUser.setEmail(input.getEmail());
        newUser.setFirstName(input.getFirstName());
        newUser.setLastName(input.getLastName());
        newUser.setPassword(input.getPassword());
        newUser.setCreatedAt(OffsetDateTime.now());

        try {
            User savedUser = userRepository.save(newUser);
            log.info("Successfully registered new user with ID: {}", savedUser.getId());
            return savedUser;
        } catch (Exception e) {
            log.error("Database error during registration for email {}: {}", input.getEmail(), e.getMessage());
            throw new BadRequestException("Could not register user due to a data conflict.");
        }
    }

    public void logout() {
        // Clear the session
        httpSession.removeAttribute("loggedInUser");
        httpSession.invalidate();
    }

    public User getCurrentUser() {
        return (User) httpSession.getAttribute("loggedInUser");
    }
}
