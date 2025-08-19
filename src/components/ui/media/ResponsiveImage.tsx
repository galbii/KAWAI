'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import type { Media } from '@/payload-types'
import type { ResponsiveImageProps, MediaLoadError } from '@/lib/media/types'
import { 
  getOptimizedImageProps, 
  generatePlaceholder, 
  generateLQIP,
  extractFilename,
  trackImageLoad
} from '@/lib/media/r2-utils'
import { cn } from '@/lib/utils'

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
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [showLQIP, setShowLQIP] = useState(false)
  const loadStartTime = useRef<number>()
  const imageRef = useRef<HTMLImageElement>(null)
  const intersectionRef = useRef<HTMLDivElement>(null)
  const [isIntersecting, setIsIntersecting] = useState(priority)

  // Combine refs
  React.useImperativeHandle(ref, () => imageRef.current!)

  // Get optimized image properties
  const imageProps = getOptimizedImageProps(media, preset)
  
  if (!imageProps) {
    return (
      <div className={cn('flex items-center justify-center bg-muted text-muted-foreground', className)}>
        <span>Invalid image</span>
      </div>
    )
  }

  const filename = typeof media === 'string' ? extractFilename(media) : extractFilename(media.url || '')

  // Generate LQIP for progressive loading
  const lqipSrc = placeholder && filename ? generateLQIP(filename) : undefined

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
    if (lqipSrc && isIntersecting && placeholder) {
      setShowLQIP(true)
      
      // Preload the LQIP
      const lqipImage = new Image()
      lqipImage.onload = () => {
        // LQIP is loaded, now load the full image
        setShowLQIP(true)
      }
      lqipImage.src = lqipSrc
    }
  }, [lqipSrc, isIntersecting, placeholder])

  const handleLoad = useCallback((event: React.SyntheticEvent<HTMLImageElement>) => {
    if (loadStartTime.current) {
      const loadTime = Date.now() - loadStartTime.current
      trackImageLoad(filename, loadTime)
    }

    setIsLoading(false)
    setHasError(false)
    setShowLQIP(false)
    onLoad?.()
  }, [filename, onLoad])

  const handleError = useCallback((event: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoading(false)
    setHasError(true)

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
        if (imageRef.current) {
          imageRef.current.src = imageProps.src
        }
      }, 1000 * (retryCount + 1))
    } else {
      onError?.(error)
    }
  }, [filename, imageProps.src, retryCount, onError])

  const handleLoadStart = useCallback(() => {
    loadStartTime.current = Date.now()
  }, [])

  // Placeholder styles
  const placeholderStyle = aspectRatio ? { aspectRatio } : undefined
  const imageStyle = {
    objectFit,
    ...(aspectRatio && { aspectRatio }),
    ...style
  }

  // Show placeholder while not intersecting or loading
  if (!isIntersecting && !priority) {
    return (
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
  }

  // Show error state with fallback or retry option
  if (hasError && retryCount >= 2) {
    if (fallback) {
      return (
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
    }

    return (
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
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
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

  return (
    <div className={cn('relative overflow-hidden', className)} style={placeholderStyle}>
      {/* LQIP Background */}
      {showLQIP && lqipSrc && (
        <img
          src={lqipSrc}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover filter blur-sm scale-110 transition-opacity duration-300"
          style={{ 
            opacity: isLoading ? 1 : 0,
            zIndex: 1
          }}
        />
      )}

      {/* Loading placeholder */}
      {isLoading && placeholder && !showLQIP && (
        <div
          className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center"
          style={{ zIndex: 1 }}
        >
          <div className="w-16 h-16 bg-muted-foreground/20 rounded" />
        </div>
      )}

      {/* Main image */}
      <img
        ref={imageRef}
        src={isIntersecting ? imageProps.src : undefined}
        srcSet={isIntersecting ? imageProps.srcSet : undefined}
        sizes={imageProps.sizes}
        alt={imageProps.alt}
        width={imageProps.width}
        height={imageProps.height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className={cn(
          'w-full h-full transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
        style={{ 
          ...imageStyle,
          zIndex: 2,
          position: 'relative'
        }}
        onLoadStart={handleLoadStart}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20" style={{ zIndex: 3 }}>
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
})

ResponsiveImage.displayName = 'ResponsiveImage'