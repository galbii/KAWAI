import type { LeadCampaignConfig } from '@/components/campaign-lead'
import { EnvelopeIcon, MapPinIcon, PhoneIcon, UserIcon } from '@heroicons/react/24/outline'
import { PIANO_TYPE_FIELD, PURCHASE_TIMELINE_FIELD } from '@/components/forms/TwoStepHubSpotForm'
import { CTA_LABEL } from './campaign'

/**
 * Lead capture for this page.
 *
 * The brief asks for Name / Email / Phone / Postal Code / How can we help? — a
 * financing enquiry, not a rebate sign-up — so the form declares its own fields
 * rather than taking TwoStepHubSpotForm's dealer-signup defaults. It reuses the
 * same HubSpot form as the sign-up campaigns, which is what keeps every lead in
 * one place; `formName` is what separates them in analytics.
 *
 * `zip` and `phone` are required because the HubSpot form requires them and
 * because routing geocodes the postal code to find the nearest dealer's RSM.
 */
export const leadCampaign: LeadCampaignConfig = {
  source: 'fall-financing',
  shopifyTags: ['fall-financing', 'q4-2026-financing'],
  // Same HubSpot form the sign-up campaigns submit to — one place for every
  // lead. `formName` below is what separates this page in analytics.
  // (No `region`: the submissions endpoint is region-agnostic, and the `na1`
  // key the /signup configs carry is inert — HubSpotFormConfig has no such field.)
  hubspotForm: {
    portalId: '21987263',
    formGuid: '6a40df6b-d339-413c-8f62-d6e8324f3959',
  },
  formName: 'fall_financing_enquiry',
  fields: [
    { name: 'firstname', label: 'First Name', placeholder: 'Jane', required: true, icon: UserIcon },
    { name: 'lastname', label: 'Last Name', placeholder: 'Doe', required: true, icon: UserIcon },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'jane@example.com',
      required: true,
      icon: EnvelopeIcon,
      validation: { email: true },
    },
    {
      name: 'phone',
      label: 'Phone',
      type: 'tel',
      placeholder: '(555) 123-4567',
      required: true,
      icon: PhoneIcon,
      validation: { minLength: 7 },
    },
    {
      name: 'zip',
      label: 'Postal Code',
      placeholder: '90210',
      required: true,
      icon: MapPinIcon,
      helpText: "We'll match you to your nearest Authorized Kawai dealer.",
      validation: {
        pattern: {
          // US ZIP (+4) or Canadian postal code — the HubSpot form is shared with
          // pages that serve both, so the field must accept either shape even
          // though this promotion is US-only.
          regex: /^(\d{5}(-\d{4})?|[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d)$/,
          message: 'Enter a valid ZIP or postal code',
        },
      },
    },
    // The same qualifying fields /signup2 collects. `piano_type` is required by
    // the shared HubSpot form — without it HubSpot rejects the whole submission
    // ("Required field 'piano_type' is missing").
    PIANO_TYPE_FIELD,
    PURCHASE_TIMELINE_FIELD,
    {
      // §6 of the developer requirements: required, textarea, 500 character
      // maximum, with a counter. The cap is enforced by the native attribute,
      // the Zod schema and the visible counter — see TextareaField.
      name: 'message',
      label: 'How can we help?',
      type: 'textarea',
      placeholder: 'Tell us which model you have in mind, or what you would like to know.',
      rows: 3,
      required: true,
      maxLength: 500,
      hubspotName: 'message',
    },
  ],
  copy: {
    // §3 section 1 names "Limited Time" as the hero eyebrow; the form reuses it.
    eyebrow: 'Limited Time',
    /**
     * No rate in this headline.
     *
     * §4.1 requires "(APR 8.01%)*" beside any "0%" in a headline at identical
     * prominence, and §4.2 then wants the line under it at 40% of its size.
     * This heading sits in a ~384px modal panel at a fixed 1.6rem with body
     * copy at 1rem — the ratio works, but the panel has no room for the APR
     * without the heading wrapping to four lines. The compliant headline lives
     * in the financing section, where the lockup is built for it.
     */
    headline: 'Contact a dealer near you',
    /**
     * Offer-agnostic, because the form is not.
     *
     * It said "about the program and the models you're considering" when it was
     * reached only from the financing section. Every CTA on the page opens this
     * same dialog now — including the SH-9 and ES rebate sections, which have
     * no "program" — so the body names what comes back rather than which offer
     * sent them: the same "pricing and inventory" promise the lead-in above
     * each button makes.
     */
    body: "Send us a note and your nearest Authorized Kawai dealer will follow up with pricing and inventory for the models you're considering.",
    // §6 — the requirements name this label exactly.
    submitLabel: 'Submit',
    openLabel: CTA_LABEL,
    consent:
      'By submitting this form you agree to be contacted by your local Authorized Kawai dealer ' +
      'and to receive marketing communications from Kawai. You can unsubscribe at any time. ' +
      'Submitting this form is not an application for credit.',
    successTitle: 'Message received.',
    successBody:
      'Thanks — your local Authorized Kawai dealer will reach out with pricing and inventory for ' +
      'the models you had in mind.',
    /**
     * The way out. Without it the confirmation is a dead end and the corner X is
     * the only exit — see `successCta` in LeadCampaignCopy. The page has three
     * unrelated offers, so "the offers" is where a visitor who has asked about
     * one most plausibly goes next.
     */
    successCta: 'Back to the offers',
  },
}
