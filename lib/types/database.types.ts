export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          role: 'customer' | 'admin'
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          role?: 'customer' | 'admin'
          avatar_url?: string | null
        }
        Update: {
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
        }
      }
      cars: {
        Row: {
          id: string
          name: string
          brand: string
          model: string
          image_url: string | null
          images: string[] | null
          price_per_day: number
          rating: number
          description: string | null
          created_at: string
        }
        Insert: {
          name: string
          brand: string
          model: string
          image_url?: string | null
          images?: string[] | null
          price_per_day: number
          rating?: number
          description?: string | null
        }
        Update: {
          name?: string
          brand?: string
          model?: string
          image_url?: string | null
          images?: string[] | null
          price_per_day?: number
          rating?: number
          description?: string | null
        }
      }
      bookings: {
        Row: {
          id: string
          user_id: string
          car_id: string
          start_date: string
          end_date: string
          status: 'pending' | 'confirmed' | 'cancelled'
          total_price: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          car_id: string
          start_date: string
          end_date: string
          status?: 'pending' | 'confirmed' | 'cancelled'
          total_price?: number | null
        }
        Update: {
          status?: 'pending' | 'confirmed' | 'cancelled'
          total_price?: number | null
        }
      }
    }
  }
}

export type Car = Database['public']['Tables']['cars']['Row']
export type Booking = Database['public']['Tables']['bookings']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
