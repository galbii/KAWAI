'use client'

import { BrandEyebrow } from './brand-ui'
import { offerCopy, hubspotSignupForm } from './scenes'
import { TwoStepHubSpotForm } from '@/components/forms/TwoStepHubSpotForm'

/**
 * The dealer-discount sign-up content: offer copy + the reusable HubSpot
 * prefill form + consent line. Renders only the *content* (no surface), so each
 * caller supplies its own container — the hero/fallback wrap it in a pearl card,
 * the OfferModal renders it inside the dialog. Single source of truth for the
 * offer form across every placement on the page.
 */
export function OfferSignupForm() {
  return (
    <div>
      <BrandEyebrow className="text-kawai-red/80">{offerCopy.eyebrow}</BrandEyebrow>
      <h2 className="mt-4 font-[family-name:var(--font-brand-serif)] text-[clamp(1.5rem,3vw,2rem)] font-light leading-[1.1] tracking-tight text-kawai-black">
        {offerCopy.headline}
      </h2>
      <p className="mt-3 mb-6 text-sm leading-relaxed text-kawai-charcoal">{offerCopy.body}</p>

      <TwoStepHubSpotForm form={hubspotSignupForm} submitLabel={offerCopy.submitLabel} />

      <p className="pt-4 text-center text-[11px] leading-relaxed text-kawai-charcoal/60">
        By signing up you agree to be contacted by your local Authorized Kawai dealer.
      </p>
    </div>
  )
}
