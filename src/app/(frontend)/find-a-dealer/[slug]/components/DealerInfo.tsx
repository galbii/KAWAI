'use client'

import { Card, CardContent, CardHeader, CardTitle, Badge } from '@/components/ui'
import type { Dealer } from '@/payload-types'
import { Piano, Briefcase, Store, Sparkles } from 'lucide-react'

interface DealerInfoProps {
  dealer: Dealer
}

/**
 * DealerInfo Component - Premium Redesign
 *
 * Elegant presentation of dealer information featuring:
 * - Decorative gold accent line
 * - Refined typography with increased line-height
 * - Sophisticated badge styling
 * - Two-column layout for tags on desktop
 * - Enhanced visual hierarchy
 *
 * Handles null/undefined values gracefully with strict TypeScript compliance.
 */
export function DealerInfo({ dealer }: DealerInfoProps) {
  // Generate default description if missing
  const getDescription = (): string => {
    if (dealer.description && typeof dealer.description === 'string' && dealer.description.trim()) {
      return dealer.description
    }

    // Fallback pattern
    const city = dealer.address?.city ?? 'our location'
    const state = dealer.address?.state ?? ''
    const locationText = state ? `${city}, ${state}` : city

    return `Welcome to ${dealer.dealerName}, your authorized Kawai piano dealer in ${locationText}. We offer expert consultation, a wide selection of acoustic and digital pianos, and professional service.`
  }

  // Map dealer types to icons
  const getDealerTypeIcon = (type: string) => {
    switch (type) {
      case 'professional-products':
        return <Briefcase className="w-5 h-5" strokeWidth={2.5} />
      case 'acoustic-digital':
        return <Piano className="w-5 h-5" strokeWidth={2.5} />
      default:
        return null
    }
  }

  // Format dealer type label
  const formatDealerType = (type: string): string => {
    return type
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (letter: string) => letter.toUpperCase())
  }

  // Format tag/specialty label
  const formatTag = (tag: string): string => {
    return tag
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (letter: string) => letter.toUpperCase())
  }

  const description = getDescription()
  const hasDealerTypes = dealer.dealerType && dealer.dealerType.length > 0
  const hasSpecialties = dealer.specialties && typeof dealer.specialties === 'string' && dealer.specialties.trim()
  const hasTags = dealer.tags && dealer.tags.length > 0

  return (
    <Card className="border-0 shadow-xl rounded-2xl overflow-hidden bg-gradient-to-br from-white to-gray-50/50">
      {/* Decorative gold accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-kawai-gold via-kawai-red to-kawai-gold/20" />

      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-2xl font-serif text-kawai-charcoal">
          <div className="p-2 bg-kawai-gold/10 rounded-lg">
            <Store className="w-6 h-6 text-kawai-gold" strokeWidth={2.5} />
          </div>
          About This Dealer
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-8 px-6 pb-8">
        {/* Description Section with enhanced typography */}
        <div className="relative pl-6">
          {/* Vertical decorative line */}
          <div className="absolute left-0 top-1 bottom-1 w-1 bg-gradient-to-b from-kawai-gold to-kawai-gold/20 rounded-full" />
          <p className="text-gray-700 leading-[1.8] text-base">
            {description}
          </p>
        </div>

        {/* Dealer Types with Premium Icons */}
        {hasDealerTypes && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-kawai-gold" strokeWidth={2.5} />
              <h3 className="text-xs font-bold text-kawai-gold uppercase tracking-widest">
                Specialties
              </h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {dealer.dealerType.map((type: string) => (
                <div
                  key={type}
                  className="group inline-flex items-center gap-3 px-4 py-3 bg-gradient-to-br from-kawai-red/5 to-kawai-gold/5 text-kawai-charcoal border-2 border-kawai-red/20 rounded-xl text-sm font-semibold transition-all duration-300 hover:border-kawai-gold hover:shadow-md hover:scale-105"
                >
                  <div className="text-kawai-red group-hover:text-kawai-gold transition-colors duration-300">
                    {getDealerTypeIcon(type)}
                  </div>
                  <span>{formatDealerType(type)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Specialties Text */}
        {hasSpecialties && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-kawai-gold" strokeWidth={2.5} />
              <h3 className="text-xs font-bold text-kawai-gold uppercase tracking-widest">
                Services & Features
              </h3>
            </div>
            <div className="relative pl-6">
              <div className="absolute left-0 top-1 bottom-1 w-1 bg-gradient-to-b from-kawai-gold/50 to-transparent rounded-full" />
              <p className="text-gray-700 leading-[1.8] text-sm">
                {dealer.specialties}
              </p>
            </div>
          </div>
        )}

        {/* Service Tags - Two column layout on desktop */}
        {hasTags && dealer.tags && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-kawai-gold" strokeWidth={2.5} />
              <h3 className="text-xs font-bold text-kawai-gold uppercase tracking-widest">
                Available Services
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {dealer.tags.map((tag: string) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-gray-50 text-gray-700 border border-gray-200 hover:border-kawai-gold hover:bg-kawai-gold/5 transition-all duration-300 py-2 px-3 text-xs font-medium justify-center rounded-lg"
                >
                  {formatTag(tag)}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Year Established with refined styling */}
        {dealer.yearEstablished && typeof dealer.yearEstablished === 'number' && (
          <div className="pt-6 border-t border-gray-200/60">
            <div className="flex items-center justify-center gap-3 px-4 py-3 bg-kawai-gold/5 rounded-xl border border-kawai-gold/20">
              <p className="text-sm text-gray-600">
                Proudly serving since{' '}
                <span className="font-bold text-kawai-gold text-lg">{dealer.yearEstablished}</span>
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
