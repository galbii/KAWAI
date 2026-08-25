import { afterEach, describe, expect, it } from 'bun:test'
import { resolveSignupRecipients } from './recipients'

afterEach(() => {
  delete process.env.LEAD_NOTIFY_CC_EMAIL
  delete process.env.LEAD_NOTIFY_FALLBACK_EMAIL
})

const BASE = {
  recipients: ['events@kawaius.com'],
  cc: [],
  includeStorefrontEmail: false,
  includeSchoolEmail: false,
  storefrontEmail: 'houston@kawaius.com',
  schoolEmail: 'school-houston@kawaius.com',
  rsmEmail: null,
}

describe('resolveSignupRecipients', () => {
  it('uses the explicit campaign list by default', () => {
    expect(resolveSignupRecipients(BASE).to).toEqual(['events@kawaius.com'])
  })

  it('adds the storefront email only when the toggle is on', () => {
    const on = resolveSignupRecipients({ ...BASE, includeStorefrontEmail: true })
    expect(on.to).toContain('houston@kawaius.com')
    expect(resolveSignupRecipients(BASE).to).not.toContain('houston@kawaius.com')
  })

  it('adds the school email only when the toggle is on', () => {
    const on = resolveSignupRecipients({ ...BASE, includeSchoolEmail: true })
    expect(on.to).toContain('school-houston@kawaius.com')
  })

  it('adds a matched RSM when one was resolved', () => {
    const out = resolveSignupRecipients({ ...BASE, rsmEmail: 'rsm@kawaius.com' })
    expect(out.to).toContain('rsm@kawaius.com')
  })

  it('skips a toggled-on source that has no address', () => {
    const out = resolveSignupRecipients({
      ...BASE,
      includeStorefrontEmail: true,
      storefrontEmail: null,
    })
    expect(out.to).toEqual(['events@kawaius.com'])
  })

  it('deduplicates case-insensitively and preserves first-seen casing', () => {
    const out = resolveSignupRecipients({
      ...BASE,
      recipients: ['Events@kawaius.com', 'events@KAWAIUS.com'],
      includeStorefrontEmail: true,
      storefrontEmail: 'EVENTS@kawaius.com',
    })
    expect(out.to).toEqual(['Events@kawaius.com'])
  })

  it('falls back rather than resolving to nobody', () => {
    process.env.LEAD_NOTIFY_FALLBACK_EMAIL = 'fallback@kawaius.com'
    const out = resolveSignupRecipients({ ...BASE, recipients: [] })
    expect(out.to).toEqual(['fallback@kawaius.com'])
  })

  it('defaults cc to the corporate inbox and never duplicates it into to', () => {
    process.env.LEAD_NOTIFY_CC_EMAIL = 'contact@kawaius.com'
    expect(resolveSignupRecipients(BASE).cc).toEqual(['contact@kawaius.com'])

    const overlap = resolveSignupRecipients({ ...BASE, recipients: ['contact@kawaius.com'] })
    expect(overlap.cc).toEqual([])
  })

  it('prefers an explicit cc list over the default', () => {
    process.env.LEAD_NOTIFY_CC_EMAIL = 'contact@kawaius.com'
    const out = resolveSignupRecipients({ ...BASE, cc: ['ops@kawaius.com'] })
    expect(out.cc).toEqual(['ops@kawaius.com'])
  })

  it('trims and drops blank entries', () => {
    const out = resolveSignupRecipients({
      ...BASE,
      recipients: ['  events@kawaius.com  ', '', '   '],
    })
    expect(out.to).toEqual(['events@kawaius.com'])
  })
})
