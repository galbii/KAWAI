import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { MarketingHeroBlock } from '@/payload-types'
import { getImagePropsWithFallback } from '@/lib/media/r2-utils'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface MarketingHeroRendererProps extends MarketingHeroBlock {}

export function MarketingHeroRenderer({
  content,
  media,
  layout,
}: MarketingHeroRendererProps) {
  // Height class mapping
  const heightClasses = {
    small: 'min-h-[400px]',
    medium: 'min-h-[600px]',
    large: 'min-h-[800px]',
    fullscreen: 'min-h-screen',
  }

  // Content alignment class mapping
  const contentAlignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  }

  // Vertical alignment class mapping
  const verticalAlignmentClasses = {
    top: 'justify-start',
    center: 'justify-center',
    bottom: 'justify-end',
  }

  // Max width class mapping
  const maxWidthClasses = {
    small: 'max-w-2xl',
    medium: 'max-w-3xl',
    large: 'max-w-4xl',
    full: 'max-w-full',
  }

  const height = layout?.height || 'medium'
  const contentAlignment = layout?.contentAlignment || 'center'
  const verticalAlignment = layout?.verticalAlignment || 'center'
  const maxWidth = layout?.maxWidth || 'medium'

  const hasBackgroundMedia = media?.type === 'image' || media?.type === 'video'
  const overlayEnabled = media?.overlay?.enable ?? true
  const overlayColor = media?.overlay?.color || 'dark'
  const overlayOpacity = media?.overlay?.opacity || 0.5

  // Overlay color mapping
  const overlayColorClasses = {
    dark: 'bg-black',
    light: 'bg-white',
    brand: 'bg-kawai-red',
  }

  return (
    <section className={cn(
      'relative w-full flex',
      heightClasses[height as keyof typeof heightClasses]
    )}>
      {/* Background Media */}
      {hasBackgroundMedia && media?.type === 'image' && media?.backgroundImage && (
        <>
          <div className="absolute inset-0 z-0">
            {(() => {
              const imageProps = getImagePropsWithFallback(
                media.backgroundImage,
                '/images/defaults/hero-fallback.jpg',
                'hero',
                { fill: true, priority: true }
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
              className={cn(
                'absolute inset-0 z-10',
                overlayColorClasses[overlayColor as keyof typeof overlayColorClasses]
              )}
              style={{ opacity: overlayOpacity }}
            />
          )}
        </>
      )}

      {hasBackgroundMedia && media?.type === 'video' && media?.backgroundVideo && (
        <>
          <div className="absolute inset-0 z-0">
            <video
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            >
              <source
                src={typeof media.backgroundVideo === 'object' ? media.backgroundVideo.url ?? '' : ''}
                type="video/mp4"
              />
            </video>
          </div>
          {overlayEnabled && (
            <div
              className={cn(
                'absolute inset-0 z-10',
                overlayColorClasses[overlayColor as keyof typeof overlayColorClasses]
              )}
              style={{ opacity: overlayOpacity }}
            />
          )}
        </>
      )}

      {/* Content Container */}
      <div className={cn(
        'relative z-20 w-full flex flex-col px-6 md:px-12',
        verticalAlignmentClasses[verticalAlignment as keyof typeof verticalAlignmentClasses]
      )}>
        <div className={cn(
          'flex flex-col',
          maxWidthClasses[maxWidth as keyof typeof maxWidthClasses],
          contentAlignmentClasses[contentAlignment as keyof typeof contentAlignmentClasses],
          contentAlignment === 'center' && 'mx-auto'
        )}>
          {/* Title */}
          {content?.title && (
            <h1 className={cn(
              'text-4xl md:text-5xl lg:text-6xl font-bold mb-4',
              hasBackgroundMedia ? 'text-white' : 'text-gray-900 dark:text-white'
            )}>
              {content.title}
            </h1>
          )}

          {/* Subtitle */}
          {content?.subtitle && (
            <p className={cn(
              'text-xl md:text-2xl mb-6',
              hasBackgroundMedia ? 'text-gray-100' : 'text-gray-700 dark:text-gray-300'
            )}>
              {content.subtitle}
            </p>
          )}

          {/* Description */}
          {content?.description && (
            <p className={cn(
              'text-lg mb-8',
              hasBackgroundMedia ? 'text-gray-200' : 'text-gray-600 dark:text-gray-400'
            )}>
              {content.description}
            </p>
          )}

          {/* CTA Buttons */}
          <div className={cn(
            'flex gap-4',
            contentAlignment === 'center' && 'justify-center',
            contentAlignment === 'right' && 'justify-end'
          )}>
            {content?.primaryCta?.text && content?.primaryCta?.link && (
              <Button
                asChild
                variant={content.primaryCta.style === 'outline' ? 'outline' : 'default'}
                size="lg"
              >
                <Link
                  href={content.primaryCta.link}
                  target={content.primaryCta.openInNewTab ? '_blank' : undefined}
                  rel={content.primaryCta.openInNewTab ? 'noopener noreferrer' : undefined}
                >
                  {content.primaryCta.text}
                </Link>
              </Button>
            )}

            {content?.secondaryCta?.text && content?.secondaryCta?.link && (
              <Button
                asChild
                variant={content.secondaryCta.style === 'primary' ? 'default' : 'outline'}
                size="lg"
              >
                <Link
                  href={content.secondaryCta.link}
                  target={content.secondaryCta.openInNewTab ? '_blank' : undefined}
                  rel={content.secondaryCta.openInNewTab ? 'noopener noreferrer' : undefined}
                >
                  {content.secondaryCta.text}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
