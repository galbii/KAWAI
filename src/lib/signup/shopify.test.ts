import { describe, expect, it } from 'bun:test'
import { buildSignupTags } from './shopify-tags'

describe('buildSignupTags', () => {
  it('always adds the campaign and store tags', () => {
    const tags = buildSignupTags([], 'fall-open-house', 'houston', [])
    expect(tags).toContain('signup-fall-open-house')
    expect(tags).toContain('store-houston')
  })

  it('keeps campaign-authored tags', () => {
    const tags = buildSignupTags(['vip', 'open-house'], 'fall', 'houston', [])
    expect(tags).toContain('vip')
    expect(tags).toContain('open-house')
  })

  it('appends site tags for the Canadian domain', () => {
    expect(buildSignupTags([], 'fall', 'houston', ['canada'])).toContain('canada')
  })

  it('deduplicates and drops blanks', () => {
    const tags = buildSignupTags(['vip', 'vip', '', '  '], 'fall', 'houston', [])
    expect(tags.filter((t) => t === 'vip')).toHaveLength(1)
    expect(tags).not.toContain('')
  })

  it('trims whitespace from authored tags', () => {
    expect(buildSignupTags(['  vip  '], 'fall', 'houston', [])).toContain('vip')
  })
})
