/**
 * Active rebate program for the /signup rebate showcase.
 *
 * This is the single source of rebate AMOUNTS. Everything else shown on a rebate
 * card (name, image, slug, price, category) is joined in from the Products
 * collection by matching `model` — see getRebateShowcase() in queries.ts.
 *
 * To update each quarter: edit REBATE_PROGRAM and the REBATES list below. A model
 * that has no matching active product is simply skipped (logged server-side).
 * Amounts are USD (Kawai America Corporation program).
 */

export const REBATE_PROGRAM = 'Q3 Rebates'

export type RebateEntry = {
  /** Model identifier — matched to a product case- and dash-insensitively (see normalizeModel). */
  model: string
  /** Rebate amount in USD off MSRP. */
  rebate: number
  /** Optional eligibility / finish qualifier shown on the card (e.g. "EP only", "B/W"). */
  note?: string
}

export const REBATES: RebateEntry[] = [
  // Acoustic — grand
  { model: 'GL10', rebate: 4500, note: 'EP only' },
  { model: 'GL20', rebate: 4000, note: 'EP only' },
  // Acoustic — upright
  { model: 'K15', rebate: 1200, note: 'EP only' },
  { model: 'K200', rebate: 2100, note: 'EP only' },
  { model: 'K300', rebate: 2200, note: 'EP only' },
  { model: 'K400', rebate: 2600, note: 'EP only' },
  { model: 'K500', rebate: 3200, note: 'EP only' },
  // Digital
  { model: 'CN201', rebate: 150 },
  { model: 'CN301', rebate: 200 },
  { model: 'CA401', rebate: 200 },
  { model: 'CA501', rebate: 250 },
  { model: 'CA701', rebate: 300 },
  { model: 'CA901', rebate: 400 },
  { model: 'ES60', rebate: 30, note: 'B' },
  { model: 'ES120', rebate: 50, note: 'B/W/G' },
  { model: 'ES920', rebate: 100, note: 'B/W' },
  { model: 'CX102', rebate: 75, note: 'B/W' },
  { model: 'CX202', rebate: 100, note: 'RO/SB/WH' },
]

/** Normalize a model for matching: uppercase, strip everything but letters/digits. */
export function normalizeModel(model: string): string {
  return model.toUpperCase().replace(/[^A-Z0-9]/g, '')
}

/** Normalized-model → rebate entry lookup, built once at module load. */
export const REBATE_BY_MODEL: ReadonlyMap<string, RebateEntry> = new Map(
  REBATES.map((entry) => [normalizeModel(entry.model), entry]),
)
