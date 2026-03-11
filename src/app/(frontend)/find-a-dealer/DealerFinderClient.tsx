'use client'

import { useState, useCallback, useMemo } from 'react'
import type { Dealer } from '@/payload-types'
import type { DealerWithDistance } from './types'
import { DealerMapLibre } from './components/DealerMapLibre'
import { DealerList } from './components/DealerList'
import { SearchBar } from './components/SearchBar'
import { FilterPanel } from './components/FilterPanel'
import { DealerTypeFilter } from './components/DealerTypeFilter'
import type { DealerType } from './components/DealerTypeFilter'
import { VideoHero } from './components/VideoHero'
import { DealerFinderMobile } from './components/DealerFinderMobile'
import { ProductCategoryDisplay } from './components/ProductCategoryDisplay'
import { cn } from '@/lib/utils'
import { calculateDistance } from '@/lib/utils/dealer-search'
import { MapPin, SlidersHorizontal } from 'lucide-react'
import './components/animations.css'

interface Props {
  dealers: DealerWithDistance[]
}

export function DealerFinderClient({ dealers }: Props) {
  const [searchLocation, setSearchLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [selectedRadius, setSelectedRadius] = useState(25)
  const [selectedDealerTypes, setSelectedDealerTypes] = useState<string[]>([])
  const [selectedDealer, setSelectedDealer] = useState<string | null>(null)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [dealerTypeFilter, setDealerTypeFilter] = useState<DealerType>('all')
  const [searchResults, setSearchResults] = useState<DealerWithDistance[]>([])

  // Calculate dealer type counts
  const dealerCounts = useMemo(() => {
    const counts = { all: dealers.length, shigeru: 0, acoustic: 0, professional: 0 }
    dealers.forEach(dealer => {
      if (dealer.shigeruKawaiDealer) counts.shigeru++
      if (dealer.acousticPianoDealer) counts.acoustic++
      if (dealer.professionalProductDealer) counts.professional++
    })
    return counts
  }, [dealers])

  // Filter and sort dealers
  const filteredDealers: DealerWithDistance[] = useMemo(() => {
    // Start with search results if available, otherwise all dealers
    let result = searchResults.length > 0
      ? searchResults.map(dealer => ({ ...dealer }))
      : dealers.map(dealer => ({ ...dealer }))

    // Filter by dealer type pill
    if (dealerTypeFilter === 'shigeru') {
      result = result.filter(dealer => dealer.shigeruKawaiDealer === true)
    } else if (dealerTypeFilter === 'acoustic') {
      result = result.filter(dealer => dealer.acousticPianoDealer === true)
    } else if (dealerTypeFilter === 'professional') {
      result = result.filter(dealer => dealer.professionalProductDealer === true)
    }

    // Apply advanced filters (from filter panel)
    if (selectedDealerTypes.length > 0) {
      result = result.filter(dealer =>
        selectedDealerTypes.some(type => {
          if (type === 'shigeru') return dealer.shigeruKawaiDealer === true
          if (type === 'acoustic') return dealer.acousticPianoDealer === true
          if (type === 'professional') return dealer.professionalProductDealer === true
          return false
        })
      )
    }

    // Calculate distances if search location is provided
    if (searchLocation) {
      result = result.map(dealer => {
        if (!dealer.coordinates?.latitude || !dealer.coordinates?.longitude) return dealer

        const distance = calculateDistance(
          searchLocation.lat,
          searchLocation.lng,
          dealer.coordinates.latitude,
          dealer.coordinates.longitude
        )

        return { ...dealer, distance } as DealerWithDistance
      }) as DealerWithDistance[]

      // Sort by distance when location search is active
      result.sort((a, b) => {
        if (a.distance !== undefined && b.distance !== undefined) {
          return a.distance - b.distance
        }
        if (a.distance !== undefined) return -1
        if (b.distance !== undefined) return 1
        return 0
      })
    } else {
      // Sort featured first, then alphabetically
      result.sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1
        if (!a.isFeatured && b.isFeatured) return 1
        return (a.dealerName || '').localeCompare(b.dealerName || '')
      })
    }

    return result
  }, [dealers, searchResults, dealerTypeFilter, selectedDealerTypes, searchLocation])

  const handleLocationSearch = useCallback((location: { lat: number; lng: number }, _address: string) => {
    setSearchLocation(location)
  }, [])

  const handleDealerSelect = useCallback((dealerId: string | null) => {
    setSelectedDealer(dealerId)
  }, [])

  const handleSearch = useCallback((results: Dealer[], location?: { lat: number; lng: number }) => {
    setSearchResults(results as DealerWithDistance[])
    if (location) {
      setSearchLocation(location)
    }

    // Auto-select first result
    if (results.length > 0) {
      const firstResult = results[0]
      if (firstResult && firstResult.id) {
        handleDealerSelect(firstResult.id as string)
      }
    } else {
      handleDealerSelect(null)
    }
  }, [handleDealerSelect])

  const handleFilterChange = useCallback((dealerTypes: string[], radius: number) => {
    setSelectedDealerTypes(dealerTypes)
    setSelectedRadius(radius)
  }, [])

  const activeFilterCount = selectedDealerTypes.length + (selectedRadius !== 25 ? 1 : 0)

  return (
    <>
      {/* Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* Mobile View - Shows below lg breakpoint */}
      <DealerFinderMobile dealers={dealers} />

      {/* Desktop View - Shows at lg breakpoint and above */}
      <div className="hidden lg:block bg-white" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
        {/* Sticky Filter Bar — sits immediately under main nav */}
        <div
          className="sticky z-40 bg-white border-b border-kawai-neutral shadow-sm"
          style={{ top: 'var(--header-bottom, 70px)' }}
        >
          {/* Scrolling product ticker */}
          <div className="border-b border-kawai-neutral/40">
            <div className="max-w-7xl mx-auto px-6">
              <ProductCategoryDisplay dealerTypeFilter={dealerTypeFilter} />
            </div>
          </div>

          {/* Tabs + Search + Filters row */}
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center h-16 gap-0">
              {/* Dealer type tabs */}
              <DealerTypeFilter
                selected={dealerTypeFilter}
                onChange={setDealerTypeFilter}
                counts={dealerCounts}
              />

              {/* Push right */}
              <div className="flex-1" />

              {/* Prominent search input */}
              <div className="w-96 mr-5">
                <SearchBar
                  dealers={dealers}
                  onSearch={handleSearch}
                  onLocationSearch={handleLocationSearch}
                  variant="inline"
                />
              </div>

              {/* Results count */}
              <span className="text-sm text-kawai-charcoal/40 font-[family-name:var(--font-brand-sans)] whitespace-nowrap mr-5">
                {filteredDealers.length} {filteredDealers.length === 1 ? 'dealer' : 'dealers'}
              </span>

              {/* Filters button */}
              <button
                onClick={() => setFiltersOpen(true)}
                className={cn(
                  "flex items-center gap-2 h-16 px-5 text-sm uppercase tracking-[0.08em] font-medium border-b-2",
                  "font-[family-name:var(--font-brand-sans)] transition-colors -mb-px",
                  "focus-visible:outline-2 focus-visible:outline-kawai-red",
                  activeFilterCount > 0
                    ? "text-kawai-red border-kawai-red"
                    : "text-kawai-charcoal/60 border-transparent hover:text-kawai-black hover:border-kawai-charcoal/30"
                )}
              >
                <SlidersHorizontal className="w-4 h-4" strokeWidth={2} />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="text-xs font-bold tabular-nums">{activeFilterCount}</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Hero Section — below the sticky filter bar */}
        <VideoHero
          youtubeVideoId="VrveoooxIno"
          title="Find an Authorized Dealer"
          description="Discover expert KAWAI dealers near you for personalized consultations, showroom visits, and exceptional service."
        />

        {/* Main Content - Map and List */}
        <div className="flex" style={{ height: 'calc(100vh - var(--header-bottom, 70px) - 122px)', minHeight: '600px' }}>
          {/* Dealer List Panel */}
          <div
            className="border-r border-gray-200 overflow-y-auto bg-gray-50 h-full w-1/3"
          >
            {filteredDealers.length > 0 ? (
              <DealerList
                dealers={filteredDealers}
                selectedDealer={selectedDealer}
                onDealerSelect={handleDealerSelect}
              />
            ) : (
                <div className="flex items-center justify-center h-full p-8">
                  <div className="text-center max-w-sm">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gray-100 flex items-center justify-center">
                      <MapPin className="w-10 h-10 text-gray-400" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-semibold text-kawai-charcoal mb-2">
                      No dealers found
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-6 text-sm">
                      Try adjusting your filters or search in a different area.
                    </p>
                    <button
                      onClick={() => {
                        setDealerTypeFilter('all')
                        setSelectedDealerTypes([])
                        setSelectedRadius(25)
                        setSearchResults([])
                      }}
                      className="px-6 py-2.5 rounded-xl bg-kawai-charcoal text-white text-sm font-medium hover:bg-kawai-charcoal/90 transition-colors shadow-md hover:shadow-lg"
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>
              )}
          </div>

          {/* Map Panel */}
          <div className="relative bg-gray-100 w-2/3">
            <DealerMapLibre
              dealers={filteredDealers}
              searchCenter={searchLocation}
              searchRadius={selectedRadius}
              selectedDealer={selectedDealer}
              onMarkerClick={handleDealerSelect}
            />
          </div>
        </div>

        {/* Advanced Filter Panel */}
        <FilterPanel
          isOpen={filtersOpen}
          onClose={() => setFiltersOpen(false)}
          selectedDealerTypes={selectedDealerTypes}
          selectedRadius={selectedRadius}
          onFilterChange={handleFilterChange}
        />

      </div>
    </>
  )
}
