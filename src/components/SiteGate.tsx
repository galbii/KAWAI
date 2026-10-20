import type { ReactNode } from 'react'
import { getSite } from '@/lib/site-context'
import { isAvailableOnSite } from '@/lib/site-availability'

/**
 * Renders its children only on the site(s) `siteAvailability` allows.
 *
 * Server-only: reads `getSite()`, so it must never be mounted from the
 * frontend layout. RenderBlocks wraps only restricted blocks in it, so pages
 * with no region-exclusive content never touch `headers()`.
 */
export async function SiteGate({
  siteAvailability,
  children,
}: {
  siteAvailability: string | null | undefined
  children: ReactNode
}) {
  const site = await getSite()
  return isAvailableOnSite({ siteAvailability }, site) ? <>{children}</> : null
}
