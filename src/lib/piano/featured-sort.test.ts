/**
 * Tests for featured-collection boost + priority sorting.
 * Run with: bun test src/lib/piano/featured-sort.test.ts
 */

import { describe, test, expect } from 'bun:test'
import { buildFeaturedMap, compareByFeatured, sortByFeatured } from './featured-sort'

const collections = [
  { handle: 'gx-series', featured: true, collectionPriority: 10 },
  { handle: 'ca-series', featured: true, collectionPriority: 5 },
  { handle: 'es-series', featured: true, collectionPriority: 0 }, // featured, default priority
  { handle: 'kdp-series', featured: false, collectionPriority: 99 }, // not featured
]

const prod = (handles: string[]) => ({
  shopifyCollections: handles.map((handle) => ({ handle })),
})

describe('buildFeaturedMap', () => {
  test('includes only featured collections, keyed by handle → priority', () => {
    const map = buildFeaturedMap(collections)
    expect(map.get('gx-series')).toBe(10)
    expect(map.get('ca-series')).toBe(5)
    expect(map.get('es-series')).toBe(0)
    expect(map.has('kdp-series')).toBe(false)
  })

  test('defaults missing priority to 0', () => {
    const map = buildFeaturedMap([{ handle: 'x', featured: true, collectionPriority: null }])
    expect(map.get('x')).toBe(0)
  })
})

describe('compareByFeatured', () => {
  const map = buildFeaturedMap(collections)

  test('a featured product ranks before a non-featured product', () => {
    expect(compareByFeatured(prod(['gx-series']), prod(['kdp-series']), map)).toBeLessThan(0)
    expect(compareByFeatured(prod(['kdp-series']), prod(['gx-series']), map)).toBeGreaterThan(0)
  })

  test('featured boost applies even when priority is the default 0', () => {
    // es-series is featured with priority 0; kdp-series is not featured.
    expect(compareByFeatured(prod(['es-series']), prod(['kdp-series']), map)).toBeLessThan(0)
  })

  test('among featured products, higher collectionPriority ranks first', () => {
    expect(compareByFeatured(prod(['gx-series']), prod(['ca-series']), map)).toBeLessThan(0)
    expect(compareByFeatured(prod(['ca-series']), prod(['gx-series']), map)).toBeGreaterThan(0)
  })

  test('a product in multiple featured collections uses its highest priority', () => {
    // belongs to es(0) + ca(5) → effective 5, beats a lone ca(5)? tie → 0; beats es(0)
    expect(compareByFeatured(prod(['es-series', 'ca-series']), prod(['es-series']), map)).toBeLessThan(0)
  })

  test('two non-featured products are equal (stable, returns 0)', () => {
    expect(compareByFeatured(prod(['kdp-series']), prod([]), map)).toBe(0)
  })

  test('handles null/empty shopifyCollections', () => {
    expect(compareByFeatured({ shopifyCollections: null }, prod(['gx-series']), map)).toBeGreaterThan(0)
    expect(compareByFeatured({}, {}, map)).toBe(0)
  })
})

describe('sortByFeatured', () => {
  test('orders featured-first, then by priority, stable within ties', () => {
    const map = buildFeaturedMap(collections)
    const items = [
      { id: 'a', shopifyCollections: [{ handle: 'kdp-series' }] }, // not featured
      { id: 'b', shopifyCollections: [{ handle: 'ca-series' }] }, // featured 5
      { id: 'c', shopifyCollections: [{ handle: 'gx-series' }] }, // featured 10
      { id: 'd', shopifyCollections: [{ handle: 'es-series' }] }, // featured 0
    ]
    const sorted = sortByFeatured(items, map)
    expect(sorted.map((i) => i.id)).toEqual(['c', 'b', 'd', 'a'])
  })

  test('does not mutate the input array', () => {
    const map = buildFeaturedMap(collections)
    const items = [prod(['kdp-series']), prod(['gx-series'])]
    const copy = [...items]
    sortByFeatured(items, map)
    expect(items).toEqual(copy)
  })
})
