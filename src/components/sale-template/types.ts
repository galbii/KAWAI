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
  /**
   * The showroom's place name for running copy ("Dallas", "St. Louis"): what
   * a campaign line's `{location}` placeholder becomes (see `fillLocation`).
   * The storefront's location name, else `name`; a route may set it from its
   * own fixed store map.
   */
  location: string
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

/**
 * A short badge lockup: sans caps setup words and one script word, e.g.
 * "Limited Time" + "Offer". Read in order it is the plain label.
 */
export interface SaleBadge {
  lead: string
  script: string
}

export interface SaleHeroContent {
  /**
   * A short badge set above the headline, e.g. "Limited Time Offer" (v4,
   * Nov 19, 2026). It sits on the hero's color band; it is a label, not a
   * copy paragraph. Optional: a sale without one renders no band.
   */
  badge?: SaleBadge
  lockup: SaleLockup
  /**
   * The hero's one support line under the headline (v4: the dated sale-event
   * line). The hero is badge → headline → this line → the CTA pair, nothing
   * else, so it reads in a glance.
   */
  support: string
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
  /**
   * A store contact block in place of a note: this lead line (campaign
   * words), then the store's own name, address and phone from the storefront
   * record. A missing address or phone is left out, never invented.
   */
  storeContact?: { lead: string }
  link?: { label: string; href: string }
  /** Visible fine print. Disclosures render here as page text, never in a dialog. */
  fineprint: readonly string[]
  fineprintId?: string
  /** Show the Request Inventory / Call Now pair in this spread, under its note. */
  cta?: boolean
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
  /**
   * The campaign's one line under the lockup. May carry the `{location}`
   * placeholder (`LOCATION_TOKEN`), filled with `SaleStore.location` at
   * render, so one content object serves every store.
   */
  body: string
  /** The close's display lockup, set above the heading. */
  lockup: SaleLockup
  /**
   * Opt-in cinematic close (kawai-holiday-close-redesign v1, Nov 25, 2026):
   * a full-bleed dark photograph under a scrim, the lockup scaled up in white
   * and red, then `eyebrow` + `heading` as one bold dated line, `body`, the
   * request pair with its note and a reversed wordmark in the corner. Set on
   * the national /holiday-sale-event only. Omitted, the close renders exactly
   * as before (red band + white field), which is what the store pages keep.
   */
  image?: SaleImage | undefined
}

/**
 * The page's actions (v2, Nov 19, 2026). The primary button opens the lead
 * dialog of the campaign-lead provider the route wraps the template in; the
 * secondary is the store's tel: link labelled `SaleContent.callLabel`.
 */
export interface SaleCta {
  /** Primary button label, e.g. "Request Inventory". */
  requestLabel: string
  /** One approved line set above the mid-page pair. */
  leadIn: string
  /**
   * Optional small line set directly under every Request Inventory pair
   * (hero, offer index, each offer spread, close), never on the phone bar.
   * Omitted, the pairs render exactly as before (the store pages).
   * kawai-holiday-cta-availability-note v1, Nov 24, 2026.
   */
  note?: string | undefined
}

/**
 * A headline with a short list of check bullets, set at the head of the
 * offers (kawai-holiday-sale-rep-edits v1, Nov 23, 2026). Plain words only:
 * never a credit headline and never a disclosure.
 */
export interface SaleChecklist {
  id: string
  heading: string
  items: readonly string[]
}

export interface SaleContent {
  hero: SaleHeroContent
  /**
   * A plain paragraph introducing the offer index. Empty renders no
   * paragraph.
   */
  intro: string
  /** The offer index's cards. Empty renders no strip. */
  highlights: readonly SaleHighlight[]
  /** Optional checklist section, rendered after the location band and before the offer spreads. */
  checklist?: SaleChecklist
  /**
   * An optional small caps label over the showroom name in the location band,
   * e.g. "Factory-direct Kawai Pianos". A label, never a headline.
   */
  locationEyebrow?: string
  promos: readonly SalePromo[]
  moments: readonly SaleMoment[]
  close: SaleCloseContent
  /** The tel: button's label. */
  callLabel: string
  /** Primary action + its lead-in. */
  cta: SaleCta
  /** The line set under the wordmark's rule. */
  tagline: string
}
