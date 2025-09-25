// Media domain types - Advanced media management and optimization
// Types extending the base media system with business logic

import type { Media } from '@/payload-types'
import type { MediaId } from '@/types/common/utils'

// Enhanced media with optimization metadata
export interface EnhancedMedia extends Omit<Media, 'usage' | 'variants'> {
  id: MediaId
  optimization: MediaOptimization
  usage: MediaUsage
  analytics: MediaAnalytics
}

export interface MediaOptimization {
  formats: OptimizedFormat[]
  presets: OptimizedPreset[]
  compression: CompressionSettings
  caching: CacheSettings
}

export interface OptimizedFormat {
  format: 'webp' | 'avif' | 'jpeg' | 'png'
  quality: number
  size: number // bytes
  url: string
  supported: boolean
}

export interface OptimizedPreset {
  name: 'hero' | 'gallery' | 'thumbnail' | 'card'
  dimensions: { width: number; height: number }
  quality: number
  url: string
}

export interface CompressionSettings {
  algorithm: 'lossy' | 'lossless'
  quality: number
  progressive: boolean
  stripMetadata: boolean
}

export interface CacheSettings {
  ttl: number // seconds
  headers: Record<string, string>
  cdn: boolean
  edgeLocations: string[]
}

export interface MediaUsage {
  collections: string[]
  pages: string[]
  components: string[]
  lastUsed: Date | string
  usageCount: number
}

export interface MediaAnalytics {
  views: number
  downloads: number
  loadTime: number // average milliseconds
  errorRate: number
  popularSizes: Record<string, number>
}