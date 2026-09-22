import type { Where } from 'payload'

/**
 * Per-surface product visibility flags.
 *
 * These are display-only filters — none of them unpublish a product. A product
 * hidden from every surface below still renders at /products/[slug], still
 * appears in the sitemap, and is still indexed by site search. To take a
 * product down entirely, set `status: 'draft'`; for the greyed-out "Legacy"
 * treatment in the catalog browsers, use Shopify UNLISTED.
 *
 * Centralised here because the flags have to be applied at ~9 separate query
 * sites across src/lib/payload/ and src/lib/actions/ — inlining the where
 * clauses is how those copies drift apart.
 *
 * | Surface          | Field                            | Hides the product from                     |
 * |------------------|----------------------------------|--------------------------------------------|
 * | `navigation`     | `visibility.hideFromNavigation`  | desktop mega menu, mobile products sheet,  |
 * |                  |                                  | nav accessories strip, nav collection tab  |
 * | `browsers`       | `visibility.hideFromBrowsers`    | /pianos, category + series grids,          |
 * |                  |                                  | /accessories, /collections                 |
 * | `collectionPages`| `visibility.hideFromCollectionPages` | /pianos/[collection-handle]            |
 */
export type ProductSurface = 'navigation' | 'browsers' | 'collectionPages'

/**
 * `not_equals: true` rather than `equals: false` on purpose.
 *
 * Products saved before these fields existed have no `visibility.hideFrom*` key
 * in Mongo at all. `equals: false` would silently drop every one of those
 * documents; `not_equals: true` keeps them, so the flags default to "visible"
 * for the entire existing catalog with no backfill migration.
 */
export const HIDE_FROM_NAVIGATION: Where = {
  'visibility.hideFromNavigation': { not_equals: true },
}

export const HIDE_FROM_BROWSERS: Where = {
  'visibility.hideFromBrowsers': { not_equals: true },
}

export const HIDE_FROM_COLLECTION_PAGES: Where = {
  'visibility.hideFromCollectionPages': { not_equals: true },
}

const FRAGMENTS: Record<ProductSurface, Where> = {
  navigation: HIDE_FROM_NAVIGATION,
  browsers: HIDE_FROM_BROWSERS,
  collectionPages: HIDE_FROM_COLLECTION_PAGES,
}

const FIELDS: Record<ProductSurface, 'hideFromNavigation' | 'hideFromBrowsers' | 'hideFromCollectionPages'> = {
  navigation: 'hideFromNavigation',
  browsers: 'hideFromBrowsers',
  collectionPages: 'hideFromCollectionPages',
}

/**
 * The Payload `Where` fragment that excludes products hidden from `surface`.
 * Spread into an `and: [...]` alongside the query's other conditions.
 */
export function excludeHiddenFrom(surface: ProductSurface): Where {
  return FRAGMENTS[surface]
}

/** Shape of the subset of a product document these helpers read. */
type VisibilityBearing = {
  visibility?:
    | {
        hideFromNavigation?: boolean | null | undefined
        hideFromBrowsers?: boolean | null | undefined
        hideFromCollectionPages?: boolean | null | undefined
      }
    | null
    | undefined
}

/**
 * In-memory equivalent of the where fragments, for the few places that filter an
 * already-fetched list rather than adding a database condition.
 *
 * Only a literal `true` hides — a missing group, null, or undefined all mean visible.
 */
export function isHiddenFrom(product: VisibilityBearing, surface: ProductSurface): boolean {
  return product.visibility?.[FIELDS[surface]] === true
}
