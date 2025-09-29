'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'
import { cn } from '@/lib/utils'

interface YouTubeEmbedProps {
  videoId: string
  title?: string
  className?: string
  aspectRatio?: 'video' | 'square' | 'wide'
  autoplay?: boolean
  showTitle?: boolean
  privacy?: boolean // Use youtube-nocookie.com for privacy
}

export default function YouTubeEmbed({
  videoId,
  title = 'YouTube Video',
  className,
  aspectRatio = 'video',
  autoplay = false,
  showTitle = false,
  privacy = true
}: YouTubeEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  const domain = privacy ? 'youtube-nocookie.com' : 'youtube.com'
  const autoplayParam = autoplay ? '1' : '0'

  const embedUrl = `https://www.${domain}/embed/${videoId}?autoplay=${autoplayParam}&rel=0&modestbranding=1&enablejsapi=1`

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`

  const aspectRatioClasses = {
    video: 'aspect-video', // 16:9
    square: 'aspect-square', // 1:1
    wide: 'aspect-[21/9]' // Ultra-wide
  }

  const handleLoadVideo = () => {
    setIsLoaded(true)
  }

  const handleError = () => {
    setHasError(true)
  }

  if (hasError) {
    return (
      <div className={cn(
        "relative overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center",
        aspectRatioClasses[aspectRatio],
        className
      )}>
        <div className="text-center p-6">
          <p className="text-gray-600 mb-2">Video unavailable</p>
          <p className="text-sm text-gray-500">Please check your connection and try again</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn(
      "relative overflow-hidden rounded-lg bg-black group shadow-lg",
      aspectRatioClasses[aspectRatio],
      className
    )}>
      {!isLoaded ? (
        <>
          {/* Thumbnail with play button overlay */}
          <img
            src={thumbnailUrl}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={handleError}
          />

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />

          {/* Play button */}
          <button
            onClick={handleLoadVideo}
            className={cn(
              "absolute inset-0 flex items-center justify-center",
              "transition-transform duration-300 group-hover:scale-110",
              "focus:outline-none focus:ring-2 focus:ring-kawai-red focus:ring-offset-2 focus:ring-offset-black"
            )}
            aria-label={`Play video: ${title}`}
          >
            <div className="flex items-center justify-center w-20 h-20 bg-kawai-red/90 rounded-full shadow-lg backdrop-blur-sm">
              <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
            </div>
          </button>

          {/* Title overlay */}
          {showTitle && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <h3 className="text-white font-semibold text-lg">{title}</h3>
            </div>
          )}
        </>
      ) : (
        <iframe
          src={embedUrl}
          title={title}
          className="absolute inset-0 w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          loading="lazy"
        />
      )}
    </div>
  )
}

// Preset variations for common use cases
export function YouTubeHeroEmbed({
  videoId,
  title = 'YouTube Video',
  className
}: {
  videoId: string;
  title?: string;
  className?: string;
}) {
  return (
    <YouTubeEmbed
      videoId={videoId}
      title={title}
      className={cn("w-full max-w-4xl mx-auto", className)}
      aspectRatio="video"
      showTitle={true}
      privacy={true}
    />
  )
}

export function YouTubeCardEmbed({
  videoId,
  title = 'YouTube Video',
  className
}: {
  videoId: string;
  title?: string;
  className?: string;
}) {
  return (
    <YouTubeEmbed
      videoId={videoId}
      title={title}
      className={cn("w-full", className)}
      aspectRatio="video"
      showTitle={false}
      privacy={true}
    />
  )
}