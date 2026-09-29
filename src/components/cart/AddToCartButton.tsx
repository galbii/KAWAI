'use client'

import { useState } from 'react'
import { ShoppingCart, Check, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { addVariantToCart } from '@/lib/shopify'
import { cn } from '@/lib/utils'

interface AddToCartButtonProps {
  /** Shopify product variant ID */
  variantId: string
  /** Quantity to add */
  quantity?: number
  /** Button variant style */
  variant?: 'default' | 'outline' | 'ghost'
  /** Button size */
  size?: 'default' | 'sm' | 'lg'
  /** Custom className */
  className?: string
  /** Button text */
  children?: React.ReactNode
  /** Whether product is available */
  available?: boolean
  /** Callback after successful add to cart */
  onSuccess?: () => void
  /** Callback after error */
  onError?: (error: Error) => void
}

export function AddToCartButton({
  variantId,
  quantity = 1,
  variant = 'default',
  size = 'default',
  className,
  children = 'Add to Cart',
  available = true,
  onSuccess,
  onError,
}: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false)
  const [added, setAdded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAddToCart = async () => {
    if (!available) return

    setLoading(true)
    setError(null)

    try {
      const cart = await addVariantToCart(variantId, quantity)

      if (cart) {
        setAdded(true)
        onSuccess?.()

        // Dispatch custom event for cart updates
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart } }))

        // Reset added state after 2 seconds
        setTimeout(() => setAdded(false), 2000)
      } else {
        throw new Error('Failed to add item to cart')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add to cart'
      setError(errorMessage)
      console.error('Add to cart error:', err)
      onError?.(err instanceof Error ? err : new Error(errorMessage))

      // Clear error after 3 seconds
      setTimeout(() => setError(null), 3000)
    } finally {
      setLoading(false)
    }
  }

  // Don't show button if variant ID is missing
  if (!variantId) {
    return null
  }

  return (
    <div className="relative">
      <Button
        onClick={handleAddToCart}
        disabled={loading || !available || added}
        variant={variant as any}
        size={size as any}
        className={cn(
          'group relative overflow-hidden transition-all duration-300',
          added && 'bg-emerald-600 hover:bg-emerald-600 text-white',
          error && 'bg-red-600 hover:bg-red-600 text-white',
          !available && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        {/* Button content with icons */}
        <span className="relative flex items-center justify-center space-x-2">
          {loading && (
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          )}

          {!loading && added && <Check className="h-4 w-4" />}
          {!loading && error && <AlertCircle className="h-4 w-4" />}
          {!loading && !added && !error && <ShoppingCart className="h-4 w-4" />}

          <span>
            {loading
              ? 'Adding...'
              : added
                ? 'Added to Cart!'
                : error
                  ? 'Error'
                  : !available
                    ? 'Out of Stock'
                    : children}
          </span>
        </span>
      </Button>

      {/* Error message tooltip */}
      {error && (
        <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-red-50 border border-red-200 rounded-md text-sm text-red-700 z-10">
          {error}
        </div>
      )}
    </div>
  )
}
