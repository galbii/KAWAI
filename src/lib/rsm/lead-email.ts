/**
 * RSM lead notification email — shared template.
 *
 * Single source of truth for the "New Sales Lead" email so the internal test
 * tool (/zipcodetest2026kawaiamerica) renders the *exact* markup an RSM
 * receives in production. If this template and the test diverged, the test
 * would validate nothing.
 *
 * The email is addressed TO the matched RSM, so it deliberately says nothing
 * about which RSM was matched or which inbox was chosen — routing is internal
 * plumbing, and the recipient already knows their own territory. The test tool
 * surfaces the resolved address in the *page UI*, never in the email body.
 *
 * `test` is the only test-tool-only option: it adds the "not a real lead"
 * banner and, when the visitor picked a dealer, previews the CC the live
 * pipeline would add without that dealer ever being emailed.
 *
 * Server-only in practice (consumers resolve access-restricted fields), but
 * this module itself is pure string building.
 */

import { z } from 'zod'
import type { RsmMatch } from '@/lib/rsm/routing'
import type { LeadDealerChoice, NearbyDealerOption } from '@/lib/rsm/nearby-dealers'
import type { LeadEnvelope } from '@/lib/rsm/lead-envelopes'

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

/**
 * Test-tool-only additions. Presence of this object switches on test mode.
 *
 * This is the one place an email body may carry routing addresses: a tester
 * needs to confirm from the message itself who a live send would have reached.
 * Production never passes `test`, so a real RSM or dealer email still contains
 * no addresses beyond the lead's own.
 */
export interface LeadEmailTestOptions {
  /** Which of the two emails this is, e.g. "RSM notification". */
  label?: string
  /** Exact recipients a live send would have used for THIS email. */
  envelope?: LeadEnvelope
}

export interface LeadEmailOptions {
  lead: LeadEmailValues
  match: RsmMatch | null
  /** Page identifier shown in the footer and used as the Resend tag. */
  source: string
  /** What the visitor picked in the post-submit modal. Omit if it didn't run. */
  choice?: LeadDealerChoice
  /**
   * Whether the chosen dealer is actually being sent their own notification.
   * Drives what the RSM is told to do next, so it must reflect the real
   * delivery switch — claiming the dealer was notified when dealer email is
   * switched off would leave a lead sitting with nobody acting on it.
   */
  dealerNotified?: boolean
  /** Test mode banner. Omit in production. */
  test?: LeadEmailTestOptions
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
  choice,
  test,
}: Pick<LeadEmailOptions, 'lead' | 'match' | 'choice' | 'test'>): string {
  const prefix = test ? '[TEST] ' : ''

  // The visitor naming a dealer is the strongest signal in the subject line —
  // it tells the RSM at a glance that this lead already has a destination.
  if (choice?.kind === 'selected') {
    return `${prefix}New Kawai lead for ${choice.dealer.name} — ${lead.zip}`
  }

  return match
    ? `${prefix}New Kawai lead near ${match.dealer.address?.city ?? lead.zip} — ${lead.zip}`
    : `${prefix}New Kawai lead — ${lead.zip} (unmatched)`
}

/** One To/Cc/Bcc line in the test banner. */
function envelopeRow(label: string, value: string): string {
  return `
        <tr>
          <td style="padding:2px 10px 2px 0;font-size:12px;font-weight:700;white-space:nowrap;vertical-align:top">${label}</td>
          <td style="padding:2px 0;font-size:12px;word-break:break-all">${escapeHtml(value)}</td>
        </tr>`
}

/**
 * Banner making it unmistakable that a test send is not a real lead, and
 * spelling out the exact envelope — To, Cc and Bcc — a live send would have
 * used, so a tester can confirm routing without leaving the message. Every line
 * is rendered even when empty: "Bcc: none" is itself the confirmation that
 * nobody was copied invisibly.
 */
function testBanner({ label, envelope }: LeadEmailTestOptions): string {
  const which = label ? ` — ${escapeHtml(label)}` : ''

  const recipients = envelope
    ? `
      <p style="margin:10px 0 4px;font-size:12px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase">Live, this would have gone to</p>
      <table style="border-collapse:collapse">
        ${envelopeRow('To:', envelope.to)}
        ${envelopeRow('Cc:', envelope.cc.length > 0 ? envelope.cc.join(', ') : 'none')}
        ${envelopeRow('Bcc:', envelope.bcc.length > 0 ? envelope.bcc.join(', ') : 'none')}
      </table>`
    : ''

  return `
    <div style="background:#b45309;padding:14px 32px;color:#fff">
      <p style="margin:0;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase">⚠️ Test email — not a real lead${which}</p>
      <p style="margin:4px 0 0;font-size:12px;line-height:1.5">
        A test copy of a Kawai lead notification, redirected to this inbox. None of the
        addresses below were contacted.
      </p>${recipients}
    </div>`
}

/** The dealer the visitor asked to be connected with, with contact details. */
function chosenDealerSection(dealer: NearbyDealerOption, dealerNotified: boolean): string {
  const contact = [dealer.phone, dealer.email].filter(Boolean).join(' · ')

  return `
    <div style="margin:22px 0 0;border-left:3px solid #E11922;background:#FAF8F5;padding:14px 18px">
      <p style="margin:0;color:#E11922;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase">Dealer the customer chose</p>
      <p style="margin:6px 0 0;font-size:16px;font-weight:700;color:#1E1B16">${escapeHtml(dealer.name)}</p>
      <p style="margin:2px 0 0;font-size:13px;color:#6b7280">
        ${escapeHtml(dealer.location)}${dealer.location ? ' · ' : ''}${dealer.distance.toFixed(1)} mi from the lead
      </p>
      ${contact ? `<p style="margin:6px 0 0;font-size:13px;color:#1E1B16">${escapeHtml(contact)}</p>` : ''}
      <p style="margin:10px 0 0;font-size:12px;color:#6b7280;line-height:1.5">
        ${
          dealerNotified
            ? `The customer asked to be connected with this location. The dealer has been sent
        their own notification with the customer's details.`
            : `The customer asked to be connected with this location. <strong style="color:#1E1B16">The dealer
        has not been contacted</strong> &mdash; please make the introduction.`
        }
      </p>
    </div>`
}

/** The visitor explicitly asked for help choosing. */
function unsureSection(): string {
  return `
    <div style="margin:22px 0 0;border-left:3px solid #b45309;background:#fffbeb;padding:14px 18px">
      <p style="margin:0;color:#b45309;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase">Customer wasn't sure which dealer</p>
      <p style="margin:6px 0 0;font-size:13px;color:#1E1B16;line-height:1.5">
        They asked for a recommendation instead of picking a location — they are
        expecting you to point them at the right showroom.
      </p>
    </div>`
}

/** Full HTML body for the lead notification email. */
export function buildLeadEmailHtml({
  lead,
  match,
  source,
  choice,
  dealerNotified = false,
  test,
}: LeadEmailOptions): string {
  const name = [lead.firstname, lead.lastname].filter(Boolean).join(' ')

  // With a visitor choice the "nearest dealer" readout is noise — what the
  // customer asked for outranks what the algorithm picked. Without one, fall
  // back to showing the match so the RSM still has a starting point.
  let routingSection: string
  if (choice?.kind === 'selected') {
    routingSection = chosenDealerSection(choice.dealer, dealerNotified)
  } else if (choice?.kind === 'unsure') {
    routingSection = unsureSection()
  } else if (match) {
    routingSection = `
      <p style="margin:20px 0 8px;font-weight:700;font-size:14px">Nearest dealer to this lead</p>
      <table style="border-collapse:collapse">
        ${detailRow('Dealer', match.dealer.dealerName)}
        ${detailRow(
          'Location',
          [match.dealer.address?.city, match.dealer.address?.state].filter(Boolean).join(', '),
        )}
        ${detailRow('Distance', `${Math.round(match.distance * 10) / 10} miles from lead`)}
        ${detailRow('Territory', match.dealer.region ?? undefined)}
      </table>`
  } else {
    routingSection = ''
  }

  // Shown whenever the ZIP couldn't be matched, regardless of the visitor's
  // choice — somebody has to know this lead needs a manual hand-off.
  const unmatchedWarning = match
    ? ''
    : `
      <p style="margin:20px 0 0;color:#b45309;font-size:13px">
        ⚠️ No RSM-managed dealer could be matched to this ZIP / postal code.
        Please forward this lead to the right territory.
      </p>`

  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family:'Helvetica Neue',Arial,sans-serif;background:#FAF8F5;padding:40px 20px;color:#1E1B16">
        <div style="max-width:520px;margin:0 auto;background:#fff;border:1px solid #DBDBDB;border-radius:8px;overflow:hidden">${test ? testBanner(test) : ''}
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
            ${routingSection}${unmatchedWarning}
            <p style="margin:24px 0 0;color:#6b7280;font-size:12px">
              Source: ${escapeHtml(source)} · Reply to this email to reach the lead directly.
            </p>
          </div>
        </div>
      </body>
    </html>`
}

/* ------------------------------------------------------------------ *
 * Dealer notification — a separate, deliberately narrow email.
 *
 * Sent to the dealer the visitor picked, with Kawai corporate CC'd. It shares
 * nothing with the RSM email beyond the lead's own details: no nearest-dealer
 * list (that would hand a dealer their competitors), no routing internals, and
 * no RSM address in any header — the RSM is not copied on this message at all.
 * Reply-To is the customer, so a dealer can simply hit reply.
 * ------------------------------------------------------------------ */

export interface DealerEmailOptions {
  lead: LeadEmailValues
  /** The dealer the visitor chose — also the recipient. */
  dealer: NearbyDealerOption
  /** Page identifier used as the Resend tag. */
  source: string
  /** Test mode banner. Omit in production. */
  test?: LeadEmailTestOptions
}

/** Subject line for the dealer notification. */
export function buildDealerEmailSubject({
  lead,
  test,
}: Pick<DealerEmailOptions, 'lead' | 'test'>): string {
  const prefix = test ? '[TEST] ' : ''
  const name = [lead.firstname, lead.lastname].filter(Boolean).join(' ')
  return name
    ? `${prefix}New Kawai lead — ${name}`
    : `${prefix}New Kawai lead — ${lead.zip}`
}

/** Full HTML body for the dealer notification email. */
export function buildDealerEmailHtml({
  lead,
  dealer,
  source,
  test,
}: DealerEmailOptions): string {
  const fullName = [lead.firstname, lead.lastname].filter(Boolean).join(' ')
  const firstName = lead.firstname || 'They'

  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family:'Helvetica Neue',Arial,sans-serif;background:#FAF8F5;padding:40px 20px;color:#1E1B16">
        <div style="max-width:520px;margin:0 auto;background:#fff;border:1px solid #DBDBDB;border-radius:8px;overflow:hidden">${test ? testBanner(test) : ''}
          <div style="background:#1E1B16;padding:24px 32px">
            <p style="margin:0;color:#E11922;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase">New Customer Lead</p>
            <h1 style="margin:6px 0 0;color:#fff;font-size:20px;font-weight:700">Someone chose your showroom</h1>
          </div>
          <div style="padding:28px 32px;font-size:14px;line-height:1.6">
            <p style="margin:0 0 8px">Hello ${escapeHtml(dealer.name)},</p>
            <p style="margin:0 0 20px">
              Good news — a customer looking for a Kawai piano asked to be connected with you.
              Here's how to reach ${escapeHtml(fullName || 'them')}.
            </p>

            <table style="border-collapse:collapse">
              ${detailRow('Name', fullName || undefined)}
              ${detailRow('Email', lead.email)}
              ${detailRow('Phone', lead.phone)}
              ${detailRow('ZIP / Postal', lead.zip)}
              ${detailRow('Shopping for', lead.piano_type?.replaceAll(';', ', '))}
              ${detailRow('Timeframe', lead.when_are_you_looking_to_purchase_?.replaceAll('_', ' '))}
            </table>

            <div style="margin:24px 0 0;border-left:3px solid #E11922;background:#FAF8F5;padding:14px 18px">
              <p style="margin:0;font-size:14px;line-height:1.6">
                <strong>Just hit reply</strong> — your response goes straight to
                ${escapeHtml(firstName)}. The sooner they hear from you, the better.
              </p>
            </div>

            <p style="margin:24px 0 0;color:#6b7280;font-size:12px">
              Sent by Kawai America because this customer selected your location on kawaius.com
              (source: ${escapeHtml(source)}).
            </p>
          </div>
        </div>
      </body>
    </html>`
}
