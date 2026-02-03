/**
 * Shopify Integration Library
 *
 * A clean, type-safe integration with Shopify Storefront API for the KAWAI Piano website.
 *
 * @example Basic Usage
 * ```typescript
 * import { getProducts, getProductByHandle } from '@/lib/shopify'
 *
 * // Get all products
 * const products = await getProducts({ first: 20 })
 *
 * // Get a specific product
 * const product = await getProductByHandle('kawai-gx-7-grand-piano')
 * ```
 *
 * @example Advanced Usage
 * ```typescript
 * import { shopifyClient, GET_PRODUCTS, transformProduct } from '@/lib/shopify'
 *
 * // Custom query with ISR configuration
 * const data = await shopifyClient.query(
 *   GET_PRODUCTS,
 *   { first: 10, sortKey: 'PRICE' },
 *   { revalidate: 600 } // 10 minutes
 * )
 *
 * const products = data.products.edges.map(edge => transformProduct(edge.node))
 * ```
 *
 * @example Type Imports
 * ```typescript
 * import type { Product, ShopifyProduct, ProductsQueryVariables } from '@/lib/shopify'
 * ```
 */

// ============================================================================
// Client Exports
// ============================================================================

export {
  ShopifyClient,
  shopifyClient,
  queryShopify,
  createShopifyClient,
} from './client'

// ============================================================================
// Type Exports
// ============================================================================

export type {
  // Core types
  Product,
  ShopifyProduct,
  ProductVariant,
  ProductImage,
  ProductType,
  ProductStatus,
  Money,
  PriceRange,
  Metafield,

  // Cart types
  Cart,
  CartLine,
  CartCost,
  CartBuyerIdentity,
  CartUserError,
  DiscountAllocation,
  SimpleCart,
  SimpleCartLine,

  // Cart input types
  CartInput,
  CartLineInput,
  CartLineUpdateInput,

  // Cart response types
  CartCreateResponse,
  CartLinesAddResponse,
  CartLinesUpdateResponse,
  CartLinesRemoveResponse,
  CartQueryResponse,
  CartDiscountCodesUpdateResponse,

  // Cart variable types
  CartCreateVariables,
  CartLinesAddVariables,
  CartLinesUpdateVariables,
  CartLinesRemoveVariables,
  CartQueryVariables,
  CartDiscountCodesUpdateVariables,

  // GraphQL types
  Edge,
  Connection,
  PageInfo,
  GraphQLResponse,
  GraphQLError,

  // Response types
  ProductsResponse,
  ProductResponse,
  CollectionResponse,

  // Query variables
  ProductsQueryVariables,
  ProductQueryVariables,
  CollectionQueryVariables,

  // Configuration
  ShopifyConfig,
  ShopifyRequestOptions,

  // Utility types
  ShopifyGID,
  CurrencyCode,
  ShopifyError,
  Result,
} from './types'

export { CartError } from './types'

// ============================================================================
// Query Exports
// ============================================================================

export {
  // Product queries
  GET_PRODUCTS,
  GET_PRODUCT_BY_HANDLE,
  GET_PRODUCT_BY_ID,
  GET_COLLECTION_PRODUCTS,
  GET_COLLECTIONS,
  GET_AVAILABLE_PRODUCTS,
  GET_PRODUCTS_BY_TYPE,
  SEARCH_PRODUCTS,
  GET_PRODUCTS_MINIMAL,

  // Cart queries & mutations
  CART_CREATE_MUTATION,
  CART_LINES_ADD_MUTATION,
  CART_LINES_UPDATE_MUTATION,
  CART_LINES_REMOVE_MUTATION,
  GET_CART_QUERY,
  CART_DISCOUNT_CODES_UPDATE_MUTATION,
} from './queries'

// ============================================================================
// Product Utility Exports
// ============================================================================

export {
  // Data fetching
  getProducts,
  getProductByHandle,
  getProductById,
  getProductByModel,
  getCollectionProducts,
  getAvailableProducts,
  getProductsByType,
  searchProducts,
  getProductsMinimal,

  // Transformation
  transformProduct,
  extractId,

  // Product utilities
  isProductOnSale,
  getDiscountPercentage,
  getLowestPrice,
  getHighestPrice,
  hasMultipleVariants,
  getAvailableVariants,
  groupProductsByType,
  filterProductsByTag,
  filterAvailableProducts,

  // Sorting
  sortProductsByPrice,
  sortProductsByTitle,
  sortProductsByDate,

  // Formatting
  getShopifyImageUrl,
  formatProductPrice,
  getProductTypeLabel,
} from './products'

// ============================================================================
// Admin API Product Fetch Exports
// ============================================================================

export {
  fetchShopifyProduct,
  fetchShopifyProductByModel,
} from './fetch-product'

export type { ShopifyProductData } from './fetch-product'

// ============================================================================
// Shopify to Payload Sync Exports
// ============================================================================

export {
  syncShopifyDataToProduct,
  shouldSyncProduct,
  formatShopifyPrice,
} from './sync-to-payload'

export type { ShopifyDataUpdate } from './sync-to-payload'

// ============================================================================
// Cart Utility Exports
// ============================================================================

export {
  // Cart operations
  createCart,
  addToCart,
  updateCartLine,
  updateCartLines,
  removeFromCart,
  getCart,
  getCheckoutUrl,

  // Cart transformations
  transformCart,

  // Discount codes
  applyDiscountCode,
  removeDiscountCode,
  clearDiscountCodes,

  // Cart utilities
  isCartEmpty,
  getCartItemCount,
  hasDiscounts,
  findLineByVariantId,
  calculateSavings,
} from './cart'

// ============================================================================
// Cart Storage Exports
// ============================================================================

export {
  // Cart ID management
  saveCartId,
  getCartId,
  clearCartId,
  hasStoredCart,
  getCartExpirationTime,
  refreshCartExpiration,

  // Cart metadata
  saveCartMetadata,
  getCartMetadata,
  clearCartMetadata,

  // Migration & cleanup
  migrateCartStorage,
  cleanupExpiredCart,

  // Debug utilities
  getCartStorageDebugInfo,
  clearAllCartStorage,
} from './cart-storage'

export type { CartMetadata } from './cart-storage'

// ============================================================================
// Navigation Utility Exports
// ============================================================================

export {
  // Navigation data fetching
  getProductTypes,
  getProductTypesWithProducts,
  getProductsByTypeForNav,

  // Navigation utilities
  formatProductType,
  getProductTypeSlug,
} from './navigation'

export type { ProductTypeNav, ProductsNavigation } from './navigation'

// ============================================================================
// Product Media Exports (Admin API)
// ============================================================================

export {
  // Main media functions
  getProductMedia,
  getProductMediaByType,
  getProductImages,
  getProductVideos,
  getProduct3DModels,

  // Utility functions
  getProductPrimaryImage,
  hasProductMediaType,
  countMediaByType,
  groupMediaByType,
  extractMediaUrls,

  // Type guards (re-exported from media.ts for convenience)
  isMediaImage,
  isVideo,
  isModel3d,
  isExternalVideo,
  isMediaReady,
} from './media'

export {
  // GraphQL queries
  MEDIA_FRAGMENT,
  GET_PRODUCT_WITH_MEDIA,
  GET_PRODUCT_MEDIA_FILTERED,
  GET_PRODUCT_IMAGES,
  GET_PRODUCT_VIDEOS,
  GET_PRODUCT_3D_MODELS,
} from './media-queries'

// Media types already exported from types.ts (re-exported from media-types.ts)
// - MediaContentType, MediaStatus, FileStatus, MediaHost
// - MediaError, MediaWarning, FileError
// - MediaImage, Video, Model3d, ExternalVideo, Media
// - Type guard functions (isMediaImage, isVideo, etc.)

// ============================================================================
// Media to Payload Transformation Exports
// ============================================================================

export {
  transformMediaToPayload,
  getPrimaryImageUrl,
  filterMediaByType,
} from './transform-media-to-payload'

export type { PayloadShopifyMedia } from './transform-media-to-payload'

// ============================================================================
// Re-exports from utils (for convenience)
// ============================================================================

export { formatPrice } from '../utils'
