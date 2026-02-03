'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import type { Dealer } from '@/payload-types'
import { DealerMapLibre } from './components/DealerMapLibre'
import { DealerList } from './components/DealerList'
import { SearchBar } from './components/SearchBar'
import { FilterPanel } from './components/FilterPanel'
import { MobileViewToggle } from './components/MobileViewToggle'
import { DealerTypeFilter } from './components/DealerTypeFilter'
import { VideoHero } from './components/VideoHero'
import { cn } from '@/lib/utils'
import { MapPin, SlidersHorizontal } from 'lucide-react'

interface DealerWithDistance extends Dealer {
  distance?: number
}

interface Props {
  dealers: Dealer[]
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

  // Filter and sort dealers
  const filteredDealers: DealerWithDistance[] = useMemo(() => {
    let result = dealers.map(dealer => ({ ...dealer }))

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

    // Sort featured first, then alphabetically
    result.sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1
      if (!a.isFeatured && b.isFeatured) return 1
      return (a.dealerName || '').localeCompare(b.dealerName || '')
    })

    // Filter by services if any selected
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
  }, [])

  const handleFilterChange = useCallback((dealerTypes: string[], services: string[], radius: number) => {
    setSelectedDealerTypes(dealerTypes)
    setSelectedServices(services)
    setSelectedRadius(radius)
  }, [])

  const activeFilterCount = selectedDealerTypes.length + selectedServices.length + (selectedRadius !== 25 ? 1 : 0)

  // Product descriptions for each dealer type
  const dealerTypeDescriptions = {
    'all': 'Kawai acoustic and digital pianos are available through a network of respected retail dealers across North America. To search for an Authorized Kawai Dealer, select a product from the list below:',
    'professional-products': 'MP11SE and MP7SE Professional Stage Pianos • VPC1 Virtual Piano Controller • CA/CN/DG/KDP Series Digital Pianos • ES Series Portable Digital Pianos • Digital Piano Accessories',
    'acoustic-digital': 'GX BLAK Series Grand Pianos • GL Series Grand Pianos • K Series Professional Upright Pianos • NOVUS Series Hybrids Pianos • AURES and ATX Hybrid Pianos • CA/CN/KDP/ES Series Digital Pianos • Institutional Uprights • Designer Studio and Console Pianos',
  }

  return (
    <>
      {/* Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* Page content */}
      <div className="min-h-screen bg-white" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
        {/* Hero Section with Video Background - First */}
        <VideoHero
          youtubeVideoId="VrveoooxIno"
          title="Find Our Authorized Dealers"
          description="Discover expert KAWAI dealers near you for personalized consultations, showroom visits, and exceptional service."
        />

        {/* Search Bar Section - After hero */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <SearchBar onLocationSearch={handleLocationSearch} />
          </div>
        </div>

        {/* Filters Section */}
        <div className="border-b border-gray-200 bg-white shadow-sm">
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

            {/* Dealer Type Filter Pills */}
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <DealerTypeFilter
                selected={dealerTypeFilter}
                onChange={setDealerTypeFilter}
                counts={dealerCounts}
              />

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

            {/* Dynamic Description */}
            <div className="bg-gray-50 rounded-xl px-5 py-4 border border-gray-200 mb-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                {dealerTypeDescriptions[dealerTypeFilter]}
              </p>
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
      </div>
    </>
  )
}
