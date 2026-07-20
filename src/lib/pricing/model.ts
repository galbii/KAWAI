/**
 * Canonical product pricing — the single source of truth for "what price do we show?"
 *
 * Every price-rendering surface (hero, cards, grids, rows, accessory renderers) should
 * derive its numbers from {@link normalizeProductPrice} instead of re-deriving compare-at
 * sales, CAD fallbacks, and automatic-discount math locally. Keeping that logic here means
 * a pricing rule changes in ONE place and every screen stays consistent.
 *
 * This module is PURE and server+client safe: it reads only the synced Payload product
 * doc (variations + price/priceCAD + shopifyDiscount/shopifyDiscountCAD). It needs no live
 * Shopify fetch, because the per-variant prices and the active-discount snapshot are already
 * synced onto the document. Callers that DO hold live Shopify variants (the product hero) can
 * pass them via `liveVariants` to override the synced figures with real-time prices.
 *
 * What it intentionally does NOT do: drive cart/checkout totals (those must use the live
 * Shopify cart cost — the discount snapshot can drift and ignores minimum-spend discounts),
 * JSON-LD schema price, or editor-authored marketing prices. See the audit's do-not-unify list.
 */

import { formatPrice } from '@/lib/utils'

export type Site = 'us' | 'cad'

/** Duck-typed product shape — matches the Payload doc but decoupled from the generated type. */
export interface PricingVariation {
  name?: string | null
  /** US-store variant GID — used to scope variant-targeted discounts to finishes. */
  shopifyVariantId?: string | null
  /** CA-store variant GID — same, matched against `shopifyDiscountCAD.entitledVariantIds`. */
  shopifyVariantIdCA?: string | null
  price?: number | null
  compareAtPrice?: number | null
  priceCAD?: number | null
  compareAtPriceCAD?: number | null
}

export interface PricingDiscount {
  title?: string | null
  /** 'percentage' → `value` is a 0–1 fraction; 'fixed' → `value` is an amount off. */
  valueType?: 'percentage' | 'fixed' | null
  value?: number | null
  /** Present ⇒ a discount is active (the sync's signal). */
  discountedPrice?: number | null
  /**
   * Variant GIDs the discount is restricted to (specific finishes). Null/empty =
   * the whole product is discounted. US snapshots hold US GIDs, CAD snapshots CA GIDs.
   */
  entitledVariantIds?: string[] | null
}

export interface PricingProduct {
  variations?: PricingVariation[] | null
  price?: { msrp?: number | null; currency?: string | null } | null
  priceCAD?: { price?: number | null; msrp?: number | null } | null
  shopifyDiscount?: PricingDiscount | null
  shopifyDiscountCAD?: PricingDiscount | null
}

/** One item's three price tiers, high → low. `list` may be null (no MSRP/compare-at). */
export interface PriceTiers {
  /** MSRP / Shopify compare-at — the struck-through figure. Null when there's no markdown. */
  list: number | null
  /** Current selling price, before any automatic discount. */
  sale: number
  /** Price after the active automatic discount (equals `sale` when none applies). */
  final: number
}

export interface CanonicalPrice {
  kind: 'single' | 'range' | 'unavailable'
  currency: string
  /** True when anything is struck: a compare-at markdown OR an automatic discount lowered `final`. */
  onSale: boolean
  /** True specifically when an active automatic Shopify discount lowered the price. */
  isAutoDiscount: boolean
  /** Discount name in Shopify (e.g. "Summer Grand Event"), when a discount is active. */
  discountTitle: string | null
  /** Human-readable amount, e.g. "20% off" / "$500 off", when a discount is active. */
  discountLabel: string | null
  /** Present for `kind: 'single'`. */
  tiers?: PriceTiers
  /** Present for `kind: 'range'` — the lowest and highest priced variations. */
  min?: PriceTiers
  max?: PriceTiers
}

export interface NormalizeOptions {
  site?: Site
  /** Selected finish/variation by name (case-insensitive). Omit/undefined ⇒ range or fallback. */
  selectedVariationName?: string | null
  /**
   * Live Shopify variants ({ name, price, compareAtPrice }) to override the synced snapshot —
   * used by the product hero, which fetches real-time Shopify data. Matched to CMS variations
   * by name (the same title-substring heuristic used across the app).
   */
  liveVariants?: Array<{ name: string; price: number; compareAtPrice: number | null }>
}

/** Apply an automatic discount to a price. Returns the input unchanged if it wouldn't lower it. */
function applyDiscount(sale: number, d: PricingDiscount | null | undefined): number {
  if (!d || d.discountedPrice == null || d.value == null || !isFinite(d.value) || d.value <= 0) {
    return sale
  }
  // valueType was added alongside this feature; older synced docs infer it from the value
  // (percentages are stored as a 0–1 fraction, fixed amounts are ≥ 1).
  const valueType = d.valueType ?? (d.value < 1 ? 'percentage' : 'fixed')
  const raw = valueType === 'percentage' ? sale * (1 - d.value) : sale - d.value
  const final = Math.max(0, Math.round(raw * 100) / 100)
  return final < sale ? final : sale
}

function discountLabel(d: PricingDiscount | null | undefined, currency: string): string | null {
  if (!d || d.discountedPrice == null || d.value == null || !isFinite(d.value) || d.value <= 0) {
    return null
  }
  const valueType = d.valueType ?? (d.value < 1 ? 'percentage' : 'fixed')
  return valueType === 'percentage'
    ? `${Math.round(d.value * 100)}% off`
    : `${formatPrice(d.value, currency)} off`
}

/**
 * Reduce a product to the numbers a UI should display, factoring in site (US/CA), the
 * selected variation, compare-at markdowns, and the active automatic discount.
 */
export function normalizeProductPrice(
  product: PricingProduct,
  opts: NormalizeOptions = {},
): CanonicalPrice {
  const site: Site = opts.site ?? 'us'
  const currency = site === 'cad' ? 'CAD' : product.price?.currency ?? 'USD'
  const discount = (site === 'cad' ? product.shopifyDiscountCAD : product.shopifyDiscount) ?? null
  const variations = product.variations ?? []

  const liveByName = new Map(
    (opts.liveVariants ?? []).map((v) => [v.name.toLowerCase(), v]),
  )

  // Selling price + list (compare-at) for one variation, site-aware, live-override-aware.
  const priceOf = (v: PricingVariation): number | null => {
    const live = v.name ? liveByName.get(v.name.toLowerCase()) : undefined
    if (live) return live.price
    const p = site === 'cad' ? v.priceCAD ?? v.price : v.price
    return typeof p === 'number' ? p : null
  }
  const listOf = (v: PricingVariation): number | null => {
    const live = v.name ? liveByName.get(v.name.toLowerCase()) : undefined
    if (live) return live.compareAtPrice
    const c = site === 'cad' ? v.compareAtPriceCAD ?? v.compareAtPrice : v.compareAtPrice
    return typeof c === 'number' ? c : null
  }

  // A variant-scoped discount only lowers the finishes it targets (Shopify checkout
  // already enforces this — the display must match). Null/empty entitled list =
  // whole-product discount. The product-level fallback (no variation) also only
  // takes a whole-product discount.
  const entitled = discount?.entitledVariantIds
  const discountFor = (v: PricingVariation | null): PricingDiscount | null => {
    if (!discount) return null
    if (!entitled || entitled.length === 0) return discount
    if (!v) return null
    const gid = site === 'cad' ? v.shopifyVariantIdCA : v.shopifyVariantId
    return gid && entitled.includes(gid) ? discount : null
  }

  const tiersFor = (sale: number, list: number | null, v: PricingVariation | null): PriceTiers => {
    const final = applyDiscount(sale, discountFor(v))
    // Only keep the list tier when it's genuinely above the price we'll show.
    return { list: list != null && list > final ? list : null, sale, final }
  }

  const variationTiers = (v: PricingVariation): PriceTiers | null => {
    const sale = priceOf(v)
    return sale == null ? null : tiersFor(sale, listOf(v), v)
  }

  const title = discount?.discountedPrice != null ? discount.title ?? null : null
  const label = discountLabel(discount, currency)

  const single = (tiers: PriceTiers): CanonicalPrice => {
    const auto = tiers.final < tiers.sale
    return {
      kind: 'single',
      currency,
      tiers,
      onSale: (tiers.list != null && tiers.list > tiers.final) || auto,
      isAutoDiscount: auto,
      discountTitle: auto ? title : null,
      discountLabel: auto ? label : null,
    }
  }

  // 1. A specific variation is selected → single price for it.
  if (opts.selectedVariationName) {
    const match = variations.find(
      (v) => (v.name ?? '').toLowerCase() === opts.selectedVariationName!.toLowerCase(),
    )
    const t = match ? variationTiers(match) : null
    if (t) return single(t)
    // selected but unpriced → fall through to fallback below
  }

  // 2. No selection → range across priced variations (or single if they collapse).
  const priced = variations
    .map(variationTiers)
    .filter((t): t is PriceTiers => t !== null)

  if (!opts.selectedVariationName && priced.length > 1) {
    const byFinal = [...priced].sort((a, b) => a.final - b.final)
    const min = byFinal[0]!
    const max = byFinal[byFinal.length - 1]!
    const auto = priced.some((t) => t.final < t.sale)
    if (min.final !== max.final) {
      return {
        kind: 'range',
        currency,
        min,
        max,
        onSale: priced.some((t) => (t.list != null && t.list > t.final) || t.final < t.sale),
        isAutoDiscount: auto,
        discountTitle: auto ? title : null,
        discountLabel: auto ? label : null,
      }
    }
    return single(min) // all variations priced the same → collapse to one figure
  }

  if (priced.length === 1) return single(priced[0]!)

  // 3. No variation prices → product-level MSRP fallback.
  const fallback =
    site === 'cad'
      ? product.priceCAD?.price ?? product.priceCAD?.msrp ?? null
      : product.price?.msrp ?? null
  if (typeof fallback === 'number') return single(tiersFor(fallback, null, null))

  return {
    kind: 'unavailable',
    currency,
    onSale: false,
    isAutoDiscount: false,
    discountTitle: null,
    discountLabel: null,
  }
}
