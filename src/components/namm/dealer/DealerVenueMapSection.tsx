/**
 * DealerVenueMapSection Component - NAMM 2026
 *
 * Premium venue location section with map integration
 * Features:
 * - Split layout: Venue details (left) + Map (right)
 * - Responsive mobile-first design
 * - Gold accent colors for premium feel
 * - Framer Motion scroll animations
 * - Warm beige gradient background
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Car, Info, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DealerVenueMapSectionProps {
  className?: string
}

interface DetailCardProps {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
  index: number
}

function DetailCard({ icon, title, children, index }: DetailCardProps) {
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, x: -30 }}
      animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group"
    >
      <div className={cn(
        'relative overflow-hidden rounded-xl p-5',
        'bg-gradient-to-br from-white via-white to-[#F5F1E8]/30',
        'border-2 border-[#D4AF37]/20 hover:border-[#D4AF37]/40',
        'shadow-md shadow-[#2C2826]/5',
        'hover:shadow-lg hover:shadow-[#2C2826]/10',
        'hover:scale-[1.02]',
        'transition-all duration-500 ease-out'
      )}>
        {/* Subtle gold glow effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-radial from-[#D4AF37]/10 via-transparent to-transparent blur-2xl pointer-events-none" />

        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, currentColor 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }} />
        </div>

        <div className="relative z-10 flex items-start gap-4">
          {/* Icon */}
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#B8942E] flex items-center justify-center text-white shadow-md">
            {icon}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-[#2C2826] mb-2 text-sm">
              {title}
            </h4>
            <div className="text-xs text-[#5A5550] leading-relaxed">
              {children}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function DealerVenueMapSection({
  className
}: DealerVenueMapSectionProps) {
  const [isTitleVisible, setIsTitleVisible] = useState(false)
  const [isMapVisible, setIsMapVisible] = useState(false)
  const titleRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<HTMLDivElement>(null)

  // Intersection Observer for title animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsTitleVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    if (titleRef.current) {
      observer.observe(titleRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Intersection Observer for map animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsMapVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (mapRef.current) {
      observer.observe(mapRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const googleMapsLink = 'https://www.google.com/maps/place/Anaheim+Convention+Center/@33.8005828,-117.9200229,17z/data=!3m1!4b1!4m6!3m5!1s0x80dcd7d12b3b5e6b:0x2ef62f8418225cfa!8m2!3d33.8005828!4d-117.917448!16zL20vMDI3azQz'

  return (
    <section className={cn(
      "py-24 lg:py-32 relative overflow-hidden",
      className
    )}>
      {/* Warm beige gradient background - matching PlanYourVisitSection */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F5F1E8] via-[#EDE8DF] to-[#F0EBE3]" />

      {/* Subtle paper texture overlay */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulance type="fractalNoise" baseFrequency="0.9" numOctaves="4" /%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noise)" /%3E%3C/svg%3E")',
            backgroundRepeat: 'repeat'
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <div ref={titleRef} className="mb-12 lg:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-[#2C2826] mb-4"
          >
            Find Us
          </motion.h2>
        </div>

        {/* Split Layout: Venue Details + Map */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* LEFT SIDE - Venue Details */}
          <div className="space-y-6">
            {/* Venue Name & Address */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={cn(
                'relative overflow-hidden rounded-2xl p-8',
                'bg-gradient-to-br from-white via-white to-[#F5F1E8]/50',
                'border-2 border-[#D4AF37]/30',
                'shadow-lg shadow-[#2C2826]/10'
              )}
            >
              {/* Gold accent corner */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#D4AF37]/10 to-transparent rounded-bl-full" />

              <div className="relative z-10">
                <div className="flex items-start gap-3 mb-4">
                  <MapPin className="w-6 h-6 text-[#D4AF37] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-2xl font-semibold text-[#2C2826] mb-2">
                      Anaheim Convention Center
                    </h3>
                    <p className="text-base text-[#2C2826] font-medium mb-1">
                      Private Reception Hall
                    </p>
                    <p className="text-sm text-[#5A5550]">
                      800 W Katella Ave, Anaheim, CA 92802
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-[#D4CFC7]">
                  <p className="text-sm text-[#5A5550] flex items-center gap-2">
                    <span className="text-[#D4AF37] font-semibold">→</span>
                    Adjacent to Kawai Booth #9110, Hall B
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Detail Cards */}
            <div className="space-y-4">
              <DetailCard
                icon={<Car className="w-5 h-5" />}
                title="Parking"
                index={0}
              >
                <p>
                  Complimentary valet parking available at the main entrance. Self-parking also available in Convention Center lots.
                </p>
              </DetailCard>

              <DetailCard
                icon={<Info className="w-5 h-5" />}
                title="Arrival"
                index={1}
              >
                <p>
                  Please check in at the reception desk. Our team will guide you to the private hall.
                </p>
              </DetailCard>

              <DetailCard
                icon={<MapPin className="w-5 h-5" />}
                title="Accessibility"
                index={2}
              >
                <p>
                  Wheelchair accessible. Please contact us in advance for special accommodations.
                </p>
              </DetailCard>
            </div>

            {/* Get Directions Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <a
                href={googleMapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'group inline-flex items-center justify-center gap-3',
                  'px-8 py-4 rounded-xl',
                  'bg-gradient-to-r from-[#D4AF37] to-[#B8942E]',
                  'text-white font-semibold text-base',
                  'shadow-lg shadow-[#D4AF37]/30',
                  'hover:shadow-xl hover:shadow-[#D4AF37]/40',
                  'hover:scale-105',
                  'transition-all duration-300 ease-out'
                )}
              >
                <MapPin className="w-5 h-5" />
                Get Directions
                <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
            </motion.div>
          </div>

          {/* RIGHT SIDE - Map */}
          <motion.div
            ref={mapRef}
            initial={{ opacity: 0, x: 30 }}
            animate={isMapVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.8 }}
            className="lg:sticky lg:top-8 h-fit"
          >
            <div className={cn(
              'relative overflow-hidden rounded-2xl',
              'border-2 border-[#D4AF37]/30',
              'shadow-xl shadow-[#2C2826]/10',
              'min-h-[400px] lg:min-h-[600px]',
              'bg-gradient-to-br from-[#F5F1E8] via-[#EDE8DF] to-[#E5DFD3]'
            )}>
              {/* Map placeholder - Replace with actual Google Maps embed */}
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8942E] flex items-center justify-center shadow-lg">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-lg font-medium text-[#2C2826]">
                    Interactive Map
                  </p>
                  <p className="text-sm text-[#5A5550] max-w-xs mx-auto">
                    Google Maps integration will be displayed here showing the exact location of our private reception hall
                  </p>
                </div>
              </div>

              {/* Decorative pattern overlay */}
              <div className="absolute inset-0 opacity-[0.03]">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'radial-gradient(circle at 50% 50%, currentColor 2px, transparent 2px)',
                  backgroundSize: '40px 40px'
                }} />
              </div>

              {/* Optional: Static map image fallback */}
              {/* Uncomment if you have a static map image */}
              {/* <img
                src="/images/namm/venue-map.png"
                alt="Anaheim Convention Center map"
                className="w-full h-full object-cover"
              /> */}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
