'use server'

import { unstable_cache } from 'next/cache'
import { getPayloadClient } from '@/lib/payload/queries'
import type { NavProduct } from '@/lib/payload/products-navigation'

/**
 * Fetch products for a collection tab in the mega menu.
 * Uses Payload Local API (same query as getProductsByCollectionHandle in queries.ts).
 * Natural-sorted by model name (ES60 before ES120). Cached 5 min, tagged for on-demand revalidation.
 */
export async function getProductsByCollection(handle: string): Promise<NavProduct[]> {
  return unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'products',
        where: {
          'shopifyCollections.handle': { equals: handle },
          status: { equals: 'active' },
          type: { not_equals: 'accessory' },
          'visibility.showInCatalog': { equals: true },
          'shopify.shopifyStatus': { not_equals: 'UNLISTED' },
        },
        select: {
          id: true,
          name: true,
          model: true,
          slug: true,
          type: true,
          category: true,
          imageUrl: true,
          featured: true,
          inventory: { inStock: true },
        },
        depth: 0,
        limit: 50,
        pagination: false,
      })

      return result.docs
        .map((doc) => ({
          id: String(doc.id),
          title: doc.name || doc.model || 'Untitled',
          handle: doc.slug || String(doc.id),
          type: doc.type || 'Other',
          category: doc.category ?? null,
          model: doc.model || null,
          available: doc.inventory?.inStock !== false,
          isFeatured: doc.featured === true,
          collectionIds: [],
          youtubeUrl: null,
          price: { min: 0, max: 0, currency: 'USD', display: '' },
          image: doc.imageUrl
            ? { url: doc.imageUrl, alt: doc.name || doc.model || '', width: 800, height: 600 }
            : null,
        }))
        .sort((a, b) =>
          (a.model ?? a.title).localeCompare(b.model ?? b.title, undefined, { numeric: true, sensitivity: 'base' })
        )
    },
    [`collection-products-${handle}`],
    { tags: [`collection-${handle}`, 'products'], revalidate: 300 }
  )()
}

