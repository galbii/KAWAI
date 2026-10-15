import Image from 'next/image'
import { PROMO_CONTAINER, PromoCtaSecondary } from '@/components/fall-promo'
import { PromoButton } from './PromoUI'
import { lessons, SECTION } from './campaign'

/**
 * Three months of free lessons on Skoove and Piano Marvel.
 *
 * The page's one section that is not an offer: a benefit that comes with every
 * new Kawai, whichever offer brought the visitor here. It sits between the last
 * offer and the dealer close for that reason — the offers are done, and this is
 * the last thing worth knowing before the ask.
 *
 * ── Why this is not a `PromoStage` ────────────────────────────────────────
 * The art is a wide banner (about 3.9:1) with both partner logos set into its
 * right half. A stage covers its section with the picture, and the section is
 * as tall as its copy — several times taller than the banner — so a cover crop
 * cuts at least one logo in half at almost every width. Here the banner runs
 * full-bleed at its own proportions and the copy sits under it on Ink, so the
 * logos are always whole and nothing is laid over them.
 *
 * Deliberately still: no reveal, no parallax.
 */
export function LearningPartnersBlock() {
  return (
    <section id={SECTION.lessons} className="promo-on-dark bg-[color:var(--ink)]">
      <div className="relative aspect-[2506/649] w-full">
        <Image
          src={lessons.stageImage}
          alt={lessons.stageImageAlt}
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div className={`${PROMO_CONTAINER} py-14 sm:py-16 lg:py-20`}>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <p className="promo-label mb-5 text-[color:var(--ivory)]/85">{lessons.eyebrow}</p>
            <h2 className="promo-h2 text-[color:var(--ivory)]">{lessons.heading}</h2>
            <p className="promo-lede mt-5 text-[color:var(--ivory)]/92">{lessons.standfirst}</p>
          </div>

          <div className="lg:border-l lg:border-[color:var(--rule)] lg:pl-16 lg:pt-2">
            <p className="promo-body text-[1rem] font-medium leading-snug text-[color:var(--ivory)]">
              {lessons.redeemNote}
            </p>

            {/* Registering the piano is how the lessons are claimed, so it gets
                a button of its own beside the page's lead CTA. */}
            <div className="mt-7 flex flex-wrap gap-3">
              <PromoButton />
              <PromoCtaSecondary href={lessons.redeemHref}>{lessons.redeemLabel}</PromoCtaSecondary>
            </div>

            <p className="promo-body mt-9 max-w-[46ch] text-[0.72rem] leading-relaxed text-[color:var(--ivory)]/80">
              {lessons.disclaimer}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
