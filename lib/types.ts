export type UserRole = 'vendor' | 'shop' | 'homemaker' | 'customer';

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface Shop {
  id: string;
  user_id: string;
  shop_name: string;
  description: string | null;
  address: string;
  location: any; // PostGIS geography point
  phone: string;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  seller_id: string;
  seller_type: UserRole;
  shop_id: string | null;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_urls: string[];
  stock_quantity: number | null;
  location: any; // PostGIS geography point
  is_active: boolean;
  created_at: string;
  updated_at: string;
  distance_km?: number; // Added by nearby products function
}

export interface DeliveryOption {
  id: string;
  product_id: string;
  homemaker_id: string;
  max_distance_km: number;
  delivery_fee: number;
  estimated_time_minutes: number;
  created_at: string;
}

export interface Order {
  id: string;
  customer_id: string;
  product_id: string;
  seller_id: string;
  quantity: number;
  total_price: number;
  delivery_address: string | null;
  delivery_location: any;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Visit {
  id: string;
  visitor_id: string | null;
  visited_type: 'shop' | 'product';
  visited_id: string;
  created_at: string;
}
