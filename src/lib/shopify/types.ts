/**
 * Shopify Integration Types
 *
 * Type definitions for Shopify Storefront API responses
 * Based on actual API response structure from Shopify GraphQL
 *
 * @see https://shopify.dev/docs/api/storefront
 */

/**
 * Currency code (ISO 4217 format)
 */
export type CurrencyCode = 'USD' | 'CAD' | 'EUR' | 'GBP' | string

/**
 * Shopify Global ID format: gid://shopify/Resource/ID
 */
export type ShopifyGID = `gid://shopify/${string}/${string}`

/**
 * Product type categories
 */
export type ProductType = 'Grand Piano' | 'Upright' | 'Digital Piano' | 'Accessory' | string

/**
 * Product availability status
 */
export type ProductStatus = 'ACTIVE' | 'ARCHIVED' | 'DRAFT'

// ============================================================================
// Core Types
// ============================================================================

/**
 * Money value with currency
 */
export interface Money {
  /** Amount as decimal string (e.g., "1299.00") */
  amount: string
  /** Currency code */
  currencyCode: CurrencyCode
}

/**
 * Price range for a product
 */
export interface PriceRange {
  /** Minimum variant price */
  minVariantPrice: Money
  /** Maximum variant price */
  maxVariantPrice: Money
}

/**
 * Product image
 */
export interface ProductImage {
  /** Shopify image ID */
  id: ShopifyGID
  /** CDN URL for the image */
  url: string
  /** Alt text for accessibility */
  altText: string | null
  /** Image width in pixels */
  width: number | null
  /** Image height in pixels */
  height: number | null
}

/**
 * Edge wrapper for GraphQL connection
 */
export interface Edge<T> {
  node: T
}

/**
 * Connection with edges and pagination
 */
export interface Connection<T> {
  edges: Edge<T>[]
  pageInfo?: PageInfo
}

/**
 * Pagination information
 */
export interface PageInfo {
  /** Whether there are more pages after this one */
  hasNextPage: boolean
  /** Whether there are pages before this one */
  hasPreviousPage: boolean
  /** Cursor for the first item */
  startCursor?: string | null
  /** Cursor for the last item */
  endCursor?: string | null
}

/**
 * Product metafield
 */
export interface Metafield {
  /** Metafield key */
  key: string
  /** Metafield value (JSON string) */
  value: string
  /** Value type (e.g., "json", "string", "number") */
  type: string
  /** Optional namespace */
  namespace?: string
}

// ============================================================================
// Product Variant
// ============================================================================

/**
 * Product variant (SKU/option combination)
 */
export interface ProductVariant {
  /** Shopify variant ID */
  id: ShopifyGID
  /** Variant title (e.g., "Black" or "Default Title") */
  title: string
  /** SKU identifier */
  sku: string | null
  /** Whether this variant is available for sale */
  availableForSale: boolean
  /** Current price */
  price: Money
  /** Original price before discount */
  compareAtPrice: Money | null
  /** Associated variant image */
  image: {
    url: string
    altText: string | null
  } | null
  /** Inventory quantity (Admin API only) */
  inventoryQuantity?: number
}

// ============================================================================
// Product
// ============================================================================

/**
 * Shopify product (from Storefront API)
 */
export interface ShopifyProduct {
  /** Shopify product ID */
  id: ShopifyGID
  /** Product title */
  title: string
  /** URL-friendly handle (slug) */
  handle: string
  /** Plain text description */
  description: string
  /** HTML description */
  descriptionHtml: string
  /** Product type (e.g., "Grand Piano") */
  productType: ProductType
  /** Vendor name */
  vendor: string
  /** Product tags */
  tags: string[]
  /** Whether product is available for sale */
  availableForSale: boolean
  /** Creation timestamp */
  createdAt: string
  /** Last update timestamp */
  updatedAt: string
  /** Online store URL (null if not published) */
  onlineStoreUrl: string | null
  /** Price range across all variants */
  priceRange: PriceRange
  /** Product images */
  images: Connection<ProductImage>
  /** Product variants */
  variants: Connection<ProductVariant>
  /** Custom metafields */
  metafields: (Metafield | null)[]
  /** Owner's manual file reference (custom.ownermanual metafield) */
  metafield_ownermanual?: {
    reference: { url: string } | null
  } | null
}

// ============================================================================
// Simplified Domain Types
// ============================================================================

/**
 * Simplified product for frontend use
 * Normalized from GraphQL response
 */
export interface Product {
  /** Product ID (without gid:// prefix) */
  id: string
  /** Product title */
  title: string
  /** URL-friendly slug */
  handle: string
  /** Plain text description */
  description: string
  /** HTML description */
  descriptionHtml: string
  /** Product category type */
  type: ProductType
  /** Vendor/brand name */
  vendor: string
  /** Product tags for filtering */
  tags: string[]
  /** Availability status */
  available: boolean
  /** Creation date */
  createdAt: Date
  /** Last update date */
  updatedAt: Date
  /** Price information */
  price: {
    min: number
    max: number
    currency: CurrencyCode
    /** Formatted price string */
    display: string
  }
  /** Primary product image */
  image: {
    url: string
    alt: string
    width: number
    height: number
  } | null
  /** All product images */
  images: Array<{
    url: string
    alt: string
    width: number
    height: number
  }>
  /** Product variants */
  variants: Array<{
    id: string
    title: string
    sku: string | null
    available: boolean
    price: number
    compareAtPrice: number | null
    inventoryTracked?: boolean
    image: {
      url: string
      alt: string
    } | null
  }>
  /** Owner's manual PDF URL (from custom.ownermanual metafield) */
  ownersManualUrl: string | null
  /** Action descriptors (from custom.action list metafield, e.g. ["Light", "Medium"]) */
  action: string[]
  /** Tone descriptors (from custom.tone list metafield, e.g. ["Bright", "Warm"]) */
  tone: string[]
  /** Feature list (from custom.features list metafield) */
  features: string[]
  /** Custom metadata */
  metadata?: Record<string, unknown>
}

// ============================================================================
// API Response Types
// ============================================================================

/**
 * GraphQL response wrapper
 */
export interface GraphQLResponse<T> {
  data: T | null
  errors?: GraphQLError[]
  extensions?: Record<string, unknown>
}

/**
 * GraphQL error
 */
export interface GraphQLError {
  message: string
  locations?: Array<{
    line: number
    column: number
  }>
  path?: (string | number)[]
  extensions?: Record<string, unknown>
}

/**
 * Products query response
 */
export interface ProductsResponse {
  products: Connection<ShopifyProduct>
}

/**
 * Single product query response
 */
export interface ProductResponse {
  product: ShopifyProduct | null
}

/**
 * Collection query response
 */
export interface CollectionResponse {
  collection: {
    id: ShopifyGID
    title: string
    handle: string
    description: string
    products: Connection<ShopifyProduct>
  } | null
}

// ============================================================================
// Query Variables
// ============================================================================

/**
 * Variables for products query
 */
export interface ProductsQueryVariables {
  /** Number of products to fetch */
  first?: number
  /** Cursor for pagination */
  after?: string | null
  /** Product query filter */
  query?: string | null
  /** Sort key */
  sortKey?: 'TITLE' | 'PRICE' | 'CREATED_AT' | 'UPDATED_AT' | 'BEST_SELLING'
  /** Sort direction */
  reverse?: boolean
}

/**
 * Variables for single product query
 */
export interface ProductQueryVariables {
  /** Product handle (slug) */
  handle?: string
  /** Product ID */
  id?: ShopifyGID
}

/**
 * Variables for collection query
 */
export interface CollectionQueryVariables {
  /** Collection handle (slug) */
  handle: string
  /** Number of products to fetch */
  productsFirst?: number
}

// ============================================================================
// Client Configuration
// ============================================================================

/**
 * Shopify Storefront API client configuration
 */
export interface ShopifyConfig {
  /** Store domain (e.g., "example.myshopify.com") */
  storeDomain: string
  /** Storefront API access token */
  storefrontAccessToken: string
  /** API version (e.g., "2024-01") */
  apiVersion?: string
}

/**
 * Shopify Admin API client configuration
 */
export interface ShopifyAdminConfig {
  /** Store domain (e.g., "example.myshopify.com") */
  storeDomain: string
  /** Admin API access token (server-side only) */
  adminAccessToken: string
  /** API version (e.g., "2025-01") */
  apiVersion?: string
}

/**
 * Request options for Shopify client
 */
export interface ShopifyRequestOptions {
  /** Request timeout in milliseconds */
  timeout?: number
  /** Number of retry attempts */
  retries?: number
  /** Custom headers */
  headers?: Record<string, string>
  /** Cache configuration */
  cache?: RequestCache
  /** Next.js revalidate time (ISR) */
  revalidate?: number | false
}

// ============================================================================
// Cart Types
// ============================================================================

/**
 * Cart line item (product in cart)
 */
export interface CartLine {
  /** Cart line ID */
  id: ShopifyGID
  /** Quantity of this item */
  quantity: number
  /** Line cost */
  cost: {
    /** Total amount for this line */
    totalAmount: Money
    /** Amount per quantity */
    amountPerQuantity: Money
    /** Compare at amount per quantity */
    compareAtAmountPerQuantity: Money | null
  }
  /** Product variant */
  merchandise: {
    id: ShopifyGID
    title: string
    price: Money
    product: {
      id: ShopifyGID
      title: string
      handle: string
      featuredImage: {
        url: string
        altText: string | null
      } | null
    }
    image: {
      url: string
      altText: string | null
    } | null
    selectedOptions: Array<{
      name: string
      value: string
    }>
  }
  /** Line attributes */
  attributes: Array<{
    key: string
    value: string
  }>
}

/**
 * Cart cost breakdown
 */
export interface CartCost {
  /** Subtotal amount */
  subtotalAmount: Money
  /** Total amount */
  totalAmount: Money
  /** Total tax amount */
  totalTaxAmount: Money | null
  /** Total duty amount */
  totalDutyAmount: Money | null
}

/**
 * Buyer identity for cart
 */
export interface CartBuyerIdentity {
  /** Customer email */
  email?: string
  /** Customer phone */
  phone?: string
  /** Customer ID */
  customerId?: ShopifyGID
  /** Country code */
  countryCode?: string
}

/**
 * Discount allocation
 */
export interface DiscountAllocation {
  /** Discounted amount */
  discountedAmount: Money
  /** Discount code (if code-based) */
  code?: string
}

/**
 * Cart object
 */
export interface Cart {
  /** Cart ID */
  id: ShopifyGID
  /** Checkout URL */
  checkoutUrl: string
  /** Creation timestamp */
  createdAt: string
  /** Last update timestamp */
  updatedAt: string
  /** Cart lines */
  lines: Connection<CartLine>
  /** Cart attributes */
  attributes: Array<{
    key: string
    value: string
  }>
  /** Cart cost breakdown */
  cost: CartCost
  /** Buyer identity */
  buyerIdentity: CartBuyerIdentity
  /** Discount codes */
  discountCodes: Array<{
    code: string
    applicable: boolean
  }>
  /** Discount allocations */
  discountAllocations: DiscountAllocation[]
  /** Total quantity */
  totalQuantity: number
  /** Cart note */
  note: string | null
}

/**
 * Cart user error (from mutations)
 */
export interface CartUserError {
  /** Error code */
  code: string
  /** Error message */
  message: string
  /** Field path that caused error */
  field: (string | number)[] | null
}

// ============================================================================
// Cart Mutation Input Types
// ============================================================================

/**
 * Input for creating a cart line
 */
export interface CartLineInput {
  /** Product variant ID */
  merchandiseId: ShopifyGID
  /** Quantity */
  quantity: number
  /** Line attributes */
  attributes?: Array<{
    key: string
    value: string
  }>
}

/**
 * Input for updating a cart line
 */
export interface CartLineUpdateInput {
  /** Cart line ID to update */
  id: ShopifyGID
  /** New quantity */
  quantity: number
  /** Updated attributes */
  attributes?: Array<{
    key: string
    value: string
  }>
}

/**
 * Input for creating a cart
 */
export interface CartInput {
  /** Cart lines */
  lines?: CartLineInput[]
  /** Cart attributes */
  attributes?: Array<{
    key: string
    value: string
  }>
  /** Buyer identity */
  buyerIdentity?: CartBuyerIdentity
  /** Discount codes */
  discountCodes?: string[]
  /** Cart note */
  note?: string
}

// ============================================================================
// Cart Response Types
// ============================================================================

/**
 * Cart create mutation response
 */
export interface CartCreateResponse {
  cartCreate: {
    cart: Cart | null
    userErrors: CartUserError[]
  }
}

/**
 * Cart lines add mutation response
 */
export interface CartLinesAddResponse {
  cartLinesAdd: {
    cart: Cart | null
    userErrors: CartUserError[]
  }
}

/**
 * Cart lines update mutation response
 */
export interface CartLinesUpdateResponse {
  cartLinesUpdate: {
    cart: Cart | null
    userErrors: CartUserError[]
  }
}

/**
 * Cart lines remove mutation response
 */
export interface CartLinesRemoveResponse {
  cartLinesRemove: {
    cart: Cart | null
    userErrors: CartUserError[]
  }
}

/**
 * Cart query response
 */
export interface CartQueryResponse {
  cart: Cart | null
}

/**
 * Cart discount codes update response
 */
export interface CartDiscountCodesUpdateResponse {
  cartDiscountCodesUpdate: {
    cart: Cart | null
    userErrors: CartUserError[]
  }
}

// ============================================================================
// Cart Mutation Variables
// ============================================================================

/**
 * Variables for cart create mutation
 */
export interface CartCreateVariables {
  input: CartInput
}

/**
 * Variables for cart lines add mutation
 */
export interface CartLinesAddVariables {
  cartId: ShopifyGID
  lines: CartLineInput[]
}

/**
 * Variables for cart lines update mutation
 */
export interface CartLinesUpdateVariables {
  cartId: ShopifyGID
  lines: CartLineUpdateInput[]
}

/**
 * Variables for cart lines remove mutation
 */
export interface CartLinesRemoveVariables {
  cartId: ShopifyGID
  lineIds: ShopifyGID[]
}

/**
 * Variables for cart query
 */
export interface CartQueryVariables {
  id: ShopifyGID
}

/**
 * Variables for cart discount codes update
 */
export interface CartDiscountCodesUpdateVariables {
  cartId: ShopifyGID
  discountCodes: string[]
}

// ============================================================================
// Simplified Cart Types
// ============================================================================

/**
 * Simplified cart line for frontend use
 */
export interface SimpleCartLine {
  id: string
  variantId: string
  productId: string
  productTitle: string
  productHandle: string
  variantTitle: string
  quantity: number
  price: number
  compareAtPrice: number | null
  total: number
  image: {
    url: string
    alt: string
  } | null
  attributes: Record<string, string>
}

/**
 * Simplified cart for frontend use
 */
export interface SimpleCart {
  id: string
  checkoutUrl: string
  lines: SimpleCartLine[]
  subtotal: number
  total: number
  totalQuantity: number
  currency: CurrencyCode
  discountCodes: string[]
  discounts: number
}

// ============================================================================
// Customer Types (Admin API)
// ============================================================================

/**
 * Email marketing consent input
 */
export interface EmailMarketingConsentInput {
  /** Marketing state (SUBSCRIBED, UNSUBSCRIBED) */
  marketingState?: 'SUBSCRIBED' | 'UNSUBSCRIBED'
  /** Opt-in level */
  marketingOptInLevel?: 'SINGLE_OPT_IN' | 'CONFIRMED_OPT_IN' | 'UNKNOWN'
}

/**
 * Customer input for creating a new customer
 */
export interface CustomerInput {
  /** Customer email */
  email?: string
  /** First name */
  firstName?: string
  /** Last name */
  lastName?: string
  /** Phone number */
  phone?: string
  /** Customer tags (for segmentation) */
  tags?: string[]
  /** Email marketing consent (replaces acceptsMarketing in API 2025-01+) */
  emailMarketingConsent?: EmailMarketingConsentInput
  /** Note about the customer */
  note?: string
  /** Whether customer is tax exempt */
  taxExempt?: boolean
  /** Addresses */
  addresses?: CustomerAddressInput[]
}

/**
 * Customer address input
 */
export interface CustomerAddressInput {
  /** Address line 1 */
  address1?: string
  /** Address line 2 */
  address2?: string
  /** City */
  city?: string
  /** Company name */
  company?: string
  /** Country */
  country?: string
  /** Country code */
  countryCode?: string
  /** First name */
  firstName?: string
  /** Last name */
  lastName?: string
  /** Phone number */
  phone?: string
  /** Province/State */
  province?: string
  /** Province code */
  provinceCode?: string
  /** ZIP/Postal code */
  zip?: string
}

/**
 * Email marketing consent (Shopify Admin API 2025-01+)
 */
export interface EmailMarketingConsent {
  /** Marketing state (SUBSCRIBED, UNSUBSCRIBED, NOT_SUBSCRIBED, etc.) */
  marketingState: string
  /** Opt-in level (SINGLE_OPT_IN, CONFIRMED_OPT_IN, UNKNOWN) */
  marketingOptInLevel: string | null
}

/**
 * Customer object (Admin API)
 */
export interface Customer {
  /** Shopify customer ID */
  id: ShopifyGID
  /** Customer email */
  email: string
  /** First name */
  firstName: string | null
  /** Last name */
  lastName: string | null
  /** Phone number */
  phone: string | null
  /** Customer tags */
  tags: string[]
  /** Display name */
  displayName: string
  /** Email marketing consent (replaces acceptsMarketing in API 2025-01+) */
  emailMarketingConsent: EmailMarketingConsent | null
  /** Tax exempt status */
  taxExempt: boolean
  /** Note about the customer */
  note: string | null
  /** Verified email status */
  verifiedEmail: boolean
  /** Account state (e.g., "ENABLED", "DISABLED") */
  state: string
  /** Creation timestamp */
  createdAt: string
  /** Last update timestamp */
  updatedAt: string
  /** Addresses */
  addresses?: CustomerAddress[]
  /** Default address */
  defaultAddress?: CustomerAddress | null
}

/**
 * Customer address
 */
export interface CustomerAddress {
  /** Address ID */
  id?: ShopifyGID
  /** Address line 1 */
  address1: string | null
  /** Address line 2 */
  address2: string | null
  /** City */
  city: string | null
  /** Company */
  company: string | null
  /** Country */
  country: string | null
  /** Country code */
  countryCodeV2: string | null
  /** First name */
  firstName: string | null
  /** Last name */
  lastName: string | null
  /** Phone */
  phone: string | null
  /** Province */
  province: string | null
  /** Province code */
  provinceCode: string | null
  /** ZIP/Postal code */
  zip: string | null
}

/**
 * Customer user error (from mutations)
 */
export interface CustomerUserError {
  /** Error message */
  message: string
  /** Field path that caused error */
  field: (string | number)[] | null
}

/**
 * Customer create mutation response
 */
export interface CustomerCreateResponse {
  customerCreate: {
    customer: Customer | null
    userErrors: CustomerUserError[]
  }
}

/**
 * Customer update mutation response
 */
export interface CustomerUpdateResponse {
  customerUpdate: {
    customer: Customer | null
    userErrors: CustomerUserError[]
  }
}

/**
 * Customer set mutation response (create or update in one call)
 */
export interface CustomerSetResponse {
  customerSet: {
    customer: Customer | null
    userErrors: CustomerUserError[]
  }
}

/**
 * Customer query response
 */
export interface CustomerQueryResponse {
  customer: Customer | null
}

/**
 * Variables for customer create mutation
 */
export interface CustomerCreateVariables {
  input: CustomerInput
}

/**
 * Variables for customer update mutation
 */
export interface CustomerUpdateVariables {
  input: CustomerInput & {
    id: ShopifyGID
  }
}

/**
 * Variables for customer query
 */
export interface CustomerQueryVariables {
  id: ShopifyGID
}

// ============================================================================
// Error Types
// ============================================================================

/**
 * Shopify API error
 */
export class ShopifyError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public errors?: GraphQLError[]
  ) {
    super(message)
    this.name = 'ShopifyError'
  }
}

/**
 * Cart-specific error
 */
export class CartError extends Error {
  constructor(
    message: string,
    public userErrors?: CartUserError[]
  ) {
    super(message)
    this.name = 'CartError'
  }
}

/**
 * Result type for operations that may fail
 */
export type Result<T, E = ShopifyError> =
  | { success: true; data: T }
  | { success: false; error: E }

// ============================================================================
// Media Types (Re-exports from media-types.ts)
// ============================================================================

export type {
  // Media type enums
  MediaContentType,
  MediaStatus,
  FileStatus,
  MediaHost,

  // Error types
  MediaError,
  MediaWarning,
  FileError,

  // Common interfaces
  MediaPreviewImage,
  BaseMedia,

  // MediaImage types
  MediaImageOriginalSource,
  MediaImageData,
  MediaImage,

  // Video types
  VideoSource,
  Video,

  // Model3d types
  Model3dSource,
  Model3dBoundingBox,
  Model3d,

  // ExternalVideo type
  ExternalVideo,

  // Union type
  Media,

  // GraphQL response types
  ProductMediaConnection,
  ProductWithMedia,
  ProductMediaQueryVariables,
  ProductMediaQueryResponse,
} from './media-types'

export {
  // Type guard functions
  isMediaImage,
  isVideo,
  isModel3d,
  isExternalVideo,
  isMediaReady,
  hasMediaErrors,
} from './media-types'
