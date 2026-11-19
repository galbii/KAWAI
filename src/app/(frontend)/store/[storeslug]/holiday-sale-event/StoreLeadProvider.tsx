'use client'

import { useMemo, type ReactNode } from 'react'
import { LeadCampaignProvider } from '@/components/campaign-lead'
import { storeLeadCampaign } from './lead'

/**
 * Binds the store's lead config to the shared provider, on the client side of
 * the boundary — the config carries React components (the field icons), which
 * a server page cannot pass down. Same pattern as the national page's
 * FinancingLeadProvider. `children` stay server-rendered.
 *
 * `testMode` is read on the server from the national page's own switch
 * (`FALL_FINANCING_TEST_MODE`): a dry run validates and confirms but writes
 * nothing to HubSpot or Shopify.
 */
export function StoreLeadProvider({
  storeSlug,
  testMode = false,
  children,
}: {
  storeSlug: string
  testMode?: boolean
  children: ReactNode
}) {
  const config = useMemo(() => storeLeadCampaign(storeSlug), [storeSlug])
  return (
    <LeadCampaignProvider config={config} testMode={testMode}>
      {children}
    </LeadCampaignProvider>
  )
}
