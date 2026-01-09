'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

// Clés de cache
export const bookingKeys = {
  all: ['bookings'] as const,
  lists: () => [...bookingKeys.all, 'list'] as const,
  userBookings: (userId: string) => [...bookingKeys.lists(), userId] as const,
  carBookings: (carId: string) => [...bookingKeys.all, 'car', carId] as const,
  detail: (id: string) => [...bookingKeys.all, 'detail', id] as const,
}

// Types
interface Booking {
  id: string
  user_id: string
  car_id: string
  start_date: string
  end_date: string
  status: string
  total_price: number
  created_at: string
  cars: {
    id: string
    name: string
    brand: string
    model: string
    image_url: string
    price_per_day: number
  }
}

// Fetch réservations de l'utilisateur connecté
async function fetchUserBookings(): Promise<Booking[]> {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      cars (id, name, brand, model, image_url, price_per_day)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

// Fetch réservations pour une voiture (pour vérifier disponibilité)
async function fetchCarBookings(carId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('bookings')
    .select('start_date, end_date')
    .eq('car_id', carId)
    .in('status', ['pending', 'confirmed'])

  if (error) throw error
  return data || []
}

// Hook pour récupérer les réservations de l'utilisateur
export function useUserBookings() {
  return useQuery({
    queryKey: bookingKeys.lists(),
    queryFn: fetchUserBookings,
    staleTime: 2 * 60 * 1000, // 2 minutes (plus court car les réservations changent plus souvent)
  })
}

// Hook pour récupérer les réservations d'une voiture
export function useCarBookings(carId: string) {
  return useQuery({
    queryKey: bookingKeys.carBookings(carId),
    queryFn: () => fetchCarBookings(carId),
    enabled: !!carId,
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

// Hook pour invalider le cache des réservations
export function useInvalidateBookings() {
  const queryClient = useQueryClient()

  return () => {
    queryClient.invalidateQueries({ queryKey: bookingKeys.all })
  }
}
