-- V1__Initial_schema.sql
-- This schema establishes the foundational tables for the ClearCart application.

-- Stores user account information.
CREATE TABLE users (
                       id SERIAL PRIMARY KEY,
                       username VARCHAR(255) UNIQUE NOT NULL,
                       password VARCHAR(255) NOT NULL,
                       created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Stores all products listed by users.
CREATE TABLE products (
                          id SERIAL PRIMARY KEY,
                          name VARCHAR(255) NOT NULL,
                          description TEXT,
                          owner_id INTEGER NOT NULL REFERENCES users(id),
                          status VARCHAR(50) NOT NULL DEFAULT 'AVAILABLE', -- Can be 'AVAILABLE' or 'SOLD'. Renting status is handled in transactions.
                          price_for_rent DECIMAL(10, 2) NOT NULL,
                          price_for_sale DECIMAL(10, 2) NOT NULL,
                          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                          updated_at TIMESTAMPTZ
);

-- A static lookup table for product categories.
CREATE TABLE categories (
                            id SERIAL PRIMARY KEY,
                            name VARCHAR(255) UNIQUE NOT NULL -- 'ELECTRONICS', 'FURNITURE', etc.
);

-- The join table linking products and categories in a many-to-many relationship.
CREATE TABLE product_categories (
                                    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
                                    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
                                    PRIMARY KEY (product_id, category_id) -- Ensures a product can't be in the same category twice.
);

-- The immutable ledger for all rental and sale events.
CREATE TABLE transactions (
                              id SERIAL PRIMARY KEY,
                              product_id INTEGER NOT NULL REFERENCES products(id),
                              actor_id INTEGER NOT NULL REFERENCES users(id), -- The user who rents or buys
                              owner_id INTEGER NOT NULL REFERENCES users(id), -- The owner of the product at the time of transaction
                              type VARCHAR(50) NOT NULL, -- 'RENTAL' or 'SALE'
                              rent_start_date DATE, -- NULLABLE, only for RENTAL
                              rent_end_date DATE, -- NULLABLE, only for RENTAL
                              total_price DECIMAL(10, 2) NOT NULL,
                              created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Pre-populating the categories table as part of our initial setup.
INSERT INTO categories (name) VALUES
                                  ('ELECTRONICS'),
                                  ('FURNITURE'),
                                  ('HOME APPLIANCES'),
                                  ('SPORTING GOODS'),
                                  ('OUTDOOR'),
                                  ('TOYS');
