/**
 * PlanYourVisitSection Component - NAMM 2026
 *
 * Premium logistics section with warm beige aesthetic matching ArtistLineupSection
 * Features:
 * - Framer Motion animations with scroll triggers
 * - Premium card styling with gradients and glows
 * - Elevated icon badges with accent colors
 * - Warm beige background with paper texture
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface PlanYourVisitSectionProps {
  className?: string
  showMap?: boolean
}

interface InfoCardProps {
  title: string
  children: React.ReactNode
  index: number
  accentColor?: 'red' | 'amber' | 'emerald' | 'blue'
}

function InfoCard({ title, children, index, accentColor = 'red' }: InfoCardProps) {
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

  const accentColors = {
    red: {
      border: 'border-kawai-red/20 hover:border-kawai-red/40',
      glow: 'from-kawai-red/10 via-transparent to-transparent'
    },
    amber: {
      border: 'border-amber-600/20 hover:border-amber-600/40',
      glow: 'from-amber-600/10 via-transparent to-transparent'
    },
    emerald: {
      border: 'border-emerald-600/20 hover:border-emerald-600/40',
      glow: 'from-emerald-600/10 via-transparent to-transparent'
    },
    blue: {
      border: 'border-blue-600/20 hover:border-blue-600/40',
      glow: 'from-blue-600/10 via-transparent to-transparent'
    }
  }

  const colors = accentColors[accentColor]

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group h-full"
    >
      <div className={cn(
        'relative h-full overflow-hidden rounded-2xl p-6 lg:p-8',
        'bg-gradient-to-br from-white via-white to-[#F5F1E8]/30',
        'border-2',
        colors.border,
        'shadow-lg shadow-[#2C2826]/5',
        'hover:shadow-xl hover:shadow-[#2C2826]/10',
        'hover:scale-[1.02]',
        'transition-all duration-500 ease-out'
      )}>
        {/* Subtle gradient glow effect */}
        <div className={cn(
          'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500',
          'bg-gradient-radial',
          colors.glow,
          'blur-2xl pointer-events-none'
        )} />

        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, currentColor 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }} />
        </div>

        <div className="relative z-10">
          {/* Title */}
          <h3 className="font-semibold text-xl text-[#2C2826] mb-4 leading-tight">
            {title}
          </h3>

          {/* Content */}
          <div className="text-sm text-[#5A5550] space-y-3 leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function PlanYourVisitSection({
  className,
  showMap = true
}: PlanYourVisitSectionProps) {
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

  return (
    <section className={cn(
      "py-24 lg:py-32 relative overflow-hidden",
      className
    )}>
      {/* Warm beige gradient background - matching ArtistLineupSection */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F5F1E8] via-[#EDE8DF] to-[#F0EBE3]" />

      {/* Subtle paper texture overlay */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" /%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noise)" /%3E%3C/svg%3E")',
            backgroundRepeat: 'repeat'
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <div ref={titleRef} className="text-center mb-16 lg:mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-[#2C2826] mb-6"
          >
            Plan Your Visit
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl font-light leading-relaxed text-[#5A5550] max-w-3xl mx-auto"
          >
            Everything you need to know to experience Kawai at NAMM 2026. From event details to travel logistics, we've got you covered.
          </motion.p>
        </div>

        {/* Info Cards Grid */}
        <div className="grid gap-8 md:grid-cols-2 mb-12">
          {/* Event Dates & Hotels Combined */}
          <InfoCard title="Event Dates & Hotels" index={0} accentColor="red">
            <div className="space-y-2">
              <p className="font-semibold text-[#2C2826]">
                NAMM 2026: January 20-24, 2026
              </p>
              <p className="text-[#5A5550]">
                Exhibit Hall Open: January 22-24, 2026
              </p>
              <p className="text-xs text-[#7A7570] mt-2">
                Visit us during exhibit hours for live demonstrations and exclusive previews
              </p>
            </div>

            {/* Visual separator */}
            <div className="my-4 border-t border-[#D4CFC7]" />

            {/* Hotels section */}
            <div className="space-y-3">
              <p className="font-semibold text-[#2C2826]">
                Hotels Nearby
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-kawai-red mt-0.5 flex-shrink-0">•</span>
                  <div>
                    <strong className="text-[#2C2826]">Disneyland Hotels</strong>
                    <p className="text-xs text-[#7A7570] mt-0.5">Walking distance to convention center</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-kawai-red mt-0.5 flex-shrink-0">•</span>
                  <div>
                    <strong className="text-[#2C2826]">Anaheim Marriott</strong>
                    <p className="text-xs text-[#7A7570] mt-0.5">Adjacent to convention center</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-kawai-red mt-0.5 flex-shrink-0">•</span>
                  <div>
                    <strong className="text-[#2C2826]">Hilton Anaheim</strong>
                    <p className="text-xs text-[#7A7570] mt-0.5">Connected via skywalk</p>
                  </div>
                </li>
              </ul>
              <p className="text-xs text-[#7A7570] mt-4 pt-3 border-t border-[#D4CFC7]">
                💡 Book early for best rates during NAMM week
              </p>
            </div>
          </InfoCard>

          {/* Booth Location */}
          <InfoCard title="Booth Location" index={1} accentColor="red">
            <div className="space-y-3">
              {/* Convention Center Access Map */}
              <div className="mb-6 -mx-6 lg:-mx-8 -mt-6 lg:-mt-8">
                <img
                  src="/images/namm/access-map.png"
                  alt="Anaheim Convention Center access map showing Hall B #9110"
                  className="w-full h-auto"
                />
              </div>

              <p className="font-semibold text-[#2C2826]">
                Anaheim Convention Center
              </p>
              <p className="text-[#5A5550]">
                800 W Katella Ave, Anaheim, CA 92802
              </p>
              <div className="mt-3 pt-3 border-t border-[#D4CFC7]">
                <p className="font-bold text-kawai-red">
                  Kawai Booth 9110
                </p>
                <p className="text-xs text-[#7A7570] mt-1">
                  Hall B · First Floor
                </p>
              </div>
            </div>
          </InfoCard>
        </div>

        {/* Transportation - Premium card treatment */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-12"
        >
          <div className={cn(
            'relative overflow-hidden rounded-2xl p-8 lg:p-10',
            'bg-gradient-to-br from-white via-white to-[#F5F1E8]/30',
            'border-2 border-purple-600/20 hover:border-purple-600/40',
            'shadow-lg shadow-[#2C2826]/5',
            'hover:shadow-xl hover:shadow-[#2C2826]/10',
            'transition-all duration-500 ease-out',
            'group'
          )}>
            {/* Subtle gradient glow effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-radial from-purple-600/10 via-transparent to-transparent blur-2xl pointer-events-none" />

            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-[0.02]">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 20% 50%, currentColor 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }} />
            </div>

            <div className="relative z-10">
              {/* Title */}
              <h3 className="font-semibold text-2xl text-[#2C2826] mb-6 leading-tight">
                Getting There
              </h3>

              {/* Airport Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="font-bold text-[#2C2826] text-lg">
                    John Wayne Airport (SNA)
                  </p>
                  <p className="text-[#5A5550]">
                    15 minutes from convention center
                  </p>
                  <p className="text-xs text-[#7A7570] leading-relaxed">
                    Closest airport, convenient for domestic travelers
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="font-bold text-[#2C2826] text-lg">
                    Los Angeles International (LAX)
                  </p>
                  <p className="text-[#5A5550]">
                    45 minutes from convention center
                  </p>
                  <p className="text-xs text-[#7A7570] leading-relaxed">
                    More international flight options available
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
