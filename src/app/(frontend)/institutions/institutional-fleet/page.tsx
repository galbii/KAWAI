import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Institutional Fleet Management | Kawai Pianos',
  description:
    'A comprehensive analysis of your piano fleet — helping institutions make informed decisions about maintenance, service, and strategic replacement.',
}

const fleetSteps = [
  {
    number: 1,
    title: 'Instrument Inventory',
    description:
      'Our team documents every piano in your collection: make, model, age, serial number, and location.',
  },
  {
    number: 2,
    title: 'Condition Assessment',
    description:
      'Each instrument is evaluated for physical condition, including case integrity, string condition, soundboard health, and action regulation.',
  },
  {
    number: 3,
    title: 'Usage Analysis',
    description:
      "We assess how each instrument is being used — practice room, classroom, ensemble space, performance venue — and whether the current placement matches the instrument's capability.",
  },
  {
    number: 4,
    title: 'Service History Review',
    description:
      "We examine maintenance records to understand each piano's service history and identify instruments with recurring issues.",
  },
  {
    number: 5,
    title: 'Environment Evaluation',
    description:
      'We assess the environment in which each piano lives, including humidity levels, temperature stability, and exposure to sunlight or HVAC airflow that can accelerate deterioration.',
  },
]

const reportItems = [
  'Instruments suitable for continued use with standard maintenance',
  'Instruments requiring immediate technical service',
  'Instruments past their useful educational life and candidates for replacement',
  'Recommendations for climate control improvements',
  'A prioritized replacement plan with budget projections',
]

const stats = [
  {
    stat: '1',
    label: "A piano past its useful life undermines the student's ability to develop proper technique and tone",
  },
  {
    stat: '2',
    label: 'Regular fleet assessment prevents costly emergency repairs by identifying issues early',
  },
  {
    stat: '3',
    label: 'Strategic replacement planning allows institutions to spread capital expenditures across budget cycles',
  },
]

export default function InstitutionalFleetPage() {
  return (
    <div className="min-h-screen bg-kawai-pearl">
      {/* Hero */}
      <section className="bg-kawai-black text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <p className="text-kawai-red text-sm uppercase tracking-widest mb-3">Institutions</p>
            <h1 className="text-4xl md:text-5xl font-[family-name:var(--font-brand-serif)] mb-4">
              Institutional Fleet Management
            </h1>
            <p className="text-lg text-white/70 max-w-2xl">
              A comprehensive analysis of your piano fleet — helping institutions make informed
              decisions about maintenance, service, and strategic replacement.
            </p>
          </div>
        </div>
      </section>

      {/* The Fleet Study */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-6">
              The Fleet Study
            </h2>
            <div className="space-y-4 text-kawai-charcoal leading-relaxed">
              <p>
                One of the many services Kawai provides for institutions is a comprehensive analysis
                of the piano fleet. Pianos are the basic equipment on which most music education is
                built. Like the equipment in other departments, pianos have a limited lifespan. While
                these instruments may appear to be in satisfactory condition, closer inspection often
                reveals equipment which is past its useful life.
              </p>
              <p>
                Kawai believes that every institution deserves exceptional instruments for music
                education. During the first step of our Fleet Study, our Institutional Relations Team
                conducts a thorough analysis of each instrument noting age, physical condition, use,
                service history, and even the environment in which the piano lives.
              </p>
              <p>
                From this data Kawai prepares an in-depth report with recommendations regarding
                climate control, technical service, and replacement if warranted. With this report,
                institutional administrators have the knowledge to take appropriate action regarding
                their piano fleet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What the Fleet Study Covers */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-10">
              What the Fleet Study Covers
            </h2>
            <div className="space-y-8">
              {fleetSteps.map((step) => (
                <div key={step.number} className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-kawai-red flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{step.number}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-kawai-black mb-1">{step.title}</h3>
                    <p className="text-kawai-charcoal leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The Fleet Report */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-6">
              The Fleet Report
            </h2>
            <p className="text-kawai-charcoal leading-relaxed mb-6">
              After the on-site assessment, Kawai prepares a comprehensive report with specific
              recommendations for each instrument:
            </p>
            <ul className="space-y-3">
              {reportItems.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 mt-1.5 w-2 h-2 rounded-full bg-kawai-red" />
                  <span className="text-kawai-charcoal leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Why Fleet Management Matters */}
      <section className="py-16 bg-kawai-black text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-[family-name:var(--font-brand-serif)] mb-10">
              Why Fleet Management Matters
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {stats.map((item, index) => (
                <div key={index} className="border-t border-white/20 pt-6">
                  <p className="text-white/80 leading-relaxed">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white border border-kawai-neutral rounded-xl p-8 md:p-10">
              <h2 className="text-2xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-3">
                Schedule a Complimentary Fleet Study
              </h2>
              <p className="text-kawai-charcoal mb-6 leading-relaxed">
                Contact our Institutional Relations Team to arrange a no-obligation fleet assessment
                for your institution.
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
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
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
