'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import type { Media } from '@/payload-types'
import type { MediaLightboxProps, TouchGestureState } from '@/lib/media/types'
import { ResponsiveImage } from './ResponsiveImage'
import { VideoPlayer } from './VideoPlayer'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

/**
 * Advanced lightbox component with zoom, pan, and touch gestures
 * Optimized for piano imagery viewing experience
 */
export const MediaLightbox: React.FC<MediaLightboxProps> = ({
  media,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrevious,
  showThumbnails = true,
  showCaption = true,
  enableZoom = true,
  className
}) => {
  const [gestureState, setGestureState] = useState<TouchGestureState>({
    scale: 1,
    translateX: 0,
    translateY: 0,
    isDragging: false,
    isZooming: false
  })
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const lightboxRef = useRef<HTMLDivElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const thumbnailsRef = useRef<HTMLDivElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)

  const currentMedia = currentIndex >= 0 && currentIndex < media.length ? media[currentIndex] : null
  const isVideo = typeof currentMedia === 'object' && currentMedia !== null && currentMedia.mediaType === 'video'

  // Reset gesture state when media changes
  useEffect(() => {
    setGestureState({
      scale: 1,
      translateX: 0,
      translateY: 0,
      isDragging: false,
      isZooming: false
    })
    setIsImageLoaded(false)
  }, [currentIndex])

  // Handle escape key and outside click
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (lightboxRef.current && !lightboxRef.current.contains(event.target as Node)) {
        if (gestureState.scale === 1) {
          onClose()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleClickOutside)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose, gestureState.scale])

  // A11y: initial focus, Tab focus trap, focus restore (kept separate so it does
  // not re-run on zoom/scale changes and steal focus)
  useEffect(() => {
    if (!isOpen) return
    previouslyFocused.current = document.activeElement as HTMLElement | null
    lightboxRef.current?.focus()

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !lightboxRef.current) return
      const focusable = lightboxRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (!first || !last) return
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleTab)
    return () => {
      document.removeEventListener('keydown', handleTab)
      previouslyFocused.current?.focus?.()
    }
  }, [isOpen])

  // Mouse wheel zoom
  const handleWheel = useCallback((event: React.WheelEvent) => {
    if (!enableZoom || isVideo) return

    event.preventDefault()
    const delta = event.deltaY > 0 ? -0.1 : 0.1
    const newScale = Math.max(1, Math.min(4, gestureState.scale + delta))

    setGestureState(prev => ({
      ...prev,
      scale: newScale,
      translateX: newScale === 1 ? 0 : prev.translateX,
      translateY: newScale === 1 ? 0 : prev.translateY
    }))
  }, [enableZoom, isVideo, gestureState.scale])

  // Mouse drag for panning
  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    if (!enableZoom || gestureState.scale <= 1 || isVideo) return

    event.preventDefault()
    setGestureState(prev => ({ ...prev, isDragging: true }))

    const startX = event.clientX - gestureState.translateX
    const startY = event.clientY - gestureState.translateY

    const handleMouseMove = (moveEvent: MouseEvent) => {
      setGestureState(prev => ({
        ...prev,
        translateX: moveEvent.clientX - startX,
        translateY: moveEvent.clientY - startY
      }))
    }

    const handleMouseUp = () => {
      setGestureState(prev => ({ ...prev, isDragging: false }))
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [enableZoom, gestureState.scale, gestureState.translateX, gestureState.translateY, isVideo])

  // Touch gestures for mobile
  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    if (!enableZoom || isVideo) return

    if (event.touches.length === 2) {
      // Pinch zoom
      const touch1 = event.touches[0]
      const touch2 = event.touches[1]
      if (!touch1 || !touch2) return

      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      )
      const centerX = (touch1.clientX + touch2.clientX) / 2
      const centerY = (touch1.clientY + touch2.clientY) / 2

      setGestureState(prev => ({
        ...prev,
        isZooming: true,
        lastTouchDistance: distance,
        lastTouchCenter: { x: centerX, y: centerY }
      }))
    } else if (event.touches.length === 1 && gestureState.scale > 1) {
      // Single touch pan
      const touch = event.touches[0]
      if (!touch) return

      setGestureState(prev => ({
        ...prev,
        isDragging: true,
        lastTouchCenter: { x: touch.clientX, y: touch.clientY }
      }))
    }
  }, [enableZoom, gestureState.scale, isVideo])

  const handleTouchMove = useCallback((event: React.TouchEvent) => {
    if (!enableZoom || isVideo) return

    event.preventDefault()

    if (event.touches.length === 2 && gestureState.isZooming && gestureState.lastTouchDistance) {
      // Pinch zoom
      const touch1 = event.touches[0]
      const touch2 = event.touches[1]
      if (!touch1 || !touch2) return

      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      )
      
      const scale = gestureState.scale * (distance / gestureState.lastTouchDistance)
      const clampedScale = Math.max(1, Math.min(4, scale))

      setGestureState(prev => ({
        ...prev,
        scale: clampedScale,
        lastTouchDistance: distance,
        translateX: clampedScale === 1 ? 0 : prev.translateX,
        translateY: clampedScale === 1 ? 0 : prev.translateY
      }))
    } else if (event.touches.length === 1 && gestureState.isDragging && gestureState.lastTouchCenter) {
      // Single touch pan
      const touch = event.touches[0]
      if (!touch) return

      const deltaX = touch.clientX - gestureState.lastTouchCenter.x
      const deltaY = touch.clientY - gestureState.lastTouchCenter.y

      setGestureState(prev => ({
        ...prev,
        translateX: prev.translateX + deltaX,
        translateY: prev.translateY + deltaY,
        lastTouchCenter: { x: touch.clientX, y: touch.clientY }
      }))
    }
  }, [enableZoom, gestureState.isZooming, gestureState.isDragging, gestureState.lastTouchDistance, gestureState.lastTouchCenter, gestureState.scale, isVideo])

  const handleTouchEnd = useCallback(() => {
    setGestureState(prev => ({
      ...prev,
      isDragging: false,
      isZooming: false
    }))
  }, [])

  // Double click/tap to zoom
  const handleDoubleClick = useCallback(() => {
    if (!enableZoom || isVideo) return

    const newScale = gestureState.scale > 1 ? 1 : 2
    setGestureState(prev => ({
      ...prev,
      scale: newScale,
      translateX: newScale === 1 ? 0 : prev.translateX,
      translateY: newScale === 1 ? 0 : prev.translateY
    }))
  }, [enableZoom, gestureState.scale, isVideo])

  // Reset zoom
  const resetZoom = useCallback(() => {
    setGestureState({
      scale: 1,
      translateX: 0,
      translateY: 0,
      isDragging: false,
      isZooming: false
    })
  }, [])

  // Scroll thumbnails to current item
  useEffect(() => {
    if (showThumbnails && thumbnailsRef.current && currentIndex >= 0 && currentIndex < thumbnailsRef.current.children.length) {
      const thumbnail = thumbnailsRef.current.children[currentIndex] as HTMLElement
      if (thumbnail) {
        thumbnail.scrollIntoView({ behavior: 'smooth', inline: 'center' })
      }
    }
  }, [currentIndex, showThumbnails])

  if (!isOpen || !currentMedia) return null

  const mediaTransform = `translate(${gestureState.translateX}px, ${gestureState.translateY}px) scale(${gestureState.scale})`

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      tabIndex={-1}
      className={cn(
        'fixed inset-0 z-50 bg-black/95 flex flex-col focus:outline-none',
        className
      )}
      ref={lightboxRef}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-4">
            <span className="text-sm">
              {currentIndex + 1} / {media.length}
            </span>
            {enableZoom && !isVideo && gestureState.scale > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetZoom}
                className="text-white hover:bg-white/20"
              >
                Reset Zoom
              </Button>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Close"
            className="text-white hover:bg-white/20"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>
      </div>

      {/* Main Media Area */}
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        {/* Navigation Buttons */}
        {media.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="lg"
              onClick={onPrevious}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
              disabled={currentIndex === 0}
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={onNext}
              aria-label="Next image"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
              disabled={currentIndex === media.length - 1}
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </>
        )}

        {/* Media Content */}
        <div
          ref={mediaRef}
          className="max-w-full max-h-full flex items-center justify-center"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onDoubleClick={handleDoubleClick}
          style={{
            cursor: enableZoom && !isVideo 
              ? gestureState.scale > 1 
                ? gestureState.isDragging ? 'grabbing' : 'grab'
                : 'zoom-in'
              : 'default'
          }}
        >
          {isVideo ? (
            <VideoPlayer
              media={currentMedia}
              showControls
              customControls
              className="max-w-full max-h-full"
            />
          ) : (
            <div
              className="transition-transform duration-200 ease-out"
              style={{
                transform: mediaTransform,
                transformOrigin: 'center'
              }}
            >
              <ResponsiveImage
                media={currentMedia}
                preset="hero"
                priority
                className="max-w-[90vw] max-h-[90vh] object-contain"
                onLoad={() => setIsImageLoaded(true)}
              />
            </div>
          )}
        </div>

        {/* Loading indicator */}
        {!isImageLoaded && !isVideo && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Caption */}
      {showCaption && typeof currentMedia === 'object' && currentMedia.caption && (
        <div className="absolute bottom-20 left-4 right-4 text-center">
          <p className="text-white text-lg bg-black/50 rounded-lg px-4 py-2 backdrop-blur-sm">
            {currentMedia.caption}
          </p>
        </div>
      )}

      {/* Thumbnails */}
      {showThumbnails && media.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div
            ref={thumbnailsRef}
            className="flex space-x-2 overflow-x-auto scrollbar-hide"
          >
            {media.map((item, index) => {
              const isCurrentVideo = typeof item === 'object' && item.mediaType === 'video'
              
              return (
                <button
                  key={index}
                  onClick={() => {
                    if (index !== currentIndex) {
                      // This would trigger parent component to update currentIndex
                      // For now, we'll assume the parent handles this
                    }
                  }}
                  className={cn(
                    'relative flex-shrink-0 w-16 h-12 rounded overflow-hidden',
                    'border-2 transition-colors duration-200',
                    index === currentIndex 
                      ? 'border-white' 
                      : 'border-transparent hover:border-white/50'
                  )}
                >
                  {isCurrentVideo ? (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </div>
                  ) : (
                    <ResponsiveImage
                      media={item}
                      preset="thumbnail"
                      className="w-full h-full object-cover"
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

MediaLightbox.displayName = 'MediaLightbox'