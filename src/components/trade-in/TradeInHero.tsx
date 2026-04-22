'use client'

import Image from 'next/image'

const PETALS = [
  { left: '5%',  delay: '0s',   duration: '16s', size: 8,  color: 'rgba(253,164,175,0.7)' },
  { left: '18%', delay: '3.5s', duration: '21s', size: 6,  color: 'rgba(254,205,211,0.6)' },
  { left: '38%', delay: '1.2s', duration: '25s', size: 10, color: 'rgba(253,164,175,0.55)' },
  { left: '60%', delay: '6.8s', duration: '18s', size: 7,  color: 'rgba(254,205,211,0.65)' },
  { left: '78%', delay: '2.1s', duration: '22s', size: 9,  color: 'rgba(253,164,175,0.6)' },
  { left: '91%', delay: '5.3s', duration: '15s', size: 5,  color: 'rgba(254,205,211,0.55)' },
]

interface TradeInHeroProps {
  locationName?: string | null
}

export function TradeInHero({ locationName }: TradeInHeroProps) {
  return (
    <>
      <style>{`
        @keyframes tih-up {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes tih-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes tih-petal {
          0%   { transform: translateY(-40px) rotate(0deg)   translateX(0);     opacity: 0;   }
          8%   { opacity: 0.85; }
          50%  { transform: translateY(50vh)  rotate(190deg) translateX(16px);  opacity: 0.55; }
          92%  { opacity: 0.3; }
          100% { transform: translateY(108vh) rotate(380deg) translateX(-12px); opacity: 0;   }
        }
        .tih-a1 { animation: tih-fade 0.8s cubic-bezier(0.22,0.61,0.36,1) 0.1s  both; }
        .tih-a2 { animation: tih-up   1.0s cubic-bezier(0.22,0.61,0.36,1) 0.35s both; }
        .tih-a3 { animation: tih-up   1.6s cubic-bezier(0.16,1,0.3,1)     0.7s  both; }
        .tih-a4 { animation: tih-fade 0.8s cubic-bezier(0.22,0.61,0.36,1) 1.3s  both; }
        .tih-a5 { animation: tih-up   1.0s cubic-bezier(0.22,0.61,0.36,1) 1.5s  both; }
        .tih-a6 { animation: tih-up   1.0s cubic-bezier(0.22,0.61,0.36,1) 1.85s both; }
        .tih-petal { animation: tih-petal linear infinite; }
      `}</style>

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

        {/* Drifting sakura petals */}
        {PETALS.map((p, i) => (
          <div
            key={i}
            className="tih-petal absolute top-0 rounded-full pointer-events-none"
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

          {/* Campaign eyebrow */}
          <div className="tih-a1 flex items-center gap-6 mb-5">
            <div className="h-px w-16 bg-kawai-black/40" aria-hidden />
            <span
              className="font-kawai-script text-kawai-black"
              style={{ fontSize: 'clamp(0.9rem, 1.6vw, 1.2rem)', letterSpacing: '0.1em' }}
            >
              Piano Trade-In
            </span>
            <div className="h-px w-16 bg-kawai-black/40" aria-hidden />
          </div>

          {/* KAWAI red wordmark */}
          <div className="tih-a2 mb-10">
            <Image
              src="/images/logos/kawai-logo-red-2x.png"
              alt="Kawai"
              width={300}
              height={60}
              className="object-contain drop-shadow-[0_2px_12px_rgba(255,255,255,0.5)]"
              priority
            />
          </div>

          {/* "Spring Trade In" — flowing script */}
          <h1
            className="tih-a3 font-kawai-script text-kawai-black leading-[1]"
            style={{ fontSize: 'clamp(4rem, 14vw, 13rem)' }}
          >
            Spring Trade In
          </h1>

          {/* Ruled divider with campaign label */}
          <div className="tih-a4 flex items-center gap-5 w-full max-w-xl mt-4 mb-1">
            <div className="flex-1 h-px bg-kawai-black/40" aria-hidden />
            <span
              className="text-kawai-black font-[family-name:var(--font-brand-sans)] font-medium tracking-[0.4em] uppercase whitespace-nowrap"
              style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.2rem)' }}
            >
              Until May 17th
            </span>
            <div className="flex-1 h-px bg-kawai-black/40" aria-hidden />
          </div>

          {/* Value props */}
          <div className="tih-a4 flex items-start justify-center gap-10 mt-4 mb-10">
            {[
              { value: '+$500', label: 'Over Any Appraisal', sub: 'Spring bonus on trade-ins' },
              { value: 'Fair', label: 'Honest Valuation', sub: 'Certified in-store appraisal' },
              { value: 'Easy', label: 'Seamless Process', sub: 'Three steps, no surprises' },
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
          <div className="tih-a5 flex flex-col sm:flex-row items-center gap-3">
            <a
              href="#how-it-works"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="inline-flex items-center px-8 py-4 bg-kawai-red hover:bg-kawai-red/90 text-white text-sm tracking-[0.12em] uppercase font-medium transition-colors rounded-sm shadow-[0_4px_24px_rgba(225,25,34,0.35)]"
            >
              Claim Bonus
            </a>

            <a
              href="#trade-calculator"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('trade-calculator')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="inline-flex items-center px-8 py-4 border border-kawai-black/25 bg-black/8 backdrop-blur-sm text-kawai-black hover:bg-black/15 hover:border-kawai-black/40 text-sm tracking-[0.12em] uppercase font-medium transition-all rounded-sm"
            >
              Learn More
            </a>
          </div>

          {/* Date pill */}
          <div className="tih-a6 flex items-center gap-2.5 mt-8 px-5 py-2.5 rounded-full border border-kawai-black/25 bg-white/30 backdrop-blur-sm">
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
