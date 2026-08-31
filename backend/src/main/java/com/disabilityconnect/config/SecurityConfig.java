package com.disabilityconnect.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Mini-project level security: passwords are hashed with BCrypt before being
 * stored, and never returned in API responses (see UserService / model
 * getters used by the controllers). A full Spring Security filter chain /
 * JWT layer is intentionally left out to keep the project at mini-project
 * scope, as requested in the spec.
 */
@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
