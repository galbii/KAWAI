'use client'

import React, { useState, useCallback, useEffect, useMemo } from 'react'
import type { Media } from '@/payload-types'
import type { MediaGalleryProps } from '@/lib/media/types'
import { ResponsiveImage } from './ResponsiveImage'
import { MediaLightbox } from './MediaLightbox'
import { cn } from '@/lib/utils'

/**
 * Flexible media gallery component optimized for piano imagery
 * Supports grid, masonry, carousel, and lightbox layouts
 */
export const MediaGallery: React.FC<MediaGalleryProps> = ({
  media,
  variant = 'grid',
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  aspectRatio = 4/3,
  gap = 16,
  showCaptions = true,
  showThumbnails = false,
  enableLightbox = true,
  enableZoom = true,
  lazyLoad = true,
  onMediaSelect,
  className
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(-1)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set())

  // Normalize columns to object format
  const normalizedColumns = useMemo(() => {
    if (typeof columns === 'number') {
      return { mobile: 1, tablet: Math.max(1, Math.floor(columns / 2)), desktop: columns }
    }
    return columns
  }, [columns])

  // Filter out invalid media items
  const validMedia = useMemo(() => {
    return media.filter(item => {
      const url = typeof item === 'string' ? item : item.url
      return url && url.length > 0
    })
  }, [media])

  // Handle media selection
  const handleMediaClick = useCallback((index: number) => {
    setSelectedIndex(index)
    onMediaSelect?.(validMedia[index], index)
    
    if (enableLightbox) {
      setIsLightboxOpen(true)
    }
  }, [validMedia, onMediaSelect, enableLightbox])

  // Handle lightbox navigation
  const handleLightboxNext = useCallback(() => {
    setSelectedIndex(prev => (prev + 1) % validMedia.length)
  }, [validMedia.length])

  const handleLightboxPrevious = useCallback(() => {
    setSelectedIndex(prev => (prev - 1 + validMedia.length) % validMedia.length)
  }, [validMedia.length])

  const handleLightboxClose = useCallback(() => {
    setIsLightboxOpen(false)
  }, [])

  // Handle image load tracking
  const handleImageLoad = useCallback((index: number) => {
    setLoadedImages(prev => new Set(prev).add(index))
  }, [])

  // Keyboard navigation
  useEffect(() => {
    if (!isLightboxOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault()
          handleLightboxPrevious()
          break
        case 'ArrowRight':
          event.preventDefault()
          handleLightboxNext()
          break
        case 'Escape':
          event.preventDefault()
          handleLightboxClose()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isLightboxOpen, handleLightboxNext, handleLightboxPrevious, handleLightboxClose])

  // Generate grid styles
  const gridStyles = useMemo(() => {
    const styles: React.CSSProperties = {
      gap: `${gap}px`,
      gridTemplateColumns: `repeat(${normalizedColumns.mobile}, 1fr)`
    }

    return {
      ...styles,
      '@media (min-width: 768px)': {
        gridTemplateColumns: `repeat(${normalizedColumns.tablet}, 1fr)`
      },
      '@media (min-width: 1024px)': {
        gridTemplateColumns: `repeat(${normalizedColumns.desktop}, 1fr)`
      }
    }
  }, [gap, normalizedColumns])

  // Masonry layout calculation
  const masonryItems = useMemo(() => {
    if (variant !== 'masonry') return []

    const columnCount = normalizedColumns.desktop
    const items: Array<{ media: Media | string; index: number; height: number }> = []
    
    validMedia.forEach((item, index) => {
      // Simulate different heights for masonry effect
      const baseHeight = 300
      const randomMultiplier = 0.7 + (Math.random() * 0.6) // 0.7 to 1.3
      const height = Math.floor(baseHeight * randomMultiplier)
      
      items.push({ media: item, index, height })
    })

    return items
  }, [variant, validMedia, normalizedColumns.desktop])

  if (validMedia.length === 0) {
    return (
      <div className={cn('flex items-center justify-center p-8 text-muted-foreground', className)}>
        <p>No media available</p>
      </div>
    )
  }

  // Grid Layout
  if (variant === 'grid') {
    return (
      <>
        <div
          className={cn(
            'grid auto-rows-fr',
            `grid-cols-${normalizedColumns.mobile}`,
            `md:grid-cols-${normalizedColumns.tablet}`,
            `lg:grid-cols-${normalizedColumns.desktop}`,
            className
          )}
          style={{ gap: `${gap}px` }}
        >
          {validMedia.map((item, index) => {
            const isImage = typeof item === 'string' || item.mediaType !== 'video'
            
            return (
              <div
                key={index}
                className={cn(
                  'relative group cursor-pointer overflow-hidden rounded-lg',
                  'transform transition-transform duration-200 hover:scale-105',
                  'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
                )}
                style={{ aspectRatio }}
                onClick={() => handleMediaClick(index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleMediaClick(index)
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`View ${typeof item === 'string' ? 'media' : item.alt || 'media'} ${index + 1}`}
              >
                {isImage ? (
                  <ResponsiveImage
                    media={item}
                    preset="gallery"
                    priority={index < 4}
                    placeholder={lazyLoad}
                    className="w-full h-full object-cover"
                    onLoad={() => handleImageLoad(index)}
                  />
                ) : (
                  <video
                    src={typeof item === 'string' ? item : item.url || ''}
                    poster={typeof item === 'object' && item && 'videoMeta' in item && typeof item !== 'string' ? (item as any)?.videoMeta?.thumbnail?.url || undefined : undefined}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                  />
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />

                {/* Play icon for videos */}
                {!isImage && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black/60 rounded-full p-3 transform scale-90 group-hover:scale-100 transition-transform duration-200">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}

                {/* Caption */}
                {showCaptions && typeof item === 'object' && item.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <p className="text-white text-sm line-clamp-2">{item.caption}</p>
                  </div>
                )}

                {/* Loading indicator */}
                {lazyLoad && !loadedImages.has(index) && (
                  <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
                    <div className="w-8 h-8 bg-muted-foreground/20 rounded" />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Lightbox */}
        {enableLightbox && isLightboxOpen && selectedIndex >= 0 && (
          <MediaLightbox
            media={validMedia}
            currentIndex={selectedIndex}
            isOpen={isLightboxOpen}
            onClose={handleLightboxClose}
            onNext={handleLightboxNext}
            onPrevious={handleLightboxPrevious}
            showThumbnails={showThumbnails}
            showCaption={showCaptions}
            enableZoom={enableZoom}
          />
        )}
      </>
    )
  }

  // Masonry Layout
  if (variant === 'masonry') {
    return (
      <>
        <div
          className={cn(
            'columns-1 md:columns-2 lg:columns-3 xl:columns-4',
            className
          )}
          style={{ gap: `${gap}px` }}
        >
          {masonryItems.map(({ media: item, index, height }) => {
            const isImage = typeof item === 'string' || item.mediaType !== 'video'
            
            return (
              <div
                key={index}
                className={cn(
                  'relative group cursor-pointer overflow-hidden rounded-lg mb-4',
                  'transform transition-transform duration-200 hover:scale-105',
                  'break-inside-avoid'
                )}
                style={{ height: `${height}px` }}
                onClick={() => handleMediaClick(index)}
              >
                {isImage ? (
                  <ResponsiveImage
                    media={item}
                    preset="gallery"
                    priority={index < 6}
                    placeholder={lazyLoad}
                    className="w-full h-full object-cover"
                    onLoad={() => handleImageLoad(index)}
                  />
                ) : (
                  <video
                    src={typeof item === 'string' ? item : item.url || ''}
                    poster={typeof item === 'object' && item && 'videoMeta' in item && typeof item !== 'string' ? (item as any)?.videoMeta?.thumbnail?.url || undefined : undefined}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                  />
                )}

                {/* Overlay and caption similar to grid */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
                
                {showCaptions && typeof item === 'object' && item.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <p className="text-white text-sm line-clamp-2">{item.caption}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Lightbox */}
        {enableLightbox && isLightboxOpen && selectedIndex >= 0 && (
          <MediaLightbox
            media={validMedia}
            currentIndex={selectedIndex}
            isOpen={isLightboxOpen}
            onClose={handleLightboxClose}
            onNext={handleLightboxNext}
            onPrevious={handleLightboxPrevious}
            showThumbnails={showThumbnails}
            showCaption={showCaptions}
            enableZoom={enableZoom}
          />
        )}
      </>
    )
  }

  // Carousel Layout
  if (variant === 'carousel') {
    return (
      <div className={cn('relative', className)}>
        <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory">
          {validMedia.map((item, index) => {
            const isImage = typeof item === 'string' || item.mediaType !== 'video'
            
            return (
              <div
                key={index}
                className={cn(
                  'relative flex-shrink-0 cursor-pointer overflow-hidden rounded-lg',
                  'w-80 transform transition-transform duration-200 hover:scale-105',
                  'snap-start'
                )}
                style={{ aspectRatio }}
                onClick={() => handleMediaClick(index)}
              >
                {isImage ? (
                  <ResponsiveImage
                    media={item}
                    preset="gallery"
                    priority={index < 3}
                    placeholder={lazyLoad}
                    className="w-full h-full object-cover"
                    onLoad={() => handleImageLoad(index)}
                  />
                ) : (
                  <video
                    src={typeof item === 'string' ? item : item.url || ''}
                    poster={typeof item === 'object' && item && 'videoMeta' in item && typeof item !== 'string' ? (item as any)?.videoMeta?.thumbnail?.url || undefined : undefined}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                  />
                )}

                {showCaptions && typeof item === 'object' && item.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <p className="text-white text-sm line-clamp-2">{item.caption}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Lightbox */}
        {enableLightbox && isLightboxOpen && selectedIndex >= 0 && (
          <MediaLightbox
            media={validMedia}
            currentIndex={selectedIndex}
            isOpen={isLightboxOpen}
            onClose={handleLightboxClose}
            onNext={handleLightboxNext}
            onPrevious={handleLightboxPrevious}
            showThumbnails={showThumbnails}
            showCaption={showCaptions}
            enableZoom={enableZoom}
          />
        )}
      </div>
    )
  }

  return null
}

MediaGallery.displayName = 'MediaGallery'