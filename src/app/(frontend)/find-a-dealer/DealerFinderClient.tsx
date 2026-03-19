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

        {/* ── Full-Bleed Editorial Hero ── */}
        <div className="relative bg-kawai-black overflow-hidden" style={{ height: '480px' }}>

          {/* Background image — subtle Ken Burns scale-in */}
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.06 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Image
              src="/videos/Find a Dealer Banner 3.png"
              alt=""
              fill
              className="object-cover object-center"
              priority
            />
          </motion.div>

          {/* Directional gradient — heavy left for text, dissolves right revealing the image */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(108deg, rgba(30,27,22,0.97) 0%, rgba(30,27,22,0.90) 32%, rgba(30,27,22,0.52) 58%, rgba(30,27,22,0.08) 100%)',
            }}
          />

          {/* Left edge red accent stripe */}
          <motion.div
            className="absolute left-0 top-0 bottom-0 w-[3px] bg-kawai-red origin-top"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          />

          {/* Bottom rule */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10" />

          {/* ── Hero Content ── */}
          <div className="relative h-full max-w-7xl mx-auto px-12 flex flex-col justify-center">

            {/* Eyebrow */}
            <motion.p
              className="text-kawai-red text-[10px] font-bold uppercase tracking-[0.24em] mb-5 font-[family-name:var(--font-brand-sans)]"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.55 }}
            >
              Kawai America Corporation
            </motion.p>

            {/* Main heading */}
            <motion.h1
              className="font-[family-name:var(--font-brand-luxury)] text-white leading-[0.93] tracking-[-0.01em] mb-6"
              style={{ fontSize: 'clamp(52px, 5.8vw, 82px)' }}
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              Our Authorized Dealers
            </motion.h1>

            {/* Animated red divider line */}
            <motion.div
              className="h-px bg-kawai-red/50 mb-6 origin-left"
              style={{ width: '260px' }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.65, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            />

            {/* Description */}
            <motion.p
              className="text-white/48 text-[13px] font-[family-name:var(--font-brand-sans)] max-w-sm leading-relaxed mb-10 tracking-[0.01em]"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.58, duration: 0.6 }}
            >
              Expert consultations, showroom experiences &amp; exceptional service at authorized locations across North America.
            </motion.p>

            {/* Stats row */}
            <motion.div
              className="flex items-center gap-9"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.6 }}
            >
              <div>
                <div className="text-[2.4rem] font-bold text-white tabular-nums leading-none font-[family-name:var(--font-brand-sans)]">
                  {dealers.length}
                </div>
                <div className="text-white/28 text-[9px] uppercase tracking-[0.22em] mt-1.5 font-[family-name:var(--font-brand-sans)]">
                  Total Dealers
                </div>
              </div>

              <div className="w-px h-9 bg-white/12" />

              <div>
                <div className="text-[2.4rem] font-bold text-white tabular-nums leading-none font-[family-name:var(--font-brand-sans)]">
                  {dealerCounts.shigeru}
                </div>
                <div className="text-white/28 text-[9px] uppercase tracking-[0.22em] mt-1.5 font-[family-name:var(--font-brand-sans)]">
                  Shigeru Kawai
                </div>
              </div>

              <div className="w-px h-9 bg-white/12" />

              <div>
                <div className="text-[2.4rem] font-bold text-white tabular-nums leading-none font-[family-name:var(--font-brand-sans)]">
                  {dealerCounts.acoustic}
                </div>
                <div className="text-white/28 text-[9px] uppercase tracking-[0.22em] mt-1.5 font-[family-name:var(--font-brand-sans)]">
                  Acoustic Piano
                </div>
              </div>
            </motion.div>

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
