'use client'

import { useState, useMemo } from 'react'
import { Car } from '@/lib/types/database.types'
import CarCard from './CarCard'
import SearchBar from './SearchBar'
import FilterPanel, { FilterOptions } from './FilterPanel'
import { filterCars, sortCars } from '@/lib/filters'
import { motion, AnimatePresence } from 'framer-motion'

interface CarsGridProps {
  initialCars: Car[]
}

export default function CarsGrid({ initialCars }: CarsGridProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    minRating: 0,
  })

  // Appliquer les filtres et le tri
  const filteredCars = useMemo(() => {
    const filtered = filterCars(initialCars, searchQuery, filters)
    return sortCars(filtered, 'rating')
  }, [initialCars, searchQuery, filters])

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      {/* Filter Panel */}
      <FilterPanel
        filters={filters}
        onChange={setFilters}
        resultsCount={filteredCars.length}
      />

      {/* Results */}
      <AnimatePresence mode="wait">
        {filteredCars.length > 0 ? (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          >
            {filteredCars.map((car: Car, index: number) => (
              <CarCard key={car.id} car={car} index={index} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="no-results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="text-center py-12"
          >
            <div className="max-w-md mx-auto">
              <div className="mb-4 text-6xl">🔍</div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                Aucun résultat trouvé
              </h3>
              <p className="text-gray-400">
                {searchQuery
                  ? `Aucune voiture ne correspond à "${searchQuery}"`
                  : 'Aucune voiture ne correspond à vos critères de filtrage'}
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Essayez de modifier vos filtres ou votre recherche
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
