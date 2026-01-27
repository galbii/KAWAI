'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader } from '@googlemaps/js-api-loader'
import { motion } from 'framer-motion'
import { MapPin, Phone, Clock, Navigation } from 'lucide-react'

// Plano, Texas coordinates
const PLANO_CENTER = {
  lat: 33.0198,
  lng: -96.6989
}

const RADIUS_MILES = 20
const METERS_PER_MILE = 1609.34

export default function GL10Location() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
          version: 'weekly',
          libraries: ['places', 'geometry']
        })

        await loader.load()

        if (!mapRef.current) return

        // Create map
        const mapInstance = new google.maps.Map(mapRef.current, {
          center: PLANO_CENTER,
          zoom: 10,
          styles: [
            {
              featureType: 'all',
              elementType: 'geometry',
              stylers: [{ color: '#f5f5f5' }]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{ color: '#c9e7f2' }]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#9e9e9e' }]
            }
          ],
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
          zoomControl: true
        })

        // Add marker at center
        new google.maps.Marker({
          position: PLANO_CENTER,
          map: mapInstance,
          title: 'KAWAI Piano Gallery - Plano, TX',
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 12,
            fillColor: '#C41E3A',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 3
          }
        })

        // Add 20-mile radius circle
        new google.maps.Circle({
          map: mapInstance,
          center: PLANO_CENTER,
          radius: RADIUS_MILES * METERS_PER_MILE,
          fillColor: '#C41E3A',
          fillOpacity: 0.15,
          strokeColor: '#C41E3A',
          strokeOpacity: 0.6,
          strokeWeight: 2
        })

        setMap(mapInstance)
        setIsLoading(false)
      } catch (error) {
        console.error('Error loading Google Maps:', error)
        setIsLoading(false)
      }
    }

    initMap()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-kawai-pearl/20 pt-20 pb-32">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="text-xs text-kawai-red font-medium tracking-[0.2em] uppercase mb-6">
            Visit Our Showroom
          </div>
          <h1 className="text-5xl md:text-6xl font-light font-serif text-kawai-charcoal mb-6">
            Find Us in <span className="text-kawai-red">Plano</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join us on the event days with your invitation to secure free delivery and tuning services. Located in the heart of Plano, Texas.
          </p>
        </motion.div>

        {/* Map Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-12"
        >
          <div className="grid lg:grid-cols-5 min-h-[600px]">
            {/* Interactive Map */}
            <div className="lg:col-span-3 relative bg-gray-100">
              <div ref={mapRef} className="w-full h-full min-h-[600px]" />

              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/90">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-kawai-red border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading map...</p>
                  </div>
                </div>
              )}

              {/* Radius Legend */}
              <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm px-4 py-3 rounded-lg shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-kawai-red/20 border-2 border-kawai-red" />
                  <span className="text-sm font-medium text-gray-700">20-mile service area</span>
                </div>
              </div>
            </div>

            {/* Information Panel */}
            <div className="lg:col-span-2 p-8 md:p-12 flex flex-col justify-center bg-gradient-to-br from-white to-kawai-pearl/30">
              {/* Showroom Title */}
              <div className="mb-8">
                <h2 className="text-3xl font-serif text-kawai-charcoal mb-3">
                  KAWAI Piano Gallery
                </h2>
                <div className="w-16 h-px bg-kawai-red mb-6" />
                <p className="text-gray-600 text-sm leading-relaxed">
                  Visit our world-class showroom to experience the GL-10 Baby Grand Piano and our full collection of premium instruments.
                </p>
              </div>

              {/* Contact Information */}
              <div className="space-y-6 mb-10">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-kawai-red/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-kawai-red" />
                  </div>
                  <div>
                    <p className="text-kawai-charcoal font-medium text-sm mb-1">Address</p>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      601 W Plano Parkway, Suite 153<br />
                      Plano, TX 75075
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-kawai-red/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-kawai-red" />
                  </div>
                  <div>
                    <p className="text-kawai-charcoal font-medium text-sm mb-1">Phone</p>
                    <a
                      href="tel:+19727121113"
                      className="text-gray-600 hover:text-kawai-red transition-colors text-sm"
                    >
                      (972) 712-1113
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-kawai-red/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-kawai-red" />
                  </div>
                  <div>
                    <p className="text-kawai-charcoal font-medium text-sm mb-3">Showroom Hours</p>
                    <div className="space-y-2 text-xs text-gray-600">
                      <div className="flex justify-between gap-8">
                        <span>Monday – Friday</span>
                        <span className="font-medium">10am – 7pm</span>
                      </div>
                      <div className="flex justify-between gap-8">
                        <span>Saturday</span>
                        <span className="font-medium">10am – 6pm</span>
                      </div>
                      <div className="flex justify-between gap-8">
                        <span>Sunday</span>
                        <span className="font-medium">1pm – 5pm</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <a
                  href={`https://maps.google.com?q=601+W+Plano+Parkway+Suite+153+Plano+TX+75075`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-kawai-red hover:bg-kawai-charcoal text-white py-4 text-center font-medium transition-all duration-300 text-sm tracking-wide uppercase rounded-lg group"
                >
                  <Navigation className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Get Directions
                </a>
                <button
                  onClick={() => {
                    // Scroll to top and switch to booking view
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                    // You might want to trigger a view change here
                  }}
                  className="w-full border-2 border-kawai-red text-kawai-red hover:bg-kawai-red hover:text-white py-4 text-center font-medium transition-all duration-300 text-sm tracking-wide uppercase rounded-lg"
                >
                  Schedule Visit
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
