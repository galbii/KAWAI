import { Productline, ProductlinesResponse } from './types'

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

// Helper function to extract image URL from various formats
function getImageUrl(image: any): string {
  if (typeof image === 'string') {
    return image.startsWith('http') ? image : `/images/banners/default-piano.webp`
  }
  return image?.url || `/images/banners/default-piano.webp`
}

// Transform server-fetched data to component format
export function transformProductlineToSeriesServer(productline: Productline) {
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

// Transform multiple Productlines to Series array for server components
export function transformProductlinesToSeriesServer(productlines: Productline[]) {
  return productlines.map(transformProductlineToSeriesServer)
}