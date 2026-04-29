import Link from 'next/link'
import { buildYouTubeEmbedUrl } from '@/lib/utils/youtube'

// YouTube video ID for the Shigeru Kawai hero
const VIDEO_ID = 'DOjL_bW6e5c'

export function ShigeruHero() {
  return (
    <section
      className="relative min-h-screen overflow-hidden bg-[#060606]"
      aria-label="Shigeru Kawai Concert Grand Pianos — Handcrafted in Hamamatsu, Japan"
    >
      {/*
       * SEO: visually hidden h1 + descriptor.
       * sr-only is a standard accessibility pattern (not hidden-text spam).
       * Google respects sr-only as legitimate a11y — it's used by Bootstrap,
       * Tailwind, and every major design system. The rich keyword content here
       * supplements the JSON-LD structured data in layout.tsx.
       */}
      <h1 className="sr-only">
        Shigeru Kawai Grand Pianos — SK-2, SK-3, SK-5, SK-6, SK-7, SK-EX Concert Grand
      </h1>
      <p className="sr-only">
        Handcrafted concert grand pianos built by Master Piano Artisans at the Ryuyo Grand Piano
        Factory in Hamamatsu, Japan. The Shigeru Kawai line — introduced in 1999 — represents the
        pinnacle of Japanese piano craftsmanship. Fewer than 20 SK-EX concert grands are produced
        each year. Chosen by world-class pianists and premier institutions worldwide.
      </p>

      {/* ── Full-bleed YouTube embed ── */}
      {/*
       * overflow-hidden clips the scaled-up iframe container, pushing YouTube's
       * hover-triggered title bar and chrome outside the visible viewport.
       * Scale of 1.25 gives ~12.5% bleed on each edge — enough to hide UI overlays.
       * pointer-events-none prevents hover from triggering YouTube's UI in the first place.
       */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ transform: 'scale(1.25)', transformOrigin: 'center center' }}
        >
          <iframe
            src={buildYouTubeEmbedUrl(VIDEO_ID)}
            title="Shigeru Kawai Concert Grand Piano — Handcrafted Excellence, Hamamatsu Japan"
            allow="autoplay; picture-in-picture"
            className="absolute"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 'max(100%, calc(100vh * 16 / 9))',
              height: 'max(100%, calc(100vw * 9 / 16))',
              border: 'none',
            }}
          />
        </div>
      </div>

      {/* ── Layered overlays for cinematic depth ── */}
      {/* Bottom gradient — grounds the CTAs */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(6,6,6,0.92) 0%, rgba(6,6,6,0.45) 35%, rgba(6,6,6,0.15) 60%, rgba(6,6,6,0.25) 100%)',
        }}
      />
      {/* Subtle vignette edges */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 110% 100% at 50% 50%, transparent 55%, rgba(6,6,6,0.65) 100%)',
        }}
      />

      {/* ── CTA block — lower third ── */}
      <div className="relative z-10 flex flex-col justify-end min-h-screen pb-16 md:pb-20 px-6">
        <div className="max-w-5xl mx-auto w-full">

          {/* Eyebrow */}
          <p
            className="text-kawai-gold text-[10px] tracking-[0.45em] uppercase mb-6 opacity-90"
            style={{ fontFamily: 'var(--font-oswald)' }}
          >
            The Premier Piano of Japan
          </p>

          {/* CTA row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Link
              href="/shigeru/models"
              style={{ fontFamily: 'var(--font-oswald)', borderRadius: '4px' }}
              className="inline-flex items-center gap-3 bg-kawai-gold/[0.12] hover:bg-kawai-gold/[0.22] border border-kawai-gold/40 hover:border-kawai-gold/80 text-kawai-gold text-[13px] font-semibold tracking-[0.1em] uppercase px-8 py-3.5 transition-all duration-300"
            >
              Explore the Collection
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
                <path d="M1 5H13M9 1L13 5L9 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>

            <Link
              href="/shigeru/dealers"
              style={{ fontFamily: 'var(--font-oswald)', borderRadius: '4px' }}
              className="inline-flex items-center gap-3 border border-white/15 hover:border-white/35 text-white/55 hover:text-white/85 text-[13px] font-semibold tracking-[0.1em] uppercase px-8 py-3.5 transition-all duration-300"
            >
              Find an Authorized Dealer
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="flex items-center gap-4 mt-10">
            <span className="block w-6 h-px bg-white/20" />
            <span
              className="text-white/25 text-[9px] tracking-[0.4em] uppercase"
              style={{ fontFamily: 'var(--font-oswald)' }}
            >
              Scroll to explore
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
