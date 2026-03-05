'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
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
          <div className="max-w-2xl mx-auto px-6 py-2.5">
            <FaqSearch variant="floating" placeholder="Search support articles…" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
