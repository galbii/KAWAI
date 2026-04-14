'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

/**
 * Client wrapper that hides the site header, announcement bar, and layout
 * spacer on NAMM 2026 pages (which have their own full-page layout).
 *
 * Uses usePathname() instead of reading headers() on the server so the
 * frontend layout can be statically pre-rendered with PPR. The children
 * (main content + footer) are always rendered regardless of pathname.
 */
export function NammAwareShell({
  announcementBar,
  header,
  layoutSpacer,
  children,
}: {
  announcementBar: ReactNode
  header: ReactNode
  layoutSpacer: ReactNode
  children: ReactNode
}) {
  const pathname = usePathname()
  const isNAMM = pathname.startsWith('/namm-2026')
  return (
    <>
      {!isNAMM && announcementBar}
      {!isNAMM && header}
      {!isNAMM && layoutSpacer}
      {children}
    </>
  )
}
