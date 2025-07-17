package com.clearcart.backend.service;

import com.clearcart.backend.dto.AuthResponse;
import com.clearcart.backend.entity.User;
import com.clearcart.backend.exceptions.BadRequestException;
import com.clearcart.backend.exceptions.UnauthorizedException;
import com.clearcart.backend.exceptions.ResourceNotFoundException;
import com.clearcart.backend.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final HttpSession httpSession;

    public AuthResponse login(String username, String password) {
        User user = userRepository.findByUsername(username).orElse(null);

        if (user == null) {
            throw new ResourceNotFoundException("User not found: " + username);
        }

        if(!password.equals(user.getPassword())) {
            throw new UnauthorizedException("Wrong password");
        }
        // Storing session in-memory
        httpSession.setAttribute("loggedInUser", user);
        return new AuthResponse(user,"Login Successful");
    }

    public User registerUser(String username, String password){
        if (userRepository.findByUsername(username).isPresent()) {
            throw new BadRequestException(username+" already exists");
        }

        User newUser = new User();
        newUser.setUsername(username);
        newUser.setPassword(password);

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
