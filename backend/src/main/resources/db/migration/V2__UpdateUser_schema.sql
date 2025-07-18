-- V2__Update_User_Schema.sql
-- Renames the username column to email and adds first and last name columns.

-- Add new columns for first and last name
ALTER TABLE users ADD COLUMN first_name VARCHAR(255) NOT NULL;
ALTER TABLE users ADD COLUMN last_name VARCHAR(255) NOT NULL;

-- Rename the username column to email for clarity and standard practice
ALTER TABLE users RENAME COLUMN username TO email;