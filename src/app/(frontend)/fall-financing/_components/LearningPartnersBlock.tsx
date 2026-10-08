import Link from 'next/link'
import { PromoStage } from '@/components/fall-promo'
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
 * A lockup card on the left and one card per partner on the right, all in the
 * shared `.promo-card` material. Every surface carries its own contrast, so the
 * stage runs `scrim={0}` and the photograph stays clean around them.
 *
 * Partner names are `h3` under the stage's `h2`. The partner links leave the
 * site, so each says so in its accessible name.
 */
export function LearningPartnersBlock() {
  return (
    <PromoStage
      id={SECTION.lessons}
      image={lessons.stageImage}
      imageAlt={lessons.stageImageAlt}
      eyebrow={lessons.eyebrow}
      heading={lessons.heading}
      subheading={lessons.standfirst}
      scrim={0}
      lockupCard
      aside={
        <ul className="grid gap-4 sm:grid-cols-2 lg:gap-5">
          {lessons.partners.map((partner) => (
            <li key={partner.name} data-reveal="slide" className="promo-card flex flex-col p-7 sm:p-8">
              <p className="promo-label text-[color:var(--ivory)]/80">{partner.kind}</p>

              <h3 className="promo-h2 mt-3 text-[1.85rem] leading-tight text-[color:var(--ivory)] sm:text-[2.1rem]">
                {partner.name}
              </h3>

              <p className="promo-body mb-8 mt-4 text-[0.95rem] leading-relaxed text-[color:var(--ivory)]/85">
                {partner.body}
              </p>

              <div className="mt-auto flex items-end justify-between gap-4 border-t border-[color:var(--rule)] pt-6">
                <p data-reveal="pop" data-reveal-delay="0.35" className="flex items-baseline gap-2">
                  <span
                    className="promo-num leading-none text-[color:var(--money)]"
                    style={{ fontSize: 'clamp(2.6rem, 5vw, 3.25rem)' }}
                  >
                    {lessons.term}
                  </span>
                  <span className="promo-label text-[color:var(--ivory)]/85">{lessons.termLabel}</span>
                </p>

                <a
                  href={partner.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit ${partner.name} (opens in a new tab)`}
                  className="promo-focus promo-body group inline-flex items-center gap-1.5 whitespace-nowrap text-[0.85rem] font-medium text-[color:var(--ivory)]/85 transition-colors hover:text-[color:var(--ivory)]"
                >
                  Visit
                  <svg
                    className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7M8 7h9v9" />
                  </svg>
                </a>
              </div>
            </li>
          ))}
        </ul>
      }
    >
      <p className="promo-body text-[1rem] font-medium leading-snug text-[color:var(--ivory)]">
        {lessons.redeemNote}{' '}
        <Link
          href={lessons.redeemHref}
          className="promo-focus underline decoration-[color:var(--ivory)]/40 underline-offset-4 transition-colors hover:decoration-[color:var(--ivory)]"
        >
          {lessons.redeemLabel}
        </Link>
      </p>

      <div className="mt-7">
        <PromoButton />
      </div>

      <p className="promo-body mt-9 max-w-[46ch] text-[0.72rem] leading-relaxed text-[color:var(--ivory)]/80">
        {lessons.disclaimer}
      </p>
    </PromoStage>
  )
}
