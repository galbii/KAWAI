/**
 * Library Utilities
 *
 * Main barrel export for all library utilities in the KAWAI Piano website.
 * Provides centralized access to Payload CMS, Shopify, media, SEO, and more.
 *
 * Note: Due to naming conflicts between modules (e.g., getProducts exists in both
 * Payload and Shopify), this barrel export only includes core utilities and
 * non-conflicting re-exports. For module-specific imports, use the direct paths:
 *
 * @example Basic Usage
 * ```tsx
 * import { cn, formatPrice, formatDate } from '@/lib'
 *
 * const className = cn('base-class', isActive && 'active')
 * const price = formatPrice(1999) // "$1,999"
 * const date = formatDate(new Date()) // "January 14, 2026"
 * ```
 *
 * @example Module-Specific Imports (Recommended)
 * ```tsx
 * // Payload CMS utilities (for CMS data)
 * import { getProducts, getProductBySlug } from '@/lib/payload'
 *
 * // Shopify integration (for e-commerce)
 * import { getProducts as getShopifyProducts, getCart, addToCart } from '@/lib/shopify'
 *
 * // Media optimization
 * import { generateR2ImageUrl, getOptimizedImageProps } from '@/lib/media'
 *
 * // SEO utilities
 * import { generatePianoSEO, organizationSchema } from '@/lib/seo'
 *
 * // Data utilities
 * import { PIANO_CATEGORIES, getCategoryFallbackData } from '@/lib/data'
 *
 * // Constant Contact
 * import { ConstantContactClient, createConstantContactAuth } from '@/lib/constantcontact'
 * ```
 */

// ============================================================================
// Core Utilities (from utils.ts)
// ============================================================================

export {
  // CSS class utilities
  cn,

  // Formatting utilities
  formatPrice,
  formatDate,
  slugify,
  generateExcerpt,

  // Piano-specific utilities
  formatPianoModel,
  formatDimensions,
  formatWeight,
  calculatePriceRange,
  formatPriceRange,
  getPianoTypeLabel,
  getSeriesLabel,

  // Filter & Sort utilities
  filterPianosBySpecs,
  sortPianos,

  // Comparison & Search utilities
  generateComparisonData,
  generatePianoSearchIndex,
  searchPianos,
  getPopularSearchTerms,

  // Audio utilities
  formatAudioDuration,

  // SEO utilities (basic)
  generateSEOTitle,
  generateSEODescription,
  generateSEOKeywords
} from './utils'

// ============================================================================
// Non-Conflicting Module Re-exports
// ============================================================================

// Data, categories, and seed utilities (no conflicts)
export * from './data'

// Media optimization (R2, hooks, types, legacy) (no conflicts)
export * from './media'

// SEO utilities (schemas, structured data, generation) (no conflicts)
export * from './seo'

// ============================================================================
// Conflicting Modules - Import directly from submodules
// ============================================================================
// The following modules have naming conflicts and should be imported directly:
//
// Payload CMS: import { ... } from '@/lib/payload'
//   - getProducts, getProductBySlug, etc. (CMS data)
//
// Shopify: import { ... } from '@/lib/shopify'
//   - getProducts, getProductByHandle, cart functions, etc. (e-commerce)
//
// Constant Contact: import { ... } from '@/lib/constantcontact'
//   - ConstantContactClient, createConstantContactAuth, etc. (CRM)
