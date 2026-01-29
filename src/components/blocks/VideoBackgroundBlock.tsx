'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { getYouTubeEmbedUrl } from '@/lib/utils/youtube'

interface VideoBackgroundBlockProps {
  videoSource?: 'youtube' | 'direct' | null
  youtubeUrl?: string | null
  videoUrl?: string | null
  heading?: string | null
  subheading?: string | null
  description?: string | null
  primaryCta?: {
    text?: string | null
    link?: string | null
    openInNewTab?: boolean | null
  } | null
  secondaryCta?: {
    enabled?: boolean | null
    text?: string | null
    link?: string | null
    openInNewTab?: boolean | null
  } | null
  sidebarPosition?: 'left' | 'right' | null
  sidebarHeight?: 'centered' | 'full' | null
  overlayOpacity?: number | null
}


export function VideoBackgroundBlock({
  videoSource = 'youtube',
  youtubeUrl,
  videoUrl,
  heading,
  subheading,
  description,
  primaryCta,
  secondaryCta,
  sidebarPosition = 'left',
  sidebarHeight = 'centered',
  overlayOpacity = 0.4,
}: VideoBackgroundBlockProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isVideoReady, setIsVideoReady] = useState(false)

  useEffect(() => {
    // Staggered reveal animation
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Fallback: Show video after 2 seconds if load event doesn't fire (common with YouTube embeds)
    if (videoSource === 'youtube' && !isVideoReady) {
      const fallbackTimer = setTimeout(() => {
        setIsVideoReady(true)
      }, 2000)
      return () => clearTimeout(fallbackTimer)
    }
    return undefined
  }, [videoSource, isVideoReady])

  const handleVideoReady = () => {
    setIsVideoReady(true)
  }

  const sidebarOnLeft = sidebarPosition === 'left'

  // Build optimized YouTube embed URL using shared utility
  // See src/lib/utils/youtube.ts for parameter documentation
  const youtubeEmbedUrl = videoSource === 'youtube' ? getYouTubeEmbedUrl(youtubeUrl) : null

  return (
    <section className="relative h-screen w-full overflow-hidden bg-kawai-charcoal">
      {/* Background Video */}
      <div className="absolute inset-0">
        {videoSource === 'youtube' && youtubeEmbedUrl ? (
          // YouTube Embed (minimized UI - title/channel overlay still appears per YouTube policy)
          <div className="relative h-full w-full">
            <iframe
              src={youtubeEmbedUrl}
              className={cn(
                'absolute left-1/2 top-1/2 h-[56.25vw] min-h-screen w-[177.77vh] min-w-full -translate-x-1/2 -translate-y-1/2 object-cover transition-opacity duration-1000',
                isVideoReady ? 'opacity-100' : 'opacity-0'
              )}
              allow="autoplay; encrypted-media"
              frameBorder="0"
              onLoad={handleVideoReady}
              title="Background video"
            />
            {/* Transparent overlay prevents user interaction with video (clicking, pausing, etc.) */}
            <div className="pointer-events-none absolute inset-0 z-10" />
          </div>
        ) : (
          // Direct MP4 Video
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            onLoadedData={handleVideoReady}
            className={cn(
              'h-full w-full object-cover transition-opacity duration-1000',
              isVideoReady ? 'opacity-100' : 'opacity-0'
            )}
          >
            {videoUrl && <source src={videoUrl} type="video/mp4" />}
          </video>
        )}

        {/* Overlay with customizable opacity */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-kawai-charcoal via-kawai-charcoal/60 to-transparent transition-opacity duration-700"
          style={{ opacity: overlayOpacity ?? 0.4 }}
        />
      </div>

      {/* Glassmorphism Sidebar */}
      <div
        className={cn(
          'absolute inset-y-0 z-10 flex',
          sidebarHeight === 'centered' ? 'items-center' : 'items-stretch',
          'w-full md:w-[600px] lg:w-[700px]',
          sidebarOnLeft ? 'left-0' : 'right-0'
        )}
      >
        {/* Content Container with Staggered Animation */}
        <div
          className={cn(
            'relative w-full px-8 md:px-16 lg:px-20',
            'flex flex-col',
            sidebarHeight === 'centered'
              ? 'justify-center py-16'
              : 'justify-between py-12 md:py-16 lg:py-20 h-full',
            'transition-all duration-1000 ease-out',
            isLoaded ? 'translate-x-0 opacity-100' : sidebarOnLeft ? '-translate-x-12 opacity-0' : 'translate-x-12 opacity-0'
          )}
        >
          {/* Glassmorphism Panel */}
          <div
            className={cn(
              'glass-panel',
              'relative rounded-3xl border border-white/10',
              'bg-gradient-to-br from-white/5 via-white/[0.02] to-transparent',
              'p-10 md:p-12 lg:p-14',
              'shadow-[0_8px_32px_rgba(0,0,0,0.4)]',
              'backdrop-blur-xl',
              sidebarHeight === 'full' && 'h-full flex flex-col justify-between'
            )}
            style={{
              backdropFilter: 'blur(24px) saturate(180%)',
            }}
          >
            {/* Decorative Border Accent */}
            <div
              className={cn(
                'absolute top-0 h-1 w-20 bg-gradient-to-r from-kawai-red via-kawai-gold to-transparent',
                'transition-all duration-700 delay-300',
                isLoaded ? 'opacity-100' : 'opacity-0',
                sidebarOnLeft ? 'left-12' : 'right-12'
              )}
            />

            {/* Subheading */}
            {subheading && (
              <div
                className={cn(
                  'mb-4 font-sans text-xs uppercase tracking-[0.25em] text-kawai-gold/90',
                  'transition-all duration-700 delay-200',
                  isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                )}
              >
                {subheading}
              </div>
            )}

            {/* Heading */}
            {heading && (
              <h2
                className={cn(
                  'mb-6 font-serif text-5xl leading-tight text-white md:text-6xl lg:text-7xl',
                  'transition-all duration-700 delay-300',
                  isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                )}
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {heading}
              </h2>
            )}

            {/* Description */}
            {description && (
              <p
                className={cn(
                  'mb-10 max-w-lg font-sans text-lg leading-relaxed text-white/80 md:text-xl',
                  'transition-all duration-700 delay-500',
                  isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                )}
              >
                {description}
              </p>
            )}

            {/* CTA Buttons */}
            {(primaryCta?.text || secondaryCta?.enabled) && (
              <div
                className={cn(
                  'flex flex-wrap items-center gap-4',
                  'transition-all duration-700 delay-700',
                  isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                )}
              >
                {/* Primary CTA */}
                {primaryCta?.text && primaryCta?.link && (
                  <a
                    href={primaryCta.link}
                    target={primaryCta.openInNewTab ? '_blank' : undefined}
                    rel={primaryCta.openInNewTab ? 'noopener noreferrer' : undefined}
                    className={cn(
                      'group relative inline-flex items-center gap-3',
                      'overflow-hidden rounded-full',
                      'bg-kawai-red px-8 py-4 font-sans text-sm font-medium uppercase tracking-wider text-white',
                      'transition-all duration-300',
                      'hover:bg-kawai-red/90 hover:shadow-[0_8px_24px_rgba(196,30,58,0.4)]',
                      'focus:outline-none focus:ring-2 focus:ring-kawai-red focus:ring-offset-2 focus:ring-offset-transparent'
                    )}
                  >
                    <span className="relative z-10">{primaryCta.text}</span>

                    {/* Arrow Icon */}
                    <svg
                      className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>

                    {/* Hover Shine Effect */}
                    <div
                      className={cn(
                        'absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent',
                        'transition-transform duration-700 group-hover:translate-x-full'
                      )}
                    />
                  </a>
                )}

                {/* Secondary CTA */}
                {secondaryCta?.enabled && secondaryCta?.text && secondaryCta?.link && (
                  <a
                    href={secondaryCta.link}
                    target={secondaryCta.openInNewTab ? '_blank' : undefined}
                    rel={secondaryCta.openInNewTab ? 'noopener noreferrer' : undefined}
                    className={cn(
                      'group relative inline-flex items-center gap-3',
                      'overflow-hidden rounded-full',
                      'border-2 border-white/30 bg-transparent px-8 py-4',
                      'font-sans text-sm font-medium uppercase tracking-wider text-white',
                      'transition-all duration-300',
                      'hover:border-white hover:bg-white/10',
                      'focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent'
                    )}
                  >
                    <span className="relative z-10">{secondaryCta.text}</span>

                    {/* Arrow Icon */}
                    <svg
                      className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </a>
                )}
              </div>
            )}

            {/* Decorative Grain Texture Overlay */}
            <div
              className="pointer-events-none absolute inset-0 rounded-3xl opacity-[0.015]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              }}
            />
          </div>

          {/* Subtle Glow Effect Behind Panel */}
          <div
            className={cn(
              'absolute inset-0 -z-10 opacity-30 blur-3xl transition-opacity duration-1000 delay-500',
              isLoaded ? 'opacity-20' : 'opacity-0',
              sidebarOnLeft ? 'bg-gradient-to-r' : 'bg-gradient-to-l',
              'from-kawai-red/20 via-transparent to-transparent'
            )}
          />
        </div>
      </div>

      {/* Mobile Gradient Overlay for Readability */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-kawai-charcoal via-kawai-charcoal/80 to-transparent md:hidden" />

      {/* Google Fonts Preconnect */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
    </section>
  )
}
