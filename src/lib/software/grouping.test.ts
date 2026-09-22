/**
 * Tests for the /software model tree, search, and formatting helpers.
 * Run with: bun test src/lib/software/grouping.test.ts
 */

import { describe, test, expect } from 'bun:test'
import {
  buildTree,
  filterModels,
  matchesQuery,
  compareModelNames,
  formatBytes,
} from './grouping'
import type { SoftwareModel } from './types'

const model = (over: Partial<SoftwareModel> & Pick<SoftwareModel, 'model'>): SoftwareModel => ({
  slug: over.model.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  aliases: [over.model],
  category: 'digital',
  series: 'CA',
  downloads: [{ label: 'System', version: '1.00', fileUrl: 'https://x/y.zip', fileBytes: 1024, instructionsUrl: null }],
  ...over,
})

describe('compareModelNames', () => {
  test('orders numerically, not lexically', () => {
    // Lexical sort would put CA901 before CA99 — wrong for a model list.
    expect(['CA99', 'CA901', 'CA49'].sort(compareModelNames)).toEqual(['CA49', 'CA99', 'CA901'])
  })

  test('keeps series prefix as the primary key', () => {
    expect(['ES8', 'CA49', 'ES920'].sort(compareModelNames)).toEqual(['CA49', 'ES8', 'ES920'])
  })

  test('handles combined model names', () => {
    expect(['CA99/CA79', 'CA98/CA78'].sort(compareModelNames)).toEqual(['CA98/CA78', 'CA99/CA79'])
  })

  test('sorts SE variants after their base model', () => {
    expect(['MP11SE', 'MP11', 'MP7'].sort(compareModelNames)).toEqual(['MP7', 'MP11', 'MP11SE'])
  })
})

describe('matchesQuery', () => {
  const es920 = model({ model: 'ES920', series: 'ES' })
  const combined = model({ model: 'CA901/CA701', aliases: ['CA901', 'CA701'] })

  test('empty query matches everything', () => {
    expect(matchesQuery(es920, '')).toBe(true)
    expect(matchesQuery(es920, '   ')).toBe(true)
  })

  test('matches on partial model name, case insensitively', () => {
    expect(matchesQuery(es920, 'es9')).toBe(true)
    expect(matchesQuery(es920, 'ES9')).toBe(true)
    expect(matchesQuery(es920, 'es920')).toBe(true)
  })

  test('matches an alias of a combined model', () => {
    // Someone who owns a CA701 must find the CA901/CA701 row.
    expect(matchesQuery(combined, 'ca701')).toBe(true)
    expect(matchesQuery(combined, 'CA901')).toBe(true)
  })

  test('ignores separators the user may or may not type', () => {
    expect(matchesQuery(combined, 'ca901/ca701')).toBe(true)
    expect(matchesQuery(combined, 'ca 901')).toBe(true)
    expect(matchesQuery(model({ model: 'Novus NV12', aliases: ['NV12'] }), 'nv-12')).toBe(true)
  })

  test('matches the series name', () => {
    expect(matchesQuery(es920, 'ES')).toBe(true)
  })

  test('rejects non-matches', () => {
    expect(matchesQuery(es920, 'cn39')).toBe(false)
  })
})

describe('filterModels', () => {
  const models = [
    model({ model: 'ES920', series: 'ES' }),
    model({ model: 'ES520', series: 'ES' }),
    model({ model: 'CN39', series: 'CN' }),
  ]

  test('returns every model for a blank query', () => {
    expect(filterModels(models, '')).toHaveLength(3)
  })

  test('narrows to matches', () => {
    expect(filterModels(models, 'es5').map((m) => m.model)).toEqual(['ES520'])
  })

  test('returns an empty array when nothing matches', () => {
    expect(filterModels(models, 'zzz')).toEqual([])
  })
})

describe('buildTree', () => {
  const models = [
    model({ model: 'CN39', series: 'CN', category: 'digital' }),
    model({ model: 'ES920', series: 'ES', category: 'digital' }),
    model({ model: 'CA49', series: 'CA', category: 'digital' }),
    model({ model: 'Novus NV12', series: 'NV', category: 'hybrid', aliases: ['NV12'] }),
    model({ model: 'AnyTime ATX4', series: 'ATX', category: 'anytime', aliases: ['ATX4'] }),
  ]

  test('groups by category then series', () => {
    const tree = buildTree(models)
    expect(tree.map((c) => c.category)).toEqual(['digital', 'hybrid', 'anytime'])
    expect(tree[0]?.series.map((s) => s.series)).toEqual(['CA', 'CN', 'ES'])
  })

  test('counts models per category and series', () => {
    const tree = buildTree(models)
    expect(tree[0]?.count).toBe(3)
    expect(tree[0]?.series[0]?.count).toBe(1)
  })

  test('omits categories and series with no models', () => {
    const tree = buildTree([model({ model: 'ES920', series: 'ES' })])
    expect(tree).toHaveLength(1)
    expect(tree[0]?.series).toHaveLength(1)
  })

  test('is driven by the filtered list, so search prunes the tree', () => {
    const tree = buildTree(filterModels(models, 'nv'))
    expect(tree.map((c) => c.category)).toEqual(['hybrid'])
  })
})

describe('formatBytes', () => {
  test('formats KB and MB', () => {
    expect(formatBytes(918448)).toBe('897 KB')
    expect(formatBytes(161410073)).toBe('154 MB')
  })

  test('returns null for missing or invalid sizes', () => {
    expect(formatBytes(null)).toBeNull()
    expect(formatBytes(undefined)).toBeNull()
    expect(formatBytes(0)).toBeNull()
  })
})
