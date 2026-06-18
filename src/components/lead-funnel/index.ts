/**
 * Lead Funnel — public API.
 *
 * A modular, plug-and-play multi-step lead-capture popup:
 *   1. Offer + contact  → saves the lead to Shopify (email marketing consent)
 *   2. ZIP → 5 nearest dealers → pick one → tags the customer for routing
 *   3. Thank you → "visit in person" CTA to the dealer's page
 *
 * Drop <LeadFunnelPopup config={...} /> into any page. Wrap in
 * <LeadFunnelProvider> when you also want manual CTA triggers.
 */

export { LeadFunnelPopup } from './LeadFunnelPopup'
export { LeadFunnelProvider, useLeadFunnel, useLeadFunnelOptional } from './LeadFunnelProvider'
export { LeadFunnelTrigger } from './LeadFunnelTrigger'
export type { LeadFunnelConfig, LeadFunnelTheme, NearestDealer } from './types'
