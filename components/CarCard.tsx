'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Car } from '@/lib/types/database.types'
import { motion } from 'framer-motion'
import FavoriteButton from './FavoriteButton'

interface CarCardProps {
  car: Car
  index?: number
}

export default function CarCard({ car, index = 0 }: CarCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link href={`/cars/${car.id}`}>
        <div className="bg-[#1a1a1a] rounded-xl overflow-hidden hover:ring-2 hover:ring-primary transition-all duration-300 cursor-pointer group">
        {/* Image */}
        <div className="relative h-48 w-full overflow-hidden bg-[#252525]">
          <Image
            src={car.image_url || '/placeholder-car.jpg'}
            alt={car.name}
            fill
            loading="lazy"
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {/* Bouton Favori */}
          <div className="absolute top-3 right-3 z-10">
            <FavoriteButton carId={car.id} />
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Nom de la voiture */}
          <h3 className="text-xl font-bold text-white mb-2">{car.name}</h3>

          {/* Marque et Modèle */}
          <p className="text-gray-400 text-sm mb-3">
            {car.brand} {car.model}
          </p>

          {/* Rating (étoiles) */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(car.rating)
                      ? 'text-yellow-400'
                      : 'text-gray-600'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-2 text-gray-400 text-sm">
                {car.rating.toFixed(1)}
              </span>
            </div>

            {/* Bouton Réserver */}
            <div className="bg-primary hover:bg-primary-dark px-4 py-2 rounded-lg font-semibold text-sm transition-colors">
              Réserver
            </div>
          </div>
        </div>
        </div>
      </Link>
    </motion.div>
  )
}
