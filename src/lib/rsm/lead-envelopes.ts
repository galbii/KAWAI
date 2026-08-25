/**
 * Recipient envelopes and delivery switches for the two lead notification emails.
 *
 * Extracted so the live pipeline (`notify-rsm-of-lead`) and the internal test
 * tool (`test-rsm-routing`) build recipients from one implementation. They used
 * to compose envelopes independently, which meant the test tool could report a
 * routing plan production no longer used.
 *
 * Both emails follow the same shape: addressed to the person who must act on
 * the lead, with Kawai corporate CC'd so head office has a visible copy of
 * every lead handed out.
 *
 * Not a server action — plain helpers, so both `'use server'` modules can
 * import them (a `'use server'` file may only export async functions).
 */

/**
 * Delivery kill switches. Both OFF unless explicitly switched on, so an unset
 * env var can never accidentally start sending.
 *
 * Shared rather than read at each call site because the RSM email's wording
 * depends on whether the dealer is being notified — if these two disagreed, the
 * RSM would be told the dealer has the lead when nobody had contacted them.
 */
/**
 * Read one switch. Trimmed and lower-cased before comparing, and `1`/`yes`/`on`
 * count as on: these are hand-typed into a hosting dashboard, and a stray space
 * or a capitalised `TRUE` silently holding every lead email is a far worse
 * failure than being liberal about how "on" is spelled. Anything else — unset,
 * blank, `false`, a typo — is still off.
 */
const isOn = (raw: string | undefined): boolean =>
  ['true', '1', 'yes', 'on'].includes(raw?.trim().toLowerCase() ?? '')

export const isRsmEmailEnabled = () => isOn(process.env.LEAD_NOTIFY_RSM_EMAIL)
export const isDealerEmailEnabled = () => isOn(process.env.LEAD_NOTIFY_DEALER_EMAIL)

/** Corporate inbox copied on every lead email. Override with LEAD_NOTIFY_CC_EMAIL. */
export const DEFAULT_LEAD_CC_EMAIL = 'contact@kawaius.com'

/** Recipients of one planned email, for both sending and "would have sent" logs. */
export interface LeadEnvelope {
  to: string
  cc: string[]
  bcc: string[]
}

/**
 * The corporate CC address.
 *
 * `||`, not `??`: an env var that is present but blank (LEAD_NOTIFY_CC_EMAIL=)
 * is an empty string, which `??` passes straight through — that would put a
 * literal '' in Cc and make Resend reject the whole send.
 */
export function leadCcAddress(): string {
  return process.env.LEAD_NOTIFY_CC_EMAIL?.trim() || DEFAULT_LEAD_CC_EMAIL
}

/**
 * Address a lead email: `to` plus the corporate CC.
 *
 * CC rather than BCC is deliberate — the recipient should see that corporate is
 * on the thread, and a reply-all reaches both the customer (via Reply-To) and
 * head office. Nobody is copied invisibly.
 *
 * The CC is dropped when it is already the To address, so an unmatched lead
 * routed to the corporate inbox is delivered once rather than twice.
 */
export function buildLeadEnvelope(to: string): LeadEnvelope {
  const cc = leadCcAddress()
  return {
    to,
    cc: cc && cc.toLowerCase() !== to.trim().toLowerCase() ? [cc] : [],
    bcc: [],
  }
}

/** One-line envelope summary for server logs and held-send diagnostics. */
export function describeEnvelope({ to, cc, bcc }: LeadEnvelope): string {
  return (
    `to=${to} cc=${cc.length ? cc.join(',') : 'none'}` +
    ` bcc=${bcc.length ? bcc.join(',') : 'none'}`
  )
}

/* ------------------------------------------------------------------ *
 * Canada override
 *
 * Canadian dealers are managed centrally rather than by the territorial RSMs
 * the `rsmEmail` field models, so nearest-dealer matching gives a poor (often
 * empty) answer north of the border. Every lead with a Canadian postal code is
 * therefore addressed to one national inbox instead, whatever the matcher
 * found. The corporate CC above still applies.
 *
 * The matcher still runs for Canadian leads — the nearest-dealer readout in the
 * email body and the visitor's dealer picker both stay useful — only the
 * recipient is overridden.
 * ------------------------------------------------------------------ */

/** Where every Canadian lead goes. Override with LEAD_NOTIFY_CANADA_EMAIL. */
export const DEFAULT_CANADA_LEAD_EMAIL = 'dmitchell@kawaius.com'

/**
 * `||`, not `??`: a present-but-blank env var (LEAD_NOTIFY_CANADA_EMAIL=) is an
 * empty string, which `??` would pass through as a literal '' recipient and
 * make Resend reject the whole send.
 */
export function canadaLeadInbox(): string {
  return process.env.LEAD_NOTIFY_CANADA_EMAIL?.trim() || DEFAULT_CANADA_LEAD_EMAIL
}

/**
 * A real Canadian postal code — full (`A1A 1A1`, `a1a1a1`, `A1A-1A1`) or the
 * 3-character FSA (`A1A`) some visitors type.
 *
 * Deliberately stricter than `classifyLeadCountry` in ./routing, which calls
 * anything that isn't a US ZIP "canada" so ranking has a country to filter by.
 * That looser rule is fine for *filtering* but wrong for *addressing*: it would
 * hand every typo'd ZIP to the Canadian inbox. Only a genuine postal code
 * overrides the recipient; junk still falls through to the match/fallback path.
 */
const CANADIAN_POSTAL_RE = /^[A-Za-z]\d[A-Za-z]([ -]?\d[A-Za-z]\d)?$/

export function isCanadianLeadZip(zip: string): boolean {
  return CANADIAN_POSTAL_RE.test(zip.trim())
}

/** Where a lead notification is addressed, and why. */
export interface RsmRecipient {
  to: string
  /** True when the Canada override chose this address over the match. */
  canadaOverride: boolean
}

/**
 * Resolve the RSM notification's To address: Canadian postal codes go to the
 * national inbox, everyone else to the matched RSM, falling back when unmatched.
 *
 * Takes the matched address rather than the `RsmMatch` so this module stays
 * free of ./routing — which pulls in the Payload Local API and can't be
 * imported outside a server runtime.
 *
 * Shared by the live send and the test tool so the dry run can never report a
 * recipient production wouldn't use.
 */
export function resolveRsmRecipient(
  zip: string,
  matchedEmail: string | null | undefined,
  fallback: string,
): RsmRecipient {
  if (isCanadianLeadZip(zip)) {
    return { to: canadaLeadInbox(), canadaOverride: true }
  }
  return { to: matchedEmail ?? fallback, canadaOverride: false }
}
