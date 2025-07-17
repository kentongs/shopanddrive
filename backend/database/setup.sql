-- Shop and Drive Database Setup
-- Run this script in cPanel phpMyAdmin

-- Create database (optional, biasanya sudah dibuat di cPanel)
-- CREATE DATABASE shopanddrive_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE shopanddrive_db;

-- Promos table
CREATE TABLE promos (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    discount VARCHAR(100),
    valid_until DATE,
    status ENUM('active', 'expired', 'scheduled') DEFAULT 'active',
    image VARCHAR(255),
    original_price VARCHAR(100),
    discount_price VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Articles table
CREATE TABLE articles (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT,
    content LONGTEXT,
    date VARCHAR(50),
    author VARCHAR(100),
    category VARCHAR(100),
    read_time VARCHAR(50),
    image VARCHAR(255),
    status ENUM('published', 'draft', 'archived') DEFAULT 'published',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    price VARCHAR(100),
    original_price VARCHAR(100),
    rating DECIMAL(2,1) DEFAULT 0,
    reviews INT DEFAULT 0,
    image VARCHAR(255),
    description TEXT,
    in_stock BOOLEAN DEFAULT TRUE,
    is_promo BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Sponsors table
CREATE TABLE sponsors (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo VARCHAR(255),
    category VARCHAR(100),
    website VARCHAR(255),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Comments table
CREATE TABLE comments (
    id VARCHAR(50) PRIMARY KEY,
    content_id VARCHAR(50),
    content_type ENUM('article', 'promo', 'product'),
    author_name VARCHAR(255),
    author_email VARCHAR(255),
    author_avatar VARCHAR(255),
    is_google_auth BOOLEAN DEFAULT FALSE,
    google_user_id VARCHAR(255),
    content TEXT NOT NULL,
    parent_id VARCHAR(50) NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Settings table
CREATE TABLE settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    site_name VARCHAR(255),
    site_description TEXT,
    logo VARCHAR(255),
    contact_phone VARCHAR(50),
    contact_email VARCHAR(255),
    address TEXT,
    social_whatsapp VARCHAR(50),
    social_facebook VARCHAR(255),
    social_instagram VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO promos (id, title, description, discount, valid_until, status, image, original_price, discount_price) VALUES
('promo1', 'Promo Oli Mobil Premium', 'Dapatkan diskon 30% untuk semua jenis oli mobil premium', '30%', '2024-12-31', 'active', '/placeholder.svg', 'Rp 120.000', 'Rp 84.000'),
('promo2', 'Paket Service Lengkap', 'Service lengkap + ganti oli hanya 299rb', 'Hemat 100rb', '2025-01-15', 'active', '/placeholder.svg', 'Rp 399.000', 'Rp 299.000'),
('promo3', 'Ban Mobil Berkualitas', 'Beli 4 ban gratis pemasangan dan balancing', 'Gratis Pasang', '2025-02-28', 'scheduled', '/placeholder.svg', '', 'Rp 2.500.000');

INSERT INTO articles (id, title, excerpt, content, date, author, category, read_time, image, status) VALUES
('article1', 'Tips Merawat Mesin Mobil di Musim Hujan', 'Musim hujan memerlukan perawatan khusus untuk menjaga performa mesin tetap optimal...', 'Musim hujan memerlukan perawatan khusus untuk menjaga performa mesin tetap optimal. Berikut tips lengkap untuk merawat mesin mobil Anda di musim hujan...', '15 Desember 2024', 'Ahmad Wijaya', 'Tips Perawatan', '5 menit', '/placeholder.svg', 'published'),
('article2', '5 Tanda Oli Mobil Harus Diganti', 'Mengenali tanda-tanda oli yang sudah tidak layak pakai adalah kunci perawatan mesin...', 'Mengenali tanda-tanda oli yang sudah tidak layak pakai adalah kunci perawatan mesin yang baik...', '12 Desember 2024', 'Sari Indah', 'Tips Perawatan', '3 menit', '/placeholder.svg', 'published');

INSERT INTO products (id, name, category, price, rating, reviews, image, description, in_stock, is_promo) VALUES
('product1', 'Oli Mesin Castrol GTX', 'Oli & Pelumas', 'Rp 85.000', 4.8, 124, '/placeholder.svg', 'Oli mesin berkualitas tinggi untuk performa optimal', TRUE, TRUE),
('product2', 'Ban Michelin Primacy 4', 'Ban & Velg', 'Rp 1.250.000', 4.9, 87, '/placeholder.svg', 'Ban premium dengan teknologi terdepan', TRUE, FALSE);

INSERT INTO sponsors (id, name, logo, category, website, description, is_active, order_index) VALUES
('sponsor1', 'Castrol', 'https://via.placeholder.com/120x60/FF4500/FFFFFF?text=CASTROL', 'Oil Partner', 'https://castrol.com', 'Premium motor oil and lubricants', TRUE, 1),
('sponsor2', 'Michelin', 'https://via.placeholder.com/120x60/0033A0/FFFFFF?text=MICHELIN', 'Tire Partner', 'https://michelin.com', 'World-leading tire manufacturer', TRUE, 2),
('sponsor3', 'Bosch', 'https://via.placeholder.com/120x60/E30613/FFFFFF?text=BOSCH', 'Parts Partner', 'https://bosch.com', 'Automotive parts and technology', TRUE, 3),
('sponsor4', 'Shell', 'https://via.placeholder.com/120x60/FFD700/000000?text=SHELL', 'Oil Partner', 'https://shell.com', 'Global energy and petrochemicals company', TRUE, 4),
('sponsor5', 'Pirelli', 'https://via.placeholder.com/120x60/FFED00/000000?text=PIRELLI', 'Tire Partner', 'https://pirelli.com', 'Premium tire manufacturer', TRUE, 5),
('sponsor6', 'NGK', 'https://via.placeholder.com/120x60/1E3A8A/FFFFFF?text=NGK', 'Parts Partner', 'https://ngk.com', 'Spark plugs and automotive components', TRUE, 6),
('sponsor7', 'Total', 'https://via.placeholder.com/120x60/DC2626/FFFFFF?text=TOTAL', 'Oil Partner', 'https://total.com', 'Multi-energy company', TRUE, 7),
('sponsor8', 'Continental', 'https://via.placeholder.com/120x60/0F172A/FFFFFF?text=CONTINENTAL', 'Tire Partner', 'https://continental.com', 'Technology company for automotive industry', TRUE, 8);

INSERT INTO settings (site_name, site_description, logo, contact_phone, contact_email, address, social_whatsapp) VALUES
('Shop and Drive Taman Tekno', 'Solusi terpercaya untuk kebutuhan otomotif Anda', '/placeholder.svg', '08995555095', 'info@shopanddrive.com', 'Jl. Rawa Buntu Raya No. 61 A, Ciater, Tangerang Selatan', '628995555095');
