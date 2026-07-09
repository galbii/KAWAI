import type { Metadata } from 'next'
import Link from 'next/link'
import { getStaticAlternates } from '@/lib/site-context'

export const metadata: Metadata = {
  title: "Shigeru Kawai Institutional Sales | Chosen by the World's Premier Institutions",
  description:
    'Shigeru Kawai grand pianos are chosen by over 100 institutions worldwide — from the Berliner Philharmoniker to Carnegie Hall. Explore universities, conservatories, and concert halls that trust Shigeru Kawai.',
  alternates: getStaticAlternates('/shigeru/institutions'),
}

type Region = 'north-america' | 'europe' | 'asia-pacific' | 'other'

interface Institution {
  name: string
  location: string
  region: Region
}

const institutions: Institution[] = [
  // North America
  { name: 'Brigham Young University', location: 'Provo, UT', region: 'north-america' },
  { name: 'Chapman University', location: 'Orange, CA', region: 'north-america' },
  { name: 'Clayton State University', location: 'Morrow, GA', region: 'north-america' },
  { name: 'Colburn Conservatory', location: 'Los Angeles, CA', region: 'north-america' },
  { name: 'Columbia College Chicago', location: 'Chicago, IL', region: 'north-america' },
  { name: 'Interlochen Center for the Arts', location: 'Interlochen, MI', region: 'north-america' },
  { name: 'Jacksonville University', location: 'Jacksonville, FL', region: 'north-america' },
  { name: 'LaGrange College', location: 'LaGrange, GA', region: 'north-america' },
  { name: 'Mississippi University for Women', location: 'Columbus, MS', region: 'north-america' },
  { name: 'Pacific Union College', location: 'Angwin, CA', region: 'north-america' },
  { name: 'Reinhardt University', location: 'Waleska, GA', region: 'north-america' },
  { name: 'Shorter University', location: 'Rome, GA', region: 'north-america' },
  { name: 'Tougaloo College', location: 'Tougaloo, MS', region: 'north-america' },
  { name: 'University of Houston', location: 'Houston, TX', region: 'north-america' },
  { name: 'UNLV', location: 'Las Vegas, NV', region: 'north-america' },
  { name: 'University of West Georgia', location: 'Carrollton, GA', region: 'north-america' },
  { name: 'Wheaton College', location: 'Wheaton, IL', region: 'north-america' },
  {
    name: 'Conservatoire de musique du Québec (multiple locations)',
    location: 'Québec, Canada',
    region: 'north-america',
  },
  // Europe
  { name: 'Anton Bruckner Konservatorium', location: 'Linz, Austria', region: 'europe' },
  { name: 'Conservatorio Arrigo Pedrollo', location: 'Vicenza, Italy', region: 'europe' },
  { name: 'Jazz & Rock Schulen Freiburg', location: 'Freiburg, Germany', region: 'europe' },
  { name: 'Leopold-Mozart-Zentrum', location: 'Augsburg, Germany', region: 'europe' },
  { name: 'Maynooth University', location: 'Maynooth, Ireland', region: 'europe' },
  { name: 'Nordiska Musikgymnasiet', location: 'Stockholm, Sweden', region: 'europe' },
  { name: 'Norge Musikkhøgskole', location: 'Oslo, Norway', region: 'europe' },
  { name: 'Sinfonia Varsovia Orchestra', location: 'Warsaw, Poland', region: 'europe' },
  {
    name: 'Staatliche Hochschule für Musik Freiburg',
    location: 'Freiburg, Germany',
    region: 'europe',
  },
  { name: 'The Savoy Hotel', location: 'London, UK', region: 'europe' },
  // Asia & Pacific
  { name: 'Central Conservatory of Music', location: 'Beijing, China', region: 'asia-pacific' },
  { name: 'China Conservatory of Music', location: 'Beijing, China', region: 'asia-pacific' },
  { name: 'Heisei College of Music', location: 'Japan', region: 'asia-pacific' },
  { name: 'Kyoto City University of Arts', location: 'Kyoto, Japan', region: 'asia-pacific' },
  { name: 'Nagoya University of Arts', location: 'Nagoya, Japan', region: 'asia-pacific' },
  {
    name: 'National Center for the Performing Arts',
    location: 'Beijing, China',
    region: 'asia-pacific',
  },
  { name: 'Osaka College of Music', location: 'Osaka, Japan', region: 'asia-pacific' },
  {
    name: 'Queensland Conservatorium of Music',
    location: 'Brisbane, Australia',
    region: 'asia-pacific',
  },
  { name: 'Scotch College Melbourne', location: 'Melbourne, Australia', region: 'asia-pacific' },
  {
    name: 'Shanghai Conservatory of Music',
    location: 'Shanghai, China',
    region: 'asia-pacific',
  },
  { name: 'Showa Academia Musicae', location: 'Tokyo, Japan', region: 'asia-pacific' },
  { name: 'Tokyo College of Music', location: 'Tokyo, Japan', region: 'asia-pacific' },
  { name: 'Waseda University', location: 'Tokyo, Japan', region: 'asia-pacific' },
  { name: "Xi'an Conservatory of Music", location: "Xi'an, China", region: 'asia-pacific' },
  // Other
  { name: 'Academy of Arts', location: 'Belgrade, Serbia', region: 'other' },
  { name: 'Glazbeno uciliste Elly Basic', location: 'Zagreb, Croatia', region: 'other' },
  { name: 'Tallinna Muusikakeskkool', location: 'Tallinn, Estonia', region: 'other' },
]

const regionGroups: { region: Region; label: string }[] = [
  { region: 'north-america', label: 'North America' },
  { region: 'europe', label: 'Europe' },
  { region: 'asia-pacific', label: 'Asia & Pacific' },
  { region: 'other', label: 'Other Regions' },
]

const institutionalPartnersSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Shigeru Kawai',
  description:
    'Shigeru Kawai grand pianos are chosen by over 100 leading academic institutions, concert halls, and performing arts organizations worldwide.',
  url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaius.com'}/shigeru/institutions`,
  member: [
    {
      '@type': 'PerformingGroup',
      name: 'Berliner Philharmoniker',
      location: { '@type': 'Place', name: 'Berlin, Germany' },
    },
    {
      '@type': 'CivicStructure',
      name: 'Vienna Musikverein',
      location: { '@type': 'Place', name: 'Vienna, Austria' },
    },
    {
      '@type': 'CivicStructure',
      name: 'Carnegie Hall',
      location: { '@type': 'Place', name: 'New York, USA' },
    },
    {
      '@type': 'EducationalOrganization',
      name: 'Colburn Conservatory',
      location: { '@type': 'Place', name: 'Los Angeles, CA' },
    },
    {
      '@type': 'EducationalOrganization',
      name: 'Shanghai Conservatory of Music',
      location: { '@type': 'Place', name: 'Shanghai, China' },
    },
    {
      '@type': 'EducationalOrganization',
      name: 'Queensland Conservatorium of Music',
      location: { '@type': 'Place', name: 'Brisbane, Australia' },
    },
  ],
}

export default function InstitutionsPage() {
  return (
    <div className="bg-[#0a0a0a]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(institutionalPartnersSchema) }}
      />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-[65vh] flex flex-col items-center justify-center px-6 overflow-hidden pt-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(213,199,140,0.06) 0%, transparent 70%)',
          }}
        />
        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
          <p
            className="text-kawai-gold text-[10px] tracking-[0.45em] uppercase mb-10"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            Trusted Worldwide
          </p>
          <h1
            className="text-white font-light italic leading-[0.9] mb-8"
            style={{
              fontFamily: 'var(--font-brand-luxury)',
              fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
            }}
          >
            Chosen by the World&apos;s
            <br />
            Premier Institutions
          </h1>
          <div className="flex items-center justify-center gap-5 mb-8">
            <span className="block h-px w-16 bg-kawai-gold opacity-30" />
            <span
              className="text-kawai-gold text-[9px] tracking-[0.4em] uppercase opacity-60"
              style={{ fontFamily: 'var(--font-brand-sans)' }}
            >
              Est. 1999
            </span>
            <span className="block h-px w-16 bg-kawai-gold opacity-30" />
          </div>
          <p
            className="text-white/35 text-sm tracking-wide max-w-lg leading-relaxed"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            From conservatories in Tokyo to concert halls in Vienna
          </p>
        </div>
      </section>

      {/* ── PRESTIGE ROW ─────────────────────────────────────── */}
      <section className="bg-kawai-pearl px-6 py-28">
        <div className="max-w-6xl mx-auto">
          <p
            className="text-kawai-muted text-[10px] tracking-[0.45em] uppercase text-center mb-16"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            Artist Partners
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-kawai-neutral/40">
            {[
              { venue: 'Berliner Philharmoniker', city: 'Berlin, Germany' },
              { venue: 'Vienna Musikverein', city: 'Vienna, Austria' },
              { venue: 'Carnegie Hall', city: 'New York, USA' },
            ].map((partner) => (
              <article
                key={partner.venue}
                className="bg-kawai-pearl px-10 py-14 flex flex-col items-center text-center"
              >
                {/* Ornamental top rule */}
                <span className="block w-8 h-px bg-kawai-gold/40 mb-8" />
                <h2
                  className="text-kawai-black font-light italic leading-tight mb-4"
                  style={{
                    fontFamily: 'var(--font-brand-luxury)',
                    fontSize: 'clamp(1.4rem, 2.2vw, 1.9rem)',
                  }}
                >
                  {partner.venue}
                </h2>
                <p
                  className="text-kawai-gold text-[9px] tracking-[0.4em] uppercase mb-4"
                  style={{ fontFamily: 'var(--font-brand-sans)', fontVariant: 'small-caps' }}
                >
                  {partner.city}
                </p>
                <span className="block w-8 h-px bg-kawai-neutral mb-4" />
                <p
                  className="text-kawai-muted text-[9px] tracking-[0.3em] uppercase"
                  style={{ fontFamily: 'var(--font-brand-sans)' }}
                >
                  Shigeru Kawai Artist Partner
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── INSTITUTIONS GRID ────────────────────────────────── */}
      <section className="bg-[#0a0a0a] px-6 py-28">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="flex items-end gap-8 mb-16">
            <div>
              <p
                className="text-kawai-gold text-[10px] tracking-[0.45em] uppercase mb-3"
                style={{ fontFamily: 'var(--font-brand-sans)' }}
              >
                Global Presence
              </p>
              <h2
                className="text-white font-light italic leading-none"
                style={{
                  fontFamily: 'var(--font-brand-luxury)',
                  fontSize: 'clamp(1.8rem, 4vw, 3rem)',
                }}
              >
                100+ Institutions Worldwide
              </h2>
            </div>
            <span className="hidden md:block flex-1 h-px bg-white/5 mb-1" />
          </div>

          {/* Static filter tabs — visual only */}
          <div className="flex flex-wrap gap-3 mb-16" aria-label="Filter by region (display only)">
            {['All', 'North America', 'Europe', 'Asia & Pacific'].map((tab) => (
              <span
                key={tab}
                className={
                  tab === 'All'
                    ? 'border border-kawai-gold/50 text-kawai-gold px-5 py-2 text-[9px] tracking-[0.3em] uppercase'
                    : 'border border-white/10 text-white/30 px-5 py-2 text-[9px] tracking-[0.3em] uppercase'
                }
                style={{ fontFamily: 'var(--font-brand-sans)' }}
              >
                {tab}
              </span>
            ))}
          </div>

          {/* Institutions by region */}
          <div className="space-y-16">
            {regionGroups.map(({ region, label }) => {
              const group = institutions.filter((i) => i.region === region)
              if (group.length === 0) return null
              return (
                <div key={region}>
                  {/* Region header */}
                  <div className="flex items-center gap-6 mb-8">
                    <span
                      className="text-kawai-gold text-[9px] tracking-[0.45em] uppercase"
                      style={{ fontFamily: 'var(--font-brand-sans)', fontVariant: 'small-caps' }}
                    >
                      {label}
                    </span>
                    <span className="flex-1 h-px bg-white/[0.06]" />
                    <span
                      className="text-white/20 text-[9px] tracking-wide"
                      style={{ fontFamily: 'var(--font-brand-sans)' }}
                    >
                      {group.length}
                    </span>
                  </div>

                  {/* Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.04]">
                    {group.map((institution) => (
                      <div
                        key={`${institution.name}-${institution.location}`}
                        className="bg-[#0a0a0a] hover:bg-[#0f0d09] px-7 py-6 transition-colors duration-300"
                      >
                        <p
                          className="text-white/80 font-light leading-snug mb-2"
                          style={{
                            fontFamily: 'var(--font-brand-luxury)',
                            fontSize: '1.05rem',
                          }}
                        >
                          {institution.name}
                        </p>
                        <p
                          className="text-kawai-gold text-[9px] tracking-[0.3em] uppercase"
                          style={{ fontFamily: 'var(--font-brand-sans)' }}
                        >
                          {institution.location}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          <p
            className="text-white/15 text-xs text-center mt-14 italic"
            style={{ fontFamily: 'var(--font-brand-luxury)' }}
          >
            Partial list of institutions currently using Shigeru Kawai instruments.
          </p>
        </div>
      </section>

      {/* ── INQUIRY SECTION ──────────────────────────────────── */}
      <section className="bg-kawai-pearl px-6 py-28">
        <div className="max-w-3xl mx-auto text-center">
          <p
            className="text-kawai-muted text-[10px] tracking-[0.45em] uppercase mb-6"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            Institutional Programs
          </p>
          <h2
            className="text-kawai-black font-light italic leading-tight mb-8"
            style={{
              fontFamily: 'var(--font-brand-luxury)',
              fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
            }}
          >
            Is Your Institution Considering Shigeru Kawai?
          </h2>

          <span className="block w-10 h-px bg-kawai-gold/40 mx-auto mb-8" />

          <p
            className="text-kawai-muted text-sm leading-relaxed mb-6"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            Our team specializes in institutional placement, including faculty consultation, space
            planning, and extended warranty programs for educational and performance institutions.
          </p>

          <p
            className="text-kawai-muted text-sm leading-relaxed mb-14"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            Every Shigeru Kawai institutional purchase includes a complimentary visit from a Master
            Piano Artisan — providing concert-level regulation, voicing, and tuning at your venue.
          </p>

          <Link
            href="/shigeru/contact"
            className="inline-flex items-center gap-3 border border-kawai-gold/40 hover:border-kawai-gold text-kawai-gold hover:bg-kawai-gold/5 px-10 py-4 text-[10px] tracking-[0.35em] uppercase transition-all duration-300"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            Contact Institutional Sales
          </Link>
        </div>
      </section>
    </div>
  )
}
