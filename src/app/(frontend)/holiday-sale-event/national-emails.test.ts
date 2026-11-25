import { afterEach, beforeEach, describe, expect, it } from 'bun:test'

/**
 * The national /holiday-sale-event lead emails (kawai-lead-rsm-holiday v1).
 *
 * Pure builders plus the orchestrator with fake senders: no module mocks,
 * nothing reaches Resend, Payload, HubSpot or Shopify.
 */

const {
  buildNationalConfirmationEmail,
  buildNationalRsmEmail,
  buildNationalRsmSubject,
  buildNationalStorefrontEmail,
  kawaiAmericaContact,
  nationalHolidayTemplates,
} = await import('./national-emails')
const { sendNationalHolidayLead } = await import('./national-lead')
const { renderBrandedEmail } = await import('@/lib/email/branded-email')

const LEAD = {
  firstname: 'Ada',
  lastname: 'Lead',
  email: 'ada@example.invalid',
  phone: '5555550100',
  zip: '75201',
  piano_type: 'Grand Piano;Digital Piano',
  when_are_you_looking_to_purchase_: 'within_30_days',
}
const contact = kawaiAmericaContact('contact@kawaius.com')
const MATCH = {
  rsmEmail: 'rsm.secret@kawaius.com',
  distance: 4.26,
  dealer: { dealerName: 'Example Pianos', address: { city: 'Dallas', state: 'TX' }, region: 'South' },
} as never
const STOREFRONT = {
  id: 'sf1',
  slug: 'dallas',
  name: 'Dallas',
  location: 'Plano, TX',
  phone: '(972) 379-2200',
  email: 'dallas@kawaius.com',
  distance: 12.34,
  coveredZip: false,
  href: '/store/dallas',
}

describe('RSM notification (holiday branded, same routing facts)', () => {
  it('uses the shared Kawai branded shell (logo, footer) with HTML and plain text', () => {
    const email = buildNationalRsmEmail({ lead: LEAD, match: MATCH, source: 'fall-financing', dealerNotified: false, storefront: null, contact })
    expect(email.html).toContain('kawai-logo-red-3x.png')
    expect(email.html).toContain('Holiday Sale Event · New Sales Lead')
    expect(email.html).toContain('Kawai America')
    expect(email.text).toContain('A visitor asked about the Kawai Holiday Sale Event')
    expect(email.text).toContain('Email: ada@example.invalid')
  })

  it('carries the lead details and the nearest dealer readout', () => {
    const email = buildNationalRsmEmail({ lead: LEAD, match: MATCH, source: 'fall-financing', dealerNotified: false, storefront: null, contact })
    for (const s of ['Ada Lead', 'ada@example.invalid', '5555550100', '75201', 'Grand Piano, Digital Piano', 'within 30 days']) {
      expect(email.html).toContain(s)
    }
    expect(email.html).toContain('Nearest dealer to this lead')
    expect(email.html).toContain('Example Pianos')
    expect(email.html).toContain('Dallas, TX')
    expect(email.html).toContain('4.3 miles from lead')
    expect(email.html).toContain('South')
    expect(email.html).not.toContain('No RSM-managed dealer')
  })

  it('never names the RSM address it was routed to', () => {
    const email = buildNationalRsmEmail({ lead: LEAD, match: MATCH, source: 'fall-financing', dealerNotified: false, storefront: null, contact })
    expect(email.html).not.toContain('rsm.secret@kawaius.com')
    expect(email.text).not.toContain('rsm.secret@kawaius.com')
  })

  it('names a nearby showroom, not sent the lead', () => {
    const email = buildNationalRsmEmail({ lead: LEAD, match: MATCH, source: 'fall-financing', dealerNotified: false, storefront: STOREFRONT, contact })
    expect(email.html).toContain('Nearest Kawai showroom')
    expect(email.html).toContain('Kawai Dallas')
    expect(email.html).toContain('12.3 mi from the lead')
    expect(email.text).toContain('The showroom has not been sent this lead.')
  })

  it('warns when the ZIP is unmatched', () => {
    const email = buildNationalRsmEmail({ lead: LEAD, match: null, source: 'fall-financing', dealerNotified: false, storefront: null, contact })
    expect(email.subject).toBe('New Holiday Sale Event lead — 75201 (unmatched)')
    expect(email.html).toContain('No RSM-managed dealer could be matched')
  })

  it('subjects mirror today’s routing facts, holiday-named', () => {
    expect(buildNationalRsmSubject({ lead: LEAD, match: MATCH })).toBe('New Holiday Sale Event lead near Dallas — 75201')
    expect(buildNationalRsmSubject({ lead: LEAD, match: MATCH, test: {} })).toBe('[TEST] New Holiday Sale Event lead near Dallas — 75201')
  })

  it('a test copy carries the banner with the live envelope, in HTML and text', () => {
    const envelope = { to: 'rsm.secret@kawaius.com', cc: ['contact@kawaius.com'], bcc: [] }
    const email = buildNationalRsmEmail({
      lead: LEAD,
      match: MATCH,
      source: 'fall-financing',
      dealerNotified: false,
      storefront: null,
      contact,
      test: { label: 'RSM notification', envelope },
    })
    expect(email.subject.startsWith('[TEST] ')).toBe(true)
    expect(email.html).toContain('Test email — not a real lead — RSM notification')
    expect(email.text).toContain('To: rsm.secret@kawaius.com')
    expect(email.text).toContain('Cc: contact@kawaius.com')
  })

  it('escapes visitor input', () => {
    const email = buildNationalRsmEmail({
      lead: { ...LEAD, firstname: '<script>x</script>' },
      match: null,
      source: 'fall-financing',
      dealerNotified: false,
      storefront: null,
      contact,
    })
    expect(email.html).not.toContain('<script>x</script>')
    expect(email.html).toContain('&lt;script&gt;')
  })
})

describe('storefront variant and the templates adapter', () => {
  it('storefront owner gets the narrow "in your area" email, no routing readout', () => {
    const email = buildNationalStorefrontEmail({ lead: LEAD, storefrontName: 'Kawai Dallas', source: 'fall-financing', contact })
    expect(email.subject).toBe('New Holiday Sale Event lead — Ada Lead')
    expect(email.html).toContain('Hello Kawai Dallas,')
    expect(email.html).toContain('A new lead in your area')
    expect(email.html).not.toContain('Nearest dealer')
  })

  it('nationalHolidayTemplates wires both owner emails', () => {
    const t = nationalHolidayTemplates(contact)
    const rsm = t.rsm({ lead: LEAD, match: MATCH, source: 'fall-financing', dealerNotified: false, storefront: null })
    expect(rsm.subject).toBe('New Holiday Sale Event lead near Dallas — 75201')
    expect(rsm.text).toBeTruthy()
    const sf = t.storefront({ lead: LEAD, storefrontName: 'Kawai Dallas', source: 'fall-financing' })
    expect(sf.html).toContain('Hello Kawai Dallas,')
  })
})

describe('visitor confirmation', () => {
  it('thanks the visitor, names the end date, no rates, signed Kawai America', () => {
    const email = buildNationalConfirmationEmail({ firstName: 'Ada', contact })
    expect(email.subject).toBe('Thanks — your local Kawai dealer will be in touch')
    expect(email.html).toContain('Hi Ada,')
    expect(email.html).toContain('December 31, 2026')
    expect(email.html).toContain('https://kawaius.com/holiday-sale-event')
    expect(email.html).toContain('contact@kawaius.com')
    expect(email.text).not.toMatch(/\d+(\.\d+)?%|APR/)
    expect(email.text).toContain('The holiday offers run through December 31, 2026.')
    expect(buildNationalConfirmationEmail({ firstName: 'Ada', contact, test: true }).subject).toBe(
      '[TEST] Thanks — your local Kawai dealer will be in touch',
    )
  })

  it('is the same shell as the store holiday emails', () => {
    const email = buildNationalConfirmationEmail({ firstName: 'Ada', contact })
    const shell = renderBrandedEmail({ subject: 's', eyebrow: 'e', title: 't', contentHtml: '', contentText: '', store: contact })
    const head = (html: string) => html.slice(0, html.indexOf('<title>'))
    expect(head(email.html)).toBe(head(shell.html))
  })
})

describe('sendNationalHolidayLead (fake senders)', () => {
  const ENV = ['LEAD_NOTIFY_TEST_INBOX', 'FALL_FINANCING_TEST_MODE', 'LEAD_NOTIFY_CC_EMAIL'] as const
  const saved: Record<string, string | undefined> = {}
  beforeEach(() => {
    for (const k of ENV) {
      saved[k] = process.env[k]
      delete process.env[k]
    }
  })
  afterEach(() => {
    for (const k of ENV) {
      if (saved[k] === undefined) delete process.env[k]
      else process.env[k] = saved[k]
    }
  })

  const fakes = () => {
    const notifyCalls: Array<{ values: unknown; source: string; options: Record<string, unknown> }> = []
    const confirmCalls: Array<Record<string, unknown>> = []
    return {
      notifyCalls,
      confirmCalls,
      deps: {
        runLeadNotification: async (values: Record<string, string>, source: string, options: object) => {
          notifyCalls.push({ values, source, options: options as Record<string, unknown> })
          return { success: true }
        },
        sendLeadConfirmation: async (input: Record<string, unknown>) => {
          confirmCalls.push(input)
          return { status: input.liveSendEnabled ? ('sent' as const) : ('skipped' as const) }
        },
      },
    }
  }

  it('runs the national routing with holiday templates and a namespaced idempotency key', async () => {
    const f = fakes()
    const res = await sendNationalHolidayLead(LEAD, 'fall-financing', f.deps)
    expect(res.success).toBe(true)
    expect(f.notifyCalls).toHaveLength(1)
    expect(f.notifyCalls[0]!.source).toBe('fall-financing')
    expect(f.notifyCalls[0]!.values).toEqual(LEAD)
    expect(f.notifyCalls[0]!.options.idempotencyNamespace).toBe('holiday-national')
    expect(typeof (f.notifyCalls[0]!.options.templates as { rsm: unknown }).rsm).toBe('function')
  })

  it('confirms to the lead, replies to the corporate inbox, branded HTML + text', async () => {
    const f = fakes()
    await sendNationalHolidayLead(LEAD, 'fall-financing', f.deps)
    const c = f.confirmCalls[0]!
    expect(c.to).toBe('ada@example.invalid')
    expect(c.replyTo).toBe('contact@kawaius.com')
    expect(c.liveSendEnabled).toBe(true)
    expect(String(c.submissionId)).toMatch(/^holiday-national-[0-9a-f]{64}$/)
    const rendered = c.rendered as { html: string; text: string }
    expect(rendered.html).toContain('kawai-logo-red-3x.png')
    expect(rendered.text).toContain('Hi Ada,')
  })

  it('LEAD_NOTIFY_TEST_INBOX redirects the confirmation and marks it [TEST]', async () => {
    process.env.LEAD_NOTIFY_TEST_INBOX = 'qa@example.invalid'
    process.env.FALL_FINANCING_TEST_MODE = 'true'
    const f = fakes()
    await sendNationalHolidayLead(LEAD, 'fall-financing', f.deps)
    expect(f.confirmCalls[0]!.to).toBe('qa@example.invalid')
    expect(f.confirmCalls[0]!.liveSendEnabled).toBe(true)
    expect(String(f.confirmCalls[0]!.subject).startsWith('[TEST] ')).toBe(true)
  })

  it('test mode without a test inbox holds the confirmation', async () => {
    process.env.FALL_FINANCING_TEST_MODE = 'true'
    const f = fakes()
    await sendNationalHolidayLead(LEAD, 'fall-financing', f.deps)
    expect(f.confirmCalls[0]!.liveSendEnabled).toBe(false)
  })

  it('an invalid payload sends no confirmation; a failing sender never throws', async () => {
    const f = fakes()
    await sendNationalHolidayLead({ email: 'not-an-email', zip: '1' }, 'fall-financing', f.deps)
    expect(f.confirmCalls).toHaveLength(0)
    const res = await sendNationalHolidayLead(LEAD, 'fall-financing', {
      runLeadNotification: async () => {
        throw new Error('boom')
      },
      sendLeadConfirmation: async () => {
        throw new Error('boom')
      },
    })
    expect(res.success).toBe(false)
  })
})
