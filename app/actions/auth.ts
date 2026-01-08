'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { sendWelcomeEmail, sendBookingCancellationEmail, sendBookingModificationEmail } from '@/lib/email'

export async function signUp(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('full_name') as string
  const phone = formData.get('phone') as string

  // Validation basique
  if (!email || !password) {
    return { error: 'Email et mot de passe requis' }
  }

  if (password.length < 6) {
    return { error: 'Le mot de passe doit contenir au moins 6 caractères' }
  }

  // Créer l'utilisateur avec Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone: phone,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  // Le profil est créé automatiquement par le trigger Supabase

  // Vérifier si l'utilisateur est bien créé et connecté
  if (!data.user) {
    return { error: 'Erreur lors de la création du compte' }
  }

  // Si l'email nécessite une confirmation, afficher un message
  if (data.user && !data.session) {
    return { error: 'Vérifiez votre email pour confirmer votre compte' }
  }

  // Envoyer l'email de bienvenue
  try {
    await sendWelcomeEmail({
      userName: fullName || email.split('@')[0],
      userEmail: email
    })
    console.log('✅ Email de bienvenue envoyé à', email)
  } catch (emailError) {
    console.error('❌ Erreur lors de l\'envoi de l\'email de bienvenue:', emailError)
    // Ne pas bloquer l'inscription si l'email échoue
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signIn(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Validation basique
  if (!email || !password) {
    return { error: 'Email et mot de passe requis' }
  }

  // Connexion avec Supabase Auth
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: 'Email ou mot de passe incorrect' }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()

  const fullName = formData.get('full_name') as string
  const phone = formData.get('phone') as string

  // Récupérer l'utilisateur connecté
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Non authentifié' }
  }

  // Mettre à jour le profil
  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: fullName,
      phone: phone,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/profile')
  return { success: true }
}

export async function cancelBooking(bookingId: string) {
  const supabase = await createClient()

  // Récupérer l'utilisateur connecté
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Non authentifié' }
  }

  // Récupérer les détails de la réservation avant l'annulation
  const { data: booking, error: fetchError } = await supabase
    .from('bookings')
    .select('*, cars(*), profiles(*)')
    .eq('id', bookingId)
    .eq('user_id', user.id)
    .single()

  if (fetchError || !booking) {
    return { error: 'Réservation introuvable' }
  }

  // Mettre à jour le statut de la réservation à 'cancelled'
  const { error } = await supabase
    .from('bookings')
    .update({
      status: 'cancelled',
      updated_at: new Date().toISOString(),
    })
    .eq('id', bookingId)
    .eq('user_id', user.id) // Sécurité : vérifier que c'est bien l'utilisateur qui annule

  if (error) {
    return { error: error.message }
  }

  // Envoyer l'email d'annulation
  try {
    await sendBookingCancellationEmail({
      userName: (booking as any).profiles.full_name || (booking as any).profiles.email.split('@')[0],
      userEmail: (booking as any).profiles.email,
      carName: (booking as any).cars.name,
      carImage: (booking as any).cars.image_url || '',
      startDate: format(new Date((booking as any).start_date), 'dd MMMM yyyy', { locale: fr }),
      endDate: format(new Date((booking as any).end_date), 'dd MMMM yyyy', { locale: fr }),
      bookingId: booking.id
    })
    console.log('✅ Email d\'annulation envoyé à', (booking as any).profiles.email)
  } catch (emailError) {
    console.error('❌ Erreur lors de l\'envoi de l\'email d\'annulation:', emailError)
    // Ne pas bloquer l'annulation si l'email échoue
  }

  revalidatePath('/bookings')
  return { success: true }
}

export async function updateBooking(
  bookingId: string,
  newStartDate: string,
  newEndDate: string
) {
  const supabase = await createClient()

  // Récupérer l'utilisateur connecté
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Non authentifié' }
  }

  // Récupérer la réservation actuelle
  const { data: currentBooking, error: fetchError } = await supabase
    .from('bookings')
    .select('*, cars(*)')
    .eq('id', bookingId)
    .eq('user_id', user.id)
    .single()

  if (fetchError || !currentBooking) {
    return { error: 'Réservation introuvable' }
  }

  // Vérifier que la réservation n'est pas déjà annulée
  if (currentBooking.status === 'cancelled') {
    return { error: 'Impossible de modifier une réservation annulée' }
  }

  // Vérifier que les nouvelles dates sont dans le futur
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const startDate = new Date(newStartDate)

  if (startDate < today) {
    return { error: 'La date de début doit être dans le futur' }
  }

  // Vérifier que end_date > start_date
  if (new Date(newEndDate) <= new Date(newStartDate)) {
    return { error: 'La date de fin doit être après la date de début' }
  }

  // Vérifier les chevauchements avec d'autres réservations (sauf la réservation actuelle)
  const { data: overlappingBookings, error: overlapError } = await supabase
    .from('bookings')
    .select('id')
    .eq('car_id', currentBooking.car_id)
    .neq('id', bookingId) // Exclure la réservation actuelle
    .in('status', ['pending', 'confirmed'])
    .or(`and(start_date.lte.${newEndDate},end_date.gte.${newStartDate})`)

  if (overlapError) {
    return { error: 'Erreur lors de la vérification des disponibilités' }
  }

  if (overlappingBookings && overlappingBookings.length > 0) {
    return { error: 'Ces dates ne sont pas disponibles pour cette voiture' }
  }

  // Récupérer le profil de l'utilisateur
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Mettre à jour la réservation
  const { error: updateError } = await supabase
    .from('bookings')
    .update({
      start_date: newStartDate,
      end_date: newEndDate,
      updated_at: new Date().toISOString(),
    })
    .eq('id', bookingId)
    .eq('user_id', user.id)

  if (updateError) {
    return { error: updateError.message }
  }

  // Envoyer l'email de modification
  if (profile) {
    try {
      await sendBookingModificationEmail({
        userName: profile.full_name || profile.email.split('@')[0],
        userEmail: profile.email,
        carName: (currentBooking as any).cars.name,
        carImage: (currentBooking as any).cars.image_url || '',
        oldStartDate: format(new Date((currentBooking as any).start_date), 'dd MMMM yyyy', { locale: fr }),
        oldEndDate: format(new Date((currentBooking as any).end_date), 'dd MMMM yyyy', { locale: fr }),
        newStartDate: format(new Date(newStartDate), 'dd MMMM yyyy', { locale: fr }),
        newEndDate: format(new Date(newEndDate), 'dd MMMM yyyy', { locale: fr }),
        startDate: format(new Date(newStartDate), 'dd MMMM yyyy', { locale: fr }),
        endDate: format(new Date(newEndDate), 'dd MMMM yyyy', { locale: fr }),
        bookingId: bookingId
      })
      console.log('✅ Email de modification envoyé à', profile.email)
    } catch (emailError) {
      console.error('❌ Erreur lors de l\'envoi de l\'email de modification:', emailError)
      // Ne pas bloquer la modification si l'email échoue
    }
  }

  revalidatePath('/bookings')
  return { success: true }
}
