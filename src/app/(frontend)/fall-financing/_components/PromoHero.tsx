import { Q4_CONTAINER } from './PromoStyles'
import { PromoButton } from './PromoUI'
import { hero } from './campaign'

/**
 * The hero is an index, not a poster.
 *
 * The page carries three unrelated offers covering three different parts of the
 * range, and a shopper wants exactly one of them. A single display figure would
 * have to pick a winner and send the other two-thirds of readers scrolling; a
 * row of three tells everyone in one glance which one is theirs and hands them
 * a way in. The content is a directory, so the hero is a directory.
 *
 * No photograph. Three pianos cannot share one image, and a stock interior
 * behind the type would be decoration standing where information should be.
 * The figures are the picture.
 *
 * Server-rendered — the headline and all three offers are in the initial HTML.
 * The one animation is the page-load sequence, which runs once; the rows are
 * legible without it and `prefers-reduced-motion` skips it entirely.
 */
export function PromoHero() {
  return (
    <section className="border-b border-[color:var(--rule)] bg-[color:var(--paper)]">
      <div className={`${Q4_CONTAINER} pb-14 pt-24 md:pb-20 md:pt-32`}>
        <p
          className="q4-enter text-[0.9rem] text-[color:var(--muted-dim)]"
          style={{ '--q4-i': 0 } as React.CSSProperties}
        >
          {hero.kicker}
        </p>

        <h1
          className="q4-enter q4-display mt-4 max-w-[16ch] text-[color:var(--ink)]"
          style={{ fontSize: 'clamp(2.5rem, 6.4vw, 5.2rem)', '--q4-i': 1 } as React.CSSProperties}
        >
          {hero.headline}
        </h1>

        <p
          className="q4-enter q4-lede mt-6 text-[color:var(--muted)]"
          style={{ '--q4-i': 2 } as React.CSSProperties}
        >
          {hero.standfirst}
        </p>

        {/* The index. Each row is the whole offer in one line: what you save,
            what it is, what it covers — then the way in. */}
        <ul className="mt-14 border-t border-[color:var(--rule)]">
          {hero.index.map((offer, i) => (
            <li
              key={offer.href}
              className="q4-enter border-b border-[color:var(--rule)]"
              style={{ '--q4-i': 3 + i } as React.CSSProperties}
            >
              <a
                href={offer.href}
                className="q4-focus group grid grid-cols-[minmax(5.5rem,auto)_1fr] items-baseline gap-x-6 gap-y-1 py-6 transition-colors duration-200 hover:bg-[color:var(--ink)]/[0.03] md:grid-cols-[minmax(9rem,auto)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-10 md:py-7"
              >
                {/* The only red on the page is money. */}
                <span className="q4-num block leading-[0.9] text-[color:var(--money)]" style={{ fontSize: 'clamp(2.1rem, 4.4vw, 3.4rem)' }}>
                  {offer.figure}
                  <span className="mt-1.5 block text-[0.72rem] font-normal tracking-normal text-[color:var(--muted-dim)]">
                    {offer.figureNote}
                  </span>
                </span>

                <span className="text-[1.08rem] font-medium leading-snug text-[color:var(--ink)] md:text-[1.2rem]">
                  {offer.title}
                </span>

                <span className="col-start-2 text-[0.92rem] leading-snug text-[color:var(--muted)] md:col-start-3 md:text-right">
                  {offer.covers}
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div
          className="q4-enter mt-12 flex flex-wrap items-center gap-4"
          style={{ '--q4-i': 6 } as React.CSSProperties}
        >
          <PromoButton>{hero.cta}</PromoButton>
        </div>
      </div>
    </section>
  )
}
