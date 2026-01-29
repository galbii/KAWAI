'use client'

/**
 * News Image Carousel - Multi-image cycling for news items
 *
 * Displays multiple images for a news item with automatic crossfade transitions.
 * Images cycle through evenly during the slide's display time, showing all images
 * before the main carousel advances to the next news item.
 */

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import type { Media } from '@/payload-types'
import {
  getImagePropsWithFallback as getFallbackImageProps,
  createImageErrorHandler,
} from '@/lib/fallbacks/media'
import { FALLBACK_NEWS_CAROUSEL_DATA } from '@/lib/fallbacks'

export interface NewsImageCarouselProps {
  title: string
  description: string
  images: (Media | string)[]
  category: string
  link?: string | undefined
  prefersReducedMotion?: boolean
  slideDuration: number // Total time this slide is visible
}

/**
 * NewsImageCarousel Component
 *
 * Auto-cycles through multiple images with crossfade transitions.
 * Each image gets equal display time within the total slide duration.
 */
export function NewsImageCarousel({
  title,
  description,
  images,
  category,
  link,
  prefersReducedMotion = false,
  slideDuration,
}: NewsImageCarouselProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Calculate time per image: divide total slide duration evenly
  const imageCycleDuration = images.length > 1 ? slideDuration / images.length : slideDuration

  // Auto-cycle through images
  useEffect(() => {
    if (images.length <= 1) return

    const imageTimer = setTimeout(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }, imageCycleDuration)

    return () => clearTimeout(imageTimer)
  }, [currentImageIndex, images.length, imageCycleDuration])

  // Reset image loaded state when image changes
  useEffect(() => {
    setImageLoaded(false)
  }, [currentImageIndex])

  const currentImage = images[currentImageIndex]
  if (!currentImage) return null

  const fallbackImage = '/images/banners/I2LNew-banner.jpg'

  const imageProps = getFallbackImageProps(
    currentImage,
    fallbackImage,
    'hero',
    {
      fill: true,
      className: 'object-cover',
      sizes: '100vw',
      priority: currentImageIndex === 0,
      context: {
        type: 'news',
      },
    }
  )

  const handleImageError = createImageErrorHandler({
    type: 'news',
  })

  return (
    <>
      {/* Background Images with Crossfade */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 1,
              ease: 'easeInOut',
            }}
            className="absolute inset-0"
          >
            {/* Background Image with Ken Burns Effect */}
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 1 }}
              animate={{ scale: imageLoaded ? 1.05 : 1 }}
              transition={{
                duration: prefersReducedMotion ? 0 : imageCycleDuration / 1000,
                ease: 'linear',
              }}
            >
              <Image
                {...imageProps}
                alt={`${title} - Image ${currentImageIndex + 1}`}
                onError={handleImageError}
                onLoad={() => setImageLoaded(true)}
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Gradient Overlays for Better Text Contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-kawai-black/80 via-kawai-black/40 to-kawai-black/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-kawai-black/60 via-transparent to-transparent" />

      {/* Category Badge - Top Right */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="absolute top-8 right-8 sm:top-12 sm:right-12 lg:top-16 lg:right-16 z-20"
      >
        <span className="inline-block px-6 py-3 text-xs font-bold tracking-[0.25em] uppercase bg-kawai-red/90 backdrop-blur-sm text-white rounded-full shadow-xl border border-white/10">
          {category}
        </span>
      </motion.div>

      {/* Image Indicator Dots - Top Right below category */}
      {images.length > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="absolute top-20 right-8 sm:top-24 sm:right-12 lg:top-28 lg:right-16 z-20 flex items-center space-x-2"
        >
          {images.map((_, index) => (
            <div
              key={index}
              className={`transition-all duration-300 rounded-full ${
                index === currentImageIndex
                  ? 'w-8 h-2 bg-white shadow-md'
                  : 'w-2 h-2 bg-white/40'
              }`}
              aria-label={`Image ${index + 1} of ${images.length}`}
              aria-current={index === currentImageIndex}
            />
          ))}
        </motion.div>
      )}

      {/* Content Overlay - Bottom Left with Glassmorphism */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="absolute bottom-8 left-8 sm:bottom-12 sm:left-12 lg:bottom-16 lg:left-16 right-8 sm:right-12 lg:right-1/3 z-20"
      >
        {/* Glassmorphism Container */}
        <div className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl p-8 sm:p-10 lg:p-12 shadow-2xl">
          <div className="space-y-6">
            {/* Small Label */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <span className="text-xs text-kawai-pearl tracking-[0.2em] uppercase font-medium">
                Latest News • {images.length} Images
              </span>
            </motion.div>

            {/* Title */}
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light font-serif text-white leading-tight"
            >
              {title}
            </motion.h3>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="text-base sm:text-lg lg:text-xl text-white/90 leading-relaxed max-w-2xl"
            >
              {description}
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="pt-4"
            >
              <Link
                href={link || '#'}
                className="inline-flex items-center space-x-3 bg-white hover:bg-kawai-red text-kawai-black hover:text-white px-8 py-4 rounded-full font-medium text-sm tracking-wide uppercase transition-all duration-300 shadow-lg hover:shadow-2xl group"
              >
                <span>Read Full Story</span>
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </>
  )
}
