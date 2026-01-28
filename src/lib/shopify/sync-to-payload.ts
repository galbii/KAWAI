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
    'name' | 'description' | 'price' | 'imageUrl' | 'model' | 'variations' | 'type' | 'category' | 'shopifyCollections'
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
 * Map Shopify productType to Payload type field
 *
 * Converts Shopify's productType (e.g., "Digital Piano") to our unified type field values.
 * This enables automatic categorization from Shopify sync.
 *
 * @param shopifyProductType - Shopify product type field value
 * @returns Payload type value ('digital' | 'grand' | 'hybrid' | 'upright' | 'accessory' | 'other')
 *
 * @example
 * ```typescript
 * mapShopifyProductTypeToPayloadType('Digital Piano')  // Returns: 'digital'
 * mapShopifyProductTypeToPayloadType('Grand Piano')    // Returns: 'grand'
 * mapShopifyProductTypeToPayloadType('Piano Bench')    // Returns: 'accessory'
 * mapShopifyProductTypeToPayloadType('Sheet Music')    // Returns: 'other'
 * ```
 */
export function mapShopifyProductTypeToPayloadType(
  shopifyProductType: string
): 'digital' | 'grand' | 'hybrid' | 'upright' | 'accessory' | 'other' {
  const normalized = shopifyProductType.toLowerCase().trim()

  // Piano type mapping (for category field)
  if (normalized.includes('digital')) return 'digital'
  if (normalized.includes('grand')) return 'grand'
  if (normalized.includes('hybrid') || normalized.includes('novus') || normalized.includes('aures')) return 'hybrid'
  if (normalized.includes('upright') || normalized.includes('vertical')) return 'upright'

  // Non-piano products
  if (
    normalized.includes('accessory') ||
    normalized.includes('bench') ||
    normalized.includes('cover') ||
    normalized.includes('stand') ||
    normalized.includes('pedal') ||
    normalized.includes('stool') ||
    normalized.includes('lamp')
  ) return 'accessory'

  // Default: if contains "piano" but no specific type, assume digital
  if (normalized.includes('piano')) return 'digital'

  // Final fallback for everything else
  return 'other'
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

    // Determine if we should create variations array
    // Shopify always returns at least 1 variant, even for products with no variations
    // Single-variant products have title "Default Title" - we should skip these
    const firstVariantTitle = shopifyData.variants[0]?.title?.trim() || ''
    const isDefaultTitle = firstVariantTitle.toLowerCase() === 'default title'
    const hasMultipleVariants = shopifyData.variants.length > 1
    const shouldCreateVariations = hasMultipleVariants || (shopifyData.variants.length === 1 && !isDefaultTitle)

    // Debug logging
    console.log(`[Shopify Sync] Variation detection for "${shopifyData.title}":`, {
      variantCount: shopifyData.variants.length,
      firstVariantTitle,
      isDefaultTitle,
      shouldCreateVariations,
    })

    // Map Shopify variants to Payload variations array (only if truly multi-variant)
    const variations = shouldCreateVariations
      ? shopifyData.variants.map((variant) => ({
          name: variant.title,
          shopifyVariantId: variant.id,
          price: parseFloat(variant.price) || null,
          compareAtPrice: variant.compareAtPrice ? parseFloat(variant.compareAtPrice) : null,
          sku: variant.sku || null,
          barcode: variant.barcode || null,
          available: variant.available,
          inventoryQuantity: variant.inventoryQuantity || 0,
          imageUrl: variant.image?.url || null,
          options: variant.options.map((opt) => ({
            name: opt.name,
            value: opt.value,
          })),
        }))
      : null

    // Map Shopify collections to Payload format
    const shopifyCollections = shopifyData.collections?.map((collection) => ({
      shopifyCollectionId: collection.id,
      title: collection.title,
      handle: collection.handle,
    })) || []

    // Return update with both shopify group and main product fields
    return ({
      // Update main product fields (editable by user)
      name: shopifyData.title ?? undefined,
      description: stripHtml(shopifyData.description || shopifyData.descriptionHtml) ?? undefined,
      // Only update model if we have a non-empty value from Shopify, otherwise keep existing
      model: (extractedModel && extractedModel.trim()) || product.model || undefined,
      // Type comes from Shopify productType
      type: shopifyData.productType || undefined,
      // Category comes from Shopify Standard Product Taxonomy (last part only)
      category: shopifyData.category?.name || undefined,
      // Collections from Shopify
      shopifyCollections,
      imageUrl: shopifyData.featuredImage?.url ?? undefined,
      price: {
        msrp: parseFloat(shopifyData.price.min) || null,
        currency: (shopifyData.price.currency as 'USD' | 'EUR' | 'GBP' | 'CAD') || null,
      },
      variations, // Already null if no true variations exist

      // Update shopify sync group (read-only metadata)
      shopify: {
        productId: shopifyData.id,
        handle: shopifyData.handle,
        syncStatus: 'synced' as const,
        lastSyncedAt: new Date().toISOString(),
        shopifyStatus: shopifyData.status,
        syncErrors: [], // Clear any previous errors
      },
    }) as ShopifyDataUpdate
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
