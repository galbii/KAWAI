import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'EPIC Testimonial Videos | Kawai Pianos',
  description:
    'Hear directly from faculty, administrators, and students at EPIC partner institutions about their experience with Kawai.',
}

const videoCategories = [
  {
    title: 'Choosing Kawai',
    description:
      'Administrators and department chairs discuss why their institutions chose Kawai for their piano fleets and what factors drove the decision.',
  },
  {
    title: 'MPA Service',
    description:
      "Learn about Kawai's Music Products Assistance service program and how responsive technical support has benefited EPIC partner institutions.",
  },
  {
    title: 'The EPIC Partnership',
    description:
      'Faculty and administrators share their experience navigating the EPIC program from initial inquiry through installation.',
  },
  {
    title: 'Faculty & Student Reactions',
    description:
      'Pianists and professors discuss the playing experience on Shigeru Kawai instruments and the impact on teaching and performance.',
  },
  {
    title: 'Funding for EPIC',
    description:
      'Administrators share strategies for securing funding for EPIC partnerships, including endowment gifts, capital campaigns, and institutional budget allocation.',
  },
  {
    title: 'Peer Advice',
    description:
      'EPIC partners offer candid advice to other institutions considering a Kawai partnership — what to expect, what to ask, and how to make the most of the program.',
  },
]

function PlayButtonPlaceholder() {
  return (
    <div className="aspect-video bg-kawai-black rounded-t-lg flex items-center justify-center">
      <div className="w-14 h-14 rounded-full bg-kawai-red flex items-center justify-center">
        {/* Play icon triangle */}
        <svg
          className="w-6 h-6 text-white ml-1"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
    </div>
  )
}

export default function TestimonialVideosPage() {
  return (
    <div className="min-h-screen bg-kawai-pearl">
      {/* Hero */}
      <section className="bg-kawai-black text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <p className="text-kawai-red text-sm uppercase tracking-widest mb-3">Institutions</p>
            <h1 className="text-4xl md:text-5xl font-[family-name:var(--font-brand-serif)] mb-4">
              EPIC Testimonial Videos
            </h1>
            <p className="text-lg text-white/70 max-w-2xl">
              Hear directly from faculty, administrators, and students at EPIC partner institutions
              about their experience with Kawai.
            </p>
          </div>
        </div>
      </section>

      {/* What Our Partners Say */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="max-w-3xl mb-12">
              <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-4">
                What Our Partners Say
              </h2>
              <p className="text-kawai-charcoal leading-relaxed text-base md:text-lg">
                The best advocates for the EPIC program are the people who experience it every day. The
                following video testimonials are from faculty members, administrators, and students at
                institutions across North America who have partnered with Kawai through the EPIC
                program.
              </p>
            </div>

            {/* Video Categories Grid */}
            <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-8">
              Video Categories
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videoCategories.map((category) => (
                <div
                  key={category.title}
                  className="bg-white rounded-xl overflow-hidden border border-kawai-neutral hover:border-kawai-red transition-colors cursor-pointer"
                >
                  <PlayButtonPlaceholder />
                  <div className="p-5">
                    <h3 className="text-base font-semibold text-kawai-black mb-2">
                      {category.title}
                    </h3>
                    <p className="text-kawai-charcoal text-sm leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us */}
      <section className="py-16 border-t border-kawai-neutral">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-4">
              Contact Us
            </h2>
            <p className="text-kawai-charcoal leading-relaxed mb-8 text-base">
              Interested in learning more about the EPIC program? Our Institutional Relations Team is
              ready to answer your questions.
            </p>

            <div className="bg-kawai-black rounded-xl p-8 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <p className="text-white/60 text-sm uppercase tracking-widest mb-2">
                  Institutional Relations Team
                </p>
                <a
                  href="tel:+18004212177"
                  className="text-2xl font-[family-name:var(--font-brand-serif)] text-white hover:text-kawai-red transition-colors"
                >
                  800-421-2177{' '}
                  <span className="text-white/60 text-base font-sans">ext. 6871</span>
                </a>
              </div>
              <Link
                href="/institutions/epic-program"
                className="inline-block bg-kawai-red text-white px-7 py-3 rounded-md text-sm font-semibold uppercase tracking-wider hover:bg-kawai-red-700 transition-colors shrink-0"
              >
                Learn About EPIC
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
