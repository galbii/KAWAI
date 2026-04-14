import Link from 'next/link'

export function ShigeruHero() {
  return (
    <section
      aria-label="Shigeru Kawai Concert Grand Pianos"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0a0a0a] px-6 pt-24"
    >
      {/* Atmospheric glow — subtle, centred */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 38%, rgba(213,199,140,0.09) 0%, transparent 68%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">

        {/* Eyebrow */}
        <p
          className="sk-eyebrow text-kawai-gold mb-12"
          style={{ fontFamily: 'var(--font-brand-sans)' }}
        >
          The Premier Piano of Japan&nbsp;&nbsp;·&nbsp;&nbsp;Ryuyo, Hamamatsu&nbsp;&nbsp;·&nbsp;&nbsp;Est.&nbsp;1999
        </p>

        {/* Wordmark — H1 for SEO */}
        <h1
          className="text-white font-light italic leading-[0.88] select-none mb-10"
          style={{
            fontFamily: 'var(--font-brand-luxury)',
            fontSize: 'clamp(5rem, 15vw, 11rem)',
          }}
        >
          <span className="block">Shigeru</span>
          <span className="block" style={{ marginTop: '-0.06em' }}>
            Kawai
          </span>
        </h1>

        {/* Ornamental rule + label */}
        <div className="flex items-center justify-center gap-5 mb-10">
          <span className="sk-rule w-16" />
          <span
            className="sk-eyebrow text-kawai-gold"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            Grand Pianos
          </span>
          <span className="sk-rule w-16" />
        </div>

        {/* SEO-rich subtitle */}
        <p
          className="text-white/45 text-sm leading-relaxed max-w-md mb-14"
          style={{ fontFamily: 'var(--font-brand-sans)', letterSpacing: '0.03em' }}
        >
          Handcrafted concert grand pianos built by Master Piano Artisans.
          Six models — from the SK&#8209;2 salon grand to the SK&#8209;EX concert grand.
          Fewer than twenty SK&#8209;EX instruments leave Ryuyo each year.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="#collection"
            className="inline-flex items-center gap-3 border border-kawai-gold/40 hover:border-kawai-gold text-kawai-gold hover:bg-kawai-gold/5 px-9 py-4 transition-all duration-300"
            style={{ fontFamily: 'var(--font-brand-sans)', fontSize: '0.625rem', letterSpacing: '0.3em', textTransform: 'uppercase' }}
          >
            Explore the Collection
          </Link>
          <Link
            href="/find-a-dealer"
            className="inline-flex items-center gap-3 border border-white/10 hover:border-white/30 text-white/35 hover:text-white/65 px-9 py-4 transition-all duration-300"
            style={{ fontFamily: 'var(--font-brand-sans)', fontSize: '0.625rem', letterSpacing: '0.3em', textTransform: 'uppercase' }}
          >
            Find an Authorized Dealer
          </Link>
        </div>
      </div>

      {/* Scroll nudge */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
        <span
          className="sk-eyebrow text-white/15"
          style={{ fontFamily: 'var(--font-brand-sans)', letterSpacing: '0.4em' }}
        >
          Scroll
        </span>
        <span className="block w-px h-12 bg-gradient-to-b from-white/15 to-transparent" />
      </div>
    </section>
  )
}
