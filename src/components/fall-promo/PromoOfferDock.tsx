'use client'

import { useEffect, useState } from 'react'
import { useLeadCampaign } from '@/components/campaign-lead'

interface PromoOfferDockProps {
  /**
   * ISO date the program ends. Pass the campaign's own constant — the one the
   * disclosures are built from — never a re-typed date, so the pill and the
   * fine print cannot end up naming two different deadlines.
   */
  endsOn: string
  /** How the deadline reads until the day count resolves, e.g. "Dec 31". */
  endsLabel: string
  /** The button. Short: this is a corner pill, not a section CTA. */
  label: string
  /**
   * The button's accessible name, when `label` alone does not say what it does.
   *
   * Every other CTA on the page has its lead-in sentence beside it; this one has
   * a day count and nothing else, so a label like "Sign Up Now" leaves a screen
   * reader with the verb and no object (WCAG 2.4.4). Pass the full purpose here
   * and the visible pill stays short. Omitted, the label is the name.
   */
  ariaLabel?: string
  /** Appears once this section has been reached. */
  afterId: string
  /** Disappears once this section is close. */
  beforeId: string
}

/**
 * A persistent corner pill: how long is left, and the one action.
 *
 * The same two-part shape as the Back to School dock — an information half
 * fused to a conversion half — because a floating button that only says
 * "enquire" spends a permanent corner of the viewport on something the page
 * already says in full several times. Paired with the deadline it carries a
 * fact worth keeping on screen.
 *
 * `open` comes from `useLeadCampaign`, so this is not a second route to a
 * second form: it opens the identical modal every `PromoButton` on the page
 * opens, from the same provider, with the same config and the same test-mode
 * flag. Nothing to keep in sync.
 *
 * ── Why it is not on screen the whole time ───────────────────────────────
 *
 * It appears after the hero, whose own CTA is the primary one and which a
 * floating duplicate would sit directly on top of; and it retires at the
 * enquiry section, where the real form is on the page and a pill offering to
 * open that same form in a dialog a few hundred pixels away is noise. Both
 * ends are anchor-driven rather than pixel-driven, so re-ordering the page
 * moves them automatically.
 *
 * ── Why this one does not invert with the section under it ───────────────
 *
 * Everything else in this folder paints from the semantic aliases so it flips
 * with the ground it lands on. A fixed element has no ground — it floats over
 * Ivory sections and the Ink cinematic alike — so it takes one constant
 * treatment instead: an Ink pill with an Ivory hairline (15.01:1), and the
 * Ember fill that the guidelines hold identical across both variations, with
 * the white label `BUTTON_LABEL` exists for (5.04:1; Ivory on Ember is 4.40:1
 * and fails at this size). The hairline is doing real work — a bare Ink pill
 * dissolves into the cinematic and leaves the text floating.
 *
 * No figure appears here but the deadline. A rate or a term in a floating pill
 * is a credit advertisement that has left its disclosure behind, which is the
 * same rule that keeps them out of the side rail's labels.
 *
 * ── The label says less than the page's buttons do ───────────────────────
 *
 * A section CTA is read with the lead-in sentence above it; this one is read
 * with a day count. So the pill takes `ariaLabel` for the purpose its short
 * label leaves out, and the caller is the one that knows it.
 */

const DAY_MS = 86_400_000

/** Local midnight-to-midnight, so "days left" matches the reader's calendar. */
function daysUntil(iso: string): number {
  return Math.ceil((new Date(`${iso}T23:59:59`).getTime() - Date.now()) / DAY_MS)
}

export function PromoOfferDock({
  endsOn,
  endsLabel,
  label,
  ariaLabel,
  afterId,
  beforeId,
}: PromoOfferDockProps) {
  const { open } = useLeadCampaign()

  const [visible, setVisible] = useState(false)

  // Resolved after mount, never during render: the count depends on the
  // reader's clock and timezone, so computing it on the server would render a
  // number the client then disagrees with. Until it lands, the pill shows the
  // static deadline — which is why `endsLabel` is required rather than derived.
  const [daysLeft, setDaysLeft] = useState<number | null>(null)

  useEffect(() => setDaysLeft(daysUntil(endsOn)), [endsOn])

  useEffect(() => {
    function onScroll() {
      const after = document.getElementById(afterId)
      const before = document.getElementById(beforeId)

      // Fall back to viewport fractions if an anchor is missing, so a renamed
      // section degrades to a dock that still works rather than one that never
      // appears.
      const past = after
        ? after.getBoundingClientRect().top < window.innerHeight * 0.5
        : window.scrollY > window.innerHeight * 0.8
      const notYet = before
        ? before.getBoundingClientRect().top > window.innerHeight * 0.85
        : true

      setVisible(past && notYet)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [afterId, beforeId])

  // Past the deadline the offers do not exist and neither does the pill.
  if (daysLeft !== null && daysLeft <= 0) return null

  return (
    <div
      // z-40 keeps it under the z-50 lead modal it opens — a pill floating on
      // top of its own dialog's backdrop is the bug this avoids.
      className={`fixed bottom-5 right-4 z-40 transition-all duration-300 sm:bottom-6 sm:right-6 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
      }`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-hidden={!visible}
    >
      <div className="flex items-stretch overflow-hidden rounded-full border border-[color:var(--ivory)]/20 bg-[color:var(--ink)] shadow-[0_10px_32px_rgba(29,27,24,0.32)]">
        <span className="flex items-center gap-2 py-3 pl-5 pr-4">
          <span
            aria-hidden
            className="h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ background: 'var(--ember)' }}
          />
          <span className="promo-body whitespace-nowrap text-xs tracking-[0.1em] text-[color:var(--ivory)]">
            {daysLeft !== null ? `${daysLeft} ${daysLeft === 1 ? 'day' : 'days'} left` : `Ends ${endsLabel}`}
          </span>
        </span>

        {/* The fill, the label colour and the hover are PromoCta's `FILLED`
            verbatim, so the dock's button is the page's button. In particular
            hover DARKENS Ember (`/90`) rather than lightening it: white on
            Ember is 5.04:1 with no margin to give away, and a brightened fill
            drops the label under AA.

            Focus ring is Ivory, not `promo-focus`. That utility draws
            `--focus-ring`, which on Variation A is Ink — invisible against
            this pill. */}
        <button
          type="button"
          onClick={open}
          // The pill carries no copy but a day count, so the visible label is
          // the whole accessible name unless the caller supplies a fuller one.
          {...(ariaLabel ? { 'aria-label': ariaLabel } : {})}
          tabIndex={visible ? 0 : -1}
          className="promo-body bg-[color:var(--ember)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--btn-label)] transition-colors duration-200 hover:bg-[color:var(--ember)]/90 focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{ outlineColor: 'var(--ivory)' }}
        >
          {label}
        </button>
      </div>
    </div>
  )
}
