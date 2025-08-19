'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import type { Media } from '@/payload-types'
import type {
  UseResponsiveImageReturn,
  UseVideoPlayerReturn,
  UseMediaGalleryReturn,
  UseIntersectionObserverReturn,
  UseProgressiveLoadingReturn,
  VideoPlayerState,
  OptimizedImageState,
  ResponsivePreset
} from './types'
import { 
  getOptimizedImageProps, 
  getVideoProps, 
  generateLQIP,
  extractFilename,
  trackImageLoad,
  preloadImage
} from './r2-utils'

/**
 * Hook for managing responsive image state and optimization
 */
export function useResponsiveImage(
  media: Media | string,
  preset: ResponsivePreset = 'card',
  options: {
    priority?: boolean
    placeholder?: boolean
    onLoad?: () => void
    onError?: (error: Error) => void
  } = {}
): UseResponsiveImageReturn {
  const [state, setState] = useState<OptimizedImageState>({
    src: '',
    srcSet: '',
    sizes: '',
    isLoading: true,
    isError: false
  })

  const imageProps = useMemo(() => {
    return getOptimizedImageProps(media, preset)
  }, [media, preset])

  const reload = useCallback(() => {
    setState(prev => ({ ...prev, isLoading: true, isError: false }))
  }, [])

  const preload = useCallback(async () => {
    if (!imageProps?.src) return
    
    const filename = typeof media === 'string' ? extractFilename(media) : extractFilename(media.url || '')
    if (filename) {
      preloadImage(filename)
    }
  }, [imageProps?.src, media])

  // Update state when image props change
  useEffect(() => {
    if (!imageProps) {
      setState(prev => ({ ...prev, isError: true, isLoading: false }))
      return
    }

    setState({
      src: imageProps.src,
      srcSet: imageProps.srcSet,
      sizes: imageProps.sizes,
      isLoading: true,
      isError: false,
      aspectRatio: imageProps.width && imageProps.height ? imageProps.width / imageProps.height : undefined
    })
  }, [imageProps])

  return {
    imageProps: imageProps || {
      src: '',
      srcSet: '',
      sizes: '',
      alt: '',
      loading: 'lazy',
      decoding: 'async'
    },
    state,
    actions: {
      reload,
      preload
    }
  }
}

/**
 * Hook for managing video player state and controls
 */
export function useVideoPlayer(
  media: Media | string,
  options: {
    autoPlay?: boolean
    muted?: boolean
    loop?: boolean
    onPlay?: () => void
    onPause?: () => void
    onEnded?: () => void
  } = {}
): UseVideoPlayerReturn {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [state, setState] = useState<VideoPlayerState>({
    isPlaying: false,
    isPaused: true,
    isEnded: false,
    isMuted: options.muted ?? true,
    volume: 1,
    currentTime: 0,
    duration: 0,
    buffered: null,
    isFullscreen: false,
    hasError: false
  })

  const videoProps = useMemo(() => {
    return getVideoProps(media, {
      autoplay: options.autoPlay,
      muted: options.muted,
      loop: options.loop
    })
  }, [media, options.autoPlay, options.muted, options.loop])

  const play = useCallback(async () => {
    if (!videoRef.current) return
    try {
      await videoRef.current.play()
      setState(prev => ({ ...prev, isPlaying: true, isPaused: false }))
      options.onPlay?.()
    } catch (error) {
      setState(prev => ({ ...prev, hasError: true }))
    }
  }, [options])

  const pause = useCallback(() => {
    if (!videoRef.current) return
    videoRef.current.pause()
    setState(prev => ({ ...prev, isPlaying: false, isPaused: true }))
    options.onPause?.()
  }, [options])

  const seek = useCallback((time: number) => {
    if (!videoRef.current) return
    videoRef.current.currentTime = time
  }, [])

  const setVolume = useCallback((volume: number) => {
    if (!videoRef.current) return
    const clampedVolume = Math.max(0, Math.min(1, volume))
    videoRef.current.volume = clampedVolume
    setState(prev => ({ ...prev, volume: clampedVolume }))
  }, [])

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return
    const newMuted = !state.isMuted
    videoRef.current.muted = newMuted
    setState(prev => ({ ...prev, isMuted: newMuted }))
  }, [state.isMuted])

  const toggleFullscreen = useCallback(async () => {
    if (!videoRef.current) return
    try {
      if (!document.fullscreenElement) {
        await videoRef.current.requestFullscreen()
        setState(prev => ({ ...prev, isFullscreen: true }))
      } else {
        await document.exitFullscreen()
        setState(prev => ({ ...prev, isFullscreen: false }))
      }
    } catch (error) {
      console.warn('Fullscreen not supported:', error)
    }
  }, [])

  const reload = useCallback(() => {
    if (!videoRef.current) return
    videoRef.current.load()
    setState(prev => ({ ...prev, hasError: false, isLoading: true }))
  }, [])

  return {
    videoProps: videoProps ? { ...videoProps, src: videoProps.src || '' } : { src: '' },
    state,
    actions: {
      play,
      pause,
      seek,
      setVolume,
      toggleMute,
      toggleFullscreen,
      reload
    }
  }
}

/**
 * Hook for managing media gallery state and navigation
 */
export function useMediaGallery(
  media: Array<Media | string>,
  options: {
    enableLightbox?: boolean
    onMediaSelect?: (media: Media | string, index: number) => void
  } = {}
): UseMediaGalleryReturn {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedMedia, setSelectedMedia] = useState<Media | string | null>(null)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  const selectMedia = useCallback((index: number) => {
    if (index >= 0 && index < media.length) {
      setCurrentIndex(index)
      setSelectedMedia(media[index])
      options.onMediaSelect?.(media[index], index)
    }
  }, [media, options])

  const openLightbox = useCallback((index: number) => {
    selectMedia(index)
    if (options.enableLightbox) {
      setIsLightboxOpen(true)
    }
  }, [selectMedia, options.enableLightbox])

  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false)
  }, [])

  const nextMedia = useCallback(() => {
    const nextIndex = (currentIndex + 1) % media.length
    selectMedia(nextIndex)
  }, [currentIndex, media.length, selectMedia])

  const previousMedia = useCallback(() => {
    const prevIndex = (currentIndex - 1 + media.length) % media.length
    selectMedia(prevIndex)
  }, [currentIndex, media.length, selectMedia])

  // Initialize with first media item
  useEffect(() => {
    if (media.length > 0 && !selectedMedia) {
      setSelectedMedia(media[0])
    }
  }, [media, selectedMedia])

  return {
    currentIndex,
    selectedMedia,
    isLightboxOpen,
    actions: {
      selectMedia,
      openLightbox,
      closeLightbox,
      nextMedia,
      previousMedia
    }
  }
}

/**
 * Hook for intersection observer with customizable options
 */
export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
): UseIntersectionObserverReturn {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasIntersected, setHasIntersected] = useState(false)
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const defaultOptions: IntersectionObserverInit = {
      rootMargin: '50px',
      threshold: 0.1,
      ...options
    }

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
      if (entry.isIntersecting && !hasIntersected) {
        setHasIntersected(true)
      }
    }, defaultOptions)

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [options, hasIntersected])

  return {
    ref,
    isIntersecting,
    hasIntersected
  }
}

/**
 * Hook for progressive image loading with LQIP
 */
export function useProgressiveLoading(
  media: Media | string,
  options: {
    enableLQIP?: boolean
    showPlaceholder?: boolean
    transitionDuration?: number
  } = {}
): UseProgressiveLoadingReturn {
  const [showPlaceholder, setShowPlaceholder] = useState(options.showPlaceholder ?? true)
  const [showLQIP, setShowLQIP] = useState(false)
  const [showFullImage, setShowFullImage] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const filename = useMemo(() => {
    return typeof media === 'string' ? extractFilename(media) : extractFilename(media.url || '')
  }, [media])

  const lqipSrc = useMemo(() => {
    return options.enableLQIP && filename ? generateLQIP(filename) : undefined
  }, [options.enableLQIP, filename])

  // Load LQIP first
  useEffect(() => {
    if (!lqipSrc) return

    const img = new Image()
    img.onload = () => {
      setShowLQIP(true)
      setShowPlaceholder(false)
    }
    img.onerror = () => {
      setShowPlaceholder(true)
    }
    img.src = lqipSrc
  }, [lqipSrc])

  // Handle full image load
  const handleImageLoad = useCallback(() => {
    setIsLoading(false)
    setShowFullImage(true)
    setHasError(false)
    
    // Fade out LQIP after a delay
    if (options.enableLQIP) {
      setTimeout(() => {
        setShowLQIP(false)
      }, options.transitionDuration || 300)
    }
  }, [options.enableLQIP, options.transitionDuration])

  const handleImageError = useCallback(() => {
    setIsLoading(false)
    setHasError(true)
    setShowFullImage(false)
  }, [])

  return {
    showPlaceholder,
    showLQIP,
    showFullImage,
    isLoading,
    hasError
  }
}

/**
 * Hook for media performance monitoring
 */
export function useMediaPerformance() {
  const metrics = useRef(new Map<string, number>())
  const observers = useRef(new Map<string, PerformanceObserver>())

  const trackImageLoad = useCallback((filename: string, startTime: number) => {
    const loadTime = Date.now() - startTime
    metrics.current.set(filename, loadTime)
    trackImageLoad(filename, loadTime)
  }, [])

  const getLoadTime = useCallback((filename: string) => {
    return metrics.current.get(filename)
  }, [])

  const getAllMetrics = useCallback(() => {
    return Object.fromEntries(metrics.current)
  }, [])

  const clearMetrics = useCallback(() => {
    metrics.current.clear()
    observers.current.forEach(observer => observer.disconnect())
    observers.current.clear()
  }, [])

  return {
    trackImageLoad,
    getLoadTime,
    getAllMetrics,
    clearMetrics
  }
}

/**
 * Hook for media preloading strategy
 */
export function useMediaPreloader() {
  const preloadedImages = useRef(new Set<string>())
  const preloadedVideos = useRef(new Set<string>())

  const preloadImage = useCallback(async (filename: string): Promise<void> => {
    if (preloadedImages.current.has(filename)) return

    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        preloadedImages.current.add(filename)
        resolve()
      }
      img.onerror = reject
      img.src = filename.startsWith('http') ? filename : `https://pub-8cc11ba1a6ef43369715136333c4b35a.r2.dev/${filename}`
    })
  }, [])

  const preloadVideo = useCallback(async (filename: string): Promise<void> => {
    if (preloadedVideos.current.has(filename)) return

    return new Promise((resolve, reject) => {
      const video = document.createElement('video')
      video.preload = 'metadata'
      video.onloadedmetadata = () => {
        preloadedVideos.current.add(filename)
        resolve()
      }
      video.onerror = reject
      video.src = filename.startsWith('http') ? filename : `https://pub-8cc11ba1a6ef43369715136333c4b35a.r2.dev/${filename}`
    })
  }, [])

  const preloadMediaBatch = useCallback(async (filenames: string[]): Promise<void> => {
    await Promise.all(
      filenames.map(filename => {
        const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(filename)
        return isVideo ? preloadVideo(filename) : preloadImage(filename)
      })
    )
  }, [preloadImage, preloadVideo])

  const isPreloaded = useCallback((filename: string, type: 'image' | 'video' = 'image') => {
    return type === 'image' 
      ? preloadedImages.current.has(filename)
      : preloadedVideos.current.has(filename)
  }, [])

  const clearCache = useCallback(() => {
    preloadedImages.current.clear()
    preloadedVideos.current.clear()
  }, [])

  return {
    preloadImage,
    preloadVideo,
    preloadMediaBatch,
    isPreloaded,
    clearCache
  }
}

/**
 * Hook for managing media accessibility features
 */
export function useMediaAccessibility(
  media: Media | string,
  options: {
    announceLoading?: boolean
    announceErrors?: boolean
    customAriaLabel?: string
  } = {}
) {
  const [announcement, setAnnouncement] = useState<string>('')

  const announceLoading = useCallback(() => {
    if (options.announceLoading) {
      setAnnouncement('Loading image...')
      setTimeout(() => setAnnouncement(''), 2000)
    }
  }, [options.announceLoading])

  const announceError = useCallback((error: string) => {
    if (options.announceErrors) {
      setAnnouncement(`Error loading image: ${error}`)
      setTimeout(() => setAnnouncement(''), 3000)
    }
  }, [options.announceErrors])

  const announceLoaded = useCallback(() => {
    if (options.announceLoading) {
      const alt = typeof media === 'object' ? media.alt : 'Image'
      setAnnouncement(`${alt} loaded successfully`)
      setTimeout(() => setAnnouncement(''), 2000)
    }
  }, [options.announceLoading, media])

  const getAriaLabel = useCallback(() => {
    if (options.customAriaLabel) return options.customAriaLabel
    return typeof media === 'object' ? media.alt || 'Media content' : 'Media content'
  }, [options.customAriaLabel, media])

  return {
    announcement,
    announceLoading,
    announceError,
    announceLoaded,
    getAriaLabel
  }
}