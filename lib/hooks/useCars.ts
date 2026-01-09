'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Car } from '@/lib/types/database.types'

// Clés de cache
export const carKeys = {
  all: ['cars'] as const,
  lists: () => [...carKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...carKeys.lists(), filters] as const,
  details: () => [...carKeys.all, 'detail'] as const,
  detail: (id: string) => [...carKeys.details(), id] as const,
}

// Fetch toutes les voitures
async function fetchCars(): Promise<Car[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .order('rating', { ascending: false })

  if (error) throw error
  return data || []
}

// Fetch une voiture par ID
async function fetchCarById(id: string): Promise<Car | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

// Hook pour récupérer toutes les voitures
export function useCars() {
  return useQuery({
    queryKey: carKeys.lists(),
    queryFn: fetchCars,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook pour récupérer une voiture par ID
export function useCar(id: string) {
  return useQuery({
    queryKey: carKeys.detail(id),
    queryFn: () => fetchCarById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

// Hook pour précharger une voiture (utile pour le hover)
export function usePrefetchCar() {
  const queryClient = useQueryClient()

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: carKeys.detail(id),
      queryFn: () => fetchCarById(id),
      staleTime: 5 * 60 * 1000,
    })
  }
}
