import { describe, expect, test } from 'bun:test'
import { lookupSerialNumber } from './serial-numbers'
import type { LookupResult, DisambiguationResult, LookupError } from './serial-numbers'

const asResult = (r: ReturnType<typeof lookupSerialNumber>): LookupResult => {
  if (r.kind !== 'result') throw new Error(`expected result, got ${r.kind}`)
  return r
}
const asDisambig = (r: ReturnType<typeof lookupSerialNumber>): DisambiguationResult => {
  if (r.kind !== 'disambiguation') throw new Error(`expected disambiguation, got ${r.kind}`)
  return r
}
const asError = (r: ReturnType<typeof lookupSerialNumber>): LookupError => {
  if (r.kind !== 'error') throw new Error(`expected error, got ${r.kind}`)
  return r
}

describe('prefixed series — direct, unambiguous dating', () => {
  test('A series (USA)', () => {
    const r = asResult(lookupSerialNumber('A50000')) // between 1993(40976) and 1994(51275)
    expect(r.year).toBe(1993)
    expect(r.country).toBe('USA')
  })

  test('A series leading zeros are ignored', () => {
    expect(asResult(lookupSerialNumber('A049000')).year).toBe(
      asResult(lookupSerialNumber('A49000')).year,
    )
  })

  test('B series is unregistered — the B is ignored, never dated as a B series', () => {
    // B is not registered, so B120412 is treated as the bare number 120412.
    // It must never resolve to (or offer) a B-series reading.
    const r = lookupSerialNumber('B120412')
    expect(r.kind).not.toBe('error')
    if (r.kind === 'result') expect(r.seriesLabel).not.toContain('B series')
    if (r.kind === 'disambiguation') {
      expect(r.candidates.every(c => c.prefix !== 'B')).toBe(true)
    }
  })

  test('F series (Indonesia) dates directly and names no city', () => {
    const r = asResult(lookupSerialNumber('F049000')) // 49000 ≥ 2010 cut (48793)
    expect(r.year).toBe(2010)
    expect(r.country).toBe('Indonesia')
    expect(r.seriesLabel).not.toContain('Surabaya')
  })

  test('C series discontinued — above ceiling is out of range', () => {
    expect(asError(lookupSerialNumber('C99999')).type).toBe('out-of-range-high')
  })

  test('S series', () => {
    expect(asResult(lookupSerialNumber('S133300')).country).toBe('Japan')
  })

  test('below a series floor is out-of-range-low', () => {
    expect(asError(lookupSerialNumber('A100')).type).toBe('out-of-range-low')
  })
})

describe('main numeric series (7-digit, no prefix)', () => {
  test('modern 7-digit resolves uniquely', () => {
    const r = asResult(lookupSerialNumber('2500000')) // 2004 (2496522) .. 2005 (2520139)
    expect(r.year).toBe(2004)
    expect(r.country).toBe('Japan')
  })

  test('low vintage grand overlaps the F series (which starts at serial 11)', () => {
    // 9600 is a 1940 grand, but the Indonesian F series reuses low numbers,
    // so the prefix is required to tell them apart.
    const d = asDisambig(lookupSerialNumber('9600'))
    expect(d.candidates.map(c => c.prefix)).toContain('F')
    expect(d.candidates.some(c => c.year === 1940)).toBe(true)
  })

  test('a 6-digit vintage grand overlaps the F series → disambiguation', () => {
    // 163178 is a 1965 grand, but also lands in the F series range
    const d = asDisambig(lookupSerialNumber('163178'))
    expect(d.candidates.map(c => c.prefix)).toContain('F')
    expect(d.candidates.some(c => c.seriesLabel.includes('main series'))).toBe(true)
  })

  test('the 1856250 example dates to ~1989', () => {
    const r = asResult(lookupSerialNumber('1856250'))
    expect([1988, 1989]).toContain(r.year)
  })
})

describe('bare-number ambiguity → require the prefix', () => {
  test('a 6-digit number in the A/F overlap asks for the prefix', () => {
    const d = asDisambig(lookupSerialNumber('110000'))
    const prefixes = d.candidates.map(c => c.prefix)
    // A and F both cover 110000; the 6-digit and vintage-main readings too
    expect(prefixes).toContain('A')
    expect(prefixes).toContain('F')
    expect(prefixes).toContain(null)
  })

  test('vintage-main candidate is ordered last', () => {
    const d = asDisambig(lookupSerialNumber('110000'))
    const last = d.candidates[d.candidates.length - 1]!
    expect(last.seriesLabel).toContain('main series')
  })

  test('each candidate carries its own dated year', () => {
    const d = asDisambig(lookupSerialNumber('110000'))
    for (const c of d.candidates) expect(typeof c.year).toBe('number')
  })

  test('a 5-digit number splits between the 5-digit series and a vintage grand', () => {
    const d = asDisambig(lookupSerialNumber('45000'))
    const labels = d.candidates.map(c => c.seriesLabel)
    expect(labels.some(l => l.includes('5-digit'))).toBe(true)
    expect(labels.some(l => l.includes('main series'))).toBe(true)
  })
})

describe('boundary confidence', () => {
  test('a serial exactly on a cut is flagged as a boundary', () => {
    // A series 1994 cut is 51275; sitting on it should flag 1993/1994
    const r = asResult(lookupSerialNumber('A51275'))
    expect(r.confidence).toBe('boundary')
    expect([1993, 1994]).toContain(r.boundaryYear!)
  })

  test('a serial mid-year is exact', () => {
    const r = asResult(lookupSerialNumber('A45000')) // well inside 1993 (40976..51275)
    expect(r.confidence).toBe('exact')
    expect(r.boundaryYear).toBeNull()
  })
})

describe('input hygiene', () => {
  test('empty input', () => {
    expect(asError(lookupSerialNumber('  ')).type).toBe('invalid')
  })
  test('spaces and hyphens are stripped', () => {
    expect(asResult(lookupSerialNumber('a 49 000')).country).toBe('USA')
  })
})
