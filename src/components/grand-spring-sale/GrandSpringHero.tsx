import Image from 'next/image'

const PETALS = [
  { left: '7%',  delay: '0s',   duration: '14s', size: 9,  color: 'rgba(253,164,175,0.7)' },
  { left: '21%', delay: '4.2s', duration: '19s', size: 6,  color: 'rgba(254,205,211,0.6)' },
  { left: '44%', delay: '1.8s', duration: '23s', size: 11, color: 'rgba(253,164,175,0.55)' },
  { left: '66%', delay: '7.1s', duration: '17s', size: 7,  color: 'rgba(254,205,211,0.65)' },
  { left: '82%', delay: '2.6s', duration: '21s', size: 8,  color: 'rgba(253,164,175,0.6)' },
  { left: '93%', delay: '5.8s', duration: '16s', size: 5,  color: 'rgba(254,205,211,0.55)' },
]

interface GrandSpringHeroProps {
  locationName?: string | null
  storeslug: string
}

export function GrandSpringHero({ locationName, storeslug }: GrandSpringHeroProps) {
  return (
    <>
      <style>{`
        @keyframes gsh-up {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes gsh-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes gsh-petal {
          0%   { transform: translateY(-40px) rotate(0deg)   translateX(0);     opacity: 0;   }
          8%   { opacity: 0.85; }
          50%  { transform: translateY(50vh)  rotate(190deg) translateX(16px);  opacity: 0.55; }
          92%  { opacity: 0.3; }
          100% { transform: translateY(108vh) rotate(380deg) translateX(-12px); opacity: 0;   }
        }
        .gsh-a1 { animation: gsh-fade 0.8s cubic-bezier(0.22,0.61,0.36,1) 0.1s  both; }
        .gsh-a2 { animation: gsh-up   1.0s cubic-bezier(0.22,0.61,0.36,1) 0.35s both; }
        .gsh-a3 { animation: gsh-up   1.6s cubic-bezier(0.16,1,0.3,1)     0.7s  both; }
        .gsh-a4 { animation: gsh-fade 0.8s cubic-bezier(0.22,0.61,0.36,1) 1.3s  both; }
        .gsh-a5 { animation: gsh-up   1.0s cubic-bezier(0.22,0.61,0.36,1) 1.5s  both; }
        .gsh-a6 { animation: gsh-up   1.0s cubic-bezier(0.22,0.61,0.36,1) 1.85s both; }
        .gsh-petal { animation: gsh-petal linear infinite; }
      `}</style>

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

        {/* Drifting sakura petals */}
        {PETALS.map((p, i) => (
          <div
            key={i}
            className="gsh-petal absolute top-0 rounded-full pointer-events-none"
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              background: p.color,
              animationDuration: p.duration,
              animationDelay: p.delay,
              zIndex: 2,
            }}
            aria-hidden
          />
        ))}

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 -mt-16">

          {/* Campaign eyebrow — above logo */}
          <div className="gsh-a1 flex items-center gap-6 mb-5">
            <div className="h-px w-16 bg-kawai-black/40" aria-hidden />
            <span
              className="font-kawai-script text-kawai-black"
              style={{ fontSize: 'clamp(0.9rem, 1.6vw, 1.2rem)', letterSpacing: '0.1em' }}
            >
              Spring Collection 2026
            </span>
            <div className="h-px w-16 bg-kawai-black/40" aria-hidden />
          </div>

          {/* KAWAI red wordmark */}
          <div className="gsh-a2 mb-10">
            <Image
              src="/images/logos/kawai-logo-red-2x.png"
              alt="Kawai"
              width={300}
              height={60}
              className="object-contain drop-shadow-[0_2px_12px_rgba(255,255,255,0.5)]"
              priority
            />
          </div>

          {/* "Grand" — flowing script */}
          <h1
            className="gsh-a3 font-kawai-script text-kawai-black leading-[1]"
            style={{ fontSize: 'clamp(7rem, 20vw, 18rem)' }}
          >
            Grand Piano
          </h1>

          {/* Ruled divider with campaign label */}
          <div className="gsh-a4 flex items-center gap-5 w-full max-w-xl mt-4 mb-1">
            <div className="flex-1 h-px bg-kawai-black/40" aria-hidden />
            <span
              className="text-kawai-black font-[family-name:var(--font-brand-sans)] font-medium tracking-[0.4em] uppercase whitespace-nowrap"
              style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.2rem)' }}
            >
              Spring Sale
            </span>
            <div className="flex-1 h-px bg-kawai-black/40" aria-hidden />
          </div>

          {/* Value props — three editorial stat items */}
          <div className="gsh-a4 flex items-start justify-center gap-10 mt-4 mb-10">
            {[
              { value: '0%', label: 'Financing', sub: '36 months · no interest' },
              { value: 'Sale', label: 'Spring Discounts', sub: 'Select grand pianos' },
              { value: '+$500', label: 'Trade-In Bonus', sub: 'Over any appraisal' },
            ].map(({ value, label, sub }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <div className="w-8 h-[2px] bg-kawai-red mb-2" aria-hidden />
                <span className="font-kawai-script text-kawai-black leading-none" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}>
                  {value}
                </span>
                <span className="text-kawai-black text-[0.65rem] tracking-[0.2em] uppercase font-semibold mt-0.5">
                  {label}
                </span>
                <span className="text-kawai-black/45 text-[0.6rem] tracking-wide">
                  {sub}
                </span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="gsh-a5 flex flex-col sm:flex-row items-center gap-3">
            <a
              href="#grand-showcase"
              className="inline-flex items-center px-8 py-4 bg-kawai-red hover:bg-kawai-red/90 text-white text-sm tracking-[0.12em] uppercase font-medium transition-colors rounded-sm shadow-[0_4px_24px_rgba(225,25,34,0.35)]"
            >
              View Collection
            </a>

            <a
              href="#grand-showcase"
              className="inline-flex items-center px-8 py-4 border border-kawai-black/25 bg-black/8 backdrop-blur-sm text-kawai-black hover:bg-black/15 hover:border-kawai-black/40 text-sm tracking-[0.12em] uppercase font-medium transition-all rounded-sm"
            >
              Learn More
            </a>
          </div>

          {/* Date pill */}
          <div className="gsh-a6 flex items-center gap-2.5 mt-8 px-5 py-2.5 rounded-full border border-kawai-black/25 bg-white/30 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-kawai-red animate-pulse flex-shrink-0" aria-hidden />
            <span className="text-kawai-black text-sm tracking-[0.2em] font-medium">
              May 1 – 17, 2026
            </span>
          </div>

        </div>
      </section>
    </>
  )
}
