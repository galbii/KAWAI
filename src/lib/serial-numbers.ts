export type ProductionCountry = 'Japan' | 'USA' | 'Indonesia'

export interface SerialEntry {
  year: number
  serialStart: number
}

export interface LookupResult {
  country: ProductionCountry
  year: number
  yearEnd: number | null
  isKxAmbiguous: boolean
  kxYear: number | null
  kxYearEnd: number | null
  serialNormalized: string
}

export interface LookupError {
  type: 'invalid' | 'out-of-range-low' | 'out-of-range-high'
  message: string
}

// All values are the approximate first serial number produced for that year.
// Source: Kawai Musical Instruments Mfg. Co., Ltd. official FAQ

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
]

// Stored as raw numeric values (strip the leading 'A' before comparing)
const USA: SerialEntry[] = [
  { year: 1988, serialStart: 6904 },
  { year: 1989, serialStart: 7500 },
  { year: 1990, serialStart: 10200 },
  { year: 1991, serialStart: 21300 },
  { year: 1992, serialStart: 30515 },
  { year: 1993, serialStart: 39267 },
  { year: 1994, serialStart: 49071 },
  { year: 1995, serialStart: 56689 },
  { year: 1996, serialStart: 64000 },
  { year: 1997, serialStart: 74000 },
  { year: 1998, serialStart: 81000 },
  { year: 1999, serialStart: 90000 },
  { year: 2000, serialStart: 96000 },
  { year: 2001, serialStart: 100000 },
  { year: 2002, serialStart: 104000 },
  { year: 2003, serialStart: 111000 },
  { year: 2004, serialStart: 115300 },
]

// Stored as raw numeric values (strip the leading 'F' before comparing)
const INDONESIA: SerialEntry[] = [
  { year: 2003, serialStart: 200 },
  { year: 2004, serialStart: 2200 },
  { year: 2005, serialStart: 4700 },
  { year: 2006, serialStart: 10600 },
  { year: 2007, serialStart: 18700 },
  { year: 2008, serialStart: 30500 },
  { year: 2009, serialStart: 40085 },
  { year: 2010, serialStart: 49000 },
  { year: 2011, serialStart: 57700 },
  { year: 2012, serialStart: 67900 },
  { year: 2013, serialStart: 80000 },
  { year: 2014, serialStart: 92000 },
  { year: 2015, serialStart: 102000 },
  { year: 2016, serialStart: 112000 },
  { year: 2017, serialStart: 122000 },
  { year: 2018, serialStart: 132000 },
  { year: 2019, serialStart: 142000 },
  { year: 2020, serialStart: 155000 },
  { year: 2021, serialStart: 165000 },
  { year: 2022, serialStart: 180000 },
  { year: 2023, serialStart: 190000 },
  { year: 2024, serialStart: 200000 },
]

// KX models use a separate serial series that numerically overlaps with Japan production
const KX: SerialEntry[] = [
  { year: 2001, serialStart: 20000 },
  { year: 2002, serialStart: 21000 },
  { year: 2003, serialStart: 23000 },
  { year: 2004, serialStart: 26000 },
  { year: 2005, serialStart: 30000 },
  { year: 2006, serialStart: 32000 },
  { year: 2007, serialStart: 34000 },
  { year: 2008, serialStart: 36800 },
  { year: 2009, serialStart: 37900 },
  { year: 2010, serialStart: 38900 },
  { year: 2011, serialStart: 40000 },
  { year: 2012, serialStart: 41000 },
  { year: 2013, serialStart: 42000 },
]

const KX_MIN = KX[0]!.serialStart
const KX_MAX = KX[KX.length - 1]!.serialStart + 5000

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

  // Detect production series by prefix
  if (input.startsWith('F')) {
    const numStr = input.slice(1)
    const num = parseInt(numStr, 10)
    if (isNaN(num) || numStr === '') {
      return { type: 'invalid', message: 'Invalid serial number format. Expected F followed by digits (e.g. F049000).' }
    }
    const result = findYear(INDONESIA, num)
    if (!result) {
      return { type: 'out-of-range-low', message: 'Serial number is below the earliest known Indonesia production record (F000200, 2003).' }
    }
    return {
      country: 'Indonesia',
      year: result.year,
      yearEnd: result.yearEnd,
      isKxAmbiguous: false,
      kxYear: null,
      kxYearEnd: null,
      serialNormalized: `F${numStr.padStart(6, '0')}`,
    }
  }

  if (input.startsWith('A')) {
    const numStr = input.slice(1)
    const num = parseInt(numStr, 10)
    if (isNaN(num) || numStr === '') {
      return { type: 'invalid', message: 'Invalid serial number format. Expected A followed by digits (e.g. A49071).' }
    }
    const result = findYear(USA, num)
    if (!result) {
      return { type: 'out-of-range-low', message: 'Serial number is below the earliest known U.S. production record (A6904, 1988).' }
    }
    if (num > 120000) {
      return { type: 'out-of-range-high', message: 'U.S. production ended in 2004. Serial numbers above A115300 may be outside the known range.' }
    }
    return {
      country: 'USA',
      year: result.year,
      yearEnd: result.yearEnd,
      isKxAmbiguous: false,
      kxYear: null,
      kxYearEnd: null,
      serialNormalized: `A${num}`,
    }
  }

  // Strip any other leading letter (per official source: disregard letters other than A or F)
  const cleaned = input.replace(/^[B-EG-Z]+/, '')
  const num = parseInt(cleaned, 10)

  if (isNaN(num) || cleaned === '') {
    return { type: 'invalid', message: 'Invalid serial number. Please enter a valid Kawai serial number.' }
  }

  const japanResult = findYear(JAPAN, num)

  if (!japanResult) {
    return { type: 'out-of-range-low', message: 'Serial number is below the earliest Kawai production record. Very early pianos (pre-1927) may not be in our reference data.' }
  }

  // Check for KX ambiguity — KX models use a separate numeric series
  // that overlaps with 1950s–1960s Japan production numbers
  const isKxAmbiguous = num >= KX_MIN && num <= KX_MAX
  let kxYear: number | null = null
  let kxYearEnd: number | null = null

  if (isKxAmbiguous) {
    const kxResult = findYear(KX, num)
    if (kxResult) {
      kxYear = kxResult.year
      kxYearEnd = kxResult.yearEnd
    }
  }

  return {
    country: 'Japan',
    year: japanResult.year,
    yearEnd: japanResult.yearEnd,
    isKxAmbiguous,
    kxYear,
    kxYearEnd,
    serialNormalized: String(num),
  }
}

export function getApproximateAge(year: number): number {
  return new Date().getFullYear() - year
}
