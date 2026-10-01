import { FALL_2026, termMonths } from '@/lib/financing/terms'
import { OFFER_CHIPS } from '@/lib/fall-promo/tokens'
import type { PromoValueProp } from '@/components/fall-promo'

/**
 * Every word on the Q4 page, in one file.
 *
 * Three separate offers, not one campaign with three ornaments — each applies
 * to a different part of the range, and a shopper cares about exactly one. So
 * each block states which instruments it covers before it says anything else,
 * and the page opens with an index rather than a pitch.
 *
 * The source material is dealer-facing trade bulletins. It is rewritten here
 * for the person buying the piano: no shared-cost language, no reimbursement
 * terms, no participation form — those are between Kawai and the dealer and
 * mean nothing to a shopper. What survives is what changes the price they pay.
 *
 * Financing figures are formatted from {@link FALL_2026} rather than retyped.
 * A financing promotion is a credit advertisement, so a headline that has
 * drifted from its disclosure is a regulatory problem, not a copy bug.
 */

const pct = (rate: number) =>
  `${(rate * 100).toLocaleString('en-US', { maximumFractionDigits: 2 })}%`

const usd = (amount: number) => `$${amount.toLocaleString('en-US')}`

/** All three offers run to the same date. Stated once. */
/**
 * When the offers open, as the hero says it.
 *
 * Hardcoded like PROGRAM_END rather than formatted from `FALL_2026.start`,
 * because the ordinal ("1st") is a copy decision and not something a date
 * formatter should be inventing. It MUST agree with `FALL_2026.start`
 * ('2026-10-01'), and the compliance test asserts that it does — a promotional
 * page advertising the wrong start date is the kind of error that is only
 * noticed from outside.
 */
export const PROGRAM_START = 'October 1st'

export const PROGRAM_END = 'December 31, 2026'
export const PROGRAM_END_SHORT = 'Dec 31'
export const FINANCING_RANGE = 'October 1 – December 31, 2026'
export const REBATE_RANGE = 'October 1 – December 31, 2026'
/**
 * The same deadline, machine-readable, for the corner dock's day count.
 * Read from {@link FALL_2026} rather than parsed back out of PROGRAM_END —
 * a display string is not a date and a promotion's end is not a thing to
 * re-type.
 */
export const PROGRAM_END_ISO = FALL_2026.end

export const INTRO_APR = pct(FALL_2026.introApr)
export const POST_APR = pct(FALL_2026.postApr)
export const BLENDED_APR = pct(FALL_2026.blendedApr)
export const TERM = termMonths(FALL_2026)
export const MIN_FINANCED = usd(FALL_2026.minFinanced)

/**
 * The sentence the law attaches to the headline rate: naming a promotional rate
 * obliges the page to state the rate that follows it, the term, and what
 * qualifies. Repeated verbatim wherever the rate appears — never paraphrased.
 *
 * ── This is the approved banner's wording, not the §4.5 table's ──────────
 *
 * It says "for ${FALL_2026.postMonths} months", where the §4.5 vocabulary
 * table below prescribes "for the remaining 36 months". The final web banner
 * is the artwork Synchrony signed off and it reads "will apply for 36 months",
 * so the banner wins over the table for this one sentence. Do not "fix" it
 * back — the compliance test now asserts the prescribed phrasing against
 * {@link disclosures.financingExample}, which does use it, twice.
 *
 * The same goes for "new Kawai acoustic or Shigeru Kawai made between", which
 * reads oddly and is nonetheless what was approved.
 *
 * It deliberately carries no footnote mark: `page.tsx` puts this sentence in
 * the meta description, where a trailing `**` resolves to nothing. The mark is
 * appended where it renders, in {@link financing.subhead}.
 */
export const TERMS_SENTENCE =
  `After the introductory period, a ${POST_APR} rate will apply for ` +
  `${FALL_2026.postMonths} months. Available on qualifying purchases of ${MIN_FINANCED} or more ` +
  `on new Kawai acoustic or Shigeru Kawai made between ${FINANCING_RANGE}.`

/**
 * ── Synchrony / Reg Z vocabulary ─────────────────────────────────────────
 *
 * Fixed by the Q4 2026 developer requirements, §4.5. These are legal
 * requirements, not house style, and they apply to page titles, meta
 * descriptions, alt text and OG preview text as well as body copy:
 *
 *   USE                              NEVER
 *   "rate" for 0% and 22.99%         "APR" for 0% or 22.99%
 *   "APR" only for 8.01%             "0% APR"
 *   "60 months"                      "up to 60 months"
 *   "for the remaining 36 months"    "thereafter", "up to 36 months"
 *
 * One approved exception to the last row: the final web banner's subhead says
 * "will apply for 36 months", so {@link TERMS_SENTENCE} does too. See the note
 * on that constant. Everywhere else — notably the worked example — still uses
 * the prescribed phrasing, and the test enforces it there.
 *
 * `financing-compliance.test.ts` fails the build on any of the NEVER column,
 * so a violation cannot reach a branch unnoticed. The constant names below
 * (INTRO_APR, POST_APR) predate the rule and are internal identifiers only —
 * what they render is "0%" and "22.99%", never the letters APR.
 *
 * ── The two footnote marks (§4.3) ────────────────────────────────────────
 *
 * `*`  references {@link disclosures.financingExample}.
 * `**` references {@link disclosures.exclusions}.
 *
 * Neither may be added, removed or moved, and both footnotes must render on
 * the same page as the mark that points at them.
 */
/**
 * §5 — "Click here for details" points at the 2026 Financing Disclosure PDF.
 * The requirements mark this URL "To confirm", so it is a single constant:
 * when Nicholas confirms the final location, this is the only line to change.
 */
export const DISCLOSURE_PDF = '/documents/kawai-2026-q4-financing-disclosure.pdf'

export const FOOTNOTE_EXAMPLE = '*'
export const FOOTNOTE_EXCLUSIONS = '**'

/**
 * Anchors, so the side nav and the blocks cannot disagree about where they
 * point. Every section that `navSections` lists has to appear here rather than
 * carrying a literal id, or a rename silently breaks one of the two.
 */
export const SECTION = {
  bundle: 'headphones',
  financing: 'financing',
  acoustic: 'acoustic-rebates',
  dealers: 'dealers',
  rebate: 'rebates',
  disclosures: 'disclosures',
} as const

/**
 * The label on every call to action on this page.
 *
 * One label, one destination: the enquiry form. Every CTA here — the hero, each
 * offer block, every model row, all three cinematic scenes and the corner dock —
 * opens the same modal from the same provider. That is /signup3's arrangement,
 * where one button label opens one form from every scene, and it is deliberate
 * rather than repetitive: a visitor who has decided anywhere on the page should
 * not have to work out which of several controls is the one that acts.
 *
 * ── Why "Contact", not "Find" ────────────────────────────────────────────
 *
 * It was "Find a Kawai Dealer", which described the outcome — the form takes a
 * ZIP and routes to the nearest dealer — but not the thing the button does. A
 * visitor who reads "Find a Dealer" expects a locator or a map and gets a
 * six-field form, and the corner dock made that worst of all: a bare pill with
 * no surrounding copy promising a search and opening a contact form.
 *
 * "Contact a Dealer" names the mechanism, which here is also the honest promise
 * — contacting a dealer is what submitting it does. The lead-in copy above each
 * button carries what the form is *for* ("pricing and inventory"), so the label
 * does not have to.
 *
 * It also fits where the old one did not, which is why there is now only one
 * wording — see {@link CTA_LABEL_SHORT}.
 *
 * `openLabel` in lead-campaign.ts reads this, so every bare <PromoButton />
 * follows without being handed anything.
 */
export const CTA_LABEL = 'Contact a Dealer'

/**
 * Retained as an alias, no longer a second wording.
 *
 * It existed because "Find a Kawai Dealer" would not fit a model row inside a
 * dialog or the corner dock, and dropping "Kawai" was the one spacing
 * concession. "Contact a Dealer" is shorter than that concession was and fits
 * everywhere, so the two names now resolve to one string and the page has a
 * single label on every button.
 *
 * The name stays so the call sites and the compliance test keep reading; do not
 * give it its own string again.
 */
export const CTA_LABEL_SHORT = CTA_LABEL

/**
 * The line that sits directly above a {@link CTA_LABEL} button.
 *
 * One sentence, one definition, because it appears above four separate buttons
 * and the page should not say the same thing four slightly different ways. It
 * says what the form is for, which is the half of the promise the label stopped
 * carrying when it became "Contact a Dealer" — a shopper reads the two together
 * as "contact a dealer, and this is what you get back".
 *
 * "Pricing and inventory" is deliberate and must stay figure-free: the sentence
 * renders in the financing section among Synchrony-reviewed copy, so a rate, a
 * term or an amount in it would be a regulated figure sitting outside the
 * lockup that qualifies it. `financing-compliance.test.ts` reads this line with
 * the rest of the page's copy.
 */
export const CTA_LEAD_IN = 'Contact a dealer near you for pricing and inventory.'

/* ── Block 1 · SH-9 headphone bundle ───────────────────────────────────── */

export const bundle = {
  /**
   * Short enough to be a name rather than a sentence — it is the same name the
   * offer carries in the brand's chip set, so the slide, the chip and this
   * section cannot call one offer three things. The terms go in the line under
   * it, where a reader expects the explanation.
   */
  heading: 'SH-9 Bundle',
  standfirst:
    'Free when you buy a qualifying CN Series or CA Series digital piano — a pair of Kawai ' +
    'SH-9 high-performance headphones, one per piano, at no extra cost.',
  /** The photograph the stage runs, shared with the hero's third slide. */
  stageImage: 'https://pub-0cc9ed269d544fd29fe51221f6744a6b.r2.dev/media/KAWAI_CA401B-30.webp',
  stageImageAlt: 'Kawai SH-9 headphones hanging beneath a Kawai CA Series digital piano',
  /**
   * Every offer in this campaign is redeemed in a showroom, and the bundle is
   * the one most easily mistaken for an online add-on — it looks like a
   * checkout promotion. Stated plainly, next to the models, not buried in the
   * disclaimer.
   *
   * The showroom fact comes first and {@link CTA_LEAD_IN} follows it, rather
   * than replacing it: the lead-in says what contacting a dealer gets you, and
   * this line says a dealer is the only way to get it at all. Dropping the
   * first sentence for the second would take the bundle back to looking like
   * something with an add-to-cart button.
   */
  dealerNote: `Available only through your local Authorized Kawai dealer. ${CTA_LEAD_IN}`,
  /** Heading over the product browser. */
  browseHeading: 'Pianos this bundle comes with',
  /**
   * Lifestyle art for each series tile, by Shopify collection handle.
   *
   * A tile without an entry here falls back to its first product photograph,
   * which is a cut-out on white and is laid on a light mat so the fallback
   * reads as a deliberate second treatment rather than a broken first one.
   * Both current series have real art; the fallback exists for the next one.
   */
  seriesArt: {
    'cn-series':
      'https://pub-0cc9ed269d544fd29fe51221f6744a6b.r2.dev/media/Fall%20Digital%20Piano.webp',
    'ca-series':
      'https://pub-0cc9ed269d544fd29fe51221f6744a6b.r2.dev/media/KAWAI_CA401B-1%20copy.webp',
  } as Record<string, string | undefined>,
  /** Label on a tile, under the series name. */
  seriesCta: 'View models',
  /** What each model in the dialog carries, and the action beside it. */
  rowLabel: 'SH-9 Included',
  rowCta: CTA_LABEL_SHORT,
  tabsLabel: 'Choose a series',
  /** Tab order. Handles are Shopify collection handles. */
  collections: ['cn-series', 'ca-series'] as const,
  emptyState: 'Qualifying models are confirmed by your local Authorized Kawai dealer.',
  disclaimer:
    `One complimentary pair of SH-9 headphones per qualifying new CN or CA Series digital piano, ` +
    `through ${PROGRAM_END} or while qualifying stock lasts, whichever comes first. Headphones ` +
    `have no cash value and cannot be exchanged. Prices shown are manufacturer's suggested ` +
    `retail; your Authorized Kawai dealer sets the final price. Dealer participation may vary.`,
} as const

/* ── Block 2 · 0% financing ────────────────────────────────────────────── */

/**
 * The financing offer, as the approved web banner states it.
 *
 * The banner is the source for every word here — headline, subhead, the
 * "Click here for details" link and the worked example in {@link disclosures}.
 * It is also the source for the *structure*: one headline lockup, the terms
 * sentence under it, the link, the fine print. The page used to state the
 * headline and the terms twice, once as a section head and again inside the
 * Supporting Disclosure; the banner states them once and so does the page now.
 *
 * ── What cannot be edited without Synchrony re-approval ──────────────────
 *
 * `heading` is three parts because the banner sets it in two sizes (§4.1).
 * `lead` and `apr` carry the regulated figures and MUST render identically —
 * they do so by being bare text in one element, inheriting one font size, so
 * nothing can style them apart. `connector` is the only part allowed a smaller
 * size, and it is the only part allowed to contain no figure: a rate or an
 * amount moved into it would be a regulated figure demoted below the one it
 * sits beside. `financing-compliance.test.ts` fails the build if one appears
 * there. Never move `${INTRO_APR}` or the APR out of `lead`/`apr`.
 *
 * `subhead` must directly follow the headline with nothing between them, at a
 * minimum of 40% of the headline's font size (§4.2). FinancingBlock enforces
 * the ratio structurally — see the lockup there.
 *
 * The `*` on `apr` points at the worked example in the disclosures; the `**`
 * on `subhead` points at the exclusions line. Both footnotes render on this
 * page (§4.3). The `**` lived on an "Eligible instruments" paragraph until the
 * banner replaced that section — it moved to the subhead rather than being
 * dropped, because its footnote is still on the page and a footnote whose mark
 * is nowhere is not a footnote.
 */
export const financing = {
  /**
   * §4.1 — two prominent parts and one subordinate connector between them.
   * `lead` and `apr` render as bare text nodes in a single `<h2>`; only
   * `connector` is wrapped. See the lockup in FinancingBlock.
   */
  heading: {
    lead: `Introductory Rate of ${INTRO_APR}`,
    /** The smaller line. No rate, no amount, ever — see the note above. */
    connector: `for the first ${FALL_2026.introMonths} months`,
    apr: `(APR ${BLENDED_APR})${FOOTNOTE_EXAMPLE}`,
  },
  /** §4.2 — renders immediately under the headline, nothing in between. */
  subhead: `${TERMS_SENTENCE}${FOOTNOTE_EXCLUSIONS}`,

  /**
   * The line above the button pair.
   *
   * It renders AFTER `subhead`, never between it and the headline — §4.2
   * requires those two to be adjacent with nothing inserted. See the lockup in
   * FinancingBlock, which is built so this cannot be dropped into the gap.
   *
   * Figure-free by requirement, not by preference: see {@link CTA_LEAD_IN}.
   */
  dealerNote: CTA_LEAD_IN,

  /** Opens the explainer dialog. NOT the disclosure — see FinancingLearnMore. */
  learnMoreCta: 'How the payments work',

  /** Heading on the card above the carousel. */
  browseHeading: 'Featured pianos',
  seriesCta: 'View models',
  emptyState:
    'Qualifying models are confirmed by your local Authorized Kawai dealer — ask us which apply.',
  /**
   * The qualifier on a per-model figure in the dialogs. "As low as" is doing
   * real work: the figure is that model's payment during the promotional
   * window, and it rises when that window closes.
   */
  fromPrefix: 'as low as',
  /**
   * The qualifier on a carousel tile. Deliberately a different phrase, because
   * it means a different thing: the tile quotes the cheapest model in the
   * range, so "starting at" is about where the range begins, where "as low as"
   * on a model row is about where that one payment begins before the rate
   * changes. Using one phrase for both would make the tile look like a quote
   * for every piano behind it.
   */
  startingAt: 'Starting at',
  /**
   * Sits with any quoted payment, and must sit *beside the figures it
   * qualifies* — under the carousel in the section, under the model list in
   * the dialog — not somewhere else in the same section.
   *
   * It must not claim "no down payment": the program requires 10% down above
   * $50,000 and several eligible grands are over it. That rule is stated in
   * the worked example, which is the only place on the page that states it, so
   * do not reword this note in a way that implies otherwise.
   */
  paymentNote:
    `Estimated at the ${INTRO_APR} rate. Your Authorized Kawai dealer sets the final price, ` +
    `so your payment will differ.`,
  onRequest: 'Price on request',
} as const

/**
 * The ranges the offer covers, in display order, as Shopify collection handles.
 *
 * Grands first, then uprights, then Shigeru — the order a shopper is most
 * likely to want them, and the order the eligible-instruments sentence names.
 *
 * ── A range with no collection art is not shown ──────────────────────────
 *
 * The carousel runs one tile at a time at the full width of its column, and at
 * that size a product cut-out on a white mat is not a substitute for a
 * photograph. So art is required, and `getCollectionArt()` supplies it from the
 * collection's `media` upload, then the Shopify-synced `imageUrl`, then the
 * still from the collection's own `youtubeUrl`. There is deliberately no
 * hardcoded art here: the CMS is the single source, so bringing a range back
 * means setting that collection's media or video in the admin, not editing
 * this file.
 *
 * As of Q4 2026 gl-series, gx-series, k-series-professional and master-series
 * have media, and shigeru-kawai reaches the carousel on its video still — five
 * of the nine. The four that do not appear (crystal-grand-piano, k-series,
 * console, institutional) have neither a picture nor a video.
 *
 * `extraModels` exists because two eligible uprights — the K-800 and the ST-1 —
 * carry no Shopify collection at all, so nothing would range them. Placing them
 * here is an editorial call, not data: if either is given a real collection in
 * Shopify, delete its entry rather than leaving the model in two places.
 */
export const financingRanges: ReadonlyArray<{
  handle: string
  /** Overrides the Shopify collection title when it reads badly in a panel. */
  label?: string
  group: 'Grand pianos' | 'Upright pianos' | 'Shigeru Kawai'
  extraModels?: readonly string[]
}> = [
  { handle: 'gl-series', group: 'Grand pianos' },
  { handle: 'gx-series', group: 'Grand pianos' },
  { handle: 'crystal-grand-piano', label: 'Crystal Grand', group: 'Grand pianos' },
  { handle: 'k-series', group: 'Upright pianos' },
  { handle: 'k-series-professional', group: 'Upright pianos', extraModels: ['K800'] },
  { handle: 'master-series', group: 'Upright pianos' },
  { handle: 'console', label: 'Console', group: 'Upright pianos' },
  { handle: 'institutional', label: 'Institutional', group: 'Upright pianos', extraModels: ['ST-1'] },
  { handle: 'shigeru-kawai', group: 'Shigeru Kawai' },
]

/** Copy for the explainer dialog. Explains the mechanism, nothing more. */
export const learnMore = {
  heading: 'How the payments work',
  /**
   * Deliberately NOT the disclosure. §4.4 forbids putting the Supporting
   * Disclosure behind a modal, accordion or read-more — it renders as visible
   * text on page load in FinancingDisclosure. This dialog exists only to
   * explain the one thing the figures do not say for themselves: that the
   * promotional window does not clear the balance, which is why a payment
   * rises at month 25. Do not move disclosure text in here.
   */
  body: [
    `The term is ${TERM} months in two parts. For the first ${FALL_2026.introMonths} months the ` +
      `rate is ${INTRO_APR}, so every payment goes to the balance and nothing is added to it.`,
    `Those payments are sized against the full ${TERM}-month term, not the first ` +
      `${FALL_2026.introMonths}, so a balance remains when the promotional period ends. From ` +
      `month ${FALL_2026.introMonths + 1} that balance carries a ${POST_APR} rate for the ` +
      `remaining ${FALL_2026.postMonths} months, and the payment rises.`,
    `Across the whole ${TERM} months that works out at an APR of ${BLENDED_APR}. The worked ` +
      `example in the Supporting Disclosure below puts real figures to it.`,
  ] as readonly string[],
  closeCta: 'Close',
} as const

/* ── Block 3 · ES Series rebate ────────────────────────────────────────── */

/**
 * The Q4 ES rebate, consumer side only, in both currencies.
 *
 * Deliberately NOT written into `src/lib/data/rebates.ts` or
 * `src/lib/rebates/canada-rebates.ts`. Those two hold the Q3 program and drive
 * /signup, /signup2 and /signup3 on both domains; the Q4 CA figures below
 * differ from the Q3 KCM ones already in `canada-rebates.ts` (ES60 40, ES120
 * 60, ES920 125), so writing them there would silently move three live pages
 * onto a different quarter's program. These amounts belong to this promotion
 * and live with it.
 *
 * The trade bulletin states each rebate as a 50/50 split between Kawai and the
 * dealer — "USD50 (USD25 / USD25)". Only the consumer total appears here. The
 * split is a reimbursement arrangement between Kawai and its dealers and is
 * not a shopper's to read; they see one number come off the price.
 */
type EsRebate = {
  model: string
  /** Consumer total in USD, for kawaius.com. */
  usd: number
  /** Consumer total in CAD, for ca.kawaius.com. */
  cad: number
  finishes: string
}

const ES_REBATES: ReadonlyArray<EsRebate> = [
  { model: 'ES60', usd: 50, cad: 80, finishes: 'Black' },
  { model: 'ES120', usd: 100, cad: 100, finishes: 'Black, white, grey' },
  { model: 'ES920', usd: 150, cad: 200, finishes: 'Black, white' },
]

/**
 * The rebate list for the active site.
 *
 * Same shape as `getRebateShowcase(site)` takes elsewhere: one source, the site
 * picks the column, and a Canadian figure can never surface on kawaius.com
 * because nothing merges the two. `Site` is inlined rather than imported —
 * `@/lib/site-context` is `server-only` and this module is pulled into client
 * components.
 */
export function esRebatesFor(site: 'us' | 'cad'): ReadonlyArray<{
  model: string
  rebate: number
  finishes: string
  currency: 'USD' | 'CAD'
}> {
  const canada = site === 'cad'
  return ES_REBATES.map((entry) => ({
    model: entry.model,
    rebate: canada ? entry.cad : entry.usd,
    finishes: entry.finishes,
    currency: canada ? 'CAD' : 'USD',
  }))
}

export const rebate = {
  heading: 'Up to $150 off an ES Series portable',
  standfirst:
    `Three ES Series models carry an instant rebate through ${PROGRAM_END}. It comes off the ` +
    'price at the counter — there is nothing to claim and nothing to post.',
  collectionHandle: 'es-series',
  /** The photograph behind the section. */
  stageImage:
    'https://pub-0cc9ed269d544fd29fe51221f6744a6b.r2.dev/media/KAWAI_ES_FILMSTILLS_16x9_00025.png',
  stageImageAlt: 'A Kawai ES Series portable digital piano',
  emptyState: 'Rebated models are confirmed by your local Authorized Kawai dealer.',
  /**
   * The line above the section's button, mirroring the bundle's.
   *
   * The rebate is the offer most likely to be read as an online discount —
   * the ledger quotes a "your price" per model — so this says where the price
   * actually comes off before the button says what to do about it.
   */
  dealerNote: `The rebate is applied in the showroom. ${CTA_LEAD_IN}`,
  /** The detail card's call to action. The page's one label. */
  modalCta: CTA_LABEL,
  /**
   * The rebate's terms.
   *
   * No longer set beside the ledger — it is carried by the page's fine print
   * block at the foot instead. Kept here rather than deleted because the
   * ledger quotes a specific "your price" per model, and the two clauses that
   * qualify that figure ("prices shown are manufacturer's suggested retail",
   * "your dealer sets the final price") have to appear somewhere on a page
   * that prints it. See the note in FinancingDisclosure.
   */
  disclaimer:
    `Instant rebate on new ES60, ES120 and ES920 digital pianos bought ${REBATE_RANGE}. The ` +
    `rebate is taken off the price at the point of sale. Prices shown are manufacturer's ` +
    `suggested retail; your Authorized Kawai dealer sets the final price. Dealer participation ` +
    `may vary. Cannot be combined with other offers on the same instrument.`,
} as const

/* ── Close ─────────────────────────────────────────────────────────────── */

/**
 * The close, as three scenes of a pinned cinematic.
 *
 * Where the three offers converge. The flat two-column sheet this replaced said
 * the dealer part at the same volume as the offers above it; the cinematic gives
 * the turn its own ground, its own pace and its own photography.
 *
 * `count` is the figure as prose — what the screen-reader line and the
 * no-JavaScript render use. `countNumeric`/`countSuffix` are the same figure
 * split for the counter, which animates a number rather than a string. Change
 * one, change all three.
 */
export const dealer = {
  /** Tracked caps line over the headline, between two Ember hairlines. */
  eyebrow: 'Dealers',
  heading: 'Find a dealer near you',
  body:
    'Kawai pianos are sold through authorized dealers, so you can play the instrument before ' +
    `you buy it. ${CTA_LEAD_IN}`,
  count: '200+',
  countNumeric: 200,
  countSuffix: '+',
  countLabel: 'Authorized dealers nationwide',
} as const

/**
 * Scene two — the trust strip.
 *
 * Three facts about the company, not the promotion: they are here to steady a
 * reader immediately before the closing ask, which is why none of them is an
 * offer. `plain` turns the thousands separator off, so 1927 is a year and not
 * 1,927.
 */
export const trustStats = [
  { numeric: 1927, suffix: '', label: 'Crafting pianos since', plain: true },
  { numeric: 2.4, decimals: 1, suffix: 'M+', label: 'Pianos built' },
  { numeric: 200, suffix: '+', label: 'Authorized dealers nationwide' },
] as const

/**
 * Scene three — the close.
 *
 * Names all three offers one last time rather than a single one: a reader who
 * scrolled the whole page has seen three unrelated promotions and the last
 * thing they read should not silently pick one of them for them.
 */
export const coda = {
  eyebrow: 'Last step',
  /**
   * Set word by word, each rising out of its own mask — keep it short.
   *
   * The deadline, not a second call to action: it must not repeat
   * {@link CTA_LABEL} on the button underneath it. When it all stops is the one
   * thing left to say.
   */
  heading: `Offers end ${PROGRAM_END}`,
  body: `${CTA_LEAD_IN} They will confirm which offers apply to the piano you want.`,
} as const

/**
 * The Supporting Disclosure — §3 section 8, under compliance rules §4.1–4.4.
 *
 * §4.4 is the one to know before touching this: it must be visible HTML text on
 * page load. Not an image, not a PDF link alone, and NOT behind an accordion,
 * tab, read-more toggle or modal. There was a "See financing terms" dialog here
 * at one point; it was removed for exactly this reason. The explainer dialog
 * that remains (see `learnMore`) carries no disclosure text.
 *
 * ── Why there is no `header`/`subhead` here any more ─────────────────────
 *
 * There used to be, and they restated {@link financing.heading} and
 * {@link TERMS_SENTENCE} word for word a few hundred pixels below the section
 * that already said them. The approved banner states the headline once, with
 * the link and the fine print directly under it, so the page does too: the
 * section's own lockup now heads this disclosure, and what is left here is
 * what the banner has below that line.
 *
 * §4.4 is untouched by that — every sentence below is still visible text on
 * page load. What changed is that the page no longer keeps two copies of a
 * regulated headline, which is the arrangement that drifts.
 */
export const disclosures = {
  financingTerms: [
    `Financing is facilitated by ${FALL_2026.lender} and is subject to credit approval.`,
    'This is not an offer of credit.',
  ],
  /** §5 — links to the 2026 Financing Disclosure PDF. */
  detailsLink: { label: 'Click here for details', href: DISCLOSURE_PDF },
  /**
   * The `*` footnote, transcribed from the approved banner.
   *
   * The figures are interpolated from {@link FALL_2026} rather than typed, and
   * `plan.test.ts` pins planFor() to exactly these payments, so no figure
   * quoted anywhere on the page can disagree with this paragraph.
   *
   * Note this paragraph DOES say "for the remaining 36 months", twice, which
   * is the §4.5 phrasing the banner's subhead drops. The compliance test
   * asserts the prescribed wording here for that reason.
   */
  financingExample:
    `${FOOTNOTE_EXAMPLE}Example: A total ${TERM}-month term with an amount financed of ` +
    `${usd(8000)}: ${INTRO_APR} intro rate for the first ${FALL_2026.introMonths} months and ` +
    `${POST_APR} rate for the remaining ${FALL_2026.postMonths} months requires monthly ` +
    `payments of $133.33 for the first ${FALL_2026.introMonths} months, and monthly payments ` +
    `of $185.78 for the remaining ${FALL_2026.postMonths} months. APR of ${BLENDED_APR}. Down ` +
    `payment may be required based on customer credit; a minimum ` +
    `${pct(FALL_2026.downPaymentRate)} down payment is required on loan amounts over ` +
    `${usd(FALL_2026.downPaymentThreshold)}. Program minimum amount financing is ` +
    `${MIN_FINANCED}. Subject to credit approval. Synchrony Pay Later installment loans are ` +
    `provided by ${FALL_2026.lender}.`,
  /** The `**` footnote. */
  exclusions:
    `${FOOTNOTE_EXCLUSIONS}Offer applies to new acoustic grand and upright pianos only. ` +
    `Digital pianos, hybrid pianos and the Shigeru Kawai SK-EX concert grand are excluded.`,
} as const

/* ── Block 2b · CA acoustic rebate (ca.kawaius.com only) ──────────────── */

/**
 * The Kawai Canada acoustic rebate, consumer side only.
 *
 * Canada's answer to the US financing offer. Both cover new acoustic grands and
 * uprights; America gets a rate from Synchrony and Canada gets money off at the
 * counter, and because the US offer may not be advertised north of the border
 * this section is what stands in its place. It renders ONLY on ca.kawaius.com —
 * there is no US acoustic rebate, and showing these CAD figures on kawaius.com
 * would be the mirror of the mistake `esRebatesFor` exists to prevent.
 *
 * ── Why the amounts are here and not read from canada-rebates.ts ──────────
 * `CANADA_REBATES` in `src/lib/rebates/canada-rebates.ts` currently holds the
 * same six figures, and this deliberately does not import them — the same
 * decision `ES_REBATES` above documents, for the same reason. That module is
 * the KCM program behind /signup, /signup2 and /signup3; this is one campaign's
 * copy of one bulletin. The two agreeing today is not a guarantee they should
 * move together, and the ES figures are already proof they sometimes must not
 * (Q4 ES is 80/100/200 here against Q3's 40/60/125 there).
 *
 * ── What is deliberately absent ───────────────────────────────────────────
 * The bulletin states each rebate as a Kawai portion and a dealer portion —
 * "$2,600 = $1,300 + $1,300". Only the consumer total appears here, exactly as
 * with ES: the split is a reimbursement arrangement between Kawai and its
 * dealers, and a shopper sees one number come off the price.
 *
 * "EP Only" in the bulletin is trade shorthand. It reads as Ebony Polish here,
 * because the page is written for the person buying the piano.
 */
type AcousticRebate = {
  /**
   * Catalogue model key — HYPHENATED, because that is how Payload stores it.
   *
   * The bulletin writes these unhyphenated ("GL20", "K200") and so does
   * `CANADA_REBATES`, which is exactly why that module carries a
   * `normalizeModel` helper. This list is queried against Payload directly by
   * `getRebateModelArt`, with no normalisation in between, so it holds the
   * catalogue's spelling: 'GL-20' finds a product, 'GL20' finds nothing and
   * silently falls the row back to a placeholder.
   */
  model: string
  /** How the model is written on this page. Payload's modelLabel is null here. */
  label: string
  /** Consumer total in CAD. */
  cad: number
}

const CA_ACOUSTIC_REBATES: ReadonlyArray<AcousticRebate> = [
  { model: 'GL-20', label: 'GL-20', cad: 2600 },
  { model: 'K-500', label: 'K-500', cad: 1700 },
  { model: 'K-300', label: 'K-300', cad: 1300 },
  { model: 'K-400', label: 'K-400', cad: 1300 },
  { model: 'K-200', label: 'K-200', cad: 900 },
  // No product record in Payload — verified, in both spellings. This row runs
  // on the placeholder until the ND-21 is added, and starts resolving on its
  // own the moment it is.
  { model: 'ND-21', label: 'ND-21', cad: 900 },
]

/** Every model the ledger needs catalogue art for. */
export const acousticRebateModels = CA_ACOUSTIC_REBATES.map((r) => r.model)

/**
 * The acoustic ledger's rows, biggest rebate first.
 *
 * Ordered by amount rather than by the bulletin's model order, so it reads the
 * same way as the ES ledger further down the page — two ledgers on one page
 * sorted on different keys is a difference a reader has to work out.
 */
export const acousticRebates = CA_ACOUSTIC_REBATES

export const acousticRebate = {
  eyebrow: 'Canada',
  heading: 'Up to $2,600 off a new acoustic piano',
  standfirst:
    'Six Kawai grand and upright models in Ebony Polish carry an instant rebate at your ' +
    'Authorized Kawai dealer. It comes off the price at the counter — there is nothing to ' +
    'claim and nothing to post.',
  /** Every row says it, so the ledger says it once instead. */
  finish: 'Ebony Polish only',
  stageImage:
    'https://pub-0cc9ed269d544fd29fe51221f6744a6b.r2.dev/media/KAWAI_CA401B-1%20copy.webp',
  stageImageAlt: 'A Kawai acoustic piano in a sunlit room',
  dealerNote: `The rebate is applied in the showroom. ${CTA_LEAD_IN}`,
  /**
   * The interim picture for a model with no catalogue entry.
   *
   * ND-21 has no product page yet. The generic upright category photograph
   * stands in rather than another model's portrait: a K-200 beside the words
   * "ND-21" is a wrong piano, which is worse than an unspecific one. Delete this
   * the day the ND-21 gets a product record — `getRebateModelArt` will find it
   * and the fallback stops being reached on its own.
   */
  fallbackImage: '/images/piano-categories/upright-pianos.jpg',
  disclaimer:
    'Rebate applies to new Kawai acoustic grand and upright pianos in Ebony Polish only, ' +
    'at participating Authorized Kawai dealers in Canada. All amounts in CAD. Prices shown ' +
    "are manufacturer's suggested retail; your dealer sets the final price. Dealer " +
    'participation may vary.',
} as const

/* ── The hero's value props ────────────────────────────────────────────── */

/**
 * The three offers as one cell each, in the bar across the foot of the hero.
 *
 * The hero names one offer per slide and rotates. The bar says all three at
 * once, holds still, and takes a reader straight into whichever one they came
 * for — which is the job the old three-row offer index under the stage was
 * trying to do, minus the part where it listed facts and left you to find them.
 *
 * Labels are NOT here: `PromoValueProps` reads them from `OFFER_CHIPS`, so a
 * cell cannot drift from the rail row and the section heading for the same
 * offer. This file supplies the detail line and the section to jump to.
 *
 * `sectionId` must be an id that is actually on the page for the current site,
 * which is the whole reason `valuePropsFor` exists rather than the bar being
 * handed all three: a cell pointing at `#financing` on ca.kawaius.com would
 * scroll nowhere.
 *
 * ── `highlight` ───────────────────────────────────────────────────────────
 * The words in `detail` that take the Ember marker, given as a substring of it
 * rather than as separate copy — so the sentence stays one string that the
 * compliance test can read, and a highlight cannot drift into saying something
 * the line does not. A `highlight` that is not found in its `detail` silently
 * marks nothing, so the test asserts the substring holds.
 *
 * One hook per line, and never a figure: whatever is marked is inside `detail`,
 * which already may not carry a rate, a term or an amount. Marking IS emphasis,
 * so a marked figure would be the loudest possible place to put one.
 *
 * ── Every line is a compression of copy already approved below ────────────
 * Not new claims. "On acoustic grands & uprights" is the financing slide's own
 * body; "Free with a CN or CA Series digital" is `bundle.standfirst`'s opening;
 * "Off ES Series portables, at the counter" is `rebate.standfirst`'s mechanism.
 * Writing them fresh would put three unreviewed sentences in the loudest
 * position on the page.
 *
 * The one edit is the ampersand in the first line, which is the compact
 * register a cell this size wants — the same reason `CTA_LABEL_SHORT` exists.
 * Prose on this page spells out "and"; do not let the ampersand migrate there.
 *
 * ── No rate, no term, no amount ───────────────────────────────────────────
 * Same rule as the rail's rows, and it bites hardest on the first cell: the
 * financing offer's whole appeal is a figure, and the figure may not go in a
 * hero label. §4.1 would then require "(APR 8.01%)*" beside it at identical
 * type and §4.2 a subhead at 40% of its size, inside an 11px cell, several
 * screens above the footnote that resolves the mark. The financing section is
 * where that headline can be set compliantly. The compliance test reads these
 * lines with the rest of the page's copy.
 *
 * Order is `STACK_ORDER` — financing, bundle, rebates, the offers by what they
 * are worth to a shopper — not the order page.tsx renders the sections in. The
 * rail has to match document order because an IntersectionObserver drives it;
 * this is a promise rather than a position, so it does not.
 */
const VALUE_PROPS = [
  {
    offer: 'financing',
    detail: 'On acoustic grands & uprights',
    // What a shopper is scanning this card for: whether their instrument is in
    // it. Not a benefit word, because the benefit here is a rate and a rate may
    // not appear on this card at all.
    highlight: 'acoustic grands & uprights',
    sectionId: SECTION.financing,
  },
  {
    offer: 'bundle',
    detail: 'Free with a CN or CA Series digital',
    highlight: 'Free',
    sectionId: SECTION.bundle,
  },
  {
    offer: 'rebates',
    detail: 'Off ES Series portables, at the counter',
    // The mechanism is the offer: it comes off the price in the showroom, with
    // nothing to claim and nothing to post.
    highlight: 'at the counter',
    sectionId: SECTION.rebate,
  },
] as const satisfies readonly PromoValueProp[]

/**
 * The value props for the active site.
 *
 * The financing cell comes out on ca.kawaius.com, for the same reason its
 * slide, its section, its disclosure and its rail row do: it is a US-market
 * Synchrony promotion and nothing on the Canadian domain may advertise it. This
 * is the fifth and last surface that offer reaches, so a CA page is now clean
 * of it end to end.
 *
 * The strip renders the remaining two rather than disappearing — the bundle and
 * the ES rebates both run in Canada, and they are what the page is there to
 * sell.
 */
export function valuePropsFor(site: 'us' | 'cad'): readonly PromoValueProp[] {
  if (site === 'us') return VALUE_PROPS
  return VALUE_PROPS.filter((p) => p.offer !== 'financing')
}

/* ── The page's own index ──────────────────────────────────────────────── */

/**
 * What the side rail lists, in the order the page renders.
 *
 * Document order is not a preference here: the rail's active row comes from an
 * IntersectionObserver over exactly these ids, so a list that disagrees with
 * the page runs its position marker backwards. The three offers first, in the
 * order page.tsx renders them, then the close. If a section moves in the page,
 * it moves here in the same commit.
 *
 * The three offer rows read from `OFFER_CHIPS`, so the slide, the chip, the
 * section heading and this row cannot end up calling one offer four things.
 *
 * No row carries a rate, a term or an amount. A figure in a floating label is
 * a credit advertisement separated from the disclosure §4.2 requires to sit
 * directly under it — these are wayfinding words only, and the compliance test
 * checks them with the rest of the page's copy.
 */
const NAV_SECTIONS = [
  { id: SECTION.bundle, label: OFFER_CHIPS.bundle },
  { id: SECTION.financing, label: OFFER_CHIPS.financing },
  { id: SECTION.acoustic, label: 'Acoustic Rebates' },
  { id: SECTION.rebate, label: OFFER_CHIPS.rebates },
  { id: SECTION.dealers, label: dealer.eyebrow },
] as const

/**
 * The rail for the active site.
 *
 * On ca.kawaius.com the financing section does not render, so its anchor comes
 * out. A rail entry pointing at an id that is not on the page scrolls nowhere
 * and reads as a broken link.
 *
 * There is no row for the disclosure: it renders inside the financing section
 * now, so "Financing" already takes a reader to it, and two rows landing in one
 * section make the rail's position marker flicker between them. Its
 * `SECTION.disclosures` id is still on the block for `#disclosures` links.
 *
 * The two acoustic rows are mutually exclusive and each site drops the other's:
 * financing is US-only and the acoustic rebate is CA-only, so neither rail ever
 * lists two acoustic offers and neither ever lists none. The label is spelled
 * out rather than taken from `OFFER_CHIPS`, because that map names the three
 * offers that run on both sites and this one does not — adding a fourth key
 * would put it in `OfferStack`'s brand order and in Variation B's stack, where
 * a Canada-only offer does not belong.
 */
export function navSectionsFor(site: 'us' | 'cad') {
  if (site === 'us') return NAV_SECTIONS.filter((s) => s.id !== SECTION.acoustic)
  return NAV_SECTIONS.filter((s) => s.id !== SECTION.financing)
}
