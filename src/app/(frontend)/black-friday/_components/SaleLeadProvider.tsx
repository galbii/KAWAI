'use client'

import type { ReactNode } from 'react'
import { LeadCampaignProvider, type LeadCampaignConfig } from '@/components/campaign-lead'
import { leadCampaign } from '../../fall-financing/_components/lead-campaign'

/**
 * The /fall-financing enquiry form, attributed to Black Friday.
 *
 * Same fields, same HubSpot form, same dealer routing; only the source string,
 * the Shopify tags and the analytics form name differ, so Black Friday leads
 * can be told apart from fall-financing ones. Client-side for the same reason
 * as FinancingLeadProvider: the config carries icon components.
 */
const saleLeadCampaign: LeadCampaignConfig = {
  ...leadCampaign,
  source: 'black-friday',
  shopifyTags: [...leadCampaign.shopifyTags, 'black-friday-2026'],
  formName: 'black_friday_enquiry',
}

export function SaleLeadProvider({
  testMode = false,
  children,
}: {
  testMode?: boolean
  children: ReactNode
}) {
  return (
    <LeadCampaignProvider config={saleLeadCampaign} testMode={testMode}>
      {children}
    </LeadCampaignProvider>
  )
}
