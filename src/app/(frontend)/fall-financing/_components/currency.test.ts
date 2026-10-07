import { describe, expect, it } from 'bun:test'
import { esRebatesFor, rebateCopyFor } from './campaign'
import { formatOfferPrice } from './money'

/**
 * Canadian figures on /fall-financing.
 *
 * ca.kawaius.com showed the US heading ("Up to $150") over a CAD ledger, and
 * wrote CAD as "CAD200". These pin the page's own format and the per-site copy.
 */
describe('formatOfferPrice', () => {
  it('writes USD as a plain dollar figure', () => {
    expect(formatOfferPrice(1549, 'USD')).toBe('$1,549')
  })

  it('writes CAD as a dollar figure with the currency named after it', () => {
    expect(formatOfferPrice(2049, 'CAD')).toBe('$2,049 CAD')
    expect(formatOfferPrice(80, 'CAD')).toBe('$80 CAD')
  })
})

describe('ES rebate copy per site', () => {
  it('quotes each site its own largest rebate, in its own currency', () => {
    expect(rebateCopyFor('us').heading).toBe('Up to $150 off an ES Series portable')
    expect(rebateCopyFor('cad').heading).toBe('Up to $200 CAD off an ES Series portable')
  })

  it('never puts a US figure in the Canadian copy', () => {
    const cad = rebateCopyFor('cad')
    expect(esRebatesFor('cad').every((r) => r.currency === 'CAD')).toBe(true)
    expect(cad.heading).not.toContain('$150')
    // CA prices are the store's selling price, which sits below CA MSRP.
    expect(cad.disclaimer).not.toContain("manufacturer's suggested retail")
  })
})
