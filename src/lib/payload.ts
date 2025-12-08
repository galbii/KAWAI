import type {
  Productline,
  Product,
  Media,
  Storefront
} from '@/payload-types'

import type {
  ProductlinesResponse,
  PianoModelsResponse
} from '@/lib/types'

// Import fallback utilities
import {
  withFallback,
  withArrayFallback,
  mergeWithFallback,
  getHomePageDataWithFallbacks,
  getPianoPageDataWithFallbacks,
  getPianoCategoriesWithFallbacks,
  getFeaturedModelsWithFallbacks,
  FALLBACK_HOMEPAGE_DATA,
  FALLBACK_PIANO_PAGE_DATA,
  FALLBACK_PIANO_CATEGORIES,
  FALLBACK_FEATURED_MODELS
} from '@/lib/fallbacks'

// Product API response type
interface ProductsResponse {
  docs: Product[]
  hasNextPage: boolean
  hasPrevPage: boolean
  limit: number
  nextPage?: number
  page?: number
  pagingCounter: number
  prevPage?: number
  totalDocs: number
  totalPages: number
}

// Define media response type for Payload API
interface MediaResponse {
  docs: Media[]
  hasNextPage: boolean
  hasPrevPage: boolean
  limit: number
  nextPage?: number
  page?: number
  pagingCounter: number
  prevPage?: number
  totalDocs: number
  totalPages: number
}


// Helper function to get the correct API URL for server-side vs client-side
function getPayloadApiUrl(): string {
  if (typeof window === 'undefined') {
    // Server-side: need absolute URL
    return process.env.NEXT_PUBLIC_PAYLOAD_API_URL || 
           `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api`
  }
  // Client-side: relative URL works fine
  return process.env.NEXT_PUBLIC_PAYLOAD_API_URL || '/api'
}

// Generic fetch wrapper with error handling
async function payloadFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const apiUrl = getPayloadApiUrl()
    const response = await fetch(`${apiUrl}${endpoint}`, {
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
    // Handle cases where error is null or not an Error object
    if (error === null || error === undefined) {
      const enhancedError = new Error(`Payload fetch failed for endpoint: ${endpoint} - received null error`)
      console.error('Payload fetch error (enhanced):', enhancedError.message)
      throw enhancedError
    }
    
    // If it's not an Error object, wrap it
    if (!(error instanceof Error)) {
      const enhancedError = new Error(`Payload fetch failed for endpoint: ${endpoint} - ${String(error)}`)
      console.error('Payload fetch error (wrapped):', enhancedError.message)
      throw enhancedError
    }
    
    console.error('Payload fetch error:', error.message, 'for endpoint:', endpoint)
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
  queryParams.append('depth', '2') // Populate image and slides.image relationships
  
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

// Piano Model API Functions

// Fetch all piano models with optional filtering by productline
export async function getPianoModels(productlineSlug?: string): Promise<Product[]> {
  const queryParams = new URLSearchParams()
  
  if (productlineSlug) {
    queryParams.append('where[productline.slug][equals]', productlineSlug)
  }
  
  // Sort by sortOrder (ascending) then by name
  queryParams.append('sort', 'sortOrder,name')
  queryParams.append('limit', '100') // Get all models
  queryParams.append('depth', '2') // Populate productline relationship
  
  const endpoint = `/piano-models?${queryParams.toString()}`
  const response = await payloadFetch<PianoModelsResponse>(endpoint)
  
  return response.docs
}

// Fetch a single piano model by slug
export async function getPianoModelBySlug(slug: string): Promise<Product | null> {
  const queryParams = new URLSearchParams()
  queryParams.append('where[slug][equals]', slug)
  queryParams.append('limit', '1')
  queryParams.append('depth', '2') // Populate productline relationship
  
  const endpoint = `/piano-models?${queryParams.toString()}`
  const response = await payloadFetch<PianoModelsResponse>(endpoint)
  
  return response.docs[0] || null
}

// Fetch featured piano models
export async function getFeaturedPianoModels(category?: string): Promise<Product[]> {
  const queryParams = new URLSearchParams()
  queryParams.append('where[featured][equals]', 'true')
  
  if (category) {
    queryParams.append('where[productline.category][equals]', category)
  }
  
  queryParams.append('sort', 'sortOrder,name')
  queryParams.append('limit', '10')
  queryParams.append('depth', '2') // Populate productline relationship
  
  const endpoint = `/piano-models?${queryParams.toString()}`
  const response = await payloadFetch<PianoModelsResponse>(endpoint)
  
  return response.docs
}

// Fetch piano models for a specific productline
export async function getPianoModelsByProductline(productlineId: string): Promise<Product[]> {
  const queryParams = new URLSearchParams()
  queryParams.append('where[productline][equals]', productlineId)
  queryParams.append('sort', 'sortOrder,name')
  queryParams.append('limit', '100')
  queryParams.append('depth', '1') // Don't need full productline data since we know it
  
  const endpoint = `/piano-models?${queryParams.toString()}`
  const response = await payloadFetch<PianoModelsResponse>(endpoint)
  
  return response.docs
}

// Product API Functions

// Fetch all products with optional filtering by category
export async function getProducts(category?: string): Promise<Product[]> {
  const queryParams = new URLSearchParams()
  
  if (category) {
    queryParams.append('where[category][equals]', category)
  }
  
  // Sort by name
  queryParams.append('sort', 'name')
  queryParams.append('limit', '100') // Get all products
  queryParams.append('depth', '3') // Populate pianoModel, mainImage, and nested relationships
  
  const endpoint = `/products?${queryParams.toString()}`
  const response = await payloadFetch<ProductsResponse>(endpoint)
  
  return response.docs
}

// Fetch a single product by slug with full pianoModel population
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const queryParams = new URLSearchParams()
  queryParams.append('where[slug][equals]', slug)
  queryParams.append('limit', '1')
  queryParams.append('depth', '3') // Populate pianoModel and all nested relationships
  
  const endpoint = `/products?${queryParams.toString()}`
  const response = await payloadFetch<ProductsResponse>(endpoint)
  
  return response.docs[0] || null
}

// Fetch active products (status = active)
export async function getActiveProducts(category?: string): Promise<Product[]> {
  const queryParams = new URLSearchParams()
  queryParams.append('where[status][equals]', 'active')
  
  if (category) {
    queryParams.append('where[category][equals]', category)
  }
  
  queryParams.append('sort', 'name')
  queryParams.append('limit', '100')
  queryParams.append('depth', '3')
  
  const endpoint = `/products?${queryParams.toString()}`
  const response = await payloadFetch<ProductsResponse>(endpoint)
  
  return response.docs
}

// CONSOLIDATED: Get products by category (replaces getProductlinesWithPianoModels)
export async function getProductsByCategory(category: string) {
  try {
    const queryParams = new URLSearchParams()
    queryParams.append('where[type][equals]', 'piano')
    queryParams.append('where[category][equals]', category)
    queryParams.append('where[status][not_equals]', 'draft')
    queryParams.append('sort', 'visibility.sortOrder,name')
    queryParams.append('limit', '100')
    queryParams.append('depth', '2') // Include productline and media
    
    const endpoint = `/products?${queryParams.toString()}`
    const response = await payloadFetch<any>(endpoint)
    
    if (!response.docs) return []

    // Group products by productline for component compatibility
    const productsByProductline = response.docs.reduce((acc: any, product: any) => {
      const productlineName = typeof product.productline === 'object' 
        ? product.productline.name 
        : 'Unknown Series'
      
      if (!acc[productlineName]) {
        acc[productlineName] = {
          name: productlineName,
          description: typeof product.productline === 'object' ? product.productline.description : '',
          category: product.category,
          pianos: []
        }
      }
      
      acc[productlineName].pianos.push(transformProductToComponent(product))
      return acc
    }, {})
    
    return Object.values(productsByProductline)
  } catch (error) {
    console.error('Error fetching products by category:', error)
    return []
  }
}

// Helper function to extract image URL from various formats
function getImageUrl(image: any): string {
  return resolveMediaUrl(image)
}

// Helper function to get the best available image from product
function getProductImage(product: any): any {
  // Check if main product image is properly populated (Media object with url)
  const isMainImageValid = product.mainImage && 
    typeof product.mainImage === 'object' && 
    product.mainImage.url && 
    product.mainImage.url.trim() !== '';
  
  if (isMainImageValid) {
    return product.mainImage;
  }
  
  // Fallback to imageUrl if mainImage is not properly populated
  if (product.imageUrl && product.imageUrl.trim() !== '') {
    return product.imageUrl;
  }
  
  // No valid image available
  return null;
}

// CONSOLIDATED: Transform Product (piano type) to frontend component format
// Supports both old nested structure and new consolidated structure
export function transformProductToComponent(product: any) {
  return {
    slug: product.slug,
    name: product.name,
    // NEW: Direct root-level access, FALLBACK: nested productData, FALLBACK: productline
    series: product.series || product.productData?.series || (typeof product.productline === 'object' && product.productline?.name ? product.productline.name : 'Unknown Series'),
    // NEW: Direct root-level access, FALLBACK: nested componentData
    rating: product.rating || product.componentData?.rating || 4.5,
    reviews: product.reviews || product.componentData?.reviews || 0,
    badge: product.badge || product.componentData?.badge,
    highlight: product.highlight || product.componentData?.highlight,
    image: getProductImage(product), // Use fallback logic: mainImage (Media object) > imageUrl (string) > null
    description: product.description,
    keyFeatures: (product.keyFeatures || []).map((kf: any) => kf.feature),
    // CONSOLIDATED: No longer need pianoModelId - direct product access
  }
}

// LEGACY: Keep for backward compatibility during transition
export function transformPianoModelToComponent(pianoModel: Product) {
  // Generate slug from name since slug is no longer in PianoModel
  const slug = pianoModel.name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')

  return {
    slug,
    name: pianoModel.name,
    series: typeof pianoModel.productline === 'object' && pianoModel.productline !== null ? pianoModel.productline.name : 'Unknown Series',
    rating: 0, // Rating is now handled by Products collection
    reviews: 0, // Reviews are now handled by Products collection
    image: pianoModel.mainImage, // Use mainImage from Product
    description: pianoModel.description,
    keyFeatures: (pianoModel.keyFeatures || []).map(kf => kf.feature),
    pianoModelId: pianoModel.id // Add the piano model ID for product slug fetching
  }
}

// Transform Productline to the format expected by existing components
export function transformProductlineToSeries(productline: Productline, pianoModels?: Product[]) {
  // Use provided piano models (legacy) or extract from products join field
  let pianos: any[] = []
  
  if (pianoModels) {
    // Legacy support: transform piano models
    pianos = pianoModels.map(transformPianoModelToComponent)
  } else if (productline.products?.docs) {
    // New approach: use products join field
    pianos = productline.products.docs
      .filter((product): product is Product => typeof product === 'object')
      .filter((product: Product) => product.type === 'piano' && product.status === 'active')
      .map(transformProductToComponent)
  }

  return {
    name: productline.name,
    description: productline.description,
    highlight: productline.highlight,
    href: `/pianos/${productline.category}/${productline.slug}`,
    image: productline.image, // Include the productline's main image
    slides: (productline.slides || []).map(slide => ({
      title: slide.title,
      image: slide.image // Keep as Media object or string
    })),
    pianos: pianos
  }
}

// Transform multiple Productlines to Series array
export function transformProductlinesToSeries(productlines: Productline[], pianoModelsByProductline?: Record<string, Product[]>) {
  return productlines.map(productline => {
    const pianoModels = pianoModelsByProductline?.[productline.id]
    return transformProductlineToSeries(productline, pianoModels)
  })
}

// New function to fetch productlines with their products via join field
export async function getProductlinesWithProducts(category?: string): Promise<any[]> {
  try {
    const queryParams = new URLSearchParams()
    
    if (category) {
      queryParams.append('where[category][equals]', category)
    }
    
    // Sort by sortOrder (ascending) then by name
    queryParams.append('sort', 'sortOrder,name')
    queryParams.append('limit', '100') // Get all productlines
    queryParams.append('depth', '3') // Populate join field and nested media relationships
    
    const endpoint = `/productlines?${queryParams.toString()}`
    const response = await payloadFetch<ProductlinesResponse>(endpoint)
    
    // Transform productlines with their joined products to series format
    const seriesWithProducts = response.docs.map(productline => {
      const products = productline.products?.docs || []
      const pianos = products
        .filter((product): product is Product => typeof product === 'object')
        .filter(product => product.type === 'piano' && product.status === 'active')
        .map(transformProductToComponent)
      
      return {
        name: productline.name,
        description: productline.description,
        highlight: productline.highlight,
        href: `/pianos/${productline.category}/${productline.slug}`,
        image: productline.image,
        slides: (productline.slides || []).map(slide => ({
          title: slide.title,
          image: slide.image
        })),
        pianos: pianos
      }
    })
    
    return seriesWithProducts
  } catch (error) {
    console.error('Error fetching productlines with products:', error)
    return []
  }
}

// LEGACY: Keep for backward compatibility during transition
export async function getProductlinesWithPianoModels(category?: string): Promise<any[]> {
  console.warn('getProductlinesWithPianoModels is deprecated. Use getProductlinesWithProducts instead.')
  return getProductlinesWithProducts(category)
}

// Piano Categories API functions with enhanced fallback support
export async function getPianoCategories(): Promise<any[]> {
  let cmsCategories = null

  try {
    const pianoPageData = await getPianoPage()
    cmsCategories = pianoPageData?.pianoCategories
  } catch (error) {
    console.warn('Error fetching piano categories from CMS, using fallbacks:', error)
  }

  // Use comprehensive fallback system
  return getPianoCategoriesWithFallbacks(cmsCategories)
}

export async function getPianoCategoryBySlug(slug: string): Promise<any | null> {
  const queryParams = new URLSearchParams()
  queryParams.append('where[slug][equals]', slug)
  queryParams.append('limit', '1')
  
  const endpoint = `/piano-categories?${queryParams.toString()}`
  const response = await payloadFetch<{docs: any[]}>(endpoint)
  
  return response.docs[0] || null
}

// Featured Models API functions with enhanced fallback support
export async function getFeaturedModels(): Promise<any[]> {
  let cmsFeaturedModels = null

  try {
    const pianoPageData = await getPianoPage()
    cmsFeaturedModels = pianoPageData?.featuredModels
  } catch (error) {
    console.warn('Error fetching featured models from CMS, using fallbacks:', error)
  }

  // Use comprehensive fallback system
  return getFeaturedModelsWithFallbacks(cmsFeaturedModels)
}

// Piano Page API functions
export async function getPianoPage(): Promise<any | null> {
  try {
    // Construct absolute URL for server-side requests
    let apiUrl = '/api/pianos-page'
    if (typeof window === 'undefined') {
      // Server-side: need absolute URL
      const baseURL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
      apiUrl = `${baseURL}/api/pianos-page`
    }
    
    console.log('[DEBUG] Fetching pianos page data from', apiUrl)
    
    // Use the Next.js API route that proxies to the singleton endpoint
    const response = await fetch(apiUrl)
    
    console.log('[DEBUG] Response status:', response.status)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const result = await response.json()
    console.log('[DEBUG] API response result:', { success: result.success, hasData: !!result.data })
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch pianos page data')
    }
    
    console.log('[DEBUG] Successfully fetched pianos page data')
    return result.data
  } catch (error) {
    // Handle null/undefined errors the same way as payloadFetch
    if (error === null || error === undefined) {
      console.error('[ERROR] Failed to fetch pianos page: received null error')
      return null
    }
    
    if (!(error instanceof Error)) {
      console.error('[ERROR] Failed to fetch pianos page:', String(error))
      return null
    }
    
    console.error('[ERROR] Failed to fetch pianos page:', error.message)
    return null
  }
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
  if (!media) {
    if (process.env.NODE_ENV === 'development') {
      console.debug('resolveMediaUrl: No media provided')
    }
    return ''
  }
  
  if (typeof media === 'string') {
    // If it's a string and looks like a URL, return as is
    if (media.startsWith('http') || media.startsWith('/')) {
      return media
    }
    // Otherwise, it might be an ID - would need to fetch separately
    if (process.env.NODE_ENV === 'development') {
      console.warn('resolveMediaUrl: String provided but not a URL, might be an ID:', media)
    }
    return ''
  }
  
  // It's a Media object - use the url property from Payload
  const url = media.url || ''
  
  // Debug logging for development
  if (process.env.NODE_ENV === 'development') {
    console.debug('resolveMediaUrl: Media object resolved', {
      hasUrl: !!media.url,
      url,
      filename: media.filename,
      alt: media.alt,
      mediaType: media.mediaType
    })
    
    // Warn if Media object doesn't have a URL
    if (!url) {
      console.warn('resolveMediaUrl: Media object missing URL property', media)
    }
  }
  
  return url
}

// Helper function to get fallback images for featured models
function getFallbackImageForModel(modelName: string): string {
  const fallbackMap: Record<string, string> = {
    'GX-7 BLAK': '/images/banners/GX-7-BLAK-grand-styling.webp',
    'CA99': '/images/banners/CA99-digital-styling.webp', 
    'NOVUS NV-10S': '/images/banners/NV10S_along the keyboard_whiteBG.jpg',
  }
  
  return fallbackMap[modelName] || '/images/banners/placeholder-piano.jpg'
}

// Transform PianoCategory to the format expected by existing components
export function transformPianoCategoryToLegacy(category: any) {
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
    models: (category.models || []).map((model: any) => typeof model === 'string' ? model : (model.model || model.name || model)),
    priceRange: category.priceRange || 'Contact for pricing',
    features: (category.features || []).map((feature: any) => typeof feature === 'string' ? feature : (feature.feature || feature)),
    icon: iconMap[category.icon as keyof typeof iconMap] || 'Piano',
    badge: category.badge || '',
    highlight: category.highlight || ''
  }
}

// Transform FeaturedModel to the format expected by existing components
export function transformFeaturedModelToLegacy(model: any) {
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
export async function getCachedPianoCategories(): Promise<any[]> {
  const cacheKey = 'piano-categories'
  const cached = getCachedData<any[]>(cacheKey)
  
  if (cached) return cached
  
  const data = await getPianoCategories()
  setCachedData(cacheKey, data)
  
  return data
}

export async function getCachedFeaturedModels(): Promise<any[]> {
  const cacheKey = 'featured-models'
  const cached = getCachedData<any[]>(cacheKey)
  
  if (cached) return cached
  
  const data = await getFeaturedModels()
  setCachedData(cacheKey, data)
  
  return data
}

export async function getCachedPianoPage(): Promise<any | null> {
  const cacheKey = 'pianos-page-singleton'
  const cached = getCachedData<any | null>(cacheKey)
  
  if (cached !== null) return cached
  
  const data = await getPianoPage()
  setCachedData(cacheKey, data)
  
  return data
}

// Get complete PianosPage data with comprehensive fallback support
export async function getPianosPageData(): Promise<{
  hero: any
  categories: any[]
  featuredModels: any[]
  featuredModelsSection: any
  cta: any
  seo: any
} | null> {
  let cmsData = null

  try {
    cmsData = await getCachedPianoPage()
  } catch (error) {
    console.warn('Error fetching piano page data from CMS, using fallbacks:', error)
  }

  // Use comprehensive fallback system
  return getPianoPageDataWithFallbacks(cmsData)
}

// HomePage API Functions

// Fetch HomePage data from API using the custom singleton endpoint
export async function getHomePage(): Promise<any | null> {
  try {
    // Construct absolute URL for server-side requests
    // Use the custom singleton endpoint defined in HomePage collection
    let apiUrl = '/api/home-page/singleton'
    if (typeof window === 'undefined') {
      // Server-side: need absolute URL
      const baseURL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
      apiUrl = `${baseURL}/api/home-page/singleton`
    }

    console.log('[DEBUG] Fetching home page data from', apiUrl)

    // Use the custom singleton endpoint
    const response = await fetch(apiUrl, {
      cache: 'force-cache',
      next: { revalidate: 300 } // Revalidate every 5 minutes
    })

    console.log('[DEBUG] Response status:', response.status)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log('[DEBUG] API response data:', { hasData: !!data, hasNewsItems: !!data?.newsItems })

    // The singleton endpoint returns the document directly, not wrapped in success/data
    if (!data) {
      throw new Error('No home page data found')
    }

    console.log('[DEBUG] Successfully fetched home page data')
    return data
  } catch (error) {
    // Handle null/undefined errors the same way as payloadFetch
    if (error === null || error === undefined) {
      console.error('[ERROR] Failed to fetch home page: received null error')
      return null
    }

    if (!(error instanceof Error)) {
      console.error('[ERROR] Failed to fetch home page:', String(error))
      return null
    }

    console.error('[ERROR] Failed to fetch home page:', error.message)
    return null
  }
}

// Cached version of HomePage API function
export async function getCachedHomePage(): Promise<any | null> {
  const cacheKey = 'home-page-singleton'
  const cached = getCachedData<any | null>(cacheKey)
  
  if (cached !== null) return cached
  
  const data = await getHomePage()
  setCachedData(cacheKey, data)
  
  return data
}

// Get complete HomePage data with comprehensive fallback support
export async function getHomePageData(): Promise<{
  heroSection: any
  showroomSection: any
  pianoCollectionSection: any
  pianoGallerySection: any
  newsCarouselSection: any
  contactFormSection: any
  seo: any
} | null> {
  let cmsData = null

  try {
    const rawData = await getCachedHomePage()

    if (rawData) {
      // Transform the raw CMS data to match the expected structure
      // HomePage collection has fields at root level, need to wrap them in section objects
      cmsData = {
        heroSection: {
          locationText: rawData.locationText,
          establishedText: rawData.establishedText,
          titlePrefix: rawData.titlePrefix,
          titleMain: rawData.titleMain,
          titleSuffix: rawData.titleSuffix,
          description: rawData.description,
          primaryCta: rawData.primaryCta,
          secondaryCta: rawData.secondaryCta,
          backgroundVideo: rawData.backgroundVideo
        },
        showroomSection: {
          sectionHeader: rawData.sectionHeader,
          showroomTitle: rawData.showroomTitle,
          showroomDescription: rawData.showroomDescription,
          showroomInfo: rawData.showroomInfo,
          hours: rawData.hours,
          features: rawData.features,
          mapApiKey: rawData.mapApiKey,
          showroomCtas: rawData.showroomCtas
        },
        pianoCollectionSection: {
          collectionSectionHeader: rawData.collectionSectionHeader,
          collectionTitle: rawData.collectionTitle,
          collectionDescription: rawData.collectionDescription,
          collectionCta: rawData.collectionCta,
          featuredVideo: rawData.featuredVideo
        },
        pianoGallerySection: {
          galleryTitle: rawData.galleryTitle,
          galleryDescription: rawData.galleryDescription,
          pianoCategories: rawData.pianoCategories
        },
        newsCarouselSection: {
          autoPlayDuration: rawData.autoPlayDuration,
          newsItems: rawData.newsItems
        },
        contactFormSection: {
          contactTitle: rawData.contactTitle,
          contactTitleHighlight: rawData.contactTitleHighlight,
          contactDescription: rawData.contactDescription,
          stepTitles: rawData.stepTitles,
          trustMessage: rawData.trustMessage,
          benefits: rawData.benefits,
          formOptions: rawData.formOptions
        },
        seo: rawData.seo
      }

      console.log('[DEBUG] Transformed homepage data structure with news items:', cmsData.newsCarouselSection?.newsItems?.length || 0)
    }
  } catch (error) {
    console.warn('Error fetching homepage data from CMS, using fallbacks:', error)
  }

  // Use comprehensive fallback system
  return getHomePageDataWithFallbacks(cmsData)
}

// Get only piano gallery data from HomePage collection - optimized for performance
export async function getPianoGalleryData(): Promise<{
  galleryTitle: string
  galleryDescription: string
  pianoCategories: any[]
} | null> {
  try {
    // Use Payload's select API to only fetch piano gallery fields
    const queryParams = new URLSearchParams()
    queryParams.append('select[galleryTitle]', 'true')
    queryParams.append('select[galleryDescription]', 'true')  
    queryParams.append('select[pianoCategories]', 'true')
    
    const endpoint = `/home-page/singleton?${queryParams.toString()}`
    const response = await payloadFetch<{
      galleryTitle: string
      galleryDescription: string
      pianoCategories: any[]
    }>(endpoint)
    
    if (!response) {
      console.warn('No piano gallery data found in HomePage collection')
      return null
    }
    
    return {
      galleryTitle: response.galleryTitle,
      galleryDescription: response.galleryDescription,
      pianoCategories: response.pianoCategories
    }
  } catch (error) {
    console.error('Error fetching piano gallery data:', error)
    // Return null instead of throwing to allow fallback behavior
    return null
  }
}

// Storefront API Functions

// Fetch Storefront data from API
export async function getStorefront(slug: string): Promise<any | null> {
  try {
    // Construct absolute URL for server-side requests
    let apiUrl = `/api/storefronts/by-slug/${slug}`
    if (typeof window === 'undefined') {
      // Server-side: need absolute URL
      // In development, always use localhost. In production, use NEXT_PUBLIC_SITE_URL
      const isDevelopment = process.env.NODE_ENV === 'development'
      const baseURL = isDevelopment ? 'http://localhost:3000' : (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')
      apiUrl = `${baseURL}/api/storefronts/by-slug/${slug}`
    }

    console.log('[DEBUG] Fetching storefront data from', apiUrl)

    // Use the Next.js API route
    const response = await fetch(apiUrl, {
      cache: 'force-cache',
      next: { revalidate: 300 } // Revalidate every 5 minutes
    })

    console.log('[DEBUG] Response status:', response.status)

    if (response.status === 404) {
      // Location not found or inactive
      console.log('[DEBUG] Storefront not found or inactive')
      return null
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    console.log('[DEBUG] API response result:', { success: result.success, hasData: !!result.data })

    if (!result.success) {
      if (result.error === 'Storefront not found or inactive') {
        return null
      }
      throw new Error(result.error || 'Failed to fetch storefront data')
    }

    console.log('[DEBUG] Successfully fetched storefront data')
    return result.data
  } catch (error) {
    // Handle null/undefined errors the same way as payloadFetch
    if (error === null || error === undefined) {
      console.error('[ERROR] Failed to fetch storefront: received null error')
      throw new Error('Failed to fetch storefront data')
    }

    if (!(error instanceof Error)) {
      console.error('[ERROR] Failed to fetch storefront:', String(error))
      throw new Error(`Failed to fetch storefront data: ${String(error)}`)
    }

    console.error('[ERROR] Failed to fetch storefront:', error.message)
    throw error
  }
}

// Cached version of Storefront API function
export async function getCachedStorefront(slug: string): Promise<any | null> {
  const cacheKey = `storefront-${slug}`
  const cached = getCachedData<any | null>(cacheKey)

  if (cached !== null) return cached

  const data = await getStorefront(slug)
  setCachedData(cacheKey, data)

  return data
}

// Get complete Storefront data - matching HomePageData structure for component compatibility
export async function getStorefrontData(slug: string): Promise<{
  heroSection: any
  showroomSection: any
  pianoCollectionSection: any
  pianoGallerySection: any
  newsCarouselSection: any
  contactFormSection: any
  seo: any
} | null> {
  try {
    const storefrontData = await getCachedStorefront(slug)

    if (!storefrontData) {
      // Return null to trigger 404 - no fallback for storefronts
      return null
    }

    // Return the data structure that matches HomePageData interface
    return {
      heroSection: storefrontData.heroSection,
      showroomSection: storefrontData.showroomSection,
      pianoCollectionSection: storefrontData.pianoCollectionSection,
      pianoGallerySection: storefrontData.pianoGallerySection,
      newsCarouselSection: storefrontData.newsCarouselSection,
      contactFormSection: storefrontData.contactFormSection,
      seo: storefrontData.seo
    }
  } catch (error) {
    console.error('Error fetching complete storefront data:', error)
    // Re-throw the error so the page can handle 404s properly
    throw error
  }
}