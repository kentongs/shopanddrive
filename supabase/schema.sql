-- Shop and Drive Database Schema for Supabase
-- Run this in Supabase SQL Editor

-- Enable Row Level Security (RLS)
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

-- Create tables
CREATE TABLE IF NOT EXISTS promos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    discount VARCHAR(100),
    valid_until DATE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'scheduled')),
    image VARCHAR(255),
    original_price VARCHAR(100),
    discount_price VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    excerpt TEXT,
    content TEXT,
    date VARCHAR(50),
    author VARCHAR(100),
    category VARCHAR(100),
    read_time VARCHAR(50),
    image VARCHAR(255),
    status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    price VARCHAR(100),
    original_price VARCHAR(100),
    rating DECIMAL(2,1) DEFAULT 0,
    reviews INTEGER DEFAULT 0,
    image VARCHAR(255),
    description TEXT,
    in_stock BOOLEAN DEFAULT TRUE,
    is_promo BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sponsors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    logo VARCHAR(255),
    category VARCHAR(100),
    website VARCHAR(255),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID,
    content_type VARCHAR(20) CHECK (content_type IN ('article', 'promo', 'product')),
    author_name VARCHAR(255),
    author_email VARCHAR(255),
    author_avatar VARCHAR(255),
    is_google_auth BOOLEAN DEFAULT FALSE,
    google_user_id VARCHAR(255),
    content TEXT NOT NULL,
    parent_id UUID REFERENCES comments(id),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS settings (
    id SERIAL PRIMARY KEY,
    site_name VARCHAR(255),
    site_description TEXT,
    logo VARCHAR(255),
    contact_phone VARCHAR(50),
    contact_email VARCHAR(255),
    address TEXT,
    social_whatsapp VARCHAR(50),
    social_facebook VARCHAR(255),
    social_instagram VARCHAR(255),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_promos_status ON promos(status);
CREATE INDEX IF NOT EXISTS idx_promos_created_at ON promos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products(in_stock);
CREATE INDEX IF NOT EXISTS idx_sponsors_active ON sponsors(is_active);
CREATE INDEX IF NOT EXISTS idx_sponsors_order ON sponsors(order_index);
CREATE INDEX IF NOT EXISTS idx_comments_content ON comments(content_id, content_type);
CREATE INDEX IF NOT EXISTS idx_comments_status ON comments(status);

-- Enable Row Level Security
ALTER TABLE promos ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public read access
CREATE POLICY "Public can read active promos" ON promos FOR SELECT USING (status = 'active');
CREATE POLICY "Public can read published articles" ON articles FOR SELECT USING (status = 'published');
CREATE POLICY "Public can read available products" ON products FOR SELECT USING (in_stock = true);
CREATE POLICY "Public can read active sponsors" ON sponsors FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read approved comments" ON comments FOR SELECT USING (status = 'approved');
CREATE POLICY "Public can read settings" ON settings FOR SELECT USING (true);

-- Admin policies (will be configured with API key)
CREATE POLICY "Service role can manage promos" ON promos FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role can manage articles" ON articles FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role can manage products" ON products FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role can manage sponsors" ON sponsors FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role can manage comments" ON comments FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role can manage settings" ON settings FOR ALL USING (auth.role() = 'service_role');

-- Insert sample data
INSERT INTO promos (title, description, discount, valid_until, status, image, original_price, discount_price) VALUES
('Promo Oli Mobil Premium', 'Dapatkan diskon 30% untuk semua jenis oli mobil premium', '30%', '2024-12-31', 'active', 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400', 'Rp 120.000', 'Rp 84.000'),
('Paket Service Lengkap', 'Service lengkap + ganti oli hanya 299rb', 'Hemat 100rb', '2025-01-15', 'active', 'https://images.unsplash.com/photo-1493238792000-8113da705763?w=400', 'Rp 399.000', 'Rp 299.000'),
('Ban Mobil Berkualitas', 'Beli 4 ban gratis pemasangan dan balancing', 'Gratis Pasang', '2025-02-28', 'active', 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400', '', 'Rp 2.500.000');

INSERT INTO articles (title, excerpt, content, date, author, category, read_time, image, status) VALUES
('Tips Merawat Mesin Mobil di Musim Hujan', 'Musim hujan memerlukan perawatan khusus untuk menjaga performa mesin tetap optimal...', 'Musim hujan memerlukan perawatan khusus untuk menjaga performa mesin tetap optimal. Berikut tips lengkap untuk merawat mesin mobil Anda di musim hujan: 1. Periksa sistem pengapian secara rutin, 2. Ganti filter udara yang kotor, 3. Pastikan sistem pembuangan berfungsi dengan baik, 4. Periksa kondisi oli mesin, 5. Bersihkan komponen mesin dari kotoran dan karat.', '15 Desember 2024', 'Ahmad Wijaya', 'Tips Perawatan', '5 menit', 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400', 'published'),
('5 Tanda Oli Mobil Harus Diganti', 'Mengenali tanda-tanda oli yang sudah tidak layak pakai adalah kunci perawatan mesin...', 'Mengenali tanda-tanda oli yang sudah tidak layak pakai adalah kunci perawatan mesin yang baik. Berikut 5 tanda oli mobil harus diganti: 1. Warna oli sudah hitam pekat, 2. Tekstur oli menjadi kental, 3. Level oli berkurang drastis, 4. Mesin mengeluarkan suara kasar, 5. Indikator oli menyala di dashboard.', '12 Desember 2024', 'Sari Indah', 'Tips Perawatan', '3 menit', 'https://images.unsplash.com/photo-1485463611174-f302f6a5c1c9?w=400', 'published');

INSERT INTO products (name, category, price, rating, reviews, image, description, in_stock, is_promo) VALUES
('Oli Mesin Castrol GTX', 'Oli & Pelumas', 'Rp 85.000', 4.8, 124, 'https://images.unsplash.com/photo-1485463611174-f302f6a5c1c9?w=400', 'Oli mesin berkualitas tinggi untuk performa optimal dengan teknologi advanced protection', TRUE, TRUE),
('Ban Michelin Primacy 4', 'Ban & Velg', 'Rp 1.250.000', 4.9, 87, 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400', 'Ban premium dengan teknologi terdepan untuk keamanan dan kenyamanan berkendara', TRUE, FALSE);

INSERT INTO sponsors (name, logo, category, website, description, is_active, order_index) VALUES
('Castrol', 'https://logos-world.net/wp-content/uploads/2020/11/Castrol-Logo.png', 'Oil Partner', 'https://castrol.com', 'Premium motor oil and lubricants for automotive excellence', TRUE, 1),
('Michelin', 'https://logos-world.net/wp-content/uploads/2021/02/Michelin-Logo.png', 'Tire Partner', 'https://michelin.com', 'World-leading tire manufacturer with innovative technology', TRUE, 2),
('Bosch', 'https://logos-world.net/wp-content/uploads/2020/08/Bosch-Logo.png', 'Parts Partner', 'https://bosch.com', 'Automotive parts and technology solutions', TRUE, 3),
('Shell', 'https://logos-world.net/wp-content/uploads/2020/04/Shell-Logo.png', 'Oil Partner', 'https://shell.com', 'Global energy and petrochemicals company', TRUE, 4);

INSERT INTO settings (site_name, site_description, logo, contact_phone, contact_email, address, social_whatsapp) VALUES
('Shop and Drive Taman Tekno', 'Solusi terpercaya untuk kebutuhan otomotif Anda', 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=100', '08995555095', 'info@shopanddrive.com', 'Jl. Rawa Buntu Raya No. 61 A, Ciater, Tangerang Selatan', '628995555095');

-- Update functions for automatic updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_promos_updated_at BEFORE UPDATE ON promos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sponsors_updated_at BEFORE UPDATE ON sponsors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
