'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Map, { Marker, Popup, NavigationControl, useMap } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import type { ShigeruDealerDoc } from './ShigeruDealerGrid'

// OpenFreeMap positron — same provider already working in the main dealer finder,
// already in connect-src CSP. Canvas is CSS-inverted below for the dark look.
const MAP_STYLE = 'https://tiles.openfreemap.org/styles/positron'

const f = { fontFamily: 'var(--font-oswald)' }

// ── Gold SVG pin ─────────────────────────────────────────────────────
function GoldPin({ active, featured }: { active?: boolean; featured?: boolean | null | undefined }) {
  const fill = active ? '#d5c78c' : featured ? 'rgba(213,199,140,0.8)' : 'rgba(213,199,140,0.5)'
  return (
    <svg width="22" height="28" viewBox="0 0 22 28" fill="none">
      <path
        d="M11 0C4.925 0 0 4.925 0 11c0 7.333 11 17 11 17S22 18.333 22 11C22 4.925 17.075 0 11 0Z"
        fill={fill}
      />
      <circle cx="11" cy="11" r="4" fill="#0a0a0a" />
    </svg>
  )
}

// ── BoundsFitter — must be inside <Map>, waits for load event ────────
function BoundsFitter({ dealers }: { dealers: ShigeruDealerDoc[] }) {
  const { current: map } = useMap()

  useEffect(() => {
    if (!map) return

    const coords = dealers
      .map((d) => ({ lat: d.coordinates?.latitude, lng: d.coordinates?.longitude }))
      .filter((c): c is { lat: number; lng: number } =>
        typeof c.lat === 'number' && typeof c.lng === 'number' && c.lat !== 0 && c.lng !== 0,
      )

    if (coords.length === 0) return

    const fit = () => {
      if (coords.length === 1) {
        const c = coords[0]!
        map.flyTo({ center: [c.lng, c.lat], zoom: 10, duration: 900 })
        return
      }
      const lngs = coords.map((c) => c.lng)
      const lats = coords.map((c) => c.lat)
      map.fitBounds(
        [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]],
        { padding: 60, duration: 900, maxZoom: 10 },
      )
    }

    // If map is already loaded, fit immediately; otherwise wait for load
    if (map.loaded()) {
      fit()
    } else {
      map.once('load', fit)
    }
  }, [map, dealers])

  return null
}

// ── Popup card ───────────────────────────────────────────────────────
function DealerPopup({
  dealer,
  onClose,
}: {
  dealer: ShigeruDealerDoc
  onClose: () => void
}) {
  const lat = dealer.coordinates?.latitude
  const lng = dealer.coordinates?.longitude
  if (typeof lat !== 'number' || typeof lng !== 'number') return null

  const location = [dealer.address?.city, dealer.address?.state].filter(Boolean).join(', ')
  const phone = dealer.contactInfo?.phone
  const website = dealer.contactInfo?.website

  return (
    <Popup
      longitude={lng}
      latitude={lat}
      anchor="bottom"
      offset={30}
      closeButton={false}
      closeOnClick={false}
      onClose={onClose}
      maxWidth="260px"
      style={{ padding: 0 }}
    >
      {/* Inline styles only — MapLibre popup resets class-based styles */}
      <div
        style={{
          background: 'rgba(10,10,10,0.97)',
          border: '1px solid rgba(213,199,140,0.2)',
          borderRadius: '10px',
          overflow: 'hidden',
          minWidth: '220px',
          fontFamily: 'var(--font-oswald)',
        }}
      >
        <div style={{ height: '2px', background: 'rgba(213,199,140,0.45)' }} />
        <div style={{ padding: '14px 16px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.9)', fontSize: '14px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', lineHeight: 1.25 }}>
              {dealer.dealerName}
            </p>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', padding: '2px', lineHeight: 1, flexShrink: 0 }}
              aria-label="Close"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1.5 1.5L10.5 10.5M10.5 1.5L1.5 10.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {location && (
            <p style={{ margin: '6px 0 0', color: 'rgba(213,199,140,0.6)', fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
              {location}
            </p>
          )}

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.07)', margin: '12px 0' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            {phone && (
              <a href={`tel:${phone.replace(/\D/g, '')}`} style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', textDecoration: 'none' }}>
                {phone}
              </a>
            )}
            {website && (
              <a
                href={website.startsWith('http') ? website : `https://${website}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'rgba(213,199,140,0.65)', fontSize: '12px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}
              >
                Visit Website
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                  <path d="M1 8L8 1M8 1H3M8 1V6" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </Popup>
  )
}

// ── Main component ───────────────────────────────────────────────────
export default function ShigeruDealerMap({ dealers }: { dealers: ShigeruDealerDoc[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  // Close popup when the dealer list changes (region filter switch)
  useEffect(() => { setSelectedId(null) }, [dealers])

  const selectedDealer = dealers.find((d) => d.id === selectedId) ?? null

  const handleMarkerClick = useCallback((id: string) => {
    setSelectedId((prev) => (prev === id ? null : id))
  }, [])

  const mappable = dealers.filter(
    (d) =>
      typeof d.coordinates?.latitude === 'number' &&
      typeof d.coordinates?.longitude === 'number' &&
      d.coordinates.latitude !== 0 &&
      d.coordinates.longitude !== 0,
  )

  return (
    <div className="sk-map-dark" style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
      {/* Map — explicit pixel height required by react-map-gl */}
      <Map
        id="shigeru-dealer-map"
        initialViewState={{ longitude: -96, latitude: 40, zoom: 3.2 }}
        style={{ width: '100%', height: '480px' }}
        mapStyle={MAP_STYLE}
        attributionControl={false}
        reuseMaps
      >
        <BoundsFitter dealers={mappable} />

        <NavigationControl position="top-right" showCompass={false} />

        {mappable.map((dealer) => {
          const lat = dealer.coordinates!.latitude!
          const lng = dealer.coordinates!.longitude!
          const isSelected = dealer.id === selectedId
          return (
            <Marker
              key={dealer.id}
              longitude={lng}
              latitude={lat}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent.stopPropagation()
                handleMarkerClick(dealer.id)
              }}
              style={{ cursor: 'pointer', zIndex: isSelected ? 10 : 1 }}
            >
              <div style={{ transform: isSelected ? 'scale(1.3)' : 'scale(1)', transition: 'transform 0.15s ease' }}>
                <GoldPin active={isSelected} featured={dealer.isFeatured ?? null} />
              </div>
            </Marker>
          )
        })}

        {selectedDealer && (
          <DealerPopup dealer={selectedDealer} onClose={() => setSelectedId(null)} />
        )}
      </Map>

      {/* Location count badge */}
      <div
        style={{
          position: 'absolute',
          bottom: 12,
          left: 12,
          background: 'rgba(10,10,10,0.85)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '20px',
          padding: '5px 12px',
          pointerEvents: 'none',
        }}
      >
        <span style={{ ...f, color: 'rgba(213,199,140,0.65)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          {mappable.length} of {dealers.length} locations mapped
        </span>
      </div>
    </div>
  )
}
