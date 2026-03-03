'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { Artist, Media, Product } from '@/payload-types'

interface ArtistsHeroProps {
  artists: Artist[]
}

const AUTO_PLAY_DURATION = 6000

function getImageUrl(artist: Artist): string {
  if (artist.heroImageUrl) return artist.heroImageUrl
  if (artist.image && typeof artist.image === 'object') {
    return (artist.image as Media).url ?? artist.imageUrl ?? '/images/defaults/artist-placeholder.jpg'
  }
  return artist.imageUrl ?? '/images/defaults/artist-placeholder.jpg'
}

export default function ArtistsHero({ artists }: ArtistsHeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [progress, setProgress] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 })

  const totalSlides = artists.length
  const minSwipeDistance = 50

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const goToPrevious = useCallback(() => {
    setProgress(0)
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1))
  }, [totalSlides])

  const goToNext = useCallback(() => {
    setProgress(0)
    setCurrentIndex((prev) => (prev + 1) % totalSlides)
  }, [totalSlides])

  // Auto-play + progress
  useEffect(() => {
    if (!isPlaying || !isInView || totalSlides <= 1) {
      setProgress(0)
      return
    }
    setProgress(0)
    const tickMs = 50
    const steps = AUTO_PLAY_DURATION / tickMs
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 100 / steps, 100))
    }, tickMs)
    const slideTimer = setTimeout(goToNext, AUTO_PLAY_DURATION)
    return () => {
      clearInterval(progressInterval)
      clearTimeout(slideTimer)
    }
  }, [isPlaying, currentIndex, isInView, totalSlides, goToNext])

  // Keyboard
  useEffect(() => {
    if (totalSlides === 0) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); goToPrevious() }
      else if (e.key === 'ArrowRight') { e.preventDefault(); goToNext() }
      else if (e.key === ' ') { e.preventDefault(); setIsPlaying((p) => !p) }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [goToPrevious, goToNext, totalSlides])

  // Touch
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    if (e.targetTouches[0]) setTouchStart(e.targetTouches[0].clientX)
    setIsPlaying(false)
  }
  const onTouchMove = (e: React.TouchEvent) => {
    if (e.targetTouches[0]) setTouchEnd(e.targetTouches[0].clientX)
  }
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const dist = touchStart - touchEnd
    if (dist > minSwipeDistance) goToNext()
    else if (dist < -minSwipeDistance) goToPrevious()
    setTimeout(() => setIsPlaying(true), 2000)
  }

  if (totalSlides === 0) return null

  const slideLabel = String(currentIndex + 1).padStart(2, '0')
  const totalLabel = String(totalSlides).padStart(2, '0')
  const currentArtist = artists[currentIndex]
  if (!currentArtist) return null

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-kawai-black"
      style={{ height: 'clamp(420px, 60vh, 640px)' }}
      aria-roledescription="carousel"
      aria-label="Featured KAWAI Artists"
    >
      <div
        className="relative w-full h-full"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* ── BACKGROUND IMAGES ─────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.8, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            {/*
              Next.js Image with fill requires its immediate parent to have
              position: relative with explicit width/height — we set both via
              w-full h-full here so the fill image covers the full section.
            */}
            <div className="relative w-full h-full overflow-hidden">
              <Image
                src={getImageUrl(currentArtist)}
                alt={currentArtist.name}
                fill
                priority={currentIndex === 0}
                className="object-cover object-center"
                sizes="100vw"
              />
            </div>

            {/* Bottom gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-kawai-black/90 via-kawai-black/30 to-transparent pointer-events-none" />
            {/* Left gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-kawai-black/50 via-kawai-black/10 to-transparent pointer-events-none" />
          </motion.div>
        </AnimatePresence>

        {/* ── OUR ARTISTS LABEL — top left ──────────────────────────────── */}
        <div className="absolute top-8 left-8 sm:left-12 lg:left-16 z-30">
          <span className="inline-flex items-center gap-2.5 text-[10px] font-semibold tracking-[0.3em] uppercase text-white/50">
            <span className="inline-block w-4 h-px bg-kawai-red flex-shrink-0" />
            Our Artists
          </span>
        </div>

        {/* ── SLIDE COUNTER — top right ─────────────────────────────────── */}
        {totalSlides > 1 && (
          <div className="absolute top-8 right-8 sm:right-10 z-30 flex items-center gap-1.5 select-none" aria-hidden="true">
            <span className="text-base font-light text-white leading-none">{slideLabel}</span>
            <span className="text-white/30 text-xs">/</span>
            <span className="text-sm font-light text-white/45 leading-none">{totalLabel}</span>
          </div>
        )}

        {/* ── CONTENT — bottom left ─────────────────────────────────────── */}
        <div className="absolute z-20 bottom-10 sm:bottom-12 left-8 sm:left-12 lg:left-16">
          <div className="space-y-4">
            <motion.h2
              key={`name-${currentIndex}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-4xl sm:text-5xl lg:text-6xl font-light font-[family-name:var(--font-brand-serif)] text-white leading-[1.05] tracking-tight"
            >
              {currentArtist.name}
            </motion.h2>

            {/* KAWAI Model */}
            {currentArtist.kawaiModel && typeof currentArtist.kawaiModel !== 'string' && (
              <motion.p
                key={`model-${currentIndex}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.32, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="text-xs font-semibold tracking-[0.22em] uppercase text-white/50 font-[family-name:var(--font-brand-sans)]"
              >
                <span className="text-kawai-red">KAWAI</span>{' '}
                {(currentArtist.kawaiModel as Product).name ?? (currentArtist.kawaiModel as Product).model}
              </motion.p>
            )}

            <motion.div
              key={`cta-${currentIndex}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <Link
                href={`/artists/${currentArtist.slug}`}
                className={cn(
                  'group relative inline-flex items-center gap-2.5 overflow-hidden',
                  'rounded-full px-6 py-3',
                  'text-xs font-semibold tracking-[0.14em] uppercase',
                  'font-[family-name:var(--font-brand-sans)]',
                  'bg-white text-kawai-black',
                  'transition-all duration-300',
                  'hover:bg-kawai-pearl hover:shadow-[0_6px_24px_rgba(0,0,0,0.25)]',
                )}
              >
                <span className="relative z-10">View Profile</span>
                <svg
                  className="relative z-10 w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                <span className="absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* ── PROGRESS LINES — bottom left, below content ───────────────── */}
        {totalSlides > 1 && (
          <div className="absolute bottom-4 left-8 sm:left-12 lg:left-16 z-30 flex items-center gap-1.5">
            {artists.map((artist, index) => (
              <button
                key={artist.id}
                onClick={() => {
                  setCurrentIndex(index)
                  setProgress(0)
                  setIsPlaying(false)
                  setTimeout(() => setIsPlaying(true), 2000)
                }}
                className="relative h-[2px] rounded-full overflow-hidden transition-all duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-white/60"
                style={{ width: index === currentIndex ? 40 : 18 }}
                aria-label={`Go to ${artist.name}`}
                aria-current={index === currentIndex}
              >
                <span className="absolute inset-0 bg-white/25 rounded-full" />
                {index === currentIndex && (
                  <motion.span
                    className="absolute inset-y-0 left-0 bg-white rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                )}
                {index < currentIndex && (
                  <span className="absolute inset-0 bg-white/60 rounded-full" />
                )}
              </button>
            ))}
          </div>
        )}

        {/* ── PLAY / PAUSE — bottom right ───────────────────────────────── */}
        {totalSlides > 1 && (
          <button
            onClick={() => setIsPlaying((p) => !p)}
            className="absolute bottom-3 right-8 sm:right-10 z-30 w-9 h-9 rounded-full border border-white/20 bg-kawai-black/25 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/10 transition-all duration-300"
            aria-label={isPlaying ? 'Pause slideshow' : 'Resume slideshow'}
          >
            {isPlaying ? (
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        )}
      </div>
    </section>
  )
}
