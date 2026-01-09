'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react'

interface CarGalleryProps {
  images: string[]
  carName: string
}

export default function CarGallery({ images, carName }: CarGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [direction, setDirection] = useState(0)

  // S'assurer qu'on a au moins une image
  const galleryImages = images && images.length > 0 ? images : []

  if (galleryImages.length === 0) {
    return (
      <div className="relative w-full aspect-[16/10] bg-[#252525] rounded-lg flex items-center justify-center">
        <p className="text-gray-400">Aucune image disponible</p>
      </div>
    )
  }

  const next = () => {
    setDirection(1)
    setCurrentIndex((i) => (i + 1) % galleryImages.length)
  }

  const prev = () => {
    setDirection(-1)
    setCurrentIndex((i) => (i - 1 + galleryImages.length) % galleryImages.length)
  }

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  }

  const swipeConfidenceThreshold = 10000
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity
  }

  return (
    <>
      {/* Carousel principal */}
      <div className="relative w-full aspect-[16/10] bg-[#252525] rounded-lg overflow-hidden group">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x)

              if (swipe < -swipeConfidenceThreshold) {
                next()
              } else if (swipe > swipeConfidenceThreshold) {
                prev()
              }
            }}
            className="absolute inset-0"
          >
            <Image
              src={galleryImages[currentIndex]}
              alt={`${carName} - Image ${currentIndex + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              priority={currentIndex === 0}
            />
          </motion.div>
        </AnimatePresence>

        {/* Bouton fullscreen */}
        <button
          onClick={() => setIsFullscreen(true)}
          className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
          aria-label="Afficher en plein écran"
        >
          <Maximize2 className="w-5 h-5" />
        </button>

        {/* Boutons de navigation (affichés seulement s'il y a plusieurs images) */}
        {galleryImages.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
              aria-label="Image précédente"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
              aria-label="Image suivante"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Indicateurs de position */}
        {galleryImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {galleryImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-white w-6'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Aller à l'image ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Compteur d'images */}
        {galleryImages.length > 1 && (
          <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-lg backdrop-blur-sm text-sm font-medium">
            {currentIndex + 1} / {galleryImages.length}
          </div>
        )}
      </div>

      {/* Thumbnails (affichés seulement s'il y a plusieurs images) */}
      {galleryImages.length > 1 && (
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
          {galleryImages.map((img, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`relative flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden transition-all bg-[#252525] ${
                index === currentIndex
                  ? 'ring-2 ring-blue-500 scale-105'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              <Image
                src={img}
                alt={`Thumbnail ${index + 1}`}
                fill
                loading="lazy"
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Modal fullscreen */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center"
            onClick={() => setIsFullscreen(false)}
          >
            {/* Bouton fermer */}
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-sm transition-all z-10"
              aria-label="Fermer"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Image en plein écran */}
            <div className="relative w-full h-full flex items-center justify-center p-4">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }}
                  className="absolute inset-0 flex items-center justify-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="relative w-full h-full max-w-6xl max-h-[90vh]">
                    <Image
                      src={galleryImages[currentIndex]}
                      alt={`${carName} - Image ${currentIndex + 1}`}
                      fill
                      className="object-contain"
                      sizes="100vw"
                    />
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation fullscreen */}
              {galleryImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      prev()
                    }}
                    className="absolute left-4 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full backdrop-blur-sm transition-all"
                    aria-label="Image précédente"
                  >
                    <ChevronLeft className="w-8 h-8" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      next()
                    }}
                    className="absolute right-4 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full backdrop-blur-sm transition-all"
                    aria-label="Image suivante"
                  >
                    <ChevronRight className="w-8 h-8" />
                  </button>
                </>
              )}

              {/* Compteur fullscreen */}
              {galleryImages.length > 1 && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/10 text-white px-4 py-2 rounded-lg backdrop-blur-sm text-lg font-medium">
                  {currentIndex + 1} / {galleryImages.length}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Style pour cacher la scrollbar */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  )
}
