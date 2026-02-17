'use client'

import { useState, useEffect } from 'react'
import type { Dealer } from '@/payload-types'
import { cn } from '@/lib/utils'

interface DealerStickyNavProps {
  dealer: Dealer
}

/**
 * Appears after the hero scrolls out of view.
 * Matches the site header's minimal white + border style.
 */
export function DealerStickyNav({ dealer }: DealerStickyNavProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = Math.min(Math.max(window.innerHeight * 0.6, 460), 640)
      setVisible(window.scrollY > heroHeight - 80)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const hasPhone = Boolean(dealer.contactInfo?.phone?.trim())
  const hasWebsite = Boolean(dealer.contactInfo?.website?.trim())
  const hasCoords =
    dealer.coordinates?.latitude != null && dealer.coordinates?.longitude != null

  if (!hasPhone && !hasWebsite && !hasCoords) return null

  return (
    <div
      className={cn(
        'fixed left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-kawai-black/10 transition-all duration-300 ease-out top-16 sm:top-20',
        visible
          ? 'translate-y-0 opacity-100 pointer-events-auto'
          : '-translate-y-full opacity-0 pointer-events-none'
      )}
      style={{ height: '48px' }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl h-full flex items-center justify-between gap-4">
        {/* Dealer name */}
        <span className="text-sm font-medium text-kawai-black truncate">
          {dealer.dealerName}
        </span>

        {/* Action links */}
        <div className="flex items-center shrink-0 divide-x divide-kawai-black/10">
          {hasPhone && dealer.contactInfo?.phone && (
            <a
              href={`tel:${dealer.contactInfo.phone}`}
              className="px-4 text-xs tracking-[0.15em] uppercase font-medium text-kawai-black/60 hover:text-kawai-red transition-colors whitespace-nowrap"
            >
              Call
            </a>
          )}
          {hasCoords &&
            dealer.coordinates?.latitude != null &&
            dealer.coordinates?.longitude != null && (
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${dealer.coordinates.latitude},${dealer.coordinates.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 text-xs tracking-[0.15em] uppercase font-medium text-kawai-black/60 hover:text-kawai-red transition-colors whitespace-nowrap"
              >
                Directions
              </a>
            )}
          {hasWebsite && dealer.contactInfo?.website && (
            <a
              href={dealer.contactInfo.website}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 text-xs tracking-[0.15em] uppercase font-medium text-kawai-black/60 hover:text-kawai-red transition-colors whitespace-nowrap"
            >
              Website
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
