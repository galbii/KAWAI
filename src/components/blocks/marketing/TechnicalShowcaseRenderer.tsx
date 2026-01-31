'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import type { MarketingTechnicalShowcaseBlock, Media } from '@/payload-types'
import { cn } from '@/lib/utils'
import { getImagePropsWithFallback } from '@/lib/fallbacks/media'

interface TechnicalShowcaseRendererProps extends MarketingTechnicalShowcaseBlock {}

// Extract YouTube video ID from various URL formats
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match?.[1]) {
      return match[1]
    }
  }

  return null
}

export function TechnicalShowcaseRenderer({
  heading,
  subheading,
  youtubeUrl,
  videoThumbnail,
  videoDuration,
  products,
  settings,
}: TechnicalShowcaseRendererProps) {
  const [videoLoaded, setVideoLoaded] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  const theme = settings?.theme ?? 'dark'
  const enableAnimations = settings?.enableAnimations ?? true

  const youtubeId = youtubeUrl ? extractYouTubeId(youtubeUrl) : null
  const thumbnailMedia = videoThumbnail as Media | string | null | undefined
  const thumbnailUrl =
    thumbnailMedia && typeof thumbnailMedia === 'object' && 'url' in thumbnailMedia
      ? thumbnailMedia.url
      : youtubeId
      ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
      : null

  // Refined theme with more visible borders and subtle backgrounds
  const themeClasses = {
    dark: {
      bg: 'bg-kawai-charcoal',
      text: 'text-kawai-pearl',
      textMuted: 'text-kawai-pearl/60',
      sectionLabel: 'text-kawai-red',
      cardBg: 'bg-white/[0.03]',
      cardBorder: 'border-white/15',
      cardHover: 'hover:border-kawai-gold/40 hover:bg-white/[0.05]',
      featureBg: 'bg-kawai-black/30',
      badgeBg: 'bg-kawai-gold/25',
      badgeText: 'text-kawai-gold',
      bulletNormal: 'bg-kawai-pearl/40',
      bulletHighlight: 'bg-kawai-gold',
    },
    light: {
      bg: 'bg-white',
      text: 'text-kawai-charcoal',
      textMuted: 'text-kawai-charcoal/60',
      sectionLabel: 'text-kawai-red',
      cardBg: 'bg-white',
      cardBorder: 'border-kawai-charcoal/10',
      cardHover: 'hover:border-kawai-red/40',
      featureBg: 'bg-white',
      badgeBg: 'bg-kawai-red/10',
      badgeText: 'text-kawai-red',
      bulletNormal: 'bg-kawai-charcoal/30',
      bulletHighlight: 'bg-kawai-red',
    },
  }

  const currentTheme = themeClasses[theme as keyof typeof themeClasses] || themeClasses.dark

  // Refined animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 32 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
    },
  }

  // Product grid layouts - uniform sizing for comparisons
  const getProductLayout = (index: number, total: number) => {
    if (total === 2) {
      // Equal 50/50 split for side-by-side comparison
      return 'md:col-span-1'
    }
    if (total === 3) {
      // Featured, then two equal
      return index === 0 ? 'md:col-span-2' : 'md:col-span-1'
    }
    // 4 products: Featured large, three smaller
    return index === 0 ? 'md:col-span-2 md:row-span-2' : 'md:col-span-1'
  }

  return (
    <section ref={sectionRef} className={cn('py-24 md:py-32', currentTheme.bg)}>
      <div className="container mx-auto px-6 sm:px-8 max-w-[1600px]">
        <motion.div
          initial={enableAnimations ? 'hidden' : false}
          animate={isInView ? 'visible' : 'hidden'}
          variants={containerVariants}
        >
          {/* Video Section - Editorial Hero */}
          <motion.div variants={itemVariants} className="mb-20 md:mb-28">
            {/* Heading - Dramatic scale with asymmetric alignment */}
            <div className="max-w-5xl mb-12">
              <h2
                className={cn(
                  'text-4xl sm:text-5xl lg:text-7xl font-light font-serif leading-[0.95] tracking-tight mb-6',
                  currentTheme.text
                )}
              >
                {heading}
              </h2>

              {/* Subheading - Offset for asymmetry */}
              {subheading && (
                <p className={cn('text-lg sm:text-xl leading-relaxed max-w-2xl ml-0 md:ml-12', currentTheme.textMuted)}>
                  {subheading}
                </p>
              )}
            </div>

            {/* Video - Wide cinematic aspect */}
            <div className="relative w-full overflow-hidden">
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                {!videoLoaded && thumbnailUrl && (
                  <div className="absolute inset-0">
                    <Image
                      src={thumbnailUrl}
                      alt={heading}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1600px) 100vw, 1600px"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-kawai-black/50 via-transparent to-transparent" />

                    {/* Minimalist Play Button */}
                    <button
                      onClick={() => setVideoLoaded(true)}
                      className="absolute inset-0 flex items-center justify-center group/play"
                      aria-label="Play video"
                    >
                      <div className="w-20 h-20 sm:w-24 sm:h-24 border-2 border-white/90 flex items-center justify-center transition-all duration-500 group-hover/play:border-kawai-red group-hover/play:scale-110">
                        <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </button>

                    {/* Duration Badge */}
                    {videoDuration && (
                      <div className="absolute bottom-6 right-6 px-3 py-1.5 bg-kawai-black/80 backdrop-blur-sm text-white text-sm font-light tracking-wide">
                        {videoDuration}
                      </div>
                    )}
                  </div>
                )}

                {videoLoaded && youtubeId && (
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&modestbranding=1&rel=0`}
                    title={heading}
                    className="absolute top-0 left-0 w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                )}
              </div>
            </div>
          </motion.div>

          {/* Products - Uniform Layout for Comparisons */}
          {products && products.length > 0 && (
            <motion.div
              variants={itemVariants}
              className={cn(
                'grid gap-8 md:gap-12',
                products.length === 2 && 'md:grid-cols-2',
                products.length === 3 && 'md:grid-cols-3',
                products.length === 4 && 'md:grid-cols-3 md:grid-rows-2'
              )}
            >
              {products.map((product, idx) => {
                const imageSrc = product.imageUrl || (product.image as Media | string)
                const imageProps = getImagePropsWithFallback(
                  imageSrc,
                  '/images/defaults/piano-fallback.jpg',
                  'card'
                )
                const isFirst = idx === 0
                const layoutClass = getProductLayout(idx, products.length)

                return (
                  <motion.div
                    key={product.id || idx}
                    variants={itemVariants}
                    className={cn('group/product relative', layoutClass)}
                  >
                    {/* Badge - Absolute positioned */}
                    {product.badge && (
                      <div
                        className={cn(
                          'absolute -top-3 left-0 px-4 py-1.5 text-xs font-medium uppercase tracking-widest z-20',
                          currentTheme.badgeBg,
                          currentTheme.badgeText
                        )}
                      >
                        {product.badge}
                      </div>
                    )}

                    {/* Product Image - Compact aspect ratio for comparison */}
                    <div className="relative w-full mb-8">
                      <div className="relative w-full" style={{ paddingBottom: '50%' }}>
                        <Image
                          {...imageProps}
                          alt={product.name}
                          className="absolute inset-0 object-contain w-full h-full"
                        />
                      </div>
                    </div>

                    {/* Product Name - Uniform typography for comparison */}
                    <h3 className={cn(
                      'font-serif leading-tight mb-6 text-2xl md:text-3xl',
                      currentTheme.text
                    )}>
                      {product.name}
                    </h3>

                    {/* Features Table - Clean presentation style */}
                    {product.features && product.features.length > 0 && (
                      <div className="mb-6 overflow-hidden">
                        <table className="w-full">
                          <tbody>
                            {product.features.map((feature, featureIdx) => (
                              <tr
                                key={feature.id || featureIdx}
                                className={cn(
                                  'border-t transition-colors',
                                  currentTheme.cardBorder,
                                  feature.highlight && 'border-kawai-gold/30'
                                )}
                              >
                                <td className={cn(
                                  'py-3 pr-4 text-sm leading-relaxed',
                                  feature.highlight ? cn('font-medium', currentTheme.sectionLabel) : currentTheme.text
                                )}>
                                  {feature.text}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Product Link - Minimal underline style */}
                    {product.url && (
                      <Link
                        href={product.url}
                        className={cn(
                          'inline-block text-sm font-medium tracking-wide uppercase border-b-2 pb-1 transition-all',
                          currentTheme.sectionLabel,
                          'border-current hover:border-kawai-gold hover:text-kawai-gold'
                        )}
                      >
                        View Details
                      </Link>
                    )}
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
