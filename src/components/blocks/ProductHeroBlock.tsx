'use client'

import { Media, Product } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import { getOptimizedImageProps } from '@/lib/media/r2-utils'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, createElement } from 'react'
import { ShoppingCart, Heart, Share2, CheckCircle, Sparkles, Clock, Play, Volume2 } from 'lucide-react'
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
  floatingCart = {}, // NEW: Floating cart configuration
  overrides = {},
  product,
  shopifyProduct
}: ProductHeroBlockProps) {
  // Filter variations to only include available ones - MUST be declared early
  const availableVariations = product?.variations?.filter(variation => variation.available) || []

  // Default to first variation (index 0) if variations exist, otherwise -1
  const defaultVariation = availableVariations.length > 0 ? 0 : -1
  const [selectedVariation, setSelectedVariation] = useState(defaultVariation)
  const [isFavorited, setIsFavorited] = useState(false)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)

  // CRITICAL: Sync selectedVariation when availableVariations changes (handles async product loading)
  useEffect(() => {
    // If variations exist but nothing selected, select first one
    if (availableVariations.length > 0 && selectedVariation < 0) {
      setSelectedVariation(0)
    }
    // If no variations exist but something is selected, deselect
    else if (availableVariations.length === 0 && selectedVariation >= 0) {
      setSelectedVariation(-1)
    }
    // If selected index is out of bounds, reset to first
    else if (selectedVariation >= availableVariations.length) {
      setSelectedVariation(0)
    }
  }, [availableVariations.length, selectedVariation])

  // Get selected Shopify variant based on variation selection
  const getSelectedVariant = () => {
    if (!shopifyProduct) return null

    // If no variation selected or only one variant, return first variant
    if (selectedVariation < 0 || shopifyProduct.variants.length === 1) {
      return shopifyProduct.variants[0]
    }

    // Try to match variation name with variant title
    if (availableVariations[selectedVariation]) {
      const variationName = availableVariations[selectedVariation]?.name
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

  // availableVariations already declared at top of component
  const hasVariations = availableVariations.length > 0
  // CONSOLIDATED: Updated price field names (msrp only, priceText removed)
  const hasPrice = product.price && product.price.msrp
  
  // Get display image - priority: custom override > selected variation image > main product image > imageUrl fallback
  const getDisplayImage = () => {
    if (overrides.customImage) {
      return overrides.customImage
    }

    // If a variation is selected, check for variation image (Media object or URL)
    if (selectedVariation >= 0 && availableVariations[selectedVariation]) {
      const selectedVariationData = availableVariations[selectedVariation]

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

  // Find the current image index in the gallery
  const getCurrentImageIndex = () => {
    if (!displayImage || galleryImages.length === 0) return 0

    // Get the URL from displayImage (could be string or Media object)
    const displayImageUrl = typeof displayImage === 'string'
      ? displayImage
      : displayImage?.url

    if (!displayImageUrl) return 0

    // Find matching image in gallery
    const index = galleryImages.findIndex(img => img.url === displayImageUrl)
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
      onSale: matchedVariant.compareAtPrice !== null && matchedVariant.compareAtPrice > matchedVariant.price
    } : null
  }

  // Get display price for variations section
  const getVariationsDisplayPrice = () => {
    if (!shopifyProduct) return null

    // If product has variations, handle variation-based pricing
    if (hasVariations) {
      // If a variation is selected, show that variation's price
      if (selectedVariation >= 0 && availableVariations[selectedVariation]) {
        const variationPrice = getVariationPrice(availableVariations[selectedVariation]?.name || '')
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
      const prices = availableVariations
        .map(v => getVariationPrice(v.name || ''))
        .filter((p): p is NonNullable<typeof p> => p !== null)
        .map(p => p.price)

      if (prices.length === 0) return null

      const minPrice = Math.min(...prices)
      const maxPrice = Math.max(...prices)

      // If only one unique price or one variation, show single price
      if (minPrice === maxPrice || availableVariations.length === 1) {
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
      ? availableVariations[selectedVariation]?.price
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
    variationImageData: selectedVariation >= 0 && availableVariations[selectedVariation] ? {
      variationName: availableVariations[selectedVariation]?.name,
      hasMediaImage: !!(availableVariations[selectedVariation]?.image),
      hasImageUrl: !!(availableVariations[selectedVariation]?.imageUrl),
      mediaImageUrl: typeof availableVariations[selectedVariation]?.image === 'object' ?
        availableVariations[selectedVariation]?.image?.url : null,
      imageUrl: availableVariations[selectedVariation]?.imageUrl,
      selectedImageSource: (() => {
        const variation = availableVariations[selectedVariation]
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
    <section className={`relative overflow-visible ${backgroundClass}`}>
      {/* Subtle gradient overlay for better image blending */}
      {backgroundColor !== 'black' && (
        <div className="absolute inset-0 bg-gradient-to-b from-stone-50/30 via-white to-stone-50/30" />
      )}

      {/* Main Content Container - Significantly reduced padding */}
      <div className="container mx-auto px-6 lg:px-12 xl:px-16 relative z-10 py-6 lg:py-10">

        <div className={cn(
          "grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 w-full items-start",
          imagePosition === 'right' ? 'lg:grid-flow-col-reverse' : ''
        )}>

          {/* Part 1: Brand + Title + Model + MSRP + Variations + CTAs - All in left column */}
          <div className="space-y-4 lg:space-y-5 order-1 lg:col-span-5 lg:col-start-1">

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
                  <div className="flex items-baseline gap-3">
                    {variationsDisplayPrice.onSale ? (
                      <>
                        {/* Sale Price - Fade in with scale */}
                        <span className="text-3xl font-bold text-kawai-red animate-in fade-in slide-in-from-bottom-2 duration-500">
                          {formatPrice(variationsDisplayPrice.price)}
                        </span>
                        {/* Original Price - Crossout with fade */}
                        <span className="text-xl line-through opacity-60 animate-in fade-in duration-700 delay-200">
                          {formatPrice(variationsDisplayPrice.compareAtPrice!)}
                        </span>
                      </>
                    ) : (
                      <span className="text-3xl font-bold transition-all duration-300">
                        {formatPrice(variationsDisplayPrice.price)}
                      </span>
                    )}
                  </div>
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
                <h3 className={cn("text-base lg:text-lg font-medium", textColorClass)}>Available Variations</h3>
                {(() => {
                  console.log('[ProductHeroBlock] Rendering variations:', {
                    showVariations,
                    hasVariations,
                    availableVariationsCount: availableVariations.length,
                    selectedVariation,
                    variations: availableVariations.map((v, i) => ({
                      index: i,
                      name: v.name,
                      selected: selectedVariation === i
                    }))
                  })
                  return null
                })()}
                <div className="grid grid-cols-2 gap-2">
                  {availableVariations.map((variation, index) => (
                    <div
                      key={index}
                      className={cn(
                        "cursor-pointer p-2.5 lg:p-3 rounded-lg border-2 transition-all duration-300 backdrop-blur-sm",
                        selectedVariation === index
                          ? cn(
                              'border-kawai-red',
                              backgroundColor === 'black' ? 'bg-kawai-red/20 text-white' : 'bg-kawai-red/10 text-kawai-red'
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
                      onClick={() => {
                        console.log('[ProductHeroBlock] Variation clicked:', {
                          index,
                          variationName: variation.name,
                          currentSelection: selectedVariation,
                          willSelect: selectedVariation === index ? -1 : index
                        })
                        // Toggle selection: if already selected, deselect; otherwise select this variation
                        setSelectedVariation(selectedVariation === index ? -1 : index)
                      }}
                    >
                      {/* Variation name */}
                      <div className="flex items-center">
                        <span className="text-sm font-medium">{variation.name}</span>
                      </div>
                    </div>
                  ))}
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

                    {/* Right CTA: Learn More Button - Compact */}
                    <Button
                      asChild
                      className={cn(
                        "group relative overflow-hidden px-5 lg:px-6 py-2.5 lg:py-3 font-medium rounded-full transition-all duration-300 hover:scale-[1.02] hover:shadow-lg text-sm lg:text-base w-full sm:flex-1",
                        "border-2 border-gray-300 bg-white hover:bg-gray-50",
                        backgroundColor === 'black' ? 'text-gray-900 hover:border-gray-400' : 'text-gray-900 hover:border-gray-400'
                      )}
                    >
                      <Link href={`/products/${product.slug}` || '#'}>
                        <span className="relative flex items-center justify-center space-x-1.5 lg:space-x-2">
                          <span>{getBuyButtonText()}</span>
                          <svg className="w-3.5 h-3.5 lg:w-4 lg:h-4 transform group-hover:translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </span>
                      </Link>
                    </Button>
                  </>
                ) : shopifyProduct && selectedVariant && !canAddToCart ? (
                  <>
                    {/* Product doesn't track inventory OR variant not available */}
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

                    {/* Right CTA: Learn More Button - Compact */}
                    <Button
                      asChild
                      className={cn(
                        "group relative overflow-hidden px-5 lg:px-6 py-2.5 lg:py-3 font-medium rounded-full transition-all duration-300 hover:scale-[1.02] hover:shadow-lg text-sm lg:text-base w-full sm:flex-1",
                        "border-2 border-gray-300 bg-white hover:bg-gray-50",
                        backgroundColor === 'black' ? 'text-gray-900 hover:border-gray-400' : 'text-gray-900 hover:border-gray-400'
                      )}
                    >
                      <Link href={`/products/${product.slug}` || '#'}>
                        <span className="relative flex items-center justify-center space-x-1.5 lg:space-x-2">
                          <span>{getBuyButtonText()}</span>
                          <svg className="w-3.5 h-3.5 lg:w-4 lg:h-4 transform group-hover:translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </span>
                      </Link>
                    </Button>
                  </>
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

          {/* Image Section - Compact, right column */}
          <div className="order-2 lg:order-none lg:col-span-7 lg:col-start-6 lg:row-start-1 relative">
            {displayImage && (
              <div className="relative">

                {/* Compact piano showcase */}
                <div
                  className={cn(
                    "relative w-full h-[240px] sm:h-[280px] lg:h-[320px] xl:h-[380px] overflow-hidden rounded-xl",
                    galleryImages.length > 0 && "cursor-pointer group"
                  )}
                  onClick={() => galleryImages.length > 0 && setIsGalleryOpen(true)}
                  role={galleryImages.length > 0 ? "button" : undefined}
                  tabIndex={galleryImages.length > 0 ? 0 : undefined}
                  onKeyDown={(e) => {
                    if (galleryImages.length > 0 && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault()
                      setIsGalleryOpen(true)
                    }
                  }}
                  aria-label={galleryImages.length > 0 ? "Open image gallery" : undefined}
                >
                  {/* Compact hover overlay hint for gallery */}
                  {galleryImages.length > 0 && (
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 z-10 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        <span className="text-xs font-medium text-kawai-charcoal">
                          View Gallery ({galleryImages.length})
                        </span>
                      </div>
                    </div>
                  )}

                  {(() => {
                    if (!displayImage) {
                      return (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className={cn("text-lg font-medium", accentColorClass)}>
                            Product Image
                          </span>
                        </div>
                      )
                    }

                    // Get optimized image props using the R2 optimization system
                    const imageProps = getOptimizedImageProps(displayImage, 'hero')

                    if (!imageProps || !imageProps.src) {
                      return (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className={cn("text-lg font-medium", accentColorClass)}>
                            Image Load Error
                          </span>
                        </div>
                      )
                    }

                    // Use fill layout for responsive container, excluding width/height from spread
                    const { width, height, ...optimizedProps } = imageProps

                    return (
                      <Image
                        {...optimizedProps}
                        fill
                        className="object-contain transition-transform duration-300 group-hover:scale-105"
                        priority={true}
                        sizes="(max-width: 1024px) 50vw, 40vw"
                        alt={optimizedProps.alt || displayTitle || 'Product image'}
                      />
                    )
                  })()}

                  {/* Compact custom badge */}
                  {overrides.badge && (
                    <Badge className="absolute top-3 left-3 bg-kawai-red text-white font-bold text-xs px-3 py-1 rounded-full">
                      {overrides.badge}
                    </Badge>
                  )}

                  {/* Compact status badge */}
                  {statusBadge && (
                    <Badge className={cn("absolute bottom-3 right-3 font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1.5", statusBadge.className)}>
                      {statusBadge.icon && createElement(statusBadge.icon, { className: "h-3 w-3" })}
                      {statusBadge.text}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Image Gallery Lightbox */}
      <ImageGalleryLightbox
        images={galleryImages}
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
              // Show variant name if enabled AND a variation is selected
              floatingShowVariantName && selectedVariation >= 0 && availableVariations[selectedVariation]
                ? availableVariations[selectedVariation]?.name
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
