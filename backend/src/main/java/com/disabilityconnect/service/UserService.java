package com.disabilityconnect.service;

import com.disabilityconnect.dto.LoginRequest;
import com.disabilityconnect.dto.RegisterRequest;
import com.disabilityconnect.model.User;
import com.disabilityconnect.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered");
        }
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setDisabilityType(request.getDisabilityType());
        user.setRole("USER");
        return userRepository.save(user);
    }

    public Optional<User> login(LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isPresent() && passwordEncoder.matches(request.getPassword(), userOpt.get().getPassword())) {
            return userOpt;
        }
        return Optional.empty();
    }

    public Optional<User> getById(Long id) {
        return userRepository.findById(id);
    }

    public List<User> getAll() {
        return userRepository.findAll();
    }

    public User updateProfile(Long id, User updated) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (updated.getName() != null) user.setName(updated.getName());
        if (updated.getPhone() != null) user.setPhone(updated.getPhone());
        if (updated.getDisabilityType() != null) user.setDisabilityType(updated.getDisabilityType());
        if (updated.getAccessibilityNeeds() != null) user.setAccessibilityNeeds(updated.getAccessibilityNeeds());
        return userRepository.save(user);
    }

    /** Strips the password hash before a User is sent back to the client. */
    public User sanitize(User user) {
        user.setPassword(null);
        return user;
    }
}
