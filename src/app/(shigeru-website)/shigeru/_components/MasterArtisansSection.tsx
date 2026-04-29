import Image from 'next/image'

const SK_LOGO = 'https://pub-0cc9ed269d544fd29fe51221f6744a6b.r2.dev/media/Shigeru%20Kawai%20logo.webp'

const ARTISANS = [
  {
    name: 'David Reed',
    nameDisplay: 'David Michael Reed',
    role: 'Master Piano Artisan',
    credential: 'MPA / Piano Technician',
    credentialDetail: 'RPT Registered Piano Technician\nin the PTG Piano Technician\'s Guild',
    bio: 'David Reed is a newly certified Master Piano Artisan who has always been intrigued by the mechanics of acoustic pianos, in addition to being a lifelong pianist.',
    image: '/images/signature/artisan-reed.webp',
  },
  {
    name: 'Akinori Nakajima',
    nameDisplay: 'Akinori Nakajima',
    role: 'Master Piano Artisan',
    credential: 'MPA / Piano Technician',
    credentialDetail: '1st grade technician certified\nby Japan Piano Technicians Association',
    bio: 'Akinori Nakajima is a Master Piano Artisan with many years of expertise in precision tuning, and a deep, ongoing commitment to the refined arts of regulation and voicing.',
    image: '/images/signature/artisan-murakami.webp',
  },
] as const

export function MasterArtisansSection() {
  return (
    <section
      aria-label="Master Piano Artisans"
      className="bg-kawai-pearl sk-section"
    >
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12">

        {/* Section header */}
        <div className="text-center mb-14">
          <p
            className="sk-eyebrow text-kawai-charcoal/40 mb-5"
            style={{ fontFamily: 'var(--font-oswald)', letterSpacing: '0.45em' }}
          >
            The Artisan
          </p>
          <h2
            className="text-kawai-black font-light italic leading-tight mb-6"
            style={{
              fontFamily: 'var(--font-brand-luxury)',
              fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
            }}
          >
            Master Piano Artisans
          </h2>
          <p
            className="text-kawai-charcoal/60 text-sm leading-relaxed max-w-2xl mx-auto"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            Every new Shigeru Kawai owner receives an in-home visit from an elite MPA within the
            first two years — concert-level regulation, voicing, and tuning, offered as a personal
            gift from Shigeru Kawai.
          </p>
        </div>

        {/* Artisan card grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {ARTISANS.map((artisan) => (
            <div
              key={artisan.name}
              className="rounded-2xl overflow-hidden bg-white shadow-[0_4px_24px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.13)] transition-shadow duration-400"
            >
              {/* Dark top section */}
              <div className="relative bg-black overflow-hidden" style={{ height: '280px' }}>
                {/* Artisan photo — left side */}
                <div className="absolute left-0 bottom-0 top-0 w-[48%]">
                  <Image
                    src={artisan.image}
                    alt={artisan.name}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>

                {/* Gradient fade from photo to black */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent from-[30%] via-black/70 via-[50%] to-black" />

                {/* Right side — credentials */}
                <div className="absolute right-0 top-0 bottom-0 w-[58%] flex flex-col justify-between px-5 py-5">
                  {/* SK logo + brand */}
                  <div className="flex flex-col items-center gap-1">
                    <Image
                      src={SK_LOGO}
                      alt="Shigeru Kawai"
                      width={120}
                      height={48}
                      className="object-contain brightness-[10] opacity-90"
                    />
                    <p
                      className="text-white/50 text-center"
                      style={{ fontFamily: 'var(--font-brand-sans)', fontSize: '8px', letterSpacing: '0.4em', textTransform: 'uppercase' }}
                    >
                      Master Piano Artisan
                    </p>
                  </div>

                  {/* Credentials */}
                  <div className="text-center">
                    <p
                      className="text-white font-semibold mb-1"
                      style={{ fontFamily: 'var(--font-oswald)', fontSize: '13px', letterSpacing: '0.12em', textTransform: 'uppercase' }}
                    >
                      {artisan.credential}
                    </p>
                    <p
                      className="text-white/60 leading-snug"
                      style={{ fontFamily: 'var(--font-brand-sans)', fontSize: '10px' }}
                    >
                      {artisan.credentialDetail.split('\n').map((line, i) => (
                        <span key={i} className="block">{line}</span>
                      ))}
                    </p>
                  </div>

                  {/* Name in italic script */}
                  <p
                    className="text-white font-light italic text-center leading-tight"
                    style={{
                      fontFamily: 'var(--font-brand-luxury)',
                      fontSize: 'clamp(1.15rem, 2.2vw, 1.5rem)',
                    }}
                  >
                    {artisan.nameDisplay}
                  </p>
                </div>
              </div>

              {/* White bottom section */}
              <div className="px-8 py-7 text-center">
                <h3
                  className="text-kawai-black font-bold mb-1"
                  style={{ fontFamily: 'var(--font-oswald)', fontSize: '16px', letterSpacing: '0.12em', textTransform: 'uppercase' }}
                >
                  {artisan.name.toUpperCase()}
                </h3>
                <p
                  className="text-kawai-charcoal/50 mb-4"
                  style={{ fontFamily: 'var(--font-brand-sans)', fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase' }}
                >
                  Master Piano Artisan
                </p>
                <p
                  className="text-kawai-charcoal/70 text-sm leading-relaxed"
                  style={{ fontFamily: 'var(--font-brand-sans)' }}
                >
                  {artisan.bio}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* MPA program link */}
        <div className="text-center mt-10">
          <a
            href="/shigeru/artisans"
            className="inline-flex items-center gap-2 text-kawai-charcoal/40 hover:text-kawai-black transition-colors duration-300 border-b border-kawai-charcoal/20 hover:border-kawai-black pb-0.5"
            style={{ fontFamily: 'var(--font-brand-sans)', fontSize: '0.625rem', letterSpacing: '0.3em', textTransform: 'uppercase' }}
          >
            About the MPA program&nbsp;→
          </a>
        </div>
      </div>
    </section>
  )
}
