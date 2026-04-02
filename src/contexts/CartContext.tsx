/**
 * Cart Context
 *
 * Global cart state management using React Context
 * Provides cart data and operations to all components
 *
 * @example
 * ```tsx
 * import { useCart } from '@/contexts/CartContext'
 *
 * function Component() {
 *   const { cart, refreshCart, getItemCount } = useCart()
 *   return <div>Items: {getItemCount()}</div>
 * }
 * ```
 */

'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { getCart } from '@/lib/shopify/cart'
import { getCartId, clearCartId, saveCartMetadata, getCartMetadata, clearCartMetadata } from '@/lib/shopify/cart-storage'
import type { SimpleCart } from '@/lib/shopify/types'

// ============================================================================
// Context Type Definition
// ============================================================================

interface CartContextType {
  /** Current cart data */
  cart: SimpleCart | null
  /** Whether cart is being loaded */
  loading: boolean
  /** Refresh cart from API */
  refreshCart: () => Promise<void>
  /** Get total item count */
  getItemCount: () => number
  /** Check if cart is empty */
  isEmpty: () => boolean
}

// ============================================================================
// Context Creation
// ============================================================================

const CartContext = createContext<CartContextType | undefined>(undefined)

// ============================================================================
// Provider Component
// ============================================================================

interface CartProviderProps {
  children: ReactNode
}

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<SimpleCart | null>(null)
  const [loading, setLoading] = useState(true)

  /**
   * Refresh cart from Shopify API
   */
  const refreshCart = useCallback(async () => {
    try {
      const cartId = getCartId()

      if (!cartId) {
        // No cart ID in storage
        setCart(null)
        clearCartMetadata()
        return
      }

      // Fetch cart from Shopify
      const cartData = await getCart(cartId)

      if (!cartData) {
        clearCartId()
        clearCartMetadata()
        setCart(null)
        return
      }

      // Update state
      setCart(cartData)

      // Save metadata for quick access
      saveCartMetadata({
        lastUpdated: Date.now(),
        itemCount: cartData.totalQuantity,
        total: cartData.total,
        currency: cartData.currency,
      })
    } catch (error) {
      console.error('[Cart Context] Failed to refresh cart:', error)
      // Clear stale data on error to prevent showing incorrect cart counts
      setCart(null)
      clearCartMetadata()
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Get total item count
   */
  const getItemCount = useCallback((): number => {
    if (cart) {
      return cart.totalQuantity
    }

    // Fallback to cached metadata
    const metadata = getCartMetadata()
    return metadata?.itemCount ?? 0
  }, [cart])

  /**
   * Check if cart is empty
   */
  const isEmpty = useCallback((): boolean => {
    return !cart || cart.lines.length === 0 || cart.totalQuantity === 0
  }, [cart])

  /**
   * Load cart on mount and check for checkout completion
   */
  useEffect(() => {
    // Check if user returned from checkout
    const checkCheckoutCompletion = async () => {
      if (typeof sessionStorage === 'undefined') return

      const checkoutInProgress = sessionStorage.getItem('checkout_in_progress')
      const checkoutStartedAt = sessionStorage.getItem('checkout_started_at')

      if (checkoutInProgress && checkoutStartedAt) {
        const timeSinceCheckout = Date.now() - parseInt(checkoutStartedAt, 10)

        // If less than 30 minutes since checkout started
        if (timeSinceCheckout < 30 * 60 * 1000) {
          console.log('[Cart Context] User may have returned from checkout, verifying cart status...')

          // Refresh cart to check if it's empty
          await refreshCart()

          // Check if cart is now empty (indicating completed checkout)
          const currentCartId = getCartId()
          if (!currentCartId) {
            console.log('[Cart Context] Cart cleared after checkout, cleaning up session')
            sessionStorage.removeItem('checkout_in_progress')
            sessionStorage.removeItem('checkout_started_at')
            clearCartId()
            clearCartMetadata()
          }
        } else {
          // Session expired
          console.log('[Cart Context] Checkout session expired, clearing')
          sessionStorage.removeItem('checkout_in_progress')
          sessionStorage.removeItem('checkout_started_at')
        }
      }
    }

    // Check for checkout completion first, then load cart
    checkCheckoutCompletion().then(() => {
      refreshCart()
    })

    // Set up event listener for cart updates from other components
    const handleCartUpdate = () => {
      console.log('[Cart Context] Cart update event received')
      refreshCart()
    }

    window.addEventListener('cartUpdated', handleCartUpdate)

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate)
    }
  }, [refreshCart])

  const value: CartContextType = {
    cart,
    loading,
    refreshCart,
    getItemCount,
    isEmpty,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// ============================================================================
// Hook for Consuming Context
// ============================================================================

/**
 * Hook to access cart context
 *
 * @throws Error if used outside CartProvider
 *
 * @example
 * ```tsx
 * const { cart, refreshCart, getItemCount } = useCart()
 * ```
 */
export function useCart(): CartContextType {
  const context = useContext(CartContext)

  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }

  return context
}

// ============================================================================
// Utility Function for Cart Updates
// ============================================================================

/**
 * Trigger cart update event (call after cart mutations)
 *
 * @example
 * ```tsx
 * await addToCart(cartId, lines)
 * triggerCartUpdate()
 * ```
 */
export function triggerCartUpdate(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('cartUpdated'))
  }
}
