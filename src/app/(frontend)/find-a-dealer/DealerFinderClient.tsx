'use client'

import { useState, useCallback, useMemo } from 'react'
import type { Dealer } from '@/payload-types'
import type { DealerWithDistance } from './types'
import { DealerMapLibre } from './components/DealerMapLibre'
import { DealerList } from './components/DealerList'
import { DealerCard } from './components/DealerCard'
import { SearchBar } from './components/SearchBar'
import { FilterPanel } from './components/FilterPanel'
import { DealerTypeFilter } from './components/DealerTypeFilter'
import type { DealerType } from './components/DealerTypeFilter'
import { DealerFinderMobile } from './components/DealerFinderMobile'
import { cn } from '@/lib/utils'
import { calculateDistance } from '@/lib/utils/dealer-search'
import { MapPin, SlidersHorizontal, List, Map } from 'lucide-react'
import './components/animations.css'

interface Props {
  dealers: DealerWithDistance[]
  heading?: string | null
}

type DesktopView = 'list' | 'map'

export function DealerFinderClient({ dealers, heading }: Props) {
  const resolvedHeading = heading ?? 'Find an Authorized Kawai Dealer Near You'
  const [searchLocation, setSearchLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [selectedRadius, setSelectedRadius] = useState(25)
  const [selectedDealerTypes, setSelectedDealerTypes] = useState<string[]>([])
  const [selectedDealer, setSelectedDealer] = useState<string | null>(null)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [dealerTypeFilter, setDealerTypeFilter] = useState<DealerType>('all')
  const [searchResults, setSearchResults] = useState<DealerWithDistance[]>([])
  const [desktopView, setDesktopView] = useState<DesktopView>('list')

  const dealerCounts = useMemo(() => {
    const counts = { all: dealers.length, shigeru: 0, acoustic: 0, digital: 0 }
    dealers.forEach(dealer => {
      if (dealer.shigeruKawaiDealer) counts.shigeru++
      if (dealer.acousticPianoDealer) counts.acoustic++
      if (dealer.digitalPianoDealer) counts.digital++
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
    setSelectedDealer(null)
  }, [])

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
      <div
        className="hidden lg:flex flex-col"
        style={{ height: 'calc(100vh - var(--header-bottom, 70px))', minHeight: '560px' }}
      >
        {/* ── Unified Control Bar ─────────────────────────────────────── */}
        <div className="flex-shrink-0 bg-white border-b border-kawai-neutral shadow-sm">

          {/* Row 1: Brand + H1 + Search */}
          <div className="px-8 pt-5 pb-4 flex items-end gap-8 border-b border-kawai-neutral/30">
            <div className="flex-shrink-0">
              <p className="text-kawai-red text-[9px] font-bold uppercase tracking-[0.32em] mb-2 font-[family-name:var(--font-brand-sans)]">
                Kawai America Corporation
              </p>
              <h1
                className="font-[family-name:var(--font-brand-luxury)] text-kawai-black leading-[0.9] tracking-[-0.02em]"
                style={{ fontSize: 'clamp(22px, 1.8vw, 30px)' }}
              >
                {resolvedHeading}
              </h1>
            </div>

            <div className="flex-1 max-w-lg pb-0.5">
              <SearchBar
                dealers={dealers}
                onSearch={handleSearch}
                onLocationSearch={handleLocationSearch}
                onDealerSelect={handleDealerSelect}
                variant="inline"
              />
            </div>
          </div>

          {/* Row 2: Type tabs + count + filters + view toggle */}
          <div className="px-8 flex items-center h-[48px] gap-0">
            <DealerTypeFilter
              selected={dealerTypeFilter}
              onChange={setDealerTypeFilter}
              counts={dealerCounts}
            />

            <div className="flex-1" />

            <span className="text-xs text-kawai-charcoal/35 font-[family-name:var(--font-brand-sans)] whitespace-nowrap mr-4 tabular-nums">
              {filteredDealers.length} {filteredDealers.length === 1 ? 'dealer' : 'dealers'}
            </span>

            {/* Filters button */}
            <button
              onClick={() => setFiltersOpen(true)}
              className={cn(
                'flex items-center gap-2 h-[48px] px-4 text-xs uppercase tracking-[0.08em] font-semibold mr-3',
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

            {/* Divider */}
            <div className="w-px h-5 bg-kawai-neutral/60 mr-3" />

            {/* List / Map toggle pill */}
            <div className="flex items-center rounded-lg border border-kawai-neutral bg-kawai-pearl/50 p-0.5 gap-0.5">
              <button
                onClick={() => setDesktopView('list')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-150',
                  desktopView === 'list'
                    ? 'bg-kawai-charcoal text-white shadow-sm'
                    : 'text-kawai-charcoal/50 hover:text-kawai-black'
                )}
              >
                <List className="w-3.5 h-3.5" strokeWidth={2.5} />
                List
              </button>
              <button
                onClick={() => setDesktopView('map')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-150',
                  desktopView === 'map'
                    ? 'bg-kawai-charcoal text-white shadow-sm'
                    : 'text-kawai-charcoal/50 hover:text-kawai-black'
                )}
              >
                <Map className="w-3.5 h-3.5" strokeWidth={2.5} />
                Map
              </button>
            </div>
          </div>
        </div>

        {/* ── Content: List or Map ─────────────────────────────────────── */}
        {desktopView === 'list' ? (
          /* List View — responsive card grid */
          <div className="flex-1 overflow-y-auto bg-kawai-pearl/20 min-h-0">
            {filteredDealers.length > 0 ? (
              <div className="px-8 py-6">
                <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
                  {filteredDealers.map(dealer => (
                    <div
                      key={dealer.id}
                      className="rounded-xl border border-kawai-neutral overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                      <DealerCard
                        dealer={dealer}
                        isSelected={selectedDealer === dealer.id}
                        onSelect={() => handleDealerSelect(dealer.id as string)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full p-12">
                <div className="text-center max-w-sm">
                  <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-kawai-neutral/40 flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-kawai-charcoal/25" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-sm font-semibold text-kawai-charcoal mb-2">No dealers found</h3>
                  <p className="text-kawai-charcoal/55 leading-relaxed mb-5 text-xs">
                    Try adjusting your filters or searching a different location.
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
        ) : (
          /* Map View — narrow list left + full map right */
          <div className="flex-1 flex min-h-0">

            {/* Left: scrollable dealer list */}
            <div className="w-[360px] flex-shrink-0 border-r border-kawai-neutral overflow-hidden flex flex-col bg-white">
              {filteredDealers.length > 0 ? (
                <DealerList
                  dealers={filteredDealers}
                  selectedDealer={selectedDealer}
                  onDealerSelect={handleDealerSelect}
                />
              ) : (
                <div className="flex items-center justify-center h-full p-8">
                  <div className="text-center max-w-xs">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-kawai-neutral/40 flex items-center justify-center">
                      <MapPin className="w-7 h-7 text-kawai-charcoal/25" strokeWidth={1.5} />
                    </div>
                    <p className="text-xs text-kawai-charcoal/55">No dealers match your filters.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right: map */}
            <div className="flex-1 min-w-0 bg-kawai-neutral/20">
              <DealerMapLibre
                dealers={filteredDealers}
                searchCenter={searchLocation}
                searchRadius={selectedRadius}
                selectedDealer={selectedDealer}
                onMarkerClick={handleDealerSelect}
              />
            </div>

          </div>
        )}

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
