// Media optimization utilities for high-quality piano images and videos

export interface ImageOptimizationConfig {
  quality: number
  width?: number
  height?: number
  format?: 'webp' | 'jpg' | 'png'
  responsive?: boolean
}

export interface VideoOptimizationConfig {
  quality: 'low' | 'medium' | 'high' | 'ultra'
  preload?: 'none' | 'metadata' | 'auto'
  poster?: string
}

export const PIANO_IMAGE_CONFIGS = {
  thumbnail: {
    quality: 75,
    width: 300,
    height: 200,
    format: 'webp' as const,
    responsive: true
  },
  card: {
    quality: 80,
    width: 600,
    height: 400,
    format: 'webp' as const,
    responsive: true
  },
  gallery: {
    quality: 85,
    width: 1200,
    height: 800,
    format: 'webp' as const,
    responsive: true
  },
  hero: {
    quality: 90,
    width: 1920,
    height: 1080,
    format: 'webp' as const,
    responsive: true
  },
  detail: {
    quality: 95,
    width: 2400,
    height: 1600,
    format: 'webp' as const,
    responsive: true
  }
} as const

export const PIANO_VIDEO_CONFIGS = {
  preview: {
    quality: 'medium' as const,
    preload: 'metadata' as const
  },
  demo: {
    quality: 'high' as const,
    preload: 'none' as const
  },
  concert: {
    quality: 'ultra' as const,
    preload: 'none' as const
  }
} as const

export function generateImageSrcSet(
  baseUrl: string, 
  config: ImageOptimizationConfig
): string {
  if (!config.responsive) {
    return buildImageUrl(baseUrl, config)
  }

  const sizes = [
    { width: Math.floor((config.width || 800) * 0.5), descriptor: '1x' },
    { width: config.width || 800, descriptor: '2x' },
    { width: Math.floor((config.width || 800) * 1.5), descriptor: '3x' }
  ]

  return sizes
    .map(size => `${buildImageUrl(baseUrl, { ...config, width: size.width })} ${size.descriptor}`)
    .join(', ')
}

export function generateImageSizes(breakpoints: Record<string, number>): string {
  const sizes = Object.entries(breakpoints)
    .sort(([, a], [, b]) => b - a) // Sort by breakpoint size desc
    .map(([media, size]) => `(max-width: ${size}px) ${Math.floor(size * 0.9)}px`)
    .join(', ')
  
  return `${sizes}, 100vw`
}

export function buildImageUrl(
  baseUrl: string, 
  config: ImageOptimizationConfig
): string {
  const params = new URLSearchParams()
  
  if (config.width) params.set('w', config.width.toString())
  if (config.height) params.set('h', config.height.toString())
  if (config.quality) params.set('q', config.quality.toString())
  if (config.format) params.set('f', config.format)
  
  // Add fit parameter for piano images to maintain aspect ratio
  params.set('fit', 'cover')
  
  return `${baseUrl}?${params.toString()}`
}

export function getOptimizedImageProps(
  media: any,
  configKey: keyof typeof PIANO_IMAGE_CONFIGS
) {
  if (!media?.url) return null

  const config = PIANO_IMAGE_CONFIGS[configKey]
  const baseUrl = media.url

  return {
    src: buildImageUrl(baseUrl, config),
    srcSet: generateImageSrcSet(baseUrl, config),
    sizes: generateImageSizes({
      mobile: 480,
      tablet: 768,
      desktop: 1200,
      wide: 1920
    }),
    width: config.width,
    height: config.height,
    alt: media.alt || '',
    loading: configKey === 'hero' ? 'eager' : 'lazy',
    decoding: 'async'
  }
}

export function getVideoOptimizationProps(
  media: any,
  configKey: keyof typeof PIANO_VIDEO_CONFIGS
) {
  if (!media?.url) return null

  const config = PIANO_VIDEO_CONFIGS[configKey]

  return {
    src: media.url,
    preload: config.preload,
    controls: true,
    playsInline: true,
    muted: true, // Required for autoplay
    poster: media.poster?.url || undefined
  }
}

export function generateAudioWaveform(audioUrl: string): Promise<number[]> {
  return new Promise((resolve) => {
    // This would integrate with a waveform generation library
    // For now, return mock data
    const mockWaveform = Array.from({ length: 200 }, () => Math.random())
    resolve(mockWaveform)
  })
}

export function preloadCriticalImages(images: string[]): void {
  images.forEach(src => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = src
    document.head.appendChild(link)
  })
}

export function preloadAudioSamples(audioUrls: string[]): void {
  audioUrls.forEach(src => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'audio'
    link.href = src
    document.head.appendChild(link)
  })
}

export function createProgressiveImageLoader() {
  return {
    loadImage: (src: string, placeholder?: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image()
        
        img.onload = () => resolve(img)
        img.onerror = reject
        
        // Load placeholder first if provided
        if (placeholder) {
          const placeholderImg = new Image()
          placeholderImg.onload = () => {
            img.src = src // Then load full resolution
          }
          placeholderImg.src = placeholder
        } else {
          img.src = src
        }
      })
    },
    
    generatePlaceholder: (width: number, height: number): string => {
      // Generate a simple SVG placeholder
      const svg = `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#f3f4f6"/>
          <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="system-ui, sans-serif" font-size="16">
            Loading...
          </text>
        </svg>
      `
      return `data:image/svg+xml;base64,${btoa(svg)}`
    }
  }
}

export function createIntersectionObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver {
  const defaultOptions: IntersectionObserverInit = {
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  }
  
  return new IntersectionObserver(callback, defaultOptions)
}

export function lazyLoadImages(container: HTMLElement): void {
  const images = container.querySelectorAll('img[data-src]')
  
  const observer = createIntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement
        const src = img.dataset.src
        
        if (src) {
          img.src = src
          img.removeAttribute('data-src')
          observer.unobserve(img)
        }
      }
    })
  })
  
  images.forEach(img => observer.observe(img))
}

export function optimizePianoGallery(gallery: any[]): any[] {
  return gallery.map((item, index) => ({
    ...item,
    optimized: {
      thumbnail: getOptimizedImageProps(item.image, 'thumbnail'),
      gallery: getOptimizedImageProps(item.image, 'gallery'),
      detail: getOptimizedImageProps(item.image, 'detail')
    },
    priority: index < 3 // Prioritize first 3 images
  }))
}

export function createAudioManager() {
  const audioCache = new Map<string, HTMLAudioElement>()
  
  const preloadAudio = (url: string): Promise<HTMLAudioElement> => {
    if (audioCache.has(url)) {
      return Promise.resolve(audioCache.get(url)!)
    }
    
    return new Promise((resolve, reject) => {
      const audio = new Audio()
      audio.preload = 'metadata'
      
      audio.addEventListener('canplaythrough', () => {
        audioCache.set(url, audio)
        resolve(audio)
      })
      
      audio.addEventListener('error', reject)
      audio.src = url
    })
  }
  
  const playAudio = async (url: string): Promise<void> => {
    const audio = await preloadAudio(url)
    return audio.play()
  }
  
  const pauseAll = (): void => {
    audioCache.forEach(audio => {
      if (!audio.paused) {
        audio.pause()
      }
    })
  }
  
  const clearCache = (): void => {
    audioCache.clear()
  }
  
  return {
    preloadAudio,
    playAudio,
    pauseAll,
    clearCache
  }
}

export const PERFORMANCE_BUDGETS = {
  images: {
    hero: 500, // KB
    gallery: 300, // KB
    thumbnail: 50, // KB
  },
  videos: {
    preview: 2000, // KB
    demo: 10000, // KB
  },
  audio: {
    sample: 1000, // KB
  }
} as const

export function validateMediaSize(file: File, type: keyof typeof PERFORMANCE_BUDGETS): boolean {
  const budget = PERFORMANCE_BUDGETS[type as keyof typeof PERFORMANCE_BUDGETS]
  
  if (typeof budget === 'object') {
    // For complex budgets, we'd need more specific validation
    return true
  }
  
  return file.size <= budget * 1024
}