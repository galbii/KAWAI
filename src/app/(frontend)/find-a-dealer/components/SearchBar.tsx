'use client'

import { useState, useCallback, useEffect } from 'react'
import { Search, MapPin } from 'lucide-react'
import { useMapsLibrary } from '@vis.gl/react-google-maps'

interface Props {
  onLocationSearch: (location: { lat: number; lng: number }, address: string) => void
}

export function SearchBar({ onLocationSearch }: Props) {
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
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={2} />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Enter city, state, or ZIP code"
          className="w-full pl-12 pr-36 py-3.5 rounded-xl border-2 border-gray-200 focus:border-kawai-charcoal focus:ring-4 focus:ring-kawai-charcoal/5 outline-none transition-all text-gray-900 placeholder:text-gray-400 font-medium"
        />
        <button
          onClick={handleUseMyLocation}
          className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1.5 text-sm font-medium text-kawai-red hover:bg-kawai-red/5 rounded-lg transition-colors flex items-center gap-1.5"
        >
          <MapPin className="w-4 h-4" strokeWidth={2} />
          <span className="hidden sm:inline">Use My Location</span>
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
