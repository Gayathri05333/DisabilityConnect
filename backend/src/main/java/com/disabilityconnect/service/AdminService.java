package com.disabilityconnect.service;

import com.disabilityconnect.model.User;
import com.disabilityconnect.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<User> getAllUsers() {
        return adminRepository.findAll();
    }

    public List<User> getAllAdmins() {
        return adminRepository.findByRole("ADMIN");
    }

    /** Simple admin login re-using the users table with role = ADMIN. */
    public Optional<User> login(String email, String password) {
        return adminRepository.findAll().stream()
                .filter(u -> u.getEmail().equalsIgnoreCase(email) && "ADMIN".equals(u.getRole()))
                .filter(u -> passwordEncoder.matches(password, u.getPassword()))
                .findFirst();
    }
}
