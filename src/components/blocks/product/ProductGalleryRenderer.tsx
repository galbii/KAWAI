import React from 'react'
import Image from 'next/image'
import type { ProductImageGalleryBlock } from '@/payload-types'
import { getImagePropsWithFallback } from '@/lib/media/r2-utils'
import { cn } from '@/lib/utils'

interface ProductGalleryRendererProps extends ProductImageGalleryBlock {}

export function ProductGalleryRenderer({
  title,
  description,
  images,
  layout,
  showCaptions,
}: ProductGalleryRendererProps) {
  if (!images || images.length === 0) {
    return null
  }

  // Columns class mapping
  const columnsClasses = {
    two: 'md:grid-cols-2',
    three: 'md:grid-cols-3',
    four: 'md:grid-cols-4',
    five: 'md:grid-cols-5',
  }

  // Spacing class mapping
  const spacingClasses = {
    none: 'gap-0',
    small: 'gap-2',
    medium: 'gap-4',
    large: 'gap-8',
  }

  // Aspect ratio class mapping
  const aspectRatioClasses = {
    original: '',
    square: 'aspect-square',
    landscape: 'aspect-video',
    portrait: 'aspect-[3/4]',
  }

  const columns = layout?.columns || 'three'
  const spacing = layout?.spacing || 'medium'
  const aspectRatio = layout?.aspectRatio || 'original'
  const style = layout?.style || 'grid'

  return (
    <section className="my-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {(title || description) && (
          <div className="text-center mb-8">
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Gallery Grid */}
        {style === 'grid' && (
          <div className={cn(
            'grid grid-cols-1',
            columnsClasses[columns as keyof typeof columnsClasses],
            spacingClasses[spacing as keyof typeof spacingClasses]
          )}>
            {images.map((item, index) => (
              <div key={index} className="group relative overflow-hidden rounded-lg">
                <div className={cn(
                  'relative w-full',
                  aspectRatioClasses[aspectRatio as keyof typeof aspectRatioClasses] || 'aspect-video'
                )}>
                  {(() => {
                    const imageProps = getImagePropsWithFallback(
                      item.image,
                      '/images/defaults/gallery-placeholder.jpg',
                      'gallery',
                      { fill: true, priority: index === 0 }
                    )
                    return (
                      <Image
                        {...imageProps}
                        alt={item.alt || item.caption || title || 'Piano gallery image'}
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    )
                  })()}
                </div>
                {showCaptions && item.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <p className="text-white text-sm">
                      {item.caption}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Masonry Layout */}
        {style === 'masonry' && (
          <div className={cn(
            'columns-1',
            columns === 'two' && 'md:columns-2',
            columns === 'three' && 'md:columns-3',
            columns === 'four' && 'md:columns-4',
            columns === 'five' && 'md:columns-5',
            spacingClasses[spacing as keyof typeof spacingClasses]
          )}>
            {images.map((item, index) => (
              <div key={index} className="mb-4 break-inside-avoid">
                <div className="relative overflow-hidden rounded-lg">
                  {(() => {
                    const imageProps = getImagePropsWithFallback(
                      item.image,
                      '/images/defaults/gallery-placeholder.jpg',
                      'gallery',
                      { priority: index === 0 }
                    )
                    return (
                      <Image
                        {...imageProps}
                        alt={item.alt || item.caption || title || 'Piano gallery image'}
                        className="w-full h-auto"
                      />
                    )
                  })()}
                </div>
                {showCaptions && item.caption && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {item.caption}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
