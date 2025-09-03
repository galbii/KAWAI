import type { 
  Productline, 
  PianoModel
} from '@/payload-types'

import type { 
  ProductlinesResponse,
  PianoModelsResponse 
} from './types'

// Server-side Payload CMS API functions
// These run on the server and can use server-side environment variables

const PAYLOAD_API_URL = process.env.PAYLOAD_API_URL || process.env.NEXT_PUBLIC_PAYLOAD_API_URL || 'http://localhost:3000/api'

// Server-side fetch wrapper with better error handling
async function payloadServerFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${PAYLOAD_API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      next: { revalidate: 300 }, // Revalidate every 5 minutes
      ...options,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Payload server fetch error:', error)
    throw error
  }
}

// Server-side fetch all productlines with optional filtering by category
export async function getProductlinesServer(category?: string): Promise<Productline[]> {
  try {
    const queryParams = new URLSearchParams()
    
    if (category) {
      queryParams.append('where[category][equals]', category)
    }
    
    // Sort by sortOrder (ascending) then by name
    queryParams.append('sort', 'sortOrder,name')
    queryParams.append('limit', '100') // Get all productlines
    queryParams.append('depth', '2') // Populate media relationships and their nested relationships
    
    const endpoint = `/productlines?${queryParams.toString()}`
    const response = await payloadServerFetch<ProductlinesResponse>(endpoint)
    
    return response.docs
  } catch (error) {
    console.error('Failed to fetch productlines on server:', error)
    return [] // Return empty array as fallback
  }
}

// Server-side fetch a single productline by slug
export async function getProductlineBySlugServer(slug: string): Promise<Productline | null> {
  try {
    const queryParams = new URLSearchParams()
    queryParams.append('where[slug][equals]', slug)
    queryParams.append('limit', '1')
    
    const endpoint = `/productlines?${queryParams.toString()}`
    const response = await payloadServerFetch<ProductlinesResponse>(endpoint)
    
    return response.docs[0] || null
  } catch (error) {
    console.error('Failed to fetch productline by slug on server:', error)
    return null
  }
}

// Server-side fetch featured productlines
export async function getFeaturedProductlinesServer(category?: string): Promise<Productline[]> {
  try {
    const queryParams = new URLSearchParams()
    queryParams.append('where[featured][equals]', 'true')
    
    if (category) {
      queryParams.append('where[category][equals]', category)
    }
    
    queryParams.append('sort', 'sortOrder,name')
    queryParams.append('limit', '10')
    
    const endpoint = `/productlines?${queryParams.toString()}`
    const response = await payloadServerFetch<ProductlinesResponse>(endpoint)
    
    return response.docs
  } catch (error) {
    console.error('Failed to fetch featured productlines on server:', error)
    return []
  }
}

// Piano Model server functions

// Server-side fetch all piano models with optional filtering by productline
export async function getPianoModelsServer(productlineSlug?: string): Promise<PianoModel[]> {
  try {
    const queryParams = new URLSearchParams()
    
    if (productlineSlug) {
      queryParams.append('where[productline.slug][equals]', productlineSlug)
    }
    
    queryParams.append('sort', 'sortOrder,name')
    queryParams.append('limit', '100')
    queryParams.append('depth', '2') // Populate productline relationship
    
    const endpoint = `/piano-models?${queryParams.toString()}`
    const response = await payloadServerFetch<PianoModelsResponse>(endpoint)
    
    return response.docs
  } catch (error) {
    console.error('Failed to fetch piano models on server:', error)
    return []
  }
}

// Server-side fetch piano models for a specific productline
export async function getPianoModelsByProductlineServer(productlineId: string): Promise<PianoModel[]> {
  try {
    const queryParams = new URLSearchParams()
    queryParams.append('where[productline][equals]', productlineId)
    queryParams.append('sort', 'sortOrder,name')
    queryParams.append('limit', '100')
    queryParams.append('depth', '1')
    
    const endpoint = `/piano-models?${queryParams.toString()}`
    const response = await payloadServerFetch<PianoModelsResponse>(endpoint)
    
    return response.docs
  } catch (error) {
    console.error('Failed to fetch piano models by productline on server:', error)
    return []
  }
}

// Helper function to preserve Media objects or provide fallback for strings
function preserveMediaOrFallback(media: any): any {
  // If it's a Media object with url property, preserve it
  if (media && typeof media === 'object' && media.url) {
    return media
  }
  // If it's a valid URL string, keep it as string
  if (typeof media === 'string' && media.startsWith('http')) {
    return media
  }
  // Otherwise return fallback image path
  return `/images/banners/default-piano.webp`
}

// Transform Piano Model to component format for server
function transformPianoModelToComponentServer(pianoModel: PianoModel) {
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
    image: preserveMediaOrFallback(pianoModel.image),
    description: pianoModel.description,
    keyFeatures: (pianoModel.keyFeatures || []).map(kf => kf.feature)
  }
}

// Transform server-fetched data to component format
export function transformProductlineToSeriesServer(productline: Productline, pianoModels?: PianoModel[]) {
  // Use provided piano models or extract from join field
  let pianos: any[] = []
  
  if (pianoModels) {
    pianos = pianoModels.map(transformPianoModelToComponentServer)
  } else if (productline.pianoModels?.docs) {
    pianos = productline.pianoModels.docs
      .filter((model): model is PianoModel => typeof model === 'object')
      .map(transformPianoModelToComponentServer)
  }

  return {
    name: productline.name,
    description: productline.description,
    highlight: productline.highlight,
    image: preserveMediaOrFallback(productline.image), // Main series image from Productlines collection
    href: `/pianos/${productline.category}/${productline.slug}`,
    slides: (productline.slides || []).map(slide => ({
      title: slide.title,
      image: preserveMediaOrFallback(slide.image)
    })),
    pianos: pianos
  }
}

// Transform multiple Productlines to Series array for server components
export function transformProductlinesToSeriesServer(productlines: Productline[], pianoModelsByProductline?: Record<string, PianoModel[]>) {
  return productlines.map(productline => {
    const pianoModels = pianoModelsByProductline?.[productline.id]
    return transformProductlineToSeriesServer(productline, pianoModels)
  })
}

// New server function to fetch productlines with their piano models
export async function getProductlinesWithPianoModelsServer(category?: string): Promise<any[]> {
  try {
    // Get productlines
    const productlines = await getProductlinesServer(category)
    
    // Get piano models for each productline
    const seriesWithPianos = await Promise.all(
      productlines.map(async (productline) => {
        const pianoModels = await getPianoModelsByProductlineServer(productline.id)
        return transformProductlineToSeriesServer(productline, pianoModels)
      })
    )
    
    return seriesWithPianos
  } catch (error) {
    console.error('Failed to fetch productlines with piano models on server:', error)
    return []
  }
}