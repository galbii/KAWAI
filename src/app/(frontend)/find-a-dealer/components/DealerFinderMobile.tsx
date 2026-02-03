'use client'

import { useState, useCallback, useMemo } from 'react'
import type { Dealer } from '@/payload-types'
import { DealerMapLibre } from './DealerMapLibre'
import { SearchBar } from './SearchBar'
import { FilterPanel } from './FilterPanel'
import { cn } from '@/lib/utils'
import { MapPin, SlidersHorizontal, Map, List, Piano, Briefcase, X } from 'lucide-react'

interface DealerWithDistance extends Dealer {
  distance?: number
}

interface Props {
  dealers: Dealer[]
}

type DealerTypeFilter = 'all' | 'professional-products' | 'acoustic-digital'
type ViewMode = 'map' | 'list'

export function DealerFinderMobile({ dealers }: Props) {
  const [searchLocation, setSearchLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [searchAddress, setSearchAddress] = useState<string>('')
  const [selectedRadius, setSelectedRadius] = useState(25)
  const [selectedDealerTypes, setSelectedDealerTypes] = useState<string[]>([])
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [selectedDealer, setSelectedDealer] = useState<string | null>(null)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('map')
  const [dealerTypeFilter, setDealerTypeFilter] = useState<DealerTypeFilter>('all')
  const [dealerSheetOpen, setDealerSheetOpen] = useState(false)

  // Calculate dealer type counts
  const dealerCounts = useMemo(() => {
    const counts = {
      all: dealers.length,
      'professional-products': 0,
      'acoustic-digital': 0,
    }

    dealers.forEach(dealer => {
      if (dealer.dealerType?.includes('professional-products')) {
        counts['professional-products']++
      }
      if (dealer.dealerType?.includes('acoustic-digital')) {
        counts['acoustic-digital']++
      }
    })

    return counts
  }, [dealers])

  // Filter and sort dealers
  const filteredDealers: DealerWithDistance[] = useMemo(() => {
    let result = dealers.map(dealer => ({ ...dealer }))

    // Filter by dealer type
    if (dealerTypeFilter !== 'all') {
      result = result.filter(dealer =>
        dealer.dealerType?.includes(dealerTypeFilter)
      )
    }

    // Apply advanced filters
    if (selectedDealerTypes.length > 0) {
      result = result.filter(dealer =>
        selectedDealerTypes.some(type =>
          dealer.dealerType?.includes(type as 'professional-products' | 'acoustic-digital')
        )
      )
    }

    // Sort featured first, then alphabetically
    result.sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1
      if (!a.isFeatured && b.isFeatured) return 1
      return (a.dealerName || '').localeCompare(b.dealerName || '')
    })

    // Filter by services
    if (selectedServices.length > 0) {
      result = result.filter(dealer =>
        dealer.tags?.some(tag => selectedServices.includes(tag as string))
      )
    }

    return result
  }, [dealers, dealerTypeFilter, selectedDealerTypes, selectedServices])

  const handleLocationSearch = useCallback((location: { lat: number; lng: number }, address: string) => {
    setSearchLocation(location)
    setSearchAddress(address)
  }, [])

  const handleDealerSelect = useCallback((dealerId: string | null) => {
    setSelectedDealer(dealerId)
    if (dealerId && viewMode === 'list') {
      setDealerSheetOpen(true)
    }
  }, [viewMode])

  const handleFilterChange = useCallback((dealerTypes: string[], services: string[], radius: number) => {
    setSelectedDealerTypes(dealerTypes)
    setSelectedServices(services)
    setSelectedRadius(radius)
  }, [])

  const activeFilterCount = selectedDealerTypes.length + selectedServices.length + (selectedRadius !== 25 ? 1 : 0)

  const selectedDealerData = useMemo(() => {
    if (!selectedDealer) return null
    return filteredDealers.find(d => d.id === selectedDealer)
  }, [selectedDealer, filteredDealers])

  return (
    <div className="lg:hidden relative h-screen flex flex-col bg-gray-50 overflow-hidden" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
      {/* Fixed Header - Compact and Elegant */}
      <div className="relative z-30 bg-white border-b border-gray-200/80 shadow-sm">
        {/* Search Section */}
        <div className="px-4 pt-4 pb-3">
          <SearchBar onLocationSearch={handleLocationSearch} />
        </div>

        {/* Dealer Type Pills - Horizontal Scroll */}
        <div className="px-4 pb-3 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 min-w-max">
            {[
              { value: 'all' as const, label: 'All', icon: null, count: dealerCounts.all },
              { value: 'acoustic-digital' as const, label: 'Acoustic & Digital', icon: Piano, count: dealerCounts['acoustic-digital'] },
              { value: 'professional-products' as const, label: 'Professional', icon: Briefcase, count: dealerCounts['professional-products'] },
            ].map((option) => {
              const isSelected = dealerTypeFilter === option.value
              const Icon = option.icon

              return (
                <button
                  key={option.value}
                  onClick={() => setDealerTypeFilter(option.value)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap",
                    "border-2 active:scale-95",
                    isSelected
                      ? "bg-kawai-charcoal border-kawai-charcoal text-white shadow-lg shadow-kawai-charcoal/20"
                      : "bg-white border-gray-200 text-gray-700 active:bg-gray-50"
                  )}
                >
                  {Icon && <Icon className="w-4 h-4" strokeWidth={2} />}
                  <span>{option.label}</span>
                  <span className={cn(
                    "px-1.5 py-0.5 rounded-full text-xs font-semibold",
                    isSelected ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                  )}>
                    {option.count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Filters Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50/50 border-t border-gray-200/50">
          <div className="text-sm text-gray-600">
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
                : "bg-white border-gray-200 text-gray-700"
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
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative overflow-hidden">
        {/* Map View */}
        <div
          className={cn(
            "absolute inset-0 transition-transform duration-300 ease-out",
            viewMode === 'map' ? "translate-x-0" : "translate-x-full"
          )}
        >
          <DealerMapLibre
            dealers={filteredDealers}
            searchCenter={searchLocation}
            searchRadius={selectedRadius}
            selectedDealer={selectedDealer}
            onMarkerClick={handleDealerSelect}
          />
        </div>

        {/* List View */}
        <div
          className={cn(
            "absolute inset-0 overflow-y-auto bg-gray-50 transition-transform duration-300 ease-out",
            viewMode === 'list' ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {filteredDealers.length > 0 ? (
            <div className="p-4 space-y-3 pb-24">
              {filteredDealers.map(dealer => (
                <MobileDealerCard
                  key={dealer.id}
                  dealer={dealer}
                  isSelected={selectedDealer === dealer.id}
                  onSelect={() => handleDealerSelect(dealer.id as string)}
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full p-8">
              <div className="text-center max-w-sm">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-gray-400" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-kawai-charcoal mb-2">
                  No dealers found
                </h3>
                <p className="text-gray-600 text-sm mb-6">
                  Try adjusting your filters or search in a different area.
                </p>
                <button
                  onClick={() => {
                    setDealerTypeFilter('all')
                    setSelectedDealerTypes([])
                    setSelectedServices([])
                    setSelectedRadius(25)
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

      {/* Floating Bottom Navigation - Premium Touch Target */}
      <div className="fixed bottom-0 left-0 right-0 z-40 pb-safe">
        <div className="mx-4 mb-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200/80 overflow-hidden backdrop-blur-xl">
            <div className="flex">
              <button
                onClick={() => setViewMode('map')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-4 font-semibold text-sm transition-all duration-200",
                  viewMode === 'map'
                    ? "bg-kawai-charcoal text-white"
                    : "bg-white text-gray-600 active:bg-gray-50"
                )}
              >
                <Map className="w-5 h-5" strokeWidth={2.5} />
                <span>Map</span>
              </button>

              <div className="w-px bg-gray-200" />

              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-4 font-semibold text-sm transition-all duration-200",
                  viewMode === 'list'
                    ? "bg-kawai-charcoal text-white"
                    : "bg-white text-gray-600 active:bg-gray-50"
                )}
              >
                <List className="w-5 h-5" strokeWidth={2.5} />
                <span>List ({filteredDealers.length})</span>
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
        selectedServices={selectedServices}
        selectedRadius={selectedRadius}
        onFilterChange={handleFilterChange}
        dealers={dealers}
      />

      {/* Selected Dealer Bottom Sheet */}
      {dealerSheetOpen && selectedDealerData && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-50 animate-in fade-in duration-200"
            onClick={() => setDealerSheetOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-[60] bg-white rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-kawai-charcoal">
                {selectedDealerData.dealerName}
              </h3>
              <button
                onClick={() => setDealerSheetOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
              >
                <X className="w-5 h-5 text-gray-500" strokeWidth={2} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Address */}
              {selectedDealerData.address && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Address
                  </h4>
                  <address className="text-sm text-gray-700 not-italic leading-relaxed">
                    {selectedDealerData.address.street}<br />
                    {selectedDealerData.address.city}, {selectedDealerData.address.state} {selectedDealerData.address.zipCode}
                  </address>
                </div>
              )}

              {/* Contact */}
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
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
                </div>
              </div>

              {/* Description */}
              {selectedDealerData.description && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    About
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
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
  const hasProfessionalProducts = dealer.dealerType?.includes('professional-products')
  const hasAcousticDigital = dealer.dealerType?.includes('acoustic-digital')

  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full bg-white rounded-2xl p-5 text-left transition-all duration-200 active:scale-[0.98]",
        "border-2",
        isSelected
          ? "border-kawai-charcoal shadow-xl shadow-kawai-charcoal/10"
          : "border-gray-200 shadow-md active:border-gray-300"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-kawai-charcoal leading-tight mb-1">
            {dealer.dealerName}
          </h3>
          {dealer.address && (
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" strokeWidth={2} />
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
      <div className="flex flex-wrap gap-2 mb-3">
        {hasAcousticDigital && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg">
            <Piano className="w-3 h-3" strokeWidth={2} />
            <span>Acoustic & Digital</span>
          </div>
        )}
        {hasProfessionalProducts && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg">
            <Briefcase className="w-3 h-3" strokeWidth={2} />
            <span>Professional</span>
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
