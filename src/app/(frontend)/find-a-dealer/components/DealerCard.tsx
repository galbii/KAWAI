'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Dealer } from '@/payload-types'
import type { DealerWithDistance } from '../types'
import { MapPin, Phone, ExternalLink, Piano, Briefcase, Star, ArrowRight, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { trackCTAClick } from '@/lib/analytics/unified-tracking'

interface Props {
  dealer: DealerWithDistance
  isSelected: boolean
  onSelect: () => void
}

export function DealerCard({ dealer, isSelected, onSelect }: Props) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  const formatDay = (day: string) => {
    return day.charAt(0).toUpperCase() + day.slice(1, 3)
  }

  const hasShigeru = dealer.shigeruKawaiDealer === true
  const hasAcoustic = dealer.acousticPianoDealer === true
  const hasProfessional = dealer.professionalProductDealer === true

  return (
    <div
      className={cn(
        "group bg-white border cursor-pointer transition-all duration-200 relative overflow-hidden",
        isSelected
          ? "border-kawai-charcoal shadow-lg"
          : "border-gray-200 hover:border-gray-300 hover:shadow-md",
        hasShigeru && [
          "border-l-4 border-l-kawai-gold",
          !isSelected && "hover:shadow-[0_12px_24px_rgba(212,175,55,0.2),0_0_0_2px_rgba(212,175,55,0.3)]"
        ]
      )}
      onClick={() => {
        onSelect()
        setIsExpanded(!isExpanded)
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >

      {/* Header */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-kawai-charcoal leading-tight mb-1.5">
              {dealer.dealerName}
            </h3>

            {/* Location */}
            {dealer.address && (
              <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-2.5">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" strokeWidth={2} />
                <span>
                  {dealer.address.city}, {dealer.address.state}
                </span>
              </div>
            )}

            {/* Dealer Type Badges */}
            <div className="flex flex-wrap gap-1.5">
              {hasShigeru && (
                <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-kawai-gold/10 text-kawai-gold text-xs font-semibold rounded-md border border-kawai-gold/20">
                  <Star className="w-3 h-3" fill="currentColor" strokeWidth={0} />
                  <span>Shigeru Kawai</span>
                </div>
              )}
              {hasAcoustic && (
                <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-md">
                  <Piano className="w-3 h-3" strokeWidth={2} />
                  <span>Acoustic Piano</span>
                </div>
              )}
              {hasProfessional && (
                <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-md">
                  <Briefcase className="w-3 h-3" strokeWidth={2} />
                  <span>Professional</span>
                </div>
              )}
            </div>
          </div>

          {/* Featured Badge */}
          {dealer.isFeatured && (
            <div className="flex-shrink-0">
              <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-kawai-gold/10 text-kawai-gold text-xs font-semibold rounded-md border border-kawai-gold/20">
                <Star className="w-3 h-3" fill="currentColor" strokeWidth={0} />
                Featured
              </div>
            </div>
          )}
        </div>

        {/* Distance Badge */}
        {dealer.distance !== undefined && (
          <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-kawai-red/5 text-kawai-red text-xs font-medium rounded-lg border border-kawai-red/10">
            <div className="w-1.5 h-1.5 rounded-full bg-kawai-red" />
            {dealer.distance.toFixed(1)} miles away
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="px-4 pb-4">
        <div className="flex items-center gap-2">
          {dealer.contactInfo?.phone && (
            <a
              href={`tel:${dealer.contactInfo.phone}`}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-kawai-charcoal bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <Phone className="w-3.5 h-3.5" strokeWidth={2} />
              <span>Call</span>
            </a>
          )}

          <Link
            href={`/find-a-dealer/${dealer.slug}`}
            onClick={(e) => {
              e.stopPropagation()
              trackCTAClick({
                blockType: 'find-a-dealer-page',
                blockData: {},
                ctaText: dealer.dealerName || 'View Details',
                destination: `/find-a-dealer/${dealer.slug}`,
              })
            }}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-kawai-red hover:bg-kawai-red/90 rounded-lg transition-all duration-200 group"
          >
            <Info className="w-3.5 h-3.5" strokeWidth={2} />
            <span>View Details</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" strokeWidth={2} />
          </Link>
        </div>
      </div>

      {/* Expandable Details */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-6 bg-gray-50 space-y-5 animate-in slide-in-from-top-2 duration-200">
          {/* Full Address */}
          {dealer.address && (
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Address
              </h4>
              <address className="text-sm text-gray-700 not-italic leading-relaxed">
                {dealer.address.street}<br />
                {dealer.address.city}, {dealer.address.state} {dealer.address.zipCode}
              </address>
            </div>
          )}

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Contact
            </h4>
            <div className="space-y-2 text-sm">
              {dealer.contactInfo?.phone && (
                <div className="text-gray-700">{dealer.contactInfo.phone}</div>
              )}
              {dealer.contactInfo?.email && (
                <div className="text-gray-700">{dealer.contactInfo.email}</div>
              )}
              {dealer.contactInfo?.website && (
                <a
                  href={dealer.contactInfo.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-kawai-red hover:underline inline-flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  Visit Website
                  <ExternalLink className="w-3 h-3" strokeWidth={2} />
                </a>
              )}
            </div>

            {/* Directions Button - Only in Expanded View */}
            {dealer.address && (
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                  `${dealer.address.street}, ${dealer.address.city}, ${dealer.address.state} ${dealer.address.zipCode}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-kawai-charcoal hover:bg-kawai-charcoal/90 rounded-lg transition-colors w-full"
                onClick={(e) => {
                  e.stopPropagation()
                  trackCTAClick({
                    blockType: 'find-a-dealer-page',
                    blockData: {},
                    ctaText: 'Get Directions',
                    destination: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                      `${dealer.address!.street}, ${dealer.address!.city}, ${dealer.address!.state} ${dealer.address!.zipCode}`
                    )}`,
                    additionalProps: { dealer_name: dealer.dealerName || '' },
                  })
                }}
              >
                <ExternalLink className="w-4 h-4" strokeWidth={2} />
                <span>Get Directions</span>
              </a>
            )}
          </div>

          {/* Business Hours */}
          {dealer.hours && dealer.hours.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Hours
              </h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                {dealer.hours.map((hour, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-gray-700 font-medium">
                      {formatDay(hour.day || '')}
                    </span>
                    <span className={cn(
                      "text-gray-600",
                      hour.isClosed && "text-gray-400"
                    )}>
                      {hour.isClosed ? 'Closed' : `${hour.openTime} - ${hour.closeTime}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {dealer.description && (
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                About
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                {dealer.description}
              </p>
            </div>
          )}

        </div>
      )}
    </div>
  )
}
