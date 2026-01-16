// Frontend-specific type definitions for Kawai Piano website
// Note: Core CMS types are auto-generated in payload-types.ts

// Import Payload generated types
import type {
  Media as PayloadMedia,
  User,
  PianosPage,
  Product
} from '@/payload-types'

// Re-export for convenience
export type {
  Product,
  User,
  PianosPage
}

// Legacy interfaces for existing code compatibility
export interface MediaItem {
  url: string
  alt?: string
  caption?: string
  width?: number
  height?: number
}

export interface Pricing {
  msrp?: number
  salePrice?: number
  currency?: string
}

export interface Variation {
  variation: string
  image?: string
  description?: string
}

export interface Specifications {
  keys?: number
  pedals?: number
  voices?: number
  polyphony?: number
  dimensions?: {
    length: string
    width: string
    height: string
    unit: string
  }
  weight?: {
    value: string
    unit: string
  }
  variations?: Variation[]
  actionType?: string
  soundEngine?: string
}

export interface Coordinates {
  latitude: number
  longitude: number
}

export interface Location {
  id: string
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  phone?: string
  website?: string
  hours?: string[]
  coordinates?: Coordinates
}

export interface AvailabilityRegion {
  region: string
  availability: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
}

export interface Series {
  id: string
  name: string
  slug: string
  description?: string
  shortDescription?: string
  category?: string
  media?: any // Generic media type for legacy compatibility
  updatedAt?: string
  featured?: boolean
}

export interface Innovation {
  id: string
  innovation?: {
    name: string
    description: string
  }
}

export interface Award {
  id: string
  name: string
  year?: number
  organization?: string
}

export interface Review {
  id: string
  rating: number
  comment: string
  author: string
  date: string
}

export interface Piano {
  id: string
  name: string
  model: string
  slug: string
  description?: string
  shortDescription?: string
  pianoType: string
  pricing?: Pricing
  specifications?: Specifications
  media?: any // Generic media type for legacy compatibility
  series?: Series
  category?: Category
  features?: string[]
  status?: string
  isFeatured?: boolean
  isPreOwned?: boolean
  availabilityRegions?: AvailabilityRegion[]
  innovations?: Innovation[]
  awards?: Award[]
  reviews?: Review[]
  averageRating?: number
  createdAt?: string
  updatedAt?: string
  compareFeatures?: {
    comparisonHighlights?: string[]
  }
}

export interface SocialMedia {
  platform: string
  url: string
}

export interface Contact {
  email?: string
  phone?: string
  website?: string
  socialMedia?: SocialMedia[]
}

export interface Artist {
  id: string
  name: string
  slug: string
  title?: string
  category: string
  biography?: string
  shortBio?: string
  media?: any // Generic media type for legacy compatibility
  contact?: Contact
  featured?: boolean
  updatedAt?: string
}

export interface Technology {
  id: string
  name: string
  slug: string
  description?: string
  shortDescription?: string
  category?: string
  media?: any // Generic media type for legacy compatibility
  isInnovation?: boolean
  updatedAt?: string
}

export interface FilterCriteria {
  type?: string[]
  series?: string[]
  priceMin?: number
  priceMax?: number
  keys?: number[]
  variations?: string[]
  features?: string[]
  status?: string[]
  isPreOwned?: boolean
  availability?: string[]
}

export interface SearchFilters {
  [key: string]: unknown
}

export interface RecommendationCriteria {
  budget?: number
  experience?: 'beginner' | 'intermediate' | 'advanced' | 'professional'
  usage?: 'practice' | 'performance' | 'recording' | 'teaching'
  space?: 'apartment' | 'house' | 'studio' | 'concert-hall'
  preferences?: string[]
}

export interface AnalyticsProperties {
  [key: string]: unknown
}

// Window interface extensions for analytics
declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
    fbq?: (...args: unknown[]) => void
  }
}

// Facebook Pixel function type
export interface FacebookPixelFunction {
  (...args: unknown[]): void
  callMethod?: (...args: unknown[]) => void
  queue?: unknown[]
}

// Structured data types
export interface StructuredData {
  '@context': string
  '@type': string
  [key: string]: unknown
}

// Frontend component interfaces that work with Payload data
export interface ComponentSeries {
  name: string
  description: string
  highlight?: string | null
  href?: string
  slides?: Array<{
    title: string
    image: string
  }>
  pianos: ComponentPiano[]
}

export interface ComponentPiano {
  slug: string
  name: string
  series: string
  rating: number
  reviews: number
  image: string
  description: string
  keyFeatures: string[]
}

// API Response types (using Payload generated types)
export interface PianoModelsResponse {
  docs: Product[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage?: number
  nextPage?: number
}