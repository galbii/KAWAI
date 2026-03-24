import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Find a Shigeru Kawai Dealer | 45 Authorized Dealers Across North America',
  description:
    "Find an authorized Shigeru Kawai dealer near you. 45 dealers across the United States and Canada ready to introduce you to the world's finest handcrafted grand pianos.",
}

interface Dealer {
  name: string
  city: string
  state: string
  country: 'US' | 'Canada'
}

const dealers: Dealer[] = [
  { name: 'Alamo Music', city: 'Austin', state: 'TX', country: 'US' },
  { name: 'Alamo Music Center', city: 'San Antonio', state: 'TX', country: 'US' },
  { name: 'Artistic Pianos', city: 'San Marcos', state: 'CA', country: 'US' },
  { name: 'Atlantic Music Center', city: 'Melbourne', state: 'FL', country: 'US' },
  { name: 'Atlantic Music Center', city: 'Orlando', state: 'FL', country: 'US' },
  { name: 'AZ Piano', city: 'Phoenix', state: 'AZ', country: 'US' },
  { name: 'Boulder Piano Gallery', city: 'Boulder', state: 'CO', country: 'US' },
  { name: 'Brock Family Music', city: 'Iowa City', state: 'IA', country: 'US' },
  { name: "Cordogan's Pianoland", city: 'Geneva', state: 'IL', country: 'US' },
  { name: 'Ellis Piano', city: 'Birmingham', state: 'AL', country: 'US' },
  { name: 'England Piano & Organ', city: 'Atlanta', state: 'GA', country: 'US' },
  { name: 'Family Music Center', city: 'Henderson', state: 'NV', country: 'US' },
  { name: "Farley's House of Pianos", city: 'Madison', state: 'WI', country: 'US' },
  { name: 'Freeburg Pianos', city: 'Hendersonville', state: 'NC', country: 'US' },
  { name: 'Gilliam Music', city: 'Norman', state: 'OK', country: 'US' },
  { name: 'Hartland Piano', city: 'Hartland', state: 'WI', country: 'US' },
  { name: 'Henderson Music Company', city: 'Cincinnati', state: 'OH', country: 'US' },
  { name: 'Hilbert Piano', city: 'Bristol', state: 'VT', country: 'US' },
  { name: 'Kawai Piano Gallery', city: 'Houston', state: 'TX', country: 'US' },
  { name: 'Kawai Piano Gallery', city: 'Plano', state: 'TX', country: 'US' },
  { name: 'Kawai Piano Gallery by Herrin', city: 'Bluffton', state: 'SC', country: 'US' },
  { name: 'Kawai Piano Gallery of Michigan', city: 'Bloomfield Hills', state: 'MI', country: 'US' },
  { name: 'Kawai Piano Gallery of NY', city: 'Ozone Park', state: 'NY', country: 'US' },
  { name: 'Kawai Piano Gallery of Ohio', city: 'Beachwood', state: 'OH', country: 'US' },
  { name: 'Kawai Piano Gallery of Ohio', city: 'Columbus', state: 'OH', country: 'US' },
  { name: 'Kawai Piano Gallery of Sacramento', city: 'Sacramento', state: 'CA', country: 'US' },
  { name: "Kim's Piano", city: 'Stanton', state: 'CA', country: 'US' },
  { name: 'Lane Music', city: 'Germantown', state: 'TN', country: 'US' },
  { name: 'Lane Music', city: 'Brentwood', state: 'TN', country: 'US' },
  { name: 'Lindeblad Piano Restoration', city: 'Pine Brook', state: 'NJ', country: 'US' },
  { name: 'Maus Music', city: 'Raleigh', state: 'NC', country: 'US' },
  { name: 'North American Headquarters', city: 'Rancho Dominguez', state: 'CA', country: 'US' },
  { name: 'Piano Solutions', city: 'Carmel', state: 'IN', country: 'US' },
  { name: 'Portland Piano Company', city: 'Portland', state: 'OR', country: 'US' },
  { name: "Roger's Piano", city: 'Natick', state: 'MA', country: 'US' },
  { name: 'San Mateo Piano', city: 'San Mateo', state: 'CA', country: 'US' },
  { name: 'San Ramon Piano', city: 'Danville', state: 'CA', country: 'US' },
  { name: 'Summerhays Piano Source', city: 'Murray', state: 'UT', country: 'US' },
  { name: 'The Piano Company', city: 'Leesburg', state: 'VA', country: 'US' },
  { name: 'West Michigan Piano', city: 'Kentwood', state: 'MI', country: 'US' },
  // Canada
  { name: 'Loewen Piano House', city: 'Richmond', state: 'BC', country: 'Canada' },
  { name: 'Merriam Music', city: 'Oakville', state: 'ON', country: 'Canada' },
  { name: 'Piano Vertu', city: 'Montreal', state: 'QC', country: 'Canada' },
  { name: 'Standard Piano', city: 'Calgary', state: 'AB', country: 'Canada' },
]

const usDealers = dealers
  .filter((d) => d.country === 'US' && d.name !== 'North American Headquarters')
  .sort((a, b) => a.name.localeCompare(b.name))

const canadaDealers = dealers
  .filter((d) => d.country === 'Canada')
  .sort((a, b) => a.name.localeCompare(b.name))

export default function DealersPage() {
  return (
    <div className="bg-[#0a0a0a]">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-[60vh] flex flex-col items-center justify-center px-6 overflow-hidden pt-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(213,199,140,0.06) 0%, transparent 70%)',
          }}
        />
        <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
          <p
            className="text-kawai-gold text-[10px] tracking-[0.45em] uppercase mb-10"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            Authorized Dealers
          </p>
          <h1
            className="text-white font-light italic leading-[0.9] mb-8"
            style={{
              fontFamily: 'var(--font-brand-luxury)',
              fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
            }}
          >
            Find a Shigeru Kawai Dealer
          </h1>
          <div className="flex items-center justify-center gap-5 mb-8">
            <span className="block h-px w-16 bg-kawai-gold opacity-30" />
            <span
              className="text-kawai-gold text-[9px] tracking-[0.4em] uppercase opacity-60"
              style={{ fontFamily: 'var(--font-brand-sans)' }}
            >
              North America
            </span>
            <span className="block h-px w-16 bg-kawai-gold opacity-30" />
          </div>
          <p
            className="text-white/35 text-sm tracking-wide"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            45 authorized dealers across North America
          </p>
        </div>
      </section>

      {/* ── INTRO ────────────────────────────────────────────── */}
      <section className="bg-kawai-pearl px-6 py-28">
        <div className="max-w-3xl mx-auto text-center">
          <p
            className="text-kawai-charcoal/35 text-[10px] tracking-[0.45em] uppercase mb-8"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            The Experience
          </p>
          <span className="block w-8 h-px bg-kawai-gold/40 mx-auto mb-10" />
          <p
            className="text-kawai-black font-light italic leading-relaxed mb-8"
            style={{
              fontFamily: 'var(--font-brand-luxury)',
              fontSize: 'clamp(1.1rem, 2vw, 1.45rem)',
            }}
          >
            Experiencing a Shigeru Kawai in person is essential. The touch, the tone, the
            resonance — these are dimensions that no description can fully convey. Visit an
            authorized dealer and allow a Shigeru Kawai to speak for itself.
          </p>
          <span className="block w-8 h-px bg-kawai-gold/40 mx-auto mb-10" />
          <p
            className="text-kawai-charcoal/55 text-sm leading-relaxed"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            Every new Shigeru Kawai owner also receives an extraordinary in-home visit from an
            elite Master Piano Artisan within the first two years — complete concert-level
            regulation, voicing, and tuning, offered as a gift from Shigeru Kawai himself.
          </p>
        </div>
      </section>

      {/* ── US DEALERS ───────────────────────────────────────── */}
      <section className="bg-[#0a0a0a] px-6 py-28">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end gap-8 mb-16">
            <div>
              <p
                className="text-kawai-gold text-[10px] tracking-[0.45em] uppercase mb-3"
                style={{ fontFamily: 'var(--font-brand-sans)' }}
              >
                United States
              </p>
              <h2
                className="text-white font-light italic leading-none"
                style={{
                  fontFamily: 'var(--font-brand-luxury)',
                  fontSize: 'clamp(1.8rem, 4vw, 3rem)',
                }}
              >
                United States — {usDealers.length} Dealers
              </h2>
            </div>
            <span className="hidden md:block flex-1 h-px bg-white/5 mb-1" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.04]">
            {usDealers.map((dealer) => (
              <div
                key={`${dealer.name}-${dealer.city}-${dealer.state}`}
                className="bg-[#0a0a0a] hover:bg-[#0f0d09] px-7 py-6 transition-colors duration-300"
              >
                <p
                  className="text-white/80 font-light leading-snug mb-2"
                  style={{
                    fontFamily: 'var(--font-brand-luxury)',
                    fontSize: '1.05rem',
                  }}
                >
                  {dealer.name}
                </p>
                <p
                  className="text-kawai-gold text-[9px] tracking-[0.3em] uppercase"
                  style={{ fontFamily: 'var(--font-brand-sans)' }}
                >
                  {dealer.city}, {dealer.state}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CANADA DEALERS ───────────────────────────────────── */}
      <section className="bg-kawai-pearl px-6 py-28">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end gap-8 mb-16">
            <div>
              <p
                className="text-kawai-charcoal/35 text-[10px] tracking-[0.45em] uppercase mb-3"
                style={{ fontFamily: 'var(--font-brand-sans)' }}
              >
                Canada
              </p>
              <h2
                className="text-kawai-black font-light italic leading-none"
                style={{
                  fontFamily: 'var(--font-brand-luxury)',
                  fontSize: 'clamp(1.8rem, 4vw, 3rem)',
                }}
              >
                Canada — {canadaDealers.length} Dealers
              </h2>
            </div>
            <span className="hidden md:block flex-1 h-px bg-kawai-neutral mb-1" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-kawai-neutral/40">
            {canadaDealers.map((dealer) => (
              <div
                key={`${dealer.name}-${dealer.city}`}
                className="bg-kawai-pearl px-7 py-8 transition-colors duration-300 hover:bg-[#f5f0e8]"
              >
                <p
                  className="text-kawai-black font-light leading-snug mb-2"
                  style={{
                    fontFamily: 'var(--font-brand-luxury)',
                    fontSize: '1.05rem',
                  }}
                >
                  {dealer.name}
                </p>
                <p
                  className="text-kawai-gold text-[9px] tracking-[0.3em] uppercase"
                  style={{ fontFamily: 'var(--font-brand-sans)' }}
                >
                  {dealer.city}, {dealer.state}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HEADQUARTERS CALLOUT ─────────────────────────────── */}
      <section className="bg-[#0a0a0a] px-6 py-24">
        <div className="max-w-3xl mx-auto">
          <div className="border border-kawai-gold/30 p-10 md:p-14 text-center">
            {/* Gold ornament */}
            <span className="block w-8 h-px bg-kawai-gold/50 mx-auto mb-8" />
            <p
              className="text-kawai-gold text-[9px] tracking-[0.45em] uppercase mb-6"
              style={{ fontFamily: 'var(--font-brand-sans)' }}
            >
              North American Headquarters
            </p>
            <h3
              className="text-white font-light italic leading-tight mb-6"
              style={{
                fontFamily: 'var(--font-brand-luxury)',
                fontSize: 'clamp(1.4rem, 3vw, 2rem)',
              }}
            >
              Kawai America Corporation
            </h3>
            <p
              className="text-white/45 text-sm mb-2"
              style={{ fontFamily: 'var(--font-brand-sans)' }}
            >
              2055 E University Dr
            </p>
            <p
              className="text-white/45 text-sm mb-8"
              style={{ fontFamily: 'var(--font-brand-sans)' }}
            >
              Rancho Dominguez, CA 90220
            </p>
            <span className="block w-8 h-px bg-kawai-gold/30 mx-auto mb-8" />
            <p
              className="text-kawai-gold/70 text-sm tracking-wide"
              style={{ fontFamily: 'var(--font-brand-sans)' }}
            >
              Tel: +1 310-631-1771&ensp;&middot;&ensp;Press 3 for Sales
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="bg-[#0a0a0a] border-t border-white/[0.04] px-6 py-20">
        <div className="max-w-xl mx-auto text-center">
          <p
            className="text-white/25 text-sm leading-relaxed mb-10"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            Have questions before visiting a dealer? Our team is here to help you find the right
            Shigeru Kawai for your needs.
          </p>
          <Link
            href="/shigeru/contact"
            className="inline-flex items-center gap-3 border border-kawai-gold/35 hover:border-kawai-gold text-kawai-gold hover:bg-kawai-gold/5 px-10 py-4 text-[10px] tracking-[0.35em] uppercase transition-all duration-300"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  )
}
