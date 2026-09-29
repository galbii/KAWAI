/**
 * Shared "add a variant to the persistent cart" routine.
 *
 * Single implementation of the cart write behind every add entry point
 * (AddToCartButton, the product hero's Buy Now). Creates a cart on the first
 * add and stores its ID; otherwise appends to the stored cart and back-fills
 * UTM attributes, so the resulting Order still carries attribution when the
 * cart pre-dates the current paid-traffic session.
 *
 * Browser-only — reads and writes localStorage via cart-storage.
 *
 * @example
 * ```typescript
 * const cart = await addVariantToCart(variant.id)
 * setCartData(cart)
 * openCart()
 * ```
 */

import { createCart, addToCart, updateCartAttributes } from './cart'
import { getCartId, saveCartId } from './cart-storage'
import { getUTMCartAttributes } from './checkout'
import type { SimpleCart, ShopifyGID } from './types'

/**
 * Add a variant to the stored cart, creating one if none exists.
 *
 * @param variantId - Shopify variant ID, with or without the gid:// prefix
 * @param quantity - Units to add (default 1)
 * @returns The updated cart
 */
export async function addVariantToCart(variantId: string, quantity = 1): Promise<SimpleCart> {
  const merchandiseId = (variantId.startsWith('gid://')
    ? variantId
    : `gid://shopify/ProductVariant/${variantId}`) as ShopifyGID

  const cartId = getCartId()

  if (!cartId) {
    const cart = await createCart([{ merchandiseId, quantity }], getUTMCartAttributes())
    saveCartId(cart.id)
    return cart
  }

  const cart = await addToCart(cartId, [{ merchandiseId, quantity }])

  const utmAttrs = getUTMCartAttributes()
  if (utmAttrs.length > 0) {
    updateCartAttributes(cartId, utmAttrs).catch(() => {})
  }

  return cart
}
