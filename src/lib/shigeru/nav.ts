/**
 * Shigeru Kawai microsite navigation — single source of truth.
 *
 * The header (desktop + mobile) and the footer all read from here. Mobile and
 * footer lists are DERIVED, not hand-maintained: three hand-written arrays had
 * already drifted (Artists was top-level on desktop but nested under Resources
 * on mobile, and /shigeru/about + /shigeru/technology were in the sitemap but
 * in no menu at all).
 */

export type NavLeaf = { label: string; href: string; children?: never }
export type NavDropdown = { label: string; href: null; children: NavLeaf[] }
export type NavItem = NavLeaf | NavDropdown

const MICROSITE_ROOT = '/shigeru'

export const leftNav: NavItem[] = [
  { label: 'Home', href: MICROSITE_ROOT },
  { label: 'Grand Pianos', href: '/shigeru/models' },
  { label: 'Artists', href: '/shigeru/artists' },
]

export const rightNav: NavItem[] = [
  { label: 'Authorized Dealers', href: '/shigeru/dealers' },
  {
    label: 'Resources',
    href: null,
    children: [
      { label: 'Artisans', href: '/shigeru/artisans' },
      { label: 'Technology', href: '/shigeru/technology' },
      { label: 'About', href: '/shigeru/about' },
      { label: 'Institutions', href: '/shigeru/institutions' },
    ],
  },
  { label: 'Contact', href: '/shigeru/contact' },
]

/** Every desktop item, in reading order. The mobile sheet renders exactly this. */
export const mobileNav: NavItem[] = [...leftNav, ...rightNav]

/** Every reachable leaf, dropdown parents flattened away. The footer renders this. */
export const footerLinks: NavLeaf[] = mobileNav.flatMap((item) =>
  isDropdown(item) ? item.children : [item],
)

export function isDropdown(item: NavItem): item is NavDropdown {
  return item.href === null
}

/**
 * True when `pathname` is at or below `href`.
 *
 * Segment-aware: "/shigeru/models-archive" must NOT match "/shigeru/models",
 * which a bare `startsWith` would wrongly accept.
 */
function matchesPath(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`)
}

/**
 * Whether a nav item should render as the current page.
 *
 * Home is exact-match only — every other route lives beneath it, so a prefix
 * match would leave Home permanently lit. A dropdown is active whenever any of
 * its children is.
 */
export function resolveActive(pathname: string, item: NavItem): boolean {
  if (isDropdown(item)) {
    return item.children.some((child) => matchesPath(pathname, child.href))
  }
  if (item.href === MICROSITE_ROOT) return pathname === MICROSITE_ROOT
  return matchesPath(pathname, item.href)
}
