import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import DeleteCarButton from '@/components/admin/DeleteCarButton'

export default async function AdminCarsPage() {
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

  // Récupérer toutes les voitures
  const { data: cars } = await supabase
    .from('cars')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Gestion des Voitures</h1>
          <p className="text-gray-400">Ajouter, modifier ou supprimer des véhicules</p>
        </div>
        <Link
          href="/admin/cars/new"
          className="bg-primary hover:bg-primary-dark px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          + Ajouter une voiture
        </Link>
      </div>

      {/* Cars Grid */}
      {cars && cars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car: any) => (
            <div
              key={car.id}
              className="bg-[#1a1a1a] rounded-xl overflow-hidden border border-gray-700 hover:border-gray-600 transition-all"
            >
              {/* Image */}
              <div className="relative h-48 w-full">
                <Image
                  src={car.image_url || '/placeholder-car.jpg'}
                  alt={car.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="text-xl font-bold">{car.name}</h3>
                  <DeleteCarButton carId={car.id} carName={car.name} />
                </div>
                <p className="text-gray-400 text-sm mb-3">
                  {car.brand} {car.model}
                </p>

                <div className="flex items-center gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-gray-400">Catégorie: </span>
                    <span className="font-semibold">{car.category || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Note: </span>
                    <span className="font-semibold">{car.rating}/5</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    href={`/admin/cars/${car.id}/edit`}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold text-center transition-colors"
                  >
                    Modifier
                  </Link>
                  <Link
                    href={`/cars/${car.id}`}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-semibold text-center transition-colors"
                  >
                    Voir
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#1a1a1a] rounded-xl p-12 text-center">
          <p className="text-gray-400 text-lg mb-6">
            Aucune voiture dans la base de données.
          </p>
          <Link
            href="/admin/cars/new"
            className="inline-block bg-primary hover:bg-primary-dark px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Ajouter la première voiture
          </Link>
        </div>
      )}
    </div>
  )
}
