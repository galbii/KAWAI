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
  contentPosition?: 'bottom-left' | 'bottom-right' | 'bottom-center' | 'center-left' | 'center-right' | null
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
  'center-left':   'top-1/2 -translate-y-1/2 left-8 md:left-20 max-w-lg',
  'center-right':  'top-1/2 -translate-y-1/2 right-8 md:right-20 max-w-lg',
  'bottom-left':   'bottom-16 left-8 md:left-20 max-w-lg',
  'bottom-right':  'bottom-16 right-8 md:right-20 max-w-lg',
  'bottom-center': 'bottom-16 left-1/2 -translate-x-1/2 max-w-2xl text-center',
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
    contentPosition: 'center-left' as const,
    overlayOpacity:  40,
    mediaType:       'image' as const,
    ...f,
  } satisfies FeatureSlide))
  const isDark = theme !== 'light'

  const containerRef        = useRef<HTMLDivElement>(null)
  const cardRefs            = useRef<(HTMLDivElement | null)[]>([])
  const activeRef           = useRef(0)
  const transitioning       = useRef(false)
  const touchStartY         = useRef(0)
  // Timestamp of when we last landed on the first or last card.
  // User must wait 500 ms at a boundary before their scroll escapes.
  const arrivedAtBoundaryAt = useRef<number>(Date.now())

  const [activeIndex, setActiveIndex] = useState(0)

  const goTo = useCallback((next: number) => {
    if (transitioning.current || next < 0 || next >= n) return
    transitioning.current = true
    activeRef.current     = next
    setActiveIndex(next)
    if (next === 0 || next === n - 1) {
      arrivedAtBoundaryAt.current = Date.now()
    }
    setTimeout(() => { transitioning.current = false }, 1350)
  }, [n])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    // Docked = component top is near the header's bottom edge.
    // 40 px tolerance handles mobile URL-bar shifts and minor scroll offsets.
    const isDockedAtHeader = () => {
      const header       = document.querySelector('header')
      const headerBottom = header ? header.getBoundingClientRect().bottom : 0
      const { top, bottom } = el.getBoundingClientRect()
      return (
        top >= headerBottom - 40 &&
        top <= headerBottom + 40 &&
        bottom > 0  // component still has viewport presence
      )
    }

    // At a boundary card and within the 500 ms pause window.
    const isBoundaryHeld = () =>
      (activeRef.current === 0 || activeRef.current === n - 1) &&
      Date.now() - arrivedAtBoundaryAt.current < 500

    // ── Wheel (desktop) ───────────────────────────────────────────────────────
    const onWheel = (e: WheelEvent) => {
      if (!isDockedAtHeader()) return
      if (transitioning.current) { e.preventDefault(); return }

      const escaping =
        (e.deltaY > 0 && activeRef.current === n - 1) ||
        (e.deltaY < 0 && activeRef.current === 0)

      if (e.deltaY > 0 && activeRef.current < n - 1) {
        e.preventDefault()
        goTo(activeRef.current + 1)
      } else if (e.deltaY < 0 && activeRef.current > 0) {
        e.preventDefault()
        goTo(activeRef.current - 1)
      } else if (escaping && isBoundaryHeld()) {
        // Hold at boundary — let the user feel the "lock" before escaping
        e.preventDefault()
      }
    }

    // ── Touch (mobile) ────────────────────────────────────────────────────────
    //
    // Both touchstart and touchmove are registered with { passive: false }.
    // This is the key fix for mobile: calling e.preventDefault() in a passive
    // listener is a no-op. By making them non-passive we can prevent the
    // browser from scrolling the page while the user is swiping through cards.
    //
    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0]?.clientY ?? 0
      // Lock page scroll for this gesture if we're in the docked position
      if (isDockedAtHeader()) {
        e.preventDefault()
      }
    }

    const onTouchMove = (e: TouchEvent) => {
      // Continue holding the lock for the full duration of the swipe
      if (isDockedAtHeader()) {
        e.preventDefault()
      }
    }

    const onTouchEnd = (e: TouchEvent) => {
      if (transitioning.current || !isDockedAtHeader()) return
      const dy = touchStartY.current - (e.changedTouches[0]?.clientY ?? 0)
      // 40 px threshold — responsive but not hair-trigger
      if      (dy >  40 && activeRef.current < n - 1) goTo(activeRef.current + 1)
      else if (dy < -40 && activeRef.current > 0)     goTo(activeRef.current - 1)
    }

    // ── Auto-snap (page scroll) ───────────────────────────────────────────────
    // When approaching the docked position while scrolling down, snap into
    // alignment cleanly. Zone widened to 80 px to catch mobile momentum scroll.
    let lastScrollY = window.scrollY
    let isSnapping  = false

    const onPageScroll = () => {
      const currentScrollY = window.scrollY
      const scrollingDown  = currentScrollY > lastScrollY
      lastScrollY = currentScrollY

      if (!scrollingDown || isSnapping) return

      const header       = document.querySelector('header')
      const headerBottom = header ? header.getBoundingClientRect().bottom : 0
      const containerTop = el.getBoundingClientRect().top
      const gap          = containerTop - headerBottom

      if (gap > 0 && gap <= 80) {
        isSnapping = true
        window.scrollTo({ top: window.scrollY + gap, behavior: 'smooth' })
        // 500 ms boundary hold begins once the snap settles
        setTimeout(() => {
          isSnapping = false
          arrivedAtBoundaryAt.current = Date.now()
        }, 600)
      }
    }

    el.addEventListener('wheel',      onWheel,      { passive: false })
    el.addEventListener('touchstart', onTouchStart, { passive: false }) // non-passive: key mobile fix
    el.addEventListener('touchmove',  onTouchMove,  { passive: false }) // non-passive: keeps lock active
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
  const pos          = current?.contentPosition ?? 'center-left'
  const posClass     = POS[pos] ?? (POS['center-left'] as string)
  const isRight      = pos === 'center-right' || pos === 'bottom-right'
  const isCenter     = pos === 'bottom-center'
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
        <div className="px-8 md:px-16 py-20 max-w-4xl">
          {sectionHeader.eyebrow && (
            <p className="text-[10px] tracking-[0.36em] uppercase font-mono text-[#e21d30] mb-4">
              {sectionHeader.eyebrow}
            </p>
          )}
          <h2 className="font-serif text-4xl md:text-5xl leading-tight text-zinc-900 mb-3">
            {sectionHeader.heading}
          </h2>
          {sectionHeader.subheading && (
            <p className="text-lg text-zinc-500 leading-relaxed max-w-2xl">
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
            <SlideMedia feature={feature} />

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
                  // Side vignette — pulls eye toward content panel
                  (pos === 'center-left' || pos === 'bottom-left')
                    ? `linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.12) 48%, transparent 70%)`
                    : (pos === 'center-right' || pos === 'bottom-right')
                      ? `linear-gradient(to left, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.12) 48%, transparent 70%)`
                      : `linear-gradient(to top, rgba(0,0,0,0.28) 0%, transparent 42%)`,
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
          className={`absolute ${posClass} ${textColor}`}
          style={{ zIndex: n + 2 }}
        >
          {current?.tag && (
            <div
              className={`flex items-center gap-3 mb-5 ${isRight ? 'justify-end flex-row-reverse' : isCenter ? 'justify-center' : ''}`}
              style={{ animation: `kw-in 0.65s ${EASE} 0.1s both` }}
            >
              <span className="block w-7 h-px bg-[#e21d30] flex-shrink-0" />
              <span
                className="text-[9px] tracking-[0.38em] uppercase font-mono text-[#e21d30]"
                style={{ textShadow: '0 1px 8px rgba(0,0,0,0.7)' }}
              >
                {current.tag}
              </span>
            </div>
          )}

          {current?.title && (
            <h3
              className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.07] font-black mb-4"
              style={{
                textShadow: TEXT_SHADOW,
                animation: `kw-in 0.85s ${EASE} 0.22s both`,
              }}
            >
              {current.title}
            </h3>
          )}

          {current?.subtitle && (
            <p
              className={`text-base md:text-lg font-semibold tracking-wide mb-3 ${mutedColor}`}
              style={{
                textShadow: TEXT_SHADOW,
                animation: `kw-in 0.8s ${EASE} 0.38s both`,
              }}
            >
              {current.subtitle}
            </p>
          )}

          {current?.description && (
            <p
              className={`text-sm md:text-[15px] leading-relaxed max-w-sm font-medium ${mutedColor}`}
              style={{
                textShadow: TEXT_SHADOW,
                animation: `kw-in 0.8s ${EASE} 0.5s both`,
              }}
            >
              {current.description}
            </p>
          )}

          {current?.cta?.text && (
            <div style={{ animation: `kw-in 0.7s ${EASE} 0.62s both` }} className="mt-9">
              <Link
                href={current.cta.link ?? '#'}
                target={current.cta.openInNewTab ? '_blank' : '_self'}
                rel={current.cta.openInNewTab ? 'noopener noreferrer' : undefined}
                className={[
                  'group inline-flex items-center gap-4 px-7 py-3',
                  'border text-[9px] tracking-[0.36em] uppercase font-mono font-semibold',
                  'transition-all duration-500',
                  isDark
                    ? 'border-white/40 text-white hover:bg-[#e21d30] hover:border-[#e21d30]'
                    : 'border-zinc-800/30 text-zinc-900 hover:bg-[#e21d30] hover:border-[#e21d30] hover:text-white',
                ].join(' ')}
              >
                {current.cta.text}
                <span className="transition-transform duration-500 group-hover:translate-x-1.5">→</span>
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

function SlideMedia({ feature }: { feature: FeatureSlide }) {
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
      priority: true,
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
