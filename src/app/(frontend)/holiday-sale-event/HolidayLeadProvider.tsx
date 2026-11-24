'use client'

import type { ReactNode } from 'react'
import { LeadCampaignProvider } from '@/components/campaign-lead'
import { holidayLeadCampaign } from './lead'

/**
 * Binds the national holiday lead config to the shared provider, on the client
 * side of the boundary: the config carries React components (the field icons),
 * which a server page cannot pass down. Same pattern as /fall-financing's
 * FinancingLeadProvider; `children` stay server-rendered.
 *
 * `testMode` is read on the server from the national page's own switch
 * (`FALL_FINANCING_TEST_MODE`): a dry run validates and confirms but writes
 * nothing to HubSpot or Shopify.
 */
export function HolidayLeadProvider({
  testMode = false,
  children,
}: {
  testMode?: boolean
  children: ReactNode
}) {
  return (
    <LeadCampaignProvider config={holidayLeadCampaign} testMode={testMode}>
      {children}
    </LeadCampaignProvider>
  )
}
