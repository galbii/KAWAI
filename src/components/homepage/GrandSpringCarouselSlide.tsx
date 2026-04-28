'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SpringSaleLocationModal } from './SpringSaleLocationModal'

const PETALS = [
  { left: '7%',  delay: '0s',   duration: '14s', size: 9,  color: 'rgba(253,164,175,0.7)' },
  { left: '21%', delay: '4.2s', duration: '19s', size: 6,  color: 'rgba(254,205,211,0.6)' },
  { left: '44%', delay: '1.8s', duration: '23s', size: 11, color: 'rgba(253,164,175,0.55)' },
  { left: '66%', delay: '7.1s', duration: '17s', size: 7,  color: 'rgba(254,205,211,0.65)' },
  { left: '82%', delay: '2.6s', duration: '21s', size: 8,  color: 'rgba(253,164,175,0.6)' },
  { left: '93%', delay: '5.8s', duration: '16s', size: 5,  color: 'rgba(254,205,211,0.55)' },
]

interface GrandSpringCarouselSlideProps {
  prefersReducedMotion?: boolean
}

export function GrandSpringCarouselSlide({ prefersReducedMotion = false }: GrandSpringCarouselSlideProps) {
  const pathname = usePathname()
  const [modalOpen, setModalOpen] = useState(false)

  // Detect if we're on a storefront page — /store/[slug] or /store/[slug]/...
  const storefrontMatch = pathname.match(/^\/store\/([^/]+)/)
  const storeSlug = storefrontMatch?.[1] ?? null

  // On a storefront, link directly to grand-spring-sale; otherwise open location picker
  const dateHref = storeSlug ? `/store/${storeSlug}/grand-spring-sale` : undefined

  return (
    <>
      <style>{`
        @keyframes gsc-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes gsc-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes gsc-petal {
          0%   { transform: translateY(-40px) rotate(0deg)   translateX(0);     opacity: 0;   }
          8%   { opacity: 0.85; }
          50%  { transform: translateY(50vh)  rotate(190deg) translateX(16px);  opacity: 0.55; }
          92%  { opacity: 0.3; }
          100% { transform: translateY(108vh) rotate(380deg) translateX(-12px); opacity: 0;   }
        }
        @keyframes gsc-pulse-ring {
          0%   { transform: scale(1);   opacity: 0.7; }
          100% { transform: scale(2.2); opacity: 0;   }
        }
        .gsc-a1 { animation: gsc-fade 0.7s cubic-bezier(0.22,0.61,0.36,1) 0.1s  both; }
        .gsc-a2 { animation: gsc-up   0.9s cubic-bezier(0.22,0.61,0.36,1) 0.3s  both; }
        .gsc-a3 { animation: gsc-up   1.4s cubic-bezier(0.16,1,0.3,1)     0.6s  both; }
        .gsc-a4 { animation: gsc-fade 0.7s cubic-bezier(0.22,0.61,0.36,1) 1.1s  both; }
        .gsc-a5 { animation: gsc-up   0.9s cubic-bezier(0.22,0.61,0.36,1) 1.35s both; }
        .gsc-petal { animation: gsc-petal linear infinite; }
        .gsc-pulse-ring {
          position: absolute;
          inset: -4px;
          border-radius: 9999px;
          background: #E11922;
          animation: gsc-pulse-ring 1.6s cubic-bezier(0.4,0,0.6,1) infinite;
        }
        ${prefersReducedMotion ? `
          .gsc-a1, .gsc-a2, .gsc-a3, .gsc-a4, .gsc-a5 { animation: none; opacity: 1; transform: none; }
          .gsc-petal { animation: none; opacity: 0; }
          .gsc-pulse-ring { animation: none; opacity: 0; }
        ` : ''}
      `}</style>

      {/* Marble video background — same source as grand-spring-sale page */}
      <video
        className="absolute inset-0 w-full h-full object-cover scale-110"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden
      >
        <source
          src="https://pub-0cc9ed269d544fd29fe51221f6744a6b.r2.dev/media/kling_20260422_%E4%BD%9C%E5%93%81_Can_you_an_460_0.mp4"
          type="video/mp4"
        />
      </video>

      {/* Drifting sakura petals */}
      {PETALS.map((p, i) => (
        <div
          key={i}
          className="gsc-petal absolute top-0 rounded-full pointer-events-none"
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

      {/* Content — centered column */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6">

        {/* Campaign eyebrow */}
        <div className="gsc-a1 flex items-center gap-5 mb-4">
          <div className="h-px w-12 bg-kawai-black/40" aria-hidden />
          <span
            className="font-kawai-script text-kawai-black"
            style={{ fontSize: 'clamp(0.8rem, 1.4vw, 1.1rem)', letterSpacing: '0.1em' }}
          >
            Spring Collection 2026
          </span>
          <div className="h-px w-12 bg-kawai-black/40" aria-hidden />
        </div>

        {/* KAWAI red wordmark */}
        <div className="gsc-a2 mb-6">
          <Image
            src="/images/logos/kawai-logo-red-2x.png"
            alt="Kawai"
            width={220}
            height={44}
            className="object-contain drop-shadow-[0_2px_10px_rgba(255,255,255,0.6)]"
            priority
          />
        </div>

        {/* "Grand Piano" script heading */}
        <h2
          className="gsc-a3 font-kawai-script text-kawai-black leading-[1]"
          style={{ fontSize: 'clamp(4.5rem, 13vw, 11rem)' }}
        >
          Grand Piano
        </h2>

        {/* "SPRING SALE" divider */}
        <div className="gsc-a4 flex items-center gap-4 w-full max-w-xs sm:max-w-sm mt-3 mb-1">
          <div className="flex-1 h-px bg-kawai-black/40" aria-hidden />
          <span
            className="text-kawai-black font-[family-name:var(--font-brand-sans)] font-medium tracking-[0.4em] uppercase whitespace-nowrap"
            style={{ fontSize: 'clamp(0.7rem, 1.3vw, 1rem)' }}
          >
            Spring Sale
          </span>
          <div className="flex-1 h-px bg-kawai-black/40" aria-hidden />
        </div>

        {/* Value props */}
        <div className="gsc-a4 flex items-start justify-center gap-7 sm:gap-10 mt-3 mb-8">
          {[
            { value: '0%',    label: 'Financing',       sub: '36 months · no interest' },
            { value: 'Sale',  label: 'Spring Discounts', sub: 'Select grand pianos' },
            { value: '+$500', label: 'Trade-In Bonus',   sub: 'Over any appraisal' },
          ].map(({ value, label, sub }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <div className="w-7 h-[2px] bg-kawai-red mb-1.5" aria-hidden />
              <span
                className="font-kawai-script text-kawai-black leading-none"
                style={{ fontSize: 'clamp(1.2rem, 2vw, 1.75rem)' }}
              >
                {value}
              </span>
              <span className="text-kawai-black text-[0.6rem] tracking-[0.2em] uppercase font-semibold mt-0.5">
                {label}
              </span>
              <span className="text-kawai-black/45 text-[0.55rem] tracking-wide">
                {sub}
              </span>
            </div>
          ))}
        </div>

        {/* Date badge — emphasized; behavior depends on context */}
        {dateHref ? (
          <Link
            href={dateHref}
            className="gsc-a5 group relative inline-flex items-center gap-3 px-7 py-3.5 rounded-full border-2 border-kawai-red/60 bg-white/60 backdrop-blur-sm hover:bg-kawai-red hover:border-kawai-red transition-all duration-300 shadow-[0_4px_20px_rgba(225,25,34,0.18)] hover:shadow-[0_6px_28px_rgba(225,25,34,0.4)]"
          >
            <DateBadgeInner />
          </Link>
        ) : (
          <button
            onClick={() => setModalOpen(true)}
            className="gsc-a5 group relative inline-flex items-center gap-3 px-7 py-3.5 rounded-full border-2 border-kawai-red/60 bg-white/60 backdrop-blur-sm hover:bg-kawai-red hover:border-kawai-red transition-all duration-300 shadow-[0_4px_20px_rgba(225,25,34,0.18)] hover:shadow-[0_6px_28px_rgba(225,25,34,0.4)]"
          >
            <DateBadgeInner />
          </button>
        )}

      </div>

      <SpringSaleLocationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}

function DateBadgeInner() {
  return (
    <>
      <span className="relative flex-shrink-0 w-2.5 h-2.5" aria-hidden>
        <span className="gsc-pulse-ring" />
        <span className="relative block w-2.5 h-2.5 rounded-full bg-kawai-red" />
      </span>
      <span
        className="text-kawai-black group-hover:text-white font-[family-name:var(--font-brand-sans)] font-semibold tracking-[0.2em] transition-colors duration-300"
        style={{ fontSize: 'clamp(0.8rem, 1.3vw, 1rem)' }}
      >
        May 1 – 17, 2026
      </span>
      <span className="text-kawai-black/50 group-hover:text-white/80 text-[0.7rem] tracking-[0.15em] uppercase transition-colors duration-300">
        Find a Location
      </span>
    </>
  )
}
