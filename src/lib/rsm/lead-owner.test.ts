import { describe, expect, it } from 'bun:test'

/** Lead owner → HubSpot `rsm` label + Shopify `rsm-*` tag (kawai-lead-rsm-holiday v2). Pure; no mocks. */

const { kawaiName, leadAttributionTags, leadOwnerLabel, ownerFromRecipient, rsmShopifyTag } = await import('./lead-owner')
const { RSM_DIRECTORY, rsmNameFor } = await import('./rsm-directory')
const { resolveLeadRecipient, DEFAULT_CANADA_LEAD_EMAIL, DEFAULT_CANADA_EAST_LEAD_EMAIL } = await import('./lead-envelopes')

const RSM = 'unlisted.rsm@kawaius.com'
const FALLBACK = 'fallback@kawaius.com'

describe('directory', () => {
  it('names only addresses already named in the repo (the two Canadian inboxes)', () => {
    expect(Object.keys(RSM_DIRECTORY).sort()).toEqual(['dmitchell@kawaius.com', 'rrooke@kawaius.com'])
    expect(rsmNameFor(' RRooke@KawaiUS.com ')).toBe('Robin Rooke')
    expect(rsmNameFor(DEFAULT_CANADA_LEAD_EMAIL)).toBe('Dave Mitchell')
    expect(rsmNameFor(RSM)).toBeNull()
    expect(rsmNameFor('')).toBeNull()
    expect(rsmNameFor('constructor')).toBeNull()
  })
})

describe('owner from the notification recipient', () => {
  const owner = (zip: string, o: { sf?: string | null; routing?: boolean; match?: string | null } = {}) =>
    ownerFromRecipient(
      resolveLeadRecipient({
        zip,
        storefrontEmail: o.sf ?? null,
        storefrontRouting: o.routing ?? false,
        matchedRsmEmail: o.match ?? null,
        fallback: FALLBACK,
      }),
      { storefrontName: 'Dallas', matchedRsmEmail: o.match ?? null },
    )

  it('matched RSM → name if on file, else the address (never blank)', () => {
    expect(owner('75201', { match: RSM })).toEqual({ kind: 'rsm', email: RSM })
    expect(leadOwnerLabel(owner('75201', { match: RSM }))).toBe(RSM)
  })

  it('Canada west/east → directory name, else the region', () => {
    expect(leadOwnerLabel(owner('V6B 1A1', { match: RSM }))).toBe('Dave Mitchell')
    expect(leadOwnerLabel(owner('M5V 2T6'))).toBe('Robin Rooke')
    expect(leadOwnerLabel({ kind: 'canada', region: 'east', email: 'someone.else@kawaius.com' })).toBe('Canada East')
    expect(leadOwnerLabel({ kind: 'canada', region: 'west', email: 'someone.else@kawaius.com' })).toBe('Canada West')
    expect(DEFAULT_CANADA_EAST_LEAD_EMAIL).toBe('RRooke@kawaius.com')
  })

  it('storefront owner (routing on) → "Kawai {Showroom}"; routing off → the RSM', () => {
    expect(leadOwnerLabel(owner('75201', { sf: 'dallas@kawaius.com', routing: true, match: RSM }))).toBe('Kawai Dallas')
    expect(leadOwnerLabel(owner('75201', { sf: 'dallas@kawaius.com', routing: false, match: RSM }))).toBe(RSM)
  })

  it('unmatched → the fallback inbox', () => {
    expect(owner('75201')).toEqual({ kind: 'fallback', email: FALLBACK })
    expect(leadOwnerLabel(owner('75201'))).toBe(FALLBACK)
  })

  it('store holiday page → "Kawai {Store}"', () => {
    expect(leadOwnerLabel({ kind: 'store', name: 'St. Louis' })).toBe('Kawai St. Louis')
    expect(kawaiName('Kawai Houston')).toBe('Kawai Houston')
  })
})

describe('Shopify tag', () => {
  it('slugs the label under rsm-', () => {
    expect(rsmShopifyTag('Robin Rooke')).toBe('rsm-robin-rooke')
    expect(rsmShopifyTag('Kawai St. Louis')).toBe('rsm-kawai-st-louis')
    expect(rsmShopifyTag('J.Doe@KawaiUS.com')).toBe('rsm-j-doe-kawaius-com')
    expect(rsmShopifyTag('Canada West')).toBe('rsm-canada-west')
    expect(rsmShopifyTag('')).toBeNull()
    expect(rsmShopifyTag('  ---  ')).toBeNull()
    expect(rsmShopifyTag('x'.repeat(400))!.length).toBeLessThanOrEqual(255)
  })

  it('merges with the location tags', () => {
    expect(
      leadAttributionTags({ storefrontSlug: 'dallas', nearestDealerSlug: 'example-pianos', owner: { kind: 'rsm', email: RSM } }),
    ).toEqual(['dallas', 'storefront-lead', 'dealer-example-pianos', 'rsm-unlisted-rsm-kawaius-com'])
    expect(leadAttributionTags({ owner: { kind: 'store', name: 'Dallas' } })).toEqual(['rsm-kawai-dallas'])
    expect(leadAttributionTags({ owner: { kind: 'fallback', email: '' } })).toEqual([])
  })
})
