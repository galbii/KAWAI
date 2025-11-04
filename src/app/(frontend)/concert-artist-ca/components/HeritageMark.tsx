'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

export default function HeritageMark() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      ref={ref}
      className="relative py-24 md:py-32 bg-white overflow-hidden"
    >
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px bg-black/20 w-12"></div>
            <p className="text-[11px] md:text-xs font-medium uppercase tracking-[0.25em] text-black/60">
              Authenticity Verification
            </p>
            <div className="h-px bg-black/20 w-12"></div>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-black leading-tight max-w-3xl mx-auto">
            Your Piano's Unique Identifier
          </h2>
        </motion.div>

        {/* Main Content Grid */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Left: Certificate */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Certificate Card */}
            <div className="bg-[#FAF8F5] border-2 border-black/10 p-8 md:p-10 relative">
              {/* Decorative corner marks */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-black/20"></div>
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-black/20"></div>
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-black/20"></div>
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-black/20"></div>

              <div className="space-y-8">
                {/* Header */}
                <div className="text-center border-b-2 border-black/10 pb-6">
                  <p className="text-xs tracking-[0.3em] uppercase text-black/60 mb-2">
                    KAWAI Musical Instruments
                  </p>
                  <h3 className="font-serif text-2xl md:text-3xl text-black font-light">
                    Concert Artist Series
                  </h3>
                </div>

                {/* Serial Number Display */}
                <div className="bg-white/50 border border-black/10 p-6 text-center">
                  <p className="text-xs tracking-[0.2em] uppercase text-black/60 mb-3">
                    Serial Number
                  </p>
                  <div className="font-mono text-2xl md:text-3xl text-black tracking-wider mb-2">
                    G512650
                  </div>
                  <p className="text-xs text-black/50 italic">
                    (Example: G = Country, followed by unique identifier)
                  </p>
                </div>


                {/* Date and signature area */}
                <div className="pt-6 border-t border-black/10 text-center">
                  <p className="text-xs tracking-[0.2em] uppercase text-black/60">
                    Since 1927 — Hamamatsu, Japan
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Explanation */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-6"
          >
            <h3 className="font-serif text-2xl md:text-3xl lg:text-4xl text-black font-light leading-tight">
              Traceable. Authentic. Yours.
            </h3>

            <div className="space-y-4 text-base md:text-lg text-black/70 leading-relaxed">
              <p>
                Every Concert Artist piano carries a unique serial number—not a decoration, but a traceable connection to its birth.
              </p>
            </div>


            {/* Additional details */}
            <div className="pt-6 space-y-3 text-sm text-black/60">
              <p className="flex items-start gap-2">
                <span className="text-black/40">—</span>
                <span>Verifiable through Kawai customer service</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-black/40">—</span>
                <span>Required for warranty registration</span>
              </p>
            </div>

            {/* CTA Button */}
            <div className="pt-8">
              <a
                href="https://kawaius.com/registration/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-black/90 transition-colors duration-200"
              >
                Register Your Piano
                <svg
                  className="ml-2 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
