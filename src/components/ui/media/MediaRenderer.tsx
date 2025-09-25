'use client'

import React from 'react'
import { ResponsiveImage } from './ResponsiveImage'
import { VideoPlayer } from './VideoPlayer'
import type { Media } from '@/payload-types'
import type { MediaRendererProps } from '@/lib/media/types'
import { cn } from '@/lib/utils'

/**
 * Flexible media renderer that automatically determines the appropriate component
 * based on media type and renders images or videos with optimizations
 */
export const MediaRenderer = React.forwardRef<
  HTMLDivElement,
  MediaRendererProps
>(({
  media,
  preset = 'card',
  className,
  priority = false,
  placeholder = true,
  onLoad,
  onError,
  'aria-label': ariaLabel,
  ...props
}, ref) => {
  // Debug system removed

  // Handle undefined or null media
  if (!media) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('MediaRenderer: No media provided')
    }
    return (
      <div
        ref={ref}
        className={cn('media-renderer media-renderer--placeholder', className)}
        aria-label={ariaLabel || 'No media available'}
        {...props}
      >
        <div className="flex items-center justify-center bg-muted text-muted-foreground h-full min-h-[200px]">
          <span>No media available</span>
        </div>
      </div>
    )
  }

  // Handle string URLs
  if (typeof media === 'string') {
    // Determine media type from URL extension
    const isVideo = /\.(mp4|webm|ogg|mov|avi)$/i.test(media)
    
    if (isVideo) {
      return (
        <div
          ref={ref}
          className={cn('media-renderer media-renderer--video', className)}
          aria-label={ariaLabel}
          {...props}
        >
          <VideoPlayer
            media={media}
            showControls
            {...(onLoad !== undefined && { onPlay: onLoad })}
            {...(onError !== undefined && { onError: () => onError(new Error('Video load error')) })}
            poster={placeholder}
          />
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn('media-renderer media-renderer--image', className)}
        aria-label={ariaLabel}
        {...props}
      >
        <ResponsiveImage
          media={media}
          preset={preset}
          priority={priority}
          placeholder={placeholder}
          {...(onLoad !== undefined && { onLoad })}
          {...(onError !== undefined && { onError: () => onError(new Error('Image load error')) })}
        />
      </div>
    )
  }

  // Handle Media objects
  const mediaType = media.mediaType || 'image'
  
  // Validate that Media object has a URL
  if (!media.url) {
    if (process.env.NODE_ENV === 'development') {
      console.error('MediaRenderer: Media object missing URL property', media)
    }
    return (
      <div
        ref={ref}
        className={cn('media-renderer media-renderer--error', className)}
        aria-label={ariaLabel || 'Media unavailable'}
        {...props}
      >
        <div className="flex flex-col items-center justify-center bg-muted text-muted-foreground h-full min-h-[200px] p-4">
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
      </div>
    )
  }

  if (mediaType === 'video') {
    return (
      <div
        ref={ref}
        className={cn(
          'media-renderer media-renderer--video',
          className
        )}
        aria-label={ariaLabel || media.alt || 'Video content'}
        {...props}
      >
        <VideoPlayer
          media={media}
          showControls
          autoPlay={media.videoMeta?.autoplay || false}
          muted={media.videoMeta?.muted !== false}
          poster={placeholder}
          {...(onLoad !== undefined && { onPlay: onLoad })}
          {...(onError !== undefined && { onError: () => onError(new Error('Video load error')) })}
        />
      </div>
    )
  }

  if (mediaType === 'audio') {
    return (
      <div
        ref={ref}
        className={cn(
          'media-renderer media-renderer--audio',
          className
        )}
        aria-label={ariaLabel || media.alt || 'Audio content'}
        {...props}
      >
        <audio
          src={media.url || ''}
          controls
          preload="metadata"
          className="w-full"
          onLoadedData={onLoad}
          onError={(e) => onError?.(new Error('Audio failed to load'))}
        >
          Your browser does not support the audio element.
        </audio>
        {media.caption && (
          <p className="mt-2 text-sm text-muted-foreground text-center">
            {media.caption}
          </p>
        )}
      </div>
    )
  }

  // Default to image
  return (
    <div
      ref={ref}
      className={cn(
        'media-renderer media-renderer--image',
        className
      )}
      aria-label={ariaLabel || media.alt || 'Image content'}
      {...props}
    >
      <ResponsiveImage
        media={media}
        preset={preset}
        priority={priority}
        placeholder={placeholder}
        {...(onLoad !== undefined && { onLoad })}
        {...(onError !== undefined && { onError })}
      />
      {media.caption && (
        <p className="mt-2 text-sm text-muted-foreground text-center">
          {media.caption}
        </p>
      )}
    </div>
  )
})

MediaRenderer.displayName = 'MediaRenderer'