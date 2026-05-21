'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Play } from 'lucide-react'
import type { ArtistI2LBlockData, VideoItem } from '../ArtistI2LBlock'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const contentVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.04 },
  },
  exit: { opacity: 0, transition: { duration: 0.18 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
}

// ---------------------------------------------------------------------------
// Corner accent
// ---------------------------------------------------------------------------

function CornerAccent({ className }: { className?: string }) {
  return (
    <div className={cn('absolute w-14 h-14 z-20 opacity-25 pointer-events-none', className)}>
      <svg viewBox="0 0 100 100" className="text-white w-full h-full" aria-hidden="true">
        <line x1="0" y1="20" x2="20" y2="20" stroke="currentColor" strokeWidth="1.5" />
        <line x1="20" y1="0" x2="20" y2="20" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Library row — card-style sidebar item
// ---------------------------------------------------------------------------

function LibraryRow({
  video,
  index,
  isActive,
  onClick,
}: {
  video: VideoItem
  index: number
  isActive: boolean
  onClick: () => void
}) {
  const numberLabel = String(index + 1).padStart(2, '0')

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Play: ${video.title}`}
      aria-current={isActive ? 'true' : undefined}
      className={cn(
        'group relative flex gap-3 text-left w-full p-2 rounded-md transition-all duration-300',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-kawai-red',
        isActive
          ? 'bg-white/[0.06]'
          : 'hover:bg-white/[0.035]',
      )}
    >
      {/* Active red bar */}
      <span
        aria-hidden="true"
        className={cn(
          'absolute left-0 top-2 bottom-2 w-[2px] bg-kawai-red transition-opacity duration-300',
          isActive ? 'opacity-100' : 'opacity-0',
        )}
      />

      {/* Thumbnail */}
      <div
        className={cn(
          'relative w-[124px] h-[70px] rounded-[3px] overflow-hidden shrink-0 transition-all duration-300',
          isActive
            ? 'ring-1 ring-kawai-red/80 shadow-[0_4px_18px_-2px_rgba(225,25,34,0.45)]'
            : 'ring-1 ring-white/[0.06] group-hover:ring-white/20',
        )}
      >
        <Image
          src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
          alt=""
          fill
          className={cn(
            'object-cover transition-all duration-500',
            isActive ? 'scale-105' : 'opacity-75 group-hover:opacity-100 group-hover:scale-[1.03]',
          )}
          sizes="124px"
        />

        {/* Overlay tint when inactive */}
        <div
          className={cn(
            'absolute inset-0 transition-colors duration-300',
            isActive ? 'bg-transparent' : 'bg-black/30 group-hover:bg-black/0',
          )}
        />

        {/* Play indicator — active = pulsing dot, inactive = play triangle on hover */}
        {isActive ? (
          <div className="absolute bottom-1.5 right-1.5 flex items-center gap-1">
            <span
              className="block w-1.5 h-1.5 rounded-full bg-kawai-red"
              style={{ animation: 'pulse-soft 2s ease-in-out infinite' }}
            />
            <span className="text-[8px] tracking-[0.18em] uppercase text-white font-semibold font-[family-name:var(--font-brand-sans)]">
              Now
            </span>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Play className="w-4 h-4 text-white fill-white" />
          </div>
        )}
      </div>

      {/* Meta column */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div>
          <p
            className={cn(
              'text-[12px] leading-snug line-clamp-2 transition-colors duration-300 font-[family-name:var(--font-brand-sans)]',
              isActive ? 'text-white font-medium' : 'text-white/75 group-hover:text-white',
            )}
          >
            {video.title}
          </p>
        </div>

        <div className="flex items-center gap-1.5 mt-1">
          {video.artistImageUrl && (
            <div className="relative w-3.5 h-3.5 rounded-full overflow-hidden shrink-0 ring-1 ring-white/15">
              <Image src={video.artistImageUrl} alt="" fill className="object-cover" sizes="14px" />
            </div>
          )}
          <span
            className={cn(
              'text-[9.5px] tracking-[0.18em] uppercase truncate font-[family-name:var(--font-brand-sans)]',
              isActive ? 'text-kawai-red font-semibold' : 'text-white/40',
            )}
          >
            {video.artistName ?? video.eyebrowText ?? 'Featured'}
          </span>
          <span className="text-white/15 text-[9px] shrink-0">·</span>
          <span className="text-[9px] text-white/30 tabular-nums font-[family-name:var(--font-brand-sans)] shrink-0">
            {numberLabel}
          </span>
        </div>
      </div>
    </button>
  )
}

// ---------------------------------------------------------------------------
// Main renderer
// ---------------------------------------------------------------------------

interface ArtistI2LRendererProps extends Omit<ArtistI2LBlockData, 'videos' | 'showArtistVideos' | 'maxArtistVideos'> {
  resolvedVideos: VideoItem[]
  initialVisible: number
}

type FilterMode = 'all' | 'featured' | 'artists'

export function ArtistI2LRenderer({
  sectionLabel,
  heading,
  subheading: _subheading,
  resolvedVideos,
}: ArtistI2LRendererProps) {
  const [idx, setIdx] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterMode, setFilterMode] = useState<FilterMode>('all')

  const total = resolvedVideos.length
  const safeIdx = Math.min(idx, total - 1)
  const current = resolvedVideos[safeIdx]

  const prev = useCallback(() => setIdx(i => (i - 1 + total) % total), [total])
  const next = useCallback(() => setIdx(i => (i + 1) % total), [total])

  // Keyboard nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev() }
      else if (e.key === 'ArrowRight') { e.preventDefault(); next() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [prev, next])

  const hasArtists = useMemo(() => resolvedVideos.some(v => !v.isManual), [resolvedVideos])
  const hasFeatured = useMemo(() => resolvedVideos.some(v => v.isManual), [resolvedVideos])

  const filteredVideos = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return resolvedVideos.filter(v => {
      if (filterMode === 'featured' && !v.isManual) return false
      if (filterMode === 'artists' && v.isManual) return false
      if (!q) return true
      return (
        v.title.toLowerCase().includes(q) ||
        (v.artistName?.toLowerCase().includes(q) ?? false)
      )
    })
  }, [resolvedVideos, searchQuery, filterMode])

  if (!current || total === 0) return null

  const idxLabel = String(safeIdx + 1).padStart(2, '0')
  const totalLabel = String(total).padStart(2, '0')
  const showSidebar = total > 1

  return (
    <section
      className="relative w-full overflow-hidden bg-kawai-black isolate"
      style={{ height: 'clamp(640px, 82vh, 980px)' }}
      aria-label={sectionLabel ?? 'Artist Videos'}
    >
      {/* Inline keyframes for pulse-soft */}
      <style>{`
        @keyframes pulse-soft {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }
      `}</style>

      {/* ── Background video — single iframe, swapped via key. No fade. ──────── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 overflow-hidden bg-kawai-black">
          <iframe
            key={current.youtubeId}
            src={`https://www.youtube.com/embed/${current.youtubeId}?autoplay=1&mute=1&loop=1&playlist=${current.youtubeId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3`}
            allow="autoplay; encrypted-media"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none border-0"
            style={{ width: 'max(100%, 177.78vh)', height: 'max(100%, 56.25vw)' }}
            title={current.title}
          />
        </div>
      </div>

      {/* ── Scrim: precision-anchored to bottom-left only ──────────────────────
          Replaces the heavy 96%-black bottom + 78%-black left vignettes with a
          focused radial that keeps the center/upper video vivid. */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: `
            radial-gradient(140% 95% at 0% 100%, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.78) 18%, rgba(0,0,0,0.45) 38%, rgba(0,0,0,0.10) 65%, rgba(0,0,0,0) 80%),
            linear-gradient(to top, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.0) 35%)
          `,
        }}
        aria-hidden="true"
      />

      {/* Subtle top scrim for the corner accent + ambience */}
      <div
        className="absolute inset-x-0 top-0 h-32 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 100%)' }}
        aria-hidden="true"
      />

      {/* ── Film grain (lighter) ───────────────────────────────────────────── */}
      <div
        className="absolute inset-0 z-10 opacity-[0.025] mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: GRAIN_SVG }}
        aria-hidden="true"
      />

      {/* ── Corner accents ─────────────────────────────────────────────────── */}
      <CornerAccent className="top-0 left-0" />
      <CornerAccent className="bottom-0 right-0 rotate-180" />

      {/* ── Glass sidebar — z-30 so it sits above bottom panel ─────────────── */}
      {showSidebar && (
        <aside
          className="hidden md:flex absolute top-0 right-0 bottom-0 z-30 flex-col w-[300px] xl:w-[340px]"
          style={{
            background: 'linear-gradient(180deg, rgba(10,8,6,0.62) 0%, rgba(10,8,6,0.55) 100%)',
            backdropFilter: 'blur(24px) saturate(160%)',
            WebkitBackdropFilter: 'blur(24px) saturate(160%)',
            borderLeft: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '-12px 0 48px rgba(0,0,0,0.5), inset 1px 0 0 rgba(255,255,255,0.04)',
          }}
        >
          {/* Header */}
          <div
            className="flex-shrink-0 px-5 pt-5 pb-3"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="flex items-baseline justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <span className="block w-1 h-1 rounded-full bg-kawai-red" />
                <p className="text-[10px] tracking-[0.32em] uppercase text-white font-semibold font-[family-name:var(--font-brand-sans)]">
                  The Library
                </p>
              </div>
              <span
                className="text-white/35 tabular-nums font-[family-name:var(--font-brand-sans)]"
                style={{ fontSize: '10.5px', letterSpacing: '0.1em' }}
              >
                <span className="text-white/80">{idxLabel}</span>
                <span className="mx-1 text-white/20">/</span>
                {totalLabel}
              </span>
            </div>

            {/* Filter pills — only show if both categories exist */}
            {hasArtists && hasFeatured && (
              <div className="flex items-center gap-1 mb-3 -mx-0.5">
                {([
                  { key: 'all', label: 'All' },
                  { key: 'featured', label: 'Featured' },
                  { key: 'artists', label: 'Artists' },
                ] as const).map(({ key, label }) => {
                  const active = filterMode === key
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setFilterMode(key)}
                      className={cn(
                        'px-2.5 py-1 text-[9.5px] tracking-[0.15em] uppercase font-semibold transition-all duration-200 font-[family-name:var(--font-brand-sans)] rounded-sm',
                        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-kawai-red',
                        active
                          ? 'bg-white text-kawai-black'
                          : 'text-white/45 hover:text-white hover:bg-white/[0.05]',
                      )}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
            )}

            {/* Search */}
            <div className="relative">
              <svg
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/35 pointer-events-none"
                fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search…"
                className="w-full bg-white/[0.06] border border-white/[0.08] text-white placeholder-white/30 text-[11px] pl-8 pr-7 py-2 rounded focus:outline-none focus:border-kawai-red/60 focus:bg-white/[0.10] transition-all duration-200 font-[family-name:var(--font-brand-sans)]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/80 transition-colors focus-visible:outline-none"
                  aria-label="Clear search"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Scrollable list */}
          <div
            className="flex-1 overflow-y-auto px-3 py-2.5 flex flex-col gap-0.5 min-h-0"
            style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.15) transparent' }}
          >
            {filteredVideos.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-[11px] text-white/35 font-[family-name:var(--font-brand-sans)] mb-2">
                  No matches
                </p>
                <button
                  type="button"
                  onClick={() => { setSearchQuery(''); setFilterMode('all') }}
                  className="text-[10px] tracking-[0.15em] uppercase text-kawai-red hover:text-kawai-red-400 transition-colors font-semibold font-[family-name:var(--font-brand-sans)]"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              filteredVideos.map((video) => {
                const globalIdx = resolvedVideos.indexOf(video)
                return (
                  <LibraryRow
                    key={video.id}
                    video={video}
                    index={globalIdx}
                    isActive={globalIdx === safeIdx}
                    onClick={() => setIdx(globalIdx)}
                  />
                )
              })
            )}
          </div>

          {/* Nav footer */}
          <div
            className="flex-shrink-0 flex items-center justify-between gap-2 px-4 py-3"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            <button
              type="button"
              onClick={prev}
              aria-label="Previous video"
              className="flex-1 h-9 border border-white/15 flex items-center justify-center gap-1.5 text-white/60 hover:border-white/45 hover:text-white hover:bg-white/[0.06] transition-all duration-200 focus-visible:outline-none focus-visible:border-kawai-red rounded text-[9.5px] tracking-[0.15em] uppercase font-semibold font-[family-name:var(--font-brand-sans)]"
            >
              <ArrowLeft className="h-3 w-3" />
              Prev
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next video"
              className="flex-1 h-9 border border-white/15 flex items-center justify-center gap-1.5 text-white/60 hover:border-white/45 hover:text-white hover:bg-white/[0.06] transition-all duration-200 focus-visible:outline-none focus-visible:border-kawai-red rounded text-[9.5px] tracking-[0.15em] uppercase font-semibold font-[family-name:var(--font-brand-sans)]"
            >
              Next
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </aside>
      )}

      {/* ── Bottom content panel ────────────────────────────────────────────
          pointer-events-none on wrapper, auto on inner so it doesn't intercept
          clicks across the full width (and over the sidebar). */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
        <div
          className="px-8 md:px-12 pb-10 md:pb-14 pointer-events-auto"
          style={{ paddingRight: showSidebar ? 'calc(300px + 3rem)' : undefined }}
        >
          {/* Section label */}
          <div className="flex items-center gap-3 mb-5">
            <span className="block w-8 h-[2px] bg-kawai-red" aria-hidden="true" />
            <p
              className="text-[11px] tracking-[0.32em] uppercase text-white font-semibold font-[family-name:var(--font-brand-sans)]"
              style={{ textShadow: '0 1px 12px rgba(0,0,0,0.85)' }}
            >
              {sectionLabel ?? 'Instrumental To Life'}
            </p>
          </div>

          {/* Optional large heading */}
          {heading && (
            <h2
              className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white leading-[0.92] mb-7 max-w-4xl"
              style={{
                fontFamily: 'var(--font-brand-sans)',
                fontWeight: 900,
                letterSpacing: '-0.035em',
                textShadow: '0 2px 24px rgba(0,0,0,0.55)',
              }}
            >
              {heading}
            </h2>
          )}

          {/* Per-slide content */}
          <div className="max-w-2xl">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`content-${safeIdx}`}
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {/* Artist attribution OR eyebrow */}
                {!current.isManual && current.artistName ? (
                  <motion.div variants={itemVariants} className="flex items-center gap-2.5 mb-3.5">
                    {current.artistImageUrl && (
                      <div className="relative w-7 h-7 rounded-full overflow-hidden shrink-0 ring-1 ring-white/25">
                        <Image
                          src={current.artistImageUrl}
                          alt={current.artistName}
                          fill
                          className="object-cover"
                          sizes="28px"
                        />
                      </div>
                    )}
                    <span
                      className="text-[11px] tracking-[0.26em] uppercase text-white/90 font-semibold font-[family-name:var(--font-brand-sans)]"
                      style={{ textShadow: '0 1px 8px rgba(0,0,0,0.85)' }}
                    >
                      {current.artistName}
                    </span>
                  </motion.div>
                ) : current.isManual && current.eyebrowText ? (
                  <motion.p
                    variants={itemVariants}
                    className="text-[11px] tracking-[0.26em] uppercase text-white/90 font-semibold mb-3.5 font-[family-name:var(--font-brand-sans)]"
                    style={{ textShadow: '0 1px 8px rgba(0,0,0,0.85)' }}
                  >
                    {current.eyebrowText}
                  </motion.p>
                ) : null}

                {/* Title */}
                <motion.p
                  variants={itemVariants}
                  className="text-3xl md:text-4xl xl:text-[44px] text-white mb-4 leading-[1.05]"
                  style={{
                    fontFamily: 'var(--font-brand-luxury)',
                    fontStyle: 'italic',
                    fontWeight: 600,
                    letterSpacing: '-0.005em',
                    textShadow: '0 2px 20px rgba(0,0,0,0.7), 0 1px 4px rgba(0,0,0,0.85)',
                  }}
                >
                  {current.title}
                </motion.p>

                {/* Description */}
                {current.description && (
                  <motion.p
                    variants={itemVariants}
                    className="text-[15px] text-white/80 mb-7 max-w-xl leading-relaxed font-[family-name:var(--font-brand-sans)]"
                    style={{ textShadow: '0 1px 10px rgba(0,0,0,0.85)' }}
                  >
                    {current.description}
                  </motion.p>
                )}

                {/* CTAs */}
                <motion.div
                  variants={itemVariants}
                  className={cn('flex flex-wrap items-center gap-3', !current.description && 'mt-6')}
                >
                  <Link
                    href={`https://www.youtube.com/watch?v=${current.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-3 pl-7 pr-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.22em] bg-white text-kawai-black hover:bg-kawai-pearl transition-colors duration-300 font-[family-name:var(--font-brand-sans)]"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    Watch Video
                  </Link>

                  {current.isManual && current.ctaText && current.ctaUrl ? (
                    <Link
                      href={current.ctaUrl}
                      target={current.ctaOpenInNewTab ? '_blank' : undefined}
                      rel={current.ctaOpenInNewTab ? 'noopener noreferrer' : undefined}
                      className="group inline-flex items-center gap-3 px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.22em] border border-white/35 text-white hover:border-white hover:bg-white/[0.08] transition-all duration-300 font-[family-name:var(--font-brand-sans)]"
                    >
                      {current.ctaText}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </Link>
                  ) : !current.isManual && current.artistSlug ? (
                    <Link
                      href={`/artists/${current.artistSlug}`}
                      className="group inline-flex items-center gap-3 px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.22em] border border-white/35 text-white hover:border-white hover:bg-white/[0.08] transition-all duration-300 font-[family-name:var(--font-brand-sans)]"
                    >
                      View Artist
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </Link>
                  ) : null}
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Mobile nav (when sidebar is hidden) ──────────────────────────── */}
      {showSidebar && (
        <div className="md:hidden absolute bottom-4 right-4 z-30 flex items-center gap-2 pointer-events-auto">
          <span className="text-[10px] tabular-nums text-white/70 font-[family-name:var(--font-brand-sans)] mr-1"
                style={{ textShadow: '0 1px 6px rgba(0,0,0,0.9)' }}>
            <span className="text-white">{idxLabel}</span>
            <span className="mx-1 text-white/30">/</span>
            {totalLabel}
          </span>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous video"
            className="w-10 h-10 rounded-full bg-black/55 backdrop-blur border border-white/15 flex items-center justify-center text-white/85 active:bg-black/75 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next video"
            className="w-10 h-10 rounded-full bg-black/55 backdrop-blur border border-white/15 flex items-center justify-center text-white/85 active:bg-black/75 transition-all"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </section>
  )
}
