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
}

/**
 * Artist Performance Card - Image-prominent premium design
 */
export default function PerformanceCard({
  performance,
  theme,
  index = 0,
  className
}: PerformanceCardProps) {
  const hasImage = performance.artistImage
  const hasSocials = performance.socialLinks && Object.values(performance.socialLinks).some(Boolean)

  return (
    <Link
      href={`/namm-2026/artists/${performance.artistSlug || '#'}`}
      className="block group"
    >
      <motion.article
        // NEW: Scale + fade animation (premium product reveal)
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{
          duration: 0.5,
          delay: index * 0.15,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
        itemScope
        itemType="https://schema.org/MusicEvent"
        className={cn(
          'relative overflow-hidden rounded-xl bg-white',
          'transition-all duration-300 ease-out',
          'hover:-translate-y-2 hover:shadow-2xl',
          'shadow-md',
          className
        )}
        style={{
          borderLeft: `4px solid ${theme.cardLeftBorder}`
        }}
      >
        {/* Artist Image Section with Overlay */}
        <div className="relative h-64 sm:h-72 lg:h-80 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          {hasImage ? (
            <>
              {/* Artist Portrait Image */}
              <Image
                src={performance.artistImage!}
                alt={`${performance.artistName} portrait`}
                fill
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />

              {/* Dark gradient overlay for text legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            </>
          ) : (
            // Placeholder: Day-specific gradient with musical note
            <>
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, ${theme.cardLeftBorder}20, ${theme.cardLeftBorder}40)`
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Music className="w-20 h-20 text-gray-300" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            </>
          )}

          {/* Artist Name Overlaid on Image */}
          <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
            <h3
              itemProp="name"
              className="text-3xl lg:text-4xl font-bold text-white mb-1 leading-tight drop-shadow-lg"
            >
              {performance.artistName}
            </h3>
            <p className="text-base font-medium text-white/90 drop-shadow">
              {performance.performanceType}
            </p>
          </div>

          {/* Genre Badge - Positioned Top Right */}
          {performance.genre && (
            <div
              className="absolute top-4 right-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm z-10"
              style={{
                backgroundColor: `${theme.genreBadgeBg}E6`, // 90% opacity
                color: theme.genreBadgeText
              }}
            >
              <Music className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold uppercase tracking-wide">
                {performance.genre}
              </span>
            </div>
          )}
        </div>

        {/* Card Content Body */}
        <div className="relative p-6">
          {/* Time Badge - Kawai Red */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E31937] shadow-sm mb-4">
            <Clock className="w-3.5 h-3.5 text-white" />
            <time
              dateTime={performance.startDateTime}
              itemProp="startDate"
              className="text-sm font-bold text-white"
            >
              {performance.time} • {performance.date.split(',')[0]}
            </time>
          </div>

          {/* Artist Bio */}
          {performance.artistBio && (
            <p
              itemProp="description"
              className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3"
            >
              {performance.artistBio}
            </p>
          )}

          {/* Performance Description (if no bio) */}
          {!performance.artistBio && performance.description && (
            <p
              itemProp="description"
              className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-2"
            >
              {performance.description}
            </p>
          )}

          {/* Social Media Links */}
          {hasSocials && (
            <>
              <div className="border-t border-gray-200 my-4" />
              <div className="flex items-center gap-4">
                {performance.socialLinks?.website && (
                  <a
                    href={performance.socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-gray-400 hover:text-[#C41E3A] transition-colors"
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
                    className="text-gray-400 hover:text-[#C41E3A] transition-colors"
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
                    className="text-gray-400 hover:text-[#C41E3A] transition-colors"
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
                    className="text-gray-400 hover:text-[#C41E3A] transition-colors"
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
                    className="text-gray-400 hover:text-[#C41E3A] transition-colors"
                    aria-label={`Follow ${performance.artistName} on Facebook`}
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                )}
              </div>
            </>
          )}

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

        {/* Hover glow effect on border */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `linear-gradient(to bottom, ${theme.cardLeftBorder}, transparent)`,
            filter: 'blur(4px)'
          }}
        />
      </motion.article>
    </Link>
  )
}
