'use client'

import { BrandEyebrow } from './brand-ui'
import { offerCopy, hubspotSignupForm } from './scenes'
import { useOfferModal } from './OfferModalContext'
import { TwoStepHubSpotForm } from '@/components/forms/TwoStepHubSpotForm'
import { upsertSignupLeadToShopify } from '@/lib/actions/signup-lead-shopify'

/** Source/campaign tags applied to the Shopify customer for this page. */
const SHOPIFY_LEAD_TAGS = ['signup3', 'summer-savings']

/**
 * The dealer-discount sign-up content: offer copy + the reusable HubSpot
 * prefill form + consent line. Renders only the *content* (no surface), so each
 * caller supplies its own container — the hero/fallback wrap it in a pearl card,
 * the OfferModal renders it inside the dialog. Single source of truth for the
 * offer form across every placement on the page.
 *
 * How /signup3 differs from /signup:
 *
 *   - On success the submission is handed up to OfferModalProvider, which opens
 *     the dealer picker and defers the RSM notification until the visitor
 *     answers so it can carry their choice. The provider owns that, not this
 *     component — this one is unmounted when the offer modal closes, so it must
 *     not own anything the lead depends on.
 *   - In test mode (SIGNUP3_TEST_MODE) nothing is written to HubSpot or
 *     Shopify, so the full flow can be exercised without junk in the CRM. Lead
 *     routing still runs, held or redirected by the LEAD_NOTIFY_* switches.
 */
export function OfferSignupForm() {
  const { testMode, captureLead, confirmLead } = useOfferModal()

  return (
    <div>
      {testMode && (
        <p className="mb-4 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-[12px] leading-relaxed text-amber-900">
          <strong className="font-bold uppercase tracking-[0.08em]">Test mode</strong> — this form
          writes nothing to HubSpot or Shopify. Lead routing still runs so the dealer picker and
          notification emails can be verified end to end.
        </p>
      )}

      <BrandEyebrow className="text-kawai-red/80">{offerCopy.eyebrow}</BrandEyebrow>
      <h2 className="mt-4 font-[family-name:var(--font-brand-serif)] text-[clamp(1.5rem,3vw,2rem)] font-light leading-[1.1] tracking-tight text-kawai-black">
        {offerCopy.headline}
      </h2>
      <p className="mt-3 mb-6 text-sm leading-relaxed text-kawai-charcoal">{offerCopy.body}</p>

      <TwoStepHubSpotForm
        form={hubspotSignupForm}
        submitLabel={offerCopy.submitLabel}
        skipSubmit={testMode}
        onComplete={(data) => {
          if (!testMode) {
            void upsertSignupLeadToShopify(data, SHOPIFY_LEAD_TAGS).catch(() => {})
          }
          // Handed up on `onComplete` rather than `onSubmitted` so the
          // nearby-dealer lookup runs while HubSpot is still submitting — by the
          // time the confirmation appears the picker has its list and opens
          // instantly.
          captureLead(data)
        }}
        onSubmitted={confirmLead}
      />

      <p className="pt-4 text-center text-[11px] leading-relaxed text-kawai-charcoal/60">
        By submitting this form you agree to be contacted by your local Authorized Kawai
        dealer and to receive marketing communications from Kawai. You can unsubscribe at
        any time.
      </p>
    </div>
  )
}
