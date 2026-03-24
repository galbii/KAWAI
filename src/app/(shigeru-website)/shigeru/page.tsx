import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Shigeru Kawai Grand Pianos | SK-2 to SK-EX | Handcrafted in Japan',
  description:
    'Shigeru Kawai grand pianos: six handcrafted models from the 5\'11" SK-2 salon grand to the 9\'1" SK-EX concert grand. Fewer than 20 SK-EX instruments are made each year. Find an authorized Shigeru Kawai dealer near you.',
}

const models = [
  {
    id: 'sk-2',
    name: 'SK-2',
    type: 'Classic Salon Grand',
    feet: "5' 11\"",
    cm: '180 cm',
    tagline: 'Choice of talented musicians, teachers, and demanding pianists worldwide.',
  },
  {
    id: 'sk-3',
    name: 'SK-3',
    type: 'Conservatory Grand',
    feet: "6' 2\"",
    cm: '188 cm',
    tagline: 'Regarded as some of the finest pianos available — admired globally.',
  },
  {
    id: 'sk-5',
    name: 'SK-5',
    type: 'Chamber Grand',
    feet: "6' 7\"",
    cm: '200 cm',
    tagline: 'Perfect for stately homes, professional venues, and intimate recital spaces.',
  },
  {
    id: 'sk-6',
    name: 'SK-6',
    type: 'Orchestra Grand',
    feet: "7' 0\"",
    cm: '214 cm',
    tagline: 'Sits proudly in the middle of the range — stability, touch, and rich tone.',
  },
  {
    id: 'sk-7',
    name: 'SK-7',
    type: 'Semi-Concert Grand',
    feet: "7' 6\"",
    cm: '229 cm',
    tagline: 'An incredible range of expression and brilliant dynamic presence.',
  },
  {
    id: 'sk-ex',
    name: 'SK-EX',
    type: 'Concert Grand',
    feet: "9' 1\"",
    cm: '278 cm',
    tagline: 'Fewer than 20 handcrafted each year. The pinnacle of the range.',
  },
] as const

const pillars = [
  {
    numeral: 'I',
    title: 'Unparalleled Legacy',
    body: "Born of a century-old covenant between craftsman and instrument, each Shigeru piano carries forward the unbroken line of Koichi Kawai\u2019s original dream \u2014 to build the finest piano the world has ever heard.",
  },
  {
    numeral: 'II',
    title: 'Exquisite Craftsmanship',
    body: 'The passion for excellence dwells deeply within the heart of every Shigeru artisan. Each piano takes three to five times longer to complete than a standard instrument — its soul shaped by unhurried, devoted hands.',
  },
  {
    numeral: 'III',
    title: 'Unrivaled Advancement',
    body: 'True artistry can never stop striving. The Shigeru Kawai R&D Laboratory continuously advances the science and soul of piano building — never compromising the pursuit of the sublime.',
  },
] as const

const technologies = [
  { name: 'Kigarashi Soundboards', detail: 'Aged by time and nature alone' },
  { name: 'Shiko Seion Hammers', detail: 'No heat, no artificial hardeners' },
  { name: 'Millennium III Action', detail: 'ABS-Carbon for precision control' },
  { name: 'Temaki Bass Strings', detail: 'Hand-wound by Kawai craftsmen' },
  { name: 'Concert Agraffes', detail: 'Machined from solid brass rods' },
  { name: 'Dual-Pivot Dampers', detail: 'Precise half-pedal management' },
]

export default function ShigeruPage() {
  return (
    <div className="bg-[#0a0a0a]">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden pt-24">
        {/* Radial atmospheric glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 35%, rgba(213,199,140,0.07) 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto">
          {/* Eyebrow label */}
          <p
            className="text-kawai-gold text-[10px] tracking-[0.45em] uppercase mb-12"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            The Premier Piano of Japan · Est. 1999
          </p>

          {/* Main wordmark */}
          <h1
            className="text-white leading-[0.88] mb-10 select-none"
            style={{ fontFamily: 'var(--font-brand-luxury)' }}
          >
            <span className="block font-light italic"
              style={{ fontSize: 'clamp(4.5rem, 14vw, 11rem)' }}>
              Shigeru
            </span>
            <span
              className="block font-light italic tracking-tight"
              style={{ fontSize: 'clamp(4.5rem, 14vw, 11rem)', marginTop: '-0.04em' }}
            >
              Kawai
            </span>
          </h1>

          {/* Ornamental rule */}
          <div className="flex items-center justify-center gap-5 mb-9">
            <span className="block h-px w-20 bg-kawai-gold opacity-40" />
            <span
              className="text-kawai-gold text-[10px] tracking-[0.4em] uppercase"
              style={{ fontFamily: 'var(--font-brand-sans)' }}
            >
              Grand Pianos
            </span>
            <span className="block h-px w-20 bg-kawai-gold opacity-40" />
          </div>

          {/* Tagline */}
          <p
            className="text-white/30 text-xs tracking-[0.3em] uppercase"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            Handcrafted&nbsp;&nbsp;·&nbsp;&nbsp;Elegance&nbsp;&nbsp;·&nbsp;&nbsp;Excellence
          </p>
        </div>

        {/* Scroll nudge */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <span
            className="text-white/15 text-[9px] tracking-[0.4em] uppercase"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            Scroll
          </span>
          <span className="block w-px h-14 bg-gradient-to-b from-white/15 to-transparent" />
        </div>
      </section>

      {/* ── OPENING QUOTE ────────────────────────────────────── */}
      <section className="bg-[#0d0b08] px-6 py-36">
        <div className="max-w-2xl mx-auto text-center">
          <span className="block h-px w-10 bg-kawai-gold opacity-40 mx-auto mb-14" />
          <blockquote
            className="text-white/85 font-light italic leading-relaxed"
            style={{
              fontFamily: 'var(--font-brand-luxury)',
              fontSize: 'clamp(1.35rem, 2.5vw, 2rem)',
            }}
          >
            &ldquo;A Shigeru piano is much more than the intelligent application of material, labor and
            design. It is an art form born not from the head, but from the heart — an instrument
            that brings itself to life.&rdquo;
          </blockquote>
          <span className="block h-px w-10 bg-kawai-gold opacity-40 mx-auto mt-14" />
        </div>
      </section>

      {/* ── THREE PILLARS ─────────────────────────────────────── */}
      <section className="bg-kawai-pearl px-6 py-36">
        <div className="max-w-6xl mx-auto">
          <p
            className="text-kawai-charcoal/40 text-[10px] tracking-[0.45em] uppercase text-center mb-20"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            The Foundation
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-10">
            {pillars.map((pillar) => (
              <article key={pillar.numeral} className="flex flex-col">
                <span
                  className="text-kawai-gold font-light italic mb-7 leading-none opacity-75"
                  style={{ fontFamily: 'var(--font-brand-luxury)', fontSize: '3.5rem' }}
                  aria-hidden="true"
                >
                  {pillar.numeral}
                </span>
                <span className="block w-8 h-px bg-kawai-charcoal/20 mb-7" />
                <h3
                  className="text-kawai-black font-light leading-tight mb-5"
                  style={{
                    fontFamily: 'var(--font-brand-luxury)',
                    fontSize: 'clamp(1.25rem, 1.8vw, 1.6rem)',
                  }}
                >
                  {pillar.title}
                </h3>
                <p
                  className="text-kawai-charcoal/65 text-sm leading-relaxed"
                  style={{ fontFamily: 'var(--font-brand-sans)' }}
                >
                  {pillar.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── SIX MODELS ────────────────────────────────────────── */}
      <section id="models" className="bg-[#0a0a0a] px-6 py-36">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="flex items-end gap-8 mb-20">
            <div>
              <p
                className="text-kawai-gold text-[10px] tracking-[0.45em] uppercase mb-3"
                style={{ fontFamily: 'var(--font-brand-sans)' }}
              >
                The Collection
              </p>
              <h2
                className="text-white font-light italic leading-none"
                style={{
                  fontFamily: 'var(--font-brand-luxury)',
                  fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
                }}
              >
                Six Grand Pianos
              </h2>
            </div>
            <span className="hidden md:block flex-1 h-px bg-white/5 mb-1" />
          </div>

          {/* Model grid — 1-col on mobile, 2-col on sm, 3-col on lg */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.04]">
            {models.map((model) => (
              <div
                key={model.id}
                className="group bg-[#0a0a0a] hover:bg-[#0f0d09] p-10 flex flex-col transition-colors duration-500 cursor-default"
              >
                {/* Model name */}
                <span
                  className="text-white group-hover:text-kawai-gold font-light italic leading-none transition-colors duration-500 mb-6"
                  style={{ fontFamily: 'var(--font-brand-luxury)', fontSize: '3.5rem' }}
                >
                  {model.name}
                </span>

                <span className="block w-full h-px bg-white/[0.06] mb-5" />

                {/* Type */}
                <p
                  className="text-kawai-gold text-[10px] tracking-[0.3em] uppercase mb-3"
                  style={{ fontFamily: 'var(--font-brand-sans)' }}
                >
                  {model.type}
                </p>

                {/* Dimensions */}
                <p
                  className="text-white/25 text-xs mb-6 tracking-wide"
                  style={{ fontFamily: 'var(--font-brand-sans)' }}
                >
                  {model.feet}&ensp;/&ensp;{model.cm}
                </p>

                {/* Tagline */}
                <p
                  className="text-white/40 text-sm font-light italic leading-relaxed mt-auto"
                  style={{ fontFamily: 'var(--font-brand-luxury)' }}
                >
                  {model.tagline}
                </p>
              </div>
            ))}
          </div>

          {/* Footnote */}
          <p
            className="text-white/20 text-xs mt-8 text-right tracking-wide"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            All models include the Millennium III ABS-Carbon action and a 10-year transferrable warranty.
          </p>
        </div>
      </section>

      {/* ── CRAFTSMANSHIP / TECHNOLOGY ───────────────────────── */}
      <section id="craftsmanship" className="bg-kawai-pearl px-6 py-36">
        <div className="max-w-6xl mx-auto">
          <p
            className="text-kawai-charcoal/40 text-[10px] tracking-[0.45em] uppercase text-center mb-6"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            Unrivaled Advancement
          </p>
          <h2
            className="text-kawai-black font-light italic text-center mb-20 leading-tight"
            style={{
              fontFamily: 'var(--font-brand-luxury)',
              fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
            }}
          >
            Twelve Innovations. One Vision.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
            {technologies.map((tech) => (
              <div key={tech.name} className="flex items-start gap-5">
                <span className="mt-1.5 block w-1 h-1 rounded-full bg-kawai-gold flex-shrink-0 opacity-70" />
                <div>
                  <p
                    className="text-kawai-black text-sm font-medium leading-snug mb-1"
                    style={{ fontFamily: 'var(--font-brand-sans)' }}
                  >
                    {tech.name}
                  </p>
                  <p
                    className="text-kawai-charcoal/50 text-xs leading-relaxed italic"
                    style={{ fontFamily: 'var(--font-brand-luxury)' }}
                  >
                    {tech.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p
            className="text-kawai-charcoal/35 text-xs text-center mt-16 italic"
            style={{ fontFamily: 'var(--font-brand-luxury)' }}
          >
            Plus six additional proprietary technologies developed exclusively for Shigeru Kawai instruments.
          </p>
        </div>
      </section>

      {/* ── ARTIST QUOTE ──────────────────────────────────────── */}
      <section id="artist" className="bg-[#0a0a0a] px-6 py-36">
        <div className="max-w-3xl mx-auto text-center">
          <span className="block h-px w-10 bg-kawai-gold opacity-40 mx-auto mb-16" />
          <blockquote
            className="text-white/80 font-light italic leading-relaxed"
            style={{
              fontFamily: 'var(--font-brand-luxury)',
              fontSize: 'clamp(1.5rem, 3vw, 2.4rem)',
            }}
          >
            &ldquo;I insist on a Shigeru Kawai for my recordings, my concerts and my home. It is
            the only piano I want to hear my music played on.&rdquo;
          </blockquote>
          <div className="flex items-center justify-center gap-5 mt-12">
            <span className="block h-px w-8 bg-white/10" />
            <p
              className="text-white/35 text-[10px] tracking-[0.35em] uppercase"
              style={{ fontFamily: 'var(--font-brand-sans)' }}
            >
              Adrian Farrugia&nbsp;&nbsp;·&nbsp;&nbsp;Jazz Pianist
            </p>
            <span className="block h-px w-8 bg-white/10" />
          </div>
        </div>
      </section>

      {/* ── MPA / ARTISANS ────────────────────────────────────── */}
      <section className="bg-kawai-pearl px-6 py-36">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div>
            <p
              className="text-kawai-charcoal/40 text-[10px] tracking-[0.45em] uppercase mb-6"
              style={{ fontFamily: 'var(--font-brand-sans)' }}
            >
              The Artisan
            </p>
            <h2
              className="text-kawai-black font-light italic leading-tight mb-8"
              style={{
                fontFamily: 'var(--font-brand-luxury)',
                fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
              }}
            >
              Master Piano Artisans
            </h2>
            <p
              className="text-kawai-charcoal/65 text-sm leading-relaxed mb-6"
              style={{ fontFamily: 'var(--font-brand-sans)' }}
            >
              The Master Piano Artisan designation is the most esteemed rank in piano craftsmanship.
              Each MPA has proven themselves in the world&apos;s most prestigious concert halls and
              international competitions.
            </p>
            <p
              className="text-kawai-charcoal/65 text-sm leading-relaxed"
              style={{ fontFamily: 'var(--font-brand-sans)' }}
            >
              Every new Shigeru Kawai owner receives an extraordinary in-home visit from an elite
              MPA within the first two years — complete concert-level regulation, voicing, and tuning,
              offered as a gift from Shigeru Kawai himself.
            </p>
          </div>
          <div className="flex flex-col gap-8 pt-2">
            {[
              {
                name: 'David Reed',
                role: 'Master Piano Artisan',
                region: 'North America',
              },
              {
                name: 'Akinori Nakajima',
                role: 'Master Piano Artisan',
                region: 'North America',
              },
            ].map((artisan) => (
              <div key={artisan.name} className="border-l-2 border-kawai-gold/30 pl-6">
                <p
                  className="text-kawai-black font-medium text-base mb-1"
                  style={{ fontFamily: 'var(--font-brand-sans)' }}
                >
                  {artisan.name}
                </p>
                <p
                  className="text-kawai-charcoal/50 text-xs tracking-wide"
                  style={{ fontFamily: 'var(--font-brand-sans)' }}
                >
                  {artisan.role}&ensp;·&ensp;{artisan.region}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA / FIND A DEALER ───────────────────────────────── */}
      <section className="bg-[#0a0a0a] px-6 py-36">
        <div className="max-w-xl mx-auto text-center">
          <p
            className="text-kawai-gold text-[10px] tracking-[0.45em] uppercase mb-6"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            Experience Shigeru Kawai
          </p>
          <h2
            className="text-white font-light italic leading-tight mb-6"
            style={{
              fontFamily: 'var(--font-brand-luxury)',
              fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            }}
          >
            Find an Authorized Dealer
          </h2>
          <p
            className="text-white/35 text-sm leading-relaxed mb-14 max-w-sm mx-auto"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            45 authorized dealers across North America are ready to introduce you to the world&apos;s
            finest handcrafted grand pianos.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/find-a-dealer"
              className="inline-flex items-center gap-3 border border-kawai-gold/35 hover:border-kawai-gold text-kawai-gold hover:bg-kawai-gold/5 px-9 py-4 text-[10px] tracking-[0.3em] uppercase transition-all duration-300"
              style={{ fontFamily: 'var(--font-brand-sans)' }}
            >
              Locate a Dealer
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 border border-white/10 hover:border-white/25 text-white/35 hover:text-white/60 px-9 py-4 text-[10px] tracking-[0.3em] uppercase transition-all duration-300"
              style={{ fontFamily: 'var(--font-brand-sans)' }}
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* ── MICROSITE FOOTER ─────────────────────────────────── */}
      <footer className="bg-[#0a0a0a] border-t border-white/[0.04] px-6 py-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p
            className="text-white/15 text-[10px] tracking-[0.3em] uppercase"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            Shigeru Kawai
          </p>
          <p
            className="text-white/15 text-xs"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            © 2026 Kawai Musical Instruments. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
