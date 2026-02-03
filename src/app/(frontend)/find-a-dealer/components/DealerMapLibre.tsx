'use client'

import { useEffect, useState, useCallback } from 'react'
import { Map, Marker, Popup } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import './dealer-map.css'
import type { Dealer } from '@/payload-types'
import { Phone, Navigation, Piano, Briefcase, Star, Globe, MapPin, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface DealerWithDistance extends Dealer {
  distance?: number
}

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

  // Update map center and zoom when search location changes
  useEffect(() => {
    if (searchCenter) {
      setViewState(prev => ({
        ...prev,
        longitude: searchCenter.lng,
        latitude: searchCenter.lat,
        zoom: 10
      }))
    }
  }, [searchCenter])

  // Center map and show popup when dealer is selected from list
  useEffect(() => {
    if (selectedDealer) {
      const dealer = dealers.find(d => d.id === selectedDealer)
      if (dealer?.coordinates?.latitude && dealer?.coordinates?.longitude) {
        // Center map on selected dealer
        setViewState(prev => ({
          ...prev,
          longitude: dealer.coordinates.longitude,
          latitude: dealer.coordinates.latitude,
          zoom: 14 // Zoom in closer for individual dealer
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
  }, [onMarkerClick])

  const handleMapClick = useCallback(() => {
    setActivePopup(null)
    onMarkerClick(null)
  }, [onMarkerClick])

  return (
    <Map
      {...viewState}
      onMove={evt => setViewState(evt.viewState)}
      onClick={handleMapClick}
      mapStyle="https://tiles.openfreemap.org/styles/liberty"
      style={{ width: '100%', height: '100%' }}
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
        const isFeatured = dealer.isFeatured

        return (
          <Marker
            key={dealer.id}
            {...position}
            anchor="bottom"
            onClick={(e) => handleMarkerClick(dealer.id as string, e)}
          >
            {/* KAWAI Custom Marker with Selection Overlay */}
            <div style={{ position: 'relative', display: 'inline-block' }}>
              {/* Selection Ring/Glow */}
              {isSelected && (
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(212, 175, 55, 0.2)',
                    border: '3px solid #D4AF37',
                    animation: 'pulse 2s infinite',
                    zIndex: -1,
                  }}
                />
              )}
              <img
                src="/ChatGPT%20Image%20Sep%209%2C%202025%2C%2003_13_02%20PM%20copy%202.png"
                alt="KAWAI Dealer"
                style={{
                  width: isSelected ? 48 : isFeatured ? 40 : 32,
                  height: isSelected ? 48 : isFeatured ? 40 : 32,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  filter: isSelected
                    ? 'drop-shadow(0 4px 8px rgba(212, 175, 55, 0.8)) brightness(1.1)'
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

        const hasAcousticDigital = dealer.dealerType?.includes('acoustic-digital')
        const hasProfessionalProducts = dealer.dealerType?.includes('professional-products')

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
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" strokeWidth={2} />
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
              <div className="flex flex-wrap gap-2 mb-4">
                {hasAcousticDigital && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg">
                    <Piano className="w-4 h-4" strokeWidth={2} />
                    <span>Acoustic & Digital</span>
                  </div>
                )}
                {hasProfessionalProducts && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg">
                    <Briefcase className="w-4 h-4" strokeWidth={2} />
                    <span>Professional</span>
                  </div>
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
                    onClick={(e) => e.stopPropagation()}
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
                      className="flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium text-kawai-charcoal bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
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
                      className="flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium text-kawai-charcoal bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
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
                    className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-kawai-charcoal bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 w-full"
                    onClick={(e) => e.stopPropagation()}
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
