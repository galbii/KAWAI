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
 *   change, which re-plays the staggered CSS entrance animation.
 * • Card transition: 1.3 s ease-out — deliberately unhurried and weighty.
 * • Content entrance: blur → clear + drift up, staggered per element.
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

// Content panel position classes.
// Default is center-left — vertically centred on the left half of the card.
const POS: Record<string, string> = {
  'center-left':   'top-1/2 -translate-y-1/2 left-8 md:left-20 max-w-lg',
  'center-right':  'top-1/2 -translate-y-1/2 right-8 md:right-20 max-w-lg',
  'bottom-left':   'bottom-16 left-8 md:left-20 max-w-lg',
  'bottom-right':  'bottom-16 right-8 md:right-20 max-w-lg',
  'bottom-center': 'bottom-16 left-1/2 -translate-x-1/2 max-w-2xl text-center',
}

// ─── Easing shared across card transition + animations ────────────────────────
// A smooth, unhurried deceleration — deliberate and refined.
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

// ─── Export wrapper ───────────────────────────────────────────────────────────

export function ProductFeatureSlidesRenderer(props: ProductFeatureSlidesBlock) {
  // Filter out any null/undefined items and slides without a title
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
  // Apply per-slide defaults for all optional fields
  const safeFeatures = features!.slice(0, n).map(f => ({
    contentPosition: 'center-left' as const,
    overlayOpacity:  40,
    mediaType:       'image' as const,
    ...f,
  } satisfies FeatureSlide))
  const isDark       = theme !== 'light'

  const containerRef        = useRef<HTMLDivElement>(null)
  const cardRefs            = useRef<(HTMLDivElement | null)[]>([])
  const activeRef           = useRef(0)
  const transitioning       = useRef(false)
  const touchStartY         = useRef(0)
  // Timestamp (ms) of when we last landed on the first or last card.
  // The user must wait 1 s at a boundary before their scroll escapes to the page.
  const arrivedAtBoundaryAt = useRef<number>(Date.now()) // card 0 is boundary on mount

  const [activeIndex, setActiveIndex] = useState(0)

  // goTo advances the deck; the transitioning lock prevents scroll-skipping.
  // 1350 ms matches the CSS card transition so the next gesture can't fire mid-slide.
  const goTo = useCallback((next: number) => {
    if (transitioning.current || next < 0 || next >= n) return
    transitioning.current = true
    activeRef.current     = next
    setActiveIndex(next)
    // Record arrival time whenever we land on a boundary card
    if (next === 0 || next === n - 1) {
      arrivedAtBoundaryAt.current = Date.now()
    }
    setTimeout(() => { transitioning.current = false }, 1350)
  }, [n])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    // True when the component's top edge has reached the fixed header's bottom.
    // Both lower bound (top ≥ 0) and upper bound (top ≤ headerBottom) are
    // required so we never capture scrolls when scrolled past the component.
    const isDockedAtHeader = () => {
      const header      = document.querySelector('header')
      const headerBottom = header ? header.getBoundingClientRect().bottom : 0
      const top          = el.getBoundingClientRect().top
      return top >= 0 && top <= headerBottom + 2
    }

    // True when the user is at a boundary card (first or last) and hasn't yet
    // waited the required 1 second — so the escape scroll should be blocked.
    const isBoundaryHeld = () =>
      (activeRef.current === 0 || activeRef.current === n - 1) &&
      Date.now() - arrivedAtBoundaryAt.current < 1000

    const onWheel = (e: WheelEvent) => {
      if (!isDockedAtHeader()) return

      if (transitioning.current) { e.preventDefault(); return }

      const escaping =
        (e.deltaY > 0 && activeRef.current === n - 1) ||
        (e.deltaY < 0 && activeRef.current === 0)

      if (e.deltaY > 0 && activeRef.current < n - 1) {
        // Advance to next card
        e.preventDefault()
        goTo(activeRef.current + 1)
      } else if (e.deltaY < 0 && activeRef.current > 0) {
        // Go back to previous card
        e.preventDefault()
        goTo(activeRef.current - 1)
      } else if (escaping && isBoundaryHeld()) {
        // At first/last card, trying to scroll away — hold for 1 s
        e.preventDefault()
      }
      // else: boundary hold expired → event propagates naturally to page scroll
    }

    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0]?.clientY ?? 0
    }

    const onTouchEnd = (e: TouchEvent) => {
      if (transitioning.current || !isDockedAtHeader()) return
      const dy = touchStartY.current - (e.changedTouches[0]?.clientY ?? 0)
      if      (dy >  50 && activeRef.current < n - 1) goTo(activeRef.current + 1)
      else if (dy < -50 && activeRef.current > 0)     goTo(activeRef.current - 1)
    }

    // ── Auto-snap (page scroll listener) ─────────────────────────────────────
    // When the component's top is within 50 px of the header's bottom edge
    // while the user is scrolling down, smoothly complete the alignment so the
    // component always docks cleanly rather than stopping mid-gap.
    let lastScrollY = window.scrollY
    let isSnapping  = false

    const onPageScroll = () => {
      const currentScrollY = window.scrollY
      const scrollingDown  = currentScrollY > lastScrollY
      lastScrollY = currentScrollY

      // Only snap when approaching from below; never interfere with upward scroll
      if (!scrollingDown || isSnapping) return

      const header       = document.querySelector('header')
      const headerBottom = header ? header.getBoundingClientRect().bottom : 0
      const containerTop = el.getBoundingClientRect().top
      const gap          = containerTop - headerBottom

      // Within 50 px below the docking point → snap to it
      if (gap > 0 && gap <= 50) {
        isSnapping = true
        window.scrollTo({ top: window.scrollY + gap, behavior: 'smooth' })
        // Release lock AND reset boundary timer once snap settles.
        // The 1-second boundary hold begins from when the component is docked,
        // not from when the user started scrolling toward it.
        setTimeout(() => {
          isSnapping = false
          arrivedAtBoundaryAt.current = Date.now()
        }, 600)
      }
    }

    el.addEventListener('wheel',      onWheel,      { passive: false })
    el.addEventListener('touchstart', onTouchStart, { passive: true  })
    el.addEventListener('touchend',   onTouchEnd,   { passive: true  })
    window.addEventListener('scroll', onPageScroll, { passive: true  })

    return () => {
      el.removeEventListener('wheel',      onWheel)
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchend',   onTouchEnd)
      window.removeEventListener('scroll', onPageScroll)
    }
  }, [n, goTo])

  const current      = safeFeatures[activeIndex]
  const pos          = current?.contentPosition ?? 'center-left'
  const posClass     = POS[pos] ?? POS['center-left']
  const isRight      = pos === 'center-right' || pos === 'bottom-right'
  const isCenter     = pos === 'bottom-center'
  const textColor    = isDark ? 'text-white'    : 'text-zinc-900'
  const mutedColor   = isDark ? 'text-white/60' : 'text-zinc-500'
  const counterMuted = isDark ? 'text-white/40' : 'text-zinc-400'

  return (
    <section className="w-full">

      {/* ── Optional section header — normal page flow, above the card area ── */}
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

      {/* ── Card stack ──────────────────────────────────────────────────────── */}
      <div
        ref={containerRef}
        className="relative overflow-hidden w-full"
        style={{ height: '100svh' }}
      >

        {/*
          Layer 1 — Card backgrounds.
          All N cards are in the DOM. Only their position changes: cards at or
          below activeIndex are translateY(0) (in place); those above are
          translateY(100%) (queued below the viewport).

          Transition: 1.3 s with a smooth deceleration — slow enough to feel
          deliberate, fast enough to never feel sluggish.
        */}
        {safeFeatures.map((feature, i) => (
          <div
            key={feature.id ?? i}
            ref={el => { cardRefs.current[i] = el }}
            className="absolute inset-0 will-change-transform"
            style={{
              zIndex:     i + 1,
              transform:  i <= activeIndex ? 'translateY(0%)' : 'translateY(100%)',
              transition: `transform 1.3s ${EASE}`,
            }}
          >
            <SlideMedia feature={feature} />

            {/* Gradient — soft vignette, stronger where text sits */}
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{
                background: [
                  // Bottom vignette for bottom-positioned content
                  `linear-gradient(to top, rgba(0,0,0,${Math.min(0.82, ((feature.overlayOpacity ?? 40) / 100) + 0.28)}) 0%, rgba(0,0,0,0.06) 55%, transparent 75%)`,
                  // Top vignette (subtle, for counter readability)
                  `linear-gradient(to bottom, rgba(0,0,0,0.14) 0%, transparent 18%)`,
                  // Side vignette — left or right based on content position
                  (pos === 'center-left' || pos === 'bottom-left')
                    ? `linear-gradient(to right, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.08) 50%, transparent 72%)`
                    : (pos === 'center-right' || pos === 'bottom-right')
                      ? `linear-gradient(to left, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.08) 50%, transparent 72%)`
                      : `linear-gradient(to top, rgba(0,0,0,0.20) 0%, transparent 40%)`,
                ].join(', '),
              }}
            />

            {/* Film grain */}
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none opacity-[0.04]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                backgroundSize: '180px',
              }}
            />
          </div>
        ))}

        {/*
          Layer 2 — Active card content.
          Keyed on activeIndex so React re-mounts it on every card change,
          which replays the CSS entrance animation from scratch.
          Each element drifts up and unblurs with a staggered delay,
          giving the impression the content materialises as the card settles.
        */}
        <div
          key={activeIndex}
          className={`absolute ${posClass} ${textColor}`}
          style={{ zIndex: n + 2 }}
        >
          {current?.tag && (
            <div
              className={`flex items-center gap-3 mb-5 ${isRight ? 'justify-end flex-row-reverse' : isCenter ? 'justify-center' : ''}`}
              style={{ animation: `kw-in 0.9s ${EASE} 0.35s both` }}
            >
              <span className="block w-7 h-px bg-[#e21d30] flex-shrink-0" />
              <span className="text-[9px] tracking-[0.38em] uppercase font-mono text-[#e21d30]">
                {current.tag}
              </span>
            </div>
          )}

          {current?.title && (
            <h3
              className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.07] font-bold mb-4"
              style={{
                textShadow: isDark ? '0 2px 28px rgba(0,0,0,0.5)' : 'none',
                animation: `kw-in 1.1s ${EASE} 0.5s both`,
              }}
            >
              {current.title}
            </h3>
          )}

          {current?.subtitle && (
            <p
              className={`text-base md:text-lg font-light tracking-wide mb-3 ${mutedColor}`}
              style={{ animation: `kw-in 1.1s ${EASE} 0.66s both` }}
            >
              {current.subtitle}
            </p>
          )}

          {current?.description && (
            <p
              className={`text-sm md:text-[15px] leading-relaxed max-w-sm ${mutedColor}`}
              style={{ animation: `kw-in 1.1s ${EASE} 0.8s both` }}
            >
              {current.description}
            </p>
          )}

          {current?.cta?.text && (
            <div style={{ animation: `kw-in 1s ${EASE} 0.96s both` }} className="mt-9">
              <Link
                href={current.cta.link ?? '#'}
                target={current.cta.openInNewTab ? '_blank' : '_self'}
                rel={current.cta.openInNewTab ? 'noopener noreferrer' : undefined}
                className={[
                  'group inline-flex items-center gap-4 px-7 py-3',
                  'border text-[9px] tracking-[0.36em] uppercase font-mono',
                  'transition-all duration-500',
                  isDark
                    ? 'border-white/30 text-white hover:bg-[#e21d30] hover:border-[#e21d30]'
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
                      backgroundColor: on ? '#e21d30' : isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.12)',
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
                      color:      on ? '#e21d30' : isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.3)',
                      fontWeight: on ? 500 : 400,
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
                    backgroundColor: on ? '#e21d30' : isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.12)',
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
            style={{ zIndex: n + 5, animation: 'kw-fade 1s ease 2s both' }}
          >
            <span className="text-[8px] tracking-[0.42em] uppercase font-mono">Scroll</span>
            <div className="w-px h-7 bg-current origin-top" style={{ animation: 'kw-pulse 2.4s ease-in-out infinite' }} />
          </div>
        )}
      </div>

      {/* ── Keyframe definitions ─────────────────────────────────────────────── */}
      <style>{`
        /* Content element entrance: drift up + unblur */
        @keyframes kw-in {
          from { opacity: 0; transform: translateY(22px); filter: blur(10px); }
          to   { opacity: 1; transform: translateY(0);    filter: blur(0); }
        }
        /* Scroll cue fade-in */
        @keyframes kw-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        /* Scroll cue pulse */
        @keyframes kw-pulse {
          0%, 100% { opacity: 0.25; transform: scaleY(1);   }
          50%       { opacity: 0.8;  transform: scaleY(1.7); }
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
