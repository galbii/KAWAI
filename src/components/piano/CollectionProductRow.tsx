'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { createCart } from '@/lib/shopify'
import { getStoredUTMParams } from '@/lib/shopify/utm-tracking'
import { trackAddToCart, trackBeginCheckout } from '@/lib/analytics/unified-tracking'
import { AddToCartButton } from '@/components/cart/AddToCartButton'
import type { CollectionProduct } from '@/components/piano/collection-page-content'

interface CollectionProductRowProps {
  product: CollectionProduct
  index: number
  isEven: boolean
  collectionHandle: string
}

function formatPrice(price?: number | null): string | null {
  if (!price) return null
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price)
}

// ── Animation primitives ──────────────────────────────────────────────────────

// Elegant ease — slow start, smooth arrival
const ease = [0.25, 0.46, 0.45, 0.94] as const

// Image panel: soft scale-up reveal, no lateral slide
function makeImageVariants(fromRight: boolean) {
  return {
    hidden: { opacity: 0, x: fromRight ? 30 : -30, scale: 0.98 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 1.4, ease },
    },
  }
}

// Info container: stagger children
const infoContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.35 },
  },
}

// Each info child: gentle upward drift
const infoChildVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease },
  },
}

// Commerce buttons: slide up + fade when they appear
const commerceVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.25, ease } },
}

function PianoSilhouette() {
  return (
    <svg viewBox="0 0 160 100" className="w-40 h-auto" fill="none" aria-hidden>
      <rect x="12" y="32" width="136" height="52" rx="3" fill="#D8D3CC" />
      <rect x="16" y="36" width="10" height="44" rx="1" fill="white" />
      <rect x="28" y="36" width="7"  height="28" rx="1" fill="#1E1B16" opacity="0.55" />
      <rect x="37" y="36" width="10" height="44" rx="1" fill="white" />
      <rect x="49" y="36" width="7"  height="28" rx="1" fill="#1E1B16" opacity="0.55" />
      <rect x="58" y="36" width="10" height="44" rx="1" fill="white" />
      <rect x="70" y="36" width="10" height="44" rx="1" fill="white" />
      <rect x="82" y="36" width="7"  height="28" rx="1" fill="#1E1B16" opacity="0.55" />
      <rect x="91" y="36" width="10" height="44" rx="1" fill="white" />
      <rect x="103" y="36" width="7"  height="28" rx="1" fill="#1E1B16" opacity="0.55" />
      <rect x="112" y="36" width="10" height="44" rx="1" fill="white" />
      <rect x="124" y="36" width="7"  height="28" rx="1" fill="#1E1B16" opacity="0.55" />
      <rect x="133" y="36" width="11" height="44" rx="1" fill="white" />
    </svg>
  )
}

export function CollectionProductRow({
  product,
  index,
  isEven,
  collectionHandle,
}: CollectionProductRowProps) {
  const imageOnLeft = isEven
  const indexLabel = String(index + 1).padStart(2, '0')

  const [selectedVariationIndex, setSelectedVariationIndex] = useState<number>(-1)
  const [buyNowLoading, setBuyNowLoading] = useState(false)
  const [descExpanded, setDescExpanded] = useState(false)

  useEffect(() => {
    if (product.variations.length === 1) setSelectedVariationIndex(0)
  }, [product.variations.length])

  const hasVariations = product.variations.length > 0
  const selectedVariation =
    selectedVariationIndex >= 0 ? (product.variations[selectedVariationIndex] ?? null) : null
  const canAddToCart =
    !!selectedVariation?.shopifyVariantId && (selectedVariation?.available ?? false)
  const needsFinishSelection = product.variations.length > 1 && selectedVariationIndex < 0

  const displayImageUrl = selectedVariation?.imageUrl ?? product.imageUrl ?? null

  type PriceDisplay =
    | { type: 'single'; price: number | null; compareAtPrice: number | null; onSale: boolean }
    | { type: 'range'; minPrice: number; maxPrice: number }
    | { type: 'fallback'; price: number | null }

  const priceDisplay: PriceDisplay = (() => {
    if (selectedVariation) {
      const p = selectedVariation.price
      const cap = selectedVariation.compareAtPrice
      const onSale = typeof cap === 'number' && typeof p === 'number' && cap > p
      return { type: 'single', price: p, compareAtPrice: cap, onSale }
    }
    const pricedVars = product.variations.filter((v) => typeof v.price === 'number')
    if (pricedVars.length > 1) {
      const prices = pricedVars.map((v) => v.price as number)
      return { type: 'range', minPrice: Math.min(...prices), maxPrice: Math.max(...prices) }
    }
    return { type: 'fallback', price: product.price?.msrp ?? null }
  })()

  const imageVariants = makeImageVariants(!imageOnLeft)

  const buildTrackingParams = useCallback(
    (buttonType: 'buy_now' | 'add_to_cart') => ({
      blockType: 'collection-page',
      blockData: {},
      productName: product.name || product.model,
      variantId: selectedVariation?.shopifyVariantId ?? '',
      variantName: selectedVariation?.name ?? null,
      price: selectedVariation?.price ?? null,
      currency: 'USD',
      productId: product.slug,
      productCategory: product.type ?? null,
      additionalProps: { button_type: buttonType, collection_handle: collectionHandle },
    }),
    [selectedVariation, product, collectionHandle],
  )

  const handleBuyNow = async () => {
    if (!selectedVariation?.shopifyVariantId || !selectedVariation.available || buyNowLoading) return
    setBuyNowLoading(true)
    try {
      const formattedVariantId = selectedVariation.shopifyVariantId.startsWith('gid://')
        ? selectedVariation.shopifyVariantId
        : `gid://shopify/ProductVariant/${selectedVariation.shopifyVariantId}`

      const utmParams = getStoredUTMParams()
      const cartAttributes = [
        { key: '_utm_source', value: utmParams?.utm_source ?? '' },
        { key: '_utm_medium', value: utmParams?.utm_medium ?? '' },
        { key: '_utm_campaign', value: utmParams?.utm_campaign ?? '' },
        { key: '_utm_content', value: utmParams?.utm_content ?? '' },
        { key: '_utm_term', value: utmParams?.utm_term ?? '' },
      ].filter((a) => a.value !== '')

      const cart = await createCart(
        [{ merchandiseId: formattedVariantId as `gid://shopify/${string}/${string}`, quantity: 1 }],
        cartAttributes.length > 0 ? cartAttributes : undefined,
      )

      const trackingParams = buildTrackingParams('buy_now')
      trackAddToCart(trackingParams)
      trackBeginCheckout(trackingParams)

      if (cart.checkoutUrl) {
        let checkoutUrl = cart.checkoutUrl
        if (utmParams) {
          const utmString = Object.entries(utmParams)
            .filter(([, v]) => Boolean(v))
            .map(([k, v]) => `${k}=${encodeURIComponent(v as string)}`)
            .join('&')
          if (utmString) {
            const sep = checkoutUrl.includes('?') ? '&' : '?'
            checkoutUrl = `${checkoutUrl}${sep}${utmString}`
          }
        }
        window.open(checkoutUrl, '_blank', 'noopener,noreferrer')
      }
    } catch (err) {
      console.error('[CollectionProductRow] Buy Now error:', err)
    } finally {
      setBuyNowLoading(false)
    }
  }

  const handleAddToCartSuccess = useCallback(() => {
    trackAddToCart(buildTrackingParams('add_to_cart'))
  }, [buildTrackingParams])

  // ── Image panel ─────────────────────────────────────────────────────────────
  const ImagePanel = (
    <motion.div
      variants={imageVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="w-full lg:w-[65%] flex-shrink-0"
    >
      <Link
        href={`/products/${product.slug}`}
        tabIndex={-1}
        aria-hidden
        className="group block relative aspect-[4/3] bg-white overflow-hidden"
      >
        {/* Crossfade between images when variant changes */}
        <AnimatePresence mode="sync">
          {displayImageUrl ? (
            <motion.div
              key={displayImageUrl}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease }}
            >
              <Image
                src={displayImageUrl}
                alt={product.name ?? product.model}
                fill
                className="object-contain p-2 lg:p-3 transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
                sizes="(max-width: 1024px) 100vw, 65vw"
              />
            </motion.div>
          ) : (
            <motion.div
              key="silhouette"
              className="absolute inset-0 flex items-center justify-center opacity-25"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.25 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <PianoSilhouette />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="absolute inset-0 bg-kawai-black/0 group-hover:bg-kawai-black/[0.02] transition-colors duration-700" />
      </Link>
    </motion.div>
  )

  // ── Info panel ──────────────────────────────────────────────────────────────
  const InfoPanel = (
    <motion.div
      variants={infoContainerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className={cn(
        'w-full lg:w-[35%] flex-shrink-0 flex flex-col justify-center',
        'px-10 py-20',
        imageOnLeft
          ? 'lg:pl-16 lg:pr-14 xl:pl-24 xl:pr-20'
          : 'lg:pr-16 lg:pl-14 xl:pr-24 xl:pl-20',
      )}
    >
      {/* Index row — desktop only */}
      <motion.div variants={infoChildVariants} className="hidden lg:flex items-center gap-3 mb-8">
        <span
          className="text-[10px] tracking-[0.35em] uppercase font-semibold text-kawai-charcoal/20"
          aria-hidden
          style={{ fontFamily: 'var(--font-brand-sans)' }}
        >
          {indexLabel}
        </span>
        <div className="flex-1 h-px bg-kawai-neutral/50" />
      </motion.div>

      {/* Model — primary heading, desktop only */}
      <motion.h2
        variants={infoChildVariants}
        className="hidden lg:block text-6xl xl:text-7xl 2xl:text-8xl text-kawai-black leading-[1.0] mb-3"
        style={{ fontFamily: 'var(--font-brand-sans)', fontWeight: 700, letterSpacing: '-0.02em' }}
      >
        {product.model}
      </motion.h2>

      {/* Full name — subtitle, desktop only */}
      {product.name && (
        <motion.p
          variants={infoChildVariants}
          className="hidden lg:block text-base text-kawai-charcoal/40 mb-8"
          style={{ fontFamily: 'var(--font-brand-sans)' }}
        >
          {product.name}
        </motion.p>
      )}

      {/* Red accent rule — desktop only */}
      <motion.div variants={infoChildVariants} className="hidden lg:block w-12 h-[1.5px] bg-kawai-red mb-8" />

      {/* Description — expandable, both mobile + desktop */}
      {product.description && (
        <motion.div variants={infoChildVariants} className="mb-8">
          <p
            className={cn(
              'text-[17px] text-kawai-charcoal/60 leading-[1.85] max-w-md transition-all duration-500',
              !descExpanded && 'line-clamp-3',
            )}
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            {product.description}
          </p>
          <button
            type="button"
            onClick={() => setDescExpanded((v) => !v)}
            className="mt-2 text-[10px] tracking-[0.18em] uppercase font-semibold text-kawai-charcoal/40 hover:text-kawai-black transition-colors duration-200 flex items-center gap-1.5"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            {descExpanded ? 'Read less' : 'Read more'}
            <svg
              viewBox="0 0 12 12"
              className={cn('w-2.5 h-2.5 transition-transform duration-300', descExpanded && 'rotate-180')}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M2 4l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </motion.div>
      )}

      {/* View Product */}
      <motion.div variants={infoChildVariants} className="mb-10">
        <Link
          href={`/products/${product.slug}`}
          className="inline-flex items-center justify-center gap-3 px-10 py-4 bg-kawai-black text-white hover:bg-kawai-black/80 transition-all duration-300 w-fit"
          style={{ fontFamily: 'var(--font-brand-sans)' }}
        >
          <span className="text-[11px] font-bold tracking-[0.18em] uppercase">View Product</span>
          <svg viewBox="0 0 16 16" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path d="M2 8h12M8 3l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </motion.div>

      {/* Price block */}
      {priceDisplay.type === 'single' && priceDisplay.price && (
        <motion.div variants={infoChildVariants} className="mb-10">
          <p
            className="text-[9px] tracking-[0.25em] uppercase text-kawai-charcoal/35 mb-2"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            {priceDisplay.onSale ? 'Sale Price' : 'MSRP'}
          </p>
          {priceDisplay.onSale && priceDisplay.compareAtPrice ? (
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-semibold text-kawai-charcoal/35 line-through" style={{ fontFamily: 'var(--font-brand-sans)' }}>
                {formatPrice(priceDisplay.compareAtPrice)}
              </span>
              <span className="text-4xl font-semibold text-kawai-red" style={{ fontFamily: 'var(--font-brand-sans)' }}>
                {formatPrice(priceDisplay.price)}
              </span>
            </div>
          ) : (
            <p className="text-4xl font-semibold text-kawai-black" style={{ fontFamily: 'var(--font-brand-sans)' }}>
              {formatPrice(priceDisplay.price)}
            </p>
          )}
        </motion.div>
      )}
      {priceDisplay.type === 'range' && (
        <motion.div variants={infoChildVariants} className="mb-10">
          <p className="text-[9px] tracking-[0.25em] uppercase text-kawai-charcoal/35 mb-2" style={{ fontFamily: 'var(--font-brand-sans)' }}>
            Starting From
          </p>
          <p className="text-4xl font-semibold text-kawai-black" style={{ fontFamily: 'var(--font-brand-sans)' }}>
            {formatPrice(priceDisplay.minPrice)}
            {priceDisplay.minPrice !== priceDisplay.maxPrice && (
              <span className="text-kawai-charcoal/35">{' '}– {formatPrice(priceDisplay.maxPrice)}</span>
            )}
          </p>
        </motion.div>
      )}
      {priceDisplay.type === 'fallback' && priceDisplay.price && (
        <motion.div variants={infoChildVariants} className="mb-10">
          <p className="text-[9px] tracking-[0.25em] uppercase text-kawai-charcoal/35 mb-2" style={{ fontFamily: 'var(--font-brand-sans)' }}>
            MSRP From
          </p>
          <p className="text-4xl font-semibold text-kawai-black" style={{ fontFamily: 'var(--font-brand-sans)' }}>
            {formatPrice(priceDisplay.price)}
          </p>
        </motion.div>
      )}

      {/* Variant selector */}
      {product.variations.length > 1 && (
        <motion.div variants={infoChildVariants} className="mb-8">
          <p className="text-[9px] tracking-[0.2em] uppercase text-kawai-charcoal/35 mb-3" style={{ fontFamily: 'var(--font-brand-sans)' }}>
            Finish
          </p>
          <div className="flex flex-wrap gap-3">
            {product.variations.map((v, i) => (
              <button
                key={i}
                type="button"
                disabled={!v.available}
                onClick={() => setSelectedVariationIndex(i === selectedVariationIndex ? -1 : i)}
                className={cn(
                  'px-6 py-3 text-[11px] font-semibold tracking-[0.14em] uppercase border transition-all duration-300',
                  i === selectedVariationIndex
                    ? 'border-kawai-black bg-kawai-black text-white'
                    : v.available
                      ? 'border-kawai-black/20 text-kawai-charcoal/70 hover:border-kawai-black hover:text-kawai-black'
                      : 'opacity-30 cursor-not-allowed line-through border-kawai-black/10 text-kawai-charcoal/30',
                )}
                style={{ fontFamily: 'var(--font-brand-sans)' }}
              >
                {v.name}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Commerce buttons — animate in below price when finish selected */}
      {hasVariations && (
        <AnimatePresence mode="wait">
          {needsFinishSelection ? (
            <motion.p
              key="prompt"
              variants={commerceVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="text-[11px] tracking-[0.14em] uppercase text-kawai-charcoal/35"
              style={{ fontFamily: 'var(--font-brand-sans)' }}
            >
              Select a finish to continue
            </motion.p>
          ) : canAddToCart ? (
            <motion.div
              key="cart-buttons"
              variants={commerceVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-wrap items-center gap-4"
            >
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={buyNowLoading}
                className={cn(
                  'inline-flex items-center justify-center px-10 py-4',
                  'text-[11px] font-bold tracking-[0.18em] uppercase text-white bg-kawai-red transition-all duration-300',
                  !buyNowLoading ? 'hover:bg-kawai-red/85 cursor-pointer' : 'opacity-60 cursor-not-allowed',
                )}
                style={{ fontFamily: 'var(--font-brand-sans)' }}
              >
                {buyNowLoading ? 'Processing…' : 'Buy Now'}
              </button>
              <AddToCartButton
                variantId={selectedVariation?.shopifyVariantId ?? ''}
                available={selectedVariation?.available ?? false}
                variant="outline"
                size="default"
                onSuccess={handleAddToCartSuccess}
                className="text-[11px] font-bold tracking-[0.18em] uppercase border-kawai-black/25 text-kawai-black hover:border-kawai-black px-10 py-4 transition-all duration-300"
              >
                Add to Cart
              </AddToCartButton>
            </motion.div>
          ) : selectedVariation ? (
            <motion.div
              key="dealer"
              variants={commerceVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <p className="text-[11px] tracking-[0.12em] uppercase text-kawai-charcoal/40 mb-4" style={{ fontFamily: 'var(--font-brand-sans)' }}>
                Out of stock — contact an authorized dealer
              </p>
              <Link
                href="/find-a-dealer"
                className="inline-flex items-center justify-center px-10 py-4 text-[11px] font-bold tracking-[0.18em] uppercase text-white bg-kawai-red hover:bg-kawai-red/85 transition-all duration-300"
                style={{ fontFamily: 'var(--font-brand-sans)' }}
              >
                Find a Dealer
              </Link>
            </motion.div>
          ) : null}
        </AnimatePresence>
      )}
    </motion.div>
  )

  return (
    <div className="relative">
      {/* Ghost index number */}
      <span
        className={cn(
          'absolute top-1/2 -translate-y-1/2 z-0 pointer-events-none select-none',
          'hidden lg:block text-[28vw] leading-none font-bold',
          'text-kawai-black/[0.018]',
          imageOnLeft ? 'right-0 translate-x-1/4' : 'left-0 -translate-x-1/4',
        )}
        aria-hidden
        style={{ fontFamily: 'var(--font-brand-sans)' }}
      >
        {indexLabel}
      </span>

      {/* Mobile-only title block */}
      <div className="lg:hidden px-8 pt-12 pb-6">
        <div className="flex items-center gap-3 mb-5">
          <span
            className="text-[10px] tracking-[0.35em] uppercase font-semibold text-kawai-charcoal/20"
            aria-hidden
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            {indexLabel}
          </span>
          <div className="flex-1 h-px bg-kawai-neutral/40" />
        </div>
        <h2
          className="text-5xl font-bold text-kawai-black leading-[1.0] mb-2"
          style={{ fontFamily: 'var(--font-brand-sans)', letterSpacing: '-0.02em' }}
        >
          {product.model}
        </h2>
        {product.name && (
          <p className="text-sm text-kawai-charcoal/40 mb-5" style={{ fontFamily: 'var(--font-brand-sans)' }}>
            {product.name}
          </p>
        )}
        <div className="w-10 h-[1.5px] bg-kawai-red" />
      </div>

      {/* Row */}
      <div
        className={cn(
          'relative z-10 flex flex-col lg:flex-row items-stretch',
          !imageOnLeft && 'lg:flex-row-reverse',
        )}
      >
        {ImagePanel}
        {InfoPanel}
      </div>
    </div>
  )
}
