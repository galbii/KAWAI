/**
 * The store sale template's content contract.
 *
 * The template owns layout, palette, type and motion; a campaign owns every
 * word and picks every photograph. A sale page is a route that builds one
 * `SaleContent` from its campaign's copy file and one `SaleStore` from the
 * storefront CMS record, then renders `<SaleTemplate>`. Nothing in
 * `@/components/sale-template` may hold campaign copy of its own, so the next
 * sale reuses the template without inheriting this one's words.
 */

export interface SaleHoursEntry {
  day?: string | null
  time?: string | null
}

/** Store identity, read from the storefront CMS record. Never campaign copy. */
export interface SaleStore {
  slug: string
  name: string
  address: string | null
  phone: string | null
  hours: SaleHoursEntry[]
  directions: { label: string; href: string } | null
  /** Null when the store has no real booking target; the button is then omitted. */
  schedule: { label: string; href: string; external: boolean } | null
}

export interface SaleImage {
  src: string
  alt: string
  /** CSS object-position, e.g. "center 78%". */
  position?: string
  /**
   * `banner`: wide artwork (a logo strip, ~4:1) that must not be cropped. A
   * promo spread then runs it full width at that ratio above the type.
   */
  shape?: 'banner'
}

/**
 * A headline in the holiday type system (comps, Nov 17, 2026): black heavy
 * display serif for the setup words, one Kawai red script word as the hero.
 *
 * - `kicker`: a small black setup line above ("Some gifts get unwrapped").
 * - `lead`: heavy serif words before the script word ("This one gets").
 * - `script`: the red script word ("Played").
 * - `tail`: heavy serif words after it ("memory").
 *
 * `stack` centres lead / script / tail on three lines, the script overlapping
 * its neighbours; `inline` runs lead and script on one line, the script's
 * capital crossing into the last serif word.
 *
 * Read in order, the parts are the headline as written; the renderer joins
 * them with spaces so the accessible name is the plain sentence.
 */
export interface SaleLockup {
  kicker?: string
  lead?: string
  script: string
  tail?: string
  layout: 'stack' | 'inline'
}

export interface SaleHeroContent {
  lockup: SaleLockup
  /** The sub-line, one entry per centred line. */
  subline: readonly string[]
  /** A short closing line under the sub-line, e.g. the offer end date. */
  ending: string
  /** The hero's main photograph, set in an arch beside the type. */
  image: SaleImage
  /** A smaller detail frame overlapping the main one. */
  inset?: SaleImage
}

/** One entry in the offer index under the location band. */
export interface SaleHighlight {
  label: string
  detail: string
  href: string
}

/**
 * A promo heading. `lockup` exists for regulated credit headlines: the lead
 * and APR render as bare text in one `<h2>`, only the connector is sized
 * down, and the subhead follows with nothing between them (Synchrony §4.1/4.2).
 */
export type SalePromoHeading =
  | { kind: 'text'; text: string }
  | { kind: 'lockup'; lead: string; connector: string; apr: string; subhead: string }

export interface SalePromoRow {
  label: string
  value: string
  note?: string
}

export interface SalePromo {
  id: string
  eyebrow: string
  heading: SalePromoHeading
  body?: string
  image?: SaleImage
  rows?: readonly SalePromoRow[]
  note?: string
  link?: { label: string; href: string }
  /** Visible fine print. Disclosures render here as page text, never in a dialog. */
  fineprint: readonly string[]
  fineprintId?: string
}

/**
 * A marketing moment between promos: one holiday lockup with photography.
 * Never a credit headline and never a disclosure; those live on `SalePromo`.
 *
 * - `feature`: one large photograph beside the lockup.
 * - `gallery`: the lockup over a loose row of three snapshots.
 * - `band`: a wide photograph with the lockup on a white panel across it.
 */
export interface SaleMoment {
  id: string
  /** Renders directly before the promo with this id. */
  before: string
  layout: 'feature' | 'gallery' | 'band'
  lockup: SaleLockup
  images: readonly SaleImage[]
}

export interface SaleCloseContent {
  eyebrow: string
  heading: string
  body: string
  /** The close's display lockup, set above the heading. */
  lockup: SaleLockup
}

export interface SaleContent {
  hero: SaleHeroContent
  /** A plain paragraph introducing the offer index. */
  intro: string
  highlights: readonly SaleHighlight[]
  promos: readonly SalePromo[]
  moments: readonly SaleMoment[]
  close: SaleCloseContent
  /** The tel: button's label. */
  callLabel: string
  /** The line set under the wordmark's rule. */
  tagline: string
}
