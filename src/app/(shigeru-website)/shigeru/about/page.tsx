import type { Metadata } from 'next'
import Link from 'next/link'
import { getStaticAlternates } from '@/lib/site-context'

export const metadata: Metadata = {
  title: "About Shigeru Kawai | The Legacy of Japan's Premier Piano Maker",
  description:
    'The story of Shigeru Kawai — born July 28, 1922 in Shizuoka, Japan. Learn how he built the world\'s premier piano company, founded the Ryuyo Grand Piano Factory, and introduced the Shigeru Kawai piano line in 1999.',
  alternates: getStaticAlternates('/shigeru/about'),
}

const timelineMilestones = [
  {
    year: '1922',
    text: 'Born July 28, 1922 in the Shizuoka Prefecture of Japan.',
  },
  {
    year: '1946',
    text: "Entered the piano business as a young worker, learning from his father Koichi Kawai the 'methods of origin' by which pianos are built entirely by hand.",
  },
  {
    year: 'Legacy',
    text: "Koichi Kawai — known as 'Hatsumei Koichi' (Koichi the Inventor) — was the first person in Japan to design and build a complete piano action. He received the prestigious Blue Ribbon Medal from the Emperor of Japan.",
  },
  {
    year: '1955',
    text: 'At just 33 years of age, Shigeru assumed leadership of Kawai Musical Instruments following the passing of his father Koichi Kawai.',
  },
] as const

const achievements = [
  'Launched the Kawai Concert Series — introducing western classical music to Japan',
  'Built Kawai Music Schools across Japan',
  'Founded an educational institute for piano teacher training',
  'Established the Kawai Technical Institute for piano technicians',
  'Expanded Kawai pianos to over 80 countries by the 1970s',
  'Completed the Ryuyo Grand Piano Factory in 1980',
  'Introduced the Shigeru Kawai piano line in 1999 — placing his full name on the instruments',
] as const

const envStats = [
  {
    stat: '1997',
    description:
      'First piano factory in the world to receive ISO14001 environmental certification — the Ryuyo Grand Piano Factory',
  },
  {
    stat: '350,000+',
    description:
      'Seedlings planted through the Kawai Forest Project, with a goal of 500,000+ new trees by end of decade',
  },
] as const

export default function AboutPage() {
  return (
    <div className="bg-[#0a0a0a]">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative bg-[#0a0a0a] px-6 pt-24 pb-36 flex flex-col items-center text-center overflow-hidden">
        {/* Atmospheric glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 55% at 50% 35%, rgba(213,199,140,0.06) 0%, transparent 68%)',
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto">
          <p
            className="text-kawai-gold text-[10px] tracking-[0.45em] uppercase mb-10"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            The Legacy
          </p>

          <h1
            className="text-white font-light italic leading-none mb-8"
            style={{
              fontFamily: 'var(--font-brand-luxury)',
              fontSize: 'clamp(4rem, 12vw, 9rem)',
            }}
          >
            Shigeru Kawai
          </h1>

          <p
            className="text-white/30 text-xs tracking-[0.35em] uppercase"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            1922&nbsp;&nbsp;—&nbsp;&nbsp;A Life Devoted to the Piano
          </p>
        </div>
      </section>

      {/* ── BIOGRAPHY / TIMELINE ─────────────────────────────── */}
      <section className="bg-kawai-pearl px-6 py-36">
        <div className="max-w-5xl mx-auto">
          <p
            className="text-kawai-charcoal/40 text-[10px] tracking-[0.45em] uppercase mb-20 text-center"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            The Story
          </p>

          <div className="flex flex-col gap-0">
            {timelineMilestones.map((milestone, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start pb-16 last:pb-0"
              >
                {/* Year */}
                <div className="md:col-span-3 md:text-right pt-1">
                  <span
                    className="text-kawai-gold font-light italic leading-none"
                    style={{
                      fontFamily: 'var(--font-brand-luxury)',
                      fontSize: 'clamp(2rem, 4vw, 3rem)',
                    }}
                  >
                    {milestone.year}
                  </span>
                </div>

                {/* Divider line */}
                <div className="hidden md:flex md:col-span-1 flex-col items-center pt-3">
                  <span className="block w-px flex-1 bg-kawai-gold/20 min-h-full" />
                </div>

                {/* Description */}
                <div className="md:col-span-8 pt-1">
                  <p
                    className="text-kawai-charcoal/75 text-base leading-relaxed"
                    style={{ fontFamily: 'var(--font-brand-sans)' }}
                  >
                    {milestone.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ACHIEVEMENTS ─────────────────────────────────────── */}
      <section className="bg-[#0a0a0a] px-6 py-36">
        <div className="max-w-5xl mx-auto">
          <p
            className="text-kawai-gold text-[10px] tracking-[0.45em] uppercase mb-6 text-center"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            A Life of Achievement
          </p>
          <h2
            className="text-white font-light italic text-center leading-tight mb-20"
            style={{
              fontFamily: 'var(--font-brand-luxury)',
              fontSize: 'clamp(1.6rem, 3.5vw, 2.8rem)',
            }}
          >
            Building a Legacy for the World
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/[0.04]">
            {achievements.map((achievement) => (
              <div
                key={achievement}
                className="bg-[#0a0a0a] hover:bg-[#0f0d09] px-9 py-8 flex items-start gap-5 transition-colors duration-400"
              >
                <span
                  className="mt-2 block w-1 h-1 rounded-full bg-kawai-gold flex-shrink-0 opacity-70"
                  aria-hidden="true"
                />
                <p
                  className="text-white/60 text-sm leading-relaxed"
                  style={{ fontFamily: 'var(--font-brand-sans)' }}
                >
                  {achievement}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE NAME — PULL QUOTE ────────────────────────────── */}
      <section className="bg-kawai-pearl px-6 py-36">
        <div className="max-w-3xl mx-auto text-center">
          <span className="block h-px w-10 bg-kawai-gold/40 mx-auto mb-14" />
          <blockquote
            className="text-kawai-black font-light italic leading-relaxed"
            style={{
              fontFamily: 'var(--font-brand-luxury)',
              fontSize: 'clamp(1.25rem, 2.4vw, 1.9rem)',
            }}
          >
            &ldquo;In Japan, using one&rsquo;s full first and last name on a product is extremely
            rare — it represents the most profound personal commitment a craftsman can make. When
            Shigeru Kawai placed his name on these instruments in 1999, he staked his personal
            honor and legacy on every single piano that left the Ryuyo factory.&rdquo;
          </blockquote>
          <span className="block h-px w-10 bg-kawai-gold/40 mx-auto mt-14" />
        </div>
      </section>

      {/* ── ENVIRONMENTAL LEGACY ─────────────────────────────── */}
      <section className="bg-[#0a0a0a] px-6 py-36">
        <div className="max-w-5xl mx-auto">
          <p
            className="text-kawai-gold text-[10px] tracking-[0.45em] uppercase mb-6 text-center"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            Environmental Stewardship
          </p>
          <h2
            className="text-white font-light italic text-center leading-tight mb-20"
            style={{
              fontFamily: 'var(--font-brand-luxury)',
              fontSize: 'clamp(1.6rem, 3.5vw, 2.8rem)',
            }}
          >
            A Factory as a Living Promise
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/[0.04]">
            {envStats.map((item) => (
              <div
                key={item.stat}
                className="bg-[#0a0a0a] px-10 py-12 flex flex-col"
              >
                <span
                  className="text-kawai-gold font-light italic leading-none mb-6"
                  style={{
                    fontFamily: 'var(--font-brand-luxury)',
                    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                  }}
                >
                  {item.stat}
                </span>
                <span className="block w-8 h-px bg-white/[0.08] mb-6" />
                <p
                  className="text-white/50 text-sm leading-relaxed"
                  style={{ fontFamily: 'var(--font-brand-sans)' }}
                >
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="bg-kawai-pearl px-6 py-36">
        <div className="max-w-4xl mx-auto text-center">
          <p
            className="text-kawai-charcoal/40 text-[10px] tracking-[0.45em] uppercase mb-6"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            Continue the Journey
          </p>
          <h2
            className="text-kawai-black font-light italic leading-tight mb-16"
            style={{
              fontFamily: 'var(--font-brand-luxury)',
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
            }}
          >
            The Hands Behind Every Instrument
          </h2>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/shigeru/artisans"
              className="inline-flex items-center gap-3 border border-kawai-charcoal/20 hover:border-kawai-black text-kawai-black hover:bg-kawai-black/5 px-9 py-4 text-[10px] tracking-[0.3em] uppercase transition-all duration-300"
              style={{ fontFamily: 'var(--font-brand-sans)' }}
            >
              Meet the Artisans
            </Link>
            <Link
              href="/shigeru/technology"
              className="inline-flex items-center gap-3 border border-kawai-charcoal/10 hover:border-kawai-charcoal/30 text-kawai-charcoal/50 hover:text-kawai-charcoal/80 px-9 py-4 text-[10px] tracking-[0.3em] uppercase transition-all duration-300"
              style={{ fontFamily: 'var(--font-brand-sans)' }}
            >
              Discover the Technology
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
