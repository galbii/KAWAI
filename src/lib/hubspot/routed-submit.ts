import { submitLeadToHubSpot } from '@/lib/actions/submit-lead-hubspot'
import type { ServerHubSpotSubmitResult } from '@/lib/hubspot/server-submit'
import {
  getHubspotUtk,
  submitHubSpotForm,
  type HubSpotField,
  type HubSpotFormConfig,
  type HubSpotSubmitOptions,
} from '@/lib/hubspot/forms'

/**
 * A drop-in for `submitHubSpotForm` that submits through the server, so the
 * lead's owner (RSM) is added to HubSpot's hidden `rsm` field without the
 * browser ever seeing it (kawai-lead-rsm-holiday v2, Nov 25, 2026).
 *
 * Client-side. Same contract as `submitHubSpotForm`: resolves on success,
 * throws HubSpot's message on a validation error. When the server path can't
 * do it (the action failed to reach the server, HubSpot was down or slow, the
 * form isn't allow-listed), it falls back to `submitHubSpotForm` from the
 * browser — today's submission, without `rsm` — so a lead is never lost.
 *
 * The browser's own context rides along: the `hubspotutk` cookie and the page
 * URL (UTMs), exactly what the browser path sends.
 */
export type HubSpotSubmit = (
  form: HubSpotFormConfig,
  fields: HubSpotField[],
  options?: HubSpotSubmitOptions,
) => Promise<void>

export function routedHubSpotSubmit(
  { storeSlug }: { storeSlug?: string | undefined } = {},
  {
    serverSubmit = submitLeadToHubSpot,
    browserSubmit = submitHubSpotForm,
  }: {
    serverSubmit?: (input: unknown) => Promise<ServerHubSpotSubmitResult>
    browserSubmit?: HubSpotSubmit
  } = {},
): HubSpotSubmit {
  return async (form, fields, options = {}) => {
    let result: ServerHubSpotSubmitResult
    try {
      const hutk = getHubspotUtk()
      result = await serverSubmit({
        form: { portalId: form.portalId, formGuid: form.formGuid },
        fields,
        ...(options.pageName ? { pageName: options.pageName } : {}),
        ...(typeof window !== 'undefined' ? { pageUri: window.location.href } : {}),
        ...(hutk ? { hutk } : {}),
        ...(options.consent ? { consentText: options.consent.text } : {}),
        ...(storeSlug ? { storeSlug } : {}),
      })
    } catch (err) {
      console.warn('[hubspot] Server submit unavailable — submitting from the browser:', err)
      result = { ok: false, retryInBrowser: true }
    }

    if (result?.ok) return
    if (!result || result.retryInBrowser) {
      await browserSubmit(form, fields, options)
      return
    }
    throw new Error(result.error)
  }
}
