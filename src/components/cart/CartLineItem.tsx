/**
 * Cart Line Item Component
 *
 * Displays individual cart item with image, title, quantity controls, and price
 * Supports optimistic UI updates and error handling
 *
 * @example
 * ```tsx
 * <CartLineItem line={cartLine} cartId={cart.id} onUpdate={handleUpdate} />
 * ```
 */

'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2, Loader2 } from 'lucide-react'
import { updateCartLine, removeFromCart } from '@/lib/shopify/cart'
import { triggerCartUpdate } from '@/contexts/CartContext'
import type { SimpleCartLine } from '@/lib/shopify/types'
import { cn } from '@/lib/utils'

// ============================================================================
// Component Props
// ============================================================================

interface CartLineItemProps {
  /** Cart line data */
  line: SimpleCartLine
  /** Cart ID */
  cartId: string
  /** Callback after successful update */
  onUpdate?: () => void
}

// ============================================================================
// Component
// ============================================================================

export function CartLineItem({ line, cartId, onUpdate }: CartLineItemProps) {
  const [quantity, setQuantity] = useState(line.quantity)
  const [updating, setUpdating] = useState(false)
  const [removing, setRemoving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Handle quantity change with optimistic UI
   */
  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity === quantity) return

    const previousQuantity = quantity
    setError(null)

    // Optimistic update
    setQuantity(newQuantity)
    setUpdating(true)

    try {
      await updateCartLine(cartId, line.id, newQuantity)
      triggerCartUpdate()
      onUpdate?.()
    } catch (err) {
      console.error('[Cart Line Item] Failed to update quantity:', err)
      setQuantity(previousQuantity)
      setError('Failed to update quantity. Please try again.')
    } finally {
      setUpdating(false)
    }
  }

  /**
   * Handle item removal
   */
  const handleRemove = async () => {
    if (removing) return

    setError(null)
    setRemoving(true)

    try {
      await removeFromCart(cartId, [line.id])
      triggerCartUpdate()
      onUpdate?.()
    } catch (err) {
      console.error('[Cart Line Item] Failed to remove item:', err)
      setError('Failed to remove item. Please try again.')
    } finally {
      setRemoving(false)
    }
  }

  /**
   * Format price for display
   */
  const formatPrice = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  // Determine if variant title should be shown
  const showVariantTitle = line.variantTitle && line.variantTitle !== 'Default Title'

  return (
    <div
      className={cn(
        'flex gap-4 bg-white rounded-lg p-4 border border-kawai-neutral/40 transition-opacity',
        removing && 'opacity-50 pointer-events-none'
      )}
    >
      {/* Product Image */}
      <Link
        href={`/shop/${line.productHandle}`}
        className="flex-shrink-0 relative group"
      >
        <div className="relative w-20 h-20 rounded-md overflow-hidden bg-kawai-pearl">
          {line.image ? (
            <Image
              src={line.image.url}
              alt={line.image.alt || line.productTitle}
              fill
              sizes="80px"
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-kawai-charcoal/40 text-xs">
              No image
            </div>
          )}
        </div>
      </Link>

      {/* Product Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <Link
            href={`/shop/${line.productHandle}`}
            className="font-semibold text-sm text-black hover:text-kawai-red line-clamp-2 transition-colors"
          >
            {line.productTitle}
          </Link>

          {showVariantTitle && (
            <p className="text-xs text-kawai-charcoal mt-1">{line.variantTitle}</p>
          )}
        </div>

        <div className="flex items-center gap-3 mt-2">
          {/* Quantity Controls */}
          <div className="flex items-center border border-kawai-neutral rounded-md">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={updating || quantity <= 1}
              className={cn(
                'p-1.5 hover:bg-kawai-pearl transition-colors',
                'disabled:opacity-40 disabled:cursor-not-allowed'
              )}
              aria-label="Decrease quantity"
            >
              <Minus className="h-3.5 w-3.5 text-kawai-charcoal" />
            </button>

            <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center text-kawai-black">
              {updating ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin mx-auto" />
              ) : (
                quantity
              )}
            </span>

            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={updating}
              className={cn(
                'p-1.5 hover:bg-kawai-pearl transition-colors',
                'disabled:opacity-40 disabled:cursor-not-allowed'
              )}
              aria-label="Increase quantity"
            >
              <Plus className="h-3.5 w-3.5 text-kawai-charcoal" />
            </button>
          </div>

          {/* Remove Button */}
          <button
            onClick={handleRemove}
            disabled={removing}
            className={cn(
              'flex items-center gap-1 text-xs text-kawai-charcoal/60 hover:text-kawai-red',
              'transition-colors disabled:opacity-50'
            )}
            aria-label="Remove item"
          >
            {removing ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
            <span>Remove</span>
          </button>

          {error && (
            <p className="text-xs text-kawai-red mt-1 w-full">{error}</p>
          )}
        </div>
      </div>

      {/* Price */}
      <div className="flex-shrink-0 text-right">
        <p className="font-bold text-sm text-kawai-black">{formatPrice(line.total)}</p>
        {quantity > 1 && (
          <p className="text-xs text-kawai-charcoal/60 mt-1">
            {formatPrice(line.price)} each
          </p>
        )}
        {line.compareAtPrice && line.compareAtPrice > line.price && (
          <p className="text-xs text-kawai-charcoal/40 line-through mt-1">
            {formatPrice(line.compareAtPrice * quantity)}
          </p>
        )}
      </div>
    </div>
  )
}
