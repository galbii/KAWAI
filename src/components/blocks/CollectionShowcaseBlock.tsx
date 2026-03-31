'use client'

import { Collection, Media, Product } from '@/payload-types'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface CollectionShowcaseBlockProps {
  enabled?: boolean | null
  collection?: string | Collection | null
  bannerSize?: 'xxs' | 'xs' | 'small' | 'medium' | 'large' | 'fullscreen' | null
  customSubheading?: string | null
  overrideYoutubeUrl?: string | null
  product?: Product | null
  /** When true, renders a "View Collection" CTA linking to /pianos/[handle]. Use on product pages. */
  showViewCollectionLink?: boolean
}

/**
 * Parse YouTube URL to extract video ID
 * Supports: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID
 */
function parseYouTubeId(url: string): string | null {
  if (!url) return null

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\?\/]+)/,
    /^([a-zA-Z0-9_-]{11})$/ // Direct ID
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1] ?? null
  }

  return null
}

/**
 * CollectionShowcaseBlock - Cinematic YouTube Video Banner
 *
 * A refined, Japanese-inspired banner with YouTube video background.
 * Combines wabi-sabi minimalism with European luxury aesthetics.
 */
export function CollectionShowcaseBlock({
  enabled = true,
  collection,
  bannerSize: blockBannerSize,
  customSubheading,
  overrideYoutubeUrl,
  product,
  showViewCollectionLink = false,
}: CollectionShowcaseBlockProps) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  // Don't render if disabled
  if (!enabled) return null

  // Type guard for collection object
  const isCollectionObject = typeof collection === 'object' && collection !== null
  if (!isCollectionObject) return null

  // Extract collection data with safe defaults
  const {
    youtubeUrl,
    media,
    heading,
    subheading,
    bannerSize,
    textAlignment,
    textColor,
    overlayOpacity,
    headingSize,
    fontFamily,
  } = collection

  // Apply defaults after extraction to handle null values
  // Use block override if provided, otherwise use collection's value
  const safeBannerSize = blockBannerSize ?? bannerSize ?? 'xs'
  const safeTextAlignment = textAlignment ?? 'center'
  const safeTextColor = textColor ?? 'white'
  const safeOverlayOpacity = overlayOpacity ?? 50
  const safeHeadingSize = headingSize ?? 'large'
  const safeFontFamily = fontFamily ?? 'serif'

  // Use custom subheading if provided, otherwise use collection's subheading
  const displaySubheading = customSubheading || subheading

  // Block-level YouTube URL takes priority over the collection's YouTube URL
  const activeYoutubeUrl = overrideYoutubeUrl || youtubeUrl
  const videoId = activeYoutubeUrl ? parseYouTubeId(activeYoutubeUrl) : null

  // Get fallback image — only used when no YouTube video is present
  let fallbackImage: string | null = null
  if (!videoId) {
    if (media && typeof media === 'object') {
      fallbackImage = (media as Media).url || null
    }
  }

  // Banner height mapping
  const heightClasses = {
    xxs: 'h-[150px]',
    xs: 'h-[250px]',
    small: 'h-[400px]',
    medium: 'h-[600px]',
    large: 'h-[800px]',
    fullscreen: 'h-screen min-h-[600px]',
  }

  // Text alignment mapping
  const alignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  }

  // Text color mapping with refined palette
  const colorClasses = {
    white: 'text-white',
    black: 'text-kawai-black',
    'kawai-red': 'text-kawai-red',
    'kawai-gold': 'text-[#D4AF37]',
  }

  // Heading size mapping with Japanese-inspired scale
  const headingSizeClasses = {
    small: 'text-3xl md:text-4xl lg:text-5xl',
    medium: 'text-4xl md:text-5xl lg:text-6xl',
    large: 'text-5xl md:text-6xl lg:text-7xl',
    xl: 'text-6xl md:text-7xl lg:text-8xl',
  }

  // Font family mapping
  const fontFamilyClasses = {
    serif: 'font-[\'Playfair_Display\',serif]',
    sans: 'font-[\'Inter\',sans-serif]',
  }

  // Staggered animation variants for refined reveal
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1] as const, // Custom cubic-bezier for Japanese elegance
      },
    },
  }

  // Highlights mode: tab-navigation UI over the same video background
  const highlights = (product?.highlights ?? []) as Array<{ id: string; highlight: string; description: string }>
  const hasHighlights = highlights.length > 0

  // Only bail if we're in product mode but have no highlights — collection pages always fall through to the banner
  if (product && !hasHighlights) return null

  if (hasHighlights) {
    const active = highlights[activeIndex] ?? highlights[0]
    return (
      <section className="relative w-full overflow-hidden bg-black text-white" style={{ minHeight: '420px' }}>
        {/* Video background */}
        {videoId && (
          <div className="absolute inset-0 z-0">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`}
              className={cn(
                'absolute top-1/2 left-1/2 w-[177.77777778vh] min-w-full h-[56.25vw] min-h-full -translate-x-1/2 -translate-y-1/2 pointer-events-none',
                'transition-opacity duration-1000',
                isVideoLoaded ? 'opacity-100' : 'opacity-0'
              )}
              allow="autoplay; encrypted-media"
              onLoad={() => setIsVideoLoaded(true)}
              title="Collection showcase video"
            />
          </div>
        )}

        {/* Fallback image if no video */}
        {!videoId && fallbackImage && (
          <div className="absolute inset-0 z-0">
            <Image
              src={fallbackImage}
              alt={heading || 'Collection showcase'}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>
        )}

        {/* Dark overlay */}
        <div className="absolute inset-0 z-10 bg-black/60" />

        {/* Tab Navigation */}
        <div className="relative z-20 border-b border-white/20">
          <div className="container mx-auto px-6 md:px-12 flex gap-8 overflow-x-auto">
            {highlights.map((h, i) => (
              <button
                key={h.id || i}
                onClick={() => setActiveIndex(i)}
                className={cn(
                  'py-5 text-xs tracking-[0.2em] uppercase whitespace-nowrap transition-colors',
                  i === activeIndex
                    ? 'text-white border-b-2 border-white'
                    : 'text-white/40 hover:text-white/70 border-b-2 border-transparent'
                )}
              >
                {h.highlight}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div
          key={activeIndex}
          className="relative z-20 container mx-auto px-6 md:px-12 py-20 md:py-28 animate-fade-in"
        >
          <h2 className="text-5xl md:text-7xl font-light tracking-widest uppercase mb-8 max-w-4xl">
            {active?.highlight}
          </h2>
          {active?.description && (() => {
            const lines = active.description.split('\n').filter(l => l.trim())
            if (lines.length <= 1) {
              return (
                <p className="text-base leading-relaxed text-white/70 max-w-lg">
                  {active.description}
                </p>
              )
            }
            return (
              <ul className="space-y-2 max-w-lg">
                {lines.map((line, i) => (
                  <li key={i} className="flex items-start gap-3 text-base leading-relaxed text-white/70">
                    <span className="mt-2 w-1 h-1 rounded-full bg-white/50 flex-shrink-0" />
                    {line.trim()}
                  </li>
                ))}
              </ul>
            )
          })()}
        </div>
      </section>
    )
  }

  return (
    <section
      className={cn(
        'relative w-full overflow-hidden',
        heightClasses[safeBannerSize as keyof typeof heightClasses] || heightClasses.xs
      )}
    >
      {/* YouTube Video Background */}
      {videoId && (
        <div className="absolute inset-0 z-0">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`}
            className={cn(
              'absolute top-1/2 left-1/2 w-[177.77777778vh] min-w-full h-[56.25vw] min-h-full -translate-x-1/2 -translate-y-1/2 pointer-events-none',
              'transition-opacity duration-1000',
              isVideoLoaded ? 'opacity-100' : 'opacity-0'
            )}
            allow="autoplay; encrypted-media"
            onLoad={() => setIsVideoLoaded(true)}
            title="Collection showcase video"
          />
        </div>
      )}

      {/* Fallback Image - Only shows if no video ID provided */}
      {!videoId && fallbackImage && (
        <div className="absolute inset-0 z-0">
          <Image
            src={fallbackImage}
            alt={heading || 'Collection showcase'}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
      )}

      {/* Gradient Overlay with Grain Texture - Japanese aesthetic */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background: `
            linear-gradient(
              135deg,
              rgba(0, 0, 0, ${safeOverlayOpacity / 100 * 0.7}) 0%,
              rgba(0, 0, 0, ${safeOverlayOpacity / 100 * 0.5}) 50%,
              rgba(0, 0, 0, ${safeOverlayOpacity / 100 * 0.8}) 100%
            )
          `,
        }}
      >
        {/* Subtle grain texture for wabi-sabi refinement */}
        <div
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Decorative corner accents - Japanese shoji screen inspired */}
      <div className="absolute top-0 left-0 w-24 h-24 z-20 opacity-30">
        <svg viewBox="0 0 100 100" className={colorClasses[safeTextColor as keyof typeof colorClasses]}>
          <line x1="0" y1="20" x2="20" y2="20" stroke="currentColor" strokeWidth="1" />
          <line x1="20" y1="0" x2="20" y2="20" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>
      <div className="absolute bottom-0 right-0 w-24 h-24 z-20 opacity-30 rotate-180">
        <svg viewBox="0 0 100 100" className={colorClasses[safeTextColor as keyof typeof colorClasses]}>
          <line x1="0" y1="20" x2="20" y2="20" stroke="currentColor" strokeWidth="1" />
          <line x1="20" y1="0" x2="20" y2="20" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>

      {/* Content Container */}
      <motion.div
        className={cn(
          'relative z-30 container mx-auto px-6 md:px-12 h-full',
          'flex flex-col justify-center',
          alignmentClasses[safeTextAlignment as keyof typeof alignmentClasses] || alignmentClasses.center
        )}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {/* Heading with refined typography */}
        {heading && (
          <motion.h2
            variants={itemVariants}
            className={cn(
              'font-bold leading-[1.1] tracking-tight mb-6',
              'drop-shadow-2xl',
              headingSizeClasses[safeHeadingSize as keyof typeof headingSizeClasses] || headingSizeClasses.large,
              fontFamilyClasses[safeFontFamily as keyof typeof fontFamilyClasses] || fontFamilyClasses.serif,
              colorClasses[safeTextColor as keyof typeof colorClasses] || colorClasses.white,
              // Japanese-inspired letter spacing for refinement
              safeFontFamily === 'serif' ? 'tracking-tight' : 'tracking-wide'
            )}
            style={{
              textShadow: '0 4px 24px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.3)',
            }}
          >
            {heading}
          </motion.h2>
        )}

        {/* Decorative divider - minimalist accent */}
        {heading && displaySubheading && (
          <motion.div
            variants={itemVariants}
            className={cn(
              'w-16 h-[2px] mb-6',
              safeTextAlignment === 'center' && 'mx-auto',
              safeTextAlignment === 'right' && 'ml-auto',
              colorClasses[safeTextColor as keyof typeof colorClasses] || colorClasses.white
            )}
            style={{
              background: `linear-gradient(90deg,
                ${safeTextColor === 'kawai-red' ? '#C41E3A' :
                  safeTextColor === 'kawai-gold' ? '#D4AF37' :
                  safeTextColor === 'black' ? '#1a1a1a' :
                  '#ffffff'} 0%,
                transparent 100%)`,
            }}
          />
        )}

        {/* Subheading with elegant restraint */}
        {displaySubheading && (
          <motion.p
            variants={itemVariants}
            className={cn(
              'text-lg md:text-xl lg:text-2xl',
              'leading-relaxed max-w-3xl',
              'font-light tracking-wide',
              colorClasses[safeTextColor as keyof typeof colorClasses] || colorClasses.white,
              // Subtle opacity for hierarchy
              'opacity-90',
              'drop-shadow-lg'
            )}
            style={{
              textShadow: '0 2px 12px rgba(0, 0, 0, 0.3)',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {displaySubheading}
          </motion.p>
        )}

        {/* View Collection CTA — appears on product pages to link to the collection page */}
        {showViewCollectionLink && isCollectionObject && collection.handle && (
          <motion.div variants={itemVariants} className="mt-8">
            <Link
              href={`/pianos/${collection.handle}`}
              className={cn(
                'inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold tracking-wide',
                'border rounded transition-all duration-300',
                safeTextColor === 'white' || safeTextColor === 'kawai-gold'
                  ? 'border-white/60 text-white hover:bg-white hover:text-kawai-black'
                  : 'border-kawai-black/60 text-kawai-black hover:bg-kawai-black hover:text-white',
              )}
            >
              Explore the Collection
              <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </motion.div>
        )}

        {/* Scroll indicator for fullscreen banners - refined detail */}
        {safeBannerSize === 'fullscreen' && (
          <motion.div
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0, y: -10 }}
            animate={{
              opacity: [0.4, 1, 0.4],
              y: [0, 8, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className={colorClasses[safeTextColor as keyof typeof colorClasses] || colorClasses.white}
            >
              <path
                d="M12 5V19M12 19L19 12M12 19L5 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        )}
      </motion.div>
    </section>
  )
}
