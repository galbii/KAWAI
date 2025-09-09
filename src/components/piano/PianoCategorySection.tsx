'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { MediaRenderer } from '@/components/ui/media/MediaRenderer'
import { CategoryIcon } from '@/components/ui/icons/CategoryIcon'
import { CategoryImageGrid } from '@/components/piano/CategoryImageGrid'
import { cn } from '@/lib/utils'

export interface LegacyPianoCategory {
  slug: string
  name: string
  description: string
  image: string
  models: string[]
  priceRange: string
  features: string[]
  icon: string
  badge: string
  highlight: string
  galleryImage1?: any // Media object or string
  galleryImage2?: any // Media object or string
  galleryImage3?: any // Media object or string
}

interface PianoCategorySectionProps {
  category: LegacyPianoCategory
  index: number
}

export function PianoCategorySection({ category, index }: PianoCategorySectionProps) {
  const [isImageVisible, setIsImageVisible] = useState(false)
  const [isTextVisible, setIsTextVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsImageVisible(true)
          setTimeout(() => {
            setIsTextVisible(true)
          }, 300)
        }
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const isEven = index % 2 === 0

  return (
    <section 
      ref={sectionRef}
      className="min-h-[60vh] flex items-center py-8"
    >
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className={cn(
          'grid lg:grid-cols-2 gap-8 lg:gap-12 items-center',
          isEven ? '' : 'lg:grid-flow-col-dense'
        )}>
          {/* Content */}
          <div className={cn('space-y-6', isEven ? '' : 'lg:col-start-2')}>
            <div className={cn(
              'space-y-4 transition-all duration-700 ease-out',
              isTextVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            )}>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-kawai-black">
                {category.name}
              </h2>
              
              <p className="text-lg md:text-xl leading-relaxed text-kawai-black/80 max-w-2xl">
                {category.description}
              </p>
            </div>
            
            <div className={cn(
              'pt-2 transition-all duration-700 ease-out delay-100',
              isTextVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            )}>
              <Link
                href={`/pianos/${category.slug}`}
                className="inline-flex items-center px-8 py-4 bg-kawai-black hover:bg-kawai-black/80 text-kawai-pearl font-medium rounded-md transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 group text-lg"
              >
                <span>Explore {category.name}</span>
                <ArrowRight className="w-5 h-5 ml-3 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Image/Icon */}
          <div className={cn('relative', isEven ? '' : 'lg:col-start-1')}>
            <div className={cn(
              'relative transition-all duration-800 ease-out',
              isImageVisible 
                ? 'opacity-100 translate-x-0' 
                : `opacity-0 ${isEven ? 'translate-x-12' : '-translate-x-12'}`
            )}>
              {category.image ? (
                <div className="aspect-[4/3] rounded-2xl overflow-hidden relative">
                  <MediaRenderer
                    media={category.image}
                    preset="gallery"
                    className="absolute inset-0 hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="aspect-[4/3] bg-gradient-to-br from-kawai-neutral/20 to-kawai-neutral/40 rounded-2xl flex items-center justify-center relative overflow-hidden hover:from-kawai-neutral/30 hover:to-kawai-neutral/50 transition-all duration-300">
                  <CategoryIcon 
                    iconName={category.icon} 
                    className="h-28 w-28 text-kawai-black/50 transition-transform duration-300 hover:scale-110" 
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Category Gallery Images */}
        <CategoryImageGrid 
          galleryImage1={category.galleryImage1}
          galleryImage2={category.galleryImage2}
          galleryImage3={category.galleryImage3}
          category={category.slug}
          fallbackToPlaceholder={true}
        />
      </div>
    </section>
  )
}