/**
 * Free-shipping eligibility.
 *
 * US (kawaius.com): free shipping is offered across the shippable catalog, so the
 * Product Hero advertises it unconditionally.
 *
 * Canada (ca.kawaius.com): Kawai Canada only ships free on a short list of portable
 * digital models. Every other model — including anything routed to a dealer — must
 * NOT advertise free shipping.
 *
 * Pure function, no I/O — safe to import from server or client components.
 */

export type ShippingSite = 'us' | 'cad'

/**
 * Models Kawai Canada ships free. Compared in normalized form, so "ES-120",
 * "es 120" and "ES120" all match the same entry.
 */
const CAD_FREE_SHIPPING_MODELS = new Set(['ES60', 'ES120', 'ES920', 'MP7SE'])

/** "ES-120" / " es 120 " → "ES120". The `model` field is editor-entered, so don't trust its formatting. */
function normalizeModel(model: string | null | undefined): string {
  return (model ?? '').toUpperCase().replace(/[^A-Z0-9]/g, '')
}

/**
 * Does this product qualify for the free-shipping value proposition on the given site?
 *
 * Pass `product.model` (the Shopify `custom.model` identity key) — NOT `modelLabel`,
 * which is a display-only override.
 */
export function hasFreeShipping(model: string | null | undefined, site: ShippingSite = 'us'): boolean {
  if (site !== 'cad') return true
  return CAD_FREE_SHIPPING_MODELS.has(normalizeModel(model))
}
