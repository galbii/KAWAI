/**
 * Media Utilities
 *
 * This barrel export provides all media-related utilities for the KAWAI Piano website.
 *
 * Usage:
 *   import { getImagePropsWithFallback, generateR2ImageUrl } from '@/lib/media'
 *
 * Files:
 *   - r2-utils.ts: Cloudflare R2 CDN image optimization utilities
 *   - hooks.ts: React hooks for media loading and handling
 *   - types.ts: TypeScript type definitions for media
 *   - legacy.ts: Legacy media utilities (for backward compatibility)
 */

// R2 utilities - primary image optimization
export {
  generateR2ImageUrl,
  getOptimizedImageProps,
  getImagePropsWithFallback,
  getVideoProps,
  PIANO_RESPONSIVE_PRESETS,
  R2_PUBLIC_URL,
  preloadImage,
  generatePlaceholder,
  generateLQIP,
  supportsWebP,
  isR2Url,
  extractFilename,
  type R2TransformOptions,
} from './r2-utils'

// Hooks
export {
  useResponsiveImage,
  useVideoPlayer,
  useMediaGallery,
  useIntersectionObserver,
  useProgressiveLoading,
  useMediaPerformance,
  useMediaPreloader,
  useMediaAccessibility,
} from './hooks'

// Types
export type {
  MediaPreset,
  MediaType,
  ResponsiveImageProps,
  VideoPlayerProps,
  MediaGalleryProps,
  OptimizedImageState,
  VideoPlayerState,
} from './types'

// Legacy utilities (for backward compatibility)
export {
  type ImageOptimizationConfig,
  type VideoOptimizationConfig,
  PIANO_IMAGE_CONFIGS,
  PIANO_VIDEO_CONFIGS,
  PERFORMANCE_BUDGETS,
  generateImageSrcSet,
  generateImageSizes,
  buildImageUrl,
  getLegacyOptimizedImageProps,
  getVideoOptimizationProps,
  generateAudioWaveform,
  preloadCriticalImages,
  preloadAudioSamples,
  createProgressiveImageLoader,
  createIntersectionObserver,
  lazyLoadImages,
  optimizePianoGallery,
  createAudioManager,
  validateMediaSize,
} from './legacy'
