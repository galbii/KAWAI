/**
 * Featured-collection boost + priority sorting for piano product grids.
 *
 * Model (see CLAUDE.md / Collections.ts):
 *  - A collection is "featured" via the `featured` checkbox and ordered by
 *    `collectionPriority` (number, default 0).
 *  - A product belongs to collections via its denormalized `shopifyCollections[]`
 *    array (matched on `handle`).
 *
 * Sort contract:
 *  1. Any product in a featured collection floats above products in no featured
 *     collection — the boost is a boolean, so it applies even when priority is the
 *     default 0.
 *  2. Within the featured group, higher `collectionPriority` ranks first.
 *  3. Products in multiple featured collections use their highest priority.
 *  4. Equal-rank products return 0, so a stable sort preserves prior ordering
 *     (price, sortOrder, etc.) as a tiebreak.
 */

interface FeaturedCollectionInput {
  handle?: string | null
  featured?: boolean | null
  collectionPriority?: number | null
}

interface ProductCollectionRef {
  handle?: string | null
}

interface HasShopifyCollections {
  shopifyCollections?: ProductCollectionRef[] | null
}

/** handle → priority, containing only featured collections. */
export function buildFeaturedMap(
  collections: FeaturedCollectionInput[] | null | undefined,
): Map<string, number> {
  const map = new Map<string, number>()
  for (const c of collections ?? []) {
    if (c.featured && c.handle) {
      map.set(c.handle, c.collectionPriority ?? 0)
    }
  }
  return map
}

/** Whether a product sits in a featured collection, and its best priority. */
export function featuredRank(
  product: HasShopifyCollections,
  featuredMap: Map<string, number>,
): { boosted: boolean; priority: number } {
  let boosted = false
  let priority = 0
  for (const c of product.shopifyCollections ?? []) {
    if (c.handle && featuredMap.has(c.handle)) {
      const p = featuredMap.get(c.handle)!
      if (!boosted || p > priority) priority = p
      boosted = true
    }
  }
  return { boosted, priority }
}

/** Comparator: featured-first, then higher priority first; 0 when equal. */
export function compareByFeatured(
  a: HasShopifyCollections,
  b: HasShopifyCollections,
  featuredMap: Map<string, number>,
): number {
  const ra = featuredRank(a, featuredMap)
  const rb = featuredRank(b, featuredMap)
  if (ra.boosted !== rb.boosted) return ra.boosted ? -1 : 1
  if (ra.boosted) return rb.priority - ra.priority
  return 0
}

/** Stable, non-mutating sort by featured boost then priority. */
export function sortByFeatured<T extends HasShopifyCollections>(
  items: T[],
  featuredMap: Map<string, number>,
): T[] {
  return [...items].sort((a, b) => compareByFeatured(a, b, featuredMap))
}
