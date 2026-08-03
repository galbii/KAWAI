'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Map, Marker, Popup } from 'react-map-gl/maplibre'
import type { MapLibreEvent } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import './dealer-map.css'
import type { Dealer } from '@/payload-types'
import type { DealerWithDistance } from '../types'
import { Phone, Navigation, Globe, MapPin, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { trackCTAClick } from '@/lib/analytics/unified-tracking'

// Separate component so we can attach a non-passive native wheel listener.
// React's synthetic onWheel is passive — stopPropagation() alone can't block scroll.
function DealerPopupContent({ dealer }: { dealer: DealerWithDistance }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const block = (e: WheelEvent) => {
      e.stopPropagation()
      e.preventDefault()
    }
    el.addEventListener('wheel', block, { passive: false })
    return () => el.removeEventListener('wheel', block)
  }, [])

  const hasShigeru = dealer.shigeruKawaiDealer === true
  const hasAcoustic = dealer.acousticPianoDealer === true
  const hasProfessional = dealer.professionalProductDealer === true
  const hasDigital = dealer.digitalPianoDealer === true

  return (
    <div ref={ref}>
      {/* Accent bar */}
      <div className="h-[3px] w-full rounded-t-xl" style={{ background: hasShigeru ? '#C49A00' : '#E11922' }} />

      <div className="px-5 pt-4 pb-5">
        {/* Name + location */}
        <div className="mb-3">
          <h3 className="text-[15px] font-semibold text-kawai-black leading-snug mb-1">
            {dealer.dealerName}
          </h3>
          {dealer.address && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-kawai-charcoal/35 flex-shrink-0" strokeWidth={2} />
              <span className="text-[12px] text-kawai-charcoal/55">
                {[dealer.address.city, dealer.address.state].filter(Boolean).join(', ')}
              </span>
              {dealer.distance !== undefined && (
                <>
                  <span className="text-kawai-charcoal/25 text-[12px]">·</span>
                  <span className="text-[12px] text-kawai-charcoal/45 tabular-nums">
                    {dealer.distance.toFixed(1)} mi
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Type labels */}
        {(hasShigeru || hasAcoustic || hasProfessional || hasDigital) && (
          <div className="flex items-center gap-3 mb-4">
            {hasShigeru && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: '#A07800' }}>
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#C49A00' }} />
                Shigeru Kawai
              </span>
            )}
            {hasAcoustic && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-kawai-charcoal/55">
                <span className="w-1.5 h-1.5 rounded-full bg-kawai-charcoal/35 flex-shrink-0" />
                Acoustic
              </span>
            )}
            {hasDigital && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-kawai-charcoal/55">
                <span className="w-1.5 h-1.5 rounded-full bg-kawai-charcoal/35 flex-shrink-0" />
                Digital
              </span>
            )}
            {hasProfessional && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium" style={{ color: '#C01820' }}>
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#C01820' }} />
                Professional
              </span>
            )}
          </div>
        )}

        <div className="h-px bg-kawai-neutral/60 mb-4" />

        <div className="space-y-2">
          {dealer.slug && (
            <Link
              href={`/find-a-dealer/${dealer.slug}`}
              className="flex items-center justify-center gap-2 py-2.5 text-[12px] font-semibold text-white bg-kawai-black hover:bg-kawai-charcoal rounded-lg transition-colors w-full group"
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
              View Dealer Details
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" strokeWidth={2.5} />
            </Link>
          )}

          <div className="grid grid-cols-2 gap-2">
            {dealer.contactInfo?.phone && (
              <a
                href={`tel:${dealer.contactInfo.phone}`}
                className="flex items-center justify-center gap-1.5 py-2 text-[12px] font-medium text-kawai-charcoal bg-kawai-pearl hover:bg-kawai-neutral/50 rounded-lg transition-colors border border-kawai-neutral"
                onClick={(e) => e.stopPropagation()}
              >
                <Phone className="w-3.5 h-3.5" strokeWidth={2} />
                Call
              </a>
            )}
            {dealer.contactInfo?.website && (
              <a
                href={dealer.contactInfo.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-2 text-[12px] font-medium text-kawai-charcoal bg-kawai-pearl hover:bg-kawai-neutral/50 rounded-lg transition-colors border border-kawai-neutral"
                onClick={(e) => e.stopPropagation()}
              >
                <Globe className="w-3.5 h-3.5" strokeWidth={2} />
                Website
              </a>
            )}
            {dealer.address && (
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                  `${dealer.address.street}, ${dealer.address.city}, ${dealer.address.state} ${dealer.address.zipCode}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="col-span-2 flex items-center justify-center gap-1.5 py-2 text-[12px] font-medium text-kawai-charcoal bg-kawai-pearl hover:bg-kawai-neutral/50 rounded-lg transition-colors border border-kawai-neutral"
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
                <Navigation className="w-3.5 h-3.5" strokeWidth={2} />
                Get Directions
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Compact, non-interactive card shown on marker hover — name, location, and
// dealer types only. Full details (buttons, directions) live in the click popup.
function DealerHoverCard({ dealer }: { dealer: DealerWithDistance }) {
  const hasShigeru = dealer.shigeruKawaiDealer === true
  const hasAcoustic = dealer.acousticPianoDealer === true
  const hasProfessional = dealer.professionalProductDealer === true
  const hasDigital = dealer.digitalPianoDealer === true

  return (
    <div>
      {/* Accent bar */}
      <div className="h-[3px] w-full rounded-t-xl" style={{ background: hasShigeru ? '#C49A00' : '#E11922' }} />

      <div className="px-4 py-3">
        <h3 className="text-[14px] font-semibold text-kawai-black leading-snug mb-0.5">
          {dealer.dealerName}
        </h3>
        {dealer.address && (
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-kawai-charcoal/35 flex-shrink-0" strokeWidth={2} />
            <span className="text-[12px] text-kawai-charcoal/55">
              {[dealer.address.city, dealer.address.state].filter(Boolean).join(', ')}
            </span>
            {dealer.distance !== undefined && (
              <>
                <span className="text-kawai-charcoal/25 text-[12px]">·</span>
                <span className="text-[12px] text-kawai-charcoal/45 tabular-nums">
                  {dealer.distance.toFixed(1)} mi
                </span>
              </>
            )}
          </div>
        )}

        {(hasShigeru || hasAcoustic || hasProfessional || hasDigital) && (
          <div className="flex items-center gap-3 mt-2">
            {hasShigeru && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: '#A07800' }}>
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#C49A00' }} />
                Shigeru Kawai
              </span>
            )}
            {hasAcoustic && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-kawai-charcoal/55">
                <span className="w-1.5 h-1.5 rounded-full bg-kawai-charcoal/35 flex-shrink-0" />
                Acoustic
              </span>
            )}
            {hasDigital && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-kawai-charcoal/55">
                <span className="w-1.5 h-1.5 rounded-full bg-kawai-charcoal/35 flex-shrink-0" />
                Digital
              </span>
            )}
            {hasProfessional && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium" style={{ color: '#C01820' }}>
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#C01820' }} />
                Professional
              </span>
            )}
          </div>
        )}

        <p className="text-[11px] text-kawai-charcoal/40 mt-2.5">Click for details</p>
      </div>
    </div>
  )
}

interface Props {
  dealers: DealerWithDistance[]
  searchCenter: { lat: number; lng: number } | null
  searchRadius: number
  selectedDealer: string | null
  onMarkerClick: (dealerId: string | null) => void
  onInteract?: () => void
  site?: 'us' | 'cad'
}

// Default overview centers — US continental center vs. Canadian populated belt
const DEFAULT_VIEW = {
  us: { longitude: -98.5795, latitude: 39.8283, zoom: 4 },
  cad: { longitude: -96.0, latitude: 55.0, zoom: 3.2 },
} as const

export function DealerMapLibre({
  dealers,
  searchCenter,
  searchRadius,
  selectedDealer,
  onMarkerClick,
  onInteract,
  site = 'us',
}: Props) {
  const defaultView = site === 'cad' ? DEFAULT_VIEW.cad : DEFAULT_VIEW.us

  // Controlled map state
  const [viewState, setViewState] = useState<{
    longitude: number
    latitude: number
    zoom: number
    pitch: number
    bearing: number
  }>({
    longitude: defaultView.longitude,
    latitude: defaultView.latitude,
    zoom: defaultView.zoom,
    pitch: 0,
    bearing: 0,
  })

  const [activePopup, setActivePopup] = useState<string | null>(null)

  // Hovering a marker shows a lightweight, non-interactive preview card (name,
  // location, dealer types). It never moves the camera. Clicking a marker still
  // opens the full interactive popup (buttons + camera tilt) via activePopup.
  const [hoverDealer, setHoverDealer] = useState<string | null>(null)

  const handleMarkerEnter = useCallback((dealerId: string) => {
    setHoverDealer(dealerId)
  }, [])

  const handleMarkerLeave = useCallback(() => {
    setHoverDealer(null)
  }, [])

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

  // Re-center to country default when site changes (e.g. user flips country toggle)
  // Skip if the user has an active search — their search location takes precedence
  useEffect(() => {
    if (searchCenter) return
    setViewState(prev => ({
      ...prev,
      longitude: defaultView.longitude,
      latitude: defaultView.latitude,
      zoom: defaultView.zoom,
      pitch: 0,
      bearing: 0,
    }))
    // defaultView is derived from site — depending on site alone keeps deps stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [site])

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
    setHoverDealer(null) // full popup takes over from the hover card
    onInteract?.()
    setActivePopup(dealerId)
    onMarkerClick(dealerId)
  }, [onMarkerClick, onInteract])

  const handlePopupClose = useCallback(() => {
    setActivePopup(null)
    onMarkerClick(null)
    // Return to flat search view, or country overview if no search has been made
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
        longitude: defaultView.longitude,
        latitude: defaultView.latitude,
        zoom: defaultView.zoom,
        pitch: 0,
        bearing: 0,
      })
    }
  }, [onMarkerClick, searchCenter, defaultView])

  const handleMapClick = useCallback(() => {
    onInteract?.()
    setActivePopup(null)
    onMarkerClick(null)
    // Un-tilt when dismissing popup by clicking the map
    setViewState(prev => ({ ...prev, pitch: 0, bearing: 0 }))
  }, [onMarkerClick, onInteract])

  return (
    <Map
      {...viewState}
      onMove={evt => setViewState(evt.viewState)}
      onClick={handleMapClick}
      onLoad={handleMapLoad}
      onDragStart={() => onInteract?.()}
      onZoomStart={() => onInteract?.()}
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
            <div
              style={{ position: 'relative', display: 'inline-block' }}
              onMouseEnter={() => handleMarkerEnter(dealer.id as string)}
              onMouseLeave={handleMarkerLeave}
            >
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
            <DealerPopupContent dealer={dealer} />
          </Popup>
        )
      })()}

      {/* Lightweight hover preview card — non-interactive, click the marker for full details */}
      {hoverDealer && hoverDealer !== activePopup && dealers.find(d => d.id === hoverDealer) && (() => {
        const dealer = dealers.find(d => d.id === hoverDealer)!

        if (!dealer.coordinates?.latitude || !dealer.coordinates?.longitude) {
          return null
        }

        return (
          <Popup
            longitude={dealer.coordinates.longitude}
            latitude={dealer.coordinates.latitude}
            anchor="bottom"
            offset={40}
            closeButton={false}
            closeOnClick={false}
            className="dealer-popup dealer-hover-card"
          >
            <DealerHoverCard dealer={dealer} />
          </Popup>
        )
      })()}
    </Map>
  )
}
