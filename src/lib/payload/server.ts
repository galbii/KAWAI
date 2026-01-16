import 'server-only'

import type {
  Product,
  ConcertArtistPage
} from '@/payload-types'

import type {
  PianoModelsResponse
} from '../types'

// Server-side Payload CMS API functions
// These run on the server and can use server-side environment variables

// Payload 3.x uses /api as the base, NOT /admin/api
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
function transformPianoModelToComponentServer(pianoModel: Product) {
  // Generate slug from name since slug is no longer in PianoModel
  const slug = pianoModel.name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')

  // Extract series from model field (series field removed from Product schema)
  const seriesPrefix = pianoModel.model?.match(/^[A-Z]+/)?.[0] || ''
  const seriesName = seriesPrefix ? `${seriesPrefix} Series` : 'Piano Series'

  return {
    slug,
    name: pianoModel.name,
    series: seriesName,
    rating: 0, // Rating is now handled by Products collection
    reviews: 0, // Reviews are now handled by Products collection
    image: preserveMediaOrFallback(pianoModel.imageUrl), // Use imageUrl (mainImage removed)
    description: pianoModel.description,
    keyFeatures: [] // keyFeatures removed from Product schema
  }
}

// Helper function to get the best available image from product (server version)
function getProductImageServer(product: Product): any {
  // Use imageUrl from Shopify sync (read-only field)
  if (product.imageUrl && product.imageUrl.trim() !== '') {
    return product.imageUrl;
  }

  // No valid image available
  return null;
}

// Transform Product to component format for server
function transformProductToComponentServer(product: Product) {
  // Extract series from model field (e.g., "CA" from "CA99")
  const seriesPrefix = product.model?.match(/^[A-Z]+/)?.[0] || ''
  const seriesName = seriesPrefix ? `${seriesPrefix} Series` : 'Piano'

  return {
    slug: product.slug,
    name: product.name,
    series: seriesName,
    rating: 4.5, // Removed from product data, use default
    reviews: 0,  // Removed from product data, use default
    badge: undefined, // Removed from product data
    highlight: undefined, // Removed from product data
    image: getProductImageServer(product), // Use fallback logic: mainImage (Media object) > imageUrl (string) > null
    description: product.description,
    keyFeatures: [] // Removed from product data, should come from Page Content blocks
  }
}

// Server-side fetch Concert Artist page data
export async function getConcertArtistPageServer(): Promise<ConcertArtistPage | null> {
  try {
    const endpoint = '/concert-artist-page/singleton'
    const data = await payloadServerFetch<ConcertArtistPage>(endpoint)
    return data
  } catch (error) {
    console.error('Failed to fetch Concert Artist page on server:', error)
    return null
  }
}
