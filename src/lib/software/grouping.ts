/**
 * Pure helpers for the /software firmware directory: grouping the model list into
 * the sidebar tree, matching the search box, and formatting download sizes.
 *
 * No I/O — safe to import from server or client components, and unit-testable.
 */

import type {
  CategoryGroup,
  SoftwareCategory,
  SoftwareModel,
  SeriesGroup,
} from './types'

export const CATEGORY_ORDER: SoftwareCategory[] = ['digital', 'hybrid', 'anytime']

export const CATEGORY_LABELS: Record<SoftwareCategory, string> = {
  digital: 'Digital Pianos',
  hybrid: 'Hybrid Pianos',
  anytime: 'AnyTime & AURES',
}

/** Display order for series within a category. Anything unlisted sorts last, alphabetically. */
export const SERIES_ORDER: string[] = [
  'CA', 'CN', 'CS', 'CX', 'DG', 'ES', 'MP', 'CP', 'NV', 'ATX', 'AURES',
]

export const SERIES_LABELS: Record<string, string> = {
  CA: 'CA Series',
  CN: 'CN Series',
  CS: 'CS Series',
  CX: 'CX Line',
  DG: 'DG Series',
  ES: 'ES Series',
  MP: 'MP Series',
  CP: 'CP Series',
  NV: 'Novus NV',
  ATX: 'AnyTime ATX',
  AURES: 'AURES',
}

/** Brand-name prefixes that precede the real model designation. */
const NAME_PREFIXES = /^(Novus|AnyTime|AURES)\s+/i

/**
 * Split "CA901" into its alpha prefix, numeric body and trailing suffix so model
 * lists sort the way a person reads them. A plain string sort puts CA901 before
 * CA99 (because "9" < "0" at the third character), which scrambles every series.
 */
function parseModelName(name: string): { prefix: string; num: number; suffix: string } {
  // Combined models ("CA99/CA79") sort by their first half.
  const head = name.replace(NAME_PREFIXES, '').split('/')[0]?.trim() ?? ''
  const match = /^([A-Za-z]*)(\d*)(.*)$/.exec(head)
  return {
    prefix: (match?.[1] ?? '').toUpperCase(),
    num: match?.[2] ? Number.parseInt(match[2], 10) : 0,
    suffix: (match?.[3] ?? '').toUpperCase(),
  }
}

/** Natural sort comparator for model names: series prefix, then number, then suffix. */
export function compareModelNames(a: string, b: string): number {
  const pa = parseModelName(a)
  const pb = parseModelName(b)
  if (pa.prefix !== pb.prefix) return pa.prefix < pb.prefix ? -1 : 1
  if (pa.num !== pb.num) return pa.num - pb.num
  if (pa.suffix !== pb.suffix) return pa.suffix < pb.suffix ? -1 : 1
  return 0
}

/**
 * Strip everything but letters and digits so a query matches regardless of how the
 * user types separators — "nv-12", "NV 12" and "nv12" all find the Novus NV12.
 */
function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '')
}

export function matchesQuery(model: SoftwareModel, query: string): boolean {
  const q = normalize(query)
  if (!q) return true

  const haystacks = [model.model, model.series, ...model.aliases]
  return haystacks.some((h) => normalize(h).includes(q))
}

export function filterModels(models: SoftwareModel[], query: string): SoftwareModel[] {
  const q = query.trim()
  if (!q) return models
  return models.filter((m) => matchesQuery(m, q))
}

function seriesRank(series: string): number {
  const i = SERIES_ORDER.indexOf(series.toUpperCase())
  return i === -1 ? SERIES_ORDER.length : i
}

/**
 * Group a (possibly already filtered) model list into the Category → Series → Model
 * tree the sidebar renders. Empty categories and series are dropped, so passing a
 * filtered list prunes the tree for free.
 */
export function buildTree(models: SoftwareModel[]): CategoryGroup[] {
  const groups: CategoryGroup[] = []

  for (const category of CATEGORY_ORDER) {
    const inCategory = models.filter((m) => m.category === category)
    if (inCategory.length === 0) continue

    const bySeries = new Map<string, SoftwareModel[]>()
    for (const m of inCategory) {
      const key = m.series.toUpperCase()
      const bucket = bySeries.get(key)
      if (bucket) bucket.push(m)
      else bySeries.set(key, [m])
    }

    const series: SeriesGroup[] = [...bySeries.entries()]
      .map(([name, list]) => ({
        series: name,
        count: list.length,
        models: [...list].sort((a, b) => compareModelNames(a.model, b.model)),
      }))
      .sort((a, b) => {
        const rank = seriesRank(a.series) - seriesRank(b.series)
        return rank !== 0 ? rank : a.series.localeCompare(b.series)
      })

    groups.push({
      category,
      label: CATEGORY_LABELS[category],
      count: inCategory.length,
      series,
    })
  }

  return groups
}

/** Human-readable file size, or null when the size is unknown. */
export function formatBytes(bytes: number | null | undefined): string | null {
  if (typeof bytes !== 'number' || !Number.isFinite(bytes) || bytes <= 0) return null
  const MB = 1024 * 1024
  if (bytes >= MB) return `${Math.round(bytes / MB)} MB`
  return `${Math.round(bytes / 1024)} KB`
}
