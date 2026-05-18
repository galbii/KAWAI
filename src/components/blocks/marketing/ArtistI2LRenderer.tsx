'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
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
    transition: { staggerChildren: 0.1, delayChildren: 0.04 },
  },
  exit: { opacity: 0, transition: { duration: 0.18 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
}

// ---------------------------------------------------------------------------
// Corner accent (matches FeaturedCollectionsCarousel)
// ---------------------------------------------------------------------------

function CornerAccent({ className }: { className?: string }) {
  return (
    <div className={cn('absolute w-14 h-14 z-20 opacity-20 pointer-events-none', className)}>
      <svg viewBox="0 0 100 100" className="text-white w-full h-full" aria-hidden="true">
        <line x1="0" y1="20" x2="20" y2="20" stroke="currentColor" strokeWidth="1.5" />
        <line x1="20" y1="0" x2="20" y2="20" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Thumbnail strip item
// ---------------------------------------------------------------------------

function Thumbnail({
  video,
  isActive,
  onClick,
}: {
  video: VideoItem
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Play: ${video.title}`}
      className={cn(
        'group relative flex items-center gap-2.5 text-left transition-all duration-300 w-full',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-kawai-red',
      )}
    >
      {/* Thumbnail image */}
      <div
        className={cn(
          'relative w-[200px] h-[113px] rounded overflow-hidden shrink-0 transition-all duration-300',
          isActive
            ? 'ring-2 ring-kawai-red scale-[1.03] shadow-[0_0_24px_rgba(225,25,34,0.45)]'
            : 'opacity-40 hover:opacity-80',
        )}
      >
        <Image
          src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
          alt={video.title}
          fill
          className="object-cover"
          sizes="200px"
        />
        {!isActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/5 transition-colors duration-200">
            <svg className="w-3 h-3 text-white/80" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        )}
      </div>

      {/* Title for active item — desktop only */}
      {isActive && (
        <span className="hidden xl:block text-xs text-white/70 leading-snug max-w-[160px] line-clamp-3 font-[family-name:var(--font-brand-sans)]">
          {video.title}
        </span>
      )}
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

export function ArtistI2LRenderer({
  sectionLabel,
  heading,
  subheading,
  initialVisible,
  resolvedVideos,
}: ArtistI2LRendererProps) {
  const [idx, setIdx] = useState(0)
  const [thumbsExpanded, setThumbsExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const total = resolvedVideos.length
  const safeIdx = Math.min(idx, total - 1)
  const current = resolvedVideos[safeIdx]

  const prev = useCallback(() => setIdx(i => (i - 1 + total) % total), [total])
  const next = useCallback(() => setIdx(i => (i + 1) % total), [total])

  // Keyboard nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev() }
      else if (e.key === 'ArrowRight') { e.preventDefault(); next() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [prev, next])

  if (!current || total === 0) return null

  const idxLabel = String(safeIdx + 1).padStart(2, '0')
  const totalLabel = String(total).padStart(2, '0')

  const q = searchQuery.trim().toLowerCase()
  const filteredVideos = q
    ? resolvedVideos.filter(
        v =>
          v.title.toLowerCase().includes(q) ||
          (v.artistName?.toLowerCase().includes(q) ?? false),
      )
    : resolvedVideos

  const visibleCount = thumbsExpanded ? filteredVideos.length : Math.min(initialVisible, filteredVideos.length)
  const hiddenCount = filteredVideos.length - initialVisible

  return (
    <section
      className="relative w-full overflow-hidden bg-kawai-black"
      style={{ height: 'clamp(620px, 80vh, 960px)' }}
      aria-label={sectionLabel ?? 'Artist Videos'}
    >
      {/* ── Background: muted autoplay YouTube video ─────────────────── */}
      <AnimatePresence initial={false}>
        <motion.div
          key={`bg-${safeIdx}`}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
        >
          <div className="absolute inset-0 overflow-hidden bg-kawai-black">
            <iframe
              key={current.youtubeId}
              src={`https://www.youtube.com/embed/${current.youtubeId}?autoplay=1&mute=1&loop=1&playlist=${current.youtubeId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`}
              allow="autoplay; encrypted-media"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{ width: 'max(100%, 177.78vh)', height: 'max(100%, 56.25vw)' }}
              title={current.title}
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── Gradient overlays ─────────────────────────────────────────── */}
      {/* Strong bottom vignette — this is where the text lives */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.75) 30%, rgba(0,0,0,0.25) 65%, rgba(0,0,0,0.10) 100%)',
        }}
        aria-hidden="true"
      />
      {/* Left-side vignette so left-column text always sits on dark */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            'linear-gradient(to right, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.40) 45%, rgba(0,0,0,0.0) 100%)',
        }}
        aria-hidden="true"
      />

      {/* ── Film grain texture ────────────────────────────────────────── */}
      <div
        className="absolute inset-0 z-10 opacity-[0.032] mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: GRAIN_SVG }}
        aria-hidden="true"
      />

      {/* ── Corner accents ────────────────────────────────────────────── */}
      <CornerAccent className="top-0 left-0" />
      <CornerAccent className="bottom-0 right-0 rotate-180" />

      {/* ── Full-height glass panel — right side ─────────────────────── */}
      {total > 1 && (
        <div
          className="hidden md:flex absolute top-0 right-0 bottom-0 z-20 flex-col w-[280px] xl:w-[320px]"
          style={{
            background: 'rgba(10,8,6,0.52)',
            backdropFilter: 'blur(28px) saturate(150%)',
            WebkitBackdropFilter: 'blur(28px) saturate(150%)',
            borderLeft: '1px solid rgba(255,255,255,0.09)',
            boxShadow: '-8px 0 40px rgba(0,0,0,0.45), inset 1px 0 0 rgba(255,255,255,0.04)',
          }}
        >
          {/* Sticky header: label + counter + search */}
          <div
            className="flex-shrink-0 px-5 pt-5 pb-4"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(0,0,0,0.20)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] tracking-[0.28em] uppercase text-kawai-red font-semibold font-[family-name:var(--font-brand-sans)]">
                Video Library
              </p>
              <span
                className="text-white/35 tabular-nums font-[family-name:var(--font-brand-sans)]"
                style={{ fontSize: '11px', letterSpacing: '0.08em' }}
              >
                <span className="text-white/65">{idxLabel}</span>
                <span className="mx-1 text-white/20">/</span>
                {totalLabel}
              </span>
            </div>

            {/* Search input */}
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/35 pointer-events-none"
                fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search videos or artists…"
                className="w-full bg-white/8 border border-white/12 text-white placeholder-white/28 text-[11px] pl-8 pr-8 py-2.5 rounded-lg focus:outline-none focus:border-kawai-red/50 focus:bg-white/12 transition-all duration-200 font-[family-name:var(--font-brand-sans)]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors focus-visible:outline-none"
                  aria-label="Clear search"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Scrollable video list */}
          <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3 min-h-0">
            {filteredVideos.length === 0 ? (
              <p className="text-[11px] text-white/30 py-6 text-center font-[family-name:var(--font-brand-sans)]">
                No results
              </p>
            ) : (
              filteredVideos.map((video) => {
                const globalIdx = resolvedVideos.indexOf(video)
                return (
                  <Thumbnail
                    key={video.id}
                    video={video}
                    isActive={globalIdx === safeIdx}
                    onClick={() => setIdx(globalIdx)}
                  />
                )
              })
            )}
          </div>

          {/* Nav arrows footer */}
          <div
            className="flex-shrink-0 flex items-center justify-between px-5 py-4"
            style={{ borderTop: '1px solid rgba(255,255,255,0.07)', background: 'rgba(0,0,0,0.20)' }}
          >
            <button
              type="button"
              onClick={prev}
              aria-label="Previous video"
              className="w-11 h-10 border border-white/20 flex items-center justify-center text-white/50 hover:border-white/55 hover:text-white hover:bg-white/8 transition-all duration-200 focus-visible:outline-none focus-visible:border-kawai-red rounded"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <span className="text-[9px] text-white/22 tracking-widest uppercase font-[family-name:var(--font-brand-sans)]">
              Recent Work
            </span>
            <button
              type="button"
              onClick={next}
              aria-label="Next video"
              className="w-11 h-10 border border-white/20 flex items-center justify-center text-white/50 hover:border-white/55 hover:text-white hover:bg-white/8 transition-all duration-200 focus-visible:outline-none focus-visible:border-kawai-red rounded"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Bottom content panel ──────────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div
          className="px-8 md:px-12 pb-12"
          style={{ paddingRight: total > 1 ? 'calc(280px + 3rem)' : undefined }}
        >
          <div className="flex items-end">

            {/* ── Left: section label + heading + animated slide info ─── */}
            <div className="flex-1 min-w-0 max-w-2xl">

              {/* Section label */}
              <p
                className="text-xs tracking-[0.28em] uppercase text-kawai-red mb-4 font-semibold font-[family-name:var(--font-brand-sans)]"
                style={{ textShadow: '0 1px 12px rgba(0,0,0,0.9)' }}
              >
                {sectionLabel ?? 'Instrumental To Life'}
              </p>

              {/* Optional large heading — fixed, not animated */}
              {heading && (
                <h2
                  className="text-5xl md:text-6xl lg:text-8xl text-white leading-[0.9] mb-5"
                  style={{ fontFamily: 'var(--font-brand-sans)', fontWeight: 900, letterSpacing: '-0.035em' }}
                >
                  {heading}
                </h2>
              )}

              {/* Kawai-red accent bar */}
              <div className="w-10 h-[3px] bg-kawai-red mb-6" aria-hidden="true" />

              {/* Per-slide content — animated */}
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={`content-${safeIdx}`}
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {/* Artist attribution (auto-pulled videos only) */}
                  {!current.isManual && current.artistName && (
                    <motion.div variants={itemVariants} className="flex items-center gap-2 mb-3">
                      {current.artistImageUrl && (
                        <div className="relative w-7 h-7 rounded-full overflow-hidden shrink-0 ring-1 ring-white/20">
                          <Image
                            src={current.artistImageUrl}
                            alt={current.artistName}
                            fill
                            className="object-cover"
                            sizes="24px"
                          />
                        </div>
                      )}
                      <span
                        className="text-xs tracking-[0.22em] uppercase text-white/80 font-semibold font-[family-name:var(--font-brand-sans)]"
                        style={{ textShadow: '0 1px 8px rgba(0,0,0,0.95)' }}
                      >
                        {current.artistName}
                      </span>
                    </motion.div>
                  )}

                  {/* Eyebrow (manual videos) */}
                  {current.isManual && current.eyebrowText && (
                    <motion.p
                      variants={itemVariants}
                      className="text-xs tracking-[0.22em] uppercase text-white/80 font-semibold mb-3 font-[family-name:var(--font-brand-sans)]"
                      style={{ textShadow: '0 1px 8px rgba(0,0,0,0.95)' }}
                    >
                      {current.eyebrowText}
                    </motion.p>
                  )}

                  {/* Video title */}
                  <motion.p
                    variants={itemVariants}
                    className="text-3xl md:text-4xl xl:text-5xl text-white mb-3 leading-tight"
                    style={{
                      fontFamily: 'var(--font-brand-luxury)',
                      fontStyle: 'italic',
                      fontWeight: 600,
                      textShadow: '0 2px 24px rgba(0,0,0,0.9), 0 1px 6px rgba(0,0,0,0.95)',
                    }}
                  >
                    {current.title}
                  </motion.p>

                  {/* Description */}
                  {current.description && (
                    <motion.p
                      variants={itemVariants}
                      className="text-base text-white/80 mb-6 max-w-lg leading-relaxed font-[family-name:var(--font-brand-sans)]"
                      style={{ textShadow: '0 1px 12px rgba(0,0,0,0.95)' }}
                    >
                      {current.description}
                    </motion.p>
                  )}

                  {/* CTAs */}
                  <motion.div variants={itemVariants} className={cn('flex flex-wrap items-center gap-3', !current.description && 'mt-5')}>
                    {/* Watch video — always shown */}
                    <Link
                      href={`https://www.youtube.com/watch?v=${current.youtubeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 px-9 py-4 text-xs font-semibold uppercase tracking-[0.18em] bg-white text-kawai-black hover:bg-kawai-pearl transition-colors duration-300 font-[family-name:var(--font-brand-sans)]"
                    >
                      Watch Video
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </Link>

                    {/* Secondary CTA — manual custom or artist link */}
                    {current.isManual && current.ctaText && current.ctaUrl ? (
                      <Link
                        href={current.ctaUrl}
                        target={current.ctaOpenInNewTab ? '_blank' : undefined}
                        rel={current.ctaOpenInNewTab ? 'noopener noreferrer' : undefined}
                        className="inline-flex items-center gap-3 px-9 py-4 text-xs font-semibold uppercase tracking-[0.18em] border border-white/40 text-white hover:border-white hover:bg-white/10 transition-all duration-300 font-[family-name:var(--font-brand-sans)]"
                      >
                        {current.ctaText}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    ) : !current.isManual && current.artistSlug ? (
                      <Link
                        href={`/artists/${current.artistSlug}`}
                        className="inline-flex items-center gap-3 px-9 py-4 text-xs font-semibold uppercase tracking-[0.18em] border border-white/40 text-white hover:border-white hover:bg-white/10 transition-all duration-300 font-[family-name:var(--font-brand-sans)]"
                      >
                        View Artist
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    ) : null}
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>

          {/* ── Progress bars ─────────────────────────────────────────── */}
          {total > 1 && (
            <div className="flex gap-1.5 mt-8">
              {resolvedVideos.map((video, i) => (
                <button
                  key={video.id}
                  type="button"
                  onClick={() => setIdx(i)}
                  aria-label={`Go to ${video.title}`}
                  className="flex-1 group relative h-[3px] focus-visible:outline-none"
                >
                  <div className="absolute inset-0 bg-white/12" />
                  {i === safeIdx ? (
                    <motion.div
                      key={safeIdx}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 12, ease: 'linear' }}
                      className="absolute inset-0 bg-white/55 origin-left"
                    />
                  ) : i < safeIdx ? (
                    <div className="absolute inset-0 bg-white/30" />
                  ) : null}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
