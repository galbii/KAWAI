/**
 * UA classification for the native-translate instructions.
 * Run with: bun test src/lib/i18n/translate-hints.test.ts
 *
 * Every string below is a real user-agent. The point of these tests is the
 * impersonation chain — Edge says "Chrome", Chrome says "Safari", and every
 * iOS browser says "Safari" — so a naive substring check gets them backwards.
 */

import { describe, test, expect } from 'bun:test'
import { detectTranslateHintBrowser, getTranslateHint } from './translate-hints'

describe('detectTranslateHintBrowser', () => {
  test('desktop Safari is not mistaken for Chrome', () => {
    expect(
      detectTranslateHintBrowser(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15',
      ),
    ).toBe('safari')
  })

  test('desktop Chrome and Edge both classify as chromium', () => {
    expect(
      detectTranslateHintBrowser(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
      ),
    ).toBe('chromium')

    // Edge carries Chrome AND Safari AND Edg — must not fall through to safari.
    expect(
      detectTranslateHintBrowser(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/148.0.0.0',
      ),
    ).toBe('chromium')
  })

  test('desktop Firefox', () => {
    expect(
      detectTranslateHintBrowser(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:130.0) Gecko/20100101 Firefox/130.0',
      ),
    ).toBe('firefox')
  })

  test('iOS browsers are split by their real engine wrapper, not the Safari token', () => {
    const ios = (fragment: string) =>
      `Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) ${fragment}`

    expect(detectTranslateHintBrowser(ios('Version/18.0 Mobile/15E148 Safari/604.1'))).toBe(
      'safari-ios',
    )
    expect(detectTranslateHintBrowser(ios('CriOS/140.0.0.0 Mobile/15E148 Safari/604.1'))).toBe(
      'chromium-ios',
    )
    expect(detectTranslateHintBrowser(ios('EdgiOS/148.0.0.0 Mobile/15E148 Safari/604.1'))).toBe(
      'chromium-ios',
    )
    expect(detectTranslateHintBrowser(ios('FxiOS/130.0 Mobile/15E148 Safari/605.1.15'))).toBe(
      'firefox-ios',
    )
  })

  test('Android splits Chrome from Firefox', () => {
    expect(
      detectTranslateHintBrowser(
        'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36',
      ),
    ).toBe('chromium-android')

    expect(
      detectTranslateHintBrowser('Mozilla/5.0 (Android 14; Mobile; rv:130.0) Gecko/130.0 Firefox/130.0'),
    ).toBe('firefox')
  })

  test('unrecognised agents fall back rather than guessing', () => {
    expect(detectTranslateHintBrowser('')).toBe('unknown')
    expect(detectTranslateHintBrowser('curl/8.7.1')).toBe('unknown')
  })
})

describe('getTranslateHint', () => {
  test('every browser returns at least two actionable steps', () => {
    const agents = [
      'Mozilla/5.0 (Macintosh) Firefox/130.0',
      'Mozilla/5.0 (Macintosh) Version/18.0 Safari/605.1.15',
      'Mozilla/5.0 (iPhone) Version/18.0 Mobile/15E148 Safari/604.1',
      'curl/8.7.1',
    ]
    for (const ua of agents) {
      const hint = getTranslateHint(ua)
      expect(hint.steps.length).toBeGreaterThanOrEqual(2)
      expect(hint.label.length).toBeGreaterThan(0)
    }
  })

  test('Firefox for iOS is flagged as having no native translation', () => {
    const hint = getTranslateHint(
      'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) FxiOS/130.0 Mobile/15E148 Safari/605.1.15',
    )
    expect(hint.hasNativeTranslation).toBe(false)
  })
})
