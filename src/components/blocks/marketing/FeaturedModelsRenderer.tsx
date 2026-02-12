'use client'

import React, { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Media, Product } from '@/payload-types'
import { CheckIcon, StarIcon, MusicalNoteIcon, SparklesIcon } from '@heroicons/react/24/solid'
import { TrophyIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import { getYouTubeEmbedUrl } from '@/lib/utils/youtube'

interface FeaturedModelsRendererProps {
  block: any // Will use MarketingFeaturedModelsBlock after types are generated
}

// Type guard for Media object
function isMediaObject(media: Media | string | null | undefined): media is Media {
  return typeof media === 'object' && media !== null && 'url' in media
}

// Type guard for Product object
function isProductObject(product: Product | string | null | undefined): product is Product {
  return typeof product === 'object' && product !== null && 'name' in product
}

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  check: CheckIcon,
  star: StarIcon,
  music: MusicalNoteIcon,
  piano: MusicalNoteIcon,
  sparkles: SparklesIcon,
  trophy: TrophyIcon,
  diamond: SparklesIcon,
  sakura: SparklesIcon,
}

export const FeaturedModelsRenderer: React.FC<FeaturedModelsRendererProps> = ({ block }) => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visibleModels, setVisibleModels] = useState<Set<number>>(new Set())
  const [activeVideoModal, setActiveVideoModal] = useState<{
    isOpen: boolean
    videoUrl: string | null
    title: string
  }>({
    isOpen: false,
    videoUrl: null,
    title: '',
  })

  // Scroll-triggered animations with Intersection Observer
  useEffect(() => {
    if (!block.enableAnimations) {
      // If animations disabled, show all immediately
      setVisibleModels(new Set(block.models?.map((_: any, i: number) => i) || []))
      return
    }

    const observers: IntersectionObserver[] = []

    const modelElements = sectionRef.current?.querySelectorAll('[data-model-index]')
    if (!modelElements) return

    modelElements.forEach((element, index) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                setVisibleModels((prev) => new Set([...prev, index]))
              }, index * 150) // Staggered delay
            }
          })
        },
        { threshold: 0.2, rootMargin: '0px 0px -100px 0px' }
      )

      observer.observe(element)
      observers.push(observer)
    })

    return () => {
      observers.forEach((observer) => observer.disconnect())
    }
  }, [block.enableAnimations, block.models])

  // Handle ESC key to close video modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeVideoModal.isOpen) {
        setActiveVideoModal({ isOpen: false, videoUrl: null, title: '' })
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [activeVideoModal.isOpen])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (activeVideoModal.isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [activeVideoModal.isOpen])

  // Theme mappings
  const themeMap = {
    light: 'bg-[#F8F8F8]',
    dark: 'bg-[#2C2C2C]',
    transparent: 'bg-transparent',
  }

  const textColorMap = {
    light: 'text-[#2C2C2C]',
    dark: 'text-white',
    transparent: 'text-[#2C2C2C]',
  }

  // Spacing mappings
  const spacingMap = {
    compact: 'gap-8 md:gap-12',
    comfortable: 'gap-16 md:gap-24',
    spacious: 'gap-24 md:gap-32',
  }

  const theme = block.theme || 'light'
  const bgColor = themeMap[theme as keyof typeof themeMap] || themeMap.light
  const textColor = textColorMap[theme as keyof typeof textColorMap] || textColorMap.light
  const spacing = spacingMap[(block.spacing as keyof typeof spacingMap) || 'comfortable']

  // Content card style mappings
  const cardStyleMap = {
    glassmorphism:
      'bg-white/90 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.08)]',
    solid: 'bg-white shadow-[0_16px_48px_0_rgba(0,0,0,0.12)]',
    minimal: 'bg-transparent',
  }

  const cardStyle =
    cardStyleMap[(block.contentCardStyle as keyof typeof cardStyleMap) || 'glassmorphism']

  // Mobile layout mappings
  const mobileLayoutMap = {
    stack: 'flex-col',
    'stack-reverse': 'flex-col-reverse',
    overlay: 'relative',
  }

  const mobileLayout =
    mobileLayoutMap[(block.mobileLayout as keyof typeof mobileLayoutMap) || 'stack']

  return (
    <section
      ref={sectionRef}
      className={cn('py-16 md:py-24 lg:py-32 transition-colors duration-700', bgColor)}
    >
      {/* Section Header - Centered Container */}
      {(block.eyebrow || block.heading || block.subheading) && (
        <div className="mx-auto max-w-7xl px-6 lg:px-8 mb-16 md:mb-24">
          <div className="text-center">
            {block.eyebrow && (
              <p
                className={cn(
                  'mb-4 text-sm font-medium uppercase tracking-[0.2em] opacity-70',
                  textColor
                )}
              >
                {block.eyebrow}
              </p>
            )}
            {block.heading && (
              <h2
                className={cn(
                  'font-serif text-4xl md:text-5xl lg:text-6xl font-light leading-tight mb-6',
                  textColor
                )}
              >
                {block.heading}
              </h2>
            )}
            {block.subheading && (
              <p
                className={cn(
                  'mx-auto max-w-2xl text-lg md:text-xl leading-relaxed opacity-80',
                  textColor
                )}
              >
                {block.subheading}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Featured Models - Full Width */}
      <div className={cn('flex flex-col', spacing)}>
          {block.models?.map((model: any, index: number) => {
            const isVisible = visibleModels.has(index)
            const isLeftLayout = model.layoutDirection === 'left'

            // Background media - prioritize YouTube URL over image
            const backgroundVideoUrl = model.backgroundVideoUrl
            const backgroundYoutubeEmbedUrl = backgroundVideoUrl
              ? getYouTubeEmbedUrl(backgroundVideoUrl)
              : null
            const backgroundImage = model.backgroundImage
            const hasBackgroundImage = isMediaObject(backgroundImage)
            const hasBackgroundVideo = !!backgroundYoutubeEmbedUrl

            // Popup video
            const popupVideoUrl = model.popupVideoUrl
            const popupYoutubeEmbedUrl = popupVideoUrl ? getYouTubeEmbedUrl(popupVideoUrl) : null
            const showPlayButton = model.enableVideoPopup && !!popupYoutubeEmbedUrl

            // Content image
            const contentImage = model.contentImage
            const hasContentImage = isMediaObject(contentImage)

            const product = model.product
            const productName = isProductObject(product) ? product.name : null
            const displayTitle = model.customTitle || productName || 'Featured Model'

            const handlePlayClick = () => {
              if (popupYoutubeEmbedUrl) {
                setActiveVideoModal({
                  isOpen: true,
                  videoUrl: popupYoutubeEmbedUrl,
                  title: displayTitle,
                })
              }
            }

            // Animation classes
            const animationClasses = block.enableAnimations
              ? isVisible
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 translate-y-12 scale-98'
              : 'opacity-100'

            return (
              <div
                key={index}
                data-model-index={index}
                className={cn(
                  'relative w-full overflow-hidden transition-all duration-1000 ease-out',
                  animationClasses
                )}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Grid Container - Background and Content in same grid cell, content drives height */}
                <div className="relative w-full grid grid-cols-1 grid-rows-1 min-h-[500px]">
                  {/* YouTube Video Background (Priority) - Grid Layer 1 */}
                  {hasBackgroundVideo && (
                    <div className="col-start-1 row-start-1 w-full h-full overflow-hidden">
                      <iframe
                        src={`${backgroundYoutubeEmbedUrl}&autoplay=1&mute=1&loop=1&controls=0&showinfo=0&modestbranding=1&playsinline=1&playlist=${backgroundYoutubeEmbedUrl.split('/').pop()?.split('?')[0]}`}
                        className="absolute pointer-events-none"
                        style={{
                          border: 'none',
                          top: '50%',
                          left: '50%',
                          width: '177.77777778vh',
                          height: '56.25vw',
                          minWidth: '100%',
                          minHeight: '100%',
                          transform: 'translate(-50%, -50%)',
                        }}
                        allow="autoplay; encrypted-media"
                        title={displayTitle}
                      />
                    </div>
                  )}

                  {/* Background Image (Fallback) - Grid Layer 1 */}
                  {!hasBackgroundVideo && hasBackgroundImage && (
                    <div className="col-start-1 row-start-1 w-full h-full">
                      <Image
                        src={backgroundImage.url || ''}
                        alt={backgroundImage.alt || displayTitle}
                        fill
                        className="object-cover"
                        sizes="100vw"
                        priority={index === 0}
                      />
                    </div>
                  )}

                  {/* Dark Overlay - Grid Layer 2 */}
                  <div
                    className="col-start-1 row-start-1 w-full h-full bg-gradient-to-br from-black/60 via-black/40 to-black/60"
                    style={{ opacity: model.overlayOpacity || 0.3 }}
                  />

                  {/* Decorative grain texture - Grid Layer 3 */}
                  <div
                    className="col-start-1 row-start-1 w-full h-full opacity-[0.03] mix-blend-overlay pointer-events-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    }}
                  />

                  {/* Content Card - Grid Layer 4, drives container height with natural flow */}
                  <div
                    className={cn(
                      'col-start-1 row-start-1 flex items-center',
                      'py-8 md:py-12 lg:py-16',
                      'px-4 md:px-6 lg:px-12 xl:px-16 2xl:px-20',
                      isLeftLayout ? 'justify-end' : 'justify-start'
                    )}
                  >
                    <div
                      className={cn(
                        'w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl',
                        'p-8 md:p-10 lg:p-12',
                        'rounded-2xl transition-all duration-700',
                        cardStyle
                      )}
                    >
                      {/* Product Badge */}
                      {isProductObject(product) && product.category && (
                        <div className="mb-4">
                          <span className="inline-block px-3 py-1 text-xs font-medium uppercase tracking-wider text-[#e21d30] border border-[#e21d30]/20 rounded-full">
                            {product.category}
                          </span>
                        </div>
                      )}

                      {/* Title - Large Serif with Subtle Accent */}
                      <div className="mb-6">
                        <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light leading-[1.1] text-[#2C2C2C] mb-3">
                          {displayTitle}
                        </h3>
                        <div className="w-12 h-px bg-[#e21d30]/30" />
                      </div>

                      {/* Mobile: Large Product Image Below Title */}
                      {hasContentImage && (() => {
                        // Map imageZoom values to className
                        const imageZoom = model.imageZoom || 'cover'
                        const zoomClassMap: Record<string, string> = {
                          'cover': 'object-cover',
                          'contain': 'object-contain',
                          'zoom-in': 'object-cover scale-[1.2]',
                          'zoom-out': 'object-contain scale-[0.8]',
                        }
                        const zoomClass = zoomClassMap[imageZoom] || 'object-cover'

                        return (
                          <div className="lg:hidden relative w-full aspect-[4/3] mb-6 rounded-lg overflow-hidden shadow-lg">
                            <Image
                              src={contentImage.url || ''}
                              alt={contentImage.alt || displayTitle}
                              fill
                              className={cn('transition-transform duration-500', zoomClass)}
                              sizes="(max-width: 1024px) 100vw, 0px"
                            />
                          </div>
                        )
                      })()}

                      {/* Description - Generous Line Height */}
                      {model.description && (
                        <p className="text-base md:text-lg leading-relaxed text-[#2C2C2C]/75 mb-8">
                          {model.description}
                        </p>
                      )}

                      {/* Features Row - Horizontal Inline Pills */}
                      {model.features && model.features.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-8">
                          {model.features.slice(0, 4).map((feature: any, fIndex: number) => {
                            const IconComponent = iconMap[feature.icon] || CheckIcon
                            return (
                              <div
                                key={fIndex}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2C2C2C]/5 border border-[#2C2C2C]/10 hover:bg-[#2C2C2C]/10 transition-colors duration-200"
                              >
                                <IconComponent className="w-3.5 h-3.5 text-[#e21d30]" />
                                <span className="text-xs md:text-sm text-[#2C2C2C]/90 font-medium">
                                  {feature.text}
                                </span>
                              </div>
                            )
                          })}
                          {model.features.length > 4 && (
                            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-[#2C2C2C]/5 border border-[#2C2C2C]/10">
                              <span className="text-xs text-[#2C2C2C]/60">
                                +{model.features.length - 4} more
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Action Row - Video + CTA Side-by-Side */}
                      <div className="flex flex-wrap items-center gap-3">
                        {/* Video Button - Subtle, Icon-Based */}
                        {showPlayButton && (
                          <button
                            onClick={handlePlayClick}
                            className="group inline-flex items-center gap-2 text-[#2C2C2C]/70 hover:text-[#e21d30] transition-colors duration-200"
                          >
                            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-[#e21d30]/10 group-hover:bg-[#e21d30]/20 transition-colors duration-200">
                              <svg className="w-4 h-4 ml-0.5 text-[#e21d30]" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </span>
                            <span className="text-sm font-medium">Watch Video</span>
                          </button>
                        )}

                        {/* CTA Button - Refined, Right-Aligned */}
                        {model.ctaText && model.ctaLink && (
                          <Link
                            href={model.ctaLink}
                            target={model.ctaOpenInNewTab ? '_blank' : '_self'}
                            rel={model.ctaOpenInNewTab ? 'noopener noreferrer' : undefined}
                            className={cn(
                              'group inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300',
                              'ml-auto',
                              model.ctaStyle === 'primary' &&
                                'bg-[#e21d30] text-white hover:bg-[#c41e3a] shadow-sm hover:shadow-md',
                              model.ctaStyle === 'secondary' &&
                                'border border-[#2C2C2C]/20 text-[#2C2C2C] hover:border-[#2C2C2C]/40 hover:bg-[#2C2C2C]/5',
                              model.ctaStyle === 'tertiary' &&
                                'text-[#2C2C2C]/70 hover:text-[#e21d30]'
                            )}
                          >
                            <span>{model.ctaText}</span>
                            <svg
                              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

      {/* Video Modal */}
      {activeVideoModal.isOpen && activeVideoModal.videoUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={() => setActiveVideoModal({ isOpen: false, videoUrl: null, title: '' })}
        >
          <div
            className="relative w-full max-w-5xl mx-4 md:mx-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveVideoModal({ isOpen: false, videoUrl: null, title: '' })}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 rounded-full p-2"
              aria-label="Close video"
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Video Title */}
            {activeVideoModal.title && (
              <h3 className="text-white text-xl md:text-2xl font-serif mb-4 text-center">
                {activeVideoModal.title}
              </h3>
            )}

            {/* Video Container - 16:9 Aspect Ratio */}
            <div className="relative w-full pt-[56.25%] bg-black rounded-lg overflow-hidden shadow-2xl">
              <iframe
                src={`${activeVideoModal.videoUrl}?autoplay=1`}
                className="absolute inset-0 w-full h-full"
                style={{ border: 'none' }}
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
                title={activeVideoModal.title}
              />
            </div>

            {/* ESC to Close Hint */}
            <p className="text-white/60 text-sm text-center mt-4">
              Press <kbd className="px-2 py-1 bg-white/10 rounded">ESC</kbd> to close
            </p>
          </div>
        </div>
      )}
    </section>
  )
}
