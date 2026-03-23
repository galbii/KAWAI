import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Institutional Loan Programs | Kawai Pianos',
  description:
    'For more than twenty years, Kawai America has supported hundreds of schools of music through a unique partnership that puts world-class instruments in classrooms at no upfront cost.',
}

const programSteps = [
  {
    number: 1,
    title: 'The Loan Period',
    description:
      'Schools receive a curated selection of Kawai and Shigeru Kawai instruments for use across classrooms, practice rooms, and performance spaces. Loans typically last up to one year.',
  },
  {
    number: 2,
    title: 'Purchase Option',
    description:
      "At the end of the loan period, the institution has the option to purchase some or all of the instruments they've been using at favorable pricing.",
  },
  {
    number: 3,
    title: 'The Sale Event',
    description:
      'Remaining instruments that the institution does not purchase are then offered for sale to students, staff, and alumni of the school during a weekend event.',
  },
  {
    number: 4,
    title: 'Community Access',
    description:
      "Other schools, churches, and the public at large are also invited to participate in the sale, maximizing the instruments' impact on the broader community.",
  },
]

const benefits = [
  {
    title: 'No Upfront Cost',
    description:
      'Institutions receive top quality new instruments without a capital expenditure, allowing music programs to improve immediately regardless of budget constraints.',
  },
  {
    title: 'Risk-Free Evaluation',
    description:
      'Faculty and students have a full year to experience the instruments before any purchase decision is required — the best possible way to evaluate a piano.',
  },
  {
    title: 'Community Value',
    description:
      'The end-of-loan sale event creates goodwill with students, alumni, and the broader community, offering access to "like-new" Kawai instruments at a fraction of their original price.',
  },
]

export default function LoanProgramsPage() {
  return (
    <div className="min-h-screen bg-kawai-pearl">
      {/* Hero */}
      <section className="bg-kawai-black text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <p className="text-kawai-red text-sm uppercase tracking-widest mb-3">Institutions</p>
            <h1 className="text-4xl md:text-5xl font-[family-name:var(--font-brand-serif)] mb-4">
              Institutional Loan Programs
            </h1>
            <p className="text-lg text-white/70 max-w-2xl">
              For more than twenty years, Kawai America has supported hundreds of schools of music
              through a unique partnership that puts world-class instruments in classrooms at no
              upfront cost.
            </p>
          </div>
        </div>
      </section>

      {/* How the Loan Program Works */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-6">
              How the Loan Program Works
            </h2>
            <p className="text-kawai-charcoal leading-relaxed">
              For more than twenty years, Kawai America has supported hundreds of schools of music
              across North America through the Kawai Institutional Loan Program. In this unique
              partnership, schools are loaned a selection of pianos and digital pianos for use in
              the institution's classrooms and performance venues.
            </p>
          </div>
        </div>
      </section>

      {/* Program Structure — Timeline */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-10">
              Program Structure
            </h2>
            <div className="relative">
              {/* Vertical connecting line */}
              <div className="absolute left-5 top-10 bottom-10 w-px bg-kawai-neutral hidden md:block" />
              <div className="space-y-6">
                {programSteps.map((step, index) => (
                  <div
                    key={step.number}
                    className="relative flex gap-6 items-stretch"
                  >
                    {/* Number circle */}
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-kawai-red flex items-center justify-center z-10">
                      <span className="text-white font-bold text-sm">{step.number}</span>
                    </div>
                    {/* Card */}
                    <div className="flex-1 border-l-4 border-kawai-red bg-kawai-pearl rounded-lg p-6 mb-0">
                      <h3 className="text-lg font-semibold text-kawai-black mb-2">{step.title}</h3>
                      <p className="text-kawai-charcoal leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits for Institutions */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-10">
              Benefits for Institutions
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-white border border-kawai-neutral rounded-lg p-6"
                >
                  <div className="w-8 h-1 bg-kawai-red rounded mb-4" />
                  <h3 className="text-lg font-semibold text-kawai-black mb-3">{benefit.title}</h3>
                  <p className="text-kawai-charcoal leading-relaxed text-sm">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Dealer Partnership */}
      <section className="py-16 bg-kawai-black text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-[family-name:var(--font-brand-serif)] mb-6">
              Dealer Partnership
            </h2>
            <p className="text-white/80 leading-relaxed max-w-3xl">
              An authorized Kawai dealer oversees the sale event while providing delivery and
              after-sale service on all instruments. This ensures that institutions and buyers
              receive the same level of professional service that Kawai is known for throughout the
              loan period and after the sale.
            </p>
          </div>
        </div>
      </section>

      {/* Is Your School Eligible? */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-6">
              Is Your School Eligible?
            </h2>
            <p className="text-kawai-charcoal leading-relaxed mb-10">
              The Kawai Institutional Loan Program is available to accredited schools of music and
              music departments at colleges and universities across North America. To inquire about
              eligibility and availability, contact Kawai's Institutional Relations Team.
            </p>

            {/* CTA Card */}
            <div className="bg-white border border-kawai-neutral rounded-xl p-8">
              <h3 className="text-xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-3">
                Contact Our Institutional Relations Team
              </h3>
              <p className="text-kawai-charcoal mb-6 text-sm leading-relaxed">
                Reach out to learn more about loan program availability and how to get started for
                your institution.
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
                <a
                  href="tel:800-421-2177"
                  className="inline-flex items-center gap-2 text-kawai-black font-semibold hover:text-kawai-red transition-colors"
                >
                  <span className="text-kawai-red">✆</span>
                  800-421-2177 ext. 6871
                </a>
                <span className="hidden sm:block text-kawai-neutral">|</span>
                <Link
                  href="/find-a-dealer"
                  className="inline-block bg-kawai-red text-white px-6 py-2.5 rounded hover:bg-kawai-red-700 transition-colors text-sm font-medium"
                >
                  Get in Touch
                </Link>
              </div>

              <div className="border-t border-kawai-neutral pt-6">
                <p className="text-sm text-kawai-charcoal mb-3 font-medium">Related Programs</p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/institutions/epic-program"
                    className="text-sm text-kawai-red hover:underline"
                  >
                    EPIC Program →
                  </Link>
                  <Link
                    href="/institutions/financial-assistance"
                    className="text-sm text-kawai-red hover:underline"
                  >
                    Financial Assistance →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
