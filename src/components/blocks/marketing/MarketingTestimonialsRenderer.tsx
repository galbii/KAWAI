import React from 'react'
import Image from 'next/image'
import type { MarketingTestimonialsBlock } from '@/payload-types'
import { getImagePropsWithFallback } from '@/lib/media/r2-utils'
import { cn } from '@/lib/utils'

interface MarketingTestimonialsRendererProps extends MarketingTestimonialsBlock {}

export function MarketingTestimonialsRenderer({
  header,
  testimonials,
  layout,
  aggregateRating,
}: MarketingTestimonialsRendererProps) {
  if (!testimonials || testimonials.length === 0) {
    return null
  }

  // Background color class mapping
  const bgColorClasses = {
    none: 'bg-transparent',
    'light-gray': 'bg-gray-100 dark:bg-gray-800',
    'dark-gray': 'bg-gray-800 dark:bg-gray-900 text-white',
    brand: 'bg-kawai-red text-white',
    white: 'bg-white dark:bg-gray-900',
  }

  // Columns class mapping
  const columnsClasses = {
    one: 'grid-cols-1',
    two: 'md:grid-cols-2',
    three: 'md:grid-cols-3',
    four: 'md:grid-cols-4',
  }

  const backgroundColor = layout?.backgroundColor || 'light-gray'
  const columns = layout?.columns || 'three'
  const showAvatars = layout?.showAvatars ?? true
  const showRatings = layout?.showRatings ?? true

  return (
    <section className={cn(
      'py-12 px-6',
      bgColorClasses[backgroundColor as keyof typeof bgColorClasses]
    )}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {(header?.title || header?.subtitle || header?.description) && (
          <div className="text-center mb-12">
            {header?.title && (
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {header.title}
              </h2>
            )}
            {header?.subtitle && (
              <p className="text-xl mb-4 opacity-90">
                {header.subtitle}
              </p>
            )}
            {header?.description && (
              <p className="text-lg opacity-80">
                {header.description}
              </p>
            )}
          </div>
        )}

        {/* Aggregate Rating */}
        {aggregateRating?.showOverallRating && (
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-4xl font-bold">
                {aggregateRating.overallRating?.toFixed(1)}
              </span>
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star}>★</span>
                ))}
              </div>
            </div>
            {aggregateRating.ratingText && (
              <p className="text-sm opacity-75">
                {aggregateRating.ratingText}
              </p>
            )}
          </div>
        )}

        {/* Testimonials Grid */}
        <div className={cn(
          'grid gap-6',
          columnsClasses[columns as keyof typeof columnsClasses]
        )}>
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md"
            >
              {/* Rating */}
              {showRatings && testimonial.rating && (
                <div className="flex text-yellow-400 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className={star <= (testimonial.rating || 0) ? '' : 'opacity-25'}>
                      ★
                    </span>
                  ))}
                </div>
              )}

              {/* Quote */}
              <blockquote className="text-gray-700 dark:text-gray-300 mb-4 italic">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              {/* Customer Info */}
              <div className="flex items-center gap-3">
                {showAvatars && testimonial.customer?.avatar && (
                  <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    {(() => {
                      const avatarProps = getImagePropsWithFallback(
                        testimonial.customer.avatar,
                        '/images/defaults/avatar.jpg',
                        'thumbnail'
                      )
                      return (
                        <Image
                          {...avatarProps}
                          alt={testimonial.customer.name || ''}
                          className="object-cover"
                        />
                      )
                    })()}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.customer?.name}
                  </p>
                  {testimonial.customer?.title && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.customer.title}
                    </p>
                  )}
                  {testimonial.verified && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      ✓ Verified Purchase
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
