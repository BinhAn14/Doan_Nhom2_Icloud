CREATE DATABASE IF NOT EXISTS products_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE products_db;

CREATE TABLE IF NOT EXISTS products (
  product_id INT AUTO_INCREMENT PRIMARY KEY,
  product_name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) DEFAULT 0,
  stock INT DEFAULT 0,
  category_id INT DEFAULT NULL,
  image_url VARCHAR(1000),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- sample data
INSERT INTO products (product_name, description, price, stock, category_id, image_url)
VALUES
('Giày thể thao A', 'Giày chạy bộ size 42', 750000.00, 12, 1, ''),
('Áo thun B', 'Áo cotton unisex', 199000.00, 30, 2, ''),
('Quần short C', 'Quần ngắn thể thao', 249000.00, 20, 2, '');
