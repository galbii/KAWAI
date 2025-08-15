import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Piano, FilterCriteria, Finish } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')
}

export function generateExcerpt(content: string, length: number = 150): string {
  if (content.length <= length) return content
  return content.slice(0, length).trim() + '...'
}

// Piano-specific utilities
export function formatPianoModel(model: string): string {
  // Format piano model numbers consistently (e.g., "GX3" -> "GX-3")
  return model.replace(/([A-Z]+)(\d+)/, '$1-$2')
}

export function formatDimensions(length: string, width: string, height: string, unit: string = 'inches'): string {
  const unitAbbrev = unit === 'inches' ? '"' : unit === 'centimeters' ? 'cm' : unit
  return `${length} × ${width} × ${height} ${unitAbbrev}`
}

export function formatWeight(weight: string, unit: string = 'lbs'): string {
  return `${weight} ${unit}`
}

export function calculatePriceRange(pianos: Piano[]): { min: number; max: number } {
  if (!pianos || pianos.length === 0) return { min: 0, max: 0 }
  
  const prices = pianos
    .map(piano => piano.pricing?.salePrice || piano.pricing?.msrp)
    .filter((price): price is number => Boolean(price && price > 0))
  
  if (prices.length === 0) return { min: 0, max: 0 }
  
  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  }
}

export function formatPriceRange(min: number, max: number): string {
  if (min === 0 && max === 0) return 'Price on request'
  if (min === max) return formatPrice(min)
  return `${formatPrice(min)} - ${formatPrice(max)}`
}

export function getPianoTypeLabel(type: string): string {
  const typeLabels: Record<string, string> = {
    'grand': 'Grand Piano',
    'upright': 'Upright Piano',
    'digital': 'Digital Piano',
    'hybrid': 'Hybrid Piano',
    'silent': 'Silent Piano'
  }
  return typeLabels[type] || type
}

export function getSeriesLabel(seriesSlug: string): string {
  const seriesLabels: Record<string, string> = {
    'shigeru-kawai': 'Shigeru Kawai',
    'gx-series': 'GX Series',
    'gl-series': 'GL Series',
    'k-series': 'K Series',
    'ca-series': 'CA Series',
    'cn-series': 'CN Series',
    'es-series': 'ES Series',
    'mp-series': 'MP Series'
  }
  return seriesLabels[seriesSlug] || seriesSlug
}

export function filterPianosBySpecs(pianos: Piano[], filters: FilterCriteria): Piano[] {
  return pianos.filter(piano => {
    // Filter by type
    if (filters.type && filters.type.length > 0) {
      if (!filters.type.includes(piano.pianoType)) return false
    }
    
    // Filter by series
    if (filters.series && filters.series.length > 0) {
      if (!piano.series?.slug || !filters.series.includes(piano.series.slug)) return false
    }
    
    // Filter by price range
    const price = piano.pricing?.salePrice || piano.pricing?.msrp
    if (price) {
      if (filters.priceMin && price < filters.priceMin) return false
      if (filters.priceMax && price > filters.priceMax) return false
    }
    
    // Filter by number of keys
    if (filters.keys && filters.keys.length > 0) {
      if (!piano.specifications?.keys || !filters.keys.includes(piano.specifications.keys)) return false
    }
    
    // Filter by finishes
    if (filters.finishes && filters.finishes.length > 0) {
      const pianoFinishes = piano.specifications?.finishes?.map((f: Finish) => f.finish) || []
      if (!filters.finishes.some(finish => pianoFinishes.includes(finish))) return false
    }
    
    return true
  })
}

export function sortPianos(pianos: Piano[], sortBy: 'name' | 'price-asc' | 'price-desc' | 'newest' | 'featured'): Piano[] {
  const sorted = [...pianos]
  
  switch (sortBy) {
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    
    case 'price-asc':
      return sorted.sort((a, b) => {
        const priceA = a.pricing?.salePrice || a.pricing?.msrp || 0
        const priceB = b.pricing?.salePrice || b.pricing?.msrp || 0
        return priceA - priceB
      })
    
    case 'price-desc':
      return sorted.sort((a, b) => {
        const priceA = a.pricing?.salePrice || a.pricing?.msrp || 0
        const priceB = b.pricing?.salePrice || b.pricing?.msrp || 0
        return priceB - priceA
      })
    
    case 'newest':
      return sorted.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return dateB - dateA
      })
    
    case 'featured':
      return sorted.sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1
        if (!a.isFeatured && b.isFeatured) return 1
        return 0
      })
    
    default:
      return sorted
  }
}

export function generateComparisonData(pianos: Piano[]): Array<{
  id: string
  name: string
  model: string
  image?: import('./types').MediaItem
  price?: number
  type: string
  series?: string
  specs: {
    keys?: number
    pedals?: number
    voices?: number
    polyphony?: number
    dimensions?: import('./types').Specifications['dimensions']
    weight?: import('./types').Specifications['weight']
    actionType?: string
    soundEngine?: string
  }
  features: string[]
  awards: import('./types').Award[]
  innovations: import('./types').Innovation[]
}> {
  return pianos.map(piano => ({
    id: piano.id,
    name: piano.name,
    model: piano.model,
    image: piano.media?.featuredImage,
    price: piano.pricing?.salePrice || piano.pricing?.msrp,
    type: piano.pianoType,
    series: piano.series?.name,
    specs: {
      keys: piano.specifications?.keys,
      pedals: piano.specifications?.pedals,
      voices: piano.specifications?.voices,
      polyphony: piano.specifications?.polyphony,
      dimensions: piano.specifications?.dimensions,
      weight: piano.specifications?.weight,
      actionType: piano.specifications?.actionType,
      soundEngine: piano.specifications?.soundEngine
    },
    features: piano.compareFeatures?.comparisonHighlights || [],
    awards: piano.awards || [],
    innovations: piano.innovations || []
  }))
}

export function generatePianoSearchIndex(pianos: Piano[]): Array<{
  id: string
  searchTerms: string
}> {
  return pianos.map(piano => ({
    id: piano.id,
    searchTerms: [
      piano.name,
      piano.model,
      piano.series?.name,
      piano.category?.name,
      piano.pianoType,
      ...(piano.features || []),
      ...(piano.specifications?.finishes?.map((f: Finish) => f.finish) || []),
      piano.specifications?.actionType,
      piano.specifications?.soundEngine
    ].filter(Boolean).join(' ').toLowerCase()
  }))
}

export function searchPianos(pianos: Piano[], query: string): Piano[] {
  if (!query.trim()) return pianos
  
  const searchIndex = generatePianoSearchIndex(pianos)
  const normalizedQuery = query.toLowerCase().trim()
  
  const matchingIds = searchIndex
    .filter(item => item.searchTerms.includes(normalizedQuery))
    .map(item => item.id)
  
  return pianos.filter(piano => matchingIds.includes(piano.id))
}

export function getPopularSearchTerms(): string[] {
  return [
    'Shigeru Kawai',
    'Grand Piano',
    'Digital Piano',
    'GX Series',
    'CA Series',
    'Millennium III',
    'Harmonic Imaging',
    '88 keys',
    'Ebony Polish',
    'Concert Grand'
  ]
}

export function formatAudioDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

export function generateSEOTitle(piano: Piano): string {
  return `${piano.name} - ${piano.series?.name || 'Kawai Piano'} | Premium ${getPianoTypeLabel(piano.pianoType)}`
}

export function generateSEODescription(piano: Piano): string {
  const features = piano.features?.slice(0, 3).join(', ') || 'Premium craftsmanship'
  return `Discover the ${piano.name} by Kawai. ${features}. Experience exceptional sound quality and performance. View specifications and pricing.`
}

export function generateSEOKeywords(piano: Piano): string {
  const keywords = [
    'Kawai piano',
    piano.name,
    piano.model,
    piano.series?.name,
    getPianoTypeLabel(piano.pianoType),
    'piano for sale',
    'premium piano',
    'acoustic piano',
    ...(piano.features?.slice(0, 3) || [])
  ]
  return keywords.filter(Boolean).join(', ')
}