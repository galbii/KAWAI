/**
 * Shigeru Kawai microsite navigation — single source of truth.
 *
 * The header (desktop + mobile) and the footer all read from here. Mobile and
 * footer lists are DERIVED, not hand-maintained: three hand-written arrays had
 * already drifted (Artists was top-level on desktop but nested under Resources
 * on mobile, and /shigeru/about + /shigeru/technology were in the sitemap but
 * in no menu at all).
 */

import { SHIGERU_MODELS } from '@/app/(shigeru-website)/shigeru/_data/models'

/** Everything the models menu shows about one piano beyond its name. */
export type NavLeafDetail = {
  /** Model slug — keys the piano photograph the menu renders. */
  slug: string
  /** Model class — "Conservatory Grand". */
  kind: string
  /** Length in feet/inches and in centimetres — `6' 2"`, `188 cm`. */
  length: string
  lengthCm: string
  /** Length as a fraction of the longest model, 0–1. Sets the scale rule. */
  lengthRatio: number
}

export type NavLeaf = {
  label: string
  href: string
  detail?: NavLeafDetail
  children?: never
}

export type NavDropdown = {
  label: string
  href: null
  /** 'list' = plain link column. 'models' = the grand-piano card grid. */
  variant?: 'list' | 'models'
  /**
   * Landing page for the group as a whole. Rendered as the panel's closing
   * row, and it stands in for the group in the footer so six model links
   * don't flood a row meant to hold one link per destination.
   */
  overview?: NavLeaf
  children: NavLeaf[]
}

export type NavItem = NavLeaf | NavDropdown

const MICROSITE_ROOT = '/shigeru'

const parseCm = (cm: string): number => parseInt(cm, 10) || 0

/** The SK-EX at 278 cm — every other model is drawn against it. */
const LONGEST_CM = Math.max(...SHIGERU_MODELS.map((m) => parseCm(m.cm)))

/**
 * The six grands, derived from the model data the homepage carousel and the
 * /shigeru/models pages already render — add a model there and it appears here.
 */
export const grandsNav: NavDropdown = {
  label: 'Grands',
  href: null,
  variant: 'models',
  overview: { label: 'Grand Pianos', href: '/shigeru/models' },
  children: SHIGERU_MODELS.map((model) => ({
    label: model.name,
    href: `/shigeru/models/${model.slug}`,
    detail: {
      slug: model.slug,
      kind: model.type,
      length: model.feet,
      lengthCm: model.cm,
      lengthRatio: LONGEST_CM ? parseCm(model.cm) / LONGEST_CM : 1,
    },
  })),
}

export const leftNav: NavItem[] = [
  { label: 'Home', href: MICROSITE_ROOT },
  grandsNav,
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

/**
 * Every footer destination, dropdown parents flattened away. A group with an
 * `overview` collapses to that single link — the footer is a one-line row, not
 * a sitemap.
 */
export const footerLinks: NavLeaf[] = mobileNav.flatMap((item) => {
  if (!isDropdown(item)) return [item]
  return item.overview ? [item.overview] : item.children
})

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
 * its children — or its overview page — is.
 */
export function resolveActive(pathname: string, item: NavItem): boolean {
  if (isDropdown(item)) {
    if (item.overview && matchesPath(pathname, item.overview.href)) return true
    return item.children.some((child) => matchesPath(pathname, child.href))
  }
  if (item.href === MICROSITE_ROOT) return pathname === MICROSITE_ROOT
  return matchesPath(pathname, item.href)
}
