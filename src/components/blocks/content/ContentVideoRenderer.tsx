import React from 'react'
import type { ContentVideoBlock, Media } from '@/payload-types'

interface ContentVideoRendererProps extends ContentVideoBlock {}

export function ContentVideoRenderer({
  source,
  videoFile,
  videoUrl,
  posterImage,
  controls = true,
  autoplay = false,
  loop = false,
  caption,
}: ContentVideoRendererProps) {
  // Render YouTube embed
  if (source === 'youtube' && videoUrl) {
    const youtubeId = extractYouTubeId(videoUrl)
    if (youtubeId) {
      return (
        <figure className="my-8">
          <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${youtubeId}${autoplay ? '?autoplay=1&mute=1' : ''}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          {caption && (
            <figcaption className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center italic">
              {caption}
            </figcaption>
          )}
        </figure>
      )
    }
  }

  // Render Vimeo embed
  if (source === 'vimeo' && videoUrl) {
    const vimeoId = extractVimeoId(videoUrl)
    if (vimeoId) {
      return (
        <figure className="my-8">
          <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://player.vimeo.com/video/${vimeoId}${autoplay ? '?autoplay=1&muted=1' : ''}`}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </div>
          {caption && (
            <figcaption className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center italic">
              {caption}
            </figcaption>
          )}
        </figure>
      )
    }
  }

  // Render uploaded video file
  if (source === 'upload' && videoFile && typeof videoFile === 'object') {
    const video = videoFile as Media

    if (!video.url) {
      return null
    }

    const posterUrl = posterImage && typeof posterImage === 'object'
      ? (posterImage as Media).url ?? undefined
      : undefined

    return (
      <figure className="my-8">
        <div className="relative overflow-hidden rounded-lg">
          <video
            className="w-full h-auto"
            controls={controls ?? true}
            autoPlay={autoplay ?? false}
            loop={loop ?? false}
            muted={autoplay ?? false}
            poster={posterUrl}
          >
            <source src={video.url} type={video.mimeType ?? 'video/mp4'} />
            Your browser does not support the video tag.
          </video>
        </div>
        {caption && (
          <figcaption className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center italic">
            {caption}
          </figcaption>
        )}
      </figure>
    )
  }

  return null
}

// Helper function to extract YouTube video ID
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/,
    /youtube\.com\/v\/([^&?/]+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }

  return null
}

// Helper function to extract Vimeo video ID
function extractVimeoId(url: string): string | null {
  const pattern = /vimeo\.com\/(?:video\/)?(\d+)/
  const match = url.match(pattern)
  return match && match[1] ? match[1] : null
}
