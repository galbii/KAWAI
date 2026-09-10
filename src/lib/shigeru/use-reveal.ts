'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Reveal-on-scroll, in about a kilobyte.
 *
 * Returns a ref to put on the element you want watched and a `shown` flag.
 * Pair it with the `.sk-reveal` classes in models.css: put `is-shown` on the
 * observed element when `shown` flips, and every `.sk-reveal` inside it — or
 * the element itself — transitions in. Stagger children by setting a
 * `--sk-delay` custom property on each.
 *
 * The whole reason this exists rather than framer-motion's `whileInView`:
 * pulling framer into these routes cost ~48 kB of first-load JS on two pages
 * whose job is organic search. The motion is a fade and a translate — CSS does
 * that for free.
 *
 * Fires once and disconnects. Honours prefers-reduced-motion by showing
 * immediately (the CSS also neutralises the transform, so this is belt and
 * braces).
 */
export function useReveal<T extends HTMLElement>(threshold = 0.25) {
  const ref = useRef<T | null>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || shown) return

    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setShown(true)
      return
    }

    // Already on screen at mount (anything above the fold) — skip the observer
    // round trip so the hero does not wait a frame to appear.
    const box = el.getBoundingClientRect()
    if (box.top < window.innerHeight && box.bottom > 0) {
      setShown(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true)
          observer.disconnect()
        }
      },
      { threshold },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, shown])

  return { ref, shown }
}
