'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { createCart, buildCheckoutUrl, getUTMCartAttributes } from '@/lib/shopify'
import { trackAddToCart, trackBeginCheckout } from '@/lib/analytics/unified-tracking'
import { AddToCartButton } from '@/components/cart/AddToCartButton'
import { isAcousticProduct } from '@/lib/product-type'
import type { CollectionProduct } from '@/components/piano/collection-page-content'

interface CollectionProductRowProps {
  product: CollectionProduct
  index: number
  isEven: boolean
  collectionHandle: string
  site?: 'us' | 'cad'
}

function formatPrice(price?: number | null, currency = 'USD'): string | null {
  if (!price) return null
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(price)
  if (currency === 'CAD') return formatted.replace('CA$', 'CAD')
  return formatted
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

// Every button in a row shares one footprint: equal-width grid cells, equal height
const buttonBase =
  'inline-flex items-center justify-center gap-3 w-full min-h-[52px] px-4 py-3 text-center text-[11px] font-bold tracking-[0.16em] uppercase leading-snug transition-all duration-300'
const buttonGrid = 'grid grid-cols-2 gap-3 max-w-md'

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
  site = 'us',
}: CollectionProductRowProps) {
  const imageOnLeft = isEven
  const indexLabel = String(index + 1).padStart(2, '0')

  const [selectedVariationIndex, setSelectedVariationIndex] = useState<number>(-1)
  const [buyNowLoading, setBuyNowLoading] = useState(false)
  const [descExpanded, setDescExpanded] = useState(false)

  // Finish strip — one scrollable row; arrows enable only when there's more to see
  const finishStripRef = useRef<HTMLDivElement>(null)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const updateFinishArrows = useCallback(() => {
    const el = finishStripRef.current
    if (!el) return
    setCanScrollPrev(el.scrollLeft > 1)
    setCanScrollNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 1)
  }, [])

  useEffect(() => {
    updateFinishArrows()
    window.addEventListener('resize', updateFinishArrows)
    return () => window.removeEventListener('resize', updateFinishArrows)
  }, [updateFinishArrows])

  const scrollFinishes = (direction: 1 | -1) => {
    const el = finishStripRef.current
    if (!el) return
    el.scrollBy({ left: direction * el.clientWidth, behavior: 'smooth' })
  }

  useEffect(() => {
    if (product.variations.length === 1) setSelectedVariationIndex(0)
  }, [product.variations.length])

  const hasVariations = product.variations.length > 0
  const selectedVariation =
    selectedVariationIndex >= 0 ? (product.variations[selectedVariationIndex] ?? null) : null
  const canAddToCart =
    !!selectedVariation?.shopifyVariantId && (selectedVariation?.available ?? false)
  const needsFinishSelection = product.variations.length > 1 && selectedVariationIndex < 0
  // Acoustic pianos are dealer-only — hide stock state so finishes read as options,
  // not "out of stock".
  const showStock = !isAcousticProduct(product.type)

  const displayImageUrl = selectedVariation?.imageUrl ?? product.imageUrl ?? null

  type PriceDisplay =
    | { type: 'single'; price: number | null; compareAtPrice: number | null; onSale: boolean }
    | { type: 'range'; minPrice: number; maxPrice: number }
    | { type: 'fallback'; price: number | null }

  const priceDisplay: PriceDisplay = (() => {
    if (selectedVariation) {
      // CA: use stored priceCAD/compareAtPriceCAD if available, else fall back to live-enriched price
      const p = site === 'cad'
        ? (selectedVariation.priceCAD ?? selectedVariation.price)
        : selectedVariation.price
      const cap = site === 'cad'
        ? (selectedVariation.compareAtPriceCAD ?? selectedVariation.compareAtPrice)
        : selectedVariation.compareAtPrice
      const onSale = typeof cap === 'number' && typeof p === 'number' && cap > p
      return { type: 'single', price: p, compareAtPrice: cap, onSale }
    }
    const priceKey = site === 'cad' ? 'priceCAD' : 'price'
    const pricedVars = product.variations.filter((v) => typeof v[priceKey] === 'number')
    if (pricedVars.length > 1) {
      const prices = pricedVars.map((v) => v[priceKey] as number)
      return { type: 'range', minPrice: Math.min(...prices), maxPrice: Math.max(...prices) }
    }
    const fallback = site === 'cad'
      ? (product.priceCAD?.price ?? product.priceCAD?.msrp ?? null)
      : (product.price?.msrp ?? null)
    return { type: 'fallback', price: fallback }
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
      currency: product.currency ?? (site === 'cad' ? 'CAD' : 'USD'),
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

      const cart = await createCart(
        [{ merchandiseId: formattedVariantId as `gid://shopify/${string}/${string}`, quantity: 1 }],
        getUTMCartAttributes(),
      )

      const trackingParams = buildTrackingParams('buy_now')
      trackAddToCart(trackingParams)
      trackBeginCheckout(trackingParams)

      if (cart.checkoutUrl) {
        window.open(buildCheckoutUrl(cart.checkoutUrl), '_blank', 'noopener,noreferrer')
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
        'px-10 py-20 bg-white',
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

      {/* Full name — primary heading, desktop only. Sized down from the old model
          heading: names run several words where a model was 3–4 characters. */}
      <motion.h2
        variants={infoChildVariants}
        className={cn(
          'hidden lg:block text-4xl xl:text-5xl 2xl:text-6xl text-kawai-black leading-[1.05]',
          product.name ? 'mb-3' : 'mb-8',
        )}
        style={{ fontFamily: 'var(--font-brand-sans)', fontWeight: 700, letterSpacing: '-0.02em' }}
      >
        {product.name || product.model}
      </motion.h2>

      {/* Model — secondary identifier, desktop only. Suppressed when it is already
          the heading (product has no name). */}
      {product.name && (
        <motion.p
          variants={infoChildVariants}
          className="hidden lg:block text-xs tracking-[0.25em] uppercase font-semibold text-kawai-charcoal/40 mb-8"
          style={{ fontFamily: 'var(--font-brand-sans)' }}
        >
          {product.model}
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

      {/* View Product — dealer-only (acoustic) pianos get Find a Dealer alongside it */}
      <motion.div
        variants={infoChildVariants}
        className={cn(buttonGrid, 'mb-10')}
      >
        <Link
          href={`/products/${product.slug}`}
          className={cn(buttonBase, 'bg-kawai-black text-white hover:bg-kawai-black/80')}
          style={{ fontFamily: 'var(--font-brand-sans)' }}
        >
          <span>View Product</span>
          <svg viewBox="0 0 16 16" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path d="M2 8h12M8 3l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        {!showStock && (
          <Link
            href="/find-a-dealer"
            className={cn(buttonBase, 'text-white bg-kawai-red hover:bg-kawai-red/85')}
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            Find a Dealer
          </Link>
        )}
      </motion.div>

      {/* Variant selector */}
      {product.variations.length > 1 && (
        <motion.div variants={infoChildVariants} className="mb-8">
          <div className="flex items-center justify-between max-w-md mb-3">
            <p className="text-[9px] tracking-[0.2em] uppercase text-kawai-muted" style={{ fontFamily: 'var(--font-brand-sans)' }}>
              Finish
            </p>
            {(canScrollPrev || canScrollNext) && (
              <div className="flex items-center gap-2">
                {([-1, 1] as const).map((dir) => {
                  const enabled = dir < 0 ? canScrollPrev : canScrollNext
                  return (
                    <button
                      key={dir}
                      type="button"
                      onClick={() => scrollFinishes(dir)}
                      disabled={!enabled}
                      aria-label={dir < 0 ? 'Previous finishes' : 'More finishes'}
                      className={cn(
                        'w-8 h-8 inline-flex items-center justify-center border transition-all duration-300',
                        enabled
                          ? 'border-kawai-black/25 text-kawai-black hover:border-kawai-black'
                          : 'border-kawai-black/10 text-kawai-charcoal/25 cursor-not-allowed',
                      )}
                    >
                      <svg viewBox="0 0 16 16" className={cn('w-3 h-3', dir < 0 && 'rotate-180')} fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
                        <path d="M2 8h12M8 3l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
          <div
            ref={finishStripRef}
            onScroll={updateFinishArrows}
            className="flex gap-3 max-w-md overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {/* Out-of-stock finishes stay selectable so the image still swaps — matches
                ProductHeroBlock. The strikethrough is the availability cue; the
                out-of-stock notice + Find a Dealer CTA renders below once selected.
                Acoustic (dealer-only) pianos never show either. */}
            {product.variations.map((v, i) => {
              const inStock = v.available || !showStock
              return (
              <button
                key={i}
                type="button"
                aria-pressed={i === selectedVariationIndex}
                aria-label={inStock ? v.name : `${v.name} — out of stock`}
                onClick={() => setSelectedVariationIndex(i === selectedVariationIndex ? -1 : i)}
                className={cn(
                  buttonBase,
                  'w-[calc(50%-0.375rem)] shrink-0 snap-start border',
                  !inStock && 'line-through',
                  i === selectedVariationIndex
                    ? 'border-kawai-black bg-kawai-black text-white'
                    : inStock
                      ? 'border-kawai-black/20 text-kawai-charcoal/70 hover:border-kawai-black hover:text-kawai-black'
                      : 'border-kawai-black/10 text-kawai-charcoal/40 hover:border-kawai-black/40 hover:text-kawai-charcoal/70',
                )}
                style={{ fontFamily: 'var(--font-brand-sans)' }}
              >
                {v.name}
              </button>
              )
            })}
          </div>
        </motion.div>
      )}
      {/* Price block — plain div intentionally, not motion.div with parent variants.
          When a variation is selected the old price unmounts and a new one mounts.
          If we used infoChildVariants the new element would start at opacity:0 and
          never animate because the parent's whileInView already fired (once:true). */}
      {priceDisplay.type === 'single' && priceDisplay.price && (
        <div className="mb-8">
          <p
            className="text-[9px] tracking-[0.25em] uppercase text-kawai-muted mb-2"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            {priceDisplay.onSale ? 'Sale Price' : 'MSRP'}
          </p>
          {priceDisplay.onSale && priceDisplay.compareAtPrice ? (
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-semibold text-kawai-muted line-through" style={{ fontFamily: 'var(--font-brand-sans)' }}>
                {formatPrice(priceDisplay.compareAtPrice, product.currency ?? 'USD')}
              </span>
              <span className="text-4xl font-semibold text-kawai-red" style={{ fontFamily: 'var(--font-brand-sans)' }}>
                {formatPrice(priceDisplay.price, product.currency ?? 'USD')}
              </span>
            </div>
          ) : (
            <p className="text-4xl font-semibold text-kawai-black" style={{ fontFamily: 'var(--font-brand-sans)' }}>
              {formatPrice(priceDisplay.price, product.currency ?? 'USD')}
            </p>
          )}
        </div>
      )}
      {priceDisplay.type === 'range' && (
        <div className="mb-8">
          <p className="text-[9px] tracking-[0.25em] uppercase text-kawai-muted mb-2" style={{ fontFamily: 'var(--font-brand-sans)' }}>
            Starting From
          </p>
          <p className="text-4xl font-semibold text-kawai-black" style={{ fontFamily: 'var(--font-brand-sans)' }}>
            {formatPrice(priceDisplay.minPrice, product.currency ?? 'USD')}
            {priceDisplay.minPrice !== priceDisplay.maxPrice && (
              <span className="text-kawai-muted">{' '}– {formatPrice(priceDisplay.maxPrice, product.currency ?? 'USD')}</span>
            )}
          </p>
        </div>
      )}
      {priceDisplay.type === 'fallback' && priceDisplay.price && (
        <div className="mb-8">
          <p className="text-[9px] tracking-[0.25em] uppercase text-kawai-muted mb-2" style={{ fontFamily: 'var(--font-brand-sans)' }}>
            MSRP From
          </p>
          <p className="text-4xl font-semibold text-kawai-black" style={{ fontFamily: 'var(--font-brand-sans)' }}>
            {formatPrice(priceDisplay.price, product.currency ?? 'USD')}
          </p>
        </div>
      )}

      {/* Commerce buttons — rendered below price.
          Dealer-only pianos skip this; their Find a Dealer sits next to View Product. */}
      {hasVariations && showStock && (
        <AnimatePresence mode="wait">
          {needsFinishSelection ? (
            <motion.p
              key="prompt"
              variants={commerceVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="text-[11px] tracking-[0.14em] uppercase text-kawai-muted mb-8"
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
              className={cn(buttonGrid, 'mb-8')}
            >
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={buyNowLoading}
                className={cn(
                  buttonBase,
                  'text-white bg-kawai-red',
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
                className={cn(buttonBase, 'h-auto rounded-none border-kawai-black/25 text-kawai-black hover:border-kawai-black')}
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
              className="mb-8"
            >
              {/* Two distinct reasons land here: the finish is genuinely out of stock,
                  or it has no Shopify variant and simply isn't sold online. */}
              <p className="text-[11px] tracking-[0.12em] uppercase text-kawai-charcoal/40 mb-4" style={{ fontFamily: 'var(--font-brand-sans)' }}>
                {selectedVariation.available
                  ? 'Available through authorized dealers'
                  : 'Out of stock — contact an authorized dealer'}
              </p>
              <div className={buttonGrid}>
                <Link
                  href="/find-a-dealer"
                  className={cn(buttonBase, 'text-white bg-kawai-red hover:bg-kawai-red/85')}
                  style={{ fontFamily: 'var(--font-brand-sans)' }}
                >
                  Find a Dealer
                </Link>
              </div>
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
          className={cn(
            'text-3xl font-bold text-kawai-black leading-[1.1]',
            product.name ? 'mb-2' : 'mb-5',
          )}
          style={{ fontFamily: 'var(--font-brand-sans)', letterSpacing: '-0.02em' }}
        >
          {product.name || product.model}
        </h2>
        {product.name && (
          <p
            className="text-[11px] tracking-[0.25em] uppercase font-semibold text-kawai-charcoal/40 mb-5"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            {product.model}
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
