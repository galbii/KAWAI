/**
 * Sync Collections from Product Data
 *
 * Automatically creates/updates collection documents when products are synced.
 * This ensures collections are always up-to-date with product data.
 *
 * @module sync-collections-from-products
 */

import type { Payload } from 'payload'

interface ShopifyCollectionReference {
  shopifyCollectionId: string
  title: string
  handle: string
  imageUrl?: string | null
}

/**
 * Upsert collections from product's shopifyCollections array
 *
 * Creates new collection documents or updates existing ones based on
 * the collections referenced in a product's shopifyCollections field.
 * Also updates product counts for affected collections.
 *
 * @param productShopifyCollections - Array of collection references from product
 * @param payload - Payload instance (must be passed from hook context)
 *
 * @example
 * ```typescript
 * // In Products afterChange hook
 * await upsertCollectionsFromProduct(
 *   doc.shopifyCollections,
 *   req.payload
 * )
 * ```
 */
export async function upsertCollectionsFromProduct(
  productShopifyCollections: ShopifyCollectionReference[] | null | undefined,
  payload: Payload
): Promise<void> {
  if (!productShopifyCollections || productShopifyCollections.length === 0) {
    console.log('[Collections Sync] No collections to sync')
    return
  }

  console.log(`[Collections Sync] Processing ${productShopifyCollections.length} collections`)

  for (const collectionRef of productShopifyCollections) {
    try {
      // Check if collection already exists
      const { docs: existing } = await payload.find({
        collection: 'collections' as any, // Type assertion needed before type generation
        where: {
          shopifyCollectionId: {
            equals: collectionRef.shopifyCollectionId,
          },
        },
        limit: 1,
      })

      const collectionData = {
        shopifyCollectionId: collectionRef.shopifyCollectionId,
        title: collectionRef.title,
        handle: collectionRef.handle,
        ...(collectionRef.imageUrl !== undefined ? { imageUrl: collectionRef.imageUrl } : {}),
        shopify: {
          syncStatus: 'synced' as const,
          lastSyncedAt: new Date().toISOString(),
        },
      }

      if (existing.length > 0) {
        // Update existing collection
        await payload.update({
          collection: 'collections' as any, // Type assertion needed before type generation
          id: existing[0].id,
          data: collectionData,
          context: { skipCollectionCleanup: true },
        })
        console.log(`[Collections Sync] ✅ Updated collection: ${collectionRef.title}`)
      } else {
        // Create new collection
        await payload.create({
          collection: 'collections' as any, // Type assertion needed before type generation
          data: {
            ...collectionData,
            productCount: 0, // Will be updated by updateCollectionProductCounts
          },
          context: { skipCollectionCleanup: true },
        })
        console.log(`[Collections Sync] ✅ Created collection: ${collectionRef.title}`)
      }
    } catch (error) {
      console.error(`[Collections Sync] ❌ Error syncing collection ${collectionRef.title}:`, error)
    }
  }

  // Update product counts for all affected collections
  await updateCollectionProductCounts(
    productShopifyCollections.map(c => c.shopifyCollectionId),
    payload
  )
}

/**
 * Update product counts for collections
 *
 * Counts active products for each collection and updates the productCount field.
 * Collections with zero products will be cleaned up by the Collections afterChange hook.
 *
 * @param collectionIds - Array of Shopify collection IDs to update
 * @param payload - Payload instance
 */
export async function updateCollectionProductCounts(
  collectionIds: string[],
  payload: Payload
): Promise<void> {
  for (const collectionId of collectionIds) {
    try {
      // Count active products in this collection
      const { totalDocs } = await payload.find({
        collection: 'products',
        where: {
          'shopifyCollections.shopifyCollectionId': {
            equals: collectionId,
          },
          status: {
            equals: 'active',
          },
        },
        limit: 0, // Just get the count
      })

      // Find the collection document
      const { docs: collections } = await payload.find({
        collection: 'collections' as any, // Type assertion needed before type generation
        where: {
          shopifyCollectionId: {
            equals: collectionId,
          },
        },
        limit: 1,
      })

      if (collections.length > 0) {
        await payload.update({
          collection: 'collections' as any, // Type assertion needed before type generation
          id: collections[0].id,
          data: {
            productCount: totalDocs,
          },
          context: { skipCollectionCleanup: totalDocs > 0 }, // Allow cleanup if count is 0
        })
        console.log(`[Collections Sync] Updated product count for collection ${collectionId}: ${totalDocs}`)
      }
    } catch (error) {
      console.error(`[Collections Sync] Error updating product count for ${collectionId}:`, error)
    }
  }
}

/**
 * Recalculate all collection product counts
 *
 * Useful for maintenance or after bulk operations.
 * Can be called from an admin endpoint or script.
 *
 * @param payload - Payload instance
 */
export async function recalculateAllCollectionCounts(payload: Payload): Promise<void> {
  console.log('[Collections Sync] Recalculating all collection product counts...')

  const { docs: collections } = await payload.find({
    collection: 'collections' as any, // Type assertion needed before type generation
    limit: 1000, // Adjust if you have more collections
  })

  for (const collection of collections) {
    await updateCollectionProductCounts([collection.shopifyCollectionId], payload)
  }

  console.log('[Collections Sync] ✅ Finished recalculating all collection counts')
}
