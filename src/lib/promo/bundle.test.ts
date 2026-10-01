import { describe, expect, it } from 'bun:test'
import { promoShowsOnSite, resolveBundleItems, resolveBundleMedia } from './bundle'

describe('promoShowsOnSite', () => {
  it('keeps a US-only promo off the Canadian storefront', () => {
    expect(promoShowsOnSite('us', 'us')).toBe(true)
    expect(promoShowsOnSite('us', 'cad')).toBe(false)
  })

  it('keeps a CA-only promo off the US storefront', () => {
    expect(promoShowsOnSite('cad', 'cad')).toBe(true)
    expect(promoShowsOnSite('cad', 'us')).toBe(false)
  })

  it('shows on both when set to both', () => {
    expect(promoShowsOnSite('both', 'us')).toBe(true)
    expect(promoShowsOnSite('both', 'cad')).toBe(true)
  })

  it('shows on both for promos saved before the field existed', () => {
    expect(promoShowsOnSite(undefined, 'us')).toBe(true)
    expect(promoShowsOnSite(null, 'cad')).toBe(true)
  })
})

describe('resolveBundleItems', () => {
  const piano = {
    model: 'CA401',
    modelLabel: null,
    imageUrl: 'https://cdn/ca401.jpg',
    price: { msrp: 3199 },
    priceCAD: { price: 4299, msrp: null },
  }
  const sh9 = { model: 'SH-9', imageUrl: 'https://cdn/sh9.jpg', price: { msrp: 139 }, priceCAD: null }

  it('reads label, price and image off the populated product', () => {
    const items = resolveBundleItems([{ product: piano }, { product: sh9 }], 'us')
    expect(items).toEqual([
      { label: 'CA401', price: 3199, imageUrl: 'https://cdn/ca401.jpg' },
      { label: 'SH-9', price: 139, imageUrl: 'https://cdn/sh9.jpg' },
    ])
  })

  it('never falls back to a US price on the Canadian storefront', () => {
    const items = resolveBundleItems([{ product: piano }, { product: sh9 }], 'cad')
    expect(items[0]?.price).toBe(4299)
    // SH-9 carries no CA price — showing $139 USD there would be wrong
    expect(items[1]?.price).toBeNull()
  })

  it('honours label and price overrides, and 0 to hide a price', () => {
    const items = resolveBundleItems(
      [{ product: sh9, label: 'SH-9 Headphones', priceOverride: 0 }],
      'us',
    )
    expect(items[0]?.label).toBe('SH-9 Headphones')
    expect(items[0]?.price).toBe(0)
  })

  it('drops rows whose product is unpopulated, and copes with no rows', () => {
    expect(resolveBundleItems([{ product: '69dd406ec6306789e6c7b1c6' }], 'us')).toEqual([])
    expect(resolveBundleItems(undefined, 'us')).toEqual([])
    expect(resolveBundleItems([], 'us')).toEqual([])
  })
})

describe('resolveBundleMedia', () => {
  it('keeps populated uploads and drops the rest', () => {
    const media = resolveBundleMedia([
      { image: { url: 'https://cdn/a.webp', alt: 'A' } },
      { image: '6abd3a46de6b00671e5bfb32' },
      { image: { alt: 'no url' } },
    ])
    expect(media).toEqual([{ url: 'https://cdn/a.webp', alt: 'A' }])
  })

  it('copes with no rows', () => {
    expect(resolveBundleMedia(undefined)).toEqual([])
  })
})
