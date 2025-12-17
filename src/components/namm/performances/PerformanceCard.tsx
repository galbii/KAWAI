/**
 * PerformanceCard Component - NAMM 2026 Artist Cards
 *
 * Premium artist-focused cards with:
 * - Portrait image with overlay
 * - Artist bio and social links
 * - Clickable navigation to artist pages
 * - Scale + fade animation (luxury product reveal style)
 */

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Clock, Music, Globe, Instagram, Youtube, Music2 as Spotify, Facebook } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Performance } from './performance-data'
import type { DayTheme } from './performance-themes'

interface PerformanceCardProps {
  performance: Performance
  theme: DayTheme
  index?: number
  className?: string
  // Staggered stack interaction props (desktop only)
  isHovered?: boolean
  siblingHovered?: boolean
  onHoverChange?: (id: string | null) => void
}

/**
 * Artist Performance Card - Clean, modern design integrated with page aesthetic
 */
export default function PerformanceCard({
  performance,
  theme, // Available for future use (e.g., day-specific accents)
  index = 0,
  className,
  isHovered = false,
  siblingHovered = false,
  onHoverChange
}: PerformanceCardProps) {
  const hasImage = performance.artistImage
  const hasSocials = performance.socialLinks && Object.values(performance.socialLinks).some(Boolean)

  // Theme prop intentionally unused in current minimal design
  // Available for future day-specific styling if needed
  void theme

  // Always show full content on desktop for better UX
  // No compression needed with clean grid layout
  const isCompressed = false

  return (
    <Link
      href={`#profile-${performance.id}`}
      className="block group"
      scroll={true}
    >
      <motion.article
        id={`performance-${performance.id}`}
        // Initial reveal animation (scroll-triggered)
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        // Clean hover animation - subtle lift
        animate={{
          y: isHovered ? -8 : 0,
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{
          opacity: { duration: 0.6, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] },
          y: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] },
          scale: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }
        }}
        onHoverStart={() => onHoverChange?.(performance.id)}
        onHoverEnd={() => onHoverChange?.(null)}
        itemScope
        itemType="https://schema.org/MusicEvent"
        className={cn(
          'relative overflow-hidden rounded-2xl scroll-mt-20',
          // Warm subtle background that blends with page beige
          'bg-gradient-to-br from-[#FAF8F3] to-[#F5F1E8]',
          'transition-all duration-400 ease-out',
          // Enhanced shadow with more dramatic change
          'shadow-md',
          isHovered && 'shadow-2xl shadow-[#2C2826]/20',
          // Border with hover enhancement
          'border-2',
          isHovered ? 'border-kawai-red/40' : 'border-[#E5E0D8]/50',
          // Add ring glow on hover
          isHovered && 'ring-4 ring-kawai-red/10',
          className
        )}
        style={{
          // Hover elevation
          zIndex: isHovered ? 10 : 1,
        }}
      >
        {/* Artist Image Section with Overlay */}
        <div className="relative h-[32rem] sm:h-[36rem] lg:h-96 overflow-hidden bg-gradient-to-br from-stone-100 to-stone-200 rounded-t-2xl">
          {hasImage ? (
            <>
              {/* Artist Portrait Image */}
              <Image
                src={performance.artistImage!}
                alt={`${performance.artistName} portrait`}
                fill
                className={cn(
                  "object-cover transition-transform duration-500 ease-out group-hover:scale-110",
                  performance.artistName === 'Alec Van Khajadourian' ? 'object-[center_60%]' : 'object-center'
                )}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />

              {/* Enhanced gradient overlay with hover effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-all duration-500" />

              {/* "View Details" indicator - appears on hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="text-sm font-semibold text-[#2C2826] flex items-center gap-2">
                    View Artist Details
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </>
          ) : (
            // Placeholder: Subtle musical note on neutral background
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-stone-100 to-stone-200" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Music className="w-16 h-16 text-stone-300 transition-transform duration-500 group-hover:scale-110" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-all duration-500" />

              {/* "View Details" indicator for placeholder too */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                <div className="bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="text-sm font-semibold text-[#2C2826] flex items-center gap-2">
                    View Artist Details
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Artist Name Overlaid on Image */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-8 z-10">
            <h3
              itemProp="name"
              className="text-3xl sm:text-4xl lg:text-3xl font-light text-white mb-2 leading-tight tracking-tight transform group-hover:translate-x-1 transition-transform duration-300"
            >
              {performance.artistName}
            </h3>
            <p className="text-base sm:text-lg lg:text-base font-light text-white/80 transform group-hover:translate-x-1 transition-transform duration-300">
              {performance.performanceType}
            </p>
          </div>
        </div>

        {/* Card Content Body */}
        <div className="relative p-6 sm:p-8 lg:p-8">
          {/* Time Badge - Kawai Red (always visible) with hover animation */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#E31937] shadow-sm mb-6 group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
            <Clock className="w-4 h-4 text-white group-hover:animate-pulse" />
            <time
              dateTime={performance.startDateTime}
              itemProp="startDate"
              className="text-sm sm:text-base font-medium text-white"
            >
              {performance.time} • {performance.date.split(',')[0]}
            </time>
          </div>

          {/* Collapsible content section - hidden when compressed (desktop second card) */}
          <motion.div
            initial={false}
            animate={{
              height: isCompressed ? 0 : 'auto',
              opacity: isCompressed ? 0 : 1,
            }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{ overflow: 'hidden' }}
          >
            {/* Artist Bio */}
            {performance.artistBio && (
              <p
                itemProp="description"
                className="text-base sm:text-lg lg:text-base text-[#5A5550] font-light leading-relaxed mb-6 line-clamp-3"
              >
                {performance.artistBio}
              </p>
            )}

            {/* Performance Description (if no bio) */}
            {!performance.artistBio && performance.description && (
              <p
                itemProp="description"
                className="text-base sm:text-lg lg:text-base text-[#5A5550] font-light leading-relaxed mb-6 line-clamp-2"
              >
                {performance.description}
              </p>
            )}

            {/* Social Media Links */}
            {hasSocials && (
              <>
                <div className="border-t border-[#E5E0D8] my-6" />
                <div className="flex items-center gap-5">
                  {performance.socialLinks?.website && (
                    <a
                      href={performance.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[#8A8580] hover:text-[#E31937] transition-colors duration-200 active:scale-95"
                      aria-label={`Visit ${performance.artistName}'s website`}
                    >
                      <Globe className="w-6 h-6 sm:w-7 sm:h-7 lg:w-5 lg:h-5" />
                    </a>
                  )}
                  {performance.socialLinks?.instagram && (
                    <a
                      href={performance.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[#8A8580] hover:text-[#E31937] transition-colors duration-200 active:scale-95"
                      aria-label={`Follow ${performance.artistName} on Instagram`}
                    >
                      <Instagram className="w-6 h-6 sm:w-7 sm:h-7 lg:w-5 lg:h-5" />
                    </a>
                  )}
                  {performance.socialLinks?.youtube && (
                    <a
                      href={performance.socialLinks.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[#8A8580] hover:text-[#E31937] transition-colors duration-200 active:scale-95"
                      aria-label={`Watch ${performance.artistName} on YouTube`}
                    >
                      <Youtube className="w-6 h-6 sm:w-7 sm:h-7 lg:w-5 lg:h-5" />
                    </a>
                  )}
                  {performance.socialLinks?.spotify && (
                    <a
                      href={performance.socialLinks.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[#8A8580] hover:text-[#E31937] transition-colors duration-200 active:scale-95"
                      aria-label={`Listen to ${performance.artistName} on Spotify`}
                    >
                      <Spotify className="w-6 h-6 sm:w-7 sm:h-7 lg:w-5 lg:h-5" />
                    </a>
                  )}
                  {performance.socialLinks?.facebook && (
                    <a
                      href={performance.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[#8A8580] hover:text-[#E31937] transition-colors duration-200 active:scale-95"
                      aria-label={`Follow ${performance.artistName} on Facebook`}
                    >
                      <Facebook className="w-6 h-6 sm:w-7 sm:h-7 lg:w-5 lg:h-5" />
                    </a>
                  )}
                </div>
              </>
            )}
          </motion.div>

          {/* Schema.org metadata (hidden) */}
          <meta itemProp="eventAttendanceMode" content="https://schema.org/OfflineEventAttendanceMode" />
          <meta itemProp="eventStatus" content="https://schema.org/EventScheduled" />
          <span itemProp="location" itemScope itemType="https://schema.org/Place" className="sr-only">
            <span itemProp="name">Kawai Booth - Anaheim Convention Center</span>
            <span itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
              <span itemProp="addressLocality">Anaheim</span>
              <span itemProp="addressRegion">CA</span>
              <span itemProp="addressCountry">US</span>
            </span>
          </span>
          <span itemProp="performer" itemScope itemType="https://schema.org/Person" className="sr-only">
            <span itemProp="name">{performance.artistName}</span>
            {performance.artistImage && <meta itemProp="image" content={performance.artistImage} />}
          </span>
          <span itemProp="organizer" itemScope itemType="https://schema.org/Organization" className="sr-only">
            <span itemProp="name">Kawai Piano</span>
          </span>
        </div>
      </motion.article>
    </Link>
  )
}
