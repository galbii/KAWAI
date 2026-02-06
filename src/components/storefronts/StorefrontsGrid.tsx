'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Search, X, MapPin, Phone, Star, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

// ============================================================================
// Types
// ============================================================================

interface StorefrontData {
  id: string
  slug: string
  locationName: string
  locationText: string
  establishedText?: string
  showroomInfo?: {
    address?: string
    phone?: string
  }
  features?: Array<{ title: string }>
}

interface StorefrontsGridProps {
  storefronts: StorefrontData[]
  error?: string | null
}

// ============================================================================
// Component
// ============================================================================

/**
 * StorefrontsGrid - Searchable grid of KAWAI showrooms
 *
 * Features:
 * - Real-time search filtering
 * - Responsive grid layout (1/2/3 columns)
 * - Premium card design with hover effects
 * - Empty states and error handling
 * - Smooth animations with framer-motion
 */
export function StorefrontsGrid({ storefronts, error }: StorefrontsGridProps) {
  const [searchQuery, setSearchQuery] = useState('')

  // Filter storefronts based on search query
  const filteredStorefronts = useMemo(() => {
    if (!searchQuery.trim()) {
      return storefronts
    }

    const query = searchQuery.toLowerCase()

    return storefronts.filter((storefront) => {
      const searchableText = [
        storefront.locationName,
        storefront.locationText,
        storefront.showroomInfo?.address || '',
        storefront.establishedText || '',
      ]
        .join(' ')
        .toLowerCase()

      return searchableText.includes(query)
    })
  }, [storefronts, searchQuery])

  // Clear search
  const clearSearch = () => {
    setSearchQuery('')
  }

  // Error State
  if (error) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-red-900 mb-2">
              Unable to Load Storefronts
            </h3>
            <p className="text-sm text-red-700">
              {error}. Please try refreshing the page.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 md:py-16">
      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by location, city, or address..."
            className={cn(
              'w-full pl-12 pr-12 py-4 rounded-xl border-2 transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-kawai-red/20 focus:border-kawai-red',
              'text-gray-900 placeholder-gray-400',
              'bg-white shadow-lg hover:shadow-xl'
            )}
            aria-label="Search storefronts"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-kawai-red transition-colors"
              aria-label="Clear search"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Search Results Count */}
        {searchQuery && (
          <div className="mt-4 text-center text-sm text-gray-600">
            {filteredStorefronts.length === 0 ? (
              <span>No storefronts found</span>
            ) : (
              <span>
                Found {filteredStorefronts.length}{' '}
                {filteredStorefronts.length === 1 ? 'storefront' : 'storefronts'}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Storefronts Grid */}
      {filteredStorefronts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredStorefronts.map((storefront, index) => (
            <motion.div
              key={storefront.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <StorefrontCard storefront={storefront} />
            </motion.div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="max-w-md mx-auto text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            No storefronts found
          </h3>
          <p className="text-gray-600 mb-6">
            We couldn't find any storefronts matching "{searchQuery}"
          </p>
          <button
            onClick={clearSearch}
            className="inline-flex items-center gap-2 text-kawai-red hover:text-kawai-red/80 transition-colors font-medium"
          >
            <X className="h-4 w-4" />
            Clear search
          </button>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Storefront Card Component
// ============================================================================

interface StorefrontCardProps {
  storefront: StorefrontData
}

function StorefrontCard({ storefront }: StorefrontCardProps) {
  return (
    <Link
      href={`/store/${storefront.slug}`}
      className="group block bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:scale-[1.02] h-[480px]"
    >
      <div className="p-6 md:p-8 flex flex-col h-full">
        {/* Header */}
        <div className="mb-6 flex-shrink-0">
          <div className="text-xs text-kawai-red font-medium tracking-[0.2em] uppercase mb-3">
            {storefront.locationText || 'Kawai Showroom'}
          </div>

          {/* KAWAI Logo */}
          <div className="mb-4 flex justify-start">
            <Image
              src="/images/Kawai (Red)(2).png"
              alt="KAWAI"
              width={80}
              height={24}
              className="h-4 w-auto"
            />
          </div>

          {/* Location Name */}
          <h3 className="text-2xl font-bold text-kawai-black mb-3 group-hover:text-kawai-red transition-colors leading-tight uppercase">
            {storefront.locationName}
          </h3>

          {/* Decorative Divider */}
          <div className="w-12 h-px bg-kawai-red opacity-50 group-hover:opacity-100 transition-opacity"></div>
        </div>

        {/* Location Details */}
        <div className="space-y-3 mb-6 h-[120px] flex-shrink-0">
          {/* Address */}
          {storefront.showroomInfo?.address && (
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-kawai-red/10 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                <MapPin className="w-3 h-3 text-kawai-red" />
              </div>
              <p className="text-sm text-kawai-black/70 leading-relaxed line-clamp-2">
                {storefront.showroomInfo.address}
              </p>
            </div>
          )}

          {/* Phone */}
          {storefront.showroomInfo?.phone && (
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-kawai-red/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Phone className="w-3 h-3 text-kawai-red" />
              </div>
              <p className="text-sm text-kawai-black/70">
                {storefront.showroomInfo.phone}
              </p>
            </div>
          )}

          {/* City and State */}
          {storefront.establishedText && (
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-kawai-red/10 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-3 h-3 text-kawai-red" />
              </div>
              <p className="text-sm text-kawai-black/70">
                {storefront.establishedText.replace(/^Est\.\s*\d{4}\s*•\s*/, '')}
              </p>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="mb-6 h-[72px] flex-shrink-0 overflow-hidden">
          {storefront.features && storefront.features.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {storefront.features.map((feature, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-kawai-red/10 text-kawai-red text-xs font-medium rounded-full"
                >
                  {feature.title}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* CTA Button */}
        <div className="pt-4 border-t border-kawai-pearl mt-auto flex-shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-kawai-black group-hover:text-kawai-red transition-colors">
              Visit Showroom
            </span>
            <div className="w-8 h-8 bg-kawai-red/10 group-hover:bg-kawai-red rounded-full flex items-center justify-center transition-all duration-300">
              <ArrowRight className="w-4 h-4 text-kawai-red group-hover:text-white transition-colors transform group-hover:translate-x-0.5" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
