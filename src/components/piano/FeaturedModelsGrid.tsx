'use client'

import React from 'react'
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
  if (models.length === 0) {
    return <FeaturedCarouselSkeleton />
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-12">
      {models.map((model, index) => (
        <div
          key={`${model.name}-${index}`}
          className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
        >
          {/* Image Container */}
          <div className="relative aspect-[4/3] overflow-hidden bg-kawai-pearl">
            <MediaRenderer
              media={model.image}
              preset="gallery"
              priority={index < 3}
              className="absolute inset-0 object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
            />
            
            {/* Badge */}
            {model.badge && (
              <div className="absolute top-4 left-4 bg-kawai-red text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                {model.badge}
              </div>
            )}
            
            {/* Subtle gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Content */}
          <div className="p-6 lg:p-8">
            <div className="mb-3">
              <h3 className="text-2xl lg:text-3xl font-bold text-kawai-black mb-2 group-hover:text-kawai-red transition-colors duration-300">
                {model.name}
              </h3>
              <p className="text-kawai-red font-medium text-base lg:text-lg">
                {model.category}
              </p>
            </div>
            
            <p className="text-kawai-black/70 leading-relaxed mb-6 text-sm lg:text-base">
              {model.description.length > 120 
                ? `${model.description.substring(0, 120)}...` 
                : model.description
              }
            </p>
            
            <Link
              href={`/pianos/${model.category.toLowerCase().replace(/\s+/g, '-')}`}
              className="inline-flex items-center text-kawai-black hover:text-kawai-red font-medium transition-all duration-300 group/link"
            >
              <span>Discover {model.name}</span>
              <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover/link:translate-x-1" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}