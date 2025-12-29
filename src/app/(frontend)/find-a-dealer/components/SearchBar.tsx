'use client'

import { useState, useCallback, useEffect } from 'react'
import { Search, MapPin, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useMapsLibrary } from '@vis.gl/react-google-maps'

interface Props {
  onLocationSearch: (location: { lat: number; lng: number }, address: string) => void
  onFilterToggle: () => void
  activeFiltersCount: number
}

export function SearchBar({ onLocationSearch, onFilterToggle, activeFiltersCount }: Props) {
  const [searchInput, setSearchInput] = useState('')
  const [autocompleteService, setAutocompleteService] = useState<google.maps.places.AutocompleteService | null>(null)
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null)
  const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([])
  const [showPredictions, setShowPredictions] = useState(false)

  const placesLibrary = useMapsLibrary('places')
  const geocodingLibrary = useMapsLibrary('geocoding')

  // Initialize autocomplete service
  useEffect(() => {
    if (placesLibrary) {
      setAutocompleteService(new placesLibrary.AutocompleteService())
    }
  }, [placesLibrary])

  // Initialize geocoder
  useEffect(() => {
    if (geocodingLibrary) {
      setGeocoder(new geocodingLibrary.Geocoder())
    }
  }, [geocodingLibrary])

  // Handle autocomplete predictions
  const handleInputChange = useCallback((value: string) => {
    setSearchInput(value)

    if (!autocompleteService || value.length < 3) {
      setPredictions([])
      setShowPredictions(false)
      return
    }

    autocompleteService.getPlacePredictions(
      {
        input: value,
        componentRestrictions: { country: 'us' },
        types: ['(cities)']
      },
      (results, status) => {
        if (status === 'OK' && results) {
          setPredictions(results)
          setShowPredictions(true)
        } else {
          setPredictions([])
          setShowPredictions(false)
        }
      }
    )
  }, [autocompleteService])

  // Geocode selected place
  const handlePlaceSelect = useCallback((prediction: google.maps.places.AutocompletePrediction) => {
    if (!geocoder) return

    geocoder.geocode({ placeId: prediction.place_id }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const location = results[0].geometry.location
        onLocationSearch(
          { lat: location.lat(), lng: location.lng() },
          prediction.description
        )
        setSearchInput(prediction.description)
        setShowPredictions(false)
      }
    })
  }, [geocoder, onLocationSearch])

  // Use current location
  const handleUseMyLocation = useCallback(() => {
    if (!geocoder) return

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords

          // Reverse geocode to get address
          geocoder.geocode(
            { location: { lat: latitude, lng: longitude } },
            (results, status) => {
              if (status === 'OK' && results && results[0]) {
                const addressComponents = results[0].address_components
                const city = addressComponents.find(c => c.types.includes('locality'))?.long_name
                const state = addressComponents.find(c => c.types.includes('administrative_area_level_1'))?.short_name
                const address = city && state ? `${city}, ${state}` : results[0].formatted_address

                setSearchInput(address)
                onLocationSearch({ lat: latitude, lng: longitude }, address)
              }
            }
          )
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

  return (
    <div className="relative">
      <div className="flex items-center gap-3">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Enter city, state, or ZIP code"
            className="w-full pl-12 pr-32 py-3 rounded-lg border border-gray-300 focus:border-kawai-red focus:ring-2 focus:ring-kawai-red/20 outline-none transition-colors text-black placeholder:text-gray-400"
          />
          <button
            onClick={handleUseMyLocation}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 text-sm text-kawai-red hover:bg-kawai-red/10 rounded-md transition-colors flex items-center gap-1"
          >
            <MapPin className="w-4 h-4" />
            <span className="hidden sm:inline">Use My Location</span>
          </button>
        </div>

        {/* Filter Toggle Button */}
        <Button
          onClick={onFilterToggle}
          variant="outline"
          className="hidden md:flex items-center gap-2 px-4 py-3 h-auto border-black text-black hover:bg-gray-100"
        >
          <SlidersHorizontal className="w-5 h-5" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="ml-1 px-2 py-0.5 text-xs bg-kawai-red text-white rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </Button>

        {/* Mobile Filter Button */}
        <button
          onClick={onFilterToggle}
          className="md:hidden p-3 border border-black rounded-lg hover:bg-gray-100 transition-colors relative"
        >
          <SlidersHorizontal className="w-5 h-5 text-black" />
          {activeFiltersCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs bg-kawai-red text-white rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Autocomplete Predictions */}
      {showPredictions && predictions.length > 0 && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowPredictions(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
            {predictions.map((prediction) => (
              <button
                key={prediction.place_id}
                onClick={() => handlePlaceSelect(prediction)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
              >
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{prediction.description}</span>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
