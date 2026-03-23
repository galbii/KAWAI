import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Financial Assistance | Kawai Pianos',
  description:
    "Kawai's mission is simple — provide instruments of the highest caliber at cost levels that maximize the impact of limited institutional budgets.",
}

const helpCards = [
  {
    title: 'EPIC Endowment',
    description:
      'The Shigeru Kawai Endowment provides sponsored pricing for qualifying institutions through the EPIC program, reducing acquisition costs for elite grand pianos.',
  },
  {
    title: 'Long-Term Financing & Leasing',
    description:
      'Kawai has access to special-rate financing options that allow institutions to spread acquisition costs over time, making world-class instruments affordable within existing budget structures.',
  },
  {
    title: 'Customized Programs',
    description:
      "Every institution's situation is unique. Kawai's Institutional Team works with each partner to create a customized plan that incorporates the right combination of programs, pricing, and financing.",
  },
]

const programsTable = [
  {
    program: 'EPIC Partnership',
    bestFor: 'Institutions seeking elite Shigeru Kawai instruments',
    keyBenefit: 'Sponsored pricing via endowment',
  },
  {
    program: 'Loan Program',
    bestFor: 'Schools evaluating before committing',
    keyBenefit: 'No upfront cost, full-year trial',
  },
  {
    program: 'Fleet Management Study',
    bestFor: 'Institutions assessing current inventory',
    keyBenefit: 'Complimentary, no obligation',
  },
  {
    program: 'Long-term Financing',
    bestFor: 'Capital-constrained institutions',
    keyBenefit: 'Spread costs over time',
  },
  {
    program: 'Custom Program',
    bestFor: 'Complex needs, multiple locations',
    keyBenefit: 'Tailored combination of all programs',
  },
]

export default function FinancialAssistancePage() {
  return (
    <div className="min-h-screen bg-kawai-pearl">
      {/* Hero */}
      <section className="bg-kawai-black text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <p className="text-kawai-red text-sm uppercase tracking-widest mb-3">Institutions</p>
            <h1 className="text-4xl md:text-5xl font-[family-name:var(--font-brand-serif)] mb-4">
              Financial Assistance
            </h1>
            <p className="text-lg text-white/70 max-w-2xl">
              Kawai's mission is simple — provide instruments of the highest caliber at cost levels
              that maximize the impact of limited institutional budgets.
            </p>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-6">
              Our Mission
            </h2>
            <p className="text-kawai-charcoal leading-relaxed">
              Kawai's mission is simple. We strive to provide instruments of the highest caliber at
              cost levels that maximize the impact of limited institutional budgets. Through
              innovative programs like EPIC, financial assistance from the Shigeru Kawai Endowment,
              and long-term financing/leasing, the dream of owning a world-class piano fleet can
              become reality.
            </p>
          </div>
        </div>
      </section>

      {/* The Challenge */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-6">
              The Challenge Many Institutions Face
            </h2>
            <p className="text-kawai-charcoal leading-relaxed">
              Many schools have piano fleets that are worn well beyond their useful life and have
              insufficient funding to solve this problem. When budgets are already stretched thin,
              the thought of replacing an entire collection of pianos can be overwhelming. Kawai has
              access to special-rate financing and the flexibility to incorporate the individual
              benefits of any of our programs into a customized plan that can address any situation.
            </p>
          </div>
        </div>
      </section>

      {/* How Kawai Helps */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-10">
              How Kawai Helps
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {helpCards.map((card, index) => (
                <div
                  key={index}
                  className="bg-white border border-kawai-neutral rounded-lg p-6"
                >
                  <div className="w-8 h-1 bg-kawai-red rounded mb-4" />
                  <h3 className="text-lg font-semibold text-kawai-black mb-3">{card.title}</h3>
                  <p className="text-kawai-charcoal leading-relaxed text-sm">{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Making the Case for Funding */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-6">
              Making the Case for Funding
            </h2>
            <div className="space-y-4 text-kawai-charcoal leading-relaxed">
              <p>
                In addition to getting the most from the existing music budget, Kawai's Institutional
                Team is skilled at making the case for additional funding from either administration
                or development. If quality and stewardship are your priorities, Kawai can become one
                of your most valued partners.
              </p>
              <p>
                Kawai's Institutional Team understands the process of securing the funds to support
                your entire piano inventory needs. We can assist in presenting those needs to
                administration and donors in the proper light. Through these efforts, Kawai can be
                instrumental in expanding your available budget — allowing the acquisition of higher
                quality instruments in quantities that meet the true needs of your students and
                faculty.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Programs at a Glance — Table */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-8">
              Our Programs at a Glance
            </h2>
            <div className="overflow-x-auto rounded-lg border border-kawai-neutral">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-kawai-black text-white">
                    <th className="text-left px-5 py-4 font-semibold tracking-wide">Program</th>
                    <th className="text-left px-5 py-4 font-semibold tracking-wide">Best For</th>
                    <th className="text-left px-5 py-4 font-semibold tracking-wide">Key Benefit</th>
                  </tr>
                </thead>
                <tbody>
                  {programsTable.map((row, index) => (
                    <tr
                      key={index}
                      className={
                        index % 2 === 0
                          ? 'bg-white border-b border-kawai-neutral'
                          : 'bg-kawai-pearl border-b border-kawai-neutral'
                      }
                    >
                      <td className="px-5 py-4 font-medium text-kawai-black">{row.program}</td>
                      <td className="px-5 py-4 text-kawai-charcoal">{row.bestFor}</td>
                      <td className="px-5 py-4 text-kawai-charcoal">{row.keyBenefit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-kawai-black text-white rounded-xl p-8 md:p-10">
              <h2 className="text-2xl font-[family-name:var(--font-brand-serif)] mb-3">
                Contact Our Institutional Team
              </h2>
              <p className="text-white/70 leading-relaxed mb-6 max-w-2xl">
                Contact us to schedule a complimentary, no-obligation fleet study today — or to
                discuss how Kawai can help your institution acquire the instruments it deserves.
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
                <a
                  href="tel:800-421-2177"
                  className="inline-flex items-center gap-2 text-white font-semibold hover:text-kawai-red transition-colors"
                >
                  <span className="text-kawai-red">✆</span>
                  800-421-2177, ext. 6871
                </a>
                <span className="hidden sm:block text-white/30">|</span>
                <Link
                  href="/find-a-dealer"
                  className="inline-block bg-kawai-red text-white px-6 py-2.5 rounded hover:bg-kawai-red-700 transition-colors text-sm font-medium"
                >
                  Get in Touch
                </Link>
              </div>

              <div className="border-t border-white/20 pt-6">
                <p className="text-sm text-white/50 mb-3 font-medium uppercase tracking-wide">
                  Related Programs
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/institutions/epic-program"
                    className="text-sm text-kawai-red hover:underline"
                  >
                    EPIC Program →
                  </Link>
                  <Link
                    href="/institutions/loan-programs"
                    className="text-sm text-kawai-red hover:underline"
                  >
                    Loan Programs →
                  </Link>
                  <Link
                    href="/institutions/institutional-fleet"
                    className="text-sm text-kawai-red hover:underline"
                  >
                    Fleet Management →
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
