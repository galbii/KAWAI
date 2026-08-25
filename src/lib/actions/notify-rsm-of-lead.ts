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
 *   4b. Canada override: a lead whose postal code is Canadian is addressed to
 *      the national Canadian inbox (LEAD_NOTIFY_CANADA_EMAIL, default
 *      dmitchell@kawaius.com) regardless of what step 4 matched — Canadian
 *      dealers aren't covered by the territorial `rsmEmail` scheme. The match
 *      itself still runs and still appears in the email body.
 *   5. Send via Resend with `replyTo` = the lead, an idempotency key so a
 *      double-fired submit can't email the RSM twice, and a `source` tag for
 *      dashboard filtering. Falls back to LEAD_NOTIFY_FALLBACK_EMAIL when no
 *      RSM (or no geocode) is found, so a lead is never silently dropped.
 *
 * A submission can produce two independent emails:
 *
 *   RSM   — the standard notification: lead details and which dealer the
 *           visitor chose. Always sent. No dealer is copied, and the nearest-
 *           dealer list is deliberately omitted — the RSM knows their own
 *           territory, and the choice is the actionable part.
 *   Dealer— only when the visitor picked a dealer that has a public email. A
 *           warmer, narrower note carrying just the lead's details. It never
 *           lists other dealers, and no RSM address appears on it.
 *
 * Both are CC'd to the Kawai corporate inbox (LEAD_NOTIFY_CC_EMAIL, default
 * contact@kawaius.com) so head office has a visible copy of every lead handed
 * out. Nothing is BCC'd — a recipient can always see who else is on the thread.
 * The RSM is not copied on the dealer's email; their own notification already
 * names the dealer the visitor chose.
 *
 * ⚠️ BOTH sends are held back by default. LEAD_NOTIFY_RSM_EMAIL and
 * LEAD_NOTIFY_DEALER_EMAIL each default to OFF, so no RSM and no dealer
 * receives anything until someone explicitly turns them on. While held, the
 * pipeline still runs end to end and logs the exact recipients — To, Cc and
 * Bcc — a live send would have used, so routing can be verified from the server
 * log without a single real email leaving. Flip them independently: the RSM
 * side is normally enabled first, the dealer side once dealers are briefed.
 *
 * The two sends are independent — one failing never suppresses the other.
 *
 * Called fire-and-forget from the form's `onComplete` hook (alongside the
 * Shopify upsert): it never throws — HubSpot is the primary CRM and this
 * notification must never block or fail the submission the visitor sees.
 *
 * The email markup lives in `src/lib/rsm/lead-email.ts`, shared with the
 * internal test tool so the test renders the exact email an RSM receives. Only
 * the `test` option is withheld here — that one adds the "not a real lead"
 * banner, which production must never carry.
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
import {
  buildDealerEmailHtml,
  buildDealerEmailSubject,
} from '@/lib/rsm/lead-email'
import {
  dealerNotifyAddress,
  resolveDealerChoice,
  toNearbyDealerOptions,
  type LeadDealerChoice,
  type NearbyDealerOption,
} from '@/lib/rsm/nearby-dealers'
import { incrementDealerLeadCount } from '@/lib/rsm/lead-counter'
import {
  buildLeadEnvelope,
  describeEnvelope,
  isDealerEmailEnabled,
  isRsmEmailEnabled,
  resolveRsmRecipient,
  type LeadEnvelope,
} from '@/lib/rsm/lead-envelopes'

/**
 * Global test-inbox valve. When LEAD_NOTIFY_TEST_INBOX is set, every lead email
 * is re-addressed to it and all Cc/Bcc is dropped, so no RSM, dealer or
 * corporate inbox can be reached no matter what the enable flags say.
 * Server-side only — nothing the browser sends can influence a recipient.
 * Unset it to go live.
 */
const testInbox = () => process.env.LEAD_NOTIFY_TEST_INBOX?.trim() || null

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
 * @param choice - What the visitor picked in the post-submit dealer modal.
 *                 `{ dealerId: null }` is the explicit "not sure" answer; omit
 *                 the argument entirely when the modal never ran.
 * @returns `{ success }` — never rejects; failures are logged and swallowed.
 *          Intentionally returns no dealer/RSM data (internal-only fields).
 */
export async function notifyRsmOfLead(
  values: Record<string, string>,
  source: string = 'signup',
  choice?: { dealerId: string | null },
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
    // The same ranked list feeds the 5-nearest table, so what the RSM reads is
    // exactly what the visitor was offered in the picker.
    let match: RsmMatch | null = null
    let nearby: NearbyDealerOption[] = []
    const coords = await geocodeZipCode(lead.zip)
    if (coords) {
      const dealers = await getDealersForRsmRouting()
      const ranked = rankRsmCandidates(dealers, coords, classifyLeadCountry(lead.zip))
      match = findNearestRsm(ranked)
      nearby = toNearbyDealerOptions(ranked)
    } else {
      console.warn(`[notify-rsm] Could not geocode "${lead.zip}" — using fallback inbox`)
    }

    // The id comes from the browser, so it is resolved against the offered list
    // rather than trusted — an unknown id degrades to "unsure".
    const dealerChoice: LeadDealerChoice | undefined = choice
      ? resolveDealerChoice(nearby, choice.dealerId)
      : undefined

    // `||`, not `??`: an env var that is present but blank (LEAD_NOTIFY_FALLBACK_EMAIL=)
    // is an empty string, which `??` happily passes through — that would put a
    // literal '' in To/Bcc and make Resend reject the whole send.
    const fallback = process.env.LEAD_NOTIFY_FALLBACK_EMAIL?.trim() || fromAddress
    const redirect = testInbox()
    const leadKey = `${lead.email}|${lead.zip}|${choice ? (choice.dealerId ?? 'unsure') : 'none'}`
    const resend = new Resend(apiKey)

    /**
     * Send one email, or — while its kill switch is off — log the exact
     * envelope it would have used and send nothing. Returns whether an email
     * actually went out. Never throws: each delivery is independent, so a
     * failure on one must not take the other down with it.
     */
    const deliver = async (
      kind: 'rsm' | 'dealer',
      enabled: boolean,
      envelope: LeadEnvelope,
      subject: string,
      html: string,
    ): Promise<boolean> => {
      if (!enabled) {
        const flag = kind === 'rsm' ? 'LEAD_NOTIFY_RSM_EMAIL' : 'LEAD_NOTIFY_DEALER_EMAIL'
        console.log(
          `[notify-rsm] HELD — ${kind} email not sent. Would have gone ${describeEnvelope(envelope)} ` +
            `(subject: "${subject}"). Set ${flag}=true to deliver.`,
        )
        return false
      }

      // Redirect the envelope, never the log — the log must always record the
      // real routing decision, not the test detour.
      const actual: LeadEnvelope = redirect ? { to: redirect, cc: [], bcc: [] } : envelope

      try {
        const { data, error } = await resend.emails.send(
          {
            from: fromAddress,
            to: [actual.to],
            ...(actual.cc.length > 0 ? { cc: actual.cc } : {}),
            ...(actual.bcc.length > 0 ? { bcc: actual.bcc } : {}),
            // Replies go straight to the customer, for RSM and dealer alike.
            replyTo: lead.email,
            subject,
            html,
            tags: [{ name: 'source', value: source.replace(/[^A-Za-z0-9_-]/g, '_') }],
          },
          {
            // One send per lead+zip+choice per kind per 24h. Guards a
            // double-fired submit without letting the dealer email dedupe
            // against the RSM email — note `kind` is part of the hash.
            idempotencyKey: `${kind}-lead/${createHash('sha256').update(`${kind}|${leadKey}`).digest('hex')}`,
          },
        )

        if (error) {
          console.error(`[notify-rsm] Resend error on ${kind} email:`, error)
          return false
        }
        console.log(
          redirect
            ? `[notify-rsm] Sent ${kind} email (${data?.id}) to TEST INBOX ${redirect} — live routing would have been ${describeEnvelope(envelope)}`
            : `[notify-rsm] Sent ${kind} email (${data?.id}) ${describeEnvelope(envelope)}`,
        )
        return true
      } catch (err) {
        console.error(`[notify-rsm] Failed to send ${kind} email:`, err)
        return false
      }
    }

    // Resolved before the RSM email is composed: its wording depends on whether
    // the dealer is actually being contacted, and getting that backwards would
    // tell the RSM to stand down on a lead nobody has picked up.
    const dealerTo = dealerNotifyAddress(dealerChoice)
    const dealerNotified = Boolean(dealerTo) && isDealerEmailEnabled()

    // — RSM notification: the standard email. Corporate CC'd, no dealer copied. —
    // Canadian postal codes bypass the match and go to the national inbox; see
    // `resolveRsmRecipient`.
    const recipient = resolveRsmRecipient(lead.zip, match?.rsmEmail, fallback)
    if (recipient.canadaOverride) {
      console.log(
        `[notify-rsm] Canadian lead "${lead.zip}" — routing to ${recipient.to} instead of ` +
          `${match?.rsmEmail ?? 'the fallback inbox'}.`,
      )
    }
    const rsmEnvelope = buildLeadEnvelope(recipient.to)

    const rsmSent = await deliver(
      'rsm',
      isRsmEmailEnabled(),
      rsmEnvelope,
      buildLeadEmailSubject({
        lead,
        match,
        ...(dealerChoice ? { choice: dealerChoice } : {}),
        ...(redirect ? { test: {} } : {}),
      }),
      buildLeadEmailHtml({
        lead,
        match,
        source,
        dealerNotified,
        ...(dealerChoice ? { choice: dealerChoice } : {}),
        ...(redirect ? { test: { label: 'RSM notification', envelope: rsmEnvelope } } : {}),
      }),
    )

    // — Dealer notification: only when the visitor named a dealer that has a
    //   public inbox. Warmer, no competitor list, corporate CC'd. The RSM is
    //   not copied here — their own email already names the chosen dealer. —
    let dealerSent = false

    if (dealerTo && dealerChoice?.kind === 'selected') {
      const dealerEnvelope = buildLeadEnvelope(dealerTo)
      dealerSent = await deliver(
        'dealer',
        isDealerEmailEnabled(),
        dealerEnvelope,
        buildDealerEmailSubject({ lead, ...(redirect ? { test: {} } : {}) }),
        buildDealerEmailHtml({
          lead,
          dealer: dealerChoice.dealer,
          source,
          ...(redirect
            ? { test: { label: 'Dealer notification', envelope: dealerEnvelope } }
            : {}),
        }),
      )
    } else if (dealerChoice?.kind === 'selected') {
      console.log(
        `[notify-rsm] No dealer email — ${dealerChoice.dealer.name} has no contact email on file.`,
      )
    }

    // Attribution is about what the visitor chose, not what we managed to
    // deliver, so this counts even while the emails are held back.
    if (dealerChoice?.kind === 'selected') {
      void incrementDealerLeadCount(dealerChoice.dealer.id)
    }

    return { success: rsmSent || dealerSent }
  } catch (err) {
    // Fire-and-forget contract: log, never throw — the visitor-facing HubSpot
    // submission must not be affected by a notification failure.
    console.error('[notify-rsm] Failed:', err)
    return { success: false }
  }
}
