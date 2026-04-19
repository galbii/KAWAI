'use client'

import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { createCart, addToCart, updateCartAttributes } from '@/lib/shopify/cart'
import { getProductByHandle } from '@/lib/shopify'
import { buildCheckoutUrl, getUTMCartAttributes } from '@/lib/shopify/checkout'
import { getCartId, saveCartId } from '@/lib/shopify/cart-storage'
import { cn } from '@/lib/utils'
import type { CartLineInput, ShopifyGID } from '@/lib/shopify/types'

export interface BuyNowItem {
  /** Direct Shopify variant GID — used when already known from Payload sync */
  shopifyVariantId?: string | null
  /**
   * Shopify product handle (slug) — used as fallback when shopifyVariantId is absent.
   * BuyNowButton will call getProductByHandle() at click time to resolve the first
   * available variant ID.
   */
  handle?: string | null
  quantity: number
}

interface BuyNowButtonProps {
  items: BuyNowItem[]
  className?: string
  children?: React.ReactNode
  disabled?: boolean
}

function toGID(variantId: string): ShopifyGID {
  return variantId.startsWith('gid://')
    ? (variantId as ShopifyGID)
    : (`gid://shopify/ProductVariant/${variantId}` as ShopifyGID)
}

/**
 * Resolve a single BuyNowItem to a Shopify variant GID.
 *
 * Priority:
 * 1. shopifyVariantId (already known from Payload sync)
 * 2. Fetch product by handle and take the first available variant
 *
 * Returns null if neither source yields a valid ID (product not in Shopify).
 */
async function resolveVariantId(item: BuyNowItem): Promise<string | null> {
  if (item.shopifyVariantId) {
    return item.shopifyVariantId
  }

  if (!item.handle) return null

  try {
    const product = await getProductByHandle(item.handle)
    if (!product) return null

    // Prefer the first available variant; fall back to first variant regardless
    const variant =
      product.variants.find((v) => v.available !== false) ?? product.variants[0]

    return variant?.id ?? null
  } catch {
    return null
  }
}

export function BuyNowButton({ items, className, children = 'Buy Now', disabled }: BuyNowButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const hasItems = items.length > 0
  const isDisabled = disabled || !hasItems || loading

  async function handleBuyNow() {
    if (isDisabled) return

    setLoading(true)
    setError(null)

    try {
      // Resolve all variant IDs in parallel — handles missing shopifyVariantId via handle lookup
      const resolvedIds = await Promise.all(items.map(resolveVariantId))

      const lines: CartLineInput[] = resolvedIds
        .map((id, i) => (id ? { merchandiseId: toGID(id), quantity: items[i]!.quantity } : null))
        .filter((line): line is CartLineInput => line !== null)

      if (lines.length === 0) {
        setError('No purchasable items found. Please contact a dealer.')
        setTimeout(() => setError(null), 5000)
        setLoading(false)
        return
      }

      let cart

      const existingCartId = getCartId()
      if (existingCartId) {
        cart = await addToCart(existingCartId, lines)
        // Write UTM attributes before redirecting so the Order has attribution data.
        const utmAttrs = getUTMCartAttributes()
        if (utmAttrs.length > 0) {
          await updateCartAttributes(existingCartId, utmAttrs).catch(() => {})
        }
      } else {
        cart = await createCart(lines, getUTMCartAttributes())
        saveCartId(cart.id)
      }

      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart } }))

      window.location.href = buildCheckoutUrl(cart.checkoutUrl)
    } catch (err) {
      console.error('[BuyNow] Checkout error:', err)
      setError('Unable to start checkout. Please try again.')
      setTimeout(() => setError(null), 4000)
      setLoading(false)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={handleBuyNow}
        disabled={isDisabled}
        className={cn(
          'flex items-center justify-center gap-2 w-full py-3.5',
          'text-[10px] uppercase tracking-[0.22em] font-bold font-[family-name:var(--font-brand-sans)]',
          'transition-colors duration-200',
          isDisabled
            ? 'bg-kawai-charcoal/30 text-white/30 cursor-not-allowed'
            : 'bg-kawai-red text-white hover:bg-red-700',
          className,
        )}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-3 w-3 flex-shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Starting checkout…</span>
          </>
        ) : (
          <>
            <span>{children}</span>
            <ArrowRight className="w-3 h-3" />
          </>
        )}
      </button>

      {error && (
        <p className="absolute top-full left-0 right-0 mt-1.5 text-[9px] text-kawai-red text-center font-[family-name:var(--font-brand-sans)]">
          {error}
        </p>
      )}
    </div>
  )
}
