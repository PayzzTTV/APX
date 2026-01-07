import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CarCard from '@/components/CarCard'
import { Car } from '@/lib/types/database.types'

export default async function FavoritesPage() {
  const supabase = await createClient()

  // Vérifier si l'utilisateur est connecté
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Récupérer les favoris avec les détails des voitures
  const { data: favorites, error } = await supabase
    .from('favorites')
    .select(
      `
      id,
      created_at,
      cars (*)
    `
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erreur lors de la récupération des favoris:', error)
  }

  // Extraire les voitures des favoris
  const cars: Car[] = favorites?.map((fav: any) => fav.cars).filter(Boolean) || []

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
          Mes Favoris
        </h1>
        <p className="text-gray-400">
          {cars.length > 0
            ? `Vous avez ${cars.length} voiture${cars.length > 1 ? 's' : ''} en favoris`
            : 'Aucune voiture en favoris'}
        </p>
      </div>

      {cars && cars.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {cars.map((car: Car, index: number) => (
            <CarCard key={car.id} car={car} index={index} />
          ))}
        </div>
      ) : (
        <div className="bg-[#1a1a1a] rounded-xl p-12 text-center">
          <div className="mb-4">
            <svg
              className="w-20 h-20 mx-auto text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Aucun favori</h2>
          <p className="text-gray-400 mb-6">
            Vous n'avez pas encore ajouté de voitures à vos favoris.
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
