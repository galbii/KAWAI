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
            <div className="flex-1 relative z-0 hover:z-10 group">
              {(() => {
                const imageProps = getImagePropsWithFallback(
                  overrides.customImage,
                  '/images/defaults/product-hero.jpg',
                  'hero'
                )
                return (
                  /* Scale + shadow layer — no overflow clip so it can pop outside */
                  <div className="relative aspect-square transition-all duration-500 ease-[var(--ease-elegant)] group-hover:scale-[1.12] group-hover:shadow-[0_28px_64px_rgba(0,0,0,0.26)]">
                    {/* Clip layer — keeps image cropped to square */}
                    <div className="absolute inset-0 overflow-hidden">
                      <Image
                        {...imageProps}
                        alt={overrides.customTitle || ''}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-kawai-black/0 group-hover:bg-kawai-black/10 transition-colors duration-500" />
                    </div>
                  </div>
                )
              })()}
              {overrides?.badge && (
                <div className="absolute top-4 right-4 bg-kawai-red text-white px-4 py-2 font-semibold text-sm tracking-wide">
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
