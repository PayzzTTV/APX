'use client'

import { motion } from 'framer-motion'
import { Weight, Ruler, Star, Sparkles } from 'lucide-react'

interface CarSpecsProps {
  specs: {
    weight_kg?: number
    length_cm?: number
    width_cm?: number
    height_cm?: number
    comfort_level?: number
    finish_level?: number
    category?: string
    year?: number
  }
}

export default function CarSpecs({ specs }: CarSpecsProps) {
  const {
    weight_kg,
    length_cm,
    width_cm,
    height_cm,
    comfort_level = 0,
    finish_level = 0,
    category,
    year,
  } = specs

  // Convertir cm en m pour l'affichage
  const lengthM = length_cm ? (length_cm / 100).toFixed(2) : null
  const widthM = width_cm ? (width_cm / 100).toFixed(2) : null
  const heightM = height_cm ? (height_cm / 100).toFixed(2) : null

  // Catégories avec emojis
  const categoryIcons: Record<string, string> = {
    citadine: '🚗',
    compacte: '🚙',
    berline: '🚘',
    suv: '🚐',
    electrique: '⚡',
    luxe: '✨',
  }

  return (
    <div className="space-y-6">
      {/* Category Badge */}
      {category && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full"
        >
          <span className="text-2xl">{categoryIcons[category] || '🚗'}</span>
          <span className="text-blue-300 font-semibold capitalize">{category}</span>
          {year && <span className="text-gray-400">• {year}</span>}
        </motion.div>
      )}

      {/* Technical Specs Grid */}
      {(weight_kg || lengthM || widthM || heightM) && (
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Ruler className="w-5 h-5 text-blue-400" />
            Caractéristiques Techniques
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {/* Weight */}
            {weight_kg && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-gray-800/50 rounded-lg p-4 border border-gray-700"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Weight className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Poids</span>
                </div>
                <p className="text-2xl font-bold text-white">{weight_kg}</p>
                <p className="text-xs text-gray-500">kg</p>
              </motion.div>
            )}

            {/* Length */}
            {lengthM && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 }}
                className="bg-gray-800/50 rounded-lg p-4 border border-gray-700"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Ruler className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Longueur</span>
                </div>
                <p className="text-2xl font-bold text-white">{lengthM}</p>
                <p className="text-xs text-gray-500">m</p>
              </motion.div>
            )}

            {/* Width */}
            {widthM && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-800/50 rounded-lg p-4 border border-gray-700"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Ruler className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Largeur</span>
                </div>
                <p className="text-2xl font-bold text-white">{widthM}</p>
                <p className="text-xs text-gray-500">m</p>
              </motion.div>
            )}

            {/* Height */}
            {heightM && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25 }}
                className="bg-gray-800/50 rounded-lg p-4 border border-gray-700"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Ruler className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Hauteur</span>
                </div>
                <p className="text-2xl font-bold text-white">{heightM}</p>
                <p className="text-xs text-gray-500">m</p>
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* Comfort & Finish Levels */}
      {(comfort_level > 0 || finish_level > 0) && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            Niveaux de Qualité
          </h3>

          {/* Comfort Level */}
          {comfort_level > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-300">Confort</span>
                <span className="text-sm text-gray-400">{comfort_level}/5</span>
              </div>
              <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(comfort_level / 5) * 100}%` }}
                  transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
                />
              </div>
            </motion.div>
          )}

          {/* Finish Level */}
          {finish_level > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-300">Finition</span>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < finish_level
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(finish_level / 5) * 100}%` }}
                  transition={{ delay: 0.45, duration: 0.6, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full"
                />
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  )
}
