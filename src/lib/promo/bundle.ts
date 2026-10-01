import type { BundlePromoImage, BundlePromoItem } from '@/components/ui/bundle-promo-popup'

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
export interface PromoProduct {
  model?: string | null
  modelLabel?: string | null
  name?: string | null
  slug?: string | null
  imageUrl?: string | null
  price?: { msrp?: number | null } | null
  priceCAD?: { price?: number | null; msrp?: number | null } | null
}

/**
 * Turns bundleItems rows into showcase pieces. Each row's product must be
 * populated (depth ≥ 1) or the row is dropped.
 *
 * Pricing is site-aware and never mixes currencies: the CA site reads the CAD
 * figures only, so a piece with no CA price simply shows no price rather than
 * its US one. A price override of 0 hides that piece's price deliberately.
 */
export function resolveBundleItems(rows: unknown, site: PromoSite): BundlePromoItem[] {
  if (!Array.isArray(rows)) return []
  const isCad = site === 'cad'

  return rows
    .map((row: any): BundlePromoItem | null => {
      const product = asDoc<PromoProduct>(row?.product)
      if (!product) return null

      const label = row?.label || product.modelLabel || product.model || product.name
      if (!label) return null

      const price = isCad
        ? (row?.priceOverrideCAD ?? product.priceCAD?.price ?? product.priceCAD?.msrp ?? null)
        : (row?.priceOverride ?? product.price?.msrp ?? null)

      return {
        label,
        price,
        imageUrl: uploadUrl(row?.image) ?? product.imageUrl ?? null,
      }
    })
    .filter((item): item is BundlePromoItem => item !== null)
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
