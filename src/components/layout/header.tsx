'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useMotionValue } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { KawaiLogo } from '@/components/ui/kawai-logo'
import { cn } from '@/lib/utils'

interface NavigationItem {
  label: string
  href?: string
  dropdown?: {
    label: string
    href?: string
    description?: string
    items?: {
      label: string
      href: string
      description?: string
    }[]
  }[]
}

const ListItem = ({ className, title, children, ...props }: {
  className?: string
  title: string
  children: React.ReactNode
  href: string
}) => {
  return (
    <motion.li
      whileHover={{ x: 2 }}
      transition={{ duration: 0.2 }}
    >
      <NavigationMenuLink asChild>
        <Link
          className={cn(
            'block select-none space-y-1 rounded-lg p-4 leading-none no-underline outline-none transition-colors hover:bg-gray-50/80 hover:text-accent-foreground focus:bg-gray-50/80 focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className="text-sm font-semibold leading-none text-gray-900 mb-1">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-gray-600">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </motion.li>
  )
}

const navigation: NavigationItem[] = [
  {
    label: 'Pianos',
    href: '/pianos',
    dropdown: [
      { label: 'Grand Pianos', href: '/pianos/grand', description: 'Concert-quality instruments' },
      { label: 'Digital Pianos', href: '/pianos/digital', description: 'Modern technology' },
      { label: 'Upright Pianos', href: '/pianos/upright', description: 'Home & studio pianos' },
      { label: 'Hybrid Pianos', href: '/pianos/hybrid', description: 'Acoustic meets digital' },
      { label: 'View Our Gallery', href: '/gallery', description: 'Explore our piano collection' },
    ]
  },
  {
    label: 'Innovation',
    dropdown: [
      { label: 'Millennium III Action', href: '/innovation/millennium-action', description: 'Revolutionary key action' },
      { label: 'Harmonic Imaging', href: '/innovation/harmonic-imaging', description: 'Sound sampling technology' },
      { label: 'Grand Feel Action', href: '/innovation/grand-feel-action', description: 'Digital piano action' },
      { label: 'Bluetooth Audio', href: '/innovation/bluetooth-audio', description: 'Wireless connectivity' },
      { label: 'All Technologies', href: '/innovation', description: 'Complete innovation story' },
    ]
  },
  {
    label: 'Heritage',
    dropdown: [
      { label: 'Kawai Story', href: '/heritage/kawai-story', description: '95+ years of craftsmanship' },
      { label: 'Kawai Family Legacy', href: '/heritage/family-legacy', description: 'Three generations' },
      { label: 'Awards & Recognition', href: '/heritage/awards', description: 'Industry honors' },
      { label: 'Manufacturing Excellence', href: '/heritage/manufacturing', description: 'Japanese craftsmanship' },
      { label: 'Artist Gallery', href: '/heritage/artists', description: 'Professional musicians' },
    ]
  },
  {
    label: 'Resources',
    dropdown: [
      { label: 'Piano Buying Guide', href: '/resources/buying-guide', description: 'Expert advice for buyers' },
      { label: 'Piano Care & Maintenance', href: '/resources/piano-care', description: 'Keep your piano perfect' },
      { label: 'Learning Center', href: '/resources/learning-center', description: 'Educational content' },
      { label: 'Financing Options', href: '/resources/financing', description: 'Make it affordable' },
      { label: 'Downloads & Brochures', href: '/resources/downloads', description: 'Specifications & catalogs' },
    ]
  },
  {
    label: 'Experience',
    dropdown: [
      { label: 'Showroom Locations', href: '/experience/showrooms', description: 'Visit us in person' },
      { label: 'Virtual Piano Tours', href: '/experience/virtual-tours', description: 'Explore online' },
      { label: 'Piano Services', href: '/experience/services', description: 'Complete piano care' },
      { label: 'Events & Workshops', href: '/experience/events', description: 'Music community' },
      { label: 'Schedule a Visit', href: '/experience/schedule-visit', description: 'Book your appointment' },
    ]
  },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  
  // Detect reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Scroll lock for mobile menu
  useEffect(() => {
    if (isMenuOpen) {
      // Prevent body scroll when menu is open
      const originalStyle = window.getComputedStyle(document.body).overflow
      document.body.style.overflow = 'hidden'
      
      return () => {
        document.body.style.overflow = originalStyle
      }
    }
  }, [isMenuOpen])

  // Focus management for mobile menu
  useEffect(() => {
    if (isMenuOpen && mobileMenuRef.current) {
      // Focus the first focusable element in the menu
      const firstFocusable = mobileMenuRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement
      firstFocusable?.focus()
    } else if (!isMenuOpen && menuButtonRef.current) {
      // Return focus to menu button when menu closes
      menuButtonRef.current.focus()
    }
  }, [isMenuOpen])

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isMenuOpen])
  
  // Scroll detection with throttling
  const { scrollY } = useScroll()
  
  // Track scroll state for header transformations
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50)
  })
  
  // Motion values for smooth animations
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  // Handle mouse movement for magnetic effects
  const handleMouseMove = (event: React.MouseEvent) => {
    if (!prefersReducedMotion) {
      mouseX.set(event.clientX)
      mouseY.set(event.clientY)
    }
  }

  // Animation variants for premium interactions
  const headerVariants = {
    initial: { y: -100 },
    animate: { 
      y: 0,
      transition: { 
        duration: 0.6, 
      }
    }
  }

  const mobileMenuVariants = {
    closed: { 
      opacity: 0, 
      x: '100%',
      transition: { 
        duration: 0.3,
      }
    },
    open: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.4,
      }
    }
  }

  const staggerChildren = {
    open: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  }

  const fadeInUp = {
    closed: { opacity: 0, y: 20 },
    open: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  }

  return (
    <motion.header 
      className={`sticky top-0 z-50 w-full border-b border-gray-200/50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-lg' 
          : 'bg-white shadow-sm'
      }`}
      variants={headerVariants}
      initial="initial"
      animate="animate"
      style={{
        willChange: 'transform, height',
      }}
    >
      {/* Main Header */}
      <div className="container mx-auto px-6">
        <div className={`flex items-center justify-between transition-all duration-300 ${
          isScrolled ? 'h-16' : 'h-20'
        }`}>
          {/* Logo */}
          <motion.div
            animate={{
              scale: prefersReducedMotion ? 1 : (isScrolled ? 0.9 : 1),
            }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.3,
              ease: "easeInOut"
            }}
            style={{
              willChange: 'transform',
            }}
          >
            <KawaiLogo size="md" animated={true} />
          </motion.div>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              {navigation.map((item) => (
                <NavigationMenuItem key={item.label}>
                  {item.href && !item.dropdown ? (
                    <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                      <Link href={item.href} className="font-medium">
                        {item.label}
                      </Link>
                    </NavigationMenuLink>
                  ) : (
                    <>
                      <NavigationMenuTrigger className="font-medium text-gray-700 hover:text-gray-900 transition-all duration-200 bg-transparent hover:bg-gray-50/50 px-4 py-2 rounded-md">
                        {item.href ? (
                          <Link href={item.href} className="block w-full h-full">
                            {item.label}
                          </Link>
                        ) : (
                          item.label
                        )}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="bg-white border border-gray-200/50 shadow-xl rounded-xl p-0 overflow-hidden">
                        <ul className="grid gap-2 p-6 md:w-[500px] md:grid-cols-1">
                          {item.dropdown?.map((dropdownItem) => (
                            <ListItem
                              key={dropdownItem.href}
                              title={dropdownItem.label}
                              href={dropdownItem.href || '#'}
                            >
                              {dropdownItem.description}
                            </ListItem>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* CTA Buttons */}
          <motion.div 
            className="hidden lg:flex items-center gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            onMouseMove={handleMouseMove}
          >
            <motion.div 
              whileHover={prefersReducedMotion ? {} : { scale: 1.02, y: -2 }} 
              whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 px-6 transition-all duration-200" asChild>
                <Link href="/contact/schedule-visit">Schedule Visit</Link>
              </Button>
            </motion.div>
            <motion.div 
              whileHover={prefersReducedMotion ? {} : { scale: 1.05, y: -3 }} 
              whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="relative group"
              style={{
                willChange: 'transform',
              }}
            >
              <Button className="bg-kawai-red hover:bg-kawai-red/90 text-white px-6 shadow-md hover:shadow-xl transition-all duration-300 relative z-10" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
              {/* Magnetic glow effect */}
              <div className="absolute inset-0 bg-kawai-red rounded-md opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-sm scale-110"></div>
            </motion.div>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            ref={menuButtonRef}
            className="lg:hidden p-2 rounded-md transition-colors hover:bg-gray-100/80 focus:outline-none focus:ring-2 focus:ring-kawai-red focus:ring-offset-2"
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
                  initial={{ rotate: -180, opacity: 0, scale: 0.8 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 180, opacity: 0, scale: 0.8 }}
                  transition={{ 
                    duration: 0.3, 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 20 
                  }}
                >
                  <X className="h-6 w-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 180, opacity: 0, scale: 0.8 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: -180, opacity: 0, scale: 0.8 }}
                  transition={{ 
                    duration: 0.3, 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 20 
                  }}
                >
                  <Menu className="h-6 w-6" />
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
              className="fixed inset-0 z-[190] bg-black/20 lg:hidden"
              style={{
                top: 'env(safe-area-inset-top)',
                bottom: 'env(safe-area-inset-bottom)',
                left: 'env(safe-area-inset-left)',
                right: 'env(safe-area-inset-right)'
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div 
              ref={mobileMenuRef}
              className="fixed right-0 z-[200] w-[min(85vw,24rem)] lg:hidden bg-white border-l border-gray-200/50 shadow-2xl overflow-hidden flex flex-col max-h-screen"
              style={{
                top: 'env(safe-area-inset-top)',
                bottom: 'env(safe-area-inset-bottom)',
                right: 'env(safe-area-inset-right)'
              }}
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="flex-shrink-0 p-6 border-b border-gray-200/50">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 rounded-md hover:bg-gray-100/80 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto overscroll-contain">
                <motion.nav 
                  className="flex flex-col gap-6 p-6"
                  variants={staggerChildren}
                  initial="closed"
                  animate="open"
                >
              {navigation.map((item, index) => (
                <motion.div 
                  key={item.label} 
                  className="space-y-3"
                  variants={fadeInUp}
                  transition={{ delay: index * 0.05 }}
                >
                  {item.href && !item.dropdown ? (
                    <Link
                      href={item.href}
                      className="block py-2 text-gray-800 hover:text-gray-900 font-medium text-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <>
                      <div className="py-2 font-semibold text-gray-900 text-lg border-b border-gray-200">
                        {item.href ? (
                          <Link
                            href={item.href}
                            className="text-gray-800 hover:text-gray-900 transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {item.label}
                          </Link>
                        ) : (
                          <span>{item.label}</span>
                        )}
                      </div>
                      {item.dropdown && (
                        <div className="pl-2 space-y-4">
                          {item.dropdown.map((dropdownItem) => (
                            <div key={dropdownItem.label} className="space-y-2">
                              {dropdownItem.items ? (
                                <>
                                  <div className="font-semibold text-sm text-gray-700 py-1 uppercase tracking-wide">
                                    {dropdownItem.label}
                                  </div>
                                  <div className="space-y-1">
                                    {dropdownItem.items.map((subItem) => (
                                      <Link
                                        key={subItem.href}
                                        href={subItem.href}
                                        className="block py-2 px-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-all break-words"
                                        onClick={() => setIsMenuOpen(false)}
                                      >
                                        <div className="font-medium leading-tight">{subItem.label}</div>
                                        {subItem.description && (
                                          <div className="text-xs text-gray-500 mt-1 leading-tight">{subItem.description}</div>
                                        )}
                                      </Link>
                                    ))}
                                  </div>
                                </>
                              ) : (
                                <Link
                                  href={dropdownItem.href || '#'}
                                  className="block py-2 px-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-all break-words"
                                  onClick={() => setIsMenuOpen(false)}
                                >
                                  <div className="font-medium leading-tight">{dropdownItem.label}</div>
                                  {dropdownItem.description && (
                                    <div className="text-xs text-gray-500 mt-1 leading-tight">{dropdownItem.description}</div>
                                  )}
                                </Link>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </motion.div>
              ))}
                </motion.nav>
              </div>
              <div className="flex-shrink-0 border-t border-gray-200 p-6">
                <motion.div 
                  className="flex flex-col gap-3"
                  variants={fadeInUp}
                  transition={{ delay: navigation.length * 0.05 + 0.1 }}
                >
                  <Button variant="outline" className="w-full py-3 border-gray-300 text-gray-700 hover:bg-gray-50" asChild>
                    <Link href="/contact/schedule-visit">Schedule Visit</Link>
                  </Button>
                  <Button className="w-full py-3 bg-kawai-red hover:bg-kawai-red/90 text-white shadow-md" asChild>
                    <Link href="/contact">Contact Us</Link>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  )
}