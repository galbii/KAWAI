/**
 * PlanYourVisitSection Component
 *
 * Provides practical logistics information to reduce friction for booth visits
 * Includes event dates, location, registration info, hotels, and transportation
 */

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface PlanYourVisitSectionProps {
  className?: string
  showMap?: boolean
}

// Icon components (using SVG for lightweight implementation)
const CalendarIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

const LocationIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const TicketIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
  </svg>
)

const HotelIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
)

const PlaneIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l7-7 3 3-7 7-3-3z" />
  </svg>
)

interface InfoCardProps {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
  className?: string
}

function InfoCard({ icon, title, children, className }: InfoCardProps) {
  return (
    <Card className={cn("border-2 hover:border-kawai-red transition-colors", className)}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 text-kawai-red mt-1">
            {icon}
          </div>
          <div className="flex-1 space-y-3">
            <h3 className="font-bold text-lg text-gray-900">
              {title}
            </h3>
            <div className="text-sm text-gray-700 space-y-2">
              {children}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function PlanYourVisitSection({
  className,
  showMap = true
}: PlanYourVisitSectionProps) {
  const [mapLoaded, setMapLoaded] = useState(false)

  return (
    <section className={cn(
      "py-16 px-4 md:py-20 bg-white",
      className
    )}>
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Plan Your Visit
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to know to experience Kawai at NAMM 2026
          </p>
        </div>

        {/* Info Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {/* Event Dates */}
          <InfoCard icon={<CalendarIcon />} title="Event Dates">
            <p className="font-semibold text-gray-900">
              NAMM 2026: January 20-24, 2026
            </p>
            <p className="text-gray-600">
              Exhibit Hall Open: January 22-24, 2026
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Visit us during exhibit hours for live demonstrations and exclusive previews
            </p>
          </InfoCard>

          {/* Location & Booth */}
          <InfoCard icon={<LocationIcon />} title="Location & Booth">
            <p className="font-medium text-gray-900">
              Anaheim Convention Center
            </p>
            <p className="text-gray-600">
              800 W Katella Ave, Anaheim, CA 92802
            </p>
            <p className="font-semibold text-kawai-red mt-2">
              Kawai Booth: Hall [TBA], Booth [TBA]
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Booth number will be announced closer to the event
            </p>
          </InfoCard>

          {/* Registration */}
          <InfoCard icon={<TicketIcon />} title="Registration">
            <p className="text-gray-700">
              NAMM requires advance registration for all attendees.
            </p>
            <p className="text-gray-600 text-xs">
              Industry professionals, music educators, and qualified buyers can register through the NAMM website.
            </p>
            <Button
              asChild
              variant="default"
              size="sm"
              className="mt-3 bg-kawai-red hover:bg-kawai-red/90"
            >
              <a
                href="https://www.namm.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                Register at NAMM.org
              </a>
            </Button>
          </InfoCard>

          {/* Hotels Nearby */}
          <InfoCard icon={<HotelIcon />} title="Hotels Nearby">
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-kawai-red mr-2">•</span>
                <span>
                  <strong>Disneyland Hotels</strong> - Walking distance to convention center
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-kawai-red mr-2">•</span>
                <span>
                  <strong>Anaheim Marriott</strong> - Adjacent to convention center
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-kawai-red mr-2">•</span>
                <span>
                  <strong>Hilton Anaheim</strong> - Connected via skywalk
                </span>
              </li>
            </ul>
            <p className="text-xs text-gray-500 mt-3">
              Book early for best rates during NAMM week
            </p>
          </InfoCard>
        </div>

        {/* Transportation */}
        <Card className="border-2 mb-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 text-kawai-red mt-1">
                <PlaneIcon />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900 mb-3">
                  Getting There
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold text-gray-900">
                      John Wayne Airport (SNA)
                    </p>
                    <p className="text-gray-600">
                      15 minutes from convention center
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Closest airport, convenient for domestic travelers
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      Los Angeles International (LAX)
                    </p>
                    <p className="text-gray-600">
                      45 minutes from convention center
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      More international flight options available
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Map */}
        {showMap && (
          <div className="relative">
            <h3 className="font-bold text-xl text-gray-900 mb-4 text-center">
              Convention Center Location
            </h3>

            {!mapLoaded && (
              <div className="relative h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                <Button
                  onClick={() => setMapLoaded(true)}
                  variant="default"
                  className="bg-kawai-red hover:bg-kawai-red/90"
                >
                  Load Map
                </Button>
              </div>
            )}

            {mapLoaded && (
              <div className="relative h-96 rounded-lg overflow-hidden shadow-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3316.4982887935785!2d-117.92301768478739!3d33.80067698067456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80dcd7d12b3b5e6b%3A0x2ef62f8418225cfa!2sAnaheim%20Convention%20Center!5e0!3m2!1sen!2sus!4v1234567890123"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Anaheim Convention Center Location"
                />
              </div>
            )}

            <p className="text-xs text-gray-500 text-center mt-3">
              Click for directions and surrounding area information
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
