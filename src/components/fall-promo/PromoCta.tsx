import Link from 'next/link'
import type { ReactNode } from 'react'

/**
 * The campaign button. Ember fill, square-ish corners, verb first.
 *
 * Ember in both variations — the guidelines make the button the one element
 * that does not change between the calm look and the loud one, so a visitor
 * meets the same call to action either way. That is why there is no `tone`
 * here: the fill is fixed and it reads on Ivory and on Ink alike.
 *
 * The label is white rather than Ivory. Ivory on Ember measures 4.40:1, under
 * AA at button size; white is 5.04:1 and is indistinguishable from Ivory
 * against that fill. The brand's fill is untouched — only the label moves. See
 * `BUTTON_LABEL` in `@/lib/fall-promo/tokens`.
 *
 * "Verb first" is a copy rule the component cannot enforce, so it is stated
 * here for whoever writes the next label: "Shop fall offers", "See every
 * offer", "Ask about these offers" — never "Fall offers" or "More info".
 *
 * Presentational only. Lead-modal wiring stays in each route's own components
 * so this stays usable for a plain link too.
 */

const BASE =
  'promo-body promo-focus inline-flex items-center justify-center rounded-[3px] ' +
  'font-semibold leading-none transition-colors duration-200'

/**
 * Two sizes only. `default` is the page's call to action; `compact` is for a
 * button repeated down a list, where the full size would turn a row of models
 * into a column of buttons with pianos attached.
 */
const SIZES = {
  default: 'px-7 py-4 text-[0.95rem]',
  compact: 'px-4 py-2.5 text-[0.85rem]',
} as const

const FILLED =
  'bg-[color:var(--ember)] text-[color:var(--btn-label)] hover:bg-[color:var(--ember)]/90'

export function PromoCta({
  children,
  onClick,
  size = 'default',
  hasPopup,
}: {
  children: ReactNode
  onClick?: () => void
  size?: keyof typeof SIZES
  /**
   * Set for a button that opens a dialog rather than navigating. Same contract
   * as {@link PromoCtaSecondaryButton} — and deliberately NOT `aria-expanded`,
   * which needs an `aria-controls` target a modal does not have until it is
   * mounted. On a campaign page where every CTA opens the lead form, this is
   * the only thing distinguishing these buttons from the links beside them.
   */
  hasPopup?: 'dialog'
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-haspopup={hasPopup}
      className={`${BASE} ${SIZES[size]} ${FILLED}`}
    >
      {children}
    </button>
  )
}

/** The same button as a link. */
export function PromoCtaLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className={`${BASE} ${SIZES.default} ${FILLED}`}>
      {children}
    </Link>
  )
}

const OUTLINED =
  'border border-[color:var(--on-ground)]/35 text-[color:var(--on-ground)] ' +
  'hover:bg-[color:var(--on-ground)] hover:text-[color:var(--ground)]'

/**
 * Matched secondary — same size and shape, outlined in the ground's own text
 * colour so it works in either variation without a second definition.
 */
export function PromoCtaSecondary({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className={`${BASE} ${SIZES.default} ${OUTLINED}`}>
      {children}
    </Link>
  )
}

/**
 * The secondary as a button, for the one thing on a campaign page that is not a
 * destination: opening a disclosure. It sits beside the filled CTA and must
 * stay quieter than it — a financing page's terms are a duty, not an offer.
 */
export function PromoCtaSecondaryButton({
  children,
  onClick,
  hasPopup,
}: {
  children: ReactNode
  onClick?: () => void
  /**
   * Set for a button that opens a dialog. NOT aria-expanded — that is the
   * disclosure contract, and it comes paired with an aria-controls target that
   * a modal does not have until it is mounted.
   */
  hasPopup?: 'dialog'
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-haspopup={hasPopup}
      className={`${BASE} ${SIZES.default} ${OUTLINED}`}
    >
      {children}
    </button>
  )
}
