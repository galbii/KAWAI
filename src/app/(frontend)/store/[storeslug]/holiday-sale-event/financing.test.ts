import { describe, expect, it } from 'bun:test'
import { FALL_2026 } from '@/lib/financing/terms'
import { disclosures, financing, CTA_LEAD_IN } from '@/app/(frontend)/fall-financing/_components/campaign'
import { fallFinancingSale as sale } from './_content'
import { holidayFinancing } from './financing'

/**
 * kawai-holiday-sale-page-edits v2 (Chance, voice 4:44–4:46 PM PT Nov 20,
 * 2026): the financing spread is "0% financing on every model", with no
 * Synchrony or 24-month fine print added or kept, and neither mentioned.
 */
describe('holiday financing: "0% financing on every model", no fine print', () => {
  const fin = sale.promos.find((p) => p.id === 'financing')
  const spread = JSON.stringify(fin)

  it('heads the spread with the one approved line', () => {
    expect(holidayFinancing.heading).toBe('0% financing on every model')
    expect(fin?.heading).toEqual({ kind: 'text', text: '0% financing on every model' })
  })

  it('carries no lender, term, rate, example or exclusion fine print', () => {
    expect(fin?.fineprint).toEqual([])
    expect(fin?.body).toBeUndefined()
    expect(fin?.fineprintId).toBeUndefined()
    for (const banned of [/synchrony/i, /24[- ]month/i, /36[- ]month/i, /\b24 months\b/i, /\b36 months\b/i, /22\.99%/, /APR/, /Pay Later/i, /\$8,000/, /Shigeru/i, /\*/]) {
      expect(spread).not.toMatch(banned)
    }
  })

  it('keeps a figure-free dealer line above the buttons', () => {
    expect(fin?.note).toBe(holidayFinancing.dealerNote)
    expect(fin?.note).not.toMatch(/\d+(\.\d+)?%/)
  })

  // kawai-holiday-sale-rep-edits v1 (the store reps via Chance, relayed by
  // Marcy, Nov 23, 2026): the reps' exact line, shared by all four stores as
  // given. The national dealer note and CTA_LEAD_IN stay as they are.
  it('reads "Contact our St. Louis showroom for pricing and inventory." (v1 rep edits)', () => {
    expect(holidayFinancing.dealerNote).toBe('Contact our St. Louis showroom for pricing and inventory.')
    expect(fin?.note).toBe('Contact our St. Louis showroom for pricing and inventory.')
    expect(financing.dealerNote).toBe(CTA_LEAD_IN)
    expect(CTA_LEAD_IN).toBe('Contact a dealer near you for pricing and inventory.')
  })

  it('prints no Synchrony or term fine print anywhere on the page', () => {
    const all = JSON.stringify(sale)
    expect(all).not.toMatch(/synchrony/i)
    expect(all).not.toMatch(/\b(24|36) months\b/i)
    expect(all).not.toContain('22.99%')
    for (const line of [...disclosures.financingTerms, disclosures.financingExample, disclosures.exclusions]) {
      expect(all).not.toContain(line)
    }
  })

  it('leaves the national terms alone', () => {
    expect(FALL_2026.introMonths).toBe(24)
    expect(FALL_2026.postMonths).toBe(36)
    expect(FALL_2026.blendedApr).toBe(0.0801)
    expect(financing.heading.connector).toBe('for the first 24 months')
    expect(disclosures.financingExample).toContain('$185.78')
  })
})
