'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { Artist, Media, Product } from '@/payload-types'

// ---------------------------------------------------------------------------
// Helpers & constants
// ---------------------------------------------------------------------------

function getArtistImage(artist: Artist): string {
  if (artist.heroImageUrl) return artist.heroImageUrl
  if (artist.image && typeof artist.image === 'object') {
    return (artist.image as Media).url ?? artist.imageUrl ?? '/images/defaults/artist-placeholder.jpg'
  }
  return artist.imageUrl ?? '/images/defaults/artist-placeholder.jpg'
}

const INSTRUMENT_LABELS: Record<string, string> = {
  grand: 'Grand Piano',
  upright: 'Upright Piano',
  digital: 'Digital Piano',
  hybrid: 'Hybrid Piano',
  multiple: 'Multiple Instruments',
}

const PLATFORM_LABELS: Record<string, string> = {
  website: 'Website',
  instagram: 'Instagram',
  youtube: 'YouTube',
  spotify: 'Spotify',
  'apple-music': 'Apple Music',
  soundcloud: 'SoundCloud',
  facebook: 'Facebook',
  twitter: 'Twitter',
  tiktok: 'TikTok',
  linkedin: 'LinkedIn',
  bandcamp: 'Bandcamp',
  other: 'Link',
}

const PAGE_SIZE = 9

// Easing matching the brand's elegant curve
const ease = [0.25, 0.46, 0.45, 0.94] as const

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ArtistsGridProps {
  artists: Artist[]
  title?: string
  showSearch?: boolean
}

// ---------------------------------------------------------------------------
// Grid Cell
// ---------------------------------------------------------------------------

interface GridCellProps {
  artist: Artist
  onSelect: (artist: Artist) => void
  /** Used to stagger within each PAGE_SIZE batch */
  index: number
}

function GridCell({ artist, onSelect, index }: GridCellProps) {
  const imageUrl = getArtistImage(artist)
  // Stagger resets per batch so load-more feels fresh, not delayed
  const staggerDelay = (index % PAGE_SIZE) * 0.055

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-48px' }}
      transition={{ duration: 0.55, delay: staggerDelay, ease }}
    >
      <button
        type="button"
        onClick={() => onSelect(artist)}
        className="group relative aspect-[3/4] w-full overflow-hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kawai-red focus-visible:ring-offset-2 focus-visible:ring-offset-kawai-black"
        aria-label={`View profile: ${artist.name}`}
      >
        {/* Portrait image — subtle zoom on hover */}
        <Image
          src={imageUrl}
          alt={artist.name}
          fill
          className="object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-[1.05]"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Hover scrim */}
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent',
            'opacity-0 group-hover:opacity-100',
            'transition-opacity duration-300 ease-out',
          )}
          aria-hidden="true"
        />

        {/* Name reveal */}
        <div
          className={cn(
            'absolute bottom-0 left-0 right-0 px-4 pb-5',
            'opacity-0 translate-y-3',
            'group-hover:opacity-100 group-hover:translate-y-0',
            'transition-all duration-300 ease-out',
          )}
        >
          <span
            className={cn(
              'block text-xl text-white leading-tight',
              'font-[family-name:var(--font-brand-serif)] font-light',
            )}
          >
            {artist.name}
          </span>
          <span
            className={cn(
              'block mt-1.5 h-px w-0 bg-kawai-red',
              'group-hover:w-8',
              'transition-all duration-500 delay-75 ease-out',
            )}
          />
        </div>
      </button>
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Profile Drawer
// ---------------------------------------------------------------------------

interface ProfileDrawerProps {
  artist: Artist | null
  onClose: () => void
}

function ProfileDrawer({ artist, onClose }: ProfileDrawerProps) {
  // Close on Escape
  useEffect(() => {
    if (!artist) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [artist, onClose])

  // Lock body scroll while open
  useEffect(() => {
    if (artist) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [artist])

  const imageUrl = artist ? getArtistImage(artist) : ''

  return (
    <AnimatePresence>
      {artist && (
        <>
          {/* Scrim */}
          <motion.div
            key="scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9010] bg-black/50 backdrop-blur-[2px]"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 35 }}
            className={cn(
              'fixed left-0 top-0 z-[9020] flex flex-col',
              'w-full sm:w-[420px]',
              'h-[100dvh] bg-white',
              'shadow-2xl',
            )}
            role="dialog"
            aria-modal="true"
            aria-label={`Artist profile: ${artist.name}`}
          >
            {/* ── Top: portrait image (fixed, not scrollable) ── */}
            <div className="relative aspect-[3/4] w-full flex-shrink-0 overflow-hidden bg-kawai-black">
              <Image
                src={imageUrl}
                alt={artist.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 420px"
                priority
              />

              {/* Close button */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close artist profile"
                className={cn(
                  'absolute top-3 right-3 z-10',
                  'w-9 h-9 flex items-center justify-center',
                  'bg-kawai-pearl rounded-full',
                  'text-kawai-charcoal text-lg leading-none font-light',
                  'hover:bg-kawai-neutral transition-colors duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kawai-red',
                )}
              >
                &times;
              </button>
            </div>

            {/* ── Middle: scrollable content ── */}
            <div className="flex-1 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15, ease }}
                className="px-6 pt-6 pb-4 space-y-4"
              >
                {/* Artist name */}
                <h2
                  className={cn(
                    'text-4xl font-light leading-tight text-kawai-charcoal',
                    'font-[family-name:var(--font-brand-serif)]',
                  )}
                >
                  {artist.name}
                </h2>

                {/* Instrument */}
                {artist.instrument && INSTRUMENT_LABELS[artist.instrument] && (
                  <p className="text-xs font-medium tracking-wide text-kawai-charcoal/50 uppercase">
                    {INSTRUMENT_LABELS[artist.instrument]}
                  </p>
                )}

                {/* KAWAI Model */}
                {artist.kawaiModel && typeof artist.kawaiModel !== 'string' && (
                  <p className="text-xs font-medium tracking-wide text-kawai-charcoal/50 uppercase">
                    <span className="text-kawai-red">KAWAI</span>{' '}
                    {(artist.kawaiModel as Product).name ?? (artist.kawaiModel as Product).model}
                  </p>
                )}

                {/* Short bio */}
                {artist.shortBio && (
                  <p
                    className={cn(
                      'text-sm leading-relaxed text-kawai-charcoal/70',
                      'font-[family-name:var(--font-brand-sans)]',
                    )}
                  >
                    {artist.shortBio}
                  </p>
                )}

                {/* Social links */}
                {artist.socialLinks && artist.socialLinks.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {artist.socialLinks.map((link, idx) => (
                      <a
                        key={link.id ?? idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          'text-xs px-3 py-1 rounded-full',
                          'bg-kawai-pearl text-kawai-charcoal',
                          'border border-kawai-neutral',
                          'hover:border-kawai-red hover:text-kawai-red',
                          'transition-colors duration-200',
                        )}
                      >
                        {link.label ?? PLATFORM_LABELS[link.platform] ?? link.platform}
                      </a>
                    ))}
                  </div>
                )}

                {/* Achievements */}
                {artist.achievements && artist.achievements.length > 0 && (
                  <ul className="space-y-1.5 pt-1">
                    {artist.achievements.map((item, idx) => (
                      <li
                        key={item.id ?? idx}
                        className="flex items-start gap-2 text-xs text-kawai-charcoal/70"
                      >
                        <span className="text-kawai-red mt-0.5 leading-none select-none flex-shrink-0">
                          &mdash;
                        </span>
                        <span>{item.achievement}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            </div>

            {/* ── Bottom: sticky CTA ── */}
            <div className="flex-shrink-0 border-t border-kawai-neutral bg-white px-6 py-4">
              <Link
                href={`/artists/${artist.slug}`}
                className={cn(
                  'flex items-center justify-center gap-2',
                  'w-full py-4',
                  'bg-kawai-red text-white',
                  'text-sm font-semibold tracking-[0.1em] uppercase',
                  'hover:bg-kawai-red/90 transition-colors duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kawai-red focus-visible:ring-offset-2',
                )}
                onClick={onClose}
              >
                View Full Profile
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ---------------------------------------------------------------------------
// ArtistsGrid — main export
// ---------------------------------------------------------------------------

export function ArtistsGrid({ artists, title = 'Our Artists', showSearch = true }: ArtistsGridProps) {
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const handleSelect = useCallback((artist: Artist) => {
    setSelectedArtist(artist)
  }, [])

  const handleClose = useCallback(() => {
    setSelectedArtist(null)
  }, [])

  const filteredArtists = artists.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Reset visible count when search changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [searchQuery])

  const visibleArtists = filteredArtists.slice(0, visibleCount)
  const hasMore = filteredArtists.length > visibleCount

  if (artists.length === 0) return null

  return (
    <>
      <section className="bg-kawai-black w-full">

        {/*
          Sticky header — latches beneath the main nav.
          Uses --header-bottom (set dynamically by header.tsx) which tracks
          the actual bottom edge of the fixed header including the 6px red
          line and the auto-hiding bottom nav (when visible on hover).
          Fallback: 70px = 64px utility bar + 6px red line separator.
        */}
        <div
          className={cn(
            'sticky z-20',
            'bg-kawai-black/95 backdrop-blur-sm',
            'border-b border-white/[0.07]',
            'shadow-[0_8px_32px_rgba(0,0,0,0.4)]',
          )}
          style={{ top: 'var(--header-bottom, 70px)' }}
        >
          <div className="px-6 sm:px-12 lg:px-16 py-6 max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end gap-5">

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease }}
              className={cn(
                'text-4xl sm:text-5xl font-light text-white flex-shrink-0',
                'font-[family-name:var(--font-brand-serif)]',
              )}
            >
              {title}
            </motion.h2>

            {/* Search bar — grows to fill remaining space on wider screens */}
            {showSearch && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1, ease }}
                className="w-full sm:max-w-sm"
              >
                <div className="relative">
                  <svg
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
                  </svg>
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search artists…"
                    aria-label="Search artists"
                    className={cn(
                      'w-full bg-white/5 border border-white/10 rounded-full',
                      'pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/30',
                      'focus:outline-none focus:border-white/25 focus:bg-white/[0.08]',
                      'transition-all duration-200',
                      '[&::-webkit-search-cancel-button]:appearance-none',
                    )}
                  />
                </div>
              </motion.div>
            )}

            {/* Live count */}
            <p className="hidden sm:block text-xs text-white/25 font-[family-name:var(--font-brand-sans)] flex-shrink-0 pb-0.5 tabular-nums">
              {filteredArtists.length} artist{filteredArtists.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Photo grid */}
        {filteredArtists.length > 0 ? (
          <>
            <div
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-kawai-black"
              aria-label="Artists gallery"
            >
              {visibleArtists.map((artist, index) => (
                <GridCell key={artist.id} artist={artist} onSelect={handleSelect} index={index} />
              ))}
            </div>

            {/* Load More */}
            <AnimatePresence>
              {hasMore && (
                <motion.div
                  key="load-more"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.4, ease }}
                  className="flex flex-col items-center gap-3 py-14"
                >
                  <button
                    type="button"
                    onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                    className={cn(
                      'group relative inline-flex items-center gap-3 overflow-hidden',
                      'rounded-full px-8 py-3.5',
                      'text-xs font-semibold tracking-[0.14em] uppercase',
                      'font-[family-name:var(--font-brand-sans)]',
                      'border border-white/20 text-white/60',
                      'hover:border-white/40 hover:text-white',
                      'transition-all duration-300',
                    )}
                  >
                    <span className="absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                    <span className="relative">Load More</span>
                    <span className="relative text-white/25 font-normal tabular-nums">
                      {filteredArtists.length - visibleCount}
                    </span>
                  </button>

                  {/* Progress bar */}
                  <div className="flex items-center gap-2" aria-hidden="true">
                    <div className="h-px bg-white/10 rounded-full overflow-hidden" style={{ width: 80 }}>
                      <motion.div
                        className="h-full bg-white/30 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(visibleCount / filteredArtists.length) * 100}%` }}
                        transition={{ duration: 0.5, ease }}
                      />
                    </div>
                    <span className="text-[10px] text-white/25 tabular-nums font-[family-name:var(--font-brand-sans)]">
                      {visibleCount} / {filteredArtists.length}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center py-24 px-6 text-center"
          >
            <p
              className={cn(
                'text-2xl font-light text-white/40 mb-2',
                'font-[family-name:var(--font-brand-serif)]',
              )}
            >
              No artists found
            </p>
            <p className="text-sm text-white/25 font-[family-name:var(--font-brand-sans)]">
              Try a different search term
            </p>
          </motion.div>
        )}
      </section>

      {/* Left-side profile drawer */}
      <ProfileDrawer artist={selectedArtist} onClose={handleClose} />
    </>
  )
}
