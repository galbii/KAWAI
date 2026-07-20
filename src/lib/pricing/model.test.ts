import { describe, it, expect } from 'bun:test'
import { normalizeProductPrice, type PricingProduct } from './model'

// Fixtures mirror real synced Payload product shapes.
const grand = (over: Partial<PricingProduct> = {}): PricingProduct => ({
  price: { msrp: 54995, currency: 'USD' },
  variations: [{ name: 'Ebony Polish', price: 49995, compareAtPrice: 54995 }],
  ...over,
})

describe('normalizeProductPrice — parity with current (pre-discount) behavior', () => {
  it('single variation, compare-at markdown → onSale, no auto discount', () => {
    const r = normalizeProductPrice(grand())
    expect(r.kind).toBe('single')
    expect(r.tiers).toEqual({ list: 54995, sale: 49995, final: 49995 })
    expect(r.onSale).toBe(true)
    expect(r.isAutoDiscount).toBe(false)
  })

  it('single variation, no compare-at → not on sale', () => {
    const r = normalizeProductPrice(grand({ variations: [{ name: 'A', price: 4999 }] }))
    expect(r.tiers).toEqual({ list: null, sale: 4999, final: 4999 })
    expect(r.onSale).toBe(false)
  })

  it('multiple prices → range on final price', () => {
    const r = normalizeProductPrice(grand({
      variations: [
        { name: 'A', price: 4999 },
        { name: 'B', price: 6999 },
      ],
    }))
    expect(r.kind).toBe('range')
    expect(r.min?.final).toBe(4999)
    expect(r.max?.final).toBe(6999)
  })

  it('equal prices collapse to a single figure (not "$X - $X")', () => {
    const r = normalizeProductPrice(grand({
      variations: [{ name: 'A', price: 4999 }, { name: 'B', price: 4999 }],
    }))
    expect(r.kind).toBe('single')
    expect(r.tiers?.sale).toBe(4999)
  })

  it('no variation prices → falls back to product.price.msrp', () => {
    const r = normalizeProductPrice({ price: { msrp: 3200, currency: 'USD' }, variations: [] })
    expect(r.kind).toBe('single')
    expect(r.tiers?.sale).toBe(3200)
  })

  it('nothing priced at all → unavailable', () => {
    const r = normalizeProductPrice({ variations: [] })
    expect(r.kind).toBe('unavailable')
  })

  it('CA site uses priceCAD / compareAtPriceCAD and CAD currency', () => {
    const r = normalizeProductPrice(
      grand({
        priceCAD: { price: 64995, msrp: null },
        variations: [{ name: 'A', price: 49995, compareAtPrice: 54995, priceCAD: 59995, compareAtPriceCAD: 64995 }],
      }),
      { site: 'cad' },
    )
    expect(r.currency).toBe('CAD')
    expect(r.tiers).toEqual({ list: 64995, sale: 59995, final: 59995 })
  })
})

describe('normalizeProductPrice — automatic discount (new behavior)', () => {
  it('percentage discount lowers final, keeps compare-at as list tier', () => {
    const r = normalizeProductPrice(grand({
      shopifyDiscount: { title: 'Summer', valueType: 'percentage', value: 0.2, discountedPrice: 39996 },
    }))
    expect(r.isAutoDiscount).toBe(true)
    expect(r.tiers).toEqual({ list: 54995, sale: 49995, final: 39996 }) // 49995 * 0.8
    expect(r.onSale).toBe(true)
    expect(r.discountTitle).toBe('Summer')
    expect(r.discountLabel).toBe('20% off')
  })

  it('fixed discount subtracts an amount', () => {
    const r = normalizeProductPrice(grand({
      variations: [{ name: 'A', price: 5000 }],
      shopifyDiscount: { title: 'Save', valueType: 'fixed', value: 500, discountedPrice: 4500 },
    }))
    expect(r.tiers).toEqual({ list: null, sale: 5000, final: 4500 })
    expect(r.discountLabel).toBe('$500 off')
  })

  it('infers percentage vs fixed when valueType is missing (pre-resync docs)', () => {
    const pct = normalizeProductPrice(grand({
      variations: [{ name: 'A', price: 100 }],
      shopifyDiscount: { value: 0.1, discountedPrice: 90 },
    }))
    expect(pct.tiers?.final).toBe(90)

    const fixed = normalizeProductPrice(grand({
      variations: [{ name: 'A', price: 100 }],
      shopifyDiscount: { value: 25, discountedPrice: 75 },
    }))
    expect(fixed.tiers?.final).toBe(75)
  })

  it('inactive discount (no discountedPrice) is ignored', () => {
    const r = normalizeProductPrice(grand({
      variations: [{ name: 'A', price: 4999 }],
      shopifyDiscount: { title: 'x', valueType: 'percentage', value: 0.2, discountedPrice: null },
    }))
    expect(r.isAutoDiscount).toBe(false)
    expect(r.tiers?.final).toBe(4999)
  })

  it('CA discount uses shopifyDiscountCAD, not the US snapshot', () => {
    const r = normalizeProductPrice(
      grand({
        variations: [{ name: 'A', price: 49995, priceCAD: 60000 }],
        shopifyDiscount: { valueType: 'percentage', value: 0.2, discountedPrice: 39996 },
        shopifyDiscountCAD: { valueType: 'percentage', value: 0.1, discountedPrice: 54000 },
      }),
      { site: 'cad' },
    )
    expect(r.tiers?.final).toBe(54000) // 60000 * 0.9 — CA snapshot, not the US 20%
  })

  it('selected variation returns that variation, discounted', () => {
    const r = normalizeProductPrice(
      grand({
        variations: [
          { name: 'Ebony', price: 5000 },
          { name: 'Walnut', price: 7000 },
        ],
        shopifyDiscount: { valueType: 'percentage', value: 0.1, discountedPrice: 4500 },
      }),
      { selectedVariationName: 'Walnut' },
    )
    expect(r.kind).toBe('single')
    expect(r.tiers?.sale).toBe(7000)
    expect(r.tiers?.final).toBe(6300)
  })

  it('liveVariants override the synced snapshot (hero path)', () => {
    const r = normalizeProductPrice(
      grand({ variations: [{ name: 'A', price: 49995, compareAtPrice: 54995 }] }),
      { liveVariants: [{ name: 'A', price: 48000, compareAtPrice: 54995 }] },
    )
    expect(r.tiers?.sale).toBe(48000)
  })
})

describe('normalizeProductPrice — variant-scoped discount (entitledVariantIds)', () => {
  const gid = (n: number) => `gid://shopify/ProductVariant/${n}`
  const twoFinishes = (over: Partial<PricingProduct> = {}): PricingProduct => ({
    price: { msrp: 5000, currency: 'USD' },
    variations: [
      { name: 'Ebony Polish', shopifyVariantId: gid(1), price: 5000 },
      { name: 'Satin White', shopifyVariantId: gid(2), price: 5000 },
    ],
    shopifyDiscount: {
      title: 'EP Sale',
      valueType: 'percentage',
      value: 0.1,
      discountedPrice: 4500,
      entitledVariantIds: [gid(1)],
    },
    ...over,
  })

  it('discounts only the entitled finish when selected', () => {
    const r = normalizeProductPrice(twoFinishes(), { selectedVariationName: 'Ebony Polish' })
    expect(r.kind).toBe('single')
    expect(r.tiers?.final).toBe(4500)
    expect(r.isAutoDiscount).toBe(true)
  })

  it('leaves an unentitled finish undiscounted when selected', () => {
    const r = normalizeProductPrice(twoFinishes(), { selectedVariationName: 'Satin White' })
    expect(r.kind).toBe('single')
    expect(r.tiers?.final).toBe(5000)
    expect(r.isAutoDiscount).toBe(false)
    expect(r.discountTitle).toBeNull()
  })

  it('same-priced finishes with mixed entitlement become a range, not a collapsed single', () => {
    const r = normalizeProductPrice(twoFinishes())
    expect(r.kind).toBe('range')
    expect(r.min?.final).toBe(4500) // entitled Ebony Polish
    expect(r.max?.final).toBe(5000) // unentitled Satin White
  })

  it('null/empty entitledVariantIds keeps whole-product behavior', () => {
    const all = normalizeProductPrice(
      twoFinishes({
        shopifyDiscount: { valueType: 'percentage', value: 0.1, discountedPrice: 4500, entitledVariantIds: null },
      }),
      { selectedVariationName: 'Satin White' },
    )
    expect(all.tiers?.final).toBe(4500)

    const empty = normalizeProductPrice(
      twoFinishes({
        shopifyDiscount: { valueType: 'percentage', value: 0.1, discountedPrice: 4500, entitledVariantIds: [] },
      }),
      { selectedVariationName: 'Satin White' },
    )
    expect(empty.tiers?.final).toBe(4500)
  })

  it('product-level fallback (no variations) ignores a variant-scoped discount', () => {
    const r = normalizeProductPrice({
      price: { msrp: 3200, currency: 'USD' },
      variations: [],
      shopifyDiscount: { valueType: 'percentage', value: 0.1, discountedPrice: 2880, entitledVariantIds: [gid(9)] },
    })
    expect(r.tiers?.final).toBe(3200)
    expect(r.isAutoDiscount).toBe(false)
  })

  it('CA site matches entitlement against shopifyVariantIdCA (CA-store GIDs)', () => {
    const r = normalizeProductPrice(
      {
        price: { msrp: 5000, currency: 'USD' },
        variations: [
          { name: 'Ebony Polish', shopifyVariantId: gid(1), shopifyVariantIdCA: gid(101), priceCAD: 6500 },
          { name: 'Satin White', shopifyVariantId: gid(2), shopifyVariantIdCA: gid(102), priceCAD: 6500 },
        ],
        shopifyDiscountCAD: {
          valueType: 'percentage',
          value: 0.1,
          discountedPrice: 5850,
          entitledVariantIds: [gid(101)],
        },
      },
      { site: 'cad', selectedVariationName: 'Ebony Polish' },
    )
    expect(r.tiers?.final).toBe(5850)

    const white = normalizeProductPrice(
      {
        price: { msrp: 5000, currency: 'USD' },
        variations: [
          { name: 'Ebony Polish', shopifyVariantId: gid(1), shopifyVariantIdCA: gid(101), priceCAD: 6500 },
          { name: 'Satin White', shopifyVariantId: gid(2), shopifyVariantIdCA: gid(102), priceCAD: 6500 },
        ],
        shopifyDiscountCAD: {
          valueType: 'percentage',
          value: 0.1,
          discountedPrice: 5850,
          entitledVariantIds: [gid(101)],
        },
      },
      { site: 'cad', selectedVariationName: 'Satin White' },
    )
    expect(white.tiers?.final).toBe(6500)
  })
})
