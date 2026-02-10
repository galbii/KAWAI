/**
 * Cart Icon Component
 *
 * Shopping cart button with animated item count badge
 * Used in header to open cart drawer
 *
 * @example
 * ```tsx
 * <CartIcon onOpen={() => setCartOpen(true)} />
 * ```
 */

'use client'

import { useState, useEffect } from 'react'
import { ShoppingBag } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/contexts/CartContext'
import { cn } from '@/lib/utils'

// ============================================================================
// Component Props
// ============================================================================

interface CartIconProps {
  /** Callback when cart icon is clicked */
  onOpen: () => void
  /** Additional CSS classes */
  className?: string
  /** Show icon only (no badge) */
  iconOnly?: boolean
}

// ============================================================================
// Component
// ============================================================================

export function CartIcon({ onOpen, className, iconOnly = false }: CartIconProps) {
  const { getItemCount } = useCart()
  const [mounted, setMounted] = useState(false)

  // Only show cart count after client-side hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  const itemCount = mounted ? getItemCount() : 0
  const hasItems = itemCount > 0

  return (
    <motion.button
      onClick={onOpen}
      className={cn(
        'relative p-2 rounded-md transition-colors',
        'hover:bg-gray-100/80',
        'focus:outline-none focus:ring-2 focus:ring-kawai-red focus:ring-offset-2',
        className
      )}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.1 }}
      aria-label={`Shopping cart with ${itemCount} item${itemCount === 1 ? '' : 's'}`}
    >
      {/* Shopping Bag Icon */}
      <ShoppingBag className="h-6 w-6 text-gray-700" strokeWidth={2} />

      {/* Item Count Badge - Only render after hydration */}
      {!iconOnly && mounted && (
        <AnimatePresence>
          {hasItems && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                type: 'spring',
                stiffness: 500,
                damping: 25,
              }}
              className={cn(
                'absolute -top-1 -right-1',
                'flex items-center justify-center',
                'min-w-[20px] h-5 px-1',
                'bg-kawai-red text-white',
                'text-xs font-bold',
                'rounded-full',
                'shadow-md'
              )}
            >
              {itemCount > 99 ? '99+' : itemCount}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.button>
  )
}
