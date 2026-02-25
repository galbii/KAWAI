import type { Media } from '@/payload-types'
import type { BlockTrackingConfig } from '@/lib/analytics/unified-tracking'

// HomePage Data Types
export interface HeroSectionData {
  locationText: string
  establishedText: string
  description: string
  primaryCta: {
    text: string
    link: string
  }
  secondaryCta: {
    text: string
    link: string
  }
  backgroundVideo?: Media | string | null
  tracking?: BlockTrackingConfig | undefined
}

export interface ShowroomFeature {
  icon: string
  title: string
  description: string
}

export interface ShowroomHours {
  day: string
  time: string
}

export interface ShowroomInfo {
  name: string
  address: string
  phone: string
  serviceArea: string
}

export interface ShowroomCtas {
  directionsText: string
  directionsLink: string
  scheduleText: string
  scheduleLink: string
}

export interface TrustBannerItem {
  text: string
}

export interface ShowroomSectionData {
  sectionHeader: string
  showroomTitle: string
  showroomDescription: string
  showroomInfo: ShowroomInfo
  hours: ShowroomHours[]
  features: ShowroomFeature[]
  mapApiKey?: string
  showroomCtas: ShowroomCtas
  trustBanner?: TrustBannerItem[]
}

export interface FeaturedVideo {
  youtubeId?: string
  width?: number
  height?: number
}

export interface PianoCollectionSectionData {
  collectionSectionHeader: string
  collectionTitle: string
  collectionDescription: string
  collectionCta: {
    text: string
    link: string
  }
  featuredVideo: FeaturedVideo
}

export interface PianoCategory {
  model: string
  title: string
  description: string
  image?: Media | string | null
  href: string
}

export interface PianoGallerySectionData {
  galleryTitle: string
  galleryDescription: string
  pianoCategories: PianoCategory[]
}

export interface NewsItem {
  title: string
  description: string
  image?: Media | string | null
  category: string
  link?: string
  ctaText?: string

  // Multi-media support
  images?: (Media | string)[] | null // Multiple images for carousel display
  videoUrl?: string | null // YouTube URL or direct MP4 URL
  videoSource?: 'youtube' | 'direct' | null // Type of video embed
}

export interface NewsCarouselSectionData {
  autoPlayDuration: number
  newsItems: NewsItem[]
}

export interface ContactBenefit {
  icon: string
  text: string
}

export interface FormStep {
  step: string
}

export interface FormOption {
  level?: string
  type?: string
  range?: string
  use?: string
}

export interface FormOptions {
  experienceLevels: { level: string }[]
  pianoTypes: { type: string }[]
  budgetRanges: { range: string }[]
  primaryUses: { use: string }[]
}

export interface ContactFormSectionData {
  contactTitle: string
  contactTitleHighlight: string
  contactDescription: string
  stepTitles: FormStep[]
  trustMessage: string
  benefits: ContactBenefit[]
  formOptions: FormOptions
}

export interface SEOData {
  metaTitle?: string
  metaDescription?: string
  keywords?: string
  openGraphTitle?: string
  openGraphDescription?: string
  openGraphImage?: Media | string | null
}

export interface HomePageData {
  content?: any[] // NEW: Blocks-based content
  heroSection: HeroSectionData
  showroomSection: ShowroomSectionData
  pianoCollectionSection: PianoCollectionSectionData
  pianoGallerySection: PianoGallerySectionData
  newsCarouselSection: NewsCarouselSectionData
  contactFormSection: ContactFormSectionData
  seo: SEOData
}

// Component Props Types
export interface HeroProps {
  data?: HeroSectionData
  storefrontName?: string | undefined // Optional storefront name for SEO H1
}

export interface ShowroomLocationProps {
  data?: ShowroomSectionData
}

export interface PianoCollectionProps {
  data?: PianoCollectionSectionData
}

export interface PianoGalleryProps {
  data?: PianoGallerySectionData
}

export interface NewsCarouselProps {
  data?: NewsCarouselSectionData
}

export interface ContactFormProps {
  data?: ContactFormSectionData
}

// Fallback data constants
export const DEFAULT_HERO_DATA: HeroSectionData = {
  locationText: "St. Louis's Premier Kawai Piano Gallery",
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

export const DEFAULT_SHOWROOM_DATA: ShowroomSectionData = {
  sectionHeader: "Our Showroom",
  showroomTitle: "Visit Our Lake St. Louis",
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
  },
  trustBanner: [
    { text: '95+ Years Experience' },
    { text: 'Certified Kawai Specialists' },
    { text: "Missouri's Trusted Dealer" }
  ]
}

export const DEFAULT_PIANO_COLLECTION_DATA: PianoCollectionSectionData = {
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

export const DEFAULT_PIANO_GALLERY_DATA: PianoGallerySectionData = {
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

export const DEFAULT_NEWS_CAROUSEL_DATA: NewsCarouselSectionData = {
  autoPlayDuration: 7000,
  newsItems: [
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

export const DEFAULT_CONTACT_FORM_DATA: ContactFormSectionData = {
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

export const DEFAULT_SEO_DATA: SEOData = {
  metaTitle: "Kawai Piano Gallery St. Louis | Premier Piano Gallery Since 1927 | Lake St. Louis",
  metaDescription: "St. Louis's premier Kawai piano dealer since 1927. Explore acoustic & digital pianos at our Lake St. Louis showroom. Expert consultation & service.",
  keywords: "Kawai pianos, St. Louis piano dealer, Lake St. Louis piano store, acoustic pianos, digital pianos, piano showroom, Missouri piano dealer, piano sales, piano service"
}