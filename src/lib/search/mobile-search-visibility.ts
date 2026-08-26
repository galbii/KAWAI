/**
 * Where the mobile floating search bar is suppressed.
 *
 * PREFIXES are anchored at the root. SEGMENTS match any single path segment,
 * which is the part that was missing: signup campaigns live at
 * /store/{store}/signup/{campaign}, so the root-anchored '/signup' prefix this
 * list started with never matched one, and the floating bar shipped over the
 * lead form on every campaign page.
 *
 * Segment matching is exact per segment rather than a substring test, so a
 * future '/signup-terms' page is unaffected until someone adds it here.
 */
const HIDDEN_PREFIXES = [
  // Has its own dedicated dealer search — two search affordances competed.
  '/find-a-dealer',
]

const HIDDEN_SEGMENTS = [
  // Lead pages keep focus on the offer form.
  'signup',
]

export function hidesMobileSearch(pathname: string): boolean {
  if (HIDDEN_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return true
  return pathname
    .split('/')
    .filter(Boolean)
    .some((segment) => HIDDEN_SEGMENTS.includes(segment))
}
