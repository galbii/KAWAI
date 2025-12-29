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
import { getCartId, clearCartId, saveCartMetadata, getCartMetadata } from '@/lib/shopify/cart-storage'
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
        return
      }

      // Fetch cart from Shopify
      const cartData = await getCart(cartId)

      if (!cartData) {
        // Cart not found or expired
        console.log('[Cart Context] Cart not found or expired, clearing storage')
        clearCartId()
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

      console.log('[Cart Context] Cart loaded:', {
        id: cartData.id,
        items: cartData.totalQuantity,
        total: cartData.total,
      })
    } catch (error) {
      console.error('[Cart Context] Failed to refresh cart:', error)
      // On error, try to use cached metadata
      const metadata = getCartMetadata()
      if (metadata) {
        console.log('[Cart Context] Using cached cart metadata')
      }
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
   * Load cart on mount
   */
  useEffect(() => {
    refreshCart()

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
