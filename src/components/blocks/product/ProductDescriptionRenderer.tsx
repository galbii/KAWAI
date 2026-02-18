'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import type { ProductDescriptionBlock, Product } from '@/payload-types'
import { getImagePropsWithFallback } from '@/lib/media/r2-utils'
import { cn } from '@/lib/utils'
import { extractYouTubeId, buildYouTubeEmbedUrl } from '@/lib/utils/youtube'

// -------------------------------------------------------------------
// Local types (product.customMedia populated after next `bun run build`)
// -------------------------------------------------------------------
interface CustomMediaItem {
  mediaType?: 'media' | 'youtube' | null
  image?: unknown
  youtubeUrl?: string | null
  alt?: string | null
}

interface ProductDescriptionRendererProps extends ProductDescriptionBlock {
  product?: Product & {
    customMedia?: CustomMediaItem[] | null
  }
}

// -------------------------------------------------------------------
// Unified carousel item — built from Shopify media + CMS mediaItems
// -------------------------------------------------------------------
type UnifiedMediaItem = {
  type: 'image' | 'youtube' | 'video'
  // image
  imageUrl?: string | undefined
  imageAlt?: string | undefined
  // youtube
  youtubeEmbedUrl?: string | undefined
  youtubeId?: string | undefined
  // shopify-hosted video
  videoUrl?: string | undefined
  videoMimeType?: string | undefined
  thumbnailUrl?: string | undefined
  // metadata
  title?: string | undefined
  caption?: string | undefined
}

// -------------------------------------------------------------------
// Helpers
// -------------------------------------------------------------------
function extractYouTubeIdFromEmbed(embedUrl: string): string | null {
  const match = embedUrl.match(/youtube\.com\/embed\/([^?&/]+)/)
  return match?.[1] ?? null
}

// -------------------------------------------------------------------
// Component
// -------------------------------------------------------------------
export function ProductDescriptionRenderer(props: ProductDescriptionRendererProps) {
  const { background, mediaGallerySettings, content, layout, product } = props

  const [isExpanded, setIsExpanded] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const thumbnailsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  // ----------------------------------------------------------------
  // Description text
  // ----------------------------------------------------------------
  const description = content?.useCustomDescription
    ? content?.customDescription ?? null
    : product?.description ?? null

  const productName = content?.showProductName && product?.name ? product.name : null
  const modelDisplay = product?.model ?? product?.name ?? null

  const shouldTruncate = (description?.length ?? 0) > 250
  const truncatedDescription = shouldTruncate
    ? description!.slice(0, 250).trim() + '...'
    : description

  // ----------------------------------------------------------------
  // Background media
  // ----------------------------------------------------------------
  let youtubeEmbedUrl: string | null = null
  if (background?.mediaType === 'youtube' && background?.youtubeUrl) {
    const videoId = extractYouTubeId(background.youtubeUrl)
    if (videoId) youtubeEmbedUrl = buildYouTubeEmbedUrl(videoId)
  }
  const hasBackgroundImage = background?.mediaType === 'image' && Boolean(background?.backgroundImage)
  const hasBackgroundVideo = Boolean(youtubeEmbedUrl)
  const hasBackgroundMedia = hasBackgroundImage || hasBackgroundVideo

  // ----------------------------------------------------------------
  // Build unified carousel items:
  // Order: customMedia YouTube → customMedia images → Shopify media
  // ----------------------------------------------------------------
  const customMedia = (product?.customMedia as CustomMediaItem[] | null | undefined) ?? []

  // 1a. YouTube items from customMedia (shown first)
  const customYoutubeItems: UnifiedMediaItem[] = customMedia
    .filter((item) => item.mediaType === 'youtube' && item.youtubeUrl)
    .flatMap((item): UnifiedMediaItem[] => {
      const youtubeId = extractYouTubeId(item.youtubeUrl!)
      if (!youtubeId) return []
      return [{
        type: 'youtube',
        youtubeEmbedUrl: `https://www.youtube.com/embed/${youtubeId}?modestbranding=1&rel=0`,
        youtubeId,
        caption: item.alt ?? undefined,
      }]
    })

  // 1b. Image items from customMedia (shown after YouTube)
  const customImageItems: UnifiedMediaItem[] = customMedia
    .filter((item) => !item.mediaType || item.mediaType === 'media')
    .flatMap((item): UnifiedMediaItem[] => {
      if (!item.image) return []
      const imageProps = getImagePropsWithFallback(
        item.image as Parameters<typeof getImagePropsWithFallback>[0],
        '/images/defaults/product-description-bg.jpg',
        'gallery'
      )
      return [{
        type: 'image',
        imageUrl: imageProps.src,
        imageAlt: item.alt ?? '',
        caption: item.alt ?? undefined,
      }]
    })

  // 2. Shopify product media — appended last
  const shopifyItems: UnifiedMediaItem[] = (product?.shopifyMedia ?? [])
    .filter((m) => m.status !== 'FAILED' && m.status !== 'PROCESSING')
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    .flatMap((media): UnifiedMediaItem[] => {
      if (media.mediaType === 'IMAGE' && media.imageUrl) {
        return [{
          type: 'image',
          imageUrl: media.imageUrl,
          imageAlt: media.alt ?? '',
        }]
      }
      if (media.mediaType === 'EXTERNAL_VIDEO' && media.host === 'YOUTUBE') {
        const youtubeId =
          extractYouTubeId(media.originUrl ?? '') ??
          extractYouTubeIdFromEmbed(media.embedUrl ?? '')
        if (!youtubeId) return []
        return [{
          type: 'youtube',
          youtubeEmbedUrl: `https://www.youtube.com/embed/${youtubeId}?modestbranding=1&rel=0`,
          youtubeId,
        }]
      }
      if (media.mediaType === 'VIDEO' && media.videoUrl) {
        return [{
          type: 'video',
          videoUrl: media.videoUrl,
          videoMimeType: media.videoMimeType ?? undefined,
          thumbnailUrl: media.thumbnailUrl ?? undefined,
        }]
      }
      return []
    })

  // Combined: customMedia YouTube → customMedia images → Shopify media
  const allItems: UnifiedMediaItem[] = [...customYoutubeItems, ...customImageItems, ...shopifyItems]
  const currentItem = allItems[currentIndex] ?? null

  // ----------------------------------------------------------------
  // Carousel navigation
  // ----------------------------------------------------------------
  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? allItems.length - 1 : prev - 1))
  }, [allItems.length])

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % allItems.length)
  }, [allItems.length])

  // ----------------------------------------------------------------
  // Gallery settings
  // ----------------------------------------------------------------
  const galleryLayout = mediaGallerySettings?.layout ?? 'carousel'
  const galleryTheme = mediaGallerySettings?.theme ?? 'dark'

  const themeClasses = {
    dark: {
      bg: 'bg-kawai-charcoal',
      text: 'text-kawai-pearl',
      textMuted: 'text-kawai-pearl/70',
      border: 'border-kawai-pearl/10',
      activeBorder: 'border-kawai-red',
    },
    light: {
      bg: 'bg-kawai-pearl',
      text: 'text-kawai-black',
      textMuted: 'text-kawai-black/70',
      border: 'border-kawai-black/10',
      activeBorder: 'border-kawai-red',
    },
  }
  const theme = themeClasses[galleryTheme as keyof typeof themeClasses] ?? themeClasses.dark

  // ----------------------------------------------------------------
  // Classic layout styling
  // ----------------------------------------------------------------
  const effectiveTextColor = !hasBackgroundMedia ? 'black' : (layout?.textColor ?? 'white')

  const contentAlignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  }
  const verticalAlignmentClasses = {
    top: 'justify-start',
    center: 'justify-center',
    bottom: 'justify-end',
  }
  const textColorClasses = {
    white: 'text-white',
    black: 'text-black',
    charcoal: 'text-kawai-charcoal',
  }
  const textSizeClasses = {
    normal: 'text-base md:text-lg',
    large: 'text-lg md:text-xl',
    xlarge: 'text-xl md:text-2xl',
  }
  const minHeightClasses = {
    small: 'min-h-[400px]',
    medium: 'min-h-[600px]',
    large: 'min-h-[800px]',
    fullscreen: 'min-h-screen',
  }
  const overlayColorClasses = {
    dark: 'bg-black',
    light: 'bg-white',
    'kawai-red': 'bg-kawai-red',
    none: '',
  }

  const contentAlignment = layout?.contentAlignment ?? 'center'
  const verticalAlignment = layout?.verticalAlignment ?? 'center'
  const textSize = layout?.textSize ?? 'normal'
  const useGlassmorphism = layout?.useGlassmorphism ?? false
  const minHeight = layout?.minHeight ?? 'medium'
  const overlayColor = background?.overlayColor ?? 'dark'
  const overlayOpacity = background?.overlayOpacity ?? 50

  // ----------------------------------------------------------------
  // Early exit — nothing to show
  // ----------------------------------------------------------------
  if (!description && allItems.length === 0) {
    console.warn('[ProductDescription] No content available — block will not render')
    return null
  }

  // ----------------------------------------------------------------
  // Thumbnail helper
  // ----------------------------------------------------------------
  const getThumbnailSrc = (item: UnifiedMediaItem): string | null => {
    if (item.type === 'youtube' && item.youtubeId) {
      return `https://img.youtube.com/vi/${item.youtubeId}/mqdefault.jpg`
    }
    if (item.type === 'image' && item.imageUrl) {
      return item.imageUrl
    }
    if (item.type === 'video' && item.thumbnailUrl) {
      return item.thumbnailUrl
    }
    return null
  }

  // ----------------------------------------------------------------
  // Active media renderer
  // ----------------------------------------------------------------
  const renderMediaItem = (item: UnifiedMediaItem) => {
    if (item.type === 'youtube' && item.youtubeEmbedUrl) {
      return (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.iframe
              key={item.youtubeEmbedUrl}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              src={item.youtubeEmbedUrl}
              className="absolute inset-0 w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              title={item.title ?? 'Video'}
            />
          </AnimatePresence>
        </div>
      )
    }

    if (item.type === 'video' && item.videoUrl) {
      return (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black shadow-2xl">
          <video
            key={item.videoUrl}
            className="absolute inset-0 w-full h-full object-cover"
            controls
            playsInline
            poster={item.thumbnailUrl}
          >
            <source src={item.videoUrl} type={item.videoMimeType ?? 'video/mp4'} />
          </video>
        </div>
      )
    }

    if (item.type === 'image' && item.imageUrl) {
      return (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-2xl">
          <Image
            src={item.imageUrl}
            alt={item.imageAlt ?? item.title ?? ''}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 66vw"
          />
        </div>
      )
    }

    return null
  }

  // ================================================================
  // RENDER — single unified section: description above, carousel below
  // ================================================================
  return (
    <section
      ref={sectionRef}
      className={cn('relative w-full overflow-hidden', theme.bg)}
    >
      {/* Optional background media behind the whole section */}
      {hasBackgroundImage && background?.backgroundImage && (
        <div className="absolute inset-0 z-0">
          {(() => {
            const imageProps = getImagePropsWithFallback(
              background.backgroundImage,
              '/images/defaults/product-description-bg.jpg',
              'hero'
            )
            return <Image src={imageProps.src} alt="" fill className="object-cover" priority />
          })()}
        </div>
      )}
      {hasBackgroundVideo && youtubeEmbedUrl && (
        <div className="absolute inset-0 z-0">
          <iframe
            src={youtubeEmbedUrl}
            title="Background video"
            className="absolute top-1/2 left-1/2 w-[177.77777778vh] min-w-full h-[56.25vw] min-h-full -translate-x-1/2 -translate-y-1/2"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            style={{ border: 'none' }}
          />
        </div>
      )}
      {hasBackgroundMedia && overlayColor !== 'none' && (
        <div
          className={cn(
            'absolute inset-0 z-10',
            overlayColorClasses[overlayColor as keyof typeof overlayColorClasses]
          )}
          style={{ opacity: overlayOpacity / 100 }}
        />
      )}

      {/* Unified content container */}
      <div className="relative z-20 container mx-auto px-6 md:px-12 max-w-7xl py-16 md:py-24">

        {/* ---- Carousel: description in left col, player in right col ---- */}
        {allItems.length > 0 && galleryLayout === 'carousel' ? (
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-start">

            {/* Left column: description + thumbnails */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="lg:col-span-1 order-2 lg:order-1 min-w-0"
            >
              {/* Model display + description */}
              <div className="mb-6">
                {/* Model — red bar style from ProductHero */}
                {content?.showProductName && modelDisplay && (
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-0.5 h-14 bg-gradient-to-b from-kawai-red to-red-600 flex-shrink-0" />
                    <div>
                      <p className="text-xs tracking-wider uppercase font-semibold text-kawai-red">Model</p>
                      <p className={cn('text-4xl lg:text-5xl font-light', theme.text)}>{modelDisplay}</p>
                    </div>
                  </div>
                )}

                {/* Read More — below model, above description */}
                {description && shouldTruncate && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-kawai-red hover:text-kawai-red/80 transition-colors"
                  >
                    <span>{isExpanded ? 'Read Less' : 'Read More'}</span>
                    <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
                      <ChevronDownIcon className="w-4 h-4" />
                    </motion.div>
                  </button>
                )}

                {/* Description text */}
                {description && (
                  <AnimatePresence mode="wait">
                    {!isExpanded ? (
                      <motion.p key="truncated" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className={cn('leading-relaxed', theme.textMuted, textSizeClasses[textSize as keyof typeof textSizeClasses])}>
                        {truncatedDescription}
                      </motion.p>
                    ) : (
                      <motion.p key="full" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.4 }} className={cn('leading-relaxed whitespace-pre-wrap', theme.textMuted, textSizeClasses[textSize as keyof typeof textSizeClasses])}>
                        {description}
                      </motion.p>
                    )}
                  </AnimatePresence>
                )}
              </div>

              {/* Thumbnail strip */}
              {allItems.length > 1 && (
                <div
                  className="overflow-x-auto"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  <div ref={thumbnailsRef} className="flex gap-2 p-1">
                    {allItems.map((item, index) => {
                      const thumbSrc = getThumbnailSrc(item)
                      return (
                        <button
                          key={index}
                          onClick={() => {
                            setCurrentIndex(index)
                            const el = thumbnailsRef.current?.children[index] as HTMLElement | undefined
                            el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
                          }}
                          className={cn(
                            'relative flex-shrink-0 w-20 h-12 rounded-md overflow-hidden transition-all duration-300 border-2',
                            index === currentIndex
                              ? theme.activeBorder + ' ring-2 ring-kawai-red ring-offset-2 scale-105'
                              : theme.border + ' hover:scale-105 opacity-60 hover:opacity-100'
                          )}
                          aria-label={item.title ?? `Media item ${index + 1}`}
                        >
                          {thumbSrc && (
                            <Image src={thumbSrc} alt={item.title ?? `Item ${index + 1}`} fill className="object-cover" sizes="80px" />
                          )}
                          {(item.type === 'youtube' || item.type === 'video') && index !== currentIndex && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Right column: active player */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-2 relative order-1 lg:order-2 min-w-0"
            >
              <div className="relative group">
                {currentItem && renderMediaItem(currentItem)}

                {allItems.length > 1 && (
                  <>
                    <button
                      onClick={goToPrevious}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg z-10"
                      aria-label="Previous"
                    >
                      <svg className="w-6 h-6 text-kawai-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={goToNext}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg z-10"
                      aria-label="Next"
                    >
                      <svg className="w-6 h-6 text-kawai-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </div>

        ) : (
          /* ---- No carousel: description full-width, then grid ---- */
          <>
            {description && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className={cn(
                  allItems.length > 0 && 'mb-12',
                  contentAlignmentClasses[contentAlignment as keyof typeof contentAlignmentClasses]
                )}
              >
                {productName && (
                  <h2 className={cn('text-3xl md:text-4xl lg:text-5xl font-bold mb-4', theme.text)}>
                    {productName}
                  </h2>
                )}
                <div className={cn('leading-relaxed max-w-3xl', contentAlignment === 'center' && 'mx-auto', contentAlignment === 'right' && 'ml-auto', theme.textMuted, textSizeClasses[textSize as keyof typeof textSizeClasses])}>
                  <AnimatePresence mode="wait">
                    {!isExpanded ? (
                      <motion.p key="truncated" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                        {truncatedDescription}
                      </motion.p>
                    ) : (
                      <motion.p key="full" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.4 }} className="whitespace-pre-wrap">
                        {description}
                      </motion.p>
                    )}
                  </AnimatePresence>
                  {shouldTruncate && (
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-kawai-red hover:text-kawai-red/80 transition-colors"
                    >
                      <span>{isExpanded ? 'Read Less' : 'Read More'}</span>
                      <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
                        <ChevronDownIcon className="w-4 h-4" />
                      </motion.div>
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {/* Grid layout */}
            {allItems.length > 0 && (
              <div className={cn('grid gap-8', galleryLayout === 'grid-2' ? 'md:grid-cols-2' : 'md:grid-cols-3')}>
                {allItems.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    {renderMediaItem(item)}
                    {(item.title || item.caption) && (
                      <div className="mt-4">
                        {item.title && <h3 className={cn('text-lg font-medium mb-2', theme.text)}>{item.title}</h3>}
                        {item.caption && <p className={cn('text-sm leading-relaxed', theme.textMuted)}>{item.caption}</p>}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
