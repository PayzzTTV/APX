'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Edit } from 'lucide-react'
import CancelBookingButton from './CancelBookingButton'
import EditBookingModal from './EditBookingModal'

interface BookingCardProps {
  booking: {
    id: string
    start_date: string
    end_date: string
    status: string
    cars: {
      id: string
      name: string
      brand: string
      model: string
      image_url: string
      price_per_day: number
    }
  }
}

export default function BookingCard({ booking }: BookingCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const getStatusBadge = (status: string) => {
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
          statusColors[status as keyof typeof statusColors]
        }`}
      >
        {statusLabels[status as keyof typeof statusLabels]}
      </span>
    )
  }

  // Vérifier si la réservation peut être modifiée (pas annulée et date de début dans le futur)
  const canEdit = booking.status !== 'cancelled' && new Date(booking.start_date) > new Date()

  return (
    <>
      <div className="bg-[#1a1a1a] rounded-xl p-6 flex flex-col md:flex-row gap-6">
        {/* Image de la voiture */}
        <div className="relative h-40 w-full md:w-64 rounded-lg overflow-hidden flex-shrink-0 bg-[#252525]">
          <Image
            src={booking.cars.image_url || '/placeholder-car.jpg'}
            alt={booking.cars.name}
            fill
            loading="lazy"
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 256px"
          />
        </div>

        {/* Détails */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-2xl font-bold">{booking.cars.name}</h3>
              <p className="text-gray-400">
                {booking.cars.brand} {booking.cars.model}
              </p>
            </div>
            {getStatusBadge(booking.status)}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-gray-400 text-sm">Date de début</p>
              <p className="font-semibold">
                {new Date(booking.start_date).toLocaleDateString('fr-FR')}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Date de fin</p>
              <p className="font-semibold">
                {new Date(booking.end_date).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-800 flex-wrap gap-3">
            <div className="flex gap-3">
              <a
                href={`/cars/${booking.cars.id}`}
                className="bg-primary hover:bg-primary-dark px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Voir la voiture
              </a>
              {canEdit && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Modifier
                </button>
              )}
            </div>
            <CancelBookingButton
              bookingId={booking.id}
              status={booking.status}
            />
          </div>
        </div>
      </div>

      {/* Modal de modification */}
      <EditBookingModal
        booking={booking}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}
