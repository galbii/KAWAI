'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import type { Dealer } from '@/payload-types'
import type { DealerWithDistance } from '../types'
import { DealerMapLibre } from './DealerMapLibre'
import { SearchBar } from './SearchBar'
import { FilterPanel } from './FilterPanel'
import { cn } from '@/lib/utils'
import { calculateDistance } from '@/lib/utils/dealer-search'
import { MapPin, SlidersHorizontal, Map, List, Piano, Briefcase, Star, X, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface Props {
  dealers: DealerWithDistance[]
}

type DealerTypeFilter = 'all' | 'shigeru' | 'acoustic' | 'digital'
type ViewMode = 'map' | 'list'

export function DealerFinderMobile({ dealers }: Props) {
  const [searchLocation, setSearchLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [selectedRadius, setSelectedRadius] = useState(25)
  const [selectedDealerTypes, setSelectedDealerTypes] = useState<string[]>([])
  const [selectedDealer, setSelectedDealer] = useState<string | null>(null)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [dealerTypeFilter, setDealerTypeFilter] = useState<DealerTypeFilter>('all')
  const [dealerSheetOpen, setDealerSheetOpen] = useState(false)
  const [searchResults, setSearchResults] = useState<DealerWithDistance[]>([])

  // Calculate dealer type counts
  const dealerCounts = useMemo(() => {
    const counts = { all: dealers.length, shigeru: 0, acoustic: 0, digital: 0 }
    dealers.forEach(dealer => {
      if (dealer.shigeruKawaiDealer) counts.shigeru++
      if (dealer.acousticPianoDealer) counts.acoustic++
      if (dealer.digitalPianoDealer) counts.digital++
    })
    return counts
  }, [dealers])

  // Filter and sort dealers
  const filteredDealers: DealerWithDistance[] = useMemo(() => {
    let result = searchResults.length > 0
      ? searchResults.map(dealer => ({ ...dealer }))
      : dealers.map(dealer => ({ ...dealer }))

    if (dealerTypeFilter === 'shigeru') {
      result = result.filter(dealer => dealer.shigeruKawaiDealer === true)
    } else if (dealerTypeFilter === 'acoustic') {
      result = result.filter(dealer => dealer.acousticPianoDealer === true)
    } else if (dealerTypeFilter === 'digital') {
      result = result.filter(dealer => dealer.digitalPianoDealer === true)
    }

    if (selectedDealerTypes.length > 0) {
      result = result.filter(dealer =>
        selectedDealerTypes.some(type => {
          if (type === 'shigeru') return dealer.shigeruKawaiDealer === true
          if (type === 'acoustic') return dealer.acousticPianoDealer === true
          if (type === 'digital') return dealer.digitalPianoDealer === true
          return false
        })
      )
    }

    if (searchLocation) {
      result = result.map(dealer => {
        if (!dealer.coordinates?.latitude || !dealer.coordinates?.longitude) return dealer
        return {
          ...dealer,
          distance: calculateDistance(
            searchLocation.lat,
            searchLocation.lng,
            dealer.coordinates.latitude,
            dealer.coordinates.longitude
          ),
        } as DealerWithDistance
      })

      result.sort((a, b) => {
        if (a.distance !== undefined && b.distance !== undefined) return a.distance - b.distance
        if (a.distance !== undefined) return -1
        if (b.distance !== undefined) return 1
        return 0
      })
    } else {
      result.sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1
        if (!a.isFeatured && b.isFeatured) return 1
        return (a.dealerName || '').localeCompare(b.dealerName || '')
      })
    }

    return result
  }, [dealers, searchResults, searchLocation, dealerTypeFilter, selectedDealerTypes])

  const handleLocationSearch = useCallback((location: { lat: number; lng: number }, _address: string) => {
    setSearchLocation(location)
  }, [])

  const handleDealerSearch = useCallback((results: Dealer[], location?: { lat: number; lng: number }) => {
    setSearchResults(results as DealerWithDistance[])
    if (location) setSearchLocation(location)
    setSelectedDealer(null)
  }, [])

  const handleDealerSelect = useCallback((dealerId: string | null) => {
    setSelectedDealer(dealerId)
    if (dealerId && viewMode === 'list') {
      setDealerSheetOpen(true)
    }
  }, [viewMode])

  const handleFilterChange = useCallback((dealerTypes: string[], radius: number) => {
    setSelectedDealerTypes(dealerTypes)
    setSelectedRadius(radius)
  }, [])

  const activeFilterCount = selectedDealerTypes.length + (selectedRadius !== 25 ? 1 : 0)

  const selectedDealerData = useMemo(() => {
    if (!selectedDealer) return null
    return filteredDealers.find(d => d.id === selectedDealer)
  }, [selectedDealer, filteredDealers])

  return (
    <div
      className="lg:hidden flex flex-col overflow-hidden"
      style={{ height: 'calc(100dvh - var(--header-bottom, 70px))' }}
    >
      {/* SEO: H1 accessible to screen readers and crawlers */}
      <h1 className="sr-only">Find an Authorized Kawai Piano Dealer Near You</h1>

      {/* Header: Search + Filters */}
      <div className="flex-shrink-0 bg-white border-b border-kawai-neutral/60 shadow-sm" style={{ zIndex: 30 }}>

        {/* Search Bar — always visible, enters with a gentle slide */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="px-4 pt-3.5 pb-2"
        >
          <SearchBar
            dealers={dealers}
            onSearch={handleDealerSearch}
            onLocationSearch={handleLocationSearch}
            onDealerSelect={handleDealerSelect}
            variant="inline"
          />
        </motion.div>

        {/* Dealer Type Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.12 }}
          className="overflow-x-auto scrollbar-hide"
        >
          <div className="flex min-w-max border-b border-kawai-neutral">
            {[
              { value: 'all' as const, label: 'All Dealers', count: dealerCounts.all },
              { value: 'digital' as const, label: 'Digital Piano', count: dealerCounts.digital },
              { value: 'acoustic' as const, label: 'Acoustic Piano', count: dealerCounts.acoustic },
              { value: 'shigeru' as const, label: 'Shigeru Kawai', count: dealerCounts.shigeru },
            ].map((option) => {
              const isSelected = dealerTypeFilter === option.value
              return (
                <button
                  key={option.value}
                  onClick={() => setDealerTypeFilter(option.value)}
                  className={cn(
                    "relative flex items-center gap-2 px-5 py-3 text-xs uppercase tracking-[0.1em] font-medium whitespace-nowrap",
                    "font-[family-name:var(--font-brand-sans)] transition-colors duration-200",
                    "focus-visible:outline-2 focus-visible:outline-kawai-red",
                    isSelected
                      ? "text-kawai-black border-b-2 border-kawai-black -mb-px"
                      : "text-kawai-charcoal/60 border-b-2 border-transparent -mb-px hover:text-kawai-black"
                  )}
                >
                  {option.label}
                  <span className={cn(
                    "text-[10px] font-semibold tabular-nums",
                    isSelected ? "text-kawai-black/50" : "text-kawai-charcoal/30"
                  )}>
                    {option.count}
                  </span>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Count + Filters row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex items-center justify-between px-4 py-2.5 bg-kawai-pearl/30 border-t border-kawai-neutral/40"
        >
          <div className="text-sm text-kawai-charcoal/60">
            <span className="font-semibold text-kawai-charcoal">{filteredDealers.length}</span>
            {' '}{filteredDealers.length === 1 ? 'dealer' : 'dealers'}
          </div>

          <button
            onClick={() => setFiltersOpen(true)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
              "border-2 active:scale-95",
              activeFilterCount > 0
                ? "bg-kawai-red border-kawai-red text-white shadow-lg shadow-kawai-red/20"
                : "bg-white border-kawai-neutral text-kawai-charcoal"
            )}
          >
            <SlidersHorizontal className="w-4 h-4" strokeWidth={2} />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-white/20 text-xs font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </motion.div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative min-h-0" style={{ overflow: 'clip' }}>
        {/* Map View */}
        <div
          className={cn(
            "absolute inset-0 transition-transform duration-300 ease-out",
            viewMode === 'map' ? "translate-x-0" : "translate-x-full pointer-events-none"
          )}
        >
          <DealerMapLibre
            dealers={filteredDealers}
            searchCenter={searchLocation}
            searchRadius={selectedRadius}
            selectedDealer={viewMode === 'map' ? selectedDealer : null}
            onMarkerClick={handleDealerSelect}
          />
        </div>

        {/* List View */}
        <div
          className={cn(
            "absolute inset-0 overflow-y-auto bg-kawai-pearl/30 transition-transform duration-300 ease-out",
            viewMode === 'list' ? "translate-x-0" : "-translate-x-full pointer-events-none"
          )}
        >
          {filteredDealers.length > 0 ? (
            <div className="p-4 space-y-3 pb-24">
              {filteredDealers.map((dealer, i) => (
                <motion.div
                  key={dealer.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.3), ease: [0.16, 1, 0.3, 1] }}
                >
                  <MobileDealerCard
                    dealer={dealer}
                    isSelected={selectedDealer === dealer.id}
                    onSelect={() => handleDealerSelect(dealer.id as string)}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full p-8">
              <div className="text-center max-w-sm">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-kawai-neutral/40 flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-kawai-charcoal/30" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-kawai-charcoal mb-2">
                  No dealers found
                </h3>
                <p className="text-kawai-charcoal/60 text-sm mb-6">
                  Try adjusting your filters or searching a different area.
                </p>
                <button
                  onClick={() => {
                    setDealerTypeFilter('all')
                    setSelectedDealerTypes([])
                    setSelectedRadius(25)
                    setSearchResults([])
                    setSearchLocation(null)
                  }}
                  className="px-6 py-3 rounded-full bg-kawai-charcoal text-white text-sm font-medium active:scale-95 transition-transform"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40 pb-safe">
        <div className="mx-4 mb-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-kawai-neutral/60 overflow-hidden backdrop-blur-xl">
            <div className="flex">
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-4 font-semibold text-sm transition-all duration-200",
                  viewMode === 'list'
                    ? "bg-kawai-charcoal text-white"
                    : "bg-white text-kawai-charcoal/60 active:bg-kawai-pearl/30"
                )}
              >
                <List className="w-5 h-5" strokeWidth={2.5} />
                <span>List ({filteredDealers.length})</span>
              </button>

              <div className="w-px bg-kawai-neutral" />

              <button
                onClick={() => setViewMode('map')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-4 font-semibold text-sm transition-all duration-200",
                  viewMode === 'map'
                    ? "bg-kawai-charcoal text-white"
                    : "bg-white text-kawai-charcoal/60 active:bg-kawai-pearl/30"
                )}
              >
                <Map className="w-5 h-5" strokeWidth={2.5} />
                <span>Map</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      <FilterPanel
        isOpen={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        selectedDealerTypes={selectedDealerTypes}
        selectedRadius={selectedRadius}
        onFilterChange={handleFilterChange}
      />

      {/* Selected Dealer Bottom Sheet */}
      {dealerSheetOpen && selectedDealerData && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-50 animate-in fade-in duration-200"
            onClick={() => setDealerSheetOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-[60] bg-white rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-kawai-neutral px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-kawai-charcoal">
                {selectedDealerData.dealerName}
              </h3>
              <button
                onClick={() => setDealerSheetOpen(false)}
                className="p-2 hover:bg-kawai-pearl rounded-full transition-colors active:scale-95"
              >
                <X className="w-5 h-5 text-kawai-charcoal/50" strokeWidth={2} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {selectedDealerData.address && (
                <div>
                  <h4 className="text-xs font-semibold text-kawai-charcoal/40 uppercase tracking-wide mb-2">
                    Address
                  </h4>
                  <address className="text-sm text-kawai-charcoal/75 not-italic leading-relaxed">
                    {selectedDealerData.address.street}<br />
                    {selectedDealerData.address.city}, {selectedDealerData.address.state} {selectedDealerData.address.zipCode}
                  </address>
                </div>
              )}

              <div>
                <h4 className="text-xs font-semibold text-kawai-charcoal/40 uppercase tracking-wide mb-3">
                  Contact
                </h4>
                <div className="space-y-3">
                  {selectedDealerData.contactInfo?.phone && (
                    <a
                      href={`tel:${selectedDealerData.contactInfo.phone}`}
                      className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-kawai-red text-white rounded-xl font-medium text-sm active:scale-95 transition-transform"
                    >
                      <span>Call {selectedDealerData.contactInfo.phone}</span>
                    </a>
                  )}
                  {selectedDealerData.address && (
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                        `${selectedDealerData.address.street}, ${selectedDealerData.address.city}, ${selectedDealerData.address.state} ${selectedDealerData.address.zipCode}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-kawai-charcoal text-white rounded-xl font-medium text-sm active:scale-95 transition-transform"
                    >
                      <span>Get Directions</span>
                    </a>
                  )}
                  <Link
                    href={`/find-a-dealer/${selectedDealerData.slug}`}
                    className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-white border border-kawai-neutral text-kawai-charcoal rounded-xl font-medium text-sm active:scale-95 transition-transform hover:bg-kawai-pearl"
                  >
                    <span>View Dealer Details</span>
                    <ArrowRight className="w-4 h-4" strokeWidth={2} />
                  </Link>
                </div>
              </div>

              {selectedDealerData.description && (
                <div>
                  <h4 className="text-xs font-semibold text-kawai-charcoal/40 uppercase tracking-wide mb-2">
                    About
                  </h4>
                  <p className="text-sm text-kawai-charcoal/75 leading-relaxed">
                    {selectedDealerData.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// Mobile-Optimized Dealer Card
interface MobileDealerCardProps {
  dealer: DealerWithDistance
  isSelected: boolean
  onSelect: () => void
}

function MobileDealerCard({ dealer, isSelected, onSelect }: MobileDealerCardProps) {
  const hasShigeru = dealer.shigeruKawaiDealer === true
  const hasAcoustic = dealer.acousticPianoDealer === true
  const hasDigital = dealer.digitalPianoDealer === true
  const hasProfessional = dealer.professionalProductDealer === true

  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full bg-white rounded-2xl p-5 text-left transition-all duration-200 active:scale-[0.98]",
        "border-2",
        isSelected
          ? "border-kawai-charcoal shadow-xl shadow-kawai-charcoal/10"
          : "border-kawai-neutral shadow-md active:border-kawai-charcoal/30"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-kawai-charcoal leading-tight mb-1">
            <Link
              href={`/find-a-dealer/${dealer.slug}`}
              onClick={(e) => e.stopPropagation()}
              className="hover:text-kawai-red transition-colors"
            >
              {dealer.dealerName}
            </Link>
          </h3>
          {dealer.address && (
            <div className="flex items-center gap-1.5 text-xs text-kawai-charcoal/60">
              <MapPin className="w-3.5 h-3.5 text-kawai-charcoal/35 flex-shrink-0" strokeWidth={2} />
              <span>{dealer.address.city}, {dealer.address.state}</span>
            </div>
          )}
        </div>

        {dealer.isFeatured && (
          <div className="flex-shrink-0 px-2 py-1 bg-kawai-gold/10 text-kawai-gold text-xs font-semibold rounded-md border border-kawai-gold/20">
            Featured
          </div>
        )}
      </div>

      {/* Dealer Type Badges */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {hasShigeru && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-kawai-gold/10 text-xs font-medium rounded-full border border-kawai-gold/25" style={{ color: '#A07800' }}>
            <Star className="w-3 h-3 flex-shrink-0" strokeWidth={2} />
            <span>Shigeru Kawai</span>
          </div>
        )}
        {hasAcoustic && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-kawai-charcoal/5 text-kawai-charcoal/60 text-xs font-medium rounded-full border border-kawai-charcoal/10">
            <Piano className="w-3 h-3 flex-shrink-0" strokeWidth={2} />
            <span>Acoustic</span>
          </div>
        )}
        {hasDigital && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-kawai-charcoal/5 text-kawai-charcoal/60 text-xs font-medium rounded-full border border-kawai-charcoal/10">
            <Briefcase className="w-3 h-3 flex-shrink-0" strokeWidth={2} />
            <span>Digital</span>
          </div>
        )}
      </div>

      {/* Distance Badge */}
      {dealer.distance !== undefined && (
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-kawai-red/5 text-kawai-red text-xs font-semibold rounded-lg border border-kawai-red/10">
          <div className="w-1 h-1 rounded-full bg-kawai-red" />
          {dealer.distance.toFixed(1)} miles away
        </div>
      )}
    </button>
  )
}
