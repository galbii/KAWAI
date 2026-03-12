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

  const dealerCounts = useMemo(() => {
    const counts = { all: dealers.length, shigeru: 0, acoustic: 0, professional: 0 }
    dealers.forEach(dealer => {
      if (dealer.shigeruKawaiDealer) counts.shigeru++
      if (dealer.acousticPianoDealer) counts.acoustic++
      if (dealer.professionalProductDealer) counts.professional++
    })
    return counts
  }, [dealers])

  const filteredDealers: DealerWithDistance[] = useMemo(() => {
    let result = searchResults.length > 0
      ? searchResults.map(dealer => ({ ...dealer }))
      : dealers.map(dealer => ({ ...dealer }))

    if (dealerTypeFilter === 'shigeru') {
      result = result.filter(dealer => dealer.shigeruKawaiDealer === true)
    } else if (dealerTypeFilter === 'acoustic') {
      result = result.filter(dealer => dealer.acousticPianoDealer === true)
    } else if (dealerTypeFilter === 'professional') {
      result = result.filter(dealer => dealer.professionalProductDealer === true)
    }

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
  }, [dealers, searchResults, dealerTypeFilter, selectedDealerTypes, searchLocation])

  const handleLocationSearch = useCallback((location: { lat: number; lng: number }, _address: string) => {
    setSearchLocation(location)
  }, [])

  const handleDealerSelect = useCallback((dealerId: string | null) => {
    setSelectedDealer(dealerId)
  }, [])

  const handleSearch = useCallback((results: Dealer[], location?: { lat: number; lng: number }) => {
    setSearchResults(results as DealerWithDistance[])
    if (location) setSearchLocation(location)
    if (results.length > 0) {
      const firstResult = results[0]
      if (firstResult && firstResult.id) handleDealerSelect(firstResult.id as string)
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
      {/* Mobile View */}
      <DealerFinderMobile dealers={dealers} />

      {/* Desktop View */}
      <div className="hidden lg:block bg-white">

        {/* ── Compact Branded Hero (scrolls away) ── */}
        <div className="relative bg-kawai-black overflow-hidden">
          {/* Subtle diagonal grid texture */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `repeating-linear-gradient(
                -45deg,
                transparent,
                transparent 14px,
                rgba(255,255,255,1) 14px,
                rgba(255,255,255,1) 15px
              )`,
            }}
          />
          {/* Red accent line at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-kawai-red/60" />

          <div className="relative max-w-7xl mx-auto px-8 py-9">
            <div className="flex items-end justify-between gap-8">
              <div>
                <p className="text-kawai-red text-[10px] font-bold uppercase tracking-[0.18em] mb-3">
                  Kawai Piano — Authorized Dealers
                </p>
                <h1 className="text-[2rem] font-[family-name:var(--font-brand-luxury)] text-white leading-tight tracking-tight">
                  Find an Authorized Dealer
                </h1>
                <p className="text-white/45 text-sm mt-2 font-[family-name:var(--font-brand-sans)] max-w-lg">
                  Expert consultations, showroom visits & exceptional service across North America
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-[2.5rem] font-bold text-white leading-none tabular-nums">
                  {dealers.length}
                </div>
                <div className="text-white/35 text-[10px] uppercase tracking-[0.15em] mt-1">
                  Authorized Dealers
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Sticky Filter Bar ── */}
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
            <div className="flex items-center h-[52px] gap-0">
              {/* Dealer type tabs */}
              <DealerTypeFilter
                selected={dealerTypeFilter}
                onChange={setDealerTypeFilter}
                counts={dealerCounts}
              />

              <div className="flex-1" />

              {/* Search input */}
              <div className="w-80 mr-4">
                <SearchBar
                  dealers={dealers}
                  onSearch={handleSearch}
                  onLocationSearch={handleLocationSearch}
                  variant="inline"
                />
              </div>

              {/* Results count */}
              <span className="text-xs text-kawai-charcoal/35 font-[family-name:var(--font-brand-sans)] whitespace-nowrap mr-4">
                {filteredDealers.length} {filteredDealers.length === 1 ? 'dealer' : 'dealers'}
              </span>

              {/* Filters button */}
              <button
                onClick={() => setFiltersOpen(true)}
                className={cn(
                  'flex items-center gap-2 h-[52px] px-4 text-xs uppercase tracking-[0.08em] font-semibold',
                  'font-[family-name:var(--font-brand-sans)] transition-colors -mb-px border-b-2',
                  'focus-visible:outline-2 focus-visible:outline-kawai-red',
                  activeFilterCount > 0
                    ? 'text-kawai-red border-kawai-red'
                    : 'text-kawai-charcoal/50 border-transparent hover:text-kawai-black hover:border-kawai-neutral'
                )}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" strokeWidth={2} />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="text-[10px] font-bold tabular-nums">{activeFilterCount}</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── Main Content: Map + List ── */}
        <div
          className="flex"
          style={{ height: 'calc(100vh - var(--header-bottom, 70px) - 106px)', minHeight: '560px' }}
        >
          {/* Dealer List Panel */}
          <div className="border-r border-kawai-neutral overflow-hidden bg-kawai-pearl/20 h-full w-[340px] flex-shrink-0 flex flex-col">
            {filteredDealers.length > 0 ? (
              <DealerList
                dealers={filteredDealers}
                selectedDealer={selectedDealer}
                onDealerSelect={handleDealerSelect}
              />
            ) : (
              <div className="flex items-center justify-center h-full p-8">
                <div className="text-center max-w-xs">
                  <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-kawai-neutral/40 flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-kawai-charcoal/25" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-sm font-semibold text-kawai-charcoal mb-2">
                    No dealers found
                  </h3>
                  <p className="text-kawai-charcoal/55 leading-relaxed mb-5 text-xs">
                    Try adjusting your filters or searching a different area.
                  </p>
                  <button
                    onClick={() => {
                      setDealerTypeFilter('all')
                      setSelectedDealerTypes([])
                      setSelectedRadius(25)
                      setSearchResults([])
                    }}
                    className="px-5 py-2 rounded-lg bg-kawai-charcoal text-white text-xs font-semibold hover:bg-kawai-black transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Map Panel */}
          <div className="relative bg-kawai-neutral/20 flex-1">
            <DealerMapLibre
              dealers={filteredDealers}
              searchCenter={searchLocation}
              searchRadius={selectedRadius}
              selectedDealer={selectedDealer}
              onMarkerClick={handleDealerSelect}
            />
          </div>
        </div>

        {/* Filter Panel Drawer */}
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
