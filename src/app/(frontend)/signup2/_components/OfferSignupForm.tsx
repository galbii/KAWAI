'use client'

import { BrandEyebrow } from './brand-ui'
import { offerCopy, hubspotSignupForm } from './scenes'
import { TwoStepHubSpotForm } from '@/components/forms/TwoStepHubSpotForm'
import { upsertSignupLeadToShopify } from '@/lib/actions/signup-lead-shopify'
import { notifyRsmOfLead } from '@/lib/actions/notify-rsm-of-lead'

/** Source/campaign tags applied to the Shopify customer for this page. */
const SHOPIFY_LEAD_TAGS = ['signup2', 'summer-savings']

/** Identifies this page in the RSM notification email + Resend dashboard tag. */
const LEAD_SOURCE = 'signup2'

/**
 * The dealer-discount sign-up content: offer copy + the reusable HubSpot
 * prefill form + consent line. Renders only the *content* (no surface), so each
 * caller supplies its own container — the hero/fallback wrap it in a pearl card,
 * the OfferModal renders it inside the dialog. Single source of truth for the
 * offer form across every placement on the page.
 *
 * On submit the lead goes to HubSpot (primary CRM) and is additionally mirrored
 * into Shopify via `onComplete` — fire-and-forget so a Shopify hiccup can never
 * block or fail the HubSpot submission the visitor is waiting on.
 */
export function OfferSignupForm() {
  return (
    <div>
      <BrandEyebrow className="text-kawai-red/80">{offerCopy.eyebrow}</BrandEyebrow>
      <h2 className="mt-4 font-[family-name:var(--font-brand-serif)] text-[clamp(1.5rem,3vw,2rem)] font-light leading-[1.1] tracking-tight text-kawai-black">
        {offerCopy.headline}
      </h2>
      <p className="mt-3 mb-6 text-sm leading-relaxed text-kawai-charcoal">{offerCopy.body}</p>

      <TwoStepHubSpotForm
        form={hubspotSignupForm}
        submitLabel={offerCopy.submitLabel}
        onComplete={(data) => {
          void upsertSignupLeadToShopify(data, SHOPIFY_LEAD_TAGS).catch(() => {})
          // Route the lead to the nearest dealer's Regional Sales Manager.
          void notifyRsmOfLead(data, LEAD_SOURCE).catch(() => {})
        }}
      />

      <p className="pt-4 text-center text-[11px] leading-relaxed text-kawai-charcoal/60">
        By submitting this form you agree to be contacted by your local Authorized Kawai
        dealer and to receive marketing communications from Kawai. You can unsubscribe at
        any time.
      </p>
    </div>
  )
}
