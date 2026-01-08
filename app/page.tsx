import { createClient } from '@/lib/supabase/server'
import CarsGrid from '@/components/CarsGrid'

export const revalidate = 0 // Disable caching for this page

export default async function Home() {
  const supabase = await createClient()

  // Récupérer toutes les voitures depuis Supabase
  const { data: cars, error } = await supabase
    .from('cars')
    .select('*')
    .order('rating', { ascending: false })

  if (error) {
    console.error('Erreur lors de la récupération des voitures:', error)
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="text-center mb-8 px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
          Votre voiture idéale
        </h1>
        <p className="text-gray-400 text-base sm:text-lg">
          Accès illimité à notre flotte
        </p>
      </div>

      {/* Cars Grid with Search and Filters */}
      {cars && cars.length > 0 ? (
        <CarsGrid initialCars={cars} />
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">
            Aucune voiture disponible pour le moment.
          </p>
        </div>
      )}
    </div>
  )
}
