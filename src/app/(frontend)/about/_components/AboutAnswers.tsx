import Link from 'next/link'
import { Section, BrandCTA } from '@/components/brand'

/**
 * Crawlable, search-intent section that renders after the cinematic canvas (and
 * inside the reduced-motion fallback via page.tsx). The pinned-scroll experience
 * carries the brand story; this section captures the questions researchers
 * actually type — "is Kawai good", "where are Kawai pianos made", "who makes
 * Kawai" — as real, indexable HTML. The `aboutFaqs` array is the single source
 * of truth: it also drives the FAQPage JSON-LD in page.tsx.
 *
 * Manufacturing facts verified against kawaius.com/faq (grand-piano locations).
 */

export type AboutFaq = { q: string; a: string }

/** Plain-text answers for the FAQPage JSON-LD. The on-page copy below mirrors
 *  these (with inline links) so the markup always describes visible content. */
export const aboutFaqs: AboutFaq[] = [
  {
    q: 'Is Kawai a good piano brand?',
    a: 'Yes. Founded in 1927, Kawai is one of the world’s most established piano makers and the choice of conservatories, concert halls, and competition winners worldwide, with more than 61 international competition victories. Its flagship Shigeru Kawai concert grands serve as official instruments of the International Tchaikovsky Competition and are performed at the Chopin Competition.',
  },
  {
    q: 'Where are Kawai pianos made?',
    a: 'Most Kawai grand pianos — the entire GX series and the GL-30, GL-40, and GL-50 — are built at the Ryuyo Piano Factory near Hamamatsu, Japan. The compact GL-10 and GL-20 (US market) are built at Kawai’s Karawang, Indonesia facility, which was designed to replicate Ryuyo’s tooling and process. Every Shigeru Kawai concert instrument is hand-built in Japan by Master Piano Artisans.',
  },
  {
    q: 'Who makes Kawai pianos?',
    a: 'Kawai pianos are made by Kawai Musical Instruments Manufacturing Co., Ltd., founded in Hamamatsu, Japan in 1927 by inventor Koichi Kawai — the first person to design and build a complete piano action in Japan. Three generations of the Kawai family have led the company since.',
  },
  {
    q: 'Do Kawai pianos hold their value, and how long do they last?',
    a: 'Kawai instruments are built to perform for generations. The Millennium III action is made from ABS-Carbon composite that resists the swelling, shrinking, and wear that age traditional all-wood actions — independently tested at Cal Poly and unaffected by humidity — so a Kawai keeps its precise touch far longer, protecting both its playability and its resale value.',
  },
  {
    q: 'What makes Kawai different from other piano brands?',
    a: 'Kawai’s signature is engineering the piano action for consistency and endurance. Its Millennium III action pairs ABS-Carbon composite — the product of more than 50 years of materials research — with extended keysticks for faster repetition and a more stable touch, while Neotex key surfaces give a natural, moisture-wicking grip. It is a different philosophy from all-wood traditionalists: proven in the laboratory and felt under the fingers.',
  },
]

type MadeIn = { place: string; facility: string; models: string[] }

const MANUFACTURING: MadeIn[] = [
  {
    place: 'Made in Japan',
    facility: 'Ryuyo Piano Factory · Hamamatsu',
    models: ['Shigeru Kawai (SK series)', 'GX series grands', 'GL-30 · GL-40 · GL-50'],
  },
  {
    place: 'Made in Indonesia',
    facility: 'Karawang Facility',
    models: ['GL-10', 'GL-20 (US market)'],
  },
]

/** Inline text link tuned for the pearl answer section. */
function AnswerLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="font-medium text-kawai-red underline decoration-kawai-red/30 underline-offset-2 transition-colors hover:decoration-kawai-red"
    >
      {children}
    </Link>
  )
}

export default function AboutAnswers() {
  return (
    <Section
      tone="pearl"
      eyebrow="Straight Answers"
      title="The questions worth asking before you buy"
      intro="No marketing spin — the facts researchers look for about who makes Kawai pianos, where they’re built, and why they last."
      maxWidth="max-w-5xl"
    >
      {/* Manufacturing transparency — turn the highest-friction question into a trust asset */}
      <div className="mb-16 grid gap-5 sm:grid-cols-2">
        {MANUFACTURING.map((m) => (
          <div
            key={m.place}
            className="rounded-2xl border border-kawai-neutral/70 bg-white p-7 shadow-[0_1px_0_rgba(0,0,0,0.03)]"
          >
            <h3 className="font-[family-name:var(--font-brand-serif)] text-2xl font-light text-kawai-black">
              {m.place}
            </h3>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-kawai-charcoal/60">
              {m.facility}
            </p>
            <ul className="mt-5 space-y-2.5">
              {m.models.map((model) => (
                <li key={model} className="flex items-start gap-2.5 text-kawai-charcoal">
                  <span aria-hidden className="mt-2 block h-1 w-1 flex-shrink-0 rounded-full bg-kawai-red" />
                  <span>{model}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* FAQ — visible Q&A that the FAQPage schema mirrors */}
      <dl className="divide-y divide-kawai-neutral/70 border-t border-kawai-neutral/70">
        <div className="py-7">
          <dt>
            <h3 className="font-[family-name:var(--font-brand-serif)] text-xl font-light text-kawai-black md:text-2xl">
              Is Kawai a good piano brand?
            </h3>
          </dt>
          <dd className="mt-3 max-w-3xl leading-relaxed text-kawai-charcoal">
            Yes. Founded in 1927, Kawai is one of the world&rsquo;s most established piano makers and
            the choice of conservatories, concert halls, and competition winners worldwide, with more
            than <AnswerLink href="/the-winners-choice">61 international competition victories</AnswerLink>.
            Its flagship Shigeru Kawai concert grands serve as official instruments of the International
            Tchaikovsky Competition and are performed at the Chopin Competition.
          </dd>
        </div>

        <div className="py-7">
          <dt>
            <h3 className="font-[family-name:var(--font-brand-serif)] text-xl font-light text-kawai-black md:text-2xl">
              Where are Kawai pianos made?
            </h3>
          </dt>
          <dd className="mt-3 max-w-3xl leading-relaxed text-kawai-charcoal">
            Most Kawai grand pianos &mdash; the entire GX series and the GL-30, GL-40, and GL-50 &mdash;
            are built at the Ryuyo Piano Factory near Hamamatsu, Japan. The compact GL-10 and GL-20 (US
            market) are built at Kawai&rsquo;s Karawang, Indonesia facility, designed to replicate
            Ryuyo&rsquo;s tooling and process. Every Shigeru Kawai concert instrument is{' '}
            <AnswerLink href="/about/craftsmanship">hand-built in Japan by Master Piano Artisans</AnswerLink>.
          </dd>
        </div>

        <div className="py-7">
          <dt>
            <h3 className="font-[family-name:var(--font-brand-serif)] text-xl font-light text-kawai-black md:text-2xl">
              Who makes Kawai pianos?
            </h3>
          </dt>
          <dd className="mt-3 max-w-3xl leading-relaxed text-kawai-charcoal">
            Kawai pianos are made by Kawai Musical Instruments Manufacturing Co., Ltd., founded in
            Hamamatsu, Japan in 1927 by inventor{' '}
            <AnswerLink href="/about/heritage/koichi-kawai">Koichi Kawai</AnswerLink> &mdash; the first person
            to design and build a complete piano action in Japan. Three generations of the Kawai family
            have led the company since. <AnswerLink href="/about/heritage">Read the full history</AnswerLink>.
          </dd>
        </div>

        <div className="py-7">
          <dt>
            <h3 className="font-[family-name:var(--font-brand-serif)] text-xl font-light text-kawai-black md:text-2xl">
              Do Kawai pianos hold their value, and how long do they last?
            </h3>
          </dt>
          <dd className="mt-3 max-w-3xl leading-relaxed text-kawai-charcoal">
            Kawai instruments are built to perform for generations. The Millennium III action is made
            from <AnswerLink href="/technology/piano-action">ABS-Carbon composite</AnswerLink> that
            resists the swelling, shrinking, and wear that age traditional all-wood actions &mdash;
            independently tested at Cal Poly and unaffected by humidity &mdash; so a Kawai keeps its
            precise touch far longer, protecting both its playability and its resale value.
          </dd>
        </div>

        <div className="py-7">
          <dt>
            <h3 className="font-[family-name:var(--font-brand-serif)] text-xl font-light text-kawai-black md:text-2xl">
              What makes Kawai different from other piano brands?
            </h3>
          </dt>
          <dd className="mt-3 max-w-3xl leading-relaxed text-kawai-charcoal">
            Kawai&rsquo;s signature is engineering the piano action for consistency and endurance. Its{' '}
            <AnswerLink href="/technology">Millennium III action</AnswerLink> pairs ABS-Carbon composite
            &mdash; the product of more than 50 years of materials research &mdash; with extended
            keysticks for faster repetition and a more stable touch, while Neotex key surfaces give a
            natural, moisture-wicking grip. It is a different philosophy from all-wood traditionalists:
            proven in the laboratory and felt under the fingers.
          </dd>
        </div>
      </dl>

      <div className="mt-14 flex flex-wrap gap-4">
        <BrandCTA href="/about/heritage" variant="red">
          Our Heritage
        </BrandCTA>
        <BrandCTA href="/about/craftsmanship" variant="dark-outline">
          How Kawai Pianos Are Made
        </BrandCTA>
        <BrandCTA href="/technology" variant="dark-outline">
          The Technology
        </BrandCTA>
      </div>
    </Section>
  )
}
