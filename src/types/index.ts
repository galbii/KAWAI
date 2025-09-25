// Main type exports hub for KAWAI Piano Website
// This file centralizes all type exports for easy importing throughout the application

// Re-export Payload CMS generated types
export type {
  // Core CMS Types
  Config,
  User,
  Media,

  // Content Types
  Product,
  Productline,
  PianoModel,
  HomePage,
  PianosPage,
  DealerLocation,
  LandingPage,
  ConsultationBooking,
  ConstantContactSetting,

  // Block Types
  ProductShowcaseBlock,
  ProductHeroBlock,
  HeroBlock,
  TextContentBlock,
  ImageGalleryBlock,
  FeaturesListBlock,
  SpecificationsBlock,
  CallToActionBlock,
  TestimonialsBlock,
  HelloBlock,
  LandingHeroBlock,
  LandingFeaturesBlock,
  LandingTestimonialsBlock,
} from '@/payload-types'

// Re-export common types
export * from './common'

// Re-export domain types
export * from './domains'

// Re-export integration types
export * from './integrations'

// Type utilities and helpers
export * from './common/utils'