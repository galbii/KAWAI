'use client'

import { useRef, useEffect } from 'react'
import { MediaRenderer } from '@/components/ui/media/MediaRenderer'
import { Media } from '@/payload-types'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface HeroBlockProps {
  dataSource?: 'manual' | 'pianomodel' | 'hybrid' | null
  pianoModel?: any
  content?: {
    title?: string | null
    subtitle?: string | null
    description?: string | null
    primaryCta?: {
      text?: string | null
      link?: string | null
      style?: 'primary' | 'secondary' | 'outline' | null
      openInNewTab?: boolean | null
    }
    secondaryCta?: {
      text?: string | null
      link?: string | null
      style?: 'primary' | 'secondary' | 'outline' | null
      openInNewTab?: boolean | null
    }
  }
  media?: {
    type?: 'image' | 'video' | 'none' | null
    backgroundImage?: string | Media | null
    backgroundVideo?: string | Media | null
    overlay?: {
      enable?: boolean | null
      color?: 'dark' | 'light' | 'brand' | null
      opacity?: number | null
    }
  }
  layout?: {
    height?: 'small' | 'medium' | 'large' | 'fullscreen' | null
    contentAlignment?: 'left' | 'center' | 'right' | null
    verticalAlignment?: 'top' | 'center' | 'bottom' | null
    maxWidth?: 'small' | 'medium' | 'large' | 'full' | null
  }
}

export function HeroBlock({
  content = {},
  media = {},
  layout = {}
}: HeroBlockProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  // Manage video playback lifecycle
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Only proceed if video background is enabled
    if (media.type !== 'video' || !media.backgroundVideo) return

    // Attempt to play the video when component mounts
    const playPromise = video.play()

    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.warn('Video autoplay prevented:', error)
      })
    }

    // Cleanup: pause video when component unmounts or navigating away
    return () => {
      video.pause()
    }
  }, [media.type, media.backgroundVideo])

  // Layout classes
  const heightClasses = {
    small: 'min-h-[400px]',
    medium: 'min-h-[600px]',
    large: 'min-h-[800px]',
    fullscreen: 'min-h-screen'
  }

  const contentAlignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end'
  }

  const verticalAlignmentClasses = {
    top: 'justify-start',
    center: 'justify-center',
    bottom: 'justify-end'
  }

  const maxWidthClasses = {
    small: 'max-w-2xl',
    medium: 'max-w-4xl',
    large: 'max-w-6xl',
    full: 'max-w-none'
  }

  // Overlay classes
  const overlayColorClasses = {
    dark: 'bg-kawai-black/60',
    light: 'bg-white/60',
    brand: 'bg-kawai-red/60'
  }

  const heightClass = heightClasses[layout.height || 'medium']
  const contentAlignment = contentAlignmentClasses[layout.contentAlignment || 'center']
  const verticalAlignment = verticalAlignmentClasses[layout.verticalAlignment || 'center']
  const maxWidth = maxWidthClasses[layout.maxWidth || 'medium']

  const overlayColor = overlayColorClasses[media.overlay?.color || 'dark']
  const overlayOpacity = media.overlay?.opacity || 0.5

  const hasBackground = media.type === 'image' && media.backgroundImage
  const hasVideo = media.type === 'video' && media.backgroundVideo

  return (
    <>
      <section className={`relative ${heightClass} flex ${verticalAlignment} overflow-hidden`}>
        {/* Background Media */}
        {hasBackground && (
          <div className="absolute inset-0 z-0">
            <MediaRenderer
              media={media.backgroundImage!}
              preset="hero"
              priority={true}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {hasVideo && (
          <div className="absolute inset-0 z-0">
            <video
              ref={videoRef}
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            >
              <source src={typeof media.backgroundVideo === 'string' ? media.backgroundVideo : media.backgroundVideo?.url || ''} type="video/mp4" />
            </video>
          </div>
        )}

        {/* Overlay */}
        {media.overlay?.enable && (
          <div
            className={`absolute inset-0 z-10 ${overlayColor}`}
            style={{ opacity: overlayOpacity }}
          />
        )}

        {/* Content */}
        <div className={`relative z-20 w-full px-6 ${contentAlignment}`}>
          <div className={`mx-auto ${maxWidth}`}>
            <div className="space-y-6">
              {/* Subtitle */}
              {content.subtitle && (
                <div className="inline-block bg-kawai-red text-white px-4 py-2 rounded-full text-sm font-medium">
                  {content.subtitle}
                </div>
              )}

              {/* Title */}
              {content.title && (
                <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-white mb-6">
                  {content.title}
                </h1>
              )}

              {/* Description */}
              {content.description && (
                <p className="text-xl md:text-2xl leading-relaxed text-white/90 mb-8 max-w-3xl">
                  {content.description}
                </p>
              )}

              {/* CTA Buttons */}
              {(content.primaryCta?.text || content.secondaryCta?.text) && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {content.primaryCta?.text && content.primaryCta.link && (
                    <Button
                      asChild
                      size="lg"
                      variant={content.primaryCta.style === 'outline' ? 'outline' : 'default'}
                      className={`
                        px-8 py-4 font-medium rounded-md transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 group text-lg
                        ${content.primaryCta.style === 'primary' ? 'bg-kawai-red hover:bg-kawai-red/80 text-white' : ''}
                        ${content.primaryCta.style === 'secondary' ? 'bg-white hover:bg-gray-100 text-kawai-black' : ''}
                        ${content.primaryCta.style === 'outline' ? 'border-2 border-white text-white hover:bg-white hover:text-kawai-black' : ''}
                      `}
                    >
                      <Link
                        href={content.primaryCta.link}
                        target={content.primaryCta.openInNewTab ? '_blank' : undefined}
                        rel={content.primaryCta.openInNewTab ? 'noopener noreferrer' : undefined}
                        className="inline-flex items-center"
                      >
                        <span>{content.primaryCta.text}</span>
                        <svg className="w-5 h-5 ml-3 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    </Button>
                  )}

                  {content.secondaryCta?.text && content.secondaryCta.link && (
                    <Button
                      asChild
                      size="lg"
                      variant={content.secondaryCta.style === 'outline' ? 'outline' : 'secondary'}
                      className={`
                        px-8 py-4 font-medium rounded-md transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 group text-lg
                        ${content.secondaryCta.style === 'primary' ? 'bg-kawai-red hover:bg-kawai-red/80 text-white' : ''}
                        ${content.secondaryCta.style === 'secondary' ? 'bg-white hover:bg-gray-100 text-kawai-black' : ''}
                        ${content.secondaryCta.style === 'outline' ? 'border-2 border-white text-white hover:bg-white hover:text-kawai-black' : ''}
                      `}
                    >
                      <Link
                        href={content.secondaryCta.link}
                        target={content.secondaryCta.openInNewTab ? '_blank' : undefined}
                        rel={content.secondaryCta.openInNewTab ? 'noopener noreferrer' : undefined}
                      >
                        {content.secondaryCta.text}
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* KAWAI Brand Red Divider */}
      <div className="w-full h-4 bg-[#A01829]" />
    </>
  )
}