import React from 'react'
import Image from 'next/image'
import type { ProductHeroBlock } from '@/payload-types'
import { getImagePropsWithFallback } from '@/lib/media/r2-utils'
import { cn } from '@/lib/utils'

interface ProductHeroRendererProps extends ProductHeroBlock {}

export function ProductHeroRenderer({
  layout,
  overrides,
}: ProductHeroRendererProps) {
  // Background color class mapping
  const bgColorClasses = {
    pearl: 'bg-kawai-pearl',
    white: 'bg-white',
    black: 'bg-black text-white',
  }

  // Image position class mapping
  const imagePositionClasses = {
    left: 'md:flex-row',
    right: 'md:flex-row-reverse',
  }

  const backgroundColor = layout?.backgroundColor || 'pearl'
  const imagePosition = layout?.imagePosition || 'left'
  const showVariations = layout?.showVariations ?? true
  const showPrice = layout?.showPrice ?? false
  const showBuyButton = layout?.showBuyButton ?? true

  return (
    <section className={cn(
      'py-16 px-6',
      bgColorClasses[backgroundColor as keyof typeof bgColorClasses]
    )}>
      <div className="max-w-7xl mx-auto">
        <div className={cn(
          'flex flex-col gap-12 items-center',
          imagePositionClasses[imagePosition as keyof typeof imagePositionClasses]
        )}>
          {/* Product Image */}
          {overrides?.customImage && (
            <div className="flex-1 relative">
              {(() => {
                const imageProps = getImagePropsWithFallback(
                  overrides.customImage,
                  '/images/defaults/product-hero.jpg',
                  'hero'
                )
                return (
                  <Image
                    {...imageProps}
                    alt={overrides.customTitle || ''}
                    className="w-full h-auto rounded-lg"
                  />
                )
              })()}
              {overrides?.badge && (
                <div className="absolute top-4 right-4 bg-kawai-red text-white px-4 py-2 rounded-full font-semibold">
                  {overrides.badge}
                </div>
              )}
            </div>
          )}

          {/* Product Info */}
          <div className="flex-1 flex flex-col justify-center">
            {overrides?.customTitle && (
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                {overrides.customTitle}
              </h1>
            )}

            {overrides?.customDescription && (
              <p className="text-xl mb-8 opacity-90">
                {overrides.customDescription}
              </p>
            )}

            {/* Placeholder for product-specific features */}
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Additional product details would be rendered here based on the product document data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
