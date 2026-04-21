'use client'

import Image from 'next/image'
import Link from 'next/link'

export function VideoHero() {
  return (
    <section
      className="relative flex items-center justify-center overflow-hidden"
      style={{ height: '92svh', minHeight: '580px', background: '#0a0906' }}
    >
      {/* ── YouTube iframe — zoomed in ── */}
      <div
        aria-hidden
        style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0 }}
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 'max(177.78vh, 100vw)',
            height: 'max(100vh, 56.25vw)',
            transform: 'translate(-50%, -50%) scale(1.5)',
            pointerEvents: 'none',
          }}
        >
          <iframe
            src="https://www.youtube.com/embed/hZ-o2GhDeL8?autoplay=1&mute=1&loop=1&playlist=hZ-o2GhDeL8&controls=0&start=4&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&playsinline=1"
            allow="autoplay; encrypted-media"
            title="Kawai piano performance"
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
        </div>
      </div>

      {/* Dark overlay — preserves video visibility */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(10,9,6,0.55) 0%, rgba(10,9,6,0.3) 40%, rgba(10,9,6,0.45) 65%, rgba(10,9,6,0.72) 82%)',
          zIndex: 1,
        }}
      />
      {/* Vignette */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 85% 85% at 50% 50%, transparent 35%, rgba(10,9,6,0.45) 100%)',
          zIndex: 2,
        }}
      />

      {/* ── Content ── */}
      <div
        className="relative w-full h-full flex flex-col items-center justify-center px-6 text-center"
        style={{ zIndex: 4, paddingTop: '70px', paddingBottom: '80px' }}
      >
        {/* Corporation label above logo */}
        <p
          className="text-white/45 font-[family-name:var(--font-brand-sans)] uppercase tracking-[0.5em] mb-4"
          style={{ fontSize: '0.52rem', animation: 'hero-fade-up 0.8s cubic-bezier(0.16,1,0.3,1) 0.05s both' }}
        >
          Kawai America Corporation
        </p>

        <div style={{ animation: 'hero-fade-up 1.1s cubic-bezier(0.16,1,0.3,1) 0.2s both' }}>
          <Image
            src="/images/Kawai (Red)(2).png"
            alt="KAWAI"
            width={260}
            height={78}
            className="h-14 md:h-20 w-auto brightness-0 invert opacity-90 mb-9"
            priority
          />
        </div>

        <h1
          className="font-[family-name:var(--font-family-cormorant)] italic text-white leading-[0.88]"
          style={{
            fontSize: 'clamp(3rem, 8vw, 8rem)',
            animation: 'hero-fade-up 1.1s cubic-bezier(0.16,1,0.3,1) 0.65s both',
          }}
        >
          Official
          <br />
          <span style={{ color: '#E11922' }}>Showrooms</span>
        </h1>

        <p
          className="mt-6 font-[family-name:var(--font-brand-sans)] text-white/40 tracking-[0.22em] uppercase"
          style={{
            fontSize: '0.58rem',
            animation: 'hero-fade-up 0.9s cubic-bezier(0.16,1,0.3,1) 0.9s both',
          }}
        >
          Experience the world's finest instruments in person
        </p>

        {/* CTAs */}
        <div
          className="mt-12 flex flex-col items-center gap-4 w-full max-w-sm"
          style={{ animation: 'hero-fade-up 0.9s cubic-bezier(0.16,1,0.3,1) 1.05s both' }}
        >
          <button
            onClick={() => document.getElementById('stores-map')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full font-[family-name:var(--font-brand-sans)] font-bold uppercase tracking-[0.2em] text-white bg-kawai-red hover:bg-kawai-red/90 active:scale-[0.98] transition-all py-4 flex items-center justify-center gap-3"
            style={{ fontSize: '0.7rem', borderRadius: '2px' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
            Find a Showroom
          </button>

          <div className="flex items-center gap-3 w-full">
            <div className="flex-1 h-px bg-white/15" />
            <span className="font-[family-name:var(--font-brand-sans)] text-white/30 uppercase tracking-[0.25em]" style={{ fontSize: '0.52rem' }}>or</span>
            <div className="flex-1 h-px bg-white/15" />
          </div>

          <Link
            href="/pianos"
            className="w-full font-[family-name:var(--font-brand-sans)] font-semibold uppercase tracking-[0.2em] text-white border border-white/35 hover:border-white hover:bg-white/8 active:scale-[0.98] transition-all py-4 flex items-center justify-center gap-3"
            style={{ fontSize: '0.7rem', borderRadius: '2px' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
              <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
            </svg>
            Browse Instruments
          </Link>
        </div>

        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5"
          style={{ animation: 'hero-fade-in 1s ease 1.4s both' }}
        >
          <span
            className="text-white/35 font-[family-name:var(--font-brand-sans)] tracking-[0.35em] uppercase"
            style={{ fontSize: '0.52rem' }}
          >
            Discover
          </span>
          <div
            className="w-px bg-gradient-to-b from-white/30 to-transparent"
            style={{ height: '36px', animation: 'scroll-pulse 2.2s ease-in-out 2s infinite' }}
          />
        </div>
      </div>

      <style>{`
        @keyframes hero-fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
@keyframes hero-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes scroll-pulse {
          0%, 100% { opacity: 0.3; }
          50%       { opacity: 0.65; }
        }
      `}</style>
    </section>
  )
}
