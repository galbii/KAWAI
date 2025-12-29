'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import { APIProvider } from '@vis.gl/react-google-maps'
import type { Dealer } from '@/payload-types'
import { DealerMap } from './components/DealerMap'
import { DealerList } from './components/DealerList'
import { SearchBar } from './components/SearchBar'
import { FilterPanel } from './components/FilterPanel'
import { MobileViewToggle } from './components/MobileViewToggle'
import { cn } from '@/lib/utils'

interface DealerWithDistance extends Dealer {
  distance?: number
}

interface Props {
  dealers: Dealer[]
}

// Haversine formula to calculate distance between two coordinates
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959 // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function DealerFinderClient({ dealers }: Props) {
  const [searchLocation, setSearchLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [searchAddress, setSearchAddress] = useState<string>('')
  const [selectedRadius, setSelectedRadius] = useState(25)
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [selectedDealer, setSelectedDealer] = useState<string | null>(null)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [mobileView, setMobileView] = useState<'map' | 'list'>('map')
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Filter and sort dealers
  const filteredDealers: DealerWithDistance[] = useMemo(() => {
    let result = dealers.map(dealer => ({ ...dealer }))

    // TODO: Re-enable distance calculation when Google Maps is configured
    // Calculate distances if search location is set
    // if (searchLocation) {
    //   result = result.map(dealer => {
    //     if (dealer.coordinates?.latitude && dealer.coordinates?.longitude) {
    //       const distance = calculateDistance(
    //         searchLocation.lat,
    //         searchLocation.lng,
    //         dealer.coordinates.latitude,
    //         dealer.coordinates.longitude
    //       )
    //       return { ...dealer, distance }
    //     }
    //     return dealer
    //   })

    //   // Filter by radius
    //   result = result.filter(dealer =>
    //     dealer.distance ? dealer.distance <= selectedRadius : true
    //   )

    //   // Sort by distance (featured dealers first, then by distance)
    //   result.sort((a, b) => {
    //     if (a.isFeatured && !b.isFeatured) return -1
    //     if (!a.isFeatured && b.isFeatured) return 1
    //     if (a.distance && b.distance) return a.distance - b.distance
    //     return 0
    //   })
    // } else {
      // No search location - sort featured first, then alphabetically
      result.sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1
        if (!a.isFeatured && b.isFeatured) return 1
        return (a.dealerName || '').localeCompare(b.dealerName || '')
      })
    // }

    // Filter by services if any selected
    if (selectedServices.length > 0) {
      result = result.filter(dealer =>
        dealer.tags?.some(tag => selectedServices.includes(tag as string))
      )
    }

    return result
  }, [dealers, selectedServices])

  const handleLocationSearch = useCallback((location: { lat: number; lng: number }, address: string) => {
    setSearchLocation(location)
    setSearchAddress(address)
  }, [])

  const handleDealerSelect = useCallback((dealerId: string | null) => {
    setSelectedDealer(dealerId)
  }, [])

  const handleFilterChange = useCallback((services: string[], radius: number) => {
    setSelectedServices(services)
    setSelectedRadius(radius)
  }, [])

  // Check if we have a valid API key
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8">
          <h2 className="text-2xl font-semibold text-kawai-charcoal mb-2">
            Map Configuration Required
          </h2>
          <p className="text-gray-600">
            Google Maps API key is not configured. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your environment variables.
          </p>
        </div>
      </div>
    )
  }

  return (
    <APIProvider apiKey={apiKey}>
      <div className="flex flex-col h-screen">
        {/* Header with Search */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
          <div className="container max-w-7xl mx-auto px-4 py-4">
            <div className="mb-4 flex items-end gap-3">
              <img
                src="/images/logos/kawai-logo-red-1x.png"
                alt="KAWAI"
                className="h-8 md:h-10"
                srcSet="/images/logos/kawai-logo-red-1x.png 1x, /images/logos/kawai-logo-red-2x.png 2x, /images/logos/kawai-logo-red-3x.png 3x"
              />
              <h1 className="text-2xl md:text-3xl font-bold text-kawai-charcoal">
                Dealers
              </h1>
            </div>
            <p className="text-gray-600 mb-4">
              Discover authorized dealers near you
            </p>

            <SearchBar
              onLocationSearch={handleLocationSearch}
              onFilterToggle={() => setFiltersOpen(!filtersOpen)}
              activeFiltersCount={selectedServices.length + (selectedRadius !== 25 ? 1 : 0)}
            />

            {/* TODO: Re-enable when Google Maps is configured */}
            {/* {searchAddress && (
              <div className="mt-3 text-sm text-gray-600">
                <span className="font-medium text-kawai-charcoal">
                  {filteredDealers.length}
                </span>
                {' '}dealer{filteredDealers.length !== 1 ? 's' : ''} within{' '}
                <span className="font-medium text-kawai-charcoal">{selectedRadius} miles</span>
                {' '}of{' '}
                <span className="font-medium text-kawai-charcoal">{searchAddress}</span>
              </div>
            )} */}
          </div>
        </div>

        {/* Mobile View Toggle */}
        {isMobile && (
          <MobileViewToggle
            view={mobileView}
            onViewChange={setMobileView}
            dealerCount={filteredDealers.length}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Dealer List Panel */}
          <div
            className={cn(
              "border-r border-gray-200 overflow-y-auto bg-gray-50",
              isMobile ? (mobileView === 'list' ? 'w-full' : 'hidden') : 'w-2/5'
            )}
          >
            <DealerList
              dealers={filteredDealers}
              selectedDealer={selectedDealer}
              onDealerSelect={handleDealerSelect}
            />
          </div>

          {/* Map Panel */}
          <div
            className={cn(
              "flex-1",
              isMobile ? (mobileView === 'map' ? 'w-full' : 'hidden') : 'w-3/5'
            )}
          >
            <DealerMap
              dealers={filteredDealers}
              searchCenter={searchLocation}
              searchRadius={selectedRadius}
              selectedDealer={selectedDealer}
              onMarkerClick={handleDealerSelect}
            />
          </div>
        </div>

        {/* Filter Panel */}
        <FilterPanel
          isOpen={filtersOpen}
          onClose={() => setFiltersOpen(false)}
          selectedServices={selectedServices}
          selectedRadius={selectedRadius}
          onFilterChange={handleFilterChange}
          dealers={dealers}
        />
      </div>
    </APIProvider>
  )
}
