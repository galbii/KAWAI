import { describe, expect, it } from 'bun:test'
import { kawaiLogoUrl, storeContactFromStorefront } from '@/lib/email/branded-email'
import { buildHolidayConfirmationEmail, buildHolidayStoreNotificationEmail } from './holiday-emails'
import { HOLIDAY_STOREFRONT_FIXTURES } from './holiday-emails.fixtures'
import { HOLIDAY_STORES, holidayConfirmationCopy } from './store-inbox'

/**
 * Pure builders only: no Resend, no Payload, no mock.module (so file order
 * cannot leak mocks into or out of this file).
 */

const LEAD = {
  firstname: 'Ada',
  lastname: 'Lead',
  email: 'ada@example.invalid',
  phone: '5555550100',
  zip: '75201',
  piano_type: 'Grand;Digital',
}

const slugs = Object.keys(HOLIDAY_STORES) as Array<keyof typeof HOLIDAY_STORES>

function contactFor(slug: keyof typeof HOLIDAY_STORES) {
  return storeContactFromStorefront(HOLIDAY_STOREFRONT_FIXTURES[slug], {
    displayName: HOLIDAY_STORES[slug].name,
    pageUrl: `https://kawaius.com/store/${slug}/holiday-sale-event`,
  })
}

describe('holiday confirmation email (customer)', () => {
  for (const slug of slugs) {
    it(`${slug}: today's subject and words, branded, signed by the store`, () => {
      const store = HOLIDAY_STORES[slug]
      const contact = contactFor(slug)
      const copy = holidayConfirmationCopy(store)
      const email = buildHolidayConfirmationEmail({ firstName: 'Ada', store, contact })

      expect(email.subject).toBe(copy.subject)
      expect(email.html).toContain(kawaiLogoUrl())
      for (const out of [email.html, email.text]) {
        expect(out).toContain('Hi Ada,')
        expect(out).toContain('Holiday Sale Event')
        expect(out).toContain(`Kawai ${store.name}`)
        expect(out).toContain(contact.address!)
        expect(out).toContain(contact.phone!)
        expect(out).toContain('December 31, 2026')
      }
      // The body copy reads the same in both parts (HTML escapes the apostrophe).
      expect(email.text).toContain(copy.body)
      expect(email.html).toContain('Get directions')
    })
  }

  it('states no rates or financing terms', () => {
    for (const slug of slugs) {
      const email = buildHolidayConfirmationEmail({ firstName: 'Ada', store: HOLIDAY_STORES[slug], contact: contactFor(slug) })
            for (const part of [email.text, email.html]) {
        // Visible words only: no URLs (%2C), no <style>/attributes (width:100%).
        const words = part
          .replace(/<style[\s\S]*?<\/style>/g, '')
          .replace(/<[^>]*>/g, ' ')
          .replace(/https?:\/\/\S+/g, '')
        expect(words).not.toMatch(/\d+(\.\d+)?\s*%|\bAPR\b|Synchrony|per month|\/mo\b/)
        expect(words).not.toMatch(/financ/i)
      }
    }
  })

  it('escapes the customer name and prefixes [TEST] for a test inbox', () => {
    const email = buildHolidayConfirmationEmail({
      firstName: '<b>Ada</b>',
      store: HOLIDAY_STORES.dallas,
      contact: contactFor('dallas'),
      test: true,
    })
    expect(email.subject).toStartWith('[TEST] ')
    expect(email.html).toContain('Hi &lt;b&gt;Ada&lt;/b&gt;,')
    expect(email.html).not.toContain('<b>Ada</b>')
  })
})

describe('holiday store notification email (store inbox)', () => {
  for (const slug of slugs) {
    it(`${slug}: today's subject, lead details, reply prompt, store footer`, () => {
      const contact = contactFor(slug)
      const email = buildHolidayStoreNotificationEmail({ lead: LEAD, contact, source: 'fall-financing' })

      expect(email.subject).toBe('New Kawai lead — Ada Lead')
      expect(email.html).toContain(kawaiLogoUrl())
      for (const out of [email.html, email.text]) {
        expect(out).toContain('Someone chose your showroom')
        expect(out).toContain(`Hello ${contact.name},`)
        expect(out).toContain('ada@example.invalid')
        expect(out).toContain('5555550100')
        expect(out).toContain('Grand, Digital')
        expect(out).toContain('Just hit reply')
        expect(out).toContain(contact.address!)
        expect(out).toContain('(source: fall-financing)')
      }
      expect(email.html).not.toContain('Test email')
    })
  }

  it('a test-inbox copy carries the test banner and the live envelope in both parts', () => {
    const email = buildHolidayStoreNotificationEmail({
      lead: LEAD,
      contact: contactFor('houston'),
      source: 'fall-financing',
      test: {
        label: 'Holiday store notification',
        envelope: { to: 'houston@kawaius.com', cc: ['contact@kawaius.com'], bcc: [] },
      },
    })
    expect(email.subject).toBe('[TEST] New Kawai lead — Ada Lead')
    expect(email.html).toContain('Test email — not a real lead')
    expect(email.text).toContain('TEST EMAIL — not a real lead — Holiday store notification.')
    expect(email.text).toContain('To: houston@kawaius.com')
    expect(email.text).toContain('Cc: contact@kawaius.com')
  })

  it('escapes lead-supplied values', () => {
    const email = buildHolidayStoreNotificationEmail({
      lead: { ...LEAD, firstname: '<script>x</script>' },
      contact: contactFor('denver'),
      source: 'fall-financing',
    })
    expect(email.html).not.toContain('<script>')
  })
})
