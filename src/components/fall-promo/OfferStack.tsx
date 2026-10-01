import type { OfferKey } from '@/lib/fall-promo/tokens'
import { OFFER_CHIPS, STACK_ORDER } from '@/lib/fall-promo/tokens'

/**
 * The Offer Stack — Variation B's signature element, and the reason the
 * variation exists. Volume is the message: the pile is read before the detail.
 *
 * One bar per offer, biggest at the bottom, each bar a step shorter going up,
 * all right-aligned so the steps read as a staircase rather than a centred
 * ornament. Never fewer than three bars — a single offer under this name is an
 * explicit DON'T, so `OfferStack` refuses to render below three rather than
 * quietly shipping an off-brand one-bar version.
 *
 * No amounts and no fine print inside a bar, also a DON'T. The bars carry offer
 * NAMES; the numbers live in the sections underneath, where they can be
 * disclosed properly. `OFFER_CHIPS` is the single source of those names, shared
 * with Variation A's chips, so the two pages cannot call the same offer two
 * different things.
 *
 * Bar fills run dark-to-light from the base up. The base takes `baseColor`,
 * which must contrast with the ground it is laid on: Ink on an Ember panel,
 * Ember on an Ink page. Every label/fill pairing below clears WCAG AA —
 * white on Ember 5.04:1, Ink on Gold 6.33:1, Ink on Parchment 13.02:1,
 * Ink on Ivory 15.01:1.
 */

interface Bar {
  /** Fill, as a CSS colour or custom property. */
  fill: string
  /** Label colour that clears AA on `fill`. */
  label: string
}

/** Bottom-up. Index 0 is the base bar. */
const LADDER: readonly Bar[] = [
  { fill: 'var(--ember)', label: 'var(--btn-label)' }, // 5.04:1
  { fill: 'var(--gold)', label: 'var(--ink)' }, //        6.33:1
  { fill: 'var(--parchment)', label: 'var(--ink)' }, //  13.02:1
  { fill: 'var(--ivory)', label: 'var(--ink)' }, //      15.01:1
]

/** How much narrower each bar is than the one below it. */
const STEP_PCT = 9

export function OfferStack({
  offers = STACK_ORDER,
  baseColor,
}: {
  /** Bottom-up: the first entry is the base bar. Defaults to the brand order. */
  offers?: readonly OfferKey[]
  /** Overrides the base bar's fill for a ground where Ember would vanish. */
  baseColor?: string
}) {
  // "Always show at least three bars." A stack that cannot honour that is not a
  // stack, and rendering one anyway would put an off-brand lockup in front of
  // customers — so it renders nothing and the section falls back to its copy.
  if (offers.length < 3) return null

  // Painted top-down, so the widest bar lands last and sits at the bottom.
  const rows = [...offers].reverse()

  return (
    <div className="flex w-full flex-col items-end" aria-hidden>
      {rows.map((key, i) => {
        // `i` counts down from the top; convert to the bar's rung on the ladder.
        const rung = offers.length - 1 - i
        const bar = LADDER[Math.min(rung, LADDER.length - 1)]!
        const fill = rung === 0 && baseColor ? baseColor : bar.fill
        return (
          <div
            key={key}
            className="promo-body flex items-center px-5 py-4 text-[0.95rem] font-semibold sm:px-7 sm:py-5 sm:text-[1.05rem]"
            style={{
              width: `${100 - rung * STEP_PCT}%`,
              minWidth: '58%',
              background: fill,
              color: bar.label,
            }}
          >
            {OFFER_CHIPS[key]}
          </div>
        )
      })}
    </div>
  )
}

/**
 * The stack's text equivalent.
 *
 * The bars are `aria-hidden` because a staircase of coloured divs is a picture
 * of "there are three offers", not a list a screen reader should climb. This
 * renders the same fact as one sentence, visually hidden, so the information
 * survives without the ornament.
 */
export function OfferStackAlt({ offers = STACK_ORDER }: { offers?: readonly OfferKey[] }) {
  const names = offers.map((k) => OFFER_CHIPS[k])
  const last = names[names.length - 1]
  const rest = names.slice(0, -1).join(', ')
  return (
    <p className="sr-only">
      {`${names.length} offers this fall: ${rest} and ${last}.`}
    </p>
  )
}
