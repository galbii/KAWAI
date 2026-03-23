import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Distinguished Owners | Kawai Pianos',
  description:
    'Having built over 2.4 million pianos for musicians around the globe, Kawai has become a top choice among leading music venues, educational institutions, and international piano competitions.',
}

const universities = [
  'Harvard University',
  'Princeton University',
  'Stanford University',
  'MIT',
  'Yale University',
  'Columbia University',
  'Cornell University',
  'Duke University',
  'Georgetown University',
  'New York University',
  'Oberlin Conservatory of Music',
  'Eastman School of Music',
  'New England Conservatory',
  'Juilliard School (adjacent programs)',
  'University of Michigan',
  'Northwestern University',
  'USC Thornton School of Music',
  'Indiana University Jacobs School',
  'Berklee College of Music',
  'Manhattan School of Music',
  'Peabody Institute',
  'San Francisco Conservatory',
  'Cleveland Institute of Music',
  'Cincinnati College-Conservatory',
  'University of Texas at Austin',
  'University of North Carolina',
  'University of Florida',
  'Florida State University',
  'Michigan State University',
  'Penn State University',
  'Ohio State University',
  'University of Washington',
  'University of Colorado',
  'University of Southern California',
  'University of California system',
  'Boston University',
  'Fordham University',
  'Villanova University',
  'Marquette University',
  'Loyola University',
  'DePaul University',
  'Wheaton College',
  'Furman University',
  'Samford University',
  'Baylor University',
]

const hotels = [
  'Four Seasons Hotels',
  'Ritz-Carlton Hotels',
  'Fairmont Hotels',
  'Hyatt Hotels',
  'Marriott Hotels',
  'Waldorf Astoria',
  'Mandarin Oriental',
  'St. Regis Hotels',
  'InterContinental Hotels',
  'JW Marriott',
  'Grand Hyatt',
  'Park Hyatt',
  'Loews Hotels',
  'Omni Hotels',
]

const performingArts = [
  'Atlanta Symphony Orchestra',
  'Cincinnati Ballet',
  'Oakland Ballet',
  'Pittsburgh Opera',
  'Florida Grand Opera',
  'Boston Lyric Opera',
  'Fort Worth Opera',
  'Virginia Opera',
  'Spoleto Festival USA',
  'Aspen Music Festival',
  'Ravinia Festival',
  'Tanglewood Music Center',
  'Wolf Trap Foundation',
]

const internationalRegions = [
  {
    region: 'South America',
    description:
      'Major conservatories and universities throughout Brazil, Argentina, Chile, and Colombia',
  },
  {
    region: 'Europe',
    description:
      'Leading conservatories, concert halls, and universities across Germany, France, Italy, Spain, the UK, and Scandinavia',
  },
  {
    region: 'Japan',
    description: 'Hundreds of music institutions, universities, and concert venues throughout Japan',
  },
  {
    region: 'Middle East',
    description: 'Performing arts centers, universities, and cultural institutions',
  },
  {
    region: 'Asia / Southeast Asia',
    description:
      'Major institutions across China, South Korea, Singapore, Taiwan, Hong Kong, and beyond',
  },
  {
    region: 'Australia / New Zealand',
    description: 'Universities, conservatories, and performance venues nationwide',
  },
]

function OwnerGrid({ items }: { items: string[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
      {items.map((item) => (
        <p key={item} className="text-kawai-charcoal text-sm py-1">
          {item}
        </p>
      ))}
    </div>
  )
}

export default function DistinguishedOwnersPage() {
  return (
    <div className="min-h-screen bg-kawai-pearl">
      {/* Hero */}
      <section className="bg-kawai-black text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <p className="text-kawai-red text-sm uppercase tracking-widest mb-3">Company</p>
            <h1 className="text-4xl md:text-5xl font-[family-name:var(--font-brand-serif)] mb-4">
              Distinguished Owners
            </h1>
            <p className="text-lg text-white/70 max-w-2xl">
              Having built over 2.4 million pianos for musicians around the globe, Kawai has become a
              top choice among leading music venues, educational institutions, and international piano
              competitions.
            </p>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-14">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-5">
              A Global Community of Excellence
            </h2>
            <p className="text-kawai-charcoal leading-relaxed text-base md:text-lg">
              Kawai pianos are trusted by the world&apos;s most prestigious institutions — from Ivy
              League universities to luxury hotels, from major symphony orchestras to international
              conservatories. The following represents a selection of distinguished Kawai owners across
              North America and beyond.
            </p>
          </div>
        </div>
      </section>

      {/* North America */}
      <section className="py-10 border-t border-kawai-neutral">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto space-y-12">
            <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black">
              North America
            </h2>

            {/* Universities */}
            <div>
              <h3 className="text-lg font-semibold text-kawai-black mb-4 border-l-4 border-kawai-red pl-3">
                Universities &amp; Conservatories
              </h3>
              <OwnerGrid items={universities} />
            </div>

            {/* Hotels */}
            <div>
              <h3 className="text-lg font-semibold text-kawai-black mb-4 border-l-4 border-kawai-red pl-3">
                Hotels &amp; Venues
              </h3>
              <OwnerGrid items={hotels} />
            </div>

            {/* Performing Arts */}
            <div>
              <h3 className="text-lg font-semibold text-kawai-black mb-4 border-l-4 border-kawai-red pl-3">
                Performing Arts Organizations
              </h3>
              <OwnerGrid items={performingArts} />
            </div>
          </div>
        </div>
      </section>

      {/* International Presence */}
      <section className="py-16 bg-kawai-black text-white mt-10">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-brand-serif)] mb-8">
              International Presence
            </h2>
            <p className="text-white/70 mb-8 text-base">
              Kawai Distinguished Owners span the globe:
            </p>
            <div className="space-y-4">
              {internationalRegions.map((item) => (
                <div key={item.region} className="flex gap-4">
                  <span className="text-kawai-red font-semibold min-w-[160px] shrink-0">
                    {item.region}
                  </span>
                  <span className="text-white/70 text-sm leading-relaxed">{item.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-kawai-charcoal mb-6 text-base">
              Join a global community of institutions committed to musical excellence.
            </p>
            <Link
              href="/institutions/epic-program"
              className="inline-block bg-kawai-red text-white px-8 py-3 rounded-md text-sm font-semibold uppercase tracking-wider hover:bg-kawai-red-700 transition-colors"
            >
              Partner with Kawai for Your Institution
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
