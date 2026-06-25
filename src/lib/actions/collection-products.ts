'use server'

import { unstable_cache } from 'next/cache'
import { getPayloadClient, getFeaturedCollections } from '@/lib/payload/queries'
import { buildFeaturedMap, compareByFeatured } from '@/lib/piano/featured-sort'
import type { NavProduct } from '@/lib/payload/products-navigation'

/**
 * Fetch products for a collection tab in the mega menu.
 *
 * Ordered with the same featured boost used everywhere else (see featured-sort.ts):
 *   1. product `featured` flag (flagged models lead)
 *   2. highest `collectionPriority` among the product's FEATURED collections —
 *      since collectionPriority is per-collection, this only differentiates
 *      products that also belong to another featured collection
 *   3. model name (ES60 before ES120) as the within-collection tiebreak
 *
 * Cached 5 min; tagged for on-demand revalidation (incl. `collections` so a
 * collection priority/featured change busts this cache too).
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
          shopifyCollections: { handle: true },
        },
        depth: 0,
        limit: 50,
        pagination: false,
      })

      const featuredMap = buildFeaturedMap(await getFeaturedCollections())

      const sorted = [...result.docs].sort((a, b) => {
        // 1. product-flagged featured leads
        const af = a.featured === true
        const bf = b.featured === true
        if (af !== bf) return af ? -1 : 1
        // 2. featured-collection priority (boosted first, then higher priority)
        const cmp = compareByFeatured(
          { shopifyCollections: a.shopifyCollections ?? null },
          { shopifyCollections: b.shopifyCollections ?? null },
          featuredMap,
        )
        if (cmp !== 0) return cmp
        // 3. model name (numeric) tiebreak
        return String(a.model ?? a.name ?? '').localeCompare(
          String(b.model ?? b.name ?? ''),
          undefined,
          { numeric: true, sensitivity: 'base' },
        )
      })

      return sorted.map((doc) => ({
        id: String(doc.id),
        title: doc.name || doc.model || 'Untitled',
        handle: doc.slug || String(doc.id),
        type: doc.type || 'Other',
        category: doc.category ?? null,
        model: doc.model || null,
        available: doc.inventory?.inStock !== false,
        isFeatured: doc.featured === true,
        collectionIds: (doc.shopifyCollections ?? [])
          .map((c) => c?.handle)
          .filter((h): h is string => Boolean(h)),
        youtubeUrl: null,
        price: { min: 0, max: 0, currency: 'USD', display: '' },
        image: doc.imageUrl
          ? { url: doc.imageUrl, alt: doc.name || doc.model || '', width: 800, height: 600 }
          : null,
      }))
    },
    [`collection-products-${handle}`],
    { tags: [`collection-${handle}`, 'products', 'collections'], revalidate: 300 },
  )()
}
