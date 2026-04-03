'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { DealerWithDistance } from '../types'
import { MapPin, Phone, ExternalLink, ArrowRight, ChevronDown, Navigation } from 'lucide-react'
import { cn } from '@/lib/utils'
import { trackCTAClick } from '@/lib/analytics/unified-tracking'

interface Props {
  dealer: DealerWithDistance
  isSelected: boolean
  onSelect: () => void
}

export function DealerCard({ dealer, isSelected, onSelect }: Props) {
  const [isExpanded, setIsExpanded] = useState(false)

  const formatDay = (day: string) => {
    return day.charAt(0).toUpperCase() + day.slice(1, 3)
  }

  const hasShigeru = dealer.shigeruKawaiDealer === true
  const hasAcoustic = dealer.acousticPianoDealer === true
  const hasProfessional = dealer.professionalProductDealer === true

  const handleCardClick = () => {
    onSelect()
    setIsExpanded(prev => !prev)
  }

  const borderColor = hasShigeru
    ? '#C49A00'
    : isSelected
      ? '#E11922'
      : 'transparent'

  return (
    <div
      className={cn(
        'relative cursor-pointer transition-all duration-200 select-none',
        'border-b border-kawai-neutral/50 last:border-b-0',
        isSelected ? 'bg-kawai-pearl/40' : 'bg-white hover:bg-kawai-pearl/10',
      )}
      style={{ borderLeft: `3px solid ${borderColor}` }}
      onClick={handleCardClick}
    >
      {/* Card Header */}
      <div className="px-5 pt-4 pb-0">
        {/* Meta row: featured + distance + chevron */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 min-h-[18px]">
            {dealer.isFeatured && (
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-kawai-gold">
                Featured
              </span>
            )}
            {dealer.isFeatured && dealer.distance !== undefined && (
              <span className="text-[11px] text-kawai-charcoal/30">·</span>
            )}
            {dealer.distance !== undefined && (
              <span className="text-[11px] font-medium text-kawai-charcoal/50 tabular-nums">
                {dealer.distance.toFixed(1)} mi away
              </span>
            )}
          </div>
          <ChevronDown
            className={cn(
              'w-4 h-4 text-kawai-charcoal/25 transition-transform duration-200 flex-shrink-0',
              isExpanded && 'rotate-180 text-kawai-charcoal/50'
            )}
            strokeWidth={2}
          />
        </div>

        {/* Dealer Name */}
        <h3
          className={cn(
            'text-[15px] font-semibold leading-snug mb-1.5',
            isSelected ? 'text-kawai-black' : 'text-kawai-charcoal'
          )}
        >
          {dealer.dealerName}
        </h3>

        {/* Location */}
        {(dealer.address?.city || dealer.address?.state) && (
          <div className="flex items-center gap-1.5 mb-3">
            <MapPin className="w-3.5 h-3.5 text-kawai-charcoal/35 flex-shrink-0" strokeWidth={2} />
            <span className="text-[13px] text-kawai-charcoal/55">
              {[dealer.address.city, dealer.address.state].filter(Boolean).join(', ')}
            </span>
          </div>
        )}

        {/* Type Labels */}
        {(hasShigeru || hasAcoustic || hasProfessional) && (
          <div className="flex items-center gap-3 mb-3.5">
            {hasShigeru && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wide" style={{ color: '#A07800' }}>
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#C49A00' }} />
                Shigeru Kawai
              </span>
            )}
            {hasAcoustic && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-kawai-charcoal/55 tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-kawai-charcoal/35 flex-shrink-0" />
                Acoustic
              </span>
            )}
            {hasProfessional && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium tracking-wide" style={{ color: '#C01820' }}>
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#C01820' }} />
                Professional
              </span>
            )}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="px-5 pb-4 flex gap-2">
        {dealer.contactInfo?.phone && (
          <a
            href={`tel:${dealer.contactInfo.phone}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[12px] font-medium text-kawai-charcoal bg-kawai-pearl hover:bg-kawai-neutral/40 rounded-md transition-colors border border-kawai-neutral"
            onClick={(e) => e.stopPropagation()}
          >
            <Phone className="w-3.5 h-3.5" strokeWidth={2} />
            Call
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
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[12px] font-semibold rounded-md transition-all duration-200 group bg-kawai-black hover:bg-kawai-charcoal text-white"
        >
          View Details
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" strokeWidth={2.5} />
        </Link>
      </div>

      {/* Expandable Details */}
      {isExpanded && (
        <div className="border-t border-kawai-neutral/60 bg-kawai-pearl/40 px-5 py-4 space-y-4 animate-in slide-in-from-top-1 duration-150">

          {/* Address */}
          {(dealer.address?.street || dealer.address?.city) && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-kawai-charcoal/40 mb-1.5">
                Address
              </p>
              <address className="text-[13px] text-kawai-charcoal/80 not-italic leading-relaxed">
                {dealer.address.street && <>{dealer.address.street}<br /></>}
                {[
                  dealer.address.city,
                  [dealer.address.state, dealer.address.zipCode].filter(Boolean).join(' '),
                ].filter(Boolean).join(', ')}
              </address>
            </div>
          )}

          {/* Contact */}
          {(dealer.contactInfo?.phone || dealer.contactInfo?.email || dealer.contactInfo?.website) && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-kawai-charcoal/40 mb-1.5">
                Contact
              </p>
              <div className="space-y-1.5 text-[13px]">
                {dealer.contactInfo?.phone && (
                  <p className="text-kawai-charcoal/75">{dealer.contactInfo.phone}</p>
                )}
                {dealer.contactInfo?.email && (
                  <p className="text-kawai-charcoal/75">{dealer.contactInfo.email}</p>
                )}
                {dealer.contactInfo?.website && (
                  <a
                    href={dealer.contactInfo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-kawai-red hover:text-kawai-red/80 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Visit Website
                    <ExternalLink className="w-3 h-3" strokeWidth={2} />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Directions Button */}
          {dealer.address && (
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                `${dealer.address.street}, ${dealer.address.city}, ${dealer.address.state} ${dealer.address.zipCode}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2 text-[12px] font-medium text-kawai-charcoal bg-white hover:bg-kawai-pearl rounded-md transition-colors w-full border border-kawai-neutral"
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
              <Navigation className="w-3.5 h-3.5" strokeWidth={2} />
              Get Directions
            </a>
          )}

          {/* Business Hours */}
          {dealer.hours && dealer.hours.length > 0 && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-kawai-charcoal/40 mb-1.5">
                Hours
              </p>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[12px]">
                {dealer.hours.map((hour, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-kawai-charcoal/70 font-medium">
                      {formatDay(hour.day || '')}
                    </span>
                    <span className={cn(
                      hour.isClosed ? 'text-kawai-charcoal/35' : 'text-kawai-charcoal/65'
                    )}>
                      {hour.isClosed ? 'Closed' : `${hour.openTime}–${hour.closeTime}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {dealer.description && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-kawai-charcoal/40 mb-1.5">
                About
              </p>
              <p className="text-[12px] text-kawai-charcoal/70 leading-relaxed">
                {dealer.description}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
