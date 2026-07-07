'use client'

/**
 * Per-instance background-motion pause control (WCAG 2.2.2 — Pause, Stop, Hide).
 *
 * Auto-playing, looping background media (>5s) needs an in-page mechanism to
 * pause it. Drop `<BackgroundMotionToggle />` inside the positioned container
 * that holds a background <video> or background YouTube <iframe>; the button
 * locates the media within its own container — no ref threading — so it works
 * even when a shared child (MediaRenderer, etc.) actually renders the element.
 *
 *  - <video>: paused/played in place.
 *  - YouTube iframe: postMessage(pauseVideo) when the src has `enablejsapi=1`,
 *    otherwise the src is detached (about:blank) and restored on resume.
 *
 * The button only acts on AUTO-PLAYING media (raw <video autoplay> or an iframe
 * whose src contains `autoplay=1`) so user-initiated players are never touched.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

function isBackgroundYouTube(frame: HTMLIFrameElement): boolean {
  const src = frame.dataset.motionSrc || frame.getAttribute('src') || ''
  return /youtube\.com\/embed|youtube-nocookie\.com\/embed/.test(src) && /autoplay=1/.test(src)
}

export function BackgroundMotionToggle({
  className,
  scopeSelector,
}: {
  className?: string
  /** Optional explicit container selector; defaults to the nearest ancestor that holds the media. */
  scopeSelector?: string
}) {
  const btnRef = useRef<HTMLButtonElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [hasMedia, setHasMedia] = useState(true)

  const getScope = useCallback((): HTMLElement | null => {
    const btn = btnRef.current
    if (!btn) return null
    if (scopeSelector) return btn.closest<HTMLElement>(scopeSelector)
    // Climb to the nearest ancestor that actually contains background media.
    let el: HTMLElement | null = btn.parentElement
    for (let i = 0; i < 8 && el; i++) {
      if (el.querySelector('video, iframe')) return el
      el = el.parentElement
    }
    return btn.parentElement
  }, [scopeSelector])

  const apply = useCallback(
    (paused: boolean) => {
      const scope = getScope()
      if (!scope) return
      scope.querySelectorAll('video').forEach((v) => {
        try {
          if (paused) v.pause()
          else void v.play().catch(() => {})
        } catch {
          /* no-op */
        }
      })
      scope.querySelectorAll('iframe').forEach((f) => {
        if (!isBackgroundYouTube(f)) return
        const src = f.dataset.motionSrc || f.getAttribute('src') || ''
        if (/enablejsapi=1/.test(src)) {
          try {
            f.contentWindow?.postMessage(
              JSON.stringify({ event: 'command', func: paused ? 'pauseVideo' : 'playVideo', args: [] }),
              '*',
            )
          } catch {
            /* frame not ready */
          }
          return
        }
        if (paused) {
          if (!f.dataset.motionSrc) {
            f.dataset.motionSrc = f.getAttribute('src') || ''
            f.setAttribute('src', 'about:blank')
          }
        } else if (f.dataset.motionSrc) {
          f.setAttribute('src', f.dataset.motionSrc)
          delete f.dataset.motionSrc
        }
      })
    },
    [getScope],
  )

  // Hide the control if the container has no background media (e.g. an image slide).
  useEffect(() => {
    const scope = getScope()
    setHasMedia(Boolean(scope?.querySelector('video') || (scope && Array.from(scope.querySelectorAll('iframe')).some(isBackgroundYouTube))))
  }, [getScope])

  const toggle = useCallback(() => {
    setIsPaused((prev) => {
      apply(!prev)
      return !prev
    })
  }, [apply])

  if (!hasMedia) return null

  return (
    <button
      ref={btnRef}
      type="button"
      onClick={toggle}
      aria-label={isPaused ? 'Play background video' : 'Pause background video'}
      className={cn(
        'absolute bottom-4 right-4 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white shadow-lg backdrop-blur-md transition-colors hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
        className,
      )}
    >
      {isPaused ? (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
          <path d="M8 5v14l11-7z" />
        </svg>
      ) : (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
        </svg>
      )}
    </button>
  )
}
