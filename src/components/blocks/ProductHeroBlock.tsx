'use client'

import { Media, Product } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import { getOptimizedImageProps } from '@/lib/media/r2-utils'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ShoppingCart, Heart, Share2, CheckCircle, Sparkles, Clock, Play, Volume2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProductHeroBlockProps {
  layout?: {
    imagePosition?: 'left' | 'right' | null
    backgroundColor?: 'pearl' | 'white' | 'black' | null
    showFinishes?: boolean | null
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
}

export function ProductHeroBlock({
  layout = {},
  overrides = {},
  product
}: ProductHeroBlockProps) {
  const [selectedFinish, setSelectedFinish] = useState(-1) // -1 means no finish selected
  const [isFavorited, setIsFavorited] = useState(false)
  
  
  // Layout options
  const imagePosition = layout.imagePosition || 'left'
  const backgroundColor = layout.backgroundColor || 'pearl'
  const showFinishes = layout.showFinishes !== false
  const showPrice = layout.showPrice !== false
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
  const displayDescription = overrides.customDescription || product.shortDescription || product.description
  
  // CONSOLIDATED: Use the new root-level model field
  const modelDisplay = product.model || product.name
  
  // CONSOLIDATED: Direct access to key features from Product
  const keyFeatures = product.keyFeatures 
    ? product.keyFeatures.slice(0, 3).map((feature: any) => feature.feature)
    : [
        "Millennium III Hybrid Action Technology", 
        "Hand-selected premium soundboard materials",
        "Professional-grade KAWAI precision craftsmanship"
      ]
  const hasFinishes = product.finishes && product.finishes.length > 0
  // CONSOLIDATED: Updated price field names (msrp instead of amount)
  const hasPrice = product.price && (product.price.msrp || product.price.priceText)
  
  // Get display image - priority: custom override > selected finish image > main product image > imageUrl fallback
  const getDisplayImage = () => {
    if (overrides.customImage) {
      return overrides.customImage
    }
    
    // If a finish is selected, check for finish image (Media object or URL)
    if (selectedFinish >= 0 && product.finishes && product.finishes[selectedFinish]) {
      const selectedFinishData = product.finishes[selectedFinish]
      
      // Check if finish has a valid Media image
      const isFinishImageValid = selectedFinishData.image && 
        typeof selectedFinishData.image === 'object' && 
        selectedFinishData.image.url && 
        selectedFinishData.image.url.trim() !== ''
      
      if (isFinishImageValid) {
        return selectedFinishData.image
      }
      
      // Fallback to finish imageUrl if Media image is not valid
      if (selectedFinishData.imageUrl && selectedFinishData.imageUrl.trim() !== '') {
        return selectedFinishData.imageUrl
      }
    }
    
    // Check if main product image is properly populated (Media object with url)
    const isMainImageValid = product.mainImage && 
      typeof product.mainImage === 'object' && 
      product.mainImage.url && 
      product.mainImage.url.trim() !== ''
    
    if (isMainImageValid) {
      return product.mainImage
    }
    
    // Fallback to imageUrl if mainImage is not properly populated
    if (product.imageUrl && product.imageUrl.trim() !== '') {
      return product.imageUrl
    }
    
    // No image available
    return null
  }
  
  const displayImage = getDisplayImage()
  
  // Fixed buy button logic - show if layout showBuyButton is enabled and product button exists and is not explicitly disabled
  const shouldShowBuyButton = showBuyButton && product.buyButton && (product.buyButton.showButton !== false)
     
  console.log('Debug - Buy button visibility logic:', {
    layoutShowBuyButton: showBuyButton,
    hasBuyButton: !!product.buyButton,
    productShowButton: product.buyButton?.showButton,
    showButtonNotFalse: product.buyButton?.showButton !== false,
    shouldShowBuyButton,
    buyButtonData: product.buyButton
  })
     
  // Get the buy button text - product.buyButton.text is required when buyButton exists
  const getBuyButtonText = () => {
    console.log('Debug - Buy button data:', {
      buyButton: product.buyButton,
      buyButtonText: product.buyButton?.text,
      hasPrice,
      showBuyButton,
      shouldShowBuyButton
    })
    
    if (!product.buyButton?.text) {
      console.log('No buy button text found, returning default')
      return 'Contact for Details'
    }
    
    console.log('Using buy button text from product:', product.buyButton.text)
    return product.buyButton.text
  }
  
  // Enhanced price formatting with animations
  const formatPrice = () => {
    if (!product.price) return 'Contact for pricing'
    
    if (product.price.priceText) {
      return product.price.priceText
    }
    
    // CONSOLIDATED: Updated to use msrp instead of amount
    if (!product.price.msrp) {
      return 'Contact for pricing'
    }
    
    const currency = product.price.currency || 'USD'
    const currencySymbols = { USD: '$', EUR: '€', GBP: '£', CAD: 'C$' }
    const symbol = currencySymbols[currency] || '$'
    
    // Calculate price with finish modifier (only if a finish is selected)
    const basePrice = product.price.msrp
    const finishModifier = hasFinishes && selectedFinish >= 0 && product.finishes![selectedFinish]?.priceModifier || 0
    const adjustedPrice = basePrice + finishModifier
    const mainPrice = `${symbol}${adjustedPrice.toLocaleString()}`
    
    // CONSOLIDATED: Updated to use salePrice instead of saleAmount
    if (product.price.salePrice) {
      const adjustedSalePrice = product.price.salePrice + finishModifier
      const salePrice = `${symbol}${adjustedSalePrice.toLocaleString()}`
      const savings = adjustedPrice - adjustedSalePrice
      return (
        <div className="space-y-1">
          <div className="flex items-baseline gap-3">
            <span className="text-emerald-600 font-bold text-4xl">{salePrice}</span>
            <span className="text-muted-foreground line-through text-2xl">{mainPrice}</span>
          </div>
          <Badge variant="destructive" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
            Save ${savings.toLocaleString()}
          </Badge>
        </div>
      )
    }
    
    return <span className="text-4xl font-bold">{mainPrice}</span>
  }
  
  // Enhanced background styling with warmer tints
  const getBackgroundClasses = () => {
    switch (backgroundColor) {
      case 'black':
        return 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
      case 'white':
        return 'bg-gradient-to-br from-amber-50/30 via-white to-orange-50/20'
      default:
        return 'bg-gradient-to-br from-amber-100/40 via-white to-orange-100/30'
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
  
  // Status badge configuration
  const getStatusBadge = () => {
    switch (product.status) {
      case 'limited-edition':
        return {
          text: 'Limited Edition',
          icon: Sparkles,
          className: 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white'
        }
      case 'coming-soon':
        return {
          text: 'Coming Soon',
          icon: Clock,
          className: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
        }
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
  
  // CONSOLIDATED: Debug log with new consolidated structure and image fallback logic
  console.log('ProductHeroBlock - Product data (consolidated structure):', {
    product,
    keyFeatures: product?.keyFeatures,
    // Consolidated fields (now at root level)
    model: product?.model,
    series: product?.series,
    rating: product?.rating,
    reviews: product?.reviews,
    badge: product?.badge,
    highlight: product?.highlight,
    specifications: product?.specifications,
    buyButton: product?.buyButton,
    price: product?.price,
    finishes: product?.finishes,
    selectedFinish,
    selectedFinishData: selectedFinish >= 0 && product?.finishes ? product.finishes[selectedFinish] : null,
    selectedFinishImage: selectedFinish >= 0 && product?.finishes ? product.finishes[selectedFinish]?.image : null,
    selectedFinishImageUrl: selectedFinish >= 0 && product?.finishes ? product.finishes[selectedFinish]?.imageUrl : null,
    // Image fallback debugging
    mainImage: product?.mainImage,
    mainImageType: typeof product?.mainImage,
    mainImageUrl: typeof product?.mainImage === 'object' ? product?.mainImage?.url : undefined,
    imageUrl: product?.imageUrl,
    displayImage: typeof displayImage === 'object' ? displayImage?.url : displayImage,
    displayImageType: typeof displayImage,
    hasMainImage: !!product?.mainImage,
    hasImageUrl: !!product?.imageUrl,
    isMainImageValid: product?.mainImage && 
      typeof product?.mainImage === 'object' && 
      product?.mainImage.url && 
      product?.mainImage.url.trim() !== '',
    isImageUrlValid: product?.imageUrl && product?.imageUrl.trim() !== '',
    imageSource: (() => {
      const isMainImageValid = product?.mainImage && 
        typeof product?.mainImage === 'object' && 
        product?.mainImage.url && 
        product?.mainImage.url.trim() !== ''
      
      if (isMainImageValid) return 'mainImage (Media)'
      if (product?.imageUrl && product?.imageUrl.trim() !== '') return 'imageUrl (string)'
      return 'none'
    })()
  })
  
  return (
    <section className={`relative min-h-[70vh] lg:min-h-[90vh] overflow-visible ${backgroundClass}`}>
      {/* Warm background with fade to white in center */}
      <div className="absolute inset-0">
        {backgroundColor === 'black' ? (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,69,19,0.08),transparent_50%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_30%,rgba(160,82,45,0.04)_50%,transparent_70%)]" />
          </>
        ) : (
          <>
            {/* Square/rectangular gradient fading to white in center following component outline */}
            <div className="absolute inset-0 bg-gradient-to-r from-stone-100/6 via-white via-90% to-stone-100/6" />
            <div className="absolute inset-0 bg-gradient-to-b from-amber-50/4 from-5% via-white via-95% to-amber-50/4" />
            {/* Very subtle earthy corner accents */}
            <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_0%_0%,rgba(120,113,108,0.03)_0deg,transparent_90deg),conic-gradient(from_90deg_at_100%_0%,rgba(161,161,170,0.03)_0deg,transparent_90deg),conic-gradient(from_180deg_at_100%_100%,rgba(120,113,108,0.03)_0deg,transparent_90deg),conic-gradient(from_270deg_at_0%_100%,rgba(161,161,170,0.03)_0deg,transparent_90deg)]" />
          </>
        )}
      </div>
      
      {/* Main Content Container */}
      <div className="container mx-auto px-6 lg:px-12 xl:px-16 relative z-10 py-12 lg:py-20">
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
                  "bg-gradient-to-r from-kawai-red via-red-500 to-red-600 bg-clip-text text-transparent"
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
            
            {/* Mobile Image Section - Show after heading but before description */}
            <div className="lg:hidden relative order-1">
              {displayImage && (
                <div className="relative">
                  
                  {/* Glassmorphism frame - adapts to background */}
                  <div className={cn(
                    "absolute -inset-6 backdrop-blur-2xl border rounded-3xl opacity-50",
                    backgroundColor === 'black' 
                      ? 'bg-white/5 border-white/10' 
                      : backgroundColor === 'white'
                        ? 'bg-black/5 border-black/10'
                        : 'bg-white/10 border-white/20'
                  )} />
                  
                  {/* Main piano showcase */}
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                    {(() => {
                      if (!displayImage) {
                        return (
                          <div className="w-full h-full bg-gradient-to-br from-kawai-pearl to-gray-100 flex items-center justify-center">
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
                          <div className="w-full h-full bg-gradient-to-br from-kawai-pearl to-gray-100 flex items-center justify-center">
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
                          className="object-cover"
                          priority={true}
                          sizes="100vw"
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
                        {statusBadge.icon && <statusBadge.icon className="h-3 w-3" />}
                        {statusBadge.text}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Enhanced Description */}
            {displayDescription && (
              <p className={cn(
                "text-lg lg:text-xl font-light leading-relaxed max-w-2xl mt-6 lg:mt-4",
                accentColorClass
              )}>
                {displayDescription}
              </p>
            )}
            
            
            {/* Clean Price Display */}
            {showPrice && hasPrice && (
              <div className="space-y-3">
                <div className="flex items-baseline gap-4">
                  <div className={cn("text-2xl lg:text-3xl font-semibold", textColorClass)}>
                    {formatPrice()}
                  </div>
                  {product.price?.salePrice && (
                    <Badge className="bg-emerald-500 text-white px-3 py-1 text-xs font-medium">
                      Sale
                    </Badge>
                  )}
                </div>
                <p className={cn(
                  "text-sm font-medium",
                  backgroundColor === 'black' ? 'text-gray-400' : 'text-gray-600'
                )}>Starting price</p>
              </div>
            )}
            
            {/* Modern Finish Selection */}
            {showFinishes && hasFinishes && (
              <div className="space-y-6">
                <h3 className={cn("text-2xl font-light", textColorClass)}>Available Finishes</h3>
                <div className="grid grid-cols-2 gap-4">
                  {product.finishes!.map((finish, index) => {
                    if (!finish.available) return null
                    
                    return (
                      <div
                        key={index}
                        className={cn(
                          "cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 backdrop-blur-sm",
                          selectedFinish === index 
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
                          // Toggle selection: if already selected, deselect; otherwise select this finish
                          setSelectedFinish(selectedFinish === index ? -1 : index)
                        }}
                      >
                        <div className="flex items-center">
                          <span className="font-medium">{finish.name}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
            
            {/* Modern CTA Buttons */}
            {shouldShowBuyButton && (
              <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 pt-4 lg:pt-6">
                {/* Primary CTA - KAWAI styling */}
                <Button
                  asChild
                  className={cn(
                    "group relative overflow-hidden px-8 lg:px-10 py-4 lg:py-6 font-medium rounded-full transition-all duration-500 hover:scale-105 hover:shadow-2xl text-base lg:text-lg flex-1",
                    product.buyButton?.style === 'outline'
                      ? cn(
                          "border-2 border-kawai-red bg-transparent hover:bg-kawai-red",
                          backgroundColor === 'black' ? 'text-kawai-red hover:text-white' : 'text-kawai-red hover:text-white'
                        )
                      : "bg-gradient-to-r from-kawai-red to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:shadow-kawai-red/25"
                  )}
                >
                  <Link href={product.buyButton?.link || '#'}>
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <span className="relative flex items-center justify-center space-x-2 lg:space-x-3">
                      <ShoppingCart className="w-4 h-4 lg:w-5 lg:h-5" />
                      <span>{getBuyButtonText()}</span>
                      <svg className="w-4 h-4 lg:w-5 lg:h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </Link>
                </Button>
                
                {/* Secondary CTA */}
                <Button
                  variant="outline"
                  className={cn(
                    "px-8 lg:px-10 py-4 lg:py-6 border-2 font-medium rounded-full transition-all duration-300 text-base lg:text-lg hover:border-kawai-red",
                    backgroundColor === 'black' 
                      ? 'border-white/30 text-white hover:bg-white/5' 
                      : backgroundColor === 'white'
                        ? 'border-black/30 text-black hover:bg-black/5'
                        : 'border-slate-400 text-slate-600 hover:bg-slate-100'
                  )}
                >
                  <span className="flex items-center justify-center space-x-2">
                    <Volume2 className="w-4 h-4 lg:w-5 lg:h-5" />
                    <span>Listen Now</span>
                  </span>
                </Button>
              </div>
            )}
          </div>
          
          {/* Image Section - Full width on mobile, 7 columns on desktop */}
          <div className="lg:col-span-7 relative order-2 lg:order-none">
            {displayImage && (
              <div className="relative">
                
                {/* Glassmorphism frame - adapts to background */}
                <div className={cn(
                  "absolute -inset-6 backdrop-blur-2xl border rounded-3xl opacity-50",
                  backgroundColor === 'black' 
                    ? 'bg-white/5 border-white/10' 
                    : backgroundColor === 'white'
                      ? 'bg-black/5 border-black/10'
                      : 'bg-white/10 border-white/20'
                )} />
                
                {/* Main piano showcase */}
                <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[500px] xl:h-[600px] overflow-hidden rounded-2xl">
                  {(() => {
                    if (!displayImage) {
                      return (
                        <div className="w-full h-full bg-gradient-to-br from-kawai-pearl to-gray-100 flex items-center justify-center">
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
                        <div className="w-full h-full bg-gradient-to-br from-kawai-pearl to-gray-100 flex items-center justify-center">
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
                        className="object-cover"
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
                      {statusBadge.icon && <statusBadge.icon className="h-3 w-3" />}
                      {statusBadge.text}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}