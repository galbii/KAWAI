// Comprehensive type definitions for Kawai Piano website

export interface MediaItem {
  url: string
  alt?: string
  caption?: string
  width?: number
  height?: number
}

export interface Media {
  featuredImage?: MediaItem
  profileImage?: MediaItem
  images?: MediaItem[]
  videos?: Array<{
    url: string
    title: string
    duration?: number
    thumbnail?: string
  }>
  audio?: Array<{
    url: string
    title: string
    duration?: number
  }>
}

export interface Pricing {
  msrp?: number
  salePrice?: number
  currency?: string
}

export interface Finish {
  finish: string
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
  finishes?: Finish[]
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
  media?: Media
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
  media?: Media
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
  media?: Media
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
  media?: Media
  isInnovation?: boolean
  updatedAt?: string
}

export interface FilterCriteria {
  type?: string[]
  series?: string[]
  priceMin?: number
  priceMax?: number
  keys?: number[]
  finishes?: string[]
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