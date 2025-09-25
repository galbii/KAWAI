'use client'

import React, { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { MediaRenderer } from '@/components/ui/media/MediaRenderer'
import { FeaturedCarouselSkeleton } from '@/components/ui/loading-states'
import { cn } from '@/lib/utils'

export interface LegacyFeaturedModel {
  name: string
  category: string
  image: string
  badge: string
  description: string
}

interface FeaturedPianoCarouselProps {
  models: LegacyFeaturedModel[]
}

export function FeaturedPianoCarousel({ models }: FeaturedPianoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const nextPiano = useCallback(() => {
    if (isTransitioning || models.length === 0) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => (prev + 1) % models.length)
    setTimeout(() => setIsTransitioning(false), 500)
  }, [isTransitioning, models.length])

  const prevPiano = useCallback(() => {
    if (isTransitioning || models.length === 0) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => (prev - 1 + models.length) % models.length)
    setTimeout(() => setIsTransitioning(false), 500)
  }, [isTransitioning, models.length])

  const goToPiano = (index: number) => {
    if (isTransitioning || index === currentIndex || models.length === 0) return
    setIsTransitioning(true)
    setCurrentIndex(index)
    setTimeout(() => setIsTransitioning(false), 500)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') prevPiano()
      if (event.key === 'ArrowRight') nextPiano()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nextPiano, prevPiano])

  if (models.length === 0) {
    return <FeaturedCarouselSkeleton />
  }

  const currentPiano = models[currentIndex]

  if (!currentPiano) {
    return <FeaturedCarouselSkeleton />
  }

  return (
    <div className="relative min-h-[70vh] max-h-[85vh] rounded-2xl overflow-hidden group bg-kawai-black">
      <div className="grid lg:grid-cols-2 h-full">
        {/* Piano Image Section */}
        <div className="relative order-2 lg:order-1 min-h-[40vh] lg:min-h-full">
          <MediaRenderer
            media={currentPiano.image}
            preset="hero"
            priority
            className={cn(
              'absolute inset-0 transition-all duration-500 ease-out',
              isTransitioning ? 'scale-105 opacity-90' : 'scale-100 opacity-100'
            )}
          />
          {/* Subtle overlay for text readability on mobile */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
        </div>

        {/* Text Content Section */}
        <div className={cn(
          'relative order-1 lg:order-2 flex items-center justify-center lg:justify-start p-8 lg:p-12 xl:p-16',
          'bg-gradient-to-r from-black/95 via-black/80 to-black/60',
          'lg:bg-gradient-to-l lg:from-black/95 lg:via-black/70 lg:to-transparent',
          'transition-all duration-500 ease-out',
          isTransitioning ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'
        )}>
          <div className="max-w-2xl xl:max-w-3xl text-center lg:text-left">
            {currentPiano.badge && (
              <div className="inline-block bg-kawai-red text-white px-4 py-2 rounded-full text-sm font-medium mb-4 lg:mb-6">
                {currentPiano.badge}
              </div>
            )}
            <h3 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-3 lg:mb-4 tracking-tight leading-tight">
              {currentPiano.name}
            </h3>
            <p className="text-xl lg:text-2xl xl:text-3xl text-kawai-red font-medium mb-4 lg:mb-6">
              {currentPiano.category}
            </p>
            <p className="text-base lg:text-lg xl:text-xl text-white/90 leading-relaxed mb-8 lg:mb-10 max-w-xl lg:max-w-2xl mx-auto lg:mx-0">
              {currentPiano.description}
            </p>
            <Link
              href={`/pianos/${currentPiano.category.toLowerCase().replace(/\s+/g, '-')}`}
              className="inline-flex items-center px-6 py-3 lg:px-8 lg:py-4 bg-white hover:bg-kawai-pearl text-kawai-black font-medium rounded-md transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 group text-base lg:text-lg"
            >
              <span>Discover {currentPiano.name}</span>
              <ArrowRight className="w-5 h-5 ml-3 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {models.length > 1 && (
        <>
          <button
            onClick={prevPiano}
            disabled={isTransitioning}
            className="absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 w-12 h-12 lg:w-14 lg:h-14 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 disabled:opacity-50 z-10"
            aria-label="Previous piano"
          >
            <ChevronLeft className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
          </button>
          
          <button
            onClick={nextPiano}
            disabled={isTransitioning}
            className="absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 w-12 h-12 lg:w-14 lg:h-14 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 disabled:opacity-50 z-10"
            aria-label="Next piano"
          >
            <ChevronRight className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
          </button>

          {/* Dot Indicators */}
          <div className="absolute bottom-4 lg:bottom-6 left-1/2 -translate-x-1/2 lg:left-auto lg:right-8 lg:translate-x-0 flex space-x-2 z-10">
            {models.map((_, index) => (
              <button
                key={index}
                onClick={() => goToPiano(index)}
                disabled={isTransitioning}
                className={cn(
                  'w-3 h-3 lg:w-4 lg:h-4 rounded-full transition-all duration-300',
                  index === currentIndex
                    ? 'bg-kawai-red scale-125'
                    : 'bg-white/50 hover:bg-white/70'
                )}
                aria-label={`Go to piano ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}