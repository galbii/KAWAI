/**
 * Cart Storage Utilities
 *
 * Client-side utilities for persisting cart state in localStorage
 * Handles SSR safety, expiration logic, and fallback strategies
 *
 * @example
 * ```typescript
 * import { saveCartId, getCartId, clearCartId } from '@/lib/shopify/cart-storage'
 *
 * // Save cart ID after creation
 * saveCartId('abc123')
 *
 * // Retrieve cart ID
 * const cartId = getCartId()
 *
 * // Clear cart
 * clearCartId()
 * ```
 */

// ============================================================================
// Configuration
// ============================================================================

/**
 * LocalStorage key for cart ID
 */
const CART_ID_KEY = 'kawai_shopify_cart_id'

/**
 * LocalStorage key for cart expiration timestamp
 */
const CART_EXPIRATION_KEY = 'kawai_shopify_cart_expiration'

/**
 * Cart expiration time (7 days in milliseconds)
 * Matches Shopify's cart expiration policy
 */
const CART_EXPIRATION_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

// ============================================================================
// SSR Safety Helpers
// ============================================================================

/**
 * Check if we're in a browser environment
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined'
}

/**
 * Check if localStorage is available and accessible
 */
function isLocalStorageAvailable(): boolean {
  if (!isBrowser()) {
    return false
  }

  try {
    // Test localStorage access
    const testKey = '__kawai_storage_test__'
    localStorage.setItem(testKey, 'test')
    localStorage.removeItem(testKey)
    return true
  } catch {
    // localStorage is disabled or quota exceeded
    return false
  }
}

// ============================================================================
// Cart ID Management
// ============================================================================

/**
 * Save cart ID to localStorage
 *
 * @param cartId - Shopify cart ID (with or without gid:// prefix)
 * @param expiresInMs - Custom expiration time (default: 7 days)
 *
 * @example
 * ```typescript
 * // Save with default expiration (7 days)
 * saveCartId('abc123')
 *
 * // Save with custom expiration (1 hour)
 * saveCartId('abc123', 60 * 60 * 1000)
 * ```
 */
export function saveCartId(cartId: string, expiresInMs: number = CART_EXPIRATION_MS): void {
  if (!isLocalStorageAvailable()) {
    console.warn('[Cart Storage] localStorage not available, cart will not persist')
    return
  }

  try {
    // Remove gid:// prefix if present for cleaner storage
    const cleanCartId = cartId.replace('gid://shopify/Cart/', '')

    // Calculate expiration timestamp
    const expirationTime = Date.now() + expiresInMs

    // Save cart ID and expiration
    localStorage.setItem(CART_ID_KEY, cleanCartId)
    localStorage.setItem(CART_EXPIRATION_KEY, expirationTime.toString())

    console.log('[Cart Storage] Cart ID saved:', cleanCartId)
  } catch (error) {
    console.error('[Cart Storage] Failed to save cart ID:', error)
  }
}

/**
 * Get cart ID from localStorage
 *
 * @returns Cart ID (without gid:// prefix) or null if not found/expired
 *
 * @example
 * ```typescript
 * const cartId = getCartId()
 *
 * if (cartId) {
 *   // Cart exists and is not expired
 *   const cart = await getCart(cartId)
 * } else {
 *   // Create new cart
 *   const newCart = await createCart()
 * }
 * ```
 */
export function getCartId(): string | null {
  if (!isLocalStorageAvailable()) {
    return null
  }

  try {
    const cartId = localStorage.getItem(CART_ID_KEY)
    const expirationStr = localStorage.getItem(CART_EXPIRATION_KEY)

    // No cart ID found
    if (!cartId) {
      return null
    }

    // Check if cart has expired
    if (expirationStr) {
      const expirationTime = parseInt(expirationStr, 10)
      const now = Date.now()

      if (now > expirationTime) {
        console.log('[Cart Storage] Cart expired, clearing storage')
        clearCartId()
        return null
      }
    }

    return cartId
  } catch (error) {
    console.error('[Cart Storage] Failed to retrieve cart ID:', error)
    return null
  }
}

/**
 * Clear cart ID from localStorage
 *
 * @example
 * ```typescript
 * // After successful checkout
 * clearCartId()
 *
 * // Or when user explicitly clears cart
 * await removeFromCart(cartId, allLineIds)
 * clearCartId()
 * ```
 */
export function clearCartId(): void {
  if (!isLocalStorageAvailable()) {
    return
  }

  try {
    localStorage.removeItem(CART_ID_KEY)
    localStorage.removeItem(CART_EXPIRATION_KEY)
    console.log('[Cart Storage] Cart cleared from storage')
  } catch (error) {
    console.error('[Cart Storage] Failed to clear cart ID:', error)
  }
}

/**
 * Check if a cart ID exists in storage
 *
 * @returns True if cart ID exists and is not expired
 *
 * @example
 * ```typescript
 * if (hasStoredCart()) {
 *   // Load existing cart
 * } else {
 *   // Show empty cart state
 * }
 * ```
 */
export function hasStoredCart(): boolean {
  return getCartId() !== null
}

/**
 * Get remaining time until cart expires (in milliseconds)
 *
 * @returns Milliseconds until expiration, or null if no cart/expired
 *
 * @example
 * ```typescript
 * const remaining = getCartExpirationTime()
 *
 * if (remaining) {
 *   const daysRemaining = Math.ceil(remaining / (24 * 60 * 60 * 1000))
 *   console.log(`Cart expires in ${daysRemaining} days`)
 * }
 * ```
 */
export function getCartExpirationTime(): number | null {
  if (!isLocalStorageAvailable()) {
    return null
  }

  try {
    const expirationStr = localStorage.getItem(CART_EXPIRATION_KEY)

    if (!expirationStr) {
      return null
    }

    const expirationTime = parseInt(expirationStr, 10)
    const now = Date.now()
    const remaining = expirationTime - now

    return remaining > 0 ? remaining : null
  } catch (error) {
    console.error('[Cart Storage] Failed to get expiration time:', error)
    return null
  }
}

/**
 * Refresh cart expiration (extend by another 7 days)
 * Useful when user adds items to prevent premature expiration
 *
 * @param expiresInMs - Custom expiration time (default: 7 days)
 *
 * @example
 * ```typescript
 * // After adding items to cart
 * await addToCart(cartId, lines)
 * refreshCartExpiration()
 * ```
 */
export function refreshCartExpiration(expiresInMs: number = CART_EXPIRATION_MS): void {
  if (!isLocalStorageAvailable()) {
    return
  }

  const cartId = getCartId()
  if (cartId) {
    saveCartId(cartId, expiresInMs)
  }
}

// ============================================================================
// Cart Metadata Storage (Optional)
// ============================================================================

/**
 * LocalStorage key for cart metadata
 */
const CART_METADATA_KEY = 'kawai_shopify_cart_metadata'

/**
 * Cart metadata interface
 */
export interface CartMetadata {
  /** Last update timestamp */
  lastUpdated: number
  /** Number of items in cart */
  itemCount: number
  /** Total cart value */
  total?: number
  /** Currency code */
  currency?: string
}

/**
 * Save cart metadata (for quick access without API call)
 *
 * @param metadata - Cart metadata to save
 *
 * @example
 * ```typescript
 * saveCartMetadata({
 *   lastUpdated: Date.now(),
 *   itemCount: 3,
 *   total: 299.99,
 *   currency: 'USD'
 * })
 * ```
 */
export function saveCartMetadata(metadata: CartMetadata): void {
  if (!isLocalStorageAvailable()) {
    return
  }

  try {
    localStorage.setItem(CART_METADATA_KEY, JSON.stringify(metadata))
  } catch (error) {
    console.error('[Cart Storage] Failed to save cart metadata:', error)
  }
}

/**
 * Get cart metadata from localStorage
 *
 * @returns Cart metadata or null if not found
 *
 * @example
 * ```typescript
 * const metadata = getCartMetadata()
 *
 * if (metadata) {
 *   // Show item count badge without API call
 *   showCartBadge(metadata.itemCount)
 * }
 * ```
 */
export function getCartMetadata(): CartMetadata | null {
  if (!isLocalStorageAvailable()) {
    return null
  }

  try {
    const metadataStr = localStorage.getItem(CART_METADATA_KEY)
    if (!metadataStr) {
      return null
    }

    return JSON.parse(metadataStr) as CartMetadata
  } catch (error) {
    console.error('[Cart Storage] Failed to get cart metadata:', error)
    return null
  }
}

/**
 * Clear cart metadata
 */
export function clearCartMetadata(): void {
  if (!isLocalStorageAvailable()) {
    return
  }

  try {
    localStorage.removeItem(CART_METADATA_KEY)
  } catch (error) {
    console.error('[Cart Storage] Failed to clear cart metadata:', error)
  }
}

// ============================================================================
// Migration & Cleanup Utilities
// ============================================================================

/**
 * Migrate from old cart storage format (if needed)
 * Run this on app initialization to handle legacy storage
 *
 * @param oldKey - Old localStorage key to migrate from
 *
 * @example
 * ```typescript
 * // In app initialization
 * migrateCartStorage('old_cart_key')
 * ```
 */
export function migrateCartStorage(oldKey: string): void {
  if (!isLocalStorageAvailable()) {
    return
  }

  try {
    const oldCartId = localStorage.getItem(oldKey)

    if (oldCartId && !getCartId()) {
      // Migrate old cart ID to new storage
      saveCartId(oldCartId)
      localStorage.removeItem(oldKey)
      console.log('[Cart Storage] Migrated cart from old storage')
    }
  } catch (error) {
    console.error('[Cart Storage] Failed to migrate cart storage:', error)
  }
}

/**
 * Clean up expired cart data
 * Call this on app initialization or periodically
 *
 * @example
 * ```typescript
 * // In app initialization
 * cleanupExpiredCart()
 * ```
 */
export function cleanupExpiredCart(): void {
  const cartId = getCartId()

  // getCartId() already handles expiration check and cleanup
  if (!cartId) {
    // Also clear any orphaned metadata
    clearCartMetadata()
  }
}

// ============================================================================
// Debugging Utilities (Development Only)
// ============================================================================

/**
 * Get all cart storage data (for debugging)
 * Only use in development
 *
 * @returns Object with all cart storage data
 */
export function getCartStorageDebugInfo(): Record<string, unknown> {
  if (!isLocalStorageAvailable()) {
    return { error: 'localStorage not available' }
  }

  return {
    cartId: getCartId(),
    expiration: getCartExpirationTime(),
    metadata: getCartMetadata(),
    hasStoredCart: hasStoredCart(),
  }
}

/**
 * Clear all cart-related storage (for debugging)
 * Only use in development or for complete reset
 */
export function clearAllCartStorage(): void {
  clearCartId()
  clearCartMetadata()
  console.log('[Cart Storage] All cart storage cleared')
}
