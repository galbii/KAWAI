import { describe, expect, it } from 'bun:test'
import { FALL_2026 } from '@/lib/financing/terms'
import { PROGRAM_END, PROGRAM_END_ISO } from '../../fall-financing/_components/campaign'
import {
  SALE_BODY,
  SALE_END,
  SALE_END_ISO,
  SALE_ENDING,
  SALE_META,
  SALE_PATH,
  SALE_TITLE,
  type SaleSite,
  type SaleVariant,
} from './sale'

/**
 * /black-friday and /black-friday-ext reuse the /fall-financing sections, so
 * the financing-compliance suite already covers every offer block. These
 * guard the only new copy: the hero words and metadata.
 */
const VARIANTS: SaleVariant[] = ['main', 'ext']
const SITES: SaleSite[] = ['us', 'cad']

function allCopy(site: SaleSite): Array<[string, string]> {
  return VARIANTS.flatMap((v) => [
    [`${v}.title`, SALE_TITLE[v]],
    [`${v}.body.${site}`, SALE_BODY[v][site]],
    [`${v}.ending`, SALE_ENDING[v].line],
    [`${v}.meta.${site}.title`, SALE_META[v][site].title],
    [`${v}.meta.${site}.description`, SALE_META[v][site].description],
  ])
}

describe('Black Friday copy', () => {
  it('carries no rate, APR or term figure anywhere', () => {
    for (const site of SITES) {
      for (const [name, text] of allCopy(site)) {
        expect({ name, hit: /\d\s*%|\bAPR\b|\d+\s*months?/i.test(text) }).toEqual({
          name,
          hit: false,
        })
      }
    }
  })

  it('never mentions financing on ca.kawaius.com', () => {
    for (const [name, text] of allCopy('cad')) {
      expect({ name, hit: /financ|interest/i.test(text) }).toEqual({ name, hit: false })
    }
  })

  it('ends the sale framing on the last day of November', () => {
    expect(SALE_END_ISO).toBe('2026-11-30')
    expect(SALE_END).toBe('November 30, 2026')
    expect(SALE_ENDING.main.iso).toBe(SALE_END_ISO)
  })

  it('invents no extension date: the standby page counts to the offers own end', () => {
    expect(SALE_ENDING.ext.iso).toBe(PROGRAM_END_ISO)
    expect(SALE_ENDING.ext.iso).toBe(FALL_2026.end)
    expect(SALE_ENDING.ext.line).toContain(PROGRAM_END)
  })

  it('keeps the sale inside the offer terms', () => {
    expect(SALE_END_ISO <= FALL_2026.end).toBe(true)
    expect(SALE_END_ISO >= FALL_2026.start).toBe(true)
  })

  it('ends each headline in " Kawai" so the hero can swap in the logotype', () => {
    for (const v of VARIANTS) expect(SALE_TITLE[v].endsWith(' Kawai')).toBe(true)
  })

  it('serves the two pages on two distinct paths', () => {
    expect(SALE_PATH).toEqual({ main: '/black-friday', ext: '/black-friday-ext' })
  })
})
