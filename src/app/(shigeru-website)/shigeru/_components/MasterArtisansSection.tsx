const ARTISANS = [
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
] as const

export function MasterArtisansSection() {
  return (
    <section
      aria-label="Master Piano Artisans"
      className="bg-kawai-pearl sk-section"
    >
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* Left — copy */}
          <div>
            <p
              className="sk-eyebrow text-kawai-charcoal/40 mb-6"
              style={{ fontFamily: 'var(--font-brand-sans)' }}
            >
              The Artisan
            </p>
            <h2
              className="text-kawai-black font-light italic leading-tight mb-10"
              style={{
                fontFamily: 'var(--font-brand-luxury)',
                fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
              }}
            >
              Master Piano Artisans
            </h2>

            <p
              className="text-kawai-charcoal/65 text-sm leading-relaxed mb-6"
              style={{ fontFamily: 'var(--font-brand-sans)' }}
            >
              The Master Piano Artisan designation is the most esteemed rank in piano craftsmanship.
              Each MPA has spent decades proving themselves across the world&rsquo;s most prestigious
              concert halls and international competitions.
            </p>
            <p
              className="text-kawai-charcoal/65 text-sm leading-relaxed mb-10"
              style={{ fontFamily: 'var(--font-brand-sans)' }}
            >
              Every new Shigeru Kawai owner receives an in-home visit from an elite MPA within the
              first two years — concert-level regulation, voicing, and tuning, offered as a personal
              gift from Shigeru Kawai.
            </p>

            {/* Stat callout */}
            <div className="border-l-2 border-kawai-gold/30 pl-6 py-1">
              <p
                className="text-kawai-black font-light italic leading-snug"
                style={{
                  fontFamily: 'var(--font-brand-luxury)',
                  fontSize: 'clamp(1rem, 2vw, 1.3rem)',
                }}
              >
                &ldquo;Three to five times longer to build than any standard instrument. We do not
                apologize for this.&rdquo;
              </p>
              <p
                className="sk-eyebrow text-kawai-charcoal/35 mt-4"
                style={{ fontFamily: 'var(--font-brand-sans)', letterSpacing: '0.3em' }}
              >
                Shigeru Kawai &middot; Ryuyo Philosophy
              </p>
            </div>
          </div>

          {/* Right — artisan cards */}
          <div className="flex flex-col gap-6 lg:pt-16">
            {ARTISANS.map((artisan) => (
              <div
                key={artisan.name}
                className="border border-kawai-neutral hover:border-kawai-gold/30 bg-white transition-colors duration-300 p-8 flex items-start gap-6"
              >
                {/* Gold accent bar */}
                <span className="block w-0.5 h-full self-stretch bg-kawai-gold/30 flex-shrink-0" />

                <div>
                  <p
                    className="text-kawai-black font-medium text-base mb-1"
                    style={{ fontFamily: 'var(--font-brand-sans)' }}
                  >
                    {artisan.name}
                  </p>
                  <p
                    className="sk-eyebrow text-kawai-charcoal/45 mb-3"
                    style={{ fontFamily: 'var(--font-brand-sans)', letterSpacing: '0.3em' }}
                  >
                    {artisan.role}
                  </p>
                  <p
                    className="sk-eyebrow text-kawai-gold/60"
                    style={{ fontFamily: 'var(--font-brand-sans)', letterSpacing: '0.25em' }}
                  >
                    {artisan.region}
                  </p>
                </div>
              </div>
            ))}

            <a
              href="/shigeru/artisans"
              className="self-start mt-2 inline-flex items-center gap-2 text-kawai-charcoal/40 hover:text-kawai-black transition-colors duration-300 border-b border-kawai-charcoal/20 hover:border-kawai-black pb-0.5"
              style={{ fontFamily: 'var(--font-brand-sans)', fontSize: '0.625rem', letterSpacing: '0.3em', textTransform: 'uppercase' }}
            >
              About the MPA program&nbsp;→
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
