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
  // Staggered stack interaction props
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

  // Determine if content should be compressed (second card in desktop grid)
  const isCompressed = index > 0 && !isHovered

  return (
    <Link
      href={`/namm-2026/artists/${performance.artistSlug || '#'}`}
      className="block group"
    >
      <motion.article
        // Initial reveal animation (scroll-triggered)
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{
          duration: 0.6,
          delay: index * 0.1,
          ease: [0.25, 0.1, 0.25, 1]
        }}
        // Staggered stack animations (desktop only, via parent)
        animate={{
          y: isHovered ? -4 : siblingHovered ? -8 : 0,
        }}
        whileHover={{
          transition: { duration: 0.3, ease: 'easeOut' }
        }}
        onHoverStart={() => onHoverChange?.(performance.id)}
        onHoverEnd={() => onHoverChange?.(null)}
        itemScope
        itemType="https://schema.org/MusicEvent"
        className={cn(
          'relative overflow-hidden rounded-2xl',
          // Warm subtle background that blends with page beige
          'bg-gradient-to-br from-[#FAF8F3] to-[#F5F1E8]',
          'transition-all duration-300 ease-out',
          // Minimal shadow - subtle depth
          'shadow-sm hover:shadow-lg',
          // Very subtle border for definition
          'border border-[#E5E0D8]/50',
          className
        )}
        style={{
          // Desktop-only stagger margin (applied via parent wrapper)
          zIndex: isHovered ? 20 : 10 - index,
        }}
      >
        {/* Artist Image Section with Overlay */}
        <div className="relative h-72 sm:h-80 lg:h-96 overflow-hidden bg-gradient-to-br from-stone-100 to-stone-200 rounded-t-2xl">
          {hasImage ? (
            <>
              {/* Artist Portrait Image */}
              <Image
                src={performance.artistImage!}
                alt={`${performance.artistName} portrait`}
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />

              {/* Refined gradient overlay for text legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            </>
          ) : (
            // Placeholder: Subtle musical note on neutral background
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-stone-100 to-stone-200" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Music className="w-16 h-16 text-stone-300" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            </>
          )}

          {/* Artist Name Overlaid on Image */}
          <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8 z-10">
            <h3
              itemProp="name"
              className="text-2xl lg:text-3xl font-light text-white mb-2 leading-tight tracking-tight"
            >
              {performance.artistName}
            </h3>
            <p className="text-sm lg:text-base font-light text-white/80">
              {performance.performanceType}
            </p>
          </div>
        </div>

        {/* Card Content Body */}
        <div className="relative p-6 lg:p-8">
          {/* Time Badge - Kawai Red (always visible) */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E31937] shadow-sm mb-5">
            <Clock className="w-4 h-4 text-white" />
            <time
              dateTime={performance.startDateTime}
              itemProp="startDate"
              className="text-sm font-medium text-white"
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
                className="text-sm lg:text-base text-[#5A5550] font-light leading-relaxed mb-5 line-clamp-3"
              >
                {performance.artistBio}
              </p>
            )}

            {/* Performance Description (if no bio) */}
            {!performance.artistBio && performance.description && (
              <p
                itemProp="description"
                className="text-sm lg:text-base text-[#5A5550] font-light leading-relaxed mb-5 line-clamp-2"
              >
                {performance.description}
              </p>
            )}

            {/* Social Media Links */}
            {hasSocials && (
              <>
                <div className="border-t border-[#E5E0D8] my-5" />
                <div className="flex items-center gap-4">
                  {performance.socialLinks?.website && (
                    <a
                      href={performance.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[#8A8580] hover:text-[#E31937] transition-colors duration-200"
                      aria-label={`Visit ${performance.artistName}'s website`}
                    >
                      <Globe className="w-5 h-5" />
                    </a>
                  )}
                  {performance.socialLinks?.instagram && (
                    <a
                      href={performance.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[#8A8580] hover:text-[#E31937] transition-colors duration-200"
                      aria-label={`Follow ${performance.artistName} on Instagram`}
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                  )}
                  {performance.socialLinks?.youtube && (
                    <a
                      href={performance.socialLinks.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[#8A8580] hover:text-[#E31937] transition-colors duration-200"
                      aria-label={`Watch ${performance.artistName} on YouTube`}
                    >
                      <Youtube className="w-5 h-5" />
                    </a>
                  )}
                  {performance.socialLinks?.spotify && (
                    <a
                      href={performance.socialLinks.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[#8A8580] hover:text-[#E31937] transition-colors duration-200"
                      aria-label={`Listen to ${performance.artistName} on Spotify`}
                    >
                      <Spotify className="w-5 h-5" />
                    </a>
                  )}
                  {performance.socialLinks?.facebook && (
                    <a
                      href={performance.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[#8A8580] hover:text-[#E31937] transition-colors duration-200"
                      aria-label={`Follow ${performance.artistName} on Facebook`}
                    >
                      <Facebook className="w-5 h-5" />
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
