// Comprehensive TypeScript types for media rendering system
import type { Media } from '@/payload-types'

export interface MediaRendererProps {
  media: Media | string
  preset?: 'hero' | 'gallery' | 'thumbnail' | 'card'
  className?: string
  priority?: boolean
  placeholder?: boolean
  onLoad?: () => void
  onError?: (error: Error) => void
  'aria-label'?: string
}

export interface ResponsiveImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'sizes' | 'onError'> {
  media: Media | string
  preset?: 'hero' | 'gallery' | 'thumbnail' | 'card'
  fallback?: string
  placeholder?: boolean | string
  aspectRatio?: number
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
  priority?: boolean
  onLoad?: () => void
  onError?: (error: Error) => void
}

export interface VideoPlayerProps extends Omit<React.VideoHTMLAttributes<HTMLVideoElement>, 'src' | 'poster' | 'onTimeUpdate' | 'onVolumeChange'> {
  media: Media | string
  poster?: boolean | string
  thumbnailPreset?: 'gallery' | 'card' | 'hero'
  showControls?: boolean
  showProgressBar?: boolean
  showVolumeControl?: boolean
  showFullscreenButton?: boolean
  customControls?: boolean
  onPlay?: () => void
  onPause?: () => void
  onEnded?: () => void
  onTimeUpdate?: (currentTime: number, duration: number) => void
  onVolumeChange?: (volume: number) => void
}

export interface MediaGalleryProps {
  media: Array<Media | string>
  variant?: 'grid' | 'masonry' | 'carousel' | 'lightbox'
  columns?: number | { mobile: number; tablet: number; desktop: number }
  aspectRatio?: number
  gap?: number
  showCaptions?: boolean
  showThumbnails?: boolean
  enableLightbox?: boolean
  enableZoom?: boolean
  lazyLoad?: boolean
  onMediaSelect?: (media: Media | string, index: number) => void
  className?: string
}

export interface MediaLightboxProps {
  media: Array<Media | string>
  currentIndex: number
  isOpen: boolean
  onClose: () => void
  onNext: () => void
  onPrevious: () => void
  showThumbnails?: boolean
  showCaption?: boolean
  enableZoom?: boolean
  className?: string
}

export interface OptimizedImageState {
  src: string
  srcSet: string
  sizes: string
  isLoading: boolean
  isError: boolean
  aspectRatio?: number
}

export interface VideoPlayerState {
  isPlaying: boolean
  isPaused: boolean
  isEnded: boolean
  isMuted: boolean
  volume: number
  currentTime: number
  duration: number
  buffered: TimeRanges | null
  isFullscreen: boolean
  hasError: boolean
  error?: string
}

export interface MediaContextValue {
  preloadedImages: Set<string>
  preloadedVideos: Set<string>
  performanceMetrics: Map<string, number>
  preloadImage: (filename: string) => Promise<void>
  preloadVideo: (filename: string) => Promise<void>
  trackLoadTime: (filename: string, time: number) => void
  getLoadTime: (filename: string) => number | undefined
}

export interface LazyLoadOptions {
  rootMargin?: string
  threshold?: number | number[]
  triggerOnce?: boolean
  placeholder?: boolean
}

export interface ProgressiveLoadingOptions {
  showPlaceholder?: boolean
  placeholderColor?: string
  enableLQIP?: boolean
  blurTransition?: boolean
  transitionDuration?: number
}

export interface MediaErrorState {
  hasError: boolean
  error?: Error
  fallbackSrc?: string
  retryCount: number
  maxRetries: number
}

export interface TouchGestureState {
  scale: number
  translateX: number
  translateY: number
  isDragging: boolean
  isZooming: boolean
  lastTouchDistance?: number
  lastTouchCenter?: { x: number; y: number }
}

export interface MediaValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  metadata?: {
    width?: number
    height?: number
    size?: number
    format?: string
    duration?: number
  }
}

export interface AccessibilityOptions {
  altText?: string
  captionText?: string
  ariaLabel?: string
  ariaDescribedBy?: string
  role?: string
  focusable?: boolean
  announceLoading?: boolean
  announceErrors?: boolean
}

export interface PerformanceBudget {
  maxImageSize: number // KB
  maxVideoSize: number // KB
  maxLoadTime: number // ms
  enableMonitoring: boolean
}

export interface MediaPreset {
  name: string
  breakpoints: Array<{
    minWidth: number
    width: number
    quality: number
  }>
  defaultQuality: number
  format: 'webp' | 'avif' | 'jpeg' | 'png'
  aspectRatio?: number
  objectFit?: 'cover' | 'contain' | 'fill'
}

export interface VideoControlsTheme {
  primary: string
  secondary: string
  background: string
  backgroundOpacity: number
  borderRadius: number
  iconSize: number
  progressHeight: number
  volumeWidth: number
}

export interface MediaAnalytics {
  trackImageViews: boolean
  trackVideoPlays: boolean
  trackLoadTimes: boolean
  trackErrors: boolean
  provider?: 'google-analytics' | 'custom'
  customTracker?: (event: string, data: any) => void
}

// Utility types for component variations
export type MediaType = 'image' | 'video' | 'audio'
export type ResponsivePreset = 'hero' | 'gallery' | 'thumbnail' | 'card'
export type VideoQuality = 'low' | 'medium' | 'high' | 'ultra'
export type ImageFormat = 'webp' | 'avif' | 'jpeg' | 'png'
export type LoadingStrategy = 'eager' | 'lazy' | 'progressive'
export type ErrorStrategy = 'hide' | 'fallback' | 'retry' | 'placeholder'

// Event handler types
export type MediaLoadHandler = (event: Event) => void
export type MediaErrorHandler = (error: Error) => void
export type VideoEventHandler = (event: Event) => void
export type TouchEventHandler = (event: TouchEvent) => void
export type GestureEventHandler = (gesture: TouchGestureState) => void

// Configuration types
export interface MediaConfig {
  r2PublicUrl: string
  defaultPreset: ResponsivePreset
  defaultQuality: number
  defaultFormat: ImageFormat
  enableWebP: boolean
  enableAVIF: boolean
  lazyLoadOffset: string
  performanceBudget: PerformanceBudget
  analytics: MediaAnalytics
  accessibility: AccessibilityOptions
}

// Hook return types
export interface UseResponsiveImageReturn {
  imageProps: {
    src: string
    srcSet: string
    sizes: string
    alt: string
    loading: 'eager' | 'lazy'
    decoding: 'async'
  }
  state: OptimizedImageState
  actions: {
    reload: () => void
    preload: () => Promise<void>
  }
}

export interface UseVideoPlayerReturn {
  videoProps: React.VideoHTMLAttributes<HTMLVideoElement>
  state: VideoPlayerState
  actions: {
    play: () => Promise<void>
    pause: () => void
    seek: (time: number) => void
    setVolume: (volume: number) => void
    toggleMute: () => void
    toggleFullscreen: () => Promise<void>
    reload: () => void
  }
}

export interface UseMediaGalleryReturn {
  currentIndex: number
  selectedMedia: Media | string | null
  isLightboxOpen: boolean
  actions: {
    selectMedia: (index: number) => void
    openLightbox: (index: number) => void
    closeLightbox: () => void
    nextMedia: () => void
    previousMedia: () => void
  }
}

export interface UseIntersectionObserverReturn {
  ref: React.RefObject<HTMLElement | null>
  isIntersecting: boolean
  hasIntersected: boolean
}

export interface UseProgressiveLoadingReturn {
  showPlaceholder: boolean
  showLQIP: boolean
  showFullImage: boolean
  isLoading: boolean
  hasError: boolean
}

// Component ref types
export interface ResponsiveImageRef {
  element: HTMLImageElement | null
  reload: () => void
  preload: () => Promise<void>
}

export interface VideoPlayerRef {
  element: HTMLVideoElement | null
  play: () => Promise<void>
  pause: () => void
  seek: (time: number) => void
  setVolume: (volume: number) => void
  toggleMute: () => void
  toggleFullscreen: () => Promise<void>
}

export interface MediaGalleryRef {
  selectMedia: (index: number) => void
  openLightbox: (index: number) => void
  closeLightbox: () => void
}

// Error types
export class MediaLoadError extends Error {
  constructor(
    message: string,
    public readonly filename: string,
    public readonly cause?: Error
  ) {
    super(message)
    this.name = 'MediaLoadError'
  }
}

export class VideoPlaybackError extends Error {
  constructor(
    message: string,
    public readonly code: number,
    public readonly cause?: Error
  ) {
    super(message)
    this.name = 'VideoPlaybackError'
  }
}