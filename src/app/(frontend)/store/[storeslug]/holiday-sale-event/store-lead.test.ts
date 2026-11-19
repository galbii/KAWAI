import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test'

/**
 * Holiday leads → the page's store inbox + a confirmation to the customer
 * (Chance, Nov 19, 2026: "make sure the emails get sent to each of the store
 * emails ... also one to the one submitting the lead information ... it
 * should just send to the correct inbox, add to shopify and tag
 * holiday-2026-lead").
 *
 * Mocks only: Resend, the signup mailer, Payload and the national action are
 * replaced before the server action is imported. Nothing is sent or written.
 */

const resendSends: Array<{ msg: Record<string, unknown>; opts: Record<string, unknown> }> = []
const confirmations: Array<Record<string, unknown>> = []
const rsmCalls: Array<{ values: unknown; source: string }> = []

mock.module('resend', () => ({
  Resend: class {
    emails = {
      send: async (msg: Record<string, unknown>, opts: Record<string, unknown>) => {
        resendSends.push({ msg, opts })
        return { data: { id: 'email_1' }, error: null }
      },
    }
  },
}))
mock.module('@/lib/signup/notify', () => ({
  sendLeadConfirmation: async (input: Record<string, unknown>) => {
    confirmations.push(input)
    return { status: input.liveSendEnabled ? 'sent' : 'skipped' }
  },
}))
mock.module('@/lib/payload/queries', () => ({
  getStorefrontBySlugDirect: async () => ({
    locationName: 'Dallas',
    showroomInfo: { name: 'Kawai Dallas', address: '601 W Plano Pkwy Ste 153, Plano, TX 75075', phone: '(972) 379-2200' },
    hours: [{ day: 'Mon–Sat', time: '10am–6pm' }],
  }),
}))
mock.module('@/lib/site-context', () => ({ getSiteUrl: () => 'https://kawaius.com' }))
mock.module('@/lib/actions/notify-rsm-of-lead', () => ({
  notifyRsmOfLead: async (values: unknown, source: string) => {
    rsmCalls.push({ values, source })
    return { success: true }
  },
}))

const { notifyHolidayStoreLead } = await import('./notify-store-lead')
const { HOLIDAY_STORES, holidayConfirmationCopy, holidayStoreFor, planHolidayLeadEmails } = await import('./store-inbox')
const { storeLeadCampaign, HOLIDAY_LEAD_TAG } = await import('./lead')
const { leadCampaign } = await import('@/app/(frontend)/fall-financing/_components/lead-campaign')

const LEAD = { firstname: 'Ada', lastname: 'Lead', email: 'ada@example.invalid', phone: '5555550100', zip: '75201' }
const ENV_KEYS = [
  'RESEND_API_KEY',
  'RESEND_FROM_EMAIL',
  'LEAD_NOTIFY_TEST_INBOX',
  'LEAD_NOTIFY_CC_EMAIL',
  'FALL_FINANCING_TEST_MODE',
] as const
const savedEnv: Record<string, string | undefined> = {}

beforeEach(() => {
  for (const k of ENV_KEYS) savedEnv[k] = process.env[k]
  process.env.RESEND_API_KEY = 're_test'
  process.env.RESEND_FROM_EMAIL = 'noreply@kawaius.com'
  delete process.env.LEAD_NOTIFY_TEST_INBOX
  delete process.env.LEAD_NOTIFY_CC_EMAIL
  delete process.env.FALL_FINANCING_TEST_MODE
  resendSends.length = 0
  confirmations.length = 0
  rsmCalls.length = 0
})
afterEach(() => {
  for (const k of ENV_KEYS) {
    if (savedEnv[k] === undefined) delete process.env[k]
    else process.env[k] = savedEnv[k]
  }
})

describe('holiday store inbox: slug → address, server-side only', () => {
  it('maps each store page to its own inbox', () => {
    expect(holidayStoreFor('dallas')?.inbox).toBe('dallas@kawaius.com')
    expect(holidayStoreFor('houston')?.inbox).toBe('houston@kawaius.com')
    expect(holidayStoreFor('denver')?.inbox).toBe('denver@kawaius.com')
    expect(holidayStoreFor('st-louis')?.inbox).toBe('st-louis@kawaius.com')
    expect(Object.keys(HOLIDAY_STORES).sort()).toEqual(['dallas', 'denver', 'houston', 'st-louis'])
  })

  it('knows no other slug, including prototype keys', () => {
    for (const s of ['austin', '', 'constructor', '__proto__', 'toString']) expect(holidayStoreFor(s)).toBeNull()
  })

  it('emails the store with corporate CC, whatever the ZIP, and ignores any client-sent address', async () => {
    const values = { ...LEAD, zip: '10001', storefront_email: 'attacker@example.invalid', to: 'x@example.invalid' }
    await notifyHolidayStoreLead(values, 'dallas', 'fall-financing')
    expect(rsmCalls).toHaveLength(0)
    expect(resendSends).toHaveLength(1)
    const { msg, opts } = resendSends[0]!
    expect(msg.to).toEqual(['dallas@kawaius.com'])
    expect(msg.cc).toEqual(['contact@kawaius.com'])
    expect(msg.replyTo).toBe(LEAD.email)
    expect(JSON.stringify(msg)).not.toContain('attacker@example.invalid')
    expect(String(opts.idempotencyKey)).toMatch(/^holiday-store-lead\/[0-9a-f]{64}$/)
  })

  it('falls back to the national ZIP routing for an unknown slug', async () => {
    await notifyHolidayStoreLead(LEAD, 'austin', 'fall-financing')
    expect(rsmCalls).toEqual([{ values: LEAD, source: 'fall-financing' }])
    expect(resendSends).toHaveLength(0)
    expect(confirmations).toHaveLength(0)
  })
})

describe('holiday confirmation to the person who submitted', () => {
  it('is addressed to the lead, replies to the store, and carries the store and the end date', async () => {
    await notifyHolidayStoreLead(LEAD, 'dallas', 'fall-financing')
    expect(confirmations).toHaveLength(1)
    const c = confirmations[0]!
    expect(c.to).toBe(LEAD.email)
    expect(c.replyTo).toBe('dallas@kawaius.com')
    expect(c.liveSendEnabled).toBe(true)
    expect(c.subject).toBe('Thanks — the Kawai Dallas team will be in touch')
    expect(String(c.body)).toContain('The Kawai Dallas team will be in touch')
    expect(String(c.body)).toContain('The holiday offers run through December 31, 2026.')
    expect(c.location).toMatchObject({
      storeName: 'Dallas',
      address: '601 W Plano Pkwy Ste 153, Plano, TX 75075',
      phone: '(972) 379-2200',
      hours: [{ day: 'Mon–Sat', time: '10am–6pm' }],
    })
    expect(c.storefrontUrl).toBe('https://kawaius.com/store/dallas/holiday-sale-event')
    expect(String(c.submissionId)).toMatch(/^holiday-[0-9a-f]{64}$/)
  })

  it('states no financing terms', () => {
    for (const store of Object.values(HOLIDAY_STORES)) {
      const copy = JSON.stringify(holidayConfirmationCopy(store))
      expect(copy).not.toMatch(/\d+(\.\d+)?%|APR|month/i)
    }
  })
})

describe('holiday lead safety valves', () => {
  it('LEAD_NOTIFY_TEST_INBOX redirects both emails, with no CC', async () => {
    process.env.LEAD_NOTIFY_TEST_INBOX = 'qa@example.invalid'
    await notifyHolidayStoreLead(LEAD, 'houston', 'fall-financing')
    expect(resendSends).toHaveLength(1)
    expect(resendSends[0]!.msg.to).toEqual(['qa@example.invalid'])
    expect(resendSends[0]!.msg.cc).toBeUndefined()
    expect(String(resendSends[0]!.msg.subject)).toStartWith('[TEST] ')
    expect(confirmations[0]!.to).toBe('qa@example.invalid')
    expect(String(confirmations[0]!.subject)).toStartWith('[TEST] ')
    expect(confirmations[0]!.liveSendEnabled).toBe(true)
  })

  it('test mode without a test inbox holds both emails', async () => {
    process.env.FALL_FINANCING_TEST_MODE = 'true'
    await notifyHolidayStoreLead(LEAD, 'denver', 'fall-financing')
    expect(resendSends).toHaveLength(0)
    expect(confirmations[0]!.liveSendEnabled).toBe(false)
  })

  it('plans the same thing the action does', () => {
    const plan = planHolidayLeadEmails({ storeSlug: 'st-louis', leadEmail: LEAD.email, testInbox: null, testMode: false })
    expect(plan?.storeSend.to).toBe('st-louis@kawaius.com')
    expect(plan?.confirmationTo).toBe(LEAD.email)
    expect(plan?.live).toBe(true)
    expect(planHolidayLeadEmails({ storeSlug: 'st-louis', leadEmail: LEAD.email, testInbox: 'qa@x.invalid', testMode: true })?.confirmationTo).toBe('qa@x.invalid')
  })

  it('never throws, even when Resend is not configured', async () => {
    delete process.env.RESEND_API_KEY
    await expect(notifyHolidayStoreLead(LEAD, 'dallas', 'fall-financing')).resolves.toBeDefined()
    expect(resendSends).toHaveLength(0)
  })
})

describe('holiday Shopify tags', () => {
  it('holiday pages add holiday-2026-lead to the national tags; the national page does not', () => {
    expect(HOLIDAY_LEAD_TAG).toBe('holiday-2026-lead')
    for (const slug of Object.keys(HOLIDAY_STORES)) {
      expect([...storeLeadCampaign(slug).shopifyTags]).toEqual(['fall-financing', 'q4-2026-financing', 'holiday-2026-lead'])
    }
    expect(leadCampaign.shopifyTags).not.toContain('holiday-2026-lead')
  })
})
