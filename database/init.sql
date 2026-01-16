-- Create database
CREATE DATABASE moon_cafe;

-- Use the database
\c moon_cafe;

-- Create gallery_images table
CREATE TABLE gallery_images (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100),
  image_url VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample gallery images
INSERT INTO gallery_images (title, image_url) VALUES 
('Cozy Café Interior', 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=800'),
('Delicious Coffee', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800'),
('Moonlit Ambiance', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800');

-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create menu_items table
CREATE TABLE menu_items (
  id SERIAL PRIMARY KEY,
  category VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample menu items
INSERT INTO menu_items (category, name, description, price, image_url) VALUES 
('Coffee', 'Espresso', 'Rich and bold espresso shot', 3.50, 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400'),
('Coffee', 'Cappuccino', 'Espresso with steamed milk and foam', 4.50, 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=400'),
('Beverages', 'Green Tea', 'Refreshing green tea', 3.00, 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e3?w=400'),
('Snacks', 'Croissant', 'Buttery and flaky croissant', 2.50, 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400'),
('Desserts', 'Chocolate Cake', 'Decadent chocolate cake', 5.00, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400');

-- Create contact_inquiries table
CREATE TABLE contact_inquiries (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample admin user (password: admin123)
INSERT INTO users (username, password_hash) VALUES ('admin', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');