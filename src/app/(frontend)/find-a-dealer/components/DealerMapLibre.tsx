'use client'

import { useEffect, useState, useCallback } from 'react'
import { Map, Marker, Popup } from 'react-map-gl/maplibre'
import type { MapLibreEvent } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import './dealer-map.css'
import type { Dealer } from '@/payload-types'
import type { DealerWithDistance } from '../types'
import { Phone, Navigation, Star, Globe, MapPin, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { trackCTAClick } from '@/lib/analytics/unified-tracking'

interface Props {
  dealers: DealerWithDistance[]
  searchCenter: { lat: number; lng: number } | null
  searchRadius: number
  selectedDealer: string | null
  onMarkerClick: (dealerId: string | null) => void
}

export function DealerMapLibre({
  dealers,
  searchCenter,
  searchRadius,
  selectedDealer,
  onMarkerClick
}: Props) {
  // Controlled map state
  const [viewState, setViewState] = useState({
    longitude: -98.5795,
    latitude: 39.8283,
    zoom: 4,
    pitch: 0,
    bearing: 0
  })

  const [activePopup, setActivePopup] = useState<string | null>(null)

  // Inject 3D building extrusions after the liberty style loads
  const handleMapLoad = useCallback((event: MapLibreEvent) => {
    const map = event.target
    if (map.getSource('ofm-buildings')) return

    // Add a dedicated OpenFreeMap planet source for building extrusions
    // (separate from the style's internal source — this is the official approach)
    map.addSource('ofm-buildings', {
      url: 'https://tiles.openfreemap.org/planet',
      type: 'vector',
    })

    // Insert buildings beneath label layers so text stays readable
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

  // Update map center and zoom when search location changes — flat view, no tilt
  useEffect(() => {
    if (searchCenter) {
      setViewState(prev => ({
        ...prev,
        longitude: searchCenter.lng,
        latitude: searchCenter.lat,
        zoom: 12,
        pitch: 0,
        bearing: 0,
      }))
    }
  }, [searchCenter])

  // Center map and show popup when dealer is selected from list
  useEffect(() => {
    if (selectedDealer) {
      const dealer = dealers.find(d => d.id === selectedDealer)
      if (dealer?.coordinates?.latitude && dealer?.coordinates?.longitude) {
        const lat = dealer.coordinates.latitude
        const lng = dealer.coordinates.longitude
        // Center map on selected dealer with 3D tilt
        // Offset latitude slightly north so the popup (anchored above the marker)
        // appears centered in the viewport rather than the raw coordinates.
        const LAT_OFFSET = 0.022
        setViewState(prev => ({
          ...prev,
          longitude: lng,
          latitude: lat + LAT_OFFSET,
          zoom: 13,
          pitch: 45,
          bearing: -17.6,
        }))
        // Show popup for selected dealer
        setActivePopup(selectedDealer)
      }
    } else {
      // Clear popup when dealer is deselected
      setActivePopup(null)
    }
  }, [selectedDealer, dealers])

  const handleMarkerClick = useCallback((dealerId: string, e: any) => {
    e.originalEvent.stopPropagation()
    setActivePopup(dealerId)
    onMarkerClick(dealerId)
  }, [onMarkerClick])

  const handlePopupClose = useCallback(() => {
    setActivePopup(null)
    onMarkerClick(null)
    // Return to flat search view, or USA overview if no search has been made
    if (searchCenter) {
      setViewState(prev => ({
        ...prev,
        longitude: searchCenter.lng,
        latitude: searchCenter.lat,
        zoom: 12,
        pitch: 0,
        bearing: 0,
      }))
    } else {
      setViewState({
        longitude: -98.5795,
        latitude: 39.8283,
        zoom: 4,
        pitch: 0,
        bearing: 0,
      })
    }
  }, [onMarkerClick, searchCenter])

  const handleMapClick = useCallback(() => {
    setActivePopup(null)
    onMarkerClick(null)
    // Un-tilt when dismissing popup by clicking the map
    setViewState(prev => ({ ...prev, pitch: 0, bearing: 0 }))
  }, [onMarkerClick])

  return (
    <Map
      {...viewState}
      onMove={evt => setViewState(evt.viewState)}
      onClick={handleMapClick}
      onLoad={handleMapLoad}
      mapStyle="https://tiles.openfreemap.org/styles/liberty"
      style={{ width: '100%', height: '100%' }}
      maxPitch={85}
      canvasContextAttributes={{ antialias: true }}
    >
      {/* Dealer Markers */}
      {dealers.map(dealer => {
        if (!dealer.coordinates?.latitude || !dealer.coordinates?.longitude) {
          return null
        }

        const position = {
          longitude: dealer.coordinates.longitude,
          latitude: dealer.coordinates.latitude
        }

        const isSelected = selectedDealer === dealer.id
        const isShigeru = dealer.shigeruKawaiDealer === true

        return (
          <Marker
            key={dealer.id}
            {...position}
            anchor="bottom"
            onClick={(e) => handleMarkerClick(dealer.id as string, e)}
          >
            {/* KAWAI Custom Marker with Selection Overlay */}
            <div style={{ position: 'relative', display: 'inline-block' }}>
              {/* Selection pulse ring */}
              {isSelected && (
                <div
                  className="selected-marker-pulse"
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: isShigeru ? 'rgba(255, 172, 41, 0.2)' : 'rgba(225, 25, 34, 0.15)',
                    border: `3px solid ${isShigeru ? '#FFAC29' : '#E11922'}`,
                    zIndex: -1,
                  }}
                />
              )}
              <img
                src={isShigeru ? '/KAWAI ICON Gold.png' : '/ChatGPT%20Image%20Sep%209%2C%202025%2C%2003_13_02%20PM%20copy%202.png'}
                alt="KAWAI Dealer"
                style={{
                  width: isSelected ? 48 : isShigeru ? 40 : 32,
                  height: isSelected ? 48 : isShigeru ? 40 : 32,
                  cursor: 'pointer',
                  transition: 'all 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
                  filter: isShigeru
                    ? isSelected
                      ? 'drop-shadow(0 4px 12px rgba(255, 172, 41, 0.85))'
                      : 'drop-shadow(0 2px 8px rgba(255, 172, 41, 0.65))'
                    : isSelected
                      ? 'drop-shadow(0 4px 8px rgba(225, 25, 34, 0.7)) brightness(1.1)'
                      : 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                  transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                  position: 'relative',
                  zIndex: 1,
                }}
              />
            </div>
          </Marker>
        )
      })}

      {/* Popup Info Window */}
      {activePopup && dealers.find(d => d.id === activePopup) && (() => {
        const dealer = dealers.find(d => d.id === activePopup)!

        if (!dealer.coordinates?.latitude || !dealer.coordinates?.longitude) {
          return null
        }

        const hasShigeru = dealer.shigeruKawaiDealer === true
        const hasAcoustic = dealer.acousticPianoDealer === true
        const hasProfessional = dealer.professionalProductDealer === true

        return (
          <Popup
            longitude={dealer.coordinates.longitude}
            latitude={dealer.coordinates.latitude}
            anchor="bottom"
            offset={40}
            onClose={handlePopupClose}
            closeButton={true}
            closeOnClick={false}
            className="dealer-popup"
          >
            <div className="p-5 w-full">
              {/* Header with Featured Badge */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-kawai-charcoal leading-tight mb-1">
                    {dealer.dealerName}
                  </h3>
                  {/* Location */}
                  {dealer.address && (
                    <div className="flex items-center gap-2 text-sm text-kawai-charcoal/60">
                      <MapPin className="w-4 h-4 text-kawai-charcoal/40 flex-shrink-0" strokeWidth={2} />
                      <span>
                        {dealer.address.city}, {dealer.address.state}
                      </span>
                    </div>
                  )}
                </div>
                {dealer.isFeatured && (
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-kawai-gold/10 text-kawai-gold text-xs font-semibold rounded-md border border-kawai-gold/20 flex-shrink-0">
                    <Star className="w-3 h-3" fill="currentColor" strokeWidth={0} />
                    Featured
                  </div>
                )}
              </div>

              {/* Dealer Type Badges */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {hasShigeru && (
                  <span className="px-2.5 py-1 bg-kawai-gold/10 text-kawai-gold text-xs font-semibold tracking-wide uppercase rounded border border-kawai-gold/25">
                    Shigeru Kawai
                  </span>
                )}
                {hasAcoustic && (
                  <span className="px-2.5 py-1 bg-kawai-charcoal/5 text-kawai-charcoal/60 text-xs font-semibold tracking-wide uppercase rounded border border-kawai-charcoal/10">
                    Acoustic
                  </span>
                )}
                {hasProfessional && (
                  <span className="px-2.5 py-1 bg-kawai-red/5 text-kawai-red/80 text-xs font-semibold tracking-wide uppercase rounded border border-kawai-red/15">
                    Professional
                  </span>
                )}
              </div>

              {/* Distance Badge */}
              {dealer.distance !== undefined && (
                <div className="inline-flex items-center gap-2 px-3 py-2 bg-kawai-red/5 text-kawai-red text-sm font-semibold rounded-lg border border-kawai-red/10 mb-4">
                  <div className="w-2 h-2 rounded-full bg-kawai-red animate-pulse" />
                  {dealer.distance.toFixed(1)} miles away
                </div>
              )}

              {/* Contact Actions */}
              <div className="space-y-2">
                {/* View Details Button - Primary */}
                {dealer.slug && (
                  <Link
                    href={`/find-a-dealer/${dealer.slug}`}
                    className="flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-kawai-red hover:bg-kawai-red/90 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg group w-full"
                    onClick={(e) => {
                      e.stopPropagation()
                      trackCTAClick({
                        blockType: 'find-a-dealer-page',
                        blockData: {},
                        ctaText: dealer.dealerName || 'View Dealer Details',
                        destination: `/find-a-dealer/${dealer.slug}`,
                        additionalProps: { source: 'map_popup' },
                      })
                    }}
                  >
                    <span>View Dealer Details</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
                  </Link>
                )}

                {/* Secondary Actions Row */}
                <div className="grid grid-cols-2 gap-2">
                  {dealer.contactInfo?.phone && (
                    <a
                      href={`tel:${dealer.contactInfo.phone}`}
                      className="flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium text-kawai-charcoal bg-kawai-pearl hover:bg-kawai-neutral/40 rounded-lg transition-colors border border-kawai-neutral"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Phone className="w-4 h-4" strokeWidth={2} />
                      <span className="hidden sm:inline">Call</span>
                    </a>
                  )}

                  {dealer.contactInfo?.website && (
                    <a
                      href={dealer.contactInfo.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium text-kawai-charcoal bg-kawai-pearl hover:bg-kawai-neutral/40 rounded-lg transition-colors border border-kawai-neutral"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Globe className="w-4 h-4" strokeWidth={2} />
                      <span className="hidden sm:inline">Website</span>
                    </a>
                  )}
                </div>

                {/* Get Directions - Full Width */}
                {dealer.address && (
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                      `${dealer.address.street}, ${dealer.address.city}, ${dealer.address.state} ${dealer.address.zipCode}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-kawai-charcoal bg-kawai-pearl hover:bg-kawai-neutral/40 rounded-lg transition-colors border border-kawai-neutral w-full"
                    onClick={(e) => {
                      e.stopPropagation()
                      trackCTAClick({
                        blockType: 'find-a-dealer-page',
                        blockData: {},
                        ctaText: 'Get Directions',
                        destination: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                          `${dealer.address!.street}, ${dealer.address!.city}, ${dealer.address!.state} ${dealer.address!.zipCode}`
                        )}`,
                        additionalProps: { dealer_name: dealer.dealerName || '', source: 'map_popup' },
                      })
                    }}
                  >
                    <Navigation className="w-4 h-4" strokeWidth={2} />
                    <span>Get Directions</span>
                  </a>
                )}
              </div>
            </div>
          </Popup>
        )
      })()}
    </Map>
  )
}
