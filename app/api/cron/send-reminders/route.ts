import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendBookingReminderEmail } from '@/lib/email'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * Cron Job API Route - Send booking reminders 24h before
 *
 * Cette route est appelée automatiquement par Vercel Cron Jobs
 * tous les jours à 10h pour envoyer des rappels aux utilisateurs
 * dont la réservation commence le lendemain.
 *
 * Configuration dans vercel.json
 */
export async function GET(request: NextRequest) {
  try {
    // Vérification de l'authentification (Vercel Cron secret)
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    // En développement, autoriser sans secret
    if (process.env.NODE_ENV === 'production') {
      if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json(
          { error: 'Unauthorized - Invalid cron secret' },
          { status: 401 }
        )
      }
    }

    const supabase = await createClient()

    // Calculer demain (24h à partir de maintenant)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)

    const dayAfterTomorrow = new Date(tomorrow)
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1)

    console.log('🔍 Recherche des réservations pour:', format(tomorrow, 'dd MMMM yyyy', { locale: fr }))

    // Récupérer les réservations qui commencent demain
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select(`
        id,
        start_date,
        end_date,
        profiles!inner(
          email,
          full_name
        ),
        cars!inner(
          name,
          image_url
        )
      `)
      .eq('status', 'confirmed')
      .gte('start_date', tomorrow.toISOString())
      .lt('start_date', dayAfterTomorrow.toISOString())

    if (bookingsError) {
      console.error('❌ Erreur lors de la récupération des réservations:', bookingsError)
      return NextResponse.json(
        { error: 'Database error', details: bookingsError.message },
        { status: 500 }
      )
    }

    if (!bookings || bookings.length === 0) {
      console.log('ℹ️ Aucune réservation trouvée pour demain')
      return NextResponse.json({
        success: true,
        message: 'No bookings to remind',
        sent: 0,
        date: format(tomorrow, 'dd MMMM yyyy', { locale: fr })
      })
    }

    console.log(`📧 ${bookings.length} réservation(s) trouvée(s)`)

    // Envoyer un email pour chaque réservation
    let sent = 0
    let failed = 0
    const errors: string[] = []

    for (const booking of bookings) {
      try {
        await sendBookingReminderEmail({
          userEmail: (booking as any).profiles.email,
          userName: (booking as any).profiles.full_name || (booking as any).profiles.email.split('@')[0],
          carName: (booking as any).cars.name,
          carImage: (booking as any).cars.image_url || '',
          startDate: format(new Date(booking.start_date), 'dd MMMM yyyy', { locale: fr }),
          endDate: format(new Date(booking.end_date), 'dd MMMM yyyy', { locale: fr }),
          bookingId: booking.id
        })

        sent++
        console.log(`✅ Rappel envoyé à ${(booking as any).profiles.email} pour ${(booking as any).cars.name}`)
      } catch (error) {
        failed++
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        errors.push(`${(booking as any).profiles.email}: ${errorMessage}`)
        console.error(`❌ Erreur pour ${(booking as any).profiles.email}:`, error)
      }
    }

    const result = {
      success: true,
      sent,
      failed,
      total: bookings.length,
      date: format(tomorrow, 'dd MMMM yyyy', { locale: fr }),
      errors: errors.length > 0 ? errors : undefined
    }

    console.log('📊 Résumé:', result)

    return NextResponse.json(result)

  } catch (error) {
    console.error('❌ Erreur critique:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
