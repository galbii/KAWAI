'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
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
    dropdown: [
      {
        label: 'By Type',
        items: [
          { label: 'Acoustic Pianos', href: '/pianos/acoustic', description: 'Traditional craftsmanship' },
          { label: 'Grand Pianos', href: '/pianos/grand', description: 'Concert-quality instruments' },
          { label: 'Upright Pianos', href: '/pianos/upright', description: 'Home & studio pianos' },
          { label: 'Digital Pianos', href: '/pianos/digital', description: 'Modern technology' },
          { label: 'Hybrid Pianos', href: '/pianos/hybrid', description: 'Acoustic meets digital' },
        ]
      },
      {
        label: 'By Series',
        items: [
          { label: 'Shigeru Kawai', href: '/pianos/series/shigeru-kawai', description: 'Handcrafted masterpieces' },
          { label: 'GX Series', href: '/pianos/series/gx', description: 'Professional grands' },
          { label: 'CA Series', href: '/pianos/series/ca', description: 'Premium digital' },
          { label: 'K Series', href: '/pianos/series/k', description: 'Traditional uprights' },
          { label: 'CN Series', href: '/pianos/series/cn', description: 'Compact digital' },
        ]
      },
      {
        label: 'Special Offerings',
        items: [
          { label: 'Pre-Owned Pianos', href: '/pianos/pre-owned', description: 'Quality certified instruments' },
          { label: 'Piano Finder', href: '/piano-finder', description: 'Find your perfect piano' },
          { label: 'Compare Models', href: '/pianos/compare', description: 'Side-by-side comparison' },
        ]
      }
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
      className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/95 border-b border-gray-200/50 shadow-sm"
      variants={headerVariants}
      initial="initial"
      animate="animate"
    >
      {/* Main Header */}
      <div className="container mx-auto px-6">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <KawaiLogo size="md" animated={true} />

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              {navigation.map((item) => (
                <NavigationMenuItem key={item.label}>
                  {item.href ? (
                    <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                      <Link href={item.href} className="font-medium">
                        {item.label}
                      </Link>
                    </NavigationMenuLink>
                  ) : (
                    <>
                      <NavigationMenuTrigger className="font-medium text-gray-700 hover:text-gray-900 transition-colors bg-transparent hover:bg-gray-50/50 px-4 py-2 rounded-md">
                        {item.label}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="backdrop-blur-md bg-white/95 border border-gray-200/50 shadow-xl rounded-xl p-0 overflow-hidden">
                        {item.label === 'Pianos' ? (
                          <div className="grid gap-6 p-8 md:w-[600px] lg:w-[800px] lg:grid-cols-3">
                            {item.dropdown?.map((section) => (
                              <div key={section.label} className="space-y-4">
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-200/60 pb-2">
                                  {section.label}
                                </h3>
                                <ul className="space-y-2">
                                  {section.items?.map((subItem) => (
                                    <ListItem
                                      key={subItem.href}
                                      title={subItem.label}
                                      href={subItem.href}
                                    >
                                      {subItem.description}
                                    </ListItem>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        ) : (
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
                        )}
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
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 px-6" asChild>
                <Link href="/contact/schedule-visit">Schedule Visit</Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button className="bg-kawai-red hover:bg-kawai-red/90 text-white px-6 shadow-md hover:shadow-lg transition-all" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
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
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-6 w-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
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
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div 
              className="fixed top-0 right-0 bottom-0 z-50 w-80 max-w-[80vw] lg:hidden backdrop-blur-md bg-white/95 border-l border-gray-200/50 shadow-2xl overflow-y-auto"
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 rounded-md hover:bg-gray-100/80 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <motion.nav 
                  className="flex flex-col gap-6"
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
                  {item.href ? (
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
                        {item.label}
                      </div>
                      {item.dropdown && (
                        <div className="pl-4 space-y-4">
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
                                        className="block py-2 px-3 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-all"
                                        onClick={() => setIsMenuOpen(false)}
                                      >
                                        <div className="font-medium">{subItem.label}</div>
                                        {subItem.description && (
                                          <div className="text-xs text-gray-500 mt-1">{subItem.description}</div>
                                        )}
                                      </Link>
                                    ))}
                                  </div>
                                </>
                              ) : (
                                <Link
                                  href={dropdownItem.href || '#'}
                                  className="block py-2 px-3 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-all"
                                  onClick={() => setIsMenuOpen(false)}
                                >
                                  <div className="font-medium">{dropdownItem.label}</div>
                                  {dropdownItem.description && (
                                    <div className="text-xs text-gray-500 mt-1">{dropdownItem.description}</div>
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
                <motion.div 
                  className="border-t border-gray-200 pt-6 flex flex-col gap-3"
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
                </motion.nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  )
}