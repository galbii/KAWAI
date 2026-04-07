'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'

export function FindDealerCta() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section ref={ref} className="bg-kawai-black py-24 lg:py-32 overflow-hidden relative">
      {/* Subtle red glow top-left */}
      <div
        className="absolute top-0 left-0 w-1/2 h-full pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 60% 70% at 0% 50%, rgba(225,25,34,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="container mx-auto px-8 lg:px-20 max-w-7xl relative">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-10"
          >
            <span className="block w-8 h-px bg-kawai-red" />
            <span
              className="text-[10px] tracking-[0.3em] uppercase text-white/30 font-medium"
              style={{ fontFamily: 'var(--font-brand-sans)' }}
            >
              Available at participating dealers
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-light text-white leading-tight mb-6"
            style={{
              fontFamily: 'var(--font-crimson), Georgia, serif',
              fontSize: 'clamp(2rem, 4vw, 3.25rem)',
              letterSpacing: '-0.02em',
            }}
          >
            Ready to save on your
            <br />
            next Kawai piano?
          </motion.h2>

          {/* Body */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="text-white/40 font-light leading-relaxed mb-12"
            style={{ fontFamily: 'var(--font-brand-sans)', fontSize: '1.0rem' }}
          >
            Visit your nearest authorized Kawai dealer before June 30, 2026 to take advantage of instant savings on CN, CA, DG, ES, CX, and MP Series digital pianos.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-wrap gap-4"
          >
            <Link
              href="/find-a-dealer"
              className="inline-flex items-center gap-3 bg-kawai-red text-white px-8 py-4 text-xs tracking-[0.2em] uppercase font-medium transition-all duration-300 hover:bg-kawai-red/85 hover:gap-4 group"
              style={{ fontFamily: 'var(--font-brand-sans)' }}
            >
              Find a Dealer Near You
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                <path d="M9 1l4 4-4 4M13 5H1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link
              href="/pianos"
              className="inline-flex items-center gap-3 border border-white/15 text-white/60 px-8 py-4 text-xs tracking-[0.2em] uppercase font-medium transition-all duration-300 hover:border-white/30 hover:text-white/80"
              style={{ fontFamily: 'var(--font-brand-sans)' }}
            >
              Explore Pianos
            </Link>
          </motion.div>
        </div>

        {/* Offer fine print */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="text-white/15 text-xs mt-16 leading-relaxed max-w-lg"
          style={{ fontFamily: 'var(--font-brand-sans)' }}
        >
          Offer valid April 1 – June 30, 2026 at participating authorized Kawai dealers in the United States. Savings applied as instant rebate at point of sale on qualifying new piano purchases.
        </motion.p>
      </div>
    </section>
  )
}
