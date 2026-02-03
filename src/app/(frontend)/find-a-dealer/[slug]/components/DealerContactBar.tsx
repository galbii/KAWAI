'use client'

import type { Dealer } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { Phone, MapPin, Globe, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DealerContactBarProps {
  dealer: Dealer
  /**
   * Override the default sticky positioning
   * @default 'sticky top-20'
   */
  stickyClass?: string
}

/**
 * DealerContactBar Component - Premium Redesign
 *
 * Elegant sticky action bar with refined styling.
 * Features:
 * - Elevated shadow with subtle border
 * - Pill-shaped buttons with hover animations
 * - Icon transitions on hover
 * - Dividers between buttons on desktop
 * - VIP service feel with premium styling
 *
 * @example
 * ```tsx
 * <DealerContactBar dealer={dealer} />
 * ```
 */
export function DealerContactBar({
  dealer,
  stickyClass = 'sticky top-20'
}: DealerContactBarProps) {
  // Type guard for contact info
  if (!dealer.contactInfo && !dealer.coordinates) {
    return null
  }

  const hasPhone = dealer.contactInfo?.phone != null && dealer.contactInfo.phone.trim() !== ''
  const hasEmail = dealer.contactInfo?.email != null && dealer.contactInfo.email.trim() !== ''
  const hasWebsite = dealer.contactInfo?.website != null && dealer.contactInfo.website.trim() !== ''
  const hasCoordinates = dealer.coordinates?.latitude != null && dealer.coordinates?.longitude != null

  // If no contact methods available, don't render
  const hasAnyMethod = hasPhone || hasEmail || hasWebsite || hasCoordinates
  if (!hasAnyMethod) {
    return null
  }

  return (
    <div className={cn(
      'z-30 bg-white/95 backdrop-blur-md border-b border-gray-200/60 shadow-lg',
      stickyClass
    )}>
      <div className="container mx-auto px-4 py-5">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center sm:justify-center sm:divide-x sm:divide-gray-200">
          {/* Phone Button */}
          {hasPhone && dealer.contactInfo?.phone && (
            <div className="flex-1 sm:flex-none sm:px-3 first:pl-0 last:pr-0">
              <a
                href={`tel:${dealer.contactInfo.phone}`}
                className="block group"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className={cn(
                    'w-full sm:w-auto h-12 sm:h-11 gap-3 px-6',
                    'border-2 border-gray-200 text-kawai-charcoal font-semibold rounded-full',
                    'hover:border-kawai-red hover:bg-kawai-red hover:text-white',
                    'transition-all duration-300 ease-out',
                    'hover:scale-105 hover:shadow-md'
                  )}
                >
                  <Phone className="w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:rotate-12" strokeWidth={2.5} />
                  <span className="hidden sm:inline font-semibold">Call</span>
                  <span className="sm:hidden font-semibold">Call Dealer</span>
                </Button>
              </a>
            </div>
          )}

          {/* Directions Button - Premium gold accent */}
          {hasCoordinates && dealer.coordinates?.latitude != null && dealer.coordinates?.longitude != null && (
            <div className="flex-1 sm:flex-none sm:px-3">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${dealer.coordinates.latitude},${dealer.coordinates.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className={cn(
                    'w-full sm:w-auto h-12 sm:h-11 gap-3 px-6',
                    'border-2 border-kawai-gold/30 bg-gradient-to-r from-kawai-gold/10 to-kawai-gold/5 text-kawai-charcoal font-semibold rounded-full',
                    'hover:border-kawai-gold hover:bg-kawai-gold hover:text-white',
                    'transition-all duration-300 ease-out',
                    'hover:scale-105 hover:shadow-lg hover:shadow-kawai-gold/20'
                  )}
                >
                  <MapPin className="w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" strokeWidth={2.5} />
                  <span className="hidden sm:inline font-semibold">Directions</span>
                  <span className="sm:hidden font-semibold">Get Directions</span>
                </Button>
              </a>
            </div>
          )}

          {/* Website Button */}
          {hasWebsite && dealer.contactInfo?.website && (
            <div className="flex-1 sm:flex-none sm:px-3">
              <a
                href={dealer.contactInfo.website}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className={cn(
                    'w-full sm:w-auto h-12 sm:h-11 gap-3 px-6',
                    'border-2 border-gray-200 text-kawai-charcoal font-semibold rounded-full',
                    'hover:border-kawai-red hover:bg-kawai-red hover:text-white',
                    'transition-all duration-300 ease-out',
                    'hover:scale-105 hover:shadow-md'
                  )}
                >
                  <Globe className="w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:rotate-12" strokeWidth={2.5} />
                  <span className="hidden sm:inline font-semibold">Website</span>
                  <span className="sm:hidden font-semibold">Visit Site</span>
                </Button>
              </a>
            </div>
          )}

          {/* Email Button */}
          {hasEmail && dealer.contactInfo?.email && (
            <div className="flex-1 sm:flex-none sm:px-3 last:pr-0">
              <a
                href={`mailto:${dealer.contactInfo.email}`}
                className="block group"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className={cn(
                    'w-full sm:w-auto h-12 sm:h-11 gap-3 px-6',
                    'border-2 border-gray-200 text-kawai-charcoal font-semibold rounded-full',
                    'hover:border-kawai-red hover:bg-kawai-red hover:text-white',
                    'transition-all duration-300 ease-out',
                    'hover:scale-105 hover:shadow-md'
                  )}
                >
                  <Mail className="w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" strokeWidth={2.5} />
                  <span className="hidden sm:inline font-semibold">Email</span>
                  <span className="sm:hidden font-semibold">Send Email</span>
                </Button>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
