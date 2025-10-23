-- Enable PostGIS extension for location features
CREATE EXTENSION IF NOT EXISTS postgis;

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL CHECK (role IN ('vendor', 'shop', 'homemaker', 'customer')),
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shops table
CREATE TABLE shops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    shop_name TEXT NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    location GEOGRAPHY(POINT) NOT NULL,
    phone TEXT NOT NULL,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    seller_type TEXT NOT NULL CHECK (seller_type IN ('vendor', 'shop', 'homemaker')),
    shop_id UUID REFERENCES shops(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    category TEXT NOT NULL,
    image_urls TEXT[] DEFAULT '{}',
    stock_quantity INTEGER,
    location GEOGRAPHY(POINT) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Delivery options (for homemakers)
CREATE TABLE delivery_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    homemaker_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    max_distance_km DECIMAL(5, 2) NOT NULL CHECK (max_distance_km > 0),
    delivery_fee DECIMAL(10, 2) NOT NULL CHECK (delivery_fee >= 0),
    estimated_time_minutes INTEGER NOT NULL CHECK (estimated_time_minutes > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(product_id)
);

-- Orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    total_price DECIMAL(10, 2) NOT NULL CHECK (total_price >= 0),
    delivery_address TEXT,
    delivery_location GEOGRAPHY(POINT),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Visits tracking table (for analytics)
CREATE TABLE visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visitor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    visited_type TEXT NOT NULL CHECK (visited_type IN ('shop', 'product')),
    visited_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_products_seller ON products(seller_id);
CREATE INDEX idx_products_shop ON products(shop_id);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_location ON products USING GIST(location);
CREATE INDEX idx_shops_location ON shops USING GIST(location);
CREATE INDEX idx_shops_user ON shops(user_id);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_seller ON orders(seller_id);
CREATE INDEX idx_orders_product ON orders(product_id);
CREATE INDEX idx_visits_visited ON visits(visited_type, visited_id);

-- Function to get nearby products within a specified distance
CREATE OR REPLACE FUNCTION get_nearby_products(
    user_lat DOUBLE PRECISION,
    user_lon DOUBLE PRECISION,
    max_distance_km DOUBLE PRECISION DEFAULT 10
)
RETURNS TABLE (
    id UUID,
    seller_id UUID,
    seller_type TEXT,
    shop_id UUID,
    name TEXT,
    description TEXT,
    price DECIMAL,
    category TEXT,
    image_urls TEXT[],
    stock_quantity INTEGER,
    location GEOGRAPHY,
    is_active BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    distance_km DOUBLE PRECISION
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.*,
        ST_Distance(
            p.location::geography,
            ST_SetSRID(ST_MakePoint(user_lon, user_lat), 4326)::geography
        ) / 1000 AS distance_km
    FROM products p
    WHERE p.is_active = TRUE
    AND ST_DWithin(
        p.location::geography,
        ST_SetSRID(ST_MakePoint(user_lon, user_lat), 4326)::geography,
        max_distance_km * 1000
    )
    ORDER BY distance_km ASC;
END;
$$ LANGUAGE plpgsql;

-- Function to get nearby shops
CREATE OR REPLACE FUNCTION get_nearby_shops(
    user_lat DOUBLE PRECISION,
    user_lon DOUBLE PRECISION,
    max_distance_km DOUBLE PRECISION DEFAULT 10
)
RETURNS TABLE (
    id UUID,
    user_id UUID,
    shop_name TEXT,
    description TEXT,
    address TEXT,
    location GEOGRAPHY,
    phone TEXT,
    image_url TEXT,
    is_active BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    distance_km DOUBLE PRECISION
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.*,
        ST_Distance(
            s.location::geography,
            ST_SetSRID(ST_MakePoint(user_lon, user_lat), 4326)::geography
        ) / 1000 AS distance_km
    FROM shops s
    WHERE s.is_active = TRUE
    AND ST_DWithin(
        s.location::geography,
        ST_SetSRID(ST_MakePoint(user_lon, user_lat), 4326)::geography,
        max_distance_km * 1000
    )
    ORDER BY distance_km ASC;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update trigger to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shops_updated_at BEFORE UPDATE ON shops
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view all profiles" ON users
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Shops policies
CREATE POLICY "Anyone can view active shops" ON shops
    FOR SELECT USING (is_active = true);

CREATE POLICY "Shop owners can manage their shop" ON shops
    FOR ALL USING (auth.uid() = user_id);

-- Products policies
CREATE POLICY "Anyone can view active products" ON products
    FOR SELECT USING (is_active = true);

CREATE POLICY "Sellers can manage their products" ON products
    FOR ALL USING (auth.uid() = seller_id);

-- Delivery options policies
CREATE POLICY "Anyone can view delivery options" ON delivery_options
    FOR SELECT USING (true);

CREATE POLICY "Homemakers can manage their delivery options" ON delivery_options
    FOR ALL USING (auth.uid() = homemaker_id);

-- Orders policies
CREATE POLICY "Customers can view their orders" ON orders
    FOR SELECT USING (auth.uid() = customer_id OR auth.uid() = seller_id);

CREATE POLICY "Customers can create orders" ON orders
    FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Sellers can update their orders" ON orders
    FOR UPDATE USING (auth.uid() = seller_id);

-- Visits policies
CREATE POLICY "Anyone can insert visits" ON visits
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view visits to their content" ON visits
    FOR SELECT USING (
        visited_type = 'shop' AND visited_id IN (SELECT id FROM shops WHERE user_id = auth.uid())
        OR
        visited_type = 'product' AND visited_id IN (SELECT id FROM products WHERE seller_id = auth.uid())
    );

-- Storage bucket for product images
-- Note: This needs to be created in Supabase dashboard or via API
-- Bucket name: 'product-images'
-- Public: true
-- File size limit: 5MB
-- Allowed MIME types: image/jpeg, image/png, image/webp

-- Storage policies (to be applied in Supabase dashboard)
-- 1. Allow authenticated users to upload: 
--    CREATE POLICY "Authenticated users can upload images" ON storage.objects
--    FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-images');
--
-- 2. Allow public read access:
--    CREATE POLICY "Public can view images" ON storage.objects
--    FOR SELECT TO public USING (bucket_id = 'product-images');
--
-- 3. Allow users to delete their own images:
--    CREATE POLICY "Users can delete own images" ON storage.objects
--    FOR DELETE TO authenticated USING (bucket_id = 'product-images' AND auth.uid() = owner);
