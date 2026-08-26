import { describe, expect, it } from 'bun:test'
import { hidesMobileSearch } from './mobile-search-visibility'

describe('hidesMobileSearch', () => {
  it('hides on the dealer finder and its sub-routes', () => {
    expect(hidesMobileSearch('/find-a-dealer')).toBe(true)
    expect(hidesMobileSearch('/find-a-dealer/texas')).toBe(true)
  })

  // The regression this function exists for: campaign pages are nested under a
  // storefront, so a root-anchored '/signup' prefix never matched them.
  it('hides on a nested store signup campaign', () => {
    expect(hidesMobileSearch('/store/dallas/signup/back-to-school')).toBe(true)
  })

  it('hides on a bare store signup', () => {
    expect(hidesMobileSearch('/store/dallas/signup')).toBe(true)
  })

  it('shows on ordinary pages', () => {
    expect(hidesMobileSearch('/')).toBe(false)
    expect(hidesMobileSearch('/pianos/grand')).toBe(false)
    expect(hidesMobileSearch('/store/dallas')).toBe(false)
    expect(hidesMobileSearch('/store/dallas/music-school')).toBe(false)
  })

  // Segment matching is exact, so a lookalike route is not swept up by accident.
  it('does not hide on a route that merely starts with the same letters', () => {
    expect(hidesMobileSearch('/signup-terms')).toBe(false)
    expect(hidesMobileSearch('/store/dallas/signups')).toBe(false)
  })
})
