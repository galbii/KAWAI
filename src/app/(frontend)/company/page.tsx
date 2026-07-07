import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Company | Kawai Pianos',
  description:
    'Founded in 1927 by Koichi Kawai — one of the largest and best known musical instrument companies in the world. Learn about Kawai America Corporation and our commitment to craftsmanship.',
}

const divisions = [
  {
    title: 'Our Timeline',
    description: 'Trace the milestones that have shaped Kawai from its founding to today.',
    href: '/company/timeline',
  },
  {
    title: 'Our Philosophy',
    description: 'Discover the principles that guide every instrument we build.',
    href: '/company/our-philosophy',
  },
  {
    title: 'Koichi Kawai',
    description:
      "The story of our founder's extraordinary genius for design and innovation.",
    href: '/about/heritage/koichi-kawai',
  },
  {
    title: 'Awards & Recognition',
    description: 'Over 50 major international awards for product and service excellence.',
    href: '/company/awards',
  },
  {
    title: "The Winner's Choice",
    description: 'Competition winners worldwide choose Kawai.',
    href: '/the-winners-choice',
  },
  {
    title: 'Distinguished Owners',
    description: 'Universities, concert halls, and institutions that trust Kawai.',
    href: '/distinguished-owners',
  },
]

const stats = [
  { label: 'Founded', value: '1927' },
  { label: 'Pianos Built', value: '2.4 Million+' },
  { label: 'Awards', value: '50+' },
  { label: 'Presence', value: 'Worldwide' },
]

export default function CompanyPage() {
  return (
    <div className="min-h-screen bg-kawai-pearl">
      {/* Hero */}
      <section className="bg-kawai-black text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <p className="text-kawai-red text-sm uppercase tracking-widest mb-3">Company</p>
            <h1 className="text-4xl md:text-5xl font-[family-name:var(--font-brand-serif)] mb-4">
              Kawai America
            </h1>
            <p className="text-lg text-white/70 max-w-2xl">
              Founded in 1927 by Koichi Kawai — one of the largest and best known musical
              instrument companies in the world.
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-6">
              About Kawai America Corporation
            </h2>
            <p className="text-kawai-charcoal leading-relaxed mb-6">
              Kawai was founded in 1927 by Koichi Kawai, and has grown to become one of the
              largest and best known musical instrument companies in the world. Kawai America
              Corporation and Kawai Canada Music offer a complete line of pianos, digital pianos
              and professional keyboards to musicians across the United States and Canada through
              a network of authorized dealers.
            </p>
            <p className="text-kawai-charcoal leading-relaxed mb-6">
              From our North American headquarters in southern California, Kawai America and
              Kawai Canada manage instrument sales, advertising, marketing, artist relations and
              technical services.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="bg-kawai-black text-white py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl md:text-4xl font-bold text-kawai-red mb-2">
                  {stat.value}
                </div>
                <div className="text-white/60 text-sm uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divisions Grid */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-10">
              Our Divisions
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {divisions.map((div) => (
                <Link
                  key={div.href}
                  href={div.href}
                  className="group block bg-white border border-kawai-neutral rounded-lg p-6 hover:border-kawai-red transition-colors duration-200"
                >
                  <h3 className="text-lg font-semibold text-kawai-black mb-2 group-hover:text-kawai-red transition-colors duration-200">
                    {div.title}
                  </h3>
                  <p className="text-kawai-charcoal text-sm leading-relaxed">
                    {div.description}
                  </p>
                  <span className="inline-block mt-4 text-kawai-red text-sm font-medium">
                    Learn more →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-kawai-black text-white py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-kawai-red text-sm uppercase tracking-widest mb-2">Explore</p>
              <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-brand-serif)]">
                Discover the Kawai Story
              </h2>
              <p className="text-white/60 mt-2">
                Nearly a century of craftsmanship, innovation, and musical excellence.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 shrink-0">
              <Link
                href="/about/heritage/koichi-kawai"
                className="inline-block px-6 py-3 bg-kawai-red text-white text-sm font-medium rounded hover:bg-kawai-red-700 transition-colors duration-200 text-center"
              >
                Our Founder
              </Link>
              <Link
                href="/pianos"
                className="inline-block px-6 py-3 border border-white/30 text-white text-sm font-medium rounded hover:border-white transition-colors duration-200 text-center"
              >
                Explore Pianos
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
