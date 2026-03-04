'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const options = [
  {
    href: '/technical-support-division/owner-hub',
    number: '01',
    title: 'I Own a Kawai',
    description: 'Troubleshooting, connectivity, firmware & care',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <rect x="2" y="8" width="20" height="8" rx="1.5" />
        <path strokeLinecap="round" d="M6 8V7M9 8V6M12 8V7M15 8V6M18 8V7" />
      </svg>
    ),
  },
  {
    href: '/technical-support-division/buyer-hub',
    number: '02',
    title: "I'm Choosing a Kawai",
    description: 'Model comparisons, action tech & buying guides',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
    ),
  },
  {
    href: '/technical-support-division/technician-resources',
    number: '03',
    title: 'Piano Technician',
    description: 'Regulation manuals, parts diagrams & specs',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l5.654-4.654m5.598-2.167a3.375 3.375 0 0 0-4.242 4.243" />
      </svg>
    ),
  },
]

export function TSDLandingHero() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-24 md:py-32">
      {/* Overline */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="text-[11px] text-kawai-red tracking-[0.35em] uppercase font-medium mb-10 font-[family-name:var(--font-brand-sans)]"
      >
        Support Center
      </motion.p>

      {/* Prompt */}
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="font-[family-name:var(--font-brand-serif)] font-light text-4xl md:text-5xl lg:text-6xl text-white text-center leading-tight mb-16"
      >
        Please select an option.
      </motion.h1>

      {/* Three options */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        {options.map((opt, i) => (
          <motion.div
            key={opt.href}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.45,
              delay: 0.18 + i * 0.1,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <Link
              href={opt.href}
              className="group flex flex-col min-h-[220px] md:min-h-[280px] bg-white/[0.04] border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:bg-white/[0.08] hover:border-kawai-red"
            >
              {/* Number */}
              <span className="text-[10px] font-semibold tracking-[0.3em] text-kawai-red/70 mb-6 font-[family-name:var(--font-brand-sans)]">
                {opt.number}
              </span>

              {/* Icon */}
              <div className="text-white/40 group-hover:text-white/70 transition-colors duration-300 mb-auto">
                {opt.icon}
              </div>

              {/* Text */}
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-white mb-1.5 font-[family-name:var(--font-brand-sans)] leading-snug">
                  {opt.title}
                </h2>
                <p className="text-sm text-white/40 font-[family-name:var(--font-brand-sans)] leading-relaxed">
                  {opt.description}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
