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
  showScrollIndicator?: boolean | null
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
  showScrollIndicator = true,
}: VideoBackgroundBlockProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isVideoReady, setIsVideoReady] = useState(false)

  useEffect(() => {
    // Purposeful reveal - like ink settling on paper
    const timer = setTimeout(() => setIsLoaded(true), 200)
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
  const youtubeEmbedUrl = videoSource === 'youtube' ? getYouTubeEmbedUrl(youtubeUrl) : null

  return (
    <section className="relative h-screen w-full overflow-hidden bg-kawai-charcoal">
      {/* Background Video */}
      <div className="absolute inset-0">
        {videoSource === 'youtube' && youtubeEmbedUrl ? (
          <div className="relative h-full w-full">
            <iframe
              src={youtubeEmbedUrl}
              className={cn(
                'absolute left-1/2 top-1/2 h-[56.25vw] min-h-screen w-[177.77vh] min-w-full -translate-x-1/2 -translate-y-1/2 object-cover transition-opacity duration-[1800ms] ease-out',
                isVideoReady ? 'opacity-100' : 'opacity-0'
              )}
              allow="autoplay; encrypted-media"
              frameBorder="0"
              onLoad={handleVideoReady}
              title="Background video"
            />
            {/* Transparent overlay prevents user interaction with video */}
            <div className="pointer-events-none absolute inset-0 z-10" />
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            onLoadedData={handleVideoReady}
            className={cn(
              'h-full w-full object-cover transition-opacity duration-[1800ms] ease-out',
              isVideoReady ? 'opacity-100' : 'opacity-0'
            )}
          >
            {videoUrl && <source src={videoUrl} type="video/mp4" />}
          </video>
        )}

        {/* Sumi-e inspired gradient overlay - organic, ink-wash aesthetic */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-kawai-charcoal/90 via-kawai-charcoal/50 to-transparent transition-opacity duration-1000"
          style={{ opacity: overlayOpacity ?? 0.4 }}
        />

        {/* Secondary overlay - adds depth like layered washi paper */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-t from-kawai-charcoal/60 via-transparent to-transparent transition-opacity duration-[2000ms]",
            isVideoReady ? 'opacity-100' : 'opacity-0'
          )}
        />
      </div>

      {/* Floating Sidebar Container - Proper breathing room */}
      <div
        className={cn(
          'absolute z-10 flex',
          // Floating spacing with more space from top
          'top-16 bottom-8 md:top-24 md:bottom-12 lg:top-28 lg:bottom-16',
          sidebarHeight === 'centered' ? 'items-center' : 'items-stretch',
          'w-full md:w-[580px] lg:w-[680px] xl:w-[720px]',
          // Horizontal breathing room based on position
          sidebarOnLeft
            ? 'left-6 md:left-12 lg:left-16'
            : 'right-6 md:right-12 lg:right-16'
        )}
      >
        {/* Content Container - Entrance animation like ink brush stroke */}
        <div
          className={cn(
            'relative w-full',
            'flex flex-col',
            sidebarHeight === 'centered'
              ? 'justify-center'
              : 'justify-between h-full',
            // Purposeful, elegant entrance (not bouncy)
            'transition-all duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
            isLoaded
              ? 'translate-x-0 translate-y-0 opacity-100'
              : sidebarOnLeft
                ? '-translate-x-8 translate-y-4 opacity-0'
                : 'translate-x-8 translate-y-4 opacity-0'
          )}
        >
          {/* Premium Glassmorphism Panel - Shoji screen inspired */}
          <div
            className={cn(
              'glass-panel-premium',
              'group relative',
              // Refined border treatment - double border like traditional Japanese joinery
              'rounded-[2rem] border border-white/[0.08]',
              // Sophisticated glass effect - layered transparency
              'bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-transparent',
              // Generous internal spacing with breathing room
              'p-10 md:p-12 lg:p-14 xl:p-16',
              // Premium shadow - soft, atmospheric (not harsh drop shadow)
              'shadow-[0_16px_64px_rgba(0,0,0,0.5),0_0_1px_rgba(255,255,255,0.1)_inset]',
              // Enhanced blur with saturation boost
              'backdrop-blur-[32px]',
              sidebarHeight === 'full' && 'h-full flex flex-col justify-between',
              // Hover state - subtle glow (premium interaction)
              'transition-all duration-700'
            )}
            style={{
              backdropFilter: 'blur(32px) saturate(150%)',
              // Subtle vignette effect inside panel
              boxShadow: `
                0 16px 64px rgba(0, 0, 0, 0.5),
                0 0 1px rgba(255, 255, 255, 0.1) inset,
                0 1px 2px rgba(255, 255, 255, 0.05) inset
              `
            }}
          >
            {/* Inner border - double-line technique (Japanese joinery aesthetic) */}
            <div
              className="absolute inset-[1px] rounded-[calc(2rem-1px)] border border-white/[0.03] pointer-events-none"
            />

            {/* Decorative Corner Accent - Asymmetric (wabi-sabi) */}
            <div
              className={cn(
                'absolute h-[1px] bg-gradient-to-r transition-all duration-[1200ms] ease-out delay-300',
                'from-kawai-gold/80 via-kawai-red/60 to-transparent',
                isLoaded ? 'w-32 opacity-100' : 'w-0 opacity-0',
                sidebarOnLeft ? 'left-10 top-10' : 'right-10 top-10'
              )}
            />
            <div
              className={cn(
                'absolute w-[1px] bg-gradient-to-b transition-all duration-[1200ms] ease-out delay-500',
                'from-kawai-gold/80 via-kawai-red/60 to-transparent',
                isLoaded ? 'h-32 opacity-100' : 'h-0 opacity-0',
                sidebarOnLeft ? 'left-10 top-10' : 'right-10 top-10'
              )}
            />

            {/* Content Wrapper */}
            <div className="relative z-10 space-y-6">
              {/* Subheading - Uppercase label with refined spacing */}
              {subheading && (
                <div
                  className={cn(
                    'font-sans text-[0.6875rem] uppercase tracking-[0.3em] text-kawai-gold/95',
                    'transition-all duration-[900ms] ease-out delay-400',
                    isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
                  )}
                  style={{
                    letterSpacing: '0.3em',
                    fontWeight: 500,
                  }}
                >
                  {subheading}
                </div>
              )}

              {/* Heading - Large serif with refined line height */}
              {heading && (
                <h2
                  className={cn(
                    'font-serif leading-[1.1] text-white',
                    'text-4xl md:text-5xl lg:text-6xl xl:text-7xl',
                    'transition-all duration-[900ms] ease-out delay-500',
                    isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
                  )}
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 400,
                    textShadow: '0 2px 12px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  {heading}
                </h2>
              )}

              {/* Description - Refined readability */}
              {description && (
                <p
                  className={cn(
                    'max-w-md font-sans leading-[1.75] text-white/85',
                    'text-base md:text-lg',
                    'transition-all duration-[900ms] ease-out delay-700',
                    isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
                  )}
                  style={{
                    textShadow: '0 1px 8px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  {description}
                </p>
              )}

              {/* CTA Buttons - Refined interaction design */}
              {(primaryCta?.text || secondaryCta?.enabled) && (
                <div
                  className={cn(
                    'flex flex-wrap items-center gap-4 pt-2',
                    'transition-all duration-[900ms] ease-out delay-900',
                    isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
                  )}
                >
                  {/* Primary CTA - Kawai Red with sophisticated interaction */}
                  {primaryCta?.text && primaryCta?.link && (
                    <a
                      href={primaryCta.link}
                      target={primaryCta.openInNewTab ? '_blank' : undefined}
                      rel={primaryCta.openInNewTab ? 'noopener noreferrer' : undefined}
                      className={cn(
                        'group/cta relative inline-flex items-center gap-2.5',
                        'overflow-hidden rounded-full',
                        'bg-kawai-red px-7 py-3.5',
                        'font-sans text-xs font-semibold uppercase tracking-[0.15em] text-white',
                        'transition-all duration-500 ease-out',
                        'hover:bg-kawai-red/90 hover:shadow-[0_8px_32px_rgba(196,30,58,0.5)]',
                        'hover:scale-[1.02] active:scale-[0.98]',
                        'focus:outline-none focus:ring-2 focus:ring-kawai-red/50 focus:ring-offset-2 focus:ring-offset-transparent'
                      )}
                    >
                      <span className="relative z-10">{primaryCta.text}</span>

                      {/* Arrow Icon - Refined animation */}
                      <svg
                        className="relative z-10 h-3.5 w-3.5 transition-transform duration-500 ease-out group-hover/cta:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>

                      {/* Hover shine effect - diagonal sweep */}
                      <div
                        className={cn(
                          'absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent',
                          'transition-transform duration-[800ms] ease-out group-hover/cta:translate-x-full',
                          'skew-x-12'
                        )}
                      />
                    </a>
                  )}

                  {/* Secondary CTA - Outline style with refined border */}
                  {secondaryCta?.enabled && secondaryCta?.text && secondaryCta?.link && (
                    <a
                      href={secondaryCta.link}
                      target={secondaryCta.openInNewTab ? '_blank' : undefined}
                      rel={secondaryCta.openInNewTab ? 'noopener noreferrer' : undefined}
                      className={cn(
                        'group/cta-secondary relative inline-flex items-center gap-2.5',
                        'overflow-hidden rounded-full',
                        'border border-white/40 bg-white/5 px-7 py-3.5',
                        'font-sans text-xs font-semibold uppercase tracking-[0.15em] text-white',
                        'backdrop-blur-sm',
                        'transition-all duration-500 ease-out',
                        'hover:border-white/70 hover:bg-white/10',
                        'hover:scale-[1.02] active:scale-[0.98]',
                        'focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent'
                      )}
                    >
                      <span className="relative z-10">{secondaryCta.text}</span>

                      {/* Arrow Icon */}
                      <svg
                        className="relative z-10 h-3.5 w-3.5 transition-transform duration-500 ease-out group-hover/cta-secondary:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Washi paper texture overlay - subtle organic texture */}
            <div
              className="pointer-events-none absolute inset-0 rounded-[2rem] opacity-[0.03] mix-blend-overlay"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              }}
            />

            {/* Subtle inner glow - adds premium depth */}
            <div
              className="pointer-events-none absolute inset-0 rounded-[2rem] opacity-0 transition-opacity duration-700 group-hover:opacity-100"
              style={{
                background: `
                  radial-gradient(
                    circle at ${sidebarOnLeft ? '20%' : '80%'} 30%,
                    rgba(212, 175, 55, 0.03) 0%,
                    transparent 60%
                  )
                `
              }}
            />
          </div>

          {/* Atmospheric glow behind panel - ink diffusion effect */}
          <div
            className={cn(
              'absolute inset-0 -z-10 blur-[80px] transition-all duration-[1600ms] ease-out delay-700',
              isLoaded ? 'opacity-15 scale-100' : 'opacity-0 scale-90',
              sidebarOnLeft ? 'bg-gradient-to-r' : 'bg-gradient-to-l',
              'from-kawai-red/30 via-kawai-gold/20 to-transparent',
              'rounded-[3rem]'
            )}
          />
        </div>
      </div>

      {/* Mobile gradient overlay - ensures text readability */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-kawai-charcoal via-kawai-charcoal/60 to-transparent md:hidden" />

      {/* Scroll indicator - subtle hint for user */}
      {showScrollIndicator && (
        <div
          className={cn(
            "absolute bottom-8 left-1/2 -translate-x-1/2 z-20",
            "flex flex-col items-center gap-2 opacity-0 transition-opacity duration-1000 delay-[2000ms]",
            isLoaded && "opacity-40 hover:opacity-70"
          )}
        >
          <span className="text-[0.625rem] uppercase tracking-[0.2em] text-white/60 font-sans">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/40 to-transparent animate-pulse" />
        </div>
      )}

      {/* Google Fonts Preconnect */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />
    </section>
  )
}
