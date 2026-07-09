import type { Metadata } from 'next'
import Link from 'next/link'
import { getStaticAlternates } from '@/lib/site-context'

export const metadata: Metadata = {
  title: 'Shigeru Kawai Artists | Pianists & Testimonials',
  description:
    "Shigeru Kawai is applauded by many of the world's most talented pianists. Explore artist testimonials and the complete roster of 25+ Shigeru Kawai artists including Alexander Kobrin, David Lanz, Joe Bongiorno, and more.",
  alternates: getStaticAlternates('/shigeru/artists'),
}

const artists = [
  { name: 'Alexander Kobrin', role: 'Pianist' },
  { name: 'Adrean Farrugia', role: 'Jazz Pianist' },
  { name: 'Joe Bongiorno', role: 'Solo Piano Artist' },
  { name: 'Dr. Grace Fong', role: 'Director of Keyboard Studies' },
  { name: 'Dr. David Korevaar', role: 'Concert Pianist' },
  { name: 'Yuko Maruyama', role: 'Jazz Pianist/Composer' },
  { name: 'Dr. Scott Watkins', role: 'Associate Professor of Piano, Jacksonville University' },
  { name: 'David Lanz', role: 'Grammy-nominated New Age Pianist' },
  { name: 'Earl Wild', role: 'Legendary Pianist' },
  { name: 'Junko Ueno Garrett', role: 'Concert Pianist' },
  { name: 'John Chen', role: 'Winner, 2004 Sydney International Piano Competition' },
  { name: 'Michael Kieran Harvey', role: 'Concert Pianist' },
  { name: 'David Hicken', role: 'Contemporary Pianist & Composer' },
  { name: 'Richard Atkins', role: 'Shigeru Kawai Artist' },
  { name: 'Dave Bradshaw Jr.', role: 'Jazz Pianist' },
  { name: 'Hyeree Roux', role: 'Concert Pianist' },
  { name: 'Diego Caetano', role: 'Shigeru Kawai Artist' },
  { name: 'Timothy Brown', role: 'Shigeru Kawai Artist' },
  { name: 'Dr. Alexander Wasserman', role: 'Assistant Professor of Music, Reinhardt University' },
  { name: 'Dr. Andrew Park', role: 'Shigeru Kawai Artist' },
  { name: 'Dr. Makiko Hirata', role: 'Shigeru Kawai Artist' },
  { name: 'Cameron Cody', role: 'Shigeru Kawai Artist' },
  { name: 'Dr. William M. Skoog', role: 'Shigeru Kawai Artist' },
  { name: 'Jerico Vasquez', role: 'Shigeru Kawai Artist' },
  { name: 'Dr. Yan Shen', role: 'Shigeru Kawai Artist' },
  { name: 'David Nevue', role: 'Shigeru Kawai Artist' },
] as const

const testimonials = [
  {
    id: 'bongiorno',
    quote:
      'My Shigeru SK-7 has given me a whole new level of expression, control, tone and clarity that I never dreamed was possible. I am undoubtedly a better composer and performer because of this world class instrument.',
    name: 'Joe Bongiorno',
    role: 'Solo Piano Artist',
  },
  {
    id: 'hicken',
    quote:
      "I've had the privilege of playing many of the world's finest pianos. However, the action of the Shigeru Kawai is far superior to anything I have experienced. It allows my fingers to connect with the very soul of an instrument whose timbre and resonance are absolutely breathtaking. Playing this instrument is pure joy!",
    name: 'David Hicken',
    role: 'Contemporary Pianist & Composer',
  },
  {
    id: 'lanz',
    quote:
      'Ever since I played a Shigeru Kawai piano for the first time years ago, I\'ve dreamed of owning one — and now I do. Some dreams really do come true.',
    name: 'David Lanz',
    role: 'Grammy-Nominated New Age Pianist',
  },
  {
    id: 'garrett',
    quote:
      'The Shigeru piano always gives me inspiration to create music at a very high level. I love its honest and transparent sound.',
    name: 'Junko Ueno Garrett',
    role: 'Concert Pianist',
  },
  {
    id: 'farrugia',
    quote:
      'I insist on a Shigeru Kawai for my recordings, my concerts and my home. It is the only piano I want to hear my music played on.',
    name: 'Adrian Farrugia',
    role: 'Jazz Pianist',
  },
] as const

const aggregateRatingSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Shigeru Kawai Grand Pianos',
  brand: { '@type': 'Brand', name: 'Shigeru Kawai' },
  description: 'Premium handcrafted grand pianos from Japan',
  review: [
    {
      '@type': 'Review',
      reviewBody: 'My Shigeru SK-7 has given me a whole new level of expression...',
      author: { '@type': 'Person', name: 'Joe Bongiorno' },
      reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
    },
  ],
}

export default function ArtistsPage() {
  return (
    <div className="bg-[#0a0a0a]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aggregateRatingSchema) }}
      />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative bg-[#0a0a0a] px-6 pt-24 pb-32 flex flex-col items-center text-center overflow-hidden">
        {/* Atmospheric glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 50% at 50% 30%, rgba(213,199,140,0.06) 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto">
          <p
            className="text-kawai-gold text-[10px] tracking-[0.45em] uppercase mb-10"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            Shigeru Kawai Artists
          </p>

          <h1
            className="text-white font-light italic leading-tight mb-10"
            style={{
              fontFamily: 'var(--font-brand-luxury)',
              fontSize: 'clamp(2.4rem, 6vw, 5rem)',
            }}
          >
            Applauded by the World&rsquo;s
            <br />
            Most Talented Pianists
          </h1>

          {/* Gold rule separator */}
          <div className="flex items-center justify-center gap-5">
            <span className="block h-px w-16 bg-kawai-gold opacity-30" />
            <span
              className="block w-1 h-1 rounded-full bg-kawai-gold opacity-50"
              aria-hidden="true"
            />
            <span className="block h-px w-16 bg-kawai-gold opacity-30" />
          </div>
        </div>
      </section>

      {/* ── FEATURED QUOTES — 3 EDITORIAL ──────────────────── */}
      <section className="bg-kawai-pearl px-6 py-32">
        <div className="max-w-6xl mx-auto space-y-28">

          {/* Quote 1 — left-weighted */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-8 md:col-start-1">
              <span
                className="block text-kawai-gold/30 font-light italic leading-none mb-6 select-none"
                style={{ fontFamily: 'var(--font-brand-luxury)', fontSize: '5rem' }}
                aria-hidden="true"
              >
                &ldquo;
              </span>
              <blockquote
                className="text-kawai-black font-light italic leading-relaxed"
                style={{
                  fontFamily: 'var(--font-brand-luxury)',
                  fontSize: 'clamp(1.2rem, 2.2vw, 1.7rem)',
                }}
              >
                {testimonials[0].quote}
              </blockquote>
              <div className="flex items-center gap-4 mt-8">
                <span className="block h-px w-8 bg-kawai-gold/50" />
                <p
                  className="text-kawai-gold text-[10px] tracking-[0.35em] uppercase"
                  style={{ fontFamily: 'var(--font-brand-sans)' }}
                >
                  {testimonials[0].name}&nbsp;&nbsp;·&nbsp;&nbsp;{testimonials[0].role}
                </p>
              </div>
            </div>
          </div>

          {/* Quote 2 — centered */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-10 md:col-start-2 text-center">
              <blockquote
                className="text-kawai-charcoal/80 font-light italic leading-relaxed"
                style={{
                  fontFamily: 'var(--font-brand-luxury)',
                  fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
                }}
              >
                &ldquo;{testimonials[1].quote}&rdquo;
              </blockquote>
              <div className="flex items-center justify-center gap-4 mt-8">
                <span className="block h-px w-8 bg-kawai-gold/50" />
                <p
                  className="text-kawai-gold text-[10px] tracking-[0.35em] uppercase"
                  style={{ fontFamily: 'var(--font-brand-sans)' }}
                >
                  {testimonials[1].name}&nbsp;&nbsp;·&nbsp;&nbsp;{testimonials[1].role}
                </p>
                <span className="block h-px w-8 bg-kawai-gold/50" />
              </div>
            </div>
          </div>

          {/* Quote 5 — right-weighted */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-8 md:col-start-5 text-right">
              <blockquote
                className="text-kawai-black font-light italic leading-relaxed"
                style={{
                  fontFamily: 'var(--font-brand-luxury)',
                  fontSize: 'clamp(1.2rem, 2.2vw, 1.7rem)',
                }}
              >
                &ldquo;{testimonials[4].quote}&rdquo;
              </blockquote>
              <div className="flex items-center justify-end gap-4 mt-8">
                <p
                  className="text-kawai-gold text-[10px] tracking-[0.35em] uppercase"
                  style={{ fontFamily: 'var(--font-brand-sans)' }}
                >
                  {testimonials[4].name}&nbsp;&nbsp;·&nbsp;&nbsp;{testimonials[4].role}
                </p>
                <span className="block h-px w-8 bg-kawai-gold/50" />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── FULL ARTIST ROSTER ────────────────────────────────── */}
      <section className="bg-[#0a0a0a] px-6 py-32">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end gap-8 mb-20">
            <div>
              <p
                className="text-kawai-gold text-[10px] tracking-[0.45em] uppercase mb-3"
                style={{ fontFamily: 'var(--font-brand-sans)' }}
              >
                The Roster
              </p>
              <h2
                className="text-white font-light leading-none tracking-[0.04em]"
                style={{
                  fontFamily: 'var(--font-oswald)',
                  fontSize: 'clamp(1.8rem, 4vw, 3rem)',
                }}
              >
                Shigeru Kawai Artists
              </h2>
            </div>
            <span className="hidden md:block flex-1 h-px bg-white/[0.04] mb-1" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.04]">
            {artists.map((artist) => (
              <article
                key={artist.name}
                className="bg-[#0a0a0a] hover:bg-[#0f0d09] px-10 py-10 flex flex-col transition-colors duration-400"
              >
                <span className="block w-6 h-px bg-kawai-gold/40 mb-6" />
                <p
                  className="text-white font-semibold leading-snug mb-3 tracking-[0.04em]"
                  style={{
                    fontFamily: 'var(--font-oswald)',
                    fontSize: 'clamp(1.15rem, 1.8vw, 1.4rem)',
                  }}
                >
                  {artist.name}
                </p>
                <p
                  className="text-kawai-gold tracking-[0.3em] uppercase leading-relaxed"
                  style={{ fontFamily: 'var(--font-oswald)', fontSize: '11px' }}
                >
                  {artist.role}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── TWO MORE QUOTES ──────────────────────────────────── */}
      <section className="bg-kawai-pearl px-6 py-32">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

          {/* Quote 3 — David Lanz */}
          <div className="flex flex-col">
            <span className="block h-px w-10 bg-kawai-gold/40 mb-10" />
            <blockquote
              className="text-kawai-black font-light italic leading-relaxed flex-1"
              style={{
                fontFamily: 'var(--font-brand-luxury)',
                fontSize: 'clamp(1.15rem, 2vw, 1.55rem)',
              }}
            >
              &ldquo;{testimonials[2].quote}&rdquo;
            </blockquote>
            <div className="flex items-center gap-4 mt-10">
              <span className="block h-px w-6 bg-kawai-gold/50" />
              <p
                className="text-kawai-gold text-[9px] tracking-[0.35em] uppercase"
                style={{ fontFamily: 'var(--font-brand-sans)' }}
              >
                {testimonials[2].name}&nbsp;&nbsp;·&nbsp;&nbsp;{testimonials[2].role}
              </p>
            </div>
          </div>

          {/* Quote 4 — Junko Ueno Garrett */}
          <div className="flex flex-col md:pt-16">
            <span className="block h-px w-10 bg-kawai-gold/40 mb-10" />
            <blockquote
              className="text-kawai-black font-light italic leading-relaxed flex-1"
              style={{
                fontFamily: 'var(--font-brand-luxury)',
                fontSize: 'clamp(1.15rem, 2vw, 1.55rem)',
              }}
            >
              &ldquo;{testimonials[3].quote}&rdquo;
            </blockquote>
            <div className="flex items-center gap-4 mt-10">
              <span className="block h-px w-6 bg-kawai-gold/50" />
              <p
                className="text-kawai-gold text-[9px] tracking-[0.35em] uppercase"
                style={{ fontFamily: 'var(--font-brand-sans)' }}
              >
                {testimonials[3].name}&nbsp;&nbsp;·&nbsp;&nbsp;{testimonials[3].role}
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="bg-[#0a0a0a] px-6 py-36">
        <div className="max-w-xl mx-auto text-center">
          <p
            className="text-kawai-gold text-[10px] tracking-[0.45em] uppercase mb-6"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            Join the Family
          </p>
          <h2
            className="text-white font-light italic leading-tight mb-8"
            style={{
              fontFamily: 'var(--font-brand-luxury)',
              fontSize: 'clamp(1.8rem, 4.5vw, 3rem)',
            }}
          >
            Become a Shigeru Kawai Artist
          </h2>
          <p
            className="text-white/35 text-sm leading-relaxed mb-14 max-w-sm mx-auto"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            The Shigeru Kawai Artist program unites an extraordinary community of pianists
            who share a commitment to the highest standards of musical excellence. If your
            artistry demands an instrument without compromise, we&rsquo;d love to hear from you.
          </p>

          <Link
            href="/shigeru/models"
            className="inline-flex items-center gap-3 border border-kawai-gold/35 hover:border-kawai-gold text-kawai-gold hover:bg-kawai-gold/5 px-9 py-4 text-[10px] tracking-[0.3em] uppercase transition-all duration-300"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            Find Your Piano
          </Link>
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
