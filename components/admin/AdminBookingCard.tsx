'use client'

import { useState } from 'react'
import Image from 'next/image'
import { toast } from 'sonner'

interface AdminBookingCardProps {
  booking: {
    id: string
    start_date: string
    end_date: string
    status: string
    created_at: string
    cars: {
      id: string
      name: string
      brand: string
      model: string
      image_url: string
    }
    profiles: {
      id: string
      full_name: string | null
      email: string
    }
  }
}

export default function AdminBookingCard({ booking }: AdminBookingCardProps) {
  const [status, setStatus] = useState(booking.status)
  const [loading, setLoading] = useState(false)

  const handleUpdateStatus = async (newStatus: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/bookings/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: booking.id,
          status: newStatus,
        }),
      })

      if (response.ok) {
        setStatus(newStatus)
        toast.success(
          newStatus === 'confirmed'
            ? 'Réservation confirmée'
            : 'Réservation annulée'
        )
      } else {
        toast.error('Erreur lors de la mise à jour')
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (currentStatus: string) => {
    const statusColors = {
      pending: 'bg-yellow-500/20 text-yellow-500',
      confirmed: 'bg-green-500/20 text-green-500',
      cancelled: 'bg-red-500/20 text-red-500',
    }

    const statusLabels = {
      pending: 'En attente',
      confirmed: 'Confirmée',
      cancelled: 'Annulée',
    }

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          statusColors[currentStatus as keyof typeof statusColors]
        }`}
      >
        {statusLabels[currentStatus as keyof typeof statusLabels]}
      </span>
    )
  }

  return (
    <div className="bg-[#1a1a1a] rounded-xl p-6 border border-gray-700">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Image */}
        <div className="relative h-32 w-full md:w-48 rounded-lg overflow-hidden flex-shrink-0 bg-[#252525]">
          <Image
            src={booking.cars.image_url || '/placeholder-car.jpg'}
            alt={booking.cars.name}
            fill
            loading="lazy"
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 192px"
          />
        </div>

        {/* Details */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-xl font-bold">{booking.cars.name}</h3>
              <p className="text-gray-400 text-sm">
                {booking.cars.brand} {booking.cars.model}
              </p>
            </div>
            {getStatusBadge(status)}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div>
              <p className="text-gray-400 text-sm">Client</p>
              <p className="font-semibold">
                {booking.profiles.full_name || booking.profiles.email}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Email</p>
              <p className="font-semibold text-sm">{booking.profiles.email}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Dates</p>
              <p className="font-semibold text-sm">
                {new Date(booking.start_date).toLocaleDateString('fr-FR')} -{' '}
                {new Date(booking.end_date).toLocaleDateString('fr-FR')}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Demandée le</p>
              <p className="font-semibold text-sm">
                {new Date(booking.created_at).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>

          {/* Actions */}
          {status === 'pending' && (
            <div className="flex gap-3">
              <button
                onClick={() => handleUpdateStatus('confirmed')}
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                {loading ? 'Chargement...' : 'Approuver'}
              </button>
              <button
                onClick={() => handleUpdateStatus('cancelled')}
                disabled={loading}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                {loading ? 'Chargement...' : 'Refuser'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
