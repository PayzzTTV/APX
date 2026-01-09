'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Car } from '@/lib/types/database.types'

// Clés de cache
export const favoriteKeys = {
  all: ['favorites'] as const,
  lists: () => [...favoriteKeys.all, 'list'] as const,
  check: (carId: string) => [...favoriteKeys.all, 'check', carId] as const,
}

// Fetch les favoris de l'utilisateur
async function fetchUserFavorites(): Promise<Car[]> {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('favorites')
    .select(`
      car_id,
      cars (*)
    `)
    .eq('user_id', user.id)

  if (error) throw error

  // Extraire les voitures des favoris
  return data?.map((fav: any) => fav.cars).filter(Boolean) || []
}

// Vérifier si une voiture est en favori
async function checkIsFavorite(carId: string): Promise<boolean> {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data, error } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', user.id)
    .eq('car_id', carId)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return !!data
}

// Ajouter aux favoris
async function addToFavorites(carId: string) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non connecté')

  const { error } = await supabase
    .from('favorites')
    .insert({ user_id: user.id, car_id: carId })

  if (error) throw error
}

// Retirer des favoris
async function removeFromFavorites(carId: string) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non connecté')

  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', user.id)
    .eq('car_id', carId)

  if (error) throw error
}

// Hook pour récupérer les favoris
export function useFavorites() {
  return useQuery({
    queryKey: favoriteKeys.lists(),
    queryFn: fetchUserFavorites,
    staleTime: 5 * 60 * 1000,
  })
}

// Hook pour vérifier si une voiture est en favori
export function useIsFavorite(carId: string) {
  return useQuery({
    queryKey: favoriteKeys.check(carId),
    queryFn: () => checkIsFavorite(carId),
    enabled: !!carId,
    staleTime: 5 * 60 * 1000,
  })
}

// Hook pour ajouter/retirer des favoris
export function useToggleFavorite() {
  const queryClient = useQueryClient()

  const addMutation = useMutation({
    mutationFn: addToFavorites,
    onSuccess: (_, carId) => {
      // Mettre à jour le cache
      queryClient.setQueryData(favoriteKeys.check(carId), true)
      queryClient.invalidateQueries({ queryKey: favoriteKeys.lists() })
    },
  })

  const removeMutation = useMutation({
    mutationFn: removeFromFavorites,
    onSuccess: (_, carId) => {
      // Mettre à jour le cache
      queryClient.setQueryData(favoriteKeys.check(carId), false)
      queryClient.invalidateQueries({ queryKey: favoriteKeys.lists() })
    },
  })

  return {
    add: addMutation.mutate,
    remove: removeMutation.mutate,
    isLoading: addMutation.isPending || removeMutation.isPending,
  }
}
