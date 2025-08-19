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
            onPlay={onLoad}
            onError={onError}
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
          onLoad={onLoad}
          onError={onError}
        />
      </div>
    )
  }

  // Handle Media objects
  const mediaType = media.mediaType || 'image'

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
          onPlay={onLoad}
          onError={onError}
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
          src={media.url}
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
        onLoad={onLoad}
        onError={onError}
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