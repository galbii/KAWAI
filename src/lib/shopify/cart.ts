/**
 * Shopify Cart Utilities
 *
 * High-level functions for cart management with Shopify Storefront API
 * Includes error handling, retry logic, and simplified cart transformations
 *
 * @example
 * ```typescript
 * import { createCart, addToCart, getCart } from '@/lib/shopify/cart'
 *
 * // Create new cart with items
 * const cart = await createCart([{
 *   merchandiseId: 'gid://shopify/ProductVariant/123456',
 *   quantity: 1
 * }])
 *
 * // Add to existing cart
 * const updatedCart = await addToCart(cart.id, [{
 *   merchandiseId: 'gid://shopify/ProductVariant/789012',
 *   quantity: 2
 * }])
 * ```
 */

import { shopifyClient, shopifyClientCA } from './client'

function getCartClient() {
  if (typeof window !== 'undefined' && window.location.hostname.startsWith('ca.')) {
    return shopifyClientCA
  }
  return shopifyClient
}
import {
  CART_CREATE_MUTATION,
  CART_LINES_ADD_MUTATION,
  CART_LINES_UPDATE_MUTATION,
  CART_LINES_REMOVE_MUTATION,
  GET_CART_QUERY,
  CART_DISCOUNT_CODES_UPDATE_MUTATION,
  CART_ATTRIBUTES_UPDATE_MUTATION,
} from './queries'
import { extractId } from './products'
import type {
  Cart,
  CartInput,
  CartLineInput,
  CartLineUpdateInput,
  CartCreateResponse,
  CartLinesAddResponse,
  CartLinesUpdateResponse,
  CartLinesRemoveResponse,
  CartQueryResponse,
  CartDiscountCodesUpdateResponse,
  CartCreateVariables,
  CartLinesAddVariables,
  CartLinesUpdateVariables,
  CartLinesRemoveVariables,
  CartQueryVariables,
  CartDiscountCodesUpdateVariables,
  SimpleCart,
  SimpleCartLine,
  ShopifyGID,
  ShopifyRequestOptions,
  CartUserError,
} from './types'
import { CartError } from './types'

// ============================================================================
// Error Handling
// ============================================================================

/**
 * Check if cart response has errors
 */
function hasCartErrors(userErrors: CartUserError[]): boolean {
  return userErrors.length > 0
}

/**
 * Throw CartError if errors exist
 */
function throwIfErrors(userErrors: CartUserError[], operation: string): void {
  if (hasCartErrors(userErrors)) {
    const errorMessages = userErrors.map(e => e.message).join(', ')
    throw new CartError(`Cart ${operation} failed: ${errorMessages}`, userErrors)
  }
}

// ============================================================================
// Cart Transformations
// ============================================================================

/**
 * Transform Shopify cart to simplified domain model
 *
 * @param cart - Shopify cart object
 * @returns Simplified cart for frontend use
 */
export function transformCart(cart: Cart): SimpleCart {
  // Transform cart lines
  const lines: SimpleCartLine[] = cart.lines.edges.map(edge => {
    const line = edge.node
    const merchandise = line.merchandise
    const product = merchandise.product

    // Parse attributes into key-value object
    const attributes = line.attributes.reduce(
      (acc, attr) => {
        acc[attr.key] = attr.value
        return acc
      },
      {} as Record<string, string>
    )

    return {
      id: extractId(line.id),
      variantId: extractId(merchandise.id),
      productId: extractId(product.id),
      productTitle: product.title,
      productHandle: product.handle,
      variantTitle: merchandise.title,
      quantity: line.quantity,
      price: parseFloat(line.cost.amountPerQuantity.amount),
      compareAtPrice: line.cost.compareAtAmountPerQuantity
        ? parseFloat(line.cost.compareAtAmountPerQuantity.amount)
        : null,
      total: parseFloat(line.cost.totalAmount.amount),
      image: merchandise.image || product.featuredImage
        ? {
            url: (merchandise.image || product.featuredImage)!.url,
            alt: (merchandise.image || product.featuredImage)!.altText || product.title,
          }
        : null,
      attributes,
    }
  })

  // Calculate discount amount
  const subtotal = parseFloat(cart.cost.subtotalAmount.amount)
  const total = parseFloat(cart.cost.totalAmount.amount)
  const discounts = subtotal - total

  return {
    id: extractId(cart.id),
    checkoutUrl: cart.checkoutUrl,
    lines,
    subtotal,
    total,
    totalQuantity: cart.totalQuantity,
    currency: cart.cost.totalAmount.currencyCode,
    discountCodes: cart.discountCodes.filter(d => d.applicable).map(d => d.code),
    discounts: discounts > 0 ? discounts : 0,
  }
}

// ============================================================================
// Cart Creation
// ============================================================================

/**
 * Create a new cart
 *
 * @param lines - Initial cart lines (optional)
 * @param attributes - Cart attributes (optional)
 * @param options - Request options
 * @returns Simplified cart object
 *
 * @example
 * ```typescript
 * // Create empty cart
 * const emptyCart = await createCart()
 *
 * // Create cart with items
 * const cart = await createCart([{
 *   merchandiseId: 'gid://shopify/ProductVariant/123456',
 *   quantity: 1,
 *   attributes: [{ key: 'color', value: 'black' }]
 * }])
 *
 * // Create cart with buyer info
 * const cart = await createCart([], {
 *   email: 'customer@example.com',
 *   countryCode: 'US'
 * })
 * ```
 */
export async function createCart(
  lines?: CartLineInput[],
  attributes?: Array<{ key: string; value: string }>,
  options?: ShopifyRequestOptions
): Promise<SimpleCart> {
  const input: CartInput = {}

  if (lines && lines.length > 0) {
    input.lines = lines
  }

  if (attributes && attributes.length > 0) {
    input.attributes = attributes
  }

  const data = await getCartClient().query<CartCreateResponse, CartCreateVariables>(
    CART_CREATE_MUTATION,
    { input },
    { cache: 'no-store', revalidate: false, ...options }
  )

  throwIfErrors(data.cartCreate.userErrors, 'creation')

  if (!data.cartCreate.cart) {
    throw new CartError('Failed to create cart: no cart returned')
  }

  return transformCart(data.cartCreate.cart)
}

// ============================================================================
// Cart Updates
// ============================================================================

/**
 * Add items to cart
 *
 * @param cartId - Cart ID (with or without gid:// prefix)
 * @param lines - Lines to add
 * @param options - Request options
 * @returns Updated simplified cart
 *
 * @example
 * ```typescript
 * const updatedCart = await addToCart('abc123', [{
 *   merchandiseId: 'gid://shopify/ProductVariant/123456',
 *   quantity: 2
 * }])
 * ```
 */
export async function addToCart(
  cartId: string,
  lines: CartLineInput[],
  options?: ShopifyRequestOptions
): Promise<SimpleCart> {
  // Ensure cartId has gid:// prefix
  const formattedCartId = cartId.startsWith('gid://')
    ? (cartId as ShopifyGID)
    : (`gid://shopify/Cart/${cartId}` as ShopifyGID)

  const data = await getCartClient().query<CartLinesAddResponse, CartLinesAddVariables>(
    CART_LINES_ADD_MUTATION,
    { cartId: formattedCartId, lines },
    { cache: 'no-store', revalidate: false, ...options }
  )

  throwIfErrors(data.cartLinesAdd.userErrors, 'line addition')

  if (!data.cartLinesAdd.cart) {
    throw new CartError('Failed to add items to cart: no cart returned')
  }

  return transformCart(data.cartLinesAdd.cart)
}

/**
 * Update cart line quantity
 *
 * @param cartId - Cart ID (with or without gid:// prefix)
 * @param lineId - Cart line ID (with or without gid:// prefix)
 * @param quantity - New quantity (use 0 to remove)
 * @param options - Request options
 * @returns Updated simplified cart
 *
 * @example
 * ```typescript
 * // Update quantity
 * const updatedCart = await updateCartLine('abc123', 'line123', 3)
 *
 * // Remove by setting quantity to 0
 * const updatedCart = await updateCartLine('abc123', 'line123', 0)
 * ```
 */
export async function updateCartLine(
  cartId: string,
  lineId: string,
  quantity: number,
  options?: ShopifyRequestOptions
): Promise<SimpleCart> {
  // Ensure IDs have gid:// prefix
  const formattedCartId = cartId.startsWith('gid://')
    ? (cartId as ShopifyGID)
    : (`gid://shopify/Cart/${cartId}` as ShopifyGID)

  const formattedLineId = lineId.startsWith('gid://')
    ? (lineId as ShopifyGID)
    : (`gid://shopify/CartLine/${lineId}` as ShopifyGID)

  const lines: CartLineUpdateInput[] = [
    {
      id: formattedLineId,
      quantity,
    },
  ]

  const data = await getCartClient().query<CartLinesUpdateResponse, CartLinesUpdateVariables>(
    CART_LINES_UPDATE_MUTATION,
    { cartId: formattedCartId, lines },
    { cache: 'no-store', revalidate: false, ...options }
  )

  throwIfErrors(data.cartLinesUpdate.userErrors, 'line update')

  if (!data.cartLinesUpdate.cart) {
    throw new CartError('Failed to update cart line: no cart returned')
  }

  return transformCart(data.cartLinesUpdate.cart)
}

/**
 * Update multiple cart lines at once
 *
 * @param cartId - Cart ID (with or without gid:// prefix)
 * @param lines - Lines to update
 * @param options - Request options
 * @returns Updated simplified cart
 *
 * @example
 * ```typescript
 * const updatedCart = await updateCartLines('abc123', [
 *   { id: 'line123', quantity: 3 },
 *   { id: 'line456', quantity: 1 }
 * ])
 * ```
 */
export async function updateCartLines(
  cartId: string,
  lines: Array<{ id: string; quantity: number }>,
  options?: ShopifyRequestOptions
): Promise<SimpleCart> {
  const formattedCartId = cartId.startsWith('gid://')
    ? (cartId as ShopifyGID)
    : (`gid://shopify/Cart/${cartId}` as ShopifyGID)

  const formattedLines: CartLineUpdateInput[] = lines.map(line => ({
    id: line.id.startsWith('gid://')
      ? (line.id as ShopifyGID)
      : (`gid://shopify/CartLine/${line.id}` as ShopifyGID),
    quantity: line.quantity,
  }))

  const data = await getCartClient().query<CartLinesUpdateResponse, CartLinesUpdateVariables>(
    CART_LINES_UPDATE_MUTATION,
    { cartId: formattedCartId, lines: formattedLines },
    { cache: 'no-store', revalidate: false, ...options }
  )

  throwIfErrors(data.cartLinesUpdate.userErrors, 'lines update')

  if (!data.cartLinesUpdate.cart) {
    throw new CartError('Failed to update cart lines: no cart returned')
  }

  return transformCart(data.cartLinesUpdate.cart)
}

/**
 * Remove items from cart
 *
 * @param cartId - Cart ID (with or without gid:// prefix)
 * @param lineIds - Array of line IDs to remove
 * @param options - Request options
 * @returns Updated simplified cart
 *
 * @example
 * ```typescript
 * const updatedCart = await removeFromCart('abc123', ['line123', 'line456'])
 * ```
 */
export async function removeFromCart(
  cartId: string,
  lineIds: string[],
  options?: ShopifyRequestOptions
): Promise<SimpleCart> {
  const formattedCartId = cartId.startsWith('gid://')
    ? (cartId as ShopifyGID)
    : (`gid://shopify/Cart/${cartId}` as ShopifyGID)

  const formattedLineIds: ShopifyGID[] = lineIds.map(id =>
    id.startsWith('gid://') ? (id as ShopifyGID) : (`gid://shopify/CartLine/${id}` as ShopifyGID)
  )

  const data = await getCartClient().query<CartLinesRemoveResponse, CartLinesRemoveVariables>(
    CART_LINES_REMOVE_MUTATION,
    { cartId: formattedCartId, lineIds: formattedLineIds },
    { cache: 'no-store', revalidate: false, ...options }
  )

  throwIfErrors(data.cartLinesRemove.userErrors, 'line removal')

  if (!data.cartLinesRemove.cart) {
    throw new CartError('Failed to remove items from cart: no cart returned')
  }

  return transformCart(data.cartLinesRemove.cart)
}

// ============================================================================
// Cart Retrieval
// ============================================================================

/**
 * Get cart by ID
 *
 * @param cartId - Cart ID (with or without gid:// prefix)
 * @param options - Request options
 * @returns Simplified cart or null if not found
 *
 * @example
 * ```typescript
 * const cart = await getCart('abc123')
 *
 * if (cart) {
 *   console.log('Cart total:', cart.total)
 * }
 * ```
 */
export async function getCart(
  cartId: string,
  options?: ShopifyRequestOptions
): Promise<SimpleCart | null> {
  const formattedCartId = cartId.startsWith('gid://')
    ? (cartId as ShopifyGID)
    : (`gid://shopify/Cart/${cartId}` as ShopifyGID)

  try {
    const data = await getCartClient().query<CartQueryResponse, CartQueryVariables>(
      GET_CART_QUERY,
      { id: formattedCartId },
      { cache: 'no-store', revalidate: false, ...options }
    )

    if (!data.cart) {
      return null
    }

    return transformCart(data.cart)
  } catch (error) {
    // Cart not found or expired
    if (error instanceof Error && error.message.includes('not found')) {
      return null
    }
    throw error
  }
}

/**
 * Get checkout URL for a cart
 *
 * @param cartId - Cart ID (with or without gid:// prefix)
 * @param options - Request options
 * @returns Checkout URL or null if cart not found
 *
 * @example
 * ```typescript
 * const checkoutUrl = await getCheckoutUrl('abc123')
 * if (checkoutUrl) {
 *   window.location.href = checkoutUrl
 * }
 * ```
 */
export async function getCheckoutUrl(
  cartId: string,
  options?: ShopifyRequestOptions
): Promise<string | null> {
  const cart = await getCart(cartId, options)
  return cart ? cart.checkoutUrl : null
}

// ============================================================================
// Discount Codes
// ============================================================================

/**
 * Apply discount code to cart
 *
 * @param cartId - Cart ID (with or without gid:// prefix)
 * @param discountCode - Discount code to apply
 * @param options - Request options
 * @returns Updated simplified cart
 *
 * @example
 * ```typescript
 * const updatedCart = await applyDiscountCode('abc123', 'SUMMER2024')
 * console.log('Discount applied:', updatedCart.discounts)
 * ```
 */
export async function applyDiscountCode(
  cartId: string,
  discountCode: string,
  options?: ShopifyRequestOptions
): Promise<SimpleCart> {
  const formattedCartId = cartId.startsWith('gid://')
    ? (cartId as ShopifyGID)
    : (`gid://shopify/Cart/${cartId}` as ShopifyGID)

  // Get current discount codes and add new one
  const currentCart = await getCart(cartId, options)
  const existingCodes = currentCart?.discountCodes || []
  const discountCodes = [...existingCodes, discountCode]

  const data = await getCartClient().query<
    CartDiscountCodesUpdateResponse,
    CartDiscountCodesUpdateVariables
  >(
    CART_DISCOUNT_CODES_UPDATE_MUTATION,
    { cartId: formattedCartId, discountCodes },
    { cache: 'no-store', revalidate: false, ...options }
  )

  throwIfErrors(data.cartDiscountCodesUpdate.userErrors, 'discount code update')

  if (!data.cartDiscountCodesUpdate.cart) {
    throw new CartError('Failed to apply discount code: no cart returned')
  }

  return transformCart(data.cartDiscountCodesUpdate.cart)
}

/**
 * Remove discount code from cart
 *
 * @param cartId - Cart ID (with or without gid:// prefix)
 * @param discountCode - Discount code to remove
 * @param options - Request options
 * @returns Updated simplified cart
 *
 * @example
 * ```typescript
 * const updatedCart = await removeDiscountCode('abc123', 'SUMMER2024')
 * ```
 */
export async function removeDiscountCode(
  cartId: string,
  discountCode: string,
  options?: ShopifyRequestOptions
): Promise<SimpleCart> {
  const formattedCartId = cartId.startsWith('gid://')
    ? (cartId as ShopifyGID)
    : (`gid://shopify/Cart/${cartId}` as ShopifyGID)

  // Get current discount codes and remove the specified one
  const currentCart = await getCart(cartId, options)
  const discountCodes = (currentCart?.discountCodes || []).filter(code => code !== discountCode)

  const data = await getCartClient().query<
    CartDiscountCodesUpdateResponse,
    CartDiscountCodesUpdateVariables
  >(
    CART_DISCOUNT_CODES_UPDATE_MUTATION,
    { cartId: formattedCartId, discountCodes },
    { cache: 'no-store', revalidate: false, ...options }
  )

  throwIfErrors(data.cartDiscountCodesUpdate.userErrors, 'discount code removal')

  if (!data.cartDiscountCodesUpdate.cart) {
    throw new CartError('Failed to remove discount code: no cart returned')
  }

  return transformCart(data.cartDiscountCodesUpdate.cart)
}

/**
 * Update cart-level attributes (e.g. UTM attribution data).
 * Merges with existing attributes — Shopify replaces the full attributes array,
 * so callers should pass only keys they intend to set/overwrite.
 *
 * @example
 * ```typescript
 * await updateCartAttributes(cartId, getUTMCartAttributes())
 * ```
 */
export async function updateCartAttributes(
  cartId: string,
  attributes: Array<{ key: string; value: string }>,
  options?: ShopifyRequestOptions
): Promise<SimpleCart> {
  if (attributes.length === 0) {
    const cart = await getCart(cartId, options)
    if (!cart) throw new CartError('Cart not found')
    return cart
  }

  const formattedCartId = cartId.startsWith('gid://')
    ? (cartId as ShopifyGID)
    : (`gid://shopify/Cart/${cartId}` as ShopifyGID)

  interface CartAttributesUpdateResponse {
    cartAttributesUpdate: { cart: Cart | null; userErrors: CartUserError[] }
  }
  interface CartAttributesUpdateVariables {
    cartId: ShopifyGID
    attributes: Array<{ key: string; value: string }>
  }

  const data = await getCartClient().query<CartAttributesUpdateResponse, CartAttributesUpdateVariables>(
    CART_ATTRIBUTES_UPDATE_MUTATION,
    { cartId: formattedCartId, attributes },
    { cache: 'no-store', revalidate: false, ...options }
  )

  throwIfErrors(data.cartAttributesUpdate.userErrors, 'attributes update')

  if (!data.cartAttributesUpdate.cart) {
    throw new CartError('Failed to update cart attributes: no cart returned')
  }

  return transformCart(data.cartAttributesUpdate.cart)
}

/**
 * Clear all discount codes from cart
 *
 * @param cartId - Cart ID (with or without gid:// prefix)
 * @param options - Request options
 * @returns Updated simplified cart
 *
 * @example
 * ```typescript
 * const updatedCart = await clearDiscountCodes('abc123')
 * ```
 */
export async function clearDiscountCodes(
  cartId: string,
  options?: ShopifyRequestOptions
): Promise<SimpleCart> {
  const formattedCartId = cartId.startsWith('gid://')
    ? (cartId as ShopifyGID)
    : (`gid://shopify/Cart/${cartId}` as ShopifyGID)

  const data = await getCartClient().query<
    CartDiscountCodesUpdateResponse,
    CartDiscountCodesUpdateVariables
  >(
    CART_DISCOUNT_CODES_UPDATE_MUTATION,
    { cartId: formattedCartId, discountCodes: [] },
    { cache: 'no-store', revalidate: false, ...options }
  )

  throwIfErrors(data.cartDiscountCodesUpdate.userErrors, 'discount codes clear')

  if (!data.cartDiscountCodesUpdate.cart) {
    throw new CartError('Failed to clear discount codes: no cart returned')
  }

  return transformCart(data.cartDiscountCodesUpdate.cart)
}

// ============================================================================
// Cart Utilities
// ============================================================================

/**
 * Check if cart is empty
 */
export function isCartEmpty(cart: SimpleCart): boolean {
  return cart.lines.length === 0 || cart.totalQuantity === 0
}

/**
 * Get total number of items in cart
 */
export function getCartItemCount(cart: SimpleCart): number {
  return cart.totalQuantity
}

/**
 * Check if cart has discounts applied
 */
export function hasDiscounts(cart: SimpleCart): boolean {
  return cart.discounts > 0
}

/**
 * Find line in cart by product variant ID
 */
export function findLineByVariantId(cart: SimpleCart, variantId: string): SimpleCartLine | null {
  return cart.lines.find(line => line.variantId === variantId) || null
}

/**
 * Calculate savings (difference between subtotal and total)
 */
export function calculateSavings(cart: SimpleCart): number {
  return cart.discounts
}
