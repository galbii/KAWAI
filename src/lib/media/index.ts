// Media utilities and hooks exports
export * from './r2-utils'
export * from './hooks'
export * from './types'

// Re-export enhanced media utilities
export {
  generateR2ImageUrl,
  getOptimizedImageProps,
  getVideoProps,
  PIANO_RESPONSIVE_PRESETS,
  R2_PUBLIC_URL,
  preloadImage,
  generatePlaceholder,
  generateLQIP,
  supportsWebP,
  isR2Url,
  extractFilename
} from './r2-utils'

export {
  useResponsiveImage,
  useVideoPlayer,
  useMediaGallery,
  useIntersectionObserver,
  useProgressiveLoading,
  useMediaPerformance,
  useMediaPreloader,
  useMediaAccessibility
} from './hooks'