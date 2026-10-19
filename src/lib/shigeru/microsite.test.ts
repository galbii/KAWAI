/**
 * Run with: bun test src/lib/shigeru/microsite.test.ts
 */

import { describe, test, expect } from 'bun:test'
import { isShigeruProduct, shigeruModelPath } from './microsite'

describe('shigeruModelPath', () => {
  test.each([
    ['SK2', '/shigeru/models/sk-2'],
    ['SK3', '/shigeru/models/sk-3'],
    ['SK5', '/shigeru/models/sk-5'],
    ['SK6', '/shigeru/models/sk-6'],
    ['SK7', '/shigeru/models/sk-7'],
    ['SK-EX', '/shigeru/models/sk-ex'],
    ['sk-2', '/shigeru/models/sk-2'],
  ])('%s → %s', (model, path) => {
    expect(shigeruModelPath(model)).toBe(path)
  })

  test('unknown or missing model falls back to the range page', () => {
    expect(shigeruModelPath('SK9')).toBe('/shigeru/models')
    expect(shigeruModelPath(null)).toBe('/shigeru/models')
  })
})

describe('isShigeruProduct', () => {
  test('matches regardless of casing/whitespace', () => {
    expect(isShigeruProduct(' Shigeru ')).toBe(true)
    expect(isShigeruProduct('grand')).toBe(false)
    expect(isShigeruProduct(undefined)).toBe(false)
  })
})
