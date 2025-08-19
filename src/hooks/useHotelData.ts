import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface HotelProfile {
  id: string;
  name: string;
  description: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  display_order: number;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  is_available: boolean;
}

export interface RoomType {
  id: string;
  name: string;
  description: string;
  base_price: number;
  max_occupancy: number;
}

export interface Room {
  id: string;
  room_type_id: string;
  room_number: string;
  is_available: boolean;
  room_types?: RoomType;
}

export const useHotelData = () => {
  const [hotelProfile, setHotelProfile] = useState<HotelProfile | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHotelData();
  }, []);

  const fetchHotelData = async () => {
    try {
      setLoading(true);
      
      // Fetch hotel profile
      const { data: hotelData } = await supabase
        .from('hotel_profile')
        .select('*')
        .single();
      
      if (hotelData) setHotelProfile(hotelData);

      // Fetch categories
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .order('display_order');
      
      if (categoriesData) setCategories(categoriesData);

      // Fetch products
      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .eq('is_available', true);
      
      if (productsData) setProducts(productsData);

      // Fetch room types
      const { data: roomTypesData } = await supabase
        .from('room_types')
        .select('*');
      
      if (roomTypesData) setRoomTypes(roomTypesData);

      // Fetch rooms with room type info
      const { data: roomsData } = await supabase
        .from('rooms')
        .select(`
          *,
          room_types (*)
        `)
        .eq('is_available', true);
      
      if (roomsData) setRooms(roomsData);

    } catch (error) {
      console.error('Error fetching hotel data:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    hotelProfile,
    categories,
    products,
    roomTypes,
    rooms,
    loading,
    refetch: fetchHotelData
  };
};