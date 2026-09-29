/**
 * Campaign lead capture — the offer-modal / lead-routing vocabulary shared by
 * national campaign landing pages.
 *
 * Generalized out of the three hand-copied trios on /signup, /signup2 and
 * /signup3 (OfferModalContext + OfferModal + OfferSignupForm, ~250 duplicated
 * lines each). A new campaign page supplies a {@link LeadCampaignConfig} and
 * gets the modal, the form, the Shopify mirror and the RSM routing; it does not
 * copy them. Those three pages can be retrofitted onto this by swapping their
 * local imports for these — their configs are already just a source string, a
 * tag array and copy.
 */
export { LeadCampaignProvider, useLeadCampaign } from './LeadCampaignContext'
export { LeadForm } from './LeadForm'
export { LeadModal } from './LeadModal'
export { LeadButton, CampaignLink, CampaignAnchor, type Tone } from './CampaignButton'
export type { LeadCampaignConfig, LeadCampaignCopy } from './types'
