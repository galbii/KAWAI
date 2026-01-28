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
  HomePage,
  PianosPage,
  Storefront,
  ConstantContactSetting,

  // Block Types
  ProductShowcaseBlock,
  ProductHeroBlock,
  MarketingHeroBlock,
  TextContentBlock,
  ProductImageGalleryBlock,
  ProductFeaturesListBlock,
  ProductSpecificationsBlock,
  MarketingCallToActionBlock,
  MarketingTestimonialsBlock,
  HelloBlock,
  ContentTextBlock,
  ContentImageBlock,
  ContentVideoBlock,
  ContentCodeBlock,
  ContentBannerBlock,
  LayoutColumnsBlock,
  LayoutSpacerBlock,
  LayoutDividerBlock,
} from '@/payload-types'

// Re-export common types
export * from './common'

// Re-export domain types
export * from './domains'

// Re-export integration types
export * from './integrations'

// Type utilities and helpers
export * from './common/utils'