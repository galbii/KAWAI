/**
 * Tests for the shared collection product ordering.
 * Run with: bun test src/lib/piano/collection-sort.test.ts
 */

import { describe, test, expect } from 'bun:test'
import { sortCollectionProducts } from './collection-sort'

const noFeatured = new Map<string, number>()
const models = (items: { model: string }[]) => items.map((p) => p.model)

describe('sortCollectionProducts', () => {
  test('orders K Series Professional naturally, ignoring hyphens, derivatives last', () => {
    // Live -price.msrp order from the catalog, which interleaved unpriced models
    const input = [
      'K-500 Limited Edition', 'K700', 'K-500', 'K-400', 'K-300', 'K-200',
      'K600', 'K8', 'K5', 'K3', 'K2',
    ].map((model) => ({ model }))
    expect(models(sortCollectionProducts(input, noFeatured))).toEqual([
      'K2', 'K3', 'K5', 'K8', 'K-200', 'K-300', 'K-400', 'K-500', 'K600', 'K700',
      'K-500 Limited Edition',
    ])
  })

  test('detects derivatives by name marker too', () => {
    const input = [
      { model: 'GX-2L', name: 'Kawai GX-2 Limited Edition | 60th Anniversary' },
      { model: 'GX7', name: 'Kawai GX-7' },
      { model: 'GX1', name: 'Kawai GX-1' },
    ]
    expect(models(sortCollectionProducts(input, noFeatured))).toEqual(['GX1', 'GX7', 'GX-2L'])
  })

  test('product featured flag leads, even over the derivative sink', () => {
    const input = [{ model: 'K-200' }, { model: 'K-500 Limited Edition', featured: true }]
    expect(models(sortCollectionProducts(input, noFeatured))).toEqual(['K-500 Limited Edition', 'K-200'])
  })

  test('featured-collection priority beats model name', () => {
    const featured = new Map([['novus-series', 99]])
    const input = [
      { model: 'CA401' },
      { model: 'NV10S', shopifyCollections: [{ handle: 'novus-series' }] },
    ]
    expect(models(sortCollectionProducts(input, featured))).toEqual(['NV10S', 'CA401'])
  })

  test('adapts other shapes through toSortable without mutating input', () => {
    const input = [{ title: 'Kawai K-300', m: 'K-300' }, { title: 'Kawai K3', m: 'K3' }]
    const out = sortCollectionProducts(input, noFeatured, (p) => ({ model: p.m, name: p.title }))
    expect(out.map((p) => p.m)).toEqual(['K3', 'K-300'])
    expect(input[0]?.m).toBe('K-300')
  })
})
