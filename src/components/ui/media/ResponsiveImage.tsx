'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import Image from 'next/image'
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

  // Helper to safely extract filename, avoiding fallback images
  const safeExtractFilename = useCallback((media: Media | string): string => {
    const url = typeof media === 'string' ? media : media.url || ''
    // Don't process fallback images
    if (url.startsWith('/images/') || url.startsWith('/static/')) {
      return url
    }
    return extractFilename(url)
  }, [])

  // All callbacks declared at top level
  const handleLoad = useCallback((event: React.SyntheticEvent<HTMLImageElement>) => {
    if (loadStartTime.current) {
      const loadTime = Date.now() - loadStartTime.current
      const filename = safeExtractFilename(media)
      trackImageLoad(filename, loadTime)
    }

    setIsLoading(false)
    setHasError(false)
    setShowLQIP(false)
    onLoad?.()
  }, [media, onLoad, safeExtractFilename])

  const handleError = useCallback((event: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoading(false)
    setHasError(true)

    const filename = safeExtractFilename(media)
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
    if (priority || typeof window === 'undefined') return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
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
    const mediaUrl = typeof media === 'string' ? media : media.url || ''

    // Don't generate LQIP for fallback images
    if (mediaUrl.startsWith('/images/') || mediaUrl.startsWith('/static/')) {
      return undefined
    }

    const filename = safeExtractFilename(media)
    const lqipSrc = placeholder && filename ? generateLQIP(filename) : undefined

    if (lqipSrc && isIntersecting && placeholder) {
      setShowLQIP(true)

      // Preload the LQIP
      const lqipImage = new globalThis.Image()
      lqipImage.onload = () => {
        setShowLQIP(true)
      }
      lqipImage.src = lqipSrc
    }

    return undefined
  }, [media, placeholder, isIntersecting, safeExtractFilename])

  // Debug system removed

  // Combine refs
  React.useImperativeHandle(ref, () => imageRef.current!)

  // Determine if this is a Media object or string URL
  const isMediaObject = typeof media === 'object' && media !== null
  const isStringUrl = typeof media === 'string'
  
  // Extract URL for Media objects
  const mediaUrl = isMediaObject ? media.url || '' : (isStringUrl ? media : '')
  
  // Early validation for Media objects without URLs
  if (isMediaObject && !mediaUrl) {
    if (process.env.NODE_ENV === 'development') {
      console.error('ResponsiveImage: Media object missing URL property', media)
    }
    return (
      <div className={cn('flex flex-col items-center justify-center bg-muted text-muted-foreground p-4', className)}>
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
            d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="text-sm">Media URL missing</span>
        {process.env.NODE_ENV === 'development' && (
          <span className="text-xs mt-1 opacity-75">Check Payload S3 configuration</span>
        )}
      </div>
    )
  }
  
  // Placeholder styles
  const placeholderStyle = aspectRatio ? { aspectRatio } : undefined
  const imageStyle = {
    objectFit,
    ...(aspectRatio && { aspectRatio }),
    ...style
  }

  // Render content using conditional components instead of early returns
  let content

  // Handle both Media objects and string URLs through unified R2 optimization
  if ((isMediaObject && mediaUrl) || (isStringUrl && mediaUrl)) {
    // Use R2 optimization for ALL media (both Media objects and string URLs)
    const imageProps = getOptimizedImageProps(media, preset)
    const filename = safeExtractFilename(media)
    
    // Don't generate LQIP for fallback images
    const lqipSrc = placeholder && filename && !mediaUrl.startsWith('/images/') && !mediaUrl.startsWith('/static/') 
      ? generateLQIP(filename) 
      : undefined

    if (!imageProps) {
      content = (
        <div className={cn('flex items-center justify-center bg-muted text-muted-foreground', className)}>
          <span>Invalid image URL</span>
        </div>
      )
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
        </div>
      )
    }
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
    // Error handling - show fallback or error message
    if (fallback) {
      content = (
        <img
          ref={imageRef}
          src={fallback}
          alt={isMediaObject ? media.alt || '' : 'Fallback image'}
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
              // Retry by refreshing the component
              window.location.reload()
            }}
            className="mt-2 text-xs text-primary hover:underline"
          >
            Retry
          </button>
        </div>
      )
    }
  } else {
    // No valid media provided
    content = (
      <div className={cn('flex items-center justify-center bg-muted text-muted-foreground', className)}>
        <span>No media available</span>
      </div>
    )
  }

  return content
})

ResponsiveImage.displayName = 'ResponsiveImage'