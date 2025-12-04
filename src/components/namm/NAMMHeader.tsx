'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useState, useEffect, useRef } from 'react'
import { Menu, X } from 'lucide-react'

/**
 * NAMM 2026 Custom Header
 *
 * Black-themed minimal header for the NAMM landing page.
 * Features:
 * - Solid black background
 * - No logo (clean minimal design)
 * - Mobile menu with artist and booth links
 */
export function NAMMHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

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
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
    return undefined
  }, [isMenuOpen])

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
        <motion.div
          initial={{ x: -200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            duration: 1,
            delay: 0.3,
            ease: [0.25, 0.1, 0.25, 1.0]
          }}
          className="relative h-16 w-auto flex-shrink-0"
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

        {/* Center Navigation - Desktop */}
        <nav className="hidden md:flex items-center space-x-8 mx-auto">
          <Link
            href="#featured-products"
            className="text-white/90 hover:text-white font-medium transition-colors duration-200 text-sm tracking-wide"
          >
            Featured Products
          </Link>
          <Link
            href="#booth-experience"
            className="text-white/90 hover:text-white font-medium transition-colors duration-200 text-sm tracking-wide"
          >
            Booth Experience
          </Link>
          <Link
            href="#artists"
            className="text-white/90 hover:text-white font-medium transition-colors duration-200 text-sm tracking-wide"
          >
            Artists
          </Link>
          <Link
            href="#plan-your-visit"
            className="text-white/90 hover:text-white font-medium transition-colors duration-200 text-sm tracking-wide"
          >
            Plan Your Visit
          </Link>
          <Link
            href="/"
            className="text-white/90 hover:text-white font-medium transition-colors duration-200 text-sm tracking-wide"
          >
            Main Site
          </Link>
        </nav>

        {/* Right side - CTA Button (Desktop) + Mobile Menu */}
        <div className="flex items-center gap-4 pr-4 sm:pr-6">
          <motion.div
            className="hidden md:block"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="#plan-your-visit"
              className={cn(
                "inline-flex items-center px-6 py-2.5 rounded-full font-semibold text-sm",
                "bg-gradient-to-r from-[#E31937] to-[#FF3B55]",
                "text-white shadow-lg shadow-red-500/30",
                "hover:shadow-xl hover:shadow-red-500/40",
                "transition-all duration-300"
              )}
            >
              Get Directions
            </Link>
          </motion.div>

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
                  <Link
                    href="#featured-products"
                    className="block py-3 px-4 text-white/90 hover:text-white hover:bg-white/10 font-medium transition-colors rounded-lg"
                    onClick={closeMobileMenu}
                  >
                    Featured Products
                  </Link>
                  <Link
                    href="#booth-experience"
                    className="block py-3 px-4 text-white/90 hover:text-white hover:bg-white/10 font-medium transition-colors rounded-lg"
                    onClick={closeMobileMenu}
                  >
                    Booth Experience
                  </Link>
                  <Link
                    href="#artists"
                    className="block py-3 px-4 text-white/90 hover:text-white hover:bg-white/10 font-medium transition-colors rounded-lg"
                    onClick={closeMobileMenu}
                  >
                    Artists
                  </Link>
                  <Link
                    href="#plan-your-visit"
                    className="block py-3 px-4 text-white/90 hover:text-white hover:bg-white/10 font-medium transition-colors rounded-lg"
                    onClick={closeMobileMenu}
                  >
                    Plan Your Visit
                  </Link>
                  <Link
                    href="/"
                    className="block py-3 px-4 text-white/90 hover:text-white hover:bg-white/10 font-medium transition-colors rounded-lg"
                    onClick={closeMobileMenu}
                  >
                    Main Site
                  </Link>
                </div>
              </nav>

              <div className="mt-auto bg-black border-t border-white/10 p-6 flex-shrink-0">
                <Link
                  href="#plan-your-visit"
                  className={cn(
                    "block text-center px-6 py-3 rounded-full font-semibold text-sm",
                    "bg-gradient-to-r from-[#E31937] to-[#FF3B55]",
                    "text-white shadow-lg shadow-red-500/30",
                    "hover:shadow-xl hover:shadow-red-500/40",
                    "transition-all duration-300"
                  )}
                  onClick={closeMobileMenu}
                >
                  Get Directions
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
