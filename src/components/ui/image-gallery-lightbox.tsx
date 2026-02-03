'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface GalleryImage {
  url: string
  alt?: string
  width?: number
  height?: number
}

interface ImageGalleryLightboxProps {
  images: GalleryImage[]
  initialIndex?: number
  isOpen: boolean
  onClose: () => void
}

export function ImageGalleryLightbox({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
}: ImageGalleryLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50

  // Reset to initial index when opening
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex)
      setIsImageLoaded(false)
    }
  }, [isOpen, initialIndex])

  // Reset image loaded state when index changes
  useEffect(() => {
    setIsImageLoaded(false)
  }, [currentIndex])

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }, [images.length])

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }, [images.length])

  const goToIndex = useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowLeft') {
        goToPrevious()
      } else if (e.key === 'ArrowRight') {
        goToNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, goToPrevious, goToNext])

  // Touch handlers for swipe
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    const touch = e.targetTouches[0]
    if (touch) {
      setTouchStart(touch.clientX)
    }
  }

  const onTouchMove = (e: React.TouchEvent) => {
    const touch = e.targetTouches[0]
    if (touch) {
      setTouchEnd(touch.clientX)
    }
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      goToNext()
    } else if (isRightSwipe) {
      goToPrevious()
    }
  }

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen || images.length === 0) return null

  const currentImage = images[currentIndex]
  if (!currentImage) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{
        animation: 'fadeIn 0.3s ease-out',
      }}
    >
      {/* Backdrop with stronger vignette effect */}
      <div
        className="absolute inset-0 bg-black/98"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.6) 100%)',
        }}
        onClick={onClose}
      />

      {/* Close Button - Top Left (Editorial Style) */}
      <button
        onClick={onClose}
        className="absolute top-6 left-6 z-50 group"
        aria-label="Close gallery"
      >
        <div className="relative">
          {/* Glow effect on hover */}
          <div className="absolute inset-0 bg-white/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/10 bg-black/30 backdrop-blur-sm transition-all duration-300 group-hover:border-white/40 group-hover:bg-black/60">
            <X className="w-4 h-4 md:w-5 md:h-5 text-white/70 group-hover:text-white transition-colors" />
          </div>
        </div>
      </button>

      {/* Image Counter - Top Right */}
      <div className="absolute top-6 right-6 z-50">
        <div className="px-4 py-2 md:px-6 md:py-3 rounded-full border border-white/10 bg-black/30 backdrop-blur-sm">
          <span className="text-white/70 font-serif text-xs md:text-sm tracking-wider">
            {String(currentIndex + 1).padStart(2, '0')}
            <span className="text-white/30 mx-1 md:mx-2">/</span>
            {String(images.length).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Main Image Container */}
      <div
        className="relative w-full h-full flex items-center justify-center px-2 md:px-8 py-20 md:py-16"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Previous Button */}
        {images.length > 1 && (
          <button
            onClick={goToPrevious}
            className="absolute left-2 md:left-8 z-40 group"
            aria-label="Previous image"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-kawai-red/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/10 bg-black/30 backdrop-blur-sm transition-all duration-300 group-hover:border-kawai-red/60 group-hover:bg-kawai-red/20 group-hover:scale-110">
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white/70 group-hover:text-white transition-colors" />
              </div>
            </div>
          </button>
        )}

        {/* Image */}
        <div className="relative w-full h-full max-w-[95vw] max-h-[88vh] flex items-center justify-center">
          <div
            className={cn(
              'relative w-full h-full transition-opacity duration-500',
              isImageLoaded ? 'opacity-100' : 'opacity-0'
            )}
            style={{
              animation: isImageLoaded ? 'imageReveal 0.6s ease-out' : 'none',
            }}
          >
            <Image
              src={currentImage.url}
              alt={currentImage.alt || `Image ${currentIndex + 1}`}
              fill
              className="object-contain drop-shadow-2xl"
              sizes="95vw"
              quality={100}
              priority
              onLoad={() => setIsImageLoaded(true)}
            />
          </div>

          {/* Loading indicator */}
          {!isImageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Next Button */}
        {images.length > 1 && (
          <button
            onClick={goToNext}
            className="absolute right-2 md:right-8 z-40 group"
            aria-label="Next image"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-kawai-red/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/10 bg-black/30 backdrop-blur-sm transition-all duration-300 group-hover:border-kawai-red/60 group-hover:bg-kawai-red/20 group-hover:scale-110">
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white/70 group-hover:text-white transition-colors" />
              </div>
            </div>
          </button>
        )}
      </div>

      {/* Thumbnail Strip - Bottom (More Subtle) */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 z-40">
          <div className="flex items-center justify-center gap-2 px-4 overflow-x-auto pb-2 scrollbar-hide">
            <div className="flex gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => goToIndex(index)}
                  className={cn(
                    'relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-md overflow-hidden border transition-all duration-300',
                    index === currentIndex
                      ? 'border-kawai-red/80 scale-105 shadow-lg shadow-kawai-red/20 opacity-100'
                      : 'border-white/10 hover:border-white/30 opacity-50 hover:opacity-80'
                  )}
                  aria-label={`Go to image ${index + 1}`}
                >
                  <Image
                    src={image.url}
                    alt={image.alt || `Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />

                  {/* Active indicator overlay */}
                  {index === currentIndex && (
                    <div className="absolute inset-0 bg-kawai-red/15" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CSS Keyframes */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes imageReveal {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
