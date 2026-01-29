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
import { useRouter } from 'next/navigation'
import { ShoppingCart, Heart, Share2, CheckCircle, Sparkles, Clock, Play, Volume2, ChevronDown, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { Product as ShopifyProduct } from '@/lib/shopify/types'
import { AddToCartButton } from '@/components/cart/AddToCartButton'

interface ProductHeroBlockProps {
  layout?: {
    imagePosition?: 'left' | 'right' | null
    backgroundColor?: 'pearl' | 'white' | 'black' | null
    showVariations?: boolean | null
    showPrice?: boolean | null
    showBuyButton?: boolean | null
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
  const router = useRouter()

  // Helper function to truncate description
  const truncateDescription = (text: string, wordLimit: number = 25) => {
    const words = text.split(' ')
    if (words.length <= wordLimit) return text
    return words.slice(0, wordLimit).join(' ') + '...'
  }

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
  const displayDescription = overrides.customDescription || product.description

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

  // Get the buy button text - hardcoded to "Learn More"
  const getBuyButtonText = () => {
    return 'Learn More'
  }

  // Get the find a dealer button text
  const getFindDealerButtonText = () => {
    return 'Find a Dealer'
  }
  
  // Enhanced price formatting with animations
  const formatPrice = () => {
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
    <section className={`relative min-h-[70vh] lg:min-h-[90vh] overflow-visible ${backgroundClass}`}>
      {/* Subtle gradient overlay for better image blending */}
      {backgroundColor !== 'black' && (
        <div className="absolute inset-0 bg-gradient-to-b from-stone-50/30 via-white to-stone-50/30" />
      )}
      
      {/* Back Button - Fixed/Sticky Floating Position (Below Header) */}
      <div className="fixed top-[110px] lg:top-[160px] left-12 z-40 pointer-events-auto">
        <button
          onClick={() => router.back()}
          className={cn(
            "flex items-center gap-2",
            "text-kawai-red hover:text-red-600",
            "underline underline-offset-4 decoration-2",
            "transition-colors duration-200",
            "bg-transparent border-0 p-0"
          )}
          aria-label="Go back to previous page"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-lg font-medium">Back</span>
        </button>
      </div>
      
      {/* Main Content Container */}
      <div className="container mx-auto px-6 lg:px-12 xl:px-16 relative z-10 pt-30 pb-12 lg:pt-48 lg:pb-20">
        
        <div className={cn(
          "grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 w-full",
          imagePosition === 'right' ? 'lg:grid-flow-col-reverse' : ''
        )}>
          
          {/* Content Section - 5 columns on desktop */}
          <div className="lg:col-span-5 space-y-6 lg:space-y-8 order-1 lg:order-none">
            
            {/* KAWAI Brand Badge */}
            <div className="flex items-center space-x-4 opacity-90">
              <div className={cn(
                "w-12 h-[1px] bg-gradient-to-r to-transparent",
                backgroundColor === 'black' ? 'from-kawai-red' : 'from-kawai-red'
              )} />
              <span className={cn(
                "text-sm tracking-[0.3em] uppercase font-medium",
                backgroundColor === 'black' ? 'text-kawai-red' : 'text-kawai-red'
              )}>
                Crafted Since 1927
              </span>
            </div>
            
            {/* Hero Headlines with modern typography */}
            <div className="space-y-4 lg:space-y-6">
              {displayTitle && (
                <h1 className={cn(
                  "text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-[1.1]",
                  textColorClass
                )}>
                  {displayTitle}
                </h1>
              )}
              
              {/* Model Display - Prominent with improved spacing */}
              {modelDisplay && (
                <div className="flex items-center space-x-4 mt-6 lg:mt-4">
                  <div className="w-1 h-12 lg:h-16 bg-gradient-to-b from-kawai-red to-red-600 rounded-full" />
                  <div>
                    <p className={cn(
                      "text-sm tracking-wide uppercase font-medium",
                      backgroundColor === 'black' ? 'text-kawai-red' : 'text-kawai-red'
                    )}>Model</p>
                    <p className={cn(
                      "text-xl lg:text-2xl xl:text-3xl font-light",
                      textColorClass
                    )}>
                      {modelDisplay}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modern Variation Selection */}
            {showVariations && hasVariations && (
              <div className="space-y-6">
                <h3 className={cn("text-2xl font-light", textColorClass)}>Available Variations</h3>
                <div className="grid grid-cols-2 gap-4">
                  {availableVariations.map((variation, index) => (
                    <div
                      key={index}
                      className={cn(
                        "cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 backdrop-blur-sm",
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
                        // Toggle selection: if already selected, deselect; otherwise select this variation
                        setSelectedVariation(selectedVariation === index ? -1 : index)
                      }}
                    >
                      <div className="flex items-center">
                        <span className="font-medium">{variation.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Modern CTA Buttons */}
            {shouldShowBuyButton && (
              <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 pt-4 lg:pt-6">
                {shopifyProduct && selectedVariant && tracksInventory && selectedVariant.available ? (
                  <>
                    {/* Left CTA: Add to Cart Button - Only shown when inventory is tracked AND in stock */}
                    <AddToCartButton
                      variantId={selectedVariant.id}
                      quantity={1}
                      available={selectedVariant.available}
                      className={cn(
                        "group relative overflow-hidden px-8 lg:px-10 py-4 lg:py-6 font-medium rounded-full transition-all duration-500 hover:scale-105 hover:shadow-2xl text-base lg:text-lg flex-1",
                        "bg-gradient-to-r from-kawai-red to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:shadow-kawai-red/25"
                      )}
                    >
                      Add to Cart
                    </AddToCartButton>

                    {/* Right CTA: Learn More Button (White/Outline) */}
                    <Button
                      asChild
                      className={cn(
                        "group relative overflow-hidden px-8 lg:px-10 py-4 lg:py-6 font-medium rounded-full transition-all duration-500 hover:scale-105 hover:shadow-xl text-base lg:text-lg flex-1",
                        "border-2 border-gray-300 bg-white hover:bg-gray-50",
                        backgroundColor === 'black' ? 'text-gray-900 hover:border-gray-400' : 'text-gray-900 hover:border-gray-400'
                      )}
                    >
                      <Link href={`/products/${product.slug}` || '#'}>
                        <span className="relative flex items-center justify-center space-x-2 lg:space-x-3">
                          <span>{getBuyButtonText()}</span>
                          <svg className="w-4 h-4 lg:w-5 lg:h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </span>
                      </Link>
                    </Button>
                  </>
                ) : shopifyProduct && selectedVariant && (!tracksInventory || !selectedVariant.available) ? (
                  <>
                    {/* Left CTA: Find a Dealer Button - Shown when inventory is NOT tracked OR out of stock */}
                    <Button
                      asChild
                      className={cn(
                        "group relative overflow-hidden px-8 lg:px-10 py-4 lg:py-6 font-medium rounded-full transition-all duration-500 hover:scale-105 hover:shadow-2xl text-base lg:text-lg flex-1",
                        "bg-gradient-to-r from-kawai-red to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:shadow-kawai-red/25"
                      )}
                    >
                      <Link href="/find-a-dealer">
                        <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <span className="relative flex items-center justify-center space-x-2 lg:space-x-3">
                          <span>{getFindDealerButtonText()}</span>
                          <svg className="w-4 h-4 lg:w-5 lg:h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </span>
                      </Link>
                    </Button>

                    {/* Right CTA: Learn More Button (White/Outline) */}
                    <Button
                      asChild
                      className={cn(
                        "group relative overflow-hidden px-8 lg:px-10 py-4 lg:py-6 font-medium rounded-full transition-all duration-500 hover:scale-105 hover:shadow-xl text-base lg:text-lg flex-1",
                        "border-2 border-gray-300 bg-white hover:bg-gray-50",
                        backgroundColor === 'black' ? 'text-gray-900 hover:border-gray-400' : 'text-gray-900 hover:border-gray-400'
                      )}
                    >
                      <Link href={`/products/${product.slug}` || '#'}>
                        <span className="relative flex items-center justify-center space-x-2 lg:space-x-3">
                          <span>{getBuyButtonText()}</span>
                          <svg className="w-4 h-4 lg:w-5 lg:h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </span>
                      </Link>
                    </Button>
                  </>
                ) : (
                  /* Fallback: Learn More button only (no Shopify integration) */
                  <Button
                    asChild
                    className={cn(
                      "group relative overflow-hidden px-8 lg:px-10 py-4 lg:py-6 font-medium rounded-full transition-all duration-500 hover:scale-105 hover:shadow-2xl text-base lg:text-lg flex-1",
                      "bg-gradient-to-r from-kawai-red to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:shadow-kawai-red/25"
                    )}
                  >
                    <Link href={`/products/${product.slug}` || '#'}>
                      <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <span className="relative flex items-center justify-center space-x-2 lg:space-x-3">
                        <span>{getBuyButtonText()}</span>
                        <svg className="w-4 h-4 lg:w-5 lg:h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </div>
          
          {/* Image Section - Full width on mobile, 7 columns on desktop */}
          <div className="lg:col-span-7 relative order-2 lg:order-none space-y-8">
            {displayImage && (
              <div className="relative">
                
                {/* Main piano showcase */}
                <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[500px] xl:h-[600px] min-h-[300px] sm:min-h-[400px] lg:min-h-[500px] xl:min-h-[600px] overflow-hidden rounded-2xl">
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
                        className="object-contain"
                        priority={true}
                        sizes="(max-width: 1024px) 50vw, 40vw"
                        alt={optimizedProps.alt || displayTitle || 'Product image'}
                      />
                    )
                  })()}
                  
                  {/* Custom badge */}
                  {overrides.badge && (
                    <Badge className="absolute top-6 left-6 bg-kawai-red text-white font-bold text-sm px-4 py-2 rounded-full">
                      {overrides.badge}
                    </Badge>
                  )}
                  
                  {/* Status badge */}
                  {statusBadge && (
                    <Badge className={cn("absolute bottom-6 right-6 font-bold text-sm px-4 py-2 rounded-full flex items-center gap-2", statusBadge.className)}>
                      {statusBadge.icon && createElement(statusBadge.icon, { className: "h-3 w-3" })}
                      {statusBadge.text}
                    </Badge>
                  )}
                </div>
              </div>
            )}
            
            {/* Description directly under the image */}
            {displayDescription && (
              <div className="space-y-4">
                <p className={cn(
                  "text-lg lg:text-xl font-light leading-relaxed",
                  accentColorClass
                )}>
                  {truncateDescription(displayDescription)}
                </p>
                
                {displayDescription.split(' ').length > 25 && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className={cn(
                        "inline-flex items-center space-x-2 text-kawai-red hover:text-red-600 transition-colors duration-200 font-medium",
                        "hover:underline underline-offset-4"
                      )}>
                        <span>Read More</span>
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-kawai-red">
                          {displayTitle}
                        </DialogTitle>
                      </DialogHeader>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-4">
                        {/* Full Description */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-slate-900">Description</h3>
                          <p className="text-base leading-relaxed text-slate-700">
                            {displayDescription}
                          </p>
                          
                          {/* Model Information */}
                          {modelDisplay && (
                            <div className="space-y-2 pt-4 border-t border-gray-200">
                              <h4 className="font-medium text-slate-900">Model</h4>
                              <p className="text-slate-600">{modelDisplay}</p>
                            </div>
                          )}
                          
                          {/* Key Features */}
                          {keyFeatures && keyFeatures.length > 0 && (
                            <div className="space-y-2 pt-4 border-t border-gray-200">
                              <h4 className="font-medium text-slate-900">Key Features</h4>
                              <ul className="space-y-1 text-slate-600">
                                {keyFeatures.map((feature: string, index: number) => (
                                  <li key={index} className="flex items-start space-x-2">
                                    <CheckCircle className="w-4 h-4 text-kawai-red mt-0.5 flex-shrink-0" />
                                    <span>{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                        
                        {/* Product Image */}
                        <div className="relative">
                          {displayImage && (
                            <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                              {(() => {
                                const imageProps = getOptimizedImageProps(displayImage, 'hero')
                                if (!imageProps || !imageProps.src) {
                                  return (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <span className="text-lg font-medium text-slate-600">
                                        Product Image
                                      </span>
                                    </div>
                                  )
                                }
                                
                                const { width, height, ...optimizedProps } = imageProps
                                
                                return (
                                  <Image
                                    {...optimizedProps}
                                    fill
                                    className="object-contain"
                                    alt={optimizedProps.alt || displayTitle || 'Product image'}
                                  />
                                )
                              })()}
                            </div>
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            )}
          </div>
        </div>
        
      </div>
    </section>
  )
}