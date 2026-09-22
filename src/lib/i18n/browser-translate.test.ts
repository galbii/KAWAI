/**
 * Tests for which strings are safe to hand to the on-device translator.
 * Run with: bun test src/lib/i18n/browser-translate.test.ts
 */

import { describe, test, expect } from 'bun:test'
import { isTranslatableText } from './browser-translate'

describe('isTranslatableText', () => {
  test('accepts ordinary prose', () => {
    expect(isTranslatableText('Find a Dealer')).toBe(true)
    expect(isTranslatableText('Shop by Collection')).toBe(true)
    expect(isTranslatableText('Register your piano today')).toBe(true)
  })

  test('rejects prices — a model may reformat or alter the digits', () => {
    expect(isTranslatableText('$12,999')).toBe(false)
    expect(isTranslatableText('$12,999.00 CAD')).toBe(false)
    expect(isTranslatableText('CA$8,499')).toBe(false)
    expect(isTranslatableText('€4.500')).toBe(false)
  })

  test('rejects strings with no letters at all — nothing to translate', () => {
    expect(isTranslatableText('2026')).toBe(false)
    expect(isTranslatableText('—')).toBe(false)
    expect(isTranslatableText('07 / 09')).toBe(false)
    expect(isTranslatableText('  ·  ')).toBe(false)
  })

  test('rejects single characters and blanks', () => {
    expect(isTranslatableText('')).toBe(false)
    expect(isTranslatableText('   ')).toBe(false)
    expect(isTranslatableText('x')).toBe(false)
  })

  test('keeps model names that carry real words around them', () => {
    // "GX-7" alone has no sentence to translate; a phrase does.
    expect(isTranslatableText('GX-7')).toBe(false)
    expect(isTranslatableText('The GX-7 grand piano')).toBe(true)
  })

  test('is not fooled by a currency symbol inside a sentence', () => {
    // Still rejected: safer to leave a price-bearing string alone entirely.
    expect(isTranslatableText('Starting at $12,999')).toBe(false)
  })
})
