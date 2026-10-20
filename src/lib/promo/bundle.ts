import type { BundlePromoImage, BundlePromoItem } from '@/components/ui/bundle-promo-popup'
import { normalizeProductPrice, type PricingProduct } from '@/lib/pricing/model'

export type PromoSite = 'us' | 'cad'

/**
 * Shared resolution for the Bundle promo style, used by both the collection
 * Promo Popup tab and the product Promo tab. Both store the same `bundleItems`
 * / `bundleMedia` shape, so the pricing and fallback rules live here once.
 */

/**
 * Whether a promo's `sites` setting allows it on the storefront being served.
 * Legacy promos have no `sites` value and show on both.
 */
export function promoShowsOnSite(sites: unknown, site: PromoSite): boolean {
  return sites === 'both' || sites == null || sites === site
}

/** Upload and relationship fields arrive as an id string until populated */
export function uploadUrl(value: unknown): string | null {
  if (value && typeof value === 'object' && 'url' in value) {
    return (value as { url?: string | null }).url ?? null
  }
  return null
}

export function uploadAlt(value: unknown): string | null {
  if (value && typeof value === 'object' && 'alt' in value) {
    return (value as { alt?: string | null }).alt ?? null
  }
  return null
}

export function asDoc<T extends object>(value: unknown): T | null {
  return value && typeof value === 'object' ? (value as T) : null
}

/** The fields a bundle piece needs off a populated product doc */
export interface PromoProduct extends PricingProduct {
  model?: string | null
  modelLabel?: string | null
  name?: string | null
  slug?: string | null
  imageUrl?: string | null
}

/**
 * A piece's price before and after Shopify. `base` is the catalogue figure a
 * promo's bundle price was authored against (priceCAD / price.msrp); `live` is
 * what the shopper pays today — the synced Shopify price less any compare-at
 * markdown and the active automatic discount, via normalizeProductPrice.
 */
interface PiecePrice {
  base: number | null
  live: number | null
}

/**
 * The CA storefront must never show a US figure. normalizeProductPrice falls
 * back from a variation's CAD price to its US one, so the US fields are blanked
 * before it sees the product — a piece with no CAD price stays unpriced.
 */
function cadOnly(product: PromoProduct): PricingProduct {
  return {
    variations: product.variations?.map((v) => ({ ...v, price: null, compareAtPrice: null })) ?? null,
    priceCAD: product.priceCAD ?? null,
    shopifyDiscountCAD: product.shopifyDiscountCAD ?? null,
  }
}

function piecePrice(row: any, product: PromoProduct, site: PromoSite): PiecePrice {
  const isCad = site === 'cad'
  const override = isCad ? row?.priceOverrideCAD : row?.priceOverride
  // An editor's override is the figure to show, discount or not; 0 hides it
  if (typeof override === 'number') return { base: override, live: override }

  const base = isCad
    ? (product.priceCAD?.price ?? product.priceCAD?.msrp ?? null)
    : (product.price?.msrp ?? null)

  const canonical = normalizeProductPrice(isCad ? cadOnly(product) : product, { site })
  // Several finishes at different prices → the lowest one, as the hero's "from" does
  const tiers = canonical.kind === 'range' ? canonical.min : canonical.tiers
  return { base, live: tiers?.final ?? base }
}

/** Rows paired with their resolved piece and price, unpopulated rows dropped */
function resolvePieces(rows: unknown, site: PromoSite) {
  if (!Array.isArray(rows)) return []

  return rows.flatMap((row: any) => {
    const product = asDoc<PromoProduct>(row?.product)
    if (!product) return []

    const label = row?.label || product.modelLabel || product.model || product.name
    if (!label) return []

    const price = piecePrice(row, product, site)
    const item: BundlePromoItem = {
      label,
      price: price.live,
      imageUrl: uploadUrl(row?.image) ?? product.imageUrl ?? null,
    }
    return [{ item, price }]
  })
}

/**
 * Turns bundleItems rows into showcase pieces. Each row's product must be
 * populated (depth ≥ 1) or the row is dropped.
 *
 * Pricing is site-aware and never mixes currencies: the CA site reads the CAD
 * figures and the CA store's discount only, so a piece with no CA price simply
 * shows no price rather than its US one. Each piece shows its live price — an
 * active Shopify discount lowers it. A price override of 0 hides that piece's
 * price deliberately.
 */
export function resolveBundleItems(rows: unknown, site: PromoSite): BundlePromoItem[] {
  return resolvePieces(rows, site).map((piece) => piece.item)
}

/**
 * Resolves a bundle's pieces and the price to show for it.
 *
 * A stored bundle price is the price of the piece being bought — the rest come
 * free (both promo scripts set it to the piano's price). When Shopify discounts
 * that piece, the bundle price drops by the same amount, so the popup never
 * quotes more than the store charges. A discount on a free piece only shrinks
 * the saving; the shopper still pays for the paid one.
 *
 * The paid piece is the one whose catalogue price equals the stored bundle
 * price. A hand-set figure that matches no piece is left as written, capped at
 * the live separate total so it can never read as dearer than buying apart.
 */
export function resolveBundle(
  rows: unknown,
  bundlePrice: number | null | undefined,
  site: PromoSite,
): { items: BundlePromoItem[]; bundlePrice: number | null } {
  const pieces = resolvePieces(rows, site)
  const items = pieces.map((piece) => piece.item)
  if (typeof bundlePrice !== 'number' || bundlePrice <= 0) return { items, bundlePrice: null }

  const paid = pieces.find((piece) => piece.price.base === bundlePrice)
  if (paid) {
    const discount = Math.max(0, (paid.price.base ?? 0) - (paid.price.live ?? paid.price.base ?? 0))
    return { items, bundlePrice: Math.round((bundlePrice - discount) * 100) / 100 }
  }

  const live = pieces.map((piece) => piece.price.live)
  const separate = live.every((p) => typeof p === 'number' && p > 0)
    ? live.reduce<number>((sum, p) => sum + (p as number), 0)
    : null
  return { items, bundlePrice: separate != null ? Math.min(bundlePrice, separate) : bundlePrice }
}

/** Turns bundleMedia rows into carousel slides, dropping unpopulated uploads */
export function resolveBundleMedia(rows: unknown): BundlePromoImage[] {
  if (!Array.isArray(rows)) return []

  return rows
    .map((row: any): BundlePromoImage | null => {
      const url = uploadUrl(row?.image)
      return url ? { url, alt: uploadAlt(row?.image) } : null
    })
    .filter((image): image is BundlePromoImage => image !== null)
}
