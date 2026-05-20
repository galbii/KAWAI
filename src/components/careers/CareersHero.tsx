'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

const STATS = [
  { num: '1927', label: 'Est. Japan' },
  { num: '180+', label: 'Countries' },
  { num: '100K+', label: 'Instruments / Year' },
]

export function CareersHero() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <section className="relative w-full min-h-[100svh] bg-kawai-black flex flex-col overflow-hidden">
      {/* Radial gradient orbs */}
      <div
        className="absolute pointer-events-none inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 15% 60%, rgba(225,25,34,0.18) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 80% 20%, rgba(213,199,140,0.14) 0%, transparent 60%)',
        }}
      />

      {/* Grain texture */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none z-0 mix-blend-screen"
        style={{ backgroundImage: GRAIN_SVG }}
      />

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between pl-10 pr-8 md:pl-16 md:pr-16 lg:pl-24 lg:pr-24 pt-20">
        <p className="text-[10px] uppercase tracking-[0.22em] text-white/45 font-[family-name:var(--font-brand-sans)]">
          Careers at Kawai
        </p>
        <div className="h-px flex-1 bg-white/15 mx-8" />
        <p className="text-[10px] uppercase tracking-[0.22em] text-white/30 font-[family-name:var(--font-brand-sans)]">
          Est. 1927
        </p>
      </div>

      {/* Main logo */}
      <div
        className="flex-1 flex flex-col justify-center pl-10 pr-8 md:pl-16 md:pr-16 lg:pl-24 lg:pr-24 py-16 relative z-10"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
        }}
      >
        {/* Red rule */}
        <div className="w-14 h-px bg-kawai-red mb-12" />

        {/* Logo */}
        <div className="w-full max-w-[560px] lg:max-w-[680px]">
          <Image
            src="/images/instrumental-to-life-logo.svg"
            alt="Instrumental to Life — Kawai"
            width={680}
            height={268}
            priority
            className="w-full h-auto"
          />
        </div>

        {/* Sub-copy */}
        <p
          className="mt-12 text-base md:text-lg text-white/65 max-w-[400px] font-[family-name:var(--font-brand-sans)] leading-relaxed"
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.7s ease 0.25s',
          }}
        >
          We have been building instruments since 1927. We are looking for people
          who build things that last.
        </p>
      </div>

      {/* Bottom row: stats + scroll */}
      <div className="relative z-10 flex items-end justify-between pl-10 pr-8 md:pl-16 md:pr-16 lg:pl-24 lg:pr-24 pb-12 border-t border-white/10 pt-8">
        {/* Glass stat pills */}
        <div className="flex items-center gap-3 md:gap-4 flex-wrap">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className="bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-xl px-5 py-3"
              style={{
                opacity: visible ? 1 : 0,
                transition: `opacity 0.5s ease ${0.4 + i * 0.1}s`,
              }}
            >
              <div className="text-2xl md:text-3xl font-[family-name:var(--font-brand-luxury)] text-white leading-none">
                {stat.num}
              </div>
              <div className="mt-1 text-[9px] uppercase tracking-[0.18em] text-white/45 font-[family-name:var(--font-brand-sans)]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <a
          href="#life"
          className="hidden md:flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/40 hover:text-white transition-colors duration-200 font-[family-name:var(--font-brand-sans)]"
        >
          Explore
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path
              d="M7 2v10M2 7l5 5 5-5"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
    </section>
  )
}
