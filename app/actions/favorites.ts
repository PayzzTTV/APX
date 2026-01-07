'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Ajouter une voiture aux favoris
 */
export async function addFavorite(carId: string) {
  const supabase = await createClient()

  // Vérifier l'authentification
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Non authentifié' }
  }

  // Ajouter le favori
  const { error } = await supabase.from('favorites').insert({
    user_id: user.id,
    car_id: carId,
  })

  if (error) {
    // Si l'erreur est une violation de contrainte unique, c'est déjà en favori
    if (error.code === '23505') {
      return { error: 'Cette voiture est déjà dans vos favoris' }
    }
    return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/favorites')
  return { success: true }
}

/**
 * Retirer une voiture des favoris
 */
export async function removeFavorite(carId: string) {
  const supabase = await createClient()

  // Vérifier l'authentification
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Non authentifié' }
  }

  // Supprimer le favori
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', user.id)
    .eq('car_id', carId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/favorites')
  return { success: true }
}

/**
 * Vérifier si une voiture est en favori
 */
export async function isFavorite(carId: string): Promise<boolean> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return false
  }

  const { data } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', user.id)
    .eq('car_id', carId)
    .single()

  return !!data
}

/**
 * Obtenir tous les favoris d'un utilisateur avec les détails des voitures
 */
export async function getUserFavorites() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: 'Non authentifié' }
  }

  const { data, error } = await supabase
    .from('favorites')
    .select(
      `
      id,
      created_at,
      cars (
        id,
        name,
        brand,
        model,
        year,
        image_url,
        rating,
        category,
        description,
        is_available
      )
    `
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return { data: null, error: error.message }
  }

  return { data, error: null }
}
