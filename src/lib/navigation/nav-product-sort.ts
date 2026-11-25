/**
 * Mega menu ordering for NavProduct lists — a thin adapter over the shared
 * collection sort (src/lib/piano/collection-sort.ts), so a piano tab's "All"
 * view, its collection pills and its "Other" pill all line up the same way.
 *
 * Pure and client-safe: used by the nav server action and by ProductsMegaMenu.
 */

import type { NavProduct } from '@/lib/payload/products-navigation'
import { sortCollectionProducts, type CollectionSortable } from '@/lib/piano/collection-sort'

type SortableNavProduct = Pick<NavProduct, 'isFeatured' | 'model' | 'title' | 'collectionIds'>

/** NavProduct → the raw Payload shape the shared comparator reads. */
export function toCollectionSortable(product: SortableNavProduct): CollectionSortable {
  return {
    featured: product.isFeatured,
    model: product.model,
    name: product.title,
    shopifyCollections: product.collectionIds.map((handle) => ({ handle })),
  }
}

/** Non-mutating sort in the shared collection order. */
export function sortNavProducts<T extends SortableNavProduct>(
  products: T[],
  featuredMap: Map<string, number>,
): T[] {
  return sortCollectionProducts(products, featuredMap, toCollectionSortable)
}

/**
 * A piano tab's "All" view: the whole candidate pool in the shared order, then
 * the first `limit`. Sorting must come before the slice, or the slice would
 * keep DB order (sortOrder / updatedAt) instead of the pill order.
 */
export function buildAllTabProducts<T extends SortableNavProduct>(
  products: T[],
  featuredMap: Map<string, number>,
  limit: number,
): T[] {
  return sortNavProducts(products, featuredMap).slice(0, limit)
}
