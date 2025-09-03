'use client'

import { MediaRenderer } from '@/components/ui/media/MediaRenderer'
import { Media, Product } from '@/payload-types'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useState } from 'react'

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
  const [selectedFinish, setSelectedFinish] = useState(0)
  
  // Layout options
  const imagePosition = layout.imagePosition || 'left'
  const backgroundColor = layout.backgroundColor || 'pearl'
  const showFinishes = layout.showFinishes !== false
  const showPrice = layout.showPrice !== false
  const showBuyButton = layout.showBuyButton !== false
  
  // If no product data is available, show a placeholder
  if (!product) {
    return (
      <section className="py-16 bg-kawai-pearl">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-kawai-neutral">
              Product Hero Block
            </h2>
            <p className="text-kawai-neutral/70">
              This block will display product information when used on a product page.
            </p>
          </div>
        </div>
      </section>
    )
  }
  
  // Extract data from product, with overrides taking precedence
  const displayTitle = overrides.customTitle || product.name
  const displayDescription = overrides.customDescription || product.description
  const displayImage = overrides.customImage || product.mainImage
  const displayModel = product.productData?.model
  
  const hasFinishes = product.finishes && product.finishes.length > 0
  const hasPrice = product.price && (product.price.amount || product.price.priceText)
  const hasBuyButton = product.buyButton && product.buyButton.text && product.buyButton.showButton
  
  // Price formatting
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
    
    const mainPrice = `${symbol}${product.price.amount.toLocaleString()}`
    
    if (product.price.saleAmount) {
      const salePrice = `${symbol}${product.price.saleAmount.toLocaleString()}`
      return (
        <span className="space-x-2">
          <span className="text-kawai-red font-bold">{salePrice}</span>
          <span className="text-kawai-neutral line-through">{mainPrice}</span>
        </span>
      )
    }
    
    return mainPrice
  }
  
  // Background color classes
  const backgroundClasses = {
    pearl: 'bg-kawai-pearl',
    white: 'bg-white',
    black: 'bg-kawai-black'
  }
  
  const textColorClasses = {
    pearl: 'text-kawai-black',
    white: 'text-kawai-black',
    black: 'text-white'
  }
  
  // Layout classes
  const containerClasses = {
    left: 'lg:flex-row',
    right: 'lg:flex-row-reverse'
  }
  
  const backgroundClass = backgroundClasses[backgroundColor]
  const textColorClass = textColorClasses[backgroundColor]
  const containerClass = containerClasses[imagePosition]
  
  return (
    <section className={`py-16 lg:py-24 ${backgroundClass}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className={`flex flex-col ${containerClass} items-center gap-8 lg:gap-16`}>
          {/* Product Image */}
          <div className="flex-1">
            <div className="relative">
              {displayImage && (
                <MediaRenderer 
                  media={hasFinishes && product.finishes![selectedFinish]?.image 
                    ? product.finishes![selectedFinish].image!
                    : displayImage
                  }
                  preset="hero"
                  priority={true}
                  className="w-full h-auto rounded-lg shadow-2xl"
                />
              )}
              
              {/* Badge */}
              {overrides.badge && (
                <div className="absolute top-4 left-4 bg-kawai-red text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  {overrides.badge}
                </div>
              )}
              
              {/* Status Badge */}
              {product.status === 'limited-edition' && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  Limited Edition
                </div>
              )}
              
              {product.status === 'coming-soon' && (
                <div className="absolute top-4 right-4 bg-kawai-neutral text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  Coming Soon
                </div>
              )}
            </div>
          </div>
          
          {/* Product Details */}
          <div className="flex-1 space-y-6">
            {/* Product Name/Title */}
            {displayTitle && (
              <div>
                <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight ${textColorClass}`}>
                  {displayTitle}
                </h1>
                {displayModel && (
                  <p className={`text-xl mt-2 ${textColorClass}/70`}>
                    Model: {displayModel}
                  </p>
                )}
              </div>
            )}
            
            {/* Price */}
            {showPrice && hasPrice && (
              <div className={`text-3xl md:text-4xl font-semibold ${textColorClass}`}>
                {formatPrice()}
              </div>
            )}
            
            {/* Description */}
            {displayDescription && (
              <p className={`text-lg md:text-xl leading-relaxed ${textColorClass}/80 max-w-2xl`}>
                {displayDescription}
              </p>
            )}
            
            {/* Finish Selection */}
            {showFinishes && hasFinishes && (
              <div className="space-y-4">
                <h3 className={`text-xl font-semibold ${textColorClass}`}>
                  Available Finishes
                </h3>
                <div className="flex flex-wrap gap-3">
                  {product.finishes!.map((finish, index) => {
                    if (!finish.available) return null
                    
                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedFinish(index)}
                        className={`
                          px-6 py-3 rounded-lg border-2 transition-all duration-300 font-medium shadow-md hover:shadow-lg
                          ${selectedFinish === index 
                            ? 'border-kawai-red bg-kawai-red text-white' 
                            : backgroundColor === 'black'
                              ? 'border-white/30 bg-white/10 text-white hover:border-kawai-red/70'
                              : 'border-kawai-neutral/30 bg-white/50 text-kawai-black hover:border-kawai-red/70'
                          }
                        `}
                      >
                        {finish.name}
                        {finish.priceModifier && finish.priceModifier !== 0 && (
                          <span className="ml-2 text-sm opacity-80">
                            {finish.priceModifier > 0 ? '+' : ''}${finish.priceModifier.toLocaleString()}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
            
            {/* Buy Button */}
            {showBuyButton && hasBuyButton && (
              <div className="pt-6">
                <Button
                  asChild
                  size="lg"
                  variant={product.buyButton!.style === 'outline' ? 'outline' : 'default'}
                  className={`
                    px-8 py-4 font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 group text-lg
                    ${product.buyButton!.style === 'primary' ? 'bg-kawai-red hover:bg-kawai-red/80 text-white' : ''}
                    ${product.buyButton!.style === 'secondary' ? 'bg-kawai-black hover:bg-kawai-black/80 text-white' : ''}
                    ${product.buyButton!.style === 'outline' 
                      ? backgroundColor === 'black'
                        ? 'border-2 border-white text-white hover:bg-white hover:text-kawai-black' 
                        : 'border-2 border-kawai-red text-kawai-red hover:bg-kawai-red hover:text-white'
                      : ''
                    }
                  `}
                >
                  <Link 
                    href={product.buyButton!.link || '#'}
                    className="inline-flex items-center"
                  >
                    <span>{product.buyButton!.text}</span>
                    <svg className="w-5 h-5 ml-3 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}