'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import type { Dealer } from '@/payload-types'
import type { DealerWithDistance } from './types'
import { DealerMapLibre } from './components/DealerMapLibre'
import { DealerList } from './components/DealerList'
import { SearchBar } from './components/SearchBar'
import { FilterPanel } from './components/FilterPanel'
import { MobileViewToggle } from './components/MobileViewToggle'
import { DealerTypeFilter } from './components/DealerTypeFilter'
import { VideoHero } from './components/VideoHero'
import { DealerFinderMobile } from './components/DealerFinderMobile'
import { ProductCategoryDisplay } from './components/ProductCategoryDisplay'
import { cn } from '@/lib/utils'
import { MapPin, SlidersHorizontal, Star } from 'lucide-react'
import './components/animations.css'

interface Props {
  dealers: DealerWithDistance[]
}

type DealerTypeFilter = 'all' | 'professional-products' | 'acoustic-digital'

export function DealerFinderClient({ dealers }: Props) {
  const [searchLocation, setSearchLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [searchAddress, setSearchAddress] = useState<string>('')
  const [selectedRadius, setSelectedRadius] = useState(25)
  const [selectedDealerTypes, setSelectedDealerTypes] = useState<string[]>([])
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [selectedDealer, setSelectedDealer] = useState<string | null>(null)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [mobileView, setMobileView] = useState<'map' | 'list'>('map')
  const [isMobile, setIsMobile] = useState(false)
  const [dealerTypeFilter, setDealerTypeFilter] = useState<DealerTypeFilter>('all')
  const [showOfficialOnly, setShowOfficialOnly] = useState(false)
  const [searchResults, setSearchResults] = useState<DealerWithDistance[]>([])

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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

  // Calculate distance between two coordinates (Haversine formula)
  const toRad = (value: number): number => (value * Math.PI) / 180

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 3959 // Earth's radius in miles
    const dLat = toRad(lat2 - lat1)
    const dLng = toRad(lng2 - lng1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  // Filter and sort dealers
  const filteredDealers: DealerWithDistance[] = useMemo(() => {
    // Start with search results if available, otherwise all dealers
    let result = searchResults.length > 0
      ? searchResults.map(dealer => ({ ...dealer }))
      : dealers.map(dealer => ({ ...dealer }))

    // Filter by official stores only if enabled
    if (showOfficialOnly) {
      result = result.filter(dealer => (dealer as any).isOfficialStore === true)
    }

    // Filter by dealer type
    if (dealerTypeFilter !== 'all') {
      result = result.filter(dealer =>
        dealer.dealerType?.includes(dealerTypeFilter)
      )
    }

    // Apply advanced filters (from filter panel)
    if (selectedDealerTypes.length > 0) {
      result = result.filter(dealer =>
        selectedDealerTypes.some(type =>
          dealer.dealerType?.includes(type as 'professional-products' | 'acoustic-digital')
        )
      )
    }

    // Filter by services if any selected
    if (selectedServices.length > 0) {
      result = result.filter(dealer =>
        dealer.tags?.some(tag => selectedServices.includes(tag as string))
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
  }, [dealers, searchResults, dealerTypeFilter, selectedDealerTypes, selectedServices, showOfficialOnly, searchLocation])

  const handleLocationSearch = useCallback((location: { lat: number; lng: number }, address: string) => {
    setSearchLocation(location)
    setSearchAddress(address)
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

        // On mobile, switch to map view to show the selected dealer
        if (isMobile) {
          setMobileView('map')
        }
      }
    } else {
      handleDealerSelect(null)
    }
  }, [handleDealerSelect, isMobile])

  const handleFilterChange = useCallback((dealerTypes: string[], services: string[], radius: number) => {
    setSelectedDealerTypes(dealerTypes)
    setSelectedServices(services)
    setSelectedRadius(radius)
  }, [])

  const activeFilterCount = selectedDealerTypes.length + selectedServices.length + (selectedRadius !== 25 ? 1 : 0)

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
      <div className="hidden lg:block min-h-screen bg-white" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
        {/* Hero Section with Video Background - First */}
        <VideoHero
          youtubeVideoId="VrveoooxIno"
          title="Find an Authorized Dealer"
          description="Discover expert KAWAI dealers near you for personalized consultations, showroom visits, and exceptional service."
        />

        {/* Filters Section */}
        <div className="bg-gray-50 border-b border-gray-100">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Mobile View Toggle */}
            {isMobile && (
              <div className="flex justify-end mb-4">
                <MobileViewToggle
                  view={mobileView}
                  onViewChange={setMobileView}
                  dealerCount={filteredDealers.length}
                />
              </div>
            )}

            {/* Product Category Display */}
            <div className="mb-5">
              <ProductCategoryDisplay dealerTypeFilter={dealerTypeFilter} />
            </div>

            {/* Dealer Type Filter Pills */}
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <DealerTypeFilter
                  selected={dealerTypeFilter}
                  onChange={setDealerTypeFilter}
                  counts={dealerCounts}
                />

                {/* Official Stores Only Toggle */}
                <button
                  onClick={() => setShowOfficialOnly(!showOfficialOnly)}
                  className={cn(
                    "group relative px-5 py-3 rounded-full transition-all duration-300",
                    "border-2 font-medium text-sm",
                    "hover:scale-[1.02] active:scale-[0.98]",
                    showOfficialOnly
                      ? "bg-gradient-to-br from-yellow-400 to-amber-500 border-yellow-400 text-white shadow-lg shadow-yellow-400/30"
                      : "bg-white border-gray-200 text-gray-700 hover:border-yellow-400/50 hover:shadow-md"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Star
                      className={cn(
                        "w-4 h-4 transition-colors",
                        showOfficialOnly ? "text-white fill-white" : "text-yellow-500"
                      )}
                      strokeWidth={2}
                    />
                    <span>Official Stores Only</span>
                  </div>
                </button>
              </div>

              {/* Advanced Filters Button */}
              <button
                onClick={() => setFiltersOpen(true)}
                className={cn(
                  "flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all",
                  "border-2 hover:scale-[1.02] active:scale-[0.98]",
                  activeFilterCount > 0
                    ? "bg-kawai-red border-kawai-red text-white shadow-lg shadow-kawai-red/20"
                    : "bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:shadow-md"
                )}
              >
                <SlidersHorizontal className="w-4 h-4" strokeWidth={2} />
                <span className="hidden sm:inline">More Filters</span>
                {activeFilterCount > 0 && (
                  <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-white/20 text-xs font-semibold">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* Results Count */}
            {(dealerTypeFilter !== 'all' || activeFilterCount > 0) && (
              <div className="text-sm text-gray-600 text-center">
                <span className="font-semibold text-kawai-charcoal">
                  {filteredDealers.length}
                </span>
                {' '}{filteredDealers.length === 1 ? 'dealer' : 'dealers'} found
              </div>
            )}
          </div>
        </div>

        {/* Main Content - Map and List */}
        <div className="flex" style={{ height: 'calc(100vh - 64px)' }}>
          {/* Dealer List Panel */}
          <div
            className={cn(
              "border-r border-gray-200 overflow-y-auto bg-gray-50 h-full",
              isMobile ? (mobileView === 'list' ? 'w-full' : 'hidden') : 'w-2/5'
            )}
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
                        setSelectedServices([])
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
          <div
            className={cn(
              "relative bg-gray-100",
              isMobile ? (mobileView === 'map' ? 'w-full' : 'hidden') : 'w-3/5'
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
        </div>

        {/* Advanced Filter Panel */}
        <FilterPanel
          isOpen={filtersOpen}
          onClose={() => setFiltersOpen(false)}
          selectedDealerTypes={selectedDealerTypes}
          selectedServices={selectedServices}
          selectedRadius={selectedRadius}
          onFilterChange={handleFilterChange}
          dealers={dealers}
        />

        {/* Floating Search Bar at Bottom */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-3xl px-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50">
            <SearchBar
              dealers={dealers}
              onSearch={handleSearch}
              onLocationSearch={handleLocationSearch}
            />
          </div>
        </div>
      </div>
    </>
  )
}
