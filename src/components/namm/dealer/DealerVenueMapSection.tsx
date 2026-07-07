/**
 * DealerVenueMapSection Component - NAMM 2026
 *
 * Clean venue location section with map integration
 * Features:
 * - Centered layout: Map + Venue details
 * - Responsive mobile-first design
 * - Red accent colors matching homepage
 * - Framer Motion scroll animations
 * - Clean kawai-pearl background
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { MapPin, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DealerVenueMapSectionProps {
  className?: string
}

export default function DealerVenueMapSection({
  className
}: DealerVenueMapSectionProps) {
  const [isTitleVisible, setIsTitleVisible] = useState(false)
  const titleRef = useRef<HTMLDivElement>(null)

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

  const googleMapsLink = 'https://www.google.com/maps/place/Anaheim+Convention+Center/@33.8005828,-117.9200229,17z/data=!3m1!4b1!4m6!3m5!1s0x80dcd7d12b3b5e6b:0x2ef62f8418225cfa!8m2!3d33.8005828!4d-117.917448!16zL20vMDI3azQz'

  return (
    <section className={cn(
      "py-16 lg:py-20 relative overflow-hidden",
      className
    )}>
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a]" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <div ref={titleRef} className="mb-10 lg:mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl lg:text-5xl font-serif tracking-tight text-white"
          >
            Find Us
          </motion.h2>
        </div>

        {/* Two Column Layout: Booth Map + Google Map */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* Booth Map */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative w-full"
          >
            <h3 className="text-xl md:text-2xl font-serif text-white mb-4">Booth Location</h3>
            <div className="relative w-full aspect-[4/3] bg-white/5 rounded-xl overflow-hidden">
              <Image
                src="https://pub-486ee03121a24ede8b51409434e22709.r2.dev/homepage/namm2026.png"
                alt="NAMM 2026 Venue Map - Room 213D"
                fill
                className="object-fill"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <p className="text-sm md:text-base text-white/70 italic mt-4 text-center">
              Reception booth 213D and 206A for our private dealer meetings
            </p>
          </motion.div>

          {/* Google Map */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative w-full"
          >
            <h3 className="text-xl md:text-2xl font-serif text-white mb-4">Venue Location</h3>
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-lg">
              <iframe
                title="Map of Anaheim Convention Center, 800 W Katella Ave, Anaheim, CA"
                src="https://maps.google.com/maps?q=Anaheim+Convention+Center,+800+W+Katella+Ave,+Anaheim,+CA+92802&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              />
            </div>
          </motion.div>
        </div>

        {/* Venue Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-3xl mx-auto"
        >
          <div className={cn(
            'relative overflow-hidden rounded-xl p-6 md:p-8',
            'bg-white/10 backdrop-blur-sm',
            'border border-white/20',
            'shadow-lg'
          )}>
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-kawai-red/20 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-kawai-red" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-serif text-white mb-2">
                  Anaheim Convention Center
                </h3>
                <p className="text-base text-white/80 font-medium mb-1">
                  Room 213D
                </p>
                <p className="text-sm text-white/60">
                  800 W Katella Ave, Anaheim, CA 92802
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/20">
              <p className="text-sm text-white/80 flex items-center gap-2">
                <span className="text-kawai-red font-semibold">→</span>
                Room <span className="font-semibold text-kawai-red">213D</span>
              </p>

              <a
                href={googleMapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'group inline-flex items-center justify-center gap-2',
                  'px-6 py-3 rounded-lg',
                  'bg-kawai-red hover:bg-white',
                  'text-white hover:text-kawai-black',
                  'font-medium text-sm',
                  'shadow-lg',
                  'hover:shadow-xl',
                  'transition-all duration-300 ease-out'
                )}
              >
                <MapPin className="w-4 h-4" />
                Get Directions
                <ExternalLink className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
