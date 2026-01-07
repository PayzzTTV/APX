'use client'

import { useState, useEffect } from 'react'
import { addFavorite, removeFavorite, isFavorite } from '@/app/actions/favorites'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

interface FavoriteButtonProps {
  carId: string
  initialIsFavorite?: boolean
}

export default function FavoriteButton({
  carId,
  initialIsFavorite = false,
}: FavoriteButtonProps) {
  const [isFav, setIsFav] = useState(initialIsFavorite)
  const [loading, setLoading] = useState(false)

  // Vérifier si la voiture est en favori au chargement
  useEffect(() => {
    const checkFavorite = async () => {
      const result = await isFavorite(carId)
      setIsFav(result)
    }
    checkFavorite()
  }, [carId])

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault() // Empêcher la navigation vers la page détail
    e.stopPropagation()

    setLoading(true)

    try {
      if (isFav) {
        // Retirer des favoris
        const result = await removeFavorite(carId)
        if (result?.error) {
          toast.error('Erreur', {
            description: result.error,
          })
        } else {
          setIsFav(false)
          toast.success('Retiré des favoris', {
            description: 'La voiture a été retirée de vos favoris',
          })
        }
      } else {
        // Ajouter aux favoris
        const result = await addFavorite(carId)
        if (result?.error) {
          toast.error('Erreur', {
            description: result.error,
          })
        } else {
          setIsFav(true)
          toast.success('Ajouté aux favoris', {
            description: 'La voiture a été ajoutée à vos favoris',
          })
        }
      }
    } catch (err) {
      toast.error('Erreur', {
        description: 'Une erreur est survenue',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.button
      onClick={handleToggleFavorite}
      disabled={loading}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`p-2 rounded-full transition-all duration-300 ${
        isFav
          ? 'bg-red-500/20 text-red-500'
          : 'bg-gray-700/50 text-gray-400 hover:text-red-500'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      aria-label={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
    >
      <svg
        className="w-6 h-6"
        fill={isFav ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </motion.button>
  )
}
