import type { LeadCampaignConfig } from '@/components/campaign-lead'
import { leadCampaign } from '@/app/(frontend)/fall-financing/_components/lead-campaign'
import { REQUEST_LABEL } from './labels'
import { notifyHolidayStoreLead } from './notify-store-lead'

/** Added to every holiday-sale-event lead in Shopify, on top of the national tags. */
export const HOLIDAY_LEAD_TAG = 'holiday-2026-lead'

/**
 * The store landing's lead form: the national /fall-financing enquiry,
 * reused (kawai-holiday-financing-landing v2, Nov 19, 2026).
 *
 * Same HubSpot portal and form GUID, same fields, consent and confirmation,
 * same `source`. What changes, none of it a form:
 *
 * - `formName` gains the store slug. It is only the analytics `event_label`
 *   and HubSpot `pageName`, so leads from each store page can be told apart
 *   in reporting while landing in the one form. It keeps the national prefix,
 *   so anything filtering on `fall_financing_enquiry` still matches.
 * - `copy.openLabel` is this page's button label, "Request Inventory".
 * - Routing and tags (Chance, Nov 19, 2026: "it should just send to the
 *   correct inbox, add to shopify and tag holiday-2026-lead"): every lead goes
 *   to this page's store inbox with a confirmation to the customer
 *   (`notifyHolidayStoreLead`, server-side; only the slug crosses the wire),
 *   and the Shopify customer gets `holiday-2026-lead` beside the national tags.
 */
export function storeLeadCampaign(storeSlug: string): LeadCampaignConfig {
  const slug = storeSlug.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '')
  return {
    ...leadCampaign,
    formName: `${leadCampaign.formName}_store_${slug}`,
    copy: { ...leadCampaign.copy, openLabel: REQUEST_LABEL },
    shopifyTags: [...leadCampaign.shopifyTags, HOLIDAY_LEAD_TAG],
    notifyLead: (values) => notifyHolidayStoreLead(values, storeSlug, leadCampaign.source),
  }
}
