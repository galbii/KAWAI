/**
 * Warranty coverage resolver.
 *
 * Given a Kawai product (type + model number), determine the applicable
 * warranty terms. Given a purchase date, compute remaining coverage.
 *
 * Pure functions only — safe to import from server or client.
 */

export type WarrantyCategory = 'digital' | 'acoustic' | 'accessory'

export interface WarrantyInfo {
  category: WarrantyCategory
  /** Duration of full coverage (parts + labor unless laborYears is shorter). */
  durationYears: number
  /** Set only when labor coverage is shorter than parts (MP/VPC). */
  laborYears?: number
  label: string
  /** Where the human-readable warranty document lives. Null for accessories. */
  detailHref: string | null
  /** Digital series label for display, when known. */
  series?: string
  /** True when we fell back to a default because the model prefix wasn't recognized. */
  inferred?: boolean
}

interface DigitalSeriesEntry {
  seriesId: string
  seriesLabel: string
  durationYears: number
  laborYears?: number
  label: string
  prefixes: RegExp[]
}

const DIGITAL_SERIES: DigitalSeriesEntry[] = [
  {
    seriesId: 'cn-ca-dg-nv',
    seriesLabel: 'CN · CA · DG · NV Series',
    durationYears: 5,
    label: '5-Year Limited Warranty',
    prefixes: [/^cn/i, /^ca/i, /^dg/i, /^nv/i],
  },
  {
    seriesId: 'cx-kdp-es',
    seriesLabel: 'CX · KDP · ES Series',
    durationYears: 3,
    label: '3-Year Limited Warranty',
    prefixes: [/^cx/i, /^kdp/i, /^es/i],
  },
  {
    seriesId: 'mp-vpc',
    seriesLabel: 'MP · VPC Series',
    durationYears: 3,
    laborYears: 1,
    label: '3-Year Parts / 1-Year Labor',
    prefixes: [/^mp/i, /^vpc/i],
  },
]

const ACOUSTIC_LABEL = 'Full 10-Year Transferable Warranty'

/**
 * Strip spaces and dashes from a model number for prefix matching.
 * Returns an empty string if model is nullish.
 */
function normalizeModel(model: string | undefined | null): string {
  return (model ?? '').replace(/[\s-]/g, '')
}

/**
 * Resolve warranty info from a Kawai product type and optional model number.
 *
 * - Acoustic types (grand, upright, shigeru, hybrid) → 10-year transferable.
 * - Digital type → series lookup via model prefix; falls back to 3 years when unknown.
 * - Accessory → null detailHref (no separate warranty).
 */
export function getWarrantyForModel(
  productType: string | undefined | null,
  model?: string | null,
): WarrantyInfo {
  const type = (productType ?? '').toLowerCase()

  if (['grand', 'upright', 'shigeru', 'hybrid'].includes(type)) {
    return {
      category: 'acoustic',
      durationYears: 10,
      label: ACOUSTIC_LABEL,
      detailHref: '/warranty/acoustic',
    }
  }

  if (type === 'digital') {
    const normalized = normalizeModel(model)
    const matched = normalized
      ? DIGITAL_SERIES.find((s) => s.prefixes.some((re) => re.test(normalized)))
      : undefined

    if (matched) {
      return {
        category: 'digital',
        durationYears: matched.durationYears,
        ...(matched.laborYears !== undefined && { laborYears: matched.laborYears }),
        label: matched.label,
        detailHref: '/warranty/digital',
        series: matched.seriesLabel,
      }
    }

    return {
      category: 'digital',
      durationYears: 3,
      label: '3-Year Limited Warranty',
      detailHref: '/warranty/digital',
      inferred: true,
    }
  }

  if (type === 'accessory') {
    return {
      category: 'accessory',
      durationYears: 0,
      label: 'Accessories are not separately warranted',
      detailHref: null,
    }
  }

  // Unknown type — treat as acoustic (most generous, safest customer-facing default).
  return {
    category: 'acoustic',
    durationYears: 10,
    label: ACOUSTIC_LABEL,
    detailHref: '/warranty/acoustic',
    inferred: true,
  }
}

export interface CoverageStatus {
  expiresOn: Date
  isActive: boolean
  daysRemaining: number
  /** Human-friendly "4 years, 11 months" or "Expired 3 years ago". */
  remainingLabel: string
}

/**
 * Compute coverage status given a purchase date and warranty info.
 * Returns null when no expiration applies (accessories).
 */
export function calculateCoverage(
  purchaseDate: Date,
  info: WarrantyInfo,
  now: Date = new Date(),
): CoverageStatus | null {
  if (info.durationYears <= 0) return null

  const expiresOn = new Date(purchaseDate)
  expiresOn.setFullYear(expiresOn.getFullYear() + info.durationYears)

  const msPerDay = 1000 * 60 * 60 * 24
  const daysRemaining = Math.floor((expiresOn.getTime() - now.getTime()) / msPerDay)
  const isActive = daysRemaining >= 0

  return {
    expiresOn,
    isActive,
    daysRemaining,
    remainingLabel: formatRemaining(daysRemaining),
  }
}

/**
 * Format a day count into "4 years, 11 months remaining" or "Expired 3 years ago".
 */
function formatRemaining(days: number): string {
  const absDays = Math.abs(days)
  const years = Math.floor(absDays / 365)
  const remainingDays = absDays % 365
  const months = Math.floor(remainingDays / 30)

  const parts: string[] = []
  if (years > 0) parts.push(`${years} year${years === 1 ? '' : 's'}`)
  if (months > 0) parts.push(`${months} month${months === 1 ? '' : 's'}`)
  if (parts.length === 0) parts.push(`${absDays} day${absDays === 1 ? '' : 's'}`)

  return days >= 0 ? `${parts.join(', ')} remaining` : `Expired ${parts.join(', ')} ago`
}

/**
 * Format a date as "April 22, 2030".
 */
export function formatLongDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
