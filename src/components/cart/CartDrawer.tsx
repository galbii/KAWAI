/**
 * Cart Drawer Component
 *
 * Slide-out drawer displaying cart contents, line items, and summary
 * Matches mobile menu animation pattern with smooth transitions
 *
 * @example
 * ```tsx
 * <CartDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
 * ```
 */

'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { X, ShoppingBag, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/contexts/CartContext'
import { CartLineItem } from './CartLineItem'
import { CartSummary } from './CartSummary'
import { cn } from '@/lib/utils'

// ============================================================================
// Component Props
// ============================================================================

interface CartDrawerProps {
  /** Whether drawer is open */
  isOpen: boolean
  /** Callback to close drawer */
  onClose: () => void
}

// ============================================================================
// Animation Variants
// ============================================================================

const drawerVariants = {
  closed: {
    opacity: 0,
    x: '100%',
    transition: {
      duration: 0.3,
    },
  },
  open: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
    },
  },
}

const overlayVariants = {
  closed: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
  open: {
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
}

// ============================================================================
// Component
// ============================================================================

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, loading, refreshCart } = useCart()
  const drawerRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  /**
   * Handle escape key press
   */
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  /**
   * Lock body scroll when drawer is open
   */
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow
      document.body.style.overflow = 'hidden'

      return () => {
        document.body.style.overflow = originalStyle
      }
    }
    return undefined
  }, [isOpen])

  /**
   * Focus management
   */
  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus()
    }
  }, [isOpen])

  /**
   * Handle cart update (refresh data)
   */
  const handleCartUpdate = () => {
    refreshCart()
  }

  // Determine if cart is empty
  const isEmpty = !cart || cart.lines.length === 0 || cart.totalQuantity === 0

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            className="fixed inset-0 z-[9500] bg-black/20 backdrop-blur-sm"
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={onClose}
          />

          {/* Drawer Panel */}
          <motion.div
            ref={drawerRef}
            className={cn(
              'fixed right-0 top-0 bottom-0 z-[9501]',
              'w-full max-w-md',
              'bg-white shadow-2xl',
              'flex flex-col',
              'overflow-hidden'
            )}
            variants={drawerVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            {/* Header */}
            <div className="flex-shrink-0 sticky top-0 bg-white border-b border-gray-200/50 p-4 z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  <span>Shopping Cart</span>
                  {cart && cart.totalQuantity > 0 && (
                    <span className="text-sm font-normal text-gray-500">
                      ({cart.totalQuantity} {cart.totalQuantity === 1 ? 'item' : 'items'})
                    </span>
                  )}
                </h2>

                <button
                  ref={closeButtonRef}
                  onClick={onClose}
                  className={cn(
                    'p-2 rounded-md transition-colors',
                    'hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-kawai-red'
                  )}
                  aria-label="Close cart"
                >
                  <X className="h-5 w-5 text-gray-700" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {loading ? (
                // Loading State
                <div className="flex flex-col items-center justify-center h-full p-8">
                  <Loader2 className="h-8 w-8 text-kawai-red animate-spin mb-4" />
                  <p className="text-gray-600">Loading your cart...</p>
                </div>
              ) : isEmpty ? (
                // Empty Cart State
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h3>
                  <p className="text-gray-600 mb-6 max-w-sm">
                    Browse our collection and add items to your cart
                  </p>
                  <Link
                    href="/shop"
                    onClick={onClose}
                    className={cn(
                      'px-6 py-3 rounded-md font-semibold',
                      'bg-kawai-red text-white',
                      'hover:bg-kawai-red/90 transition-colors',
                      'focus:outline-none focus:ring-2 focus:ring-kawai-red focus:ring-offset-2'
                    )}
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                // Cart Items
                <div className="p-6 space-y-4">
                  {cart.lines.map((line) => (
                    <CartLineItem
                      key={line.id}
                      line={line}
                      cartId={cart.id}
                      onUpdate={handleCartUpdate}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Footer - Cart Summary */}
            {!loading && !isEmpty && cart && (
              <div className="flex-shrink-0 bg-white border-t border-gray-200 p-6">
                <CartSummary cart={cart} />

                {/* Continue Shopping Link */}
                <div className="mt-4 text-center">
                  <Link
                    href="/shop"
                    onClick={onClose}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
