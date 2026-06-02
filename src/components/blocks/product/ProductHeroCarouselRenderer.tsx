'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import type { ProductHeroCarouselBlock, Media } from '@/payload-types'
import { cn } from '@/lib/utils'
import { getImagePropsWithFallback } from '@/lib/fallbacks/media'
import { getYouTubeEmbedUrl } from '@/lib/utils/youtube'

/**
 * Normalized slide shape consumed by the renderer.
 * Populated from either homepage news items (via server renderer) or
 * block-level slides — both map into this common structure.
 */
export interface ProductHeroSlideData {
  mediaType: 'image' | 'video' | 'youtube'
  image?: Media | string | null
  videoFile?: Media | string | null
  youtubeUrl?: string | null
  youtubeZoom?: number | null
  eyebrow?: string | null
  title?: string | null
  subtitle?: string | null
  ctaText?: string | null
  ctaLink?: string | null
  ctaOpenInNewTab?: boolean
  ctaStyle?: 'white' | 'red' | 'outline'
}

interface ProductHeroCarouselRendererProps {
  slides: ProductHeroSlideData[]
  settings?: ProductHeroCarouselBlock['settings']
  styling?: ProductHeroCarouselBlock['styling']
  headingLevel?: 'h1' | 'h2'
}

// ── SLIDE EASING ───────────────────────────────────────────────────────────
// Out-expo style curve — immediate response, smooth deceleration. The same
// family of curve used by Linear/Vercel for that "instant" feel.
const SLIDE_EASE = [0.32, 0.72, 0, 1] as const

// ── HEIGHT CLASSES ─────────────────────────────────────────────────────────
const heightClasses = {
  screen: 'h-screen min-h-[600px] max-h-[900px]',
  large: 'h-[900px] min-h-[600px]',
  medium: 'h-[700px] min-h-[500px]',
  small: 'h-[500px] min-h-[400px]',
} as const

// ── OVERLAY INTENSITY ──────────────────────────────────────────────────────
const overlayGradient = {
  none: '',
  subtle:
    'bg-gradient-to-t from-kawai-black/55 via-kawai-black/15 to-transparent',
  medium:
    'bg-gradient-to-t from-kawai-black/85 via-kawai-black/35 to-transparent',
  heavy:
    'bg-gradient-to-t from-kawai-black to-kawai-black/65 to-60% to-transparent',
} as const

// ── CONTENT POSITION ───────────────────────────────────────────────────────
const contentPositionClasses = {
  'bottom-left':
    'bottom-14 sm:bottom-16 lg:bottom-20 left-8 sm:left-12 lg:left-16 max-w-xl lg:max-w-2xl',
  'bottom-center':
    'bottom-14 sm:bottom-16 lg:bottom-20 left-1/2 -translate-x-1/2 text-center max-w-2xl lg:max-w-3xl px-6',
  center:
    'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center max-w-2xl lg:max-w-3xl px-6',
  'top-left':
    'top-20 sm:top-24 lg:top-28 left-8 sm:left-12 lg:left-16 max-w-xl lg:max-w-2xl',
} as const

// ── CTA STYLE CLASSES ──────────────────────────────────────────────────────
const ctaStyles = {
  white:
    'bg-white text-kawai-black hover:bg-kawai-pearl hover:shadow-[0_8px_28px_rgba(0,0,0,0.28)]',
  red: 'bg-kawai-red text-white hover:bg-kawai-red/90 hover:shadow-[0_8px_32px_rgba(225,25,34,0.45)]',
  outline:
    'border border-white/60 text-white hover:bg-white hover:text-kawai-black hover:border-transparent',
} as const

// ──────────────────────────────────────────────────────────────────────────────
// MAIN RENDERER
// ──────────────────────────────────────────────────────────────────────────────

export function ProductHeroCarouselRenderer({
  slides,
  settings,
  styling,
  headingLevel = 'h2',
}: ProductHeroCarouselRendererProps) {
  if (!slides || slides.length === 0) return null

  // ── Settings (with defaults) ─────────────────────────────────────────────
  const autoPlayDuration = settings?.autoPlayDuration ?? 7000
  const enableAutoPlay = settings?.enableAutoPlay ?? true
  const enableLoop = settings?.enableLoop ?? true
  const enableKeyboardNav = settings?.enableKeyboardNav ?? true
  const enableTouchSwipe = settings?.enableTouchSwipe ?? true
  const showNavigationDots = settings?.showNavigationDots ?? true
  // Arrows are always shown when there's more than one slide. The legacy
  // `showArrows` setting is intentionally ignored so older blocks where the
  // value was persisted as `false` (when the prior default was off) still
  // surface the arrows without requiring per-block re-saves.
  const showPlayPauseButton = settings?.showPlayPauseButton ?? true
  const enableKenBurnsEffect = settings?.enableKenBurnsEffect ?? true

  // ── Styling (with defaults) ───────────────────────────────────────────────
  const height = (styling?.height ?? 'screen') as keyof typeof heightClasses
  const contentPosition = (styling?.contentPosition ?? 'bottom-left') as keyof typeof contentPositionClasses
  const overlayIntensity = (styling?.overlayIntensity ?? 'medium') as keyof typeof overlayGradient

  // ── State ─────────────────────────────────────────────────────────────────
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [isPlaying, setIsPlaying] = useState(enableAutoPlay)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [progress, setProgress] = useState(0)

  const sectionRef = useRef<HTMLElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })

  const minSwipeDistance = 50

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // ── Navigation ────────────────────────────────────────────────────────────
  const goToPrevious = useCallback(() => {
    setDirection(-1)
    setProgress(0)
    setCurrentIndex((prev) =>
      enableLoop
        ? prev === 0
          ? slides.length - 1
          : prev - 1
        : Math.max(prev - 1, 0)
    )
  }, [slides.length, enableLoop])

  const goToNext = useCallback(() => {
    setDirection(1)
    setProgress(0)
    setCurrentIndex((prev) =>
      enableLoop
        ? (prev + 1) % slides.length
        : Math.min(prev + 1, slides.length - 1)
    )
  }, [slides.length, enableLoop])

  const goToIndex = useCallback(
    (target: number) => {
      setDirection(target > currentIndex ? 1 : -1)
      setProgress(0)
      setCurrentIndex(target)
    },
    [currentIndex]
  )

  const pauseAutoPlayBriefly = useCallback(() => {
    setIsPlaying(false)
    setTimeout(() => setIsPlaying(enableAutoPlay), 2000)
  }, [enableAutoPlay])

  // ── Auto-play + progress bar ───────────────────────────────────────────────
  useEffect(() => {
    if (!isPlaying || !isInView || slides.length <= 1 || !enableAutoPlay) {
      setProgress(0)
      return
    }

    setProgress(0)
    const tickMs = 50
    const steps = autoPlayDuration / tickMs

    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 100 / steps, 100))
    }, tickMs)

    const slideTimer = setTimeout(() => {
      goToNext()
    }, autoPlayDuration)

    return () => {
      clearInterval(progressInterval)
      clearTimeout(slideTimer)
    }
  }, [isPlaying, currentIndex, isInView, slides.length, autoPlayDuration, enableAutoPlay, goToNext])

  // ── Touch ─────────────────────────────────────────────────────────────────
  const onTouchStart = (e: React.TouchEvent) => {
    if (!enableTouchSwipe) return
    setTouchEnd(null)
    if (e.targetTouches[0]) setTouchStart(e.targetTouches[0].clientX)
    setIsPlaying(false)
  }
  const onTouchMove = (e: React.TouchEvent) => {
    if (!enableTouchSwipe || !e.targetTouches[0]) return
    setTouchEnd(e.targetTouches[0].clientX)
  }
  const onTouchEnd = () => {
    if (!enableTouchSwipe || !touchStart || !touchEnd) return
    const dist = touchStart - touchEnd
    if (dist > minSwipeDistance) goToNext()
    else if (dist < -minSwipeDistance) goToPrevious()
    setTimeout(() => setIsPlaying(enableAutoPlay), 2000)
  }

  // ── Keyboard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!enableKeyboardNav) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goToPrevious()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        goToNext()
      } else if (e.key === ' ') {
        e.preventDefault()
        setIsPlaying((p) => !p)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [enableKeyboardNav, goToPrevious, goToNext])

  // ── Reset on slide change ─────────────────────────────────────────────────
  useEffect(() => {
    setImageLoaded(false)
  }, [currentIndex])

  // ── Slide counter ─────────────────────────────────────────────────────────
  const slideLabel = String(currentIndex + 1).padStart(2, '0')
  const totalLabel = String(slides.length).padStart(2, '0')

  const currentSlide = slides[currentIndex]
  if (!currentSlide) return null

  // ── Determine whether the left-side side-gradient should apply ────────────
  const hasSideGradient =
    contentPosition === 'bottom-left' || contentPosition === 'top-left'

  return (
    <section
      ref={sectionRef}
      className={cn('relative w-full overflow-hidden', heightClasses[height])}
      aria-roledescription="carousel"
      aria-label="Product hero carousel"
    >
      {/* ── CAROUSEL CONTAINER ──────────────────────────────────────────── */}
      <div
        ref={carouselRef}
        className="relative w-full h-full"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={{
              enter: (dir: number) => ({
                x: prefersReducedMotion ? 0 : dir > 0 ? '100%' : '-100%',
                opacity: prefersReducedMotion ? 0 : 1,
              }),
              center: {
                x: 0,
                opacity: 1,
                transition: {
                  x: { duration: prefersReducedMotion ? 0 : 0.55, ease: SLIDE_EASE },
                  opacity: { duration: prefersReducedMotion ? 0.2 : 0.3 },
                },
              },
              exit: (dir: number) => ({
                x: prefersReducedMotion ? 0 : dir > 0 ? '-100%' : '100%',
                opacity: prefersReducedMotion ? 0 : 1,
                transition: {
                  x: { duration: prefersReducedMotion ? 0 : 0.55, ease: SLIDE_EASE },
                  opacity: { duration: prefersReducedMotion ? 0.2 : 0.3 },
                },
              }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 will-change-transform"
          >
            {/* ── MEDIA LAYER ─────────────────────────────────────────── */}
            {currentSlide.mediaType === 'youtube' && currentSlide.youtubeUrl ? (
              <YouTubeBackground
                url={currentSlide.youtubeUrl}
                zoom={currentSlide.youtubeZoom ?? 1.3}
              />
            ) : currentSlide.mediaType === 'video' && currentSlide.videoFile ? (
              <UploadedVideoBackground
                media={currentSlide.videoFile as Media | string}
              />
            ) : (
              <HeroImageBackground
                media={currentSlide.image as Media | string | null | undefined}
                alt={currentSlide.title ?? 'Hero slide'}
                priority={currentIndex === 0}
                enableKenBurns={enableKenBurnsEffect}
                imageLoaded={imageLoaded}
                setImageLoaded={setImageLoaded}
                autoPlayDuration={autoPlayDuration}
                prefersReducedMotion={prefersReducedMotion}
              />
            )}

            {/* ── OVERLAY GRADIENTS ───────────────────────────────────── */}
            {/* Bottom gradient for text legibility */}
            <div
              className={cn(
                'absolute inset-0 z-10',
                overlayGradient[overlayIntensity]
              )}
            />
            {/* Side gradient for left-aligned layouts */}
            {hasSideGradient && (
              <div className="absolute inset-0 z-10 bg-gradient-to-r from-kawai-black/45 via-kawai-black/10 to-transparent" />
            )}

            {/* ── TEXT CONTENT ────────────────────────────────────────── */}
            {(currentSlide.title ||
              currentSlide.subtitle ||
              currentSlide.eyebrow ||
              currentSlide.ctaText) && (
              <div
                className={cn(
                  'absolute z-20 px-4 sm:px-0',
                  contentPositionClasses[contentPosition]
                )}
              >
                <div className="space-y-5">
                  {/* Eyebrow */}
                  {currentSlide.eyebrow && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <span className="inline-flex items-center gap-2.5 text-xs font-semibold tracking-[0.28em] uppercase text-white/65 font-sans">
                        <span className="inline-block w-5 h-px bg-kawai-red flex-shrink-0" />
                        {currentSlide.eyebrow}
                      </span>
                    </motion.div>
                  )}

                  {/* Title */}
                  {currentSlide.title && (
                    (() => {
                      const TitleTag = headingLevel === 'h1' ? motion.h1 : motion.h2
                      return (
                        <TitleTag
                          initial={{ opacity: 0, y: 22 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.7, delay: 0.3 }}
                          className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-light font-[family-name:var(--font-brand-serif)] text-white leading-[1.04] tracking-tight"
                        >
                          {currentSlide.title}
                        </TitleTag>
                      )
                    })()
                  )}

                  {/* Subtitle */}
                  {currentSlide.subtitle && (
                    <motion.p
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.48 }}
                      className="text-base sm:text-lg text-white/78 leading-relaxed font-[family-name:var(--font-brand-sans)] max-w-md"
                    >
                      {currentSlide.subtitle}
                    </motion.p>
                  )}

                  {/* CTA */}
                  {currentSlide.ctaText && currentSlide.ctaLink && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.55, delay: 0.62 }}
                    >
                      <Link
                        href={currentSlide.ctaLink}
                        target={currentSlide.ctaOpenInNewTab ? '_blank' : undefined}
                        rel={currentSlide.ctaOpenInNewTab ? 'noopener noreferrer' : undefined}
                        className={cn(
                          'group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-7 py-3.5',
                          'text-sm font-semibold tracking-[0.12em] uppercase transition-all duration-300',
                          'font-[family-name:var(--font-brand-sans)]',
                          ctaStyles[(currentSlide.ctaStyle as keyof typeof ctaStyles) ?? 'white']
                        )}
                      >
                        <span className="relative z-10">{currentSlide.ctaText}</span>
                        <svg
                          className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                        {/* Shine sweep on hover */}
                        <span className="absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                      </Link>
                    </motion.div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* ── SLIDE COUNTER ──────────────────────────────────────────────── */}
        {slides.length > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="absolute top-8 right-8 sm:top-10 sm:right-10 z-30 flex items-center gap-1.5 select-none"
            aria-hidden="true"
          >
            <span className="text-lg font-light text-white leading-none">
              {slideLabel}
            </span>
            <span className="text-white/35 text-xs mt-0.5">/</span>
            <span className="text-sm font-light text-white/55 leading-none">
              {totalLabel}
            </span>
          </motion.div>
        )}

        {/* ── LEFT / RIGHT ARROWS ───────────────────────────────────────── */}
        {slides.length > 1 && (
          <>
            <ArrowButton
              dir="prev"
              onClick={() => {
                goToPrevious()
                pauseAutoPlayBriefly()
              }}
            />
            <ArrowButton
              dir="next"
              onClick={() => {
                goToNext()
                pauseAutoPlayBriefly()
              }}
            />
          </>
        )}

        {/* ── PROGRESS LINE INDICATORS ──────────────────────────────────── */}
        {showNavigationDots && slides.length > 1 && (
          <div className="absolute bottom-8 sm:bottom-10 left-8 sm:left-12 lg:left-16 z-30 flex items-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  goToIndex(index)
                  pauseAutoPlayBriefly()
                }}
                className={cn(
                  'relative h-[3px] rounded-full overflow-hidden transition-all duration-300',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60'
                )}
                style={{ width: index === currentIndex ? 44 : 22 }}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === currentIndex}
              >
                {/* Track */}
                <span className="absolute inset-0 bg-white/28 rounded-full" />
                {/* Active fill — animated progress */}
                {index === currentIndex && (
                  <motion.span
                    className="absolute inset-y-0 left-0 bg-white rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                )}
                {/* Past slides — fully filled */}
                {index < currentIndex && (
                  <span className="absolute inset-0 bg-white/65 rounded-full" />
                )}
              </button>
            ))}
          </div>
        )}

        {/* ── PLAY / PAUSE ──────────────────────────────────────────────── */}
        {showPlayPauseButton && enableAutoPlay && slides.length > 1 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            onClick={() => setIsPlaying((p) => !p)}
            className="absolute bottom-7 sm:bottom-9 right-8 sm:right-12 z-30 w-10 h-10 rounded-full border border-white/22 bg-kawai-black/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/15 transition-all duration-300"
            aria-label={isPlaying ? 'Pause slideshow' : 'Resume slideshow'}
          >
            {isPlaying ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </motion.button>
        )}
      </div>
    </section>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ──────────────────────────────────────────────────────────────────────────────

/**
 * ArrowButton — vertical-center navigation arrow.
 *
 * Editorial-luxury treatment: hairline glass disc with a thin chevron, a small
 * kawai-red accent thread that emerges on hover, and snappy spring feedback on
 * press. `y: '-50%'` keeps vertical centering inside Framer's transform stack so
 * it doesn't conflict with `whileHover` / `whileTap` scale.
 */
function ArrowButton({ dir, onClick }: { dir: 'prev' | 'next'; onClick: () => void }) {
  const isPrev = dir === 'prev'
  const path = isPrev ? 'M15 18l-6-6 6-6' : 'M9 6l6 6-6 6'

  return (
    <motion.div
      initial={{ opacity: 0, x: isPrev ? -14 : 14, y: '-50%' }}
      animate={{ opacity: 1, x: 0, y: '-50%' }}
      transition={{ duration: 0.5, delay: 0.55, ease: 'easeOut' }}
      className={cn(
        'group absolute top-1/2 z-30',
        isPrev ? 'left-3 sm:left-6 lg:left-8' : 'right-3 sm:right-6 lg:right-8'
      )}
    >
      <motion.button
        type="button"
        onClick={onClick}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 420, damping: 26 }}
        className={cn(
          'relative flex items-center justify-center',
          'h-11 w-11 sm:h-12 sm:w-12 lg:h-14 lg:w-14',
          'rounded-full',
          'bg-kawai-black/25 backdrop-blur-md',
          'border border-white/15',
          'shadow-[0_10px_30px_-12px_rgba(0,0,0,0.55)]',
          'text-white',
          'transition-[background-color,border-color] duration-300',
          'hover:bg-white/12 hover:border-white/45',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent'
        )}
        aria-label={isPrev ? 'Previous slide' : 'Next slide'}
      >
        {/* Expanding ring on hover — adds depth without saturating */}
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-0 rounded-full',
            'border border-white/0',
            'transition-[border-color,transform] duration-500 ease-out',
            'group-hover:border-white/30 group-hover:scale-[1.18]'
          )}
        />
        {/* Kawai-red accent thread on the inner edge */}
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute top-1/2 -translate-y-1/2 h-px w-3',
            'bg-kawai-red origin-center',
            'transition-[transform,opacity] duration-400 ease-out',
            'opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100',
            isPrev ? 'right-0 translate-x-full origin-left' : 'left-0 -translate-x-full origin-right'
          )}
        />
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={cn(
            'relative h-[18px] w-[18px] sm:h-5 sm:w-5',
            'transition-transform duration-300 ease-out',
            isPrev ? 'group-hover:-translate-x-0.5' : 'group-hover:translate-x-0.5'
          )}
        >
          <path d={path} />
        </svg>
      </motion.button>
    </motion.div>
  )
}

/**
 * YouTubeBackground
 *
 * Renders a full-bleed YouTube video as the slide background.
 * The `zoom` parameter scales the iframe — values above 1 crop the video inward,
 * which eliminates YouTube UI elements that appear at the edges of the frame.
 *
 * The translate(-50%, -50%) is baked into the inline style because Tailwind's
 * utility transforms and the scale transform must be combined in a single CSS
 * `transform` declaration to avoid overriding one another.
 */
function YouTubeBackground({ url, zoom }: { url: string; zoom: number }) {
  const [ready, setReady] = useState(false)
  const embedUrl = getYouTubeEmbedUrl(url)

  useEffect(() => {
    // Reveal only once the player is actually playing (playerState === 1).
    // YouTube's iframe API sends postMessage events when enablejsapi=1 is set.
    // Falling back to 4 s covers browsers/networks where the message never fires.
    const fallback = setTimeout(() => setReady(true), 4000)

    const handleMessage = (event: MessageEvent) => {
      try {
        const data =
          typeof event.data === 'string' ? JSON.parse(event.data) : event.data
        if (data?.event === 'infoDelivery' && data?.info?.playerState === 1) {
          setReady(true)
          clearTimeout(fallback)
        }
      } catch {
        // ignore non-JSON messages from other origins
      }
    }

    window.addEventListener('message', handleMessage)
    return () => {
      clearTimeout(fallback)
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  if (!embedUrl) return null

  return (
    <div className="absolute inset-0 overflow-hidden bg-kawai-black">
      <iframe
        src={embedUrl}
        className={cn(
          'absolute left-1/2 top-1/2',
          // Oversized so the background is fully covered regardless of viewport ratio
          'h-[56.25vw] min-h-full w-[177.77vh] min-w-full',
          'transition-opacity duration-1000',
          ready ? 'opacity-100' : 'opacity-0'
        )}
        // pointerEvents: none → YouTube's document never receives mouse events, so
        // its hover-triggered transport controls (center pause, skip buttons) never appear.
        // translate + scale combined in one declaration to prevent Tailwind transform conflict.
        style={{ transform: `translate(-50%, -50%) scale(${zoom})`, pointerEvents: 'none' }}
        allow="autoplay; encrypted-media"
        frameBorder="0"
        title="Slide background video"
      />
    </div>
  )
}

/**
 * UploadedVideoBackground
 * Renders an uploaded MP4/WebM video as the full-bleed slide background.
 */
function UploadedVideoBackground({ media }: { media: Media | string }) {
  const url =
    typeof media === 'string' ? media : (media as Media).url ?? ''
  const [ready, setReady] = useState(false)

  return (
    <div className="absolute inset-0 bg-kawai-black">
      <video
        autoPlay
        loop
        muted
        playsInline
        onLoadedData={() => setReady(true)}
        className={cn(
          'h-full w-full object-cover transition-opacity duration-1000',
          ready ? 'opacity-100' : 'opacity-0'
        )}
      >
        <source src={url} type="video/mp4" />
      </video>
    </div>
  )
}

/**
 * HeroImageBackground
 * Renders a full-bleed Next.js Image with optional Ken Burns zoom animation.
 */
function HeroImageBackground({
  media,
  alt,
  priority,
  enableKenBurns,
  imageLoaded,
  setImageLoaded,
  autoPlayDuration,
  prefersReducedMotion,
}: {
  media: Media | string | null | undefined
  alt: string
  priority: boolean
  enableKenBurns: boolean
  imageLoaded: boolean
  setImageLoaded: (v: boolean) => void
  autoPlayDuration: number
  prefersReducedMotion: boolean
}) {
  const imageProps = getImagePropsWithFallback(
    media,
    '/images/defaults/hero-fallback.jpg',
    'hero',
    {
      fill: true,
      className: 'object-cover',
      sizes: '100vw',
      priority,
      context: { type: 'hero' },
    }
  )

  return (
    <motion.div
      className="absolute inset-0"
      initial={{ scale: 1 }}
      animate={{ scale: enableKenBurns && imageLoaded ? 1.05 : 1 }}
      transition={{
        duration: prefersReducedMotion ? 0 : autoPlayDuration / 1000,
        ease: 'linear',
      }}
    >
      <Image
        {...imageProps}
        alt={alt}
        onLoad={() => setImageLoaded(true)}
      />
    </motion.div>
  )
}
