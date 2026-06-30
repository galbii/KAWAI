import type { PianoCategorySlug } from '@/lib/data/categories'

/**
 * A single rebated product, pre-computed server-side for the /signup rebate
 * showcase. Currency, MSRP anchor, rebate, and final price are all resolved for
 * the active site so the client component only has to render.
 */
export type RebateProduct = {
  /** Model identifier, e.g. "GX-7". */
  model: string
  /** Display label — modelLabel override if set, else the model. */
  label: string
  /** Full product name, e.g. "GX-7 BLAK Grand Piano". */
  name: string
  /** Product slug for the /products/[slug] link. */
  slug: string
  /** Primary product image URL (may be null). */
  imageUrl: string | null
  /** MSRP anchor price the rebate is taken off. */
  msrp: number
  /** Final price after the rebate (msrp − rebate, floored at 0). */
  yourPrice: number
  /** Rebate amount in the active currency. */
  rebate: number
  /** Optional eligibility / finish qualifier, e.g. "Ebony Polish only" or "Finishes: B/W". */
  note?: string
  /** Active currency for this product's pricing. */
  currency: 'USD' | 'CAD'
}

/** Rebated products grouped under one piano category, in display order. */
export type RebateCategory = {
  slug: PianoCategorySlug
  /** Short chip label, e.g. "Grand". */
  label: string
  products: RebateProduct[]
}
