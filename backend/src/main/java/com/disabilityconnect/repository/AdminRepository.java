package com.disabilityconnect.repository;

import com.disabilityconnect.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Admins are simply Users with role = "ADMIN". This repository exposes
 * admin-focused queries on top of the same `users` table, as requested
 * by the backend structure in the spec.
 */
public interface AdminRepository extends JpaRepository<User, Long> {
    List<User> findByRole(String role);
}
