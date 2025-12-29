'use client'

import { useState } from 'react'
import type { Dealer } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { MapPin, Phone, Mail, Globe, Navigation, ChevronDown, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DealerWithDistance extends Dealer {
  distance?: number
}

interface Props {
  dealer: DealerWithDistance
  isSelected: boolean
  onSelect: () => void
}

export function DealerCard({ dealer, isSelected, onSelect }: Props) {
  const [isExpanded, setIsExpanded] = useState(false)

  const formatDay = (day: string) => {
    return day.charAt(0).toUpperCase() + day.slice(1)
  }

  return (
    <div
      className={cn(
        "group bg-white rounded-xl overflow-hidden cursor-pointer transition-all duration-300",
        isSelected
          ? "shadow-2xl ring-2 ring-kawai-gold scale-[1.02]"
          : "shadow-md hover:shadow-xl hover:scale-[1.01]"
      )}
      onClick={onSelect}
    >
      {/* Accent Bar */}
      <div
        className={cn(
          "h-1.5 w-full transition-all duration-300",
          dealer.isFeatured ? "bg-gradient-to-r from-kawai-gold via-kawai-red to-kawai-gold" : "bg-kawai-red",
          isSelected && "h-2"
        )}
      />

      {/* Header Section */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2 mb-2">
              <h3 className="text-xl font-bold text-kawai-charcoal leading-tight line-clamp-2 flex-1">
                {dealer.dealerName}
              </h3>
              {dealer.isFeatured && (
                <div className="flex-shrink-0">
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-kawai-gold to-[#F4D03F] text-white text-xs font-semibold rounded-full shadow-sm">
                    <Star className="w-3 h-3" fill="currentColor" />
                    Featured
                  </div>
                </div>
              )}
            </div>

            {dealer.address && (
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-gray-100">
                  <MapPin className="w-3 h-3 text-kawai-red" />
                </div>
                <span className="font-medium">
                  {dealer.address.city}, {dealer.address.state}
                </span>
              </div>
            )}

            {dealer.distance !== undefined && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-kawai-red/5 border border-kawai-red/20 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-kawai-red animate-pulse" />
                <span className="text-sm font-semibold text-kawai-red">
                  {dealer.distance.toFixed(1)} miles away
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Service Tags */}
        {dealer.tags && dealer.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {dealer.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium bg-gray-50 text-gray-700 rounded-full border border-gray-200 hover:border-kawai-red/30 hover:bg-kawai-red/5 transition-colors"
              >
                {String(tag).replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            ))}
            {dealer.tags.length > 3 && (
              <span className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-500">
                +{dealer.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="px-5 pb-5 pt-3 border-t border-gray-100">
        <div className="grid grid-cols-3 gap-2">
          {dealer.contactInfo?.phone && (
            <a
              href={`tel:${dealer.contactInfo.phone}`}
              className="group/btn inline-flex flex-col items-center justify-center gap-1.5 px-3 py-3 text-xs font-semibold text-kawai-red bg-kawai-red/5 border border-kawai-red/20 rounded-lg hover:bg-kawai-red hover:text-white hover:border-kawai-red transition-all duration-200 hover:shadow-md"
              onClick={(e) => e.stopPropagation()}
            >
              <Phone className="w-4 h-4" />
              <span>Call</span>
            </a>
          )}

          {dealer.address && (
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                `${dealer.address.street}, ${dealer.address.city}, ${dealer.address.state} ${dealer.address.zipCode}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group/btn inline-flex flex-col items-center justify-center gap-1.5 px-3 py-3 text-xs font-semibold text-kawai-red bg-kawai-red/5 border border-kawai-red/20 rounded-lg hover:bg-kawai-red hover:text-white hover:border-kawai-red transition-all duration-200 hover:shadow-md"
              onClick={(e) => e.stopPropagation()}
            >
              <Navigation className="w-4 h-4" />
              <span>Directions</span>
            </a>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsExpanded(!isExpanded)
            }}
            className="group/btn inline-flex flex-col items-center justify-center gap-1.5 px-3 py-3 text-xs font-semibold text-kawai-charcoal bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-gray-300 transition-all duration-200"
          >
            <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", isExpanded && "rotate-180")} />
            <span>{isExpanded ? 'Less' : 'More'}</span>
          </button>
        </div>
      </div>

      {/* Expandable Details */}
      {isExpanded && (
        <div className="px-5 pb-5 pt-4 border-t border-gray-100 bg-gradient-to-b from-gray-50 to-white space-y-5">
          {/* Full Address */}
          {dealer.address && (
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="text-xs font-bold text-kawai-red uppercase tracking-wide mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Address
              </h4>
              <address className="text-sm text-gray-700 not-italic leading-relaxed">
                {dealer.address.street}<br />
                {dealer.address.city}, {dealer.address.state} {dealer.address.zipCode}
                {dealer.address.country && dealer.address.country !== 'USA' && (
                  <><br />{dealer.address.country}</>
                )}
              </address>
            </div>
          )}

          {/* Contact Information */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h4 className="text-xs font-bold text-kawai-red uppercase tracking-wide mb-3">Contact</h4>
            <div className="space-y-2.5 text-sm">
              {dealer.contactInfo?.phone && (
                <a
                  href={`tel:${dealer.contactInfo.phone}`}
                  className="flex items-center gap-3 text-gray-700 hover:text-kawai-red transition-colors group/link"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-kawai-red/10 group-hover/link:bg-kawai-red/20 transition-colors">
                    <Phone className="w-4 h-4 text-kawai-red" />
                  </div>
                  <span className="font-medium">{dealer.contactInfo.phone}</span>
                </a>
              )}
              {dealer.contactInfo?.email && (
                <a
                  href={`mailto:${dealer.contactInfo.email}`}
                  className="flex items-center gap-3 text-gray-700 hover:text-kawai-red transition-colors group/link"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-kawai-red/10 group-hover/link:bg-kawai-red/20 transition-colors">
                    <Mail className="w-4 h-4 text-kawai-red" />
                  </div>
                  <span className="font-medium truncate">{dealer.contactInfo.email}</span>
                </a>
              )}
              {dealer.contactInfo?.website && (
                <a
                  href={dealer.contactInfo.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-700 hover:text-kawai-red transition-colors group/link"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-kawai-red/10 group-hover/link:bg-kawai-red/20 transition-colors">
                    <Globe className="w-4 h-4 text-kawai-red" />
                  </div>
                  <span className="font-medium">Visit Website →</span>
                </a>
              )}
            </div>
          </div>

          {/* Business Hours */}
          {dealer.hours && dealer.hours.length > 0 && (
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="text-xs font-bold text-kawai-red uppercase tracking-wide mb-3">Business Hours</h4>
              <div className="space-y-2">
                {dealer.hours.map((hour, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-gray-700 font-semibold">
                      {formatDay(hour.day || '')}
                    </span>
                    <span className={cn(
                      "font-medium",
                      hour.isClosed ? "text-gray-400" : "text-gray-600"
                    )}>
                      {hour.isClosed ? (
                        'Closed'
                      ) : (
                        `${hour.openTime || ''} - ${hour.closeTime || ''}`
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {dealer.description && (
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="text-xs font-bold text-kawai-red uppercase tracking-wide mb-3">About</h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                {dealer.description}
              </p>
            </div>
          )}

          {/* All Services */}
          {dealer.tags && dealer.tags.length > 0 && (
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="text-xs font-bold text-kawai-red uppercase tracking-wide mb-3">Services & Features</h4>
              <div className="flex flex-wrap gap-2">
                {dealer.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium bg-gray-50 text-gray-700 rounded-full border border-gray-200"
                  >
                    {String(tag).replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
