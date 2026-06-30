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
  /** True MSRP — the compare-at price (variant compareAtPrice), shown struck through. */
  msrp: number
  /** Current selling price the rebate is taken off (min variant price). */
  salePrice: number
  /** Final price after the rebate (salePrice − rebate, floored at 0). */
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

/**
 * On-demand detail for a single rebated model, used by the cinematic rebate
 * model modal. Fetched lazily by slug when the modal opens — kept separate from
 * {@link RebateProduct} so the rebate showcase query stays lean.
 */
export type RebateModelDetail = {
  /** Touch & Action descriptors (Shopify custom.action metafield). */
  action: string[]
  /** Sound & Tone descriptors (Shopify custom.tone metafield). */
  tone: string[]
  /** Connectivity & Features descriptors (Shopify custom.features metafield). */
  features: string[]
  /** A collection "film" to play behind the modal, when one is available. */
  film: { youtubeUrl: string | null; imageUrl: string | null; heading: string | null } | null
  /** Product photo fallback for the background when no collection film exists. */
  productImageUrl: string | null
  /** Product gallery images (Shopify media), for the modal's Details carousel. */
  media: { url: string; alt: string }[]
}
