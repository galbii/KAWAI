/**
 * Kill switch for the French translate button on ca.kawaius.com.
 *
 * The button never produces a French *URL* and never translates anything
 * itself — it just tells the visitor how to use their own browser's translate
 * feature. So there is nothing for a crawler to index and no duplicate content
 * to worry about; the flag exists purely so the control can be pulled from the
 * header without a code change.
 *
 * Note: this is a convenience, not Quebec Bill 96 compliance. Visitor-initiated
 * machine translation does not satisfy the Charter of the French Language —
 * that needs a real fr-CA locale with human-reviewed copy.
 *
 * Set NEXT_PUBLIC_FRENCH_ENABLED=true to turn it on.
 */
export const FRENCH_ENABLED = process.env.NEXT_PUBLIC_FRENCH_ENABLED === 'true'
