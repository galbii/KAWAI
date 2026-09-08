/**
 * Product-type predicates.
 *
 * `product.type` is the read-only field on the "Shopify Data" tab, normalized from
 * Shopify `productType` by `mapShopifyProductTypeToPayloadType` into one of:
 * digital | grand | hybrid | upright | accessory | shigeru | other.
 *
 * It is stored as plain text (not an enum), so always compare through these helpers
 * rather than with `===` — casing and stray whitespace are not guaranteed.
 *
 * Pure functions, no I/O — safe to import from server or client components.
 */

/**
 * Digital pianos are the only products Kawai fulfills directly (ship free, accept
 * returns). Everything else — grands, uprights, hybrids, Shigeru, accessories — is
 * dealer-delivered, so the direct-fulfillment value props must not be advertised.
 */
export function isDigitalProduct(type: string | null | undefined): boolean {
  return (type ?? '').trim().toLowerCase() === 'digital'
}
