import type { LeadCampaignConfig } from '@/components/campaign-lead'
import { leadCampaign } from '@/app/(frontend)/fall-financing/_components/lead-campaign'
import { HOLIDAY_LEAD_TAG, REQUEST_LABEL } from '@/app/(frontend)/store/[storeslug]/holiday-sale-event/labels'
import { notifyHolidayNationalLead } from './notify-national-lead'

/**
 * The national /holiday-sale-event lead form (kawai-holiday-sale-national v1,
 * Nov 24, 2026). The user: "the form should work like the fall-financing page
 * with that routing".
 *
 * It is the national /fall-financing enquiry: same HubSpot portal and form,
 * same fields, consent, confirmation and `source`. What changes:
 *
 * - `formName` is this page's own, so its leads can be told apart in
 *   analytics. It keeps the national prefix, so anything filtering on
 *   `fall_financing_enquiry` still matches.
 * - `copy.openLabel` is the holiday button label, "Request Inventory".
 * - Shopify tags: the national tags minus `fall-financing` (user, Nov 24, 2026:
 *   "remove fall financing"), plus `holiday-2026-lead`.
 * - `notifyLead` (kawai-lead-rsm-holiday v1, Nov 25, 2026: "send an email to
 *   the rsm as well as the user and brand it like a holiday"): the SAME
 *   ZIP → nearest dealer's RSM routing as /fall-financing, in holiday-branded
 *   emails, plus a confirmation to the visitor. Recipients are decided
 *   server-side; only the form values cross the wire. `source` stays
 *   'fall-financing' (decision, Nov 25, 2026). The confirmation still shows
 *   the nearest showroom card.
 */
export const holidayLeadCampaign: LeadCampaignConfig = {
  ...leadCampaign,
  formName: 'fall_financing_enquiry_holiday_national',
  copy: { ...leadCampaign.copy, openLabel: REQUEST_LABEL },
  shopifyTags: [...leadCampaign.shopifyTags.filter((t) => t !== 'fall-financing'), HOLIDAY_LEAD_TAG],
  notifyLead: (values) => notifyHolidayNationalLead(values, leadCampaign.source),
}
