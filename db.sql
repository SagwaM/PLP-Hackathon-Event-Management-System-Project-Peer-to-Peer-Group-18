CREATE DATABASE event_management;
USE DATABASE event_management;

CREATE TABLE IF NOT EXISTS users (
users_id INT AUTO_INCREMENT PRIMARY KEY,
username VARCHAR(100) NOT NULL UNIQUE,
password VARCHAR(255) NOT NULL,
email VARCHAR(255) NOT NULL UNIQUE,
role ENUM('admin', 'attendee') DEFAULT 'attendee',
phone_number VARCHAR(20),
status ENUM('active', 'inactive', 'banned') DEFAULT 'active',
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS events (
events_id INT AUTO_INCREMENT PRIMARY KEY,
title VARCHAR(255) NOT NULL,
description TEXT NOT NULL,
event_date DATE NOT NULL,
location VARCHAR(255),
max_participants INT,
price DECIMAL(10, 2),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS categories (
categories_id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(100) NOT NULL UNIQUE,
description TEXT
);


CREATE TABLE IF NOT EXISTS event_categories (
events_id INT,
categories_id INT,
PRIMARY KEY (events_id, categories_id),
FOREIGN KEY (events_id) REFERENCES events(events_id) ON DELETE CASCADE,
FOREIGN KEY (categories_id) REFERENCES categories(categories_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS event_registrations (
users_id INT,
events_id INT,
registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
PRIMARY KEY (users_id, events_id),
FOREIGN KEY (users_id) REFERENCES users(users_id) ON DELETE CASCADE,
FOREIGN KEY (events_id) REFERENCES events(events_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS bookings (
bookings_id INT AUTO_INCREMENT PRIMARY KEY,
users_id INT,
events_id INT,
payment_status VARCHAR(255),
transaction_id VARCHAR(255),
status ENUM('confirmed', 'cancelled', 'pending') DEFAULT 'pending',
booking_date DATETIME DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (users_id) REFERENCES users(users_id),
FOREIGN KEY (events_id) REFERENCES events(events_id)
);

CREATE TABLE IF NOT EXISTS audit_logs (
log_id INT AUTO_INCREMENT PRIMARY KEY,
user_id INT,
action VARCHAR(255),
timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (user_id) REFERENCES users(users_id)
);