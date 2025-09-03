'use client'

import { MediaRenderer } from '@/components/ui/media/MediaRenderer'
import { MediaLightbox } from '@/components/ui/media/MediaLightbox'
import { Media } from '@/payload-types'
import { useState } from 'react'

interface ImageGalleryBlockProps {
  dataSource?: 'manual' | 'pianomodel' | 'hybrid' | null
  pianoModel?: any
  images?: Array<{
    image: string | Media
    caption?: string | null
    alt?: string | null
  }> | null
  layout?: {
    columns?: number | null
    aspectRatio?: string | null
    showCaptions?: boolean | null
    lightbox?: boolean | null
  }
}

export function ImageGalleryBlock({
  images = [],
  layout = {}
}: ImageGalleryBlockProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImage, setCurrentImage] = useState(0)
  
  if (!images || images.length === 0) {
    return null
  }
  
  const columns = layout.columns || 3
  const aspectRatio = layout.aspectRatio || '4/3'
  const showCaptions = layout.showCaptions !== false
  const lightbox = layout.lightbox !== false
  
  // Column classes for responsive grid
  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
  }
  
  const gridClass = columnClasses[Math.min(columns, 6) as keyof typeof columnClasses] || columnClasses[3]
  
  const handleImageClick = (index: number) => {
    if (lightbox) {
      setCurrentImage(index)
      setLightboxOpen(true)
    }
  }
  
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className={`grid ${gridClass} gap-6`}>
          {images.map((item, index) => (
            <div key={index} className="space-y-3">
              <div 
                className={`relative overflow-hidden rounded-lg shadow-lg ${lightbox ? 'cursor-pointer' : ''} group`}
                onClick={() => handleImageClick(index)}
              >
                <MediaRenderer 
                  media={item.image}
                  preset="gallery"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  aria-label={item.alt || item.caption || `Gallery image ${index + 1}`}
                />
                
                {/* Hover overlay for lightbox */}
                {lightbox && (
                  <div className="absolute inset-0 bg-kawai-black/0 group-hover:bg-kawai-black/20 transition-colors duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Caption */}
              {showCaptions && item.caption && (
                <p className="text-sm text-kawai-black/70 text-center italic">
                  {item.caption}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Lightbox */}
      {lightbox && (
        <MediaLightbox
          media={images.map(item => item.image)}
          currentIndex={currentImage}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          onNext={() => setCurrentImage((prev) => (prev + 1) % images.length)}
          onPrevious={() => setCurrentImage((prev) => (prev - 1 + images.length) % images.length)}
        />
      )}
    </section>
  )
}