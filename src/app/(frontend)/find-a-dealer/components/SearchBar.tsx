'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { Search, MapPin, Building2, X, Navigation } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { DealerWithDistance } from '../types'
import { calculateDistance } from '@/lib/utils/dealer-search'
import { cn } from '@/lib/utils'

type NominatimResult = {
  place_id: number
  lat: string
  lon: string
  display_name: string
  address: {
    city?: string
    town?: string
    village?: string
    state?: string
    postcode?: string
  }
}

interface SearchResult {
  id: string
  name: string
  city: string
  state: string
  zipCode: string
  type: 'dealer' | 'storefront'
  distance?: number
  coordinates?: { lat: number; lng: number }
}

interface Props {
  dealers: DealerWithDistance[]
  onSearch: (results: DealerWithDistance[], location?: { lat: number; lng: number }) => void
  onLocationSearch: (location: { lat: number; lng: number }, address: string) => void
  /** 'floating' = frosted glass, dropdown above (default). 'inline' = minimal underline, dropdown below. */
  variant?: 'floating' | 'inline'
}

export function SearchBar({ dealers, onSearch, onLocationSearch, variant = 'floating' }: Props) {
  const [searchInput, setSearchInput] = useState('')
  const [locationPredictions, setLocationPredictions] = useState<NominatimResult[]>([])
  const [dealerResults, setDealerResults] = useState<SearchResult[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isLocating, setIsLocating] = useState(false)
  const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const inputRef = useRef<HTMLInputElement>(null)

  const US_STATES: Record<string, string> = {
    'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
    'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
    'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
    'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
    'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
    'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
    'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
    'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
    'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
    'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming'
  }

  // Suppress unused state warning — currentLocation used for future radius filtering
  void currentLocation

  const toDealerResult = useCallback((dealer: DealerWithDistance): SearchResult => {
    const result: SearchResult = {
      id: dealer.id as string,
      name: dealer.dealerName || '',
      city: dealer.address?.city || '',
      state: dealer.address?.state || '',
      zipCode: dealer.address?.zipCode || '',
      type: 'dealer',
    }
    if (dealer.distance !== undefined) result.distance = dealer.distance
    if (dealer.coordinates?.latitude && dealer.coordinates?.longitude) {
      result.coordinates = { lat: dealer.coordinates.latitude, lng: dealer.coordinates.longitude }
    }
    return result
  }, [])

  const detectSearchType = useCallback((query: string): 'zip' | 'state' | 'city' | 'name' => {
    const trimmed = query.trim()
    if (/^\d{5}$/.test(trimmed)) return 'zip'
    const upper = trimmed.toUpperCase()
    if (US_STATES[upper]) return 'state'
    if (Object.values(US_STATES).some(s => s.toLowerCase() === trimmed.toLowerCase())) return 'state'
    const nameMatches = dealers.filter(d => d.dealerName?.toLowerCase().includes(trimmed.toLowerCase()))
    if (nameMatches.length > 0) return 'name'
    return 'city'
  }, [dealers, US_STATES])

  const handleInputChange = useCallback((value: string) => {
    setSearchInput(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (!value.trim()) {
      setLocationPredictions([])
      setDealerResults([])
      setShowDropdown(false)
      onSearch(dealers)
      return
    }

    debounceRef.current = setTimeout(async () => {
      const lowerQuery = value.toLowerCase()
      const searchType = detectSearchType(value)

      const sortDealers = (dealersToSort: DealerWithDistance[], hasLocation = false) =>
        dealersToSort.sort((a, b) => {
          const aMatch = a.dealerName?.toLowerCase().includes(lowerQuery) || false
          const bMatch = b.dealerName?.toLowerCase().includes(lowerQuery) || false
          if (aMatch && !bMatch) return -1
          if (!aMatch && bMatch) return 1
          if (hasLocation && a.distance !== undefined && b.distance !== undefined) return a.distance - b.distance
          return (a.dealerName || '').localeCompare(b.dealerName || '')
        })

      if (searchType === 'state') {
        const stateQuery = value.toUpperCase()
        const stateName = US_STATES[stateQuery] ||
          Object.entries(US_STATES).find(([, name]) => name.toLowerCase() === lowerQuery)?.[0]

        const stateDealers = dealers.filter(dealer => {
          const state = dealer.address?.state?.toUpperCase() || ''
          return state === stateQuery || state === stateName
        })

        const sorted = sortDealers(stateDealers)
        onSearch(sorted)
        setDealerResults(sorted.slice(0, 6).map(toDealerResult))
        setLocationPredictions([])
        setShowDropdown(sorted.length > 0)

      } else if (searchType === 'zip') {
        // Geocode ZIP via Nominatim proxy
        try {
          const res = await fetch(`/api/search/nominatim?postalcode=${encodeURIComponent(value)}&country=US&limit=1`)
          const results = (await res.json()) as NominatimResult[]

          if (results.length > 0 && results[0]) {
            const lat = parseFloat(results[0].lat)
            const lng = parseFloat(results[0].lon)

            const dealersWithDistance = dealers
              .map(dealer => {
                if (!dealer.coordinates?.latitude || !dealer.coordinates?.longitude) return dealer
                return {
                  ...dealer,
                  distance: calculateDistance(lat, lng, dealer.coordinates.latitude, dealer.coordinates.longitude)
                } as DealerWithDistance
              })
              .filter(d => d.coordinates?.latitude && d.coordinates?.longitude)

            const sorted = sortDealers(dealersWithDistance, true)
            onSearch(sorted, { lat, lng })
            setDealerResults(sorted.slice(0, 6).map(toDealerResult))
            setLocationPredictions([results[0]])
            setShowDropdown(true)
          }
        } catch (err) {
          console.error('[SearchBar] ZIP geocoding error:', err)
        }

      } else {
        // CITY / NAME search — local filter
        const cityMatches = dealers.filter(dealer => {
          const city = dealer.address?.city?.toLowerCase() || ''
          const name = dealer.dealerName?.toLowerCase() || ''
          return city.includes(lowerQuery) || name.includes(lowerQuery)
        })

        onSearch(sortDealers(cityMatches))

        // Name-only matches go into the popup results
        const nameMatches = dealers
          .filter(d => d.dealerName?.toLowerCase().includes(lowerQuery))
          .slice(0, 6)
        setDealerResults(nameMatches.map(toDealerResult))
        if (nameMatches.length > 0) setShowDropdown(true)

        // Fetch Nominatim city autocomplete for distance sorting
        if (value.length >= 3) {
          try {
            const res = await fetch(`/api/search/nominatim?q=${encodeURIComponent(value)}&limit=5`)
            const results = (await res.json()) as NominatimResult[]
            if (results.length > 0) {
              setLocationPredictions(results)
              setShowDropdown(true)
            } else {
              setLocationPredictions([])
            }
          } catch (err) {
            console.error('[SearchBar] City autocomplete error:', err)
            setLocationPredictions([])
          }
        }
      }
    }, 300)
  }, [dealers, onSearch, detectSearchType, US_STATES, toDealerResult])

  const handleDealerResultSelect = useCallback((result: SearchResult) => {
    setSearchInput(result.name)
    setShowDropdown(false)
    setLocationPredictions([])
    setDealerResults([])

    const dealer = dealers.find(d => d.id === result.id)
    if (dealer) {
      onSearch([dealer], result.coordinates)
      if (result.coordinates) {
        onLocationSearch(result.coordinates, result.name)
      }
    }

    setTimeout(() => inputRef.current?.focus(), 0)
  }, [dealers, onSearch, onLocationSearch])

  const handleLocationSelect = useCallback((prediction: NominatimResult) => {
    // Nominatim already includes lat/lon — no second geocode request needed
    const lat = parseFloat(prediction.lat)
    const lng = parseFloat(prediction.lon)
    const lowerQuery = searchInput.toLowerCase()

    setSearchInput(prediction.display_name)
    setShowDropdown(false)
    setDealerResults([])

    const dealersWithDistance = dealers.map(dealer => {
      if (!dealer.coordinates?.latitude || !dealer.coordinates?.longitude) return dealer
      return {
        ...dealer,
        distance: calculateDistance(lat, lng, dealer.coordinates.latitude, dealer.coordinates.longitude)
      }
    })

    const sorted = dealersWithDistance.sort((a, b) => {
      const aMatch = a.dealerName?.toLowerCase().includes(lowerQuery) || false
      const bMatch = b.dealerName?.toLowerCase().includes(lowerQuery) || false
      if (aMatch && !bMatch) return -1
      if (!aMatch && bMatch) return 1
      if (a.distance !== undefined && b.distance !== undefined) return a.distance - b.distance
      return 0
    })

    onSearch(sorted, { lat, lng })
    onLocationSearch({ lat, lng }, prediction.display_name)
    setTimeout(() => inputRef.current?.focus(), 0)
  }, [dealers, onSearch, onLocationSearch, searchInput])

  const handleUseMyLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.')
      return
    }

    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      async position => {
        const { latitude, longitude } = position.coords
        const coords = { lat: latitude, lng: longitude }
        setCurrentLocation(coords)

        const finishWithAddress = (address: string) => {
          setSearchInput(address)
          onLocationSearch(coords, address)

          const dealersWithDistance = dealers
            .map(dealer => {
              if (!dealer.coordinates?.latitude || !dealer.coordinates?.longitude) return dealer
              return {
                ...dealer,
                distance: calculateDistance(
                  latitude,
                  longitude,
                  dealer.coordinates.latitude,
                  dealer.coordinates.longitude
                ),
              } as DealerWithDistance
            })
            .filter(d => d.coordinates?.latitude && d.coordinates?.longitude)
            .sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity))

          onSearch(dealersWithDistance, coords)
        }

        try {
          const res = await fetch(`/api/search/nominatim/reverse?lat=${latitude}&lon=${longitude}`)
          const result = (await res.json()) as NominatimResult
          setIsLocating(false)

          const city = result.address?.city ?? result.address?.town ?? result.address?.village
          const state = result.address?.state
          const address = city && state ? `${city}, ${state}` : result.display_name
          finishWithAddress(address || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`)
        } catch {
          setIsLocating(false)
          finishWithAddress(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`)
        }
      },
      error => {
        setIsLocating(false)
        console.error('Geolocation error:', error)
        if (error.code === error.PERMISSION_DENIED) {
          alert('Location access was denied. Please allow location access or enter your location manually.')
        } else {
          alert('Unable to access your location. Please enter it manually.')
        }
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
    )
  }, [dealers, onLocationSearch, onSearch])

  const handleClear = useCallback(() => {
    setSearchInput('')
    setLocationPredictions([])
    setDealerResults([])
    setShowDropdown(false)
    setCurrentLocation(null)
    onSearch(dealers)
  }, [dealers, onSearch])

  // Clean up debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  const hasResults = dealerResults.length > 0 || locationPredictions.length > 0

  const isInline = variant === 'inline'

  return (
    <div className="relative">
      {/* Search Input */}
      {isInline ? (
        /* Inline variant — prominent contained search in the sticky header */
        <div className="relative">
          <div
            className={cn(
              'flex items-center gap-2.5 h-10 px-4 rounded-lg border transition-all duration-200',
              searchInput
                ? 'bg-white border-kawai-charcoal shadow-sm'
                : 'bg-kawai-pearl border-kawai-neutral hover:border-kawai-charcoal/50 hover:bg-white',
            )}
          >
            <Search className="w-4 h-4 text-kawai-charcoal/50 flex-shrink-0" strokeWidth={2} />
            <input
              ref={inputRef}
              type="text"
              value={searchInput}
              onChange={e => handleInputChange(e.target.value)}
              onFocus={() => hasResults && setShowDropdown(true)}
              placeholder="Search by city, name, or ZIP…"
              className="flex-1 min-w-0 bg-transparent text-sm text-kawai-black placeholder:text-kawai-charcoal/40 focus:outline-none focus:ring-0 font-[family-name:var(--font-brand-sans)]"
            />
            {searchInput ? (
              <button
                onClick={handleClear}
                className="flex-shrink-0 p-0.5 text-kawai-charcoal/50 hover:text-kawai-black transition-colors"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" strokeWidth={2} />
              </button>
            ) : (
              <button
                onClick={handleUseMyLocation}
                disabled={isLocating}
                className="flex-shrink-0 flex items-center gap-1 text-xs font-medium text-kawai-red hover:text-kawai-red/80 transition-colors disabled:opacity-60 font-[family-name:var(--font-brand-sans)] whitespace-nowrap"
              >
                <Navigation className={cn('w-3.5 h-3.5', isLocating && 'animate-pulse')} strokeWidth={2} />
                <span>{isLocating ? 'Locating…' : 'Near Me'}</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Floating variant — frosted glass (default, used in mobile) */
        <div
          className="relative rounded-2xl shadow-lg border border-white/20"
          style={{
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          }}
        >
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-kawai-charcoal/35" strokeWidth={2} />
          <input
            ref={inputRef}
            type="text"
            value={searchInput}
            onChange={e => handleInputChange(e.target.value)}
            onFocus={() => hasResults && setShowDropdown(true)}
            placeholder="Search by name, address, city, state, or ZIP code"
            className="w-full pl-14 pr-36 py-4 rounded-2xl bg-transparent focus:outline-none text-kawai-black placeholder:text-kawai-charcoal/35 font-medium text-sm"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {searchInput && (
              <button
                onClick={handleClear}
                className="p-1.5 hover:bg-kawai-neutral/50 rounded-lg transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4 text-kawai-charcoal/50" strokeWidth={2} />
              </button>
            )}
            <button
              onClick={handleUseMyLocation}
              disabled={isLocating}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-kawai-red hover:bg-kawai-red/8 rounded-lg transition-colors disabled:opacity-60"
            >
              <Navigation className={cn('w-4 h-4', isLocating && 'animate-pulse')} strokeWidth={2} />
              <span className="hidden sm:inline">{isLocating ? 'Locating…' : 'My Location'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Results Popup — above for floating, below for inline */}
      <AnimatePresence>
        {showDropdown && hasResults && (
          <>
            {/* Backdrop to close on outside click */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowDropdown(false)}
            />

            <motion.div
              key="dealer-results"
              initial={{ opacity: 0, y: isInline ? -8 : 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: isInline ? -4 : 8, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "absolute left-0 right-0 rounded-xl border border-kawai-neutral/60 z-20 overflow-hidden",
                isInline
                  ? "top-full mt-2"
                  : "bottom-full mb-3 rounded-2xl"
              )}
              style={{
                background: 'rgba(255, 255, 255, 0.97)',
                backdropFilter: 'blur(24px) saturate(180%)',
                WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                boxShadow: isInline
                  ? '0 8px 24px -4px rgba(0,0,0,0.12), 0 4px 8px -2px rgba(0,0,0,0.08)'
                  : '0 -4px 24px -4px rgba(0,0,0,0.12), 0 -2px 8px -2px rgba(0,0,0,0.08)',
                maxHeight: '60vh',
                overflowY: 'auto',
              }}
            >
              {/* Dealer Results Section */}
              {dealerResults.length > 0 && (
                <div>
                  <div
                    className="px-4 py-2 text-[10px] font-bold text-kawai-charcoal/40 uppercase tracking-[0.1em] border-b border-kawai-neutral/40"
                    style={{ background: 'linear-gradient(90deg, rgba(196,30,58,0.05) 0%, transparent 100%)' }}
                  >
                    Piano Dealers
                  </div>
                  {dealerResults.map((result, i) => (
                    <motion.button
                      key={result.id}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.15 }}
                      onClick={() => handleDealerResultSelect(result)}
                      className="w-full px-4 py-3 text-left hover:bg-kawai-red/5 active:bg-kawai-red/10 transition-colors border-b border-kawai-neutral/30 last:border-0 group"
                    >
                      <div className="flex items-center gap-3 min-h-[44px]">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-kawai-neutral/40 group-hover:bg-kawai-red/10 flex items-center justify-center transition-colors">
                          <Building2 className="w-4 h-4 text-kawai-charcoal/40 group-hover:text-kawai-red transition-colors" strokeWidth={2} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-kawai-black truncate leading-tight">
                            {result.name}
                          </div>
                          <div className="text-xs text-kawai-charcoal/50 mt-0.5">
                            {result.city}, {result.state}
                          </div>
                        </div>
                        {result.distance !== undefined && (
                          <span className="flex-shrink-0 text-xs font-medium text-kawai-charcoal/40 bg-kawai-neutral/40 px-2 py-0.5 rounded-full group-hover:bg-kawai-red/10 group-hover:text-kawai-red transition-colors">
                            {result.distance.toFixed(1)} mi
                          </span>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Location Predictions Section */}
              {locationPredictions.length > 0 && (
                <div>
                  <div
                    className="px-4 py-2 text-[10px] font-bold text-kawai-charcoal/40 uppercase tracking-[0.1em] border-b border-kawai-neutral/40"
                    style={{ background: 'linear-gradient(90deg, rgba(196,30,58,0.05) 0%, transparent 100%)' }}
                  >
                    Sort by distance from
                  </div>
                  {locationPredictions.map((prediction, i) => (
                    <motion.button
                      key={prediction.place_id}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (dealerResults.length + i) * 0.04, duration: 0.15 }}
                      onClick={() => handleLocationSelect(prediction)}
                      className="w-full px-4 py-3 text-left hover:bg-kawai-red/5 active:bg-kawai-red/10 transition-colors border-b border-kawai-neutral/30 last:border-0 group"
                    >
                      <div className="flex items-center gap-3 min-h-[44px]">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-kawai-neutral/40 group-hover:bg-kawai-red/10 flex items-center justify-center transition-colors">
                          <MapPin className="w-4 h-4 text-kawai-charcoal/40 group-hover:text-kawai-red transition-colors" strokeWidth={2} />
                        </div>
                        <span className="text-sm text-kawai-charcoal font-medium leading-snug">
                          {prediction.display_name}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
