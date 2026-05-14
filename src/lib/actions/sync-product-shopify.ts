'use server'

import { getPayload } from 'payload'
import config from '@/payload.config'
import { syncShopifyDataToProduct } from '@/lib/shopify/sync-to-payload'

/**
 * Server actions for syncing Payload CMS products with Shopify.
 *
 * Individual sync (`syncProductWithShopify`):
 *   - Fetches US product data via Admin API (by shopify.productId GID or model metafield)
 *   - In parallel, fetches CA pricing via `fetchCAPricing` (CA Admin API, handle-based)
 *   - Writes price, priceCAD, variations (with priceCAD/compareAtPriceCAD per variant),
 *     and all other Shopify-owned fields to Payload
 *   - Guards against hook loops with context.skipShopifySync
 *
 * Bulk sync (`bulkSyncProductsWithShopify`):
 *   - Iterates a list of Payload product IDs and calls syncProductWithShopify for each
 *   - Sequential — use the /api/products/bulk-sync-from-shopify endpoint for a
 *     faster batched sync (fetches all Shopify products in one pass, 5 concurrent)
 */

export interface SyncProductResult {
  success: boolean
  message: string
  error?: string
  product?: {
    id: string
    name: string
    slug: string
    updatedAt: string
  }
}

/** Sync one product by its Payload document ID. */
export async function syncProductWithShopify(
  productId: string
): Promise<SyncProductResult> {
  console.log(`[Sync Product] Starting sync for product ID: ${productId}`)

  try {
    // Get Payload instance
    const payload = await getPayload({ config })

    // Find the product by ID
    const product = await payload.findByID({
      collection: 'products',
      id: productId,
      depth: 0,
    })

    if (!product) {
      console.error(`[Sync Product] Product not found: ${productId}`)
      return {
        success: false,
        message: 'Product not found',
        error: 'The specified product does not exist in the database',
      }
    }

    console.log(`[Sync Product] Found product: "${product.name}" (slug: ${product.slug})`)

    // Check if product has Shopify identifier
    const shopifyIdentifier = product.shopify?.productId || product.model

    if (!shopifyIdentifier) {
      console.error(
        `[Sync Product] Product "${product.name}" has no Shopify identifier (shopify.productId or model field)`
      )
      return {
        success: false,
        message: 'Cannot sync product - missing Shopify identifier',
        error: 'Product must have a shopify.productId or model field to sync with Shopify',
      }
    }

    console.log(`[Sync Product] Using Shopify identifier: "${shopifyIdentifier}"`)

    // Use the sync utility to fetch and map Shopify data
    const syncedData = await syncShopifyDataToProduct(product as any)

    if (!syncedData) {
      console.error('[Sync Product] Sync utility returned no data')
      return {
        success: false,
        message: 'Failed to sync product data',
        error: 'No data returned from Shopify sync utility',
      }
    }

    // Check if sync resulted in an error
    if (syncedData.shopify?.syncStatus === 'error') {
      const errorMessages = syncedData.shopify.syncErrors?.map((e) => e.errorMessage).join(', ')
      console.error('[Sync Product] Sync error:', errorMessages)
      return {
        success: false,
        message: 'Failed to sync product with Shopify',
        error: errorMessages || 'Unknown sync error occurred',
      }
    }

    console.log('[Sync Product] Successfully fetched and mapped Shopify data')

    // Update the product in Payload CMS
    // CRITICAL: Pass context flag to prevent infinite hook loops
    const updatedProduct = await payload.update({
      collection: 'products',
      id: productId,
      data: syncedData as any,
      context: {
        skipShopifySync: true, // Prevent triggering Shopify sync hooks
        skipRevalidation: true, // Prevent revalidation during sync
      },
    })

    console.log(`[Sync Product] Successfully synced product "${updatedProduct.name}"`)

    return {
      success: true,
      message: `Successfully synced product with Shopify: ${updatedProduct.name}`,
      product: {
        id: updatedProduct.id as string,
        name: updatedProduct.name as string,
        slug: updatedProduct.slug as string,
        updatedAt: new Date(updatedProduct.updatedAt as string).toISOString(),
      },
    }
  } catch (error) {
    console.error('[Sync Product] Unexpected error during sync:', error)

    return {
      success: false,
      message: 'An unexpected error occurred while syncing with Shopify',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

/**
 * Sync a list of products by Payload document ID (sequential).
 * For full-catalog re-sync prefer the /api/products/bulk-sync-from-shopify
 * endpoint which processes all Shopify products in batched parallel passes.
 */
export async function bulkSyncProductsWithShopify(
  productIds: string[]
): Promise<{ results: SyncProductResult[]; summary: { success: number; failed: number } }> {
  console.log(`[Bulk Sync] Starting bulk sync for ${productIds.length} products`)

  const results: SyncProductResult[] = []
  let successCount = 0
  let failedCount = 0

  for (const productId of productIds) {
    const result = await syncProductWithShopify(productId)
    results.push(result)

    if (result.success) {
      successCount++
    } else {
      failedCount++
    }
  }

  console.log(`[Bulk Sync] Completed: ${successCount} succeeded, ${failedCount} failed`)

  return {
    results,
    summary: {
      success: successCount,
      failed: failedCount,
    },
  }
}
