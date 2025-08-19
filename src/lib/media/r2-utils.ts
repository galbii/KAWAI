// Cloudflare R2 CDN utilities for optimized media delivery
import type { Media } from '@/payload-types'

export const R2_PUBLIC_URL = 'https://pub-8cc11ba1a6ef43369715136333c4b35a.r2.dev'

export interface R2TransformOptions {
  width?: number
  height?: number
  quality?: number
  format?: 'webp' | 'avif' | 'jpeg' | 'png'
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside'
  gravity?: 'center' | 'north' | 'northeast' | 'east' | 'southeast' | 'south' | 'southwest' | 'west' | 'northwest' | 'smart'
  dpr?: number
  blur?: number
  brightness?: number
  contrast?: number
  saturation?: number
}

export interface ResponsiveBreakpoint {
  breakpoint: number
  width: number
  quality?: number
}

/**
 * Generates optimized R2 URL with transformations
 * Uses Cloudflare Image Resizing for on-the-fly optimization
 */
export function generateR2ImageUrl(
  filename: string, 
  options: R2TransformOptions = {}
): string {
  // Default options optimized for piano imagery
  const defaults: R2TransformOptions = {
    quality: 85,
    format: 'webp',
    fit: 'cover',
    gravity: 'smart'
  }

  const finalOptions = { ...defaults, ...options }
  const params = new URLSearchParams()

  // Build transformation parameters
  if (finalOptions.width) params.set('width', finalOptions.width.toString())
  if (finalOptions.height) params.set('height', finalOptions.height.toString())
  if (finalOptions.quality) params.set('quality', finalOptions.quality.toString())
  if (finalOptions.format) params.set('format', finalOptions.format)
  if (finalOptions.fit) params.set('fit', finalOptions.fit)
  if (finalOptions.gravity) params.set('gravity', finalOptions.gravity)
  if (finalOptions.dpr) params.set('dpr', finalOptions.dpr.toString())
  if (finalOptions.blur) params.set('blur', finalOptions.blur.toString())
  if (finalOptions.brightness) params.set('brightness', finalOptions.brightness.toString())
  if (finalOptions.contrast) params.set('contrast', finalOptions.contrast.toString())
  if (finalOptions.saturation) params.set('saturation', finalOptions.saturation.toString())

  const transformParams = params.toString()
  const baseUrl = `${R2_PUBLIC_URL}/${filename.replace(/^\//, '')}`
  
  return transformParams ? `${baseUrl}?${transformParams}` : baseUrl
}

/**
 * Generates responsive srcSet for different screen densities and sizes
 */
export function generateResponsiveSrcSet(
  filename: string,
  breakpoints: ResponsiveBreakpoint[]
): string {
  return breakpoints
    .map(({ width, quality }) => {
      const url = generateR2ImageUrl(filename, { width, quality })
      return `${url} ${width}w`
    })
    .join(', ')
}

/**
 * Generates sizes attribute for responsive images
 */
export function generateSizesAttribute(
  breakpoints: Array<{ media: string; size: string }>
): string {
  const mediaQueries = breakpoints
    .map(({ media, size }) => `${media} ${size}`)
    .join(', ')
  
  return `${mediaQueries}, 100vw`
}

/**
 * Piano-specific responsive breakpoints optimized for different contexts
 */
export const PIANO_RESPONSIVE_PRESETS = {
  hero: [
    { breakpoint: 320, width: 320, quality: 75 },
    { breakpoint: 768, width: 768, quality: 80 },
    { breakpoint: 1024, width: 1024, quality: 85 },
    { breakpoint: 1440, width: 1440, quality: 90 },
    { breakpoint: 1920, width: 1920, quality: 90 }
  ] as ResponsiveBreakpoint[],
  
  gallery: [
    { breakpoint: 320, width: 300, quality: 75 },
    { breakpoint: 768, width: 600, quality: 80 },
    { breakpoint: 1024, width: 800, quality: 85 },
    { breakpoint: 1440, width: 1200, quality: 85 }
  ] as ResponsiveBreakpoint[],
  
  thumbnail: [
    { breakpoint: 320, width: 150, quality: 70 },
    { breakpoint: 768, width: 200, quality: 75 },
    { breakpoint: 1024, width: 250, quality: 80 }
  ] as ResponsiveBreakpoint[],
  
  card: [
    { breakpoint: 320, width: 280, quality: 75 },
    { breakpoint: 768, width: 400, quality: 80 },
    { breakpoint: 1024, width: 500, quality: 85 }
  ] as ResponsiveBreakpoint[]
} as const

/**
 * Extracts filename from full R2 URL or Payload URL
 */
export function extractFilename(url: string): string {
  if (url.startsWith(R2_PUBLIC_URL)) {
    return url.replace(R2_PUBLIC_URL, '').replace(/^\//, '')
  }
  
  // Handle Payload URLs
  if (url.includes('/media/')) {
    const parts = url.split('/media/')
    return parts[parts.length - 1]
  }
  
  // Handle relative paths (like fallback images)
  if (url.startsWith('/')) {
    return url.replace(/^\//, '')
  }
  
  // Handle full URLs
  try {
    const urlObj = new URL(url)
    return urlObj.pathname.replace(/^\//, '')
  } catch (error) {
    // If URL parsing fails, just return the original string without leading slash
    return url.replace(/^\//, '')
  }
}

/**
 * Gets optimized image props for common piano use cases
 */
export function getOptimizedImageProps(
  media: Media | string,
  preset: keyof typeof PIANO_RESPONSIVE_PRESETS,
  customOptions: Partial<R2TransformOptions> = {}
) {
  const mediaUrl = typeof media === 'string' ? media : media.url || ''
  
  // Handle fallback/static images - don't process through R2
  if (mediaUrl.startsWith('/images/') || mediaUrl.startsWith('/static/')) {
    const alt = typeof media === 'object' ? media.alt : ''
    return {
      src: mediaUrl,
      srcSet: '', // No responsive srcSet for static images
      sizes: '', // No sizes for static images
      width: undefined,
      height: undefined,
      alt,
      loading: preset === 'hero' ? 'eager' as const : 'lazy' as const,
      decoding: 'async' as const
    }
  }

  const filename = extractFilename(mediaUrl)

  if (!filename) {
    return null
  }

  const breakpoints = PIANO_RESPONSIVE_PRESETS[preset]
  const largestBreakpoint = breakpoints[breakpoints.length - 1]
  
  // Generate main src with largest size
  const src = generateR2ImageUrl(filename, {
    width: largestBreakpoint.width,
    quality: largestBreakpoint.quality,
    ...customOptions
  })

  // Generate responsive srcSet
  const srcSet = generateResponsiveSrcSet(filename, breakpoints.map(bp => ({
    ...bp,
    quality: bp.quality || 85,
    ...customOptions
  })))

  // Generate sizes attribute
  const sizes = generateSizesAttribute([
    { media: '(max-width: 320px)', size: '280px' },
    { media: '(max-width: 768px)', size: '400px' },
    { media: '(max-width: 1024px)', size: '500px' },
    { media: '(max-width: 1440px)', size: '800px' }
  ])

  const alt = typeof media === 'object' ? media.alt : ''

  return {
    src,
    srcSet,
    sizes,
    width: largestBreakpoint.width,
    height: undefined, // Let aspect ratio determine height
    alt,
    loading: preset === 'hero' ? 'eager' as const : 'lazy' as const,
    decoding: 'async' as const
  }
}

/**
 * Generates placeholder data URL for progressive loading
 */
export function generatePlaceholder(
  width: number = 800, 
  height: number = 600,
  color: string = '#f3f4f6'
): string {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${color}"/>
      <rect x="20%" y="40%" width="60%" height="20%" fill="#e5e7eb" rx="4"/>
    </svg>
  `
  return `data:image/svg+xml;base64,${btoa(svg)}`
}

/**
 * Generates low-quality placeholder for progressive enhancement
 */
export function generateLQIP(filename: string): string {
  return generateR2ImageUrl(filename, {
    width: 32,
    height: 24,
    quality: 20,
    blur: 10
  })
}

/**
 * Video optimization for R2-hosted videos
 */
export function getVideoProps(
  media: Media | string,
  options: {
    poster?: boolean
    autoplay?: boolean
    muted?: boolean
    controls?: boolean
    loop?: boolean
    preload?: 'none' | 'metadata' | 'auto'
  } = {}
) {
  const videoUrl = typeof media === 'string' 
    ? (media.startsWith('http') ? media : `${R2_PUBLIC_URL}/${media}`)
    : media.url

  const defaults = {
    poster: true,
    autoplay: false,
    muted: true,
    controls: true,
    loop: false,
    preload: 'metadata' as const
  }

  const finalOptions = { ...defaults, ...options }

  let posterUrl: string | undefined
  if (finalOptions.poster && typeof media === 'object' && media.videoMeta?.thumbnail) {
    posterUrl = generateR2ImageUrl(
      extractFilename((media.videoMeta.thumbnail as any)?.url || ''),
      { width: 1280, height: 720, quality: 80 }
    )
  }

  return {
    src: videoUrl,
    poster: posterUrl,
    autoPlay: finalOptions.autoplay,
    muted: finalOptions.muted,
    controls: finalOptions.controls,
    loop: finalOptions.loop,
    preload: finalOptions.preload,
    playsInline: true
  }
}

/**
 * Preload critical images for performance
 */
export function preloadImage(
  filename: string, 
  options: R2TransformOptions = {}
): void {
  if (typeof window === 'undefined') return

  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = 'image'
  link.href = generateR2ImageUrl(filename, options)
  document.head.appendChild(link)
}

/**
 * Check if WebP format is supported
 */
export function supportsWebP(): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false)

  return new Promise((resolve) => {
    const webP = new Image()
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2)
    }
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'
  })
}

/**
 * Validates if URL is from R2 domain
 */
export function isR2Url(url: string): boolean {
  return url.includes(R2_PUBLIC_URL) || url.includes('r2.dev')
}

/**
 * Media performance monitoring
 */
export function trackImageLoad(filename: string, loadTime: number): void {
  if (typeof window !== 'undefined' && 'performance' in window) {
    // Log performance metrics for monitoring
    console.debug(`Image loaded: ${filename} in ${loadTime}ms`)
  }
}

/**
 * Batch preload multiple images
 */
export function batchPreloadImages(
  filenames: string[], 
  options: R2TransformOptions = {}
): Promise<void[]> {
  return Promise.all(
    filenames.map(filename => 
      new Promise<void>((resolve) => {
        const img = new Image()
        img.onload = img.onerror = () => resolve()
        img.src = generateR2ImageUrl(filename, options)
      })
    )
  )
}