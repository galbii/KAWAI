/**
 * Products as the Q4 promotion blocks need them.
 *
 * One shape for all three offers, because all three answer the same shopper
 * question — "does this apply to the piano I want, and what does it cost me?"
 * — and differ only in what the saving is called. Keeping them one type means
 * the three blocks can share a product card without pretending to share a
 * layout.
 */
export interface PromoProduct {
  /** Model identifier, e.g. "CA401". */
  model: string
  /** Display label — modelLabel override if set, else the model. */
  label: string
  /** Full product name, e.g. "Kawai CA401 Digital Piano". */
  name: string
  /** Product slug for the /products/[slug] link. */
  slug: string
  imageUrl: string | null
  /**
   * Published price, or null when the model carries none. Null is meaningful,
   * not missing: across this catalogue an unpriced digital is a discontinued
   * one, so the promotion queries drop them rather than show a blank.
   */
  price: number | null
  /** Which Shopify collection this model belongs to — drives the tab filters. */
  collectionHandle: string | null
  collectionTitle: string | null
}

/** A group of products under one tab. */
export interface PromoGroup {
  /** Shopify collection handle, e.g. "cn-series". */
  handle: string
  /** Tab label, e.g. "CN Series". */
  title: string
  products: PromoProduct[]
}
