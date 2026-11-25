/**
 * The mega menu "All" view must order a tab's models exactly like its
 * collection pills (the shared sortCollectionProducts).
 * Run with: bun test src/lib/navigation/nav-product-sort.test.ts
 */

import { describe, test, expect } from 'bun:test'
import type { NavProduct } from '@/lib/payload/products-navigation'
import { sortCollectionProducts } from '@/lib/piano/collection-sort'
import { buildFeaturedMap } from '@/lib/piano/featured-sort'
import { buildAllTabProducts, sortNavProducts, toCollectionSortable } from './nav-product-sort'

type Fixture = Pick<NavProduct, 'id' | 'isFeatured' | 'model' | 'title' | 'collectionIds'> & {
  /** DB-only fields — present to prove they no longer affect the order. */
  sortOrder: number
  updatedAt: string
}

let seq = 0
function nav(model: string, opts: Partial<Fixture> = {}): Fixture {
  seq += 1
  return {
    id: String(seq),
    model,
    title: `Kawai ${model}`,
    isFeatured: false,
    collectionIds: [],
    sortOrder: 0,
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...opts,
  }
}

const models = (items: { model: string | null }[]) => items.map((p) => p.model)

// Featured collections as getNavCollections(20) returns them.
const featuredMap = buildFeaturedMap([
  { handle: 'k-series-professional', featured: true, collectionPriority: 5 },
  { handle: 'aures-hybrids', featured: true, collectionPriority: 1 },
])

// Upright pool in the old DB order: -featured, visibility.sortOrder, -updatedAt, name.
const uprightDbOrder: Fixture[] = [
  nav('K-300', { isFeatured: true, collectionIds: ['k-series-professional'], sortOrder: 1 }),
  nav('K-500 Limited Edition', { collectionIds: ['k-series-professional'], sortOrder: 2 }),
  nav('K-500', { collectionIds: ['k-series-professional'], sortOrder: 3, updatedAt: '2026-11-20T00:00:00.000Z' }),
  nav('K15ATX4', { collectionIds: ['aures-hybrids'], sortOrder: 4 }),
  nav('K-200', { collectionIds: ['k-series-professional'], sortOrder: 5, updatedAt: '2026-03-01T00:00:00.000Z' }),
  nav('K15', { sortOrder: 6 }),
  nav('K-400', { collectionIds: ['k-series-professional'], sortOrder: 7, updatedAt: '2026-10-01T00:00:00.000Z' }),
  nav('K600', { collectionIds: ['k-series-professional'], sortOrder: 8 }),
  nav('K8', { collectionIds: ['k-series-professional'], sortOrder: 9 }),
  nav('ND-21', { sortOrder: 10 }),
  nav('GL-30 AURES 2', { collectionIds: ['aures-hybrids'], sortOrder: 11 }),
]

describe('mega menu "All" view ordering', () => {
  test('matches the shared collection comparator exactly', () => {
    const expected = sortCollectionProducts(uprightDbOrder, featuredMap, toCollectionSortable)
    expect(models(sortNavProducts(uprightDbOrder, featuredMap))).toEqual(models(expected))
  })

  test('Upright: featured → core lineup by featured collection then natural model → derivatives', () => {
    expect(models(sortNavProducts(uprightDbOrder, featuredMap))).toEqual([
      'K-300', //                    product-flagged featured
      'K8', 'K-200', 'K-400', 'K-500', 'K600', // core, in a featured collection, natural + hyphen-insensitive
      'K15', 'ND-21', //             core, no featured collection
      'K-500 Limited Edition', //    derivatives: featured collection priority 5 …
      'GL-30 AURES 2', 'K15ATX4', // … then priority 1, by model name
    ])
  })

  test('DB order (sortOrder / updatedAt) cannot change the order', () => {
    const reversed = [...uprightDbOrder].reverse()
    const resaved = uprightDbOrder.map((p, i) => ({
      ...p,
      updatedAt: `2026-11-${String(24 - i).padStart(2, '0')}T00:00:00.000Z`,
      sortOrder: 100 - i,
    }))
    const base = models(sortNavProducts(uprightDbOrder, featuredMap))
    expect(models(sortNavProducts(reversed, featuredMap))).toEqual(base)
    expect(models(sortNavProducts(resaved, featuredMap))).toEqual(base)
  })

  test('sorts before slicing, so a late-in-DB core model still makes the cut', () => {
    // 14 derivatives first in DB order, the core K-200 last.
    const pool = [
      ...Array.from({ length: 14 }, (_, i) => nav(`K-${i + 1}00 Limited Edition`)),
      nav('K-200'),
    ]
    const top = buildAllTabProducts(pool, featuredMap, 12)
    expect(top).toHaveLength(12)
    expect(top[0]?.model).toBe('K-200')
  })

  test('is non-mutating and idempotent (client re-sort keeps server order)', () => {
    const snapshot = models(uprightDbOrder)
    const once = sortNavProducts(uprightDbOrder, featuredMap)
    expect(models(uprightDbOrder)).toEqual(snapshot)
    expect(models(sortNavProducts(once, featuredMap))).toEqual(models(once))
  })
})
