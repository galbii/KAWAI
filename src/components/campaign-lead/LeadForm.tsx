'use client'

import { useMemo, useRef, useState } from 'react'
import { TwoStepHubSpotForm, type PreFormValues } from '@/components/forms/TwoStepHubSpotForm'
import { upsertSignupLeadToShopify } from '@/lib/actions/signup-lead-shopify'
import { routedHubSpotSubmit } from '@/lib/hubspot/routed-submit'
import { useLeadCampaign } from './LeadCampaignContext'
import { NearestShowroomCard } from './NearestShowroomCard'

/**
 * The campaign's lead form: heading, the shared HubSpot form, consent line.
 *
 * Content only — no surface, no width. Every caller supplies its own container,
 * because the same form appears inside the modal dialog and (on some pages)
 * inline in a section card, and the two need different padding. That is what
 * keeps one form definition serving every placement on a page.
 *
 * HubSpot is the primary CRM. It is submitted through the server
 * (`routedHubSpotSubmit`, kawai-lead-rsm-holiday v2) so the lead's owner — the
 * RSM the ZIP routes to, or the store on a store page — lands in HubSpot's
 * hidden `rsm` field without ever reaching the browser; if the server path
 * fails, the browser submits as before. Once that submit settles (success or
 * not), the Shopify mirror (which adds the same owner as an `rsm-*` tag) and
 * the RSM notification fire, fire-and-forget, so neither can block or fail
 * the submission the visitor is waiting on — and the routing lookups they
 * share are already warm. Routing to the dealer's RSM is handed UP to the
 * provider rather than fired here — see the note in LeadCampaignContext for
 * why this component must not own anything the lead depends on.
 */
export function LeadForm() {
  const { config, testMode, captureLead, confirmLead, close } = useLeadCampaign()
  const { copy } = config
  // The ZIP just submitted, for the nearest-showroom card on the confirmation.
  const [submittedZip, setSubmittedZip] = useState<string | null>(null)
  // The values the visitor just completed, for the follow-ups once HubSpot settles.
  const pendingRef = useRef<PreFormValues | null>(null)
  const storeSlug = config.storeSlug
  const routedSubmit = useMemo(() => routedHubSpotSubmit(storeSlug ? { storeSlug } : {}), [storeSlug])

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
        submit={async (form, fields, options) => {
          try {
            await routedSubmit(form, fields, options)
          } finally {
            // After the HubSpot submit settles, not on the confirmation: this
            // runs even if the visitor closes the modal mid-submit, and on a
            // HubSpot error too (as before, when these fired on onComplete).
            const data = pendingRef.current
            if (data) {
              void upsertSignupLeadToShopify(data, [...config.shopifyTags], storeSlug ? { storeSlug } : {}).catch(
                () => {},
              )
              captureLead(data)
            }
          }
        }}
        onComplete={(data) => {
          pendingRef.current = data
          // Test mode submits nothing (no `submit` call), so routing starts
          // here: it is what a staging run must exercise, and the
          // LEAD_NOTIFY_* switches hold or redirect the mail. No Shopify write.
          if (testMode) captureLead(data)
        }}
        onSubmitted={(data) => {
          setSubmittedZip(data.zip ?? null)
          confirmLead()
        }}
        successActions={
          <div className="flex flex-col items-center gap-6">
            {/* Renders nothing unless an official Kawai showroom covers the ZIP. */}
            <NearestShowroomCard zip={submittedZip} source={config.source} />
            {copy.successCta && (
              // Outlined, not filled: the visitor has finished converting and
              // this is a way out, not a second ask.
              <button
                type="button"
                onClick={close}
                className="inline-flex items-center justify-center border border-kawai-black/25 px-6 py-3 font-[family-name:var(--font-brand-sans)] text-sm font-semibold uppercase tracking-[0.12em] text-kawai-charcoal transition-colors duration-200 hover:border-kawai-black/40 hover:text-kawai-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kawai-red focus-visible:ring-offset-2"
              >
                {copy.successCta}
              </button>
            )}
          </div>
        }
      />

      <p className="pt-4 text-center text-[11px] leading-relaxed text-kawai-charcoal/60">
        {copy.consent}
      </p>
    </div>
  )
}
