import { RuledGround, BTS_CONTAINER } from './RuledGround'
import { SectionHead } from './SectionHead'
import { Reveal } from './Choreography'

interface HowItWorksStripProps {
  phone?: string | null
}

/**
 * Trade-in mechanics as a three-step strip. Replaces the shared trade-in
 * HowItWorks on this page: that component is a different visual language
 * (rounded number chips, 1,200px for three sentences) and its step copy asks
 * visitors to "bring your trade-in invitation" — a spring-campaign artifact
 * that doesn't exist in this program.
 *
 * These really are a sequence — call, book, claim — so the numerals earn their
 * place. They are set outlined at display scale: loud enough to carry the
 * order at a glance without competing with the step headings.
 */
const STEPS = [
  {
    number: '01',
    heading: 'Estimate the value',
    body: 'Call us — we’ll give you a number based on the age, condition, and market value of your current piano.',
  },
  {
    number: '02',
    heading: 'Book your visit',
    body: 'Pick a time during the program window. If you have a written independent appraisal, bring it; if not, we can help you arrange one.',
  },
  {
    number: '03',
    heading: 'Claim it at the counter',
    body: 'We beat any independent appraisal by $500, applied to your new Kawai — on top of the rebate and 0% financing.',
  },
] as const

export function HowItWorksStrip({ phone }: HowItWorksStripProps) {
  return (
    <section className="relative bg-kawai-pearl border-t border-kawai-black/10">
      <RuledGround animate />

      <div className={`relative ${BTS_CONTAINER} py-16 md:py-24`}>
        <SectionHead
          eyebrow="How the trade-in works"
          title="Three steps"
          aside="Start with a phone call — most of it is settled before you drive over."
          className="mb-12"
        />

        <ol className="grid md:grid-cols-3 gap-y-12 md:gap-y-0">
          {STEPS.map(({ number, heading, body }, i) => (
            <li
              key={number}
              className={i === 0 ? 'md:pr-10' : 'md:px-10 md:border-l md:border-kawai-black/12'}
            >
              <Reveal
                delay={i * 0.08}
                className="bts-display bts-outline text-kawai-red leading-none mb-5"
                style={{ fontSize: 'clamp(2.6rem, 6vw, 4.4rem)' }}
                aria-hidden
              >
                {number}
              </Reveal>

              <h3 className="bts-display text-kawai-black mb-3" style={{ fontSize: 'clamp(1.25rem, 2.1vw, 1.6rem)' }}>
                <Reveal as="span" variant="line" delay={i * 0.08 + 0.06} className="block">
                  {heading}
                </Reveal>
              </h3>

              <Reveal as="p" delay={i * 0.08 + 0.14} className="text-kawai-charcoal/70 text-[0.98rem] leading-relaxed">
                {body}
              </Reveal>
            </li>
          ))}
        </ol>

        {phone && (
          <Reveal as="p" delay={0.3} className="mt-12 text-kawai-charcoal/60 text-sm">
            Questions about a specific piano?{' '}
            <a
              href={`tel:${phone.replace(/\D/g, '')}`}
              className="text-kawai-black underline underline-offset-4 decoration-kawai-black/25 hover:text-kawai-red hover:decoration-kawai-red transition-colors"
            >
              Call {phone}
            </a>
          </Reveal>
        )}
      </div>
    </section>
  )
}
