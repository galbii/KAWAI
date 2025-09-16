/**
 * Media Fallback Utilities
 *
 * Provides robust fallback patterns for media/image handling
 * when CMS media is unavailable or fails to load.
 */

import type { Media } from '@/payload-types'

// =============================================================================
// FALLBACK IMAGE CONSTANTS
// =============================================================================

export const FALLBACK_IMAGES = {
  // Piano category fallbacks
  pianos: {
    grand: "/images/piano-categories/grand.jpg",
    upright: "/images/piano-categories/upright.png",
    digital: "/images/piano-categories/digital.png",
    hybrid: "/images/piano-categories/hybrid.jpg"
  },

  // Hero and banner fallbacks
  heroes: {
    default: "/images/piano-categories/NV10S_along%20the%20keyboard_whiteBG.jpg",
    grand: "/images/banners/GX-7-BLAK-grand-styling.webp",
    digital: "/images/banners/CA99-digital-styling.webp",
    hybrid: "/images/banners/NV10S_along the keyboard_whiteBG.jpg",
    upright: "/images/piano-categories/upright.png"
  },

  // Product model fallbacks
  models: {
    "GX-7 BLAK": "/images/banners/GX-7-BLAK-grand-styling.webp",
    "CA99": "/images/banners/CA99-digital-styling.webp",
    "NOVUS NV-10S": "/images/banners/NV10S_along the keyboard_whiteBG.jpg",
    default: "/images/piano-categories/digital.png"
  },

  // News and content fallbacks
  news: {
    default: "/images/banners/I2LNew-banner.jpg",
    promotion: "/images/banners/Rebate-banner-for-news.jpg",
    gallery: "/images/piano-categories/grand-pianos.jpg"
  },

  // Showroom and location fallbacks
  showroom: {
    default: "/images/showroom/lake-st-louis-showroom.jpg",
    interior: "/images/showroom/showroom-interior.jpg",
    exterior: "/images/showroom/showroom-exterior.jpg"
  },

  // General fallbacks
  placeholder: "/images/placeholder-piano.jpg",
  loading: "/images/loading-placeholder.svg",
  error: "/images/error-placeholder.svg"
} as const

// =============================================================================
// MEDIA RESOLUTION UTILITIES
// =============================================================================

/**
 * Resolve media URL with comprehensive fallback logic
 * @param media - Media object, string URL, or null/undefined
 * @param fallbackUrl - Fallback image URL
 * @param context - Context for better fallback selection
 * @returns Valid image URL
 */
export function resolveMediaWithFallback(
  media: Media | string | null | undefined,
  fallbackUrl: string,
  context?: {
    category?: 'grand' | 'upright' | 'digital' | 'hybrid'
    type?: 'hero' | 'product' | 'news' | 'showroom'
    modelName?: string
  }
): string {
  // Try to resolve the provided media first
  const resolvedUrl = resolveMediaUrl(media)
  if (resolvedUrl) {
    return resolvedUrl
  }

  // Use context-aware fallback if available
  if (context) {
    const contextualFallback = getContextualFallback(context)
    if (contextualFallback) {
      return contextualFallback
    }
  }

  // Use provided fallback
  return fallbackUrl || FALLBACK_IMAGES.placeholder
}

/**
 * Basic media URL resolution (from existing payload.ts logic)
 * @param media - Media object or string
 * @returns URL string or empty string
 */
function resolveMediaUrl(media: Media | string | null | undefined): string {
  if (!media) {
    return ''
  }

  if (typeof media === 'string') {
    // If it's a string and looks like a URL, return as is
    if (media.startsWith('http') || media.startsWith('/')) {
      return media
    }
    // Otherwise, it might be an ID - would need to fetch separately
    return ''
  }

  // It's a Media object - use the url property from Payload
  return media.url || ''
}

/**
 * Get contextually appropriate fallback image
 * @param context - Context information
 * @returns Contextual fallback URL or null
 */
function getContextualFallback(context: {
  category?: 'grand' | 'upright' | 'digital' | 'hybrid'
  type?: 'hero' | 'product' | 'news' | 'showroom'
  modelName?: string
}): string | null {
  // Model-specific fallbacks
  if (context.modelName && context.modelName in FALLBACK_IMAGES.models) {
    return FALLBACK_IMAGES.models[context.modelName as keyof typeof FALLBACK_IMAGES.models]
  }

  // Type-specific fallbacks
  if (context.type) {
    switch (context.type) {
      case 'hero':
        return context.category
          ? FALLBACK_IMAGES.heroes[context.category] || FALLBACK_IMAGES.heroes.default
          : FALLBACK_IMAGES.heroes.default
      case 'news':
        return FALLBACK_IMAGES.news.default
      case 'showroom':
        return FALLBACK_IMAGES.showroom.default
    }
  }

  // Category-specific fallbacks
  if (context.category && context.category in FALLBACK_IMAGES.pianos) {
    return FALLBACK_IMAGES.pianos[context.category]
  }

  return null
}

// =============================================================================
// ENHANCED MEDIA UTILITIES
// =============================================================================

/**
 * Enhanced version of getImagePropsWithFallback with better error handling
 * @param media - CMS media or string URL
 * @param fallbackUrl - Default fallback URL
 * @param preset - Image preset for optimization
 * @param options - Additional options
 * @returns Complete image props with fallbacks
 */
export function getImagePropsWithFallback(
  media: Media | string | null | undefined,
  fallbackUrl: string,
  preset: 'hero' | 'gallery' | 'thumbnail' | 'card' = 'gallery',
  options: {
    fill?: boolean
    className?: string
    priority?: boolean
    sizes?: string
    context?: {
      category?: 'grand' | 'upright' | 'digital' | 'hybrid'
      type?: 'hero' | 'product' | 'news' | 'showroom'
      modelName?: string
    }
  } = {}
) {
  const resolvedUrl = resolveMediaWithFallback(media, fallbackUrl, options.context)

  // Get alt text with fallback
  const alt = getAltTextWithFallback(media, options.context)

  // Basic props structure
  const imageProps = {
    src: resolvedUrl,
    alt,
    className: options.className || '',
    priority: options.priority || false,
    sizes: options.sizes || getSizesForPreset(preset),
    loading: (options.priority ? 'eager' : 'lazy') as 'eager' | 'lazy',
    decoding: 'async' as const
  }

  // Add dimensions if not using fill
  if (!options.fill) {
    const dimensions = getDimensionsForPreset(preset)
    return {
      ...imageProps,
      width: dimensions.width,
      height: dimensions.height
    }
  }

  return {
    ...imageProps,
    fill: true
  }
}

/**
 * Get alt text with contextual fallbacks
 * @param media - Media object
 * @param context - Context for fallback generation
 * @returns Alt text string
 */
function getAltTextWithFallback(
  media: Media | string | null | undefined,
  context?: {
    category?: 'grand' | 'upright' | 'digital' | 'hybrid'
    type?: 'hero' | 'product' | 'news' | 'showroom'
    modelName?: string
  }
): string {
  // Try to get alt from Media object
  if (media && typeof media === 'object' && media.alt) {
    return media.alt
  }

  // Generate contextual alt text
  if (context) {
    if (context.modelName) {
      return `${context.modelName} piano`
    }

    if (context.category) {
      const categoryMap = {
        grand: 'Kawai Grand Piano',
        upright: 'Kawai Upright Piano',
        digital: 'Kawai Digital Piano',
        hybrid: 'Kawai Hybrid Piano'
      }
      return categoryMap[context.category]
    }

    if (context.type) {
      const typeMap = {
        hero: 'Kawai Piano Collection',
        product: 'Kawai Piano Model',
        news: 'Kawai Piano News',
        showroom: 'Kawai Piano Showroom'
      }
      return typeMap[context.type]
    }
  }

  // Default fallback
  return 'Kawai Piano'
}

/**
 * Get responsive sizes attribute for preset
 * @param preset - Image preset
 * @returns Sizes string
 */
function getSizesForPreset(preset: string): string {
  const sizeMap = {
    hero: '100vw',
    gallery: '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw',
    thumbnail: '(max-width: 768px) 150px, 250px',
    card: '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'
  }

  return sizeMap[preset as keyof typeof sizeMap] || sizeMap.gallery
}

/**
 * Get default dimensions for preset
 * @param preset - Image preset
 * @returns Width and height
 */
function getDimensionsForPreset(preset: string): { width: number; height: number } {
  const dimensionMap = {
    hero: { width: 1920, height: 1080 },
    gallery: { width: 800, height: 600 },
    thumbnail: { width: 250, height: 187 },
    card: { width: 500, height: 375 }
  }

  return dimensionMap[preset as keyof typeof dimensionMap] || dimensionMap.gallery
}

// =============================================================================
// MEDIA VALIDATION UTILITIES
// =============================================================================

/**
 * Check if media URL is valid and accessible
 * @param url - URL to check
 * @returns Promise<boolean>
 */
export async function validateMediaUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' })
    return response.ok
  } catch {
    return false
  }
}

/**
 * Get multiple fallback options for critical images
 * @param media - Primary media
 * @param context - Context for fallbacks
 * @returns Array of URLs in preference order
 */
export function getMediaFallbackChain(
  media: Media | string | null | undefined,
  context: {
    category?: 'grand' | 'upright' | 'digital' | 'hybrid'
    type?: 'hero' | 'product' | 'news' | 'showroom'
    modelName?: string
  }
): string[] {
  const fallbacks: string[] = []

  // Primary media
  const primaryUrl = resolveMediaUrl(media)
  if (primaryUrl) {
    fallbacks.push(primaryUrl)
  }

  // Contextual fallbacks
  const contextualFallback = getContextualFallback(context)
  if (contextualFallback && !fallbacks.includes(contextualFallback)) {
    fallbacks.push(contextualFallback)
  }

  // Category fallbacks
  if (context.category) {
    const categoryFallback = FALLBACK_IMAGES.pianos[context.category]
    if (!fallbacks.includes(categoryFallback)) {
      fallbacks.push(categoryFallback)
    }
  }

  // General fallbacks
  if (!fallbacks.includes(FALLBACK_IMAGES.placeholder)) {
    fallbacks.push(FALLBACK_IMAGES.placeholder)
  }

  return fallbacks
}

// =============================================================================
// ERROR HANDLING UTILITIES
// =============================================================================

/**
 * Handle image load errors with automatic fallback
 * @param event - Image error event
 * @param fallbackChain - Array of fallback URLs
 * @returns void
 */
export function handleImageError(
  event: React.SyntheticEvent<HTMLImageElement>,
  fallbackChain: string[]
): void {
  const img = event.currentTarget
  const currentSrc = img.src
  const currentIndex = fallbackChain.indexOf(currentSrc)

  // Try next fallback in chain
  if (currentIndex < fallbackChain.length - 1) {
    img.src = fallbackChain[currentIndex + 1]
  } else {
    // No more fallbacks available
    console.warn('All image fallbacks exhausted for:', fallbackChain)
  }
}

/**
 * Create error handler for image components
 * @param context - Context for fallback selection
 * @returns Error handler function
 */
export function createImageErrorHandler(context: {
  category?: 'grand' | 'upright' | 'digital' | 'hybrid'
  type?: 'hero' | 'product' | 'news' | 'showroom'
  modelName?: string
}) {
  return (event: React.SyntheticEvent<HTMLImageElement>) => {
    const fallbackChain = getMediaFallbackChain(null, context)
    handleImageError(event, fallbackChain)
  }
}