'use server'

/**
 * Signup offer lead → RSM email notification (Resend).
 *
 * When the /signup or /signup2 offer form is submitted, this action matches the
 * lead's ZIP / postal code to the nearest active brick-and-mortar dealer and
 * emails that dealer's Regional Sales Manager (`rsmEmail`, Dealers → Internal
 * tab) so the lead gets a human follow-up.
 *
 * Matching pipeline (all server-side — `rsmEmail` is access-restricted and must
 * never reach the browser):
 *   1. Geocode the ZIP/postal via the existing Nominatim proxy (US + CA).
 *   2. Load active dealers via the Local API (overrideAccess default, so the
 *      internal `rsmEmail` field is readable here and only here).
 *   3. Filter to RSM-managed storefronts: geocoded, same country as the lead,
 *      not e-commerce accounts, dealerType dealer/branch.
 *   4. Sort by haversine distance and walk the list until a dealer with an
 *      `rsmEmail` is found — RSMs are territorial, so the 2nd-nearest dealer's
 *      RSM is almost always the same person.
 *   5. Send via Resend with `replyTo` = the lead, an idempotency key so a
 *      double-fired submit can't email the RSM twice, and a `source` tag for
 *      dashboard filtering. Falls back to LEAD_NOTIFY_FALLBACK_EMAIL when no
 *      RSM (or no geocode) is found, so a lead is never silently dropped.
 *
 * Called fire-and-forget from the form's `onComplete` hook (alongside the
 * Shopify upsert): it never throws — HubSpot is the primary CRM and this
 * notification must never block or fail the submission the visitor sees.
 *
 * The email markup lives in `src/lib/rsm/lead-email.ts`, shared with the
 * internal test tool so the test renders the exact email an RSM receives.
 * Neither the `nearby` nor `test` option is passed here — production output is
 * unchanged.
 */

import { createHash } from 'node:crypto'
import { unstable_cache } from 'next/cache'
import { Resend } from 'resend'
import { getPayloadClient } from '@/lib/payload/queries'
import { geocodeZipCode } from '@/lib/utils/dealer-search'
import {
  classifyLeadCountry,
  getDealersForRsmRouting,
  rankRsmCandidates,
  findNearestRsm,
  type RsmMatch,
} from '@/lib/rsm/routing'
import {
  leadEmailSchema,
  buildLeadEmailHtml,
  buildLeadEmailSubject,
} from '@/lib/rsm/lead-email'

/**
 * CMS kill switch — "RSM Lead Notification Emails" checkbox in the Home Page
 * sidebar. Fails open (missing doc/field → enabled) so a fetch hiccup can't
 * silently pause lead routing. Short revalidate keeps toggle lag ≤ 5 min.
 */
const isRsmNotificationEnabled = unstable_cache(
  async (): Promise<boolean> => {
    try {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'home-page',
        select: { enableRsmLeadNotifications: true },
        depth: 0,
        limit: 1,
      })
      return result.docs[0]?.enableRsmLeadNotifications !== false
    } catch (err) {
      console.error('[notify-rsm] Failed to read feature flag — defaulting to enabled:', err)
      return true
    }
  },
  ['rsm-notification-flag'],
  { tags: ['home-page'], revalidate: 300 },
)

/**
 * Match a signup lead to the nearest dealer's RSM and email them via Resend.
 *
 * @param values - Raw form values (same shape the Shopify mirror receives).
 * @param source - Page identifier for the Resend tag + email footer (e.g. 'signup').
 * @returns `{ success }` — never rejects; failures are logged and swallowed.
 *          Intentionally returns no dealer/RSM data (internal-only fields).
 */
export async function notifyRsmOfLead(
  values: Record<string, string>,
  source: string = 'signup',
): Promise<{ success: boolean }> {
  try {
    const apiKey = process.env.RESEND_API_KEY
    const fromAddress = process.env.RESEND_FROM_EMAIL
    if (!apiKey || !fromAddress) {
      console.error('[notify-rsm] RESEND_API_KEY / RESEND_FROM_EMAIL not configured — skipping')
      return { success: false }
    }

    if (!(await isRsmNotificationEnabled())) {
      console.log('[notify-rsm] Disabled via Home Page CMS toggle — skipping')
      return { success: false }
    }

    const parsed = leadEmailSchema.safeParse(values)
    if (!parsed.success) {
      console.error('[notify-rsm] Invalid lead payload:', parsed.error.issues)
      return { success: false }
    }
    const lead = parsed.data

    // Match: geocode → nearest same-country RSM-managed dealer with an rsmEmail.
    let match: RsmMatch | null = null
    const coords = await geocodeZipCode(lead.zip)
    if (coords) {
      const dealers = await getDealersForRsmRouting()
      match = findNearestRsm(rankRsmCandidates(dealers, coords, classifyLeadCountry(lead.zip)))
    } else {
      console.warn(`[notify-rsm] Could not geocode "${lead.zip}" — using fallback inbox`)
    }

    const fallback = process.env.LEAD_NOTIFY_FALLBACK_EMAIL ?? fromAddress
    const to = match?.rsmEmail ?? fallback

    const resend = new Resend(apiKey)
    const { data, error } = await resend.emails.send(
      {
        from: fromAddress,
        to: [to],
        ...(match ? { bcc: [fallback] } : {}),
        replyTo: lead.email,
        subject: buildLeadEmailSubject({ lead, match }),
        html: buildLeadEmailHtml({ lead, match, source }),
        tags: [{ name: 'source', value: source.replace(/[^A-Za-z0-9_-]/g, '_') }],
      },
      {
        // One notification per lead+zip per 24h — a double-fired onComplete
        // (double click, React strict mode) can't email the RSM twice.
        idempotencyKey: `rsm-lead/${createHash('sha256').update(`${lead.email}|${lead.zip}`).digest('hex')}`,
      },
    )

    if (error) {
      console.error('[notify-rsm] Resend error:', error)
      return { success: false }
    }

    console.log(
      `[notify-rsm] Lead notification sent (${data?.id}) — ${match ? `dealer ${match.dealer.slug}` : 'fallback inbox'}`,
    )
    return { success: true }
  } catch (err) {
    // Fire-and-forget contract: log, never throw — the visitor-facing HubSpot
    // submission must not be affected by a notification failure.
    console.error('[notify-rsm] Failed:', err)
    return { success: false }
  }
}
