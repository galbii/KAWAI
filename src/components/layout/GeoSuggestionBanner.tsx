'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
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

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`))
  return match?.[1] ? decodeURIComponent(match[1]) : null
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
 * `site` is the ACTIVE site (from the hostname), passed by the layout.
 */
export function GeoSuggestionBanner({ site }: { site: Site }) {
  const pathname = usePathname()
  // Mounted guard: server always renders null (it can't read the client cookie),
  // so the client must match on first paint, then reveal after mount.
  const [mounted, setMounted] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    setDismissed(readCookie(DISMISSED_COOKIE) === '1')
    setMounted(true)
  }, [])

  if (!mounted || dismissed) return null

  const country = readCookie(GEO_COUNTRY_COOKIE)

  // Only two accurate cross-border cases. Everyone else (incl. the visitor
  // already on their matching site, or an unknown/other country) sees nothing.
  let target: Site | null = null
  if (site === 'us' && country === 'CA') target = 'cad'
  else if (site === 'cad' && country === 'US') target = 'us'
  if (!target) return null

  const targetName = target === 'cad' ? 'Kawai Canada' : 'Kawai America'
  const currency = target === 'cad' ? 'CAD' : 'USD'
  const flag = target === 'cad' ? '🍁' : '🇺🇸'
  // Paths are identical across the two domains (same Next.js routes), so the
  // equivalent page is just the same pathname on the other host.
  const href = `${SITE_URLS[target]}${pathname}`

  const remember = () => {
    document.cookie = `${DISMISSED_COOKIE}=1; path=/; max-age=${DISMISS_MAX_AGE}; samesite=lax`
  }

  return (
    <div
      role="region"
      aria-label="Regional site suggestion"
      className="fixed inset-x-0 top-0 z-[70] flex items-center justify-center gap-x-4 gap-y-2 border-b border-kawai-neutral bg-kawai-pearl px-4 py-3 text-kawai-black shadow-md sm:flex-row flex-col"
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
          onClick={() => {
            remember()
            setDismissed(true)
          }}
          className="rounded-md p-2 text-kawai-charcoal transition-colors hover:bg-kawai-neutral focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kawai-charcoal"
        >
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
          </svg>
        </button>
      </div>
    </div>
  )
}
