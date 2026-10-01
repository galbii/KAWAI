'use client'

import { useReducedMotion } from 'framer-motion'
import type { OfferKey } from '@/lib/fall-promo/tokens'
import { OFFER_CHIPS } from '@/lib/fall-promo/tokens'
import { scrollToPromoSection } from '@/lib/fall-promo/scroll'

/**
 * The campaign's offers as light glass cards overlaid on the foot of the hero:
 * one card per offer, each one a jump into the section that explains it.
 *
 * It is the three-row offer index that used to sit under the stage, with the
 * two things that index was missing — each card says what its offer covers
 * rather than only naming it, and each card goes somewhere.
 *
 * ── Why the glass is light when the stage's controls are dark ─────────────
 * Ivory at 0.70 with Ink on it, not Ink at 0.62 with Ivory on it. That is the
 * opposite of the arrows and the pause control, and it is the right way round
 * for this campaign's photography.
 *
 * `PromoHeroCarousel`'s docblock establishes that a frosted panel fails here as
 * `bg-white/10` — 2.82:1 for body copy, and blur cannot rescue it because
 * `backdrop-filter` removes detail without changing the mean luminance behind
 * the glyphs. The answer it reaches is a dark tint, and for a single glyph in a
 * round button that is correct. For a card holding a label, a detail line and a
 * link it is the weaker choice, because a dark tint only has contrast to spare
 * where the frame behind it is bright, so it weakens exactly where a photograph
 * gets interesting.
 *
 * A light tint inverts that dependency, which is what lets this card be as
 * transparent as it is. The material, its measured alpha floor and the reason
 * the Ember edge only appears on hover all live on `.promo-glass` in
 * PromoStyles — read that comment before changing any of it.
 *
 * The carousel's warning about glass is that two NEARLY identical treatments on
 * one stage read as an inconsistency rather than a distinction. Light cards
 * against dark round controls are not nearly identical — they are a content
 * surface and a set of controls, and reading as two different things is the
 * intent. What would break that rule is a second DARK glass at 0.55 or 0.70
 * next to the controls' 0.62. Do not add one.
 *
 * `.promo-on-light` carries the inversion: it is defined for exactly this, "an
 * OPAQUE object sitting on that dark ground — a product card, a panel. Its own
 * fill supplies the contrast, so it wants the page's ordinary light set." Every
 * colour below is a token from that set, so nothing here names a hex.
 *
 * ── Two reds, on purpose ──────────────────────────────────────────────────
 * Ember appears here only as a SHAPE — the 2px hover edge — and every red WORD
 * takes `--accent-ink` instead. The split is forced rather than stylistic.
 * Ember as small text measures 2.31:1 on this glass at its worst composite, so
 * neither the hook words nor "Learn more" can be Ember-coloured; the campaign's
 * own tokens say as much ("graphic only below 24px"), and PromoSideNav says not
 * to move the accent onto a label to make it louder.
 *
 * `--accent-ink` is Ember at the same hue darkened to 4.75:1 at worst and
 * 9.46:1 at best, which carries a word at 12–15px anywhere on this card. The
 * hover edge keeps the true Ember because a bar is a shape and answers to
 * 1.4.11's 3:1 rather than 1.4.3's 4.5:1.
 *
 * The hook words were a highlighter fill before they were an underline, and
 * that version could use real Ember — white on an Ember ground is 5.04:1, the
 * brand's own button pairing. An underline cannot, because it makes the word
 * itself red. That trade is recorded on `.promo-mark` in PromoStyles.
 *
 * This is the same arrangement the main site uses for `kawai-red` against
 * `kawai-red-400`, and it is why there is no single "red" to reach for here:
 * pick by role, shape or ink.
 *
 * ── Motion ────────────────────────────────────────────────────────────────
 * The cards arrive on a stagger, reusing `.promo-lockup-enter` and its
 * `--promo-i` index — the same mechanism the hero's brand lockup uses, so the
 * two entrances share one curve and one rhythm rather than each inventing a
 * timing. The index starts at 2 so the band lands after the slide copy above
 * it, which framer-motion brings in on its own 0.3s delay.
 *
 * On hover a card lifts, frosts up, takes an Ember edge, and a sheen crosses
 * the pane. The lift is `translate` and the entrance keyframe animates
 * `transform`, which in Tailwind v4 are separate properties — they compose
 * instead of fighting, which is why the animation can sit on the `<li>` and the
 * hover on the button without either resetting the other.
 *
 * Nothing here guards `prefers-reduced-motion`: globals.css collapses every
 * animation-duration and transition-duration on the page, and
 * `.promo-lockup-enter` is itself inside a `no-preference` query.
 *
 * ── Clearance ─────────────────────────────────────────────────────────────
 * The band sits in the stage's coordinate space, so the carousel lifts its dot
 * rail, its pause control and its copy column clear of it — see the
 * `valueProps` prop there. Nothing in this file positions itself against that
 * chrome; the carousel owns the whole arrangement.
 *
 * ── The names are not the caller's ────────────────────────────────────────
 * Labels come from `OFFER_CHIPS`, like `OfferChip` and `OfferStack`. A caller
 * supplies the detail line and the section to jump to, so a card cannot end up
 * calling an offer one thing while the rail and the section heading call it
 * another.
 *
 * ── No figures, by construction ───────────────────────────────────────────
 * A card carries scope, never a rate, a term or an amount — the same rule as
 * the rail's rows, and it bites hardest on the financing card, whose whole
 * appeal is a figure. A number here would be a credit advertisement several
 * screens above the disclosure §4.2 requires directly under it. The financing
 * section is where that headline can be set compliantly. The compliance test
 * reads these lines with the rest of the page's copy.
 */

export interface PromoValueProp {
  /** Which offer this card is for. Its label comes from `OFFER_CHIPS`. */
  offer: OfferKey
  /** One short line naming what the offer covers. Never a rate, term or amount. */
  detail: string
  /**
   * The words inside `detail` that take the Ember marker. A substring of it,
   * not separate copy — see the note in the campaign's VALUE_PROPS.
   */
  highlight?: string
  /** The `id` of the `<section>` this card jumps to. */
  sectionId: string
}

/**
 * The same two words on every card, like `CTA_LABEL` on every button.
 *
 * It names what the card does rather than what the offer is worth, which is
 * also what keeps it clear of §4.2 — "See the terms" would promise the
 * disclosure, and the disclosure is page text at the foot of the financing
 * section, not something a hero card can stand in for.
 */
const LEARN_MORE = 'Learn more'

/**
 * `detail` with its hook words marked.
 *
 * Splits on the first occurrence only: a hook is one phrase, and marking every
 * match would light up a stray "Free" in a longer sentence. If the substring is
 * not present the line renders plain rather than throwing — a highlight that
 * has drifted out of its copy is a copy bug, caught by the compliance test, and
 * not a reason to blank the card in front of a customer.
 */
function withHook(detail: string, highlight?: string) {
  if (!highlight) return detail
  const at = detail.indexOf(highlight)
  if (at < 0) return detail
  return (
    <>
      {detail.slice(0, at)}
      <mark className="promo-mark">{highlight}</mark>
      {detail.slice(at + highlight.length)}
    </>
  )
}

export function PromoValueProps({ items }: { items: readonly PromoValueProp[] }) {
  const reduce = useReducedMotion()

  // CA drops the financing card; two is still a set. Only an empty list is
  // nothing to draw.
  if (items.length === 0) return null

  return (
    <nav aria-label="The offers on this page" className="promo-on-light">
      {/*
        Stacked below `sm`, side by side from `sm` up.

        A phone shows all three at once rather than one-and-a-peek in a swipe
        row, which is what this was first. The cost is height, and the hero only
        has so much — so a stacked card is a different card, not the same one
        narrower: one line of label, one of detail, the link beside them instead
        of under them. Roughly 70px each against the full card's 130.

        `auto-cols-fr` over `grid-flow-col` from `sm` so two cards split the
        width evenly on ca.kawaius.com without a second class for that case.
      */}
      <ul className="flex flex-col gap-2 sm:grid sm:auto-cols-fr sm:grid-flow-col sm:gap-4">
        {items.map(({ offer, detail, highlight, sectionId }, i) => (
          <li
            key={offer}
            className="promo-lockup-enter"
            // Starts at 2 so the cards land after the slide copy, which has its
            // own 0.3s delay. `.promo-lockup-enter` reads this.
            style={{ '--promo-i': i + 2 } as React.CSSProperties}
          >
            <button
              type="button"
              onClick={() => scrollToPromoSection(sectionId, reduce)}
              // `group` drives the sheen, the numeral, the edge and the arrow.
              // `h-full` keeps the cards level when one detail line wraps and
              // another does not. The glass material — fill, blur, saturate,
              // rim, shadow, and the frost-up on hover — is `.promo-glass`.
              // Two layouts. On a phone the card is one horizontal band —
              // text left, link right, vertically centred — so three of them
              // cost the hero as little height as possible. From `sm` it is the
              // column it was designed as.
              className="promo-focus promo-glass promo-glass-text group relative flex h-full w-full items-center gap-3 overflow-hidden rounded-lg px-4 py-2.5 text-left hover:-translate-y-1 sm:flex-col sm:items-start sm:gap-0 sm:px-6 sm:pb-5 sm:pt-6"
            >
              {/* Ornament. See `.promo-sheen` in PromoStyles. */}
              <span aria-hidden className="promo-sheen" />
              {/* The ghost numeral. Fraunces at a size nothing else on the card
                  comes near, held at 0.10 so it reads as a watermark rather
                  than a figure to be read — the cards are an enumeration and
                  this is what says so without a word. Numbered by position, so
                  CA's two cards are 01 and 02 rather than 01 and 03. */}
              <span
                aria-hidden
                className="promo-display pointer-events-none absolute -top-3 right-3 hidden select-none text-[4.5rem] leading-none sm:block text-[color:var(--on-ground)] opacity-[0.10] transition-[opacity,translate] duration-500 group-hover:-translate-y-1 group-hover:opacity-20"
              >
                {String(i + 1).padStart(2, '0')}
              </span>

              {/* The edge wipes in from the left on hover. Ember is already
                  what marks the side rail's active row, so a card lighting up
                  here and a row lighting up there are one gesture. A graphic,
                  not text: 3.62–4.48:1 on this card, against 1.4.11's 3:1. */}
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-[color:var(--accent)] transition-transform duration-300 group-hover:scale-x-100 group-focus-visible:scale-x-100"
              />

              <span className="relative min-w-0 flex-1 sm:w-full sm:flex-none">
                <span className="promo-label block text-[10px] text-[color:var(--on-ground)] sm:text-[11px]">
                  {OFFER_CHIPS[offer]}
                </span>

              {/* `flex-1` so "Learn more" sits on the card's floor whatever the
                  detail line does above it, which is what keeps the three
                  footers on one line across the band. */}
                <span className="promo-body mt-1 block text-[0.8125rem] leading-snug text-[color:var(--body)] sm:mt-2 sm:text-[0.875rem]">
                  {withHook(detail, highlight)}
                </span>
              </span>

              {/* Beside the text on a phone; on the card's floor from `sm`,
                  where `w-full justify-end` is what reaches the right edge —
                  the card is a flex column with `items-start`, so a child only
                  gets there once told to span the width. `shrink-0` keeps the
                  label off two lines when the detail is long. */}
              <span className="promo-body relative inline-flex shrink-0 items-center gap-1.5 text-[0.8125rem] font-semibold tracking-wide text-[color:var(--accent-ink)] sm:mt-4 sm:w-full sm:justify-end sm:text-[0.9375rem]">
                {LEARN_MORE}
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.75}
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 sm:h-4 sm:w-4"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 12h15m0 0l-5.5-5.5M19 12l-5.5 5.5" />
                </svg>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
