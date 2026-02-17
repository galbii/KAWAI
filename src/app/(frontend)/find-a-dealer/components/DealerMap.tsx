'use client'

import { useEffect, useState, useCallback } from 'react'
import { Map, AdvancedMarker, InfoWindow, Pin } from '@vis.gl/react-google-maps'
import type { Dealer } from '@/payload-types'
import type { DealerWithDistance } from '../types'
import { Button } from '@/components/ui/button'
import { Phone, Navigation, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  dealers: DealerWithDistance[]
  searchCenter: { lat: number; lng: number } | null
  searchRadius: number
  selectedDealer: string | null
  onMarkerClick: (dealerId: string | null) => void
}

export function DealerMap({
  dealers,
  searchCenter,
  searchRadius,
  selectedDealer,
  onMarkerClick
}: Props) {
  const [mapCenter, setMapCenter] = useState({ lat: 39.8283, lng: -98.5795 }) // Center of US
  const [mapZoom, setMapZoom] = useState(4)
  const [activeInfoWindow, setActiveInfoWindow] = useState<string | null>(null)

  // Update map center and zoom when search location changes
  useEffect(() => {
    if (searchCenter) {
      setMapCenter(searchCenter)
      setMapZoom(10)
    }
  }, [searchCenter])

  const handleMarkerClick = useCallback((dealerId: string) => {
    setActiveInfoWindow(dealerId)
    onMarkerClick(dealerId)
  }, [onMarkerClick])

  const handleInfoWindowClose = useCallback(() => {
    setActiveInfoWindow(null)
    onMarkerClick(null)
  }, [onMarkerClick])

  return (
    <Map
      mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_ID || "DEMO_MAP_ID"}
      defaultCenter={mapCenter}
      center={mapCenter}
      defaultZoom={mapZoom}
      zoom={mapZoom}
      gestureHandling="greedy"
      disableDefaultUI={false}
      zoomControl={true}
      mapTypeControl={false}
      streetViewControl={false}
      fullscreenControl={true}
      className="w-full h-full"
    >
      {/* Search radius circle */}
      {searchCenter && (
        <div
          style={{
            position: 'absolute',
            pointerEvents: 'none'
          }}
        />
      )}

      {/* Dealer Markers */}
      {dealers.map(dealer => {
        if (!dealer.coordinates?.latitude || !dealer.coordinates?.longitude) {
          return null
        }

        const position = {
          lat: dealer.coordinates.latitude,
          lng: dealer.coordinates.longitude
        }

        return (
          <AdvancedMarker
            key={dealer.id}
            position={position}
            onClick={() => handleMarkerClick(dealer.id as string)}
          >
            <Pin
              background={selectedDealer === dealer.id ? '#D4AF37' : '#A01829'}
              borderColor={selectedDealer === dealer.id ? '#B8941F' : '#8B1825'}
              glyphColor="#FFFFFF"
              scale={selectedDealer === dealer.id ? 1.5 : dealer.isFeatured ? 1.2 : 1}
            />

            {/* Info Window */}
            {activeInfoWindow === dealer.id && (
              <InfoWindow
                position={position}
                onCloseClick={handleInfoWindowClose}
              >
                <div className="p-2 min-w-[260px] max-w-[320px]">
                  <h3 className="text-base font-semibold text-kawai-charcoal mb-1">
                    {dealer.dealerName}
                  </h3>

                  {dealer.distance !== undefined && (
                    <p className="text-sm text-gray-600 mb-2">
                      {dealer.distance.toFixed(1)} miles away
                    </p>
                  )}

                  {dealer.address && (
                    <p className="text-sm text-gray-700 mb-2">
                      {dealer.address.city}, {dealer.address.state}
                    </p>
                  )}

                  {dealer.tags && dealer.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {dealer.tags.slice(0, 2).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-block px-2 py-0.5 text-xs bg-kawai-pearl text-kawai-charcoal rounded"
                        >
                          {String(tag).replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    {dealer.contactInfo?.phone && (
                      <a
                        href={`tel:${dealer.contactInfo.phone}`}
                        className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium text-kawai-red border border-kawai-red rounded hover:bg-kawai-red hover:text-white transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Phone className="w-3 h-3" />
                        Call
                      </a>
                    )}

                    {dealer.address && (
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                          `${dealer.address.street}, ${dealer.address.city}, ${dealer.address.state} ${dealer.address.zipCode}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium text-kawai-red border border-kawai-red rounded hover:bg-kawai-red hover:text-white transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Navigation className="w-3 h-3" />
                        Directions
                      </a>
                    )}
                  </div>
                </div>
              </InfoWindow>
            )}
          </AdvancedMarker>
        )
      })}
    </Map>
  )
}
