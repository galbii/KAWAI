'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { FaqSearch } from './FaqSearch'

export function TSDGlobalSearch() {
  const [visible, setVisible] = useState(false)
  const pathname = usePathname()
  const isLanding = pathname === '/technical-support-division'
  const threshold = isLanding ? 600 : 320

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > threshold)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="tsd-global-search"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="fixed left-0 right-0 z-50 bg-kawai-black/95 backdrop-blur-md border-b border-white/[0.06]"
          style={{ top: 'var(--header-bottom, 80px)' }}
        >
          <div className="max-w-7xl mx-auto px-8 py-2.5 flex items-center gap-6">
            {!isLanding && (
              <Link
                href="/technical-support-division"
                className="flex-shrink-0 inline-flex items-center gap-2 text-white/30 hover:text-white/70 transition-colors duration-200 text-[11px] tracking-[0.2em] uppercase font-[family-name:var(--font-brand-sans)]"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Support Center
              </Link>
            )}
            <div className="flex-1 max-w-2xl">
              <FaqSearch variant="floating" placeholder="Search support articles…" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
