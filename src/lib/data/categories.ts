/**
 * Core category management system for Kawai Piano Website
 *
 * This module provides centralized category definitions, type safety, and utility functions
 * for managing piano categories across the application. All categories are SEO-optimized
 * and follow Kawai branding conventions.
 *
 * @module categories
 * @version 1.0.0
 * @author KAWAI Piano Website
 */

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

/**
 * Piano category slugs used throughout the application
 * Must match the values in Payload CMS collections (Productlines, Products, etc.)
 */
export type PianoCategorySlug = 'digital' | 'grand' | 'hybrid' | 'upright' | 'shigeru'

/**
 * Configuration interface for each piano category
 */
export interface CategoryConfig {
  /** URL-friendly slug for routing */
  slug: PianoCategorySlug
  /** Display name for UI */
  name: string
  /** Full descriptive name for formal contexts */
  fullName: string
  /** SEO-optimized description for category pages */
  description: string
  /** Shorter description for cards and previews */
  shortDescription: string
  /** SEO meta title for category pages */
  metaTitle: string
  /** SEO meta description for category pages */
  metaDescription: string
  /** Primary selling points/features */
  keyFeatures: string[]
  /** Target price range for this category */
  priceRange: string
  /** Default hero image path for category pages */
  defaultHeroImage: string
  /** Icon representation for UI (using Lucide React icons) */
  iconName: string
  /** Color theme for UI elements */
  colorTheme: {
    primary: string
    accent: string
    background: string
  }
  /** SEO keywords for search optimization */
  seoKeywords: string[]
  /** Sort order for display (lower = first) */
  sortOrder: number
}

/**
 * Statistics interface for category data
 */
export interface CategoryStats {
  totalModels?: number
  priceRangeMin?: number
  priceRangeMax?: number
  popularModels?: string[]
  lastUpdated?: Date
}

// =============================================================================
// PIANO CATEGORY DEFINITIONS
// =============================================================================

/**
 * Comprehensive piano category configurations
 * Each category includes complete metadata, SEO optimization, and Kawai-specific branding
 */
export const PIANO_CATEGORIES: Record<PianoCategorySlug, CategoryConfig> = {
  digital: {
    slug: 'digital',
    name: 'Digital Pianos',
    fullName: 'Kawai Digital Pianos',
    description: 'Experience the pinnacle of digital piano innovation with Kawai\'s award-winning collection. Our digital pianos combine authentic Grand Feel wooden-key actions, advanced Harmonic Imaging XL sound technology, and premium Onkyo audio systems to deliver an unparalleled playing experience. From the flagship Concert Artist series to portable stage pianos, each instrument captures the nuanced touch and rich tonal character of our world-renowned acoustic grand pianos.',
    shortDescription: 'Cutting-edge digital instruments with authentic piano touch and sound',
    metaTitle: 'Kawai Digital Pianos - Premium Digital Piano Collection | Kawai',
    metaDescription: 'Discover Kawai\'s professional digital piano collection featuring Grand Feel wooden-key actions, Harmonic Imaging XL sound, and concert-quality samples. From home practice to professional performance.',
    keyFeatures: [
      'Grand Feel III Wooden-Key Action',
      'Harmonic Imaging XL Sound Technology',
      'Premium Onkyo Audio Systems',
      'Bluetooth Connectivity',
      'Advanced Recording Capabilities',
      'Concert Grand Samples'
    ],
    priceRange: '$1,999 - $12,999',
    defaultHeroImage: '/images/piano-categories/digital.png',
    iconName: 'Piano',
    colorTheme: {
      primary: '#2563eb', // Blue - representing technology and innovation
      accent: '#1d4ed8',
      background: '#eff6ff'
    },
    seoKeywords: [
      'kawai digital piano',
      'digital piano',
      'grand feel action',
      'harmonic imaging xl',
      'concert artist',
      'portable piano',
      'weighted keys',
      'piano samples'
    ],
    sortOrder: 1
  },

  grand: {
    slug: 'grand',
    name: 'Grand Pianos',
    fullName: 'Kawai Acoustic Grand Pianos',
    description: 'Discover the artistry and engineering excellence of Kawai grand pianos, where traditional Japanese craftsmanship meets cutting-edge innovation. Our acoustic grands feature the revolutionary Millennium III Action with carbon fiber components, premium European spruce soundboards, and meticulously crafted hammers for exceptional dynamic response. From intimate baby grands to full-sized concert instruments, each piano embodies over 95 years of piano-making expertise and is trusted by professional musicians, recording studios, and concert halls worldwide.',
    shortDescription: 'Professional grand pianos featuring advanced technology and superior craftsmanship',
    metaTitle: 'Kawai Grand Pianos - Professional Concert Grand Piano Collection | Kawai',
    metaDescription: 'Explore Kawai\'s handcrafted grand piano collection featuring Millennium III Action, carbon fiber technology, and premium materials. Trusted by professionals worldwide.',
    keyFeatures: [
      'Millennium III Action Technology',
      'Carbon Fiber Components',
      'Premium European Spruce Soundboards',
      'Neotex Key Surfaces',
      'Konami Tuning Pins',
      'Extended Dynamic Range'
    ],
    priceRange: '$45,000 - $185,000',
    defaultHeroImage: '/images/piano-categories/grand.jpg',
    iconName: 'Music',
    colorTheme: {
      primary: '#dc2626', // Red - representing passion and performance
      accent: '#b91c1c',
      background: '#fef2f2'
    },
    seoKeywords: [
      'kawai grand piano',
      'acoustic grand piano',
      'concert grand',
      'millennium iii action',
      'carbon fiber piano',
      'professional piano',
      'baby grand',
      'concert piano'
    ],
    sortOrder: 2
  },

  hybrid: {
    slug: 'hybrid',
    name: 'Hybrid Pianos',
    fullName: 'Kawai Hybrid Piano Innovation',
    description: 'Experience the revolutionary fusion of acoustic authenticity and digital versatility with Kawai\'s groundbreaking hybrid piano technology. Our hybrid instruments combine real grand piano actions - the same mechanisms found in our acoustic grands - with advanced digital sound engines and innovative features. Featuring authentic wooden keys, progressive counterweighting, and the ability to practice silently with headphones, hybrid pianos offer the ultimate musical experience for modern pianists who demand both traditional touch and contemporary functionality.',
    shortDescription: 'Revolutionary instruments combining acoustic action with digital versatility',
    metaTitle: 'Kawai Hybrid Pianos - Revolutionary Acoustic-Digital Piano Technology | Kawai',
    metaDescription: 'Discover Kawai hybrid pianos combining real grand piano actions with digital sound technology. Silent practice, recording capabilities, and authentic acoustic touch.',
    keyFeatures: [
      'Real Grand Piano Actions',
      'Wooden Key Construction',
      'Silent Practice Mode',
      'Advanced Digital Sound Engine',
      'Recording & Playback',
      'Millennium III Action Components'
    ],
    priceRange: '$12,999 - $24,999',
    defaultHeroImage: '/images/piano-categories/hybrid.jpg',
    iconName: 'Zap',
    colorTheme: {
      primary: '#7c3aed', // Purple - representing innovation and hybrid technology
      accent: '#6d28d9',
      background: '#faf5ff'
    },
    seoKeywords: [
      'kawai hybrid piano',
      'hybrid piano',
      'novus hybrid',
      'silent piano',
      'acoustic action digital sound',
      'real keys digital piano',
      'practice piano',
      'recording piano'
    ],
    sortOrder: 3
  },

  upright: {
    slug: 'upright',
    name: 'Upright Pianos',
    fullName: 'Kawai Acoustic Upright Pianos',
    description: 'Maximize your musical potential with Kawai\'s space-efficient upright piano collection, where compact design meets uncompromising quality. Our upright pianos feature the same advanced action technologies and premium materials found in our grand pianos, including carbon fiber components and precision-crafted soundboards. Perfect for homes, studios, schools, and practice rooms, these instruments deliver the authentic acoustic piano experience in a space-conscious vertical format without sacrificing touch sensitivity, tonal richness, or musical expression.',
    shortDescription: 'Space-efficient acoustic pianos delivering exceptional touch and tone',
    metaTitle: 'Kawai Upright Pianos - Premium Acoustic Upright Piano Collection | Kawai',
    metaDescription: 'Explore Kawai\'s upright piano collection featuring advanced action technology and premium materials in space-efficient designs. Perfect for homes and studios.',
    keyFeatures: [
      'Advanced Action Technology',
      'Solid Spruce Soundboards',
      'Carbon Fiber Reinforcement',
      'Precision Tuning Systems',
      'Duplex Scaling',
      'Space-Efficient Design'
    ],
    priceRange: '$5,999 - $18,999',
    defaultHeroImage: '/images/piano-categories/upright.png',
    iconName: 'Home',
    colorTheme: {
      primary: '#059669', // Green - representing harmony and home use
      accent: '#047857',
      background: '#f0fdf4'
    },
    seoKeywords: [
      'kawai upright piano',
      'acoustic upright piano',
      'vertical piano',
      'home piano',
      'studio piano',
      'school piano',
      'space saving piano',
      'apartment piano'
    ],
    sortOrder: 4
  },

  shigeru: {
    slug: 'shigeru',
    name: 'Shigeru Kawai',
    fullName: 'Shigeru Kawai Concert Grand Pianos',
    description: 'The Shigeru Kawai piano represents the pinnacle of Japanese piano craftsmanship. Each instrument is handcrafted by Kawai\'s most skilled artisans in the Shigeru Kawai workshop, using only the finest materials — hand-selected Sitka spruce soundboards, premium European components, and meticulous voicing by master technicians. From the SK-2 to the legendary SK-EX concert grand, these instruments are trusted by the world\'s greatest pianists and performing arts centers.',
    shortDescription: 'Handcrafted concert grand pianos representing the ultimate in Japanese piano artistry',
    metaTitle: 'Shigeru Kawai Pianos - Handcrafted Concert Grand Pianos | Kawai',
    metaDescription: 'Discover the Shigeru Kawai collection — handcrafted concert grand pianos built by master artisans. From the SK-2 to the SK-EX concert grand, the pinnacle of piano craftsmanship.',
    keyFeatures: [
      'Hand-Selected Sitka Spruce Soundboards',
      'Master Artisan Construction',
      'Premium European Components',
      'Expert Voicing by Master Technicians',
      'Renner Action Components',
      'Concert Hall Trusted'
    ],
    priceRange: '$89,000 - $200,000+',
    defaultHeroImage: '/images/piano-categories/shigeru.jpg',
    iconName: 'Star',
    colorTheme: {
      primary: '#d5c78c', // Gold - representing luxury and prestige
      accent: '#b8a96e',
      background: '#fefdf7'
    },
    seoKeywords: [
      'shigeru kawai piano',
      'sk series piano',
      'concert grand piano',
      'handcrafted piano',
      'japanese concert grand',
      'sk-ex',
      'professional concert piano',
      'kawai flagship piano'
    ],
    sortOrder: 5
  }
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Validates if a given string is a valid piano category slug
 * @param slug - The slug to validate
 * @returns True if the slug is valid, false otherwise
 */
export function isValidCategory(slug: string): slug is PianoCategorySlug {
  return Object.keys(PIANO_CATEGORIES).includes(slug)
}

/**
 * Retrieves the configuration for a specific piano category
 * @param slug - The category slug
 * @returns The category configuration or null if not found
 */
export function getCategoryConfig(slug: string): CategoryConfig | null {
  if (!isValidCategory(slug)) {
    return null
  }
  return PIANO_CATEGORIES[slug]
}

/**
 * Gets all piano categories sorted by their display order
 * @returns Array of all category configurations sorted by sortOrder
 */
export function getAllCategories(): CategoryConfig[] {
  return Object.values(PIANO_CATEGORIES).sort((a, b) => a.sortOrder - b.sortOrder)
}

/**
 * Gets all valid category slugs as an array
 * @returns Array of all category slugs
 */
export function getCategorySlugs(): PianoCategorySlug[] {
  return Object.keys(PIANO_CATEGORIES) as PianoCategorySlug[]
}

/**
 * Finds categories that match a search term
 * @param searchTerm - Term to search for in category names and descriptions
 * @returns Array of matching category configurations
 */
export function searchCategories(searchTerm: string): CategoryConfig[] {
  const term = searchTerm.toLowerCase().trim()
  if (!term) return getAllCategories()

  return getAllCategories().filter(category =>
    category.name.toLowerCase().includes(term) ||
    category.description.toLowerCase().includes(term) ||
    category.keyFeatures.some(feature => feature.toLowerCase().includes(term)) ||
    category.seoKeywords.some(keyword => keyword.toLowerCase().includes(term))
  )
}

// =============================================================================
// CATEGORY-SPECIFIC UTILITY FUNCTIONS
// =============================================================================

/**
 * Generates dynamic hero titles for category pages
 * @param slug - The category slug
 * @returns Formatted hero title for the category page
 */
export function getCategoryHeroTitle(slug: string): string {
  const config = getCategoryConfig(slug)
  if (!config) return 'Piano Collection'

  switch (slug) {
    case 'digital':
      return 'Innovative Digital Piano Collection'
    case 'grand':
      return 'Handcrafted Grand Piano Masterpieces'
    case 'hybrid':
      return 'Revolutionary Hybrid Piano Technology'
    case 'upright':
      return 'Premium Upright Piano Collection'
    case 'shigeru':
      return 'The Art of the Shigeru Kawai'
    default:
      return `${config.name} Collection`
  }
}

/**
 * Gets the default hero image path for a category
 * @param slug - The category slug
 * @returns Path to the default hero image
 */
export function getCategoryHeroImage(slug: string): string {
  const config = getCategoryConfig(slug)
  return config?.defaultHeroImage || '/images/piano-categories/default-hero.jpg'
}

/**
 * Gets category statistics (placeholder for future implementation)
 * This can be extended to fetch real-time data from the CMS
 * @param slug - The category slug
 * @returns Category statistics object
 */
export function getCategoryStats(slug: string): CategoryStats {
  const config = getCategoryConfig(slug)
  if (!config) return {}

  // Placeholder data - in production, this would fetch from CMS/database
  const statsMap: Record<PianoCategorySlug, CategoryStats> = {
    digital: {
      totalModels: 12,
      priceRangeMin: 1999,
      priceRangeMax: 12999,
      popularModels: ['CA901', 'CA701', 'NV5S'],
      lastUpdated: new Date('2024-08-15')
    },
    grand: {
      totalModels: 8,
      priceRangeMin: 45000,
      priceRangeMax: 185000,
      popularModels: ['GX-7 BLAK', 'GX-5 BLAK', 'GX-3 BLAK'],
      lastUpdated: new Date('2024-08-15')
    },
    hybrid: {
      totalModels: 4,
      priceRangeMin: 12999,
      priceRangeMax: 24999,
      popularModels: ['NV-10S', 'NV-5S', 'AURES 2'],
      lastUpdated: new Date('2024-08-15')
    },
    upright: {
      totalModels: 15,
      priceRangeMin: 5999,
      priceRangeMax: 18999,
      popularModels: ['K-800AS', 'K-600', 'K-400'],
      lastUpdated: new Date('2024-08-15')
    },
    shigeru: {
      totalModels: 6,
      priceRangeMin: 89000,
      priceRangeMax: 200000,
      popularModels: ['SK-EX', 'SK-7', 'SK-5'],
      lastUpdated: new Date('2024-08-15')
    },
  }

  return statsMap[slug as PianoCategorySlug] || {}
}

/**
 * Generates SEO-friendly URL paths for category pages
 * @param slug - The category slug
 * @returns Formatted URL path
 */
export function getCategoryPath(slug: string): string {
  if (!isValidCategory(slug)) return '/pianos'
  return `/pianos/${slug}`
}

/**
 * Gets category-specific Call-to-Action text
 * @param slug - The category slug
 * @returns CTA text appropriate for the category
 */
export function getCategoryCTA(slug: string): string {
  const ctaMap: Record<PianoCategorySlug, string> = {
    digital: 'Explore Digital Innovation',
    grand: 'Discover Grand Excellence',
    hybrid: 'Experience Hybrid Technology',
    upright: 'Find Your Perfect Upright',
    shigeru: 'Experience Shigeru Kawai',
  }

  return ctaMap[slug as PianoCategorySlug] || 'Explore Collection'
}

/**
 * Gets category-specific breadcrumb data
 * @param slug - The category slug
 * @returns Breadcrumb configuration for category pages
 */
export function getCategoryBreadcrumbs(slug: string): Array<{ label: string; href: string }> {
  const config = getCategoryConfig(slug)
  if (!config) return [{ label: 'Pianos', href: '/pianos' }]

  return [
    { label: 'Home', href: '/' },
    { label: 'Pianos', href: '/pianos' },
    { label: config.name, href: getCategoryPath(slug) }
  ]
}

// =============================================================================
// CONSTANTS FOR BACKWARD COMPATIBILITY
// =============================================================================

/**
 * Array of all category slugs (for backward compatibility)
 * @deprecated Use getCategorySlugs() function instead
 */
export const CATEGORY_SLUGS = getCategorySlugs()

/**
 * Mapping of slugs to display names (for backward compatibility)
 * @deprecated Use getCategoryConfig() function instead
 */
export const CATEGORY_NAMES: Record<PianoCategorySlug, string> = {
  digital: PIANO_CATEGORIES.digital.name,
  grand: PIANO_CATEGORIES.grand.name,
  hybrid: PIANO_CATEGORIES.hybrid.name,
  upright: PIANO_CATEGORIES.upright.name,
  shigeru: PIANO_CATEGORIES.shigeru.name,
}

// =============================================================================
// EXPORT SUMMARY
// =============================================================================

/**
 * This module exports:
 *
 * TYPES:
 * - PianoCategorySlug: Union type of valid category slugs
 * - CategoryConfig: Complete configuration interface for categories
 * - CategoryStats: Statistics interface for category data
 *
 * CORE DATA:
 * - PIANO_CATEGORIES: Complete category configuration object
 *
 * VALIDATION & RETRIEVAL:
 * - isValidCategory(): Validates category slugs
 * - getCategoryConfig(): Gets category configuration
 * - getAllCategories(): Gets all categories sorted
 * - getCategorySlugs(): Gets all valid slugs
 * - searchCategories(): Searches categories by term
 *
 * CATEGORY-SPECIFIC UTILITIES:
 * - getCategoryHeroTitle(): Dynamic hero titles
 * - getCategoryHeroImage(): Default hero images
 * - getCategoryStats(): Category statistics
 * - getCategoryPath(): SEO-friendly URLs
 * - getCategoryCTA(): Category-specific CTAs
 * - getCategoryBreadcrumbs(): Breadcrumb navigation
 *
 * BACKWARD COMPATIBILITY:
 * - CATEGORY_SLUGS: Array of all slugs (deprecated)
 * - CATEGORY_NAMES: Slug to name mapping (deprecated)
 */
