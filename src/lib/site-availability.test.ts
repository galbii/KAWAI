/**
 * Tests for per-document US / Canada site availability.
 * Run with: bun test src/lib/site-availability.test.ts
 */

import { describe, test, expect } from 'bun:test'
import {
  availableOnSite,
  exclusiveSite,
  isAvailableOnSite,
  siteFromHost,
  sitesFor,
} from './site-availability'

describe('availableOnSite', () => {
  test('excludes only documents exclusive to the other site', () => {
    expect(availableOnSite('us')).toEqual({ siteAvailability: { not_equals: 'cad' } })
    expect(availableOnSite('cad')).toEqual({ siteAvailability: { not_equals: 'us' } })
  })

  test('uses not_equals so documents without the field (the existing catalog) still match', () => {
    for (const site of ['us', 'cad'] as const) {
      const condition = Object.values(availableOnSite(site))[0]
      expect(Object.keys(condition as object)).toEqual(['not_equals'])
    }
  })

  test('accepts a custom (e.g. nested) field path', () => {
    expect(availableOnSite('us', 'settings.siteAvailability')).toEqual({
      'settings.siteAvailability': { not_equals: 'cad' },
    })
  })
})

describe('isAvailableOnSite / sitesFor', () => {
  test('missing, null, and "all" are available everywhere', () => {
    for (const doc of [{}, { siteAvailability: null }, { siteAvailability: 'all' }, null, undefined]) {
      expect(isAvailableOnSite(doc, 'us')).toBe(true)
      expect(isAvailableOnSite(doc, 'cad')).toBe(true)
      expect(sitesFor(doc)).toEqual(['us', 'cad'])
    }
  })

  test('US-only is hidden on Canada', () => {
    expect(isAvailableOnSite({ siteAvailability: 'us' }, 'us')).toBe(true)
    expect(isAvailableOnSite({ siteAvailability: 'us' }, 'cad')).toBe(false)
  })

  test('Canada-only is hidden on US', () => {
    expect(isAvailableOnSite({ siteAvailability: 'cad' }, 'cad')).toBe(true)
    expect(isAvailableOnSite({ siteAvailability: 'cad' }, 'us')).toBe(false)
  })

  test('unknown values fail open rather than de-listing the document', () => {
    expect(sitesFor({ siteAvailability: 'mars' })).toEqual(['us', 'cad'])
  })
})

describe('exclusiveSite', () => {
  test('returns the one site for a restricted document, null otherwise', () => {
    expect(exclusiveSite({ siteAvailability: 'us' })).toBe('us')
    expect(exclusiveSite({ siteAvailability: 'cad' })).toBe('cad')
    expect(exclusiveSite({ siteAvailability: 'all' })).toBeNull()
    expect(exclusiveSite({})).toBeNull()
  })
})

describe('siteFromHost', () => {
  test('ca. subdomain is Canada, everything else is US', () => {
    expect(siteFromHost('ca.kawaius.com')).toBe('cad')
    expect(siteFromHost('ca.localhost:3000')).toBe('cad')
    expect(siteFromHost('kawaius.com')).toBe('us')
    expect(siteFromHost('www.kawaius.com')).toBe('us')
    expect(siteFromHost('localhost:3000')).toBe('us')
    expect(siteFromHost(null)).toBe('us')
    expect(siteFromHost(undefined)).toBe('us')
  })
})
