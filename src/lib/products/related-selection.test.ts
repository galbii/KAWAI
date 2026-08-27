import { describe, expect, test } from 'bun:test'
import {
  dedupeWithLimit,
  extractRelationshipIds,
  mergeCuratedWithAuto,
  nonAccessoriesFirst,
  orderByIds,
} from './related-selection'

type P = { id: string; type?: string | null }

const p = (id: string, type?: string): P => (type ? { id, type } : { id })

describe('extractRelationshipIds', () => {
  test('handles plain string ids', () => {
    expect(extractRelationshipIds(['a', 'b'])).toEqual(['a', 'b'])
  })

  test('handles populated relationship objects', () => {
    expect(extractRelationshipIds([{ id: 'a' }, { id: 42 }])).toEqual(['a', '42'])
  })

  test('drops null/undefined/malformed entries', () => {
    expect(extractRelationshipIds([null, undefined, {}, 'a'])).toEqual(['a'])
  })

  test('returns empty array for non-array input', () => {
    expect(extractRelationshipIds(undefined)).toEqual([])
    expect(extractRelationshipIds(null)).toEqual([])
  })
})

describe('orderByIds', () => {
  test('restores the editor pick order after an unordered fetch', () => {
    const docs = [p('c'), p('a'), p('b')]
    expect(orderByIds(docs, ['a', 'b', 'c']).map((d) => d.id)).toEqual(['a', 'b', 'c'])
  })

  test('ignores ids with no matching doc (deleted/inactive products)', () => {
    const docs = [p('a')]
    expect(orderByIds(docs, ['missing', 'a']).map((d) => d.id)).toEqual(['a'])
  })

  test('drops docs not present in the id list', () => {
    const docs = [p('a'), p('stray')]
    expect(orderByIds(docs, ['a']).map((d) => d.id)).toEqual(['a'])
  })
})

describe('dedupeWithLimit', () => {
  test('removes duplicate ids keeping first occurrence', () => {
    const docs = [p('a'), p('b'), p('a')]
    expect(dedupeWithLimit(docs, 8).map((d) => d.id)).toEqual(['a', 'b'])
  })

  test('caps at limit', () => {
    const docs = [p('a'), p('b'), p('c')]
    expect(dedupeWithLimit(docs, 2).map((d) => d.id)).toEqual(['a', 'b'])
  })
})

describe('nonAccessoriesFirst', () => {
  test('moves accessories after pianos, preserving relative order', () => {
    const docs = [p('acc1', 'accessory'), p('gx2', 'grand'), p('acc2', 'accessory'), p('ca99', 'digital')]
    expect(nonAccessoriesFirst(docs).map((d) => d.id)).toEqual(['gx2', 'ca99', 'acc1', 'acc2'])
  })
})

describe('mergeCuratedWithAuto', () => {
  test('curated items lead, auto fills remaining slots', () => {
    const curated = [p('pick1'), p('pick2')]
    const auto = [p('auto1'), p('auto2'), p('auto3')]
    expect(mergeCuratedWithAuto(curated, auto, 4).map((d) => d.id)).toEqual([
      'pick1',
      'pick2',
      'auto1',
      'auto2',
    ])
  })

  test('auto results already in the curated list are not repeated', () => {
    const curated = [p('gx2')]
    const auto = [p('gx2'), p('gx3')]
    expect(mergeCuratedWithAuto(curated, auto, 4).map((d) => d.id)).toEqual(['gx2', 'gx3'])
  })

  test('curated alone respects the limit', () => {
    const curated = [p('a'), p('b'), p('c')]
    expect(mergeCuratedWithAuto(curated, [], 2).map((d) => d.id)).toEqual(['a', 'b'])
  })

  test('empty curated behaves like plain auto', () => {
    const auto = [p('x'), p('y')]
    expect(mergeCuratedWithAuto([], auto, 4).map((d) => d.id)).toEqual(['x', 'y'])
  })
})
