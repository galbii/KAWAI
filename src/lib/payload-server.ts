import type {
  Productline,
  Product,
  ConcertArtistPage
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
    queryParams.append('depth', '3') // Populate join relationships (products) and their nested relationships
    
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
export async function getPianoModelsServer(productlineSlug?: string): Promise<Product[]> {
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
export async function getPianoModelsByProductlineServer(productlineId: string): Promise<Product[]> {
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
function transformPianoModelToComponentServer(pianoModel: Product) {
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
    image: preserveMediaOrFallback(pianoModel.mainImage),
    description: pianoModel.description,
    keyFeatures: (pianoModel.keyFeatures || []).map(kf => kf.feature)
  }
}

// Transform server-fetched data to component format
export function transformProductlineToSeriesServer(productline: Productline, pianoModels?: Product[]) {
  // Use provided piano models (legacy) or extract from products join field
  let pianos: any[] = []
  
  if (pianoModels) {
    // Legacy support: transform piano models
    pianos = pianoModels.map(transformPianoModelToComponentServer)
  } else if (productline.products?.docs) {
    // New approach: use products join field
    pianos = productline.products.docs
      .filter((product): product is Product => typeof product === 'object')
      .filter(product => product.type === 'piano' && product.status === 'active')
      .map(transformProductToComponentServer)
  }

  return {
    name: productline.name,
    description: productline.description,
    highlight: productline.highlight ?? null,
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
export function transformProductlinesToSeriesServer(productlines: Productline[], pianoModelsByProductline?: Record<string, Product[]>) {
  return productlines.map(productline => {
    const pianoModels = pianoModelsByProductline?.[productline.id]
    return transformProductlineToSeriesServer(productline, pianoModels)
  })
}

// Helper function to get the best available image from product (server version)
function getProductImageServer(product: Product): any {
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

// Transform Product to component format for server
function transformProductToComponentServer(product: Product) {
  return {
    slug: product.slug,
    name: product.name,
    series: product.series || (typeof product.productline === 'object' && product.productline?.name ? product.productline.name : 'Unknown Series'),
    rating: product.rating || 4.5,
    reviews: product.reviews || 0,
    badge: product.badge,
    highlight: product.highlight,
    image: getProductImageServer(product), // Use fallback logic: mainImage (Media object) > imageUrl (string) > null
    description: product.description,
    keyFeatures: (product.keyFeatures || []).map((kf: any) => kf.feature)
  }
}

// New server function to fetch productlines with their products via join field
export async function getProductlinesWithProductsServer(category?: string): Promise<any[]> {
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
    const response = await payloadServerFetch<ProductlinesResponse>(endpoint)
    
    // Transform productlines with their joined products to series format
    const seriesWithProducts = response.docs.map(productline => {
      // Use products join field
      const joinedData = (productline as any).products?.docs || []
      const products = joinedData.filter((item: any): item is Product => 
        typeof item === 'object' && item.type === 'piano'
      )
      const pianos = products
        .filter((product: Product) => product.status === 'active')
        .map(transformProductToComponentServer)
      
      return {
        name: productline.name,
        description: productline.description,
        highlight: productline.highlight,
        href: `/pianos/${productline.category}/${productline.slug}`,
        image: preserveMediaOrFallback(productline.image),
        slides: (productline.slides || []).map(slide => ({
          title: slide.title,
          image: preserveMediaOrFallback(slide.image)
        })),
        pianos: pianos
      }
    })
    
    return seriesWithProducts
  } catch (error) {
    console.error('Error fetching productlines with products on server:', error)
    return []
  }
}

// Generate individual category navigation for header
export async function generateCategoryNavigationServer(category: string): Promise<{label: string, href: string, description?: string, isProductline?: boolean, isProduct?: boolean}[]> {
  try {
    // Get productlines for this specific category with their products
    const categoryProductlines = await getProductlinesServer(category)
    
    const navigation: {label: string, href: string, description?: string, isProductline?: boolean, isProduct?: boolean}[] = []
    
    // Sort productlines by number of products (most populated first)
    const sortedProductlines = categoryProductlines
      .map(productline => {
        const products = productline.products?.docs?.filter((product): product is Product => 
          typeof product === 'object' && 
          product.type === 'piano' && 
          product.status === 'active'
        ) || []
        return { productline, productCount: products.length, products }
      })
      .filter(item => item.productCount > 0) // Only include productlines with at least 1 product
      .sort((a, b) => b.productCount - a.productCount) // Sort by product count descending
    
    // Add productlines and their products for this category
    for (const { productline, products } of sortedProductlines) {
      // Add productline as section header
      navigation.push({
        label: productline.name,
        href: `/pianos/${category}/${productline.slug}`,
        description: productline.description || `${productline.name} piano series`,
        isProductline: true
      })
      
      // Add all active products for this productline
      for (const product of products) {
        navigation.push({
          label: product.name,
          href: `/products/${product.slug}`,
          description: product.shortDescription || `${product.name} piano model`,
          isProduct: true
        })
      }
    }
    
    return navigation
  } catch (error) {
    console.error(`Error generating ${category} navigation:`, error)
    return []
  }
}

// Generate all piano categories for main navigation
export async function generatePianoCategoriesNavigationServer() {
  try {
    // Get all productlines to determine which categories have content
    const allProductlines = await getProductlinesServer()
    
    // Categories in desired display order
    const categoryOrder = ['digital', 'grand', 'upright', 'hybrid'] as const
    const categoryLabels = {
      'digital': 'Digital Pianos',
      'grand': 'Grand Pianos', 
      'upright': 'Upright Pianos',
      'hybrid': 'Hybrid Pianos'
    }
    
    const categoryNav = []
    
    for (const category of categoryOrder) {
      // Check if this category has any productlines
      const categoryProductlines = allProductlines.filter(pl => pl.category === category)
      
      if (categoryProductlines.length > 0) {
        // Generate dropdown items for this category
        const dropdownItems = await generateCategoryNavigationServer(category)
        
        categoryNav.push({
          label: categoryLabels[category],
          href: `/pianos/${category}`,
          dropdown: dropdownItems
        })
      }
    }
    
    return categoryNav
  } catch (error) {
    console.error('Error generating piano categories navigation:', error)
    // Return fallback
    return [
      { label: 'Digital Pianos', href: '/pianos/digital', dropdown: [] },
      { label: 'Grand Pianos', href: '/pianos/grand', dropdown: [] },
      { label: 'Upright Pianos', href: '/pianos/upright', dropdown: [] },
      { label: 'Hybrid Pianos', href: '/pianos/hybrid', dropdown: [] },
    ]
  }
}

// LEGACY: Keep for backward compatibility during transition
export async function getProductlinesWithPianoModelsServer(category?: string): Promise<any[]> {
  console.warn('getProductlinesWithPianoModelsServer is deprecated. Use getProductlinesWithProductsServer instead.')
  return getProductlinesWithProductsServer(category)
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