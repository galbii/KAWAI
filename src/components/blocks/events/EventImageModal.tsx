'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogPortal,
} from '@/components/ui/dialog'
import * as DialogPrimitive from '@radix-ui/react-dialog'

interface EventImage {
  url: string
  alt: string
}

interface EventImageModalProps {
  images: EventImage[]
  isOpen: boolean
  onClose: () => void
  initialIndex?: number
}

export const EventImageModal: React.FC<EventImageModalProps> = ({
  images,
  isOpen,
  onClose,
  initialIndex = 0,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const hasMultipleImages = images.length > 1

  // Reset to initial index when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex)
    }
  }, [isOpen, initialIndex])

  // Navigation handlers
  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }, [images.length])

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }, [images.length])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goToPrevious()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        goToNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, goToPrevious, goToNext])

  // Body scroll lock
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

  if (images.length === 0) return null

  const currentImage = images[currentIndex]
  if (!currentImage) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogPortal>
        {/* Custom overlay with higher opacity - above announcement bar (z-60) */}
        <DialogPrimitive.Overlay
          className="fixed inset-0 z-[70] bg-black/95 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        />

        {/* Full-screen content */}
        <DialogPrimitive.Content
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-8"
          onEscapeKeyDown={onClose}
        >
          {/* Close button with ESC hint */}
          <DialogPrimitive.Close
            className="absolute right-4 top-4 z-10 flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-white opacity-70 backdrop-blur-sm transition-all hover:bg-white/20 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
            onClick={onClose}
          >
            <XMarkIcon className="h-5 w-5" />
            <span className="hidden text-xs uppercase tracking-wider sm:inline">ESC</span>
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>

          {/* Main image container */}
          <div className="relative flex h-full w-full max-w-7xl items-center justify-center">
            {/* Previous button */}
            {hasMultipleImages && (
              <button
                onClick={goToPrevious}
                className={cn(
                  'absolute left-0 z-10 rounded-md bg-white/10 p-3 text-white backdrop-blur-sm transition-all hover:bg-white/20',
                  'hidden md:block',
                  'focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black'
                )}
                aria-label="Previous image"
              >
                <ChevronLeftIcon className="h-8 w-8" />
              </button>
            )}

            {/* Image */}
            <div className="relative h-full w-full">
              <Image
                src={currentImage.url}
                alt={currentImage.alt}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>

            {/* Next button */}
            {hasMultipleImages && (
              <button
                onClick={goToNext}
                className={cn(
                  'absolute right-0 z-10 rounded-md bg-white/10 p-3 text-white backdrop-blur-sm transition-all hover:bg-white/20',
                  'hidden md:block',
                  'focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black'
                )}
                aria-label="Next image"
              >
                <ChevronRightIcon className="h-8 w-8" />
              </button>
            )}
          </div>

          {/* Bottom indicators and counter */}
          {hasMultipleImages && (
            <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3">
              {/* Dot indicators */}
              <div className="flex items-center gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={cn(
                      'h-2 w-2 rounded-full transition-all',
                      index === currentIndex
                        ? 'bg-[#C41E3A] w-8'
                        : 'bg-white/40 hover:bg-white/60'
                    )}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>

              {/* Counter */}
              <div className="rounded-md bg-white/10 px-3 py-1 text-xs text-white backdrop-blur-sm">
                {currentIndex + 1} of {images.length}
              </div>
            </div>
          )}

          {/* Mobile swipe hint */}
          {hasMultipleImages && (
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-xs text-white/60 md:hidden">
              Swipe to navigate
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  )
}

EventImageModal.displayName = 'EventImageModal'
