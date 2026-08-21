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
 * Delivery kill switches. Both OFF unless explicitly set to the string 'true',
 * so a missing or malformed env var can never accidentally start sending.
 *
 * Shared rather than read at each call site because the RSM email's wording
 * depends on whether the dealer is being notified — if these two disagreed, the
 * RSM would be told the dealer has the lead when nobody had contacted them.
 */
export const isRsmEmailEnabled = () => process.env.LEAD_NOTIFY_RSM_EMAIL === 'true'
export const isDealerEmailEnabled = () => process.env.LEAD_NOTIFY_DEALER_EMAIL === 'true'

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
