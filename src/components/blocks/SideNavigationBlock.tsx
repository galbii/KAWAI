'use client'

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion'
import { usePageLayout } from '@/lib/contexts/PageLayoutContext'

interface NavSection {
  label: string
  targetId: string
  icon?: 'none' | 'circle' | 'square' | 'triangle' | 'diamond' | 'piano' | 'sparkles' | 'target' | 'pin' | 'star'
}

interface SectionLabel {
  label: string
}

interface SideNavigationBlockProps {
  enabled?: boolean | null
  sectionLabels?: SectionLabel[] | null
  title?: string | null
  position?: 'left' | 'right' | null
  theme?: 'light' | 'dark' | 'red' | 'gold' | null
  mobileStyle?: 'bottom-bar' | 'hamburger' | 'hidden' | null
  mobileLabel?: string | null
  smoothScroll?: boolean | null
  scrollOffset?: number | null
  autoHide?: boolean | null
  showProgress?: boolean | null
  glassmorphism?: boolean | null
  showBorder?: boolean | null
  compactMode?: boolean | null
}

const iconMap = {
  circle: '●',
  square: '■',
  triangle: '▲',
  diamond: '◆',
  piano: '🎹',
  sparkles: '✨',
  target: '🎯',
  pin: '📍',
  star: '⭐',
  none: '',
}

export function SideNavigationBlock({
  enabled = true,
  sectionLabels = [],
  title = 'Navigation',
  position = 'right',
  theme = 'light',
  mobileStyle = 'hamburger',
  mobileLabel = 'Menu',
  smoothScroll = true,
  scrollOffset = 80,
  autoHide = false,
  showProgress = true,
  glassmorphism = true,
  showBorder = true,
  compactMode = false,
}: SideNavigationBlockProps) {
  const pageLayout = usePageLayout()

  // Auto-generate navigation sections from page blocks
  const finalSections = useMemo(() => {
    if (!pageLayout || pageLayout.length === 0) {
      return []
    }

    // Auto-generate from page blocks
    let navigableBlockIndex = 0
    return pageLayout
      .map((block) => {
        // Exclude non-navigable blocks
        const excludedTypes = [
          'layout-side-navigation',
          'layout-spacer',
          'layout-divider',
          'layout-bottom-left-popup',
        ]

        if (excludedTypes.includes(block.blockType)) {
          return null
        }

        // Use custom label if provided at this index, otherwise auto-generate
        const customLabel = sectionLabels?.[navigableBlockIndex]?.label
        const label = customLabel || extractBlockLabel(block, navigableBlockIndex)
        const targetId = `block-${block.id}`
        const icon = getBlockIcon(block.blockType)

        navigableBlockIndex++
        return { label, targetId, icon } as NavSection
      })
      .filter((section): section is NavSection => section !== null)
  }, [sectionLabels, pageLayout])

  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up')
  const { scrollY } = useScroll()
  const lastScrollY = useRef(0)

  // Hide/show based on scroll direction
  useMotionValueEvent(scrollY, 'change', (latest) => {
    const direction = latest > lastScrollY.current ? 'down' : 'up'
    setScrollDirection(direction)

    if (autoHide) {
      setIsVisible(direction === 'up' || latest < 100)
    }

    lastScrollY.current = latest
  })

  // Intersection Observer for active section detection
  useEffect(() => {
    if (!enabled || !finalSections || finalSections.length === 0) return

    const observerOptions = {
      rootMargin: `-${scrollOffset}px 0px -50% 0px`,
      threshold: 0,
    }

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    finalSections.forEach((section) => {
      const element = document.getElementById(section.targetId)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [enabled, finalSections, scrollOffset])

  const handleNavClick = useCallback(
    (targetId: string) => {
      const element = document.getElementById(targetId)
      if (!element) return

      const offsetPosition = element.offsetTop - (scrollOffset || 80)

      if (smoothScroll) {
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        })
      } else {
        window.scrollTo(0, offsetPosition)
      }

      setIsMobileMenuOpen(false)
    },
    [smoothScroll, scrollOffset]
  )

  if (!enabled || !finalSections || finalSections.length === 0) {
    return null
  }

  // Theme classes
  const themeClasses = {
    light: 'bg-kawai-pearl/80 text-kawai-charcoal border-kawai-charcoal/10',
    dark: 'bg-kawai-charcoal/80 text-kawai-pearl border-kawai-pearl/10',
    red: 'bg-kawai-red/10 text-kawai-charcoal border-kawai-red/20 backdrop-blur-xl',
    gold: 'bg-[#D4AF37]/10 text-kawai-charcoal border-[#D4AF37]/20 backdrop-blur-xl',
  }

  const activeClasses = {
    light: 'text-kawai-red border-kawai-red',
    dark: 'text-[#D4AF37] border-[#D4AF37]',
    red: 'text-kawai-red border-kawai-red',
    gold: 'text-[#D4AF37] border-[#D4AF37]',
  }

  const baseClass = themeClasses[theme || 'light']
  const activeClass = activeClasses[theme || 'light']

  // Desktop Navigation
  const DesktopNav = (
    <motion.nav
      initial={{ opacity: 0, x: position === 'right' ? 50 : -50 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        x: isVisible ? 0 : position === 'right' ? 50 : -50,
      }}
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      className={`
        fixed top-1/2 -translate-y-1/2 z-40
        ${position === 'right' ? 'right-6' : 'left-6'}
        hidden lg:block
      `}
      aria-label="Page navigation"
    >
      <div
        className={`
          ${baseClass}
          ${glassmorphism ? 'backdrop-blur-md' : ''}
          ${showBorder ? 'border' : ''}
          rounded-2xl px-6 py-8
          shadow-lg
          min-w-[200px]
          relative
          transition-all duration-300
        `}
        style={{
          backgroundImage: glassmorphism
            ? 'radial-gradient(circle at top right, rgba(212, 175, 55, 0.05), transparent)'
            : undefined,
        }}
      >
        {/* Title */}
        {title && (
          <h3
            className="font-serif text-sm uppercase tracking-[0.2em] mb-6 opacity-60"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {title}
          </h3>
        )}

        {/* Progress Line */}
        {showProgress && (
          <div className="absolute left-4 top-20 bottom-8 w-px bg-current opacity-10" />
        )}

        {/* Navigation Items */}
        <ul className={`space-y-${compactMode ? '3' : '4'} relative`}>
          {finalSections.map((section, index) => {
            const isActive = activeSection === section.targetId
            const icon = section.icon && section.icon !== 'none' ? iconMap[section.icon] : null

            return (
              <motion.li
                key={section.targetId}
                initial={{ opacity: 0, x: position === 'right' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
              >
                <button
                  onClick={() => handleNavClick(section.targetId)}
                  className={`
                    group relative flex items-center gap-3 w-full text-left
                    transition-all duration-300
                    ${isActive ? activeClass : 'hover:translate-x-1'}
                  `}
                  aria-label={`Navigate to ${section.label}`}
                  aria-current={isActive ? 'true' : 'false'}
                >
                  {/* Icon or Dot */}
                  <span
                    className={`
                      flex-shrink-0 transition-all duration-300
                      ${isActive ? 'scale-125' : 'scale-100 opacity-50 group-hover:opacity-100'}
                      ${compactMode ? 'text-xs' : 'text-sm'}
                    `}
                  >
                    {icon || '●'}
                  </span>

                  {/* Label */}
                  <span
                    className={`
                      font-sans transition-all duration-300
                      ${isActive ? 'font-semibold' : 'font-normal opacity-70 group-hover:opacity-100'}
                      ${compactMode ? 'text-xs' : 'text-sm'}
                    `}
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {section.label}
                  </span>

                  {/* Active Indicator - Ink Brush Stroke */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-full rounded-full bg-current"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              </motion.li>
            )
          })}
        </ul>
      </div>
    </motion.nav>
  )

  // Mobile Bottom Bar (Andon Style)
  const MobileBottomBar = (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{
        y: isVisible ? 0 : 100,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 lg:hidden"
      aria-label="Mobile page navigation"
    >
      <div
        className={`
          ${baseClass}
          ${glassmorphism ? 'backdrop-blur-md' : ''}
          ${showBorder ? 'border' : ''}
          rounded-full px-4 py-2
          shadow-2xl
          flex items-center gap-2
          max-w-[90vw]
          overflow-x-auto
          scrollbar-hide
        `}
      >
        {finalSections.map((section) => {
          const isActive = activeSection === section.targetId
          const icon = section.icon && section.icon !== 'none' ? iconMap[section.icon] : '●'

          return (
            <motion.button
              key={section.targetId}
              onClick={() => handleNavClick(section.targetId)}
              className={`
                relative px-4 py-2 rounded-full text-xs whitespace-nowrap
                transition-all duration-300 font-sans
                ${isActive ? `${activeClass} font-semibold bg-current/10` : 'opacity-60 hover:opacity-100'}
              `}
              whileTap={{ scale: 0.95 }}
              aria-label={`Navigate to ${section.label}`}
              aria-current={isActive ? 'true' : 'false'}
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <span className="mr-1.5">{icon}</span>
              {section.label}
            </motion.button>
          )
        })}
      </div>
    </motion.nav>
  )

  // Mobile Hamburger Menu
  const MobileHamburgerMenu = (
    <>
      {/* Hamburger Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className={`
          fixed bottom-6 right-6 z-50 lg:hidden
          ${baseClass}
          ${glassmorphism ? 'backdrop-blur-md' : ''}
          ${showBorder ? 'border' : ''}
          rounded-full p-3
          shadow-lg
        `}
        aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isMobileMenuOpen}
      >
        <div className="w-6 h-5 flex flex-col justify-between">
          <motion.span
            animate={{ rotate: isMobileMenuOpen ? 45 : 0, y: isMobileMenuOpen ? 8 : 0 }}
            className="w-full h-0.5 bg-current rounded-full"
          />
          <motion.span
            animate={{ opacity: isMobileMenuOpen ? 0 : 1 }}
            className="w-full h-0.5 bg-current rounded-full"
          />
          <motion.span
            animate={{ rotate: isMobileMenuOpen ? -45 : 0, y: isMobileMenuOpen ? -8 : 0 }}
            className="w-full h-0.5 bg-current rounded-full"
          />
        </div>
      </motion.button>

      {/* Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-kawai-charcoal/40 backdrop-blur-sm z-40 lg:hidden"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={`
                fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] z-40 lg:hidden
                ${baseClass}
                ${glassmorphism ? 'backdrop-blur-xl' : ''}
                ${showBorder ? 'border-l' : ''}
                shadow-2xl
                overflow-y-auto
              `}
            >
              <div className="p-8 pt-24">
                {title && (
                  <h3
                    className="font-serif text-lg uppercase tracking-[0.2em] mb-8 opacity-80"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                  >
                    {title}
                  </h3>
                )}

                <ul className="space-y-4">
                  {finalSections.map((section, index) => {
                    const isActive = activeSection === section.targetId
                    const icon = section.icon && section.icon !== 'none' ? iconMap[section.icon] : null

                    return (
                      <motion.li
                        key={section.targetId}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <button
                          onClick={() => handleNavClick(section.targetId)}
                          className={`
                            group flex items-center gap-4 w-full text-left p-3 rounded-lg
                            transition-all duration-300
                            ${isActive ? `${activeClass} bg-current/5` : 'hover:bg-current/5'}
                          `}
                          aria-label={`Navigate to ${section.label}`}
                          aria-current={isActive ? 'true' : 'false'}
                        >
                          {icon && <span className="text-lg">{icon}</span>}
                          <span
                            className={`
                              font-sans text-base
                              ${isActive ? 'font-semibold' : 'font-normal opacity-80'}
                            `}
                            style={{ fontFamily: 'Inter, sans-serif' }}
                          >
                            {section.label}
                          </span>
                        </button>
                      </motion.li>
                    )
                  })}
                </ul>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )

  return (
    <>
      {/* Desktop Navigation */}
      {DesktopNav}

      {/* Mobile Navigation */}
      {mobileStyle === 'bottom-bar' && MobileBottomBar}
      {mobileStyle === 'hamburger' && MobileHamburgerMenu}
    </>
  )
}

/**
 * Helper: Extract meaningful label from block data
 */
function extractBlockLabel(block: any, index: number): string {
  // Try common title fields across different block types
  const label =
    block.title ||
    block.heading ||
    block.header ||
    block.label ||
    block.name ||
    block.productName ||
    block.sectionTitle ||
    block.headline ||
    `Section ${index + 1}`

  // Convert to string and limit length
  return String(label).slice(0, 50)
}

/**
 * Helper: Get appropriate icon for block type
 */
function getBlockIcon(blockType: string): NavSection['icon'] {
  const iconMap: Record<string, NavSection['icon']> = {
    // Marketing blocks
    'marketing-hero': 'star',
    'marketing-grand-hero': 'star',
    'marketing-cta': 'target',
    'marketing-testimonials': 'sparkles',
    'marketing-i2l': 'piano',
    'marketing-technical-showcase': 'target',
    'marketing-find-a-dealer': 'pin',
    'marketing-3d-viewer': 'circle',

    // Product blocks
    'product-showcase': 'piano',
    'product-hero': 'piano',
    'product-gallery': 'square',
    'product-features': 'sparkles',
    'product-specs': 'square',

    // Content blocks
    'content-text': 'circle',
    'content-image': 'square',
    'content-video': 'circle',
    'content-code': 'square',
    'content-banner': 'diamond',

    // Layout blocks
    'layout-columns': 'square',
    'layout-hero-carousel': 'circle',
    'layout-video-background': 'circle',
    'layout-brand-intro': 'star',
  }

  return iconMap[blockType] || 'circle'
}
