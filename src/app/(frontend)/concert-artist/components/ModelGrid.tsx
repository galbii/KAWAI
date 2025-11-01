'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

const models = [
  {
    id: 'ca401',
    name: 'CA401',
    tagline: 'Where Mastery Begins',
    descriptor: 'Entry to the Concert Artist lineage—wooden keys from lesson one',
    price: '$3,199',
    originalPrice: '$4,199',
    image: '/images/concert-artist/ca401.jpg',
    features: ['Grand Feel Compact III Action', 'SK-EX Concert Grand Sampling', '100% Wooden Keys'],
    link: 'https://kawaius.com/product/kawai-ca401-digital-piano/?utm_source=kawaipianogallery&utm_medium=referral&utm_campaign=CA_Series_Campaign&utm_content=ca401_product_link&utm_term=ca401',
    videoId: 'HoPhUcrFrFk',
  },
  {
    id: 'ca501',
    name: 'CA501',
    tagline: 'The Journey Instrument',
    descriptor: 'Professional sound supporting Grade 1 through Graduate-level growth',
    price: '$4,099',
    originalPrice: '$5,199',
    image: '/images/concert-artist/ca501.jpg',
    features: ['Harmonic Imaging XL', '100W Speaker System', '360° Sound Diffusion'],
    link: 'https://kawaius.com/product/kawai-ca501-digital-piano/?utm_source=kawaipianogallery&utm_medium=referral&utm_campaign=CA_Series_Campaign&utm_content=ca501_product_link&utm_term=ca501',
    videoId: 'C1AQ7w2Htf0',
  },
  {
    id: 'ca701',
    name: 'CA701',
    tagline: 'The Artist\'s Choice',
    descriptor: 'Grand Feel III action and SK-EX Rendering for concert-level practice',
    price: '$5,049',
    originalPrice: '$6,549',
    image: '/images/concert-artist/ca701.jpg',
    features: ['Grand Feel III Action', 'SK-EX Rendering Engine', 'Extended Pivot Length'],
    link: 'https://kawaius.com/product/ca701/?utm_source=kawaipianogallery&utm_medium=referral&utm_campaign=CA_Series_Campaign&utm_content=ca701_product_link&utm_term=ca701',
    videoId: 'V3qb8Q3ZPn4',
  },
  {
    id: 'ca901',
    name: 'CA901',
    tagline: 'The Master\'s Companion',
    descriptor: 'TwinDrive genuine spruce soundboard—concert physics in your home',
    price: '$6,549',
    originalPrice: '$8,599',
    image: '/images/concert-artist/ca901.jpg',
    features: ['Genuine Spruce Soundboard', 'TwinDrive Technology', '135W Premium System'],
    link: 'https://kawaius.com/product/ca901/?utm_source=kawaipianogallery&utm_medium=referral&utm_campaign=CA_Series_Campaign&utm_content=ca901_product_link&utm_term=ca901',
    videoId: 'Ehx8nmfwc1k',
  },
]

export default function ModelGrid() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null)

  const handlePlayClick = (e: React.MouseEvent, videoId: string) => {
    e.preventDefault()
    e.stopPropagation()
    setActiveVideo(videoId)
  }

  const handleProductClick = (modelName: string, modelId: string) => {
    // Track product link click with Meta Pixel
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('trackCustom', 'CA_Series_ProductClick', {
        content_name: modelName,
        content_category: 'Digital Piano',
        campaign: 'CA_Series_Campaign',
        model: modelId,
      })
    }

    // Track with PostHog
    if (typeof window !== 'undefined' && (window as any).posthog) {
      (window as any).posthog.capture('ca_series_product_click', {
        product: modelName,
        model_id: modelId,
        campaign: 'CA_Series_Campaign',
      })
    }
  }

  const closeModal = () => {
    setActiveVideo(null)
  }
  return (
    <section id="model-grid" className="py-16 md:py-24 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Heading */}
        <div className="text-center mb-16 md:mb-24 space-y-4">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="text-xs sm:text-sm font-light uppercase tracking-[0.3em] text-neutral-500"
          >
            THE COLLECTION
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-light font-serif text-neutral-900"
            style={{ fontFamily: 'Crimson Text, serif' }}
          >
            Four Expressions
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-24 h-px bg-neutral-300 mx-auto"
          />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {models.map((model, index) => (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <div className="group relative bg-white border border-neutral-200 overflow-hidden transition-all duration-500 hover:border-neutral-400 hover:shadow-xl">
                {/* Product Image */}
                <div className="relative aspect-[16/9] overflow-hidden bg-neutral-100">
                  <Image
                    src={`https://img.youtube.com/vi/${model.videoId}/maxresdefault.jpg`}
                    alt={`${model.name} - ${model.tagline}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    unoptimized
                  />

                  {/* Play Button Overlay */}
                  <button
                    onClick={(e) => handlePlayClick(e, model.videoId)}
                    className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-all duration-300 cursor-pointer"
                    aria-label={`Play ${model.name} video`}
                    type="button"
                  >
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white backdrop-blur-sm flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 border-2 border-white/50 pointer-events-none">
                      <svg
                        className="w-8 h-8 md:w-10 md:h-10 text-neutral-900 ml-1"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </button>
                </div>

                <a
                  href={model.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleProductClick(model.name, model.id)}
                >
                  {/* Content */}
                  <div className="p-8 space-y-4">
                    {/* Model Name */}
                    <h3 className="text-3xl font-light font-serif text-neutral-900" style={{ fontFamily: 'Crimson Text, serif' }}>
                      {model.name}
                    </h3>

                    {/* Tagline */}
                    <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
                      {model.tagline}
                    </p>

                    {/* Thin divider */}
                    <div className="w-12 h-px bg-neutral-300" />

                    {/* Descriptor */}
                    <p className="text-sm leading-relaxed text-neutral-600 font-light">
                      {model.descriptor}
                    </p>

                    {/* Features */}
                    <ul className="space-y-2 pt-2">
                      {model.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="text-xs text-neutral-500 flex items-start font-light tracking-wide"
                        >
                          <span className="mr-2 text-neutral-400">—</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Price and CTA */}
                    <div className="pt-6 flex items-center justify-between border-t border-neutral-200">
                      <div className="flex flex-col gap-1">
                        <p className="text-xs text-neutral-500 font-light">Starting at</p>
                        <div className="flex items-center gap-2">
                          <p className="text-lg font-light text-neutral-900">
                            {model.price}
                          </p>
                          <p className="text-sm text-neutral-400 line-through">
                            {model.originalPrice}
                          </p>
                        </div>
                      </div>
                      <div className="text-xs uppercase tracking-wider text-neutral-500 group-hover:text-neutral-900 transition-colors flex items-center">
                        Learn More
                        <svg
                          className="ml-1 w-3 h-3 transition-transform group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            onClick={closeModal}
          >
            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute -top-12 right-0 text-white hover:text-neutral-300 transition-colors"
                aria-label="Close video"
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Video Container */}
              <div className="relative w-full bg-black rounded-sm overflow-hidden shadow-2xl" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`}
                  title="Piano Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
