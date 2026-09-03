'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { RuledGround } from './RuledGround'

/**
 * Full-bleed background for the hero: the campaign clip behind everything, with
 * the scrims that make type on top of it legible, and a slow scale-off as the
 * hero leaves — the footage keeps moving while the poster copy scrolls away.
 *
 * Scrim opacity is not a taste call. Text has to clear 4.5:1 against the
 * *brightest* frame the video can show, not the average one — the footage is a
 * dark stage, but it has blown-out stage lights in it. The copy sits in the
 * bottom third and the lockup across the top, so those two bands are taken to
 * ~0.86–0.96 composited black (kawai-red-400 lands ≈6:1 there, kawai-pearl far
 * higher) while the middle of the frame, which carries no text, is left open at
 * 0.30 so the picture gets to breathe.
 */

const VIDEO_SRC =
  'https://pub-0cc9ed269d544fd29fe51221f6744a6b.r2.dev/media/Timeline%201.webm'

const POSTER_SRC = '/images/kawai-piano.jpeg'

/** The Back to School footage is a dark stage, so it takes a lift. */
const DEFAULT_FILTER = 'brightness(1.35) contrast(1.04) saturate(1.05)'

interface HeroVideoBackgroundProps {
  /** Override the campaign clip. Defaults to the Back to School footage. */
  src?: string
  /** First frame held until the clip plays (and the whole background under
      reduced motion). Must be as dark as the footage or the scrims under-scrim it. */
  poster?: string
  /**
   * Colour treatment on the footage. The default lifts a dark stage; a clip
   * that is already bright wants no lift, or a negative one — a brightened
   * frame under a fixed scrim is exactly how poster copy loses its contrast.
   */
  filter?: string
  /**
   * Flat black laid over the whole frame under the gradients. 0.32 suits dark
   * footage; a bright clip needs more before the middle band (which carries the
   * display figure) clears 4.5:1.
   */
  baseScrim?: number
}

/** Under the poster copy. */
const BOTTOM_SCRIM =
  'linear-gradient(to top, rgba(18,16,13,0.95) 0%, rgba(18,16,13,0.91) 32%, rgba(18,16,13,0.72) 52%, rgba(18,16,13,0.28) 74%, rgba(18,16,13,0) 100%)'
/** Under the storefront lockup. */
const TOP_SCRIM =
  'linear-gradient(to bottom, rgba(18,16,13,0.82) 0%, rgba(18,16,13,0.38) 15%, rgba(18,16,13,0) 30%)'

export function HeroVideoBackground({
  src = VIDEO_SRC,
  poster = POSTER_SRC,
  filter = DEFAULT_FILTER,
  baseScrim = 0.32,
}: HeroVideoBackgroundProps = {}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState(false)
  const reduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ['start start', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 1], [1.04, 1.2])
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '9%'])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    // Started here rather than via the `autoPlay` attribute so the reduced-motion
    // check lands before the first frame moves, not after it.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    video
      .play()
      .then(() => setPlaying(true))
      .catch(() => {
        // Autoplay refused — the poster stays up and the control below still works.
      })
  }, [])

  function toggle() {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      video
        .play()
        .then(() => setPlaying(true))
        .catch(() => {})
    } else {
      video.pause()
      setPlaying(false)
    }
  }

  return (
    <>
      <div ref={wrapRef} className="absolute inset-0 overflow-hidden" aria-hidden>
        <motion.video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover will-change-transform"
          // The footage is a dark stage; under the scrim it reads as black. The
          // lift is cosmetic only — the contrast budget above already assumes a
          // pure-white frame, so brightening can't undercut it.
          style={reduceMotion ? { filter } : { filter, scale, y }}
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          preload="metadata"
          tabIndex={-1}
        />

        {/* Base — keeps the mid-frame from washing out the outlined display line. */}
        <div className="absolute inset-0" style={{ background: `rgba(18,16,13,${baseScrim})` }} />
        <div className="absolute inset-0" style={{ background: BOTTOM_SCRIM }} />
        <div className="absolute inset-0" style={{ background: TOP_SCRIM }} />

        {/* The paper rules carry over the footage so the poster still belongs to
            the page the rest of the sections are drawn on. */}
        <RuledGround tone="dark" marginRule={false} />
      </div>

      {/* WCAG 2.2.2 — a 10s loop running beside other content needs a stop. */}
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? 'Pause the background video' : 'Play the background video'}
        className="absolute top-20 right-4 sm:right-6 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-kawai-black/50 hover:bg-kawai-black/75 border border-kawai-pearl/25 text-kawai-pearl backdrop-blur-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-kawai-pearl focus-visible:ring-offset-2 focus-visible:ring-offset-kawai-black"
      >
        {playing ? (
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <rect x="6" y="4.5" width="4" height="15" rx="1" />
            <rect x="14" y="4.5" width="4" height="15" rx="1" />
          </svg>
        ) : (
          <svg className="w-3.5 h-3.5 translate-x-[1px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M7 4.5v15l13-7.5z" />
          </svg>
        )}
      </button>
    </>
  )
}
