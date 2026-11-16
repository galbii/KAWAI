/**
 * The one ordering for a collection's products — shared by the mega menu's
 * collection pills, the "Other" pill, the /collections browser, and the
 * /pianos/<collection-handle> page, so the same models line up the same way
 * everywhere.
 *
 * Sort contract:
 *  1. Product-flagged `featured` leads — an explicit editor override.
 *  2. Derivatives (limited editions, AURES/ATX/AnyTime variants) sink below the
 *     core lineup — see non-standard-model.ts.
 *  3. Featured-collection boost, then higher `collectionPriority` — see
 *     featured-sort.ts. On a single-collection list this only separates products
 *     that also sit in another featured collection.
 *  4. Model name, natural and hyphen-insensitive: K2, K3, K8, K-200, K-300, K600.
 *     Price is deliberately not a key — unpriced models would fall out of order.
 */

import { compareByFeatured } from './featured-sort'
import { isNonStandardModel } from './non-standard-model'

export interface CollectionSortable {
  featured?: boolean | null
  model?: string | null
  name?: string | null
  shopifyCollections?: { handle?: string | null }[] | null
}

/** "K-200" and "K200" compare as the same model; spacing and hyphens are styling. */
function modelSortKey(product: CollectionSortable): string {
  return (product.model || product.name || '').toLowerCase().replace(/[\s-]+/g, '')
}

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })

/** Natural, hyphen-insensitive model comparison (K8 before K-200). */
export function compareModelNames(a: CollectionSortable, b: CollectionSortable): number {
  return (
    collator.compare(modelSortKey(a), modelSortKey(b)) ||
    collator.compare(a.model || a.name || '', b.model || b.name || '')
  )
}

export function compareCollectionProducts(
  a: CollectionSortable,
  b: CollectionSortable,
  featuredMap: Map<string, number>,
): number {
  const af = a.featured === true
  const bf = b.featured === true
  if (af !== bf) return af ? -1 : 1

  const derivative = Number(isNonStandardModel(a)) - Number(isNonStandardModel(b))
  if (derivative !== 0) return derivative

  return compareByFeatured(a, b, featuredMap) || compareModelNames(a, b)
}

/**
 * Non-mutating sort. `toSortable` adapts shapes that don't carry the raw
 * Payload fields (e.g. NavProduct's `isFeatured` / `collectionIds`).
 */
export function sortCollectionProducts<T>(
  items: T[],
  featuredMap: Map<string, number>,
  toSortable: (item: T) => CollectionSortable = (item) => item as CollectionSortable,
): T[] {
  return items
    .map((item) => ({ item, key: toSortable(item) }))
    .sort((a, b) => compareCollectionProducts(a.key, b.key, featuredMap))
    .map(({ item }) => item)
}
