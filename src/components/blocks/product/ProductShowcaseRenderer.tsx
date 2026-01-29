import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { ProductShowcaseBlock } from '@/payload-types'
import { getImagePropsWithFallback } from '@/lib/media/r2-utils'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface ProductShowcaseRendererProps extends ProductShowcaseBlock {}

export function ProductShowcaseRenderer({
  product,
  layout,
}: ProductShowcaseRendererProps) {
  if (!product) {
    return null
  }

  // Image position class mapping
  const imagePositionClasses = {
    left: 'md:flex-row',
    right: 'md:flex-row-reverse',
    top: 'flex-col',
    bottom: 'flex-col-reverse',
  }

  const imagePosition = layout?.imagePosition || 'left'
  const showVariations = layout?.showVariations ?? true
  const showPrice = layout?.showPrice ?? true
  const compact = layout?.compact ?? false

  return (
    <div className={cn(
      'my-12 bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-lg',
      compact ? 'p-6' : 'p-8'
    )}>
      <div className={cn(
        'flex flex-col gap-8',
        imagePositionClasses[imagePosition as keyof typeof imagePositionClasses]
      )}>
        {/* Product Image */}
        {product.image && (
          <div className="flex-1 relative">
            {(() => {
              const imageProps = getImagePropsWithFallback(
                product.image,
                '/images/defaults/product-placeholder.jpg',
                'gallery'
              )
              return (
                <Image
                  {...imageProps}
                  alt={product.title || ''}
                  className="w-full h-auto rounded-lg"
                />
              )
            })()}
            {product.badge && (
              <div className="absolute top-4 right-4 bg-kawai-red text-white px-3 py-1 rounded-full text-sm font-semibold">
                {product.badge}
              </div>
            )}
            {!product.inStock && (
              <div className="absolute top-4 left-4 bg-gray-800 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Out of Stock
              </div>
            )}
          </div>
        )}

        {/* Product Info */}
        <div className="flex-1 flex flex-col justify-center">
          {product.title && (
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              {product.title}
            </h2>
          )}

          {product.description && (
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
              {product.description}
            </p>
          )}

          {/* Price */}
          {showPrice && product.price && (
            <div className="mb-6">
              {product.price.priceText ? (
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {product.price.priceText}
                </p>
              ) : (
                <div className="flex items-baseline gap-3">
                  {product.price.saleAmount && (
                    <>
                      <span className="text-3xl font-bold text-kawai-red">
                        {formatPrice(product.price.saleAmount, product.price.currency ?? undefined)}
                      </span>
                      <span className="text-xl text-gray-500 line-through">
                        {formatPrice(product.price.amount ?? undefined, product.price.currency ?? undefined)}
                      </span>
                    </>
                  )}
                  {!product.price.saleAmount && product.price.amount && (
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      {formatPrice(product.price.amount, product.price.currency ?? undefined)}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Variations */}
          {showVariations && product.variations && product.variations.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Available Variations:
              </p>
              <div className="flex flex-wrap gap-2">
                {product.variations.map((variation, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm"
                  >
                    {variation.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Buy Button */}
          {product.buyButton?.text && product.buyButton?.link && (
            <Button
              asChild
              variant={
                product.buyButton.style === 'outline' ? 'outline' :
                product.buyButton.style === 'secondary' ? 'secondary' :
                'default'
              }
              size="lg"
              disabled={!product.inStock}
            >
              <Link
                href={product.buyButton.link}
                target={product.buyButton.openInNewTab ? '_blank' : undefined}
                rel={product.buyButton.openInNewTab ? 'noopener noreferrer' : undefined}
              >
                {product.buyButton.text}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

// Helper function to format price
function formatPrice(amount: number | undefined, currency: string = 'USD'): string {
  if (!amount) return ''

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })

  return formatter.format(amount)
}
