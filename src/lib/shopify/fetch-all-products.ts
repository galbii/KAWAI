/**
 * Fetch all products with custom.model metafield from Shopify Admin API
 *
 * This utility fetches all products from Shopify that have a `custom.model` metafield.
 * It handles pagination to retrieve large catalogs and returns a clean list of products
 * suitable for bulk import into Payload CMS.
 *
 * @module fetch-all-products
 */

import { shopifyAdminClient } from './admin-client'
import type { ShopifyProductData } from './fetch-product'

/**
 * GraphQL query to fetch products with custom.model metafield
 *
 * Features:
 * - Fetches up to 250 products per page (Shopify Admin API limit)
 * - Includes pagination support via cursor
 * - Only fetches necessary fields for sync
 * - Filters for products with custom.model metafield
 */
const PRODUCTS_WITH_MODEL_QUERY = `
  query GetProductsWithModels($cursor: String) {
    products(first: 250, after: $cursor, query: "metafields.custom.model:*") {
      edges {
        node {
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
                selectedOptions {
                  name
                  value
                }
              }
            }
          }

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
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`

/**
 * GraphQL response type
 */
interface ProductsWithModelsResponse {
  products: {
    edges: Array<{
      node: any
    }>
    pageInfo: {
      hasNextPage: boolean
      endCursor: string | null
    }
  }
}

/**
 * Fetch all products with custom.model metafield from Shopify
 *
 * This function:
 * 1. Queries Shopify Admin API for products with custom.model metafield
 * 2. Handles pagination automatically (fetches all pages)
 * 3. Transforms raw Shopify data to ShopifyProductData format
 * 4. Returns array of products ready for Payload import
 *
 * @returns Array of Shopify products with model metafields
 * @throws Error if API request fails
 *
 * @example
 * ```typescript
 * const products = await fetchAllShopifyProductsWithModels()
 * console.log(`Found ${products.length} products with models`)
 * products.forEach(p => console.log(p.metafields?.model, p.title))
 * ```
 */
export async function fetchAllShopifyProductsWithModels(): Promise<ShopifyProductData[]> {
  console.log('[Shopify Fetch All] Starting bulk fetch for products with custom.model metafield')

  const allProducts: ShopifyProductData[] = []
  let hasNextPage = true
  let cursor: string | null = null
  let pageCount = 0

  try {
    while (hasNextPage) {
      pageCount++
      console.log(
        `[Shopify Fetch All] Fetching page ${pageCount}${cursor ? ` (cursor: ${cursor.substring(0, 20)}...)` : ''}`
      )

      // Query Shopify with pagination
      const variables: { cursor?: string } | undefined = cursor ? { cursor } : undefined
      const data: ProductsWithModelsResponse = await shopifyAdminClient.query<ProductsWithModelsResponse>(
        PRODUCTS_WITH_MODEL_QUERY,
        variables
      )

      // Extract products from edges
      const products = data.products.edges
        .map((edge) => edge.node)
        .filter((node) => node.metafield?.value) // Ensure product has model metafield

      // Transform each product
      const transformedProducts = products.map((product) => transformShopifyProduct(product))

      allProducts.push(...transformedProducts)

      console.log(
        `[Shopify Fetch All] Page ${pageCount}: fetched ${products.length} products (total: ${allProducts.length})`
      )

      // Check pagination
      hasNextPage = data.products.pageInfo.hasNextPage
      cursor = data.products.pageInfo.endCursor
    }

    console.log(
      `[Shopify Fetch All] ✅ Successfully fetched ${allProducts.length} products with models across ${pageCount} pages`
    )

    return allProducts
  } catch (error) {
    console.error('[Shopify Fetch All] ❌ Error fetching products:', error)
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
 * - Metafield extraction
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
  const priceDisplay =
    minPrice.amount === maxPrice.amount ? minFormatted : `${minFormatted} - ${maxFormatted}`

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

    compareAtPrice: shopifyProduct.compareAtPriceRange
      ? {
          min: shopifyProduct.compareAtPriceRange.minVariantCompareAtPrice.amount,
          max: shopifyProduct.compareAtPriceRange.maxVariantCompareAtPrice.amount,
        }
      : null,

    images: shopifyProduct.images.edges.map((edge: any) => ({
      url: edge.node.url,
      alt: edge.node.altText || '',
      width: edge.node.width,
      height: edge.node.height,
    })),

    featuredImage: shopifyProduct.featuredImage
      ? {
          url: shopifyProduct.featuredImage.url,
          alt: shopifyProduct.featuredImage.altText || '',
          width: shopifyProduct.featuredImage.width,
          height: shopifyProduct.featuredImage.height,
        }
      : null,

    variants: shopifyProduct.variants.edges.map((edge: any) => ({
      id: edge.node.id,
      title: edge.node.title,
      price: edge.node.price,
      compareAtPrice: edge.node.compareAtPrice,
      sku: edge.node.sku || '',
      barcode: edge.node.barcode,
      available: edge.node.availableForSale,
      inventoryQuantity: edge.node.inventoryQuantity || 0,
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
    availableForSale: shopifyProduct.variants.edges.some(
      (edge: any) => edge.node.availableForSale
    ),
    createdAt: shopifyProduct.createdAt,
    updatedAt: shopifyProduct.updatedAt,
    publishedAt: shopifyProduct.publishedAt,
  }
}
