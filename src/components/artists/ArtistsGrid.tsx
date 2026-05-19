'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { Artist, Media } from '@/payload-types'

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

const PAGE_SIZE = 9

// Easing matching the brand's elegant curve
const ease = [0.25, 0.46, 0.45, 0.94] as const

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ArtistsGridProps {
  artists: Artist[]
  legacyArtists?: Artist[]
  title?: string
  showSearch?: boolean
}

// ---------------------------------------------------------------------------
// Grid Cell
// ---------------------------------------------------------------------------

interface GridCellProps {
  artist: Artist
  /** Used to stagger within each PAGE_SIZE batch */
  index: number
  legacy?: boolean
}

function GridCell({ artist, index, legacy }: GridCellProps) {
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
      <Link
        href={`/artists/${artist.slug}`}
        className="group relative aspect-[3/4] w-full overflow-hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kawai-red focus-visible:ring-offset-2 focus-visible:ring-offset-kawai-black block"
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

        {/* Scrim — deepens on hover */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent transition-opacity duration-500 group-hover:opacity-90"
          aria-hidden="true"
        />

        {/* Bottom accent line — expands full-width on hover */}
        <div
          className="absolute bottom-0 left-0 h-[2px] bg-kawai-red transition-all duration-500 ease-out w-0 group-hover:w-full"
          aria-hidden="true"
        />

        {/* Legacy badge */}
        {legacy && (
          <div className="absolute top-3 right-3 z-10">
            <span
              className={cn(
                'text-[9px] font-semibold tracking-[0.22em] uppercase px-2 py-1 rounded-full',
                'bg-black/50 text-kawai-gold/60 border border-kawai-gold/20',
                'font-[family-name:var(--font-brand-sans)]',
              )}
            >
              Legacy
            </span>
          </div>
        )}

        {/* Name + instrument */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-5">
          {/* Instrument — fades in on hover */}
          {artist.instrument && INSTRUMENT_LABELS[artist.instrument] && (
            <span
              className={cn(
                'block text-[10px] text-kawai-red/80 uppercase tracking-[0.18em] font-medium mb-1.5',
                'opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0',
                'transition-all duration-300',
                'font-[family-name:var(--font-brand-sans)]',
              )}
            >
              {INSTRUMENT_LABELS[artist.instrument]}
            </span>
          )}
          <span
            className={cn(
              'block text-xl text-white leading-tight',
              'font-[family-name:var(--font-brand-serif)] font-light',
              'transition-transform duration-300 group-hover:-translate-y-0.5',
            )}
          >
            {artist.name}
          </span>
          {/* Short red tick mark — hidden when full-width line takes over */}
          <span className="block mt-1.5 h-px w-8 bg-kawai-red/60 transition-opacity duration-300 group-hover:opacity-0" />
        </div>
      </Link>
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Alpha Letter Divider — section break between letter groups
// ---------------------------------------------------------------------------

interface AlphaLetterDividerProps {
  letter: string
}

function AlphaLetterDivider({ letter }: AlphaLetterDividerProps) {
  return (
    <div
      className="relative flex items-center px-6 sm:px-12 lg:px-16 pt-10 pb-2 select-none overflow-hidden"
      aria-hidden="true"
    >
      {/* Ghost background letter */}
      <span
        className="absolute left-2 sm:left-6 lg:left-8 top-0 text-[8.5rem] font-light leading-none text-white/[0.028] pointer-events-none"
        style={{ fontFamily: 'var(--font-brand-serif)' }}
      >
        {letter}
      </span>
      {/* Foreground label */}
      <span className="relative z-10 text-[10px] font-semibold tracking-[0.26em] uppercase text-kawai-red/50 font-[family-name:var(--font-brand-sans)]">
        {letter}
      </span>
      {/* Extending hairline */}
      <div className="ml-5 flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Alpha Row — single artist entry in A-Z list view
// ---------------------------------------------------------------------------

interface AlphaRowProps {
  artist: Artist
  /** 1-based display index across all visible artists */
  index: number
  /** Position within current load batch — used for stagger timing */
  batchIndex: number
  legacy?: boolean
}

function AlphaRow({ artist, index, batchIndex, legacy }: AlphaRowProps) {
  const imageUrl = getArtistImage(artist)
  const rowDelay = (batchIndex % PAGE_SIZE) * 0.038

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, delay: rowDelay, ease }}
    >
      <Link
        href={`/artists/${artist.slug}`}
        className="group relative flex items-center gap-6 sm:gap-10 px-6 sm:px-12 lg:px-16 py-6 sm:py-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kawai-red focus-visible:ring-inset"
        aria-label={`View profile: ${artist.name}`}
      >
        {/* Vertical red accent bar — grows full-height on hover */}
        <div
          className="absolute left-0 top-0 w-[3px] bg-kawai-red h-0 group-hover:h-full transition-[height] duration-500 ease-out"
          aria-hidden="true"
        />

        {/* Bottom divider */}
        <div
          className="absolute bottom-0 left-6 sm:left-12 lg:left-16 right-6 sm:right-12 lg:right-16 h-px bg-white/[0.05] group-hover:bg-white/[0.09] transition-colors duration-300"
          aria-hidden="true"
        />

        {/* Index number */}
        <span
          className={cn(
            'flex-shrink-0 w-9 text-right text-xs tabular-nums leading-none',
            'text-white/[0.12] group-hover:text-white/30 transition-colors duration-300',
            'font-[family-name:var(--font-brand-sans)]',
          )}
        >
          {String(index).padStart(2, '0')}
        </span>

        {/* Artist name */}
        <div className="flex-1 min-w-0">
          <span
            className={cn(
              'block text-3xl sm:text-4xl lg:text-5xl font-light leading-none truncate',
              'text-white/85 group-hover:text-white',
              'transition-colors duration-300',
              'font-[family-name:var(--font-brand-serif)]',
            )}
          >
            {artist.name}
          </span>
        </div>

        {/* Instrument + region metadata */}
        <div className="hidden sm:flex items-center gap-4 flex-shrink-0">
          {artist.instrument && INSTRUMENT_LABELS[artist.instrument] && (
            <span
              className={cn(
                'text-[11px] tracking-[0.18em] uppercase',
                'text-white/25 group-hover:text-kawai-red/70',
                'transition-colors duration-300',
                'font-[family-name:var(--font-brand-sans)]',
              )}
            >
              {INSTRUMENT_LABELS[artist.instrument]}
            </span>
          )}
          {artist.instrument && artist.region && (
            <span className="text-white/[0.12] text-xs" aria-hidden="true">·</span>
          )}
          {artist.region && (
            <span
              className={cn(
                'text-[11px] tracking-[0.12em] uppercase',
                'text-white/[0.18] group-hover:text-white/40',
                'transition-colors duration-300',
                'font-[family-name:var(--font-brand-sans)]',
              )}
            >
              {artist.region}
            </span>
          )}
        </div>

        {/* Featured / Legacy badge */}
        {legacy ? (
          <span
            className={cn(
              'hidden lg:block flex-shrink-0',
              'text-[10px] tracking-[0.22em] uppercase font-medium',
              'text-kawai-gold/30 group-hover:text-kawai-gold/55',
              'transition-colors duration-300',
              'font-[family-name:var(--font-brand-sans)]',
            )}
          >
            Legacy
          </span>
        ) : artist.featured && (
          <span
            className={cn(
              'hidden lg:block flex-shrink-0',
              'text-[10px] tracking-[0.22em] uppercase font-medium',
              'text-kawai-gold/40 group-hover:text-kawai-gold/70',
              'transition-colors duration-300',
              'font-[family-name:var(--font-brand-sans)]',
            )}
          >
            Featured
          </span>
        )}

        {/* Circular thumbnail */}
        <div
          className={cn(
            'relative flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden',
            'border border-white/[0.08] group-hover:border-white/20',
            'ring-0 group-hover:ring-1 group-hover:ring-kawai-red/20 group-hover:ring-offset-0',
            'transition-all duration-500',
          )}
        >
          <Image
            src={imageUrl}
            alt=""
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            sizes="(max-width: 640px) 96px, (max-width: 1024px) 112px, 128px"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500"
            aria-hidden="true"
          />
        </div>

        {/* Chevron — slides in on hover */}
        <svg
          className={cn(
            'flex-shrink-0 w-4 h-4',
            'text-transparent group-hover:text-white/30',
            '-translate-x-2 group-hover:translate-x-0',
            'transition-all duration-300',
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// ArtistsGrid — main export
// ---------------------------------------------------------------------------

type SortMode = 'recent' | 'alpha'
type ViewMode = 'current' | 'legacy'

export function ArtistsGrid({ artists, legacyArtists = [], title = 'Our Artists', showSearch = true }: ArtistsGridProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [sortMode, setSortMode] = useState<SortMode>('recent')
  const [viewMode, setViewMode] = useState<ViewMode>('current')
  const [searchFocused, setSearchFocused] = useState(false)

  const hasLegacy = legacyArtists.length > 0
  const isLegacyView = viewMode === 'legacy'
  const activePool = isLegacyView ? legacyArtists : artists

  // Used to avoid scrolling on initial mount
  const isFirstRender = useRef(true)
  // Ref to the grid section so we can scroll back to its top when filters change
  const sectionRef = useRef<HTMLElement>(null)

  const filteredArtists = activePool
    .filter((a) => {
      if (!searchQuery) return true
      const q = searchQuery.toLowerCase()
      return (
        a.name.toLowerCase().includes(q) ||
        a.shortBio?.toLowerCase().includes(q) ||
        a.genre?.toLowerCase().includes(q) ||
        a.region?.toLowerCase().includes(q) ||
        (a.instrument ? INSTRUMENT_LABELS[a.instrument]?.toLowerCase().includes(q) : false) ||
        a.achievements?.some((item) => item.achievement?.toLowerCase().includes(q))
      )
    })
    .sort((a, b) => sortMode === 'alpha' ? a.name.localeCompare(b.name) : 0)

  // Reset visible count AND scroll back to the top of the grid when filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE)

    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    if (!sectionRef.current) return

    const rect = sectionRef.current.getBoundingClientRect()
    const headerBottom = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue('--header-bottom') || '70'
    )

    // Only scroll if the section top is above the visible viewport
    if (rect.top < headerBottom + 8) {
      const absoluteTop = window.scrollY + rect.top - headerBottom
      window.scrollTo({ top: absoluteTop, behavior: 'smooth' })
    }
  }, [searchQuery, sortMode, viewMode])

  const visibleArtists = filteredArtists.slice(0, visibleCount)
  const hasMore = filteredArtists.length > visibleCount
  const progressPct = filteredArtists.length > 0
    ? Math.round((visibleCount / filteredArtists.length) * 100)
    : 100

  // Group visible artists by first letter for A-Z view
  const alphaGroups = visibleArtists.reduce<
    { letter: string; artists: { artist: Artist; globalIndex: number }[] }[]
  >((acc, artist, idx) => {
    const letter = artist.name[0]?.toUpperCase() ?? '#'
    const last = acc[acc.length - 1]
    if (last && last.letter === letter) {
      last.artists.push({ artist, globalIndex: idx + 1 })
    } else {
      acc.push({ letter, artists: [{ artist, globalIndex: idx + 1 }] })
    }
    return acc
  }, [])

  if (artists.length === 0 && legacyArtists.length === 0) return null

  return (
    <section ref={sectionRef} className="bg-kawai-black w-full">

        {/*
          Sticky header — latches beneath the main nav.
          top is driven by --header-bottom (set dynamically by header.tsx).
          Fallback: 70px = 64px utility bar + 6px red separator.
        */}
        <div
          className={cn(
            'sticky z-20',
            'border-b border-white/[0.06]',
          )}
          style={{ top: 'var(--header-bottom, 70px)' }}
        >
          {/* Glass background layer — rendered behind content */}
          <div
            className="absolute inset-0 bg-kawai-black/80 backdrop-blur-xl"
            aria-hidden="true"
          />
          {/* Subtle top highlight line */}
          <div
            className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
            aria-hidden="true"
          />

          <div className="relative px-6 sm:px-12 lg:px-16 py-5 max-w-7xl mx-auto">

            {/* Current / Legacy tab row — only shown when legacy artists exist */}
            {hasLegacy && (
              <div className="flex items-center gap-6 mb-4 border-b border-white/[0.06] pb-4">
                <button
                  type="button"
                  onClick={() => { setViewMode('current'); setSearchQuery('') }}
                  className={cn(
                    'text-[11px] font-semibold tracking-[0.18em] uppercase transition-all duration-200',
                    'font-[family-name:var(--font-brand-sans)]',
                    viewMode === 'current'
                      ? 'text-white border-b-2 border-kawai-red pb-0.5'
                      : 'text-white/30 hover:text-white/55 pb-0.5',
                  )}
                >
                  Current
                </button>
                <button
                  type="button"
                  onClick={() => { setViewMode('legacy'); setSearchQuery('') }}
                  className={cn(
                    'text-[11px] font-semibold tracking-[0.18em] uppercase transition-all duration-200',
                    'font-[family-name:var(--font-brand-sans)]',
                    viewMode === 'legacy'
                      ? 'text-kawai-gold/80 border-b-2 border-kawai-gold/50 pb-0.5'
                      : 'text-white/30 hover:text-white/55 pb-0.5',
                  )}
                >
                  Legacy
                </button>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">

              {/* Title + count — left side */}
              <div className="flex items-baseline gap-3 flex-shrink-0">
                <motion.h2
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease }}
                  className={cn(
                    'text-3xl sm:text-4xl font-light transition-colors duration-300',
                    isLegacyView ? 'text-kawai-gold/70' : 'text-white',
                    'font-[family-name:var(--font-brand-serif)]',
                  )}
                >
                  {isLegacyView ? 'Legacy Artists' : title}
                </motion.h2>
                <motion.span
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2, ease }}
                  className="text-xs text-white/20 tabular-nums font-[family-name:var(--font-brand-sans)] pb-0.5"
                >
                  {filteredArtists.length}
                </motion.span>
              </div>

              {/* Spacer */}
              <div className="hidden sm:block flex-1" />

              {/* Search — glassmorphic pill */}
              {showSearch && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1, ease }}
                  className="w-full sm:w-64 lg:w-80"
                >
                  <div
                    className={cn(
                      'relative rounded-full transition-all duration-300',
                      // Glass base
                      'bg-white/[0.06] backdrop-blur-2xl',
                      // Border — brightens on focus
                      searchFocused
                        ? 'border border-white/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_0_0_3px_rgba(225,25,34,0.12),0_8px_24px_rgba(0,0,0,0.3)]'
                        : 'border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_4px_12px_rgba(0,0,0,0.2)]',
                    )}
                  >
                    {/* Search icon */}
                    <svg
                      className={cn(
                        'absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none transition-colors duration-300',
                        searchFocused ? 'text-white/50' : 'text-white/25',
                      )}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
                    </svg>

                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setSearchFocused(true)}
                      onBlur={() => setSearchFocused(false)}
                      placeholder="Name, genre, instrument…"
                      aria-label="Search artists by name, genre, or instrument"
                      className={cn(
                        'w-full bg-transparent',
                        'pl-10 pr-10 py-2.5 text-sm',
                        'text-white placeholder:text-white/25',
                        'focus:outline-none',
                        '[&::-webkit-search-cancel-button]:appearance-none',
                        'font-[family-name:var(--font-brand-sans)]',
                      )}
                    />

                    {/* Clear button — visible only when there's a query */}
                    <AnimatePresence>
                      {searchQuery && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.15 }}
                          type="button"
                          onClick={() => setSearchQuery('')}
                          aria-label="Clear search"
                          className={cn(
                            'absolute right-3 top-1/2 -translate-y-1/2',
                            'w-5 h-5 flex items-center justify-center rounded-full',
                            'bg-white/10 text-white/40 hover:bg-white/20 hover:text-white/70',
                            'transition-colors duration-150',
                          )}
                        >
                          <svg className="w-2.5 h-2.5" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
                            <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" fill="none" />
                          </svg>
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}

              {/* Sort toggle */}
              <div className="flex items-center gap-0.5 flex-shrink-0 rounded-full border border-white/10 bg-white/[0.03] p-0.5">
                <button
                  type="button"
                  onClick={() => setSortMode('recent')}
                  className={cn(
                    'px-3.5 py-1.5 rounded-full text-[11px] font-medium tracking-wide transition-all duration-200',
                    'font-[family-name:var(--font-brand-sans)]',
                    sortMode === 'recent'
                      ? 'bg-white/[0.12] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]'
                      : 'text-white/30 hover:text-white/55',
                  )}
                >
                  Recent
                </button>
                <button
                  type="button"
                  onClick={() => setSortMode('alpha')}
                  className={cn(
                    'px-3.5 py-1.5 rounded-full text-[11px] font-medium tracking-wide transition-all duration-200',
                    'font-[family-name:var(--font-brand-sans)]',
                    sortMode === 'alpha'
                      ? 'bg-white/[0.12] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]'
                      : 'text-white/30 hover:text-white/55',
                  )}
                >
                  A–Z
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Content area — grid view or A-Z list view */}
        {filteredArtists.length > 0 ? (
          <>
            <AnimatePresence mode="wait">
              {sortMode === 'alpha' ? (
                /* ── A-Z list view ── */
                <motion.div
                  key="alpha-list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22, ease }}
                  role="list"
                  aria-label="Artists A–Z"
                >
                  {alphaGroups.map((group) => (
                    <div key={group.letter} role="group" aria-label={`Artists starting with ${group.letter}`}>
                      <AlphaLetterDivider letter={group.letter} />
                      {group.artists.map(({ artist, globalIndex }, batchIndex) => (
                        <AlphaRow
                          key={artist.id}
                          artist={artist}
                          index={globalIndex}
                          batchIndex={batchIndex}
                          legacy={isLegacyView}
                        />
                      ))}
                    </div>
                  ))}
                </motion.div>
              ) : (
                /* ── Photo grid view ── */
                <motion.div
                  key="grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22, ease }}
                >
                  <div
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-kawai-black/50"
                    aria-label="Artists gallery"
                  >
                    {visibleArtists.map((artist, index) => (
                      <GridCell key={artist.id} artist={artist} index={index} legacy={isLegacyView} />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Load More — shared between both views */}
            <AnimatePresence>
              {hasMore && (
                <motion.div
                  key="load-more"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.4, ease }}
                  className="flex flex-col items-center gap-4 py-14"
                >
                  <button
                    type="button"
                    onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                    className={cn(
                      'group relative inline-flex items-center gap-3 overflow-hidden',
                      'rounded-full px-8 py-3.5',
                      'text-xs font-semibold tracking-[0.14em] uppercase',
                      'font-[family-name:var(--font-brand-sans)]',
                      'border border-white/15 text-white/50',
                      'hover:border-white/35 hover:text-white',
                      'backdrop-blur-sm bg-white/[0.03]',
                      'transition-all duration-300',
                    )}
                  >
                    <span className="absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                    <span className="relative">Load More</span>
                    <span className="relative text-white/20 font-normal tabular-nums">
                      +{filteredArtists.length - visibleCount}
                    </span>
                  </button>

                  {/* Progress indicator */}
                  <div className="flex items-center gap-3" aria-hidden="true">
                    <div className="h-px bg-white/[0.08] rounded-full overflow-hidden w-24">
                      <motion.div
                        className="h-full bg-white/25 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPct}%` }}
                        transition={{ duration: 0.5, ease }}
                      />
                    </div>
                    <span className="text-[10px] text-white/20 tabular-nums font-[family-name:var(--font-brand-sans)]">
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
            className="flex flex-col items-center justify-center py-32 px-6 text-center"
          >
            {/* Decorative icon */}
            <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mb-6">
              <svg className="w-5 h-5 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
              </svg>
            </div>
            <p
              className={cn(
                'text-2xl font-light text-white/30 mb-2',
                'font-[family-name:var(--font-brand-serif)]',
              )}
            >
              No artists found
            </p>
            <p className="text-sm text-white/20 font-[family-name:var(--font-brand-sans)] mb-6">
              Try a different search term
            </p>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className={cn(
                'text-xs text-kawai-red/70 hover:text-kawai-red transition-colors duration-200',
                'font-[family-name:var(--font-brand-sans)] font-medium tracking-wide',
                'underline underline-offset-4 decoration-kawai-red/30 hover:decoration-kawai-red/60',
              )}
            >
              Clear search
            </button>
          </motion.div>
        )}
    </section>
  )
}
