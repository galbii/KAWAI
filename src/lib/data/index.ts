/**
 * Data and Seed Files
 *
 * This barrel export provides all data, seed utilities, and fallback data
 * for the KAWAI Piano website from a single import.
 *
 * Usage:
 *   import { PIANO_CATEGORIES, getCategoryFallbackData, pianoPageSeedData } from '@/lib/data'
 *
 * Files:
 *   - categories.ts: Piano category definitions and utilities
 *   - fallback-data.ts: Comprehensive fallback data for when CMS is unavailable
 *   - default-productlines.ts: Default product lines for seeding
 *   - pianos-page-seed-data.ts: Seed data for PianosPage collection
 *   - seed-image-utils.ts: Image upload utilities for seeding
 */

// Categories - type definitions and utilities
export {
  // Types
  type PianoCategorySlug,
  type CategoryConfig,
  type CategoryStats,

  // Core data
  PIANO_CATEGORIES,

  // Validation & retrieval
  isValidCategory,
  getCategoryConfig,
  getAllCategories,
  getCategorySlugs,
  searchCategories,

  // Category-specific utilities
  getCategoryHeroTitle,
  getCategoryHeroImage,
  getCategoryStats,
  getCategoryPath,
  getCategoryCTA,
  getCategoryBreadcrumbs,

  // Backward compatibility (deprecated)
  CATEGORY_SLUGS,
  CATEGORY_NAMES,
} from './categories'

// Fallback data
export {
  // Types
  type FallbackPiano,
  type FallbackSeries,
  type CategoryFallbackData,

  // Data retrieval
  getCategoryFallbackData,
  getCategorySeriesFallback,
  getCategoryFeaturedPianosFallback,
  getCategoryModelCount,

  // Utilities
  searchFallbackPianos,
  getAvailableFallbackCategories,
  getFallbackDataStats,
} from './fallback-data'

// Pianos page seed data
export {
  pianoPageImages,
  pianoPageSeedData,
  resolveImagePath,
  imageExists,
  getAllImagePaths,
} from './pianos-page-seed-data'

// Seed image utilities
export {
  uploadImageToMedia,
  uploadAllPianoPageImages,
  getOrCreateFallbackImage,
  validateImages,
} from './seed-image-utils'
