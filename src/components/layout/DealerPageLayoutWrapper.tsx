'use client'

import { usePathname } from 'next/navigation'

// Paths that use a full-screen app layout (h-dvh, no scroll, no footer)
const FULLSCREEN_PATHS = ['/find-a-dealer']

interface Props {
  children: React.ReactNode
}

/**
 * Client wrapper that applies h-dvh + overflow-hidden for full-screen pages
 * and min-h-screen for regular pages.
 *
 * Must be client-side because on SPA navigation the server-rendered layout
 * is reused — server-side pathname detection would give stale results.
 */
export function DealerPageLayoutWrapper({ children }: Props) {
  const pathname = usePathname()
  const isFullscreen = FULLSCREEN_PATHS.includes(pathname)

  return (
    <div
      className={
        isFullscreen
          ? 'flex h-dvh flex-col m-0 p-0 overflow-hidden'
          : 'flex min-h-screen flex-col m-0 p-0'
      }
    >
      {children}
    </div>
  )
}
