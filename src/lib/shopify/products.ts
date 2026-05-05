/**
 * Shopify Product Utilities
 *
 * High-level functions for fetching and transforming Shopify product data
 * Integrates with existing KAWAI utilities and media optimization
 *
 * @example
 * ```typescript
 * import { getProducts, getProductByHandle } from '@/lib/shopify/products'
 *
 * const products = await getProducts({ first: 10 })
 * const product = await getProductByHandle('kawai-gx-7')
 * ```
 */

import { unstable_cache } from 'next/cache'
import { shopifyClient } from './client'
import {
  GET_PRODUCTS,
  GET_PRODUCT_BY_HANDLE,
  GET_PRODUCT_BY_ID,
  GET_COLLECTION_PRODUCTS,
  GET_AVAILABLE_PRODUCTS,
  GET_PRODUCTS_BY_TYPE,
  SEARCH_PRODUCTS,
  GET_PRODUCTS_MINIMAL,
} from './queries'
import type {
  Product,
  ShopifyProduct,
  ProductsResponse,
  ProductResponse,
  CollectionResponse,
  ProductsQueryVariables,
  ProductQueryVariables,
  CollectionQueryVariables,
  ShopifyRequestOptions,
  Metafield,
  ProductImage,
  ProductVariant,
  ShopifyGID,
} from './types'
import { formatPrice } from '../utils'
import { fetchShopifyProductByModel, type ShopifyProductData } from './fetch-product'

// ============================================================================
// Data Transformation
// ============================================================================

/**
 * Extract numeric ID from Shopify GID
 *
 * @example
 * extractId('gid://shopify/Product/123456') // '123456'
 */
export function extractId(gid: ShopifyGID | string): string {
  return gid.split('/').pop() || gid
}

/**
 * Parse metafields into a key-value object
 */
function parseMetafields(metafields: (Metafield | null)[]): Record<string, unknown> {
  const metadata: Record<string, unknown> = {}

  metafields.forEach(field => {
    if (!field) return

    try {
      // Try to parse JSON values
      if (field.type === 'json' || field.type === 'list.single_line_text_field') {
        metadata[field.key] = JSON.parse(field.value)
      } else if (field.type === 'number_integer' || field.type === 'number_decimal') {
        metadata[field.key] = Number(field.value)
      } else if (field.type === 'boolean') {
        metadata[field.key] = field.value === 'true'
      } else {
        metadata[field.key] = field.value
      }
    } catch {
      // If parsing fails, store as string
      metadata[field.key] = field.value
    }
  })

  return metadata
}

/**
 * Transform Admin API product data to Storefront API format
 *
 * The Admin API and Storefront API have slightly different response structures.
 * This helper normalizes Admin API responses to match the Storefront API format
 * that the rest of the application expects.
 *
 * @param adminProduct - Product data from Admin API
 * @returns Product in Storefront API format
 */
function transformAdminProductToStorefront(adminProduct: ShopifyProductData): Product {
  // Map Admin API structure to Storefront API structure
  const minPrice = parseFloat(adminProduct.price.min)
  const maxPrice = parseFloat(adminProduct.price.max)
  const currency = adminProduct.price.currency

  return {
    id: extractId(adminProduct.id),
    title: adminProduct.title,
    handle: adminProduct.handle,
    description: adminProduct.description,
    descriptionHtml: adminProduct.descriptionHtml,
    type: adminProduct.productType,
    vendor: adminProduct.vendor,
    tags: adminProduct.tags,
    available: adminProduct.availableForSale,
    createdAt: new Date(adminProduct.createdAt),
    updatedAt: new Date(adminProduct.updatedAt),
    price: {
      min: minPrice,
      max: maxPrice,
      currency,
      display: minPrice === maxPrice
        ? formatPrice(minPrice)
        : `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`,
    },
    image: adminProduct.featuredImage ? {
      url: adminProduct.featuredImage.url,
      alt: adminProduct.featuredImage.alt,
      width: adminProduct.featuredImage.width,
      height: adminProduct.featuredImage.height,
    } : null,
    images: adminProduct.images.map(img => ({
      url: img.url,
      alt: img.alt,
      width: img.width,
      height: img.height,
    })),
    variants: adminProduct.variants.map(variant => ({
      id: extractId(variant.id),
      title: variant.title,
      sku: variant.sku,
      available: variant.available,
      price: parseFloat(variant.price),
      compareAtPrice: variant.compareAtPrice ? parseFloat(variant.compareAtPrice) : null,
      inventoryTracked: variant.inventoryTracked ?? false,
      image: null, // Admin API doesn't include variant images in this query
    })),
    ownersManualUrl: adminProduct.metafields?.ownersManual ?? null,
    metadata: {
      model: adminProduct.metafields?.model,
    },
  }
}

/**
 * Transform Shopify product to simplified domain model
 */
export function transformProduct(shopifyProduct: ShopifyProduct): Product {
  // Extract price range
  const minPrice = parseFloat(shopifyProduct.priceRange.minVariantPrice.amount)
  const maxPrice = parseFloat(shopifyProduct.priceRange.maxVariantPrice.amount)
  const currency = shopifyProduct.priceRange.minVariantPrice.currencyCode

  // Get primary image
  const primaryImage = shopifyProduct.images.edges[0]?.node || null
  const image = primaryImage
    ? {
        url: primaryImage.url,
        alt: primaryImage.altText || shopifyProduct.title,
        width: primaryImage.width || 0,
        height: primaryImage.height || 0,
      }
    : null

  // Get all images
  const images = shopifyProduct.images.edges.map(edge => ({
    url: edge.node.url,
    alt: edge.node.altText || shopifyProduct.title,
    width: edge.node.width || 0,
    height: edge.node.height || 0,
  }))

  // Transform variants
  // Note: Storefront API doesn't expose inventoryItem.tracked field
  // This is only available in Admin API, so we default to false for Storefront API responses
  const variants = shopifyProduct.variants.edges.map(edge => ({
    id: extractId(edge.node.id),
    title: edge.node.title,
    sku: edge.node.sku,
    available: edge.node.availableForSale,
    price: parseFloat(edge.node.price.amount),
    compareAtPrice: edge.node.compareAtPrice
      ? parseFloat(edge.node.compareAtPrice.amount)
      : null,
    inventoryTracked: false, // Storefront API doesn't provide this field - defaults to false
    image: edge.node.image
      ? {
          url: edge.node.image.url,
          alt: edge.node.image.altText || edge.node.title,
        }
      : null,
  }))

  // Parse metadata
  const metadata = parseMetafields(shopifyProduct.metafields)

  return {
    id: extractId(shopifyProduct.id),
    title: shopifyProduct.title,
    handle: shopifyProduct.handle,
    description: shopifyProduct.description,
    descriptionHtml: shopifyProduct.descriptionHtml,
    type: shopifyProduct.productType,
    vendor: shopifyProduct.vendor,
    tags: shopifyProduct.tags,
    available: shopifyProduct.availableForSale,
    createdAt: new Date(shopifyProduct.createdAt),
    updatedAt: new Date(shopifyProduct.updatedAt),
    price: {
      min: minPrice,
      max: maxPrice,
      currency,
      display: minPrice === maxPrice ? formatPrice(minPrice) : `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`,
    },
    image,
    images,
    variants,
    ownersManualUrl: shopifyProduct.metafield_ownermanual?.reference?.url ?? null,
    metadata,
  }
}

// ============================================================================
// Product Fetching Functions
// ============================================================================

/**
 * Get multiple products with optional filtering and pagination
 *
 * @param variables - Query variables (first, after, query, sortKey, reverse)
 * @param options - Request options (cache, revalidate, etc.)
 * @returns Array of transformed products
 *
 * @example
 * ```typescript
 * // Get first 20 products
 * const products = await getProducts({ first: 20 })
 *
 * // Get products sorted by price
 * const products = await getProducts({
 *   first: 10,
 *   sortKey: 'PRICE',
 *   reverse: false
 * })
 *
 * // With custom ISR revalidation
 * const products = await getProducts(
 *   { first: 10 },
 *   { revalidate: 600 } // 10 minutes
 * )
 * ```
 */
export async function getProducts(
  variables: ProductsQueryVariables = {},
  options?: ShopifyRequestOptions
): Promise<Product[]> {
  const data = await shopifyClient.query<ProductsResponse, ProductsQueryVariables>(
    GET_PRODUCTS,
    { first: 20, ...variables },
    options
  )

  return data.products.edges.map(edge => transformProduct(edge.node))
}

/**
 * Get a single product by handle (slug)
 *
 * @param handle - Product handle (URL-friendly slug)
 * @param options - Request options
 * @returns Transformed product or null if not found
 *
 * @example
 * ```typescript
 * const product = await getProductByHandle('kawai-gx-7-grand-piano')
 *
 * if (product) {
 *   console.log(product.title, product.price.display)
 * }
 * ```
 */
export async function getProductByHandle(
  handle: string,
  options?: ShopifyRequestOptions
): Promise<Product | null> {
  const data = await shopifyClient.query<ProductResponse, ProductQueryVariables>(
    GET_PRODUCT_BY_HANDLE,
    { handle },
    options
  )

  return data.product ? transformProduct(data.product) : null
}

/**
 * Get a single product by Shopify ID
 *
 * @param id - Shopify GID (e.g., 'gid://shopify/Product/123456')
 * @param options - Request options
 * @returns Transformed product or null if not found
 *
 * @example
 * ```typescript
 * const product = await getProductById('gid://shopify/Product/10001630003498')
 * ```
 */
export async function getProductById(
  id: ShopifyGID,
  options?: ShopifyRequestOptions
): Promise<Product | null> {
  const data = await shopifyClient.query<ProductResponse, ProductQueryVariables>(
    GET_PRODUCT_BY_ID,
    { id },
    options
  )

  return data.product ? transformProduct(data.product) : null
}

/**
 * Get a single product by model name (using Shopify metafield or tag fallback)
 *
 * PRIMARY: Searches using custom.model metafield via Admin API (more robust)
 * FALLBACK: Searches using product tags via Storefront API (backward compatibility)
 *
 * This enables automatic product lookup without manual handle mapping.
 *
 * @param model - Product model name (e.g., 'CA99', 'GX-7')
 * @param options - Request options
 * @returns Transformed product or null if not found
 *
 * @example
 * ```typescript
 * // Product with custom.model metafield = "CA99" in Shopify
 * const product = await getProductByModel('CA99')
 *
 * if (product) {
 *   console.log(product.title, product.price.display)
 * }
 * ```
 *
 * @see Shopify products should have custom.model metafield set for best performance
 * @see Falls back to tag-based search if metafield lookup fails
 */
export function getProductByModel(
  model: string,
  options?: ShopifyRequestOptions
): Promise<Product | null> {
  const normalizedModel = model.toUpperCase().trim()

  return unstable_cache(
    async () => {
      console.log(`[getProductByModel] Searching for model: "${normalizedModel}"`)

      try {
        // STRATEGY 1: Try metafield-based lookup via Admin API (preferred)
        console.log(`[getProductByModel] Attempting metafield lookup...`)

        const adminProduct = await fetchShopifyProductByModel(normalizedModel)

        if (adminProduct) {
          console.log(
            `[getProductByModel] Found via metafield: "${adminProduct.title}" (model: ${normalizedModel})`
          )

          // Transform Admin API response to match Storefront API format
          return transformAdminProductToStorefront(adminProduct)
        }

        // STRATEGY 2: Fallback to tag-based search via Storefront API
        console.log(`[getProductByModel] Metafield lookup failed, trying tag fallback...`)

        const data = await shopifyClient.query<ProductsResponse, ProductsQueryVariables>(
          SEARCH_PRODUCTS,
          { query: `tag:${normalizedModel}`, first: 1 },
          options
        )

        const foundProduct = data.products.edges[0]?.node || null

        if (foundProduct) {
          console.log(
            `[getProductByModel] Found via tag fallback: "${foundProduct.title}" (tag: ${normalizedModel})`
          )
          return transformProduct(foundProduct)
        }

        console.log(`[getProductByModel] No product found for model "${normalizedModel}"`)
        return null

      } catch (error) {
        console.error(`[getProductByModel] Error:`, error)

        // If Admin API fails, still try tag fallback
        console.log(`[getProductByModel] Admin API error, attempting tag fallback...`)

        try {
          const data = await shopifyClient.query<ProductsResponse, ProductsQueryVariables>(
            SEARCH_PRODUCTS,
            { query: `tag:${normalizedModel}`, first: 1 },
            options
          )

          const foundProduct = data.products.edges[0]?.node || null

          if (foundProduct) {
            console.log(`[getProductByModel] Found via tag fallback after error`)
            return transformProduct(foundProduct)
          }
        } catch (fallbackError) {
          console.error(`[getProductByModel] Tag fallback also failed:`, fallbackError)
        }

        return null
      }
    },
    [`shopify-product-model-${normalizedModel}`],
    { tags: [`shopify-product-model-${normalizedModel}`, 'shopify-products'], revalidate: 3600 }
  )()
}

/**
 * Get products from a collection
 *
 * @param handle - Collection handle
 * @param productsFirst - Number of products to fetch
 * @param options - Request options
 * @returns Array of transformed products
 *
 * @example
 * ```typescript
 * const grandPianos = await getCollectionProducts('grand-pianos', 20)
 * ```
 */
export async function getCollectionProducts(
  handle: string,
  productsFirst: number = 20,
  options?: ShopifyRequestOptions
): Promise<Product[]> {
  const data = await shopifyClient.query<CollectionResponse, CollectionQueryVariables>(
    GET_COLLECTION_PRODUCTS,
    { handle, productsFirst },
    options
  )

  if (!data.collection) {
    return []
  }

  return data.collection.products.edges.map(edge => transformProduct(edge.node))
}

/**
 * Get only available products
 *
 * @param variables - Query variables
 * @param options - Request options
 * @returns Array of available products
 *
 * @example
 * ```typescript
 * const availableProducts = await getAvailableProducts({ first: 50 })
 * ```
 */
export async function getAvailableProducts(
  variables: Omit<ProductsQueryVariables, 'query'> = {},
  options?: ShopifyRequestOptions
): Promise<Product[]> {
  const data = await shopifyClient.query<ProductsResponse>(
    GET_AVAILABLE_PRODUCTS,
    { first: 20, ...variables },
    options
  )

  return data.products.edges.map(edge => transformProduct(edge.node))
}

/**
 * Get products by type
 *
 * @param productType - Product type (e.g., 'Grand Piano', 'Digital Piano')
 * @param variables - Additional query variables
 * @param options - Request options
 * @returns Array of products matching the type
 *
 * @example
 * ```typescript
 * const grandPianos = await getProductsByType('Grand Piano', { first: 30 })
 * const digitalPianos = await getProductsByType('Digital Piano')
 * ```
 */
export async function getProductsByType(
  productType: string,
  variables: Omit<ProductsQueryVariables, 'query'> = {},
  options?: ShopifyRequestOptions
): Promise<Product[]> {
  const data = await shopifyClient.query<ProductsResponse>(
    GET_PRODUCTS_BY_TYPE,
    { productType, first: 20, ...variables },
    options
  )

  return data.products.edges.map(edge => transformProduct(edge.node))
}

/**
 * Search products by query string
 *
 * @param query - Search query
 * @param variables - Additional query variables
 * @param options - Request options
 * @returns Array of matching products
 *
 * @example
 * ```typescript
 * const results = await searchProducts('grand piano')
 * const results = await searchProducts('kawai gx', { first: 10 })
 * ```
 */
export async function searchProducts(
  query: string,
  variables: Omit<ProductsQueryVariables, 'query'> = {},
  options?: ShopifyRequestOptions
): Promise<Product[]> {
  const data = await shopifyClient.query<ProductsResponse>(
    SEARCH_PRODUCTS,
    { query, first: 20, ...variables },
    options
  )

  return data.products.edges.map(edge => transformProduct(edge.node))
}

/**
 * Get minimal product data (for listings)
 * More performant than full product fetching
 *
 * @param variables - Query variables
 * @param options - Request options
 * @returns Array of products with minimal data
 *
 * @example
 * ```typescript
 * const products = await getProductsMinimal({ first: 100 })
 * ```
 */
export async function getProductsMinimal(
  variables: ProductsQueryVariables = {},
  options?: ShopifyRequestOptions
): Promise<
  Array<Pick<Product, 'id' | 'title' | 'handle' | 'type' | 'available' | 'price' | 'image'>>
> {
  const data = await shopifyClient.query<ProductsResponse>(
    GET_PRODUCTS_MINIMAL,
    { first: 50, ...variables },
    options
  )

  return data.products.edges.map(edge => {
    const product = edge.node
    const price = parseFloat(product.priceRange.minVariantPrice.amount)
    const currency = product.priceRange.minVariantPrice.currencyCode
    const primaryImage = product.images.edges[0]?.node || null

    return {
      id: extractId(product.id),
      title: product.title,
      handle: product.handle,
      type: product.productType,
      available: product.availableForSale,
      price: {
        min: price,
        max: price,
        currency,
        display: formatPrice(price),
      },
      image: primaryImage
        ? {
            url: primaryImage.url,
            alt: primaryImage.altText || product.title,
            width: primaryImage.width || 0,
            height: primaryImage.height || 0,
          }
        : null,
    }
  })
}

// ============================================================================
// Product Utility Functions
// ============================================================================

/**
 * Check if a product is on sale (has compare at price)
 */
export function isProductOnSale(product: Product): boolean {
  return product.variants.some(variant => variant.compareAtPrice !== null)
}

/**
 * Get the discount percentage for a product
 */
export function getDiscountPercentage(product: Product): number {
  const variant = product.variants.find(v => v.compareAtPrice !== null)
  if (!variant || !variant.compareAtPrice) return 0

  const discount = ((variant.compareAtPrice - variant.price) / variant.compareAtPrice) * 100
  return Math.round(discount)
}

/**
 * Get the lowest price from variants
 */
export function getLowestPrice(product: Product): number {
  return product.price.min
}

/**
 * Get the highest price from variants
 */
export function getHighestPrice(product: Product): number {
  return product.price.max
}

/**
 * Check if product has multiple variants
 */
export function hasMultipleVariants(product: Product): boolean {
  return product.variants.length > 1
}

/**
 * Get available variants only
 */
export function getAvailableVariants(product: Product) {
  return product.variants.filter(variant => variant.available)
}

/**
 * Group products by type
 */
export function groupProductsByType(products: Product[]): Record<string, Product[]> {
  return products.reduce(
    (acc, product) => {
      const type = product.type || 'Other'
      if (!acc[type]) {
        acc[type] = []
      }
      acc[type].push(product)
      return acc
    },
    {} as Record<string, Product[]>
  )
}

/**
 * Filter products by tag
 */
export function filterProductsByTag(products: Product[], tag: string): Product[] {
  return products.filter(product => product.tags.includes(tag))
}

/**
 * Filter products by availability
 */
export function filterAvailableProducts(products: Product[]): Product[] {
  return products.filter(product => product.available)
}

/**
 * Sort products by price (ascending or descending)
 */
export function sortProductsByPrice(
  products: Product[],
  direction: 'asc' | 'desc' = 'asc'
): Product[] {
  return [...products].sort((a, b) => {
    const priceA = a.price.min
    const priceB = b.price.min
    return direction === 'asc' ? priceA - priceB : priceB - priceA
  })
}

/**
 * Sort products by title alphabetically
 */
export function sortProductsByTitle(products: Product[]): Product[] {
  return [...products].sort((a, b) => a.title.localeCompare(b.title))
}

/**
 * Sort products by creation date (newest first)
 */
export function sortProductsByDate(products: Product[]): Product[] {
  return [...products].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

/**
 * Generate image URL with Shopify CDN transformations
 *
 * @param url - Original Shopify image URL
 * @param options - Transformation options
 * @returns Transformed image URL
 *
 * @example
 * ```typescript
 * const resized = getShopifyImageUrl(product.image.url, { width: 400 })
 * const cropped = getShopifyImageUrl(product.image.url, { width: 400, height: 400, crop: 'center' })
 * ```
 */
export function getShopifyImageUrl(
  url: string,
  options: {
    width?: number
    height?: number
    crop?: 'top' | 'center' | 'bottom' | 'left' | 'right'
    scale?: 2 | 3
  } = {}
): string {
  if (!url) return ''

  try {
    const urlObj = new URL(url)
    const params = new URLSearchParams()

    if (options.width) params.set('width', options.width.toString())
    if (options.height) params.set('height', options.height.toString())
    if (options.crop) params.set('crop', options.crop)
    if (options.scale) params.set('scale', options.scale.toString())

    // Shopify CDN supports appending transformation params
    const transformedUrl = `${urlObj.origin}${urlObj.pathname}`
    return params.toString() ? `${transformedUrl}?${params.toString()}` : transformedUrl
  } catch {
    return url
  }
}

/**
 * Format product price range
 */
export function formatProductPrice(product: Product): string {
  return product.price.display
}

/**
 * Get product type label (user-friendly)
 */
export function getProductTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    'Grand Piano': 'Grand Piano',
    'Upright': 'Upright Piano',
    'Digital Piano': 'Digital Piano',
    'Accessory': 'Accessory',
  }
  return labels[type] || type
}
