export type ProductionCountry = 'Japan' | 'USA' | 'Indonesia'

export interface SerialEntry {
  year: number
  serialStart: number
}

export interface LookupResult {
  country: ProductionCountry
  year: number
  yearEnd: number | null
  /**
   * True when a no-prefix numeric serial falls in the range shared by two
   * distinct Kawai numbering series (a vintage grand vs. a separate, later
   * Japanese series). When true, `altYear`/`altYearEnd` hold the alternate
   * interpretation.
   */
  isAmbiguous: boolean
  altYear: number | null
  altYearEnd: number | null
  serialNormalized: string
}

export interface LookupError {
  type: 'invalid' | 'out-of-range-low' | 'out-of-range-high'
  message: string
}

/*
 * Serial → production-year reference tables.
 *
 * The pre-1987 Japan grand figures are the approximate first serial produced
 * each year, per Kawai Musical Instruments Mfg. Co., Ltd.'s official FAQ. Every
 * other table (the lettered series A/B/C/E/F/S/R, the 1987+ Japan figures, and
 * the secondary numeric series) is derived from Kawai's master production
 * database (1.55M dated records, 1987–2026).
 *
 * Convention: `serialStart` is the lowest serial mapped to that year. For the
 * database-derived rows it is `previousYearMaxSerial + 1`, which makes the
 * boundaries strictly increasing and lets `findYear` resolve a serial to the
 * earliest year whose production reached it. Real per-year ranges overlap, so
 * a serial within an overlap zone can be off by ~1 year — dates are approximate.
 */

// ── Japan, main numeric series (grands & uprights) ──
// 1927–2024 from Kawai's official FAQ chart; 2025–2026 extended from the master database.
const JAPAN: SerialEntry[] = [
  { year: 1927, serialStart: 4200 },
  { year: 1930, serialStart: 6000 },
  { year: 1935, serialStart: 8350 },
  { year: 1940, serialStart: 9600 },
  { year: 1945, serialStart: 12000 },
  { year: 1950, serialStart: 14200 },
  { year: 1952, serialStart: 15000 },
  { year: 1953, serialStart: 16200 },
  { year: 1954, serialStart: 18600 },
  { year: 1955, serialStart: 20590 },
  { year: 1956, serialStart: 21300 },
  { year: 1957, serialStart: 22500 },
  { year: 1958, serialStart: 23200 },
  { year: 1960, serialStart: 26000 },
  { year: 1961, serialStart: 34500 },
  { year: 1962, serialStart: 75760 },
  { year: 1963, serialStart: 85622 },
  { year: 1964, serialStart: 132307 },
  { year: 1965, serialStart: 163178 },
  { year: 1966, serialStart: 203433 },
  { year: 1967, serialStart: 251660 },
  { year: 1968, serialStart: 303686 },
  { year: 1969, serialStart: 369088 },
  { year: 1970, serialStart: 425121 },
  { year: 1971, serialStart: 488834 },
  { year: 1972, serialStart: 558216 },
  { year: 1973, serialStart: 633601 },
  { year: 1974, serialStart: 718768 },
  { year: 1975, serialStart: 785568 },
  { year: 1976, serialStart: 844362 },
  { year: 1977, serialStart: 904384 },
  { year: 1978, serialStart: 973490 },
  { year: 1979, serialStart: 1067130 },
  { year: 1980, serialStart: 1126366 },
  { year: 1981, serialStart: 1219355 },
  { year: 1982, serialStart: 1300000 },
  { year: 1983, serialStart: 1380000 },
  { year: 1984, serialStart: 1475000 },
  { year: 1985, serialStart: 1550000 },
  { year: 1986, serialStart: 1630500 },
  { year: 1987, serialStart: 1706250 },
  { year: 1988, serialStart: 1781250 },
  { year: 1989, serialStart: 1856250 },
  { year: 1990, serialStart: 1950000 },
  { year: 1991, serialStart: 2000000 },
  { year: 1992, serialStart: 2050000 },
  { year: 1993, serialStart: 2100000 },
  { year: 1994, serialStart: 2160743 },
  { year: 1995, serialStart: 2197503 },
  { year: 1996, serialStart: 2244232 },
  { year: 1997, serialStart: 2279943 },
  { year: 1998, serialStart: 2314043 },
  { year: 1999, serialStart: 2350000 },
  { year: 2000, serialStart: 2380000 },
  { year: 2001, serialStart: 2410000 },
  { year: 2002, serialStart: 2430000 },
  { year: 2003, serialStart: 2466000 },
  { year: 2004, serialStart: 2495000 },
  { year: 2005, serialStart: 2518000 },
  { year: 2006, serialStart: 2543000 },
  { year: 2007, serialStart: 2566000 },
  { year: 2008, serialStart: 2585000 },
  { year: 2009, serialStart: 2602000 },
  { year: 2010, serialStart: 2615000 },
  { year: 2011, serialStart: 2628000 },
  { year: 2012, serialStart: 2639000 },
  { year: 2013, serialStart: 2651000 },
  { year: 2014, serialStart: 2664000 },
  { year: 2015, serialStart: 2675000 },
  { year: 2016, serialStart: 2686000 },
  { year: 2017, serialStart: 2700000 },
  { year: 2018, serialStart: 2710000 },
  { year: 2019, serialStart: 2730000 },
  { year: 2020, serialStart: 2740000 },
  { year: 2021, serialStart: 2750000 },
  { year: 2022, serialStart: 2770000 },
  { year: 2023, serialStart: 2780000 },
  { year: 2024, serialStart: 2790000 },
  // 2025–2026 extended from the master database (FAQ chart stops at 2024)
  { year: 2025, serialStart: 2796800 },
  { year: 2026, serialStart: 2804707 },
]

// ── Japan, secondary numeric series (no prefix, ~22k–126k) ──
// A separate counter that overlaps the 1960s grand serial range, so a bare
// number in this band is ambiguous. Derived from the master database.
const JAPAN_SECONDARY: SerialEntry[] = [
  { year: 1987, serialStart: 38947 },
  { year: 1988, serialStart: 106384 },
  { year: 1989, serialStart: 108250 },
  { year: 1990, serialStart: 110060 },
  { year: 1991, serialStart: 112168 },
  { year: 1992, serialStart: 113639 },
  { year: 1993, serialStart: 115387 },
  { year: 1994, serialStart: 116877 },
  { year: 1995, serialStart: 118139 },
  { year: 1996, serialStart: 119199 },
  { year: 1997, serialStart: 119940 },
  { year: 1998, serialStart: 120859 },
  { year: 1999, serialStart: 121557 },
  { year: 2000, serialStart: 122150 },
  { year: 2001, serialStart: 122641 },
  { year: 2002, serialStart: 123167 },
  { year: 2003, serialStart: 123622 },
  { year: 2004, serialStart: 123783 },
  { year: 2005, serialStart: 124024 },
  { year: 2006, serialStart: 124209 },
  { year: 2007, serialStart: 124545 },
  { year: 2008, serialStart: 124865 },
  { year: 2009, serialStart: 125081 },
  { year: 2010, serialStart: 125304 },
  { year: 2011, serialStart: 125518 },
  { year: 2012, serialStart: 125649 },
  { year: 2013, serialStart: 125808 },
  { year: 2014, serialStart: 125945 },
  { year: 2015, serialStart: 126073 },
  { year: 2016, serialStart: 126128 },
  { year: 2017, serialStart: 126193 },
  { year: 2018, serialStart: 126240 },
  { year: 2019, serialStart: 126261 },
  { year: 2020, serialStart: 126318 },
  { year: 2021, serialStart: 126345 },
  { year: 2022, serialStart: 126365 },
  { year: 2023, serialStart: 126403 },
  { year: 2024, serialStart: 126435 },
  { year: 2025, serialStart: 126445 },
  { year: 2026, serialStart: 126462 },
]
const SECONDARY_MIN = 38947
const SECONDARY_MAX = 126463

// ── USA (prefix A), Lincolnton, NC — production ended 2004 ──
// 1988–1989 from FAQ; 1990–2004 from the master database.
const USA: SerialEntry[] = [
  { year: 1988, serialStart: 6904 },
  { year: 1989, serialStart: 7500 },
  { year: 1990, serialStart: 13725 },
  { year: 1991, serialStart: 23428 },
  { year: 1992, serialStart: 32067 },
  { year: 1993, serialStart: 40976 },
  { year: 1994, serialStart: 51275 },
  { year: 1995, serialStart: 59498 },
  { year: 1996, serialStart: 69416 },
  { year: 1997, serialStart: 76604 },
  { year: 1998, serialStart: 85348 },
  { year: 1999, serialStart: 93808 },
  { year: 2000, serialStart: 97018 },
  { year: 2001, serialStart: 102080 },
  { year: 2002, serialStart: 108618 },
  { year: 2003, serialStart: 109966 },
  { year: 2004, serialStart: 115063 },
]

// ── Indonesia (prefix F), Surabaya ──  master database, 2002–2026
const INDONESIA: SerialEntry[] = [
  { year: 2002, serialStart: 11 },
  { year: 2003, serialStart: 165 },
  { year: 2004, serialStart: 2352 },
  { year: 2005, serialStart: 5385 },
  { year: 2006, serialStart: 11004 },
  { year: 2007, serialStart: 19538 },
  { year: 2008, serialStart: 31432 },
  { year: 2009, serialStart: 41446 },
  { year: 2010, serialStart: 49590 },
  { year: 2011, serialStart: 59459 },
  { year: 2012, serialStart: 71160 },
  { year: 2013, serialStart: 82386 },
  { year: 2014, serialStart: 93060 },
  { year: 2015, serialStart: 103196 },
  { year: 2016, serialStart: 113832 },
  { year: 2017, serialStart: 124637 },
  { year: 2018, serialStart: 134744 },
  { year: 2019, serialStart: 145615 },
  { year: 2020, serialStart: 157335 },
  { year: 2021, serialStart: 166678 },
  { year: 2022, serialStart: 179415 },
  { year: 2023, serialStart: 193585 },
  { year: 2024, serialStart: 202463 },
  { year: 2025, serialStart: 210335 },
  { year: 2026, serialStart: 218032 },
]

// Note: the prefix-B series (Japan, 1991–2026) is intentionally NOT handled by
// this lookup. A B serial is rejected in `lookupSerialNumber` rather than dated,
// because stripping the letter and reading it as a plain number would mis-date
// the piano by decades.

// ── Japan, prefix C ──  master database, 1999–2003 (discontinued)
const C_SERIES: SerialEntry[] = [
  { year: 1999, serialStart: 10001 },
  { year: 2000, serialStart: 10071 },
  { year: 2001, serialStart: 10511 },
  { year: 2002, serialStart: 10793 },
  { year: 2003, serialStart: 11127 },
]

// ── Japan, prefix E ──  master database, 1995–2002 (discontinued)
const E_SERIES: SerialEntry[] = [
  { year: 1995, serialStart: 10001 },
  { year: 1996, serialStart: 12770 },
  { year: 1997, serialStart: 13957 },
  { year: 1998, serialStart: 15241 },
  { year: 1999, serialStart: 16813 },
  { year: 2000, serialStart: 17023 },
  { year: 2001, serialStart: 17163 },
  { year: 2002, serialStart: 17313 },
]

// ── Japan, prefix S ──  master database, 1987–1997 (discontinued)
const S_SERIES: SerialEntry[] = [
  { year: 1987, serialStart: 128917 },
  { year: 1988, serialStart: 130038 },
  { year: 1989, serialStart: 130376 },
  { year: 1990, serialStart: 131782 },
  { year: 1991, serialStart: 132362 },
  { year: 1992, serialStart: 133222 },
  { year: 1993, serialStart: 133302 },
  { year: 1994, serialStart: 133447 },
  { year: 1995, serialStart: 133502 },
  { year: 1996, serialStart: 133512 },
  { year: 1997, serialStart: 133552 },
]

// ── Japan, prefix R ──  master database, single known record
const R_SERIES: SerialEntry[] = [{ year: 2013, serialStart: 90789 }]

interface Series {
  country: ProductionCountry
  table: SerialEntry[]
  /** Highest known serial in this series; above it → out-of-range-high. Omit for ongoing series. */
  ceiling?: number
  /** Last production year, used in the out-of-range-high message. */
  endYear?: number
}

// Lettered prefixes mapped to their series. Ongoing series (B, F) omit a ceiling.
const PREFIX_SERIES: Record<string, Series> = {
  A: { country: 'USA', table: USA, ceiling: 116125, endYear: 2004 },
  F: { country: 'Indonesia', table: INDONESIA },
  C: { country: 'Japan', table: C_SERIES, ceiling: 11347, endYear: 2003 },
  E: { country: 'Japan', table: E_SERIES, ceiling: 17357, endYear: 2002 },
  S: { country: 'Japan', table: S_SERIES, ceiling: 133557, endYear: 1997 },
  R: { country: 'Japan', table: R_SERIES },
}

function findYear(table: SerialEntry[], num: number): { year: number; yearEnd: number | null } | null {
  if (num < (table[0]?.serialStart ?? Infinity)) return null
  let match: SerialEntry | undefined
  for (const entry of table) {
    if (entry.serialStart <= num) match = entry
    else break
  }
  if (!match) return null
  const idx = table.indexOf(match)
  const next = table[idx + 1]
  return { year: match.year, yearEnd: next ? next.year : null }
}

export function lookupSerialNumber(raw: string): LookupResult | LookupError {
  const input = raw.trim().toUpperCase().replace(/\s/g, '')

  if (!input) {
    return { type: 'invalid', message: 'Please enter a serial number.' }
  }

  // Prefix-B serials are not supported — reject rather than mis-date them.
  if (input[0] === 'B') {
    return {
      type: 'invalid',
      message:
        'Serial numbers beginning with “B” aren’t supported by this lookup. Your authorized Kawai dealer can identify the production year.',
    }
  }

  // Known lettered series (A, C, E, F, R, S)
  const prefix = input[0]!
  const series = /[A-Z]/.test(prefix) ? PREFIX_SERIES[prefix] : undefined

  if (series) {
    // Strip any leading zeros so "A049000" and "A49000" resolve identically.
    const numStr = input.slice(1).replace(/\D/g, '').replace(/^0+/, '')
    const num = parseInt(numStr, 10)
    if (numStr === '' || isNaN(num)) {
      return {
        type: 'invalid',
        message: `Invalid serial number format. Expected ${prefix} followed by digits (e.g. ${prefix}049000).`,
      }
    }

    const first = series.table[0]!
    if (num < first.serialStart) {
      return {
        type: 'out-of-range-low',
        message: `Serial number is below the earliest known ${series.country} record for the ${prefix} series (${prefix}${String(first.serialStart).padStart(6, '0')}, ${first.year}).`,
      }
    }
    if (series.ceiling !== undefined && num > series.ceiling) {
      return {
        type: 'out-of-range-high',
        message: `The ${prefix} series ended in ${series.endYear}. Serial numbers above ${prefix}${String(series.ceiling).padStart(6, '0')} are outside the known range.`,
      }
    }

    const result = findYear(series.table, num)!
    return {
      country: series.country,
      year: result.year,
      yearEnd: result.yearEnd,
      isAmbiguous: false,
      altYear: null,
      altYearEnd: null,
      serialNormalized: `${prefix}${num}`,
    }
  }

  // No recognized prefix → treat as a numeric serial. Disregard any stray
  // leading letter (per Kawai guidance for unlabeled/atypical serials) and
  // strip leading zeros so "0038947" resolves the same as "38947".
  const cleaned = input.replace(/\D/g, '').replace(/^0+/, '')
  const num = parseInt(cleaned, 10)

  if (cleaned === '' || isNaN(num)) {
    return { type: 'invalid', message: 'Invalid serial number. Please enter a valid Kawai serial number.' }
  }

  const japanResult = findYear(JAPAN, num)
  if (!japanResult) {
    return {
      type: 'out-of-range-low',
      message: 'Serial number is below the earliest Kawai production record. Very early pianos (pre-1927) may not be in our reference data.',
    }
  }

  // A bare number in the secondary-series band could be either a vintage grand
  // or a later non-grand model that shares this numeric range.
  let isAmbiguous = false
  let altYear: number | null = null
  let altYearEnd: number | null = null

  if (num >= SECONDARY_MIN && num <= SECONDARY_MAX) {
    const altResult = findYear(JAPAN_SECONDARY, num)
    if (altResult && altResult.year !== japanResult.year) {
      isAmbiguous = true
      altYear = altResult.year
      altYearEnd = altResult.yearEnd
    }
  }

  return {
    country: 'Japan',
    year: japanResult.year,
    yearEnd: japanResult.yearEnd,
    isAmbiguous,
    altYear,
    altYearEnd,
    serialNormalized: String(num),
  }
}

export function getApproximateAge(year: number): number {
  return new Date().getFullYear() - year
}
