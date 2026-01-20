/**
 * Fetch product data from Shopify Admin API
 *
 * This utility fetches comprehensive product data from Shopify using the Admin GraphQL API.
 * It supports both Product IDs (gid://shopify/Product/123) and handles (product-slug).
 *
 * @module fetch-product
 */

import { shopifyAdminClient } from './admin-client'

/**
 * Shopify product data structure (simplified)
 */
export interface ShopifyProductData {
  id: string
  title: string
  handle: string
  description: string
  descriptionHtml: string
  vendor: string
  productType: string
  tags: string[]
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED'
  price: {
    min: string
    max: string
    currency: string
    display: string
  }
  compareAtPrice: {
    min: string
    max: string
  } | null
  images: Array<{
    url: string
    alt: string
    width: number
    height: number
  }>
  featuredImage: {
    url: string
    alt: string
    width: number
    height: number
  } | null
  variants: Array<{
    id: string
    title: string
    price: string
    compareAtPrice: string | null
    sku: string
    barcode: string | null
    available: boolean
    inventoryQuantity: number
    inventoryTracked: boolean
    options: Array<{
      name: string
      value: string
    }>
  }>
  seo: {
    title: string
    description: string
  }
  metafields?: {
    model?: string
    [key: string]: string | undefined
  }
  availableForSale: boolean
  createdAt: string
  updatedAt: string
  publishedAt: string | null
}

/**
 * Fetch product from Shopify by ID or handle
 *
 * @param idOrHandle - Shopify Product ID (gid://shopify/Product/123) or handle (product-slug)
 * @returns Product data or null if not found
 * @throws Error if API request fails
 */
export async function fetchShopifyProduct(
  idOrHandle: string
): Promise<ShopifyProductData | null> {

  // Determine if input is a GID or handle
  const isGid = idOrHandle.startsWith('gid://shopify/Product/')
  const identifier = isGid ? idOrHandle : idOrHandle.toLowerCase().trim()

  console.log(`[Shopify Fetch] Fetching product: ${identifier} (${isGid ? 'ID' : 'handle'})`)

  try {
    // Use productByHandle for handles, product for GIDs
    const query = isGid ? PRODUCT_BY_ID_QUERY : PRODUCT_BY_HANDLE_QUERY
    const variables = isGid
      ? { id: identifier }
      : { handle: identifier }

    // Use admin client (handles auth, retries, errors automatically)
    const data = await shopifyAdminClient.query<{
      product?: any
      productByHandle?: any
    }>(query, variables)

    // Extract product from response (different field names for ID vs handle)
    const product = isGid ? data.product : data.productByHandle

    if (!product) {
      console.warn(`[Shopify Fetch] Product not found: ${identifier}`)
      return null
    }

    const transformed = transformShopifyProduct(product)
    console.log(`[Shopify Fetch] Successfully fetched: ${transformed.title}`)

    return transformed

  } catch (error) {
    console.error('[Shopify Fetch] Error:', error)
    throw error
  }
}

/**
 * GraphQL query to fetch product by ID
 *
 * Based on Shopify Admin API best practices:
 * - Use fragments for reusable field sets
 * - Fetch only necessary fields
 * - Include pagination for connections (first: 100 for variants/images)
 */
const PRODUCT_BY_ID_QUERY = `
  query GetProductById($id: ID!) {
    product(id: $id) {
      ...ProductFields
    }
  }

  fragment ProductFields on Product {
    id
    title
    handle
    description
    descriptionHtml
    vendor
    productType
    tags
    status
    createdAt
    updatedAt
    publishedAt

    priceRangeV2 {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }

    compareAtPriceRange {
      minVariantCompareAtPrice {
        amount
        currencyCode
      }
      maxVariantCompareAtPrice {
        amount
        currencyCode
      }
    }

    featuredImage {
      url
      altText
      width
      height
    }

    images(first: 20) {
      edges {
        node {
          url
          altText
          width
          height
        }
      }
    }

    variants(first: 100) {
      edges {
        node {
          id
          title
          price
          compareAtPrice
          sku
          barcode
          availableForSale
          inventoryQuantity
          inventoryItem {
            tracked
          }
          selectedOptions {
            name
            value
          }
        }
      }
    }

    seo {
      title
      description
    }
  }
`

/**
 * GraphQL query to fetch product by handle
 *
 * Note: productByHandle is deprecated but still functional
 * Uses same ProductFields fragment for consistency
 */
const PRODUCT_BY_HANDLE_QUERY = `
  query GetProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      ...ProductFields
    }
  }

  fragment ProductFields on Product {
    id
    title
    handle
    description
    descriptionHtml
    vendor
    productType
    tags
    status
    createdAt
    updatedAt
    publishedAt

    priceRangeV2 {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }

    compareAtPriceRange {
      minVariantCompareAtPrice {
        amount
        currencyCode
      }
      maxVariantCompareAtPrice {
        amount
        currencyCode
      }
    }

    featuredImage {
      url
      altText
      width
      height
    }

    images(first: 20) {
      edges {
        node {
          url
          altText
          width
          height
        }
      }
    }

    variants(first: 100) {
      edges {
        node {
          id
          title
          price
          compareAtPrice
          sku
          barcode
          availableForSale
          inventoryQuantity
          inventoryItem {
            tracked
          }
          selectedOptions {
            name
            value
          }
        }
      }
    }

    seo {
      title
      description
    }
  }
`

/**
 * GraphQL query to fetch product by custom metafield value
 *
 * Uses products query with metafield filtering syntax.
 * NOTE: The metafield must have 'adminFilterable' capability enabled in Shopify.
 *
 * @see https://shopify.dev/docs/apps/build/custom-data/metafields/query-by-metafield-value
 */
const PRODUCT_BY_METAFIELD_QUERY = `
  query GetProductByMetafield($query: String!) {
    products(first: 1, query: $query) {
      edges {
        node {
          ...ProductFields
        }
      }
    }
  }

  fragment ProductFields on Product {
    id
    title
    handle
    description
    descriptionHtml
    vendor
    productType
    tags
    status
    createdAt
    updatedAt
    publishedAt

    priceRangeV2 {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }

    compareAtPriceRange {
      minVariantCompareAtPrice {
        amount
        currencyCode
      }
      maxVariantCompareAtPrice {
        amount
        currencyCode
      }
    }

    featuredImage {
      url
      altText
      width
      height
    }

    images(first: 20) {
      edges {
        node {
          url
          altText
          width
          height
        }
      }
    }

    variants(first: 100) {
      edges {
        node {
          id
          title
          price
          compareAtPrice
          sku
          barcode
          availableForSale
          inventoryQuantity
          inventoryItem {
            tracked
          }
          selectedOptions {
            name
            value
          }
        }
      }
    }

    # Include the model metafield in response for validation
    metafield(namespace: "custom", key: "model") {
      key
      value
      type
    }

    seo {
      title
      description
    }
  }
`

/**
 * Fetch product from Shopify by model identifier using custom metafield
 *
 * This uses the Admin API's productByIdentifier query with customId to find
 * products by their custom.model metafield value. This is more structured
 * than tag-based search and separates product identification from tagging.
 *
 * @param model - Product model identifier (e.g., "CA99", "GX-7")
 * @returns Product data or null if not found
 * @throws Error if API request fails
 *
 * @example
 * ```typescript
 * const product = await fetchShopifyProductByModel('CA99')
 * if (product) {
 *   console.log(product.title, product.price.display)
 * }
 * ```
 */
export async function fetchShopifyProductByModel(
  model: string
): Promise<ShopifyProductData | null> {

  const normalizedModel = model.toUpperCase().trim()

  console.log(`[Shopify Fetch] Fetching product by model metafield: "${normalizedModel}"`)

  try {
    // Build metafield query string: metafields.custom.model:"VALUE"
    const metafieldQuery = `metafields.custom.model:"${normalizedModel}"`

    // Query using products with metafield filtering
    const data = await shopifyAdminClient.query<{
      products: {
        edges: Array<{
          node: any
        }>
      }
    }>(PRODUCT_BY_METAFIELD_QUERY, {
      query: metafieldQuery
    })

    // Extract first product from edges
    const product = data.products.edges[0]?.node

    if (!product) {
      console.warn(`[Shopify Fetch] No product found with model metafield "${normalizedModel}"`)
      return null
    }

    // Validate that the metafield matches (sanity check)
    if (product.metafield?.value !== normalizedModel) {
      console.warn(
        `[Shopify Fetch] Metafield mismatch: expected "${normalizedModel}", got "${product.metafield?.value}"`
      )
    }

    const transformed = transformShopifyProduct(product)
    console.log(
      `[Shopify Fetch] Successfully fetched "${transformed.title}" via metafield (model: ${normalizedModel})`
    )

    return transformed

  } catch (error) {
    console.error(`[Shopify Fetch] Error fetching by metafield:`, error)
    throw error
  }
}

/**
 * Transform Shopify GraphQL response to simplified format
 *
 * Handles:
 * - Edge/node connection unwrapping
 * - Price formatting
 * - Null safety for optional fields
 *
 * @param shopifyProduct - Raw GraphQL response
 * @returns Simplified product data structure
 */
function transformShopifyProduct(shopifyProduct: any): ShopifyProductData {
  // Price formatting helper
  const formatPrice = (amount: string, currency: string): string => {
    const num = parseFloat(amount)
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(num)
  }

  const minPrice = shopifyProduct.priceRangeV2.minVariantPrice
  const maxPrice = shopifyProduct.priceRangeV2.maxVariantPrice
  const currency = minPrice.currencyCode

  // Format price display
  const minFormatted = formatPrice(minPrice.amount, currency)
  const maxFormatted = formatPrice(maxPrice.amount, currency)
  const priceDisplay = minPrice.amount === maxPrice.amount
    ? minFormatted
    : `${minFormatted} - ${maxFormatted}`

  return {
    id: shopifyProduct.id,
    title: shopifyProduct.title,
    handle: shopifyProduct.handle,
    description: shopifyProduct.description || '',
    descriptionHtml: shopifyProduct.descriptionHtml || '',
    vendor: shopifyProduct.vendor || '',
    productType: shopifyProduct.productType || '',
    tags: shopifyProduct.tags || [],
    status: shopifyProduct.status,

    price: {
      min: minPrice.amount,
      max: maxPrice.amount,
      currency,
      display: priceDisplay,
    },

    compareAtPrice: shopifyProduct.compareAtPriceRange ? {
      min: shopifyProduct.compareAtPriceRange.minVariantCompareAtPrice.amount,
      max: shopifyProduct.compareAtPriceRange.maxVariantCompareAtPrice.amount,
    } : null,

    images: shopifyProduct.images.edges.map((edge: any) => ({
      url: edge.node.url,
      alt: edge.node.altText || '',
      width: edge.node.width,
      height: edge.node.height,
    })),

    featuredImage: shopifyProduct.featuredImage ? {
      url: shopifyProduct.featuredImage.url,
      alt: shopifyProduct.featuredImage.altText || '',
      width: shopifyProduct.featuredImage.width,
      height: shopifyProduct.featuredImage.height,
    } : null,

    variants: shopifyProduct.variants.edges.map((edge: any) => ({
      id: edge.node.id,
      title: edge.node.title,
      price: edge.node.price,
      compareAtPrice: edge.node.compareAtPrice,
      sku: edge.node.sku || '',
      barcode: edge.node.barcode,
      available: edge.node.availableForSale,
      inventoryQuantity: edge.node.inventoryQuantity || 0,
      inventoryTracked: edge.node.inventoryItem?.tracked ?? false,
      options: edge.node.selectedOptions.map((opt: any) => ({
        name: opt.name,
        value: opt.value,
      })),
    })),

    seo: {
      title: shopifyProduct.seo?.title || shopifyProduct.title,
      description: shopifyProduct.seo?.description || shopifyProduct.description || '',
    },

    metafields: {
      model: shopifyProduct.metafield?.value || undefined,
    },

    // Calculate availableForSale from variants (Admin API doesn't have it on Product)
    availableForSale: shopifyProduct.variants.edges.some((edge: any) => edge.node.availableForSale),
    createdAt: shopifyProduct.createdAt,
    updatedAt: shopifyProduct.updatedAt,
    publishedAt: shopifyProduct.publishedAt,
  }
}
