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
 *      its region's inbox regardless of what step 4 matched — Canadian dealers
 *      aren't covered by the territorial `rsmEmail` scheme. Split by the
 *      postal code's first letter: west (BC/AB/SK/MB + territories) →
 *      LEAD_NOTIFY_CANADA_EMAIL (default dmitchell@kawaius.com); east (ON, QC,
 *      NS, PE, NB, NL) → LEAD_NOTIFY_CANADA_EAST_EMAIL (default
 *      RRooke@kawaius.com). The match itself still runs and still appears in
 *      the email body.
 *   5. Send via Resend with `replyTo` = the lead, an idempotency key so a
 *      double-fired submit can't email the RSM twice, and a `source` tag for
 *      dashboard filtering. Falls back to LEAD_NOTIFY_FALLBACK_EMAIL when no
 *      RSM (or no geocode) is found, so a lead is never silently dropped.
 *
 * A submission produces one lead email, plus at most one dealer email:
 *
 *   Lead  — addressed to whoever owns the lead (`resolveLeadRecipient`):
 *           · Storefront — an official Kawai storefront is the closest location
 *             to the lead (nearer than every independent dealer, within
 *             LEAD_STOREFRONT_RADIUS_MILES) or lists the ZIP in "Zip Codes
 *             Served", and storefront routing is on: the storefront's contact email
 *             (showroomInfo.email) receives it INSTEAD of the RSM, in the
 *             narrow "a new lead in your area" template.
 *           · Otherwise the RSM path: matched RSM → Canada west/east inbox → fallback,
 *             with the full RSM template (which names a nearby storefront).
 *   Dealer— only when the visitor picked a dealer that has a public email
 *           (post-submit picker, currently disabled on every page). Skipped
 *           when that inbox already owns the lead.
 *
 * Both are CC'd to the Kawai corporate inbox (LEAD_NOTIFY_CC_EMAIL, default
 * contact@kawaius.com) so head office has a visible copy of every lead handed
 * out. Nothing is BCC'd — a recipient can always see who else is on the thread.
 *
 * Switches, all OFF unless set:
 *   LEAD_NOTIFY_RSM_EMAIL        — deliver RSM-path lead emails (else HELD + logged).
 *   LEAD_NOTIFY_STOREFRONT_EMAIL — route storefront-area leads to the storefront.
 *                                  Off means they go to the RSM path as before,
 *                                  so this switch never drops a lead.
 *   LEAD_NOTIFY_DEALER_EMAIL     — deliver the visitor-chosen dealer email.
 * While a send is held, the pipeline still runs end to end and logs the exact
 * To, Cc and Bcc a live send would have used. LEAD_NOTIFY_TEST_INBOX redirects
 * every real send to one inbox.
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

import { runLeadNotification } from '@/lib/rsm/lead-notify-core'

/**
 * Match a signup lead to the nearest dealer's RSM and email them via Resend.
 *
 * The pipeline itself lives in `src/lib/rsm/lead-notify-core.ts` (shared with
 * the national /holiday-sale-event page, which sends the same routing in its
 * own holiday-branded emails). Called here with today's templates, so this
 * action's emails are unchanged.
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
  return runLeadNotification(values, source, choice ? { choice } : {})
}
