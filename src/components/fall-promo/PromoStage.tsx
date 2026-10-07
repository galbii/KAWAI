import Image from 'next/image'
import type { ReactNode } from 'react'
import { PROMO_CONTAINER, PROMO_CONTAINER_WIDE } from './PromoStyles'
import { PromoReveal, StageParallax } from './PromoReveal'

/**
 * A full-bleed photographic stage that opens a section.
 *
 * On its own it is a lockup over a picture: one heading, one line under it, and
 * whatever the section's call to action is. Given an `aside` it becomes a two
 * column stage — lockup left, working content right — with both halves over the
 * same photograph.
 *
 * ── Why the lockup sits low, and why `aside` changes the scrim ────────────
 * Centred or free-floating type on a flat scrim cannot clear WCAG AA over an
 * arbitrary photograph: against a blown-out frame even Ink at 0.68 leaves a
 * subheading at 4.42:1, and raising it far enough to pass turns the picture
 * into a grey rectangle. So the default stage anchors its lockup to the bottom
 * and lets a gradient do the work where the type actually is — a flat 0.30 base
 * falling to 0.72 at the foot. That holds the photograph open at the top while
 * giving the worst case 8.01:1 for the heading and 6.65:1 for the subheading.
 *
 * An `aside` breaks that arrangement, because a column of content occupies the
 * full height of the stage and most of it sits well above the gradient's reach,
 * where even solid Ivory measures 4.22:1. A gradient cannot rescue text that is
 * not at the bottom. So a stage carrying an aside raises its flat base to 0.70,
 * which clears AA everywhere on the frame (5.53:1 solid Ivory) at the cost of a
 * more subdued picture — the right trade when the picture is sharing the stage
 * with a product browser rather than carrying it alone.
 *
 * Content laid on the stage gets `.promo-on-dark`, so nested components invert
 * without a prop. Opaque objects inside it — product cards — re-assert
 * `.promo-on-light`, since their own fill supplies their contrast.
 *
 * ── Parallax ──────────────────────────────────────────────────────────────
 * The photograph reads `--stage-shift`, a length any descendant can set. That
 * is how a stage whose aside scrolls internally keeps its picture alive: the
 * page is not moving, so nothing else would drift. The image is pre-scaled to
 * 1.08 so a shift never exposes an edge, and the whole thing degrades to a
 * still frame when the variable is absent — which is also what happens under
 * `prefers-reduced-motion`, since the component that sets it declines to.
 *
 * Kept as a CSS variable rather than a prop so this stays a server component:
 * the client half is whichever scroller wants to drive it.
 *
 * `StageParallax` is that driver for the page scroll: it rides along inside
 * every stage and moves the picture against the page as the section passes.
 *
 * ── Arrival ───────────────────────────────────────────────────────────────
 * The lockup comes in as an object and then settles: the card lifts, and the
 * eyebrow, heading, line and CTA follow it in a short stagger. The aside starts
 * a beat later, so on a desktop — where both columns enter together — the eye
 * is handed from the offer to its contents rather than to both at once. What
 * moves inside the aside is the caller's to mark (`data-reveal`), since only
 * the caller knows whether it holds tiles or a ledger. See `PromoReveal`.
 *
 * Nothing here is interactive, and `priority` is off because a stage is always
 * below the hero.
 */
export function PromoStage({
  image,
  imageAlt,
  eyebrow,
  heading,
  subheading,
  children,
  aside,
  scrim,
  lockupCard = false,
  wide = false,
  id,
}: {
  /**
   * The photograph. Omit for a stage with no picture at all — the section then
   * runs on flat Ink and the scrim defaults to 0, since there is nothing to
   * hold type legible against. Everything else about the stage is unchanged.
   */
  image?: string
  /** Describes the photograph. Empty string if the heading already says it. */
  imageAlt?: string
  /** Small tracked-out line above the heading — a deadline, a scope. */
  eyebrow?: string
  /** Fraunces, regular weight, sentence case. Never all caps, never bold. */
  heading: string
  /** The one line that explains the heading. */
  subheading?: string
  /** A CTA, or anything else belonging to the lockup. */
  children?: ReactNode
  /** Working content for the right half — a browser, a table. */
  aside?: ReactNode
  /**
   * Flat wash over the photograph, 0–1. Omit for the default, which is sized
   * to carry bare type: 0.70 on a split stage, 0.30 plus a bottom gradient
   * otherwise.
   *
   * Pass 0 only when everything on the stage carries its own contrast — which
   * in practice means `lockupCard` for the copy and opaque cards on the right.
   * Bare Ivory over an unwashed bright frame measures about 1.1:1.
   */
  scrim?: number
  /**
   * Puts the left column on a card instead of setting it straight on the
   * photograph. The card supplies the contrast the wash otherwise would, so
   * the picture can run clean around it.
   */
  lockupCard?: boolean
  /**
   * Run on {@link PROMO_CONTAINER_WIDE} instead of the reading measure. For a
   * stage whose aside is a picture browser — the width then goes to the
   * pictures rather than to a longer line of text.
   */
  wide?: boolean
  id?: string
}) {
  const split = Boolean(aside)
  // No photograph, nothing to scrim — flat Ink already carries Ivory type.
  const wash = scrim ?? (image ? (split ? 0.7 : 0.3) : 0)

  return (
    <section
      {...(id ? { id } : {})}
      data-promo-stage=""
      className={`promo-on-dark relative w-full overflow-hidden bg-[color:var(--ink)] ${
        split
          ? 'flex items-center py-16 lg:py-20'
          : 'flex min-h-[68vh] items-end py-16 sm:min-h-[72vh] sm:py-20 lg:py-24'
      }`}
    >
      {image && <StageParallax />}
      {image && (
        <div
          className="absolute inset-0"
          style={{
            transform: 'translate3d(0, var(--stage-shift, 0px), 0) scale(1.08)',
            willChange: 'transform',
          }}
        >
          <Image src={image} alt={imageAlt ?? ''} fill sizes="100vw" className="object-cover" />
        </div>
      )}

      {/* A split stage needs a flat wash it can carry type on anywhere; a
          lockup-only stage spends its budget at the foot and keeps the
          picture open. `scrim={0}` opts out entirely — only safe when the
          content brings its own ground. See the note above. */}
      {wash > 0 && (
        <div className="absolute inset-0" style={{ background: `rgba(29, 27, 24, ${wash})` }} />
      )}
      {!split && wash > 0 && (
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(29,27,24,0.72) 0%, rgba(29,27,24,0.52) 32%, rgba(29,27,24,0.12) 68%, rgba(29,27,24,0) 100%)',
          }}
        />
      )}

      <div className={`${wide ? PROMO_CONTAINER_WIDE : PROMO_CONTAINER} relative z-10`}>
        {/* On a split stage the two columns start at the same line, so the
            grid sits level with the heading instead of below it. Dropping the
            aside under a full-width heading left the whole right half empty
            down to the fold and the cards landed well past it. */}
        <div
          className={
            split
              ? 'grid items-start gap-10 lg:grid-cols-[minmax(0,21rem)_minmax(0,1fr)] lg:gap-14 xl:grid-cols-[minmax(0,23rem)_minmax(0,1fr)]'
              : ''
          }
        >
          <PromoReveal
            {...(lockupCard ? { self: 'lift' as const } : {})}
            className={[
              split ? '' : 'max-w-[46ch]',
              // .promo-card is the shared material — see PromoStyles.
              lockupCard ? 'promo-card p-7 sm:p-9' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {/* Ivory, not Harvest Gold. Gold is 4.41:1 even under a 0.88 scrim —
                it never clears AA over a photograph. The guidelines sanction it
                as text on Ink, and a scrimmed photograph is not Ink. */}
            {eyebrow && (
              <p data-reveal="fade" className="promo-label mb-5 text-[color:var(--ivory)]/85">
                {eyebrow}
              </p>
            )}

            <h2 data-reveal="rise" className="promo-h2 text-[color:var(--ivory)]">
              {heading}
            </h2>

            {subheading && (
              <p data-reveal="rise" className="promo-lede mt-5 text-[color:var(--ivory)]/92">
                {subheading}
              </p>
            )}

            {children && (
              <div data-reveal="rise" className="mt-8">
                {children}
              </div>
            )}
          </PromoReveal>

          {aside && <PromoReveal delay={0.25}>{aside}</PromoReveal>}
        </div>
      </div>
    </section>
  )
}
