'use client'

import { Media, Product } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import { getOptimizedImageProps } from '@/lib/media/r2-utils'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, createElement, useRef } from 'react'
import { ShoppingCart, Heart, Share2, CheckCircle, Sparkles, Clock, Play, Volume2, Images } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ImageGalleryLightbox } from '@/components/ui/image-gallery-lightbox'
import type { Product as ShopifyProduct } from '@/lib/shopify/types'
import { AddToCartButton } from '@/components/cart/AddToCartButton'
import { FloatingAddToCartIntegrated } from '@/components/blocks/FloatingAddToCartIntegrated'

interface ProductHeroBlockProps {
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
  // The product data will be passed from the context (current product document)
  product?: Product | null
  // Shopify product data fetched server-side
  shopifyProduct?: ShopifyProduct | null
}

export function ProductHeroBlock({
  layout = {},
  secondaryCta = {},
  floatingCart = {}, // NEW: Floating cart configuration
  overrides = {},
  product,
  shopifyProduct,
}: ProductHeroBlockProps) {
  // All variations for display (including unavailable — user can still browse)
  const allVariations = product?.variations || []
  // Available-only subset used for cart operations and floating cart
  const availableVariations = allVariations.filter(variation => variation.available)

  // Default to first variation if any exist
  const defaultVariation = allVariations.length > 0 ? 0 : -1
  const [selectedVariation, setSelectedVariation] = useState(defaultVariation)
  const [isFavorited, setIsFavorited] = useState(false)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)

  const sectionRef = useRef<HTMLElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)

  // Sync selectedVariation when variations change (handles async product loading)
  useEffect(() => {
    // If variations exist but nothing selected, select first one
    if (allVariations.length > 0 && selectedVariation < 0) {
      setSelectedVariation(0)
    }
    // If no variations exist, deselect
    else if (allVariations.length === 0 && selectedVariation >= 0) {
      setSelectedVariation(-1)
    }
    // If selected index is out of bounds, reset to first
    else if (selectedVariation >= allVariations.length) {
      setSelectedVariation(0)
    }
  }, [allVariations.length, selectedVariation])

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

    // If no variation selected or only one variant, return first variant
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

  // Secondary CTA config
  const secondaryText = secondaryCta?.text || 'Learn More'
  const secondaryAction = secondaryCta?.action || 'url'
  const secondaryUrl = secondaryCta?.url || `/products/${product?.slug || ''}`
  const secondaryBlockIndex = secondaryCta?.scrollToBlockIndex ?? null

  const handleSecondaryScroll = () => {
    if (secondaryBlockIndex === null || secondaryBlockIndex === undefined) return
    const targetEl = document.getElementById(`block-${secondaryBlockIndex}`)
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
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

  // CONSOLIDATED: Use the new root-level model field
  const modelDisplay = product.model || product.name

  // Key features removed from Product schema - should come from Page Content blocks
  const keyFeatures: string[] = [
        "Millennium III Hybrid Action Technology",
        "Hand-selected premium soundboard materials",
        "Professional-grade KAWAI precision craftsmanship"
      ]

  const hasVariations = allVariations.length > 0
  // CONSOLIDATED: Updated price field names (msrp only, priceText removed)
  const hasPrice = product.price && product.price.msrp
  
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

  // Check if product tracks inventory
  // Priority: Shopify variant's inventoryTracked field > CMS trackStock field
  const tracksInventory = (() => {
    // If we have Shopify product data and a selected variant, use the variant's inventoryTracked field
    if (shopifyProduct && selectedVariant) {
      return selectedVariant.inventoryTracked ?? false
    }

    // Fallback to CMS field (default to false if not set)
    return product.inventory?.trackStock ?? false
  })()

  // NEW: Unified rendering condition for Add to Cart functionality
  // CRITICAL: This condition is used by BOTH the hero button AND the floating button
  // to ensure consistent behavior across the page
  const shouldShowAddToCart = () => {
    // Must have Shopify product data
    if (!shopifyProduct) return false

    // Must have a selected variant
    if (!selectedVariant) return false

    // Must track inventory AND variant must be available
    // (If inventory not tracked, show "Find a Dealer" instead)
    return tracksInventory && selectedVariant.available
  }

  const canAddToCart = shouldShowAddToCart()

  // True when inventory is tracked but the selected variant is specifically unavailable (not just untracked)
  const isOutOfStock = tracksInventory && !!selectedVariant && !selectedVariant.available

  // Get the buy button text - hardcoded to "Learn More"
  const getBuyButtonText = () => {
    return 'Learn More'
  }

  // Get the find a dealer button text
  const getFindDealerButtonText = () => {
    return 'Find a Dealer'
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

      // No variation selected or only one variation - show range
      const prices = allVariations
        .map(v => getVariationPrice(v.name || ''))
        .filter((p): p is NonNullable<typeof p> => p !== null)
        .map(p => p.price)

      if (prices.length === 0) return null

      const minPrice = Math.min(...prices)
      const maxPrice = Math.max(...prices)

      // If only one unique price or one variation, show single price
      if (minPrice === maxPrice || allVariations.length === 1) {
        return {
          type: 'single' as const,
          price: minPrice
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

  const variationsDisplayPrice = getVariationsDisplayPrice()

  // Enhanced price formatting with animations
  const formatMainPrice = () => {
    if (!product.price) return 'Learn more'

    // CONSOLIDATED: Updated to use msrp only (priceText removed from schema)
    if (!product.price.msrp) {
      return 'Learn more'
    }

    const currency = product.price.currency || 'USD'
    const currencySymbols = { USD: '$', EUR: '€', GBP: '£', CAD: 'C$' }
    const symbol = currencySymbols[currency] || '$'

    // Use actual variant price if variation is selected, otherwise use base MSRP
    const basePrice = product.price.msrp
    const selectedVariationPrice = hasVariations && selectedVariation >= 0
      ? allVariations[selectedVariation]?.price
      : null
    const displayPrice = selectedVariationPrice || basePrice
    const mainPrice = `${symbol}${displayPrice.toLocaleString()}`

    // Simplified price display (salePrice removed from schema)
    return <span className="text-4xl font-bold">{mainPrice}</span>
  }
  
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
  
  // CONSOLIDATED: Debug log with variation image sizing and inventory tracking
  console.log('ProductHeroBlock - Debug:', {
    selectedVariation,
    tracksInventory,
    inventorySource: shopifyProduct && selectedVariant ? 'Shopify variant' : 'CMS field',
    shopifyVariantTracked: selectedVariant?.inventoryTracked,
    cmsTrackStock: product.inventory?.trackStock,
    displayImage: displayImage,
    displayImageType: typeof displayImage,
    displayImageUrl: typeof displayImage === 'object' ? displayImage?.url : displayImage,
    isVariationImageSelected: selectedVariation >= 0,
    variationImageData: selectedVariation >= 0 && allVariations[selectedVariation] ? {
      variationName: allVariations[selectedVariation]?.name,
      hasMediaImage: !!(allVariations[selectedVariation]?.image),
      hasImageUrl: !!(allVariations[selectedVariation]?.imageUrl),
      mediaImageUrl: typeof allVariations[selectedVariation]?.image === 'object' ?
        allVariations[selectedVariation]?.image?.url : null,
      imageUrl: allVariations[selectedVariation]?.imageUrl,
      selectedImageSource: (() => {
        const variation = allVariations[selectedVariation]
        if (variation?.image && typeof variation.image === 'object' && variation.image.url) return 'Media object'
        if (variation?.imageUrl) return 'imageUrl string'
        return 'fallback to main'
      })()
    } : null,
    mainImageData: {
      hasImageUrl: !!(product?.imageUrl),
      imageUrl: product?.imageUrl
    }
  })
  
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
                <h1 className={cn(
                  "text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight leading-[1.15]",
                  textColorClass
                )}>
                  {displayTitle}
                </h1>
              )}
            </div>

            {/* Mobile-only image - between title and model */}
            {displayImage && (
              <div
                className={cn(
                  "lg:hidden relative w-full h-[320px] sm:h-[400px] overflow-hidden rounded-xl",
                  allGalleryImages.length > 0 && "cursor-pointer"
                )}
                onClick={() => allGalleryImages.length > 0 && setIsGalleryOpen(true)}
                role={allGalleryImages.length > 0 ? "button" : undefined}
                tabIndex={allGalleryImages.length > 0 ? 0 : undefined}
                onKeyDown={(e) => {
                  if (allGalleryImages.length > 0 && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault()
                    setIsGalleryOpen(true)
                  }
                }}
                aria-label={allGalleryImages.length > 0 ? `Open image gallery (${allGalleryImages.length} photos)` : undefined}
              >
                {(() => {
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
                })()}

                {/* Persistent gallery indicator for mobile (no hover on touch devices) */}
                {allGalleryImages.length > 0 && (
                  <div className="absolute bottom-2.5 right-2.5 z-10 flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-2.5 py-1.5 rounded-full shadow-sm">
                    <Images className="w-3.5 h-3.5 text-kawai-charcoal" />
                    <span className="text-xs font-medium text-kawai-charcoal">{allGalleryImages.length}</span>
                  </div>
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

            {/* Dynamic Price Display - Only show when inventory is tracked */}
            {variationsDisplayPrice && tracksInventory && (
              <div className={cn("flex items-baseline gap-3", textColorClass)}>
                <span className="text-3xl font-bold tracking-wide text-kawai-red">MSRP:</span>
                {variationsDisplayPrice.type === 'single' ? (
                  variationsDisplayPrice.onSale ? (
                    <>
                      {/* compareAtPrice (MSRP) crossed out */}
                      <span className="text-3xl font-bold line-through opacity-60 animate-in fade-in duration-500">
                        {formatPrice(variationsDisplayPrice.compareAtPrice!)}
                      </span>
                      {/* Sale price - to the right, prominent */}
                      <span className="text-3xl font-bold text-kawai-red animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {formatPrice(variationsDisplayPrice.price)}
                      </span>
                    </>
                  ) : (
                    <span className="text-3xl font-bold transition-all duration-300">
                      {formatPrice(variationsDisplayPrice.price)}
                    </span>
                  )
                ) : (
                  <span className="text-3xl font-bold transition-all duration-300">
                    {formatPrice(variationsDisplayPrice.minPrice)} - {formatPrice(variationsDisplayPrice.maxPrice)}
                  </span>
                )}
              </div>
            )}

            {/* Compact Variation Selection */}
            {showVariations && hasVariations && (
              <div className="space-y-3">
                <h3 className={cn("text-base lg:text-lg font-medium", textColorClass)}>Variations</h3>
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
                {/* NEW: Use unified rendering condition */}
                {canAddToCart && selectedVariant ? (
                  <>
                    {/* Left CTA: Add to Cart Button - Compact version */}
                    <AddToCartButton
                      variantId={selectedVariant.id}
                      quantity={1}
                      available={selectedVariant.available}
                      className={cn(
                        "group relative overflow-hidden px-5 lg:px-6 py-2.5 lg:py-3 font-medium rounded-full transition-all duration-300 hover:scale-[1.02] hover:shadow-lg text-sm lg:text-base w-full sm:flex-1",
                        "bg-gradient-to-r from-kawai-red to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:shadow-kawai-red/20"
                      )}
                    >
                      Add to Cart
                    </AddToCartButton>

                    {/* Right CTA: Secondary Button - Compact */}
                    {secondaryAction === 'scroll-to-block' ? (
                      <Button
                        onClick={handleSecondaryScroll}
                        className={cn(
                          "group relative overflow-hidden px-5 lg:px-6 py-2.5 lg:py-3 font-medium rounded-full transition-all duration-300 hover:scale-[1.02] hover:shadow-lg text-sm lg:text-base w-full sm:flex-1",
                          "border-2 border-gray-300 bg-white hover:bg-gray-50",
                          backgroundColor === 'black' ? 'text-gray-900 hover:border-gray-400' : 'text-gray-900 hover:border-gray-400'
                        )}
                      >
                        <span className="relative flex items-center justify-center space-x-1.5 lg:space-x-2">
                          <span>{secondaryText}</span>
                          <svg className="w-3.5 h-3.5 lg:w-4 lg:h-4 transform group-hover:translate-y-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </span>
                      </Button>
                    ) : (
                      <Button
                        asChild
                        className={cn(
                          "group relative overflow-hidden px-5 lg:px-6 py-2.5 lg:py-3 font-medium rounded-full transition-all duration-300 hover:scale-[1.02] hover:shadow-lg text-sm lg:text-base w-full sm:flex-1",
                          "border-2 border-gray-300 bg-white hover:bg-gray-50",
                          backgroundColor === 'black' ? 'text-gray-900 hover:border-gray-400' : 'text-gray-900 hover:border-gray-400'
                        )}
                      >
                        <Link href={secondaryUrl || '#'}>
                          <span className="relative flex items-center justify-center space-x-1.5 lg:space-x-2">
                            <span>{secondaryText}</span>
                            <svg className="w-3.5 h-3.5 lg:w-4 lg:h-4 transform group-hover:translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </span>
                        </Link>
                      </Button>
                    )}
                  </>
                ) : shopifyProduct && selectedVariant && !canAddToCart ? (
                  <div className="w-full flex flex-col gap-2">
                    {/* Out of stock notice - only when inventory is tracked but variant is unavailable */}
                    {isOutOfStock && (
                      <p className="text-xs text-gray-400 text-center tracking-wide">
                        Out of stock. Contact an Authorized Dealer.
                      </p>
                    )}
                    {/* Product doesn't track inventory OR variant not available */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                      {/* Left CTA: Find a Dealer Button - Compact */}
                      <Button
                        asChild
                        className={cn(
                          "group relative overflow-hidden px-5 lg:px-6 py-2.5 lg:py-3 font-medium rounded-full transition-all duration-300 hover:scale-[1.02] hover:shadow-lg text-sm lg:text-base w-full sm:flex-1",
                          "bg-gradient-to-r from-kawai-red to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:shadow-kawai-red/20"
                        )}
                      >
                        <Link href="/find-a-dealer">
                          <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <span className="relative flex items-center justify-center space-x-1.5 lg:space-x-2">
                            <span>{getFindDealerButtonText()}</span>
                            <svg className="w-3.5 h-3.5 lg:w-4 lg:h-4 transform group-hover:translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </span>
                        </Link>
                      </Button>

                      {/* Right CTA: Secondary Button - Compact */}
                      {secondaryAction === 'scroll-to-block' ? (
                        <Button
                          onClick={handleSecondaryScroll}
                          className={cn(
                            "group relative overflow-hidden px-5 lg:px-6 py-2.5 lg:py-3 font-medium rounded-full transition-all duration-300 hover:scale-[1.02] hover:shadow-lg text-sm lg:text-base w-full sm:flex-1",
                            "border-2 border-gray-300 bg-white hover:bg-gray-50",
                            backgroundColor === 'black' ? 'text-gray-900 hover:border-gray-400' : 'text-gray-900 hover:border-gray-400'
                          )}
                        >
                          <span className="relative flex items-center justify-center space-x-1.5 lg:space-x-2">
                            <span>{secondaryText}</span>
                            <svg className="w-3.5 h-3.5 lg:w-4 lg:h-4 transform group-hover:translate-y-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </span>
                        </Button>
                      ) : (
                        <Button
                          asChild
                          className={cn(
                            "group relative overflow-hidden px-5 lg:px-6 py-2.5 lg:py-3 font-medium rounded-full transition-all duration-300 hover:scale-[1.02] hover:shadow-lg text-sm lg:text-base w-full sm:flex-1",
                            "border-2 border-gray-300 bg-white hover:bg-gray-50",
                            backgroundColor === 'black' ? 'text-gray-900 hover:border-gray-400' : 'text-gray-900 hover:border-gray-400'
                          )}
                        >
                          <Link href={secondaryUrl || '#'}>
                            <span className="relative flex items-center justify-center space-x-1.5 lg:space-x-2">
                              <span>{secondaryText}</span>
                              <svg className="w-3.5 h-3.5 lg:w-4 lg:h-4 transform group-hover:translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>
                            </span>
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Fallback: No Shopify product or variant - Learn More button only */
                  <Button
                    asChild
                    className={cn(
                      "group relative overflow-hidden px-5 lg:px-6 py-2.5 lg:py-3 font-medium rounded-full transition-all duration-300 hover:scale-[1.02] hover:shadow-lg text-sm lg:text-base w-full sm:flex-1",
                      "bg-gradient-to-r from-kawai-red to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:shadow-kawai-red/20"
                    )}
                  >
                    <Link href={`/products/${product.slug}` || '#'}>
                      <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="relative flex items-center justify-center space-x-1.5 lg:space-x-2">
                        <span>{getBuyButtonText()}</span>
                        <svg className="w-3.5 h-3.5 lg:w-4 lg:h-4 transform group-hover:translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </span>
                      </Link>
                    </Button>
                )}
              </div>
            )}
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
              onClick={() => allGalleryImages.length > 0 && setIsGalleryOpen(true)}
              role={allGalleryImages.length > 0 ? "button" : undefined}
              tabIndex={allGalleryImages.length > 0 ? 0 : undefined}
              onKeyDown={(e) => {
                if (allGalleryImages.length > 0 && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault()
                  setIsGalleryOpen(true)
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
                    onClick={() => setIsGalleryOpen(true)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setIsGalleryOpen(true)
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
        initialIndex={currentImageIndex}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
      />

      {/* NEW: Integrated Floating Add to Cart Button */}
      {/* CRITICAL: This button receives variant selection from parent state */}
      {/* User selects variation → Both hero AND floating button add same variant */}
      {floatingEnabled && canAddToCart && selectedVariant && (() => {
        // Debug: Log what we're passing to floating button
        console.log('[ProductHeroBlock] Rendering FloatingAddToCart:', {
          floatingEnabled,
          canAddToCart,
          hasSelectedVariant: !!selectedVariant,
          variantName: floatingShowVariantName && selectedVariation >= 0 && availableVariations[selectedVariation]
            ? availableVariations[selectedVariation]?.name
            : null,
          availableVariationsCount: availableVariations.length,
          selectedVariation,
          availableVariations: availableVariations.map(v => ({ name: v.name, available: v.available }))
        })

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
              // Update parent state when variation is changed from floating button
              console.log('[ProductHeroBlock] Variation changed to index:', index)
              setSelectedVariation(index)
            }}
          />
        )
      })()}
    </section>
  )
}
