'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import type { ConcertArtistPage, Media } from '@/payload-types'
import { getImagePropsWithFallback } from '@/lib/media/r2-utils'

interface ModelImageGalleryProps {
  data?: ConcertArtistPage | null
}

export default function ModelImageGallery({ data }: ModelImageGalleryProps) {
  // Get model galleries from CMS or use fallback
  const modelGalleries = data?.modelGalleries || []

  // Fallback models if no CMS data
  const fallbackModels = [
    { modelId: 'ca401', modelName: 'CA401', tagline: 'Where Mastery Begins', images: [] },
    { modelId: 'ca501', modelName: 'CA501', tagline: 'The Journey Instrument', images: [] },
    { modelId: 'ca701', modelName: 'CA701', tagline: 'The Artist\'s Choice', images: [] },
    { modelId: 'ca901', modelName: 'CA901', tagline: 'The Master\'s Companion', images: [] }
  ]

  const models = modelGalleries.length > 0 ? modelGalleries : fallbackModels
  const [activeModel, setActiveModel] = useState(models[0]!)

  const currentImages = activeModel.images

  return (
    <section className="relative py-24 md:py-32 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px bg-black/20 w-12"></div>
            <p className="text-[11px] md:text-xs font-medium uppercase tracking-[0.25em] text-black/60">
              Visual Gallery
            </p>
            <div className="h-px bg-black/20 w-12"></div>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-black leading-tight max-w-3xl mx-auto">
            Every Angle, Every Detail
          </h2>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-12 md:mb-16"
        >
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {models.map((model) => (
              <button
                key={model.modelId}
                onClick={() => setActiveModel(model)}
                className={`
                  relative px-6 md:px-8 py-3 md:py-4 transition-all duration-300
                  ${
                    activeModel.modelId === model.modelId
                      ? 'bg-black text-white'
                      : 'bg-white text-black border-2 border-black/10 hover:border-black/30'
                  }
                `}
              >
                <span className="font-serif text-lg md:text-xl font-light">
                  {model.modelName}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Image Grid - 6 images in 3 columns */}
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModel.modelId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            >
              {currentImages.map((imageItem, index) => {
                const imageProps = getImagePropsWithFallback(
                  imageItem.image,
                  '/images/concert-artist/placeholder.jpg',
                  'gallery',
                  {
                    sizes: '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'
                  }
                )

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group relative overflow-hidden bg-[#FAF8F5] border border-black/10 hover:border-black/20 transition-all duration-300"
                  >
                    {/* Image Container */}
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        {...imageProps}
                        alt={imageItem.alt || `${activeModel.modelName} Image ${index + 1}`}
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Caption */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-12 md:mt-16"
        >
          <p className="text-sm text-black/50 italic">
            Select a model above to view detailed imagery
          </p>
        </motion.div>
      </div>
    </section>
  )
}
