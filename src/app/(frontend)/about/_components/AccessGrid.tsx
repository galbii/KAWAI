import Reveal from './Reveal'
import SectionEyebrow from './SectionEyebrow'
import ArrowLink from './ArrowLink'

const cards = [
  {
    index: '01',
    title: 'Awards & Recognition',
    body: 'More than 50 international awards for product design and service excellence.',
    links: [
      { href: '/company/awards', label: 'View our awards', tone: 'red' as const },
      { href: '/the-winners-choice', label: "The Winner's Choice", tone: 'muted' as const },
    ],
  },
  {
    index: '02',
    title: 'Institutions & Owners',
    body: 'Universities, conservatories, and concert halls worldwide perform on Kawai.',
    links: [
      { href: '/distinguished-owners', label: 'Distinguished owners', tone: 'red' as const },
      { href: '/institutions/epic-program', label: 'The EPIC program', tone: 'muted' as const },
    ],
  },
]

export default function AccessGrid() {
  return (
    <section className="bg-kawai-pearl py-20 md:py-28">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <SectionEyebrow>Explore</SectionEyebrow>
            <h2 className="mt-4 mb-12 font-[family-name:var(--font-brand-serif)] text-[clamp(2rem,5vw,3.25rem)] leading-tight text-kawai-black">
              Go Deeper
            </h2>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-2">
            {cards.map((card, index) => (
              <Reveal key={card.title} delay={index * 0.12}>
                <article className="group relative h-full overflow-hidden rounded-lg border border-kawai-neutral bg-white p-9 transition-all duration-300 hover:-translate-y-1 hover:border-kawai-gold hover:shadow-[0_24px_60px_-28px_rgba(0,0,0,0.3)]">
                  <span className="absolute left-0 top-0 h-1 w-16 bg-kawai-gold transition-all duration-300 group-hover:w-full" />
                  <span
                    aria-hidden
                    className="absolute right-7 top-7 font-[family-name:var(--font-brand-serif)] text-sm text-kawai-neutral"
                  >
                    {card.index}
                  </span>
                  <h3 className="mb-3 font-[family-name:var(--font-brand-serif)] text-2xl text-kawai-black">
                    {card.title}
                  </h3>
                  <p className="mb-6 max-w-sm text-sm leading-relaxed text-kawai-charcoal">
                    {card.body}
                  </p>
                  <div className="flex flex-col gap-2.5">
                    {card.links.map((link) => (
                      <ArrowLink key={link.href} href={link.href} tone={link.tone}>
                        {link.label}
                      </ArrowLink>
                    ))}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
