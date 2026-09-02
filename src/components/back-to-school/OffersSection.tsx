import { DEADLINE_LONG } from './campaign'
import { RuledGround, BTS_CONTAINER } from './RuledGround'
import { SectionHead } from './SectionHead'
import { Reveal } from './Choreography'

/**
 * The three offers, given room.
 *
 * The hero rail states them in four words each — enough to be the argument for
 * the booking button, not enough to answer "how does that actually work?".
 * This section is where each one gets its sentence: what comes off, when it
 * comes off, and what a visitor has to bring for it.
 *
 * The figures are set at display scale because they are the content — a family
 * scanning the page should be able to read the whole offer off the numbers.
 */
const OFFER_DETAIL = [
  {
    value: '0%',
    heading: 'Financing for 36 months',
    body: 'Split any piano in the program over three years with no interest. Subject to credit approval — ask us to run it while you’re in the showroom and you’ll know before you leave.',
  },
  {
    value: '$4,500',
    prefix: 'Up to',
    heading: 'Off, instantly',
    body: 'The rebate comes off the price at the counter on the day you buy — no mail-in form, no waiting on a check. Amounts vary by model; every one of them is in the ledger below.',
  },
  {
    value: '+$500',
    heading: 'When you trade in, trade up',
    body: 'Trade in the piano you already have and we’ll beat any written independent appraisal by $500 — applied on top of the rebate, not instead of it.',
  },
] as const

export function OffersSection() {
  return (
    <section className="relative bg-kawai-pearl border-t border-kawai-black/10">
      <RuledGround animate />

      <div className={`relative ${BTS_CONTAINER} py-16 md:py-24`}>
        {/* No eyebrow and no aside: the title says what this is, and the only
            other thing worth saying here is the deadline — so the deadline gets
            the emphasised line under it instead of a footnote on the rule. */}
        <SectionHead
          title="Three ways to save"
          subhead={`Ends ${DEADLINE_LONG}`}
          className="mb-12 md:mb-16"
        />

        <ul className="grid md:grid-cols-3 gap-y-14 md:gap-y-0">
          {OFFER_DETAIL.map((offer, i) => (
            <li
              key={offer.heading}
              className={i === 0 ? 'md:pr-10 lg:pr-14' : 'md:px-10 lg:px-14 md:border-l md:border-kawai-black/12'}
            >
              {'prefix' in offer && offer.prefix ? (
                <Reveal
                  as="span"
                  delay={i * 0.09}
                  className="bts-eyebrow block text-kawai-charcoal/50 mb-2"
                >
                  {offer.prefix}
                </Reveal>
              ) : null}

              <Reveal
                as="span"
                variant="line"
                delay={i * 0.09 + 0.04}
                className="bts-display block text-kawai-red leading-none"
                style={{ fontSize: 'clamp(3rem, 7vw, 5.6rem)' }}
              >
                {offer.value}
              </Reveal>

              <Reveal
                variant="ruleX"
                delay={i * 0.09 + 0.14}
                className="h-px bg-kawai-black/15 my-6"
                aria-hidden
              />

              <h3 className="bts-display text-kawai-black mb-4" style={{ fontSize: 'clamp(1.15rem, 2vw, 1.5rem)' }}>
                <Reveal as="span" delay={i * 0.09 + 0.18} className="block">
                  {offer.heading}
                </Reveal>
              </h3>

              <Reveal as="p" delay={i * 0.09 + 0.24} className="text-kawai-charcoal/70 text-[0.98rem] leading-relaxed">
                {offer.body}
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
