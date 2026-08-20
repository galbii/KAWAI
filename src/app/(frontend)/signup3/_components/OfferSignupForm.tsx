'use client'

import { useState } from 'react'
import { BrandEyebrow } from './brand-ui'
import { offerCopy, hubspotSignupForm } from './scenes'
import { useOfferModal } from './OfferModalContext'
import { PostSignupDealerPicker } from './PostSignupDealerPicker'
import { TwoStepHubSpotForm, type PreFormValues } from '@/components/forms/TwoStepHubSpotForm'
import { upsertSignupLeadToShopify } from '@/lib/actions/signup-lead-shopify'

/** Source/campaign tags applied to the Shopify customer for this page. */
const SHOPIFY_LEAD_TAGS = ['signup3', 'summer-savings']

/** Identifies this page in the RSM notification email + Resend dashboard tag. */
const LEAD_SOURCE = 'signup3'

/**
 * The dealer-discount sign-up content: offer copy + the reusable HubSpot
 * prefill form + consent line. Renders only the *content* (no surface), so each
 * caller supplies its own container — the hero/fallback wrap it in a pearl card,
 * the OfferModal renders it inside the dialog. Single source of truth for the
 * offer form across every placement on the page.
 *
 * How /signup3 differs from /signup and /signup2:
 *
 *   - On success it opens the dealer picker, and the RSM notification is
 *     deferred until the visitor answers so it can carry their choice. See
 *     {@link PostSignupDealerPicker} for the guarantees around never losing a
 *     lead while that question is on screen.
 *   - In test mode (SIGNUP3_TEST_MODE) nothing is written to HubSpot or
 *     Shopify, so the full flow can be exercised without junk in the CRM. Lead
 *     routing still runs, held or redirected by the LEAD_NOTIFY_* switches.
 */
export function OfferSignupForm() {
  const { testMode } = useOfferModal()
  const [lead, setLead] = useState<PreFormValues | null>(null)
  const [confirmed, setConfirmed] = useState(false)

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
          // Captured here rather than on `onSubmitted` so the nearby-dealer
          // lookup runs while HubSpot is still submitting — by the time the
          // confirmation appears the picker has its list and opens instantly.
          setLead(data)
        }}
        onSubmitted={() => setConfirmed(true)}
      />

      {lead && (
        <PostSignupDealerPicker lead={lead} source={LEAD_SOURCE} armed={confirmed} />
      )}

      <p className="pt-4 text-center text-[11px] leading-relaxed text-kawai-charcoal/60">
        By submitting this form you agree to be contacted by your local Authorized Kawai
        dealer and to receive marketing communications from Kawai. You can unsubscribe at
        any time.
      </p>
    </div>
  )
}
