import type { 
  Productline, 
  PianoModel,
  Product,
  Media
} from '@/payload-types'

import type { 
  ProductlinesResponse,
  PianoModelsResponse 
} from '@/lib/types'

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
export async function getPianoModels(productlineSlug?: string): Promise<PianoModel[]> {
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
export async function getPianoModelBySlug(slug: string): Promise<PianoModel | null> {
  const queryParams = new URLSearchParams()
  queryParams.append('where[slug][equals]', slug)
  queryParams.append('limit', '1')
  queryParams.append('depth', '2') // Populate productline relationship
  
  const endpoint = `/piano-models?${queryParams.toString()}`
  const response = await payloadFetch<PianoModelsResponse>(endpoint)
  
  return response.docs[0] || null
}

// Fetch featured piano models
export async function getFeaturedPianoModels(category?: string): Promise<PianoModel[]> {
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
export async function getPianoModelsByProductline(productlineId: string): Promise<PianoModel[]> {
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
export function transformPianoModelToComponent(pianoModel: PianoModel) {
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
    series: typeof pianoModel.productline === 'object' ? pianoModel.productline.name : 'Unknown Series',
    rating: 0, // Rating is now handled by Products collection
    reviews: 0, // Reviews are now handled by Products collection
    image: pianoModel.image, // Keep as Media object or string
    description: pianoModel.description,
    keyFeatures: (pianoModel.keyFeatures || []).map(kf => kf.feature),
    pianoModelId: pianoModel.id // Add the piano model ID for product slug fetching
  }
}

// Transform Productline to the format expected by existing components
export function transformProductlineToSeries(productline: Productline, pianoModels?: PianoModel[]) {
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
export function transformProductlinesToSeries(productlines: Productline[], pianoModelsByProductline?: Record<string, PianoModel[]>) {
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

// Piano Categories API functions  
export async function getPianoCategories(): Promise<any[]> {
  try {
    const pianoPageData = await getPianoPage()
    if (pianoPageData?.pianoCategories?.length > 0) {
      return pianoPageData.pianoCategories
    }
  } catch (error) {
    console.error('Error fetching piano categories from PianosPage:', error)
  }
  
  // Fallback to hardcoded categories
  return [
    {
      slug: "grand",
      name: "Acoustic Grand Pianos",
      description: "Professional grand pianos featuring advanced technology and superior craftsmanship",
      image: "/images/piano-categories/grand.jpg",
      priceRange: "$45,000 - $185,000",
      features: [{"feature": "Millennium III Action"}, {"feature": "Carbon Fiber Components"}, {"feature": "Neotex Key Surface"}, {"feature": "Konami Tuning Pins"}],
      icon: "piano",
      badge: "Professional",
      highlight: "GX BLAK Performance Series"
    },
    {
      slug: "upright",
      name: "Acoustic Upright Pianos", 
      description: "Space-efficient acoustic pianos delivering exceptional touch and tone",
      image: "/images/piano-categories/upright.png",
      priceRange: "$8,999 - $35,000",
      features: [{"feature": "Extended Length Keys"}, {"feature": "Millennium III Prep"}, {"feature": "Soft-Close Fallboard"}, {"feature": "Premium Hammers"}],
      icon: "music",
      badge: "Classic", 
      highlight: "K Professional Series"
    },
    {
      slug: "digital",
      name: "Digital Pianos",
      description: "Cutting-edge digital instruments with authentic piano touch and sound",
      image: "/images/piano-categories/digital.png", 
      priceRange: "$1,999 - $12,999",
      features: [{"feature": "Grand Feel III Action"}, {"feature": "Harmonic Imaging XL"}, {"feature": "Onkyo Audio"}, {"feature": "Bluetooth Connectivity"}],
      icon: "zap",
      badge: "Innovation",
      highlight: "Concert Artist Series"
    },
    {
      slug: "hybrid",
      name: "Hybrid Pianos",
      description: "Revolutionary instruments combining acoustic action with digital versatility",
      image: "/images/piano-categories/hybrid.jpg",
      priceRange: "$12,999 - $24,999", 
      features: [{"feature": "Real Grand Action"}, {"feature": "Silent Practice Mode"}, {"feature": "Digital Recording"}, {"feature": "Millennium III Action"}],
      icon: "award",
      badge: "Hybrid Technology",
      highlight: "NOVUS & AnyTime Series"
    }
  ]
}

export async function getPianoCategoryBySlug(slug: string): Promise<any | null> {
  const queryParams = new URLSearchParams()
  queryParams.append('where[slug][equals]', slug)
  queryParams.append('limit', '1')
  
  const endpoint = `/piano-categories?${queryParams.toString()}`
  const response = await payloadFetch<{docs: any[]}>(endpoint)
  
  return response.docs[0] || null
}

// Featured Models API functions
export async function getFeaturedModels(): Promise<any[]> {
  try {
    const pianoPageData = await getPianoPage()
    if (pianoPageData?.featuredModels?.length > 0) {
      return pianoPageData.featuredModels
    }
  } catch (error) {
    console.error('Error fetching featured models from PianosPage:', error)
  }
  
  // Fallback to hardcoded featured models
  return [
    {
      name: "GX-7 BLAK",
      category: "GX BLAK Performance Series",
      image: "/images/banners/GX-7-BLAK-grand-styling.webp",
      badge: "Performance Series",
      description: "Professional concert grand featuring revolutionary carbon fiber action technology, delivering unprecedented responsiveness and durability for the modern virtuoso."
    },
    {
      name: "CA99",
      category: "Concert Artist Digital",
      image: "/images/banners/CA99-digital-styling.webp",
      badge: "Flagship Digital", 
      description: "The ultimate digital piano experience with Grand Feel III wooden-key action and authentic concert grand samples captured in stunning detail."
    },
    {
      name: "NOVUS NV-10S",
      category: "Hybrid Innovation",
      image: "/images/banners/NV10S_along the keyboard_whiteBG.jpg",
      badge: "Revolutionary",
      description: "Revolutionary hybrid piano combining a real grand piano action with advanced digital technology, offering the authentic touch of an acoustic grand with silent practice capabilities."
    }
  ]
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

// Get complete PianosPage data with all sections
export async function getPianosPageData(): Promise<{
  hero: any
  categories: any[]
  featuredModels: any[]
  featuredModelsSection: any
  cta: any
  seo: any
} | null> {
  try {
    const pianoPageData = await getCachedPianoPage()
    
    if (!pianoPageData) {
      // Return fallback data structure
      return {
        hero: {
          heroTitle: "Experience the Complete Kawai Piano Collection",
          heroDescription: "From the legendary Shigeru Kawai concert grands used in international competitions to innovative digital and hybrid instruments, discover the piano that will inspire your musical journey.",
          heroBackgroundImage: "/images/piano-categories/NV10S_along%20the%20keyboard_whiteBG.jpg",
          heroCta: {
            text: "Explore Categories",
            link: "#categories"
          }
        },
        categories: await getPianoCategories(),
        featuredModels: await getFeaturedModels(),
        featuredModelsSection: {
          title: "Flagship & Featured Models",
          description: "Discover our most celebrated instruments, from competition-grade concert grands to innovative digital and hybrid pianos preferred by professionals worldwide."
        },
        cta: {
          title: "Experience the Difference",
          description: "Visit our showroom to hear and feel the exceptional quality of Kawai pianos. Our experts will help you find the perfect instrument for your musical journey.",
          ctaText: "Schedule Showroom Visit",
          ctaLink: "/contact/schedule-visit"
        },
        seo: {
          metaTitle: "Kawai Pianos - Professional Digital, Grand, Hybrid & Upright Pianos",
          metaDescription: "Discover Kawai's complete piano collection including professional grand pianos, innovative digital pianos, and revolutionary hybrid instruments.",
          keywords: "kawai pianos, digital piano, grand piano, hybrid piano, upright piano"
        }
      }
    }
    
    return {
      hero: {
        heroTitle: pianoPageData.heroTitle,
        heroDescription: pianoPageData.heroDescription,
        // Preserve Media object for MediaRenderer, fallback to string for static images
        heroBackgroundImage: pianoPageData.heroBackgroundImage || "/images/piano-categories/NV10S_along%20the%20keyboard_whiteBG.jpg",
        heroCta: pianoPageData.heroCta
      },
      categories: pianoPageData.pianoCategories?.length > 0 
        ? pianoPageData.pianoCategories.map((cat: any) => ({
            ...cat,
            // Preserve Media object for MediaRenderer, fallback to string for static images
            image: cat.image || `/images/piano-categories/${cat.slug}.jpg`,
            // Include gallery images from CMS
            galleryImages: cat.galleryImages || []
          }))
        : await getPianoCategories(),
      featuredModels: pianoPageData.featuredModels?.length > 0 
        ? pianoPageData.featuredModels.map((model: any) => ({
            ...model,
            // Preserve Media object for MediaRenderer, fallback to string for static images
            image: model.image || getFallbackImageForModel(model.name)
          }))
        : await getFeaturedModels(),
      featuredModelsSection: pianoPageData.featuredModelsSection || {
        title: "Flagship & Featured Models",
        description: "Discover our most celebrated instruments, from competition-grade concert grands to innovative digital and hybrid pianos preferred by professionals worldwide."
      },
      cta: pianoPageData.ctaSection || {
        title: "Experience the Difference",
        description: "Visit our showroom to hear and feel the exceptional quality of Kawai pianos. Our experts will help you find the perfect instrument for your musical journey.",
        ctaText: "Schedule Showroom Visit",
        ctaLink: "/contact/schedule-visit"
      },
      seo: pianoPageData.seo || {
        metaTitle: "Kawai Pianos - Professional Digital, Grand, Hybrid & Upright Pianos",
        metaDescription: "Discover Kawai's complete piano collection including professional grand pianos, innovative digital pianos, and revolutionary hybrid instruments.",
        keywords: "kawai pianos, digital piano, grand piano, hybrid piano, upright piano"
      }
    }
  } catch (error) {
    console.error('Error fetching complete pianos page data:', error)
    return null
  }
}

// HomePage API Functions

// Fetch HomePage data from API
export async function getHomePage(): Promise<any | null> {
  try {
    // Construct absolute URL for server-side requests
    let apiUrl = '/api/home-page'
    if (typeof window === 'undefined') {
      // Server-side: need absolute URL
      const baseURL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
      apiUrl = `${baseURL}/api/home-page`
    }
    
    console.log('[DEBUG] Fetching home page data from', apiUrl)
    
    // Use the Next.js API route
    const response = await fetch(apiUrl, {
      cache: 'force-cache',
      next: { revalidate: 300 } // Revalidate every 5 minutes
    })
    
    console.log('[DEBUG] Response status:', response.status)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const result = await response.json()
    console.log('[DEBUG] API response result:', { success: result.success, hasData: !!result.data })
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch home page data')
    }
    
    console.log('[DEBUG] Successfully fetched home page data')
    return result.data
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

// Get complete HomePage data with fallback defaults
export async function getHomePageData(): Promise<{
  heroSection: any
  showroomSection: any
  pianoCollectionSection: any
  pianoGallerySection: any
  newsCarouselSection: any
  contactFormSection: any
  seo: any
} | null> {
  try {
    const homePageData = await getCachedHomePage()
    
    if (!homePageData) {
      // Return fallback data structure matching HomePage collection schema
      return {
        heroSection: {
          locationText: "St. Louis's Premier Kawai Piano Dealer",
          establishedText: "Est. 1927 • Lake St. Louis, Missouri",
          titlePrefix: "The",
          titleMain: "INSTRUMENTAL",
          titleSuffix: "to Life",
          description: "Every musician harbors a vision. Every performance seeks perfection. Since 1927, we've been crafting the instruments that transform inspiration into reality. Visit our Lake St. Louis showroom and discover why we're Missouri's trusted Kawai piano experts.",
          primaryCta: {
            text: "View Our Piano Collection",
            link: "/pianos"
          },
          secondaryCta: {
            text: "Visit Our St. Louis Showroom",
            link: "/contact"
          },
          backgroundVideo: null // Will use default video path
        },
        showroomSection: {
          sectionHeader: "Our Showroom",
          showroomTitle: "Visit Our Lake St. Louis",
          showroomDescription: "Experience the artistry of Kawai pianos in Missouri's premier showroom. From intimate consultations to comprehensive piano services, discover why discerning musicians choose our Lake St. Louis location.",
          showroomInfo: {
            name: "Kawai Piano Gallery St. Louis",
            address: "21 Meadows Circle Drive, Suite 312, Lake St. Louis, MO 63367",
            phone: "636-265-2866",
            serviceArea: "Serving St. Louis, St. Charles County, O'Fallon, Wentzville & surrounding Missouri areas"
          },
          hours: [
            { day: 'Monday', time: '10:00 am–7:00 pm' },
            { day: 'Tuesday', time: '10:00 am–7:00 pm' },
            { day: 'Wednesday', time: '10:00 am–7:00 pm' },
            { day: 'Thursday', time: '10:00 am–7:00 pm' },
            { day: 'Friday', time: '10:00 am–7:00 pm' },
            { day: 'Saturday', time: '10:00 am–6:00 pm' },
            { day: 'Sunday', time: '1:00 pm–5:00 pm' }
          ],
          features: [
            { icon: 'award', title: 'Expert Consultation', description: 'Personalized guidance from certified Kawai specialists' },
            { icon: 'piano', title: 'Full Service Center', description: 'Tuning, repair, and maintenance by certified technicians' },
            { icon: 'shield', title: 'Financing Available', description: 'Flexible payment options to make your piano dreams accessible' }
          ],
          showroomCtas: {
            directionsText: "Get Directions",
            directionsLink: "https://maps.google.com/?q=Lake+St.+Louis+MO",
            scheduleText: "Schedule Visit",
            scheduleLink: "/contact/schedule-visit"
          }
        },
        pianoCollectionSection: {
          collectionSectionHeader: "Featured Models",
          collectionTitle: "Kawai K-500 &\nGX2 Limited Edition",
          collectionDescription: "Discover the exceptional craftsmanship and innovation that defines our most sought-after instruments",
          collectionCta: {
            text: "Explore Collection",
            link: "/pianos"
          },
          featuredVideo: {
            youtubeId: "1cmwb6evs2A",
            width: 800,
            height: 500
          }
        },
        pianoGallerySection: {
          galleryTitle: "Explore Our Piano Collection",
          galleryDescription: "Discover the full range of Kawai pianos, from handcrafted grand pianos to innovative digital and hybrid instruments. Each piano represents our commitment to exceptional craftsmanship and musical excellence.",
          pianoCategories: [
            {
              model: 'Grand',
              title: 'Grand Pianos',
              description: 'Professional acoustic grand pianos for concert halls, studios, and discerning homes. Experience the ultimate in touch, tone, and musical expression with instruments trusted by professional musicians worldwide.',
              href: '/pianos/grand'
            },
            {
              model: 'Digital',
              title: 'Digital Pianos',
              description: 'Advanced digital pianos featuring realistic wooden-key actions and premium sound systems. Combining authentic acoustic piano experience with modern technology and convenient features for today\'s musicians.',
              href: '/pianos/digital'
            },
            {
              model: 'Upright',
              title: 'Upright Pianos',
              description: 'Space-efficient acoustic pianos delivering exceptional touch and tone quality. Perfect for homes, studios, schools, and institutions where space is at a premium but musical excellence cannot be compromised.',
              href: '/pianos/upright'
            },
            {
              model: 'Hybrid',
              title: 'Hybrid Pianos',
              description: 'Revolutionary instruments combining real grand piano actions with advanced digital sound technology. Experience the authentic touch of acoustic keys with the versatility and innovation of digital sound.',
              href: '/pianos/hybrid'
            }
          ]
        },
        newsCarouselSection: {
          autoPlayDuration: 7000,
          newsItems: [
            {
              title: 'Instrumental to Life',
              description: 'Redefining harmony between tradition and innovation',
              category: 'news',
              link: '/about/instrumental-to-life'
            },
            {
              title: 'Kawai Piano Gallery',
              description: 'Explore our complete collection of acoustic and digital pianos',
              category: 'news',
              link: '/pianos'
            },
            {
              title: 'Special Financing Offers',
              description: 'Make your dream piano more accessible with flexible payment options',
              category: 'promotions',
              link: '/financing'
            }
          ]
        },
        contactFormSection: {
          contactTitle: "Find Your Perfect",
          contactTitleHighlight: "Piano",
          contactDescription: "Get your free Piano Buying Guide and personalized recommendations from our Lake St. Louis piano experts. Serving the St. Louis area for over 95 years.",
          stepTitles: [
            { step: 'Tell us about your piano journey' },
            { step: 'Help us understand your needs' },
            { step: 'Get your free piano buying guide' }
          ],
          trustMessage: "Trusted by St. Louis area piano families since 1927",
          benefits: [
            { icon: 'shield-check', text: 'Free comprehensive Piano Buying Guide (PDF)' },
            { icon: 'users', text: 'Personalized piano recommendations' },
            { icon: 'award', text: 'Exclusive offers and updates' }
          ],
          formOptions: {
            experienceLevels: [
              { level: 'Beginner' },
              { level: 'Intermediate' },
              { level: 'Advanced' },
              { level: 'Professional' }
            ],
            pianoTypes: [
              { type: 'Acoustic Grand' },
              { type: 'Acoustic Upright' },
              { type: 'Digital Piano' },
              { type: 'Hybrid Piano' },
              { type: 'Not Sure' }
            ],
            budgetRanges: [
              { range: 'Under $5,000' },
              { range: '$5,000 - $15,000' },
              { range: '$15,000 - $35,000' },
              { range: '$35,000 - $75,000' },
              { range: '$75,000+' }
            ],
            primaryUses: [
              { use: 'Learning/Practice' },
              { use: 'Family Entertainment' },
              { use: 'Teaching' },
              { use: 'Performance' },
              { use: 'Recording/Studio' }
            ]
          }
        },
        seo: {
          metaTitle: "Kawai Pianos St. Louis | Premier Piano Dealer Since 1927 | Lake St. Louis",
          metaDescription: "St. Louis's premier Kawai piano dealer since 1927. Explore acoustic & digital pianos at our Lake St. Louis showroom. Expert consultation & service.",
          keywords: "Kawai pianos, St. Louis piano dealer, Lake St. Louis piano store, acoustic pianos, digital pianos, piano showroom, Missouri piano dealer, piano sales, piano service"
        }
      }
    }
    
    // Return CMS data with structure matching fallback
    return {
      heroSection: {
        locationText: homePageData.locationText,
        establishedText: homePageData.establishedText,
        titlePrefix: homePageData.titlePrefix,
        titleMain: homePageData.titleMain,
        titleSuffix: homePageData.titleSuffix,
        description: homePageData.description,
        primaryCta: homePageData.primaryCta,
        secondaryCta: homePageData.secondaryCta,
        backgroundVideo: homePageData.backgroundVideo
      },
      showroomSection: {
        sectionHeader: homePageData.sectionHeader,
        showroomTitle: homePageData.showroomTitle,
        showroomDescription: homePageData.showroomDescription,
        showroomInfo: homePageData.showroomInfo,
        hours: homePageData.hours,
        features: homePageData.features,
        mapApiKey: homePageData.mapApiKey,
        showroomCtas: homePageData.showroomCtas
      },
      pianoCollectionSection: {
        collectionSectionHeader: homePageData.collectionSectionHeader,
        collectionTitle: homePageData.collectionTitle,
        collectionDescription: homePageData.collectionDescription,
        collectionCta: homePageData.collectionCta,
        featuredVideo: homePageData.featuredVideo
      },
      pianoGallerySection: {
        galleryTitle: homePageData.galleryTitle,
        galleryDescription: homePageData.galleryDescription,
        pianoCategories: homePageData.pianoCategories
      },
      newsCarouselSection: {
        autoPlayDuration: homePageData.autoPlayDuration,
        newsItems: homePageData.newsItems
      },
      contactFormSection: {
        contactTitle: homePageData.contactTitle,
        contactTitleHighlight: homePageData.contactTitleHighlight,
        contactDescription: homePageData.contactDescription,
        stepTitles: homePageData.stepTitles,
        trustMessage: homePageData.trustMessage,
        benefits: homePageData.benefits,
        formOptions: homePageData.formOptions
      },
      seo: homePageData.seo
    }
  } catch (error) {
    console.error('Error fetching complete home page data:', error)
    return null
  }
}

// Dealer Location API Functions

// Fetch DealerLocation data from API
export async function getDealerLocation(slug: string): Promise<any | null> {
  try {
    // Construct absolute URL for server-side requests
    let apiUrl = `/api/dealer-locations/by-slug/${slug}`
    if (typeof window === 'undefined') {
      // Server-side: need absolute URL
      const baseURL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
      apiUrl = `${baseURL}/api/dealer-locations/by-slug/${slug}`
    }
    
    console.log('[DEBUG] Fetching dealer location data from', apiUrl)
    
    // Use the Next.js API route
    const response = await fetch(apiUrl, {
      cache: 'force-cache',
      next: { revalidate: 300 } // Revalidate every 5 minutes
    })
    
    console.log('[DEBUG] Response status:', response.status)
    
    if (response.status === 404) {
      // Location not found or inactive
      console.log('[DEBUG] Dealer location not found or inactive')
      return null
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const result = await response.json()
    console.log('[DEBUG] API response result:', { success: result.success, hasData: !!result.data })
    
    if (!result.success) {
      if (result.error === 'Dealer location not found or inactive') {
        return null
      }
      throw new Error(result.error || 'Failed to fetch dealer location data')
    }
    
    console.log('[DEBUG] Successfully fetched dealer location data')
    return result.data
  } catch (error) {
    // Handle null/undefined errors the same way as payloadFetch
    if (error === null || error === undefined) {
      console.error('[ERROR] Failed to fetch dealer location: received null error')
      throw new Error('Failed to fetch dealer location data')
    }
    
    if (!(error instanceof Error)) {
      console.error('[ERROR] Failed to fetch dealer location:', String(error))
      throw new Error(`Failed to fetch dealer location data: ${String(error)}`)
    }
    
    console.error('[ERROR] Failed to fetch dealer location:', error.message)
    throw error
  }
}

// Cached version of DealerLocation API function
export async function getCachedDealerLocation(slug: string): Promise<any | null> {
  const cacheKey = `dealer-location-${slug}`
  const cached = getCachedData<any | null>(cacheKey)
  
  if (cached !== null) return cached
  
  const data = await getDealerLocation(slug)
  setCachedData(cacheKey, data)
  
  return data
}

// Get complete DealerLocation data - matching HomePageData structure for component compatibility
export async function getDealerLocationData(slug: string): Promise<{
  heroSection: any
  showroomSection: any
  pianoCollectionSection: any
  pianoGallerySection: any
  newsCarouselSection: any
  contactFormSection: any
  seo: any
} | null> {
  try {
    const dealerLocationData = await getCachedDealerLocation(slug)
    
    if (!dealerLocationData) {
      // Return null to trigger 404 - no fallback for dealer locations
      return null
    }
    
    // Return the data structure that matches HomePageData interface
    return {
      heroSection: dealerLocationData.heroSection,
      showroomSection: dealerLocationData.showroomSection,
      pianoCollectionSection: dealerLocationData.pianoCollectionSection,
      pianoGallerySection: dealerLocationData.pianoGallerySection,
      newsCarouselSection: dealerLocationData.newsCarouselSection,
      contactFormSection: dealerLocationData.contactFormSection,
      seo: dealerLocationData.seo
    }
  } catch (error) {
    console.error('Error fetching complete dealer location data:', error)
    // Re-throw the error so the page can handle 404s properly
    throw error
  }
}