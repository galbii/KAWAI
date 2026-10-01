/**
 * Jumping to a section of a campaign page.
 *
 * Extracted from `PromoSideNav`, which owned it when the rail was the only
 * thing that navigated. The hero's value-prop bar jumps to the same sections,
 * and the awkward part is not the scroll — it is the two corrections below,
 * which are easy to lose when a second caller reimplements them from scratch.
 */

/**
 * How far above a section to stop, in pixels.
 *
 * Also the `rootMargin` the rail's IntersectionObserver uses to decide which
 * row is active, so the position a jump lands at and the row that then
 * highlights are derived from one number.
 */
export const PROMO_SCROLL_OFFSET = 80

/**
 * Scroll a campaign section into view.
 *
 * `reduce` is the caller's `useReducedMotion()`. `globals.css` forces
 * `scroll-behavior: auto` under reduced motion, but that rule cannot reach a
 * scripted smooth scroll — this has to opt out for itself.
 *
 * Returns false when the id is not on the page, which is the normal case on
 * ca.kawaius.com: the financing section does not render there. Every caller
 * already filters its own list by site, so a false means a bug rather than a
 * Canadian visitor, and swallowing it silently is correct either way.
 */
export function scrollToPromoSection(id: string, reduce: boolean | null): boolean {
  const el = document.getElementById(id)
  if (!el) return false

  // getBoundingClientRect + scrollY, not offsetTop: the dealer section is a
  // sticky pinned track and the sections are nested inside the `.promo`
  // wrapper, so offsetTop is measured against an offsetParent that is not the
  // document.
  const top = window.scrollY + el.getBoundingClientRect().top - PROMO_SCROLL_OFFSET

  window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' })
  return true
}
