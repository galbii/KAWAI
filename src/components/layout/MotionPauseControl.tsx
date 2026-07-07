'use client'

/**
 * MotionPauseControl — site-wide "Pause background motion" toggle (WCAG 2.2.2).
 *
 * The site uses many auto-playing, looping background videos (raw <video> heroes
 * and YouTube iframe backgrounds) that run >5s. Success Criterion 2.2.2 (Pause,
 * Stop, Hide — Level A) requires a mechanism to pause/stop such motion. This is
 * that single, always-available mechanism.
 *
 * Behaviour:
 *  - Raw <video>: paused in place via HTMLMediaElement.pause() (reliable).
 *  - YouTube iframes: postMessage({func:'pauseVideo'}) — honoured by embeds that
 *    include `enablejsapi=1`. A capture-phase `play` listener + MutationObserver
 *    keep looping/late-mounting media paused while the paused state is active.
 *  - Choice persists in localStorage. Defaults to paused when the user's OS has
 *    prefers-reduced-motion set (motion-sensitive users get a still page by default).
 */

import { useCallback, useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'kawai-motion-paused'

function isYouTube(src: string): boolean {
  return /youtube\.com\/embed|youtube-nocookie\.com\/embed/.test(src)
}

function postYouTube(frame: HTMLIFrameElement, func: 'pauseVideo' | 'playVideo') {
  try {
    frame.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func, args: [] }),
      '*',
    )
  } catch {
    /* cross-origin frame not ready — ignored */
  }
}

export function MotionPauseControl() {
  const [mounted, setMounted] = useState(false)
  const [paused, setPaused] = useState(false)
  const pausedRef = useRef(false)

  const apply = useCallback((isPaused: boolean) => {
    document.documentElement.dataset.motionPaused = isPaused ? 'true' : 'false'

    document.querySelectorAll('video').forEach((v) => {
      try {
        if (isPaused) v.pause()
        else if (v.autoplay || v.dataset.motionAutoplay === 'true') void v.play().catch(() => {})
      } catch {
        /* no-op */
      }
    })

    document.querySelectorAll('iframe').forEach((f) => {
      // The original src survives in data-motionSrc once we've blanked a frame.
      const src = f.dataset.motionSrc || f.getAttribute('src') || ''
      if (!isYouTube(src)) return
      // Only auto-playing *background* embeds fall under 2.2.2 — never touch a
      // user-initiated player (those start without autoplay=1 in the URL).
      if (!/autoplay=1/.test(src)) return

      if (/enablejsapi=1/.test(src)) {
        // Pause in place without reloading — no visual gap.
        postYouTube(f, isPaused ? 'pauseVideo' : 'playVideo')
        return
      }
      // No JS API: guarantee the stop by detaching, restore on resume.
      if (isPaused) {
        if (!f.dataset.motionSrc) {
          f.dataset.motionSrc = f.getAttribute('src') || ''
          f.setAttribute('src', 'about:blank')
        }
      } else if (f.dataset.motionSrc) {
        f.setAttribute('src', f.dataset.motionSrc)
        delete f.dataset.motionSrc
      }
    })
  }, [])

  // Initialise from storage / reduced-motion preference.
  useEffect(() => {
    setMounted(true)
    let initial = false
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored != null) initial = stored === 'true'
      else initial = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    } catch {
      /* storage unavailable */
    }
    pausedRef.current = initial
    setPaused(initial)
  }, [])

  // Apply state + keep new/looping media paused while paused is active.
  useEffect(() => {
    if (!mounted) return
    pausedRef.current = paused
    apply(paused)
    try {
      localStorage.setItem(STORAGE_KEY, String(paused))
    } catch {
      /* ignore */
    }
    if (!paused) return

    // A looping/newly-mounted <video> that tries to auto-play gets re-paused.
    const onPlay = (e: Event) => {
      if (!pausedRef.current) return
      const el = e.target
      if (el instanceof HTMLVideoElement) el.pause()
    }
    document.addEventListener('play', onPlay, true)

    const observer = new MutationObserver(() => {
      if (pausedRef.current) apply(true)
    })
    observer.observe(document.body, { childList: true, subtree: true })

    // YouTube frames often finish loading after the toggle; re-send briefly.
    const reassert = window.setInterval(() => {
      if (pausedRef.current) apply(true)
    }, 2000)

    return () => {
      document.removeEventListener('play', onPlay, true)
      observer.disconnect()
      window.clearInterval(reassert)
    }
  }, [paused, mounted, apply])

  if (!mounted) return null

  return (
    <button
      type="button"
      onClick={() => setPaused((p) => !p)}
      aria-pressed={paused}
      className="fixed bottom-4 left-4 z-[9600] inline-flex items-center gap-2 rounded-full border border-kawai-neutral/70 bg-white/95 px-3.5 py-2 text-xs font-medium text-kawai-charcoal shadow-lg backdrop-blur-sm transition-colors hover:bg-white hover:text-kawai-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kawai-red focus-visible:ring-offset-2 print:hidden"
    >
      {paused ? (
        // Play triangle
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
          <path d="M8 5v14l11-7z" />
        </svg>
      ) : (
        // Pause bars
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
          <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
        </svg>
      )}
      <span>{paused ? 'Play background motion' : 'Pause background motion'}</span>
    </button>
  )
}
