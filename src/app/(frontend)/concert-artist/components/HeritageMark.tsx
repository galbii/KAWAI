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
              Certificate of Authenticity
            </p>
            <div className="h-px bg-black/20 w-12"></div>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-black leading-tight max-w-3xl mx-auto">
            Your Piano's Unique Identity
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
                    CA901-2024-001234
                  </div>
                  <p className="text-xs text-black/50 italic">
                    (Example format)
                  </p>
                </div>

                {/* What the serial number represents */}
                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-black/30 mt-1.5 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-black/80">Model Designation</p>
                      <p className="text-black/60 text-xs">CA401, CA501, CA701, or CA901</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-black/30 mt-1.5 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-black/80">Manufacturing Year</p>
                      <p className="text-black/60 text-xs">Traceable to production facility</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-black/30 mt-1.5 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-black/80">Unique Unit Number</p>
                      <p className="text-black/60 text-xs">Individual instrument identifier</p>
                    </div>
                  </div>
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

              <p className="font-light">
                This number tells us who assembled your soundboard, which craftsman voiced your hammers, the exact day your SK-EX samples were installed, and which quality inspector signed off on final assembly.
              </p>

              <p className="font-light">
                It's your piano's fingerprint. A permanent registry entry in Kawai's manufacturing records. Proof that your instrument came from the same Hamamatsu facility that builds our $200,000 Shigeru Kawai concert grands.
              </p>
            </div>

            {/* Highlighted statement */}
            <div className="pt-6 pl-6 border-l-2 border-black/20">
              <p className="font-serif text-xl md:text-2xl text-black italic leading-relaxed">
                "This isn't mass production. This is accountable craftsmanship."
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
              <p className="flex items-start gap-2">
                <span className="text-black/40">—</span>
                <span>Enhances resale value and authenticity</span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
