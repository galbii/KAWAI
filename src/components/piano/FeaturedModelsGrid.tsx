'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
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

interface FeaturedModelsGridProps {
  models: LegacyFeaturedModel[]
}

export function FeaturedModelsGrid({ models }: FeaturedModelsGridProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [direction, setDirection] = useState<'left' | 'right'>('right')
  const touchStartX = useRef<number>(0)
  const touchEndX = useRef<number>(0)

  if (models.length === 0) {
    return <FeaturedCarouselSkeleton />
  }

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || models.length <= 1) return

    const interval = setInterval(() => {
      setDirection('right')
      setCurrentIndex((prev) => (prev + 1) % models.length)
    }, 5000) // Change every 5 seconds

    return () => clearInterval(interval)
  }, [isPlaying, models.length])

  const goToNext = () => {
    setDirection('right')
    setCurrentIndex((prev) => (prev + 1) % models.length)
    setIsPlaying(false)
  }

  const goToPrevious = () => {
    setDirection('left')
    setCurrentIndex((prev) => (prev - 1 + models.length) % models.length)
    setIsPlaying(false)
  }

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 'right' : 'left')
    setCurrentIndex(index)
    setIsPlaying(false)
  }

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX || 0
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0]?.clientX || 0
  }

  const handleTouchEnd = () => {
    const swipeDistance = touchStartX.current - touchEndX.current
    const minSwipeDistance = 50

    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
        goToNext()
      } else {
        goToPrevious()
      }
    }
  }

  const currentModel = models[currentIndex]

  if (!currentModel) return <FeaturedCarouselSkeleton />

  return (
    <div className="relative">
      {/* Main Carousel */}
      <div
        className="relative overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="grid lg:grid-cols-2 min-h-[500px]">
            {/* Image Side - Left */}
            <div className="relative min-h-[300px] lg:min-h-full order-1">
              <div className="relative w-full h-full bg-kawai-pearl">
                <MediaRenderer
                  media={currentModel.image}
                  preset="hero"
                  priority={currentIndex === 0}
                  className="absolute inset-0 object-cover w-full h-full"
                />

                {/* Badge */}
                {currentModel.badge && (
                  <div className="absolute top-6 left-6 bg-kawai-red text-white px-4 py-2 rounded-full text-sm font-bold tracking-wide shadow-lg z-10">
                    {currentModel.badge}
                  </div>
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-kawai-black/30 via-transparent to-transparent lg:hidden" />
              </div>
            </div>

            {/* Content Side - Right */}
            <div className="relative flex flex-col justify-center p-8 sm:p-10 lg:p-12 xl:p-16 order-2 bg-white">
              <div className="space-y-6">
                {/* Category */}
                <div>
                  <span className="inline-block px-4 py-2 text-xs font-bold tracking-[0.2em] uppercase bg-kawai-red/10 text-kawai-red rounded-full">
                    {currentModel.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-light font-serif text-kawai-black leading-tight">
                  {currentModel.name}
                </h3>

                {/* Description */}
                <p className="text-lg sm:text-xl text-kawai-black/70 leading-relaxed">
                  {currentModel.description}
                </p>

                {/* CTA Button */}
                <div className="pt-4">
                  <Link
                    href={`/pianos/${currentModel.category.toLowerCase().replace(/\s+/g, '-')}`}
                    className="inline-flex items-center space-x-3 bg-kawai-red hover:bg-kawai-red/90 text-white px-8 py-4 rounded-full font-medium text-sm tracking-wide uppercase transition-all duration-300 shadow-lg hover:shadow-xl group"
                  >
                    <span>Discover {currentModel.name}</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>

              {/* Slide Counter - Desktop */}
              <div className="hidden lg:block absolute bottom-8 left-12 xl:left-16">
                <div className="text-sm text-kawai-black/40 font-medium">
                  <span className="text-kawai-red text-2xl font-bold">{String(currentIndex + 1).padStart(2, '0')}</span>
                  {' / '}
                  <span>{String(models.length).padStart(2, '0')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between mt-8">
        {/* Navigation Arrows */}
        <div className="flex items-center space-x-3">
          <button
            onClick={goToPrevious}
            className="w-12 h-12 sm:w-14 sm:h-14 bg-white hover:bg-kawai-red text-kawai-black hover:text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl border border-kawai-pearl hover:border-kawai-red group"
            aria-label="Previous model"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:-translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={goToNext}
            className="w-12 h-12 sm:w-14 sm:h-14 bg-white hover:bg-kawai-red text-kawai-black hover:text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl border border-kawai-pearl hover:border-kawai-red group"
            aria-label="Next model"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Slide Counter - Mobile */}
          <div className="lg:hidden ml-2">
            <div className="text-sm text-kawai-black/40 font-medium">
              <span className="text-kawai-red text-lg font-bold">{String(currentIndex + 1).padStart(2, '0')}</span>
              {' / '}
              <span>{String(models.length).padStart(2, '0')}</span>
            </div>
          </div>
        </div>

        {/* Dot Indicators */}
        <div className="flex items-center space-x-2">
          {models.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 ${
                index === currentIndex
                  ? 'w-8 h-2 bg-kawai-red'
                  : 'w-2 h-2 bg-kawai-black/20 hover:bg-kawai-black/40'
              } rounded-full`}
              aria-label={`Go to model ${index + 1}`}
            />
          ))}
        </div>

        {/* Play/Pause Button */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-12 h-12 sm:w-14 sm:h-14 bg-white hover:bg-kawai-red text-kawai-black hover:text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl border border-kawai-pearl hover:border-kawai-red"
          aria-label={isPlaying ? 'Pause autoplay' : 'Play autoplay'}
        >
          {isPlaying ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}