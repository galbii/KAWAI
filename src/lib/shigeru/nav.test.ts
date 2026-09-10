/**
 * Tests for the Shigeru microsite navigation config + active-state resolution.
 * Run with: bun test src/lib/shigeru/nav.test.ts
 */

import { describe, test, expect } from 'bun:test'
import {
  leftNav,
  rightNav,
  mobileNav,
  footerLinks,
  grandsNav,
  resolveActive,
  isDropdown,
  type NavItem,
} from './nav'

const byLabel = (items: NavItem[], label: string): NavItem => {
  const found = items.find((i) => i.label === label)
  if (!found) throw new Error(`no nav item labelled "${label}"`)
  return found
}

describe('resolveActive', () => {
  const home = byLabel(leftNav, 'Home')
  const grands = byLabel(leftNav, 'Grands')
  const artists = byLabel(leftNav, 'Artists')
  const resources = byLabel(rightNav, 'Resources')

  test('Home matches only the exact microsite root', () => {
    expect(resolveActive('/shigeru', home)).toBe(true)
    expect(resolveActive('/shigeru/models', home)).toBe(false)
    expect(resolveActive('/shigeru/artists', home)).toBe(false)
  })

  test('a leaf item matches its own path', () => {
    expect(resolveActive('/shigeru/artists', artists)).toBe(true)
  })

  test('a leaf item matches deeper descendant paths', () => {
    expect(resolveActive('/shigeru/artists/kotaro-fukuma', artists)).toBe(true)
  })

  test('a leaf item does not match a sibling sharing a prefix string', () => {
    // "/shigeru/artists-archive" must not match "/shigeru/artists"
    expect(resolveActive('/shigeru/artists-archive', artists)).toBe(false)
  })

  test('a dropdown is active when any child is active', () => {
    expect(resolveActive('/shigeru/artisans', resources)).toBe(true)
    expect(resolveActive('/shigeru/technology', resources)).toBe(true)
    expect(resolveActive('/shigeru/about', resources)).toBe(true)
    expect(resolveActive('/shigeru/institutions', resources)).toBe(true)
  })

  test('a dropdown is active when a descendant of a child is active', () => {
    expect(resolveActive('/shigeru/artisans/ryuyo', resources)).toBe(true)
  })

  test('a dropdown is inactive elsewhere', () => {
    expect(resolveActive('/shigeru', resources)).toBe(false)
    expect(resolveActive('/shigeru/dealers', resources)).toBe(false)
  })

  test('Grands is active on its overview page and on any model page', () => {
    expect(resolveActive('/shigeru/models', grands)).toBe(true)
    expect(resolveActive('/shigeru/models/sk-ex', grands)).toBe(true)
    expect(resolveActive('/shigeru', grands)).toBe(false)
    expect(resolveActive('/shigeru/models-archive', grands)).toBe(false)
  })
})

describe('grandsNav', () => {
  test('is a dropdown rendered as the models card grid', () => {
    expect(isDropdown(grandsNav)).toBe(true)
    expect(grandsNav.variant).toBe('models')
  })

  test('carries every model with the detail the menu draws', () => {
    expect(grandsNav.children.length).toBeGreaterThanOrEqual(6)
    expect(grandsNav.children.map((c) => c.label)).toContain('SK-EX')
    for (const child of grandsNav.children) {
      expect(child.href.startsWith('/shigeru/models/')).toBe(true)
      expect(child.detail?.kind).toBeTruthy()
      expect(child.detail?.length).toBeTruthy()
      expect(child.detail?.lengthCm).toBeTruthy()
    }
  })

  test('length ratios run 0-1, with the longest model at exactly 1', () => {
    const ratios = grandsNav.children.map((c) => c.detail!.lengthRatio)
    for (const r of ratios) {
      expect(r).toBeGreaterThan(0)
      expect(r).toBeLessThanOrEqual(1)
    }
    expect(Math.max(...ratios)).toBe(1)
    // The range is read by length, so the ratios must be strictly ascending.
    expect([...ratios].sort((a, b) => a - b)).toEqual(ratios)
  })

  test('points at the collection page as its overview', () => {
    expect(grandsNav.overview?.href).toBe('/shigeru/models')
  })
})

describe('isDropdown', () => {
  test('narrows dropdown items', () => {
    expect(isDropdown(byLabel(rightNav, 'Resources'))).toBe(true)
    expect(isDropdown(byLabel(rightNav, 'Contact'))).toBe(false)
  })
})

describe('derived lists', () => {
  test('mobileNav contains every desktop item in left-then-right order', () => {
    expect(mobileNav.map((i) => i.label)).toEqual([
      ...leftNav.map((i) => i.label),
      ...rightNav.map((i) => i.label),
    ])
  })

  test('footerLinks flattens dropdown children into leaf links', () => {
    const hrefs = footerLinks.map((l) => l.href)
    expect(hrefs).toContain('/shigeru/artisans')
    expect(hrefs).toContain('/shigeru/technology')
    expect(hrefs).toContain('/shigeru/about')
    expect(hrefs).toContain('/shigeru/institutions')
  })

  test('footerLinks surfaces the previously orphaned pages', () => {
    // /shigeru/about and /shigeru/technology were in the sitemap but in no menu
    const hrefs = footerLinks.map((l) => l.href)
    expect(hrefs).toContain('/shigeru/about')
    expect(hrefs).toContain('/shigeru/technology')
  })

  test('a group with an overview collapses to that one footer link', () => {
    const hrefs = footerLinks.map((l) => l.href)
    expect(hrefs).toContain('/shigeru/models')
    expect(hrefs).not.toContain('/shigeru/models/sk-ex')
  })

  test('footerLinks has no dropdown parents and no duplicate hrefs', () => {
    const hrefs = footerLinks.map((l) => l.href)
    expect(hrefs).not.toContain(null)
    expect(new Set(hrefs).size).toBe(hrefs.length)
  })

  test('every leaf href points inside the microsite', () => {
    for (const link of footerLinks) {
      expect(link.href.startsWith('/shigeru')).toBe(true)
    }
  })
})
