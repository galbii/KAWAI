'use client'

import Link from 'next/link'
import { MapPin, Briefcase, Piano, ArrowRight, Navigation } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { cn } from '@/lib/utils'

interface DealerInfo {
  slug: string
  dealerName: string
  address: {
    city: string
    state: string
  }
  distance: number
  dealerType?: string[]
}

interface RelatedDealersProps {
  dealers: DealerInfo[]
  currentCity?: string
}

/**
 * RelatedDealers Component - Premium Redesign
 *
 * Curated presentation of nearby dealers featuring:
 * - Elegant card design with hover lift effect
 * - Gold accent for city name
 * - Enhanced typography hierarchy
 * - Smooth animations and transitions
 * - Premium badge styling
 * - Arrow icon animation on hover
 *
 * Strictly adheres to TypeScript strict mode requirements.
 */
export function RelatedDealers({ dealers, currentCity }: RelatedDealersProps) {
  // Don't render section if no dealers available
  if (!dealers || dealers.length === 0) {
    return null
  }

  // Limit to 3 dealers
  const limitedDealers = dealers.slice(0, 3)

  // Determine dealer type badges
  const getDealerTypeBadges = (dealerType?: string[]) => {
    if (!dealerType || dealerType.length === 0) {
      return []
    }

    return dealerType.map((type) => ({
      type,
      label: type
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (letter: string) => letter.toUpperCase()),
      icon:
        type === 'acoustic-digital'
          ? 'piano'
          : type === 'professional-products'
            ? 'briefcase'
            : null,
    }))
  }

  // Render dealer type icon
  const renderTypeIcon = (iconType: string | null) => {
    if (!iconType) return null

    if (iconType === 'piano') {
      return <Piano className="w-4 h-4" strokeWidth={2.5} />
    }

    if (iconType === 'briefcase') {
      return <Briefcase className="w-4 h-4" strokeWidth={2.5} />
    }

    return null
  }

  return (
    <section className="mt-20 pt-16 border-t-2 border-gray-200/60">
      {/* Section Header with gold accent */}
      <div className="mb-12">
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-kawai-charcoal mb-3 tracking-tight">
          Other Dealers Near{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-kawai-gold to-kawai-red">
            {currentCity ?? dealers[0]?.address?.city ?? 'You'}
          </span>
        </h2>
        <p className="text-gray-600 text-lg">
          Discover more authorized Kawai piano dealers in your area
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {limitedDealers.map((dealer, index) => {
          const badges = getDealerTypeBadges(dealer.dealerType)

          return (
            <Link
              key={dealer.slug}
              href={`/find-a-dealer/${dealer.slug}`}
              className="group h-full transition-all duration-300 hover:no-underline"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Card className="h-full border-2 border-gray-200 shadow-lg hover:shadow-2xl hover:border-kawai-gold transition-all duration-300 rounded-2xl overflow-hidden group-hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50/30">
                {/* Decorative top border */}
                <div className="h-1.5 w-full bg-gradient-to-r from-kawai-gold via-kawai-red to-kawai-gold/20 group-hover:from-kawai-gold group-hover:via-kawai-gold group-hover:to-kawai-red transition-all duration-500" />

                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-serif text-kawai-charcoal group-hover:text-kawai-gold transition-colors duration-300 tracking-tight">
                    {dealer.dealerName}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-5">
                  {/* Location */}
                  <div className="flex items-center gap-3 text-gray-600 group-hover:text-kawai-charcoal transition-colors duration-300">
                    <div className="p-2 bg-gray-100 group-hover:bg-kawai-gold/10 rounded-lg transition-colors duration-300">
                      <MapPin className="w-5 h-5 flex-shrink-0 group-hover:text-kawai-gold transition-colors duration-300" strokeWidth={2.5} />
                    </div>
                    <span className="text-sm font-medium">
                      {dealer.address.city}, {dealer.address.state}
                    </span>
                  </div>

                  {/* Distance Badge with Premium Styling */}
                  <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-kawai-gold/10 to-kawai-red/10 text-kawai-charcoal text-sm font-bold rounded-xl border-2 border-kawai-gold/30 group-hover:border-kawai-gold group-hover:shadow-md transition-all duration-300">
                    <Navigation className="w-4 h-4 text-kawai-gold" strokeWidth={2.5} />
                    {dealer.distance.toFixed(1)} miles away
                  </div>

                  {/* Dealer Type Badges */}
                  {badges.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
                      {badges.map((badge) => (
                        <div
                          key={badge.type}
                          className="inline-flex items-center gap-2 px-3 py-2 bg-gray-50 group-hover:bg-kawai-gold/10 text-gray-700 group-hover:text-kawai-charcoal text-xs font-semibold rounded-lg border border-gray-200 group-hover:border-kawai-gold/30 transition-all duration-300"
                        >
                          <div className="group-hover:text-kawai-gold transition-colors duration-300">
                            {renderTypeIcon(badge.icon)}
                          </div>
                          <span>{badge.label}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* CTA Link with Arrow Animation */}
                  <div className="pt-4 flex items-center justify-between text-sm font-bold text-kawai-red group-hover:text-kawai-gold transition-colors duration-300">
                    <span>View Details</span>
                    <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" strokeWidth={2.5} />
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
