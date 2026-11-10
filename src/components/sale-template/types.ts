/**
 * The store sale template's content contract.
 *
 * The template owns layout, palette and motion; a campaign owns every word.
 * A sale page is a route that builds one `SaleContent` from its campaign's
 * copy file and one `SaleStore` from the storefront CMS record, then renders
 * `<SaleTemplate>`. Nothing in `@/components/sale-template` may hold campaign
 * copy of its own, so the next sale reuses the template without inheriting
 * this one's words.
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

export interface SaleHeroContent {
  /** The headline before its accent, e.g. "Fall for a". */
  titleLead: string
  /** The accent word, set in red italic like the flyer's second line. */
  titleAccent: string
  body: string
  ending: string
  image: string
  imageAlt: string
}

/** One line of the red-check list under the location bar. */
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
  image?: { src: string; alt: string; position?: string }
  rows?: readonly SalePromoRow[]
  note?: string
  link?: { label: string; href: string }
  /** Visible fine print. Disclosures render here as page text, never in a dialog. */
  fineprint: readonly string[]
  fineprintId?: string
}

export interface SaleCloseContent {
  eyebrow: string
  heading: string
  body: string
}

export interface SaleContent {
  hero: SaleHeroContent
  highlights: readonly SaleHighlight[]
  promos: readonly SalePromo[]
  close: SaleCloseContent
  /** The tel: button's label. */
  callLabel: string
}
