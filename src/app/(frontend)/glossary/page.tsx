import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Resource Glossary | Kawai Pianos',
  description:
    'A complete index of Kawai technology, company history, and institutional resources — organized by section for easy navigation.',
}

const sections = [
  {
    label: 'Technology',
    description: 'The science and engineering behind every Kawai piano.',
    color: 'kawai-red',
    pages: [
      {
        title: 'ABS-Carbon Technology',
        description: 'How carbon fiber composite materials power the Millennium III Action.',
        href: '/technology/carbon-fiber-technology',
      },
      {
        title: 'How a Piano Action Works',
        description: 'An in-depth look at the mechanism that turns keystrokes into music.',
        href: '/technology/piano-action',
      },
      {
        title: 'ABS — The Truth',
        description: "Why composite materials are scientifically superior to wood for piano actions.",
        href: '/technology/abs',
      },
      {
        title: 'Sound Technology',
        description: 'SK-EX Rendering, Harmonic Imaging, and how Kawai reproduces concert grand tone.',
        href: '/technology/sound-technology',
      },
      {
        title: 'Wooden Key Actions',
        description: 'Grand Feel, Responsive Hammer, and every action type explained.',
        href: '/technology/wooden-key-actions',
      },
      {
        title: 'Soundboard Speaker System',
        description: 'Channeling digital sound through a real wooden soundboard for natural tone.',
        href: '/technology/soundboard-speaker-system',
      },
    ],
  },
  {
    label: 'Company',
    description: 'The history, philosophy, and people behind Kawai.',
    color: 'kawai-charcoal',
    pages: [
      {
        title: 'Company Overview',
        description: 'Kawai America Corporation — serving musicians across North America since 1927.',
        href: '/company',
      },
      {
        title: 'Awards & Recognition',
        description: 'Over 50 major international awards for product and service excellence.',
        href: '/company/awards',
      },
      {
        title: 'Our Philosophy',
        description: "The principles that guide every instrument we build.",
        href: '/company/our-philosophy',
      },
      {
        title: 'Koichi Kawai — Founder',
        description: 'The extraordinary story of the inventor who started it all in 1927.',
        href: '/company/koichi-kawai',
      },
      {
        title: "The Winner's Choice",
        description: 'International competition winners who chose the Kawai EX Concert Grand.',
        href: '/the-winners-choice',
      },
      {
        title: 'Distinguished Owners',
        description: 'Universities, concert halls, and institutions worldwide that trust Kawai.',
        href: '/distinguished-owners',
      },
    ],
  },
  {
    label: 'Institutions',
    description: 'Programs and support for schools, universities, and performing arts organizations.',
    color: 'kawai-charcoal',
    pages: [
      {
        title: 'The EPIC Partnership',
        description: 'Elite Performing Instrument Collection — sponsored pricing for qualifying institutions.',
        href: '/institutions/epic-program',
      },
      {
        title: 'EPIC Testimonial Videos',
        description: 'Hear from faculty, administrators, and students at EPIC partner institutions.',
        href: '/institutions/testimonial-videos',
      },
      {
        title: 'Fleet Management',
        description: 'Complimentary analysis of your institutional piano fleet.',
        href: '/institutions/institutional-fleet',
      },
      {
        title: 'Loan Programs',
        description: 'World-class instruments in your classrooms at no upfront cost.',
        href: '/institutions/loan-programs',
      },
      {
        title: 'Financial Assistance',
        description: 'EPIC endowment, long-term financing, and customized acquisition plans.',
        href: '/institutions/financial-assistance',
      },
    ],
  },
]

export default function GlossaryPage() {
  return (
    <div className="min-h-screen bg-kawai-pearl">
      {/* Hero */}
      <section className="bg-kawai-black text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <p className="text-kawai-red text-sm uppercase tracking-widest mb-3">Resources</p>
            <h1 className="text-4xl md:text-5xl font-[family-name:var(--font-brand-serif)] mb-4">
              Resource Glossary
            </h1>
            <p className="text-lg text-white/70 max-w-2xl">
              A complete index of Kawai technology, company, and institutional resources — organized
              by section.
            </p>
          </div>
        </div>
      </section>

      {/* Sections */}
      {sections.map((section) => (
        <section key={section.label} className="py-16 even:bg-white odd:bg-kawai-pearl">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              {/* Section header */}
              <div className="mb-10 pb-4 border-b border-kawai-neutral">
                <p className="text-kawai-red text-xs uppercase tracking-widest mb-1">
                  {section.label}
                </p>
                <h2 className="text-2xl font-[family-name:var(--font-brand-serif)] text-kawai-black">
                  {section.description}
                </h2>
              </div>

              {/* Page cards */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {section.pages.map((page) => (
                  <Link
                    key={page.href}
                    href={page.href}
                    className="group bg-white border border-kawai-neutral rounded-lg p-5 hover:border-kawai-red hover:shadow-md transition-all duration-200"
                  >
                    <h3 className="text-[15px] font-semibold text-kawai-black group-hover:text-kawai-red transition-colors mb-2 leading-snug">
                      {page.title}
                    </h3>
                    <p className="text-sm text-kawai-charcoal/70 leading-relaxed">
                      {page.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="py-16 bg-kawai-black text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="text-kawai-red text-xs uppercase tracking-widest mb-2">Explore More</p>
              <h2 className="text-2xl font-[family-name:var(--font-brand-serif)]">
                Ready to experience a Kawai?
              </h2>
              <p className="text-white/60 text-sm mt-1">
                Find an authorized dealer near you.
              </p>
            </div>
            <Link
              href="/find-a-dealer"
              className="flex-shrink-0 inline-flex items-center gap-2 bg-kawai-red text-white px-6 py-3 rounded-lg hover:bg-kawai-red/90 transition-colors text-sm font-semibold"
            >
              Find a Dealer
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
