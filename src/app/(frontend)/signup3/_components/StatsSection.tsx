import { RuledGround, BTS_CONTAINER, SectionHead, Reveal } from '@/components/back-to-school'
import { stats, statsCopy } from './campaign'

/**
 * The trust strip — the one dark sheet in the run, so the page has a hinge
 * between the dealer section and the closing ask rather than three pearl
 * sections in a row.
 *
 * The figures are set in condensed caps with tabular numerals and revealed off
 * their own baseline; /signup2 counted them up on a timer, which needed a
 * scene-active hook and a scroll canvas to hang it on. On paper the number is
 * already the point — it doesn't need to perform arriving.
 *
 * The values are NOT headings: three <h3>s here would put "1927" into
 * screen-reader heading navigation (see the Accessibility notes in CLAUDE.md).
 */
export function StatsSection() {
  return (
    <section className="relative bg-kawai-black border-t border-kawai-pearl/10">
      <RuledGround tone="dark" animate />

      <div className={`relative ${BTS_CONTAINER} py-16 md:py-24`}>
        <SectionHead
          eyebrow={statsCopy.eyebrow}
          title={statsCopy.headline}
          aside={statsCopy.aside}
          tone="dark"
          className="mb-12 md:mb-16"
        />

        <ul className="grid sm:grid-cols-3 gap-y-12 sm:gap-y-0">
          {stats.map((stat, i) => (
            <li
              key={stat.label}
              className={
                i === 0
                  ? 'sm:pr-8 lg:pr-12'
                  : 'sm:px-8 lg:px-12 sm:border-l sm:border-kawai-pearl/15'
              }
            >
              <Reveal
                as="span"
                variant="line"
                delay={i * 0.09}
                className="bts-display bts-num block text-kawai-red-400 leading-none"
                style={{ fontSize: 'clamp(2.8rem, 6.5vw, 5rem)' }}
              >
                {stat.value}
              </Reveal>

              <Reveal
                variant="ruleX"
                delay={i * 0.09 + 0.12}
                className="h-px bg-kawai-pearl/15 my-5"
                aria-hidden
              />

              <Reveal
                as="span"
                delay={i * 0.09 + 0.18}
                className="bts-eyebrow block text-kawai-pearl/60"
              >
                {stat.label}
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
