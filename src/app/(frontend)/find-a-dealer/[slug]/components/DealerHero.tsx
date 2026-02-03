'use client'

import { useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui'
import type { Media } from '@/payload-types'
import { cn } from '@/lib/utils'
import { ShieldCheck, Award, ChevronRight } from 'lucide-react'

interface DealerHeroProps {
  dealerName: string | null | undefined
  dealerImage?: Media | string | null
  city: string | null | undefined
  state: string | null | undefined
  isFeatured?: boolean | null
  yearEstablished?: number | null
}

/**
 * DealerHero Component - Premium Redesign
 *
 * Breathtaking hero section for dealer pages featuring:
 * - Dramatic full-height imagery with elegant overlay
 * - Serif typography for luxury feel
 * - Gold accents for trust signals
 * - Refined badge treatments
 * - Smooth entrance animations
 * - Elevated content card design
 *
 * Handles null/undefined fields gracefully with TypeScript strict mode compliance.
 */
export function DealerHero({
  dealerName,
  dealerImage,
  city,
  state,
  isFeatured = false,
  yearEstablished,
}: DealerHeroProps) {
  // Type guard for Media objects
  const isMediaObject = (media: any): media is Media => {
    return typeof media === 'object' && media !== null && 'url' in media
  }

  // Get dealer image URL with fallback
  const imageUrl = useMemo(() => {
    if (!dealerImage) {
      return '/images/defaults/kawai-showroom-default.jpg'
    }

    if (isMediaObject(dealerImage)) {
      return dealerImage.url || '/images/defaults/kawai-showroom-default.jpg'
    }

    if (typeof dealerImage === 'string' && dealerImage.trim()) {
      return dealerImage
    }

    return '/images/defaults/kawai-showroom-default.jpg'
  }, [dealerImage])

  // Format location display
  const locationDisplay = useMemo(() => {
    const cityText = city?.trim() || ''
    const stateText = state?.trim() || ''

    if (!cityText && !stateText) {
      return 'Location'
    }

    if (cityText && stateText) {
      return `${cityText}, ${stateText}`
    }

    return cityText || stateText
  }, [city, state])

  // Get dealer name or default
  const displayName = dealerName?.trim() || 'Dealer'

  // Get dealer image alt text
  const imageAlt = `${displayName} showroom in ${locationDisplay}`

  // Calculate years of service
  const yearsOfService = useMemo(() => {
    if (!yearEstablished) return null
    const currentYear = new Date().getFullYear()
    const years = currentYear - yearEstablished
    return years > 0 ? years : null
  }, [yearEstablished])

  return (
    <section className="relative w-full overflow-hidden">
      {/* Background Image Container - Taller for drama */}
      <div className="relative w-full h-[400px] sm:h-[500px] md:h-[550px] lg:h-[600px] overflow-hidden bg-gradient-to-br from-kawai-charcoal to-gray-800">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className="object-cover object-center transition-transform duration-700 hover:scale-105"
          priority
          sizes="100vw"
        />

        {/* Dramatic gradient overlay with multiple layers */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
      </div>

      {/* Content Container - More overlap for visual interest */}
      <div className="relative -mt-48 sm:-mt-56 md:-mt-64 lg:-mt-72 z-10 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          {/* Breadcrumbs - On dark background */}
          <nav
            className="mb-8 sm:mb-10 md:mb-12 flex flex-wrap items-center gap-2 text-xs sm:text-sm"
            aria-label="Breadcrumb"
          >
            <Link
              href="/"
              className="text-white/90 hover:text-white transition-colors duration-200 flex items-center gap-1 group"
            >
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-white/50" strokeWidth={2.5} />
            <Link
              href="/find-a-dealer"
              className="text-white/90 hover:text-white transition-colors duration-200 flex items-center gap-1 group"
            >
              Find a Dealer
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-white/50" strokeWidth={2.5} />
            <span className="text-white font-semibold" aria-current="page">
              {locationDisplay || 'Dealer'}
            </span>
          </nav>

          {/* Main Content Card - Premium elevation and styling */}
          <div className="bg-white rounded-2xl p-8 sm:p-10 md:p-12 shadow-2xl border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header with badges */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
              <div className="flex-1">
                {/* Dealer Name - Serif font for elegance */}
                <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-kawai-charcoal leading-[1.1] mb-4 tracking-tight">
                  {displayName}
                </h1>

                {/* Location with refined styling */}
                <p className="text-xl sm:text-2xl md:text-3xl text-gray-600 font-light tracking-wide">
                  {locationDisplay}
                </p>
              </div>

              {/* Badges Container - Stacked with better spacing */}
              <div className="flex flex-wrap gap-3 lg:flex-col lg:items-end">
                {isFeatured && (
                  <Badge
                    variant="outline"
                    className="border-2 border-kawai-gold bg-gradient-to-br from-kawai-gold/10 to-kawai-gold/5 text-kawai-gold px-4 py-2.5 text-sm font-bold rounded-xl whitespace-nowrap shadow-sm backdrop-blur-sm flex items-center gap-2"
                  >
                    <Award className="w-4 h-4" strokeWidth={2.5} />
                    Featured Dealer
                  </Badge>
                )}

                {yearEstablished && (
                  <Badge
                    variant="outline"
                    className="border-2 border-kawai-gold/30 text-kawai-charcoal bg-kawai-gold/5 px-4 py-2.5 text-sm font-semibold rounded-xl whitespace-nowrap shadow-sm"
                  >
                    Est. {yearEstablished}
                    {yearsOfService && (
                      <span className="ml-1 text-kawai-gold">• {yearsOfService} years</span>
                    )}
                  </Badge>
                )}
              </div>
            </div>

            {/* Decorative divider with gold accent */}
            <div className="relative h-px mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-kawai-gold via-kawai-red to-kawai-gold/20" />
            </div>

            {/* Authorized Dealer Status - Premium treatment */}
            <div className="flex items-center gap-3 bg-gradient-to-r from-kawai-gold/10 via-kawai-gold/5 to-transparent px-5 py-4 rounded-xl border-l-4 border-kawai-gold">
              <div className="p-2 bg-kawai-gold/20 rounded-lg">
                <ShieldCheck className="w-6 h-6 text-kawai-gold" strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-sm font-semibold text-kawai-gold uppercase tracking-wider mb-0.5">
                  Authorized Dealer
                </p>
                <p className="text-base text-kawai-charcoal font-medium">
                  Official Kawai Piano Authorized Retailer
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
