'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { Search, MapPin, Building2, X } from 'lucide-react'
import { useMapsLibrary } from '@vis.gl/react-google-maps'
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
  matchedText?: string // For highlighting
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
  const [searchMode, setSearchMode] = useState<'location' | 'dealer'>('location')
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [mounted, setMounted] = useState(false)
  const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const inputRef = useRef<HTMLInputElement>(null)

  const placesLibrary = useMapsLibrary('places')
  const geocodingLibrary = useMapsLibrary('geocoding')

  // US State abbreviations and names for detection
  const US_STATES = {
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

  // Mount animation
  useEffect(() => {
    setMounted(true)
  }, [])

  // Initialize services
  useEffect(() => {
    if (placesLibrary) {
      setAutocompleteService(new placesLibrary.AutocompleteService())
    }
  }, [placesLibrary])

  useEffect(() => {
    if (geocodingLibrary) {
      setGeocoder(new geocodingLibrary.Geocoder())
    }
  }, [geocodingLibrary])


  // Calculate distance between two coordinates
  const calculateDistance = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number => {
    const R = 3959 // Earth's radius in miles
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLng = ((lng2 - lng1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  // Search dealers by name, city, or ZIP
  const searchDealers = useCallback(
    (query: string) => {
      if (query.length < 2) {
        setDealerResults([])
        return
      }

      const lowerQuery = query.toLowerCase()
      const results: SearchResult[] = []

      dealers.forEach((dealer) => {
        let matched = false
        let matchedText = ''

        const name = dealer.dealerName?.toLowerCase() || ''
        const city = dealer.address?.city?.toLowerCase() || ''
        const state = dealer.address?.state?.toLowerCase() || ''
        const zipCode = dealer.address?.zipCode?.toLowerCase() || ''

        if (name.includes(lowerQuery)) {
          matched = true
          matchedText = 'name'
        } else if (city.includes(lowerQuery)) {
          matched = true
          matchedText = 'city'
        } else if (zipCode.includes(lowerQuery)) {
          matched = true
          matchedText = 'zip'
        } else if (state.includes(lowerQuery)) {
          matched = true
          matchedText = 'state'
        }

        if (matched) {
          const baseResult: SearchResult = {
            id: dealer.id,
            name: dealer.dealerName || '',
            city: dealer.address?.city || '',
            state: dealer.address?.state || '',
            zipCode: dealer.address?.zipCode || '',
            type: 'dealer',
            matchedText,
          }

          // Add distance if we have current location
          if (currentLocation && dealer.coordinates) {
            baseResult.distance = calculateDistance(
              currentLocation.lat,
              currentLocation.lng,
              dealer.coordinates.latitude,
              dealer.coordinates.longitude
            )
          }

          // Add coordinates if available
          if (dealer.coordinates) {
            baseResult.coordinates = {
              lat: dealer.coordinates.latitude,
              lng: dealer.coordinates.longitude,
            }
          }

          results.push(baseResult)
        }
      })

      // Sort: by distance if available, then alphabetically
      results.sort((a, b) => {
        if (a.distance !== undefined && b.distance !== undefined) {
          return a.distance - b.distance
        }
        return a.name.localeCompare(b.name)
      })

      setDealerResults(results.slice(0, 10)) // Limit to 10 results
    },
    [dealers, currentLocation]
  )

  // Detect search type
  const detectSearchType = useCallback((query: string): 'zip' | 'state' | 'city' | 'name' => {
    const trimmed = query.trim()

    // ZIP code: exactly 5 digits
    if (/^\d{5}$/.test(trimmed)) return 'zip'

    // State: 2-letter code or full state name
    const upper = trimmed.toUpperCase()
    if (US_STATES[upper as keyof typeof US_STATES]) return 'state'
    if (Object.values(US_STATES).some(state => state.toLowerCase() === trimmed.toLowerCase())) return 'state'

    // If matches dealer names well, treat as name search
    const nameMatches = dealers.filter(d =>
      d.dealerName?.toLowerCase().includes(trimmed.toLowerCase())
    )
    if (nameMatches.length > 0) return 'name'

    // Otherwise, assume city/location
    return 'city'
  }, [dealers, US_STATES])

  // Handle input change with debouncing
  const handleInputChange = useCallback(
    (value: string) => {
      setSearchInput(value)

      // Clear previous debounce
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }

      // If empty, reset to all dealers
      if (!value.trim()) {
        setLocationPredictions([])
        setDealerResults([])
        setShowDropdown(false)
        onSearch(dealers) // Show all dealers
        return
      }

      debounceRef.current = setTimeout(() => {
        const lowerQuery = value.toLowerCase()
        const searchType = detectSearchType(value)

        // Helper to sort dealers: name matches first, then by distance
        const sortDealers = (dealersToSort: DealerWithDistance[], hasLocation: boolean = false) => {
          return dealersToSort.sort((a, b) => {
            const aNameMatch = a.dealerName?.toLowerCase().includes(lowerQuery) || false
            const bNameMatch = b.dealerName?.toLowerCase().includes(lowerQuery) || false

            // Name matches come first
            if (aNameMatch && !bNameMatch) return -1
            if (!aNameMatch && bNameMatch) return 1

            // If both match or both don't match, sort by distance (if available)
            if (hasLocation && a.distance !== undefined && b.distance !== undefined) {
              return a.distance - b.distance
            }

            // Otherwise alphabetically
            return (a.dealerName || '').localeCompare(b.dealerName || '')
          })
        }

        // Handle different search types
        if (searchType === 'state') {
          // STATE: All dealers in state, name matches first
          const stateQuery = value.toUpperCase()
          const stateName = US_STATES[stateQuery as keyof typeof US_STATES] ||
                           Object.entries(US_STATES).find(([_, name]) =>
                             name.toLowerCase() === lowerQuery
                           )?.[0]

          const stateDealers = dealers.filter((dealer) => {
            const state = dealer.address?.state?.toUpperCase() || ''
            return state === stateQuery || state === stateName
          })

          onSearch(sortDealers(stateDealers))
          setLocationPredictions([])
          setShowDropdown(false)

        } else if (searchType === 'zip' && geocoder) {
          // ZIP: Name matches first, then closest dealers
          geocoder.geocode(
            {
              address: value,
              componentRestrictions: {
                country: 'us',
                postalCode: value
              }
            },
            (results, status) => {
              if (status === 'OK' && results?.[0]) {
                const location = results[0].geometry.location
                const lat = location.lat()
                const lng = location.lng()

                // Calculate distances to all dealers
                const dealersWithDistance = dealers
                  .map((dealer) => {
                    if (!dealer.coordinates?.latitude || !dealer.coordinates?.longitude) {
                      return dealer
                    }

                    const distance = calculateDistance(
                      lat, lng,
                      dealer.coordinates.latitude,
                      dealer.coordinates.longitude
                    )

                    return { ...dealer, distance } as DealerWithDistance
                  })
                  .filter(d => d.coordinates?.latitude && d.coordinates?.longitude)

                // Sort: name matches first, then by distance
                const sorted = sortDealers(dealersWithDistance, true)

                onSearch(sorted, { lat, lng })

                // Show dropdown with the ZIP location
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
          // CITY/LOCATION: Name matches first, then city proximity
          // Filter to dealers in/near this city
          const cityMatches = dealers.filter((dealer) => {
            const city = dealer.address?.city?.toLowerCase() || ''
            const name = dealer.dealerName?.toLowerCase() || ''
            return city.includes(lowerQuery) || name.includes(lowerQuery)
          })

          onSearch(sortDealers(cityMatches))

          // Fetch Google Places autocomplete for city selection
          if (autocompleteService && value.length >= 3) {
            autocompleteService.getPlacePredictions(
              {
                input: value,
                componentRestrictions: { country: 'us' },
                types: ['(cities)'], // Cities only for this mode
              },
              (results, status) => {
                if (status === 'OK' && results) {
                  setLocationPredictions(results)
                  setShowDropdown(true)
                } else {
                  setLocationPredictions([])
                  setShowDropdown(false)
                }
              }
            )
          }
        }
      }, 300) // 300ms debounce
    },
    [autocompleteService, dealers, onSearch, detectSearchType, geocoder, US_STATES]
  )

  // Handle location selection from Google Places
  const handleLocationSelect = useCallback(
    (prediction: google.maps.places.AutocompletePrediction) => {
      if (!geocoder) return

      geocoder.geocode({ placeId: prediction.place_id }, (results, status) => {
        if (status === 'OK' && results?.[0]) {
          const location = results[0].geometry.location
          const lat = location.lat()
          const lng = location.lng()
          const lowerQuery = searchInput.toLowerCase()

          setSearchInput(prediction.description)
          setShowDropdown(false)

          // Calculate distances and update sidebar
          const dealersWithDistance = dealers.map((dealer) => {
            if (!dealer.coordinates?.latitude || !dealer.coordinates?.longitude) {
              return dealer
            }

            const distance = calculateDistance(
              lat,
              lng,
              dealer.coordinates.latitude,
              dealer.coordinates.longitude
            )

            return { ...dealer, distance }
          })

          // Sort: name matches first, then by distance
          const sorted = dealersWithDistance.sort((a, b) => {
            const aNameMatch = a.dealerName?.toLowerCase().includes(lowerQuery) || false
            const bNameMatch = b.dealerName?.toLowerCase().includes(lowerQuery) || false

            // Name matches come first
            if (aNameMatch && !bNameMatch) return -1
            if (!aNameMatch && bNameMatch) return 1

            // Then sort by distance
            if (a.distance !== undefined && b.distance !== undefined) {
              return a.distance - b.distance
            }
            return 0
          })

          onSearch(sorted, { lat, lng })
          onLocationSearch({ lat, lng }, prediction.description)

          // Keep input focused after selection
          setTimeout(() => {
            inputRef.current?.focus()
          }, 0)
        }
      })
    },
    [dealers, onSearch, onLocationSearch, geocoder, searchInput]
  )

  // Use current location
  const handleUseMyLocation = useCallback(() => {
    if (!geocoder) return

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          const coords = { lat: latitude, lng: longitude }

          setCurrentLocation(coords)

          // Reverse geocode to get address
          geocoder.geocode({ location: coords }, (results, status) => {
            if (status === 'OK' && results && results[0]) {
              const addressComponents = results[0].address_components
              const city = addressComponents.find((c) => c.types.includes('locality'))?.long_name
              const state = addressComponents.find((c) =>
                c.types.includes('administrative_area_level_1')
              )?.short_name
              const address = city && state ? `${city}, ${state}` : results[0].formatted_address

              setSearchInput(address)
              onLocationSearch(coords, address)
            }
          })
        },
        (error) => {
          console.error('Geolocation error:', error)
          alert('Unable to access your location. Please enter your location manually.')
        }
      )
    } else {
      alert('Geolocation is not supported by your browser.')
    }
  }, [geocoder, onLocationSearch])

  // Clear search
  const handleClear = useCallback(() => {
    setSearchInput('')
    setLocationPredictions([])
    setDealerResults([])
    setShowDropdown(false)
    setCurrentLocation(null)
    onSearch(dealers) // Reset to all dealers
  }, [dealers, onSearch])

  return (
    <div className={cn("relative", mounted && "search-bar-animate")}>
      {/* Glassmorphism Search Input */}
      <div
        className="relative rounded-2xl shadow-lg border border-white/20"
        style={{
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        }}
      >
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" strokeWidth={2} />
        <input
          ref={inputRef}
          type="text"
          value={searchInput}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Search by name, address, city, state, or ZIP code"
          className="w-full pl-14 pr-40 py-4 rounded-2xl bg-transparent focus:outline-none text-gray-900 placeholder:text-gray-500 font-medium search-input-focus"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {searchInput && (
            <button
              onClick={handleClear}
              className="p-1.5 hover:bg-gray-200/50 rounded-lg transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4 text-gray-600" strokeWidth={2} />
            </button>
          )}
          <button
            onClick={handleUseMyLocation}
            className="px-3 py-2 text-sm font-medium text-kawai-red hover:bg-kawai-red/10 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <MapPin className="w-4 h-4" strokeWidth={2} />
            <span className="hidden sm:inline">My Location</span>
          </button>
        </div>
      </div>

      {/* Dropdown - Only for Location Autocomplete - Appears ABOVE input */}
      {showDropdown && locationPredictions.length > 0 && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
          <div
            className="absolute bottom-full left-0 right-0 mb-2 rounded-2xl shadow-2xl border border-white/20 z-20 max-h-[400px] overflow-y-auto autocomplete-dropdown"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            }}
          >
            {/* Location Predictions - For distance sorting */}
            {locationPredictions.length > 0 && (
              <div>
                <div className="px-4 py-2.5 text-xs font-semibold text-gray-600 uppercase tracking-wider bg-gradient-to-r from-kawai-red/5 to-transparent border-b border-gray-100">
                  📍 Sort by distance from:
                </div>
                {locationPredictions.map((prediction) => (
                  <button
                    key={prediction.place_id}
                    onClick={() => handleLocationSelect(prediction)}
                    className="w-full px-4 py-3 text-left hover:bg-kawai-red/5 transition-colors border-b border-gray-100 last:border-0 group"
                  >
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-kawai-red mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" strokeWidth={2} />
                      <span className="text-sm text-gray-800 font-medium">{prediction.description}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
