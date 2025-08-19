-- Create hotel profile table
CREATE TABLE public.hotel_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create categories table for menu organization
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create products table (food/drinks/services)
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create room types table
CREATE TABLE public.room_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  base_price DECIMAL(10,2) NOT NULL,
  max_occupancy INTEGER DEFAULT 2,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create rooms table
CREATE TABLE public.rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_type_id UUID REFERENCES public.room_types(id) ON DELETE CASCADE,
  room_number TEXT NOT NULL UNIQUE,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  payment_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create order items table
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'confirmed',
  payment_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create admin users table
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.hotel_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to hotel profile, categories, products, and room types
CREATE POLICY "Public can view hotel profile" ON public.hotel_profile FOR SELECT USING (true);
CREATE POLICY "Public can view categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public can view available products" ON public.products FOR SELECT USING (is_available = true);
CREATE POLICY "Public can view room types" ON public.room_types FOR SELECT USING (true);
CREATE POLICY "Public can view available rooms" ON public.rooms FOR SELECT USING (is_available = true);

-- Create policies for orders and bookings (customers can create their own)
CREATE POLICY "Anyone can create orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can create order items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can create bookings" ON public.bookings FOR INSERT WITH CHECK (true);

-- Admin policies (will be updated when auth is implemented)
CREATE POLICY "Admins can manage all data" ON public.hotel_profile FOR ALL USING (true);
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL USING (true);
CREATE POLICY "Admins can manage products" ON public.products FOR ALL USING (true);
CREATE POLICY "Admins can manage room types" ON public.room_types FOR ALL USING (true);
CREATE POLICY "Admins can manage rooms" ON public.rooms FOR ALL USING (true);
CREATE POLICY "Admins can view orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Admins can view order items" ON public.order_items FOR SELECT USING (true);
CREATE POLICY "Admins can view bookings" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "Admins can manage admin users" ON public.admin_users FOR ALL USING (true);

-- Create update timestamp trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_hotel_profile_updated_at
  BEFORE UPDATE ON public.hotel_profile
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default hotel profile
INSERT INTO public.hotel_profile (name, description) 
VALUES ('Your Hotel Name', 'Welcome to our luxury hotel experience.');

-- Insert sample categories
INSERT INTO public.categories (name, description, display_order) VALUES
('Starters', 'Appetizers and light bites', 1),
('Main Course', 'Full meals and entrees', 2),
('Beverages', 'Drinks and refreshments', 3),
('Desserts', 'Sweet treats and desserts', 4);

-- Insert sample room types
INSERT INTO public.room_types (name, description, base_price, max_occupancy) VALUES
('Standard Single', 'Comfortable single room with modern amenities', 99.00, 1),
('Deluxe Double', 'Spacious double room with premium features', 149.00, 2),
('Executive Suite', 'Luxury suite with separate living area', 299.00, 4);

-- Insert sample rooms
INSERT INTO public.rooms (room_type_id, room_number) VALUES
((SELECT id FROM public.room_types WHERE name = 'Standard Single'), '101'),
((SELECT id FROM public.room_types WHERE name = 'Standard Single'), '102'),
((SELECT id FROM public.room_types WHERE name = 'Deluxe Double'), '201'),
((SELECT id FROM public.room_types WHERE name = 'Deluxe Double'), '202'),
((SELECT id FROM public.room_types WHERE name = 'Executive Suite'), '301');