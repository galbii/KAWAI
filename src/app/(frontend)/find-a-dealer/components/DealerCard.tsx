'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import type { DealerWithDistance } from '../types'
import { MapPin, Phone, ExternalLink, ArrowRight, ChevronDown, Navigation, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { trackCTAClick } from '@/lib/analytics/unified-tracking'

interface Props {
  dealer: DealerWithDistance
  isSelected: boolean
  onSelect: () => void
}

export function DealerCard({ dealer, isSelected, onSelect }: Props) {
  const [isExpanded, setIsExpanded] = useState(false)

  const formatDay = (day: string) => day.charAt(0).toUpperCase() + day.slice(1, 3)

  const isStorefront = dealer.source === 'storefront'
  const detailHref = isStorefront ? `/store/${dealer.slug}` : `/find-a-dealer/${dealer.slug}`

  const hasShigeru = dealer.shigeruKawaiDealer === true
  const hasAcoustic = dealer.acousticPianoDealer === true
  const hasDigital = dealer.digitalPianoDealer === true

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
        'relative cursor-pointer select-none group',
        'border-b border-kawai-neutral/50 last:border-b-0',
        'transition-all duration-200',
        isSelected
          ? 'bg-kawai-pearl shadow-[inset_0_0_0_0_transparent]'
          : 'bg-white hover:bg-kawai-pearl/60 hover:-translate-y-px hover:shadow-[0_4px_16px_rgb(30_27_22/0.07)]',
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
              <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.14em] text-kawai-gold">
                <Star className="w-2.5 h-2.5 fill-kawai-gold" strokeWidth={0} />
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
              'w-4 h-4 transition-all duration-200 flex-shrink-0',
              isExpanded
                ? 'rotate-180 text-kawai-charcoal/60'
                : 'text-kawai-charcoal/40 group-hover:text-kawai-charcoal/60'
            )}
            strokeWidth={2}
          />
        </div>

        {/* Dealer Name — official storefronts render as [KAWAI logo] CITY */}
        {isStorefront ? (
          <Link
            href={detailHref}
            onClick={(e) => e.stopPropagation()}
            className="group/name inline-flex items-center gap-2 mb-1.5"
          >
            <Image
              src="/images/Kawai (Red).png"
              alt="KAWAI"
              width={72}
              height={22}
              className="h-3.5 w-auto"
            />
            <span className="text-[15px] font-semibold uppercase tracking-[0.08em] text-kawai-charcoal group-hover/name:text-kawai-red transition-colors font-[family-name:var(--font-brand-sans)]">
              {dealer.dealerName}
            </span>
          </Link>
        ) : (
          <div
            className={cn(
              'text-[15px] font-semibold leading-snug mb-1.5 font-[family-name:var(--font-brand-serif)]',
              isSelected ? 'text-kawai-black' : 'text-kawai-charcoal'
            )}
          >
            <Link
              href={detailHref}
              onClick={(e) => e.stopPropagation()}
              className="hover:text-kawai-red transition-colors"
            >
              {dealer.dealerName}
            </Link>
          </div>
        )}

        {/* Location */}
        {(dealer.address?.city || dealer.address?.state) && (
          <div className="flex items-center gap-1.5 mb-3">
            <MapPin className="w-3.5 h-3.5 text-kawai-charcoal/35 flex-shrink-0" strokeWidth={2} />
            <span className="text-[13px] text-kawai-charcoal/65">
              {[dealer.address.city, dealer.address.state].filter(Boolean).join(', ')}
            </span>
          </div>
        )}

        {/* Type Badges */}
        {(hasShigeru || hasAcoustic || hasDigital) && (
          <div className="flex flex-wrap items-center gap-1.5 mb-4">
            {hasShigeru && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide bg-kawai-gold/10 border border-kawai-gold/25 text-kawai-gold-on-light">
                Shigeru Kawai
              </span>
            )}
            {hasAcoustic && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide bg-kawai-charcoal/[0.06] border border-kawai-charcoal/[0.12] text-kawai-charcoal/85">
                Acoustic
              </span>
            )}
            {hasDigital && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide bg-kawai-red/[0.06] border border-kawai-red/[0.12] text-kawai-red-700">
                Digital
              </span>
            )}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="px-5 pb-4">
        <div className="border-t border-kawai-neutral/50 mb-3" />
        <div className="flex gap-2">
          {dealer.contactInfo?.phone && (
            <a
              href={`tel:${dealer.contactInfo.phone}`}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[12px] font-medium text-kawai-charcoal bg-white hover:bg-kawai-pearl rounded-full transition-colors border border-kawai-neutral hover:border-kawai-charcoal/30"
              onClick={(e) => e.stopPropagation()}
            >
              <Phone className="w-3.5 h-3.5" strokeWidth={2} />
              Call
            </a>
          )}
          <Link
            href={detailHref}
            onClick={(e) => {
              e.stopPropagation()
              trackCTAClick({
                blockType: 'find-a-dealer-page',
                blockData: {},
                ctaText: dealer.dealerName || 'View Details',
                destination: detailHref,
              })
            }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[12px] font-semibold rounded-full transition-all duration-200 group/btn bg-kawai-red hover:bg-kawai-red-700 text-white shadow-[0_2px_8px_rgba(225,25,34,0.25)] hover:shadow-[0_2px_16px_rgba(225,25,34,0.4)]"
          >
            {isStorefront ? 'View Showroom' : 'View Details'}
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" strokeWidth={2.5} />
          </Link>
        </div>
      </div>

      {/* Expandable Details — Framer Motion height animation */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <div className="border-t border-kawai-neutral/60 bg-kawai-pearl/30 px-5 py-4 space-y-4">

              {/* Address */}
              {(dealer.address?.street || dealer.address?.city) && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0, duration: 0.2, ease: 'easeOut' }}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-kawai-charcoal/35 mb-1.5">
                    Address
                  </p>
                  <address className="text-[13px] text-kawai-charcoal/80 not-italic leading-relaxed">
                    {dealer.address.street && <>{dealer.address.street}<br /></>}
                    {[
                      dealer.address.city,
                      [dealer.address.state, dealer.address.zipCode].filter(Boolean).join(' '),
                    ].filter(Boolean).join(', ')}
                  </address>
                </motion.div>
              )}

              {/* Contact */}
              {(dealer.contactInfo?.phone || dealer.contactInfo?.email || dealer.contactInfo?.website) && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06, duration: 0.2, ease: 'easeOut' }}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-kawai-charcoal/35 mb-1.5">
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
                </motion.div>
              )}

              {/* Directions Button */}
              {dealer.address && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12, duration: 0.2, ease: 'easeOut' }}
                >
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                      `${dealer.address.street}, ${dealer.address.city}, ${dealer.address.state} ${dealer.address.zipCode}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-2 text-[12px] font-medium text-kawai-charcoal bg-white hover:bg-kawai-pearl rounded-full transition-colors w-full border border-kawai-neutral hover:border-kawai-charcoal/30"
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
                </motion.div>
              )}

              {/* Business Hours */}
              {dealer.hours && dealer.hours.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18, duration: 0.2, ease: 'easeOut' }}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-kawai-charcoal/35 mb-1.5">
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
                </motion.div>
              )}

              {/* Description */}
              {dealer.description && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.24, duration: 0.2, ease: 'easeOut' }}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-kawai-charcoal/35 mb-1.5">
                    About
                  </p>
                  <p className="text-[12px] text-kawai-charcoal/70 leading-relaxed">
                    {dealer.description}
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
