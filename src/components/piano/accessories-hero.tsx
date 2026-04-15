'use client'

import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'

// ─── Component ────────────────────────────────────────────────────────────────

export function AccessoriesHero() {
  function scrollTo(id: string) {
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  return (
    <section className="relative bg-white border-b border-kawai-neutral/60 overflow-hidden">

      {/* Red top accent */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-kawai-red" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full py-20 lg:py-28">
        <div>

          {/* Copy + CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="max-w-lg"
          >
            <p className="text-[10px] tracking-[0.5em] uppercase text-kawai-red font-bold mb-5 font-[family-name:var(--font-brand-sans)]">
              Piano Accessories
            </p>

            <h1
              className="font-[family-name:var(--font-brand-luxury)] text-kawai-black leading-[0.95] mb-5"
              style={{ fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)' }}
            >
              Every detail.
              <br />
              <span className="text-kawai-charcoal/30 italic">Perfectly chosen.</span>
            </h1>

            <p className="text-[14px] text-kawai-charcoal/45 font-[family-name:var(--font-brand-sans)] leading-relaxed mb-9">
              Find compatible accessories for your piano, or build your complete setup in one place.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => scrollTo('piano-builder')}
                className="px-6 py-3.5 bg-kawai-red text-white text-[11px] uppercase tracking-[0.2em] font-bold font-[family-name:var(--font-brand-sans)] hover:bg-red-700 transition-colors duration-200"
              >
                Build Your Setup
              </button>

              <button
                onClick={() => scrollTo('accessories-browse')}
                className="group flex items-center gap-2 px-6 py-3.5 border border-kawai-neutral text-kawai-charcoal/50 text-[11px] uppercase tracking-[0.2em] font-bold font-[family-name:var(--font-brand-sans)] hover:border-kawai-charcoal/40 hover:text-kawai-black transition-all duration-200"
              >
                Browse All
                <ArrowDown className="w-3 h-3 transition-transform duration-300 group-hover:translate-y-0.5" />
              </button>
            </div>
          </motion.div>

        </div>
      </div>

    </section>
  )
}
