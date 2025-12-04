'use client'

/**
 * Booth Tour Section
 * Interactive virtual booth map and tour
 */

import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface BoothZone {
  id: string
  name: string
  description: string
  position: { top: string; left: string }
}

const BOOTH_ZONES: BoothZone[] = [
  {
    id: 'entrance',
    name: 'Welcome & Registration',
    description: 'Start your journey here. Pick up exclusive NAMM materials and meet our team.',
    position: { top: '10%', left: '50%' },
  },
  {
    id: 'grand',
    name: 'Concert Grand Experience',
    description: 'Try our flagship Shigeru Kawai SK-EX and SK-7 concert grands.',
    position: { top: '30%', left: '20%' },
  },
  {
    id: 'hybrid',
    name: 'Hybrid Innovation',
    description: 'Experience the revolutionary Novus NV6 & NV12 hybrid pianos.',
    position: { top: '30%', left: '80%' },
  },
  {
    id: 'digital',
    name: 'Digital Showcase',
    description: 'Explore our complete range of digital pianos from CA to ES series.',
    position: { top: '60%', left: '20%' },
  },
  {
    id: 'acoustic',
    name: 'Acoustic Collection',
    description: 'Discover our K, GL, and GX series acoustic grand pianos.',
    position: { top: '60%', left: '80%' },
  },
  {
    id: 'stage',
    name: 'Performance Stage',
    description: 'Watch live artist performances throughout the day.',
    position: { top: '85%', left: '50%' },
  },
]

function BoothZoneMarker({ zone, isActive, onClick }: { zone: BoothZone; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300',
        'hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#C41E3A] focus:ring-offset-2',
        isActive ? 'z-20' : 'z-10'
      )}
      style={{ top: zone.position.top, left: zone.position.left }}
    >
      {/* Pulse Animation */}
      <span
        className={cn(
          'absolute inset-0 rounded-full animate-ping',
          isActive ? 'bg-[#C41E3A]/50' : 'bg-white/30'
        )}
      />

      {/* Marker Circle */}
      <span
        className={cn(
          'relative flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full transition-all duration-300',
          isActive
            ? 'bg-gradient-to-br from-[#E31937] to-[#FF3B55] scale-125 shadow-2xl'
            : 'bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg'
        )}
      >
        <span
          className={cn(
            'text-lg md:text-2xl font-bold transition-colors duration-300',
            isActive ? 'text-white' : 'text-gray-900'
          )}
        >
          {zone.id === 'entrance' && '🚪'}
          {zone.id === 'grand' && '🎹'}
          {zone.id === 'hybrid' && '⚡'}
          {zone.id === 'digital' && '🎛️'}
          {zone.id === 'acoustic' && '🎵'}
          {zone.id === 'stage' && '🎤'}
        </span>
      </span>
    </button>
  )
}

export default function BoothTour() {
  const [activeZone, setActiveZone] = useState<string | null>(null)
  const [isTitleVisible, setIsTitleVisible] = useState(false)
  const titleRef = useRef<HTMLDivElement>(null)

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

  const selectedZone = BOOTH_ZONES.find((z) => z.id === activeZone)

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div ref={titleRef} className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full mb-6"
          >
            <span className="w-2 h-2 bg-[#C41E3A] rounded-full" />
            <span className="text-gray-900 font-semibold text-sm uppercase tracking-wide">
              Virtual Booth Tour
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6"
          >
            Navigate Our Booth
            <span className="block text-[#C41E3A]">Before You Arrive</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl leading-relaxed text-gray-600 max-w-3xl mx-auto"
          >
            Plan your visit with our interactive booth map. Click on each zone to learn more.
          </motion.p>
        </div>

        {/* Interactive Booth Map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isTitleVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative"
        >
          {/* Map Container */}
          <div className="relative w-full h-[500px] md:h-[600px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl overflow-hidden border-2 border-gray-200 shadow-xl">
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0 bg-grid-pattern" />
            </div>

            {/* Booth Label */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-black/90 backdrop-blur-sm rounded-full">
              <p className="text-white font-bold text-lg">Kawai Booth - Hall B</p>
            </div>

            {/* Zone Markers */}
            {BOOTH_ZONES.map((zone) => (
              <BoothZoneMarker
                key={zone.id}
                zone={zone}
                isActive={activeZone === zone.id}
                onClick={() => setActiveZone(zone.id === activeZone ? null : zone.id)}
              />
            ))}

            {/* Legend */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-3 justify-center">
              <span className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm text-gray-700 shadow-md">
                Click markers to explore
              </span>
            </div>
          </div>

          {/* Zone Details Panel */}
          {selectedZone && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="mt-8 p-8 md:p-10 bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 shadow-2xl"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-2xl md:text-3xl font-bold text-white">{selectedZone.name}</h3>
                <button
                  onClick={() => setActiveZone(null)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <p className="text-lg text-white/80 leading-relaxed">{selectedZone.description}</p>
            </motion.div>
          )}
        </motion.div>

        {/* Bottom Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isTitleVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-600 text-lg">
            <strong>Pro Tip:</strong> Start at the entrance, grab your exclusive materials, and work
            your way through each zone. Don't miss the performance stage!
          </p>
        </motion.div>
      </div>

      {/* Custom Grid Pattern CSS */}
      <style jsx>{`
        .bg-grid-pattern {
          background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>
    </section>
  )
}
