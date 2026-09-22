/**
 * Tests for per-surface product visibility flags.
 * Run with: bun test src/lib/products/visibility.test.ts
 */

import { describe, test, expect } from 'bun:test'
import {
  HIDE_FROM_NAVIGATION,
  HIDE_FROM_BROWSERS,
  HIDE_FROM_COLLECTION_PAGES,
  excludeHiddenFrom,
  isHiddenFrom,
} from './visibility'

describe('Where fragments', () => {
  test('each fragment targets its own visibility field and excludes only true', () => {
    expect(HIDE_FROM_NAVIGATION).toEqual({
      'visibility.hideFromNavigation': { not_equals: true },
    })
    expect(HIDE_FROM_BROWSERS).toEqual({
      'visibility.hideFromBrowsers': { not_equals: true },
    })
    expect(HIDE_FROM_COLLECTION_PAGES).toEqual({
      'visibility.hideFromCollectionPages': { not_equals: true },
    })
  })

  test('not_equals (not equals:false) so unset/null products are still returned', () => {
    // A product saved before these fields existed has no `visibility.hideFrom*` key
    // at all. `equals: false` would drop those docs in Mongo; `not_equals: true` keeps them.
    for (const fragment of [HIDE_FROM_NAVIGATION, HIDE_FROM_BROWSERS, HIDE_FROM_COLLECTION_PAGES]) {
      const condition = Object.values(fragment)[0]
      expect(condition).toEqual({ not_equals: true })
    }
  })
})

describe('excludeHiddenFrom', () => {
  test('resolves a surface name to its fragment', () => {
    expect(excludeHiddenFrom('navigation')).toEqual(HIDE_FROM_NAVIGATION)
    expect(excludeHiddenFrom('browsers')).toEqual(HIDE_FROM_BROWSERS)
    expect(excludeHiddenFrom('collectionPages')).toEqual(HIDE_FROM_COLLECTION_PAGES)
  })
})

describe('isHiddenFrom', () => {
  const hiddenFromNav = { visibility: { hideFromNavigation: true } }
  const hiddenFromBrowsers = { visibility: { hideFromBrowsers: true } }
  const visible = { visibility: { hideFromNavigation: false, hideFromBrowsers: false } }

  test('reports true only for the flag that is set', () => {
    expect(isHiddenFrom(hiddenFromNav, 'navigation')).toBe(true)
    expect(isHiddenFrom(hiddenFromNav, 'browsers')).toBe(false)
    expect(isHiddenFrom(hiddenFromBrowsers, 'browsers')).toBe(true)
    expect(isHiddenFrom(hiddenFromBrowsers, 'navigation')).toBe(false)
  })

  test('an explicitly visible product is not hidden from any surface', () => {
    expect(isHiddenFrom(visible, 'navigation')).toBe(false)
    expect(isHiddenFrom(visible, 'browsers')).toBe(false)
    expect(isHiddenFrom(visible, 'collectionPages')).toBe(false)
  })

  test('treats a missing visibility group as visible (legacy documents)', () => {
    expect(isHiddenFrom({}, 'navigation')).toBe(false)
    expect(isHiddenFrom({ visibility: null }, 'browsers')).toBe(false)
    expect(isHiddenFrom({ visibility: {} }, 'collectionPages')).toBe(false)
  })

  test('only a literal true hides — truthy-but-not-true does not', () => {
    expect(isHiddenFrom({ visibility: { hideFromNavigation: null } }, 'navigation')).toBe(false)
    expect(isHiddenFrom({ visibility: { hideFromNavigation: undefined } }, 'navigation')).toBe(false)
  })
})
