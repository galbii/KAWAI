import type { LeadCampaignConfig } from '@/components/campaign-lead'
import { leadCampaign } from '@/app/(frontend)/fall-financing/_components/lead-campaign'
import { REQUEST_LABEL } from './labels'

/**
 * The store landing's lead form: the national /fall-financing enquiry,
 * reused as-is (kawai-holiday-financing-landing v2, Nov 19, 2026).
 *
 * Same HubSpot portal and form GUID, same fields, consent and confirmation,
 * same `source` (so RSM routing and its email are the national page's own),
 * same Shopify tags. Two things change, neither of them a form:
 *
 * - `formName` gains the store slug. It is only the analytics `event_label`
 *   and HubSpot `pageName`, so leads from each store page can be told apart
 *   in reporting while landing in the one form. It keeps the national prefix,
 *   so anything filtering on `fall_financing_enquiry` still matches.
 * - `copy.openLabel` is this page's button label, "Request Inventory".
 */
export function storeLeadCampaign(storeSlug: string): LeadCampaignConfig {
  const slug = storeSlug.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '')
  return {
    ...leadCampaign,
    formName: `${leadCampaign.formName}_store_${slug}`,
    copy: { ...leadCampaign.copy, openLabel: REQUEST_LABEL },
  }
}
