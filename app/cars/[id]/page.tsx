import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import BookingCalendar from '@/components/BookingCalendar'
import FavoriteButton from '@/components/FavoriteButton'
import CarSpecs from '@/components/CarSpecs'

interface CarDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function CarDetailPage({ params }: CarDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Récupérer les détails de la voiture
  const { data: car, error: carError } = await supabase
    .from('cars')
    .select('*')
    .eq('id', id)
    .single()

  if (carError || !car) {
    notFound()
  }

  // Récupérer les réservations existantes pour cette voiture
  const { data: bookings, error: bookingsError } = await supabase
    .from('bookings')
    .select('start_date, end_date')
    .eq('car_id', id)
    .in('status', ['pending', 'confirmed'])

  if (bookingsError) {
    console.error('Erreur lors de la récupération des réservations:', bookingsError)
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back Button */}
      <a
        href="/"
        className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Retour aux voitures
      </a>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Image & Details */}
        <div>
          {/* Main Image */}
          <div className="relative h-96 w-full rounded-xl overflow-hidden mb-6">
            <Image
              src={car.image_url || '/placeholder-car.jpg'}
              alt={car.name}
              fill
              className="object-cover"
              priority
            />
            {/* Favorite Button - Top Right */}
            <div className="absolute top-4 right-4 z-10">
              <FavoriteButton carId={car.id} />
            </div>
          </div>

          {/* Car Details */}
          <div className="bg-[#1a1a1a] rounded-xl p-6">
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-4xl font-bold">{car.name}</h1>
            </div>
            <p className="text-gray-400 text-lg mb-4">
              {car.brand} {car.model}
            </p>

            {/* Rating */}
            <div className="flex items-center mb-6">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-6 h-6 ${
                    i < Math.floor(car.rating)
                      ? 'text-yellow-400'
                      : 'text-gray-600'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-3 text-xl font-semibold text-gray-300">
                {car.rating.toFixed(1)} / 5
              </span>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-gray-400 leading-relaxed">
                {car.description || 'Pas de description disponible.'}
              </p>
            </div>

            {/* Car Specifications */}
            <CarSpecs
              specs={{
                weight_kg: (car as any).weight_kg,
                length_cm: (car as any).length_cm,
                width_cm: (car as any).width_cm,
                height_cm: (car as any).height_cm,
                comfort_level: (car as any).comfort_level,
                finish_level: (car as any).finish_level,
                category: (car as any).category,
                year: (car as any).year,
              }}
            />
          </div>
        </div>

        {/* Right Column - Calendar & Booking */}
        <div className="bg-[#1a1a1a] rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-4">Réserver cette voiture</h2>
          <p className="text-gray-400 mb-6">
            Sélectionnez vos dates de réservation
          </p>

          <BookingCalendar
            carId={car.id}
            existingBookings={bookings || []}
          />
        </div>
      </div>
    </div>
  )
}
