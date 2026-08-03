export type ProductionCountry = 'Japan' | 'USA' | 'Indonesia'

export interface SerialEntry {
  year: number
  /** First serial of that year (a boundary "cut"). Strictly increasing within a series. */
  serialStart: number
}

/** A confidently dated serial. */
export interface LookupResult {
  kind: 'result'
  country: ProductionCountry
  year: number
  /**
   * 'exact' when the serial sits comfortably inside a year's range;
   * 'boundary' when it's close enough to a year cut that the true year could be
   * `boundaryYear` (a piano finished in late December is often serialized into
   * the following year).
   */
  confidence: 'exact' | 'boundary'
  boundaryYear: number | null
  serialNormalized: string
  /** Human label of the series this was dated against (e.g. "United States (A series)"). */
  seriesLabel: string
}

/** One possible reading of a bare number that matches more than one Kawai series. */
export interface Candidate {
  id: string
  /** The letter to look for on the plate, or null for the unprefixed numeric series. */
  prefix: string | null
  country: ProductionCountry
  seriesLabel: string
  year: number
  confidence: 'exact' | 'boundary'
  boundaryYear: number | null
}

/**
 * A bare number that lands in the range of several series at once. Per Kawai's
 * data the letter prefix is load-bearing (A/B/F occupy overlapping numeric
 * bands), so rather than guess we ask the owner to confirm which series is
 * stamped on their piano.
 */
export interface DisambiguationResult {
  kind: 'disambiguation'
  serialNormalized: string
  candidates: Candidate[]
}

export interface LookupError {
  kind: 'error'
  type: 'invalid' | 'out-of-range-low' | 'out-of-range-high'
  message: string
}

export type Lookup = LookupResult | DisambiguationResult | LookupError

/*
 * ── Serial → production-year reference data ──────────────────────────────
 *
 * Kawai runs several independent serial series in parallel. Within each series
 * serials advance near-monotonically with time, so a serial resolves to a year
 * by binary-searching the year "cuts" (each cut = the first serial of that
 * year, chosen to minimise misclassification between adjacent years).
 *
 * Because several series occupy overlapping numeric ranges, the letter prefix
 * is required to date a serial unambiguously. A bare number is resolved only
 * when it falls in exactly one series' range; otherwise the caller is asked to
 * supply the prefix.
 *
 * The lettered series (A/B/C/E/F/S) and the three unprefixed numeric series
 * (main, 5-digit, 6-digit) for 1987+ are derived from Kawai's master
 * production database (~1.45M dated records, 1987–2026). The pre-1987 rows of
 * the main series are Kawai's official FAQ chart (the only source for vintage
 * grands) and are stitched onto the database series at the 1987/1988 boundary.
 */

interface RawSeries {
  key: string
  country: ProductionCountry
  /** Letter stamped on the plate, or null for the unprefixed numeric series. */
  prefix: string | null
  /** Human label shown in results and disambiguation chips. */
  label: string
  firstYear: number
  minSerial: number
  maxSerial: number
  /** true → newer-than-data serials are still dated to the latest year, not rejected. */
  ongoing: boolean
  /** Approximate record count, used only to order disambiguation candidates. */
  rows: number
  /** year → first serial of that year. Omits firstYear (that's `minSerial`). */
  cuts: Record<number, number>
  /** MAIN carries pre-1987 FAQ rows and is the "vintage" reading in overlaps. */
  isVintageMain?: boolean
}

// ── Japan, main numeric series (grands & uprights), no prefix ──
// 1927–1987: Kawai official FAQ (first serial each year). 1988–2026: master
// database optimal cuts. The FAQ 1987 floor (1706250) is kept as the 1986→1987
// boundary; the database series' own 1987 floor is an outlier tail and ignored.
const MAIN_TABLE: SerialEntry[] = [
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
  // 1988+ from the master database (supersedes the rounded FAQ figures)
  { year: 1988, serialStart: 1784800 },
  { year: 1989, serialStart: 1857681 },
  { year: 1990, serialStart: 1927022 },
  { year: 1991, serialStart: 1994844 },
  { year: 1992, serialStart: 2056461 },
  { year: 1993, serialStart: 2112730 },
  { year: 1994, serialStart: 2160709 },
  { year: 1995, serialStart: 2200992 },
  { year: 1996, serialStart: 2246731 },
  { year: 1997, serialStart: 2282625 },
  { year: 1998, serialStart: 2320144 },
  { year: 1999, serialStart: 2353463 },
  { year: 2000, serialStart: 2382528 },
  { year: 2001, serialStart: 2412288 },
  { year: 2002, serialStart: 2441771 },
  { year: 2003, serialStart: 2468404 },
  { year: 2004, serialStart: 2496522 },
  { year: 2005, serialStart: 2520139 },
  { year: 2006, serialStart: 2544464 },
  { year: 2007, serialStart: 2565955 },
  { year: 2008, serialStart: 2585211 },
  { year: 2009, serialStart: 2602991 },
  { year: 2010, serialStart: 2615721 },
  { year: 2011, serialStart: 2628810 },
  { year: 2012, serialStart: 2641039 },
  { year: 2013, serialStart: 2653199 },
  { year: 2014, serialStart: 2663534 },
  { year: 2015, serialStart: 2676423 },
  { year: 2016, serialStart: 2688177 },
  { year: 2017, serialStart: 2700611 },
  { year: 2018, serialStart: 2711953 },
  { year: 2019, serialStart: 2723556 },
  { year: 2020, serialStart: 2736010 },
  { year: 2021, serialStart: 2746844 },
  { year: 2022, serialStart: 2760790 },
  { year: 2023, serialStart: 2774896 },
  { year: 2024, serialStart: 2787214 },
  { year: 2025, serialStart: 2796467 },
  { year: 2026, serialStart: 2804200 },
]

/** Build a SerialEntry[] from `firstYear`(=minSerial) + cut points. */
function tableFromCuts(firstYear: number, minSerial: number, cuts: Record<number, number>): SerialEntry[] {
  const entries: SerialEntry[] = [{ year: firstYear, serialStart: minSerial }]
  for (const y of Object.keys(cuts).map(Number).sort((a, b) => a - b)) {
    entries.push({ year: y, serialStart: cuts[y]! })
  }
  return entries
}

const RAW: RawSeries[] = [
  {
    key: 'MAIN',
    country: 'Japan',
    prefix: null,
    label: 'Japan (main series — grands & uprights)',
    firstYear: 1927,
    minSerial: 4200,
    maxSerial: 2806342,
    ongoing: true,
    rows: 1093422,
    cuts: {}, // table supplied directly (FAQ + database merge)
    isVintageMain: true,
  },
  {
    key: 'NUM-5d',
    country: 'Japan',
    prefix: null,
    label: 'Japan (5-digit numeric series)',
    firstYear: 1987,
    minSerial: 38947,
    maxSerial: 49386,
    ongoing: false,
    rows: 10415,
    cuts: {
      1988: 39977, 1989: 40927, 1990: 41997, 1991: 43191, 1992: 44161, 1993: 45011,
      1994: 45751, 1995: 46451, 1996: 47092, 1997: 47432, 1998: 47875, 1999: 48212,
      2000: 48497, 2001: 48752, 2002: 48992, 2003: 49187, 2004: 49228, 2005: 49293,
      2006: 49303, 2007: 49351, 2008: 49377,
    },
  },
  {
    key: 'NUM-6d',
    country: 'Japan',
    prefix: null,
    label: 'Japan (6-digit numeric series)',
    firstYear: 1987,
    minSerial: 104726,
    maxSerial: 126463,
    ongoing: true,
    rows: 21340,
    cuts: {
      1988: 106344, 1989: 108237, 1990: 110060, 1991: 112168, 1992: 113639, 1993: 115347,
      1994: 116875, 1995: 118139, 1996: 119199, 1997: 119940, 1998: 120859, 1999: 121557,
      2000: 122150, 2001: 122641, 2002: 123167, 2003: 123566, 2004: 123783, 2005: 124025,
      2006: 124209, 2007: 124524, 2008: 124865, 2009: 125081, 2010: 125304, 2011: 125510,
      2012: 125649, 2013: 125808, 2014: 125945, 2015: 126062, 2016: 126128, 2017: 126189,
      2018: 126240, 2019: 126261, 2020: 126318, 2021: 126345, 2022: 126365, 2023: 126403,
      2024: 126435, 2025: 126445, 2026: 126462,
    },
  },
  {
    key: 'A',
    country: 'USA',
    prefix: 'A',
    label: 'United States (A series)',
    firstYear: 1990,
    minSerial: 13725,
    maxSerial: 116125,
    ongoing: false,
    rows: 88888,
    cuts: {
      1991: 23428, 1992: 32067, 1993: 40976, 1994: 51275, 1995: 59504, 1996: 69166,
      1997: 76604, 1998: 85348, 1999: 93858, 2000: 97018, 2001: 102296, 2002: 108618,
      2003: 112733, 2004: 116116,
    },
  },
  {
    key: 'B',
    country: 'Japan',
    prefix: 'B',
    label: 'Japan (B series)',
    firstYear: 1991,
    minSerial: 103091,
    maxSerial: 218248,
    ongoing: true,
    rows: 111391,
    cuts: {
      1992: 103321, 1993: 105459, 1994: 108136, 1995: 110206, 1996: 112586, 1997: 115978,
      1998: 120412, 1999: 125733, 2000: 131780, 2001: 138181, 2002: 140951, 2003: 144224,
      2004: 148044, 2005: 152434, 2006: 156292, 2007: 159682, 2008: 162874, 2009: 166514,
      2010: 168609, 2011: 171197, 2012: 173812, 2013: 176476, 2014: 179298, 2015: 182426,
      2016: 185641, 2017: 188543, 2018: 191861, 2019: 195863, 2020: 200336, 2021: 202895,
      2022: 206677, 2023: 210423, 2024: 214280, 2025: 216122, 2026: 217824,
    },
  },
  {
    key: 'C',
    country: 'Japan',
    prefix: 'C',
    label: 'Japan (C series)',
    firstYear: 1999,
    minSerial: 10001,
    maxSerial: 11347,
    ongoing: false,
    rows: 1346,
    cuts: { 2000: 10071, 2001: 10511, 2002: 10793, 2003: 11127 },
  },
  {
    key: 'E',
    country: 'Japan',
    prefix: 'E',
    label: 'Japan (E series)',
    firstYear: 1995,
    minSerial: 10001,
    maxSerial: 17357,
    ongoing: false,
    rows: 7352,
    cuts: { 1996: 12764, 1997: 13955, 1998: 15241, 1999: 16781, 2000: 17023, 2001: 17163, 2002: 17313 },
  },
  {
    key: 'F',
    country: 'Indonesia',
    prefix: 'F',
    label: 'Indonesia (F series)',
    firstYear: 2002,
    minSerial: 11,
    maxSerial: 219475,
    ongoing: true,
    rows: 210442,
    cuts: {
      2003: 121, 2004: 2350, 2005: 4997, 2006: 10530, 2007: 18472, 2008: 30293,
      2009: 40329, 2010: 48793, 2011: 59268, 2012: 69566, 2013: 80819, 2014: 91370,
      2015: 101577, 2016: 112442, 2017: 122845, 2018: 133444, 2019: 144492, 2020: 155593,
      2021: 165047, 2022: 177225, 2023: 190983, 2024: 201381, 2025: 208916, 2026: 217367,
    },
  },
  {
    key: 'S',
    country: 'Japan',
    prefix: 'S',
    label: 'Japan (S series)',
    firstYear: 1987,
    minSerial: 128917,
    maxSerial: 133557,
    ongoing: false,
    rows: 4521,
    cuts: {
      1988: 130034, 1989: 130368, 1990: 131758, 1991: 132359, 1992: 133215, 1993: 133302,
      1994: 133447, 1995: 133502, 1996: 133529, 1997: 133552,
    },
  },
]

interface Series extends RawSeries {
  table: SerialEntry[]
  /**
   * Upper bound for treating a bare number as belonging to this series. Equals
   * `maxSerial` for discontinued series; ongoing series get modest headroom so a
   * just-built piano still matches, without swallowing much larger numbers from
   * an entirely different series.
   */
  matchCeiling: number
}

/**
 * Series intentionally left unregistered. They are excluded from both direct
 * (prefixed) dating and bare-number disambiguation — the lookup behaves as if
 * they don't exist. Their data blocks remain in `RAW` above so re-enabling is a
 * single edit here.
 */
const UNREGISTERED = new Set(['B'])

const SERIES: Series[] = RAW.filter(r => !UNREGISTERED.has(r.key)).map(r => {
  const table = r.key === 'MAIN' ? MAIN_TABLE : tableFromCuts(r.firstYear, r.minSerial, r.cuts)
  const headroom = r.ongoing ? Math.max(500, Math.round(r.maxSerial * 0.03)) : 0
  return { ...r, table, matchCeiling: r.maxSerial + headroom }
})

const SERIES_BY_PREFIX: Record<string, Series> = {}
for (const s of SERIES) if (s.prefix) SERIES_BY_PREFIX[s.prefix] = s

/** Unprefixed numeric series, checked for bare-number candidates. */
const BARE_SERIES = SERIES.filter(s => s.prefix === null)

interface Dated {
  year: number
  confidence: 'exact' | 'boundary'
  boundaryYear: number | null
}

/**
 * Binary-search a serial to its year within a series, and flag it as a
 * boundary case when it sits within ~2% of an adjacent year cut.
 */
function dateAgainst(table: SerialEntry[], num: number): Dated | null {
  if (num < (table[0]?.serialStart ?? Infinity)) return null

  let idx = 0
  for (let i = 0; i < table.length; i++) {
    if (table[i]!.serialStart <= num) idx = i
    else break
  }

  const thisStart = table[idx]!.serialStart
  const next = table[idx + 1]
  const prev = table[idx - 1]

  // Near the upper cut → could belong to the next year.
  if (next) {
    const span = next.serialStart - thisStart
    const margin = Math.max(2, Math.round(span * 0.02))
    if (next.serialStart - num <= margin) {
      return { year: table[idx]!.year, confidence: 'boundary', boundaryYear: next.year }
    }
  }
  // Near this year's own start → could belong to the previous year.
  if (prev) {
    const span = thisStart - prev.serialStart
    const margin = Math.max(2, Math.round(span * 0.02))
    if (num - thisStart <= margin) {
      return { year: table[idx]!.year, confidence: 'boundary', boundaryYear: prev.year }
    }
  }
  return { year: table[idx]!.year, confidence: 'exact', boundaryYear: null }
}

function normalize(raw: string): string {
  return raw.trim().toUpperCase().replace(/\s|-/g, '')
}

/** Parse digits after an optional leading letter, dropping leading zeros. */
function parseSerialDigits(input: string): number | null {
  const digits = input.replace(/\D/g, '').replace(/^0+/, '')
  if (digits === '') return null
  const n = parseInt(digits, 10)
  return Number.isNaN(n) ? null : n
}

function resultFor(series: Series, dated: Dated, num: number): LookupResult {
  return {
    kind: 'result',
    country: series.country,
    year: dated.year,
    confidence: dated.confidence,
    boundaryYear: dated.boundaryYear,
    serialNormalized: `${series.prefix ?? ''}${num}`,
    seriesLabel: series.label,
  }
}

export function lookupSerialNumber(raw: string): Lookup {
  const input = normalize(raw)
  if (!input) return { kind: 'error', type: 'invalid', message: 'Please enter a serial number.' }

  const firstChar = input[0]!
  const isLetter = /[A-Z]/.test(firstChar)
  const prefixedSeries = isLetter ? SERIES_BY_PREFIX[firstChar] : undefined

  // ── Prefixed serial: date directly against its series (unambiguous) ──
  if (prefixedSeries) {
    const num = parseSerialDigits(input.slice(1))
    if (num === null) {
      return {
        kind: 'error',
        type: 'invalid',
        message: `Invalid serial number format. Expected ${firstChar} followed by digits (e.g. ${firstChar}${String(prefixedSeries.minSerial).padStart(6, '0')}).`,
      }
    }
    if (num < prefixedSeries.minSerial) {
      return {
        kind: 'error',
        type: 'out-of-range-low',
        message: `Serial number is below the earliest known ${firstChar} series record (${firstChar}${prefixedSeries.minSerial}, ${prefixedSeries.firstYear}).`,
      }
    }
    if (!prefixedSeries.ongoing && num > prefixedSeries.maxSerial) {
      const endYear = prefixedSeries.table[prefixedSeries.table.length - 1]!.year
      return {
        kind: 'error',
        type: 'out-of-range-high',
        message: `The ${firstChar} series ended in ${endYear}. Serial numbers above ${firstChar}${prefixedSeries.maxSerial} are outside the known range.`,
      }
    }
    const dated = dateAgainst(prefixedSeries.table, num)!
    return resultFor(prefixedSeries, dated, num)
  }

  // ── Bare number (letter, if any, is unrecognized → treat as numeric) ──
  const num = parseSerialDigits(input)
  if (num === null) {
    return { kind: 'error', type: 'invalid', message: 'Invalid serial number. Please enter a valid Kawai serial number.' }
  }

  // Collect every series (prefixed and unprefixed) whose range contains this
  // number. The prefix is load-bearing, so overlaps aren't guessed.
  type Match = { series: Series; dated: Dated }
  const matches: Match[] = []
  for (const s of SERIES) {
    if (num < s.minSerial || num > s.matchCeiling) continue
    const dated = dateAgainst(s.table, num)
    if (dated) matches.push({ series: s, dated })
  }

  if (matches.length === 0) {
    const anyMin = Math.min(...SERIES.map(s => s.minSerial))
    if (num < anyMin) {
      return {
        kind: 'error',
        type: 'out-of-range-low',
        message: 'Serial number is below the earliest Kawai production record. Very early pianos (pre-1927) may not be in our reference data.',
      }
    }
    return {
      kind: 'error',
      type: 'out-of-range-high',
      message: 'Serial number is above the latest known Kawai record. Please double-check the number, or your authorized dealer can confirm the year.',
    }
  }

  if (matches.length === 1) {
    const { series, dated } = matches[0]!
    return resultFor(series, dated, num)
  }

  // Multiple series → ask the owner to confirm by prefix. Order the choices by
  // record volume, with the vintage-grand (main) reading last since a bare
  // number matching it is the old, less-likely interpretation.
  matches.sort((a, b) => {
    const av = a.series.isVintageMain ? 1 : 0
    const bv = b.series.isVintageMain ? 1 : 0
    if (av !== bv) return av - bv
    return b.series.rows - a.series.rows
  })

  return {
    kind: 'disambiguation',
    serialNormalized: String(num),
    candidates: matches.map(({ series, dated }) => ({
      id: series.key,
      prefix: series.prefix,
      country: series.country,
      seriesLabel: series.label,
      year: dated.year,
      confidence: dated.confidence,
      boundaryYear: dated.boundaryYear,
    })),
  }
}

export function getApproximateAge(year: number): number {
  return new Date().getFullYear() - year
}
