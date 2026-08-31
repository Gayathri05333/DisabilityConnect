-- =====================================================
-- DisabilityConnect - MySQL Database Script
-- =====================================================
-- NOTE: You do NOT have to run this manually. Spring Boot
-- (spring.jpa.hibernate.ddl-auto=update) will create the database
-- (createDatabaseIfNotExist=true) and all tables automatically the
-- first time the backend starts, and DataSeeder.java will insert
-- demo accounts + sample places/hospitals for you.
--
-- This script is provided for reference / manual setup if you prefer
-- to create the schema yourself before starting the backend.
-- =====================================================

CREATE DATABASE IF NOT EXISTS disability_connect;
USE disability_connect;

-- ---------------------------------------------------
-- Table: users
-- ---------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    disability_type VARCHAR(50),
    accessibility_needs VARCHAR(1000),
    role VARCHAR(20) NOT NULL DEFAULT 'USER'
);

-- ---------------------------------------------------
-- Table: places
-- ---------------------------------------------------
CREATE TABLE IF NOT EXISTS places (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    address VARCHAR(500),
    description VARCHAR(1000),
    image VARCHAR(500),
    wheelchair_access BOOLEAN DEFAULT FALSE,
    phone VARCHAR(20),
    latitude DOUBLE,
    longitude DOUBLE
);

-- ---------------------------------------------------
-- Table: hospitals
-- ---------------------------------------------------
CREATE TABLE IF NOT EXISTS hospitals (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(500),
    phone VARCHAR(20),
    image VARCHAR(500),
    emergency_available BOOLEAN DEFAULT FALSE,
    latitude DOUBLE,
    longitude DOUBLE
);

-- ---------------------------------------------------
-- Table: emergency_contacts
-- ---------------------------------------------------
CREATE TABLE IF NOT EXISTS emergency_contacts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    contact_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    relationship VARCHAR(100),
    CONSTRAINT fk_emergency_contacts_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
);

-- ---------------------------------------------------
-- Demo accounts (created automatically by DataSeeder.java
-- with a properly BCrypt-hashed password — do NOT insert
-- plain-text passwords manually):
--   Admin : admin@disabilityconnect.com / admin123
--   User  : user@disabilityconnect.com  / password123
-- ---------------------------------------------------
