/**
 * Payload CMS Utilities
 *
 * This barrel export provides client-safe Payload CMS utilities.
 *
 * CLIENT-SAFE IMPORTS (use in any component - client or server):
 *   import { getProductlines, transformProductlinesToSeries } from '@/lib/payload'
 *
 * SERVER-ONLY IMPORTS (use only in Server Components, Route Handlers, or Server Actions):
 *   import { getPianoCategoriesDirect } from '@/lib/payload/queries'
 *   import { getProductlinesServer } from '@/lib/payload/server'
 *
 * Files:
 *   - client.ts: HTTP-based API client functions (works client and server-side)
 *   - queries.ts: Direct Payload database queries (SERVER-ONLY - imports payload.config)
 *   - server.ts: Server-side API functions with revalidation (SERVER-ONLY)
 *
 * NOTE: queries.ts and server.ts are marked with 'server-only' and cannot be imported
 * in client components. Attempting to import them in a client component will cause
 * a build error. Import them directly from their respective files when needed.
 */

// Client-safe and universal API functions
// These use HTTP fetch and work in both client and server contexts
export {
  // Productlines
  getProductlines,
  getProductlineBySlug,
  getFeaturedProductlines,
  getProductlinesWithProducts,
  getProductlinesWithPianoModels, // Legacy

  // Piano Models
  getPianoModels,
  getPianoModelBySlug,
  getFeaturedPianoModels,
  getPianoModelsByProductline,

  // Products
  getProducts,
  getProductBySlug,
  getActiveProducts,
  getProductsByCategory,

  // Piano Categories
  getPianoCategories,
  getPianoCategoryBySlug,
  getCachedPianoCategories,

  // Featured Models
  getFeaturedModels,
  getCachedFeaturedModels,

  // Pages
  getPianoPage,
  getCachedPianoPage,
  getPianosPageData,
  getHomePage,
  getCachedHomePage,
  getHomePageData,
  getPianoGalleryData,

  // Storefronts
  getStorefront,
  getCachedStorefront,
  getStorefrontData,

  // Media
  getMediaById,
  resolveMediaUrl,

  // Transformers
  transformProductToComponent,
  transformPianoModelToComponent,
  transformProductlineToSeries,
  transformProductlinesToSeries,
  transformPianoCategoryToLegacy,
  transformFeaturedModelToLegacy,
} from './client'

// ============================================================================
// SERVER-ONLY EXPORTS - Do NOT import from this barrel in client components!
// ============================================================================
//
// The following modules are server-only and must be imported directly:
//
// Direct Payload queries (uses payload.config - server-only):
//   import {
//     getPianoCategoriesDirect,
//     getFeaturedModelsDirect,
//     getPianosPageDataDirect,
//     getHomePageDataDirect,
//     getProductlinesDirect,
//     getProductsDirect,
//     getProductBySlugDirect,
//     getActiveProductsDirect,
//     getStorefrontBySlugDirect,
//     getActiveStorefrontsDirect,
//   } from '@/lib/payload/queries'
//
// Server-side API functions:
//   import {
//     getProductlinesServer,
//     getProductlineBySlugServer,
//     getFeaturedProductlinesServer,
//     getPianoModelsServer,
//     getPianoModelsByProductlineServer,
//     getProductlinesWithProductsServer,
//     getProductlinesWithPianoModelsServer,
//     generateCategoryNavigationServer,
//     generatePianoCategoriesNavigationServer,
//     getConcertArtistPageServer,
//     transformProductlineToSeriesServer,
//     transformProductlinesToSeriesServer,
//   } from '@/lib/payload/server'
//
// ============================================================================
