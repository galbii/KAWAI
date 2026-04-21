'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface CampaignNavigatorProps {
  storeslug: string
}

function SakuraBlossom({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {/* 5 petals rotated around center */}
      {[0, 72, 144, 216, 288].map((deg) => (
        <g key={deg} transform={`rotate(${deg} 20 20)`}>
          <ellipse
            cx="20"
            cy="11"
            rx="5"
            ry="9"
            fill="currentColor"
            fillOpacity="0.9"
          />
          {/* Petal notch */}
          <ellipse cx="20" cy="5.5" rx="2" ry="2.5" fill="white" fillOpacity="0.35" />
        </g>
      ))}
      {/* Center */}
      <circle cx="20" cy="20" r="4" fill="white" fillOpacity="0.5" />
      <circle cx="20" cy="20" r="2.5" fill="currentColor" />
      {/* Stamen dots */}
      {[0, 60, 120, 180, 240, 300].map((deg) => {
        const rad = (deg * Math.PI) / 180
        const x = 20 + Math.cos(rad) * 5.5
        const y = 20 + Math.sin(rad) * 5.5
        return <circle key={deg} cx={x} cy={y} r="0.8" fill="white" fillOpacity="0.6" />
      })}
    </svg>
  )
}

const CAMPAIGNS = [
  {
    key: 'grand-spring-sale',
    href: (slug: string) => `/store/${slug}/grand-spring-sale`,
    label: 'Grand Spring Sale',
    sublabel: '0% financing · 36 months',
    description: 'Every grand piano in our collection, starting at $0 down. Limited offer May 1–17.',
    accentClass: 'bg-kawai-red text-white',
    iconBg: 'bg-kawai-red/10',
    icon: (
      <svg className="w-6 h-6 text-kawai-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
      </svg>
    ),
  },
  {
    key: 'trade',
    href: (slug: string) => `/store/${slug}/trade`,
    label: 'Piano Trade-In',
    sublabel: '+$500 over any appraisal',
    description: 'We\'ll beat any independent appraisal by $500 toward a new Kawai grand. Combine with financing.',
    accentClass: 'bg-kawai-black text-white',
    iconBg: 'bg-kawai-black/6',
    icon: (
      <svg className="w-6 h-6 text-kawai-charcoal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" />
      </svg>
    ),
  },
]

export function CampaignNavigator({ storeslug }: CampaignNavigatorProps) {
  const [open, setOpen] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* Trigger */}
      <motion.button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-3 pl-3.5 pr-4 py-3 bg-white border border-kawai-neutral shadow-brand-premium hover:shadow-brand-medium hover:border-kawai-red/20 transition-all rounded-full group"
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        aria-label="View spring campaign pages"
      >
        <SakuraBlossom className="w-6 h-6 text-kawai-red flex-shrink-0 group-hover:rotate-12 transition-transform duration-300" />
        <span className="text-kawai-black text-sm font-medium tracking-wide pr-0.5">Spring Specials</span>
        <div className="w-1.5 h-1.5 rounded-full bg-kawai-red animate-pulse flex-shrink-0" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-50 bg-kawai-black/50 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setOpen(false)}
              aria-hidden
            />

            {/* Panel */}
            <motion.div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-label="Spring campaign pages"
              className="fixed bottom-0 left-0 right-0 sm:left-auto sm:bottom-6 sm:right-6 z-50 w-full sm:w-[28rem] bg-white sm:rounded-xl overflow-hidden shadow-[0_32px_64px_rgba(30,27,22,0.22)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Header */}
              <div className="relative px-6 pt-6 pb-5 border-b border-kawai-neutral/70 overflow-hidden">
                {/* Decorative sakura cluster */}
                <div className="absolute -top-3 -right-3 opacity-[0.07] pointer-events-none" aria-hidden>
                  <SakuraBlossom className="w-28 h-28 text-kawai-red" />
                </div>
                <div className="absolute top-4 right-10 opacity-[0.05] pointer-events-none" aria-hidden>
                  <SakuraBlossom className="w-14 h-14 text-kawai-red" />
                </div>

                <div className="flex items-start justify-between gap-4 relative z-10">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <SakuraBlossom className="w-5 h-5 text-kawai-red" />
                      <span className="text-kawai-red text-xs tracking-[0.2em] uppercase font-medium">
                        Spring 2026
                      </span>
                    </div>
                    <h2 className="text-kawai-black text-lg font-semibold leading-snug">
                      Limited Time Spring Offers
                    </h2>
                    <p className="text-kawai-charcoal/50 text-sm mt-0.5">
                      Two offers running now — May 1–17
                    </p>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-kawai-charcoal/40 hover:text-kawai-black hover:bg-kawai-neutral/50 transition-colors rounded-full mt-0.5"
                    aria-label="Close"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Campaign cards */}
              <div className="p-4 space-y-3">
                {CAMPAIGNS.map(({ key, href, label, sublabel, description, iconBg, icon }) => (
                  <a
                    key={key}
                    href={href(storeslug)}
                    onClick={() => setOpen(false)}
                    className="flex gap-4 p-4 rounded-lg border border-kawai-neutral/60 hover:border-kawai-red/25 hover:bg-kawai-pearl/50 transition-all group"
                  >
                    {/* Icon */}
                    <div className={`flex-shrink-0 w-12 h-12 ${iconBg} rounded-lg flex items-center justify-center`}>
                      {icon}
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-kawai-black text-sm font-semibold">{label}</span>
                      </div>
                      <div className="text-kawai-red text-xs font-medium mb-1.5">{sublabel}</div>
                      <p className="text-kawai-charcoal/55 text-xs leading-relaxed">{description}</p>
                    </div>

                    {/* Arrow */}
                    <div className="flex-shrink-0 flex items-center self-center">
                      <div className="w-7 h-7 rounded-full border border-kawai-neutral/60 group-hover:border-kawai-red group-hover:bg-kawai-red flex items-center justify-center transition-all">
                        <svg
                          className="w-3 h-3 text-kawai-charcoal/40 group-hover:text-white transition-colors"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </svg>
                      </div>
                    </div>
                  </a>
                ))}
              </div>

              {/* Footer */}
              <div className="mx-4 mb-4 px-4 py-3 bg-kawai-pearl/60 rounded-lg border border-kawai-neutral/50">
                <div className="flex items-center gap-2">
                  <Image
                    src="/images/logos/kawai-logo-red-1x.png"
                    alt="Kawai"
                    width={72}
                    height={14}
                    className="object-contain opacity-60"
                  />
                  <span className="text-kawai-charcoal/30 text-xs">·</span>
                  <p className="text-kawai-charcoal/40 text-xs">
                    May 1–17, 2026 · Financing subject to credit approval
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
