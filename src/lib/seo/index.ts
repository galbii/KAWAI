/**
 * SEO Utilities
 *
 * This barrel export provides all SEO-related utilities for the KAWAI Piano website.
 *
 * Files:
 *   - schemas.ts: Schema.org structured data definitions
 *   - utilities.ts: SEO generation utilities and helpers
 *   - cms-page-metadata.ts: CMS-driven metadata overlay for static pages
 */

// CMS-driven metadata (server-only)
export { getCMSPageMetadata } from './cms-page-metadata'

// Schema.org structured data
export {
  organizationSchema,
  generateProductSchema,
  featuredProductsSchema,
  generateBreadcrumbSchema,
} from './schemas'

// SEO generation utilities
export {
  // Types
  type SEOData,
  type OpenGraphData,
  type TwitterCardData,

  // Config
  KAWAI_SEO_CONFIG,
  KAWAI_SEARCH_TERMS,

  // Generation functions
  generatePianoSEO,
  generateSeriesSEO,
  generateArtistSEO,
  generateTechnologySEO,

  // Structured data generators
  generatePianoStructuredData,
  generateSeriesStructuredData,
  generateArtistStructuredData,
  generateTechnologyStructuredData,
  generateBreadcrumbStructuredData,
  generateOrganizationStructuredData,
  generateLocalBusinessStructuredData,

  // Analysis
  analyzeSEO,
  generateSitemapData,
} from './utilities'
