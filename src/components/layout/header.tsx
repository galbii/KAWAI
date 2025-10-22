'use client'

import Link from 'next/link'
import { useState, useEffect, useRef, useCallback } from 'react'
import { Menu, X, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { KawaiLogo } from '@/components/ui/kawai-logo'
import { cn } from '@/lib/utils'
import { useNavigationContext } from '@/contexts/NavigationContext'
import { getContextAwareUrl } from '@/lib/navigation-utils'

interface NavigationItem {
  label: string
  href?: string
  dropdown?: {
    label: string
    href: string
    description?: string
    isProductline?: boolean
    isProduct?: boolean
  }[]
}

interface MobileMenuItemProps {
  item: NavigationItem
  onClose: () => void
  isOpen: boolean
  onToggle: () => void
}

interface DesktopMenuItemProps {
  item: NavigationItem
  isOpen: boolean
  onOpen: (itemLabel: string) => void
  onClose: () => void
}

// Context-aware Link component for client-side navigation
const ContextAwareLink = ({ href, children, className, onClick }: { 
  href: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
}) => {
  const { origin, isInitialized } = useNavigationContext()
  
  // Check if href already has origin parameter to avoid double-encoding
  const hasOriginParam = href.includes('?origin=') || href.includes('&origin=')
  
  // If href is already context-aware (from server-side rendering), use as-is
  // Otherwise, make it context-aware on client-side
  const finalHref = (isInitialized && !hasOriginParam) 
    ? getContextAwareUrl(href, origin) 
    : href
  
  // Debug logging for development
  if (process.env.NODE_ENV === 'development' && origin.isDealerLocation) {
    console.log('[ContextAwareLink]', {
      originalHref: href,
      finalHref,
      hasOriginParam,
      isInitialized,
      origin
    })
  }
  
  return (
    <Link
      href={finalHref}
      className={className}
      {...(onClick && { onClick })}
    >
      {children}
    </Link>
  )
}

// Mobile Menu Item Component
const MobileMenuItem = ({ item, onClose, isOpen, onToggle }: MobileMenuItemProps) => {
  if (!item.dropdown) {
    return (
      <ContextAwareLink
        href={item.href || '#'}
        className="block py-4 px-6 text-gray-800 hover:text-gray-900 hover:bg-gray-50 font-medium text-xl transition-colors rounded-lg"
        onClick={onClose}
      >
        {item.label}
      </ContextAwareLink>
    )
  }

  return (
    <div className="space-y-3">
      {item.href ? (
        <div className="flex items-center">
          <ContextAwareLink
            href={item.href}
            className="flex-1 py-4 px-6 text-gray-800 hover:text-gray-900 hover:bg-gray-50 font-medium text-xl transition-colors rounded-lg"
            onClick={onClose}
          >
            {item.label}
          </ContextAwareLink>
          <button
            onClick={onToggle}
            className="p-4 text-gray-800 hover:text-gray-900 hover:bg-gray-50 transition-colors rounded-lg"
            aria-expanded={isOpen}
          >
            <ChevronDown className={cn("h-5 w-5 transition-transform duration-200", isOpen && "rotate-180")} />
          </button>
        </div>
      ) : (
        <button
          onClick={onToggle}
          className="flex items-center justify-between w-full py-4 px-6 text-gray-800 hover:text-gray-900 hover:bg-gray-50 font-medium text-xl transition-colors rounded-lg"
          aria-expanded={isOpen}
        >
          <span>{item.label}</span>
          <ChevronDown className={cn("h-5 w-5 transition-transform duration-200", isOpen && "rotate-180")} />
        </button>
      )}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pl-6 space-y-4">
              {(() => {
                // Group items by productline for mobile too
                const productlineGroups: { [key: string]: typeof item.dropdown } = {}
                const currentProductline: string[] = []
                
                item.dropdown.forEach((subItem) => {
                  if (subItem.isProductline) {
                    currentProductline[0] = subItem.label
                    if (!productlineGroups[subItem.label]) {
                      productlineGroups[subItem.label] = []
                    }
                    productlineGroups[subItem.label]?.push(subItem)
                  } else if (subItem.isProduct && currentProductline[0]) {
                    if (!productlineGroups[currentProductline[0]]) {
                      productlineGroups[currentProductline[0]] = []
                    }
                    productlineGroups[currentProductline[0]]?.push(subItem)
                  }
                })
                
                return Object.entries(productlineGroups).map(([productlineName, items]) => (
                  <div key={productlineName} className="space-y-2">
                    {items.map((subItem) => (
                      <ContextAwareLink
                        key={subItem.href}
                        href={subItem.href}
                        className={cn(
                          "block py-2 px-4 text-base hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors",
                          subItem.isProductline ? "text-gray-900 font-semibold border-b border-gray-200 mb-2 pb-2" :
                          subItem.isProduct ? "text-gray-600 text-sm ml-4" : "text-gray-600"
                        )}
                        onClick={onClose}
                      >
                        <div className={cn(
                          "leading-tight",
                          subItem.isProductline ? "font-semibold text-base" : 
                          subItem.isProduct ? "font-normal" : "font-medium"
                        )}>
                          {subItem.isProduct ? `• ${subItem.label}` : subItem.label}
                        </div>
                      </ContextAwareLink>
                    ))}
                  </div>
                ))
              })()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Desktop Menu Item Component
const DesktopMenuItem = ({ item, isOpen, onOpen, onClose }: DesktopMenuItemProps) => {
  const [dropdownPosition, setDropdownPosition] = useState({ 
    left: 0 as number | 'auto', 
    right: 'auto' as 'auto' | number, 
    top: '100%' as '100%' | 'auto', 
    bottom: 'auto' as 'auto' | '100%',
    maxHeight: 'none' as 'none' | string
  })
  const [columnConfig, setColumnConfig] = useState({ columns: 4, maxItemsPerColumn: 20 })
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = useCallback(() => {
    onOpen(item.label)
    
    // Calculate dropdown position to keep it on screen
    if (buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      const dropdownWidth = 1400 // max width from CSS
      const maxDropdownHeight = 600 // Maximum dropdown height before scrolling
      
      let positioning: {
        left: number | 'auto',
        right: 'auto' | number,
        top: '100%' | 'auto',
        bottom: 'auto' | '100%',
        maxHeight: 'none' | string
      } = { 
        left: 0, 
        right: 'auto' as const, 
        top: '100%' as const, 
        bottom: 'auto' as const,
        maxHeight: 'none' as const
      }
      
      // Horizontal positioning
      const spaceOnRight = viewportWidth - buttonRect.left
      const spaceOnLeft = buttonRect.right
      
      if (spaceOnRight < dropdownWidth && spaceOnLeft > dropdownWidth) {
        positioning.left = 'auto'
        positioning.right = 0
      } else if (spaceOnRight < dropdownWidth) {
        const leftOffset = Math.max(0, dropdownWidth - spaceOnRight)
        positioning.left = -leftOffset
        positioning.right = 'auto'
      } else {
        positioning.left = 0
        positioning.right = 'auto'
      }
      
      // Vertical positioning and height constraints
      const availableSpaceBelow = viewportHeight - buttonRect.bottom
      const availableSpaceAbove = buttonRect.top
      
      if (availableSpaceBelow < maxDropdownHeight && availableSpaceAbove > availableSpaceBelow) {
        // Position above if there's more space above
        positioning.top = 'auto'
        positioning.bottom = '100%'
        positioning.maxHeight = `${Math.min(availableSpaceAbove - 20, maxDropdownHeight)}px`
      } else if (availableSpaceBelow < maxDropdownHeight) {
        // Constrain height if not enough space below
        positioning.top = '100%'
        positioning.bottom = 'auto'
        positioning.maxHeight = `${availableSpaceBelow - 20}px`
      } else {
        // Default positioning with full height
        positioning.top = '100%'
        positioning.bottom = 'auto'
        positioning.maxHeight = 'none'
      }
      
      // Adjust column configuration based on available vertical space
      const effectiveMaxHeight = positioning.maxHeight === 'none' 
        ? maxDropdownHeight 
        : parseInt(positioning.maxHeight)
      
      const estimatedItemHeight = 40 // Approximate height per item including padding
      const maxItemsPerColumn = Math.floor(effectiveMaxHeight / estimatedItemHeight)
      
      // Calculate optimal columns based on total items and max per column
      const totalItems = item.dropdown?.length || 0
      const optimalColumns = Math.min(4, Math.ceil(totalItems / Math.max(maxItemsPerColumn, 1)))
      
      setColumnConfig({ 
        columns: Math.max(1, optimalColumns), 
        maxItemsPerColumn: Math.max(5, maxItemsPerColumn) 
      })
      setDropdownPosition(positioning)
    }
  }, [item.dropdown, item.label, onOpen])

  const handleMouseLeave = useCallback(() => {
    onClose()
  }, [onClose])

  useEffect(() => {
    const handleResize = () => {
      if (isOpen && buttonRef.current) {
        // Recalculate position on window resize
        const buttonRect = buttonRef.current.getBoundingClientRect()
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight
        const dropdownWidth = 1400
        const maxDropdownHeight = 600
        
        let positioning: {
          left: number | 'auto',
          right: 'auto' | number,
          top: '100%' | 'auto',
          bottom: 'auto' | '100%',
          maxHeight: 'none' | string
        } = { 
          left: 0, 
          right: 'auto' as const, 
          top: '100%' as const, 
          bottom: 'auto' as const,
          maxHeight: 'none' as const
        }
        
        // Horizontal positioning
        const spaceOnRight = viewportWidth - buttonRect.left
        const spaceOnLeft = buttonRect.right
        
        if (spaceOnRight < dropdownWidth && spaceOnLeft > dropdownWidth) {
          positioning.left = 'auto'
          positioning.right = 0
        } else if (spaceOnRight < dropdownWidth) {
          const leftOffset = Math.max(0, dropdownWidth - spaceOnRight)
          positioning.left = -leftOffset
          positioning.right = 'auto'
        } else {
          positioning.left = 0
          positioning.right = 'auto'
        }
        
        // Vertical positioning and height constraints
        const availableSpaceBelow = viewportHeight - buttonRect.bottom
        const availableSpaceAbove = buttonRect.top
        
        if (availableSpaceBelow < maxDropdownHeight && availableSpaceAbove > availableSpaceBelow) {
          positioning.top = 'auto'
          positioning.bottom = '100%'
          positioning.maxHeight = `${Math.min(availableSpaceAbove - 20, maxDropdownHeight)}px`
        } else if (availableSpaceBelow < maxDropdownHeight) {
          positioning.top = '100%'
          positioning.bottom = 'auto'
          positioning.maxHeight = `${availableSpaceBelow - 20}px`
        } else {
          positioning.top = '100%'
          positioning.bottom = 'auto'
          positioning.maxHeight = 'none'
        }
        
        // Update column configuration
        const effectiveMaxHeight = positioning.maxHeight === 'none' 
          ? maxDropdownHeight 
          : parseInt(positioning.maxHeight)
        
        const estimatedItemHeight = 40
        const maxItemsPerColumn = Math.floor(effectiveMaxHeight / estimatedItemHeight)
        const totalItems = item.dropdown?.length || 0
        const optimalColumns = Math.min(4, Math.ceil(totalItems / Math.max(maxItemsPerColumn, 1)))
        
        setColumnConfig({ 
          columns: Math.max(1, optimalColumns), 
          maxItemsPerColumn: Math.max(5, maxItemsPerColumn) 
        })
        setDropdownPosition(positioning)
      }
    }

    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [isOpen, item.dropdown])

  if (!item.dropdown) {
    return (
      <ContextAwareLink
        href={item.href || '#'}
        className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50/50 font-medium transition-colors rounded-md"
      >
        {item.label}
      </ContextAwareLink>
    )
  }

  return (
    <div 
      ref={buttonRef}
      className="relative group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {item.href ? (
        <div className="flex items-center">
          <ContextAwareLink
            href={item.href}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50/50 font-medium transition-colors rounded-md"
          >
            {item.label}
          </ContextAwareLink>
          <button className="px-1 py-2 text-gray-700 hover:text-gray-900 transition-colors">
            <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", isOpen && "rotate-180")} />
          </button>
        </div>
      ) : (
        <button className="flex items-center px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50/50 font-medium transition-colors rounded-md">
          <span>{item.label}</span>
          <ChevronDown className={cn("ml-1 h-4 w-4 transition-transform duration-200", isOpen && "rotate-180")} />
        </button>
      )}
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-2 min-w-[900px] max-w-[1400px] bg-white border border-gray-200/50 shadow-xl rounded-xl overflow-hidden"
            style={{
              transformOrigin: dropdownPosition.top === '100%' ? 'top left' : 'bottom left',
              left: dropdownPosition.left,
              right: dropdownPosition.right,
              top: dropdownPosition.top,
              bottom: dropdownPosition.bottom,
              maxHeight: dropdownPosition.maxHeight
            }}
          >
            <div 
              className="p-6 overflow-y-auto"
              style={{
                maxHeight: dropdownPosition.maxHeight === 'none' ? '600px' : dropdownPosition.maxHeight
              }}
            >
              <div 
                className="grid gap-8" 
                style={{
                  alignItems: 'start',
                  gridTemplateColumns: `repeat(${columnConfig.columns}, 1fr)`
                }}
              >
                {(() => {
                  // Group items by productline
                  const productlineGroups: { [key: string]: typeof item.dropdown } = {}
                  const currentProductline: string[] = []
                  
                  item.dropdown.forEach((subItem) => {
                    if (subItem.isProductline) {
                      currentProductline[0] = subItem.label
                      if (!productlineGroups[subItem.label]) {
                        productlineGroups[subItem.label] = []
                      }
                      productlineGroups[subItem.label]?.push(subItem)
                    } else if (subItem.isProduct && currentProductline[0]) {
                      if (!productlineGroups[currentProductline[0]]) {
                        productlineGroups[currentProductline[0]] = []
                      }
                      productlineGroups[currentProductline[0]]?.push(subItem)
                    }
                  })
                  
                  return Object.entries(productlineGroups).map(([productlineName, items]) => (
                    <div key={productlineName} className="flex flex-col">
                      {items.map((subItem) => (
                        <ContextAwareLink
                          key={subItem.href}
                          href={subItem.href}
                          className={cn(
                            "block px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors group/item",
                            subItem.isProductline ? "border-b border-gray-200 mb-2 pb-2" : "",
                            subItem.isProduct ? "ml-2" : ""
                          )}
                        >
                          <div className={cn(
                            "text-sm group-hover/item:text-gray-900",
                            subItem.isProductline ? "font-bold text-gray-900 text-base mb-1" :
                            subItem.isProduct ? "font-normal text-gray-600 text-sm" : "font-semibold text-gray-900"
                          )}>
                            {subItem.isProduct ? `• ${subItem.label}` : subItem.label}
                          </div>
                        </ContextAwareLink>
                      ))}
                    </div>
                  ))
                })()}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface DealerLocationData {
  locationName: string
  slug: string
}

interface HeaderProps {
  navigation?: NavigationItem[]
  locationData?: DealerLocationData | null
  isSignaturePage?: boolean
}

// Default fallback navigation - URLs will be made context-aware at runtime
const defaultNavigation: NavigationItem[] = [
  {
    label: 'Pianos',
    href: '/pianos',
    dropdown: [
      { label: 'Grand Pianos', href: '/pianos/grand', description: 'Concert-quality instruments' },
      { label: 'Digital Pianos', href: '/pianos/digital', description: 'Modern technology' },
      { label: 'Upright Pianos', href: '/pianos/upright', description: 'Home & studio pianos' },
      { label: 'Hybrid Pianos', href: '/pianos/hybrid', description: 'Acoustic meets digital' },
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

export function Header({ navigation = defaultNavigation, locationData, isSignaturePage = false }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [openMobileItems, setOpenMobileItems] = useState<Set<string>>(new Set())
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [currentLocationData, setCurrentLocationData] = useState<DealerLocationData | null>(locationData || null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [animationComplete, setAnimationComplete] = useState(false)
  const animationStartedRef = useRef(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  // Use navigation context to detect location changes
  const { origin, isInitialized } = useNavigationContext()
  
  // Start fade-in animation once after mount
  useEffect(() => {
    if (!animationStartedRef.current) {
      animationStartedRef.current = true
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 100)

      return () => clearTimeout(timer)
    }
    return undefined
  }, [])
  
  // Fetch dealer location data when origin changes - but only after animation completes
  useEffect(() => {
    const fetchDealerData = async () => {
      if (!isInitialized || !animationComplete) return
      
      // If not a dealer location, clear location data
      if (!origin.isDealerLocation || !origin.dealerSlug) {
        setCurrentLocationData(null)
        return
      }
      
      // If we already have data for this slug, don't refetch
      if (currentLocationData && currentLocationData.slug === origin.dealerSlug) {
        return
      }
      
      setIsLoadingLocation(true)

      try {
        const response = await fetch(`/api/storefronts/by-slug/${origin.dealerSlug}`)
        const result = await response.json()

        if (result.success && result.data) {
          // Extract just the location name from the storefront data
          // The API returns the full storefront structure, but we only need name and slug
          const locationData = {
            locationName: result.data.showroomSection?.showroomInfo?.name || origin.dealerSlug,
            slug: origin.dealerSlug
          }
          setCurrentLocationData(locationData)
        } else {
          console.warn(`Failed to fetch storefront data for ${origin.dealerSlug}:`, result.error)
          setCurrentLocationData(null)
        }
      } catch (error) {
        console.error(`Error fetching storefront data for ${origin.dealerSlug}:`, error)
        setCurrentLocationData(null)
      } finally {
        setIsLoadingLocation(false)
      }
    }
    
    fetchDealerData()
  }, [origin.isDealerLocation, origin.dealerSlug, isInitialized, animationComplete, currentLocationData?.slug])
  
  // Update current location data when initial locationData prop changes - but only after animation completes
  useEffect(() => {
    if (locationData && animationComplete) {
      setCurrentLocationData(locationData)
    }
  }, [locationData, animationComplete])
  
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

  // Focus management for mobile menu
  useEffect(() => {
    if (isMenuOpen && mobileMenuRef.current) {
      const firstFocusable = mobileMenuRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement
      firstFocusable?.focus()
    } else if (!isMenuOpen && menuButtonRef.current) {
      menuButtonRef.current.focus()
    }
  }, [isMenuOpen])

  // Handle escape key and cleanup
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isMenuOpen) {
          setIsMenuOpen(false)
          setOpenMobileItems(new Set())
        }
        if (activeDropdown) {
          setActiveDropdown(null)
        }
      }
    }

    document.addEventListener('keydown', handleEscape)
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current)
      }
    }
  }, [isMenuOpen, activeDropdown])
  
  // Scroll detection
  const { scrollY } = useScroll()
  
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50)
  })
  
  // Mobile menu item toggle handlers
  const toggleMobileItem = useCallback((itemLabel: string) => {
    setOpenMobileItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(itemLabel)) {
        newSet.delete(itemLabel)
      } else {
        newSet.add(itemLabel)
      }
      return newSet
    })
  }, [])

  const closeMobileMenu = useCallback(() => {
    setIsMenuOpen(false)
    setOpenMobileItems(new Set())
  }, [])

  // Desktop dropdown handlers
  const handleDropdownOpen = useCallback((itemLabel: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current)
      dropdownTimeoutRef.current = null
    }
    setActiveDropdown(itemLabel)
  }, [])

  const handleDropdownClose = useCallback(() => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null)
    }, 150)
  }, [])

  // Utility function to check if target is interactive
  const isInteractiveElement = useCallback((target: EventTarget | null): boolean => {
    if (!target || !(target instanceof Element)) return false

    // Check if the clicked element or any parent is interactive
    const interactiveSelectors = [
      'a', 'button', 'input', 'select', 'textarea', 'svg', 'path',
      '[role="button"]', '[role="link"]', '[tabindex]:not([tabindex="-1"])'
    ]

    return interactiveSelectors.some(selector =>
      target.closest(selector) !== null
    )
  }, [])

  // Scroll to top function
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }, [])

  // Header click handler
  const handleHeaderClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!isInteractiveElement(event.target)) {
      scrollToTop()
    }
  }, [isInteractiveElement, scrollToTop])

  // Animation variants - use a stable key to prevent re-animation
  const headerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { 
        duration: 1.2,
        ease: [0.25, 0.1, 0.25, 1.0] // Custom cubic-bezier for elegant easing
      }
    }
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
      className={cn(
        "sticky top-0 z-50 w-full border-b border-gray-200/50 transition-shadow duration-300",
        isScrolled ? 'bg-white shadow-lg' : 'bg-white shadow-sm'
      )}
      style={{ opacity: isVisible ? undefined : 0 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{
        duration: 1.2,
        ease: [0.25, 0.1, 0.25, 1.0]
      }}
      onAnimationComplete={() => {
        if (isVisible) {
          setAnimationComplete(true)
        }
      }}
    >
      {/* Main Header */}
      <div
        className="container mx-auto px-4 sm:px-6"
        onClick={handleHeaderClick}
      >
        <div className={cn(
          "flex items-center transition-all duration-300",
          isScrolled ? 'h-16' : 'h-20'
        )}>
          {/* Logo */}
          <motion.div
            animate={{
              scale: isScrolled ? 0.9 : 1,
            }}
            transition={{
              duration: 0.3,
              ease: "easeInOut"
            }}
            className="flex-shrink-0 z-10"
          >
            <KawaiLogo
              size={isScrolled ? "sm" : "md"}
              animated={true}
              {...(currentLocationData?.locationName && { dealerName: currentLocationData.locationName })}
              nonClickable={isSignaturePage}
            />
          </motion.div>

          {/* Desktop Navigation - Auto-hide on smaller screens to prevent overlap, hidden on signature page */}
          {!isSignaturePage && (
            <nav className="hidden xl:flex flex-1 justify-center">
              <div className="flex items-center space-x-1">
                {navigation.map((item) => (
                  <DesktopMenuItem
                    key={item.label}
                    item={item}
                    isOpen={activeDropdown === item.label}
                    onOpen={handleDropdownOpen}
                    onClose={handleDropdownClose}
                  />
                ))}
              </div>
            </nav>
          )}

          {/* Spacer for medium screens where nav is hidden but desktop layout is used */}
          <div className="flex-1 lg:block xl:hidden" />

          {/* CTA Buttons - Only show Visit Showroom on dealer location pages, hidden on signature page */}
          {currentLocationData && !isLoadingLocation && !isSignaturePage && (
            <motion.div
              className="hidden lg:flex items-center gap-3 flex-shrink-0 ml-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <Button
                className="bg-kawai-red hover:bg-kawai-red/90 text-white px-4 py-2 shadow-md hover:shadow-lg transition-all duration-300"
                asChild
              >
                <ContextAwareLink href={`/${currentLocationData.slug}/contact`}>
                  Visit Showroom
                </ContextAwareLink>
              </Button>
            </motion.div>
          )}

          {/* Mobile Menu Button - Hidden on signature page */}
          {!isSignaturePage && (
            <motion.button
              ref={menuButtonRef}
              className="xl:hidden p-2 rounded-md transition-colors hover:bg-gray-100/80 focus:outline-none focus:ring-2 focus:ring-kawai-red focus:ring-offset-2 flex-shrink-0 ml-4"
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
          )}
        </div>
      </div>

      {/* Mobile Menu - Hidden on signature page */}
      <AnimatePresence>
        {isMenuOpen && !isSignaturePage && (
          <>
            <motion.div 
              className="fixed inset-0 z-[190] bg-black/20 xl:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
            />
            <motion.div 
              ref={mobileMenuRef}
              className="fixed right-0 top-0 bottom-0 z-[200] w-[min(90vw,28rem)] xl:hidden bg-white border-l border-gray-200/50 shadow-2xl flex flex-col h-screen"
              style={{
                height: '100vh',
                minHeight: '100vh'
              }}
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
            <div className="sticky top-0 bg-white border-b border-gray-200/50 p-4 z-10 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <h2 className="text-lg font-semibold text-gray-900">Piano Categories</h2>
                </div>
                <button
                  onClick={closeMobileMenu}
                  className="p-2 rounded-md hover:bg-gray-100/80 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <nav className="flex-1 p-6 overflow-y-auto min-h-0">
              <div className="space-y-4 pb-6 min-h-full flex flex-col justify-start">
                {navigation.map((item) => (
                  <MobileMenuItem
                    key={item.label}
                    item={item}
                    onClose={closeMobileMenu}
                    isOpen={openMobileItems.has(item.label)}
                    onToggle={() => toggleMobileItem(item.label)}
                  />
                ))}
              </div>
            </nav>
            
            <div className="mt-auto bg-white border-t border-gray-200/50 p-6 flex-shrink-0">
              <div className="text-center text-sm text-gray-500">
                Browse our complete piano collection by category
              </div>
            </div>
          </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  )
}