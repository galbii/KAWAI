'use client'

import { Media, Product } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { getOptimizedImageProps } from '@/lib/media/r2-utils'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, createElement, useRef } from 'react'
import { Images, ChevronLeft, ChevronRight, Truck, Shield, RotateCcw, Headphones as HeadphonesIcon } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import { ImageGalleryLightbox } from '@/components/ui/image-gallery-lightbox'
import type { Product as ShopifyProduct } from '@/lib/shopify/types'
import { AddToCartButton } from '@/components/cart/AddToCartButton'
import { FloatingAddToCartIntegrated } from '@/components/blocks/FloatingAddToCartIntegrated'
import { createCart, buildCheckoutUrl, getUTMCartAttributes } from '@/lib/shopify'
import { trackAddToCart, trackBeginCheckout, trackBlockImpression, trackCTAClick } from '@/lib/analytics/unified-tracking'
import type { CTATrackingConfig, BlockTrackingConfig } from '@/lib/analytics/unified-tracking'

interface ProductHeroBlockProps {
  site?: 'us' | 'cad'
  layout?: {
    imagePosition?: 'left' | 'right' | null
    backgroundColor?: 'pearl' | 'white' | 'black' | null
    showVariations?: boolean | null
    showPrice?: boolean | null
    showBuyButton?: boolean | null
  }
  secondaryCta?: {
    text?: string | null
    action?: 'url' | 'scroll-to-block' | null
    url?: string | null
    scrollToBlockIndex?: number | null
  } | null
  // NEW: Floating cart configuration (integrated with variation selection)
  floatingCart?: {
    enabled?: boolean | null
    position?: 'bottom-right' | 'bottom-left' | 'bottom-center' | null
    showOnScroll?: boolean | null
    scrollThreshold?: number | null
    showVariantName?: boolean | null
  }
  overrides?: {
    customTitle?: string | null
    customDescription?: string | null
    customImage?: string | Media | null
    badge?: string | null
  }
  ctaTracking?: CTATrackingConfig | null
  impressionTracking?: BlockTrackingConfig | null
  headingLevel?: 'h1' | 'h2'
  // The product data will be passed from the context (current product document)
  product?: Product | null
  // Shopify product data fetched server-side
  shopifyProduct?: ShopifyProduct | null
}

/** One count-down leg: reach `to` starting at `atMs` from mount, easing over `durationMs`. */
interface CountLeg {
  to: number
  atMs: number
  durationMs: number
}

/**
 * A price that counts DOWN through one or more legs, formatted as currency.
 * Used for the discount reveal: e.g. MSRP → sale price → discounted price, each leg
 * timed to fall in step with the staged reveal (badge shows between legs). On the
 * first appearance it plays every leg at its scheduled `atMs`; on later prop changes
 * (switching variation) it re-counts quickly from the current value straight to the
 * final target with no stagger. Respects reduced motion by jumping to the final value.
 */
function CountingPrice({
  from,
  legs,
  currency,
  className,
  style,
}: {
  from: number
  legs: CountLeg[]
  currency: string
  className?: string
  style?: React.CSSProperties
}) {
  const [display, setDisplay] = useState(from)
  const valueRef = useRef(from)
  const hasRunRef = useRef(false)
  // Effect depends only on the final target so unrelated re-renders don't restart it.
  const finalTo = legs.length ? legs[legs.length - 1]!.to : from

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
    let raf = 0
    const timers: ReturnType<typeof setTimeout>[] = []

    const runLeg = (start: number, to: number, durationMs: number) => {
      if (prefersReduced || durationMs <= 0 || start === to) {
        valueRef.current = to
        setDisplay(to)
        return
      }
      let startTs = 0
      const tick = (ts: number) => {
        if (!startTs) startTs = ts
        const t = Math.min(1, (ts - startTs) / durationMs)
        const v = start + (to - start) * easeOutCubic(t)
        valueRef.current = v
        setDisplay(v)
        if (t < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }

    if (prefersReduced) {
      valueRef.current = finalTo
      setDisplay(finalTo)
      return
    }

    if (!hasRunRef.current) {
      hasRunRef.current = true
      // Schedule each leg at its absolute time; each starts from the prior leg's target.
      let prevTarget = from
      for (const leg of legs) {
        const start = prevTarget
        prevTarget = leg.to
        timers.push(setTimeout(() => runLeg(start, leg.to, leg.durationMs), Math.max(0, leg.atMs)))
      }
    } else {
      // Variation switch: quick single count from wherever we are to the new final.
      runLeg(valueRef.current, finalTo, 320)
    }

    return () => {
      timers.forEach(clearTimeout)
      cancelAnimationFrame(raf)
    }
  // legs/from captured on first run; later runs resume from valueRef toward finalTo
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalTo])

  return (
    <span className={className} style={style}>
      {formatPrice(Math.round(display), currency)}
    </span>
  )
}

export function ProductHeroBlock({
  site = 'us',
  layout = {},
  secondaryCta = {},
  floatingCart = {}, // NEW: Floating cart configuration
  overrides = {},
  ctaTracking,
  impressionTracking,
  headingLevel = 'h1',
  product,
  shopifyProduct,
}: ProductHeroBlockProps) {
  // All variations for display (including unavailable — user can still browse)
  const allVariations = product?.variations || []
  // Available-only subset used for cart operations and floating cart
  const availableVariations = allVariations.filter(variation => variation.available)

  const [selectedVariation, setSelectedVariation] = useState(() => {
    if (allVariations.length === 0) return -1
    // Auto-select first available variation, fallback to first variation overall
    const firstAvailable = allVariations.findIndex(v => v.available)
    return firstAvailable >= 0 ? firstAvailable : 0
  })
  const [isFavorited, setIsFavorited] = useState(false)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [buyNowLoading, setBuyNowLoading] = useState(false)
  const [mobileCarouselIndex, setMobileCarouselIndex] = useState(0)
  const [lightboxStartIndex, setLightboxStartIndex] = useState(0)
  const mobileSwipeInProgress = useRef(false)
  const mobileTouchStartX = useRef<number | null>(null)
  const sliderRef = useRef<HTMLDivElement>(null)

  const sectionRef = useRef<HTMLElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)

  // Sync selectedVariation when variations change (handles async product loading)
  useEffect(() => {
    // If no variations exist, deselect
    if (allVariations.length === 0 && selectedVariation >= 0) {
      setSelectedVariation(-1)
    }
    // If selected index is out of bounds, reset to first variation
    else if (allVariations.length > 0 && selectedVariation >= allVariations.length) {
      setSelectedVariation(0)
    }
  }, [allVariations.length, selectedVariation])

  // Sync mobile carousel to the variation image when selection changes
  useEffect(() => {
    setMobileCarouselIndex(currentImageIndex)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVariation])

  // Fire impression event once on mount
  useEffect(() => {
    trackBlockImpression({
      blockType: 'product-hero',
      blockData: { impressionTracking: impressionTracking ?? undefined },
      additionalProps: {
        product_name: product?.name,
        product_slug: product?.slug,
      },
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Scroll trap: gallery scrolls first with smooth lerp animation; page resumes at gallery bottom
  useEffect(() => {
    const section = sectionRef.current
    const gallery = galleryRef.current
    if (!section || !gallery) return

    let targetScrollTop = gallery.scrollTop
    let rafId: number | null = null

    const animateScroll = () => {
      const current = gallery.scrollTop
      const diff = targetScrollTop - current

      if (Math.abs(diff) < 0.5) {
        gallery.scrollTop = targetScrollTop
        rafId = null
        return
      }

      gallery.scrollTop = current + diff * 0.14
      rafId = requestAnimationFrame(animateScroll)
    }

    const handleWheel = (e: WheelEvent) => {
      const { scrollHeight, clientHeight } = gallery
      const maxScroll = scrollHeight - clientHeight
      const atBottom = targetScrollTop >= maxScroll - 2
      const atTop = targetScrollTop <= 0

      if (e.deltaY > 0 && !atBottom) {
        e.preventDefault()
        targetScrollTop = Math.min(targetScrollTop + e.deltaY, maxScroll)
        if (!rafId) rafId = requestAnimationFrame(animateScroll)
      } else if (e.deltaY < 0 && !atTop) {
        e.preventDefault()
        targetScrollTop = Math.max(targetScrollTop + e.deltaY, 0)
        if (!rafId) rafId = requestAnimationFrame(animateScroll)
      }
    }

    section.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      section.removeEventListener('wheel', handleWheel)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  // Get selected Shopify variant based on variation selection
  const getSelectedVariant = () => {
    if (!shopifyProduct) return null

    // If CMS variations exist but none selected, variant is undetermined — don't guess
    if (allVariations.length > 0 && selectedVariation < 0) return null

    // If no CMS variations (single-variant product), use first Shopify variant
    if (selectedVariation < 0 || shopifyProduct.variants.length === 1) {
      return shopifyProduct.variants[0]
    }

    // Try to match variation name with variant title
    if (allVariations[selectedVariation]) {
      const variationName = allVariations[selectedVariation]?.name
      const matchedVariant = shopifyProduct.variants.find(
        (variant) => variant.title.toLowerCase().includes(variationName?.toLowerCase() || '')
      )
      if (matchedVariant) return matchedVariant
    }

    // Fallback to first variant
    return shopifyProduct.variants[0]
  }

  const selectedVariant = getSelectedVariant()

  // Layout options
  const imagePosition = layout.imagePosition || 'left'
  const backgroundColor = layout.backgroundColor || 'pearl'
  const showVariations = layout.showVariations !== false
  const showPrice = layout.showPrice === true
  const showBuyButton = layout.showBuyButton !== false

  const handleBuyNow = async () => {
    if (!selectedVariant || buyNowLoading) return
    setBuyNowLoading(true)
    try {
      const formattedVariantId = selectedVariant.id.startsWith('gid://')
        ? selectedVariant.id
        : `gid://shopify/ProductVariant/${selectedVariant.id}`
      const cart = await createCart(
        [{ merchandiseId: formattedVariantId as `gid://shopify/${string}/${string}`, quantity: 1 }],
        getUTMCartAttributes(),
      )
      if (cart.checkoutUrl) {
        const buyNowParams = {
          blockType: 'product-hero',
          blockData: { ctaTracking: ctaTracking ?? undefined },
          productName: product?.name || '',
          variantId: selectedVariant.id,
          variantName: selectedVariation >= 0 ? allVariations[selectedVariation]?.name ?? null : null,
          price: selectedVariant.price,
          currency: shopifyProduct?.price.currency ?? 'USD',
          productId: shopifyProduct?.handle ?? null,
          productCategory: shopifyProduct?.type ?? null,
          additionalProps: { button_type: 'buy_now' },
        }
        trackAddToCart(buyNowParams)
        trackBeginCheckout(buyNowParams)
        window.open(buildCheckoutUrl(cart.checkoutUrl), '_blank', 'noopener,noreferrer')
      }
    } catch (err) {
      console.error('[ProductHeroBlock] Buy Now error:', err)
    } finally {
      setBuyNowLoading(false)
    }
  }

  // NEW: Floating cart options (integrated with variation selection)
  const floatingEnabled = floatingCart.enabled === true
  const floatingPosition = floatingCart.position || 'bottom-right'
  const floatingShowOnScroll = floatingCart.showOnScroll !== false
  const floatingScrollThreshold = floatingCart.scrollThreshold || 300
  const floatingShowVariantName = floatingCart.showVariantName !== false

  // If no product data is available, show a placeholder
  if (!product) {
    return (
      <section className="py-24 bg-gradient-to-br from-kawai-pearl to-white">
        <div className="max-w-7xl mx-auto px-6">
          <Card className="p-12 text-center border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent>
              <div className="animate-pulse">
                <div className="w-16 h-16 bg-kawai-red/20 rounded-full mx-auto mb-4"></div>
                <h2 className="text-2xl font-semibold text-kawai-neutral mb-2">
                  ProductHero Block
                </h2>
                <p className="text-kawai-neutral/70">
                  This block displays beautiful product showcases when used on product pages.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }
  
  // Extract data from product, with overrides taking precedence
  const displayTitle = overrides.customTitle || product.name
  const TitleTag = headingLevel === 'h2' ? 'h2' : 'h1'

  // CONSOLIDATED: Use the new root-level model field
  const modelDisplay = (product as any).modelLabel || product.model || product.name

  const hasVariations = allVariations.length > 0

  // Get display image - priority: custom override > selected variation image > main product image > imageUrl fallback
  const getDisplayImage = () => {
    if (overrides.customImage) {
      return overrides.customImage
    }

    // If a variation is selected, check for variation image (Media object or URL)
    if (selectedVariation >= 0 && allVariations[selectedVariation]) {
      const selectedVariationData = allVariations[selectedVariation]

      // Check if variation has a valid Media image
      const isVariationImageValid = selectedVariationData.image &&
        typeof selectedVariationData.image === 'object' &&
        selectedVariationData.image.url &&
        selectedVariationData.image.url.trim() !== ''

      if (isVariationImageValid) {
        return selectedVariationData.image
      }

      // Fallback to variation imageUrl if Media image is not valid
      if (selectedVariationData.imageUrl && selectedVariationData.imageUrl.trim() !== '') {
        return selectedVariationData.imageUrl
      }
    }

    // Use imageUrl (mainImage field removed from Product schema)
    if (product.imageUrl && product.imageUrl.trim() !== '') {
      return product.imageUrl
    }

    // No image available
    return null
  }
  
  const displayImage = getDisplayImage()

  // Extract gallery images from shopifyMedia (images only)
  const galleryImages = product?.shopifyMedia
    ?.filter((media) => media.mediaType === 'IMAGE' && media.imageUrl)
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    .map((media) => ({
      url: media.imageUrl!,
      alt: media.alt || product.name || 'Product image',
      ...(media.imageWidth && { width: media.imageWidth }),
      ...(media.imageHeight && { height: media.imageHeight }),
    })) || []

  // Product-level custom media — only 'media' type goes into the image gallery (youtube is for ProductDescription)
  type CustomMediaItem = {
    mediaType?: 'media' | 'youtube' | null
    image?: Media | string | null
    youtubeUrl?: string | null
    alt?: string | null
  }
  const productCustomMedia = ((product as any).customMedia as CustomMediaItem[] | null | undefined) || []

  // Merge: Shopify images → product custom media (images only, no youtube)
  const allGalleryImages = [
    ...galleryImages,
    ...productCustomMedia
      .filter((item) => !item.mediaType || item.mediaType === 'media')
      .flatMap((item) => {
        const img = item.image
        if (!img) return []
        const url = typeof img === 'string' ? img : (img as Media).url
        if (!url) return []
        return [{ url, alt: item.alt || product.name || 'Product image' }]
      }),
  ]

  // Find the current image index in the gallery
  const getCurrentImageIndex = () => {
    if (!displayImage || allGalleryImages.length === 0) return 0

    // Get the URL from displayImage (could be string or Media object)
    const displayImageUrl = typeof displayImage === 'string'
      ? displayImage
      : displayImage?.url

    if (!displayImageUrl) return 0

    // Find matching image in gallery
    const index = allGalleryImages.findIndex(img => img.url === displayImageUrl)
    return index >= 0 ? index : 0
  }

  const currentImageIndex = getCurrentImageIndex()

  // Buy button logic - buyButton field removed from Product schema, use layout setting only
  const shouldShowBuyButton = showBuyButton

  // Unified rendering condition for Add to Cart functionality.
  // Uses Shopify's standard availableForSale signal (selectedVariant.available).
  // CRITICAL: This condition is used by BOTH the hero button AND the floating button
  // to ensure consistent behavior across the page.
  const canAddToCart = !!shopifyProduct && !!selectedVariant && selectedVariant.available

  // True when Shopify data exists but the selected variant is out of stock
  const isOutOfStock = !!shopifyProduct && !!selectedVariant && !selectedVariant.available

  // Active automatic Shopify discount — the synced snapshot on the product doc.
  // Shopify "Discounts" are a separate resource from price/compareAtPrice and apply
  // only at checkout, so computeProductDiscount() precomputed the effective price at
  // sync time. We re-apply the discount per-variation here so a selected variation
  // shows its own sale price. Automatic discount WINS over any compareAtPrice sale.
  const discountSnapshot = site === 'cad'
    ? (product as any).shopifyDiscountCAD
    : product.shopifyDiscount
  const activeDiscount = (() => {
    if (!discountSnapshot) return null
    const { value, discountedPrice, title } = discountSnapshot as {
      value?: number | null
      discountedPrice?: number | null
      title?: string | null
      valueType?: 'percentage' | 'fixed' | null
    }
    // A present discountedPrice is the sync's "a discount is active" signal.
    if (value == null || discountedPrice == null || !isFinite(value) || value <= 0) return null
    // valueType was added to the sync alongside this feature; older synced docs may
    // lack it — infer from the value (percentages are stored as a 0–1 fraction).
    const valueType: 'percentage' | 'fixed' =
      discountSnapshot.valueType ?? (value < 1 ? 'percentage' : 'fixed')
    return { title: title ?? null, valueType, value }
  })()

  // Apply the active discount to a single price. Returns the input unchanged when no
  // discount applies or the math wouldn't actually lower the price.
  const applyDiscount = (price: number): number => {
    if (!activeDiscount) return price
    const discounted = activeDiscount.valueType === 'percentage'
      ? price * (1 - activeDiscount.value)
      : price - activeDiscount.value
    const rounded = Math.max(0, Math.round(discounted * 100) / 100)
    return rounded < price ? rounded : price
  }

  // Helper to get Shopify variant price for a CMS variation
  const getVariationPrice = (variationName: string) => {
    if (!shopifyProduct) return null

    // Match CMS variation to Shopify variant using same logic as getSelectedVariant
    const matchedVariant = shopifyProduct.variants.find(
      (variant) => variant.title.toLowerCase().includes(variationName.toLowerCase())
    )

    return matchedVariant ? {
      price: matchedVariant.price,
      compareAtPrice: matchedVariant.compareAtPrice,
      onSale: matchedVariant.compareAtPrice !== null &&
              matchedVariant.compareAtPrice !== undefined &&
              matchedVariant.compareAtPrice > matchedVariant.price
    } : null
  }

  // Get display price for variations section
  const getVariationsDisplayPrice = () => {
    if (!shopifyProduct) return null

    // If product has variations, handle variation-based pricing
    if (hasVariations) {
      // If a variation is selected, show that variation's price
      if (selectedVariation >= 0 && allVariations[selectedVariation]) {
        const variationPrice = getVariationPrice(allVariations[selectedVariation]?.name || '')
        if (variationPrice) {
          return {
            type: 'single' as const,
            price: variationPrice.price,
            compareAtPrice: variationPrice.compareAtPrice,
            onSale: variationPrice.onSale
          }
        }
      }

      // No variation selected (or selected variation has no Shopify title match) — show range/single
      // Keep full price objects so sale info is not lost
      const variationPrices = allVariations
        .map(v => getVariationPrice(v.name || ''))
        .filter((p): p is NonNullable<ReturnType<typeof getVariationPrice>> => p !== null)

      if (variationPrices.length === 0) return null

      const priceValues = variationPrices.map(p => p.price)
      const minPrice = Math.min(...priceValues)
      const maxPrice = Math.max(...priceValues)

      // Single unique price or single variation — surface sale info if present
      if (minPrice === maxPrice || allVariations.length === 1) {
        // Prefer a variant that is on sale; otherwise use the first matched
        const saleVariant = variationPrices.find(p => p.onSale)
        const representative = saleVariant ?? variationPrices[0]!
        return {
          type: 'single' as const,
          price: representative.price,
          compareAtPrice: representative.compareAtPrice ?? undefined,
          onSale: representative.onSale,
        }
      }

      // Show range
      return {
        type: 'range' as const,
        minPrice,
        maxPrice
      }
    }

    // No variations - use Shopify product price directly
    // Even products without CMS variations have at least one Shopify variant
    const firstVariant = shopifyProduct.variants[0]
    const minPrice = shopifyProduct.price.min
    const maxPrice = shopifyProduct.price.max

    // If min and max are the same, show single price
    if (minPrice === maxPrice && firstVariant) {
      // Check first variant for sale pricing
      const compareAtPrice = firstVariant.compareAtPrice
      const onSale = compareAtPrice !== null &&
                     compareAtPrice !== undefined &&
                     compareAtPrice > minPrice

      return {
        type: 'single' as const,
        price: minPrice,
        compareAtPrice: onSale ? compareAtPrice : undefined,
        onSale
      }
    }

    // Show range (for products with multiple untracked variants)
    // Keep it simple: just show regular price range, no sale complexity
    return {
      type: 'range' as const,
      minPrice,
      maxPrice
    }
  }

  const baseDisplayPrice = getVariationsDisplayPrice()

  // Layer the active automatic discount over the base price display. Automatic discount
  // wins: the discounted figure becomes the price, the pre-discount figure is struck
  // through, and `isAutoDiscount` flags the row so we can render the discount badge.
  const variationsDisplayPrice = (() => {
    if (!baseDisplayPrice || !activeDiscount) return baseDisplayPrice

    if (baseDisplayPrice.type === 'single') {
      // Three tiers, high → low: list (Shopify compare-at, if any) → sale (current
      // selling price) → discounted (automatic discount applied on top). The reveal
      // counts down through whichever tiers are genuinely distinct.
      const sellingPrice = baseDisplayPrice.price
      const listPrice = baseDisplayPrice.compareAtPrice ?? null
      const discounted = applyDiscount(sellingPrice)
      if (discounted >= sellingPrice) return baseDisplayPrice
      return {
        type: 'single' as const,
        price: discounted,                       // final price you pay
        salePrice: sellingPrice,                 // pre-discount selling price (mid tier)
        listPrice,                               // true MSRP (top tier) or null
        compareAtPrice: listPrice ?? sellingPrice, // struck figure
        onSale: true,
        isAutoDiscount: true as const,
      }
    }

    // Range: discount both ends, keep the originals for the strikethrough.
    const minPrice = applyDiscount(baseDisplayPrice.minPrice)
    const maxPrice = applyDiscount(baseDisplayPrice.maxPrice)
    if (minPrice >= baseDisplayPrice.minPrice && maxPrice >= baseDisplayPrice.maxPrice) {
      return baseDisplayPrice
    }
    return {
      type: 'range' as const,
      minPrice,
      maxPrice,
      originalMin: baseDisplayPrice.minPrice,
      originalMax: baseDisplayPrice.maxPrice,
      isAutoDiscount: true as const,
    }
  })()

  // Off-white background fading to white in center for image blending
  const getBackgroundClasses = () => {
    switch (backgroundColor) {
      case 'black':
        return 'bg-slate-900'
      case 'white':
        return 'bg-white'
      default: // 'pearl' - off-white fading to white
        return 'bg-gradient-to-r from-stone-50 via-white to-stone-50'
    }
  }
  
  const getTextColorClasses = () => {
    return backgroundColor === 'black' ? 'text-white' : 'text-slate-900'
  }
  
  const getAccentColorClasses = () => {
    return backgroundColor === 'black' ? 'text-slate-300' : 'text-slate-600'
  }
  
  // Layout classes
  const containerClasses = {
    left: 'lg:flex-row',
    right: 'lg:flex-row-reverse'
  }
  
  const backgroundClass = getBackgroundClasses()
  const textColorClass = getTextColorClasses()
  const accentColorClass = getAccentColorClasses()
  const containerClass = containerClasses[imagePosition]
  
  // Status badge configuration (simplified - only draft/active/discontinued)
  const getStatusBadge = () => {
    switch (product.status) {
      case 'discontinued':
        return {
          text: 'Discontinued',
          icon: null,
          className: 'bg-gray-500 text-white'
        }
      default:
        return null
    }
  }
  
  const statusBadge = getStatusBadge()
  
  // Open lightbox at a specific index
  const openLightbox = (index: number) => {
    setLightboxStartIndex(index)
    setIsGalleryOpen(true)
  }

  // Mobile carousel navigation — arrow buttons let React drive the CSS transition via style prop
  const goToNextMobileImage = () => {
    if (allGalleryImages.length <= 1) return
    setMobileCarouselIndex(prev => (prev + 1) % allGalleryImages.length)
  }

  const goToPrevMobileImage = () => {
    if (allGalleryImages.length <= 1) return
    setMobileCarouselIndex(prev => (prev - 1 + allGalleryImages.length) % allGalleryImages.length)
  }

  const SLIDE_TRANSITION = 'transform 380ms cubic-bezier(0.4, 0, 0.2, 1)'

  const handleMobileTouchStart = (e: React.TouchEvent) => {
    mobileSwipeInProgress.current = false
    const touch = e.targetTouches[0]
    if (!touch) return
    mobileTouchStartX.current = touch.clientX
    // Kill transition so drag feels instant
    if (sliderRef.current) sliderRef.current.style.transition = 'none'
  }

  const handleMobileTouchMove = (e: React.TouchEvent) => {
    const touch = e.targetTouches[0]
    if (!touch || mobileTouchStartX.current === null || !sliderRef.current) return
    const dx = touch.clientX - mobileTouchStartX.current
    if (Math.abs(dx) > 15) mobileSwipeInProgress.current = true
    const n = allGalleryImages.length
    if (n === 0) return
    // Mutate DOM directly — zero React re-renders during drag
    sliderRef.current.style.transform = `translateX(calc(-${mobileCarouselIndex * (100 / n)}% + ${dx}px))`
  }

  const handleMobileTouchEnd = (e: React.TouchEvent) => {
    const touch = e.changedTouches[0]
    if (!touch || mobileTouchStartX.current === null) return
    const n = allGalleryImages.length
    const distance = mobileTouchStartX.current - touch.clientX // positive = left swipe = next
    let newIndex = mobileCarouselIndex
    if (Math.abs(distance) > 50 && n > 1) {
      newIndex = distance > 0
        ? (mobileCarouselIndex + 1) % n
        : (mobileCarouselIndex - 1 + n) % n
    }
    mobileTouchStartX.current = null
    // Snap (or spring back) via DOM first — React re-render will match and not cause a flicker
    if (sliderRef.current) {
      sliderRef.current.style.transition = SLIDE_TRANSITION
      sliderRef.current.style.transform = `translateX(-${newIndex * (100 / n)}%)`
    }
    if (newIndex !== mobileCarouselIndex) setMobileCarouselIndex(newIndex)
  }

  const handleMobileClick = () => {
    if (mobileSwipeInProgress.current) {
      mobileSwipeInProgress.current = false
      return
    }
    if (allGalleryImages.length > 0) openLightbox(mobileCarouselIndex)
  }

  return (
    <section ref={sectionRef} className={`relative overflow-visible ${backgroundClass}`}>
      {/* Subtle gradient overlay for better image blending */}
      {backgroundColor !== 'black' && (
        <div className="absolute inset-0 bg-gradient-to-b from-stone-50/30 via-white to-stone-50/30" />
      )}

      {/* Main Content Container - Significantly reduced padding */}
      <div className="container mx-auto px-6 lg:px-12 xl:px-16 relative z-10 py-6 lg:py-10">

        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-8 w-full items-start">

          {/* Part 1: Brand + Title + Model + MSRP + Variations + CTAs - Floating card sidebar */}
          <div className={cn(
            "space-y-4 lg:space-y-5 order-1 lg:col-span-5 lg:col-start-1 lg:sticky lg:top-8 lg:self-start",
            "lg:bg-white lg:rounded-2xl lg:px-8 lg:py-8",
            "lg:shadow-[0_8px_32px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)]",
            "lg:border lg:border-gray-100/80"
          )}>

            {/* Compact Hero Headlines */}
            <div className="space-y-2">
              {displayTitle && (
                <TitleTag className={cn(
                  "text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight leading-[1.15]",
                  textColorClass
                )}>
                  {displayTitle}
                </TitleTag>
              )}
            </div>

            {/* Mobile-only image carousel - between title and model */}
            {(displayImage || allGalleryImages.length > 0) && (
              <div className="lg:hidden relative w-full h-[320px] sm:h-[400px] overflow-hidden rounded-xl select-none">
                {allGalleryImages.length > 0 ? (
                  <>
                    {/* Sliding strip — all images in a horizontal row, GPU-animated via transform */}
                    <div
                      className="absolute inset-0 overflow-hidden cursor-pointer"
                      onTouchStart={handleMobileTouchStart}
                      onTouchMove={handleMobileTouchMove}
                      onTouchEnd={handleMobileTouchEnd}
                      onClick={handleMobileClick}
                      role="button"
                      aria-label={`Image ${mobileCarouselIndex + 1} of ${allGalleryImages.length} — tap to open gallery`}
                    >
                      <div
                        ref={sliderRef}
                        className="flex h-full"
                        style={{
                          width: `${allGalleryImages.length * 100}%`,
                          transform: `translateX(-${mobileCarouselIndex * (100 / allGalleryImages.length)}%)`,
                          transition: SLIDE_TRANSITION,
                          willChange: 'transform',
                        }}
                      >
                        {allGalleryImages.map((img, idx) => (
                          <div
                            key={img.url || idx}
                            className="relative flex-shrink-0 h-full"
                            style={{ width: `${100 / allGalleryImages.length}%` }}
                          >
                            <Image
                              src={img.url}
                              alt={img.alt || displayTitle || 'Product image'}
                              fill
                              className="object-contain"
                              priority={idx === 0}
                              sizes="100vw"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Prev / Next arrow buttons */}
                    {allGalleryImages.length > 1 && (
                      <>
                        <button
                          onClick={(e) => { e.stopPropagation(); goToPrevMobileImage() }}
                          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/85 backdrop-blur-sm flex items-center justify-center shadow-md active:scale-95 transition-transform"
                          aria-label="Previous image"
                        >
                          <ChevronLeft className="w-4 h-4 text-kawai-charcoal" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); goToNextMobileImage() }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/85 backdrop-blur-sm flex items-center justify-center shadow-md active:scale-95 transition-transform"
                          aria-label="Next image"
                        >
                          <ChevronRight className="w-4 h-4 text-kawai-charcoal" />
                        </button>

                        {/* Dot indicators */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
                          {allGalleryImages.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={(e) => { e.stopPropagation(); setMobileCarouselIndex(idx) }}
                              // 24×24px min touch target (WCAG 2.5.8) — the visible dot stays small
                              className="flex items-center justify-center h-6 min-w-6"
                              aria-label={`Go to image ${idx + 1}`}
                            >
                              <span
                                className={cn(
                                  "h-1.5 rounded-full transition-all duration-200",
                                  idx === mobileCarouselIndex ? "w-4 bg-kawai-red" : "w-1.5 bg-white/70"
                                )}
                              />
                            </button>
                          ))}
                        </div>
                      </>
                    )}

                    {/* Image count badge */}
                    <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-2.5 py-1.5 rounded-full shadow-sm pointer-events-none">
                      <Images className="w-3.5 h-3.5 text-kawai-charcoal" />
                      <span className="text-xs font-medium text-kawai-charcoal">{allGalleryImages.length}</span>
                    </div>
                  </>
                ) : displayImage && (
                  // Single image, no Shopify gallery
                  (() => {
                    const imageProps = getOptimizedImageProps(displayImage, 'hero')
                    if (!imageProps?.src) return null
                    const { width, height, ...optimizedProps } = imageProps
                    return (
                      <Image
                        {...optimizedProps}
                        fill
                        className="object-contain"
                        priority={true}
                        sizes="100vw"
                        alt={optimizedProps.alt || displayTitle || 'Product image'}
                      />
                    )
                  })()
                )}
              </div>
            )}

            {/* Compact Model Display - Inline style */}
            {modelDisplay && (
              <div className="flex items-center space-x-3">
                <div className="w-0.5 h-8 lg:h-10 bg-gradient-to-b from-kawai-red to-red-600" />
                <div>
                  <p className={cn(
                    "text-xs tracking-wider uppercase font-semibold",
                    backgroundColor === 'black' ? 'text-kawai-red' : 'text-kawai-red'
                  )}>Model</p>
                  <p className={cn(
                    "text-base lg:text-lg xl:text-xl font-light",
                    textColorClass
                  )}>
                    {modelDisplay}
                  </p>
                </div>
              </div>
            )}

            {/* Dynamic Price Display — same logic for US and CA; price renders only when Shopify lookup succeeded */}
            {(() => {
              const currency = site === 'cad' ? 'CAD' : (shopifyProduct?.price.currency ?? 'USD')

              if (!variationsDisplayPrice || !shopifyProduct) return null

              // Typed view of the price display (extra tier fields exist on the discounted variants).
              const v = variationsDisplayPrice as {
                type: 'single' | 'range'
                price: number
                compareAtPrice?: number
                onSale?: boolean
                isAutoDiscount?: boolean
                salePrice?: number
                listPrice?: number | null
              }
              const range = variationsDisplayPrice as { originalMin?: number; originalMax?: number; minPrice: number; maxPrice: number }

              const isAutoDiscount = v.isAutoDiscount === true
              // Three-tier when an automatic discount sits on top of a genuine list price
              // (Shopify compare-at): list → sale → discounted. Otherwise two-tier.
              const threeTier =
                v.type === 'single' &&
                isAutoDiscount &&
                v.listPrice != null &&
                v.salePrice != null &&
                v.salePrice < v.listPrice

              // Discount badge — the sale title only, for an active automatic Shopify
              // discount. The amount (e.g. "20% off") is intentionally omitted; the
              // strike-through MSRP → sale-price animation already conveys the savings.
              const discountBadge = isAutoDiscount && activeDiscount?.title
                ? activeDiscount.title
                : null

              // ── Staged reveal timeline (ms from mount) ───────────────────────────
              // MSRP rises → strike sweeps → price counts down. When there's a discount:
              //   three-tier: leg1 (list→sale) → badge → leg2 (sale→discounted)
              //   two-tier:   badge → single count (sale→discounted)
              // CSS beats use `both` fill so the resting state survives reduced-motion.
              const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'
              const STRIKE_EASE = 'cubic-bezier(0.65, 0, 0.35, 1)'
              const SALE_FADE = 900   // sale figure fades in
              const LEG_DUR = 620     // each countdown leg
              const LEG1_AT = 940     // first countdown (list→sale, or the only leg for plain sales)
              const BADGE_3T = 1620   // badge after leg 1 (three-tier)
              const LEG2_AT = 1820    // second countdown (sale→discounted)
              const BADGE_2T = 940    // badge before the single countdown (two-tier)
              const LEG_2T_AT = 1160  // single discount countdown (two-tier / range)
              const badgeDelay = threeTier ? BADGE_3T : BADGE_2T

              const anim = {
                msrp: { animation: `price-rise 340ms ${EASE} 60ms both` },
                strike: { animation: `price-strike 360ms ${STRIKE_EASE} 500ms both` },
                sale: { animation: `price-rise 360ms ${EASE} ${SALE_FADE}ms both` },
                badge: { animation: `price-badge-in 400ms ${EASE} ${badgeDelay}ms both` },
              } as const

              // Was-price (struck) + now-price (counting) markup, reused for single & range.
              // <del>/<ins> carry the price-reduction semantics for assistive tech; the
              // red sweep line is decorative (aria-hidden) so it isn't double-announced.
              const renderSale = (wasLabel: string, saleNode: React.ReactNode) => (
                <>
                  <del
                    className={cn("relative inline-block text-3xl font-semibold no-underline", accentColorClass)}
                    style={anim.msrp}
                  >
                    {wasLabel}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute left-0 top-1/2 -mt-px h-0.5 w-full origin-left bg-kawai-red"
                      style={anim.strike}
                    />
                  </del>
                  <ins className="text-3xl font-bold text-kawai-red no-underline" style={anim.sale}>
                    {saleNode}
                  </ins>
                </>
              )

              // Build the countdown legs for a single on-sale price.
              const singleLegs = (): CountLeg[] => {
                if (threeTier) {
                  return [
                    { to: v.salePrice!, atMs: LEG1_AT, durationMs: LEG_DUR },
                    { to: v.price, atMs: LEG2_AT, durationMs: LEG_DUR },
                  ]
                }
                // Two-tier auto discount → count after the badge; plain compare-at sale → count immediately.
                return [{ to: v.price, atMs: isAutoDiscount ? LEG_2T_AT : LEG1_AT, durationMs: LEG_DUR }]
              }

              return (
                <div className="space-y-2">
                  <div className={cn("flex items-baseline gap-3 flex-wrap", textColorClass)}>
                    <span className="text-3xl font-bold tracking-wide text-kawai-red">MSRP:</span>
                    {v.type === 'single' ? (
                      v.onSale ? (
                        renderSale(
                          formatPrice(v.compareAtPrice ?? v.price, currency),
                          <CountingPrice
                            from={v.compareAtPrice ?? v.price}
                            legs={singleLegs()}
                            currency={currency}
                          />,
                        )
                      ) : (
                        <span className="text-3xl font-bold transition-all duration-300">
                          {formatPrice(v.price, currency)}
                        </span>
                      )
                    ) : range.originalMin != null ? (
                      renderSale(
                        `${formatPrice(range.originalMin, currency)} - ${formatPrice(range.originalMax!, currency)}`,
                        <>
                          <CountingPrice from={range.originalMin} legs={[{ to: range.minPrice, atMs: LEG_2T_AT, durationMs: LEG_DUR }]} currency={currency} />
                          {' - '}
                          <CountingPrice from={range.originalMax!} legs={[{ to: range.maxPrice, atMs: LEG_2T_AT, durationMs: LEG_DUR }]} currency={currency} />
                        </>,
                      )
                    ) : (
                      <span className="text-3xl font-bold transition-all duration-300">
                        {formatPrice(range.minPrice, currency)} - {formatPrice(range.maxPrice, currency)}
                      </span>
                    )}
                  </div>
                  {discountBadge && (
                    <span
                      className="inline-flex items-center rounded-full bg-kawai-red/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-kawai-red"
                      style={anim.badge}
                    >
                      {discountBadge}
                    </span>
                  )}
                </div>
              )
            })()}

            {/* Compact Variation Selection */}
            {showVariations && hasVariations && (
              <div className="space-y-3">
                {/* h2, not h3 — sits directly under the page h1 (heading-order) */}
                <h2 className={cn("text-base lg:text-lg font-medium", textColorClass)}>Variations</h2>
                <div className="grid grid-cols-2 gap-2">
                  {allVariations.map((variation, index) => {
                    const isSelected = selectedVariation === index
                    return (
                      <div
                        key={index}
                        className={cn(
                          "cursor-pointer p-2.5 lg:p-3 rounded-lg border-2 transition-all duration-300 backdrop-blur-sm",
                          isSelected
                            ? cn(
                                'border-kawai-red',
                                backgroundColor === 'black' ? 'bg-white/10 text-white' : 'bg-black/5 text-gray-900'
                              )
                            : cn(
                                'hover:border-kawai-red/50',
                                backgroundColor === 'black'
                                  ? 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10'
                                  : backgroundColor === 'white'
                                    ? 'bg-black/5 border-black/10 text-gray-700 hover:bg-black/10'
                                    : 'bg-white/10 border-white/20 text-gray-600 hover:bg-white/20'
                              )
                        )}
                        onClick={() => setSelectedVariation(selectedVariation === index ? -1 : index)}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-sm font-medium">
                            {variation.name}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Compact CTA Buttons */}
            {shouldShowBuyButton && (
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                {hasVariations && selectedVariation < 0 && !!shopifyProduct ? (
                  <div className="w-full py-2 text-center">
                    <p className={cn("text-sm font-medium", accentColorClass)}>
                      Select a variation above to continue
                    </p>
                  </div>
                ) : canAddToCart && selectedVariant ? (
                  <>
                    {/* Primary: Buy Now — creates fresh cart, opens Shopify checkout in new tab */}
                    <Button
                      onClick={handleBuyNow}
                      disabled={buyNowLoading}
                      className={cn(
                        "group relative overflow-hidden px-5 lg:px-6 py-2.5 lg:py-3 font-medium rounded-full transition-all duration-300 hover:scale-[1.02] hover:shadow-lg text-sm lg:text-base w-full sm:flex-1",
                        "bg-gradient-to-r from-kawai-red to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:shadow-kawai-red/20"
                      )}
                    >
                      <span className="relative flex items-center justify-center space-x-1.5 lg:space-x-2">
                        <span>{buyNowLoading ? 'Loading...' : 'Buy Now'}</span>
                      </span>
                    </Button>

                    {/* Secondary: Add to Cart — existing cart flow */}
                    <AddToCartButton
                      variantId={selectedVariant.id}
                      quantity={1}
                      available={selectedVariant.available}
                      variant="outline"
                      className={cn(
                        "group relative overflow-hidden px-5 lg:px-6 py-2.5 lg:py-3 font-medium rounded-full transition-all duration-300 hover:scale-[1.02] hover:shadow-lg text-sm lg:text-base w-full sm:flex-1",
                        "border-2 border-gray-300 bg-white hover:bg-gray-50 text-gray-900 hover:border-gray-400"
                      )}
                      onSuccess={() => {
                        const addToCartParams = {
                          blockType: 'product-hero',
                          blockData: { ctaTracking: ctaTracking ?? undefined },
                          productName: product?.name || '',
                          variantId: selectedVariant.id,
                          variantName: selectedVariation >= 0 ? allVariations[selectedVariation]?.name ?? null : null,
                          price: selectedVariant.price,
                          currency: shopifyProduct?.price.currency ?? 'USD',
                          productId: shopifyProduct?.handle ?? null,
                          productCategory: shopifyProduct?.type ?? null,
                          additionalProps: { button_type: 'add_to_cart' },
                        }
                        trackAddToCart(addToCartParams)
                      }}
                    >
                      Add to Cart
                    </AddToCartButton>
                  </>
                ) : (
                  <div className="w-full flex flex-col gap-2">
                    {isOutOfStock && (
                      <p className="text-xs text-kawai-muted text-center tracking-wide">
                        Out of stock. Contact an Authorized Dealer.
                      </p>
                    )}

                    <Button
                      asChild
                      className={cn(
                        "group relative overflow-hidden px-5 lg:px-6 py-2.5 lg:py-3 font-medium rounded-full transition-all duration-300 hover:scale-[1.02] hover:shadow-lg text-sm lg:text-base w-full",
                        "bg-gradient-to-r from-kawai-red to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:shadow-kawai-red/20"
                      )}
                    >
                      <Link
                        href="/find-a-dealer"
                        onClick={() => trackCTAClick({
                          blockType: 'product-hero',
                          blockData: { ctaTracking: ctaTracking ?? undefined },
                          ctaText: 'Find a Dealer',
                          destination: '/find-a-dealer',
                          additionalProps: {
                            product_name: product?.name,
                            product_slug: product?.slug,
                            button_type: 'find_a_dealer',
                            reason: isOutOfStock ? 'out_of_stock' : 'no_ecommerce',
                          },
                        })}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <span className="relative flex items-center justify-center space-x-1.5 lg:space-x-2">
                          <span>Find a Dealer</span>
                          <svg className="w-3.5 h-3.5 lg:w-4 lg:h-4 transform group-hover:translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </span>
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Product Disclaimer */}
            {product?.disclaimer && (
              <p className={cn("text-xs leading-relaxed opacity-70 italic text-center", textColorClass)}>
                {product.disclaimer}
              </p>
            )}

            {/* Value Propositions */}
            <div className="pt-1">
              <div className="h-px bg-gradient-to-r from-transparent via-kawai-neutral to-transparent mb-3" />
              <div className="grid grid-cols-2 gap-1.5">

                {/* Free Shipping */}
                <div className="flex items-start gap-2.5 p-3 rounded-xl border border-kawai-neutral/60 bg-kawai-pearl/60 hover:border-kawai-red/25 hover:bg-red-50/30 transition-all duration-200">
                  <Truck className="w-3.5 h-3.5 text-kawai-red mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] font-semibold tracking-widest text-kawai-charcoal uppercase leading-none">Free Shipping</p>
                    <p className="text-[9px] text-kawai-muted mt-1 leading-tight">Ships in 1–3 business days</p>
                  </div>
                </div>

                {/* Warranty */}
                <Link href="/warranty-registration" className="flex items-start gap-2.5 p-3 rounded-xl border border-kawai-neutral/60 bg-kawai-pearl/60 hover:border-kawai-red/25 hover:bg-red-50/30 transition-all duration-200 group">
                  <Shield className="w-3.5 h-3.5 text-kawai-red mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] font-semibold tracking-widest text-kawai-charcoal uppercase leading-none">Warranty</p>
                    <p className="text-[9px] text-kawai-red mt-1 leading-tight underline underline-offset-2 group-hover:no-underline transition-all">Register yours →</p>
                  </div>
                </Link>

                {/* Returns */}
                <Link href="/return-policy" className="flex items-start gap-2.5 p-3 rounded-xl border border-kawai-neutral/60 bg-kawai-pearl/60 hover:border-kawai-red/25 hover:bg-red-50/30 transition-all duration-200 group">
                  <RotateCcw className="w-3.5 h-3.5 text-kawai-red mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] font-semibold tracking-widest text-kawai-charcoal uppercase leading-none">Returns</p>
                    <p className="text-[9px] text-kawai-red mt-1 leading-tight underline underline-offset-2 group-hover:no-underline transition-all">15-day policy →</p>
                  </div>
                </Link>

                {/* Support */}
                <Link href="/technical-support-division" className="flex items-start gap-2.5 p-3 rounded-xl border border-kawai-neutral/60 bg-kawai-pearl/60 hover:border-kawai-red/25 hover:bg-red-50/30 transition-all duration-200 group">
                  <HeadphonesIcon className="w-3.5 h-3.5 text-kawai-red mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] font-semibold tracking-widest text-kawai-charcoal uppercase leading-none">Support</p>
                    <p className="text-[9px] text-kawai-red mt-1 leading-tight underline underline-offset-2 group-hover:no-underline transition-all">Get help →</p>
                  </div>
                </Link>

              </div>

              {/* Subscription nudge */}
              <p className="text-center text-[10px] text-kawai-muted mt-2">
                <Link href="/warranty-registration" className="hover:text-kawai-red transition-colors duration-200 underline underline-offset-2 decoration-kawai-neutral hover:decoration-kawai-red">
                  3 Month Subscription with your Product Registration
                </Link>
              </p>
            </div>

          </div>

          {/* Image Section - Desktop only (scrollable within fixed height) */}
          <div
            ref={galleryRef}
            className="hidden lg:flex lg:flex-col lg:col-span-7 lg:col-start-6 lg:row-start-1 overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden"
            style={{ height: '720px', scrollbarWidth: 'none' }}
          >

            {/* Hero image — full width, fills the visible container height */}
            <div
              className={cn(
                "relative w-full overflow-hidden flex-shrink-0",
                allGalleryImages.length > 0 && "cursor-pointer group"
              )}
              style={{ height: '720px' }}
              onClick={() => allGalleryImages.length > 0 && openLightbox(currentImageIndex)}
              role={allGalleryImages.length > 0 ? "button" : undefined}
              tabIndex={allGalleryImages.length > 0 ? 0 : undefined}
              onKeyDown={(e) => {
                if (allGalleryImages.length > 0 && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault()
                  openLightbox(currentImageIndex)
                }
              }}
              aria-label={allGalleryImages.length > 0 ? "Open image gallery" : undefined}
            >
              {/* Subtle hover tint */}
              {allGalleryImages.length > 0 && (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 z-10" />
              )}

              {(() => {
                if (!displayImage) {
                  return (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                      <span className={cn("text-lg font-medium", accentColorClass)}>Product Image</span>
                    </div>
                  )
                }
                const imageProps = getOptimizedImageProps(displayImage, 'hero')
                if (!imageProps?.src) {
                  return (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                      <span className={cn("text-lg font-medium", accentColorClass)}>Image Load Error</span>
                    </div>
                  )
                }
                const { width, height, ...optimizedProps } = imageProps
                return (
                  <Image
                    {...optimizedProps}
                    fill
                    className="object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                    priority={true}
                    sizes="(max-width: 1280px) 58vw, 840px"
                    alt={optimizedProps.alt || displayTitle || 'Product image'}
                  />
                )
              })()}

              {/* Badges sit on hero image only */}
              {overrides.badge && (
                <Badge className="absolute top-3 left-3 bg-kawai-red text-white font-bold text-xs px-3 py-1 rounded-full z-20">
                  {overrides.badge}
                </Badge>
              )}
              {statusBadge && (
                <Badge className={cn("absolute bottom-3 right-3 font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1.5 z-20", statusBadge.className)}>
                  {statusBadge.icon && createElement(statusBadge.icon, { className: "h-3 w-3" })}
                  {statusBadge.text}
                </Badge>
              )}
            </div>

            {/* 2-column grid of remaining images (shopify + additional CMS) */}
            {allGalleryImages.length > 1 && (
              <div className="grid grid-cols-2">
                {allGalleryImages.slice(1).map((img, idx) => (
                  <div
                    key={idx}
                    className="relative overflow-hidden cursor-pointer group"
                    style={{ height: '360px' }}
                    onClick={() => openLightbox(idx + 1)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        openLightbox(idx + 1)
                      }
                    }}
                    aria-label={`View image ${idx + 2} of ${allGalleryImages.length}`}
                  >
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 z-10" />
                    <Image
                      src={img.url}
                      alt={img.alt}
                      fill
                      className="object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                      sizes="(max-width: 1280px) 29vw, 420px"
                    />
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Image Gallery Lightbox */}
      <ImageGalleryLightbox
        images={allGalleryImages}
        initialIndex={lightboxStartIndex}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
      />

      {/* NEW: Integrated Floating Add to Cart Button */}
      {/* CRITICAL: This button receives variant selection from parent state */}
      {/* User selects variation → Both hero AND floating button add same variant */}
      {floatingEnabled && canAddToCart && selectedVariant && (() => {
        return (
          <FloatingAddToCartIntegrated
            variantId={selectedVariant.id}
            variantName={
              floatingShowVariantName && selectedVariation >= 0 && allVariations[selectedVariation]
                ? allVariations[selectedVariation]?.name ?? null
                : null
            }
            productName={product?.name || null}
            position={floatingPosition}
            showOnScroll={floatingShowOnScroll}
            scrollThreshold={floatingScrollThreshold}
            available={selectedVariant.available}
            availableVariations={availableVariations.map(v => ({
              ...v,
              available: v.available ?? false
            }))}
            selectedVariationIndex={selectedVariation}
            onVariationChange={(index) => {
              setSelectedVariation(index)
            }}
            onAddToCart={() => {
              const floatingParams = {
                blockType: 'product-hero',
                blockData: { ctaTracking: ctaTracking ?? undefined },
                productName: product?.name || '',
                variantId: selectedVariant.id,
                variantName: selectedVariation >= 0 ? allVariations[selectedVariation]?.name ?? null : null,
                price: selectedVariant.price,
                currency: shopifyProduct?.price.currency ?? 'USD',
                productId: shopifyProduct?.handle ?? null,
                productCategory: shopifyProduct?.type ?? null,
                additionalProps: { button_type: 'floating_add_to_cart' },
              }
              trackAddToCart(floatingParams)
            }}
          />
        )
      })()}
    </section>
  )
}
