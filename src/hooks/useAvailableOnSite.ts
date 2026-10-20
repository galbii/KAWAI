'use client'

import { useEffect, useState } from 'react'
import {
  exclusiveSite,
  isAvailableOnSite,
  siteFromHost,
  type SiteAvailability,
} from '@/lib/site-availability'

/**
 * Client-side `isAvailableOnSite` for components that can't read `getSite()` —
 * anything mounted from the frontend layout, where `headers()` would make every
 * page dynamic.
 *
 * Unrestricted content is available from the first render. Restricted content
 * starts unavailable on both server and client (no hydration mismatch) and
 * resolves against the hostname after mount — the same rule middleware applies.
 */
export function useAvailableOnSite(siteAvailability: SiteAvailability | string | null | undefined): boolean {
  const [available, setAvailable] = useState(() => exclusiveSite({ siteAvailability }) === null)

  useEffect(() => {
    setAvailable(isAvailableOnSite({ siteAvailability }, siteFromHost(window.location.hostname)))
  }, [siteAvailability])

  return available
}
