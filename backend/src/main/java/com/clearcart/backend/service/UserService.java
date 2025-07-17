package com.clearcart.backend.service;

import com.clearcart.backend.dto.AuthResponse;
import com.clearcart.backend.entity.User;
import com.clearcart.backend.exceptions.DuplicateUsernameException;
import com.clearcart.backend.exceptions.InvalidCredentialsException;
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
            throw new InvalidCredentialsException();
        }
        // Storing session in-memory
        httpSession.setAttribute("loggedInUser", user);
        return new AuthResponse(user,"Login Successful");
    }

    public User registerUser(String username, String password){
        if (userRepository.findByUsername(username).isPresent()) {
            throw new DuplicateUsernameException(username);
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
}
