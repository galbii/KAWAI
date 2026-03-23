import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Awards & Recognition | Kawai Pianos',
  description:
    'Over 50 major international awards for product and service excellence — a legacy of industry recognition spanning three decades.',
}

type Award = {
  name: string
  product?: string
}

type AwardYear = {
  year: string
  awards: Award[]
}

const awardsByYear: AwardYear[] = [
  {
    year: '2024',
    awards: [
      {
        name: "Music Inc. Magazine 'Editor's Choice Award-NAMM 2024'",
        product: 'CA901 Digital Piano',
      },
    ],
  },
  {
    year: '2023',
    awards: [
      { name: 'MMR Dealers Choice Award', product: 'Acoustic Piano Line of the Year' },
      {
        name: "Music Inc Magazine \"Editor's Choice Award-NAMM 2023\"",
        product: 'GX2 60th Anniversary',
      },
    ],
  },
  {
    year: '2022',
    awards: [{ name: 'MMR', product: 'Acoustic Piano Line of the Year' }],
  },
  {
    year: '2021',
    awards: [
      { name: 'Music Inc Magazine "Product of the Year"', product: 'CA99' },
      { name: 'Music Inc Magazine "Supplier Excellence Award"' },
    ],
  },
  {
    year: '2020',
    awards: [
      { name: 'Music Inc Magazine "Product Excellence" Award', product: 'Novus NV-5' },
    ],
  },
  {
    year: '2019',
    awards: [
      {
        name: 'MMR Pro Digital Keyboard Line of the Year',
        product: 'MP Series Professional Stage Pianos',
      },
    ],
  },
  {
    year: '2018',
    awards: [
      { name: 'MMR Pro Digital Keyboard Line of the Year', product: 'MP Series' },
      {
        name: 'Music Inc. Product Excellence Award',
        product: 'NOVUS NV10 Hybrid Digital Piano',
      },
      { name: 'Tastenwelt Magazine Product Award', product: 'ES110' },
    ],
  },
  {
    year: '2017',
    awards: [
      { name: 'MMR Home Digital Keyboard Line of the Year', product: 'CN Series' },
      { name: 'Music Inc. Product Excellence Award', product: 'GX-2 Grand Piano' },
      { name: 'Good Design Award Japan', product: 'NOVUS NV-10' },
      { name: 'Tastenwelt Magazine Product Award', product: 'ES8' },
    ],
  },
  {
    year: '2016',
    awards: [
      {
        name: 'MMR Global Music Industry Product of the Year',
        product: 'GL Series Grand Pianos',
      },
      { name: 'MMR Home Digital Keyboard Line of the Year', product: 'CS / CA Series' },
    ],
  },
  {
    year: '2015',
    awards: [
      {
        name: 'Music Inc. Product Excellence Award',
        product: 'CA97 Hybrid and CA67',
      },
      { name: 'Music Inc. Supplier Excellence Award' },
      { name: 'MMR Legacy Award', product: 'CA95' },
      { name: 'Tastenwelt "Best Compact Piano"', product: 'ES8' },
    ],
  },
  {
    year: '2014',
    awards: [
      { name: 'Music Inc. Supplier Excellence Award' },
      { name: 'Music Inc. Product Excellence Award', product: 'CN Series' },
      { name: 'MMR Home Digital Keyboard Line of the Year', product: 'CN Series' },
      { name: 'MMR Pro Digital Piano Line of the Year', product: 'MP Series' },
      { name: 'Tastenwelt "Best Home Digital Under 1500 Euros"', product: 'CN34' },
      {
        name: "Music Inc. Editor's Choice NAMM \"Best in Show\"",
        product: 'CS10 Hybrid',
      },
      { name: '"Rock oN" Company (Japan) Silver Prize', product: 'VPC-1' },
    ],
  },
  {
    year: '2013',
    awards: [
      { name: 'Music Inc. Supplier Excellence Award' },
      { name: 'MMR Home Digital Keyboard of the Year', product: 'CA95' },
      { name: "Worship Leader Magazine \"Editor's Pick\"", product: 'CS7' },
    ],
  },
  {
    year: '2012',
    awards: [
      { name: 'Music Inc. Supplier Excellence Award' },
      { name: 'MMR Home Digital Keyboard of the Year', product: 'CA95' },
      { name: 'Music Inc. Product Excellence Award', product: 'CA95' },
      { name: 'Good Design Award Japan', product: 'CA95' },
      { name: "Diapason d'Or Award France", product: 'CA95' },
    ],
  },
  {
    year: '2011',
    awards: [
      { name: 'MMR Acoustic Piano of the Year', product: 'K-3 Professional Upright Piano' },
    ],
  },
  {
    year: '2010',
    awards: [
      { name: 'MMR Acoustic Piano of the Year', product: 'K-3' },
      { name: 'Music Inc. Product Excellence Award', product: 'CA93' },
      { name: 'Good Design Award Japan', product: 'CA93' },
    ],
  },
  {
    year: '2009',
    awards: [
      { name: 'MMR Acoustic Piano of the Year', product: 'K-3' },
      { name: 'Music Inc. Supplier Excellence Award', product: 'Web Site Design' },
    ],
  },
  {
    year: '2008',
    awards: [
      { name: 'MMR Acoustic Piano of the Year', product: 'K-3' },
      { name: 'Worship Leader "Best of the Best"', product: 'CA51' },
      { name: 'Good Design Award Japan', product: 'MP8II' },
    ],
  },
  {
    year: '2007',
    awards: [
      { name: 'MMR Digital Home Keyboard of the Year', product: 'CA91' },
    ],
  },
  {
    year: '2005',
    awards: [
      { name: 'MMR Acoustic Piano Line of the Year', product: 'RX Series' },
    ],
  },
  {
    year: '2004',
    awards: [
      { name: 'MMR Acoustic Piano Line of the Year', product: 'RX Series' },
    ],
  },
  {
    year: '2003',
    awards: [
      { name: 'MMR Acoustic Piano Line of the Year', product: 'RX Series' },
      { name: "Tastenwelt Readers Choice Award", product: 'MP9500' },
      { name: 'Music Inc. Supplier Excellence Award', product: 'Product Innovation' },
    ],
  },
  {
    year: '2002',
    awards: [
      { name: 'MMR Digital Home Keyboard of the Year', product: 'CN270' },
    ],
  },
  {
    year: '2001',
    awards: [
      { name: 'MMR Digital Home Keyboard of the Year', product: 'ES1' },
      {
        name: 'German Music Association Electronic Product of the Year',
        product: 'ES1',
      },
    ],
  },
  {
    year: '2000',
    awards: [
      { name: 'MMR Digital Home Keyboard of the Year', product: 'CP200' },
      { name: 'Good Design Award Japan', product: 'ES1' },
      { name: 'Keyboard Magazine "Key Buy" Award', product: 'MP9000' },
      { name: 'Musicmesse International Press Award', product: 'MP9000' },
    ],
  },
  {
    year: '1999',
    awards: [
      { name: 'Keyboard Magazine (Europe) "Best in Class"', product: 'CA750' },
    ],
  },
  {
    year: '1998',
    awards: [
      { name: 'SOLO Magazine Germany Top Digital Piano', product: 'CA750' },
    ],
  },
]

export default function AwardsPage() {
  return (
    <div className="min-h-screen bg-kawai-pearl">
      {/* Hero */}
      <section className="bg-kawai-black text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <p className="text-kawai-red text-sm uppercase tracking-widest mb-3">Company</p>
            <h1 className="text-4xl md:text-5xl font-[family-name:var(--font-brand-serif)] mb-4">
              Awards &amp; Recognition
            </h1>
            <p className="text-lg text-white/70 max-w-2xl">
              Over 50 major international awards for product and service excellence — a legacy
              of industry recognition spanning three decades.
            </p>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-6">
              An Award-Winning History
            </h2>
            <p className="text-kawai-charcoal leading-relaxed mb-6">
              Kawai has become one of the most celebrated companies in the global music products
              industry having received over 50 major international awards for product and service
              excellence.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline of awards */}
      <section className="pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {awardsByYear.map((yearGroup) => (
              <div key={yearGroup.year} className="mb-12 flex gap-8">
                {/* Year anchor */}
                <div className="shrink-0 w-20 pt-1">
                  <span className="text-kawai-red font-bold text-2xl">{yearGroup.year}</span>
                </div>

                {/* Awards for this year */}
                <div className="flex-1 grid sm:grid-cols-2 gap-3">
                  {yearGroup.awards.map((award, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-kawai-neutral rounded-lg px-5 py-4"
                    >
                      <p className="text-kawai-black text-sm font-medium leading-snug">
                        {award.name}
                      </p>
                      {award.product && (
                        <p className="text-kawai-charcoal text-xs mt-1">{award.product}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-kawai-black text-white py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-kawai-red text-sm uppercase tracking-widest mb-2">Continue</p>
              <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-brand-serif)]">
                Explore Our Philosophy
              </h2>
              <p className="text-white/60 mt-2">
                Discover the principles behind every award-winning instrument.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 shrink-0">
              <Link
                href="/company/our-philosophy"
                className="inline-block px-6 py-3 bg-kawai-red text-white text-sm font-medium rounded hover:bg-kawai-red-700 transition-colors duration-200 text-center"
              >
                Our Philosophy
              </Link>
              <Link
                href="/company"
                className="inline-block px-6 py-3 border border-white/30 text-white text-sm font-medium rounded hover:border-white transition-colors duration-200 text-center"
              >
                Back to Company
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
