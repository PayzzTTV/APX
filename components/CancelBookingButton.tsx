'use client'

import { useState } from 'react'
import { cancelBooking } from '@/app/actions/auth'
import { toast } from 'sonner'

interface CancelBookingButtonProps {
  bookingId: string
  status: string
}

export default function CancelBookingButton({
  bookingId,
  status,
}: CancelBookingButtonProps) {
  const [loading, setLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  // Ne pas afficher le bouton si déjà annulée
  if (status === 'cancelled') {
    return null
  }

  const handleCancel = async () => {
    setLoading(true)
    try {
      const result = await cancelBooking(bookingId)
      if (result?.error) {
        toast.error('Erreur', {
          description: result.error,
        })
      } else {
        toast.success('Réservation annulée', {
          description: 'Votre réservation a été annulée avec succès',
        })
        setShowConfirm(false)
      }
    } catch (err) {
      toast.error('Erreur', {
        description: 'Une erreur est survenue lors de l\'annulation',
      })
    } finally {
      setLoading(false)
    }
  }

  if (showConfirm) {
    return (
      <div className="flex gap-2">
        <button
          onClick={handleCancel}
          disabled={loading}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
        >
          {loading ? 'Annulation...' : 'Confirmer'}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          disabled={loading}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
        >
          Retour
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="px-4 py-2 bg-red-500/20 text-red-500 hover:bg-red-500/30 rounded-lg font-semibold transition-colors"
    >
      Annuler la réservation
    </button>
  )
}
