import { afterEach, describe, expect, it } from 'bun:test'
import {
  DEFAULT_CANADA_LEAD_EMAIL,
  isCanadianLeadZip,
  resolveRsmRecipient,
} from './lead-envelopes'

/**
 * Canada override — the one place a lead's recipient is decided by its postal
 * code rather than by the nearest-dealer match. Worth pinning down: the regex
 * is the only thing standing between a mistyped US ZIP and the Canadian inbox.
 */

const MATCHED = 'rsm@example.com'
const FALLBACK = 'fallback@kawaius.com'

afterEach(() => {
  delete process.env.LEAD_NOTIFY_CANADA_EMAIL
})

describe('isCanadianLeadZip', () => {
  it('accepts full postal codes in every format visitors type', () => {
    for (const zip of ['M5V 3L9', 'm5v3l9', 'M5V-3L9', ' K1A 0B1 ']) {
      expect(isCanadianLeadZip(zip)).toBe(true)
    }
  })

  it('accepts the 3-character FSA on its own', () => {
    expect(isCanadianLeadZip('M5V')).toBe(true)
    expect(isCanadianLeadZip('v6b')).toBe(true)
  })

  it('rejects US ZIPs, partials and junk', () => {
    for (const zip of ['63367', '90210-1234', '1234', 'abcdef', '', 'M5V 3L', 'M5V 3L99']) {
      expect(isCanadianLeadZip(zip)).toBe(false)
    }
  })
})

describe('resolveRsmRecipient', () => {
  it('routes Canadian leads to the national inbox over the matched RSM', () => {
    expect(resolveRsmRecipient('M5V 3L9', MATCHED, FALLBACK)).toEqual({
      to: DEFAULT_CANADA_LEAD_EMAIL,
      canadaOverride: true,
    })
  })

  it('routes Canadian leads there even when nothing matched', () => {
    expect(resolveRsmRecipient('k1a0b1', null, FALLBACK).to).toBe(DEFAULT_CANADA_LEAD_EMAIL)
  })

  it('leaves US leads on the matched RSM', () => {
    expect(resolveRsmRecipient('63367', MATCHED, FALLBACK)).toEqual({
      to: 'rsm@example.com',
      canadaOverride: false,
    })
  })

  it('still falls back for unmatched US leads', () => {
    expect(resolveRsmRecipient('63367', null, FALLBACK).to).toBe(FALLBACK)
  })

  it('honours LEAD_NOTIFY_CANADA_EMAIL, ignoring a blank one', () => {
    process.env.LEAD_NOTIFY_CANADA_EMAIL = 'someone@kawaius.com'
    expect(resolveRsmRecipient('M5V 3L9', MATCHED, FALLBACK).to).toBe('someone@kawaius.com')

    process.env.LEAD_NOTIFY_CANADA_EMAIL = ''
    expect(resolveRsmRecipient('M5V 3L9', MATCHED, FALLBACK).to).toBe(DEFAULT_CANADA_LEAD_EMAIL)
  })
})
