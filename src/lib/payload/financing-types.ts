import type { PianoCategorySlug } from '@/lib/data/categories'

/**
 * One instrument that qualifies for the financing promotion, resolved
 * server-side for /fall-financing.
 *
 * Deliberately thinner than {@link import('./rebate-types').RebateProduct}: a
 * financing page has no rebate to subtract, so there is one price — the amount
 * a purchase would be financed on — and the monthly figures are derived from it
 * on the client by `planFor()`. Storing payments here would bake the promotion's
 * rates into the ISR'd HTML in a second place.
 */
export interface FinancedProduct {
  /** Model identifier, e.g. "GX-2". */
  model: string
  /** Display label — modelLabel override if set, else the model. */
  label: string
  /** Full product name, e.g. "GX-2 BLAK Grand Piano". */
  name: string
  /** Product slug for the /products/[slug] link. */
  slug: string
  /** Primary product image URL (may be null). */
  imageUrl: string | null
  /**
   * The price a purchase would be financed on, or null when the model carries no
   * published price.
   *
   * Null is a real state, not a gap to filter out: the Shigeru Kawai line is sold
   * by consultation and is deliberately unpriced in the catalogue, yet the
   * promotion names it as eligible. Dropping those models would tell a visitor
   * researching an SK-3 that it does not qualify, which is the opposite of true.
   * The ledger shows them as eligible with the price quoted by the dealer.
   */
  price: number | null
  /** Compare-at price when the model is genuinely marked down, else equal to `price`. */
  msrp: number | null
  /** USD only — the promotion is US-market (see the program's fine print). */
  currency: 'USD'
  /**
   * The Shopify collection this model ranges under (GL Series, GX Series,
   * K Series…), which drives the ledger's second-level filter. Categories are
   * how a shopper thinks about an instrument; series are how Kawai ranges it,
   * and someone who already wants a GX should not scroll fourteen grands.
   */
  collectionHandle: string | null
  collectionTitle: string | null
}

/** Qualifying instruments grouped under one piano category, in display order. */
export interface FinancedCategory {
  slug: PianoCategorySlug
  /** Short chip label, e.g. "Grand". */
  label: string
  products: FinancedProduct[]
}
