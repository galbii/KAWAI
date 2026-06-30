'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Dealer } from '@/payload-types'
import type { DealerWithDistance } from './types'
import { DealerMapLibre } from './components/DealerMapLibre'
import { DealerList } from './components/DealerList'
import { DealerCard } from './components/DealerCard'
import { SearchBar } from './components/SearchBar'
import { DealerTypeFilter } from './components/DealerTypeFilter'
import type { DealerType } from './components/DealerTypeFilter'
import { DealerCountryFilter } from './components/DealerCountryFilter'
import type { CountryFilter } from './components/DealerCountryFilter'
import { DealerFinderMobile } from './components/DealerFinderMobile'
import { cn } from '@/lib/utils'
import { calculateDistance } from '@/lib/utils/dealer-search'
import { classifyDealerCountry } from '@/lib/utils/dealer-country'
import { MapPin, ChevronDown, X, List, Columns2 } from 'lucide-react'
import './components/animations.css'

const RADII = [10, 25, 50, 100, 200] as const

interface Props {
  dealers: DealerWithDistance[]
  heading?: string | null
  site?: 'us' | 'cad'
  /** Heading level for the section title. Use 'h1' when this is the page's primary
   *  content (e.g. /find-a-dealer); 'h2' when embedded under another h1 (e.g. homepage). */
  headingLevel?: 'h1' | 'h2'
}

export function DealerFinderClient({ dealers, heading, site = 'us', headingLevel = 'h1' }: Props) {
  const resolvedHeading = heading ?? 'Find an Authorized Kawai Dealer Near You'
  const SectionHeading = headingLevel
  const defaultCountry: CountryFilter = site === 'cad' ? 'canada' : 'us'
  const [desktopLayout, setDesktopLayout] = useState<'list' | 'split'>('split')
  const [searchLocation, setSearchLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [searchLocationLabel, setSearchLocationLabel] = useState<string>('')
  const [selectedRadius, setSelectedRadius] = useState(25)
  const [radiusMenuOpen, setRadiusMenuOpen] = useState(false)
  const [selectedDealer, setSelectedDealer] = useState<string | null>(null)
  const [dealerTypeFilter, setDealerTypeFilter] = useState<DealerType>('all')
  const [countryFilter, setCountryFilter] = useState<CountryFilter>(defaultCountry)
  const [filterKey, setFilterKey] = useState(0)
  const [searchResults, setSearchResults] = useState<DealerWithDistance[]>([])

  const dealerCounts = useMemo(() => {
    const counts = { all: dealers.length, shigeru: 0, acoustic: 0, digital: 0 }
    dealers.forEach(dealer => {
      if (dealer.shigeruKawaiDealer) counts.shigeru++
      if (dealer.acousticPianoDealer) counts.acoustic++
      if (dealer.digitalPianoDealer) counts.digital++
    })
    return counts
  }, [dealers])

  const countryCounts = useMemo(() => {
    const counts = { us: 0, canada: 0, all: dealers.length }
    dealers.forEach(dealer => {
      const region = classifyDealerCountry(dealer.address?.country)
      if (region === 'us') counts.us++
      else if (region === 'canada') counts.canada++
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

    if (countryFilter !== 'all') {
      result = result.filter(
        dealer => classifyDealerCountry(dealer.address?.country) === countryFilter,
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
  }, [dealers, searchResults, dealerTypeFilter, countryFilter, searchLocation])

  const handleLocationSearch = useCallback((location: { lat: number; lng: number }, address: string) => {
    setSearchLocation(location)
    setSearchLocationLabel(address)
  }, [])

  const handleDealerSelect = useCallback((dealerId: string | null) => {
    setSelectedDealer(dealerId)
  }, [])

  const handleSearch = useCallback((results: Dealer[], location?: { lat: number; lng: number }) => {
    setSearchResults(results as DealerWithDistance[])
    if (location) setSearchLocation(location)
    setSelectedDealer(null)
  }, [])

  const handleClearSearch = useCallback(() => {
    setSearchResults([])
    setSearchLocation(null)
    setSearchLocationLabel('')
    setSelectedDealer(null)
  }, [])

  const handleTypeFilterChange = useCallback((type: DealerType) => {
    setDealerTypeFilter(type)
    setFilterKey(k => k + 1)
  }, [])

  const handleCountryFilterChange = useCallback((value: CountryFilter) => {
    setCountryFilter(value)
    setFilterKey(k => k + 1)
  }, [])

  const currentRadiusIdx = (RADII as readonly number[]).indexOf(selectedRadius)
  const nextRadius = RADII[currentRadiusIdx + 1]

  const typeLabel =
    dealerTypeFilter === 'shigeru' ? 'Shigeru Kawai' :
    dealerTypeFilter === 'acoustic' ? 'Acoustic Piano' :
    dealerTypeFilter === 'digital' ? 'Digital Piano' : null

  return (
    <>
      {/* Single page heading rendered once, outside the responsive desktop/mobile
          split, so there is exactly one h1 in the DOM (the variants below duplicate
          their layout, not their heading). */}
      <SectionHeading className="sr-only">{resolvedHeading}</SectionHeading>

      {/* Mobile View */}
      <DealerFinderMobile dealers={dealers} site={site} />

      {/* Desktop View */}
      <div
        className="hidden lg:flex flex-col"
        style={{ height: 'calc(100vh - var(--header-bottom, 70px))', minHeight: '560px' }}
      >
        {/* ── Control Bar — slides down on mount ──────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex-shrink-0 bg-white border-b border-kawai-neutral shadow-sm"
        >

          {/* Row 1: Brand + H1 + Search + Radius */}
          <div className="px-8 pt-5 pb-4 flex items-end gap-6 border-b border-kawai-neutral/30">
            <div className="flex-shrink-0">
              <p className="text-kawai-red text-[9px] font-bold uppercase tracking-[0.32em] mb-2 font-[family-name:var(--font-brand-sans)]">
                Kawai America Corporation
              </p>
              {/* Visible title only — the accessible heading is the hoisted
                  SectionHeading above; aria-hidden avoids a duplicate announcement. */}
              <p
                aria-hidden="true"
                className="font-[family-name:var(--font-brand-luxury)] text-kawai-black leading-[0.9] tracking-[-0.02em]"
                style={{ fontSize: 'clamp(22px, 1.8vw, 30px)' }}
              >
                {resolvedHeading}
              </p>
            </div>

            {/* Search + Radius picker */}
            <div className="flex-1 flex items-end gap-2 pb-0.5">
              <div className="flex-1 max-w-lg">
                <SearchBar
                  dealers={dealers}
                  onSearch={handleSearch}
                  onLocationSearch={handleLocationSearch}
                  onDealerSelect={handleDealerSelect}
                  onClear={handleClearSearch}
                  variant="inline"
                />
              </div>

              {/* Radius picker */}
              <div className="relative flex-shrink-0">
                <button
                  onClick={() => setRadiusMenuOpen(prev => !prev)}
                  className={cn(
                    'flex items-center gap-1.5 h-10 px-3.5 rounded-lg border text-[13px] font-medium transition-all duration-200',
                    'font-[family-name:var(--font-brand-sans)] whitespace-nowrap',
                    radiusMenuOpen
                      ? 'bg-kawai-charcoal text-white border-kawai-charcoal'
                      : 'bg-kawai-pearl border-kawai-neutral hover:border-kawai-charcoal/40 hover:bg-white text-kawai-charcoal'
                  )}
                  aria-label={`Within ${selectedRadius} mi — change search radius`}
                >
                  <MapPin className="w-3.5 h-3.5 opacity-60" strokeWidth={2} />
                  <span>Within {selectedRadius} mi</span>
                  <ChevronDown
                    className={cn('w-3.5 h-3.5 opacity-60 transition-transform duration-150', radiusMenuOpen && 'rotate-180')}
                    strokeWidth={2}
                  />
                </button>

                <AnimatePresence>
                  {radiusMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setRadiusMenuOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: -4, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.97 }}
                        transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
                        className="absolute top-full mt-1.5 left-0 z-20 bg-white rounded-xl border border-kawai-neutral shadow-lg overflow-hidden min-w-[148px] py-1"
                      >
                        {RADII.map(r => (
                          <button
                            key={r}
                            onClick={() => { setSelectedRadius(r); setRadiusMenuOpen(false) }}
                            className={cn(
                              'w-full px-4 py-2.5 text-left text-[13px] transition-colors',
                              selectedRadius === r
                                ? 'font-semibold text-kawai-black bg-kawai-pearl/60'
                                : 'text-kawai-charcoal/70 hover:bg-kawai-pearl/40 hover:text-kawai-black'
                            )}
                          >
                            Within {r} miles
                          </button>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Row 2: Type tabs + dealer count + view toggle */}
          <div className="px-8 flex items-center h-[48px] gap-0">
            <DealerTypeFilter
              selected={dealerTypeFilter}
              onChange={handleTypeFilterChange}
              counts={dealerCounts}
            />
            <div className="flex-1" />
            <span className="text-xs text-kawai-muted font-[family-name:var(--font-brand-sans)] whitespace-nowrap tabular-nums mr-4">
              {filteredDealers.length} {filteredDealers.length === 1 ? 'dealer' : 'dealers'}
            </span>

            {/* Country filter */}
            <div className="mr-2">
              <DealerCountryFilter
                selected={countryFilter}
                onChange={handleCountryFilterChange}
                counts={countryCounts}
              />
            </div>

            {/* List / Map toggle */}
            <div className="flex items-center rounded-lg border border-kawai-neutral bg-kawai-pearl/50 p-0.5 gap-0.5">
              {([
                { value: 'list', icon: List, label: 'List' },
                { value: 'split', icon: Columns2, label: 'Map' },
              ] as const).map(({ value, icon: Icon, label }) => (
                <motion.button
                  key={value}
                  onClick={() => setDesktopLayout(value)}
                  title={label}
                  whileTap={{ scale: 0.93 }}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-150',
                    desktopLayout === value
                      ? 'bg-kawai-charcoal text-white shadow-sm'
                      : 'text-kawai-muted hover:text-kawai-black'
                  )}
                >
                  <Icon className="w-3.5 h-3.5" strokeWidth={2.5} />
                  {label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Context banner — slides in/out when location search is active */}
          <AnimatePresence>
            {searchLocation && searchLocationLabel && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                className="overflow-hidden"
              >
                <div className="px-8 py-2 bg-kawai-red/5 border-t border-kawai-red/10 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-kawai-red flex-shrink-0" strokeWidth={2} />
                  <span className="text-[12px] text-kawai-charcoal/70 flex-1 truncate">
                    Showing dealers within{' '}
                    <span className="font-semibold text-kawai-black">{selectedRadius} miles</span> of{' '}
                    <span className="font-semibold text-kawai-black">{searchLocationLabel}</span>
                  </span>
                  <button
                    onClick={handleClearSearch}
                    className="flex-shrink-0 flex items-center gap-1 text-[11px] font-medium text-kawai-muted hover:text-kawai-black transition-colors ml-2"
                  >
                    <X className="w-3 h-3" strokeWidth={2} />
                    Clear
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Content area — fades in after control bar ───────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex-1 flex flex-col min-h-0"
        >
          {desktopLayout === 'list' ? (
            /* List-only: full-width card grid */
            <div className="flex-1 overflow-y-auto bg-kawai-pearl/20 min-h-0">
              {filteredDealers.length > 0 ? (
                <div className="px-8 py-6">
                  <div key={filterKey} className="grid grid-cols-2 xl:grid-cols-3 gap-3 results-refresh">
                    {filteredDealers.map(dealer => (
                      <div
                        key={dealer.id}
                        className="rounded-xl border border-kawai-neutral overflow-hidden bg-white shadow-sm"
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
                  <EmptyState
                    hasLocation={!!searchLocation}
                    selectedRadius={selectedRadius}
                    typeLabel={typeLabel}
                    canExpandRadius={nextRadius !== undefined}
                    nextRadius={nextRadius}
                    onReset={() => { handleTypeFilterChange('all'); setSearchResults([]); handleClearSearch(); setCountryFilter(defaultCountry) }}
                    onExpandRadius={() => { if (nextRadius !== undefined) setSelectedRadius(nextRadius) }}
                  />
                </div>
              )}
            </div>
          ) : (
            /* Split: sidebar list + map */
            <div className="flex-1 flex min-h-0">
              <div className="w-[420px] flex-shrink-0 border-r border-kawai-neutral overflow-hidden flex flex-col bg-white">
                {filteredDealers.length > 0 ? (
                  <DealerList
                    key={filterKey}
                    dealers={filteredDealers}
                    selectedDealer={selectedDealer}
                    onDealerSelect={handleDealerSelect}
                    searchLabel={searchLocationLabel || undefined}
                  />
                ) : (
                  <EmptyState
                    hasLocation={!!searchLocation}
                    selectedRadius={selectedRadius}
                    typeLabel={typeLabel}
                    canExpandRadius={nextRadius !== undefined}
                    nextRadius={nextRadius}
                    onReset={() => { handleTypeFilterChange('all'); setSearchResults([]); handleClearSearch(); setCountryFilter(defaultCountry) }}
                    onExpandRadius={() => { if (nextRadius !== undefined) setSelectedRadius(nextRadius) }}
                  />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <DealerMapLibre
                  dealers={filteredDealers}
                  searchCenter={searchLocation}
                  searchRadius={selectedRadius}
                  selectedDealer={selectedDealer}
                  onMarkerClick={handleDealerSelect}
                  site={countryFilter === 'canada' ? 'cad' : countryFilter === 'us' ? 'us' : site}
                />
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </>
  )
}

interface EmptyStateProps {
  hasLocation: boolean
  selectedRadius: number
  typeLabel: string | null
  canExpandRadius: boolean
  nextRadius: number | undefined
  onReset: () => void
  onExpandRadius: () => void
}

function EmptyState({ hasLocation, selectedRadius, typeLabel, canExpandRadius, nextRadius, onReset, onExpandRadius }: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center h-full p-8">
      <div className="text-center max-w-xs">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-kawai-neutral/40 flex items-center justify-center empty-state-float">
          <MapPin className="w-7 h-7 text-kawai-muted" strokeWidth={1.5} />
        </div>
        <h3 className="text-sm font-semibold text-kawai-charcoal mb-2">
          {typeLabel ? `No ${typeLabel} dealers found` : 'No dealers found'}
        </h3>
        <p className="text-kawai-muted leading-relaxed mb-5 text-xs">
          {hasLocation && canExpandRadius
            ? `No results within ${selectedRadius} miles. Try expanding your search area.`
            : 'Try adjusting your filters or searching a different location.'}
        </p>
        <div className="flex flex-col gap-2">
          {hasLocation && canExpandRadius && nextRadius !== undefined && (
            <button
              onClick={onExpandRadius}
              className="px-5 py-2 rounded-lg bg-kawai-red text-white text-xs font-semibold hover:bg-kawai-red-700 transition-colors"
            >
              Expand to {nextRadius} miles
            </button>
          )}
          <button
            onClick={onReset}
            className="px-5 py-2 rounded-lg bg-kawai-charcoal text-white text-xs font-semibold hover:bg-kawai-black transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      </div>
    </div>
  )
}
