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
 */

import { createHash } from 'node:crypto'
import { z } from 'zod'
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

const leadSchema = z.object({
  firstname: z.string().trim().optional(),
  lastname: z.string().trim().optional(),
  email: z.string().email(),
  phone: z.string().trim().optional(),
  zip: z.string().trim().min(3).max(10),
  piano_type: z.string().trim().optional(),
  when_are_you_looking_to_purchase_: z.string().trim().optional(),
})

type LeadValues = z.infer<typeof leadSchema>

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

/** Escape user-supplied strings before interpolating into email HTML. */
function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function detailRow(label: string, value: string | undefined): string {
  if (!value) return ''
  return `
    <tr>
      <td style="padding:6px 16px 6px 0;color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;white-space:nowrap;vertical-align:top">${label}</td>
      <td style="padding:6px 0;color:#1E1B16;font-size:14px">${escapeHtml(value)}</td>
    </tr>`
}

function buildEmailHtml(lead: LeadValues, match: RsmMatch | null, source: string): string {
  const name = [lead.firstname, lead.lastname].filter(Boolean).join(' ')

  const dealerSection = match
    ? `
      <p style="margin:20px 0 8px;font-weight:700;font-size:14px">Matched dealer (nearest to lead)</p>
      <table style="border-collapse:collapse">
        ${detailRow('Dealer', match.dealer.dealerName)}
        ${detailRow(
          'Location',
          [match.dealer.address?.city, match.dealer.address?.state].filter(Boolean).join(', '),
        )}
        ${detailRow('Distance', `${Math.round(match.distance * 10) / 10} miles from lead`)}
        ${detailRow('Territory', match.dealer.region ?? undefined)}
      </table>`
    : `
      <p style="margin:20px 0 0;color:#b45309;font-size:13px">
        ⚠️ No RSM-managed dealer could be matched to this ZIP/postal code —
        routed to the fallback inbox. Please forward to the right RSM.
      </p>`

  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family:'Helvetica Neue',Arial,sans-serif;background:#FAF8F5;padding:40px 20px;color:#1E1B16">
        <div style="max-width:520px;margin:0 auto;background:#fff;border:1px solid #DBDBDB;border-radius:8px;overflow:hidden">
          <div style="background:#1E1B16;padding:24px 32px">
            <p style="margin:0;color:#E11922;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase">New Sales Lead</p>
            <h1 style="margin:6px 0 0;color:#fff;font-size:20px;font-weight:700">Dealer Discount Signup</h1>
          </div>
          <div style="padding:28px 32px;font-size:14px;line-height:1.6">
            <p style="margin:0 0 16px">A visitor signed up for the dealer discount offer and is waiting to hear from their local Kawai dealer.</p>
            <table style="border-collapse:collapse">
              ${detailRow('Name', name || undefined)}
              ${detailRow('Email', lead.email)}
              ${detailRow('Phone', lead.phone)}
              ${detailRow('ZIP / Postal', lead.zip)}
              ${detailRow('Shopping for', lead.piano_type?.replaceAll(';', ', '))}
              ${detailRow('Timeframe', lead.when_are_you_looking_to_purchase_?.replaceAll('_', ' '))}
            </table>
            ${dealerSection}
            <p style="margin:24px 0 0;color:#6b7280;font-size:12px">
              Source: ${escapeHtml(source)} · Reply to this email to reach the lead directly.
            </p>
          </div>
        </div>
      </body>
    </html>`
}

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

    const parsed = leadSchema.safeParse(values)
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
        subject: match
          ? `New Kawai lead near ${match.dealer.address?.city ?? lead.zip} — ${lead.zip}`
          : `New Kawai lead — ${lead.zip} (unmatched)`,
        html: buildEmailHtml(lead, match, source),
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
