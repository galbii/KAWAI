import type { HubSpotFormConfig } from '@/lib/hubspot/forms'
import type { PreFormField } from '@/components/forms/TwoStepHubSpotForm'

/**
 * Everything that differs between one campaign's lead capture and another's.
 *
 * /signup, /signup2 and /signup3 each carry their own copy of the same offer
 * modal, provider and form — three files that differ only in a source string, a
 * tag array and some copy, and which have already drifted apart in behaviour
 * (see the divergence in their OfferModalContext files). This config is that
 * difference, named, so a new campaign supplies data instead of a fourth copy.
 */
export interface LeadCampaignConfig {
  /**
   * Identifies the campaign in the RSM notification email and the Resend
   * dashboard tag. Keep it equal to the page's route segment.
   */
  source: string
  /** Source/campaign tags applied to the mirrored Shopify customer. */
  shopifyTags: readonly string[]
  /** HubSpot portal + form GUID the submission POSTs to. */
  hubspotForm: HubSpotFormConfig
  /**
   * Field configuration for the form. Omit to use TwoStepHubSpotForm's default
   * dealer-signup fields.
   */
  fields?: PreFormField[]
  /** Identifies the form in analytics (`event_label`) and HubSpot's `pageName`. */
  formName: string
  copy: LeadCampaignCopy
}

export interface LeadCampaignCopy {
  /** Small red-dash label above the form's heading. */
  eyebrow: string
  /**
   * The form's heading. Short — it is set in condensed caps inside a ~384px
   * panel, and the visitor has already clicked a button stating the ask.
   */
  headline: string
  /** One line under the heading saying what happens next. */
  body: string
  /** Label on the form's own submit button. */
  submitLabel: string
  /** Label on every button that OPENS the form. */
  openLabel: string
  /** Consent line under the form. Required — this is a marketing opt-in. */
  consent: string
  successTitle: string
  successBody: string
  /**
   * Label on the button that closes the form after a successful submission.
   *
   * Optional. Without it the confirmation is a dead end — an icon, a title, a
   * sentence and no control, so a visitor's only way out of the dialog is the
   * corner X. A campaign page with more than one offer should hand them back to
   * the others instead.
   */
  successCta?: string
}
