/**
 * Client-side submission to HubSpot's public Forms API (v3 integration submit).
 *
 * This is the same endpoint HubSpot's own embed uses, so no auth is required. We
 * call it directly from our native, Kawai-styled form instead of embedding a
 * cross-origin HubSpot iframe — which means the submission happens in *our* page
 * context, so we can (a) read the `hubspotutk` tracking cookie for lead
 * attribution and (b) fire a GTM `dataLayer` event the moment it succeeds. A
 * cross-origin share-link iframe allows neither.
 *
 * Endpoint: POST https://api.hsforms.com/submissions/v3/integration/submit/{portalId}/{formGuid}
 * Docs: https://developers.hubspot.com/docs/reference/api/marketing/forms
 */

export type HubSpotFormConfig = {
  /** Numeric HubSpot portal (account) id, e.g. '21987263'. */
  portalId: string
  /** The form's GUID — the `data-form-id` UUID in HubSpot's embed code. */
  formGuid: string
}

export type HubSpotField = { name: string; value: string }

/** GDPR consent block — only send when the HubSpot form has consent enabled. */
export type HubSpotConsent = { consentToProcess: boolean; text: string }

type SubmitOptions = {
  /** Passed through as HubSpot `context.pageName`. */
  pageName?: string
  consent?: HubSpotConsent
}

/** Read HubSpot's visitor-tracking cookie so the lead ties to the tracked session. */
function getHubspotUtk(): string | undefined {
  if (typeof document === 'undefined') return undefined
  const match = document.cookie.match(/(?:^|;\s*)hubspotutk=([^;]+)/)
  return match?.[1]
}

/**
 * Submit collected field values to a HubSpot form. Resolves on success; throws
 * with HubSpot's error message (when available) on failure so the caller can
 * surface it and let the visitor retry.
 */
export async function submitHubSpotForm(
  { portalId, formGuid }: HubSpotFormConfig,
  fields: HubSpotField[],
  options: SubmitOptions = {},
): Promise<void> {
  if (!formGuid) {
    throw new Error('HubSpot form GUID is not configured.')
  }

  const endpoint = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formGuid}`
  const hutk = getHubspotUtk()

  const body: Record<string, unknown> = {
    fields: fields.filter((f) => f.value !== '' && f.value != null),
    context: {
      ...(hutk ? { hutk } : {}),
      ...(typeof window !== 'undefined' ? { pageUri: window.location.href } : {}),
      ...(options.pageName ? { pageName: options.pageName } : {}),
    },
  }
  if (options.consent) {
    body.legalConsentOptions = { consent: options.consent }
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    let detail = ''
    try {
      const data = (await res.json()) as { message?: string; errors?: Array<{ message?: string }> }
      detail = data?.errors?.[0]?.message ?? data?.message ?? ''
    } catch {
      /* non-JSON error body — fall back to the status code */
    }
    throw new Error(detail || `HubSpot submission failed (${res.status})`)
  }
}
