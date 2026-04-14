'use client'

import { usePathname } from 'next/navigation'

// Paths where the site footer should be hidden (full-screen app-like pages)
const FOOTERLESS_PATHS = ['/find-a-dealer']
// Path prefixes where the footer should be hidden (have their own layout)
const FOOTERLESS_PREFIXES = ['/namm-2026']

interface Props {
  children: React.ReactNode
}

/**
 * Client wrapper that hides the footer on full-screen pages.
 * The footer (children) is still server-rendered — this wrapper just
 * suppresses rendering it when the pathname matches.
 *
 * This must be a client component because isFindADealerPage in the parent
 * layout is only evaluated at the initial server render. On client-side
 * navigation the layout is reused, so server-side pathname detection breaks.
 */
export function ConditionalFooterWrapper({ children }: Props) {
  const pathname = usePathname()
  if (FOOTERLESS_PATHS.includes(pathname)) return null
  if (FOOTERLESS_PREFIXES.some(prefix => pathname.startsWith(prefix))) return null
  return <>{children}</>
}
