'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { MarketingFindADealerBlock, Media } from '@/payload-types'
import { cn } from '@/lib/utils'
import { MapPin } from 'lucide-react'
import { trackCTAClick } from '@/lib/analytics/unified-tracking'

interface FindADealerRendererProps extends MarketingFindADealerBlock {}

export function FindADealerRenderer({
  heading = 'Find Your Perfect Piano',
  message = 'Visit an authorized Kawai dealer near you to experience our pianos in person.',
  ctaText = 'Find a Dealer',
  ctaLink = '/find-a-dealer',
  ctaOpenInNewTab = false,
  theme = 'light',
  alignment = 'center',
  backgroundImage,
  tracking,
}: FindADealerRendererProps) {
  // Get background image URL
  const bgImage =
    backgroundImage && typeof backgroundImage === 'object' && 'url' in backgroundImage
      ? backgroundImage.url
      : null

  // Track CTA click
  const handleCTAClick = () => {
    trackCTAClick({
      blockType: 'marketing-find-a-dealer',
      blockData: { tracking },
      ctaText: ctaText || 'Find a Dealer',
      destination: ctaLink || '/find-a-dealer',
      additionalProps: {
        theme,
        alignment,
        has_background: Boolean(bgImage),
      },
    })
  }

  // Theme styles
  const themeStyles = {
    light: {
      bg: 'bg-kawai-pearl',
      text: 'text-kawai-charcoal',
      subtext: 'text-kawai-charcoal/70',
      buttonBg: 'bg-kawai-red hover:bg-kawai-red/90',
      buttonText: 'text-white',
      overlay: 'bg-white/90',
    },
    dark: {
      bg: 'bg-kawai-charcoal',
      text: 'text-white',
      subtext: 'text-white/70',
      buttonBg: 'bg-white hover:bg-kawai-pearl',
      buttonText: 'text-kawai-charcoal',
      overlay: 'bg-kawai-charcoal/90',
    },
    red: {
      bg: 'bg-gradient-to-br from-red-50 to-red-100',
      text: 'text-kawai-charcoal',
      subtext: 'text-red-900/70',
      buttonBg: 'bg-kawai-red hover:bg-kawai-red/90',
      buttonText: 'text-white',
      overlay: 'bg-gradient-to-br from-red-50/95 to-red-100/95',
    },
    gold: {
      bg: 'bg-gradient-to-br from-amber-50 to-yellow-100',
      text: 'text-kawai-charcoal',
      subtext: 'text-amber-900/70',
      buttonBg: 'bg-kawai-gold hover:bg-kawai-gold/90',
      buttonText: 'text-kawai-charcoal',
      overlay: 'bg-gradient-to-br from-amber-50/95 to-yellow-100/95',
    },
  }

  const currentTheme = themeStyles[theme as keyof typeof themeStyles] || themeStyles.light

  // Alignment classes
  const alignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  }

  const currentAlignment = alignmentClasses[alignment as keyof typeof alignmentClasses] || alignmentClasses.center

  return (
    <section className={cn('relative py-20 md:py-28', currentTheme.bg)}>
      {/* Background Image (if provided) */}
      {bgImage && (
        <>
          <div className="absolute inset-0 z-0">
            <Image
              src={bgImage}
              alt=""
              fill
              className="object-cover"
              sizes="100vw"
              priority={false}
            />
          </div>
          {/* Overlay for readability */}
          <div className={cn('absolute inset-0 z-10', currentTheme.overlay)} />
        </>
      )}

      {/* Content */}
      <div className="container relative z-20 mx-auto px-6 sm:px-8 max-w-4xl">
        <div className={cn('flex flex-col gap-8', currentAlignment)}>
          {/* Icon */}
          <div
            className={cn(
              'inline-flex h-16 w-16 items-center justify-center rounded-full',
              theme === 'dark' ? 'bg-white/10' : 'bg-kawai-charcoal/10'
            )}
          >
            <MapPin
              className={cn('h-8 w-8', theme === 'dark' ? 'text-white' : 'text-kawai-charcoal')}
              strokeWidth={1.5}
            />
          </div>

          {/* Heading */}
          <h2
            className={cn(
              'font-serif text-4xl sm:text-5xl md:text-6xl font-light leading-tight tracking-tight',
              currentTheme.text
            )}
          >
            {heading}
          </h2>

          {/* Message */}
          {message && (
            <p className={cn('text-lg sm:text-xl leading-relaxed max-w-2xl', currentTheme.subtext)}>
              {message}
            </p>
          )}

          {/* CTA Button */}
          <div className="pt-4">
            <Link
              href={ctaLink}
              target={ctaOpenInNewTab ? '_blank' : undefined}
              rel={ctaOpenInNewTab ? 'noopener noreferrer' : undefined}
              onClick={handleCTAClick}
              className={cn(
                'group inline-flex items-center gap-3 px-8 py-4 rounded-md',
                'font-medium text-base tracking-wide transition-all duration-200',
                'shadow-lg hover:shadow-xl',
                'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kawai-red',
                currentTheme.buttonBg,
                currentTheme.buttonText
              )}
            >
              {ctaText}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform duration-200 group-hover:translate-x-1"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
