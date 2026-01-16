// Piano domain types - Core business domain for piano retail
// Types specific to piano products, specifications, and retail operations

import type { Media, Product } from '@/payload-types'
import type { ProductId, PriceValue, PianoCategory, PianoModel as PianoModelBrand } from '@/types/common/utils'
import type { Timestamps, RequireFields } from '@/types/common/utils'

// Enhanced piano product types
export interface PianoProduct extends Omit<Product, 'keyFeatures' | 'specifications'> {
  id: ProductId
  category: PianoCategory
  model: PianoModelBrand
  specifications: PianoSpecifications
  pricing: PianoPricing
  availability: PianoAvailability
  keyFeatures: PianoFeature[]
  variations: PianoVariation[]
}

// Comprehensive piano specifications
export interface PianoSpecifications {
  // Physical dimensions
  dimensions: {
    length: number
    width: number
    height: number
    weight: number
    unit: 'inches' | 'cm'
    weightUnit: 'lbs' | 'kg'
  }

  // Piano mechanics
  keys: {
    total: number
    white: number
    black: number
    actionType: 'weighted' | 'semi-weighted' | 'hammer-action' | 'grand-feel' | 'wooden-key'
    touchSensitivity?: 'light' | 'medium' | 'heavy' | 'adjustable'
  }

  // Sound system (for digital/hybrid pianos)
  sound?: {
    voices: number
    polyphony: number
    soundEngine: string
    sampling: 'multi-dimensional' | 'harmonic-imaging' | 'progressive-harmonic'
    speakers: {
      count: number
      watts: number
      configuration: string
    }
  }

  // Acoustic properties (for acoustic pianos)
  acoustic?: {
    soundboard: {
      material: 'spruce' | 'cedar' | 'maple'
      origin?: string
    }
    strings: {
      type: 'carbon-steel' | 'copper-wound'
      tension: string
    }
    hammers: {
      material: 'felt' | 'synthetic'
      hardness: 'soft' | 'medium' | 'hard'
    }
  }

  // Pedals and controls
  pedals: {
    count: number
    types: ('sustain' | 'soft' | 'sostenuto' | 'half-pedal')[]
    functions?: string[]
  }

  // Connectivity (for digital pianos)
  connectivity?: {
    usb: boolean
    bluetooth: boolean
    wifi?: boolean
    midi: 'din' | 'usb' | 'both'
    audio: {
      input: boolean
      output: boolean
      headphone: number // number of headphone jacks
    }
  }

  // Display and interface
  interface?: {
    display: {
      type: 'lcd' | 'oled' | 'led' | 'none'
      size?: string
      touchScreen?: boolean
    }
    controls: 'buttons' | 'knobs' | 'touchscreen' | 'combination'
  }
}

// Piano pricing structure
export interface PianoPricing {
  msrp?: PriceValue
  currentPrice?: PriceValue
  salePrice?: PriceValue
  priceRange?: {
    min: PriceValue
    max: PriceValue
  }
  currency: 'USD' | 'CAD' | 'EUR'
  contactForPricing?: boolean
  financingAvailable?: boolean
  financing?: {
    monthlyFrom?: PriceValue
    termMonths?: number[]
    apr?: number
    downPayment?: PriceValue
  }
  tradeInAccepted?: boolean
  warranty?: {
    years: number
    type: 'parts-labor' | 'parts-only' | 'extended'
    transferable?: boolean
  }
}

// Piano availability and inventory
export interface PianoAvailability {
  status: 'in-stock' | 'low-stock' | 'backorder' | 'discontinued' | 'special-order'
  quantity?: number
  estimatedDelivery?: {
    min: number
    max: number
    unit: 'days' | 'weeks' | 'months'
  }
  showroomDisplay?: boolean
  availableFor: ('purchase' | 'rental' | 'lease' | 'trial')[]
  regions?: string[] // Geographic availability
  exclusivity?: 'none' | 'dealer-exclusive' | 'limited-edition' | 'signature-series'
}

// Piano features and highlights
export interface PianoFeature {
  id: string
  name: string
  description: string
  category: 'sound' | 'touch' | 'connectivity' | 'design' | 'technology'
  importance: 'primary' | 'secondary' | 'tertiary'
  icon?: string
  technicalDetails?: string
  benefits?: string[]
}

// Piano variation options
export interface PianoVariation {
  id: string
  name: string
  description?: string
  color: string
  type: 'matte' | 'satin' | 'gloss' | 'textured'
  material?: 'wood' | 'composite' | 'metal'
  image?: Media | string
  additionalCost?: PriceValue
  availability?: PianoAvailability
}

// Piano comparison types
export interface PianoComparison {
  pianos: PianoProduct[]
  comparisonMatrix: ComparisonMatrix
  recommendations?: ComparisonRecommendation[]
}

export interface ComparisonMatrix {
  categories: ComparisonCategory[]
}

export interface ComparisonCategory {
  name: string
  weight: number // for scoring
  attributes: ComparisonAttribute[]
}

export interface ComparisonAttribute {
  name: string
  description?: string
  values: Record<ProductId, ComparisonValue>
  importance: 'low' | 'medium' | 'high'
}

export type ComparisonValue =
  | { type: 'text'; value: string }
  | { type: 'number'; value: number; unit?: string }
  | { type: 'boolean'; value: boolean }
  | { type: 'rating'; value: number; max: number }
  | { type: 'range'; min: number; max: number; unit?: string }

export interface ComparisonRecommendation {
  pianoId: ProductId
  score: number
  reason: string
  bestFor: string[]
  considerations?: string[]
}

// Piano search and filtering
export interface PianoSearchFilters {
  category?: PianoCategory[]
  priceRange?: {
    min?: PriceValue
    max?: PriceValue
  }
  brand?: string[]
  series?: string[]
  features?: string[]
  specifications?: {
    keys?: { min?: number; max?: number }
    voices?: { min?: number; max?: number }
    polyphony?: { min?: number; max?: number }
  }
  availability?: ('in-stock' | 'backorder' | 'special-order')[]
  financing?: boolean
  newUsed?: 'new' | 'used' | 'both'
  size?: 'compact' | 'standard' | 'large'
}

export interface PianoSearchResult {
  pianos: PianoProduct[]
  totalCount: number
  facets: SearchFacets
  suggestions?: string[]
}

export interface SearchFacets {
  categories: FacetGroup
  brands: FacetGroup
  priceRanges: FacetGroup
  features: FacetGroup
}

export interface FacetGroup {
  name: string
  values: Array<{
    value: string
    count: number
    selected: boolean
  }>
}

// Piano rental and leasing
export interface PianoRental {
  pianoId: ProductId
  rentalTerms: RentalTerms
  delivery: DeliveryOptions
  maintenance: MaintenanceOptions
}

export interface RentalTerms {
  minimumTerm: number
  maximumTerm?: number
  termUnit: 'months' | 'years'
  monthlyRate: PriceValue
  deposit: PriceValue
  purchaseOption?: {
    available: boolean
    creditApplied?: number // percentage of rental payments
  }
  earlyTermination?: {
    allowed: boolean
    fee?: PriceValue
  }
}

export interface DeliveryOptions {
  included: boolean
  cost?: PriceValue
  setupIncluded: boolean
  tuningIncluded: boolean
  timeframe: {
    min: number
    max: number
    unit: 'days' | 'weeks'
  }
  requirements?: string[] // stairs, elevator access, etc.
}

export interface MaintenanceOptions {
  tuning: {
    included: boolean
    frequency: string
    cost?: PriceValue
  }
  repairs: {
    included: boolean
    coverage: 'basic' | 'comprehensive'
  }
  moving: {
    included: boolean
    allowedMoves?: number
    additionalCost?: PriceValue
  }
}

// Piano events and experiences
export interface PianoEvent {
  id: string
  title: string
  description: string
  type: 'concert' | 'masterclass' | 'workshop' | 'demo' | 'sale'
  featuredPianos?: ProductId[]
  artist?: {
    name: string
    bio: string
    image?: Media | string
  }
  date: Date | string
  duration: number // minutes
  location: 'showroom' | 'online' | 'external'
  capacity?: number
  ticketPrice?: PriceValue
  registration: {
    required: boolean
    url?: string
    deadline?: Date | string
  }
}

// Customer piano journey and preferences
export interface CustomerPreferences {
  budget: {
    min?: PriceValue
    max?: PriceValue
    financing: boolean
  }
  experience: 'beginner' | 'intermediate' | 'advanced' | 'professional'
  usage: ('practice' | 'performance' | 'teaching' | 'recording' | 'family-enjoyment')[]
  space: {
    type: 'apartment' | 'house' | 'studio' | 'school' | 'church'
    size: 'small' | 'medium' | 'large'
    restrictions?: string[]
  }
  preferences: {
    touch: 'light' | 'medium' | 'heavy' | 'no-preference'
    sound: 'bright' | 'warm' | 'balanced' | 'no-preference'
    style: 'traditional' | 'modern' | 'no-preference'
  }
  features: {
    required: string[]
    desired: string[]
    notImportant: string[]
  }
}

export interface PianoRecommendation {
  customerId?: string
  preferences: CustomerPreferences
  recommendations: Array<{
    piano: PianoProduct
    matchScore: number
    matchReasons: string[]
    considerations?: string[]
    alternatives?: ProductId[]
  }>
  generatedAt: Date | string
}