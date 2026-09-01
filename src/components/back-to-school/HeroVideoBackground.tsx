'use client'

import { useEffect, useRef, useState } from 'react'
import { RuledGround } from './RuledGround'

/**
 * Full-bleed background for the hero: the campaign clip behind everything, with
 * the scrim that makes type on top of it legible.
 *
 * Scrim opacity is not a taste call. Text has to clear 4.5:1 against the
 * *brightest* frame the video can show, not the average one — the footage is a
 * dark stage, but it has blown-out stage lights in it. Composited over white,
 * black at 0.82 lands the background at L≈0.03, which clears 4.5:1 for both
 * kawai-pearl (≈14:1) and kawai-red-400 (≈4.6:1). Lowering it re-breaks the red.
 * The right side falls off to 0.35 because no text sits there, so the picture
 * gets to breathe.
 */

const VIDEO_SRC =
  'https://pub-0cc9ed269d544fd29fe51221f6744a6b.r2.dev/media/Timeline%201.webm'

const POSTER_SRC = '/images/kawai-piano.jpeg'

/** Text column is max-w-2xl, so the dense half of the scrim has to outlast it. */
const DESKTOP_SCRIM =
  'linear-gradient(100deg, rgba(18,16,13,0.88) 0%, rgba(18,16,13,0.86) 42%, rgba(18,16,13,0.82) 58%, rgba(18,16,13,0.42) 80%, rgba(18,16,13,0.24) 100%)'

export function HeroVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

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
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          // The footage is a dark stage; under the scrim it reads as black. The
          // lift is cosmetic only — the contrast budget above already assumes a
          // pure-white frame, so brightening can't undercut it.
          style={{ filter: 'brightness(1.35) contrast(1.04) saturate(1.05)' }}
          src={VIDEO_SRC}
          poster={POSTER_SRC}
          muted
          loop
          playsInline
          preload="metadata"
          tabIndex={-1}
        />

        {/* Mobile: text spans the full width, so the scrim has to as well. */}
        <div className="absolute inset-0 bg-[rgba(18,16,13,0.86)] lg:hidden" />
        {/* Desktop: dense under the copy, opening up toward the right. */}
        <div className="absolute inset-0 hidden lg:block" style={{ background: DESKTOP_SCRIM }} />

        {/* The paper rules carry over the footage so the hero still belongs to
            the page the rest of the sections are drawn on. */}
        <RuledGround tone="dark" />
      </div>

      {/* WCAG 2.2.2 — a 10s loop running beside other content needs a stop. */}
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? 'Pause the background video' : 'Play the background video'}
        className="absolute bottom-5 right-5 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-kawai-black/50 hover:bg-kawai-black/75 border border-kawai-pearl/25 text-kawai-pearl backdrop-blur-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-kawai-pearl focus-visible:ring-offset-2 focus-visible:ring-offset-kawai-black"
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
