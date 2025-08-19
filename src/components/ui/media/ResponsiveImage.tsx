'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import type { Media } from '@/payload-types'
import type { ResponsiveImageProps } from '@/lib/media/types'
import { 
  getOptimizedImageProps, 
  generateLQIP,
  extractFilename,
  trackImageLoad
} from '@/lib/media/r2-utils'
import { cn } from '@/lib/utils'

// Media load error class
class MediaLoadError extends Error {
  constructor(message: string, public filename: string) {
    super(message)
    this.name = 'MediaLoadError'
  }
}

/**
 * High-performance responsive image component optimized for Cloudflare R2
 * Features: lazy loading, progressive enhancement, error handling, accessibility
 */
export const ResponsiveImage = React.forwardRef<
  HTMLImageElement,
  ResponsiveImageProps
>(({
  media,
  preset = 'card',
  fallback,
  placeholder = true,
  aspectRatio,
  objectFit = 'cover',
  priority = false,
  className,
  style,
  onLoad,
  onError,
  ...props
}, ref) => {
  // All hooks declared at top level
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [showLQIP, setShowLQIP] = useState(false)
  const [isIntersecting, setIsIntersecting] = useState(priority)
  const loadStartTime = useRef<number | undefined>(undefined)
  const imageRef = useRef<HTMLImageElement>(null)
  const intersectionRef = useRef<HTMLDivElement>(null)

  // All callbacks declared at top level
  const handleLoad = useCallback((event: React.SyntheticEvent<HTMLImageElement>) => {
    if (loadStartTime.current) {
      const loadTime = Date.now() - loadStartTime.current
      const filename = typeof media === 'string' ? extractFilename(media) : extractFilename(media.url || '')
      trackImageLoad(filename, loadTime)
    }

    setIsLoading(false)
    setHasError(false)
    setShowLQIP(false)
    onLoad?.()
  }, [media, onLoad])

  const handleError = useCallback((event: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoading(false)
    setHasError(true)

    const filename = typeof media === 'string' ? extractFilename(media) : extractFilename(media.url || '')
    const error = new MediaLoadError(
      `Failed to load image: ${filename}`,
      filename
    )

    // Retry logic
    if (retryCount < 2) {
      setTimeout(() => {
        setRetryCount(prev => prev + 1)
        setHasError(false)
        setIsLoading(true)
        const imageProps = getOptimizedImageProps(media, preset)
        if (imageRef.current && imageProps) {
          imageRef.current.src = imageProps.src
        }
      }, 1000 * (retryCount + 1))
    } else {
      onError?.(error)
    }
  }, [media, preset, retryCount, onError])

  const handleLoadStart = useCallback(() => {
    loadStartTime.current = Date.now()
  }, [])

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || typeof window === 'undefined') return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    )

    const current = intersectionRef.current
    if (current) {
      observer.observe(current)
    }

    return () => {
      if (current) {
        observer.unobserve(current)
      }
    }
  }, [priority])

  // Progressive loading with LQIP
  useEffect(() => {
    const filename = typeof media === 'string' ? extractFilename(media) : extractFilename(media.url || '')
    const lqipSrc = placeholder && filename ? generateLQIP(filename) : undefined
    
    if (lqipSrc && isIntersecting && placeholder) {
      setShowLQIP(true)
      
      // Preload the LQIP
      const lqipImage = new Image()
      lqipImage.onload = () => {
        setShowLQIP(true)
      }
      lqipImage.src = lqipSrc
    }
  }, [media, placeholder, isIntersecting])

  // Combine refs
  React.useImperativeHandle(ref, () => imageRef.current!)

  // Get optimized image properties
  const imageProps = getOptimizedImageProps(media, preset)
  const filename = typeof media === 'string' ? extractFilename(media) : extractFilename(media.url || '')
  const lqipSrc = placeholder && filename ? generateLQIP(filename) : undefined

  // Placeholder styles
  const placeholderStyle = aspectRatio ? { aspectRatio } : undefined
  const imageStyle = {
    objectFit,
    ...(aspectRatio && { aspectRatio }),
    ...style
  }

  // Render content using conditional components instead of early returns
  let content

  if (!imageProps) {
    content = (
      <div className={cn('flex items-center justify-center bg-muted text-muted-foreground', className)}>
        <span>Invalid image</span>
      </div>
    )
  } else if (!isIntersecting && !priority) {
    content = (
      <div
        ref={intersectionRef}
        className={cn(
          'flex items-center justify-center bg-muted text-muted-foreground',
          'animate-pulse',
          className
        )}
        style={placeholderStyle}
        aria-label="Loading image..."
      >
        {placeholder && (
          <div className="w-16 h-16 bg-muted-foreground/20 rounded" />
        )}
      </div>
    )
  } else if (hasError && retryCount >= 2) {
    if (fallback) {
      content = (
        <img
          ref={imageRef}
          src={fallback}
          alt={imageProps.alt}
          className={cn('w-full h-full', className)}
          style={imageStyle}
          onLoad={handleLoad}
          {...props}
        />
      )
    } else {
      content = (
        <div
          className={cn(
            'flex flex-col items-center justify-center bg-muted text-muted-foreground p-4',
            className
          )}
          style={placeholderStyle}
        >
          <svg
            className="w-8 h-8 mb-2 opacity-50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z"
            />
          </svg>
          <span className="text-sm">Failed to load image</span>
          <button
            onClick={() => {
              setHasError(false)
              setIsLoading(true)
              setRetryCount(0)
              if (imageRef.current) {
                imageRef.current.src = imageProps.src
              }
            }}
            className="mt-2 text-xs text-primary hover:underline"
          >
            Retry
          </button>
        </div>
      )
    }
  } else {
    content = (
      <div className={cn('relative overflow-hidden', className)} style={placeholderStyle}>
        {/* LQIP Background */}
        {showLQIP && lqipSrc && (
          <img
            src={lqipSrc}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover filter blur-sm scale-110 transition-opacity duration-300"
            style={{ opacity: isLoading ? 1 : 0 }}
          />
        )}

        {/* Main Image */}
        <img
          ref={imageRef}
          src={imageProps.src}
          srcSet={imageProps.srcSet}
          sizes={imageProps.sizes}
          alt={imageProps.alt}
          className={cn('w-full h-full transition-opacity duration-300', {
            'opacity-0': isLoading,
            'opacity-100': !isLoading
          })}
          style={imageStyle}
          onLoad={handleLoad}
          onError={handleError}
          onLoadStart={handleLoadStart}
          loading={priority ? 'eager' : 'lazy'}
          {...props}
        />

        {/* Loading Indicator */}
        {isLoading && (
          <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 bg-muted-foreground/20 rounded" />
          </div>
        )}
      </div>
    )
  }

  return content
})

ResponsiveImage.displayName = 'ResponsiveImage'