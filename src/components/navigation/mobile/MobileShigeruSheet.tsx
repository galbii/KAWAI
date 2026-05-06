'use client'

import Link from 'next/link'
import Image from 'next/image'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'

interface MobileShigeruSheetProps {
  isOpen: boolean
  onBack: () => void
  onNavigate: () => void
  imageUrl?: string | null
}

export function MobileShigeruSheet({ isOpen, onBack, onNavigate, imageUrl }: MobileShigeruSheetProps) {
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[9502] bg-black/60 xl:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onBack}
          />

          <motion.div
            className="fixed inset-x-0 bottom-0 z-[9503] xl:hidden rounded-t-2xl shadow-2xl overflow-hidden"
            style={{ background: '#0a0a0a' }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32, mass: 0.9 }}
          >
            {/* handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>

            {/* Back / close bar */}
            <div className="flex items-center justify-between px-5 py-2">
              <button
                onClick={onBack}
                className="flex items-center gap-1.5 text-white/50 hover:text-white transition-colors"
                aria-label="Back to menu"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back</span>
              </button>
              <button
                onClick={onNavigate}
                className="p-1.5 rounded-md hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4 text-white/50" />
              </button>
            </div>

            {/* Banner — mirrors desktop BannerOnlyView exactly */}
            <div className="relative mx-4 mb-4 rounded-2xl overflow-hidden" style={{ minHeight: '260px' }}>
              {/* Full-bleed image */}
              {imageUrl && (
                <Image
                  src={imageUrl}
                  alt="Shigeru Kawai grand piano"
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              )}
              {/* Same gradient as desktop */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />

              {/* Text content — bottom-left, matching desktop */}
              <div className="relative px-8 pt-7 pb-8 flex flex-col gap-5 h-full justify-end" style={{ minHeight: '260px' }}>
                <p
                  className="text-[10px] tracking-[0.5em] uppercase"
                  style={{ fontFamily: 'var(--font-oswald)', color: '#d5c78c' }}
                >
                  Grand Piano Collection
                </p>

                <div>
                  <h2
                    className="text-white font-extrabold uppercase leading-none"
                    style={{ fontFamily: 'var(--font-oswald)', fontSize: 'clamp(1.6rem, 6vw, 2rem)', letterSpacing: '0.04em' }}
                  >
                    Shigeru Kawai
                  </h2>
                  <span className="block mt-3 h-px w-10 opacity-40" style={{ background: '#d5c78c' }} />
                </div>

                <p
                  className="text-white/45 text-sm leading-relaxed max-w-[22ch]"
                  style={{ fontFamily: 'var(--font-brand-sans)' }}
                >
                  Six handcrafted grand pianos, built at the Ryuyo factory in Hamamatsu, Japan.
                </p>

                <Link
                  href="/shigeru"
                  onClick={onNavigate}
                  className="self-start inline-flex items-center gap-3 border-2 px-7 py-3 transition-all duration-300 hover:bg-[#d5c78c]/[0.08]"
                  style={{
                    borderColor: 'rgba(213,199,140,0.5)',
                    fontFamily: 'var(--font-oswald)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    letterSpacing: '0.28em',
                    textTransform: 'uppercase',
                    color: '#d5c78c',
                  }}
                >
                  Explore Collection
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  )
}
