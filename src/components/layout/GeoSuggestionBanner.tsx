'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import type { Site } from '@/lib/site-context'

// Hardcoded here because site-context.ts is `server-only` and can't be imported
// into a client component. Source of truth is SITE_URLS in src/lib/site-context.ts —
// keep these in sync.
const SITE_URLS: Record<Site, string> = {
  us: 'https://kawaius.com',
  cad: 'https://ca.kawaius.com',
}

const GEO_COUNTRY_COOKIE = 'kawai-geo-country'
const DISMISSED_COOKIE = 'kawai-geo-dismissed'
const DISMISS_MAX_AGE = 60 * 60 * 24 * 180 // 180 days

// Hold the reveal briefly after mount so the banner slides in as a deliberate,
// noticeable gesture rather than flashing in during the page's first paint.
const SHOW_DELAY_MS = 1200

// Published to :root while the banner is on screen so the admin bar, announcement
// bar and header can shift down by exactly its height (see AdminBar.tsx,
// AnnouncementBar.tsx, header.tsx). Reset to 0px whenever the banner is hidden.
const HEIGHT_VAR = '--geo-banner-height'

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`))
  return match?.[1] ? decodeURIComponent(match[1]) : null
}

function setHeightVar(value: string) {
  if (typeof document !== 'undefined') {
    document.documentElement.style.setProperty(HEIGHT_VAR, value)
  }
}

/**
 * Suggests the region-appropriate site to cross-border visitors — a Canadian on
 * the US site is nudged to Kawai Canada (CAD pricing / CA checkout), and vice
 * versa — WITHOUT forcing a redirect. A dismissible suggestion is the
 * Google-endorsed pattern for hreflang setups; an IP auto-redirect would harm
 * crawl/indexing and trap cross-border shoppers (see the research notes).
 *
 * Visitor country comes from the `kawai-geo-country` cookie that middleware.ts
 * writes from Cloudflare's `cf-ipcountry`. Everything is decided client-side, so
 * this never opts a page into dynamic rendering. Dismissal (and clicking
 * through) persists in a cookie so it never nags again.
 *
 * Layering: this bar sits ABOVE the header AND the Payload admin bar (top-most
 * z-index, pinned to top: 0). It publishes its height to `--geo-banner-height`,
 * which the admin bar, announcement bar and header add to their own `top` so
 * they glide down to make room instead of being covered. It reveals after a
 * short delay and slides in/out (framer-motion) for a smoother entrance.
 *
 * `site` is the ACTIVE site (from the hostname), passed by the layout.
 */
export function GeoSuggestionBanner({ site }: { site: Site }) {
  const pathname = usePathname()
  // Mounted guard: server always renders null (it can't read the client cookie),
  // so the client must match on first paint, then reveal after mount.
  const [mounted, setMounted] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  // Gate the entrance behind SHOW_DELAY_MS so the slide-in reads as intentional.
  const [revealed, setRevealed] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setDismissed(readCookie(DISMISSED_COOKIE) === '1')
    setMounted(true)
  }, [])

  const country = mounted ? readCookie(GEO_COUNTRY_COOKIE) : null

  // Only two accurate cross-border cases. Everyone else (incl. the visitor
  // already on their matching site, or an unknown/other country) sees nothing.
  let target: Site | null = null
  if (site === 'us' && country === 'CA') target = 'cad'
  else if (site === 'cad' && country === 'US') target = 'us'

  const open = mounted && !dismissed && revealed && Boolean(target)

  // Delayed reveal: once we know this visitor qualifies, wait, then slide in.
  useEffect(() => {
    if (!mounted || dismissed || !target) return
    const timer = setTimeout(() => setRevealed(true), SHOW_DELAY_MS)
    return () => clearTimeout(timer)
  }, [mounted, dismissed, target])

  // Reserve exactly the banner's height for the bars below it. Tracks responsive
  // height changes (the banner stacks vertically on mobile). translateY during
  // the slide doesn't affect getBoundingClientRect().height, so the reserved
  // space is correct from the first frame and the bars glide down in step.
  useEffect(() => {
    const el = barRef.current
    if (!open || !el) {
      setHeightVar('0px')
      return
    }
    const update = () => {
      const h = el.getBoundingClientRect().height
      if (h > 0) setHeightVar(`${h}px`)
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => {
      observer.disconnect()
      setHeightVar('0px')
    }
  }, [open])

  if (!mounted || !target) return null

  const targetName = target === 'cad' ? 'Kawai Canada' : 'Kawai America'
  const currency = target === 'cad' ? 'CAD' : 'USD'
  const flag = target === 'cad' ? '🍁' : '🇺🇸'
  // Paths are identical across the two domains (same Next.js routes), so the
  // equivalent page is just the same pathname on the other host.
  const href = `${SITE_URLS[target]}${pathname}`

  const remember = () => {
    document.cookie = `${DISMISSED_COOKIE}=1; path=/; max-age=${DISMISS_MAX_AGE}; samesite=lax`
  }

  const dismiss = () => {
    remember()
    // Release the reserved space immediately so the bars glide back up in step
    // with the banner's slide-out (AnimatePresence keeps it mounted meanwhile).
    setHeightVar('0px')
    setDismissed(true)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={barRef}
          role="region"
          aria-label="Regional site suggestion"
          initial={{ y: '-100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-0 top-0 z-[10001] flex items-center justify-center gap-x-4 gap-y-2 border-b border-kawai-neutral bg-kawai-pearl px-4 py-3 text-kawai-black shadow-md sm:flex-row flex-col"
        >
          <p className="text-sm sm:text-base text-center">
            <span aria-hidden="true" className="mr-1.5">{flag}</span>
            Shopping from {target === 'cad' ? 'Canada' : 'the United States'}? Visit{' '}
            <span className="font-semibold">{targetName}</span> for {currency} pricing.
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={href}
              onClick={remember}
              className="rounded-md bg-kawai-red px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-kawai-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kawai-red"
            >
              Go to {targetName}
            </a>
            <button
              type="button"
              aria-label="Dismiss"
              onClick={dismiss}
              className="rounded-md p-2 text-kawai-charcoal transition-colors hover:bg-kawai-neutral focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kawai-charcoal"
            >
              <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
