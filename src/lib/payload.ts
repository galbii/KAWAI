import type { 
  Productline, 
  PianoCategory,
  FeaturedModel,
  PianoPage,
  Media
} from '@/payload-types'

// Payload CMS API base URL - this should be set from environment variables
const PAYLOAD_API_URL = process.env.NEXT_PUBLIC_PAYLOAD_API_URL || 'http://localhost:3000/api'

// Generic fetch wrapper with error handling
async function payloadFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${PAYLOAD_API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Payload fetch error:', error)
    throw error
  }
}

// Fetch all productlines with optional filtering by category
export async function getProductlines(category?: string): Promise<Productline[]> {
  const queryParams = new URLSearchParams()
  
  if (category) {
    queryParams.append('where[category][equals]', category)
  }
  
  // Sort by sortOrder (ascending) then by name
  queryParams.append('sort', 'sortOrder,name')
  queryParams.append('limit', '100') // Get all productlines
  
  const endpoint = `/productlines?${queryParams.toString()}`
  const response = await payloadFetch<ProductlinesResponse>(endpoint)
  
  return response.docs
}

// Fetch a single productline by slug
export async function getProductlineBySlug(slug: string): Promise<Productline | null> {
  const queryParams = new URLSearchParams()
  queryParams.append('where[slug][equals]', slug)
  queryParams.append('limit', '1')
  
  const endpoint = `/productlines?${queryParams.toString()}`
  const response = await payloadFetch<ProductlinesResponse>(endpoint)
  
  return response.docs[0] || null
}

// Fetch featured productlines
export async function getFeaturedProductlines(category?: string): Promise<Productline[]> {
  const queryParams = new URLSearchParams()
  queryParams.append('where[featured][equals]', 'true')
  
  if (category) {
    queryParams.append('where[category][equals]', category)
  }
  
  queryParams.append('sort', 'sortOrder,name')
  queryParams.append('limit', '10')
  
  const endpoint = `/productlines?${queryParams.toString()}`
  const response = await payloadFetch<ProductlinesResponse>(endpoint)
  
  return response.docs
}

// Helper function to extract image URL from various formats
function getImageUrl(image: any): string {
  return resolveMediaUrl(image)
}

// Transform Productline to the format expected by existing components
export function transformProductlineToSeries(productline: Productline) {
  return {
    name: productline.name,
    description: productline.description,
    highlight: productline.highlight,
    href: `/pianos/${productline.category}/${productline.slug}`,
    slides: (productline.slides || []).map(slide => ({
      title: slide.title,
      image: getImageUrl(slide.image)
    })),
    pianos: [] // Empty array since pianos are now managed separately
  }
}

// Transform multiple Productlines to Series array
export function transformProductlinesToSeries(productlines: Productline[]) {
  return productlines.map(transformProductlineToSeries)
}

// Piano Categories API functions
export async function getPianoCategories(): Promise<PianoCategory[]> {
  const queryParams = new URLSearchParams()
  queryParams.append('where[status][not_equals]', 'hidden')
  queryParams.append('sort', 'sortOrder,name')
  queryParams.append('limit', '20')
  
  const endpoint = `/piano-categories?${queryParams.toString()}`
  const response = await payloadFetch<{docs: PianoCategory[]}>(endpoint)
  
  return response.docs
}

export async function getPianoCategoryBySlug(slug: string): Promise<PianoCategory | null> {
  const queryParams = new URLSearchParams()
  queryParams.append('where[slug][equals]', slug)
  queryParams.append('limit', '1')
  
  const endpoint = `/piano-categories?${queryParams.toString()}`
  const response = await payloadFetch<{docs: PianoCategory[]}>(endpoint)
  
  return response.docs[0] || null
}

// Featured Models API functions
export async function getFeaturedModels(): Promise<FeaturedModel[]> {
  const queryParams = new URLSearchParams()
  queryParams.append('where[active][equals]', 'true')
  queryParams.append('sort', 'sortOrder,createdAt')
  queryParams.append('limit', '10')
  
  const endpoint = `/featured-models?${queryParams.toString()}`
  const response = await payloadFetch<{docs: FeaturedModel[]}>(endpoint)
  
  return response.docs
}

// Piano Page API functions
export async function getPianoPage(slug: string = 'pianos'): Promise<PianoPage | null> {
  const queryParams = new URLSearchParams()
  queryParams.append('where[slug][equals]', slug)
  queryParams.append('where[status][equals]', 'published')
  queryParams.append('limit', '1')
  
  const endpoint = `/piano-pages?${queryParams.toString()}`
  const response = await payloadFetch<{docs: PianoPage[]}>(endpoint)
  
  return response.docs[0] || null
}

// Media API functions
export async function getMediaById(id: string): Promise<Media | null> {
  try {
    const endpoint = `/media/${id}`
    const media = await payloadFetch<Media>(endpoint)
    return media
  } catch (error) {
    console.error('Error fetching media:', error)
    return null
  }
}

// Helper function to resolve media references
export function resolveMediaUrl(media: string | Media | null | undefined): string {
  if (!media) return '/images/banners/default-piano.webp'
  
  if (typeof media === 'string') {
    // If it's a string and looks like a URL, return as is
    if (media.startsWith('http') || media.startsWith('/')) {
      return media
    }
    // Otherwise, it might be an ID - would need to fetch separately
    return '/images/banners/default-piano.webp'
  }
  
  // It's a Media object
  return media.url || '/images/banners/default-piano.webp'
}

// Transform PianoCategory to the format expected by existing components
export function transformPianoCategoryToLegacy(category: PianoCategory) {
  const iconMap = {
    'piano': 'Piano',
    'music': 'Music', 
    'zap': 'Zap',
    'award': 'Award',
    'crown': 'Crown'
  } as const

  return {
    slug: category.slug,
    name: category.name,
    description: category.description,
    image: resolveMediaUrl(category.image),
    models: category.models.map(model => model.name),
    priceRange: category.priceRange || 'Contact for pricing',
    features: category.features.map(feature => feature.feature),
    icon: iconMap[category.icon] || 'Piano',
    badge: category.badge || '',
    highlight: category.highlight || ''
  }
}

// Transform FeaturedModel to the format expected by existing components
export function transformFeaturedModelToLegacy(model: FeaturedModel) {
  return {
    name: model.name,
    category: model.category,
    image: resolveMediaUrl(model.image),
    badge: model.badge || '',
    description: model.description
  }
}

// Cache utilities for performance
interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

const cache = new Map<string, CacheEntry<any>>()
const DEFAULT_TTL = 5 * 60 * 1000 // 5 minutes

function getCachedData<T>(key: string): T | null {
  const entry = cache.get(key)
  if (!entry) return null
  
  if (Date.now() - entry.timestamp > entry.ttl) {
    cache.delete(key)
    return null
  }
  
  return entry.data
}

function setCachedData<T>(key: string, data: T, ttl: number = DEFAULT_TTL): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl
  })
}

// Cached versions of API functions
export async function getCachedPianoCategories(): Promise<PianoCategory[]> {
  const cacheKey = 'piano-categories'
  const cached = getCachedData<PianoCategory[]>(cacheKey)
  
  if (cached) return cached
  
  const data = await getPianoCategories()
  setCachedData(cacheKey, data)
  
  return data
}

export async function getCachedFeaturedModels(): Promise<FeaturedModel[]> {
  const cacheKey = 'featured-models'
  const cached = getCachedData<FeaturedModel[]>(cacheKey)
  
  if (cached) return cached
  
  const data = await getFeaturedModels()
  setCachedData(cacheKey, data)
  
  return data
}

export async function getCachedPianoPage(slug: string = 'pianos'): Promise<PianoPage | null> {
  const cacheKey = `piano-page-${slug}`
  const cached = getCachedData<PianoPage | null>(cacheKey)
  
  if (cached !== null) return cached
  
  const data = await getPianoPage(slug)
  setCachedData(cacheKey, data)
  
  return data
}