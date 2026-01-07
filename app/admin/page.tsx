import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import StatCard from '@/components/admin/StatCard'
import QuickActions from '@/components/admin/QuickActions'

export default async function AdminDashboard() {
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

  // Récupérer les statistiques

  // Nombre total d'utilisateurs
  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  // Nombre total de voitures
  const { count: totalCars } = await supabase
    .from('cars')
    .select('*', { count: 'exact', head: true })

  // Nombre total de réservations
  const { count: totalBookings } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })

  // Réservations confirmées
  const { count: confirmedBookings } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'confirmed')

  // Réservations en attente
  const { count: pendingBookings } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  // Réservations annulées
  const { count: cancelledBookings } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'cancelled')

  // Voitures les plus réservées
  const { data: topCars } = await supabase
    .from('bookings')
    .select(`
      car_id,
      cars (
        id,
        name,
        brand,
        model
      )
    `)
    .in('status', ['pending', 'confirmed'])

  // Compter les réservations par voiture
  const carBookingCounts = topCars?.reduce((acc: any, booking: any) => {
    const carId = booking.car_id
    if (!acc[carId]) {
      acc[carId] = {
        car: booking.cars,
        count: 0
      }
    }
    acc[carId].count++
    return acc
  }, {})

  const topCarsArray = Object.values(carBookingCounts || {})
    .sort((a: any, b: any) => b.count - a.count)
    .slice(0, 5)

  // Réservations récentes
  const { data: recentBookings } = await supabase
    .from('bookings')
    .select(`
      *,
      cars (name, brand, model),
      profiles (full_name, email)
    `)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Dashboard Admin</h1>
        <p className="text-gray-400">Vue d'ensemble de votre application</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Utilisateurs"
          value={totalUsers || 0}
          iconName="users"
          delay={0}
        />
        <StatCard
          title="Voitures"
          value={totalCars || 0}
          iconName="car"
          delay={0.1}
        />
        <StatCard
          title="Réservations"
          value={totalBookings || 0}
          iconName="calendar"
          delay={0.2}
        />
        <StatCard
          title="Confirmées"
          value={confirmedBookings || 0}
          iconName="checkCircle"
          delay={0.3}
        />
        <StatCard
          title="En attente"
          value={pendingBookings || 0}
          iconName="clock"
          delay={0.4}
        />
        <StatCard
          title="Annulées"
          value={cancelledBookings || 0}
          iconName="xCircle"
          delay={0.5}
        />
      </div>

      {/* Two columns layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Voitures les plus réservées */}
        <div className="bg-[#1a1a1a] rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold mb-4">Voitures les plus réservées</h2>
          {topCarsArray.length > 0 ? (
            <div className="space-y-3">
              {topCarsArray.map((item: any, index: number) => (
                <div
                  key={item.car.id}
                  className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold">{item.car.name}</p>
                      <p className="text-sm text-gray-400">
                        {item.car.brand} {item.car.model}
                      </p>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-blue-500/20 rounded-full">
                    <span className="text-blue-400 font-semibold">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-4">Aucune réservation</p>
          )}
        </div>

        {/* Réservations récentes */}
        <div className="bg-[#1a1a1a] rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold mb-4">Réservations récentes</h2>
          {recentBookings && recentBookings.length > 0 ? (
            <div className="space-y-3">
              {recentBookings.map((booking: any) => (
                <div
                  key={booking.id}
                  className="p-3 bg-gray-800/50 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold">{booking.cars.name}</p>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      booking.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                      booking.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {booking.status === 'confirmed' ? 'Confirmée' :
                       booking.status === 'pending' ? 'En attente' :
                       'Annulée'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">
                    {booking.profiles?.full_name || booking.profiles?.email}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(booking.start_date).toLocaleDateString('fr-FR')} - {new Date(booking.end_date).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-4">Aucune réservation</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions />
    </div>
  )
}
