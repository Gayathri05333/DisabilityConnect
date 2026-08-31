package com.disabilityconnect.controller;

import com.disabilityconnect.dto.ApiResponse;
import com.disabilityconnect.dto.LoginRequest;
import com.disabilityconnect.model.User;
import com.disabilityconnect.service.AdminService;
import com.disabilityconnect.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@RequestBody LoginRequest request) {
        Optional<User> adminOpt = adminService.login(request.getEmail(), request.getPassword());
        if (adminOpt.isPresent()) {
            return ResponseEntity.ok(ApiResponse.ok("Admin login successful", userService.sanitize(adminOpt.get())));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.fail("Invalid admin credentials"));
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return adminService.getAllUsers().stream()
                .map(userService::sanitize)
                .collect(Collectors.toList());
    }
}
