import { FALL_2026 } from '@/lib/financing/terms'
import type { LeadCampaignConfig } from '@/components/campaign-lead'
import { EnvelopeIcon, MapPinIcon, PhoneIcon, UserIcon } from '@heroicons/react/24/outline'
import { INTRO_APR, hero } from './campaign'

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
    {
      name: 'message',
      label: 'How can we help?',
      type: 'textarea',
      placeholder: 'Tell us which model you have in mind, or what you would like to know.',
      rows: 3,
      hubspotName: 'message',
    },
  ],
  copy: {
    eyebrow: 'Limited Time',
    headline: `${INTRO_APR} for ${FALL_2026.introMonths} months`,
    body: "Send us a note and your nearest Authorized Kawai dealer will follow up about the program and the models you're considering.",
    submitLabel: 'Send My Question',
    openLabel: hero.cta,
    consent:
      'By submitting this form you agree to be contacted by your local Authorized Kawai dealer ' +
      'and to receive marketing communications from Kawai. You can unsubscribe at any time. ' +
      'Submitting this form is not an application for credit.',
    successTitle: 'Message received.',
    successBody:
      'Thanks — your local Authorized Kawai dealer will reach out about the financing program and ' +
      'the models you had in mind.',
  },
}
