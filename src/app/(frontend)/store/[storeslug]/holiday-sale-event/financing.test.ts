import { describe, expect, it } from 'bun:test'
import { effectiveApr, planFor } from '@/lib/financing/plan'
import { FALL_2026, termMonths } from '@/lib/financing/terms'
import { disclosures, financing, TERMS_SENTENCE } from '@/app/(frontend)/fall-financing/_components/campaign'
import { fallFinancingSale as sale } from './_content'
import {
  EXAMPLE_AMOUNT,
  examplePlan,
  HOLIDAY_FINANCING,
  HOLIDAY_TERMS_SENTENCE,
  holidayDisclosures,
  holidayFinancing,
} from './financing'

/**
 * The holiday page's 36-month terms (Chance, Nov 19, 2026: "update on the
 * page 24 months to 36 months just on this page"). 0% for the first 36
 * months, then 22.99% for the remaining 24, on the same 60-month term.
 */
describe('holiday financing: 36 months intro, computed with the national model', () => {
  it('swaps only the two windows; everything else is the national program', () => {
    expect(HOLIDAY_FINANCING.introMonths).toBe(36)
    expect(HOLIDAY_FINANCING.postMonths).toBe(24)
    expect(termMonths(HOLIDAY_FINANCING)).toBe(60)
    const { introMonths, postMonths, blendedApr, ...rest } = HOLIDAY_FINANCING
    const { introMonths: _i, postMonths: _p, blendedApr: _b, ...national } = FALL_2026
    expect(rest).toEqual(national)
    expect([introMonths, postMonths, blendedApr]).not.toEqual([_i, _p, _b])
  })

  it('pays $133.33 for 36 months, then $167.58 for 24 months on $8,000', () => {
    expect(EXAMPLE_AMOUNT).toBe(8000)
    expect(examplePlan).toEqual(planFor(8000, HOLIDAY_FINANCING))
    expect(examplePlan.introMonthly).toBeCloseTo(133.33, 2)
    expect(examplePlan.balanceAtRateChange).toBeCloseTo(3200, 6)
    expect(examplePlan.postMonthly).toBeCloseTo(167.58, 2)
  })

  it('carries a 3.71% APR, the solved APR of that payment stream', () => {
    expect(HOLIDAY_FINANCING.blendedApr).toBe(0.0371)
    expect(effectiveApr(examplePlan)).toBeCloseTo(HOLIDAY_FINANCING.blendedApr, 4)
  })

  it('renders the 36-month lockup, subhead and example', () => {
    expect(holidayFinancing.heading).toEqual({
      lead: 'Introductory Rate of 0%',
      connector: 'for the first 36 months',
      apr: '(APR 3.71%)*',
    })
    expect(HOLIDAY_TERMS_SENTENCE).toContain('a 22.99% rate will apply for 24 months.')
    expect(holidayDisclosures.financingExample).toContain(
      'A total 60-month term with an amount financed of $8,000: 0% intro rate for the first 36 months and ' +
        '22.99% rate for the remaining 24 months requires monthly payments of $133.33 for the first 36 ' +
        'months, and monthly payments of $167.58 for the remaining 24 months. APR of 3.71%.',
    )
  })

  it('differs from the national copy only in its figures', () => {
    // Swap each page's own figures for placeholders; what is left must match.
    const shape = (s: string, f: { i: number; p: number; post: string; apr: string }) =>
      s
        .replaceAll(`first ${f.i} months`, 'first {I} months')
        .replaceAll(`remaining ${f.p} months`, 'remaining {P} months')
        .replaceAll(`apply for ${f.p} months`, 'apply for {P} months')
        .replaceAll(f.post, '{POST}')
        .replaceAll(f.apr, '{APR}')
    const nat = { i: 24, p: 36, post: '$185.78', apr: '8.01%' }
    const hol = { i: 36, p: 24, post: '$167.58', apr: '3.71%' }
    expect(shape(TERMS_SENTENCE, nat)).toBe(shape(HOLIDAY_TERMS_SENTENCE, hol))
    expect(shape(financing.subhead, nat)).toBe(shape(holidayFinancing.subhead, hol))
    expect(shape(JSON.stringify(financing.heading), nat)).toBe(shape(JSON.stringify(holidayFinancing.heading), hol))
    expect(shape(disclosures.financingExample, nat)).toBe(shape(holidayDisclosures.financingExample, hol))
  })

  it('leaves the national terms alone', () => {
    expect(FALL_2026.introMonths).toBe(24)
    expect(FALL_2026.postMonths).toBe(36)
    expect(FALL_2026.blendedApr).toBe(0.0801)
    expect(financing.heading.connector).toBe('for the first 24 months')
    expect(disclosures.financingExample).toContain('$185.78')
  })

  it('shows no 24-month-intro figure anywhere on the holiday page', () => {
    const all = JSON.stringify(sale)
    expect(all).not.toContain('first 24 months')
    expect(all).not.toContain('remaining 36 months')
    expect(all).not.toContain('apply for 36 months')
    expect(all).not.toContain('8.01%')
    expect(all).not.toContain('$185.78')
    expect(all).toContain('first 36 months')
    expect(all).toContain('(APR 3.71%)*')
  })
})
