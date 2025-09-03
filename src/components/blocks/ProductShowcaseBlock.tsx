'use client'

import { MediaRenderer } from '@/components/ui/media/MediaRenderer'
import { Media } from '@/payload-types'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useState } from 'react'

interface ProductShowcaseBlockProps {
  dataSource?: 'manual' | 'pianomodel' | 'hybrid' | null
  pianoModel?: any
  product?: {
    image?: string | Media | null
    name?: string | null
    description?: string | null
    price?: {
      currency?: 'USD' | 'EUR' | 'GBP' | 'CAD' | null
      amount?: number | null
      saleAmount?: number | null
      priceText?: string | null
    }
    finishes?: Array<{
      name: string
      image?: string | Media | null
      priceModifier?: number | null
    }> | null
    buyButton?: {
      text?: string | null
      link?: string | null
      style?: 'primary' | 'secondary' | 'outline' | null
      openInNewTab?: boolean | null
    }
    badge?: string | null
    inStock?: boolean | null
  }
  layout?: {
    imagePosition?: 'left' | 'right' | 'top' | 'bottom' | null
    showFinishes?: boolean | null
    showPrice?: boolean | null
    compact?: boolean | null
  }
}

export function ProductShowcaseBlock({
  product = {},
  layout = {}
}: ProductShowcaseBlockProps) {
  const [selectedFinish, setSelectedFinish] = useState(0)
  
  const imagePosition = layout.imagePosition || 'left'
  const showFinishes = layout.showFinishes !== false
  const showPrice = layout.showPrice !== false
  const compact = layout.compact || false
  
  const hasFinishes = product.finishes && product.finishes.length > 0
  
  // Price formatting
  const formatPrice = () => {
    if (product.price?.priceText) {
      return product.price.priceText
    }
    
    if (!product.price?.amount) {
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
  
  // Layout classes
  const containerClasses = {
    left: 'lg:flex-row',
    right: 'lg:flex-row-reverse',
    top: 'flex-col',
    bottom: 'flex-col-reverse'
  }
  
  const spacingClass = compact ? 'py-12' : 'py-16 lg:py-24'
  const containerClass = containerClasses[imagePosition] || containerClasses.left
  
  return (
    <section className={`${spacingClass} bg-kawai-pearl`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className={`flex ${containerClass} items-center gap-8 lg:gap-12`}>
          {/* Product Image */}
          <div className="flex-1">
            <div className="relative">
              {product.image && (
                <MediaRenderer 
                  media={hasFinishes && product.finishes![selectedFinish]?.image 
                    ? product.finishes![selectedFinish].image!
                    : product.image
                  }
                  preset="gallery"
                  className="w-full h-auto rounded-lg shadow-xl"
                />
              )}
              
              {/* Badge */}
              {product.badge && (
                <div className="absolute top-4 left-4 bg-kawai-red text-white px-3 py-1 rounded-full text-sm font-medium">
                  {product.badge}
                </div>
              )}
              
              {/* Stock Status */}
              {product.inStock === false && (
                <div className="absolute top-4 right-4 bg-kawai-neutral text-white px-3 py-1 rounded-full text-sm font-medium">
                  Out of Stock
                </div>
              )}
            </div>
          </div>
          
          {/* Product Details */}
          <div className="flex-1 space-y-6">
            {/* Title */}
            {product.name && (
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-kawai-black">
                {product.name}
              </h2>
            )}
            
            {/* Price */}
            {showPrice && (
              <div className="text-2xl md:text-3xl font-semibold text-kawai-black">
                {formatPrice()}
              </div>
            )}
            
            {/* Description */}
            {product.description && (
              <p className="text-lg text-kawai-black/80 leading-relaxed">
                {product.description}
              </p>
            )}
            
            {/* Finish Selection */}
            {showFinishes && hasFinishes && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-kawai-black">Available Finishes</h3>
                <div className="flex flex-wrap gap-3">
                  {product.finishes!.map((finish, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedFinish(index)}
                      className={`
                        px-4 py-2 rounded-md border-2 transition-colors font-medium
                        ${selectedFinish === index 
                          ? 'border-kawai-red bg-kawai-red text-white' 
                          : 'border-kawai-neutral/30 bg-white text-kawai-black hover:border-kawai-red/50'
                        }
                      `}
                    >
                      {finish.name}
                      {finish.priceModifier && (
                        <span className="ml-2 text-sm">
                          {finish.priceModifier > 0 ? '+' : ''}${finish.priceModifier.toLocaleString()}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Buy Button */}
            {product.buyButton?.text && product.buyButton.link && (
              <div className="pt-4">
                <Button
                  asChild
                  size="lg"
                  variant={product.buyButton.style === 'outline' ? 'outline' : 'default'}
                  disabled={product.inStock === false}
                  className={`
                    px-8 py-4 font-medium rounded-md transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 group text-lg
                    ${product.buyButton.style === 'primary' ? 'bg-kawai-red hover:bg-kawai-red/80 text-white' : ''}
                    ${product.buyButton.style === 'secondary' ? 'bg-kawai-black hover:bg-kawai-black/80 text-white' : ''}
                    ${product.buyButton.style === 'outline' ? 'border-2 border-kawai-red text-kawai-red hover:bg-kawai-red hover:text-white' : ''}
                    ${product.inStock === false ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <Link 
                    href={product.buyButton.link}
                    target={product.buyButton.openInNewTab ? '_blank' : undefined}
                    rel={product.buyButton.openInNewTab ? 'noopener noreferrer' : undefined}
                    className="inline-flex items-center"
                  >
                    <span>{product.inStock === false ? 'Out of Stock' : product.buyButton.text}</span>
                    {product.inStock !== false && (
                      <svg className="w-5 h-5 ml-3 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    )}
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