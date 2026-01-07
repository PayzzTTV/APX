import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminBookingCard from '@/components/admin/AdminBookingCard'

export default async function AdminBookingsPage() {
  const supabase = await createClient()

  // Vérifier l'authentification et le rôle admin
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Vérifier le rôle admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/')
  }

  // Récupérer toutes les réservations avec détails
  const { data: bookings } = await supabase
    .from('bookings')
    .select(`
      *,
      cars (
        id,
        name,
        brand,
        model,
        image_url
      ),
      profiles (
        id,
        full_name,
        email
      )
    `)
    .order('created_at', { ascending: false })

  // Statistiques rapides
  const pending = bookings?.filter(b => b.status === 'pending').length || 0
  const confirmed = bookings?.filter(b => b.status === 'confirmed').length || 0
  const cancelled = bookings?.filter(b => b.status === 'cancelled').length || 0

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Gestion des Réservations</h1>
        <p className="text-gray-400">Approuver ou refuser les demandes de réservation</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
          <p className="text-yellow-400 text-sm font-medium mb-1">En attente</p>
          <p className="text-3xl font-bold">{pending}</p>
        </div>
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
          <p className="text-green-400 text-sm font-medium mb-1">Confirmées</p>
          <p className="text-3xl font-bold">{confirmed}</p>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <p className="text-red-400 text-sm font-medium mb-1">Annulées</p>
          <p className="text-3xl font-bold">{cancelled}</p>
        </div>
      </div>

      {/* Bookings List */}
      {bookings && bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking: any) => (
            <AdminBookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      ) : (
        <div className="bg-[#1a1a1a] rounded-xl p-12 text-center">
          <p className="text-gray-400 text-lg">
            Aucune réservation pour le moment.
          </p>
        </div>
      )}
    </div>
  )
}
