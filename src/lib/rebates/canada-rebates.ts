import { normalizeModel } from '@/lib/data/rebates'

/**
 * Canada-specific consumer rebates (ca.kawaius.com) — the KCM Q3 program.
 * Amounts are CAD. Models not listed here have no Canada rebate (callers fall
 * back to the supplied value where one is provided).
 *
 * Keys are matched case- and dash-insensitively (see {@link normalizeModel}), so
 * 'K200' also resolves a CMS model stored as 'K-200'.
 */
export const CANADA_REBATES: Record<string, number> = {
  // Acoustic pianos (Ebony Polish only)
  GL20: 2600,
  K200: 900,
  K300: 1300,
  K400: 1300,
  K500: 1700,
  ND21: 900,
  // Digital pianos
  CN201: 150,
  CN301: 200,
  CA401: 200,
  CA501: 250,
  CA701: 350,
  CA901: 500,
  'DG-30': 500,
  ES60: 40,
  ES120: 60,
  ES920: 125,
  CX102: 100,
  CX202: 125,
  // Stage pianos / controllers
  MP7SE: 175,
  MP11SE: 225,
  VPC1: 200,
}

/** Normalized-model → CAD rebate, so 'K-200' / 'k200' / 'K200' all resolve. */
const CANADA_BY_NORMALIZED: ReadonlyMap<string, number> = new Map(
  Object.entries(CANADA_REBATES).map(([model, rebate]) => [normalizeModel(model), rebate]),
)

/** The Canada rebate for a model, or `undefined` when it isn't in the CA program. */
export function getCanadaRebate(model: string): number | undefined {
  return CANADA_BY_NORMALIZED.get(normalizeModel(model))
}

/** CA rebate for a model, falling back to `fallback` (used by the Pages rebate block). */
export function getConsumerRebate(model: string, isCanada: boolean, fallback: number): number {
  if (!isCanada) return fallback
  return getCanadaRebate(model) ?? fallback
}
