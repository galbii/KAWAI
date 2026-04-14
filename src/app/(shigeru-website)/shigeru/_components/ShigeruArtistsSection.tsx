const FEATURED_ARTISTS = [
  {
    name: 'Joe Bongiorno',
    role: 'Solo Piano Artist',
    quote:
      'My Shigeru SK-7 has given me a whole new level of expression, control, tone and clarity that I never dreamed was possible.',
  },
  {
    name: 'David Lanz',
    role: 'Grammy-Nominated Pianist',
    quote:
      'Ever since I played a Shigeru Kawai piano for the first time, I dreamed of owning one — and now I do. Some dreams really do come true.',
  },
  {
    name: 'David Hicken',
    role: 'Contemporary Pianist & Composer',
    quote:
      'The action of the Shigeru Kawai is far superior to anything I have experienced. Playing this instrument is pure joy.',
  },
  {
    name: 'Junko Ueno Garrett',
    role: 'Concert Pianist',
    quote:
      'The Shigeru piano always gives me inspiration to create music at a very high level. I love its honest and transparent sound.',
  },
] as const

export function ShigeruArtistsSection() {
  return (
    <section
      aria-label="Shigeru Kawai Artists"
      className="bg-[#0a0a0a] sk-section"
    >
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className="mb-16">
          <p
            className="sk-eyebrow text-kawai-gold mb-4"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            Shigeru Kawai Artists
          </p>
          <h2
            className="text-white font-light italic leading-tight max-w-xl"
            style={{
              fontFamily: 'var(--font-brand-luxury)',
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
            }}
          >
            Played on the World&rsquo;s
            <br />
            Greatest Stages
          </h2>
        </div>

        {/* Artist grid — 2 cols desktop, 1 col mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/[0.04]">
          {FEATURED_ARTISTS.map((artist) => (
            <article
              key={artist.name}
              className="bg-[#0a0a0a] hover:bg-[#0e0c09] transition-colors duration-500 p-10 lg:p-12 flex flex-col"
            >
              {/* Opening mark */}
              <span
                className="text-kawai-gold/25 font-light italic leading-none select-none mb-5"
                style={{ fontFamily: 'var(--font-brand-luxury)', fontSize: '4rem' }}
                aria-hidden="true"
              >
                &ldquo;
              </span>

              {/* Quote */}
              <blockquote
                className="text-white/75 font-light italic leading-relaxed flex-1"
                style={{
                  fontFamily: 'var(--font-brand-luxury)',
                  fontSize: 'clamp(1rem, 1.8vw, 1.35rem)',
                }}
              >
                {artist.quote}
              </blockquote>

              {/* Attribution */}
              <div className="flex items-center gap-4 mt-10">
                <span className="sk-rule w-8" />
                <div>
                  <p
                    className="text-white text-sm font-medium mb-0.5"
                    style={{ fontFamily: 'var(--font-brand-sans)' }}
                  >
                    {artist.name}
                  </p>
                  <p
                    className="sk-eyebrow text-kawai-gold/60"
                    style={{ fontFamily: 'var(--font-brand-sans)', letterSpacing: '0.3em' }}
                  >
                    {artist.role}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* View all link */}
        <div className="mt-12 flex justify-end">
          <a
            href="/shigeru/artists"
            className="inline-flex items-center gap-3 text-white/30 hover:text-kawai-gold transition-colors duration-300"
            style={{ fontFamily: 'var(--font-brand-sans)', fontSize: '0.625rem', letterSpacing: '0.3em', textTransform: 'uppercase' }}
          >
            View all artists&nbsp;→
          </a>
        </div>
      </div>
    </section>
  )
}
