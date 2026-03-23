import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'ABS — The Truth | Kawai Pianos',
  description:
    'How Kawai solved the fundamental problem of wood in piano actions — and why composite materials represent a generational leap in piano performance.',
}

const woodSymptoms = [
  {
    title: 'Susceptibility to Breakage',
    description:
      'Wood components subjected to the continuous high-stress cycling of piano playing are vulnerable to cracking and fracture, leading to costly repairs.',
  },
  {
    title: 'Shrinking and Swelling',
    description:
      'Changes in humidity cause wood parts to expand and contract, altering the precise geometry of the action and degrading both tone and touch consistency.',
  },
  {
    title: 'Ongoing Maintenance',
    description:
      'The instability of wood forces regular adjustments by technicians. Without continuous service, a wooden action will drift out of regulation, compromising performance.',
  },
]

const evidencePoints = [
  'ABS-Carbon parts are over 50% stronger than conventional wooden parts',
  'Carbon fiber infusion increased strength by 90% over standard ABS-Styran',
  'The Millennium III Action is approximately 25% faster than a conventional wooden action',
  'Composite parts show no dimensional change after decades of temperature and humidity cycling',
]

export default function AbsTruthPage() {
  return (
    <div className="min-h-screen bg-kawai-pearl">
      {/* Hero */}
      <section className="bg-kawai-black text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <p className="text-kawai-red text-sm uppercase tracking-widest mb-3">Technology</p>
            <h1 className="text-4xl md:text-5xl font-[family-name:var(--font-brand-serif)] mb-4">
              ABS — The Truth
            </h1>
            <p className="text-lg text-white/70 max-w-2xl">
              How Kawai solved the fundamental problem of wood in piano actions — and why composite
              materials represent a generational leap in piano performance.
            </p>
          </div>
        </div>
      </section>

      {/* Section: Every Innovative Idea Began with a Problem */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-6">
              Every Innovative Idea Began with a Problem
            </h2>
            <p className="text-kawai-charcoal leading-relaxed mb-6">
              For Kawai piano craftsmen in the 1960s, the problem centered around wood. While
              certainly ideal for all of the important sound-producing elements of a piano, wood was
              woefully inadequate for many of the critical components found in a piano&apos;s
              action.
            </p>
            <p className="text-kawai-charcoal leading-relaxed mb-6">
              First, wood was susceptible to breakage when subjected to continual high stress. But
              far more troublesome was wood&apos;s tendency to shrink and swell dramatically with
              changes in climate. Lacking alternatives, piano makers simply accepted the shortcoming
              of wood, forcing piano technicians to &ldquo;treat the symptoms&rdquo; by replacing
              failed wood parts and making continual adjustments.
            </p>
            <p className="text-kawai-charcoal leading-relaxed">
              Kawai craftsmen remained troubled — they knew that these inherent weaknesses of wood
              posed a serious threat to the quality and character of a piano&apos;s touch and tone.
            </p>
          </div>
        </div>
      </section>

      {/* Section: The Symptoms of Wood in Piano Actions */}
      <section className="py-16 bg-kawai-pearl">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-8">
              The Symptoms of Wood in Piano Actions
            </h2>
            <div className="space-y-4">
              {woodSymptoms.map((symptom) => (
                <div
                  key={symptom.title}
                  className="bg-white border-l-4 border-kawai-red rounded-r-lg p-6"
                >
                  <h3 className="text-lg font-semibold text-kawai-black mb-2">{symptom.title}</h3>
                  <p className="text-kawai-charcoal leading-relaxed">{symptom.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section: The Solution — ABS Composite Materials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-6">
              The Solution — ABS Composite Materials
            </h2>
            <p className="text-kawai-charcoal leading-relaxed mb-6">
              Kawai&apos;s solution was revolutionary: replace the mechanical components of the
              piano action with ABS (Acrylonitrile Butadiene Styrene) composite materials. Unlike
              wood, ABS is virtually impervious to changes in humidity — it doesn&apos;t shrink,
              swell, or warp. This fundamental stability means that a Kawai piano action maintains
              its precise regulation year after year, regardless of climate.
            </p>
            <p className="text-kawai-charcoal leading-relaxed">
              First introduced in 1970, Kawai&apos;s ABS composite parts represented the fourth
              major evolution of the piano action. Over decades of use in homes, concert halls, and
              institutions worldwide, ABS parts have proven their superiority through performance —
              not just laboratory testing.
            </p>
          </div>
        </div>
      </section>

      {/* Section: The Evidence */}
      <section className="py-16 bg-kawai-pearl">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-6">
              The Evidence
            </h2>
            <p className="text-kawai-charcoal leading-relaxed mb-6">
              Kawai&apos;s composite materials have been subjected to rigorous independent testing:
            </p>
            <ul className="space-y-3 mb-8">
              {evidencePoints.map((point) => (
                <li key={point} className="flex gap-3">
                  <span className="text-kawai-red mt-1 shrink-0">→</span>
                  <span className="text-kawai-charcoal">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Section: ABS-Carbon — The Next Generation */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-6">
              ABS-Carbon — The Next Generation
            </h2>
            <p className="text-kawai-charcoal leading-relaxed mb-6">
              Building on decades of ABS innovation, Kawai developed ABS-Carbon — a new composite
              material created by infusing carbon fiber into ABS-Styran. This next-generation
              material is incredibly sturdy and rigid, allowing Kawai to make action parts lighter
              without sacrificing strength. The result is the Millennium III Action: faster,
              stronger, and more precise than any wooden action ever built.
            </p>
          </div>
        </div>
      </section>

      {/* Section: The Truth About Composite Actions */}
      <section className="py-16 bg-kawai-pearl">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-6">
              The Truth About Composite Actions
            </h2>
            <p className="text-kawai-charcoal leading-relaxed mb-6">
              The truth is simple: composite materials are scientifically superior to wood for the
              mechanical components of a piano action. This is not a marketing claim — it is a fact
              demonstrated by physics, chemistry, and decades of real-world performance. Kawai was
              the first piano maker to recognize this truth and act on it, investing millions of
              dollars over five decades to bring composite action technology to pianists worldwide.
            </p>
            <p className="text-kawai-charcoal leading-relaxed">
              Today, Kawai pianos with ABS and ABS-Carbon actions are played by students,
              professionals, and competition winners on every continent. The evidence is in the
              playing.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-kawai-black text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-brand-serif)] mb-4">
            Experience the Millennium III Action
          </h2>
          <p className="text-white/70 mb-8 max-w-xl mx-auto">
            Discover what decades of composite action research feel like under your hands. Visit an
            authorized Kawai dealer near you.
          </p>
          <Link
            href="/find-a-dealer"
            className="inline-block bg-kawai-red text-white px-8 py-3 rounded font-medium hover:bg-kawai-red-700 transition-colors"
          >
            Find a Dealer
          </Link>
        </div>
      </section>
    </div>
  )
}
