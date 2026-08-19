/**
 * RSM lead notification email — shared template.
 *
 * Single source of truth for the "New Sales Lead" email so the internal test
 * tool (/zipcodetest2026kawaiamerica) renders the *exact* markup an RSM
 * receives in production. If this template and the test diverged, the test
 * would validate nothing.
 *
 * Two optional additions are used by the test tool only, so the production
 * email an RSM receives is byte-identical to what it was before extraction:
 *   - `nearby` — the N-nearest-dealer table.
 *   - `test`   — the TEST banner + "in production this would have gone to X".
 *
 * Server-only in practice (consumers select the access-restricted `rsmEmail`),
 * but this module itself is pure string building.
 */

import { z } from 'zod'
import type { Dealer } from '@/payload-types'
import type { RsmMatch } from '@/lib/rsm/routing'

/** Lead payload shape — matches the HubSpot field names the signup form emits. */
export const leadEmailSchema = z.object({
  firstname: z.string().trim().optional(),
  lastname: z.string().trim().optional(),
  email: z.string().email(),
  phone: z.string().trim().optional(),
  zip: z.string().trim().min(3).max(10),
  piano_type: z.string().trim().optional(),
  when_are_you_looking_to_purchase_: z.string().trim().optional(),
})

export type LeadEmailValues = z.infer<typeof leadEmailSchema>

/** One row of the nearest-dealers table (same shape the test page's table uses). */
export interface NearbyDealerRow {
  dealer: Dealer
  distance: number
  hasRsmEmail: boolean
}

export interface LeadEmailOptions {
  lead: LeadEmailValues
  match: RsmMatch | null
  /** Page identifier shown in the footer and used as the Resend tag. */
  source: string
  /** Nearest-N dealers table. Omit for production — RSM email stays unchanged. */
  nearby?: NearbyDealerRow[]
  /** Test mode banner. `productionRecipient` = who the real pipeline would email. */
  test?: { productionRecipient: string }
}

/** Escape user-supplied strings before interpolating into email HTML. */
export function escapeHtml(value: string): string {
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

/** Subject line for the lead notification. */
export function buildLeadEmailSubject({
  lead,
  match,
  test,
}: Pick<LeadEmailOptions, 'lead' | 'match' | 'test'>): string {
  const prefix = test ? '[TEST] ' : ''
  return match
    ? `${prefix}New Kawai lead near ${match.dealer.address?.city ?? lead.zip} — ${lead.zip}`
    : `${prefix}New Kawai lead — ${lead.zip} (unmatched)`
}

/** Banner making it unmistakable that a test send is not a real lead. */
function testBanner(productionRecipient: string): string {
  return `
    <div style="background:#b45309;padding:14px 32px;color:#fff">
      <p style="margin:0;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase">⚠️ Test email — not a real lead</p>
      <p style="margin:4px 0 0;font-size:12px;line-height:1.5">
        Sent from the internal ZIP routing test tool. Nothing was written to HubSpot or Shopify.
        In production this notification would have gone to
        <strong>${escapeHtml(productionRecipient)}</strong>.
      </p>
    </div>`
}

/** The nearest-N dealers table (test tool only). */
function nearbyDealersSection(nearby: NearbyDealerRow[]): string {
  if (nearby.length === 0) {
    return `
      <p style="margin:24px 0 0;color:#b45309;font-size:13px">
        No eligible dealers were found near this ZIP / postal code.
      </p>`
  }

  const rows = nearby
    .map(({ dealer, distance, hasRsmEmail }, i) => {
      const location = [dealer.address?.city, dealer.address?.state].filter(Boolean).join(', ')
      const phone = dealer.contactInfo?.phone
      return `
        <tr style="border-bottom:1px solid #eee">
          <td style="padding:8px 12px 8px 0;color:#6b7280;font-size:13px;vertical-align:top">${i + 1}</td>
          <td style="padding:8px 12px 8px 0;font-size:13px;color:#1E1B16;vertical-align:top">
            <strong>${escapeHtml(dealer.dealerName)}</strong>${
              hasRsmEmail
                ? ' <span style="color:#047857;font-size:11px;font-weight:700">· RSM</span>'
                : ''
            }
            ${location ? `<br><span style="color:#6b7280">${escapeHtml(location)}</span>` : ''}
            ${phone ? `<br><span style="color:#6b7280">${escapeHtml(phone)}</span>` : ''}
          </td>
          <td style="padding:8px 0;font-size:13px;color:#1E1B16;text-align:right;white-space:nowrap;vertical-align:top">${distance.toFixed(1)} mi</td>
        </tr>`
    })
    .join('')

  return `
    <p style="margin:24px 0 8px;font-weight:700;font-size:14px">${nearby.length} closest dealers to this lead</p>
    <table style="border-collapse:collapse;width:100%">
      <tbody>${rows}</tbody>
    </table>`
}

/** Full HTML body for the lead notification email. */
export function buildLeadEmailHtml({
  lead,
  match,
  source,
  nearby,
  test,
}: LeadEmailOptions): string {
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
        <div style="max-width:520px;margin:0 auto;background:#fff;border:1px solid #DBDBDB;border-radius:8px;overflow:hidden">${test ? testBanner(test.productionRecipient) : ''}
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
            ${dealerSection}${nearby ? nearbyDealersSection(nearby) : ''}
            <p style="margin:24px 0 0;color:#6b7280;font-size:12px">
              Source: ${escapeHtml(source)} · Reply to this email to reach the lead directly.
            </p>
          </div>
        </div>
      </body>
    </html>`
}
