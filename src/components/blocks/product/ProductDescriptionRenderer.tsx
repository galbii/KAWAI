'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import type { ProductDescriptionBlock, Product } from '@/payload-types'
import { getImagePropsWithFallback } from '@/lib/media/r2-utils'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { extractYouTubeId, buildYouTubeEmbedUrl } from '@/lib/utils/youtube'

interface ProductDescriptionRendererProps extends ProductDescriptionBlock {
  product?: Product
}

export function ProductDescriptionRenderer(
  props: ProductDescriptionRendererProps
) {
  const { background, content, layout, product } = props
  const [isExpanded, setIsExpanded] = useState(false)

  // Get description: custom override if enabled, otherwise use product description
  const description = content?.useCustomDescription
    ? content?.customDescription || null
    : product?.description || null

  // Get product name if enabled
  const productName = content?.showProductName && product?.name ? product.name : null

  // If no description content, don't render the block
  if (!description) {
    console.warn('[ProductDescription] No description available - block will not render')
    return null
  }

  // Truncate description for preview (first ~250 characters)
  const shouldTruncate = description.length > 250
  const truncatedDescription = shouldTruncate
    ? description.slice(0, 250).trim() + '...'
    : description

  // Parse YouTube URL if video background
  let youtubeEmbedUrl: string | null = null
  if (background?.mediaType === 'youtube' && background?.youtubeUrl) {
    const videoId = extractYouTubeId(background.youtubeUrl)
    if (videoId) {
      youtubeEmbedUrl = buildYouTubeEmbedUrl(videoId)
    }
  }

  // Check if we have any background media
  const hasBackgroundImage = background?.mediaType === 'image' && background?.backgroundImage
  const hasBackgroundVideo = background?.mediaType === 'youtube' && youtubeEmbedUrl
  const hasBackgroundMedia = hasBackgroundImage || hasBackgroundVideo

  // Auto-adjust text color for no-background scenario
  const effectiveTextColor = !hasBackgroundMedia ? 'black' : (layout?.textColor || 'white')

  // Build class names for styling
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

  const contentAlignment = layout?.contentAlignment || 'center'
  const verticalAlignment = layout?.verticalAlignment || 'center'
  const textColor = layout?.textColor || 'white'
  const textSize = layout?.textSize || 'normal'
  const useGlassmorphism = layout?.useGlassmorphism ?? false
  const minHeight = layout?.minHeight || 'medium'
  const overlayColor = background?.overlayColor || 'dark'
  const overlayOpacity = background?.overlayOpacity ?? 50

  return (
    <section
      className={cn(
        'relative w-full overflow-hidden',
        minHeightClasses[minHeight as keyof typeof minHeightClasses],
        // Default background when no media is provided
        !hasBackgroundMedia && 'bg-gradient-to-br from-kawai-pearl via-white to-gray-50'
      )}
    >
      {/* Background Media */}
      {hasBackgroundImage && (
        <div className="absolute inset-0 z-0">
          {(() => {
            const imageProps = getImagePropsWithFallback(
              background.backgroundImage,
              '/images/defaults/product-description-bg.jpg',
              'hero'
            )
            return (
              <Image
                src={imageProps.src}
                alt=""
                fill
                className="object-cover"
                priority
              />
            )
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

      {/* Overlay (only when background media exists) */}
      {hasBackgroundMedia && overlayColor !== 'none' && (
        <div
          className={cn(
            'absolute inset-0 z-10',
            overlayColorClasses[overlayColor as keyof typeof overlayColorClasses]
          )}
          style={{ opacity: overlayOpacity / 100 }}
        />
      )}

      {/* Content */}
      <div
        className={cn(
          'relative z-20 w-full h-full flex flex-col px-6 py-16 md:px-12 md:py-24',
          verticalAlignmentClasses[
            verticalAlignment as keyof typeof verticalAlignmentClasses
          ],
          contentAlignmentClasses[
            contentAlignment as keyof typeof contentAlignmentClasses
          ]
        )}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={cn(
            'max-w-4xl',
            useGlassmorphism && hasBackgroundMedia &&
              'backdrop-blur-md bg-white/10 rounded-lg p-8 md:p-12 border border-white/20',
            useGlassmorphism && !hasBackgroundMedia &&
              'bg-white rounded-lg p-8 md:p-12 border border-gray-200 shadow-lg'
          )}
        >
          {productName && (
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
              className={cn(
                'text-3xl md:text-4xl lg:text-5xl font-bold mb-6',
                textColorClasses[effectiveTextColor as keyof typeof textColorClasses]
              )}
              style={{
                textShadow: hasBackgroundMedia
                  ? '0 2px 8px rgba(0, 0, 0, 0.3)'
                  : '0 1px 2px rgba(0, 0, 0, 0.1)'
              }}
            >
              {productName}
            </motion.h2>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
            className={cn(
              'leading-relaxed',
              textColorClasses[effectiveTextColor as keyof typeof textColorClasses],
              textSizeClasses[textSize as keyof typeof textSizeClasses]
            )}
            style={{
              textShadow: hasBackgroundMedia
                ? '0 1px 4px rgba(0, 0, 0, 0.4)'
                : '0 1px 2px rgba(0, 0, 0, 0.05)'
            }}
          >
            <AnimatePresence mode="wait">
              {!isExpanded ? (
                <motion.div
                  key="truncated"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="whitespace-pre-wrap"
                >
                  {truncatedDescription}
                </motion.div>
              ) : (
                <motion.div
                  key="full"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className="whitespace-pre-wrap"
                >
                  {description}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Read More Button */}
            {shouldTruncate && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                onClick={() => setIsExpanded(!isExpanded)}
                className={cn(
                  'mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300',
                  'hover:scale-105 active:scale-95',
                  // Different button styles based on background presence
                  !hasBackgroundMedia
                    ? 'bg-kawai-red text-white hover:bg-kawai-red/90 border border-kawai-red'
                    : useGlassmorphism
                    ? 'bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white'
                    : 'bg-white/90 hover:bg-white text-black'
                )}
                style={{
                  boxShadow: hasBackgroundMedia
                    ? '0 4px 12px rgba(0, 0, 0, 0.2)'
                    : '0 2px 8px rgba(0, 0, 0, 0.1)',
                }}
              >
                <span>{isExpanded ? 'Read Less' : 'Read More'}</span>
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <ChevronDownIcon className="w-5 h-5" />
                </motion.div>
              </motion.button>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
