/**
 * Shopify Navigation Utilities
 *
 * Server-side functions for fetching navigation data from Shopify
 * Used for building dynamic mega menus and category navigation
 *
 * @example
 * ```typescript
 * import { getProductTypesWithProducts } from '@/lib/shopify/navigation'
 *
 * const navData = await getProductTypesWithProducts()
 * ```
 */

import { shopifyClient } from './client'
import { GET_PRODUCTS_MINIMAL } from './queries'
import type { ProductsResponse, ShopifyRequestOptions, Product } from './types'
import { transformProduct } from './products'

// ============================================================================
// Types
// ============================================================================

/**
 * Product type with associated products for navigation
 */
export interface ProductTypeNav {
  /** Product type name (e.g., "Digital Piano", "Grand Piano") */
  type: string
  /** Number of products in this type */
  count: number
  /** Sample products for preview (limited to first 6) */
  products: Array<Pick<Product, 'id' | 'title' | 'handle' | 'type' | 'available' | 'price' | 'image'>>
}

/**
 * Complete navigation data for products mega menu
 */
export interface ProductsNavigation {
  /** All product types with their products */
  types: ProductTypeNav[]
  /** Total number of products */
  totalProducts: number
  /** Last updated timestamp */
  updatedAt: Date
}

// ============================================================================
// Data Fetching Functions
// ============================================================================

/**
 * Get all unique product types from Shopify
 * Since Storefront API doesn't have productTypes query, we extract from products
 *
 * @param options - Request options (cache, revalidate)
 * @returns Array of unique product type strings
 *
 * @example
 * ```typescript
 * const types = await getProductTypes()
 * // ['Digital Piano', 'Grand Piano', 'Accessory']
 * ```
 */
export async function getProductTypes(
  options?: ShopifyRequestOptions
): Promise<string[]> {
  try {
    // Fetch all products with minimal data
    const data = await shopifyClient.query<ProductsResponse>(
      GET_PRODUCTS_MINIMAL,
      { first: 250 }, // Max products to scan for types
      options
    )

    // Extract unique product types
    const types = new Set<string>()

    data.products.edges.forEach(({ node }) => {
      if (node.productType && node.productType.trim()) {
        types.add(node.productType.trim())
      }
    })

    // Convert to array and sort alphabetically
    return Array.from(types).sort()
  } catch (error) {
    console.error('[Shopify Navigation] Failed to fetch product types:', error)
    return []
  }
}

/**
 * Get product types with sample products for navigation
 * Optimized for mega menu display with product previews
 *
 * @param options - Request options
 * @returns Product types with associated products
 *
 * @example
 * ```typescript
 * const navData = await getProductTypesWithProducts()
 *
 * navData.types.forEach(({ type, count, products }) => {
 *   console.log(`${type}: ${count} products`)
 *   products.forEach(product => console.log(`  - ${product.title}`))
 * })
 * ```
 */
export async function getProductTypesWithProducts(
  options?: ShopifyRequestOptions
): Promise<ProductsNavigation> {
  try {
    // Fetch all products with minimal data
    const data = await shopifyClient.query<ProductsResponse>(
      GET_PRODUCTS_MINIMAL,
      { first: 250 }, // Scan up to 250 products
      options
    )

    // Group products by type
    const typeMap = new Map<string, typeof data.products.edges>()

    data.products.edges.forEach((edge) => {
      const productType = edge.node.productType?.trim() || 'Other'

      if (!typeMap.has(productType)) {
        typeMap.set(productType, [])
      }

      typeMap.get(productType)?.push(edge)
    })

    // Transform to navigation structure
    const types: ProductTypeNav[] = Array.from(typeMap.entries())
      .map(([type, edges]) => {
        // Get first 6 products for preview
        const sampleProducts = edges.slice(0, 6).map(({ node }) => {
          const price = parseFloat(node.priceRange.minVariantPrice.amount)
          const currency = node.priceRange.minVariantPrice.currencyCode
          const primaryImage = node.images.edges[0]?.node || null

          return {
            id: node.id.split('/').pop() || node.id,
            title: node.title,
            handle: node.handle,
            type: node.productType || 'Other',
            available: node.availableForSale,
            price: {
              min: price,
              max: price,
              currency,
              display: `$${price.toFixed(2)}`,
            },
            image: primaryImage
              ? {
                  url: primaryImage.url,
                  alt: primaryImage.altText || node.title,
                  width: primaryImage.width || 0,
                  height: primaryImage.height || 0,
                }
              : null,
          }
        })

        return {
          type,
          count: edges.length,
          products: sampleProducts,
        }
      })
      // Sort by type name alphabetically
      .sort((a, b) => a.type.localeCompare(b.type))

    return {
      types,
      totalProducts: data.products.edges.length,
      updatedAt: new Date(),
    }
  } catch (error) {
    console.error('[Shopify Navigation] Failed to fetch products navigation:', error)
    return {
      types: [],
      totalProducts: 0,
      updatedAt: new Date(),
    }
  }
}

/**
 * Get products by type for navigation display
 * Fetches more detailed product data for a specific type
 *
 * @param productType - Product type to fetch
 * @param limit - Maximum number of products to return (default: 12)
 * @param options - Request options
 * @returns Array of products
 *
 * @example
 * ```typescript
 * const digitalPianos = await getProductsByTypeForNav('Digital Piano', 12)
 * ```
 */
export async function getProductsByTypeForNav(
  productType: string,
  limit: number = 12,
  options?: ShopifyRequestOptions
): Promise<Array<Pick<Product, 'id' | 'title' | 'handle' | 'type' | 'available' | 'price' | 'image'>>> {
  try {
    // Use product type query filter
    const query = `product_type:"${productType}"`

    const data = await shopifyClient.query<ProductsResponse>(
      GET_PRODUCTS_MINIMAL,
      { first: limit, query },
      options
    )

    return data.products.edges.map(({ node }) => {
      const price = parseFloat(node.priceRange.minVariantPrice.amount)
      const currency = node.priceRange.minVariantPrice.currencyCode
      const primaryImage = node.images.edges[0]?.node || null

      return {
        id: node.id.split('/').pop() || node.id,
        title: node.title,
        handle: node.handle,
        type: node.productType || 'Other',
        available: node.availableForSale,
        price: {
          min: price,
          max: price,
          currency,
          display: `$${price.toFixed(2)}`,
        },
        image: primaryImage
          ? {
              url: primaryImage.url,
              alt: primaryImage.altText || node.title,
              width: primaryImage.width || 0,
              height: primaryImage.height || 0,
            }
          : null,
      }
    })
  } catch (error) {
    console.error(`[Shopify Navigation] Failed to fetch products for type "${productType}":`, error)
    return []
  }
}

/**
 * Format product type name for display
 * Handles common variations and formatting
 *
 * @param type - Raw product type string
 * @returns Formatted type name
 *
 * @example
 * ```typescript
 * formatProductType('digital-piano') // 'Digital Piano'
 * formatProductType('GRAND_PIANO') // 'Grand Piano'
 * ```
 */
export function formatProductType(type: string): string {
  if (!type) return 'Other'

  // Replace underscores and hyphens with spaces
  let formatted = type.replace(/[_-]/g, ' ')

  // Capitalize each word
  formatted = formatted
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')

  return formatted
}

/**
 * Get URL-friendly slug for product type
 *
 * @param type - Product type name
 * @returns URL slug
 *
 * @example
 * ```typescript
 * getProductTypeSlug('Digital Piano') // 'digital-piano'
 * getProductTypeSlug('Grand Piano & Upright') // 'grand-piano-upright'
 * ```
 */
export function getProductTypeSlug(type: string): string {
  return type
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
