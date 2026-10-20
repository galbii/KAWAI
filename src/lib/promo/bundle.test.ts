import { describe, expect, it } from 'bun:test'
import { promoShowsOnSite, resolveBundle, resolveBundleItems, resolveBundleMedia } from './bundle'

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

describe('resolveBundle', () => {
  const es60 = {
    model: 'ES60',
    price: { msrp: 599 },
    priceCAD: { price: 749, msrp: null },
    variations: [{ name: 'Black', price: 599, priceCAD: 749 }],
  }
  const hml3 = { model: 'HML-3', price: { msrp: 129 }, priceCAD: { price: 149, msrp: null } }
  const tenPctOff = { valueType: 'percentage' as const, value: 0.1, discountedPrice: 674.1 }

  it('keeps the stored bundle price when nothing is discounted', () => {
    const { items, bundlePrice } = resolveBundle([{ product: es60 }, { product: hml3 }], 749, 'cad')
    expect(items.map((i) => i.price)).toEqual([749, 149])
    expect(bundlePrice).toBe(749)
  })

  it('passes a CA Shopify discount on the paid piece through to the bundle price', () => {
    const discounted = { ...es60, shopifyDiscountCAD: tenPctOff }
    const { items, bundlePrice } = resolveBundle([{ product: discounted }, { product: hml3 }], 749, 'cad')
    expect(items[0]?.price).toBe(674.1)
    expect(bundlePrice).toBe(674.1)
  })

  it('follows a compare-at markdown on the paid piece', () => {
    const markedDown = { ...es60, variations: [{ name: 'Black', priceCAD: 699, compareAtPriceCAD: 749 }] }
    const { bundlePrice } = resolveBundle([{ product: markedDown }, { product: hml3 }], 749, 'cad')
    expect(bundlePrice).toBe(699)
  })

  it('does not lower the bundle price for a discount on a free piece', () => {
    const standOnSale = { ...hml3, shopifyDiscountCAD: { ...tenPctOff, discountedPrice: 134.1 } }
    const { items, bundlePrice } = resolveBundle([{ product: es60 }, { product: standOnSale }], 749, 'cad')
    expect(items[1]?.price).toBe(134.1)
    expect(bundlePrice).toBe(749)
  })

  it('ignores the US store discount on the Canadian storefront, and vice versa', () => {
    const usDiscount = { ...es60, shopifyDiscount: tenPctOff }
    expect(resolveBundle([{ product: usDiscount }], 749, 'cad').bundlePrice).toBe(749)
    const caDiscount = { ...es60, shopifyDiscountCAD: tenPctOff }
    expect(resolveBundle([{ product: caDiscount }], 599, 'us').bundlePrice).toBe(599)
  })

  it('never shows a US variation price on the Canadian storefront', () => {
    const usOnly = { model: 'SH-9', price: { msrp: 139 }, priceCAD: null, variations: [{ name: 'Black', price: 139 }] }
    expect(resolveBundle([{ product: usOnly }], null, 'cad').items[0]?.price).toBeNull()
  })

  it('leaves a hand-set price alone, capped at the live separate total', () => {
    expect(resolveBundle([{ product: es60 }, { product: hml3 }], 800, 'cad').bundlePrice).toBe(800)
    expect(resolveBundle([{ product: es60 }, { product: hml3 }], 1000, 'cad').bundlePrice).toBe(898)
  })

  it('returns no bundle price when none is stored', () => {
    expect(resolveBundle([{ product: es60 }], null, 'cad').bundlePrice).toBeNull()
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
