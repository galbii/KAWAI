/**
 * Free-shipping eligibility.
 *
 * Only digital pianos ship free — `product.type` (the read-only "Shopify Data" tab
 * field, normalized from Shopify `productType`) must be "digital". Grands, uprights,
 * hybrids, Shigeru, and accessories are dealer-delivered or freight, so they must NOT
 * advertise free shipping on either site.
 *
 * US (kawaius.com): every digital model ships free.
 *
 * Canada (ca.kawaius.com): Kawai Canada ships free on a shorter list of portable
 * digital models, so CA narrows the digital set further.
 *
 * Pure function, no I/O — safe to import from server or client components.
 */

import { isDigitalProduct } from '@/lib/product-type'

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

export interface FreeShippingProduct {
  /**
   * `product.type` — the normalized Shopify product type on the "Shopify Data" tab.
   * Anything other than "digital" is ineligible.
   */
  type: string | null | undefined
  /**
   * `product.model` (the Shopify `custom.model` identity key) — NOT `modelLabel`,
   * which is a display-only override. Only consulted for the CA model list.
   */
  model: string | null | undefined
}

/**
 * Does this product qualify for the free-shipping value proposition on the given site?
 */
export function hasFreeShipping(product: FreeShippingProduct, site: ShippingSite = 'us'): boolean {
  if (!isDigitalProduct(product.type)) return false
  if (site !== 'cad') return true
  return CAD_FREE_SHIPPING_MODELS.has(normalizeModel(product.model))
}
