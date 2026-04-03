'use client'

import { useState, useCallback, useMemo } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
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
  const [heroVisible, setHeroVisible] = useState(true)

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
    // Don't auto-select: selecting a dealer opens the map popup which steals focus
    // from the search input. Let the user pick explicitly from the list or map.
    setSelectedDealer(null)
    setHeroVisible(false)
  }, [])

  const hideHero = useCallback(() => setHeroVisible(false), [])

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
        className="hidden lg:flex"
        style={{ height: 'calc(100vh - var(--header-bottom, 70px))', minHeight: '560px' }}
      >

        {/* Dealer List Panel — full height */}
        <div className="border-r border-kawai-neutral overflow-hidden bg-kawai-pearl/20 h-full w-[400px] flex-shrink-0 flex flex-col">

          {/* Title header */}
          <div className="flex-shrink-0 bg-kawai-pearl px-8 pt-7 pb-6 border-b border-kawai-neutral">
            <p className="text-kawai-red text-[9px] font-bold uppercase tracking-[0.32em] mb-4 font-[family-name:var(--font-brand-sans)]">
              Kawai America Corporation
            </p>
            <h1
              className="font-[family-name:var(--font-brand-luxury)] text-kawai-black leading-[0.9] tracking-[-0.02em]"
              style={{ fontSize: 'clamp(28px, 2.8vw, 40px)' }}
            >
              Our Authorized<br />Dealers
            </h1>
          </div>

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

          {/* Right: Filter Bar + Map */}
          <div className="flex-1 flex flex-col overflow-hidden min-w-0">

            {/* Filter Bar */}
            <div className="bg-white border-b border-kawai-neutral shadow-sm flex-shrink-0">
              <div className="border-b border-kawai-neutral/40">
                <div className="px-6">
                  <ProductCategoryDisplay dealerTypeFilter={dealerTypeFilter} />
                </div>
              </div>
              <div className="px-6">
                <div className="flex items-center h-[52px] gap-0">
                  <DealerTypeFilter
                    selected={dealerTypeFilter}
                    onChange={setDealerTypeFilter}
                    counts={dealerCounts}
                  />
                  <div className="flex-1" />
                  <div className="w-72 mr-4">
                    <SearchBar
                      dealers={dealers}
                      onSearch={handleSearch}
                      onLocationSearch={handleLocationSearch}
                      onDealerSelect={handleDealerSelect}
                      variant="inline"
                    />
                  </div>
                  <span className="text-xs text-kawai-charcoal/35 font-[family-name:var(--font-brand-sans)] whitespace-nowrap mr-4">
                    {filteredDealers.length} {filteredDealers.length === 1 ? 'dealer' : 'dealers'}
                  </span>
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

            {/* Map */}
            <div className="relative bg-kawai-neutral/20 flex-1 min-h-0">
              <DealerMapLibre
                dealers={filteredDealers}
                searchCenter={searchLocation}
                searchRadius={selectedRadius}
                selectedDealer={selectedDealer}
                onMarkerClick={handleDealerSelect}
                onInteract={hideHero}
              />
            </div>

          {/* ── Bottom: Piano image + stats cap ── */}
          <motion.div
            animate={{ height: heroVisible ? 160 : 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="relative flex-shrink-0 overflow-hidden"
          >

            {/* Red top rule */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-kawai-red z-20" />

            {/* Piano image */}
            <Image
              src="/videos/Find a Dealer Banner 3.png"
              alt=""
              fill
              className="object-cover object-center"
              priority
            />

            {/* Dark overlay */}
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(90deg, rgba(30,27,22,0.88) 0%, rgba(30,27,22,0.65) 50%, rgba(30,27,22,0.35) 100%)' }}
            />

            {/* Stats */}
            <div className="relative h-full flex items-center px-9 gap-0">
              <div className="flex-1">
                <div className="text-white text-[2rem] font-bold tabular-nums leading-none font-[family-name:var(--font-brand-sans)]">
                  {dealers.length}
                </div>
                <div className="text-white/45 text-[8px] uppercase tracking-[0.24em] mt-1.5 font-[family-name:var(--font-brand-sans)]">
                  Total Dealers
                </div>
              </div>
              <div className="w-px self-stretch my-6 bg-white/15" />
              <div className="flex-1 pl-8">
                <div className="text-white text-[2rem] font-bold tabular-nums leading-none font-[family-name:var(--font-brand-sans)]">
                  {dealerCounts.shigeru}
                </div>
                <div className="text-white/45 text-[8px] uppercase tracking-[0.24em] mt-1.5 font-[family-name:var(--font-brand-sans)]">
                  Shigeru Kawai
                </div>
              </div>
              <div className="w-px self-stretch my-6 bg-white/15" />
              <div className="flex-1 pl-8">
                <div className="text-white text-[2rem] font-bold tabular-nums leading-none font-[family-name:var(--font-brand-sans)]">
                  {dealerCounts.acoustic}
                </div>
                <div className="text-white/45 text-[8px] uppercase tracking-[0.24em] mt-1.5 font-[family-name:var(--font-brand-sans)]">
                  Acoustic Piano
                </div>
              </div>
            </div>

          </motion.div>
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
