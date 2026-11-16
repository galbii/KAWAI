'use server'

import { unstable_cache } from 'next/cache'
import { getPayloadClient, getFeaturedCollections } from '@/lib/payload/queries'
import { buildFeaturedMap } from '@/lib/piano/featured-sort'
import { sortCollectionProducts } from '@/lib/piano/collection-sort'
import { excludeHiddenFrom, type ProductSurface } from '@/lib/products/visibility'
import type { NavProduct } from '@/lib/payload/products-navigation'
import { getSite } from '@/lib/site-context'
import { availableOnSite } from '@/lib/site-availability'

/**
 * Fetch products for a collection tab in the mega menu.
 *
 * Ordered by the shared collection sort (see collection-sort.ts) — the same
 * order the /pianos/<collection-handle> page uses.
 *
 * Cached 5 min; tagged for on-demand revalidation (incl. `collections` so a
 * collection priority/featured change busts this cache too).
 *
 * `surface` picks which per-product visibility flag applies, because this one query
 * feeds two different surfaces: the mega menu's collection tab ('navigation') and
 * the /collections browse grid ('browsers'). It is part of the cache key so the two
 * variants never share an entry.
 *
 * The site (US / CA) is read from the request on the server — never trusted from
 * the client — and is likewise part of the cache key.
 */
export async function getProductsByCollection(
  handle: string,
  surface: ProductSurface = 'navigation',
): Promise<NavProduct[]> {
  const site = await getSite()
  return unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'products',
        where: {
          and: [
            { 'shopifyCollections.handle': { equals: handle } },
            { status: { equals: 'active' } },
            { type: { not_equals: 'accessory' } },
            { 'shopify.shopifyStatus': { not_equals: 'UNLISTED' } },
            excludeHiddenFrom(surface),
            availableOnSite(site),
          ],
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

      const sorted = sortCollectionProducts(result.docs, featuredMap)

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
    [`collection-products-${handle}-${surface}-${site}`],
    { tags: [`collection-${handle}`, 'products', 'collections'], revalidate: 300 },
  )()
}
