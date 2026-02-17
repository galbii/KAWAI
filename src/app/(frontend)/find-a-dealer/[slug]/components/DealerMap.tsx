'use client'

import { useState } from 'react'
import { Map, Marker } from 'react-map-gl/maplibre'
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

export function DealerMap({ dealer }: DealerMapProps) {
  const defaultView = {
    longitude: -98.5795,
    latitude: 39.8283,
    zoom: 4,
  }

  const [viewState, setViewState] = useState(
    dealer.coordinates?.latitude && dealer.coordinates?.longitude
      ? {
          longitude: dealer.coordinates.longitude,
          latitude: dealer.coordinates.latitude,
          zoom: 13,
        }
      : defaultView
  )

  if (!dealer.coordinates?.latitude || !dealer.coordinates?.longitude) {
    return (
      <div className="w-full h-[400px] rounded-2xl bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-center px-6">
          <p className="text-sm text-kawai-black/40 uppercase tracking-wider mb-3">Map unavailable</p>
          {dealer.address && (
            <p className="text-sm text-kawai-black/70 leading-relaxed">
              {dealer.address.street}
              <br />
              {dealer.address.city}, {dealer.address.state} {dealer.address.zipCode}
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-lg">
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle="https://tiles.openfreemap.org/styles/liberty"
        style={{ width: '100%', height: '100%' }}
      >
        {/* Clean kawai-red marker — matches brand */}
        <Marker
          longitude={dealer.coordinates.longitude}
          latitude={dealer.coordinates.latitude}
          anchor="center"
        >
          <div
            className="w-4 h-4 rounded-full bg-kawai-red border-2 border-white"
            style={{ boxShadow: '0 0 0 4px rgba(225, 25, 34, 0.2), 0 2px 8px rgba(0,0,0,0.2)' }}
            title={dealer.dealerName}
          />
        </Marker>
      </Map>
    </div>
  )
}
