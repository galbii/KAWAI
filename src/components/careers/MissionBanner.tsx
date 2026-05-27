'use client'

import { motion } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1] as const

export function MissionBanner() {
  return (
    <section className="relative bg-kawai-pearl overflow-hidden">
      {/* Radial gradient orb */}
      <div
        className="absolute pointer-events-none inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 80% at 30% 50%, rgba(225,25,34,0.06) 0%, transparent 65%)',
        }}
      />

      <div className="relative z-10 px-8 md:px-16 lg:px-24 py-16 md:py-20 max-w-screen-xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        {/* Glass quote card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: EASE }}
          className="bg-white/70 backdrop-blur-md border border-white/60 border-l-4 border-l-kawai-red shadow-brand-medium rounded-2xl px-10 py-8 max-w-2xl"
        >
          <p className="text-2xl md:text-3xl lg:text-4xl font-[family-name:var(--font-brand-luxury)] text-kawai-black leading-snug italic">
            &ldquo;Since 1927, Kawai has been part of how the world experiences
            music. We are building the team that carries that forward.&rdquo;
          </p>
        </motion.div>

        {/* Glass CTA button */}
        <motion.a
          href="#openings"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.18 }}
          className="flex-shrink-0 inline-flex items-center gap-3 px-7 py-3.5 bg-white/70 backdrop-blur-md border border-kawai-red/30 text-kawai-red text-sm font-medium uppercase tracking-[0.1em] font-[family-name:var(--font-brand-sans)] rounded-xl shadow-brand-subtle hover:bg-white hover:border-kawai-red hover:shadow-brand-medium transition-all duration-200 self-start md:self-auto"
        >
          See Open Roles
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M3 8h10M8 3l5 5-5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.a>
      </div>
    </section>
  )
}
