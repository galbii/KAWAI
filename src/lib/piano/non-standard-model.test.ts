/**
 * Tests for non-standard (derivative) model detection.
 * Fixtures are real catalog values.
 * Run with: bun test src/lib/piano/non-standard-model.test.ts
 */

import { describe, test, expect } from 'bun:test'
import { isNonStandardModel, sortStandardFirst } from './non-standard-model'

// Every derivative in the catalog as of the current sync
const DERIVATIVES = [
  { model: 'GX-2L', name: 'Kawai GX-2 Limited Edition | 60th Anniversary' },
  { model: 'K-500 Limited Edition', name: 'Kawai K-500 Limited Edition | 60th Anniversary' },
  { model: 'GL-30 AURES 2', name: 'Kawai GL-30 AURES 2 Hybrid Piano' },
  { model: 'K-300 AURES 2', name: 'Kawai K-300 AURES 2 Hybrid Piano' },
  { model: 'K300 AURES', name: 'Kawai K300 Aures Hybrid Upright Piano' },
  { model: 'K500 AURES', name: 'Kawai K-500 AURES' },
  { model: 'GX2 AURES 2', name: 'Kawai GX-2 AURES 2 Hybrid Piano' },
  { model: 'GL30ATX2', name: 'Kawai GL30-ATX2 Hybrid Grand Piano' },
  { model: 'GL10-ATX4', name: 'Kawai GL10-ATX4 Hybrid Piano' },
  { model: 'K200-ATX4', name: 'Kawai K200-ATX4 Hybrid Piano' },
  { model: 'K200ATX2', name: 'Kawai K200-ATX2 Hybrid Upright Piano' },
  { model: 'K300ATX2', name: 'Kawai K300-ATX2 Hybrid Upright Piano' },
]

// Core models that a naive rule would misclassify
const CORE = [
  { model: 'GX7', name: 'Kawai GX-7 Grand Piano' },
  { model: 'GL-50', name: 'Kawai GL-50 Grand Piano' },
  { model: 'K-500', name: 'Kawai K-500 Upright Piano' },
  // Longer than its siblings but the flagship — a length rule would bury it
  { model: 'SK-EX', name: 'Shigeru Kawai EX Concert Piano' },
  { model: 'SK2', name: 'Shigeru Kawai SK-2 | Classic Salon Grand' },
  // Longer than CN29 — a length rule would reorder core models against each other
  { model: 'CN201', name: 'Kawai CN201 Digital Piano' },
  { model: 'CN29', name: 'Kawai CN29' },
  // type: 'hybrid' but standalone Novus flagships, not derivatives of an acoustic
  { model: 'NV10', name: 'Kawai NV10' },
  { model: 'NV5S', name: 'Kawai NV5S' },
  // SE here means the current shipping model, not a special run
  { model: 'MP11SE', name: 'Kawai MP11SE' },
]

describe('isNonStandardModel', () => {
  test.each(DERIVATIVES)('flags derivative $model', (p: { model: string; name: string }) => {
    expect(isNonStandardModel(p)).toBe(true)
  })

  test.each(CORE)('leaves core model $model alone', (p: { model: string; name: string }) => {
    expect(isNonStandardModel(p)).toBe(false)
  })

  test('catches a marker that appears only in the name', () => {
    // GX-2L carries no marker in the model itself
    expect(isNonStandardModel({ model: 'GX-2L', name: 'Kawai GX-2 Limited Edition' })).toBe(true)
    expect(isNonStandardModel({ model: 'GX-2L', name: null })).toBe(false)
  })

  test('treats a multi-token model as a derivative regardless of markers', () => {
    expect(isNonStandardModel({ model: 'K-500 Something', name: null })).toBe(true)
  })

  test('handles missing and empty fields', () => {
    expect(isNonStandardModel({})).toBe(false)
    expect(isNonStandardModel({ model: null, name: null })).toBe(false)
    expect(isNonStandardModel({ model: '  ', name: '' })).toBe(false)
  })
})

describe('sortStandardFirst', () => {
  test('moves derivatives below core models', () => {
    const input = [
      { model: 'GX-2L', name: 'Kawai GX-2 Limited Edition' },
      { model: 'GX7', name: 'Kawai GX-7 Grand Piano' },
      { model: 'GX5', name: 'Kawai GX-5 Grand Piano' },
    ]
    expect(sortStandardFirst(input).map((p) => p.model)).toEqual(['GX7', 'GX5', 'GX-2L'])
  })

  test('is stable — preserves incoming order within each group', () => {
    const input = [
      { model: 'GL-30 AURES 2', name: 'a' },
      { model: 'GX7', name: 'b' },
      { model: 'GL30ATX2', name: 'c' },
      { model: 'GX5', name: 'd' },
      { model: 'GX1', name: 'e' },
    ]
    expect(sortStandardFirst(input).map((p) => p.model)).toEqual([
      'GX7', 'GX5', 'GX1', 'GL-30 AURES 2', 'GL30ATX2',
    ])
  })

  test('does not mutate the input array', () => {
    const input = [{ model: 'GX-2L', name: 'Limited Edition' }, { model: 'GX7', name: 'x' }]
    sortStandardFirst(input)
    expect(input.map((p) => p.model)).toEqual(['GX-2L', 'GX7'])
  })

  test('handles an empty list', () => {
    expect(sortStandardFirst([])).toEqual([])
  })
})
