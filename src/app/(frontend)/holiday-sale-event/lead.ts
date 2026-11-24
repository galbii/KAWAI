import type { LeadCampaignConfig } from '@/components/campaign-lead'
import { leadCampaign } from '@/app/(frontend)/fall-financing/_components/lead-campaign'
import { HOLIDAY_LEAD_TAG, REQUEST_LABEL } from '@/app/(frontend)/store/[storeslug]/holiday-sale-event/labels'

/**
 * The national /holiday-sale-event lead form (kawai-holiday-sale-national v1,
 * Nov 24, 2026). The user: "the form should work like the fall-financing page
 * with that routing".
 *
 * It is the national /fall-financing enquiry: same HubSpot portal and form,
 * same fields, consent, confirmation and `source`. What changes, none of it
 * routing:
 *
 * - `formName` is this page's own, so its leads can be told apart in
 *   analytics. It keeps the national prefix, so anything filtering on
 *   `fall_financing_enquiry` still matches.
 * - `copy.openLabel` is the holiday button label, "Request Inventory".
 * - The Shopify customer gets `holiday-2026-lead` beside the national tags.
 *
 * There is deliberately NO `notifyLead`: LeadCampaignContext then falls back
 * to `notifyRsmOfLead(values, source)`, the ZIP → nearest dealer's RSM routing
 * /fall-financing uses, and the confirmation shows the nearest showroom card.
 * (The store pages set `notifyLead` to their own store inbox instead.)
 */
export const holidayLeadCampaign: LeadCampaignConfig = {
  ...leadCampaign,
  formName: 'fall_financing_enquiry_holiday_national',
  copy: { ...leadCampaign.copy, openLabel: REQUEST_LABEL },
  shopifyTags: [...leadCampaign.shopifyTags, HOLIDAY_LEAD_TAG],
}
