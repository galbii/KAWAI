import type { 
  Productline, 
  PianoModel,
  Media
} from '@/payload-types'

import type { 
  ProductlinesResponse,
  PianoModelsResponse 
} from '@/lib/types'

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

// Helper function to extract image URL from various formats
function getImageUrl(image: any): string {
  return resolveMediaUrl(image)
}

// Transform Piano Model to frontend format
export function transformPianoModelToComponent(pianoModel: PianoModel) {
  return {
    slug: pianoModel.slug,
    name: pianoModel.name,
    series: typeof pianoModel.productline === 'object' ? pianoModel.productline.name : 'Unknown Series',
    rating: pianoModel.rating || 0,
    reviews: pianoModel.reviewCount || 0,
    image: pianoModel.image, // Keep as Media object or string
    description: pianoModel.description,
    keyFeatures: (pianoModel.keyFeatures || []).map(kf => kf.feature)
  }
}

// Transform Productline to the format expected by existing components
export function transformProductlineToSeries(productline: Productline, pianoModels?: PianoModel[]) {
  // Use provided piano models or extract from join field
  let pianos: any[] = []
  
  if (pianoModels) {
    pianos = pianoModels.map(transformPianoModelToComponent)
  } else if (productline.pianoModels?.docs) {
    pianos = productline.pianoModels.docs
      .filter((model): model is PianoModel => typeof model === 'object')
      .map(transformPianoModelToComponent)
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

// New function to fetch productlines with their piano models
export async function getProductlinesWithPianoModels(category?: string): Promise<any[]> {
  // Get productlines
  const productlines = await getProductlines(category)
  
  // Get piano models for each productline
  const seriesWithPianos = await Promise.all(
    productlines.map(async (productline) => {
      const pianoModels = await getPianoModelsByProductline(productline.id)
      return transformProductlineToSeries(productline, pianoModels)
    })
  )
  
  return seriesWithPianos
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
      models: [{"model": "GX-7 BLAK"}, {"model": "GX-6 BLAK"}, {"model": "GX-5 BLAK"}, {"model": "GX-3 BLAK"}, {"model": "GX-2 BLAK"}, {"model": "GX-1 BLAK"}, {"model": "GL-50"}, {"model": "GL-40"}, {"model": "GL-30"}, {"model": "GL-20"}, {"model": "GL-10"}],
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
      models: [{"model": "K-800"}, {"model": "K-600"}, {"model": "K-500"}, {"model": "K-400"}, {"model": "K-300"}, {"model": "K-200"}, {"model": "Designer Series"}, {"model": "Continental Series"}],
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
      models: [{"model": "CA99"}, {"model": "CA901"}, {"model": "CA701"}, {"model": "CA501"}, {"model": "CN301"}, {"model": "CN201"}, {"model": "CL36"}, {"model": "CL26"}],
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
      models: [{"model": "NOVUS NV-10S"}, {"model": "NOVUS NV-5S"}, {"model": "AnyTime ATX4"}, {"model": "AnyTime ATX3"}],
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
    // Use the singleton endpoint provided by PianosPage collection
    const endpoint = `/pianos-page/singleton`
    const data = await payloadFetch<any>(endpoint)
    return data
  } catch (error) {
    console.error('Error fetching pianos page:', error)
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
  if (!media) return ''
  
  if (typeof media === 'string') {
    // If it's a string and looks like a URL, return as is
    if (media.startsWith('http') || media.startsWith('/')) {
      return media
    }
    // Otherwise, it might be an ID - would need to fetch separately
    return ''
  }
  
  // It's a Media object - use the url property from Payload
  // The Media object should have a url property when properly populated with depth
  return media.url || ''
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
        heroBackgroundImage: resolveMediaUrl(pianoPageData.heroBackgroundImage),
        heroCta: pianoPageData.heroCta
      },
      categories: pianoPageData.pianoCategories || await getPianoCategories(),
      featuredModels: pianoPageData.featuredModels || await getFeaturedModels(),
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