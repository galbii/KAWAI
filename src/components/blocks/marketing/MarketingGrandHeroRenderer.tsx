'use client'

import React, { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Media } from '@/payload-types'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import { getYouTubeEmbedUrl } from '@/lib/utils/youtube'
import { trackCTAClick, trackBlockImpression } from '@/lib/analytics/unified-tracking'

interface MarketingGrandHeroRendererProps {
  block: any // Will use MarketingGrandHeroBlock after types are generated
  ctaTracking?: any
  impressionTracking?: any
}

// Type guard for Media object
function isMediaObject(media: Media | string | null | undefined): media is Media {
  return typeof media === 'object' && media !== null && 'url' in media
}

export const MarketingGrandHeroRenderer: React.FC<MarketingGrandHeroRendererProps> = ({
  block,
  ctaTracking,
  impressionTracking,
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)

  // Entrance animation trigger
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Block impression tracking
  useEffect(() => {
    trackBlockImpression({
      blockType: 'marketing-grand-hero',
      blockData: { impressionTracking: impressionTracking as any },
    })
  }, [])

  // Parallax effect on scroll
  useEffect(() => {
    if (!block.enableParallax) return

    const handleScroll = () => {
      if (typeof window === 'undefined' || !window.visualViewport) return
      const visualViewport = window.visualViewport
      setScrollY(visualViewport.pageTop || window.scrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [block.enableParallax])

  // Height mapping
  const heightMap = {
    viewport: 'h-screen',
    large: 'h-[90vh]',
    medium: 'h-[80vh]',
    compact: 'h-[70vh]',
  }

  // Content positioning
  const positionMap = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right',
  }

  // Vertical alignment
  const verticalAlignMap = {
    top: 'justify-start pt-24 md:pt-32',
    center: 'justify-center',
    bottom: 'justify-end pb-24 md:pb-32',
  }

  // Content max width
  const maxWidthMap = {
    small: 'max-w-xl',
    medium: 'max-w-2xl',
    large: 'max-w-4xl',
    xlarge: 'max-w-5xl',
  }

  // Text color
  const textColorMap = {
    auto: block.overlayColor === 'light' ? 'text-gray-900' : 'text-white',
    white: 'text-white',
    black: 'text-gray-900',
    charcoal: 'text-[#2C2C2C]',
  }

  // Overlay color
  const overlayColorMap = {
    dark: 'bg-black/50',
    light: 'bg-white/50',
    red: 'bg-[#C41E3A]/50',
    none: '',
  }

  // Background color for solid backgrounds
  const bgColorMap = {
    charcoal: 'bg-[#2C2C2C]',
    pearl: 'bg-[#F8F8F8]',
    black: 'bg-black',
    white: 'bg-white',
  }

  // Animation duration mapping
  const durationMap = {
    fast: 'duration-600',
    medium: 'duration-900',
    slow: 'duration-1200',
  }

  // Animation style classes
  const getAnimationClasses = () => {
    if (block.animationStyle === 'none') return ''
    if (!isVisible) {
      switch (block.animationStyle) {
        case 'fade-up':
          return 'opacity-0 translate-y-8'
        case 'fade':
          return 'opacity-0'
        case 'scale':
          return 'opacity-0 scale-95'
        default:
          return 'opacity-0 translate-y-8'
      }
    }
    return 'opacity-100 translate-y-0 scale-100'
  }

  const animationDuration = durationMap[(block.animationDuration as keyof typeof durationMap) || 'medium']
  const textColor = textColorMap[(block.textColor as keyof typeof textColorMap) || 'auto']
  const height = heightMap[(block.height as keyof typeof heightMap) || 'viewport']
  const contentPosition = positionMap[(block.contentPosition as keyof typeof positionMap) || 'center']
  const verticalAlign = verticalAlignMap[(block.verticalAlignment as keyof typeof verticalAlignMap) || 'center']
  const maxWidth = maxWidthMap[(block.contentMaxWidth as keyof typeof maxWidthMap) || 'medium']

  // Video zoom (default 110 = 10% zoom)
  const videoZoom = block.videoZoom || 110
  const videoScaleClass = `scale-[${videoZoom / 100}]`

  // Show logo if heading is empty, otherwise show content
  const showLogo = !block.heading

  // Handle media background
  const backgroundImage = block.backgroundImage
  const backgroundVideo = block.backgroundVideo
  const hasImageBackground = block.mediaType === 'image' && isMediaObject(backgroundImage)

  // Video URL takes priority over uploaded video
  const videoSrc = block.videoUrl || (isMediaObject(backgroundVideo) ? backgroundVideo.url : null)

  // Check if it's a YouTube URL or direct video file
  const youtubeEmbedUrl = videoSrc ? getYouTubeEmbedUrl(videoSrc) : null
  const isYouTubeVideo = !!youtubeEmbedUrl
  const hasVideoBackground = block.mediaType === 'video' && !!videoSrc
  const hasSolidBackground = block.mediaType === 'none'

  // Parallax transform
  const parallaxTransform = block.enableParallax
    ? `translateY(${scrollY * 0.3}px) scale(1.1)`
    : undefined

  return (
    <section
      ref={heroRef}
      className={`relative ${height} w-full overflow-hidden ${hasSolidBackground ? bgColorMap[(block.backgroundColor as keyof typeof bgColorMap) || 'charcoal'] : ''}`}
      role="banner"
      aria-label="Hero section"
    >
      {/* Background Media */}
      {hasImageBackground && backgroundImage.url && (
        <div
          className="absolute inset-0 z-0"
          style={{ transform: parallaxTransform, transition: 'transform 0.1s linear' }}
        >
          <Image
            src={backgroundImage.url}
            alt={backgroundImage.alt || ''}
            fill
            className="object-cover"
            priority
            quality={90}
            sizes="100vw"
          />
        </div>
      )}

      {hasVideoBackground && videoSrc && (
        <div
          className="absolute inset-0 z-0"
          style={{ transform: parallaxTransform, transition: 'transform 0.1s linear' }}
        >
          {isYouTubeVideo && youtubeEmbedUrl ? (
            <>
              <iframe
                src={youtubeEmbedUrl}
                className={cn(
                  "absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.77vh] min-w-full -translate-x-1/2 -translate-y-1/2 object-cover",
                  videoScaleClass
                )}
                allow="autoplay; encrypted-media"
                frameBorder="0"
                title="Background video"
                aria-hidden="true"
              />
              {/* Transparent overlay prevents user interaction with video */}
              <div className="pointer-events-none absolute inset-0 z-10" />
            </>
          ) : (
            <video
              autoPlay
              loop
              muted
              playsInline
              className={cn("h-full w-full object-cover", videoScaleClass)}
              aria-hidden="true"
            >
              <source src={videoSrc} type="video/mp4" />
            </video>
          )}
        </div>
      )}

      {/* Overlay */}
      {block.overlayColor && block.overlayColor !== 'none' && (
        <div
          className={`absolute inset-0 z-10 ${overlayColorMap[block.overlayColor as keyof typeof overlayColorMap]}`}
          style={{ opacity: block.overlayOpacity || 0.5 }}
          aria-hidden="true"
        />
      )}

      {/* Subtle grain texture overlay */}
      <div
        className="absolute inset-0 z-10 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3.5' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

      {/* Floating particles (if enabled) */}
      {block.enableParticles && (
        <div className="absolute inset-0 z-10" aria-hidden="true">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute h-1 w-1 rounded-full bg-white/20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${8 + Math.random() * 8}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Content Container */}
      <div
        className={`relative z-20 flex h-full w-full flex-col px-6 md:px-12 lg:px-16 ${contentPosition} ${verticalAlign}`}
      >
        <div className={`w-full ${maxWidth}`}>
          {/* Glassmorphism Card */}
          <div
            className={cn(
              'relative',
              block.enableGlassmorphism && 'rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl md:p-12 lg:p-16'
            )}
            style={
              block.enableGlassmorphism
                ? {
                    boxShadow:
                      '0 8px 32px 0 rgba(0, 0, 0, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
                  }
                : undefined
            }
          >
            {/* Grain texture on card */}
            {block.enableGlassmorphism && (
              <div
                className="absolute inset-0 rounded-2xl opacity-[0.02]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
                }}
                aria-hidden="true"
              />
            )}

            {/* Eyebrow */}
            {block.eyebrow && (
              <div
                className={cn(
                  'mb-4 text-xs font-medium uppercase tracking-[0.2em] transition-all',
                  textColor,
                  animationDuration,
                  getAnimationClasses()
                )}
                style={{ animationDelay: '0ms' }}
              >
                {block.eyebrow}
              </div>
            )}

            {/* Show logo if no heading, otherwise show heading */}
            {showLogo ? (
              <div
                className={cn(
                  'mb-6 flex items-center justify-center transition-all',
                  animationDuration,
                  getAnimationClasses()
                )}
              >
                <Image
                  src="/images/instrumental-to-life-logo.svg"
                  alt="Instrumental to Life"
                  width={800}
                  height={316}
                  className="w-full max-w-2xl"
                  priority
                />
              </div>
            ) : (
              <h1
                className={cn(
                  'mb-6 font-serif text-4xl font-light leading-tight tracking-tight transition-all',
                  'md:text-5xl lg:text-6xl xl:text-7xl',
                  textColor,
                  animationDuration,
                  getAnimationClasses()
                )}
                style={{
                  animationDelay: block.eyebrow ? '150ms' : '0ms',
                  fontFamily: '"Playfair Display", serif',
                }}
              >
                {block.heading}
              </h1>
            )}

            {/* Subheading */}
            {block.subheading && (
              <h2
                className={cn(
                  'mb-6 text-xl font-light opacity-90 transition-all',
                  'md:text-2xl lg:text-3xl',
                  textColor,
                  animationDuration,
                  getAnimationClasses()
                )}
                style={{ animationDelay: '300ms' }}
              >
                {block.subheading}
              </h2>
            )}

            {/* Description */}
            {block.description && (
              <p
                className={cn(
                  'mb-8 text-base leading-relaxed opacity-85 transition-all',
                  'md:text-lg lg:text-xl',
                  textColor,
                  animationDuration,
                  getAnimationClasses()
                )}
                style={{ animationDelay: '450ms' }}
              >
                {block.description}
              </p>
            )}

            {/* CTA Buttons */}
            {(block.primaryCta?.text || block.secondaryCta?.text) && (
              <div
                className={cn(
                  'flex flex-col gap-4 transition-all sm:flex-row',
                  animationDuration,
                  block.contentPosition === 'center' && 'sm:justify-center',
                  block.contentPosition === 'right' && 'sm:justify-end',
                  getAnimationClasses()
                )}
                style={{ animationDelay: '600ms' }}
              >
                {/* Primary CTA */}
                {block.primaryCta?.text && block.primaryCta?.link && (
                  <Link
                    href={block.primaryCta.link}
                    target={block.primaryCta.openInNewTab ? '_blank' : undefined}
                    rel={block.primaryCta.openInNewTab ? 'noopener noreferrer' : undefined}
                    className="group relative overflow-hidden rounded-md bg-[#C41E3A] px-8 py-4 text-center font-medium text-white shadow-lg transition-all duration-300 hover:bg-[#A01828] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#C41E3A] focus:ring-offset-2"
                    onClick={() => {
                      trackCTAClick({
                        blockType: 'marketing-grand-hero',
                        blockData: { ctaTracking: ctaTracking as any },
                        ctaText: block.primaryCta?.text || '',
                        destination: block.primaryCta?.link || '',
                        additionalProps: { cta_type: 'primary', heading: block.heading },
                      })
                    }}
                  >
                    <span className="relative z-10">{block.primaryCta.text}</span>
                    {/* Shine effect on hover */}
                    <span
                      className="absolute inset-0 z-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-[100%]"
                      aria-hidden="true"
                    />
                  </Link>
                )}

                {/* Secondary CTA */}
                {block.secondaryCta?.text && block.secondaryCta?.link && (
                  <Link
                    href={block.secondaryCta.link}
                    target={block.secondaryCta.openInNewTab ? '_blank' : undefined}
                    rel={block.secondaryCta.openInNewTab ? 'noopener noreferrer' : undefined}
                    className={cn(
                      'rounded-md border-2 px-8 py-4 text-center font-medium transition-all duration-300',
                      'focus:outline-none focus:ring-2 focus:ring-offset-2',
                      textColor === 'text-white'
                        ? 'border-white text-white hover:bg-white hover:text-gray-900 focus:ring-white'
                        : 'border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white focus:ring-gray-900'
                    )}
                    onClick={() => {
                      trackCTAClick({
                        blockType: 'marketing-grand-hero',
                        blockData: { ctaTracking: ctaTracking as any },
                        ctaText: block.secondaryCta?.text || '',
                        destination: block.secondaryCta?.link || '',
                        additionalProps: { cta_type: 'secondary', heading: block.heading },
                      })
                    }}
                  >
                    {block.secondaryCta.text}
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      {block.showScrollIndicator && (
        <div
          className="absolute bottom-8 left-1/2 z-30 -translate-x-1/2"
          aria-label="Scroll to continue"
        >
          <div className="flex flex-col items-center gap-2">
            <span className={`text-xs uppercase tracking-wider ${textColor} opacity-60`}>
              Scroll
            </span>
            <ChevronDownIcon
              className={`h-6 w-6 ${textColor} animate-bounce opacity-60`}
              aria-hidden="true"
            />
          </div>
        </div>
      )}

      {/* Floating particle animation keyframes */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0;
          }
          10% {
            opacity: 0.3;
          }
          50% {
            transform: translateY(-60px) translateX(20px);
            opacity: 0.5;
          }
          90% {
            opacity: 0.3;
          }
        }
      `}</style>
    </section>
  )
}

export default MarketingGrandHeroRenderer
