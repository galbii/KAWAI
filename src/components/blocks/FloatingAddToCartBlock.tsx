'use client'

import { useState, useEffect } from 'react'
import { AddToCartButton } from '@/components/cart/AddToCartButton'
import { cn } from '@/lib/utils'
import type { Product } from '@/payload-types'
import type { Product as ShopifyProduct } from '@/lib/shopify/types'

interface FloatingAddToCartBlockProps {
  enabled?: boolean | null
  buttonText?: string | null
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center' | null
  showOnScroll?: boolean | null
  scrollThreshold?: number | null
  // Product data from BlockRenderer
  product?: Product
  shopifyProduct?: ShopifyProduct | null
}

/**
 * FloatingAddToCartBlock - Refined Glass Design
 *
 * A minimal, elegant floating add to cart button with red-tinted glassmorphism.
 * Clean Japanese-inspired minimalism meets luxury materials.
 */
export function FloatingAddToCartBlock({
  enabled = true,
  buttonText = 'Add to Cart',
  position = 'bottom-right',
  showOnScroll = true,
  scrollThreshold = 300,
  product,
  shopifyProduct,
}: FloatingAddToCartBlockProps) {
  const [isVisible, setIsVisible] = useState(!showOnScroll)
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Handle scroll visibility
  useEffect(() => {
    if (!showOnScroll) {
      setIsVisible(true)
      return
    }

    const threshold = scrollThreshold ?? 300

    const handleScroll = () => {
      const scrolled = window.scrollY > threshold
      setIsVisible(scrolled)
    }

    // Check initial scroll position
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [showOnScroll, scrollThreshold])

  // Get the first available variant from Shopify product
  useEffect(() => {
    if (shopifyProduct?.variants && shopifyProduct.variants.length > 0) {
      const firstAvailableVariant = shopifyProduct.variants.find(v => v.available)
      if (firstAvailableVariant) {
        setSelectedVariantId(firstAvailableVariant.id)
      } else {
        // If no available variants, use first variant
        setSelectedVariantId(shopifyProduct.variants[0]?.id || null)
      }
    }
  }, [shopifyProduct])

  // Don't render if disabled or no product data
  if (!enabled || !product || !shopifyProduct || !selectedVariantId) {
    return null
  }

  // Get the selected variant details
  const selectedVariant = shopifyProduct.variants.find(v => v.id === selectedVariantId)
  const isAvailable = selectedVariant?.available ?? false

  // Position classes - Mobile: higher to avoid SearchBar overlap
  const positionClasses = {
    'bottom-right': isMobile
      ? 'bottom-24 right-8' // Mobile: 96px from bottom (clears SearchBar which is ~80px tall with padding)
      : 'bottom-10 right-10', // Desktop: standard position
    'bottom-left': isMobile
      ? 'bottom-24 left-8'
      : 'bottom-10 left-10',
    'bottom-center': isMobile
      ? 'bottom-24 left-1/2 -translate-x-1/2'
      : 'bottom-10 left-1/2 -translate-x-1/2',
  }

  return (
    <div
      className={cn(
        'fixed z-[10100] transition-all duration-500 ease-out',
        positionClasses[position ?? 'bottom-right'],
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
      )}
    >
      {/* Main Glass Container */}
      <div
        className={cn(
          'relative rounded-xl overflow-hidden',
          'transition-all duration-300',
        )}
        style={{
          // Vibrant Kawai red glass effect (#C41E3A with opacity variations)
          // Using RGB: rgb(196, 30, 58)
          background: 'linear-gradient(135deg, rgba(196, 30, 58, 0.85) 0%, rgba(160, 24, 41, 0.75) 100%)',
          backdropFilter: 'blur(20px) saturate(200%)',
          WebkitBackdropFilter: 'blur(20px) saturate(200%)',
          // Layered shadows for depth - using Kawai red tones
          boxShadow: `
            0 4px 6px -1px rgba(196, 30, 58, 0.4),
            0 10px 15px -3px rgba(160, 24, 41, 0.4),
            0 20px 25px -5px rgba(140, 20, 36, 0.3),
            0 0 0 1px rgba(196, 30, 58, 0.2)
          `,
        }}
      >
        {/* Bright Border - Enhanced with Kawai red */}
        <div
          className="absolute inset-0 rounded-xl border border-red-200/60 transition-all duration-300 hover:border-red-100/80"
          style={{
            boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.3), inset 0 -1px 0 0 rgba(196, 30, 58, 0.3)',
          }}
        />

        {/* Content */}
        <div className="relative px-8 py-4">
          <AddToCartButton
            variantId={selectedVariantId}
            quantity={1}
            available={isAvailable}
            className={cn(
              // Reset styles
              '!relative !m-0 !p-0',
              // Ensure clickability
              'w-full cursor-pointer',
              // Remove default styling
              'bg-transparent border-0 shadow-none',
              // Typography
              'text-white font-semibold text-lg tracking-wide',
              'uppercase',
              // Smooth hover
              'transition-all duration-300',
              'hover:text-red-50 hover:scale-[1.02]',
              // Proper z-index
              'z-10'
            )}
            onSuccess={() => {
              console.log('[FloatingAddToCart] Item added to cart')
            }}
          >
            {buttonText}
          </AddToCartButton>
        </div>
      </div>
    </div>
  )
}
