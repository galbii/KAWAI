'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown } from 'lucide-react'

/**
 * NAMM 2026 Custom Header
 *
 * Black-themed minimal header for the NAMM landing page.
 * Features:
 * - Solid black background
 * - Dropdown navigation for "The Kawai Experience"
 * - Direct links to main page sections
 */
export function NAMMHeader() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Check if a link is active
  const isActiveLink = (href: string) => {
    // For hash links, don't show active state (they're just anchors on the same page)
    if (href.includes('#')) {
      return false
    }
    // For regular paths, exact match
    return pathname === href
  }

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false)
      }

      // Close dropdown when clicking outside
      if (
        isDropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMenuOpen, isDropdownOpen])

  // Scroll lock for mobile menu
  useEffect(() => {
    if (isMenuOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow
      document.body.style.overflow = 'hidden'

      return () => {
        document.body.style.overflow = originalStyle
      }
    }
    return undefined
  }, [isMenuOpen])

  const closeMobileMenu = () => {
    setIsMenuOpen(false)
    setIsMobileDropdownOpen(false)
  }

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      x: '100%',
      transition: {
        duration: 0.3
      }
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4
      }
    }
  }

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 bg-black shadow-xl"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1.0]
      }}
    >
      {/* Spotlight effect - subtle glow below header */}
      <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[800px] h-32 bg-white/5 blur-3xl pointer-events-none" />

      {/* Main Header Container */}
      <div className="relative flex items-center justify-between h-16">
        {/* Left side - NAMM Logo Banner (aligned to screen edge) */}
        <Link href="/namm-2026" className="relative h-16 w-auto flex-shrink-0">
          <motion.div
            initial={{ x: -200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              duration: 1,
              delay: 0.3,
              ease: [0.25, 0.1, 0.25, 1.0]
            }}
            className="relative h-16 w-auto"
          >
            <Image
              src="/images/namm/NS26_LogoSideBanner_M.png"
              alt="NAMM Show 2026"
              width={300}
              height={64}
              className="h-full w-auto object-contain"
              priority
            />
          </motion.div>
        </Link>

        {/* Center Navigation - Desktop */}
        <nav className="hidden md:flex items-center space-x-8 mx-auto">
          {/* Home Link */}
          <Link
            href="/namm-2026"
            className="relative text-white/90 hover:text-white font-medium transition-colors duration-200 text-sm tracking-wide py-1"
          >
            Home
            {isActiveLink('/namm-2026') && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[#E31937] to-[#FF3B55] rounded-full"
                style={{
                  boxShadow: '0 0 8px rgba(227, 25, 55, 0.6), 0 0 16px rgba(227, 25, 55, 0.3)'
                }}
                transition={{
                  type: "spring",
                  stiffness: 380,
                  damping: 30
                }}
              />
            )}
          </Link>

          {/* The Kawai Experience Dropdown */}
          <div
            ref={dropdownRef}
            className="relative"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <button
              className="relative flex items-center gap-1 text-white/90 hover:text-white font-medium transition-colors duration-200 text-sm tracking-wide py-1"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              The Kawai Experience
              <ChevronDown
                className={cn(
                  "w-4 h-4 transition-transform duration-200",
                  isDropdownOpen && "rotate-180"
                )}
              />
              {(isActiveLink('/namm-2026/experience') || isActiveLink('/namm-2026/artists')) && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[#E31937] to-[#FF3B55] rounded-full"
                  style={{
                    boxShadow: '0 0 8px rgba(227, 25, 55, 0.6), 0 0 16px rgba(227, 25, 55, 0.3)'
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 380,
                    damping: 30
                  }}
                />
              )}
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 mt-2 w-48 bg-black/95 backdrop-blur-sm border border-white/10 rounded-lg shadow-xl overflow-hidden"
                >
                  <Link
                    href="/namm-2026/experience"
                    className={cn(
                      "block px-4 py-3 text-white/90 hover:text-white hover:bg-white/10 transition-colors text-sm relative",
                      isActiveLink('/namm-2026/experience') && "text-white bg-white/5"
                    )}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Booth
                    {isActiveLink('/namm-2026/experience') && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#E31937] to-[#FF3B55] rounded-r-full"
                        style={{
                          boxShadow: '0 0 8px rgba(227, 25, 55, 0.6)'
                        }}
                      />
                    )}
                  </Link>
                  <Link
                    href="/namm-2026/artists"
                    className={cn(
                      "block px-4 py-3 text-white/90 hover:text-white hover:bg-white/10 transition-colors text-sm border-t border-white/10 relative",
                      isActiveLink('/namm-2026/artists') && "text-white bg-white/5"
                    )}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Artists
                    {isActiveLink('/namm-2026/artists') && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#E31937] to-[#FF3B55] rounded-r-full"
                        style={{
                          boxShadow: '0 0 8px rgba(227, 25, 55, 0.6)'
                        }}
                      />
                    )}
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Direct Section Links */}
          <Link
            href="/namm-2026#featured-products"
            className="relative text-white/90 hover:text-white font-medium transition-colors duration-200 text-sm tracking-wide py-1"
          >
            Featured Products
            {isActiveLink('/namm-2026#featured-products') && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[#E31937] to-[#FF3B55] rounded-full"
                style={{
                  boxShadow: '0 0 8px rgba(227, 25, 55, 0.6), 0 0 16px rgba(227, 25, 55, 0.3)'
                }}
                transition={{
                  type: "spring",
                  stiffness: 380,
                  damping: 30
                }}
              />
            )}
          </Link>
          <Link
            href="/namm-2026#plan-your-visit"
            className="relative text-white/90 hover:text-white font-medium transition-colors duration-200 text-sm tracking-wide py-1"
          >
            Plan Your Visit
            {isActiveLink('/namm-2026#plan-your-visit') && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[#E31937] to-[#FF3B55] rounded-full"
                style={{
                  boxShadow: '0 0 8px rgba(227, 25, 55, 0.6), 0 0 16px rgba(227, 25, 55, 0.3)'
                }}
                transition={{
                  type: "spring",
                  stiffness: 380,
                  damping: 30
                }}
              />
            )}
          </Link>
        </nav>

        {/* Right side - Mobile Menu */}
        <div className="flex items-center gap-4 pr-4 sm:pr-6">
          {/* Mobile Menu Button */}
          <motion.button
            ref={menuButtonRef}
            className="md:hidden p-2 rounded-md transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.1 }}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-6 w-6 text-white" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="h-6 w-6 text-white" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[190] bg-black/60 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
            />
            <motion.div
              ref={mobileMenuRef}
              className="fixed right-0 top-0 bottom-0 z-[200] w-[min(80vw,20rem)] md:hidden bg-black border-l border-white/10 shadow-2xl flex flex-col"
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="sticky top-0 bg-black border-b border-white/10 p-4 z-10 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold text-lg">Menu</span>
                  <button
                    onClick={closeMobileMenu}
                    className="p-2 rounded-md hover:bg-white/10 transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="h-6 w-6 text-white" />
                  </button>
                </div>
              </div>

              <nav className="flex-1 p-6 overflow-y-auto">
                <div className="space-y-2">
                  {/* Home Link */}
                  <Link
                    href="/namm-2026"
                    className={cn(
                      "block py-3 px-4 text-white/90 hover:text-white hover:bg-white/10 font-medium transition-colors rounded-lg relative",
                      isActiveLink('/namm-2026') && "text-white bg-white/5"
                    )}
                    onClick={closeMobileMenu}
                  >
                    Home
                    {isActiveLink('/namm-2026') && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#E31937] to-[#FF3B55] rounded-r-full"
                        style={{
                          boxShadow: '0 0 8px rgba(227, 25, 55, 0.6)'
                        }}
                      />
                    )}
                  </Link>

                  {/* The Kawai Experience - Mobile Expandable */}
                  <div>
                    <button
                      onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
                      className={cn(
                        "w-full flex items-center justify-between py-3 px-4 text-white/90 hover:text-white hover:bg-white/10 font-medium transition-colors rounded-lg relative",
                        (isActiveLink('/namm-2026/experience') || isActiveLink('/namm-2026/artists')) && "text-white bg-white/5"
                      )}
                    >
                      <span>The Kawai Experience</span>
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 transition-transform duration-200",
                          isMobileDropdownOpen && "rotate-180"
                        )}
                      />
                      {(isActiveLink('/namm-2026/experience') || isActiveLink('/namm-2026/artists')) && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#E31937] to-[#FF3B55] rounded-r-full"
                          style={{
                            boxShadow: '0 0 8px rgba(227, 25, 55, 0.6)'
                          }}
                        />
                      )}
                    </button>

                    {/* Mobile Dropdown Items */}
                    <AnimatePresence>
                      {isMobileDropdownOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="pl-4 space-y-1 mt-1">
                            <Link
                              href="/namm-2026/experience"
                              className={cn(
                                "block py-2 px-4 text-white/80 hover:text-white hover:bg-white/5 transition-colors rounded-lg text-sm relative",
                                isActiveLink('/namm-2026/experience') && "text-white bg-white/5"
                              )}
                              onClick={closeMobileMenu}
                            >
                              Booth
                              {isActiveLink('/namm-2026/experience') && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#E31937] to-[#FF3B55] rounded-r-full"
                                  style={{
                                    boxShadow: '0 0 8px rgba(227, 25, 55, 0.6)'
                                  }}
                                />
                              )}
                            </Link>
                            <Link
                              href="/namm-2026/artists"
                              className={cn(
                                "block py-2 px-4 text-white/80 hover:text-white hover:bg-white/5 transition-colors rounded-lg text-sm relative",
                                isActiveLink('/namm-2026/artists') && "text-white bg-white/5"
                              )}
                              onClick={closeMobileMenu}
                            >
                              Artists
                              {isActiveLink('/namm-2026/artists') && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#E31937] to-[#FF3B55] rounded-r-full"
                                  style={{
                                    boxShadow: '0 0 8px rgba(227, 25, 55, 0.6)'
                                  }}
                                />
                              )}
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Direct Links */}
                  <Link
                    href="/namm-2026#featured-products"
                    className={cn(
                      "block py-3 px-4 text-white/90 hover:text-white hover:bg-white/10 font-medium transition-colors rounded-lg relative",
                      isActiveLink('/namm-2026#featured-products') && "text-white bg-white/5"
                    )}
                    onClick={closeMobileMenu}
                  >
                    Featured Products
                    {isActiveLink('/namm-2026#featured-products') && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#E31937] to-[#FF3B55] rounded-r-full"
                        style={{
                          boxShadow: '0 0 8px rgba(227, 25, 55, 0.6)'
                        }}
                      />
                    )}
                  </Link>
                  <Link
                    href="/namm-2026#plan-your-visit"
                    className={cn(
                      "block py-3 px-4 text-white/90 hover:text-white hover:bg-white/10 font-medium transition-colors rounded-lg relative",
                      isActiveLink('/namm-2026#plan-your-visit') && "text-white bg-white/5"
                    )}
                    onClick={closeMobileMenu}
                  >
                    Plan Your Visit
                    {isActiveLink('/namm-2026#plan-your-visit') && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#E31937] to-[#FF3B55] rounded-r-full"
                        style={{
                          boxShadow: '0 0 8px rgba(227, 25, 55, 0.6)'
                        }}
                      />
                    )}
                  </Link>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
