'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface NavItem {
  label: string
  targetId: string
}

interface ProductSideNavProps {
  blocks: any[]
}

const EXCLUDED_BLOCK_TYPES = new Set([
  'product-floating-add-to-cart',
])

function getLabel(block: any): string | null {
  switch (block.blockType) {
    case 'product-hero':                return 'Overview'
    case 'product-description':         return 'Experience'
    case 'product-feature-slides':      return 'Features'
    case 'product-technical-specs':     return 'Specifications'
    case 'product-collection-showcase': return 'Collection'
    case 'product-soundcloud-embed':    return block.soundcloudUrl ? 'Listen' : null
    case 'product-related-products':    return block.heading || 'Explore More'
    case 'product-faq':                 return 'FAQ'
    case 'product-accessories':         return 'Accessories'
    case 'product-gallery':             return 'Gallery'
    case 'product-specs':               return 'Specifications'
    case 'product-showcase':            return block.title || 'Details'
    case 'marketing-hero':              return block.content?.title || 'Overview'
    case 'marketing-cta':               return block.content?.title || 'Get Started'
    case 'marketing-testimonials':      return 'Reviews'
    case 'content-text':                return block.title || 'Info'
    case 'content-banner':              return block.title || 'More'
    default:                            return block.title || block.heading || 'Section'
  }
}

function buildNavItems(blocks: any[]): NavItem[] {
  return blocks.reduce<NavItem[]>((acc, block, index) => {
    if (EXCLUDED_BLOCK_TYPES.has(block.blockType)) return acc
    const label = getLabel(block)
    if (!label) return acc
    acc.push({ label, targetId: `block-${index}` })
    return acc
  }, [])
}

const SCROLL_OFFSET = 80
const APPEAR_DELAY_MS  = 2000  // wait before sliding in on page load
const AUTO_COLLAPSE_MS = 3000  // how long the expanded state stays open after appearing

export function ProductSideNav({ blocks }: ProductSideNavProps) {
  const navItems = buildNavItems(blocks)

  const [activeSection, setActiveSection]         = useState<string | null>(null)
  const [isDesktopExpanded, setIsDesktopExpanded] = useState(true)
  const [isMobileExpanded, setIsMobileExpanded]   = useState(true)

  const desktopTimerRef = useRef<NodeJS.Timeout | null>(null)
  const mobileTimerRef  = useRef<NodeJS.Timeout | null>(null)

  // Appear after delay, then auto-collapse after the display window
  useEffect(() => {
    const collapseAt = APPEAR_DELAY_MS + AUTO_COLLAPSE_MS
    desktopTimerRef.current = setTimeout(() => setIsDesktopExpanded(false), collapseAt)
    mobileTimerRef.current  = setTimeout(() => setIsMobileExpanded(false),  collapseAt)
    return () => {
      if (desktopTimerRef.current) clearTimeout(desktopTimerRef.current)
      if (mobileTimerRef.current)  clearTimeout(mobileTimerRef.current)
    }
  }, [])

  // Intersection observer
  useEffect(() => {
    if (navItems.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id) })
      },
      { rootMargin: `-${SCROLL_OFFSET}px 0px -50% 0px`, threshold: 0 }
    )
    navItems.forEach(({ targetId }) => {
      const el = document.getElementById(targetId)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navItems.length])

  const scrollTo = useCallback((targetId: string) => {
    const el = document.getElementById(targetId)
    if (!el) return

    // getBoundingClientRect gives viewport-relative position; adding scrollY
    // converts to absolute document position. This is accurate regardless of
    // offsetParent chain or sticky/relative ancestors (unlike offsetTop).
    const absoluteTop = window.scrollY + el.getBoundingClientRect().top - SCROLL_OFFSET

    // Suppress the feature slides auto-snap while we're navigating — otherwise
    // its onPageScroll fires mid-scroll, calls its own window.scrollTo(), and
    // hijacks the destination. Clear after a generous window (smooth scroll
    // duration is browser-dependent but rarely exceeds 1s).
    ;(window as any).__kawaiNavScrolling = true
    setTimeout(() => { ;(window as any).__kawaiNavScrolling = false }, 1200)

    window.scrollTo({ top: absoluteTop, behavior: 'smooth' })
  }, [])

  const handleDesktopEnter = useCallback(() => {
    if (desktopTimerRef.current) clearTimeout(desktopTimerRef.current)
    setIsDesktopExpanded(true)
  }, [])

  const handleDesktopLeave = useCallback(() => {
    if (desktopTimerRef.current) clearTimeout(desktopTimerRef.current)
    desktopTimerRef.current = setTimeout(() => setIsDesktopExpanded(false), AUTO_COLLAPSE_MS)
  }, [])

  const handleMobileTap = useCallback(() => {
    setIsMobileExpanded(true)
    if (mobileTimerRef.current) clearTimeout(mobileTimerRef.current)
    mobileTimerRef.current = setTimeout(() => setIsMobileExpanded(false), AUTO_COLLAPSE_MS)
  }, [])

  if (navItems.length === 0) return null

  const activeIndex = navItems.findIndex(item => item.targetId === activeSection)

  return (
    <>
      {/* ── Desktop ── */}
      <div className="fixed top-1/2 right-5 z-40 hidden lg:block -translate-y-1/2">
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 2 }}
          onMouseEnter={handleDesktopEnter}
          onMouseLeave={handleDesktopLeave}
        >
          <AnimatePresence mode="wait">
            {isDesktopExpanded ? (
              /* ── Expanded: full labels ── */
              <motion.nav
                key="expanded"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                className="overflow-hidden rounded-2xl border shadow-lg backdrop-blur-xl"
                style={{ background: 'rgba(250, 248, 245, 0.88)', borderColor: 'rgba(44,44,44,0.08)' }}
                aria-label="Product page navigation"
              >
                <div className="flex flex-col">
                  {/* Header */}
                  <div className="px-6 pt-4 pb-3 border-b border-kawai-charcoal/6">
                    <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-kawai-charcoal/35 leading-none" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Quick Navigation
                    </p>
                  </div>
                  {/* Nav items */}
                  <div className="flex flex-col py-2">
                    {navItems.map((item) => {
                      const isActive = activeSection === item.targetId
                      return (
                        <button
                          key={item.targetId}
                          onClick={() => scrollTo(item.targetId)}
                          className={`relative flex items-center px-6 py-3 text-[13px] tracking-wide whitespace-nowrap transition-colors duration-150 ${
                            isActive
                              ? 'text-kawai-red font-semibold'
                              : 'text-kawai-charcoal/45 font-medium hover:text-kawai-charcoal/80'
                          }`}
                          style={{ fontFamily: 'Inter, sans-serif' }}
                          aria-label={`Navigate to ${item.label}`}
                          aria-current={isActive ? 'true' : 'false'}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="desktopNavBar"
                              className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-kawai-red"
                              transition={{ duration: 0.2, ease: 'easeInOut' }}
                            />
                          )}
                          {item.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </motion.nav>
            ) : (
              /* ── Collapsed: thin pill with sliding position indicator ── */
              <motion.nav
                key="collapsed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="relative rounded-full border shadow-md overflow-hidden cursor-pointer"
                style={{
                  width: '6px',
                  background: 'rgba(250, 248, 245, 0.88)',
                  borderColor: 'rgba(44,44,44,0.10)',
                  height: `${navItems.length * 24 + 16}px`,
                }}
                aria-label="Product page navigation (hover to expand)"
              >
                {/* Active position marker */}
                <motion.div
                  className="absolute left-0 right-0 rounded-full bg-kawai-red"
                  style={{ height: '20px' }}
                  animate={{
                    top: activeIndex >= 0
                      ? `${8 + activeIndex * 24}px`
                      : '8px',
                  }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                />
              </motion.nav>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ── Mobile ── */}
      <div className="fixed top-1/2 right-3 z-[100] lg:hidden -translate-y-1/2">
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 2 }}
          onClick={handleMobileTap}
        >
          <AnimatePresence mode="wait">
            {isMobileExpanded ? (
              <motion.nav
                key="expanded"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                className="overflow-hidden rounded-2xl border shadow-lg backdrop-blur-xl"
                style={{ background: 'rgba(250, 248, 245, 0.88)', borderColor: 'rgba(44,44,44,0.08)' }}
                aria-label="Product page navigation"
              >
                <div className="flex flex-col">
                  <div className="px-5 pt-3.5 pb-2.5 border-b border-kawai-charcoal/6">
                    <p className="text-[9px] font-semibold tracking-[0.18em] uppercase text-kawai-charcoal/35 leading-none" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Quick Navigation
                    </p>
                  </div>
                  <div className="flex flex-col py-1.5">
                    {navItems.map((item) => {
                      const isActive = activeSection === item.targetId
                      return (
                        <button
                          key={item.targetId}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleMobileTap()
                            scrollTo(item.targetId)
                          }}
                          className={`relative flex items-center px-5 py-2.5 text-[12px] tracking-wide whitespace-nowrap transition-colors duration-150 ${
                            isActive
                              ? 'text-kawai-red font-semibold'
                              : 'text-kawai-charcoal/45 font-medium'
                          }`}
                          style={{ fontFamily: 'Inter, sans-serif' }}
                          aria-label={`Navigate to ${item.label}`}
                          aria-current={isActive ? 'true' : 'false'}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="mobileNavBar"
                              className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full bg-kawai-red"
                              transition={{ duration: 0.2, ease: 'easeInOut' }}
                            />
                          )}
                          {item.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </motion.nav>
            ) : (
              <motion.nav
                key="collapsed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="relative rounded-full border shadow-md overflow-hidden"
                style={{
                  width: '6px',
                  background: 'rgba(250, 248, 245, 0.88)',
                  borderColor: 'rgba(44,44,44,0.10)',
                  height: `${navItems.length * 20 + 12}px`,
                }}
                aria-label="Product page navigation (tap to expand)"
              >
                <motion.div
                  className="absolute left-0 right-0 rounded-full bg-kawai-red"
                  style={{ height: '16px' }}
                  animate={{
                    top: activeIndex >= 0
                      ? `${6 + activeIndex * 20}px`
                      : '6px',
                  }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                />
              </motion.nav>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  )
}
