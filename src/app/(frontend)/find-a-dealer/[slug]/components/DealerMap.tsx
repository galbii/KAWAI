'use client'

import { useState, useCallback } from 'react'
import { Map, Marker } from 'react-map-gl/maplibre'
import type { MapLibreEvent } from 'maplibre-gl'
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
    pitch: 0,
    bearing: 0,
  }

  const [viewState, setViewState] = useState(
    dealer.coordinates?.latitude && dealer.coordinates?.longitude
      ? {
          longitude: dealer.coordinates.longitude,
          latitude: dealer.coordinates.latitude,
          zoom: 15.5,
          pitch: 45,
          bearing: -17.6,
        }
      : defaultView
  )

  const handleMapLoad = useCallback((event: MapLibreEvent) => {
    const map = event.target
    if (map.getSource('ofm-buildings')) return

    map.addSource('ofm-buildings', {
      url: 'https://tiles.openfreemap.org/planet',
      type: 'vector',
    })

    const layers = map.getStyle().layers
    const labelLayerId = layers.find(
      (layer) => layer.type === 'symbol' && (layer.layout as any)?.['text-field']
    )?.id

    map.addLayer({
      id: '3d-buildings',
      source: 'ofm-buildings',
      'source-layer': 'building',
      type: 'fill-extrusion',
      minzoom: 15,
      filter: ['!=', ['get', 'hide_3d'], true],
      paint: {
        'fill-extrusion-color': [
          'interpolate', ['linear'], ['get', 'render_height'],
          0, '#ddd5c8',
          200, '#c8d0da',
          400, '#b8c4d4',
        ],
        'fill-extrusion-height': [
          'interpolate', ['linear'], ['zoom'],
          15, 0,
          16, ['get', 'render_height'],
        ],
        'fill-extrusion-base': [
          'case',
          ['>=', ['get', 'zoom'], 16],
          ['get', 'render_min_height'],
          0,
        ],
        'fill-extrusion-opacity': 0.85,
      },
    } as any, labelLayerId)
  }, [])

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
        onLoad={handleMapLoad}
        mapStyle="https://tiles.openfreemap.org/styles/liberty"
        style={{ width: '100%', height: '100%' }}
        maxPitch={85}
        antialias={true}
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
