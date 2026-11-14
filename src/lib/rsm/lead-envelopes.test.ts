import { afterEach, describe, expect, it } from 'bun:test'
import {
  DEFAULT_CANADA_EAST_LEAD_EMAIL,
  DEFAULT_CANADA_LEAD_EMAIL,
  canadaInboxSource,
  canadaRegionForZip,
  isCanadianLeadZip,
  resolveLeadRecipient,
  resolveRsmRecipient,
} from './lead-envelopes'

/**
 * Canada override — the one place a lead's recipient is decided by its postal
 * code rather than by the nearest-dealer match. Worth pinning down: the regex
 * is the only thing standing between a mistyped US ZIP and the Canadian inbox.
 */

const MATCHED = 'rsm@example.com'
const FALLBACK = 'fallback@kawaius.com'

const WEST = DEFAULT_CANADA_LEAD_EMAIL // Dave Mitchell
const EAST = DEFAULT_CANADA_EAST_LEAD_EMAIL // Robin Rooke

afterEach(() => {
  delete process.env.LEAD_NOTIFY_CANADA_EMAIL
  delete process.env.LEAD_NOTIFY_CANADA_EAST_EMAIL
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

/** One real postal code per first letter Canada Post issues, with its region. */
const BY_LETTER: [letter: string, zip: string, region: 'west' | 'east'][] = [
  ['V', 'V6B 1A1', 'west'], // BC
  ['T', 'T2P 2M5', 'west'], // AB
  ['S', 'S4P 3Y2', 'west'], // SK
  ['R', 'R3C 4T3', 'west'], // MB
  ['X', 'X1A 2L9', 'west'], // NT / NU (territories: flagged default)
  ['Y', 'Y1A 2C6', 'west'], // YT (territories: flagged default)
  ['K', 'K1P 1J1', 'east'], // ON
  ['L', 'L8P 4R5', 'east'], // ON
  ['M', 'M5V 3L9', 'east'], // ON
  ['N', 'N6A 3K7', 'east'], // ON
  ['P', 'P3E 2C6', 'east'], // ON
  ['G', 'G1R 4P5', 'east'], // QC
  ['H', 'H3B 1A7', 'east'], // QC
  ['J', 'J4K 2T5', 'east'], // QC
  ['B', 'B3H 1A1', 'east'], // NS
  ['C', 'C1A 4P3', 'east'], // PE
  ['E', 'E1C 4M3', 'east'], // NB
  ['A', 'A1C 5M2', 'east'], // NL
]

describe('resolveRsmRecipient — Canada split by postal first letter', () => {
  for (const [letter, zip, region] of BY_LETTER) {
    it(`${letter} (${zip}) → ${region}`, () => {
      const expected = { to: region === 'east' ? EAST : WEST, canadaOverride: true, canadaRegion: region }
      expect(resolveRsmRecipient(zip, MATCHED, FALLBACK)).toEqual(expected)
      // lowercase, no-space and hyphen forms land the same
      expect(resolveRsmRecipient(zip.toLowerCase(), MATCHED, FALLBACK)).toEqual(expected)
      expect(resolveRsmRecipient(zip.replace(' ', ''), MATCHED, FALLBACK)).toEqual(expected)
      expect(resolveRsmRecipient(zip.replace(' ', '-'), null, FALLBACK)).toEqual(expected)
      // FSA-only input
      expect(resolveRsmRecipient(zip.slice(0, 3), MATCHED, FALLBACK)).toEqual(expected)
      expect(canadaRegionForZip(zip)).toBe(region)
    })
  }

  it('covers all 18 letters Canada Post issues', () => {
    expect(BY_LETTER.map(([l]) => l).sort().join('')).toBe('ABCEGHJKLMNPRSTVXY')
  })

  it('overrides the matched RSM and works when nothing matched', () => {
    expect(resolveRsmRecipient(' m5v3l9 ', null, FALLBACK).to).toBe(EAST)
    expect(resolveRsmRecipient('v6b', null, FALLBACK).to).toBe(WEST)
  })

  it('sends a postal-shaped code with a letter Canada Post never issues to the west inbox', () => {
    expect(canadaRegionForZip('W1A 1A1')).toBeNull()
    expect(resolveRsmRecipient('W1A 1A1', MATCHED, FALLBACK)).toEqual({
      to: WEST,
      canadaOverride: true,
      canadaRegion: 'west',
    })
  })
})

describe('Canada inboxes — env vars', () => {
  it('east var unset → Robin default', () => {
    delete process.env.LEAD_NOTIFY_CANADA_EAST_EMAIL
    expect(resolveRsmRecipient('M5V 3L9', MATCHED, FALLBACK).to).toBe('RRooke@kawaius.com')
  })

  it('east var blank or whitespace → Robin default, never an empty recipient', () => {
    for (const blank of ['', '   ']) {
      process.env.LEAD_NOTIFY_CANADA_EAST_EMAIL = blank
      const { to } = resolveRsmRecipient('H3B 1A7', MATCHED, FALLBACK)
      expect(to).toBe('RRooke@kawaius.com')
      expect(to).not.toBe('')
    }
  })

  it('east var set → overrides the Robin default, east only', () => {
    process.env.LEAD_NOTIFY_CANADA_EAST_EMAIL = ' east@kawaius.com '
    expect(resolveRsmRecipient('A1C 5M2', MATCHED, FALLBACK).to).toBe('east@kawaius.com')
    expect(resolveRsmRecipient('V6B 1A1', MATCHED, FALLBACK).to).toBe(WEST)
  })

  it('west var set → overrides Dave, west only; blank → Dave', () => {
    process.env.LEAD_NOTIFY_CANADA_EMAIL = 'someone@kawaius.com'
    expect(resolveRsmRecipient('T2P 2M5', MATCHED, FALLBACK).to).toBe('someone@kawaius.com')
    expect(resolveRsmRecipient('M5V 3L9', MATCHED, FALLBACK).to).toBe(EAST)

    process.env.LEAD_NOTIFY_CANADA_EMAIL = ''
    expect(resolveRsmRecipient('T2P 2M5', MATCHED, FALLBACK).to).toBe(WEST)
  })

  it('canadaInboxSource names the var and whether it is set, never its value', () => {
    expect(canadaInboxSource('east')).toEqual({ envVar: 'LEAD_NOTIFY_CANADA_EAST_EMAIL', fromEnv: false })
    process.env.LEAD_NOTIFY_CANADA_EMAIL = 'someone@kawaius.com'
    const west = canadaInboxSource('west')
    expect(west).toEqual({ envVar: 'LEAD_NOTIFY_CANADA_EMAIL', fromEnv: true })
    expect(JSON.stringify(west)).not.toContain('someone')
  })
})

describe('resolveRsmRecipient — US ZIPs unchanged', () => {
  it('leaves US leads on the matched RSM with no region', () => {
    expect(resolveRsmRecipient('63367', MATCHED, FALLBACK)).toEqual({
      to: 'rsm@example.com',
      canadaOverride: false,
    })
  })

  it('still falls back for unmatched US leads', () => {
    expect(resolveRsmRecipient('63367', null, FALLBACK).to).toBe(FALLBACK)
    expect(resolveRsmRecipient('90210-1234', null, FALLBACK)).toEqual({ to: FALLBACK, canadaOverride: false })
  })
})

describe('resolveLeadRecipient — storefront instead of RSM', () => {
  const STOREFRONT = 'stlouis@kawaius.com'
  const base = { matchedRsmEmail: MATCHED, fallback: FALLBACK }

  it('sends a storefront-area lead to the storefront, not the RSM', () => {
    expect(
      resolveLeadRecipient({ ...base, zip: '63122', storefrontEmail: STOREFRONT, storefrontRouting: true }),
    ).toEqual({ kind: 'storefront', to: STOREFRONT, canadaOverride: false })
  })

  it('keeps the lead on the RSM path while storefront routing is off', () => {
    expect(
      resolveLeadRecipient({ ...base, zip: '63122', storefrontEmail: STOREFRONT, storefrontRouting: false }),
    ).toEqual({ kind: 'rsm', to: MATCHED, canadaOverride: false })
  })

  it('falls back to the RSM when the storefront has no contact email', () => {
    for (const storefrontEmail of [null, undefined, '', '   ']) {
      expect(
        resolveLeadRecipient({ ...base, zip: '63122', storefrontEmail, storefrontRouting: true }).kind,
      ).toBe('rsm')
    }
  })

  it('outranks the Canada override when a storefront owns the postal code', () => {
    expect(
      resolveLeadRecipient({ ...base, zip: 'M5V 2T6', storefrontEmail: STOREFRONT, storefrontRouting: true }).to,
    ).toBe(STOREFRONT)
  })

  it('outranks the Canada override for a western postal code too', () => {
    expect(
      resolveLeadRecipient({ ...base, zip: 'V6B 1A1', storefrontEmail: STOREFRONT, storefrontRouting: true }),
    ).toEqual({ kind: 'storefront', to: STOREFRONT, canadaOverride: false })
  })

  it('leaves Canada and fallback routing intact without a storefront', () => {
    expect(
      resolveLeadRecipient({ ...base, zip: 'M5V 2T6', storefrontEmail: null, storefrontRouting: true }),
    ).toEqual({ kind: 'rsm', to: EAST, canadaOverride: true, canadaRegion: 'east' })
    expect(
      resolveLeadRecipient({ ...base, zip: 'T5J 0N3', storefrontEmail: null, storefrontRouting: false }),
    ).toEqual({ kind: 'rsm', to: WEST, canadaOverride: true, canadaRegion: 'west' })
    expect(
      resolveLeadRecipient({
        zip: '63122',
        storefrontEmail: null,
        storefrontRouting: true,
        matchedRsmEmail: null,
        fallback: FALLBACK,
      }).to,
    ).toBe(FALLBACK)
  })
})
