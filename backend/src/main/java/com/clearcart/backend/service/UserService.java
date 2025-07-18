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
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final HttpSession httpSession;

    public AuthResponse login(String email, String password) {
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            throw new ResourceNotFoundException("User not found: " + email);
        }

        if(!password.equals(user.getPassword())) {
            throw new UnauthorizedException("Wrong password");
        }
        // Storing session in-memory
        httpSession.setAttribute("loggedInUser", user);
        return new AuthResponse(user,"Login Successful");
    }

    public User registerUser(RegisterUserInput input){
        if (userRepository.findByEmail(input.getEmail()).isPresent()) {
            throw new BadRequestException(input.getEmail()+" already exists");
        }

        User newUser = new User();
        newUser.setEmail(input.getEmail());
        newUser.setFirstName(input.getFirstName());
        newUser.setLastName(input.getLastName());
        newUser.setPassword(input.getPassword());
        newUser.setCreatedAt(OffsetDateTime.now());

        return userRepository.save(newUser);
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
