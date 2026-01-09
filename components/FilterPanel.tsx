'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Filter, X, Star } from 'lucide-react'
import { useState } from 'react'

export interface FilterOptions {
  categories: string[]
  minRating: number
}

interface FilterPanelProps {
  filters: FilterOptions
  onChange: (filters: FilterOptions) => void
  resultsCount: number
}

const CATEGORIES = [
  { value: 'citadine', label: 'Citadine', icon: '🚗' },
  { value: 'compacte', label: 'Compacte', icon: '🚙' },
  { value: 'berline', label: 'Berline', icon: '🚘' },
  { value: 'suv', label: 'SUV', icon: '🚐' },
  { value: 'electrique', label: 'Électrique', icon: '⚡' },
  { value: 'luxe', label: 'Luxe', icon: '✨' },
]

const RATINGS = [
  { value: 0, label: 'Toutes' },
  { value: 3, label: '3+' },
  { value: 4, label: '4+' },
  { value: 4.5, label: '4.5+' },
]

export default function FilterPanel({ filters, onChange, resultsCount }: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleCategory = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category]

    onChange({ ...filters, categories: newCategories })
  }

  const setRating = (rating: number) => {
    onChange({ ...filters, minRating: rating })
  }

  const resetFilters = () => {
    onChange({ categories: [], minRating: 0 })
  }

  const hasActiveFilters = filters.categories.length > 0 || filters.minRating > 0
  const activeFiltersCount = filters.categories.length + (filters.minRating > 0 ? 1 : 0)

  return (
    <div className="w-full">
      {/* Filter Toggle Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-900/50 backdrop-blur-sm rounded-xl ring-1 ring-gray-700 hover:ring-gray-600 transition-all"
        aria-expanded={isOpen}
        aria-controls="filter-panel"
        aria-label={`Filtres${activeFiltersCount > 0 ? ` (${activeFiltersCount} actif${activeFiltersCount > 1 ? 's' : ''})` : ''}`}
      >
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <span className="text-white font-medium">Filtres</span>
          {activeFiltersCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full font-semibold"
            >
              {activeFiltersCount}
            </motion.span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">{resultsCount} résultat{resultsCount > 1 ? 's' : ''}</span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </div>
      </motion.button>

      {/* Filter Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div
              id="filter-panel"
              className="mt-4 p-4 bg-gray-900/30 backdrop-blur-sm rounded-xl ring-1 ring-gray-700 space-y-6"
              role="group"
              aria-label="Options de filtrage"
            >
              {/* Categories */}
              <fieldset>
                <legend className="text-sm font-semibold text-gray-300 mb-3">Catégories</legend>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map((category) => {
                    const isSelected = filters.categories.includes(category.value)
                    return (
                      <motion.button
                        key={category.value}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleCategory(category.value)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                          isSelected
                            ? 'bg-blue-500 text-white ring-2 ring-blue-400'
                            : 'bg-gray-800/50 text-gray-300 ring-1 ring-gray-700 hover:ring-gray-600'
                        }`}
                        role="checkbox"
                        aria-checked={isSelected}
                        aria-label={`Catégorie ${category.label}`}
                      >
                        <span className="text-lg" aria-hidden="true">{category.icon}</span>
                        <span className="text-sm font-medium">{category.label}</span>
                      </motion.button>
                    )
                  })}
                </div>
              </fieldset>

              {/* Rating Filter */}
              <fieldset>
                <legend className="text-sm font-semibold text-gray-300 mb-3">Note minimum</legend>
                <div className="flex gap-2">
                  {RATINGS.map((rating) => {
                    const isSelected = filters.minRating === rating.value
                    return (
                      <motion.button
                        key={rating.value}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setRating(rating.value)}
                        className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                          isSelected
                            ? 'bg-yellow-500 text-gray-900 ring-2 ring-yellow-400'
                            : 'bg-gray-800/50 text-gray-300 ring-1 ring-gray-700 hover:ring-gray-600'
                        }`}
                        role="radio"
                        aria-checked={isSelected}
                        aria-label={`Note minimum ${rating.label}`}
                      >
                        <Star className={`w-4 h-4 ${isSelected ? 'fill-gray-900' : 'fill-yellow-500'}`} aria-hidden="true" />
                        <span className="text-sm font-medium">{rating.label}</span>
                      </motion.button>
                    )
                  })}
                </div>
              </fieldset>

              {/* Reset Button */}
              {hasActiveFilters && (
                <motion.button
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetFilters}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-800/50 text-gray-300 rounded-lg ring-1 ring-gray-700 hover:ring-gray-600 transition-all"
                  aria-label="Réinitialiser tous les filtres"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                  <span className="text-sm font-medium">Réinitialiser les filtres</span>
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
