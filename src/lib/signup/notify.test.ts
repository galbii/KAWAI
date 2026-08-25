import { describe, expect, it } from 'bun:test'
import { buildNotificationSubject, buildNotificationHtml, sanitizeTag } from './notify-format'

describe('buildNotificationSubject', () => {
  it('substitutes every supported variable', () => {
    const subject = buildNotificationSubject(
      'New signup — {{campaign}} ({{store}}) from {{firstName}}',
      { campaign: 'Fall Open House', store: 'Houston', firstName: 'Ada' },
    )
    expect(subject).toBe('New signup — Fall Open House (Houston) from Ada')
  })

  it('leaves an unknown placeholder untouched rather than printing undefined', () => {
    const subject = buildNotificationSubject('Hi {{nope}}', {
      campaign: 'C',
      store: 'S',
      firstName: 'F',
    })
    expect(subject).toBe('Hi {{nope}}')
  })

  it('falls back to a sane default for an empty template', () => {
    expect(
      buildNotificationSubject('', { campaign: 'C', store: 'S', firstName: 'F' }),
    ).toBe('New signup — C (S)')
  })
})

describe('buildNotificationHtml', () => {
  const base = {
    campaignTitle: 'Fall Open House',
    storeName: 'Houston',
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@example.com',
    phone: '5551234567',
    zip: '77002',
    answers: [{ name: 'instrument', label: 'Which instrument?', value: 'Piano' }],
    sourceUrl: 'https://kawaius.com/store/houston/signup',
  }

  it('includes the contact core and every answer', () => {
    const html = buildNotificationHtml(base)
    expect(html).toContain('ada@example.com')
    expect(html).toContain('Which instrument?')
    expect(html).toContain('Piano')
  })

  it('escapes HTML so a lead cannot inject markup into the inbox', () => {
    const html = buildNotificationHtml({ ...base, firstName: '<script>alert(1)</script>' })
    expect(html).not.toContain('<script>')
    expect(html).toContain('&lt;script&gt;')
  })

  it('omits rows for fields that were not collected', () => {
    const html = buildNotificationHtml({ ...base, phone: undefined, zip: undefined })
    expect(html).not.toContain('Phone')
    expect(html).not.toContain('ZIP')
  })
})

describe('sanitizeTag', () => {
  it('strips characters Resend rejects in tag values', () => {
    expect(sanitizeTag('fall open/house!')).toBe('fall-open-house-')
  })

  it('keeps letters, numbers, dashes and underscores', () => {
    expect(sanitizeTag('fall-open_house2')).toBe('fall-open_house2')
  })
})
