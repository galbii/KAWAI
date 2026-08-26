'use client'

import { useEffect, useRef } from 'react'

interface Props {
  src: string
  type: string
  className?: string
}

/**
 * Background video for the signup hero.
 *
 * The `autoplay` attribute alone is not enough in practice: a tab that loads
 * while backgrounded, or a hydration pass that re-attaches the element after
 * the browser has already made its autoplay decision, both leave the video
 * parked at frame 0 with no error. Calling play() on mount — and again when the
 * tab becomes visible — is what actually makes it run.
 *
 * play() is still driven by the muted property being set first, since Chrome
 * and Safari only grant unattended playback to muted video.
 *
 * Reduced motion is honoured by leaving the video paused rather than hiding it:
 * the first frame stays as a still backdrop, so the hero keeps its imagery
 * instead of collapsing to flat black.
 */
export function SignupHeroVideo({ src, type, className }: Props) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const start = () => {
      video.muted = true
      // Rejection is normal and not actionable — a policy refusal here just
      // means the hero shows a still frame, which is an acceptable fallback.
      void video.play().catch(() => {})
    }

    start()

    const onVisible = () => {
      if (document.visibilityState === 'visible') start()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [])

  return (
    <video
      ref={ref}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
      tabIndex={-1}
      className={className}
    >
      <source src={src} type={type} />
    </video>
  )
}
