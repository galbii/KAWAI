'use client'

import { Media, Product } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
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
  const displayDescription = overrides.customDescription || product.description
  
  // Get model from linked piano model document
  const getModelDisplay = () => {
    if (typeof product.pianoModel === 'object' && product.pianoModel) {
      return product.pianoModel.model || product.pianoModel.name
    }
    return null
  }
  
  const modelDisplay = getModelDisplay()
  
  // Get key features from linked piano model document
  const getKeyFeatures = () => {
    if (typeof product.pianoModel === 'object' && product.pianoModel && product.pianoModel.keyFeatures) {
      return product.pianoModel.keyFeatures.slice(0, 3).map(feature => feature.feature)
    }
    // Fallback features if no piano model linked
    return [
      "Millennium III Hybrid Action Technology", 
      "Hand-selected premium soundboard materials",
      "Professional-grade KAWAI precision craftsmanship"
    ]
  }
  
  const keyFeatures = getKeyFeatures()
  const hasFinishes = product.finishes && product.finishes.length > 0
  const hasPrice = product.price && (product.price.amount || product.price.priceText)
  
  // Get display image - priority: custom override > selected finish image > main product image
  const getDisplayImage = () => {
    if (overrides.customImage) {
      return overrides.customImage
    }
    
    // If a finish is selected and has an image, use that
    if (selectedFinish >= 0 && product.finishes && product.finishes[selectedFinish]?.image) {
      return product.finishes[selectedFinish].image
    }
    
    // Default to main product image
    return product.mainImage
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
    
    if (!product.price.amount) {
      return 'Contact for pricing'
    }
    
    const currency = product.price.currency || 'USD'
    const currencySymbols = { USD: '$', EUR: '€', GBP: '£', CAD: 'C$' }
    const symbol = currencySymbols[currency] || '$'
    
    // Calculate price with finish modifier (only if a finish is selected)
    const basePrice = product.price.amount
    const finishModifier = hasFinishes && selectedFinish >= 0 && product.finishes![selectedFinish]?.priceModifier || 0
    const adjustedPrice = basePrice + finishModifier
    const mainPrice = `${symbol}${adjustedPrice.toLocaleString()}`
    
    if (product.price.saleAmount) {
      const adjustedSalePrice = product.price.saleAmount + finishModifier
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
  
  // Enhanced background styling
  const getBackgroundClasses = () => {
    switch (backgroundColor) {
      case 'black':
        return 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
      case 'white':
        return 'bg-gradient-to-br from-white via-gray-50 to-white'
      default:
        return 'bg-gradient-to-br from-kawai-pearl via-slate-50 to-kawai-pearl'
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
  
  // Debug log the incoming product data (after all variables are initialized)
  console.log('ProductHeroBlock - Product data:', {
    product,
    pianoModel: product?.pianoModel,
    pianoModelKeyFeatures: typeof product?.pianoModel === 'object' ? product?.pianoModel?.keyFeatures : null,
    buyButton: product?.buyButton,
    price: product?.price,
    finishes: product?.finishes,
    selectedFinish,
    displayImage: typeof displayImage === 'object' ? displayImage?.url : displayImage
  })
  
  return (
    <section className={`relative min-h-[80vh] lg:min-h-screen max-h-screen overflow-hidden ${backgroundClass}`}>
      {/* Background with subtle earthy pattern - adapts to background choice */}
      <div className="absolute inset-0">
        {backgroundColor === 'black' ? (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,69,19,0.08),transparent_50%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_30%,rgba(160,82,45,0.04)_50%,transparent_70%)]" />
          </>
        ) : backgroundColor === 'white' ? (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,69,19,0.04),transparent_50%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_30%,rgba(160,82,45,0.02)_50%,transparent_70%)]" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,69,19,0.06),transparent_50%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_30%,rgba(160,82,45,0.03)_50%,transparent_70%)]" />
          </>
        )}
      </div>
      
      {/* Main Content Container */}
      <div className="container mx-auto px-6 lg:px-12 xl:px-16 h-full flex items-center relative z-10 py-8 lg:py-16">
        <div className={cn(
          "grid lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full",
          imagePosition === 'right' ? 'lg:grid-flow-col-reverse' : ''
        )}>
          
          {/* Content Section - 5 columns on desktop */}
          <div className="lg:col-span-5 space-y-6 lg:space-y-8">
            
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
              
              {/* Model Display - Prominent */}
              {modelDisplay && (
                <div className="flex items-center space-x-4 mt-4">
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
              
              {/* Enhanced Description */}
              {displayDescription && (
                <p className={cn(
                  "text-lg lg:text-xl font-light leading-relaxed max-w-2xl mt-4",
                  accentColorClass
                )}>
                  {displayDescription}
                </p>
              )}
            </div>
            
            {/* KAWAI Piano Features with Premium Layout - Dynamic from piano model */}
            {keyFeatures.length > 0 && (
              <div className="space-y-4 lg:space-y-6">
                {keyFeatures.map((feature, index) => (
                  <div key={index} className={cn(
                    "flex items-center space-x-4",
                    accentColorClass
                  )}>
                    <div className="w-1 h-6 lg:h-8 bg-gradient-to-b from-kawai-red to-red-600 rounded-full flex-shrink-0" />
                    <span className="text-base lg:text-lg">{feature}</span>
                  </div>
                ))}
              </div>
            )}
            
            {/* Clean Price Display */}
            {showPrice && hasPrice && (
              <div className="space-y-3">
                <div className="flex items-baseline gap-4">
                  <div className={cn("text-2xl lg:text-3xl font-semibold", textColorClass)}>
                    {formatPrice()}
                  </div>
                  {product.price?.saleAmount && (
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
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{finish.name}</span>
                          {finish.priceModifier && finish.priceModifier !== 0 && (
                            <span className={cn(
                              "text-sm font-medium",
                              selectedFinish === index 
                                ? backgroundColor === 'black' ? 'text-white' : 'text-kawai-red'
                                : 'text-kawai-red'
                            )}>
                              {finish.priceModifier > 0 ? '+' : ''}${finish.priceModifier.toLocaleString()}
                            </span>
                          )}
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
          
          {/* Image Section - 7 columns on desktop */}
          <div className="lg:col-span-7 relative">
            {displayImage && (
              <div className="relative group">
                
                {/* Glassmorphism frame - adapts to background */}
                <div className={cn(
                  "absolute -inset-6 backdrop-blur-2xl border rounded-3xl opacity-50 group-hover:opacity-70 transition-all duration-700",
                  backgroundColor === 'black' 
                    ? 'bg-white/5 border-white/10' 
                    : backgroundColor === 'white'
                      ? 'bg-black/5 border-black/10'
                      : 'bg-white/10 border-white/20'
                )} />
                
                {/* Main piano showcase */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                  <img
                    src={typeof displayImage === 'string' 
                      ? displayImage 
                      : displayImage?.url || ''}
                    alt={typeof displayImage === 'string' 
                      ? '' 
                      : displayImage?.alt || 'Product image'}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="eager"
                  />
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Floating action buttons */}
                  <div className="absolute top-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <Button
                      size="sm"
                      className="h-10 w-10 p-0 bg-black/60 backdrop-blur-sm border border-white/20 text-white hover:bg-black/80"
                      onClick={() => setIsFavorited(!isFavorited)}
                    >
                      <Heart className={cn("h-4 w-4", isFavorited && "fill-kawai-red text-kawai-red")} />
                    </Button>
                    <Button
                      size="sm" 
                      className="h-10 w-10 p-0 bg-black/60 backdrop-blur-sm border border-white/20 text-white hover:bg-black/80"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      className="h-10 w-10 p-0 bg-black/60 backdrop-blur-sm border border-white/20 text-white hover:bg-black/80"
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                  
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
                  
                  {/* Floating product details */}
                  <div className="absolute bottom-6 left-6 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 opacity-0 group-hover:opacity-100">
                    <div className="bg-black/70 backdrop-blur-sm rounded-xl p-4 border border-kawai-red/20">
                      <h3 className="text-white text-lg font-light">{displayTitle}</h3>
                      {modelDisplay && (
                        <p className="text-kawai-red text-sm">{modelDisplay}</p>
                      )}
                      <div className="flex items-center space-x-2 mt-2 text-gray-300 text-xs">
                        <span>KAWAI Craftsmanship</span>
                        <div className="w-1 h-1 bg-kawai-red rounded-full" />
                        <span>Concert Quality</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}