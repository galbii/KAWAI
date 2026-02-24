'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { Search, MapPin, Building2, X, Navigation } from 'lucide-react'
import { useMapsLibrary } from '@vis.gl/react-google-maps'
import { motion, AnimatePresence } from 'framer-motion'
import type { DealerWithDistance } from '../types'
import { cn } from '@/lib/utils'

interface SearchResult {
  id: string
  name: string
  city: string
  state: string
  zipCode: string
  type: 'dealer' | 'storefront'
  distance?: number
  coordinates?: { lat: number; lng: number }
  matchedText?: string
}

interface Props {
  dealers: DealerWithDistance[]
  onSearch: (results: DealerWithDistance[], location?: { lat: number; lng: number }) => void
  onLocationSearch: (location: { lat: number; lng: number }, address: string) => void
}

export function SearchBar({ dealers, onSearch, onLocationSearch }: Props) {
  const [searchInput, setSearchInput] = useState('')
  const [autocompleteService, setAutocompleteService] = useState<google.maps.places.AutocompleteService | null>(null)
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null)
  const [locationPredictions, setLocationPredictions] = useState<google.maps.places.AutocompletePrediction[]>([])
  const [dealerResults, setDealerResults] = useState<SearchResult[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [mounted, setMounted] = useState(false)
  const [isLocating, setIsLocating] = useState(false)
  const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const inputRef = useRef<HTMLInputElement>(null)

  const placesLibrary = useMapsLibrary('places')
  const geocodingLibrary = useMapsLibrary('geocoding')

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

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (placesLibrary) setAutocompleteService(new placesLibrary.AutocompleteService())
  }, [placesLibrary])

  useEffect(() => {
    if (geocodingLibrary) setGeocoder(new geocodingLibrary.Geocoder())
  }, [geocodingLibrary])

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 3959
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLng = ((lng2 - lng1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2)
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  }

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

    debounceRef.current = setTimeout(() => {
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

      } else if (searchType === 'zip' && geocoder) {
        geocoder.geocode(
          { address: value, componentRestrictions: { country: 'us', postalCode: value } },
          (results, status) => {
            if (status === 'OK' && results?.[0]) {
              const location = results[0].geometry.location
              const lat = location.lat()
              const lng = location.lng()

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

              // Show closest dealers in popup
              setDealerResults(sorted.slice(0, 6).map(toDealerResult))

              // Also show the geocoded location as a "sort by distance" option
              const zipPrediction: google.maps.places.AutocompletePrediction = {
                description: results[0].formatted_address,
                place_id: results[0].place_id,
                structured_formatting: {
                  main_text: value,
                  secondary_text: results[0].formatted_address,
                  main_text_matched_substrings: []
                },
                matched_substrings: [],
                terms: [],
                types: ['postal_code']
              }
              setLocationPredictions([zipPrediction])
              setShowDropdown(true)
            }
          }
        )

      } else {
        // CITY / NAME search
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

        // Also fetch Google Places city autocomplete for distance sorting
        if (autocompleteService && value.length >= 3) {
          autocompleteService.getPlacePredictions(
            { input: value, componentRestrictions: { country: 'us' }, types: ['(cities)'] },
            (predictions, status) => {
              if (status === 'OK' && predictions) {
                setLocationPredictions(predictions)
                setShowDropdown(true)
              } else {
                setLocationPredictions([])
              }
            }
          )
        }
      }
    }, 300)
  }, [autocompleteService, dealers, onSearch, detectSearchType, geocoder, US_STATES, toDealerResult])

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

  const handleLocationSelect = useCallback((prediction: google.maps.places.AutocompletePrediction) => {
    if (!geocoder) return

    geocoder.geocode({ placeId: prediction.place_id }, (results, status) => {
      if (status === 'OK' && results?.[0]) {
        const location = results[0].geometry.location
        const lat = location.lat()
        const lng = location.lng()
        const lowerQuery = searchInput.toLowerCase()

        setSearchInput(prediction.description)
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
        onLocationSearch({ lat, lng }, prediction.description)
        setTimeout(() => inputRef.current?.focus(), 0)
      }
    })
  }, [dealers, onSearch, onLocationSearch, geocoder, searchInput])

  const handleUseMyLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.')
      return
    }

    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords
        const coords = { lat: latitude, lng: longitude }
        setCurrentLocation(coords)

        const finishWithAddress = (address: string) => {
          setSearchInput(address)
          onLocationSearch(coords, address)

          // Sort all dealers by distance from current location and pass to onSearch
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

        if (geocoder) {
          geocoder.geocode({ location: coords }, (results, status) => {
            setIsLocating(false)
            if (status === 'OK' && results?.[0]) {
              const components = results[0].address_components
              const city = components?.find(c => c.types.includes('locality'))?.long_name
              const state = components?.find(c => c.types.includes('administrative_area_level_1'))?.short_name
              const address = city && state ? `${city}, ${state}` : results[0].formatted_address
              finishWithAddress(address)
            } else {
              finishWithAddress(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`)
            }
          })
        } else {
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
  }, [geocoder, dealers, onLocationSearch, onSearch])

  const handleClear = useCallback(() => {
    setSearchInput('')
    setLocationPredictions([])
    setDealerResults([])
    setShowDropdown(false)
    setCurrentLocation(null)
    onSearch(dealers)
  }, [dealers, onSearch])

  const hasResults = dealerResults.length > 0 || locationPredictions.length > 0

  return (
    <div className={cn('relative', mounted && 'search-bar-animate')}>
      {/* Search Input */}
      <div
        className="relative rounded-2xl shadow-lg border border-white/20"
        style={{
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        }}
      >
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={2} />
        <input
          ref={inputRef}
          type="text"
          value={searchInput}
          onChange={e => handleInputChange(e.target.value)}
          onFocus={() => hasResults && setShowDropdown(true)}
          placeholder="Search by name, address, city, state, or ZIP code"
          className="w-full pl-14 pr-36 py-4 rounded-2xl bg-transparent focus:outline-none text-gray-900 placeholder:text-gray-400 font-medium text-sm"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          {searchInput && (
            <button
              onClick={handleClear}
              className="p-1.5 hover:bg-gray-200/60 rounded-lg transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4 text-gray-500" strokeWidth={2} />
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

      {/* Results Popup — slides up above the search bar */}
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
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-full left-0 right-0 mb-3 rounded-2xl border border-gray-200/60 z-20 overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.97)',
                backdropFilter: 'blur(24px) saturate(180%)',
                WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                boxShadow: '0 -4px 24px -4px rgba(0,0,0,0.12), 0 -2px 8px -2px rgba(0,0,0,0.08)',
                maxHeight: '60vh',
                overflowY: 'auto',
              }}
            >
              {/* Dealer Results Section */}
              {dealerResults.length > 0 && (
                <div>
                  <div
                    className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em] border-b border-gray-100"
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
                      className="w-full px-4 py-3 text-left hover:bg-kawai-red/5 active:bg-kawai-red/10 transition-colors border-b border-gray-100/70 last:border-0 group"
                    >
                      <div className="flex items-center gap-3 min-h-[44px]">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-kawai-red/10 flex items-center justify-center transition-colors">
                          <Building2 className="w-4 h-4 text-gray-400 group-hover:text-kawai-red transition-colors" strokeWidth={2} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-gray-900 truncate leading-tight">
                            {result.name}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {result.city}, {result.state}
                          </div>
                        </div>
                        {result.distance !== undefined && (
                          <span className="flex-shrink-0 text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full group-hover:bg-kawai-red/10 group-hover:text-kawai-red transition-colors">
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
                    className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em] border-b border-gray-100"
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
                      className="w-full px-4 py-3 text-left hover:bg-kawai-red/5 active:bg-kawai-red/10 transition-colors border-b border-gray-100/70 last:border-0 group"
                    >
                      <div className="flex items-center gap-3 min-h-[44px]">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-kawai-red/10 flex items-center justify-center transition-colors">
                          <MapPin className="w-4 h-4 text-gray-400 group-hover:text-kawai-red transition-colors" strokeWidth={2} />
                        </div>
                        <span className="text-sm text-gray-800 font-medium leading-snug">
                          {prediction.description}
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
