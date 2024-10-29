-- Database: user_management

-- Create database
CREATE DATABASE IF NOT EXISTS user_management;
USE user_management;

-- Create users table
CREATE TABLE users (
    uuid CHAR(36) NOT NULL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20),
    thumbnail_picture VARCHAR(255),
    large_picture VARCHAR(255),
    street_number VARCHAR(10),
    street_name VARCHAR(100),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postcode VARCHAR(20)
);

-- Create an index on email for faster lookup
CREATE INDEX idx_email ON users(email);

-- Create stored procedures for adding and updating users
-- Stored procedures with parameters to prevent SQL injection

DELIMITER $$
CREATE PROCEDURE add_user(
    IN p_uuid CHAR(36),
    IN p_first_name VARCHAR(50),
    IN p_last_name VARCHAR(50),
    IN p_email VARCHAR(100),
    IN p_phone VARCHAR(20),
    IN p_thumbnail_picture VARCHAR(255),
    IN p_large_picture VARCHAR(255),
    IN p_street_number VARCHAR(10),
    IN p_street_name VARCHAR(100),
    IN p_city VARCHAR(100),
    IN p_state VARCHAR(100),
    IN p_country VARCHAR(100),
    IN p_postcode VARCHAR(20)
)
BEGIN
    INSERT INTO users (
        uuid, first_name, last_name, email, phone, thumbnail_picture, large_picture,
        street_number, street_name, city, state, country, postcode
    ) VALUES (
        p_uuid, p_first_name, p_last_name, p_email, p_phone, p_thumbnail_picture, p_large_picture,
        p_street_number, p_street_name, p_city, p_state, p_country, p_postcode
    );
END$$

CREATE PROCEDURE update_user(
    IN p_uuid CHAR(36),
    IN p_first_name VARCHAR(50),
    IN p_last_name VARCHAR(50),
    IN p_email VARCHAR(100),
    IN p_phone VARCHAR(20),
    IN p_thumbnail_picture VARCHAR(255),
    IN p_large_picture VARCHAR(255),
    IN p_street_number VARCHAR(10),
    IN p_street_name VARCHAR(100),
    IN p_city VARCHAR(100),
    IN p_state VARCHAR(100),
    IN p_country VARCHAR(100),
    IN p_postcode VARCHAR(20)
)
BEGIN
    UPDATE users SET
        first_name = p_first_name,
        last_name = p_last_name,
        email = p_email,
        phone = p_phone,
        thumbnail_picture = p_thumbnail_picture,
        large_picture = p_large_picture,
        street_number = p_street_number,
        street_name = p_street_name,
        city = p_city,
        state = p_state,
        country = p_country,
        postcode = p_postcode
    WHERE uuid = p_uuid;
END$$

DELIMITER ;
