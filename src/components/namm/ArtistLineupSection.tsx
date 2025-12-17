/**
 * ArtistLineupSection Component - NAMM 2026 Performance Calendar
 *
 * Interactive 3-day performance schedule featuring:
 * - Mobile: Tab-based navigation with swipe gestures
 * - Desktop: 3-column day grid with vibrant gradients
 * - SEO: Rich Schema.org Event markup
 * - Animations: Scroll-triggered and hover effects
 *
 * Design inspired by FeaturedProductsSection gradient treatments
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import PerformanceCard from './performances/PerformanceCard'
import { DAYS_SCHEDULE, PERFORMANCE_KEYWORDS } from './performances/performance-data'
import { DAY_THEMES, PATTERN_OVERLAYS } from './performances/performance-themes'

interface ArtistLineupSectionProps {
  className?: string
}

/**
 * Main Artist Lineup Section
 */
export default function ArtistLineupSection({ className }: ArtistLineupSectionProps) {
  const [activeDay, setActiveDay] = useState<'thursday' | 'friday' | 'saturday'>('thursday')
  const [isTitleVisible, setIsTitleVisible] = useState(false)
  const titleRef = useRef<HTMLDivElement>(null)

  // Hover state management for staggered stack (desktop only)
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null)

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

  // Swipe navigation handlers
  const handleSwipeLeft = () => {
    if (activeDay === 'thursday') setActiveDay('friday')
    else if (activeDay === 'friday') setActiveDay('saturday')
  }

  const handleSwipeRight = () => {
    if (activeDay === 'saturday') setActiveDay('friday')
    else if (activeDay === 'friday') setActiveDay('thursday')
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handleSwipeRight()
      if (e.key === 'ArrowRight') handleSwipeLeft()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeDay])

  const activeDayData = DAYS_SCHEDULE.find(day => day.id === activeDay)

  return (
    <section
      id="artists"
      className={cn('scroll-mt-20 py-24 lg:py-32 relative overflow-hidden', className)}
      aria-labelledby="performances-heading"
    >
      {/* Warm beige gradient background */}
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
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3A3530] border border-[#2C2826]/20 mb-6 shadow-sm"
          >
            <Calendar className="w-4 h-4 text-[#F5F1E8]" />
            <span className="text-sm font-medium text-[#F5F1E8]">
              3-Day Performance Schedule
            </span>
          </motion.div>

          <motion.h2
            id="performances-heading"
            initial={{ opacity: 0, y: 30 }}
            animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-[#2C2826] mb-6"
          >
            Featured Artist Performances
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl font-light leading-relaxed text-[#5A5550] max-w-3xl mx-auto mb-8"
          >
            Experience live piano artistry from world-class musicians at NAMM 2026.
            Free performances daily at the Kawai booth in Anaheim Convention Center.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex justify-center px-4"
          >
            <div className="relative w-full max-w-2xl h-48">
              <Image
                src="https://pub-486ee03121a24ede8b51409434e22709.r2.dev/homepage/NS26_Badges.png"
                alt="NAMM 2026 Official Badges"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 672px"
                unoptimized
              />
            </div>
          </motion.div>
        </div>

        {/* Mobile: Tab Navigation */}
        <div className="lg:hidden mb-8">
          <nav
            aria-label="NAMM 2026 performance schedule by day"
            className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
          >
            {DAYS_SCHEDULE.map((day) => {
              const theme = DAY_THEMES[day.id]
              const isActive = activeDay === day.id

              return (
                <button
                  key={day.id}
                  onClick={() => setActiveDay(day.id)}
                  aria-label={`${day.dayName} ${day.date} performances`}
                  aria-pressed={isActive}
                  className={cn(
                    'flex-shrink-0 px-6 py-4 rounded-2xl whitespace-nowrap transition-all duration-300',
                    'border shadow-sm',
                    isActive
                      ? `bg-gradient-to-r ${theme.badge} ${theme.cardBorder} scale-105`
                      : 'bg-[#D4CFC7] border-[#C9C3BB] text-[#5A5550] hover:bg-[#C9C3BB]'
                  )}
                >
                  <div className={cn('text-xs font-light uppercase tracking-wider mb-1', isActive ? 'opacity-90' : 'opacity-70')}>
                    {day.dateShort}
                  </div>
                  <div className={cn('text-base font-semibold', isActive ? `text-${theme.text}` : 'text-[#2C2826]')}>
                    {day.dayName}
                  </div>
                </button>
              )
            })}
          </nav>

          {/* Mobile navigation arrows */}
          <div className="flex justify-between items-center mt-6 mb-4">
            <button
              onClick={handleSwipeRight}
              disabled={activeDay === 'thursday'}
              aria-label="Previous day"
              className={cn(
                'p-2 rounded-full transition-all duration-300',
                activeDay === 'thursday'
                  ? 'opacity-30 cursor-not-allowed'
                  : 'bg-[#3A3530] hover:bg-[#2C2826] border border-[#2C2826]/20 shadow-sm'
              )}
            >
              <ChevronLeft className={cn('w-5 h-5', activeDay === 'thursday' ? 'text-[#5A5550]' : 'text-[#F5F1E8]')} />
            </button>

            <span className="text-sm text-[#5A5550]">
              Swipe or use arrows to navigate
            </span>

            <button
              onClick={handleSwipeLeft}
              disabled={activeDay === 'saturday'}
              aria-label="Next day"
              className={cn(
                'p-2 rounded-full transition-all duration-300',
                activeDay === 'saturday'
                  ? 'opacity-30 cursor-not-allowed'
                  : 'bg-[#3A3530] hover:bg-[#2C2826] border border-[#2C2826]/20 shadow-sm'
              )}
            >
              <ChevronRight className={cn('w-5 h-5', activeDay === 'saturday' ? 'text-[#5A5550]' : 'text-[#F5F1E8]')} />
            </button>
          </div>

          {/* Mobile: Swipeable Day Content */}
          <AnimatePresence mode="wait">
            {activeDayData && (
              <motion.div
                key={activeDay}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -50) handleSwipeLeft()
                  if (info.offset.x > 50) handleSwipeRight()
                }}
                className="space-y-6"
              >
                {activeDayData.performances.map((performance, idx) => (
                  <PerformanceCard
                    key={performance.id}
                    performance={performance}
                    theme={DAY_THEMES[activeDay]}
                    index={idx}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop: 3-Column Day Grid with Staggered Stack */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-8">
          {DAYS_SCHEDULE.map((day) => {
            const theme = DAY_THEMES[day.id]

            return (
              <div key={day.id} className="space-y-6">
                {/* Day Header */}
                <div
                  className={cn(
                    'relative overflow-hidden rounded-2xl p-6 text-center',
                    `bg-gradient-to-br ${theme.background}`
                  )}
                >
                  {/* Pattern overlay */}
                  {PATTERN_OVERLAYS[theme.pattern]}

                  {/* Header content */}
                  <div className="relative z-10">
                    <div className="text-sm font-light text-white/80 uppercase tracking-wide mb-2">
                      {day.dayName}
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">
                      {day.dayNumber}
                    </div>
                    <div className="text-sm text-white/70">
                      {day.performances.length} Performance{day.performances.length !== 1 ? 's' : ''}
                    </div>
                  </div>

                  {/* Glow effect */}
                  <div className={cn('absolute inset-0 bg-gradient-radial', theme.glow, 'blur-2xl -z-10')} />
                </div>

                {/* Performance Cards - Staggered Stack Layout */}
                <div className="relative">
                  {[...day.performances].reverse().map((performance, idx) => {
                    const originalIdx = day.performances.length - 1 - idx
                    const adjacentPerformance = originalIdx === 0 ? day.performances[1] : day.performances[0]
                    const isCurrentHovered = hoveredCardId === performance.id
                    const isSiblingHovered = Boolean(adjacentPerformance && hoveredCardId === adjacentPerformance.id)

                    return (
                      <div
                        key={performance.id}
                        style={{
                          marginTop: idx === 0 ? 0 : '-240px', // 60% overlap for stagger effect
                        }}
                      >
                        <PerformanceCard
                          performance={performance}
                          theme={theme}
                          index={originalIdx}
                          isHovered={isCurrentHovered}
                          siblingHovered={isSiblingHovered}
                          onHoverChange={setHoveredCardId}
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* SEO Keywords (hidden) */}
        <div className="sr-only" aria-hidden="true">
          {PERFORMANCE_KEYWORDS.join(', ')}
        </div>
      </div>
    </section>
  )
}
