/**
 * "Non-standard" model detection for collection product listings.
 *
 * A collection mixes the core lineup (GX1…GX7, K-200…K-500, GL-10…GL-50) with
 * one-off derivatives — limited/anniversary editions and hybrid player-system
 * variants (AURES, ATX, AnyTime) of a base model. Derivatives should sit below
 * the core lineup rather than interleave with it by price.
 *
 * Detection is deliberately NOT raw string length. Length alone misfires on the
 * real catalog: `SK-EX` (the flagship) is longer than `SK2`, and `CN201` is
 * longer than `CN29`, so a length sort would bury standard models. What marks a
 * derivative is an extra descriptor — either a second token in the model, or a
 * known series marker in the model or the product name.
 *
 * Covers every derivative in the catalog as of the current sync:
 *   GX-2L  → "Kawai GX-2 Limited Edition | 60th Anniversary"   (name marker)
 *   K-500 Limited Edition                                      (multi-token)
 *   GL-30 AURES 2                                              (multi-token)
 *   GL30ATX2                                                   (model marker)
 */

interface ModelIdentity {
  model?: string | null
  name?: string | null
}

/**
 * Series markers that denote a derivative rather than a core model.
 * `atx`/`aures`/`anytime` are Kawai's hybrid player systems; the rest are
 * special-run descriptors. Matched case-insensitively against model and name.
 */
const DERIVATIVE_MARKERS =
  /limited|edition|anniversary|aures|anytime|atx|special/i

/** True when a product is a derivative of a core model rather than a core model. */
export function isNonStandardModel(product: ModelIdentity): boolean {
  const model = (product.model ?? '').trim()
  const name = (product.name ?? '').trim()

  // A second token in the model is always a descriptor: "K-500 Limited Edition",
  // "GL-30 AURES 2". Core models are a single token by construction.
  if (/\s/.test(model)) return true

  return DERIVATIVE_MARKERS.test(model) || DERIVATIVE_MARKERS.test(name)
}

/**
 * Stable, non-mutating sort pushing derivatives below core models.
 *
 * Equal-rank items compare 0, so the caller's prior ordering (price, featured
 * boost) is preserved within each group — same contract as featured-sort.ts.
 * Apply this LAST, after any ordering that should hold within a group.
 */
export function sortStandardFirst<T extends ModelIdentity>(items: T[]): T[] {
  return [...items].sort(
    (a, b) => Number(isNonStandardModel(a)) - Number(isNonStandardModel(b)),
  )
}
