'use client'

import { useState, useEffect } from 'react'
import { DayPicker, DateRange } from 'react-day-picker'
import { fr } from 'date-fns/locale'
import { eachDayOfInterval, isWithinInterval, parseISO } from 'date-fns'
import 'react-day-picker/dist/style.css'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface BookingCalendarProps {
  carId: string
  existingBookings: Array<{
    start_date: string
    end_date: string
  }>
}

export default function BookingCalendar({
  carId,
  existingBookings,
}: BookingCalendarProps) {
  const [range, setRange] = useState<DateRange | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Calculer les dates désactivées (déjà réservées)
  const disabledDates: Date[] = []
  existingBookings.forEach((booking) => {
    const start = parseISO(booking.start_date)
    const end = parseISO(booking.end_date)
    const datesInRange = eachDayOfInterval({ start, end })
    disabledDates.push(...datesInRange)
  })

  // Vérifier si une date sélectionnée chevauche une réservation existante
  const isRangeValid = (selectedRange: DateRange | undefined): boolean => {
    if (!selectedRange?.from || !selectedRange?.to) return true

    for (const booking of existingBookings) {
      const bookingStart = parseISO(booking.start_date)
      const bookingEnd = parseISO(booking.end_date)

      // Vérifier le chevauchement
      if (
        isWithinInterval(selectedRange.from, { start: bookingStart, end: bookingEnd }) ||
        isWithinInterval(selectedRange.to, { start: bookingStart, end: bookingEnd }) ||
        (selectedRange.from < bookingStart && selectedRange.to > bookingEnd)
      ) {
        return false
      }
    }
    return true
  }

  // Gérer la sélection des dates
  const handleSelect = (selectedRange: DateRange | undefined) => {
    if (selectedRange && !isRangeValid(selectedRange)) {
      toast.error('Dates non disponibles', {
        description: 'Les dates sélectionnées chevauchent une réservation existante.',
      })
      return
    }
    setError(null)
    setRange(selectedRange)
  }

  // Soumettre la réservation
  const handleBooking = async () => {
    if (!range?.from || !range?.to) {
      toast.error('Dates manquantes', {
        description: 'Veuillez sélectionner des dates de location.',
      })
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      // Vérifier si l'utilisateur est connecté
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        toast.error('Connexion requise', {
          description: 'Vous devez être connecté pour réserver une voiture.',
        })
        setIsLoading(false)
        // Rediriger vers la page de connexion
        router.push('/login')
        return
      }

      // Créer la réservation
      const { data, error: insertError } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          car_id: carId,
          start_date: range.from.toISOString().split('T')[0],
          end_date: range.to.toISOString().split('T')[0],
          status: 'pending',
          total_price: 0, // Pas de prix dans le modèle abonnement
        })
        .select()

      if (insertError) {
        throw insertError
      }

      // Succès - Redirection vers les réservations
      toast.success('Réservation confirmée !', {
        description: 'Votre réservation a été créée avec succès.',
      })
      router.push('/bookings')
    } catch (err: any) {
      console.error('Erreur lors de la réservation:', err)
      toast.error('Erreur de réservation', {
        description: err.message || 'Une erreur est survenue lors de la réservation.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      {/* Calendrier */}
      <div className="flex justify-center mb-6">
        <DayPicker
          mode="range"
          selected={range}
          onSelect={handleSelect}
          disabled={[
            { before: new Date() }, // Désactiver les dates passées
            ...disabledDates, // Désactiver les dates réservées
          ]}
          locale={fr}
          numberOfMonths={1}
          classNames={{
            months: 'space-y-4',
            month: 'space-y-4',
            caption: 'flex justify-center pt-1 relative items-center',
            caption_label: 'text-lg font-semibold',
            nav: 'space-x-1 flex items-center',
            nav_button:
              'h-9 w-9 bg-transparent hover:bg-gray-700 p-0 rounded-md transition-colors',
            table: 'w-full border-collapse space-y-1',
            head_row: 'flex',
            head_cell: 'text-gray-400 rounded-md w-10 font-normal text-sm',
            row: 'flex w-full mt-2',
            cell: 'text-center text-sm relative p-0',
            day: 'h-10 w-10 p-0 font-normal hover:bg-gray-700 rounded-md transition-colors',
            day_selected: 'bg-primary text-white hover:bg-primary-dark',
            day_disabled: 'text-gray-600 opacity-50 line-through cursor-not-allowed',
            day_range_middle: 'bg-primary/30',
            day_today: 'bg-gray-800 font-bold',
          }}
        />
      </div>

      {/* Informations de réservation */}
      {range?.from && range?.to && (
        <div className="bg-[#252525] rounded-lg p-4 mb-4">
          <h3 className="font-semibold mb-2">Récapitulatif</h3>
          <div className="space-y-1 text-sm text-gray-400">
            <p>
              Du: {range.from.toLocaleDateString('fr-FR')}
            </p>
            <p>
              Au: {range.to.toLocaleDateString('fr-FR')}
            </p>
            <p className="text-lg font-bold text-primary pt-2">
              Durée:{' '}
              {Math.ceil(
                (range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24)
              )}{' '}
              jours
            </p>
          </div>
        </div>
      )}

      {/* Messages d'erreur */}
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-4 mb-4">
          {error}
        </div>
      )}

      {/* Bouton de réservation */}
      <button
        onClick={handleBooking}
        disabled={!range?.from || !range?.to || isLoading}
        className="w-full bg-primary hover:bg-primary-dark disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
      >
        {isLoading ? 'Réservation en cours...' : 'Confirmer la réservation'}
      </button>

      <p className="text-gray-500 text-xs text-center mt-4">
        Les dates grisées sont déjà réservées et ne peuvent pas être sélectionnées.
      </p>
    </div>
  )
}
