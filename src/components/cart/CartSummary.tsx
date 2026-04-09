/**
 * Cart Summary Component
 *
 * Displays cart totals (subtotal, discounts, total) and checkout button
 * Handles redirect to Shopify checkout
 *
 * @example
 * ```tsx
 * <CartSummary cart={cart} />
 * ```
 */

'use client'

import { useState } from 'react'
import { ExternalLink, Loader2, Tag } from 'lucide-react'
import type { SimpleCart } from '@/lib/shopify/types'
import { cn } from '@/lib/utils'
import { trackBeginCheckout } from '@/lib/analytics/unified-tracking'
import { buildCheckoutUrl } from '@/lib/shopify'

// ============================================================================
// Component Props
// ============================================================================

interface CartSummaryProps {
  /** Cart data */
  cart: SimpleCart
  /** Additional CSS classes */
  className?: string
}

// ============================================================================
// Component
// ============================================================================

export function CartSummary({ cart, className }: CartSummaryProps) {
  const [redirecting, setRedirecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Format price for display
   */
  const formatPrice = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: cart.currency || 'USD',
    }).format(amount)
  }

  /**
   * Handle checkout button click
   */
  const handleCheckout = () => {
    setError(null)

    if (!cart.checkoutUrl) {
      console.error('[CartSummary] No checkout URL available for cart:', cart.id)
      setError('Unable to proceed to checkout. Please try again.')
      return
    }

    setRedirecting(true)

    try {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem('checkout_in_progress', cart.id)
        sessionStorage.setItem('checkout_started_at', Date.now().toString())
      }

      // Fire begin_checkout for each cart line so GA4 begin_checkout + Meta InitiateCheckout
      // fire with proper structured ecommerce data
      cart.lines.forEach((line) => {
        trackBeginCheckout({
          blockType: 'cart-summary',
          blockData: {},
          productName: line.productTitle,
          variantId: line.variantId,
          variantName: line.variantTitle || null,
          price: line.price,
          currency: cart.currency || 'USD',
          productId: line.productHandle || null,
          quantity: line.quantity,
          additionalProps: {
            cart_id: cart.id,
            item_count: cart.totalQuantity,
            cart_total: cart.total,
            entry_point: 'cart_drawer',
          },
        })
      })

      window.open(buildCheckoutUrl(cart.checkoutUrl), '_blank', 'noopener,noreferrer')
      setRedirecting(false)
    } catch (err) {
      console.error('[CartSummary] Checkout failed:', err)
      setError('Failed to open checkout. Please try again.')
      setRedirecting(false)
    }
  }

  // Check if cart is empty
  const isEmpty = cart.lines.length === 0 || cart.totalQuantity === 0

  return (
    <div className={cn('space-y-4', className)}>
      {/* Subtotal */}
      <div className="flex justify-between items-center text-sm">
        <span className="text-kawai-charcoal">Subtotal</span>
        <span className="font-medium text-kawai-black">{formatPrice(cart.subtotal)}</span>
      </div>

      {/* Discount Codes */}
      {cart.discountCodes && cart.discountCodes.length > 0 && (
        <div className="space-y-2">
          {cart.discountCodes.map((code) => (
            <div
              key={code}
              className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-2 rounded-md"
            >
              <Tag className="h-3.5 w-3.5" />
              <span className="font-medium">{code}</span>
            </div>
          ))}
        </div>
      )}

      {/* Discount Amount */}
      {cart.discounts > 0 && (
        <div className="flex justify-between items-center text-sm">
          <span className="text-green-600">Discount</span>
          <span className="font-medium text-green-600">-{formatPrice(cart.discounts)}</span>
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-kawai-neutral" />

      {/* Total */}
      <div className="flex justify-between items-center">
        <span className="text-base font-semibold text-kawai-black">Total</span>
        <span className="text-xl font-bold text-kawai-black">{formatPrice(cart.total)}</span>
      </div>

      {/* Taxes & Shipping Notice */}
      <p className="text-xs text-kawai-charcoal/60 text-center">
        Taxes and shipping calculated at checkout
      </p>

      {/* Inline error */}
      {error && (
        <p className="text-xs text-kawai-red text-center">{error}</p>
      )}

      {/* Checkout Button */}
      <button
        onClick={handleCheckout}
        disabled={isEmpty || redirecting}
        className={cn(
          'w-full py-3 px-4 rounded-md font-semibold text-white',
          'bg-kawai-red hover:bg-kawai-red-700',
          'transition-all duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'flex items-center justify-center gap-2',
          'shadow-md hover:shadow-lg',
          'focus:outline-none focus:ring-2 focus:ring-kawai-red focus:ring-offset-2'
        )}
      >
        {redirecting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Opening Checkout...</span>
          </>
        ) : (
          <>
            <span>Proceed to Checkout</span>
            <ExternalLink className="h-4 w-4" />
          </>
        )}
      </button>

      {/* Security Badge */}
      <div className="flex items-center justify-center gap-2 text-xs text-kawai-charcoal/60">
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        <span>Secure checkout powered by Shopify</span>
      </div>
    </div>
  )
}
