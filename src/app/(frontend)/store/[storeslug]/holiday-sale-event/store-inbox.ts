import { buildLeadEnvelope, type LeadEnvelope } from '@/lib/rsm/lead-envelopes'
import { PROGRAM_END } from '@/app/(frontend)/fall-financing/_components/campaign'

/**
 * Where a holiday-sale-event lead goes, and who hears back (Chance, Nov 19,
 * 2026): "make sure the emails get sent to each of the store emails ... also
 * one to the one submitting the lead information ... it should just send to
 * the correct inbox, add to shopify and tag holiday-2026-lead".
 *
 * Pure: no Resend, no Payload, no env reads. The server action
 * (`notify-store-lead.ts`) feeds it the env switches and does the sending, so
 * the routing and the safety valves are unit-tested here.
 *
 * The inbox is chosen ONLY from this fixed map, by the page's store slug. The
 * browser sends the slug and nothing else; no address it could send is ever
 * read. A slug not in the map gets `null`, and the caller falls back to the
 * national ZIP routing (notifyRsmOfLead) exactly as before.
 */
export const HOLIDAY_STORES = {
  dallas: { name: 'Dallas', inbox: 'dallas@kawaius.com' },
  houston: { name: 'Houston', inbox: 'houston@kawaius.com' },
  denver: { name: 'Denver', inbox: 'denver@kawaius.com' },
  'st-louis': { name: 'St. Louis', inbox: 'st-louis@kawaius.com' },
} as const satisfies Record<string, { name: string; inbox: string }>

export type HolidayStore = (typeof HOLIDAY_STORES)[keyof typeof HOLIDAY_STORES]

/** The store for a page slug, or null for any slug not in the fixed map. */
export function holidayStoreFor(storeSlug: string): HolidayStore | null {
  const key = storeSlug.trim().toLowerCase()
  return Object.prototype.hasOwnProperty.call(HOLIDAY_STORES, key) ? HOLIDAY_STORES[key as keyof typeof HOLIDAY_STORES] : null
}

export interface HolidayLeadPlan {
  store: HolidayStore
  /** The store notification: the real envelope (store + corporate CC), for logs. */
  storeEnvelope: LeadEnvelope
  /** What is actually sent: the real envelope, or the test inbox alone. */
  storeSend: LeadEnvelope
  /** The confirmation to the person who submitted, or the test inbox. */
  confirmationTo: string
  /** Replies to the confirmation land in the store's inbox. */
  confirmationReplyTo: string
  /**
   * False holds both emails (logged, not sent). Held only on a test-mode page
   * with no test inbox: a dry run never reaches a real store or customer, and
   * with LEAD_NOTIFY_TEST_INBOX set it sends, redirected, so QA can read both.
   */
  live: boolean
}

/**
 * Plan both emails for one holiday lead.
 *
 * `testInbox` mirrors notify-rsm-of-lead's LEAD_NOTIFY_TEST_INBOX valve: every
 * send is re-addressed to it with no CC, whatever else is set. `testMode` is
 * the page's FALL_FINANCING_TEST_MODE dry run.
 */
export function planHolidayLeadEmails({
  storeSlug,
  leadEmail,
  testInbox,
  testMode,
}: {
  storeSlug: string
  leadEmail: string
  testInbox: string | null
  testMode: boolean
}): HolidayLeadPlan | null {
  const store = holidayStoreFor(storeSlug)
  if (!store) return null
  const storeEnvelope = buildLeadEnvelope(store.inbox)
  return {
    store,
    storeEnvelope,
    storeSend: testInbox ? { to: testInbox, cc: [], bcc: [] } : storeEnvelope,
    confirmationTo: testInbox ?? leadEmail,
    confirmationReplyTo: store.inbox,
    live: Boolean(testInbox) || !testMode,
  }
}

/**
 * The confirmation's words. No financing figures: a rate in an email is a
 * credit advertisement without its disclosure, so the email names the offers'
 * end date and nothing else about them.
 */
export function holidayConfirmationCopy(store: HolidayStore) {
  return {
    campaignTitle: 'Holiday Sale Event',
    storeName: `Kawai ${store.name}`,
    subject: `Thanks — the Kawai ${store.name} team will be in touch`,
    body:
      `Thanks for reaching out about the Kawai Holiday Sale Event. The Kawai ${store.name} team ` +
      `will be in touch soon with pricing and inventory for the pianos you're considering. ` +
      `The holiday offers run through ${PROGRAM_END}.`,
  }
}
