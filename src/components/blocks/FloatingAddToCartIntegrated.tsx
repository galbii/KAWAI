'use client'

import { useState, useEffect } from 'react'
import { AddToCartButton } from '@/components/cart/AddToCartButton'
import { cn } from '@/lib/utils'
import { ChevronDown, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

interface Variation {
  name?: string | null
  available: boolean
}

interface FloatingAddToCartIntegratedProps {
  /** Shopify variant ID to add to cart (from parent ProductHeroBlock) */
  variantId: string
  /** Optional variant name to display (e.g., "Ebony Polish") */
  variantName?: string | null
  /** Optional product name for additional context */
  productName?: string | null
  /** Position of floating button on screen */
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center'
  /** Only show button after scrolling past threshold */
  showOnScroll?: boolean
  /** Pixels to scroll before showing (only if showOnScroll is true) */
  scrollThreshold?: number
  /** Whether the variant is available for purchase */
  available?: boolean
  /** All available variations (for selector) */
  availableVariations?: Variation[]
  /** Currently selected variation index */
  selectedVariationIndex?: number
  /** Callback when variation is changed */
  onVariationChange?: (index: number) => void
  /** Callback after successful add to cart (for analytics) */
  onAddToCart?: () => void
}

/**
 * FloatingAddToCartIntegrated - Integrated floating cart button
 *
 * CRITICAL: This component receives variant selection from parent ProductHeroBlock.
 * It displays the SELECTED variant and adds the CORRECT variant to cart.
 *
 * This solves the variation selection disconnect issue where floating button
 * would add a different variant than what the user selected.
 *
 * Integration Benefits:
 * - Single source of truth for variant selection (lives in parent)
 * - User sees which variant will be added (variant name displayed)
 * - Unified rendering logic (same condition as hero button)
 * - No state syncing needed - prop drilling from parent
 *
 * @example
 * // In ProductHeroBlock:
 * <FloatingAddToCartIntegrated
 *   variantId={selectedVariant.id}
 *   variantName={availableVariations[selectedVariation]?.name}
 *   productName={product.name}
 *   position="bottom-right"
 *   showOnScroll={true}
 *   scrollThreshold={300}
 *   available={selectedVariant.available}
 * />
 */
export function FloatingAddToCartIntegrated({
  variantId,
  variantName,
  productName,
  position = 'bottom-right',
  showOnScroll = true,
  scrollThreshold = 300,
  available = true,
  availableVariations = [],
  selectedVariationIndex = -1,
  onVariationChange,
  onAddToCart,
}: FloatingAddToCartIntegratedProps) {
  const [isVisible, setIsVisible] = useState(!showOnScroll)
  const [isMobile, setIsMobile] = useState(false)
  const [showVariationSelector, setShowVariationSelector] = useState(false)

  // Debug logging
  useEffect(() => {
    console.log('[FloatingAddToCartIntegrated] Props:', {
      variantName,
      availableVariationsCount: availableVariations.length,
      selectedVariationIndex,
      hasOnVariationChange: !!onVariationChange
    })
  }, [variantName, availableVariations.length, selectedVariationIndex, onVariationChange])

  // Mobile detection for proper positioning (avoid SearchBar overlap)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Scroll-based visibility control
  useEffect(() => {
    // If showOnScroll is false, always show the button
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

  // Position classes - Mobile: higher to avoid SearchBar overlap (96px from bottom)
  const positionClasses = {
    'bottom-right': isMobile
      ? 'bottom-24 right-8' // Mobile: 96px from bottom (clears SearchBar ~80px tall)
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
        'fixed z-[9000] transition-all duration-500 ease-out',
        positionClasses[position],
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
      )}
      aria-label="Floating add to cart button"
    >
      {/* Glass Container - Vibrant Kawai Red */}
      <div
        className="relative rounded-xl overflow-hidden transition-all duration-300"
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
          {/* Add to Cart Button */}
          <AddToCartButton
            variantId={variantId}
            quantity={1}
            available={available}
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
              console.log('[FloatingAddToCartIntegrated] Added to cart:', {
                variantId,
                variantName,
                productName
              })
              onAddToCart?.()
            }}
          >
            Add to Cart
          </AddToCartButton>

          {/* Variant Name Display - Clickable to change variation */}
          {variantName && availableVariations.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowVariationSelector(!showVariationSelector)
              }}
              className="mt-2 text-xs text-white/90 text-center font-medium tracking-wide hover:text-white transition-colors flex items-center justify-center gap-1 w-full"
            >
              <span>{variantName}</span>
              <ChevronDown className={cn(
                "w-3 h-3 transition-transform duration-200",
                showVariationSelector && "rotate-180"
              )} />
            </button>
          )}

          {variantName && availableVariations.length <= 1 && (
            <div className="mt-2 text-xs text-white/90 text-center font-medium tracking-wide">
              <span>{variantName}</span>
            </div>
          )}
        </div>
      </div>

      {/* Variation Selector Dropdown - outside overflow-hidden container so it isn't clipped */}
      <AnimatePresence>
        {showVariationSelector && availableVariations.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full mb-2 left-0 right-0 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
              <span className="text-sm font-semibold text-gray-900">Select Variation</span>
              <button
                onClick={() => setShowVariationSelector(false)}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Variations List */}
            <div className="max-h-[300px] overflow-y-auto">
              {availableVariations.map((variation, index) => (
                <button
                  key={index}
                  onClick={() => {
                    onVariationChange?.(index)
                    setShowVariationSelector(false)
                  }}
                  className={cn(
                    "w-full px-4 py-3 text-left transition-colors",
                    "hover:bg-gray-50",
                    selectedVariationIndex === index
                      ? "bg-kawai-red/10 text-kawai-red font-medium"
                      : "text-gray-700"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{variation.name}</span>
                    {selectedVariationIndex === index && (
                      <span className="text-xs text-kawai-red">✓ Selected</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
