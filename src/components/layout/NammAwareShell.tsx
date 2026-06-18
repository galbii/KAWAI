'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

/**
 * Client wrapper that hides the site header, announcement bar, and layout
 * spacer on full-page campaign routes (NAMM 2026 and the CX Line landing
 * page) which ship their own header/footer chrome.
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
  const isFullPageCampaign = pathname.startsWith('/namm-2026') || pathname.startsWith('/cx')
  return (
    <>
      {!isFullPageCampaign && announcementBar}
      {!isFullPageCampaign && header}
      {!isFullPageCampaign && layoutSpacer}
      {children}
    </>
  )
}
