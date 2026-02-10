import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { MarketingCallToActionBlock } from '@/payload-types'
import { getImagePropsWithFallback } from '@/lib/media/r2-utils'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { trackCTAClick } from '@/lib/analytics/unified-tracking'

interface MarketingCtaRendererProps extends MarketingCallToActionBlock {}

export function MarketingCtaRenderer({
  content,
  buttons,
  media,
  layout,
  urgency,
}: MarketingCtaRendererProps) {
  if (!buttons || buttons.length === 0) {
    return null
  }

  // Background color class mapping
  const bgColorClasses = {
    none: 'bg-transparent',
    'light-gray': 'bg-gray-100 dark:bg-gray-800',
    'dark-gray': 'bg-gray-800 dark:bg-gray-900',
    brand: 'bg-kawai-red text-white',
    accent: 'bg-kawai-gold text-gray-900',
    gradient: 'bg-gradient-to-r from-kawai-red to-kawai-gold text-white',
  }

  // Size class mapping
  const sizeClasses = {
    small: 'py-8 px-6',
    medium: 'py-12 px-8',
    large: 'py-16 px-12',
  }

  // Alignment class mapping
  const alignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  }

  const backgroundColor = layout?.backgroundColor || 'brand'
  const size = layout?.size || 'medium'
  const alignment = layout?.alignment || 'center'
  const buttonLayout = layout?.buttonLayout || 'horizontal'

  const hasBackgroundImage = media?.type === 'background' && media?.backgroundImage
  const overlayEnabled = media?.overlay?.enable ?? true
  const overlayOpacity = media?.overlay?.opacity || 0.7

  // Track button click
  const handleButtonClick = (button: any, index: number) => {
    trackCTAClick({
      blockType: 'marketing-cta',
      blockData: { ctaTracking: button.ctaTracking },
      ctaText: button.text || '',
      destination: button.link || '#',
      position: index,
      additionalProps: {
        button_style: button.style,
        button_size: button.size,
        has_icon: Boolean(button.icon),
        layout_style: layout?.style,
      },
    })
  }

  return (
    <section className={cn(
      'relative w-full my-12 rounded-lg overflow-hidden',
      !hasBackgroundImage && bgColorClasses[backgroundColor as keyof typeof bgColorClasses]
    )}>
      {/* Background Image */}
      {hasBackgroundImage && (
        <>
          <div className="absolute inset-0 z-0">
            {(() => {
              const imageProps = getImagePropsWithFallback(
                media?.backgroundImage,
                '/images/defaults/cta-bg.jpg',
                'hero',
                { fill: true }
              )
              return (
                <Image
                  {...imageProps}
                  alt=""
                  className="object-cover"
                />
              )
            })()}
          </div>
          {overlayEnabled && (
            <div
              className="absolute inset-0 z-10 bg-black"
              style={{ opacity: overlayOpacity }}
            />
          )}
        </>
      )}

      {/* Content */}
      <div className={cn(
        'relative z-20 flex flex-col',
        sizeClasses[size as keyof typeof sizeClasses],
        alignmentClasses[alignment as keyof typeof alignmentClasses]
      )}>
        {/* Title */}
        {content?.title && (
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {content.title}
          </h2>
        )}

        {/* Subtitle */}
        {content?.subtitle && (
          <p className="text-xl mb-4 opacity-90">
            {content.subtitle}
          </p>
        )}

        {/* Description */}
        {content?.description && (
          <p className="text-lg mb-8 opacity-80 max-w-2xl">
            {content.description}
          </p>
        )}

        {/* Urgency */}
        {urgency?.enableUrgency && urgency?.urgencyText && (
          <div className="mb-6 px-4 py-2 bg-yellow-400 text-yellow-900 rounded-md inline-block font-semibold">
            {urgency.urgencyText}
          </div>
        )}

        {/* Buttons */}
        <div className={cn(
          'flex gap-4',
          buttonLayout === 'vertical' ? 'flex-col' : 'flex-row',
          alignment === 'center' && 'justify-center',
          alignment === 'right' && 'justify-end'
        )}>
          {buttons.map((button, index) => (
            <Button
              key={index}
              asChild
              variant={
                button.style === 'primary' ? 'default' :
                button.style === 'secondary' ? 'secondary' :
                button.style === 'ghost' ? 'ghost' :
                button.style === 'link' ? 'link' :
                'outline'
              }
              size={button.size === 'small' ? 'sm' : button.size === 'large' ? 'lg' : 'default'}
            >
              <Link
                href={button.link || '#'}
                target={button.openInNewTab ? '_blank' : undefined}
                rel={button.openInNewTab ? 'noopener noreferrer' : undefined}
                onClick={() => handleButtonClick(button, index)}
              >
                {button.text}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </section>
  )
}
