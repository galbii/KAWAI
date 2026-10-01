/**
 * Fall Promo 2026 — the brand system both campaign pages are built on.
 *
 * Source: "Fall Promo Brand Guidelines", page 01 (Foundations). Two campaign
 * looks share one foundation:
 *
 *   Variation A · Seasonal Offers   calm, product-led   → /fall-financing
 *   Variation B · Stack the Savings loud about volume   → /fall-financing2
 *
 * The guidelines forbid mixing the two looks on one page, which is why they are
 * two routes rather than one page with a toggle. Everything that is genuinely
 * shared — the palette, the type scale, the chip, the button — lives here so the
 * two pages cannot drift into two different systems.
 *
 * Hex values are the guideline's own, not sampled approximations.
 */

/* ── Colour ─────────────────────────────────────────────────────────────── */

export const COLOR = {
  /** Text, and the ground for Variation B. */
  ink: '#1D1B18',
  /** Main background. */
  ivory: '#F5EFE4',
  /** Cards and photo mats. */
  parchment: '#EADFCB',
  /** Lead colour for Seasonal Offers. */
  walnut: '#4A3426',
  /** Lead colour for Stack the Savings, and every button in both variations. */
  ember: '#B4521E',
  /** Accent. As text, only on Ink — see CONTRAST below for why that is a rule. */
  gold: '#C8942F',
} as const

export type ColorToken = keyof typeof COLOR

/**
 * Measured contrast, because two of the brand's own pairings do not clear
 * WCAG AA and the page has to work around them rather than discover them later.
 * This site is held to AA (ADA matter) — see the Accessibility section of
 * CLAUDE.md.
 *
 *   Ink     on Ivory      15.01:1   ✓ anything
 *   Walnut  on Ivory      10.14:1   ✓ anything            ← body copy on A
 *   Walnut  on Parchment   8.79:1   ✓ anything            ← copy on a photo mat
 *   Ivory   on Ink        15.01:1   ✓ anything            ← body copy on B
 *   Gold    on Ink         6.33:1   ✓ anything            ← B eyebrow
 *   Ink     on Gold        6.33:1   ✓ anything            ← stack: Financing bar
 *
 *   Ember   on Ivory       4.40:1   ✗ normal · ✓ large    ← see EMBER_TEXT_MIN
 *   Ivory   on Ember       4.40:1   ✗ normal · ✓ large    ← see BUTTON_LABEL
 *   Ink     on Ember       3.41:1   ✗ normal · ✓ large
 *   Gold    on Ivory       2.37:1   ✗ both — the guidelines already forbid it
 */

/**
 * Button labels are white, not Ivory.
 *
 * The guidelines mandate an Ember fill on every button in both variations, but
 * Ivory on Ember is 4.40:1 — under AA for text at button size, and a button
 * label is the one piece of text on the page that must never be marginal.
 * White on Ember is 5.04:1 and is visually indistinguishable from Ivory at that
 * size against that fill. The brand's fill is kept; only the label moves.
 */
export const BUTTON_LABEL = '#FFFFFF'

/**
 * Smallest size Ember may be used as text on Ivory or Parchment.
 *
 * 4.40:1 clears AA only as "large text" (≥24px, or ≥18.66px bold). Below this,
 * Ember is a graphic colour — the Season Mark, a rule, a fill — and the text
 * goes Walnut, which the guidelines name as the lead text colour anyway.
 */
export const EMBER_TEXT_MIN_PX = 24

/* ── Type ───────────────────────────────────────────────────────────────── */

/**
 * Fraunces for headlines and campaign names only, regular weight, sentence
 * case, never all caps. Instrument Sans for sublines, body, prices, buttons and
 * fine print. Both are loaded in `src/app/layout.tsx` with `preload: false`.
 *
 * The guideline scale is 96 / 56 / 20 / 13. Those are the desktop end of each
 * clamp; the lower bound keeps each step legible on a phone without collapsing
 * the hierarchy between them.
 */
export const TYPE = {
  /** 96 — hero headline. Fraunces. */
  display: 'clamp(2.75rem, 7vw, 6rem)',
  /** 56 — section headline. Fraunces. */
  heading: 'clamp(1.9rem, 4vw, 3.5rem)',
  /** 20 — subline. Instrument Sans. */
  subline: 'clamp(1.05rem, 1.6vw, 1.25rem)',
  /** 13 — label, caps, +16% tracking. Instrument Sans. */
  label: '0.8125rem',
  /** The +16% the guideline specifies for caps labels. */
  labelTracking: '0.16em',
} as const

/* ── Offer chips ────────────────────────────────────────────────────────── */

/**
 * One chip per offer type. Plain names only — no amounts inside a chip, in
 * either variation. Outline on light grounds, solid Ivory on dark.
 *
 * The guideline deck illustrates four (Rebates, Financing, SH-9 Bundle, Fall
 * Savings). This campaign runs three concrete offers, which satisfies Stack the
 * Savings' "always show at least three bars"; "Fall Savings" is the deck's
 * catch-all and is deliberately not invented into a fourth offer here, because
 * naming an offer the page cannot then explain is worse than showing three.
 *
 * ── One name per offer, everywhere ────────────────────────────────────────
 * Two of these read longer than the bare noun — "Financing Options" rather
 * than "Financing", "Instant Rebates" rather than "Rebates" — because they now
 * head the hero's value props, where a one-word label is a category and not a
 * promise. "Instant" is the rebate's actual mechanism (it comes off at the
 * counter, nothing to claim or post), so the longer name says more rather than
 * padding.
 *
 * Changing a name here changes it on every surface at once: the hero value
 * props, the side rail's rows, Variation A's chips and Variation B's stack.
 * That is the point of the map. Do not introduce a second, shorter form for
 * one of those surfaces — the rail's panel sizes to `width: auto` with
 * `whitespace-nowrap`, so it has no width budget that a longer label breaks.
 *
 * `bundle` is unchanged: "SH-9 Bundle" already names the thing you get.
 */
export const OFFER_CHIPS = {
  financing: 'Financing Options',
  bundle: 'SH-9 Bundle',
  rebates: 'Instant Rebates',
} as const

export type OfferKey = keyof typeof OFFER_CHIPS

/**
 * Stack order for Variation B: biggest offer at the bottom, each bar a step
 * shorter going up. Bottom-first, so `index 0` is the base bar.
 *
 * "Biggest" is the offer worth most to a shopper, not the one with the largest
 * printed number — financing on a $25,000 grand outweighs a $150 rebate by an
 * order of magnitude, so it takes the base.
 */
export const STACK_ORDER: readonly OfferKey[] = ['financing', 'bundle', 'rebates']
