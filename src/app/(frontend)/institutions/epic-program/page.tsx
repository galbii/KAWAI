import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'The EPIC Partnership | Kawai Pianos',
  description:
    'The Elite Performing Instrument Collection — a unique institutional program that gives qualifying institutions access to elite Shigeru Kawai pianos at sponsored cost levels.',
}

const benefits = [
  {
    title: 'Sponsored Pricing',
    description:
      'Access elite Shigeru Kawai and Kawai grand pianos at specially sponsored cost levels made possible by the Shigeru Kawai Endowment.',
  },
  {
    title: 'Expert Guidance',
    description:
      "Kawai's Institutional Relations Team provides the highest level of advice and support from initial selection through installation and beyond.",
  },
  {
    title: 'Institutional Credibility',
    description:
      'EPIC partner status signals to students, faculty, and donors that your institution is committed to providing world-class instruments for music education.',
  },
]

const epicPartners = [
  'Chapman University',
  'Colburn Conservatory',
  'Columbia College Chicago',
  'Conservatoire de Musique',
  'The Crown College',
  'Interlochen Center for the Arts',
  'Jacksonville University',
  'LaGrange College',
  'Reinhardt University',
  'Shorter University',
  'University of Southern Mississippi',
  'University of West Georgia',
  'Wayne State University',
  'Wheaton College',
]

export default function EpicProgramPage() {
  return (
    <div className="min-h-screen bg-kawai-pearl">
      {/* Hero */}
      <section className="bg-kawai-black text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <p className="text-kawai-red text-sm uppercase tracking-widest mb-3">Institutions</p>
            <h1 className="text-4xl md:text-5xl font-[family-name:var(--font-brand-serif)] mb-4">
              The EPIC Partnership
            </h1>
            <p className="text-lg text-white/70 max-w-2xl">
              The Elite Performing Instrument Collection — a unique institutional program that gives
              qualifying institutions access to elite Shigeru Kawai pianos at sponsored cost levels.
            </p>
          </div>
        </div>
      </section>

      {/* About the EPIC Program */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-5">
              About the EPIC Program
            </h2>
            <div className="space-y-4 text-kawai-charcoal leading-relaxed text-base md:text-lg">
              <p>
                The Elite Performing Instrument Collection (EPIC) program, also known as The EPIC
                Partnership, is a unique institutional program made possible by the Shigeru Kawai
                Endowment. Institutions that qualify will be given the opportunity to acquire an elite
                assortment of fine Kawai and Shigeru Kawai pianos at sponsored cost levels.
              </p>
              <p>
                The elite Shigeru Kawai grand pianos are acclaimed worldwide for their quintessential
                tone and performance. Becoming a Kawai EPIC partner sends a message to the
                institution&apos;s current and potential students that the institution is serious about
                its music program and is making an investment that will be of great benefit to them.
              </p>
              <p>
                EPIC Partners also receive the highest level of advice and support from Kawai&apos;s
                Institutional Relations Team, both before and after the selection and installation of
                EPIC pianos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Program Benefits */}
      <section className="py-14 border-t border-kawai-neutral">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-8">
              Program Benefits
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {benefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="bg-white rounded-lg p-6 border border-kawai-neutral"
                >
                  <h3 className="text-lg font-semibold text-kawai-black mb-3">{benefit.title}</h3>
                  <p className="text-kawai-charcoal text-sm leading-relaxed">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Current EPIC Partners */}
      <section className="py-14 border-t border-kawai-neutral">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-8">
              Current EPIC Partners
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {epicPartners.map((partner) => (
                <div
                  key={partner}
                  className="bg-kawai-pearl border border-kawai-neutral rounded-lg p-4 text-center"
                >
                  <p className="text-kawai-black text-sm font-medium leading-snug">{partner}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="py-14 border-t border-kawai-neutral">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-5">
              Is Your Institution Eligible?
            </h2>
            <p className="text-kawai-charcoal leading-relaxed text-base md:text-lg mb-10">
              The EPIC program is designed for institutions with serious music programs seeking to
              elevate their piano fleet to the highest level. If your institution values excellence in
              music education and is ready to make a meaningful investment in its students, we invite
              you to explore EPIC partnership.
            </p>

            {/* CTA */}
            <div className="bg-kawai-black rounded-xl p-8 text-white text-center">
              <h3 className="text-xl font-[family-name:var(--font-brand-serif)] mb-3">
                Contact our Institutional Relations Team
              </h3>
              <p className="text-white/70 text-sm mb-6">
                Reach us at{' '}
                <a
                  href="tel:+18004212177"
                  className="text-kawai-red hover:text-white transition-colors font-medium"
                >
                  800-421-2177 ext. 6871
                </a>{' '}
                or explore our financial assistance options below.
              </p>
              <Link
                href="/institutions/financial-assistance"
                className="inline-block bg-kawai-red text-white px-8 py-3 rounded-md text-sm font-semibold uppercase tracking-wider hover:bg-kawai-red-700 transition-colors"
              >
                Explore Financial Assistance
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
