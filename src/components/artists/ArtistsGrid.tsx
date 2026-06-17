'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion'
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

function hasFeaturedImage(artist: Artist): boolean {
  if (artist.image && typeof artist.image === 'object') {
    if ((artist.image as Media).url) return true
  }
  return Boolean(artist.imageUrl)
}

const INSTRUMENT_LABELS: Record<string, string> = {
  grand: 'Grand Piano',
  upright: 'Upright Piano',
  digital: 'Digital Piano',
  hybrid: 'Hybrid Piano',
  multiple: 'Multiple Instruments',
}

const INSTRUMENT_LABELS_SHORT: Record<string, string> = {
  grand: 'Grand',
  upright: 'Upright',
  digital: 'Digital',
  hybrid: 'Hybrid',
  multiple: 'Multiple',
}

const PLATFORM_LABELS: Record<string, string> = {
  instagram: 'Instagram',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  facebook: 'Facebook',
  twitter: 'X',
  spotify: 'Spotify',
  'apple-music': 'Apple Music',
  soundcloud: 'SoundCloud',
  website: 'Website',
  other: '',
}

const PAGE_SIZE = 12

// Easing matching the brand's elegant curve
const ease = [0.25, 0.46, 0.45, 0.94] as const

type RecentWorkItem = NonNullable<Artist['recentWork']>[number]

/** Extract a 4-digit year from a recent-work date, or null if unparseable. */
function workYear(date?: string | null): string | null {
  if (!date) return null
  const d = new Date(date)
  return Number.isNaN(d.getTime()) ? null : String(d.getFullYear())
}

/** Top recent-work entries — featured first, then most recent. */
function topRecentWork(artist: Artist, max = 3): RecentWorkItem[] {
  const items = artist.recentWork ?? []
  return [...items]
    .sort((a, b) => {
      const af = a.featured ? 1 : 0
      const bf = b.featured ? 1 : 0
      if (af !== bf) return bf - af
      const ad = a.date ? new Date(a.date).getTime() : 0
      const bd = b.date ? new Date(b.date).getTime() : 0
      return bd - ad
    })
    .slice(0, max)
}

/** Tag chips for the expanded panel: instrument, region, up to two genres. */
function buildChips(artist: Artist): string[] {
  const chips: string[] = []
  if (artist.instrument && INSTRUMENT_LABELS_SHORT[artist.instrument]) {
    chips.push(INSTRUMENT_LABELS_SHORT[artist.instrument]!)
  }
  if (artist.region) chips.push(artist.region)
  if (artist.genre) {
    artist.genre
      .split(',')
      .map((g) => g.trim())
      .filter(Boolean)
      .slice(0, 2)
      .forEach((g) => chips.push(g))
  }
  return chips
}

/**
 * Resolve whether the device can hover (desktop pointer) vs. touch.
 * Returns `null` until mounted so SSR + first client render match (both collapsed),
 * avoiding a hydration mismatch.
 */
function useCanHover(): boolean | null {
  const [canHover, setCanHover] = useState<boolean | null>(null)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      setCanHover(true)
      return
    }
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    setCanHover(mq.matches)
    const handler = (e: MediaQueryListEvent) => setCanHover(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return canHover
}

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
      className="relative flex items-center px-6 sm:px-12 lg:px-16 pt-10 pb-2 select-none"
      aria-hidden="true"
    >
      {/* Ghost background letter — extends down into the rows below as a watermark */}
      <span
        className="absolute left-2 sm:left-6 lg:left-8 top-0 text-[8.5rem] font-light leading-none text-white/[0.028] pointer-events-none z-0"
        style={{ fontFamily: 'var(--font-brand-serif)' }}
      >
        {letter}
      </span>
      {/* Foreground label */}
      <span className="relative z-10 text-[10px] font-semibold tracking-[0.26em] uppercase text-kawai-red/50 font-[family-name:var(--font-brand-sans)]">
        {letter}
      </span>
      {/* Extending hairline */}
      <div className="relative z-10 ml-5 flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
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
  /** true = hover-capable pointer, false = touch, null = not yet resolved */
  canHover: boolean | null
  /** Honour prefers-reduced-motion */
  reduce: boolean
}

function AlphaRow({ artist, index, batchIndex, legacy, canHover, reduce }: AlphaRowProps) {
  const imageUrl = getArtistImage(artist)
  const rowDelay = (batchIndex % PAGE_SIZE) * 0.038

  const ref = useRef<HTMLDivElement>(null)
  // Spotlight band — the row counts as "in view" only while it crosses the
  // central ~20% of the viewport. Drives expansion on touch devices.
  const inView = useInView(ref, { margin: '-40% 0px -40% 0px' })
  const [hovered, setHovered] = useState(false)

  // Hover-capable pointers → hover drives expansion. Touch → scroll position does.
  // While canHover is unresolved (null, first paint) stay collapsed to match SSR.
  const expanded = canHover === null ? false : canHover ? hovered : inView
  const isTouch = canHover === false

  const recent = topRecentWork(artist)
  const chips = buildChips(artist)
  const hasPanel = chips.length > 0 || recent.length > 0

  return (
    <motion.div
      ref={ref}
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.42, delay: reduce ? 0 : rowDelay, ease }}
    >
      <Link
        href={`/artists/${artist.slug}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        className={cn(
          'group relative flex items-center gap-6 sm:gap-10 px-6 sm:px-12 lg:px-16 py-8 sm:py-10 lg:py-12',
          'transition-opacity duration-500',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kawai-red focus-visible:ring-inset',
          // Spotlight dimming — only on touch, only when this row isn't the active one
          isTouch && !expanded && 'opacity-50',
        )}
        aria-label={`View profile: ${artist.name}`}
      >
        {/* Vertical red accent bar — grows full-height when expanded */}
        <div
          className={cn(
            'absolute left-0 top-0 w-[3px] bg-kawai-red transition-[height] duration-500 ease-out',
            expanded ? 'h-full' : 'h-0',
          )}
          aria-hidden="true"
        />

        {/* Bottom divider */}
        <div
          className={cn(
            'absolute bottom-0 left-6 sm:left-12 lg:left-16 right-6 sm:right-12 lg:right-16 h-px transition-colors duration-300',
            expanded ? 'bg-white/[0.09]' : 'bg-white/[0.05]',
          )}
          aria-hidden="true"
        />

        {/* Index number */}
        <span
          className={cn(
            'flex-shrink-0 w-9 text-right text-xs tabular-nums leading-none transition-colors duration-300',
            expanded ? 'text-white/30' : 'text-white/[0.12]',
            'font-[family-name:var(--font-brand-sans)]',
          )}
        >
          {String(index).padStart(2, '0')}
        </span>

        {/* Artist name + expanding detail panel */}
        <div className="flex-1 min-w-0">
          <span
            className={cn(
              'block text-xl sm:text-2xl lg:text-3xl font-light leading-tight transition-colors duration-300',
              expanded ? 'text-white' : 'text-white/85',
              'font-[family-name:var(--font-brand-serif)]',
              'line-clamp-2 break-words',
            )}
          >
            {artist.name}
          </span>

          <AnimatePresence initial={false}>
            {expanded && hasPanel && (
              <motion.div
                key="panel"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: reduce ? 0 : 0.4, ease }}
                className="overflow-hidden"
              >
                <div className="pt-4 sm:pt-5 flex flex-col gap-3.5">
                  {/* Tag chips */}
                  {chips.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                      {chips.map((chip) => (
                        <span
                          key={chip}
                          className={cn(
                            'inline-flex items-center rounded-full px-2.5 py-1',
                            'text-[10px] tracking-[0.14em] uppercase',
                            'border border-white/10 bg-white/[0.04] text-white/45',
                            'font-[family-name:var(--font-brand-sans)]',
                          )}
                        >
                          {chip}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Recent work */}
                  {recent.length > 0 && (
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[9px] tracking-[0.26em] uppercase text-kawai-red/50 font-[family-name:var(--font-brand-sans)]">
                        Recent Work
                      </span>
                      <ul className="flex flex-col gap-1 max-w-xl">
                        {recent.map((work, i) => (
                          <li
                            key={work.id ?? i}
                            className="flex items-baseline gap-2.5 min-w-0 font-[family-name:var(--font-brand-sans)]"
                          >
                            <span className="text-sm font-light text-white/75 truncate min-w-0">
                              {work.title}
                            </span>
                            {work.platform && PLATFORM_LABELS[work.platform] && (
                              <span className="flex-shrink-0 text-[11px] tracking-wide text-white/25">
                                {PLATFORM_LABELS[work.platform]}
                              </span>
                            )}
                            {workYear(work.date) && (
                              <span className="ml-auto flex-shrink-0 text-[11px] tabular-nums text-white/25">
                                {workYear(work.date)}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Featured / Legacy badge */}
        {legacy ? (
          <span
            className={cn(
              'hidden lg:block flex-shrink-0',
              'text-[10px] tracking-[0.22em] uppercase font-medium transition-colors duration-300',
              expanded ? 'text-kawai-gold/55' : 'text-kawai-gold/30',
              'font-[family-name:var(--font-brand-sans)]',
            )}
          >
            Legacy
          </span>
        ) : artist.featured && (
          <span
            className={cn(
              'hidden lg:block flex-shrink-0',
              'text-[10px] tracking-[0.22em] uppercase font-medium transition-colors duration-300',
              expanded ? 'text-kawai-gold/70' : 'text-kawai-gold/40',
              'font-[family-name:var(--font-brand-sans)]',
            )}
          >
            Featured
          </span>
        )}

        {/* Circular thumbnail — large, prominent portrait */}
        <div
          className={cn(
            'relative flex-shrink-0 w-36 h-36 sm:w-52 sm:h-52 lg:w-64 lg:h-64 rounded-full overflow-hidden',
            'transition-all duration-500',
            expanded
              ? 'border border-white/20 ring-1 ring-kawai-red/20'
              : 'border border-white/[0.08] ring-0',
          )}
        >
          <Image
            src={imageUrl}
            alt=""
            fill
            className={cn(
              'object-cover transition-transform duration-700 ease-out',
              expanded && 'scale-110',
            )}
            sizes="(max-width: 640px) 144px, (max-width: 1024px) 208px, 256px"
            aria-hidden="true"
          />
          <div
            className={cn(
              'absolute inset-0 transition-colors duration-500',
              expanded ? 'bg-black/0' : 'bg-black/20',
            )}
            aria-hidden="true"
          />
        </div>

        {/* Chevron — slides in when expanded */}
        <svg
          className={cn(
            'flex-shrink-0 w-4 h-4 transition-all duration-300',
            expanded ? 'text-white/30 translate-x-0' : 'text-transparent -translate-x-2',
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

  const canHover = useCanHover()
  const reduce = useReducedMotion() ?? false

  // On touch devices, default to the A–Z list view (rows expand on scroll).
  // Applied once after the pointer type resolves; users can still toggle to grid.
  const touchDefaultApplied = useRef(false)
  useEffect(() => {
    if (canHover === false && !touchDefaultApplied.current) {
      touchDefaultApplied.current = true
      setSortMode('alpha')
    }
  }, [canHover])

  // Hide *current* artists with no featured image (no upload AND no URL fallback).
  // Legacy is an archival view — show them all regardless, so the toggle stays accessible
  // even when the legacy roster is mostly imageless.
  const visibleCurrent = artists.filter(hasFeaturedImage)
  const visibleLegacy = legacyArtists

  const hasLegacy = visibleLegacy.length > 0
  const isLegacyView = viewMode === 'legacy'
  const activePool = isLegacyView ? visibleLegacy : visibleCurrent

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

  if (visibleCurrent.length === 0 && visibleLegacy.length === 0) return null

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
          <div className="relative">
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
                          canHover={canHover}
                          reduce={reduce}
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

            {/*
              Load More — floats over the bottom of the grid rather than occupying
              its own band. Absolute + pointer-events-none so artists behind stay
              clickable; only the button itself captures pointer events.
            */}
            <AnimatePresence>
              {hasMore && (
                <motion.div
                  key="load-more"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.4, ease }}
                  className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-4 px-6 pb-8 pt-28"
                >
                  <button
                    type="button"
                    onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                    className={cn(
                      'group pointer-events-auto relative inline-flex items-center gap-3 overflow-hidden',
                      'rounded-full pl-8 pr-5 py-4',
                      'text-xs font-semibold tracking-[0.16em] uppercase',
                      'font-[family-name:var(--font-brand-sans)]',
                      'text-white/70 hover:text-white',
                      'bg-white/[0.07] hover:bg-white/[0.11]',
                      'border border-white/12 hover:border-white/25',
                      'backdrop-blur-xl',
                      // Elevation — the button floats above the surface and lifts on hover
                      'shadow-[0_10px_30px_-8px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)]',
                      'hover:shadow-[0_20px_46px_-10px_rgba(0,0,0,0.75),inset_0_1px_0_rgba(255,255,255,0.14)]',
                      'hover:-translate-y-0.5 active:translate-y-0',
                      'transition-all duration-300 ease-out',
                    )}
                  >
                    {/* Shimmer sweep */}
                    <span className="absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                    <span className="relative">Load More</span>

                    {/* Remaining-count chip — pops red on hover */}
                    <span
                      className={cn(
                        'relative inline-flex items-center justify-center rounded-full px-2.5 py-0.5',
                        'text-[10px] font-medium tabular-nums tracking-normal',
                        'bg-white/10 text-white/55',
                        'group-hover:bg-kawai-red group-hover:text-white',
                        'transition-colors duration-300',
                      )}
                    >
                      +{filteredArtists.length - visibleCount}
                    </span>

                    {/* Downward cue */}
                    <svg
                      className="relative w-3.5 h-3.5 text-white/40 group-hover:text-white/80 group-hover:translate-y-0.5 transition-all duration-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Progress indicator — single clean bar */}
                  <div className="relative flex flex-col items-center gap-2" aria-hidden="true">
                    <div className="relative h-[3px] w-44 rounded-full bg-white/[0.08] overflow-hidden">
                      <motion.div
                        className="absolute inset-y-0 left-0 rounded-full bg-white/30"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPct}%` }}
                        transition={{ duration: 0.5, ease }}
                      />
                    </div>
                    <span className="text-[10px] tracking-wide text-white/25 tabular-nums font-[family-name:var(--font-brand-sans)]">
                      {visibleCount} of {filteredArtists.length}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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

        {/* Divider — separates the grid from the section below */}
        <div className="h-px w-full bg-kawai-red" aria-hidden="true" />
    </section>
  )
}
