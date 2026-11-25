/**
 * Server-side HubSpot Forms API v3 submit, with the lead's owner in the hidden
 * `rsm` field (kawai-lead-rsm-holiday v2, Nov 25, 2026). The user: "when an
 * rsm is decided in the territory ... we also save the rsm to the field ... in
 * hubspot" — the Find a Dealer form (portal 21987263, form 6a40df6b…) has a
 * hidden text field, internal name `rsm`.
 *
 * Why server-side: the owner comes from routing on access-restricted data
 * (`rsmEmail`), and RSM names/addresses must never reach the browser. So the
 * browser hands the submission here; this resolves the owner, adds `rsm`, and
 * POSTs to the same public endpoint the browser used (no token needed).
 *
 * The lead must never be lost to this:
 *   - Owner lookup has a short budget (OWNER_LOOKUP_BUDGET_MS). Slow or failed
 *     → submit without `rsm`.
 *   - HubSpot rejects `rsm` (400 naming it) → retry once without it.
 *   - Network error, timeout, 429 or 5xx → `retryInBrowser`: the browser
 *     submits exactly as before (no `rsm`).
 *   - Any other 4xx (a real validation error) → `error`, shown to the visitor
 *     as today so they can fix and resubmit.
 *
 * Pure apart from the injected `fetch` and owner resolver: the server action
 * (src/lib/actions/submit-lead-hubspot.ts) wires the real ones; tests pass
 * fakes. Returns no owner data.
 */
import { z } from 'zod'

/** Forms this path may submit to. Anything else stays on the browser path. */
export const ROUTED_HUBSPOT_FORMS: ReadonlyArray<{ portalId: string; formGuid: string }> = [
  // Find a Dealer — /fall-financing, /holiday-sale-event (national + stores), /black-friday.
  { portalId: '21987263', formGuid: '6a40df6b-d339-413c-8f62-d6e8324f3959' },
]

/** The HubSpot hidden field's internal name. */
export const RSM_FIELD = 'rsm'
export const OWNER_LOOKUP_BUDGET_MS = 2000
export const HUBSPOT_TIMEOUT_MS = 8000

const inputSchema = z.object({
  form: z.object({
    portalId: z.string().regex(/^\d{1,20}$/),
    formGuid: z.string().regex(/^[0-9a-f-]{36}$/i),
  }),
  fields: z
    .array(
      z.object({
        name: z.string().regex(/^[A-Za-z0-9_]{1,100}$/),
        value: z.string().max(5000),
      }),
    )
    .max(40),
  pageName: z.string().max(200).optional(),
  pageUri: z.string().max(2000).optional(),
  hutk: z.string().max(200).optional(),
  consentText: z.string().max(2000).optional(),
  storeSlug: z.string().max(100).optional(),
})

export type ServerHubSpotSubmitInput = z.input<typeof inputSchema>

export type ServerHubSpotSubmitResult =
  | { ok: true }
  | { ok: false; retryInBrowser: true }
  | { ok: false; retryInBrowser: false; error: string }

export interface ServerHubSpotSubmitDeps {
  /** The lead owner's label for `rsm`, or null. May be slow; it is budgeted. */
  resolveOwnerLabel: (zip: string, options: { storeSlug?: string | undefined }) => Promise<string | null>
  fetch: typeof fetch
  /** The visitor's IP for HubSpot `context.ipAddress` (analytics), when known. */
  ipAddress?: string | null | undefined
  budgetMs?: number
  timeoutMs?: number
}

const RETRY_IN_BROWSER = { ok: false, retryInBrowser: true } as const

/** Resolve within `ms`, else null. Never rejects. */
async function within<T>(promise: Promise<T>, ms: number): Promise<T | null> {
  let timer: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<null>((resolve) => {
    timer = setTimeout(() => resolve(null), ms)
  })
  try {
    return await Promise.race([promise.catch(() => null), timeout])
  } finally {
    if (timer) clearTimeout(timer)
  }
}

interface HubSpotErrorBody {
  message?: string
  errors?: Array<{ message?: string; errorType?: string }>
}

async function readError(res: Response): Promise<{ detail: string; raw: string }> {
  try {
    const raw = await res.text()
    try {
      const data = JSON.parse(raw) as HubSpotErrorBody
      return { detail: data?.errors?.[0]?.message ?? data?.message ?? '', raw }
    } catch {
      return { detail: '', raw }
    }
  } catch {
    return { detail: '', raw: '' }
  }
}

export async function submitLeadServerSide(
  rawInput: unknown,
  deps: ServerHubSpotSubmitDeps,
): Promise<ServerHubSpotSubmitResult> {
  const parsed = inputSchema.safeParse(rawInput)
  if (!parsed.success) {
    console.warn('[hubspot-server-submit] Unexpected input — browser submits instead:', parsed.error.issues)
    return RETRY_IN_BROWSER
  }
  const input = parsed.data
  const allowed = ROUTED_HUBSPOT_FORMS.some(
    (f) => f.portalId === input.form.portalId && f.formGuid.toLowerCase() === input.form.formGuid.toLowerCase(),
  )
  if (!allowed) return RETRY_IN_BROWSER

  // The browser never sets `rsm`: drop any it sent, and blanks (as the browser path does).
  const fields = input.fields.filter((f) => f.name !== RSM_FIELD && f.value !== '')
  const zip = fields.find((f) => f.name === 'zip')?.value.trim() ?? ''

  let label: string | null = null
  if (zip || input.storeSlug) {
    label = await within(
      deps.resolveOwnerLabel(zip, { storeSlug: input.storeSlug }),
      deps.budgetMs ?? OWNER_LOOKUP_BUDGET_MS,
    )
    if (label === null) {
      console.warn('[hubspot-server-submit] Lead owner not resolved in time — submitting without rsm')
    }
  }
  label = label?.trim().slice(0, 255) || null

  const endpoint = `https://api.hsforms.com/submissions/v3/integration/submit/${input.form.portalId}/${input.form.formGuid}`
  const context = {
    ...(input.hutk ? { hutk: input.hutk } : {}),
    ...(input.pageUri ? { pageUri: input.pageUri } : {}),
    ...(input.pageName ? { pageName: input.pageName } : {}),
    ...(deps.ipAddress ? { ipAddress: deps.ipAddress } : {}),
  }

  const post = async (withRsm: boolean): Promise<Response | null> => {
    const body: Record<string, unknown> = {
      fields: withRsm && label ? [...fields, { name: RSM_FIELD, value: label }] : fields,
      context,
    }
    if (input.consentText) {
      body.legalConsentOptions = { consent: { consentToProcess: true, text: input.consentText } }
    }
    try {
      return await deps.fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(deps.timeoutMs ?? HUBSPOT_TIMEOUT_MS),
        cache: 'no-store',
      })
    } catch (err) {
      console.error('[hubspot-server-submit] HubSpot request failed — browser submits instead:', err)
      return null
    }
  }

  let res = await post(true)
  if (!res) return RETRY_IN_BROWSER
  if (res.ok) return { ok: true }

  let error = await readError(res)
  if (label && res.status === 400 && /\brsm\b/i.test(`${error.detail} ${error.raw}`)) {
    console.error('[hubspot-server-submit] HubSpot rejected the rsm field — retrying without it:', error.detail || error.raw)
    res = await post(false)
    if (!res) return RETRY_IN_BROWSER
    if (res.ok) return { ok: true }
    error = await readError(res)
  }

  if (res.status === 429 || res.status >= 500) {
    console.error(`[hubspot-server-submit] HubSpot ${res.status} — browser submits instead`)
    return RETRY_IN_BROWSER
  }
  return { ok: false, retryInBrowser: false, error: error.detail || `HubSpot submission failed (${res.status})` }
}
