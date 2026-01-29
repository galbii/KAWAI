import React from 'react'
import Image from 'next/image'
import type { ProductFeaturesListBlock } from '@/payload-types'
import { getImagePropsWithFallback } from '@/lib/media/r2-utils'
import { cn } from '@/lib/utils'

interface ProductFeaturesRendererProps extends ProductFeaturesListBlock {}

export function ProductFeaturesRenderer({
  header,
  features,
  layout,
  showNumbers,
}: ProductFeaturesRendererProps) {
  if (!features || features.length === 0) {
    return null
  }

  // Columns class mapping
  const columnsClasses = {
    one: 'grid-cols-1',
    two: 'md:grid-cols-2',
    three: 'md:grid-cols-3',
    four: 'md:grid-cols-4',
  }

  // Spacing class mapping
  const spacingClasses = {
    compact: 'gap-4',
    medium: 'gap-6',
    spacious: 'gap-8',
  }

  // Background color class mapping
  const bgColorClasses = {
    none: 'bg-transparent',
    'light-gray': 'bg-gray-100 dark:bg-gray-800',
    'dark-gray': 'bg-gray-800 dark:bg-gray-900 text-white',
    brand: 'bg-kawai-red text-white',
    accent: 'bg-kawai-gold text-gray-900',
  }

  const style = layout?.style || 'grid'
  const columns = layout?.columns || 'two'
  const spacing = layout?.spacing || 'medium'
  const backgroundColor = layout?.backgroundColor || 'none'

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

        {/* Features Grid */}
        {style === 'grid' && (
          <div className={cn(
            'grid',
            columnsClasses[columns as keyof typeof columnsClasses],
            spacingClasses[spacing as keyof typeof spacingClasses]
          )}>
            {features.map((feature, index) => (
              <div
                key={index}
                className={cn(
                  'flex gap-4',
                  layout?.iconPosition === 'top' && 'flex-col items-center text-center',
                  layout?.iconPosition === 'right' && 'flex-row-reverse',
                  feature.highlight && 'ring-2 ring-kawai-red rounded-lg p-4'
                )}
              >
                {/* Icon/Number */}
                {showNumbers ? (
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-kawai-red text-white flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                ) : (
                  <>
                    {feature.icon?.type === 'image' && feature.icon?.image && (
                      <div className="flex-shrink-0 w-12 h-12 relative">
                        {(() => {
                          const imageProps = getImagePropsWithFallback(
                            feature.icon.image,
                            '/images/defaults/icon.png',
                            'thumbnail'
                          )
                          return (
                            <Image
                              {...imageProps}
                              alt={feature.title || ''}
                              className="object-contain"
                            />
                          )
                        })()}
                      </div>
                    )}
                    {feature.icon?.type === 'emoji' && feature.icon?.emoji && (
                      <div className="flex-shrink-0 text-4xl">
                        {feature.icon.emoji}
                      </div>
                    )}
                    {feature.icon?.type === 'icon' && feature.icon?.iconName && (
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-kawai-red text-white flex items-center justify-center">
                        <span className="text-xl">✓</span>
                      </div>
                    )}
                  </>
                )}

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  {feature.description && (
                    <p className="text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* List Style */}
        {style === 'list' && (
          <div className="space-y-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className={cn(
                  'flex gap-4 items-start',
                  feature.highlight && 'bg-gray-50 dark:bg-gray-800 rounded-lg p-4'
                )}
              >
                {showNumbers ? (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-kawai-red text-white flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                ) : (
                  feature.icon?.type === 'emoji' && feature.icon?.emoji && (
                    <div className="flex-shrink-0 text-2xl">
                      {feature.icon.emoji}
                    </div>
                  )
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">
                    {feature.title}
                  </h3>
                  {feature.description && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {feature.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
