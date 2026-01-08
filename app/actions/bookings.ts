'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createBooking(
  carId: string,
  startDate: string,
  endDate: string
) {
  const supabase = await createClient()

  // Récupérer l'utilisateur connecté
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Non authentifié' }
  }

  // Vérifier les chevauchements avec d'autres réservations
  const { data: overlappingBookings, error: overlapError } = await supabase
    .from('bookings')
    .select('id')
    .eq('car_id', carId)
    .in('status', ['pending', 'confirmed'])
    .or(`and(start_date.lte.${endDate},end_date.gte.${startDate})`)

  if (overlapError) {
    return { error: 'Erreur lors de la vérification des disponibilités' }
  }

  if (overlappingBookings && overlappingBookings.length > 0) {
    return { error: 'Ces dates ne sont pas disponibles pour cette voiture' }
  }

  // Créer la réservation
  const { data: booking, error: insertError } = await supabase
    .from('bookings')
    .insert({
      user_id: user.id,
      car_id: carId,
      start_date: startDate,
      end_date: endDate,
      status: 'pending',
      total_price: 0, // Pas de prix dans le modèle abonnement
    })
    .select()
    .single()

  if (insertError || !booking) {
    return { error: insertError?.message || 'Erreur lors de la création de la réservation' }
  }

  revalidatePath('/bookings')
  return { success: true, bookingId: booking.id }
}
