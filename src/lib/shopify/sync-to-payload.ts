/**
 * Shopify to Payload CMS Sync Utility
 *
 * Maps Shopify product data to Payload CMS Product collection format.
 * Automatically syncs data from Shopify using either shopifyProductId or model field.
 *
 * @module sync-to-payload
 *
 * @example
 * ```typescript
 * import { syncShopifyDataToProduct } from '@/lib/shopify/sync-to-payload'
 *
 * // In a Payload hook
 * const updatedData = await syncShopifyDataToProduct(doc)
 *
 * if (updatedData) {
 *   await req.payload.update({
 *     collection: 'products',
 *     id: doc.id,
 *     data: updatedData,
 *     req,
 *   })
 * }
 * ```
 */

import { fetchShopifyProduct, fetchShopifyProductByModel } from './fetch-product'
import type { ShopifyProductData } from './fetch-product'
import type { Product } from '@/payload-types'

/**
 * Shopify group structure (matches collection definition)
 */
export interface ShopifyGroup {
  productId?: string
  handle?: string
  syncStatus?: 'not_synced' | 'synced' | 'pending' | 'error'
  lastSyncedAt?: string
  syncErrors?: Array<{
    timestamp?: string
    operation?: string
    errorMessage?: string
    errorFields?: string
  }>
  autoSync?: boolean
  shopifyStatus?: 'ACTIVE' | 'DRAFT' | 'ARCHIVED'
}

/**
 * Partial product data structure for Payload updates
 * Only includes fields that should be updated from Shopify sync
 */
export type ShopifyDataUpdate = Partial<
  Pick<
    Product,
    'name' | 'description' | 'brand' | 'price' | 'imageUrl' | 'model' | 'variations'
  > & {
    shopify?: Partial<ShopifyGroup>
  }
>

/**
 * Check if a product should sync with Shopify
 *
 * Returns true if the product has either:
 * - shopify.productId (Shopify GID or handle)
 * - model field (for metafield-based lookup)
 *
 * @param product - Payload product document
 * @returns true if product can sync with Shopify
 *
 * @example
 * ```typescript
 * if (shouldSyncProduct(doc)) {
 *   // Perform sync
 * }
 * ```
 */
export function shouldSyncProduct(
  product: Partial<Product> & { shopify?: Partial<ShopifyGroup> }
): boolean {
  return !!(product.shopify?.productId || product.model)
}

/**
 * Extract model identifier from Shopify product metafields
 *
 * Looks for the custom.model metafield value.
 *
 * @param shopifyProduct - Shopify product data
 * @returns Model identifier or empty string if not found
 *
 * @example
 * ```typescript
 * const model = extractModelFromMetafields(shopifyData)
 * // Returns: "CA99" or ""
 * ```
 */
export function extractModelFromMetafields(
  shopifyProduct: ShopifyProductData
): string {
  return shopifyProduct.metafields?.model || ''
}

/**
 * Strip HTML tags from description
 *
 * Converts HTML description to plain text for description field.
 *
 * @param html - HTML string
 * @returns Plain text string
 */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim()
}

/**
 * Format Shopify price for display
 *
 * Formats a Shopify price object to a currency string.
 *
 * @param price - Shopify price object with min/max/currency
 * @returns Formatted price string (e.g., "$6,999.00" or "$6,999 - $8,999")
 *
 * @example
 * ```typescript
 * const priceDisplay = formatShopifyPrice({
 *   min: '6999.00',
 *   max: '6999.00',
 *   currency: 'USD'
 * })
 * // Returns: "$6,999.00"
 * ```
 */
export function formatShopifyPrice(price: {
  min: string
  max: string
  currency: string
}): string {
  const minPrice = parseFloat(price.min)
  const maxPrice = parseFloat(price.max)

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: price.currency || 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  if (minPrice === maxPrice) {
    return formatter.format(minPrice)
  }

  return `${formatter.format(minPrice)} - ${formatter.format(maxPrice)}`
}

/**
 * Sync Shopify product data to Payload CMS format
 *
 * Fetches product data from Shopify and maps it to the new Products collection structure.
 * Updates both the shopify group (read-only sync data) and main product fields (editable).
 * Handles both ID/handle and model-based lookups gracefully.
 *
 * @param product - Payload product document (must have shopify.productId or model)
 * @returns Partial product data to update, or null if no sync needed/possible
 *
 * @example
 * ```typescript
 * // In a Payload afterChange hook
 * hooks: {
 *   afterChange: [
 *     async ({ doc, req, context }) => {
 *       if (context.skipShopifySync) return doc
 *
 *       const updatedData = await syncShopifyDataToProduct(doc)
 *
 *       if (updatedData) {
 *         await req.payload.update({
 *           collection: 'products',
 *           id: doc.id,
 *           data: updatedData,
 *           context: { skipShopifySync: true },
 *           req,
 *         })
 *       }
 *
 *       return doc
 *     }
 *   ]
 * }
 * ```
 *
 * @remarks
 * - Returns null if product not found in Shopify (not an error)
 * - Updates shopify group with sync metadata and errors
 * - Updates main product fields (name, description, price, etc.) - these remain editable
 * - Maps variants to finishes array with extended Shopify data
 * - Extracts model from custom.model metafield if present
 */
export async function syncShopifyDataToProduct(
  product: Partial<Product> & { shopify?: Partial<ShopifyGroup> }
): Promise<ShopifyDataUpdate | null> {
  // Check if sync is needed
  if (!shouldSyncProduct(product)) {
    console.log('[Shopify Sync] No shopify.productId or model field - skipping sync')
    return null
  }

  let shopifyData: ShopifyProductData | null = null

  try {
    // STRATEGY 1: Fetch by shopify.productId (ID or handle)
    if (product.shopify?.productId) {
      console.log(`[Shopify Sync] Fetching by ID/handle: ${product.shopify.productId}`)
      shopifyData = await fetchShopifyProduct(product.shopify.productId)
    }
    // STRATEGY 2: Fetch by model metafield
    else if (product.model) {
      console.log(`[Shopify Sync] Fetching by model: ${product.model}`)
      shopifyData = await fetchShopifyProductByModel(product.model)
    }

    // Product not found in Shopify (not an error - just return error info)
    if (!shopifyData) {
      console.log('[Shopify Sync] Product not found in Shopify')
      return {
        shopify: {
          syncStatus: 'error',
          lastSyncedAt: new Date().toISOString(),
          syncErrors: [
            {
              timestamp: new Date().toISOString(),
              operation: 'update',
              errorMessage: 'Product not found in Shopify',
            },
          ],
        },
      }
    }

    // Successfully fetched - map to Payload format
    console.log(`[Shopify Sync] Successfully fetched: ${shopifyData.title}`)

    // Extract model from metafields
    const extractedModel = extractModelFromMetafields(shopifyData)

    // Map Shopify variants to Payload variations array
    const variations =
      shopifyData.variants.map((variant) => ({
        name: variant.title,
        shopifyVariantId: variant.id,
        price: parseFloat(variant.price) || null,
        compareAtPrice: variant.compareAtPrice ? parseFloat(variant.compareAtPrice) : null,
        sku: variant.sku || null,
        barcode: variant.barcode || null,
        available: variant.available,
        inventoryQuantity: variant.inventoryQuantity || 0,
        imageUrl: (variant as any).image?.url || null,
        options: variant.options.map((opt) => ({
          name: opt.name,
          value: opt.value,
        })),
      })) || []

    // Return update with both shopify group and main product fields
    return {
      // Update main product fields (editable by user)
      name: shopifyData.title,
      description: stripHtml(shopifyData.description || shopifyData.descriptionHtml),
      brand: shopifyData.vendor || null,
      model: extractedModel || product.model || null,
      imageUrl: shopifyData.featuredImage?.url || null,
      price: {
        msrp: parseFloat(shopifyData.price.min) || null,
        currency: (shopifyData.price.currency as 'USD' | 'EUR' | 'GBP' | 'CAD') || 'USD',
      },
      variations: variations.length > 0 ? variations : null,

      // Update shopify sync group (read-only metadata)
      shopify: {
        productId: shopifyData.id,
        handle: shopifyData.handle,
        syncStatus: 'synced',
        lastSyncedAt: new Date().toISOString(),
        shopifyStatus: shopifyData.status,
        syncErrors: [], // Clear any previous errors
      },
    }
  } catch (error) {
    // Handle API errors gracefully
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred during Shopify sync'

    console.error('[Shopify Sync] Error:', errorMessage)

    // Return error info in shopify group
    return {
      shopify: {
        syncStatus: 'error',
        lastSyncedAt: new Date().toISOString(),
        syncErrors: [
          {
            timestamp: new Date().toISOString(),
            operation: 'update',
            errorMessage: errorMessage,
          },
        ],
      },
    }
  }
}
