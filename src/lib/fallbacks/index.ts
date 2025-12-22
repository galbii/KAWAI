/**
 * Centralized Fallback Data System
 *
 * This file contains comprehensive fallback data patterns to ensure
 * the application works gracefully without CMS data available.
 *
 * Architecture: CMS-enhanced, not CMS-dependent
 */

import type { Media } from '@/payload-types'
import type {
  HomePageData,
  HeroSectionData,
  ShowroomSectionData,
  PianoCollectionSectionData,
  PianoGallerySectionData,
  NewsCarouselSectionData,
  ContactFormSectionData,
  SEOData,
  PianoCategory
} from '@/lib/types/homepage'

// =============================================================================
// CORE FALLBACK UTILITIES
// =============================================================================

/**
 * Safely fallback to default data when CMS data is unavailable
 * @param cmsData - Data from CMS (could be null/undefined)
 * @param fallbackData - Default fallback data
 * @returns CMS data if available, otherwise fallback data
 */
export function withFallback<T>(cmsData: T | null | undefined, fallbackData: T): T {
  return cmsData ?? fallbackData
}

/**
 * Deep merge CMS data with fallback data, preserving CMS values where available
 * @param cmsData - Partial data from CMS
 * @param fallbackData - Complete fallback data
 * @returns Merged data with CMS values taking priority
 */
export function mergeWithFallback<T extends Record<string, any>>(
  cmsData: Partial<T> | null | undefined,
  fallbackData: T
): T {
  if (!cmsData) return fallbackData

  return {
    ...fallbackData,
    ...cmsData,
    // Handle nested objects recursively
    ...Object.keys(fallbackData).reduce((acc, key) => {
      const cmsValue = cmsData[key]
      const fallbackValue = fallbackData[key]

      if (cmsValue && typeof cmsValue === 'object' && !Array.isArray(cmsValue) &&
          fallbackValue && typeof fallbackValue === 'object' && !Array.isArray(fallbackValue)) {
        acc[key] = mergeWithFallback(cmsValue, fallbackValue)
      }

      return acc
    }, {} as any)
  }
}

/**
 * Validate and provide fallback for arrays
 * @param cmsArray - Array from CMS
 * @param fallbackArray - Fallback array
 * @param minLength - Minimum required length (default: 1)
 * @returns Valid array or fallback
 */
export function withArrayFallback<T>(
  cmsArray: T[] | null | undefined,
  fallbackArray: T[],
  minLength: number = 1
): T[] {
  if (Array.isArray(cmsArray) && cmsArray.length >= minLength) {
    return cmsArray
  }
  return fallbackArray
}

/**
 * Safely get media URL with fallback
 * @param media - Media object or string URL
 * @param fallbackUrl - Fallback image URL
 * @returns Valid image URL
 */
export function getMediaWithFallback(
  media: Media | string | null | undefined,
  fallbackUrl: string
): string {
  if (typeof media === 'string') {
    return media || fallbackUrl
  }

  if (media && typeof media === 'object' && media.url) {
    return media.url
  }

  return fallbackUrl
}

// =============================================================================
// HOMEPAGE FALLBACK DATA
// =============================================================================

export const FALLBACK_HERO_DATA: HeroSectionData = {
  locationText: "St. Louis's Premier Kawai Piano Dealer",
  establishedText: "Est. 1927 • Lake St. Louis, Missouri",
  description: "Every musician harbors a vision. Every performance seeks perfection. Since 1927, we've been crafting the instruments that transform inspiration into reality. Visit our Lake St. Louis showroom and discover why we're Missouri's trusted Kawai piano experts.",
  primaryCta: {
    text: "View Our Piano Collection",
    link: "/pianos"
  },
  secondaryCta: {
    text: "Visit Our St. Louis Showroom",
    link: "/contact"
  },
  backgroundVideo: null
}

export const FALLBACK_SHOWROOM_DATA: ShowroomSectionData = {
  sectionHeader: "Our Showroom",
  showroomTitle: "Visit Our Lake St. Louis Location",
  showroomDescription: "Experience the artistry of Kawai pianos in Missouri's premier showroom. From intimate consultations to comprehensive piano services, discover why discerning musicians choose our Lake St. Louis location.",
  showroomInfo: {
    name: "Kawai Piano Gallery St. Louis",
    address: "21 Meadows Circle Drive, Suite 312, Lake St. Louis, MO 63367",
    phone: "636-265-2866",
    serviceArea: "Serving St. Louis, St. Charles County, O'Fallon, Wentzville & surrounding Missouri areas"
  },
  hours: [
    { day: 'Monday', time: '10:00 am–7:00 pm' },
    { day: 'Tuesday', time: '10:00 am–7:00 pm' },
    { day: 'Wednesday', time: '10:00 am–7:00 pm' },
    { day: 'Thursday', time: '10:00 am–7:00 pm' },
    { day: 'Friday', time: '10:00 am–7:00 pm' },
    { day: 'Saturday', time: '10:00 am–6:00 pm' },
    { day: 'Sunday', time: '1:00 pm–5:00 pm' }
  ],
  features: [
    { icon: 'award', title: 'Expert Consultation', description: 'Personalized guidance from certified Kawai specialists' },
    { icon: 'piano', title: 'Full Service Center', description: 'Tuning, repair, and maintenance by certified technicians' },
    { icon: 'shield', title: 'Financing Available', description: 'Flexible payment options to make your piano dreams accessible' }
  ],
  showroomCtas: {
    directionsText: "Get Directions",
    directionsLink: "https://maps.google.com/?q=Lake+St.+Louis+MO",
    scheduleText: "Schedule Visit",
    scheduleLink: "/contact/schedule-visit"
  }
}

export const FALLBACK_PIANO_COLLECTION_DATA: PianoCollectionSectionData = {
  collectionSectionHeader: "Featured Models",
  collectionTitle: "Kawai K-500 &\nGX2 Limited Edition",
  collectionDescription: "Discover the exceptional craftsmanship and innovation that defines our most sought-after instruments",
  collectionCta: {
    text: "Explore Collection",
    link: "/pianos"
  },
  featuredVideo: {
    youtubeId: "1cmwb6evs2A",
    width: 800,
    height: 500
  }
}

export const FALLBACK_PIANO_GALLERY_DATA: PianoGallerySectionData = {
  galleryTitle: "Explore Our Piano Collection",
  galleryDescription: "Discover the full range of Kawai pianos, from handcrafted grand pianos to innovative digital and hybrid instruments. Each piano represents our commitment to exceptional craftsmanship and musical excellence.",
  pianoCategories: [
    {
      model: 'Grand',
      title: 'Grand Pianos',
      description: 'Professional acoustic grand pianos for concert halls, studios, and discerning homes. Experience the ultimate in touch, tone, and musical expression with instruments trusted by professional musicians worldwide.',
      image: '/images/piano-categories/grand.jpg',
      href: '/pianos/grand'
    },
    {
      model: 'Digital',
      title: 'Digital Pianos',
      description: 'Advanced digital pianos featuring realistic wooden-key actions and premium sound systems. Combining authentic acoustic piano experience with modern technology and convenient features for today\'s musicians.',
      image: '/images/piano-categories/digital.png',
      href: '/pianos/digital'
    },
    {
      model: 'Upright',
      title: 'Upright Pianos',
      description: 'Space-efficient acoustic pianos delivering exceptional touch and tone quality. Perfect for homes, studios, schools, and institutions where space is at a premium but musical excellence cannot be compromised.',
      image: '/images/piano-categories/upright.png',
      href: '/pianos/upright'
    },
    {
      model: 'Hybrid',
      title: 'Hybrid Pianos',
      description: 'Revolutionary instruments combining real grand piano actions with advanced digital sound technology. Experience the authentic touch of acoustic keys with the versatility and innovation of digital sound.',
      image: '/images/piano-categories/hybrid.jpg',
      href: '/pianos/hybrid'
    }
  ]
}

export const FALLBACK_NEWS_CAROUSEL_DATA: NewsCarouselSectionData = {
  autoPlayDuration: 7000,
  newsItems: [
    {
      title: 'Visit Kawai at NAMM 2026',
      description: 'Experience exclusive piano innovations, live artist performances, and hands-on demonstrations at our booth in Anaheim Convention Center',
      image: '/images/namm/general/TK7_7390.jpg', // Placeholder - uses scrolling background instead
      category: 'namm-event', // Special category triggers custom NAMM slide
      link: '/namm-2026'
    },
    {
      title: 'Instrumental to Life',
      description: 'Redefining harmony between tradition and innovation',
      image: '/images/banners/I2LNew-banner.jpg',
      category: 'news',
      link: '/about/instrumental-to-life'
    },
    {
      title: 'Kawai Piano Gallery',
      description: 'Explore our complete collection of acoustic and digital pianos',
      image: '/images/piano-categories/grand-pianos.jpg',
      category: 'news',
      link: '/pianos'
    },
    {
      title: 'Special Financing Offers',
      description: 'Make your dream piano more accessible with flexible payment options',
      image: '/images/banners/Rebate-banner-for-news.jpg',
      category: 'promotions',
      link: '/financing'
    }
  ]
}

export const FALLBACK_CONTACT_FORM_DATA: ContactFormSectionData = {
  contactTitle: "Find Your Perfect",
  contactTitleHighlight: "Piano",
  contactDescription: "Get your free Piano Buying Guide and personalized recommendations from our Lake St. Louis piano experts. Serving the St. Louis area for over 95 years.",
  stepTitles: [
    { step: 'Tell us about your piano journey' },
    { step: 'Help us understand your needs' },
    { step: 'Get your free piano buying guide' }
  ],
  trustMessage: "Trusted by St. Louis area piano families since 1927",
  benefits: [
    { icon: 'shield-check', text: 'Free comprehensive Piano Buying Guide (PDF)' },
    { icon: 'users', text: 'Personalized piano recommendations' },
    { icon: 'award', text: 'Exclusive offers and updates' }
  ],
  formOptions: {
    experienceLevels: [
      { level: 'Beginner' },
      { level: 'Intermediate' },
      { level: 'Advanced' },
      { level: 'Professional' }
    ],
    pianoTypes: [
      { type: 'Acoustic Grand' },
      { type: 'Acoustic Upright' },
      { type: 'Digital Piano' },
      { type: 'Hybrid Piano' },
      { type: 'Not Sure' }
    ],
    budgetRanges: [
      { range: 'Under $5,000' },
      { range: '$5,000 - $15,000' },
      { range: '$15,000 - $35,000' },
      { range: '$35,000 - $75,000' },
      { range: '$75,000+' }
    ],
    primaryUses: [
      { use: 'Learning/Practice' },
      { use: 'Family Entertainment' },
      { use: 'Teaching' },
      { use: 'Performance' },
      { use: 'Recording/Studio' }
    ]
  }
}

export const FALLBACK_SEO_DATA: SEOData = {
  metaTitle: "Kawai Pianos St. Louis | Premier Piano Dealer Since 1927 | Lake St. Louis",
  metaDescription: "St. Louis's premier Kawai piano dealer since 1927. Explore acoustic & digital pianos at our Lake St. Louis showroom. Expert consultation & service.",
  keywords: "Kawai pianos, St. Louis piano dealer, Lake St. Louis piano store, acoustic pianos, digital pianos, piano showroom, Missouri piano dealer, piano sales, piano service"
}

export const FALLBACK_HOMEPAGE_DATA: HomePageData = {
  heroSection: FALLBACK_HERO_DATA,
  showroomSection: FALLBACK_SHOWROOM_DATA,
  pianoCollectionSection: FALLBACK_PIANO_COLLECTION_DATA,
  pianoGallerySection: FALLBACK_PIANO_GALLERY_DATA,
  newsCarouselSection: FALLBACK_NEWS_CAROUSEL_DATA,
  contactFormSection: FALLBACK_CONTACT_FORM_DATA,
  seo: FALLBACK_SEO_DATA
}

// =============================================================================
// PIANO PAGES FALLBACK DATA
// =============================================================================

export const FALLBACK_PIANO_CATEGORIES = [
  {
    slug: "grand",
    name: "Acoustic Grand Pianos",
    description: "Professional grand pianos featuring advanced technology and superior craftsmanship",
    image: "/images/piano-categories/grand.jpg",
    priceRange: "$45,000 - $185,000",
    features: [
      { feature: "Millennium III Action" },
      { feature: "Carbon Fiber Components" },
      { feature: "Neotex Key Surface" },
      { feature: "Konami Tuning Pins" }
    ],
    icon: "piano",
    badge: "Professional",
    highlight: "GX BLAK Performance Series"
  },
  {
    slug: "upright",
    name: "Acoustic Upright Pianos",
    description: "Space-efficient acoustic pianos delivering exceptional touch and tone",
    image: "/images/piano-categories/upright.png",
    priceRange: "$8,999 - $35,000",
    features: [
      { feature: "Extended Length Keys" },
      { feature: "Millennium III Prep" },
      { feature: "Soft-Close Fallboard" },
      { feature: "Premium Hammers" }
    ],
    icon: "music",
    badge: "Classic",
    highlight: "K Professional Series"
  },
  {
    slug: "digital",
    name: "Digital Pianos",
    description: "Cutting-edge digital instruments with authentic piano touch and sound",
    image: "/images/piano-categories/digital.png",
    priceRange: "$1,999 - $12,999",
    features: [
      { feature: "Grand Feel III Action" },
      { feature: "Harmonic Imaging XL" },
      { feature: "Onkyo Audio" },
      { feature: "Bluetooth Connectivity" }
    ],
    icon: "zap",
    badge: "Innovation",
    highlight: "Concert Artist Series"
  },
  {
    slug: "hybrid",
    name: "Hybrid Pianos",
    description: "Revolutionary instruments combining acoustic action with digital versatility",
    image: "/images/piano-categories/hybrid.jpg",
    priceRange: "$12,999 - $24,999",
    features: [
      { feature: "Real Grand Action" },
      { feature: "Silent Practice Mode" },
      { feature: "Digital Recording" },
      { feature: "Millennium III Action" }
    ],
    icon: "award",
    badge: "Hybrid Technology",
    highlight: "NOVUS & AnyTime Series"
  }
]

export const FALLBACK_FEATURED_MODELS = [
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

export const FALLBACK_PIANO_PAGE_DATA = {
  hero: {
    heroTitle: "Experience the Complete Kawai Piano Collection",
    heroDescription: "From the legendary Shigeru Kawai concert grands used in international competitions to innovative digital and hybrid instruments, discover the piano that will inspire your musical journey.",
    heroBackgroundImage: "/images/piano-categories/NV10S_along%20the%20keyboard_whiteBG.jpg",
    heroCta: {
      text: "Explore Categories",
      link: "#categories"
    }
  },
  categories: FALLBACK_PIANO_CATEGORIES,
  featuredModels: FALLBACK_FEATURED_MODELS,
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

// =============================================================================
// PRODUCT PAGES FALLBACK DATA
// =============================================================================

export const FALLBACK_PRODUCT_DATA = {
  name: "Kawai Piano",
  description: "Experience exceptional craftsmanship and innovation in every note.",
  image: "/images/piano-categories/digital.png",
  price: "Contact for pricing",
  keyFeatures: [
    "Superior touch and tone",
    "Professional quality construction",
    "Advanced technology integration",
    "Exceptional value"
  ],
  specifications: {
    "Dimensions": "Contact for details",
    "Weight": "Contact for details",
    "Finish": "Multiple finishes available",
    "Warranty": "Comprehensive warranty included"
  }
}

// =============================================================================
// DEALER LOCATION FALLBACK DATA
// =============================================================================

export const FALLBACK_DEALER_LOCATIONS = [
  {
    id: "st-louis",
    name: "Kawai Piano Gallery St. Louis",
    slug: "st-louis",
    address: "21 Meadows Circle Drive, Suite 312, Lake St. Louis, MO 63367",
    phone: "636-265-2866",
    email: "info@kawaistlouis.com",
    website: "https://kawaistlouis.com",
    serviceArea: "Serving St. Louis, St. Charles County, O'Fallon, Wentzville & surrounding Missouri areas",
    hours: [
      { day: 'Monday', time: '10:00 am–7:00 pm' },
      { day: 'Tuesday', time: '10:00 am–7:00 pm' },
      { day: 'Wednesday', time: '10:00 am–7:00 pm' },
      { day: 'Thursday', time: '10:00 am–7:00 pm' },
      { day: 'Friday', time: '10:00 am–7:00 pm' },
      { day: 'Saturday', time: '10:00 am–6:00 pm' },
      { day: 'Sunday', time: '1:00 pm–5:00 pm' }
    ],
    services: [
      "New Piano Sales",
      "Piano Tuning & Repair",
      "Piano Moving",
      "Piano Rental",
      "Trade-In Programs",
      "Financing Options"
    ],
    image: "/images/showroom/lake-st-louis-showroom.jpg",
    description: "Missouri's premier Kawai piano destination since 1927"
  }
]

// =============================================================================
// NAVIGATION FALLBACK DATA
// =============================================================================

export const FALLBACK_NAVIGATION_DATA = {
  mainNav: [
    { label: "Pianos", href: "/pianos", hasSubmenu: true },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Contact", href: "/contact" }
  ],
  pianoSubmenu: [
    { label: "Grand Pianos", href: "/pianos/grand" },
    { label: "Upright Pianos", href: "/pianos/upright" },
    { label: "Digital Pianos", href: "/pianos/digital" },
    { label: "Hybrid Pianos", href: "/pianos/hybrid" }
  ],
  footerNav: {
    company: [
      { label: "About Us", href: "/about" },
      { label: "Our History", href: "/about/history" },
      { label: "Showroom", href: "/contact" }
    ],
    products: [
      { label: "Grand Pianos", href: "/pianos/grand" },
      { label: "Digital Pianos", href: "/pianos/digital" },
      { label: "Hybrid Pianos", href: "/pianos/hybrid" },
      { label: "Upright Pianos", href: "/pianos/upright" }
    ],
    services: [
      { label: "Piano Tuning", href: "/services/tuning" },
      { label: "Piano Repair", href: "/services/repair" },
      { label: "Piano Moving", href: "/services/moving" },
      { label: "Financing", href: "/financing" }
    ],
    support: [
      { label: "Contact Us", href: "/contact" },
      { label: "Schedule Service", href: "/contact/service" },
      { label: "Piano Finder", href: "/piano-finder" },
      { label: "Resources", href: "/resources" }
    ]
  }
}

// =============================================================================
// ERROR AND EMPTY STATE FALLBACKS
// =============================================================================

export const FALLBACK_ERROR_MESSAGES = {
  general: "We're experiencing technical difficulties. Please try again later.",
  notFound: "The page you're looking for could not be found.",
  pianoNotFound: "This piano model is currently unavailable. Please contact us for similar options.",
  cmsUnavailable: "Content is temporarily unavailable. Our core functionality remains accessible.",
  imageLoadError: "Image temporarily unavailable",
  videoLoadError: "Video content temporarily unavailable"
}

export const FALLBACK_EMPTY_STATES = {
  noPianos: {
    title: "No pianos available",
    description: "Please contact our showroom for current inventory and availability.",
    cta: { text: "Contact Us", link: "/contact" }
  },
  noResults: {
    title: "No results found",
    description: "Try adjusting your search criteria or browse our complete collection.",
    cta: { text: "View All Pianos", link: "/pianos" }
  },
  loading: {
    title: "Loading piano collection...",
    description: "Please wait while we fetch the latest information."
  }
}

// =============================================================================
// UTILITY FUNCTIONS FOR COMPONENT INTEGRATION
// =============================================================================

/**
 * Get homepage data with comprehensive fallbacks
 * @param cmsData - Data from CMS
 * @returns Complete homepage data
 */
export function getHomePageDataWithFallbacks(cmsData: any): HomePageData {
  return mergeWithFallback(cmsData, FALLBACK_HOMEPAGE_DATA)
}

/**
 * Get piano page data with fallbacks
 * @param cmsData - Data from CMS
 * @returns Complete piano page data
 */
export function getPianoPageDataWithFallbacks(cmsData: any) {
  return mergeWithFallback(cmsData, FALLBACK_PIANO_PAGE_DATA)
}

/**
 * Get piano categories with fallbacks
 * @param cmsCategories - Categories from CMS
 * @returns Valid categories array
 */
export function getPianoCategoriesWithFallbacks(cmsCategories: any[]) {
  return withArrayFallback(cmsCategories, FALLBACK_PIANO_CATEGORIES)
}

/**
 * Get featured models with fallbacks
 * @param cmsFeatured - Featured models from CMS
 * @returns Valid featured models array
 */
export function getFeaturedModelsWithFallbacks(cmsFeatured: any[]) {
  return withArrayFallback(cmsFeatured, FALLBACK_FEATURED_MODELS)
}

/**
 * Get dealer locations with fallbacks
 * @param cmsLocations - Locations from CMS
 * @returns Valid locations array
 */
export function getDealerLocationsWithFallbacks(cmsLocations: any[]) {
  return withArrayFallback(cmsLocations, FALLBACK_DEALER_LOCATIONS)
}