/**
 * Tests for UI locale path-prefix parsing.
 * Run with: bun test src/lib/i18n/locale-path.test.ts
 */

import { describe, test, expect } from 'bun:test'
import {
  DEFAULT_UI_LOCALE,
  UI_LOCALES,
  isUiLocale,
  parseLocalePath,
  withLocale,
} from './locale-path'

describe('UI_LOCALES', () => {
  test('English is the unprefixed default', () => {
    expect(DEFAULT_UI_LOCALE).toBe('en')
    expect(UI_LOCALES).toEqual(['en', 'fr'])
  })
})

describe('isUiLocale', () => {
  test('accepts supported locales', () => {
    expect(isUiLocale('en')).toBe(true)
    expect(isUiLocale('fr')).toBe(true)
  })

  test('rejects anything else', () => {
    expect(isUiLocale('de')).toBe(false)
    expect(isUiLocale('')).toBe(false)
    expect(isUiLocale('french')).toBe(false)
  })
})

describe('parseLocalePath', () => {
  test('unprefixed paths are the default locale', () => {
    expect(parseLocalePath('/')).toEqual({ locale: 'en', pathname: '/' })
    expect(parseLocalePath('/pianos')).toEqual({ locale: 'en', pathname: '/pianos' })
    expect(parseLocalePath('/store/st-louis')).toEqual({
      locale: 'en',
      pathname: '/store/st-louis',
    })
  })

  test('strips a leading /fr segment', () => {
    expect(parseLocalePath('/fr/pianos')).toEqual({ locale: 'fr', pathname: '/pianos' })
    expect(parseLocalePath('/fr/store/st-louis')).toEqual({
      locale: 'fr',
      pathname: '/store/st-louis',
    })
  })

  test('bare /fr resolves to the French root', () => {
    expect(parseLocalePath('/fr')).toEqual({ locale: 'fr', pathname: '/' })
    expect(parseLocalePath('/fr/')).toEqual({ locale: 'fr', pathname: '/' })
  })

  test('only matches a whole segment, never a prefix', () => {
    // Regression guard: /french-horn must not be read as locale "fr"
    expect(parseLocalePath('/french-horn')).toEqual({
      locale: 'en',
      pathname: '/french-horn',
    })
    expect(parseLocalePath('/fr-CA/pianos')).toEqual({
      locale: 'en',
      pathname: '/fr-CA/pianos',
    })
  })

  test('/en is not a route — English is never prefixed', () => {
    expect(parseLocalePath('/en/pianos')).toEqual({
      locale: 'en',
      pathname: '/en/pianos',
    })
  })

  test('matches the locale segment case-insensitively', () => {
    expect(parseLocalePath('/FR/pianos')).toEqual({ locale: 'fr', pathname: '/pianos' })
  })

  test('preserves a trailing slash on nested paths', () => {
    expect(parseLocalePath('/fr/pianos/')).toEqual({ locale: 'fr', pathname: '/pianos/' })
  })
})

describe('withLocale', () => {
  test('adds the /fr prefix', () => {
    expect(withLocale('/pianos', 'fr')).toBe('/fr/pianos')
    expect(withLocale('/', 'fr')).toBe('/fr')
  })

  test('removes the prefix for English', () => {
    expect(withLocale('/fr/pianos', 'en')).toBe('/pianos')
    expect(withLocale('/fr', 'en')).toBe('/')
  })

  test('is idempotent', () => {
    expect(withLocale('/fr/pianos', 'fr')).toBe('/fr/pianos')
    expect(withLocale('/pianos', 'en')).toBe('/pianos')
  })

  test('round-trips through both locales', () => {
    const original = '/store/st-louis/signature'
    expect(withLocale(withLocale(original, 'fr'), 'en')).toBe(original)
  })

  test('does not mangle paths that merely start with the locale letters', () => {
    expect(withLocale('/french-horn', 'fr')).toBe('/fr/french-horn')
    expect(withLocale('/french-horn', 'en')).toBe('/french-horn')
  })
})
