'use client'

import { useState } from 'react'
import { Map, Marker } from 'react-map-gl/maplibre'
import { MapPin } from 'lucide-react'
import 'maplibre-gl/dist/maplibre-gl.css'
import '../dealer-map.css'

interface Coordinates {
  latitude: number
  longitude: number
}

interface Address {
  street: string
  city: string
  state: string
  zipCode: string
}

interface DealerMapProps {
  dealer: {
    dealerName: string
    coordinates?: Coordinates | null
    address?: Address | null
  }
}

/**
 * DealerMap Component - Premium Redesign
 *
 * Interactive map with refined styling featuring:
 * - Elegant rounded corners
 * - Enhanced pin design with gold accent
 * - Better fallback message styling
 * - Smooth interactions
 */
export function DealerMap({ dealer }: DealerMapProps) {
  // Default view to center of US if no coordinates
  const defaultView = {
    longitude: -98.5795,
    latitude: 39.8283,
    zoom: 4,
  }

  // Use dealer coordinates if available, otherwise use default
  const [viewState, setViewState] = useState(
    dealer.coordinates?.latitude && dealer.coordinates?.longitude
      ? {
          longitude: dealer.coordinates.longitude,
          latitude: dealer.coordinates.latitude,
          zoom: 12,
        }
      : defaultView
  )

  // Handle missing coordinates
  if (!dealer.coordinates?.latitude || !dealer.coordinates?.longitude) {
    return (
      <div
        className="w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center border-2 border-gray-200 shadow-lg overflow-hidden"
        style={{
          height: 'clamp(300px, 100%, 450px)',
        }}
      >
        <div className="text-center px-6 py-8">
          <div className="inline-flex items-center justify-center p-4 bg-kawai-gold/10 rounded-full mb-4">
            <MapPin className="w-8 h-8 text-kawai-gold" strokeWidth={2.5} />
          </div>
          <p className="text-gray-700 font-bold text-lg mb-3">Map not available</p>
          {dealer.address && (
            <div className="bg-white px-6 py-4 rounded-xl shadow-sm border border-gray-200 max-w-sm mx-auto">
              <p className="text-sm text-gray-600 leading-relaxed">
                {dealer.address.street}
                <br />
                {dealer.address.city}, {dealer.address.state} {dealer.address.zipCode}
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      className="w-full rounded-2xl overflow-hidden shadow-xl border-2 border-gray-200 hover:border-kawai-gold/30 transition-colors duration-300"
      style={{
        height: 'clamp(300px, 100%, 450px)',
      }}
    >
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle="https://tiles.openfreemap.org/styles/liberty"
        style={{ width: '100%', height: '100%' }}
      >
        {/* Premium Dealer Marker with Gold Accent */}
        <Marker
          longitude={dealer.coordinates.longitude}
          latitude={dealer.coordinates.latitude}
          anchor="bottom"
        >
          {/* Enhanced Custom Pin SVG with gold accent */}
          <svg
            width={48}
            height={48}
            viewBox="0 0 24 24"
            fill="none"
            style={{
              cursor: 'pointer',
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
            }}
            className="transition-transform duration-300 hover:scale-110"
          >
            {/* Outer glow */}
            <circle cx="12" cy="9" r="8" fill="#D4AF37" opacity="0.2" />

            {/* Pin shape with gradient */}
            <defs>
              <linearGradient id="pinGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#C41E3A" />
                <stop offset="100%" stopColor="#8B1825" />
              </linearGradient>
            </defs>
            <path
              d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
              fill="url(#pinGradient)"
              stroke="#D4AF37"
              strokeWidth="1.5"
            />

            {/* Inner circle with gold border */}
            <circle cx="12" cy="9" r="3.5" fill="#FFFFFF" />
            <circle cx="12" cy="9" r="2.5" fill="#D4AF37" />
          </svg>
        </Marker>
      </Map>
    </div>
  )
}
