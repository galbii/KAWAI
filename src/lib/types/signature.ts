import type { Media } from '@/payload-types'

export interface SignatureHeroSection {
  // Hero content
  exclusiveText?: string
  titlePrefix?: string
  titleMain: string
  titleSuffix?: string
  subtitle?: string
  description?: string
  
  // Media
  heroBackgroundImage?: Media | string | null
  heroBackgroundVideo?: Media | string | null
  
  // CTA buttons
  primaryCta?: {
    text: string
    link?: string
    action?: 'scroll' | 'link' | 'modal'
  }
  secondaryCta?: {
    text: string
    link?: string
    action?: 'scroll' | 'link' | 'modal'
  }
  
  // Design options
  overlayOpacity?: number
  textAlignment?: 'left' | 'center' | 'right'
  showScrollIndicator?: boolean
}

export interface SignatureCollectionSection {
  sectionTitle: string
  sectionSubtitle?: string
  description?: string
  
  // Featured pianos
  featuredPianos: Array<{
    id?: string
    name: string
    model: string
    series?: string
    description?: string
    image: Media | string
    keyFeatures?: string[]
    specifications?: Record<string, string>
    pricing?: {
      contactForPricing?: boolean
      priceText?: string
      consultationRequired?: boolean
    }
    availability?: {
      status: 'available' | 'limited' | 'by-order' | 'exclusive'
      exclusiveDetails?: string
    }
  }>
  
  // Display options
  layout?: 'gallery' | 'showcase' | 'carousel'
  showPricing?: boolean
  emphasizeExclusivity?: boolean
}

export interface SignatureHeritageSection {
  sectionTitle: string
  sectionSubtitle?: string
  
  // Heritage story
  heritageStory?: string
  
  // Heritage highlights
  highlights: Array<{
    id?: string
    title: string
    description: string
    year?: string
    image?: Media | string
    icon?: string
  }>
  
  // Media
  heritageImage?: Media | string
  heritageVideo?: Media | string
  
  // Stats/achievements
  achievements?: Array<{
    number: string
    label: string
    description?: string
  }>
}

export interface SignatureConsultationSection {
  sectionTitle: string
  sectionSubtitle?: string
  description?: string
  
  // Consultation process
  consultationSteps: Array<{
    id?: string
    step: number
    title: string
    description: string
    icon?: string
    duration?: string
  }>
  
  // Benefits
  benefits: Array<{
    id?: string
    title: string
    description: string
    icon?: string
  }>
  
  // CTA
  consultationCta: {
    text: string
    link?: string
    action?: 'form' | 'calendar' | 'phone' | 'email'
    contactInfo?: {
      phone?: string
      email?: string
      calendlyUrl?: string
    }
  }
  
  // Design
  backgroundImage?: Media | string
  emphasizePrivacy?: boolean
  showTestimonials?: boolean
}

export interface SignatureTestimonialsSection {
  sectionTitle?: string
  sectionSubtitle?: string
  
  testimonials: Array<{
    id?: string
    quote: string
    author: {
      name: string
      title?: string
      location?: string
      image?: Media | string
    }
    rating?: number
    pianoModel?: string
    verified?: boolean
  }>
  
  // Display options
  layout?: 'carousel' | 'grid' | 'featured'
  showRatings?: boolean
  autoplay?: boolean
}

export interface SignaturePageData {
  // Page meta
  slug: string
  title: string
  isActive?: boolean
  
  // Page sections
  heroSection: SignatureHeroSection
  collectionSection?: SignatureCollectionSection
  heritageSection?: SignatureHeritageSection
  consultationSection?: SignatureConsultationSection
  testimonialsSection?: SignatureTestimonialsSection
  
  // SEO
  seo?: {
    metaTitle?: string
    metaDescription?: string
    keywords?: string
    openGraphTitle?: string
    openGraphDescription?: string
    openGraphImage?: Media | string
    noIndex?: boolean
  }
  
  // Settings
  settings?: {
    enableSmoothScrolling?: boolean
    showContactInfo?: boolean
    restrictAccess?: boolean
    invitationCode?: string
  }
}

// Additional utility types
export interface SignaturePageProps {
  params: Promise<{ storeslug: string }>
}

export interface SignatureCTAButton {
  text: string
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  action?: 'scroll' | 'link' | 'modal' | 'phone' | 'email'
  href?: string
  targetElement?: string
  icon?: string
  className?: string
}

export interface SignatureAnimationConfig {
  initial?: Record<string, any>
  animate?: Record<string, any>
  exit?: Record<string, any>
  transition?: Record<string, any>
  viewport?: {
    once?: boolean
    margin?: string
    amount?: number | 'some' | 'all'
  }
}