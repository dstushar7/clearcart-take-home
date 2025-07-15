package com.clearcart.backend.service;

import com.clearcart.backend.entity.User;
import com.clearcart.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public User registerUser(String username, String password){
        return null;
    }
}
