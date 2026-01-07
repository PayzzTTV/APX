import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import BookingCard from '@/components/BookingCard'

export default async function BookingsPage() {
  const supabase = await createClient()

  // Vérifier si l'utilisateur est connecté
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Récupérer les réservations de l'utilisateur avec les détails des voitures
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select(`
      *,
      cars (
        id,
        name,
        brand,
        model,
        image_url,
        price_per_day
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erreur lors de la récupération des réservations:', error)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Mes Réservations</h1>

      {bookings && bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking: any) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      ) : (
        <div className="bg-[#1a1a1a] rounded-xl p-12 text-center">
          <p className="text-gray-400 text-lg mb-6">
            Vous n'avez pas encore de réservations.
          </p>
          <a
            href="/"
            className="inline-block bg-primary hover:bg-primary-dark px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Découvrir nos voitures
          </a>
        </div>
      )}
    </div>
  )
}
