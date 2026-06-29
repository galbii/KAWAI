'use client'

import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { Map, Marker, type MapRef } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import './stores-map.css'
import Image from 'next/image'
import Link from 'next/link'
import type { StorePin } from './stores-types'

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function getBounds(pins: StorePin[]): [[number, number], [number, number]] | null {
  if (pins.length === 0) return null
  const lngs = pins.map((p) => p.longitude)
  const lats = pins.map((p) => p.latitude)
  return [
    [Math.min(...lngs) - 1.5, Math.min(...lats) - 1],
    [Math.max(...lngs) + 1.5, Math.max(...lats) + 1],
  ]
}

function displayCity(pin: StorePin): string {
  return pin.locationName.replace(/^kawai\s+/i, '').trim() || pin.address.city || pin.locationName
}

type PinWithDist = StorePin & { distance?: number }

function IconRow({ icon, children }: { icon: 'pin' | 'phone'; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5">
      <div
        className="flex-shrink-0 flex items-center justify-center rounded-full mt-0.5"
        style={{ width: 20, height: 20, background: 'rgba(225,25,34,0.08)' }}
      >
        {icon === 'pin' ? (
          <svg width="9" height="9" viewBox="0 0 24 24" fill="#E11922">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
        ) : (
          <svg width="9" height="9" viewBox="0 0 24 24" fill="#E11922">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
          </svg>
        )}
      </div>
      <span
        className="text-kawai-muted leading-snug font-[family-name:var(--font-brand-sans)]"
        style={{ fontSize: '0.72rem' }}
      >
        {children}
      </span>
    </div>
  )
}

interface Props {
  pins: StorePin[]
  selectedId: string | null
  onStoreSelect: (id: string | null) => void
}

export function StoresMapClient({ pins, selectedId, onStoreSelect }: Props) {
  const mapRef = useRef<MapRef>(null)
  const [query, setQuery] = useState('')
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationLoading, setLocationLoading] = useState(false)
  const selectedCardRef = useRef<HTMLButtonElement>(null)
  const bounds = getBounds(pins)

  useEffect(() => {
    if (!selectedId) return
    const pin = pins.find((p) => p.id === selectedId)
    if (!pin) return
    mapRef.current?.flyTo({ center: [pin.longitude, pin.latitude], zoom: 13, duration: 900, essential: true })
    setTimeout(() => selectedCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 150)
  }, [selectedId, pins])

  const handleUseLocation = useCallback(() => {
    if (!navigator.geolocation) return
    setLocationLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => { setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setLocationLoading(false) },
      () => setLocationLoading(false),
      { timeout: 8000 }
    )
  }, [])

  const filteredPins = useMemo((): PinWithDist[] => {
    let result: PinWithDist[] = [...pins]
    if (query.trim()) {
      const q = query.toLowerCase()
      result = result.filter(
        (p) => p.locationName.toLowerCase().includes(q) || p.address.city?.toLowerCase().includes(q) || p.address.state?.toLowerCase().includes(q) || p.address.zipCode?.includes(q)
      )
    }
    if (userLocation) {
      result = result
        .map((p) => ({ ...p, distance: haversine(userLocation.lat, userLocation.lng, p.latitude, p.longitude) }))
        .sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0))
    }
    return result
  }, [pins, query, userLocation])

  return (
    <div className="relative overflow-hidden" style={{ height: '680px' }}>
      {/* Map */}
      <Map
        ref={mapRef}
        initialViewState={
          bounds
            ? { bounds, fitBoundsOptions: { padding: { top: 60, bottom: 60, left: 360, right: 60 }, maxZoom: 10 } }
            : { longitude: -98.5795, latitude: 39.8283, zoom: 4 }
        }
        mapStyle="https://tiles.openfreemap.org/styles/liberty"
        style={{ width: '100%', height: '100%' }}
        onClick={() => onStoreSelect(null)}
      >
        {pins.map((pin) => (
          <Marker key={pin.id} longitude={pin.longitude} latitude={pin.latitude} anchor="bottom"
            onClick={(e) => { e.originalEvent.stopPropagation(); onStoreSelect(selectedId === pin.id ? null : pin.id) }}
          >
            <img
              src="/ChatGPT%20Image%20Sep%209%2C%202025%2C%2003_13_02%20PM%20copy%202.png"
              alt={pin.locationName}
              className={`stores-marker${selectedId === pin.id ? ' selected' : ''}`}
              style={{ width: selectedId === pin.id ? 42 : 30, height: selectedId === pin.id ? 42 : 30 }}
            />
          </Marker>
        ))}
      </Map>

      {/* ── Sidebar overlay ── */}
      <div
        className="absolute top-0 left-0 bottom-0 flex flex-col"
        style={{
          width: '320px',
          background: 'rgba(255,255,255,0.96)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRight: '1px solid rgba(219,219,219,0.4)',
          zIndex: 10,
        }}
      >
        {/* ── Header ── */}
        <div className="flex-shrink-0 px-5 pt-5 pb-4" style={{ borderBottom: '1px solid #EDEBE8' }}>
          {/* Kawai logo */}
          <div className="flex items-center justify-between mb-4">
            <Image
              src="/images/Kawai (Red)(2).png"
              alt="KAWAI"
              width={80}
              height={24}
              className="h-5 w-auto"
            />
            <span
              className="font-[family-name:var(--font-brand-sans)] text-kawai-muted tabular-nums"
              style={{ fontSize: '0.68rem' }}
            >
              {filteredPins.length} {filteredPins.length === 1 ? 'location' : 'locations'}
            </span>
          </div>

          {/* Search */}
          <div className="relative mb-2.5">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: 'rgba(44,44,44,0.3)' }}
              width="12" height="12" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              aria-label="Search stores by city or state"
              placeholder="Search city or state…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 font-[family-name:var(--font-brand-sans)] text-kawai-black placeholder-kawai-charcoal/30 focus:outline-none transition-colors"
              style={{
                fontSize: '0.75rem',
                background: '#F7F5F2',
                border: '1px solid transparent',
                borderRadius: '4px',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#E11922')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'transparent')}
            />
          </div>

          {/* Use my location */}
          <button
            onClick={handleUseLocation}
            disabled={locationLoading}
            className="flex items-center gap-1.5 w-full py-1.5 text-kawai-red hover:text-kawai-red/70 transition-colors disabled:opacity-40"
            style={{ fontSize: '0.68rem' }}
          >
            {locationLoading ? (
              <div className="rounded-full border-[1.5px] border-kawai-red/25 border-t-kawai-red flex-shrink-0"
                style={{ width: 12, height: 12, animation: 'spin 0.8s linear infinite' }}
              />
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                <circle cx="12" cy="12" r="3" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
                <path d="M12 7a5 5 0 1 0 5 5" />
              </svg>
            )}
            <span className="font-[family-name:var(--font-brand-sans)] font-semibold uppercase tracking-[0.1em]">
              {userLocation ? 'Sorted by distance' : 'Use my location'}
            </span>
          </button>
        </div>

        {/* ── Store list ── */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {filteredPins.length === 0 ? (
            <div className="p-8 text-center">
              <p className="font-[family-name:var(--font-family-cormorant)] italic text-kawai-black/25" style={{ fontSize: '1rem' }}>
                No locations found
              </p>
            </div>
          ) : (
            filteredPins.map((pin) => {
              const isSelected = selectedId === pin.id
              const city = displayCity(pin)
              return (
                <button
                  key={pin.id}
                  ref={isSelected ? selectedCardRef : undefined}
                  onClick={() => onStoreSelect(isSelected ? null : pin.id)}
                  className="w-full text-left transition-colors duration-200"
                  style={{
                    borderBottom: '1px solid #EDEBE8',
                    background: isSelected ? 'rgba(225,25,34,0.03)' : 'transparent',
                  }}
                >
                  <div className="flex">
                    {/* Selected accent */}
                    <div className="flex-shrink-0 bg-kawai-red transition-all duration-300" style={{ width: isSelected ? 3 : 0 }} />

                    <div className="flex-1 px-5 py-4">
                      {/* Kawai logo */}
                      <Image
                        src="/images/Kawai (Red)(2).png"
                        alt="KAWAI"
                        width={52}
                        height={16}
                        className="h-3 w-auto mb-1.5"
                      />

                      {/* City + distance */}
                      <div className="flex items-baseline justify-between gap-2">
                        <h3
                          className="font-[family-name:var(--font-brand-sans)] text-kawai-black font-black uppercase leading-none"
                          style={{ fontSize: '1rem', letterSpacing: '0.03em' }}
                        >
                          {city}
                        </h3>
                        {pin.distance !== undefined && (
                          <span className="text-kawai-muted font-[family-name:var(--font-brand-sans)] tabular-nums flex-shrink-0" style={{ fontSize: '0.65rem' }}>
                            {pin.distance.toFixed(0)} mi
                          </span>
                        )}
                      </div>

                      {/* Red underline */}
                      <div className="mt-1.5 mb-3 h-[2px] bg-kawai-red transition-all duration-500" style={{ width: isSelected ? '40px' : '24px' }} />

                      {/* Address */}
                      {(pin.address.street || pin.address.city) && (
                        <IconRow icon="pin">
                          {[pin.address.street, [pin.address.city, pin.address.state, pin.address.zipCode].filter(Boolean).join(', ')].filter(Boolean).join(', ')}
                        </IconRow>
                      )}

                      {/* Expanded */}
                      {isSelected && (
                        <div className="mt-2.5 space-y-2">
                          {pin.phone && <IconRow icon="phone">{pin.phone}</IconRow>}
                          <div className="pt-3 flex flex-col gap-1.5">
                            <Link
                              href={`/store/${pin.slug}`}
                              onClick={(e) => e.stopPropagation()}
                              className="block text-center bg-kawai-red text-white font-[family-name:var(--font-brand-sans)] font-bold uppercase tracking-[0.12em] py-2.5 hover:bg-kawai-red/90 transition-colors"
                              style={{ fontSize: '0.6rem', borderRadius: '2px' }}
                            >
                              Visit Showroom
                            </Link>
                            {pin.address.street && (
                              <a
                                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent([pin.address.street, pin.address.city, pin.address.state, pin.address.zipCode].filter(Boolean).join(', '))}`}
                                target="_blank" rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="block text-center border border-kawai-neutral text-kawai-charcoal/70 font-[family-name:var(--font-brand-sans)] font-semibold uppercase tracking-[0.1em] py-2.5 hover:border-kawai-red hover:text-kawai-red transition-colors"
                                style={{ fontSize: '0.6rem', borderRadius: '2px' }}
                              >
                                Get Directions
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              )
            })
          )}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
