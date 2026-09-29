'use client'

import { TwoStepHubSpotForm } from '@/components/forms/TwoStepHubSpotForm'
import { upsertSignupLeadToShopify } from '@/lib/actions/signup-lead-shopify'
import { useLeadCampaign } from './LeadCampaignContext'

/**
 * The campaign's lead form: heading, the shared HubSpot form, consent line.
 *
 * Content only — no surface, no width. Every caller supplies its own container,
 * because the same form appears inside the modal dialog and (on some pages)
 * inline in a section card, and the two need different padding. That is what
 * keeps one form definition serving every placement on a page.
 *
 * HubSpot is the primary CRM; the Shopify mirror is fire-and-forget on
 * `onComplete` so a Shopify hiccup can never block or fail the submission the
 * visitor is waiting on. Routing to the dealer's RSM is handed UP to the
 * provider rather than fired here — see the note in LeadCampaignContext for why
 * this component must not own anything the lead depends on.
 */
export function LeadForm() {
  const { config, testMode, captureLead, confirmLead } = useLeadCampaign()
  const { copy } = config

  return (
    <div>
      {testMode && (
        <p className="mb-4 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-[12px] leading-relaxed text-amber-900">
          <strong className="font-bold uppercase tracking-[0.08em]">Test mode</strong> — this form
          writes nothing to HubSpot or Shopify. Lead routing still runs so the notification emails
          can be verified end to end.
        </p>
      )}

      {/* Self-contained styling, deliberately.
          
          This used to borrow the Back to School campaign's `bts-*` classes,
          which meant the form only rendered correctly on a page that happened
          to have loaded that campaign's stylesheet — and rendered unstyled
          anywhere else, silently. A shared component cannot depend on a
          stylesheet it does not itself load. Everything here is Tailwind and
          brand tokens, so the form looks the same wherever it is mounted.

          pr-10 keeps the header clear of the modal's close button, which is
          pinned to the same top-right corner. */}
      <p className="mb-3 pr-10 text-sm font-medium text-kawai-red">{copy.eyebrow}</p>

      {/* A fixed size, not a viewport clamp: the modal panel is ~384px wide
          whatever the viewport is, so a vw-scaled heading only ever overshoots. */}
      <h2 className="pr-10 text-[1.6rem] font-semibold leading-[1.15] tracking-[-0.02em] text-kawai-black">
        {copy.headline}
      </h2>

      <p className="mb-6 mt-3 text-[1rem] leading-relaxed text-kawai-charcoal/75">{copy.body}</p>

      <TwoStepHubSpotForm
        form={config.hubspotForm}
        {...(config.fields ? { fields: config.fields } : {})}
        formName={config.formName}
        submitLabel={copy.submitLabel}
        successTitle={copy.successTitle}
        successBody={copy.successBody}
        skipSubmit={testMode}
        onComplete={(data) => {
          if (!testMode) {
            void upsertSignupLeadToShopify(data, [...config.shopifyTags]).catch(() => {})
          }
          // Handed up on `onComplete` rather than `onSubmitted` so routing starts
          // while HubSpot is still submitting instead of after the confirmation.
          captureLead(data)
        }}
        onSubmitted={confirmLead}
      />

      <p className="pt-4 text-center text-[11px] leading-relaxed text-kawai-charcoal/60">
        {copy.consent}
      </p>
    </div>
  )
}
