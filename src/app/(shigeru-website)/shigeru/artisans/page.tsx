import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Shigeru Kawai Master Piano Artisans | The Art of Piano Craftsmanship',
  description:
    'Shigeru Kawai Master Piano Artisans — the most esteemed rank in piano craftsmanship. Every new Shigeru Kawai owner receives an in-home visit from an elite MPA for concert-level regulation, voicing, and tuning.',
}

const craftPrinciples = [
  {
    word: 'Intuition',
    body: 'The ability to select the right wood, evaluate a hammer\'s density by feel, and hear what others cannot. Intuition is earned through decades of refinement — the capacity to discern between the merely satisfactory and the truly sublime.',
  },
  {
    word: 'Serenity',
    body: 'The creation process for a Shigeru Kawai piano takes three to five times longer than a standard instrument. The workshop is a place of unruffled focus. There is no rushing, no compromise — only the patient pursuit of perfection.',
  },
  {
    word: 'Rarity',
    body: 'Rigorous handwork and specially chosen materials keep Shigeru Kawai instruments rare in both character and quantity. Each piano that leaves the Ryuyo factory is a Limited Edition treasure, bearing the personal honor of Shigeru Kawai.',
  },
] as const

const artisans = [
  {
    name: 'David Reed',
    title: 'Master Piano Artisan, North America',
    bio: 'A lifelong pianist fascinated by the mechanics of acoustic pianos, David Reed is a newly certified Master Piano Artisan serving clients across North America. His deep musical background informs his approach to voicing and regulation.',
  },
  {
    name: 'Akinori Nakajima',
    title: 'Master Piano Artisan, North America',
    bio: 'With many years of expertise in precision tuning, regulation, and voicing at the concert level, Akinori Nakajima brings unparalleled skill and sensitivity to every Shigeru Kawai he touches.',
  },
] as const

export default function ArtisansPage() {
  return (
    <div className="bg-[#0a0a0a]">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative bg-[#0a0a0a] px-6 pt-24 pb-36 flex flex-col items-center text-center overflow-hidden">
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
            The Artisan
          </p>

          <h1
            className="text-white font-light italic leading-none mb-8"
            style={{
              fontFamily: 'var(--font-brand-luxury)',
              fontSize: 'clamp(3.5rem, 10vw, 8rem)',
            }}
          >
            Master Piano
            <br />
            Artisans
          </h1>

          <p
            className="text-white/30 text-xs tracking-[0.35em] uppercase"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            The Most Esteemed Rank in Piano Craftsmanship
          </p>
        </div>
      </section>

      {/* ── CRAFT PRINCIPLES ─────────────────────────────────── */}
      <section className="bg-kawai-pearl px-6 py-36">
        <div className="max-w-6xl mx-auto">
          <p
            className="text-kawai-charcoal/40 text-[10px] tracking-[0.45em] uppercase mb-20 text-center"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            The Three Principles
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-kawai-neutral/30">
            {craftPrinciples.map((principle) => (
              <div
                key={principle.word}
                className="bg-kawai-pearl px-10 py-14 flex flex-col"
              >
                {/* Large italic principle word in gold */}
                <span
                  className="text-kawai-gold font-light italic leading-none mb-6"
                  style={{
                    fontFamily: 'var(--font-brand-luxury)',
                    fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
                  }}
                >
                  {principle.word}
                </span>

                {/* Thin rule */}
                <span className="block w-12 h-px bg-kawai-gold/30 mb-7" />

                {/* Description */}
                <p
                  className="text-kawai-charcoal/65 text-sm leading-relaxed"
                  style={{ fontFamily: 'var(--font-brand-sans)' }}
                >
                  {principle.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MPA HOME VISIT ───────────────────────────────────── */}
      <section className="bg-[#0a0a0a] px-6 py-36">
        <div className="max-w-4xl mx-auto text-center">
          {/* Atmospheric glow behind the text */}
          <div className="relative">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(213,199,140,0.04) 0%, transparent 70%)',
              }}
            />

            <div className="relative z-10">
              <p
                className="text-kawai-gold text-[10px] tracking-[0.45em] uppercase mb-10"
                style={{ fontFamily: 'var(--font-brand-sans)' }}
              >
                An Enduring Honor
              </p>

              {/* Decorative top rule */}
              <span className="block h-px w-10 bg-kawai-gold/30 mx-auto mb-14" />

              <h2
                className="text-white font-light italic leading-tight mb-14"
                style={{
                  fontFamily: 'var(--font-brand-luxury)',
                  fontSize: 'clamp(2rem, 5vw, 4rem)',
                }}
              >
                An Enduring Honor
              </h2>

              <p
                className="text-white/50 leading-relaxed mx-auto"
                style={{
                  fontFamily: 'var(--font-brand-sans)',
                  fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)',
                  maxWidth: '36rem',
                }}
              >
                Shigeru Kawai&rsquo;s wish was that his honor be upheld among all who enter into
                his legacy. Every new Shigeru Kawai piano owner receives an extraordinary visit
                from an elite Master Piano Artisan within the first two years of ownership.
              </p>

              {/* Gold accent divider */}
              <div className="flex items-center justify-center gap-5 my-12">
                <span className="block h-px w-16 bg-kawai-gold/20" />
                <span className="block w-1 h-1 rounded-full bg-kawai-gold/50" />
                <span className="block h-px w-16 bg-kawai-gold/20" />
              </div>

              <p
                className="text-white/35 leading-relaxed mx-auto"
                style={{
                  fontFamily: 'var(--font-brand-sans)',
                  fontSize: 'clamp(0.85rem, 1.3vw, 1rem)',
                  maxWidth: '32rem',
                }}
              >
                Complete concert-level regulation, voicing, and tuning — provided as a personal
                gift from Shigeru Kawai himself.
              </p>

              {/* Decorative bottom rule */}
              <span className="block h-px w-10 bg-kawai-gold/30 mx-auto mt-14" />
            </div>
          </div>
        </div>
      </section>

      {/* ── ARTISAN PROFILES ─────────────────────────────────── */}
      <section className="bg-kawai-pearl px-6 py-36">
        <div className="max-w-6xl mx-auto">
          <p
            className="text-kawai-charcoal/40 text-[10px] tracking-[0.45em] uppercase mb-20 text-center"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            North America
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-kawai-neutral/30">
            {artisans.map((artisan) => (
              <div
                key={artisan.name}
                className="bg-kawai-pearl px-10 py-14 flex flex-col border-l-[2px] border-kawai-gold/30"
              >
                {/* Name */}
                <h3
                  className="text-kawai-black font-light italic leading-tight mb-3"
                  style={{
                    fontFamily: 'var(--font-brand-luxury)',
                    fontSize: 'clamp(1.6rem, 3vw, 2.25rem)',
                  }}
                >
                  {artisan.name}
                </h3>

                {/* Title in gold small-caps style */}
                <p
                  className="text-kawai-gold text-[10px] tracking-[0.35em] uppercase mb-7"
                  style={{ fontFamily: 'var(--font-brand-sans)' }}
                >
                  {artisan.title}
                </p>

                <span className="block w-8 h-px bg-kawai-gold/25 mb-7" />

                {/* Bio */}
                <p
                  className="text-kawai-charcoal/65 text-sm leading-relaxed"
                  style={{ fontFamily: 'var(--font-brand-sans)' }}
                >
                  {artisan.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE ROAD SECTION ─────────────────────────────────── */}
      <section className="bg-[#0a0a0a] px-6 py-36">
        <div className="max-w-3xl mx-auto text-center">
          <p
            className="text-kawai-gold text-[10px] tracking-[0.45em] uppercase mb-14"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            The Path
          </p>

          <span className="block h-px w-10 bg-kawai-gold/25 mx-auto mb-14" />

          <blockquote
            className="text-white/60 font-light italic leading-relaxed"
            style={{
              fontFamily: 'var(--font-brand-luxury)',
              fontSize: 'clamp(1.2rem, 2.3vw, 1.85rem)',
            }}
          >
            The road to Master Piano Artisan is long and arduous. A candidate must not only master
            every technical dimension of piano building and service — they must prove themselves
            in the world&rsquo;s most prestigious concert halls and at international piano
            competitions. The artisan&rsquo;s hands must be trusted by the world&rsquo;s finest
            pianists before they are entrusted with a Shigeru Kawai.
          </blockquote>

          <span className="block h-px w-10 bg-kawai-gold/25 mx-auto mt-14" />
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
            className="text-kawai-black font-light italic leading-tight mb-6"
            style={{
              fontFamily: 'var(--font-brand-luxury)',
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
            }}
          >
            The Artisan&rsquo;s Promise
          </h2>
          <p
            className="text-kawai-charcoal/50 text-sm leading-relaxed max-w-sm mx-auto mb-16"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            When you own a Shigeru Kawai, you enter into a personal covenant with the finest
            piano craftsmen alive.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/shigeru/contact"
              className="inline-flex items-center gap-3 border border-kawai-charcoal/20 hover:border-kawai-black text-kawai-black hover:bg-kawai-black/5 px-9 py-4 text-[10px] tracking-[0.3em] uppercase transition-all duration-300"
              style={{ fontFamily: 'var(--font-brand-sans)' }}
            >
              Schedule Your MPA Visit
            </Link>
            <Link
              href="/shigeru/technology"
              className="inline-flex items-center gap-3 border border-kawai-charcoal/10 hover:border-kawai-charcoal/30 text-kawai-charcoal/50 hover:text-kawai-charcoal/80 px-9 py-4 text-[10px] tracking-[0.3em] uppercase transition-all duration-300"
              style={{ fontFamily: 'var(--font-brand-sans)' }}
            >
              Explore the Technology
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
