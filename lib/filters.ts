import { Car } from './types/database.types'
import { FilterOptions } from '@/components/FilterPanel'

/**
 * Filtre les voitures en fonction de la recherche et des filtres
 */
export function filterCars(
  cars: Car[],
  searchQuery: string,
  filters: FilterOptions
): Car[] {
  let filteredCars = [...cars]

  // Filtre par recherche (nom, marque, modèle)
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase().trim()
    filteredCars = filteredCars.filter((car) => {
      const name = car.name?.toLowerCase() || ''
      const brand = car.brand?.toLowerCase() || ''
      const model = car.model?.toLowerCase() || ''

      return (
        name.includes(query) ||
        brand.includes(query) ||
        model.includes(query)
      )
    })
  }

  // Filtre par catégories
  if (filters.categories.length > 0) {
    filteredCars = filteredCars.filter((car) => {
      // Vérifier si la voiture a une catégorie
      const carCategory = (car as any).category
      return carCategory && filters.categories.includes(carCategory)
    })
  }

  // Filtre par note minimum
  if (filters.minRating > 0) {
    filteredCars = filteredCars.filter((car) => car.rating >= filters.minRating)
  }

  return filteredCars
}

/**
 * Trie les voitures par différents critères
 */
export function sortCars(
  cars: Car[],
  sortBy: 'name' | 'rating' | 'newest' = 'rating'
): Car[] {
  const sorted = [...cars]

  switch (sortBy) {
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating)
    case 'newest':
      return sorted.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
    default:
      return sorted
  }
}

/**
 * Obtient les catégories uniques des voitures
 */
export function getUniqueCategories(cars: Car[]): string[] {
  const categories = cars
    .map((car) => (car as any).category)
    .filter((category): category is string => Boolean(category))

  return Array.from(new Set(categories))
}

/**
 * Compte le nombre de voitures par catégorie
 */
export function countByCategory(cars: Car[]): Record<string, number> {
  const counts: Record<string, number> = {}

  cars.forEach((car) => {
    const category = (car as any).category
    if (category) {
      counts[category] = (counts[category] || 0) + 1
    }
  })

  return counts
}
