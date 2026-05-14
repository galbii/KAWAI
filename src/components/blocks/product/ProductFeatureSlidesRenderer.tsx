'use client'

/**
 * ProductFeatureSlidesRenderer
 *
 * One viewport height in the page flow. Internal wheel/touch scroll advances
 * cards; events are only captured when the component is docked at the header.
 *
 * Design principles:
 * • Card backgrounds (all N) are always in the DOM, stacked via z-index.
 *   The incoming card slides up; the outgoing one stays beneath it.
 * • Content (tag/title/subtitle/description/CTA) is rendered ONCE for the
 *   active card only, keyed on activeIndex. React re-mounts it on every card
 *   change, replaying the staggered CSS entrance animation.
 * • Card transition: 1.35 s ease-out — deliberately unhurried and weighty.
 * • Content entrance: opacity + subtle rise, staggered per element.
 *
 * Mobile: touchstart and touchmove are registered as non-passive so we can call
 * preventDefault() when the component is docked, preventing the browser from
 * scrolling the page during card navigation gestures.
 */

import React, { useRef, useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Media } from '@/payload-types'
import { getImagePropsWithFallback } from '@/lib/media/r2-utils'

// ─── Types ────────────────────────────────────────────────────────────────────

interface FeatureSlide {
  id?:              string | null
  tag?:             string | null
  title:            string
  subtitle?:        string | null
  description?:     string | null
  mediaType?:       'image' | 'youtube' | 'video' | null
  image?:           Media | string | null
  youtubeUrl?:      string | null
  video?:           Media | string | null
  overlayOpacity?:  number | null
  contentSide?:     'default' | 'left' | 'right' | null
  cta?: {
    text?:         string | null
    link?:         string | null
    openInNewTab?: boolean | null
  } | null
}

interface ProductFeatureSlidesBlock {
  id?:                string | null
  blockType:          'product-feature-slides'
  sectionHeader?: {
    eyebrow?:    string | null
    heading?:    string | null
    subheading?: string | null
  } | null
  features?:          FeatureSlide[] | null
  theme?:             'dark' | 'light' | null
  progressIndicator?: 'dots' | 'lines' | 'numbers' | 'none' | null
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isMediaObject(val: unknown): val is Media {
  return typeof val === 'object' && val !== null && 'url' in val
}

function parseYouTubeUrl(url: string): string {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
  )
  if (match?.[1]) {
    const id = match[1]
    return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&disablekb=1&playsinline=1&rel=0`
  }
  return url
}

const POS: Record<string, string> = {
  'center-left':  'top-1/2 -translate-y-1/2 left-16 md:left-24 lg:left-32 w-[min(82vw,920px)]',
  'center-right': 'top-1/2 -translate-y-1/2 right-16 md:right-24 lg:right-32 w-[min(82vw,920px)]',
}

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

// ─── Export wrapper ───────────────────────────────────────────────────────────

export function ProductFeatureSlidesRenderer(props: ProductFeatureSlidesBlock) {
  const validFeatures = (props.features ?? []).filter(
    (f): f is FeatureSlide => f != null && typeof f.title === 'string' && f.title.trim() !== ''
  )
  if (validFeatures.length === 0) return null
  try {
    return <Inner {...props} features={validFeatures} />
  } catch {
    if (process.env.NODE_ENV === 'development') {
      return (
        <div className="border-2 border-dashed border-red-400 bg-red-50 p-8 text-red-700 text-sm font-mono">
          [ProductFeatureSlides] Render error — check CMS block configuration.
        </div>
      )
    }
    return null
  }
}

// ─── Main component ───────────────────────────────────────────────────────────

function Inner(props: ProductFeatureSlidesBlock) {
  const { sectionHeader, features, theme = 'dark', progressIndicator = 'dots' } = props

  const n = Math.min(features!.length, 10)
  const safeFeatures = features!.slice(0, n).map(f => ({
    overlayOpacity: 40,
    mediaType:      'image' as const,
    ...f,
  } satisfies FeatureSlide))
  const isDark = theme !== 'light'

  const containerRef  = useRef<HTMLDivElement>(null)
  const cardRefs      = useRef<(HTMLDivElement | null)[]>([])
  const activeRef     = useRef(0)
  const transitioning = useRef(false)
  const touchStartY   = useRef(0)
  // null = undecided, true = slide-nav locked, false = page-scroll escape
  const touchLocked   = useRef<boolean | null>(null)

  const [activeIndex, setActiveIndex] = useState(0)

  const goTo = useCallback((next: number) => {
    if (transitioning.current || next < 0 || next >= n) return
    transitioning.current = true
    activeRef.current     = next
    setActiveIndex(next)
    setTimeout(() => { transitioning.current = false }, 1350)
  }, [n])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    // Docked = component top is aligned with the header's bottom edge.
    // 40 px tolerance handles mobile URL-bar shifts and minor scroll offsets.
    const isDockedAtHeader = () => {
      const header       = document.querySelector('header')
      const headerBottom = header ? header.getBoundingClientRect().bottom : 0
      const { top, bottom } = el.getBoundingClientRect()
      return (
        top >= headerBottom - 40 &&
        top <= headerBottom + 40 &&
        bottom > 0
      )
    }

    // ── Wheel (desktop / trackpad) ────────────────────────────────────────────
    // At a boundary in the escape direction, we simply don't preventDefault —
    // the browser's native scroll takes over immediately. No artificial hold.
    const onWheel = (e: WheelEvent) => {
      if (!isDockedAtHeader()) return
      if (transitioning.current) { e.preventDefault(); return }

      if (e.deltaY > 0 && activeRef.current < n - 1) {
        e.preventDefault()
        goTo(activeRef.current + 1)
      } else if (e.deltaY < 0 && activeRef.current > 0) {
        e.preventDefault()
        goTo(activeRef.current - 1)
      }
      // At boundary in escape direction → fall through without preventDefault
      // so the page scrolls naturally.
    }

    // ── Touch (mobile) ────────────────────────────────────────────────────────
    //
    // Direction-aware locking: we commit on the first significant movement
    // whether this gesture navigates slides (locked) or scrolls the page (free).
    //
    // At a boundary in the escape direction (last slide + swipe down, first
    // slide + swipe up) we stay free so the page scrolls naturally.
    //
    // touchstart and touchmove are non-passive so we CAN call preventDefault;
    // we only actually call it when we've decided to lock.
    //
    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0]?.clientY ?? 0
      touchLocked.current = null // reset decision for each new gesture
      // Don't preventDefault here — direction decides locking in onTouchMove
    }

    const onTouchMove = (e: TouchEvent) => {
      if (!isDockedAtHeader()) return

      // If the decision for this gesture is already made, act on it.
      if (touchLocked.current === true)  { e.preventDefault(); return }
      if (touchLocked.current === false) { return } // escape mode — let page scroll

      // Undecided — evaluate swipe direction on first significant movement.
      const currentY  = e.touches[0]?.clientY ?? touchStartY.current
      const dy        = touchStartY.current - currentY // positive = finger up = scroll down
      if (Math.abs(dy) < 6) return // too small — wait for clearer intent

      const swipingDown = dy > 0 // intent: advance / scroll page down
      const swipingUp   = dy < 0 // intent: go back / scroll page up

      // Escape: at boundary in the natural escape direction → stay free
      if (swipingDown && activeRef.current === n - 1) { touchLocked.current = false; return }
      if (swipingUp   && activeRef.current === 0)     { touchLocked.current = false; return }

      // Interior slide navigation → lock and prevent page scroll
      touchLocked.current = true
      e.preventDefault()
    }

    const onTouchEnd = (e: TouchEvent) => {
      // Only process if we were in locked (slide-nav) mode
      if (touchLocked.current !== true || transitioning.current || !isDockedAtHeader()) return
      const dy = touchStartY.current - (e.changedTouches[0]?.clientY ?? 0)
      // 40 px threshold — responsive but not hair-trigger
      if      (dy >  40 && activeRef.current < n - 1) goTo(activeRef.current + 1)
      else if (dy < -40 && activeRef.current > 0)     goTo(activeRef.current - 1)
    }

    // ── Auto-snap (page scroll) ───────────────────────────────────────────────
    // When the component top drifts within 80 px of the header — in either
    // direction — snap it flush so the viewport fits the component cleanly
    // and slide tracking begins immediately.
    let lastScrollY = window.scrollY
    let isSnapping  = false

    const snap = (gap: number) => {
      isSnapping = true
      window.scrollTo({ top: window.scrollY + gap, behavior: 'smooth' })
      setTimeout(() => { isSnapping = false }, 600)
    }

    const onPageScroll = () => {
      const currentScrollY = window.scrollY
      const scrollingDown  = currentScrollY > lastScrollY
      lastScrollY = currentScrollY

      // Yield to programmatic nav scroll — don't snap mid-navigation
      if ((window as any).__kawaiNavScrolling) return
      if (isSnapping) return

      const header       = document.querySelector('header')
      const headerBottom = header ? header.getBoundingClientRect().bottom : 0
      const containerTop = el.getBoundingClientRect().top
      // positive gap = component below header, negative = component above header
      const gap          = containerTop - headerBottom

      // Approaching from above (scrolling down into component)
      if (scrollingDown && gap > 0 && gap <= 80) { snap(gap); return }

      // Approaching from below (scrolling up back into component)
      if (!scrollingDown && gap < 0 && gap >= -80) { snap(gap) }
    }

    el.addEventListener('wheel',      onWheel,      { passive: false })
    el.addEventListener('touchstart', onTouchStart, { passive: false })
    el.addEventListener('touchmove',  onTouchMove,  { passive: false })
    el.addEventListener('touchend',   onTouchEnd,   { passive: true  })
    window.addEventListener('scroll', onPageScroll, { passive: true  })

    return () => {
      el.removeEventListener('wheel',      onWheel)
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove',  onTouchMove)
      el.removeEventListener('touchend',   onTouchEnd)
      window.removeEventListener('scroll', onPageScroll)
    }
  }, [n, goTo])

  const current      = safeFeatures[activeIndex]
  const pos          = (() => {
    const side = current?.contentSide
    if (side === 'left')  return 'center-left'
    if (side === 'right') return 'center-right'
    return activeIndex % 2 === 0 ? 'center-left' : 'center-right'
  })()
  const posClass     = POS[pos] as string
  const isRight      = pos === 'center-right'
  const textColor    = isDark ? 'text-white'    : 'text-zinc-900'
  const mutedColor   = isDark ? 'text-white/80' : 'text-zinc-600'
  const counterMuted = isDark ? 'text-white/45' : 'text-zinc-400'

  // Strong text shadow — media backgrounds demand real contrast
  const TEXT_SHADOW = isDark
    ? '0 2px 24px rgba(0,0,0,0.95), 0 1px 5px rgba(0,0,0,0.8)'
    : '0 1px 8px rgba(0,0,0,0.18)'

  return (
    <section className="w-full">

      {/* ── Optional section header — normal page flow, above the cards ── */}
      {sectionHeader?.heading && (
        <div className="px-8 md:px-20 py-20 max-w-3xl">
          {sectionHeader.eyebrow && (
            <p className="text-[8px] tracking-[0.55em] uppercase font-mono text-[#e21d30] mb-5">
              {sectionHeader.eyebrow}
            </p>
          )}
          <h2 className="font-serif text-4xl md:text-5xl leading-[1.08] font-light tracking-[0.01em] text-zinc-900 mb-5">
            {sectionHeader.heading}
          </h2>
          {sectionHeader.subheading && (
            <p className="text-[13px] text-zinc-500 leading-[1.85] tracking-[0.02em] font-light max-w-[44ch]">
              {sectionHeader.subheading}
            </p>
          )}
        </div>
      )}

      {/* ── Card stack — one viewport height, stays in normal page flow ── */}
      <div
        ref={containerRef}
        className="relative overflow-hidden w-full"
        style={{ height: '100svh' }}
      >

        {/*
          Layer 1 — Card backgrounds.
          All N cards in the DOM; cards at or below activeIndex are at
          translateY(0); those above are queued at translateY(100%).
        */}
        {safeFeatures.map((feature, i) => (
          <div
            key={feature.id ?? i}
            ref={el => { cardRefs.current[i] = el }}
            className="absolute inset-0 will-change-transform"
            style={{
              zIndex:     i + 1,
              transform:  i <= activeIndex ? 'translateY(0%)' : 'translateY(100%)',
              transition: `transform 1.35s ${EASE}`,
            }}
          >
            <SlideMedia feature={feature} priority={i === 0} />

            {/*
              Base overlay — always-on flat layer.
              Ensures text is legible even on bright/white media.
              Opacity is clamped at 55 % so media still reads as the hero visual.
            */}
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundColor: `rgba(0,0,0,${Math.min(0.55, (feature.overlayOpacity ?? 40) / 100)})`,
              }}
            />

            {/* Directional gradient — depth and vignette */}
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{
                background: [
                  // Bottom vignette — anchors text reading area
                  `linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.08) 52%, transparent 72%)`,
                  // Top edge — subtle, keeps counter readable
                  `linear-gradient(to bottom, rgba(0,0,0,0.22) 0%, transparent 16%)`,
                  // Side vignette — respects contentSide override, else alternates
                  (() => {
                    const side = safeFeatures[i]?.contentSide
                    const isSlideRight = side === 'right' || (!side || side === 'default') && i % 2 !== 0
                    return isSlideRight
                      ? `linear-gradient(to left,  rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.12) 48%, transparent 70%)`
                      : `linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.12) 48%, transparent 70%)`
                  })(),
                ].join(', '),
              }}
            />

            {/* Film grain — subtle texture */}
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none opacity-[0.035]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                backgroundSize: '180px',
              }}
            />
          </div>
        ))}

        {/*
          Layer 2 — Active card content.
          Keyed on activeIndex so React re-mounts on every card change,
          replaying the staggered entrance animations from scratch.
        */}
        <div
          key={activeIndex}
          className={`absolute ${posClass} ${textColor} ${isRight ? 'text-right' : ''}`}
          style={{ zIndex: n + 2 }}
        >

          {/* Tag — uppercase mono label + full-width editorial rule */}
          {current?.tag && (
            <div
              style={{ animation: `kw-in 0.65s ${EASE} 0.08s both` }}
              className="mb-5"
            >
              <span
                className="text-[8px] tracking-[0.55em] uppercase font-mono text-[#e21d30]"
                style={{ textShadow: '0 1px 8px rgba(0,0,0,0.6)' }}
              >
                {current.tag}
              </span>
              {/* Thin rule — editorial separator */}
              <div
                className="mt-2.5 h-px bg-current opacity-20"
                style={{ animation: `kw-in 0.5s ${EASE} 0.28s both` }}
              />
            </div>
          )}

          {/* Title — fluid viewport sizing keeps it to 1 line on most screens */}
          {current?.title && (
            <h3
              className="font-serif leading-[1.03] font-light tracking-[-0.01em] mb-8"
              style={{
                fontSize: 'clamp(2.25rem, 3.8vw, 5.25rem)',
                textShadow: TEXT_SHADOW,
                animation: `kw-in 0.9s ${EASE} 0.2s both`,
              }}
            >
              {current.title}
            </h3>
          )}

          {/* Subtitle — treated as a fine-print label, not body text */}
          {current?.subtitle && (
            <p
              className={`text-[10px] tracking-[0.3em] uppercase font-light mb-4 max-w-xs ${isRight ? 'ml-auto' : ''} ${mutedColor}`}
              style={{
                textShadow: TEXT_SHADOW,
                animation: `kw-in 0.75s ${EASE} 0.36s both`,
              }}
            >
              {current.subtitle}
            </p>
          )}

          {/* Description — anchored to the same side as the panel */}
          {current?.description && (
            <p
              className={`text-base md:text-lg leading-[1.8] tracking-[0.015em] font-light max-w-md ${isRight ? 'ml-auto' : ''} ${mutedColor}`}
              style={{
                textShadow: TEXT_SHADOW,
                animation: `kw-in 0.8s ${EASE} 0.48s both`,
              }}
            >
              {current.description}
            </p>
          )}

          {/* CTA */}
          {current?.cta?.text && (
            <div style={{ animation: `kw-in 0.7s ${EASE} 0.62s both` }} className="mt-10">
              <Link
                href={current.cta.link ?? '#'}
                target={current.cta.openInNewTab ? '_blank' : '_self'}
                rel={current.cta.openInNewTab ? 'noopener noreferrer' : undefined}
                className={[
                  'group inline-flex items-center gap-5 px-0 py-2',
                  'border-b text-[8px] tracking-[0.46em] uppercase font-mono',
                  'transition-all duration-500',
                  isDark
                    ? 'border-white/25 text-white/80 hover:text-white hover:border-white/60'
                    : 'border-zinc-800/25 text-zinc-700 hover:text-zinc-900 hover:border-zinc-800/60',
                ].join(' ')}
              >
                {current.cta.text}
                <span className="transition-transform duration-500 group-hover:translate-x-2 text-[#e21d30]">→</span>
              </Link>
            </div>
          )}
        </div>

        {/* ── Layer 3 — Progress indicator ── */}
        {progressIndicator !== 'none' && n > 1 && (
          <div
            className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3"
            style={{ zIndex: n + 5 }}
          >
            {safeFeatures.map((_, i) => {
              const on = i === activeIndex

              if (progressIndicator === 'lines') {
                return (
                  <div
                    key={i}
                    style={{
                      width: 1.5, borderRadius: 1,
                      backgroundColor: on ? '#e21d30' : isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.14)',
                      height:   on ? 44 : 14,
                      transition: `height 0.6s ${EASE}, background-color 0.4s ease`,
                    }}
                  />
                )
              }

              if (progressIndicator === 'numbers') {
                return (
                  <span
                    key={i}
                    className="font-mono text-[9px] tracking-widest select-none tabular-nums"
                    style={{
                      color:      on ? '#e21d30' : isDark ? 'rgba(255,255,255,0.38)' : 'rgba(0,0,0,0.28)',
                      fontWeight: on ? 600 : 400,
                      transition: 'color 0.4s ease',
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                )
              }

              // Default: dots
              return (
                <div
                  key={i}
                  style={{
                    borderRadius: '50%',
                    backgroundColor: on ? '#e21d30' : isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.14)',
                    width:  on ? 8 : 4,
                    height: on ? 8 : 4,
                    transition: `width 0.5s ${EASE}, height 0.5s ${EASE}, background-color 0.4s ease`,
                  }}
                />
              )
            })}
          </div>
        )}

        {/* ── Slide counter — top right ── */}
        {n > 1 && (
          <div
            className={`absolute top-7 right-6 md:right-10 flex items-baseline gap-1 ${counterMuted}`}
            style={{ zIndex: n + 5 }}
          >
            <span
              className="font-serif text-xl tabular-nums"
              style={{ color: '#e21d30', transition: 'opacity 0.4s ease' }}
            >
              {String(activeIndex + 1).padStart(2, '0')}
            </span>
            <span className="font-mono text-[10px] tracking-wider">
              / {String(n).padStart(2, '0')}
            </span>
          </div>
        )}

        {/* ── Scroll cue — first card only ── */}
        {activeIndex === 0 && n > 1 && (
          <div
            className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none ${counterMuted}`}
            style={{ zIndex: n + 5, animation: 'kw-fade 1s ease 2.5s both' }}
          >
            <span className="text-[8px] tracking-[0.42em] uppercase font-mono">Scroll</span>
            <div className="w-px h-7 bg-current origin-top" style={{ animation: 'kw-pulse 2.4s ease-in-out infinite' }} />
          </div>
        )}
      </div>

      {/* ── Keyframe definitions ─────────────────────────────────────────────── */}
      <style>{`
        /*
          Content entrance: pure opacity + subtle rise.
          No blur filter — cleaner and more refined than the previous version.
          Each element staggered by ~120 ms for an elegant sequential reveal.
        */
        @keyframes kw-in {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes kw-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes kw-pulse {
          0%, 100% { opacity: 0.25; transform: scaleY(1);   }
          50%       { opacity: 0.85; transform: scaleY(1.7); }
        }
      `}</style>
    </section>
  )
}

// ─── Slide media ──────────────────────────────────────────────────────────────

function SlideMedia({ feature, priority }: { feature: FeatureSlide; priority: boolean }) {
  const { mediaType, image, youtubeUrl, video } = feature

  if (mediaType === 'youtube' && youtubeUrl) {
    return (
      <iframe
        src={parseYouTubeUrl(youtubeUrl)}
        className="absolute inset-0 w-full h-full scale-110 pointer-events-none"
        allow="autoplay; muted; loop"
        style={{ border: 'none' }}
      />
    )
  }

  if (mediaType === 'video' && isMediaObject(video) && video.url) {
    return (
      <video
        src={video.url}
        autoPlay muted loop playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
    )
  }

  if (isMediaObject(image) && image.url) {
    const imgProps = getImagePropsWithFallback(image, '', 'hero', {
      fill: true,
      priority,
      sizes: '100vw',
    })
    return (
      <Image
        {...imgProps}
        alt={(image.alt as string | undefined) ?? feature.title ?? ''}
        className="object-cover"
      />
    )
  }

  return <div className="absolute inset-0 bg-zinc-950" />
}
