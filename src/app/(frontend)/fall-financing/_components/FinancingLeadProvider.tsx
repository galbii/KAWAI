'use client'

import type { ReactNode } from 'react'
import { LeadCampaignProvider } from '@/components/campaign-lead'
import { leadCampaign } from './lead-campaign'

/**
 * Binds this page's lead config to the shared provider.
 *
 * It exists to keep the config on the client side of the boundary. The config
 * carries React component references (the field icons), which cannot be
 * serialized from a server component into a client one — passing `leadCampaign`
 * straight from page.tsx would fail at the boundary. Importing it inside a
 * module that is already `'use client'` resolves it in the client bundle
 * instead, and `children` handed in from the server page stays server-rendered,
 * so the hero and every section keep their HTML in the initial response.
 *
 * `testMode` is a boolean, which crosses the boundary happily.
 */
export function FinancingLeadProvider({
  testMode = false,
  children,
}: {
  testMode?: boolean
  children: ReactNode
}) {
  return (
    <LeadCampaignProvider config={leadCampaign} testMode={testMode}>
      {children}
    </LeadCampaignProvider>
  )
}
