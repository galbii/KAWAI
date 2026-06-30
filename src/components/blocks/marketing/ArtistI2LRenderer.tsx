'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, ChevronUp, Play, X } from 'lucide-react'
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

type FilterMode = 'all' | 'featured' | 'artists'

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
// Library row — card-style sidebar item (used by desktop sidebar + mobile sheet)
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
      aria-current={isActive ? 'true' : undefined}
      className={cn(
        'group relative flex gap-3 text-left w-full p-2 rounded-md transition-all duration-300',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-kawai-red',
        isActive
          ? 'bg-white/[0.06]'
          : 'hover:bg-white/[0.035]',
      )}
    >
      <span className="sr-only">Play </span>
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
              isActive ? 'text-kawai-red-400 font-semibold' : 'text-white/55',
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
// Mobile: Player — poster + tap-to-watch + swipe-to-navigate
// ---------------------------------------------------------------------------

function MobilePlayer({
  video,
  idxLabel,
  totalLabel,
  sectionLabel,
  showSwipeHint,
  onPrev,
  onNext,
}: {
  video: VideoItem
  idxLabel: string
  totalLabel: string
  sectionLabel: string
  showSwipeHint: boolean
  onPrev: () => void
  onNext: () => void
}) {
  const touchStart = useRef<{ x: number; y: number; t: number } | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    if (!touch) return
    touchStart.current = { x: touch.clientX, y: touch.clientY, t: Date.now() }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const start = touchStart.current
    touchStart.current = null
    if (!start) return
    const touch = e.changedTouches[0]
    if (!touch) return
    const dx = touch.clientX - start.x
    const dy = touch.clientY - start.y
    const dt = Date.now() - start.t
    // Horizontal swipe: ignore mostly-vertical or very slow gestures
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4 && dt < 600) {
      if (dx < 0) onNext()
      else onPrev()
    }
  }

  return (
    <div
      className="relative w-full overflow-hidden bg-kawai-black flex-shrink-0 select-none"
      style={{ aspectRatio: '4 / 5', maxHeight: '62svh' }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Poster — crossfades on change */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={video.youtubeId}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
            alt={video.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
            unoptimized
          />
        </motion.div>
      </AnimatePresence>

      {/* Top + bottom scrims */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 28%),
            linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 55%)
          `,
        }}
        aria-hidden="true"
      />

      {/* Film grain */}
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: GRAIN_SVG }}
        aria-hidden="true"
      />

      {/* Corner accent */}
      <CornerAccent className="top-0 left-0" />

      {/* Top: section label + counter */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 pt-5 z-10 pointer-events-none">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="block w-6 h-[1.5px] bg-kawai-red shrink-0" aria-hidden="true" />
          <p
            className="text-[9.5px] tracking-[0.3em] uppercase text-white font-semibold truncate font-[family-name:var(--font-brand-sans)]"
            style={{ textShadow: '0 1px 8px rgba(0,0,0,0.85)' }}
          >
            {sectionLabel}
          </p>
        </div>
        <span
          className="text-[10px] tabular-nums text-white/85 font-[family-name:var(--font-brand-sans)] shrink-0 ml-2"
          style={{ letterSpacing: '0.1em', textShadow: '0 1px 6px rgba(0,0,0,0.9)' }}
        >
          <span className="text-white">{idxLabel}</span>
          <span className="mx-1 text-white/30">/</span>
          {totalLabel}
        </span>
      </div>

      {/* Big play button — opens YouTube */}
      <Link
        href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Watch on YouTube: ${video.title}`}
        className="absolute inset-0 flex items-center justify-center group focus-visible:outline-none"
      >
        <span className="relative flex items-center justify-center w-[72px] h-[72px] rounded-full bg-kawai-red/90 backdrop-blur-sm ring-1 ring-white/25 shadow-[0_8px_36px_rgba(225,25,34,0.45)] transition-transform duration-200 group-active:scale-90">
          <Play className="w-6 h-6 fill-white text-white ml-[3px]" />
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full border border-white/30"
            style={{ animation: 'pulse-ring 2.4s ease-out infinite' }}
          />
        </span>
      </Link>

      {/* Swipe hint — fades out once the user has navigated */}
      {showSwipeHint && (
        <div className="absolute bottom-3.5 left-0 right-0 flex items-center justify-center pointer-events-none">
          <span
            className="text-[8.5px] tracking-[0.34em] uppercase text-white/55 font-semibold font-[family-name:var(--font-brand-sans)]"
            style={{ textShadow: '0 1px 6px rgba(0,0,0,0.9)' }}
          >
            ←  Swipe  →
          </span>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Mobile: Content panel — eyebrow + title + description + CTAs
// ---------------------------------------------------------------------------

function MobileContent({ video }: { video: VideoItem }) {
  return (
    <div className="relative bg-kawai-black px-6 pt-7 pb-6 flex flex-col">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`mob-content-${video.youtubeId}`}
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Eyebrow: artist OR eyebrowText */}
          {!video.isManual && video.artistName ? (
            <motion.div variants={itemVariants} className="flex items-center gap-2.5 mb-3.5">
              {video.artistImageUrl && (
                <div className="relative w-6 h-6 rounded-full overflow-hidden shrink-0 ring-1 ring-white/20">
                  <Image
                    src={video.artistImageUrl}
                    alt={video.artistName}
                    fill
                    className="object-cover"
                    sizes="24px"
                  />
                </div>
              )}
              <span className="text-[10px] tracking-[0.28em] uppercase text-white/90 font-semibold font-[family-name:var(--font-brand-sans)]">
                {video.artistName}
              </span>
            </motion.div>
          ) : video.isManual && video.eyebrowText ? (
            <motion.p
              variants={itemVariants}
              className="text-[10px] tracking-[0.28em] uppercase text-white/90 font-semibold mb-3.5 font-[family-name:var(--font-brand-sans)]"
            >
              {video.eyebrowText}
            </motion.p>
          ) : null}

          {/* Italic luxury title */}
          <motion.p
            variants={itemVariants}
            className="text-[26px] text-white mb-3 leading-[1.1]"
            style={{
              fontFamily: 'var(--font-brand-luxury)',
              fontStyle: 'italic',
              fontWeight: 600,
              letterSpacing: '-0.005em',
            }}
          >
            {video.title}
          </motion.p>

          {/* Description */}
          {video.description && (
            <motion.p
              variants={itemVariants}
              className="text-[13.5px] text-white/65 mb-6 leading-relaxed line-clamp-3 font-[family-name:var(--font-brand-sans)]"
            >
              {video.description}
            </motion.p>
          )}

          {/* CTAs */}
          <motion.div variants={itemVariants} className={cn('flex items-center gap-3', !video.description && 'mt-2')}>
            <Link
              href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 pl-5 pr-6 py-3 text-[10.5px] font-semibold uppercase tracking-[0.22em] bg-white text-kawai-black active:bg-kawai-pearl transition-colors duration-200 font-[family-name:var(--font-brand-sans)]"
            >
              <Play className="h-3 w-3 fill-current" />
              Watch
            </Link>

            {video.isManual && video.ctaText && video.ctaUrl ? (
              <Link
                href={video.ctaUrl}
                target={video.ctaOpenInNewTab ? '_blank' : undefined}
                rel={video.ctaOpenInNewTab ? 'noopener noreferrer' : undefined}
                className="inline-flex items-center gap-2 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] border border-white/25 text-white/90 active:bg-white/[0.06] transition-all duration-200 font-[family-name:var(--font-brand-sans)]"
              >
                {video.ctaText}
                <ArrowRight className="h-3 w-3" />
              </Link>
            ) : !video.isManual && video.artistSlug ? (
              <Link
                href={`/artists/${video.artistSlug}`}
                className="inline-flex items-center gap-2 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] border border-white/25 text-white/90 active:bg-white/[0.06] transition-all duration-200 font-[family-name:var(--font-brand-sans)]"
              >
                Artist
                <ArrowRight className="h-3 w-3" />
              </Link>
            ) : null}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Mobile: Peek strip — horizontal thumbnails + drawer trigger
// ---------------------------------------------------------------------------

function MobilePeekStrip({
  videos,
  activeIdx,
  idxLabel,
  totalLabel,
  onSelect,
  onOpenSheet,
}: {
  videos: VideoItem[]
  activeIdx: number
  idxLabel: string
  totalLabel: string
  onSelect: (i: number) => void
  onOpenSheet: () => void
}) {
  const stripRef = useRef<HTMLDivElement>(null)

  // Center the active thumb when the index changes.
  // Scroll the strip horizontally only — scrollIntoView() would also scroll
  // every ancestor (including the page), yanking the viewport to this block on mount.
  useEffect(() => {
    const strip = stripRef.current
    if (!strip) return
    const activeEl = strip.querySelector<HTMLElement>(`[data-strip-idx="${activeIdx}"]`)
    if (!activeEl) return
    const stripRect = strip.getBoundingClientRect()
    const elRect = activeEl.getBoundingClientRect()
    const delta = elRect.left + elRect.width / 2 - (stripRect.left + stripRect.width / 2)
    strip.scrollBy({ left: delta, behavior: 'smooth' })
  }, [activeIdx])

  return (
    <div
      className="relative flex-shrink-0 pt-3 pb-4 mt-auto"
      style={{
        background: 'linear-gradient(180deg, #100C09 0%, #0A0807 100%)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Header row — tap to open sheet */}
      <button
        type="button"
        onClick={onOpenSheet}
        className="w-full flex items-center justify-between px-5 mb-3 group focus-visible:outline-none"
        aria-label="Open video library"
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="block w-1 h-1 rounded-full bg-kawai-red shrink-0" aria-hidden="true" />
          <p className="text-[9.5px] tracking-[0.32em] uppercase text-white font-semibold font-[family-name:var(--font-brand-sans)]">
            The Library
          </p>
          <span className="text-white/15 text-[9px] shrink-0">·</span>
          <span className="text-[10px] tabular-nums text-white/55 font-[family-name:var(--font-brand-sans)] shrink-0">
            <span className="text-white/85">{idxLabel}</span>
            <span className="mx-0.5 text-white/25">/</span>
            {totalLabel}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-white/55 group-active:text-white transition-colors">
          <span className="text-[9px] tracking-[0.2em] uppercase font-semibold font-[family-name:var(--font-brand-sans)]">
            Browse
          </span>
          <ChevronUp className="w-3.5 h-3.5" />
        </div>
      </button>

      {/* Horizontal thumb strip */}
      <div
        ref={stripRef}
        className="flex items-stretch gap-2.5 px-5 overflow-x-auto"
        style={{
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
          scrollSnapType: 'x proximity',
        }}
      >
        {videos.map((video, i) => {
          const isActive = i === activeIdx
          return (
            <button
              key={video.id}
              data-strip-idx={i}
              type="button"
              onClick={() => onSelect(i)}
              aria-current={isActive ? 'true' : undefined}
              className="relative shrink-0 rounded-[3px] overflow-hidden focus-visible:outline-none transition-all duration-200"
              style={{
                width: '108px',
                aspectRatio: '16 / 9',
                scrollSnapAlign: 'center',
              }}
            >
              <span className="sr-only">Play {video.title}</span>
              <Image
                src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                alt=""
                fill
                className={cn(
                  'object-cover transition-all duration-300',
                  isActive ? 'scale-105' : 'opacity-65',
                )}
                sizes="108px"
              />
              <div
                className={cn(
                  'absolute inset-0 transition-colors duration-200',
                  isActive ? 'bg-transparent' : 'bg-black/35',
                )}
              />
              <div
                className={cn(
                  'absolute inset-0 transition-all duration-200',
                  isActive
                    ? 'ring-1 ring-kawai-red shadow-[0_4px_18px_-2px_rgba(225,25,34,0.55)]'
                    : 'ring-1 ring-white/10',
                )}
                aria-hidden="true"
              />
              {isActive && (
                <div className="absolute bottom-1 right-1 flex items-center gap-1 pointer-events-none">
                  <span
                    className="block w-1 h-1 rounded-full bg-kawai-red"
                    style={{ animation: 'pulse-soft 2s ease-in-out infinite' }}
                  />
                  <span className="text-[7.5px] tracking-[0.18em] uppercase text-white font-semibold font-[family-name:var(--font-brand-sans)]">
                    Now
                  </span>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Mobile: Library bottom-sheet — search, filters, full list
// ---------------------------------------------------------------------------

function MobileLibrarySheet({
  isOpen,
  onClose,
  activeIdx,
  searchQuery,
  setSearchQuery,
  filterMode,
  setFilterMode,
  hasArtists,
  hasFeatured,
  filteredVideos,
  resolvedVideos,
  total,
  onSelect,
}: {
  isOpen: boolean
  onClose: () => void
  activeIdx: number
  searchQuery: string
  setSearchQuery: (s: string) => void
  filterMode: FilterMode
  setFilterMode: (m: FilterMode) => void
  hasArtists: boolean
  hasFeatured: boolean
  filteredVideos: VideoItem[]
  resolvedVideos: VideoItem[]
  total: number
  onSelect: (i: number) => void
}) {
  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'tween', duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120 || info.velocity.y > 500) onClose()
            }}
            className="absolute bottom-0 left-0 right-0 flex flex-col"
            style={{
              maxHeight: '88svh',
              background: 'linear-gradient(180deg, #14110E 0%, #0A0807 100%)',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 -20px 60px rgba(0,0,0,0.7)',
              borderTopLeftRadius: 14,
              borderTopRightRadius: 14,
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Video library"
          >
            {/* Grabber */}
            <div className="flex-shrink-0 flex justify-center pt-2.5 pb-1.5">
              <span className="block w-10 h-1 rounded-full bg-white/15" aria-hidden="true" />
            </div>

            {/* Header */}
            <div
              className="flex-shrink-0 flex items-center justify-between px-5 pt-2.5 pb-3"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="block w-1 h-1 rounded-full bg-kawai-red shrink-0" aria-hidden="true" />
                <p className="text-[11px] tracking-[0.32em] uppercase text-white font-semibold font-[family-name:var(--font-brand-sans)]">
                  The Library
                </p>
                <span className="text-white/20 text-[10px] shrink-0">·</span>
                <span className="text-[11px] tabular-nums text-white/45 font-[family-name:var(--font-brand-sans)] shrink-0">
                  {total}
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close library"
                className="w-9 h-9 -mr-1.5 flex items-center justify-center rounded-full text-white/70 active:text-white active:bg-white/[0.08] transition-colors focus-visible:outline-none"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filter + Search */}
            <div
              className="flex-shrink-0 px-5 pt-3 pb-3"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
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
                          'px-3 py-1.5 text-[10px] tracking-[0.18em] uppercase font-semibold transition-all duration-200 font-[family-name:var(--font-brand-sans)] rounded-sm',
                          active ? 'bg-white text-kawai-black' : 'text-white/55 active:bg-white/[0.05]',
                        )}
                      >
                        {label}
                      </button>
                    )
                  })}
                </div>
              )}
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none"
                  fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  aria-label="Search title or artist"
                  placeholder="Search title or artist…"
                  className="w-full bg-white/[0.06] border border-white/[0.08] text-white placeholder-white/35 text-[13px] pl-10 pr-9 py-2.5 rounded focus:outline-none focus:border-kawai-red/60 focus:bg-white/[0.10] transition-all font-[family-name:var(--font-brand-sans)]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 active:text-white focus-visible:outline-none"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* List */}
            <div
              className="flex-1 overflow-y-auto px-3 py-2.5 flex flex-col gap-1 min-h-0"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {filteredVideos.length === 0 ? (
                <div className="py-14 text-center">
                  <p className="text-[12px] text-white/40 font-[family-name:var(--font-brand-sans)] mb-2">
                    No matches
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('')
                      setFilterMode('all')
                    }}
                    className="text-[10px] tracking-[0.15em] uppercase text-kawai-red font-semibold font-[family-name:var(--font-brand-sans)] focus-visible:outline-none"
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
                      isActive={globalIdx === activeIdx}
                      onClick={() => {
                        onSelect(globalIdx)
                        onClose()
                      }}
                    />
                  )
                })
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
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
  subheading: _subheading,
  resolvedVideos,
}: ArtistI2LRendererProps) {
  const [idx, setIdx] = useState(0)
  const [hasNavigated, setHasNavigated] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterMode, setFilterMode] = useState<FilterMode>('all')
  const [sheetOpen, setSheetOpen] = useState(false)

  const total = resolvedVideos.length
  const safeIdx = Math.min(idx, total - 1)
  const current = resolvedVideos[safeIdx]

  const goTo = useCallback((next: number) => {
    setIdx(next)
    setHasNavigated(true)
  }, [])

  const prev = useCallback(() => {
    goTo((safeIdx - 1 + total) % total)
  }, [goTo, safeIdx, total])

  const next = useCallback(() => {
    goTo((safeIdx + 1) % total)
  }, [goTo, safeIdx, total])

  // Keyboard nav (desktop)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        prev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        next()
      }
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
  const resolvedSectionLabel = sectionLabel ?? 'Instrumental To Life'

  return (
    <section
      className="relative w-full overflow-hidden bg-kawai-black isolate"
      aria-label={resolvedSectionLabel}
    >
      {/* Keyframes shared across desktop + mobile */}
      <style>{`
        @keyframes pulse-soft {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.7; }
          100% { transform: scale(1.7); opacity: 0; }
        }
      `}</style>

      {/* ====================================================================
          DESKTOP layout (md+) — unchanged cinematic overlay model
          ==================================================================== */}
      <div
        className="hidden md:block relative"
        style={{ height: 'clamp(640px, 82vh, 980px)' }}
      >
        {/* Background video — single iframe, swapped via key. No fade. */}
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

        {/* Bottom-left radial scrim */}
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

        {/* Top scrim */}
        <div
          className="absolute inset-x-0 top-0 h-32 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 100%)' }}
          aria-hidden="true"
        />

        {/* Film grain */}
        <div
          className="absolute inset-0 z-10 opacity-[0.025] mix-blend-overlay pointer-events-none"
          style={{ backgroundImage: GRAIN_SVG }}
          aria-hidden="true"
        />

        {/* Corner accents */}
        <CornerAccent className="top-0 left-0" />
        <CornerAccent className="bottom-0 right-0 rotate-180" />

        {/* Glass sidebar */}
        {showSidebar && (
          <aside
            className="absolute top-0 right-0 bottom-0 z-30 flex flex-col w-[300px] xl:w-[340px]"
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

              {/* Filter pills */}
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
                  aria-label="Search title or artist"
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
                    onClick={() => {
                      setSearchQuery('')
                      setFilterMode('all')
                    }}
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
                      onClick={() => goTo(globalIdx)}
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

        {/* Bottom content panel */}
        <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
          <div
            className="px-8 md:px-12 pb-10 md:pb-14 pointer-events-auto"
            style={{ paddingRight: showSidebar ? 'calc(300px + 3rem)' : undefined }}
          >
            <div className="flex items-center gap-3 mb-5">
              <span className="block w-8 h-[2px] bg-kawai-red" aria-hidden="true" />
              <p
                className="text-[11px] tracking-[0.32em] uppercase text-white font-semibold font-[family-name:var(--font-brand-sans)]"
                style={{ textShadow: '0 1px 12px rgba(0,0,0,0.85)' }}
              >
                {resolvedSectionLabel}
              </p>
            </div>

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

            <div className="max-w-2xl">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={`content-${safeIdx}`}
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
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

                  {current.description && (
                    <motion.p
                      variants={itemVariants}
                      className="text-[15px] text-white/80 mb-7 max-w-xl leading-relaxed font-[family-name:var(--font-brand-sans)]"
                      style={{ textShadow: '0 1px 10px rgba(0,0,0,0.85)' }}
                    >
                      {current.description}
                    </motion.p>
                  )}

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
      </div>

      {/* ====================================================================
          MOBILE layout (<md) — flex column: player → content → peek strip
          ==================================================================== */}
      <div
        className="md:hidden relative flex flex-col"
        style={{ minHeight: '100svh' }}
      >
        <MobilePlayer
          video={current}
          idxLabel={idxLabel}
          totalLabel={totalLabel}
          sectionLabel={resolvedSectionLabel}
          showSwipeHint={showSidebar && !hasNavigated}
          onPrev={prev}
          onNext={next}
        />
        <MobileContent video={current} />
        {showSidebar && (
          <MobilePeekStrip
            videos={resolvedVideos}
            activeIdx={safeIdx}
            idxLabel={idxLabel}
            totalLabel={totalLabel}
            onSelect={goTo}
            onOpenSheet={() => setSheetOpen(true)}
          />
        )}
      </div>

      {/* Mobile library bottom-sheet (portal-like overlay, mobile-only) */}
      {showSidebar && (
        <MobileLibrarySheet
          isOpen={sheetOpen}
          onClose={() => setSheetOpen(false)}
          activeIdx={safeIdx}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterMode={filterMode}
          setFilterMode={setFilterMode}
          hasArtists={hasArtists}
          hasFeatured={hasFeatured}
          filteredVideos={filteredVideos}
          resolvedVideos={resolvedVideos}
          total={total}
          onSelect={goTo}
        />
      )}
    </section>
  )
}
