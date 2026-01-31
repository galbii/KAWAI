'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'

type RebateModel = {
  model: string
  slug: string
  rebate: number
  category: string
  description: string
  features: string[]
}

type RebateGridProps = {
  models: RebateModel[]
}

export function RebateGrid({ models }: RebateGridProps) {
  const gridRef = useRef(null)
  const isInView = useInView(gridRef, { once: true, amount: 0.05 })

  // Sort by rebate descending
  const sortedModels = [...models].sort((a, b) => b.rebate - a.rebate)

  return (
    <section ref={gridRef} className="relative py-32 md:py-40 bg-kawai-pearl">
      <div className="container mx-auto px-8 lg:px-20 max-w-7xl">
        {/* Clean section header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-24"
        >
          <h2
            className="text-4xl md:text-5xl font-light text-kawai-charcoal mb-6 tracking-tight"
            style={{
              fontFamily: 'var(--font-crimson), Georgia, serif',
              letterSpacing: '-0.02em'
            }}
          >
            Available Models
          </h2>
          <p className="text-lg text-kawai-charcoal/50 font-light max-w-xl">
            Premium hybrid pianos featuring ATX4 and Aures2 technology
          </p>
        </motion.div>

        {/* Clean grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {sortedModels.map((piano, index) => (
            <motion.div
              key={piano.model}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.08 }}
            >
              <PianoCard piano={piano} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PianoCard({ piano }: { piano: RebateModel }) {
  return (
    <Link
      href={`/products/${piano.slug}`}
      className="group block h-full"
    >
      <article className="h-full bg-white border border-kawai-charcoal/10 hover:border-kawai-red/30 transition-all duration-500">
        {/* Clean header with rebate */}
        <div className="p-8 border-b border-kawai-charcoal/5">
          <div className="flex items-start justify-between mb-6">
            <span className="text-xs tracking-[0.2em] uppercase text-kawai-charcoal/40 font-medium">
              {piano.category}
            </span>
            <span className="text-2xl font-light text-kawai-red" style={{ fontFamily: 'var(--font-crimson), Georgia, serif' }}>
              ${piano.rebate.toLocaleString()}
            </span>
          </div>

          <h3
            className="text-3xl font-light text-kawai-charcoal group-hover:text-kawai-red transition-colors duration-300 mb-3"
            style={{
              fontFamily: 'var(--font-crimson), Georgia, serif',
              letterSpacing: '-0.01em'
            }}
          >
            {piano.model}
          </h3>

          <p className="text-sm text-kawai-charcoal/60 leading-relaxed font-light">
            {piano.description}
          </p>
        </div>

        {/* Clean features */}
        <div className="p-8">
          <ul className="space-y-3 mb-8">
            {piano.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-sm text-kawai-charcoal/70 font-light">
                <span className="w-1 h-1 rounded-full bg-kawai-red mt-2 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          {/* Minimal CTA */}
          <div className="inline-flex items-center gap-2 text-kawai-charcoal group-hover:gap-3 transition-all duration-300">
            <span className="text-sm tracking-wide">View Details</span>
            <svg
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </article>
    </Link>
  )
}
