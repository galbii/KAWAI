'use client'

import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from 'react'

/**
 * The page's motion system.
 *
 * Two mechanisms, deliberately split:
 *
 *   1. The hero animates itself on load with CSS `animation` (see
 *      BackToSchoolHero) — no JS gate in front of the LCP text.
 *   2. Everything below the fold reveals on scroll through {@link Reveal},
 *      which flips a `data-in` attribute from an IntersectionObserver. The
 *      animation itself is a CSS *transition*, so `prefers-reduced-motion` is
 *      handled by the global rule in globals.css (transition-duration → 0.01ms)
 *      and reduced-motion visitors get the finished page instantly.
 *
 * Nothing animates a property that reflows: opacity, transform and clip-path
 * only, so a long scroll stays on the compositor.
 */

export type RevealVariant =
  /** Copy and panels: short rise + fade. */
  | 'rise'
  /** Display lines: revealed from their own baseline instead of dissolved. */
  | 'line'
  /** Hairlines and section rules: drawn left to right, like a pen. */
  | 'ruleX'
  /** Margin rules: drawn top to bottom. */
  | 'ruleY'
  /** Solid blocks: wiped in from the left. */
  | 'wipe'

const VARIANT_CLASS: Record<RevealVariant, string> = {
  rise: '',
  line: 'is-line',
  ruleX: 'is-rulex',
  ruleY: 'is-ruley',
  wipe: 'is-wipe',
}

/** Tags the reveal wrapper is allowed to render as — keeps `as` type-safe. */
type RevealTag = 'div' | 'span' | 'p' | 'li' | 'ul' | 'ol' | 'section' | 'article' | 'h2' | 'h3'

interface RevealProps {
  as?: RevealTag
  variant?: RevealVariant
  /** Seconds. Used for staggering siblings — keep the ladder under ~0.5s total. */
  delay?: number
  className?: string
  style?: CSSProperties
  id?: string
  children?: ReactNode
  'aria-hidden'?: boolean
}

export function Reveal({
  as = 'div',
  variant = 'rise',
  delay = 0,
  className,
  style,
  children,
  ...rest
}: RevealProps) {
  const Tag = as as ElementType
  const ref = useRef<HTMLElement | null>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // No observer (old browser, jsdom) — show it rather than leave it at opacity 0.
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true)
          io.disconnect()
        }
      },
      // Fires a little before the element is fully on screen, so the reveal is
      // finishing as it arrives rather than starting once it is already read.
      { rootMargin: '0px 0px -10% 0px', threshold: 0.01 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      data-in={shown ? '1' : '0'}
      className={['bts-r', VARIANT_CLASS[variant], className].filter(Boolean).join(' ')}
      style={{ ...(style ?? {}), ['--bts-d' as string]: `${delay}s` } as CSSProperties}
      {...rest}
    >
      {children}
    </Tag>
  )
}
