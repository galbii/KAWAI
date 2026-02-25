'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef, useCallback } from 'react'
import { Menu, X, ChevronDown, Home } from 'lucide-react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { KawaiLogo } from '@/components/ui/kawai-logo'
import { CartIcon } from '@/components/cart/CartIcon'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { ProductsMegaMenu } from '@/components/navigation/ProductsMegaMenu'
import { StorefrontsMegaMenu } from '@/components/navigation/StorefrontsMegaMenu'
import { ResourcesMegaMenu } from '@/components/navigation/ResourcesMegaMenu'
import { RegisterPianoModal } from '@/components/navigation/RegisterPianoModal'
import { NewsMegaMenu } from '@/components/navigation/NewsMegaMenu'
import { SearchBar } from '@/components/search/SearchBar'
import { cn } from '@/lib/utils'
import { useNavigationContext } from '@/contexts/NavigationContext'
import { getContextAwareUrl } from '@/lib/navigation-utils'
import { fetchPayloadProductsNavigation } from '@/lib/actions/payload-products-navigation'
import type { ProductsNavigation } from '@/lib/payload/products-navigation'

interface NavigationItem {
  label: string
  href?: string
  dropdown?: {
    label: string
    href: string
    description?: string
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
            <div className="pl-6 space-y-2">
              {item.dropdown.map((subItem) => (
                <ContextAwareLink
                  key={subItem.href}
                  href={subItem.href}
                  className="block py-2 px-4 text-base text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={onClose}
                >
                  <div className="leading-tight font-medium">
                    {subItem.label}
                  </div>
                  {subItem.description && (
                    <div className="text-xs text-gray-500 mt-0.5">
                      {subItem.description}
                    </div>
                  )}
                </ContextAwareLink>
              ))}
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
              <div className="grid grid-cols-2 gap-4">
                {item.dropdown.map((subItem) => (
                  <ContextAwareLink
                    key={subItem.href}
                    href={subItem.href}
                    className="block px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors group/item"
                  >
                    <div className="font-semibold text-gray-900 text-sm group-hover/item:text-gray-900">
                      {subItem.label}
                    </div>
                    {subItem.description && (
                      <div className="text-xs text-gray-500 mt-1">
                        {subItem.description}
                      </div>
                    )}
                  </ContextAwareLink>
                ))}
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

interface NewsItem {
  title: string
  description: string
  image?: any
  category: string
  link?: string
}

interface RegisterConfig {
  enabled?: boolean
  bannerImageUrl?: string | null
  bannerTitle?: string | null
  bannerDescription?: string | null
  hubspotEmbedUrl?: string | null
  hubspotFormId?: string | null
  hubspotPortalId?: string | null
  hubspotRegion?: string | null
}

interface HeaderProps {
  navigation?: NavigationItem[]
  locationData?: DealerLocationData | null
  isSignaturePage?: boolean
  hidePianoLinks?: boolean
  isUniversityPage?: boolean
  isFindADealerPage?: boolean
  hideLogo?: boolean
  newsItems?: NewsItem[]
  registerConfig?: RegisterConfig
}

// Default fallback navigation - URLs will be made context-aware at runtime
// Note: Piano navigation is now handled by ProductsMegaMenu (Shopify integration),
// StorefrontsMegaMenu, and ResourcesMegaMenu - these are rendered separately and not part of this navigation array
const defaultNavigation: NavigationItem[] = [
  {
    label: 'News',
    href: '/news'
  },
  // Artists positioned after mega menus in render order
  {
    label: 'Artists',
    href: '/artists'
  },
  // Resources has been moved to ResourcesMegaMenu - rendered separately below
]

export function Header({ navigation = defaultNavigation, locationData, isSignaturePage = false, hidePianoLinks = false, isUniversityPage = false, isFindADealerPage = false, newsItems = [], registerConfig }: HeaderProps) {
  const pathname = usePathname()
  const isOnFindADealerPage = isFindADealerPage || pathname.startsWith('/find-a-dealer')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [openMobileItems, setOpenMobileItems] = useState<Set<string>>(new Set())
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [isProductsMenuOpen, setIsProductsMenuOpen] = useState(false)
  const [productsNavData, setProductsNavData] = useState<ProductsNavigation | null>(null)
  const [isStorefrontsMenuOpen, setIsStorefrontsMenuOpen] = useState(false)
  const [storefrontsData, setStorefrontsData] = useState<Array<{
    id: string
    slug: string
    locationName: string
    locationText: string
    establishedText?: string
    showroomInfo?: { address?: string; phone?: string }
    features?: Array<{ title: string }>
  }> | null>(null)
  const [isResourcesMenuOpen, setIsResourcesMenuOpen] = useState(false)
  const [isNewsMenuOpen, setIsNewsMenuOpen] = useState(false)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
  const [currentLocationData, setCurrentLocationData] = useState<DealerLocationData | null>(locationData || null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [animationComplete, setAnimationComplete] = useState(false)
  const [isAutoHidden, setIsAutoHidden] = useState(true) // Start hidden - only shows on hover or menu open
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const productsMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const storefrontsMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const resourcesMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const newsMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const autoHideTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastScrollY = useRef(0)
  const lastScrollTime = useRef(0)

  // Use navigation context to detect location changes
  const { origin, isInitialized } = useNavigationContext()

  // Feature flag: Control Products menu visibility
  // Only show Products menu if feature flag is enabled (NEXT_PUBLIC_SHOW_PRODUCTS_MENU=true)
  const isProductsMenuEnabled = process.env.NEXT_PUBLIC_SHOW_PRODUCTS_MENU === 'true'

  // Fetch products navigation data on mount and refresh periodically
  useEffect(() => {
    const loadProductsNav = async () => {
      try {
        const navData = await fetchPayloadProductsNavigation()
        setProductsNavData(navData)
        console.log('[Header] Products navigation loaded from Payload:', {
          types: navData.types.length,
          totalProducts: navData.totalProducts,
          timestamp: new Date().toISOString()
        })
      } catch (error) {
        console.error('[Header] Failed to load products navigation:', error)
      }
    }

    // Initial load
    loadProductsNav()

    // OPTIMIZATION: Reduced refresh interval since we have cache revalidation hooks
    // Refresh every 10 minutes as a fallback check
    // The cache is automatically revalidated when products change in Payload
    const refreshInterval = setInterval(() => {
      console.log('[Header] Refreshing products navigation (fallback check)...')
      loadProductsNav()
    }, 10 * 60 * 1000) // 10 minutes

    // Cleanup interval on unmount
    return () => {
      clearInterval(refreshInterval)
    }
  }, [])

  // Fetch storefronts data on mount
  useEffect(() => {
    const loadStorefronts = async () => {
      try {
        const response = await fetch('/api/storefronts/active')
        const result = await response.json()

        if (result.success && result.data) {
          setStorefrontsData(result.data)
        }
      } catch (error) {
        console.error('[Header] Failed to load storefronts:', error)
      }
    }

    loadStorefronts()
  }, [])

  // REMOVED: CSS variable updates were causing scroll jank
  // Mega menus now position themselves directly without needing this
  
  // Mark animation as complete immediately since header has no animations
  useEffect(() => {
    setAnimationComplete(true)
  }, [])

  // Initialize scroll state based on initial scroll position
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const initialScrollY = window.scrollY
      const isAtTop = initialScrollY <= 50
      setIsScrolled(!isAtTop)
    }

    // Start with nav hidden on initial load
    setIsAutoHidden(true)

    // CRITICAL: Start auto-hide timer on initialization when at top of page
    // This ensures nav auto-hides after 2 seconds even without scroll movement
    // Works at ALL scroll positions (including scrollY = 0)
    autoHideTimeoutRef.current = setTimeout(() => {
      setIsAutoHidden(true)
    }, 2000)

    // Cleanup timer on unmount
    return () => {
      if (autoHideTimeoutRef.current) {
        clearTimeout(autoHideTimeoutRef.current)
        autoHideTimeoutRef.current = null
      }
    }
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
        if (isProductsMenuOpen) {
          setIsProductsMenuOpen(false)
        }
        if (isStorefrontsMenuOpen) {
          setIsStorefrontsMenuOpen(false)
        }
        if (isResourcesMenuOpen) {
          setIsResourcesMenuOpen(false)
        }
        if (isNewsMenuOpen) {
          setIsNewsMenuOpen(false)
        }
      }
    }

    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('keydown', handleEscape)
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current)
      }
      if (productsMenuTimeoutRef.current) {
        clearTimeout(productsMenuTimeoutRef.current)
      }
      if (storefrontsMenuTimeoutRef.current) {
        clearTimeout(storefrontsMenuTimeoutRef.current)
      }
      if (resourcesMenuTimeoutRef.current) {
        clearTimeout(resourcesMenuTimeoutRef.current)
      }
      if (newsMenuTimeoutRef.current) {
        clearTimeout(newsMenuTimeoutRef.current)
      }
      if (autoHideTimeoutRef.current) {
        clearTimeout(autoHideTimeoutRef.current)
      }
    }
  }, [isMenuOpen, activeDropdown, isProductsMenuOpen, isStorefrontsMenuOpen, isResourcesMenuOpen, isNewsMenuOpen])
  
  // ============================================================================
  // Scroll Detection Logic
  // ============================================================================
  // Bottom nav ALWAYS auto-hides (even at top)
  // Shows on: hover OR menu open
  // Hidden by default with 2-second auto-hide timer (scroll-independent)
  // Uses single 5px threshold to filter micro-jitter while staying responsive
  // ============================================================================

  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = lastScrollY.current

    // Always update position (critical for accurate tracking)
    lastScrollY.current = latest

    // Update "scrolled past top" state
    const isAtTop = latest <= 50
    setIsScrolled(!isAtTop)

    // Detect scroll movement (only if movement is significant enough)
    const movement = latest - previous

    if (Math.abs(movement) > 5) {
      // Update last scroll time for menu prevention
      lastScrollTime.current = Date.now()

      // Clear any existing auto-hide timer
      if (autoHideTimeoutRef.current) {
        clearTimeout(autoHideTimeoutRef.current)
        autoHideTimeoutRef.current = null
      }

      // CRITICAL: Start 2-second auto-hide timer after ANY scroll
      // This works at ALL scroll positions (including scrollY = 0)
      autoHideTimeoutRef.current = setTimeout(() => {
        setIsAutoHidden(true)
      }, 2000)

      // Close menus on any scroll
      if (isProductsMenuOpen || isStorefrontsMenuOpen || isResourcesMenuOpen || isNewsMenuOpen) {
        setIsProductsMenuOpen(false)
        setIsStorefrontsMenuOpen(false)
        setIsResourcesMenuOpen(false)
        setIsNewsMenuOpen(false)
      }
    }
  })
  
  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (autoHideTimeoutRef.current) {
        clearTimeout(autoHideTimeoutRef.current)
      }
    }
  }, [])

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
    // Close mega menus when opening regular dropdown
    setIsProductsMenuOpen(false)
    setIsStorefrontsMenuOpen(false)
    setIsResourcesMenuOpen(false)
    setIsNewsMenuOpen(false)
  }, [])

  const handleDropdownClose = useCallback(() => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null)
    }, 150)
  }, [])

  // Products menu handlers
  const handleProductsMenuOpen = useCallback(() => {
    // Don't open menu if header animation hasn't completed yet
    if (!animationComplete) return

    // Don't open if user scrolled in the last 200ms (prevents menu opening during scroll)
    if (Date.now() - lastScrollTime.current < 200) return

    if (productsMenuTimeoutRef.current) {
      clearTimeout(productsMenuTimeoutRef.current)
      productsMenuTimeoutRef.current = null
    }
    // Clear auto-hide timer and show nav
    if (autoHideTimeoutRef.current) {
      clearTimeout(autoHideTimeoutRef.current)
      autoHideTimeoutRef.current = null
    }
    setIsAutoHidden(false)
    setIsProductsMenuOpen(true)
    // Close other menus
    setActiveDropdown(null)
    setIsStorefrontsMenuOpen(false)
    setIsResourcesMenuOpen(false)
    setIsNewsMenuOpen(false)
  }, [animationComplete])

  const handleProductsMenuClose = useCallback(() => {
    productsMenuTimeoutRef.current = setTimeout(() => {
      setIsProductsMenuOpen(false)
      // CRITICAL: Start auto-hide timer after menu closes
      // Works at ALL scroll positions (including top)
      if (autoHideTimeoutRef.current) {
        clearTimeout(autoHideTimeoutRef.current)
      }
      autoHideTimeoutRef.current = setTimeout(() => {
        setIsAutoHidden(true)
      }, 2000)
    }, 150)
  }, [])

  // Storefronts menu handlers
  const handleStorefrontsMenuOpen = useCallback(() => {
    if (!animationComplete) return
    if (Date.now() - lastScrollTime.current < 200) return

    if (storefrontsMenuTimeoutRef.current) {
      clearTimeout(storefrontsMenuTimeoutRef.current)
      storefrontsMenuTimeoutRef.current = null
    }
    // Clear auto-hide timer and show nav
    if (autoHideTimeoutRef.current) {
      clearTimeout(autoHideTimeoutRef.current)
      autoHideTimeoutRef.current = null
    }
    setIsAutoHidden(false)
    setIsStorefrontsMenuOpen(true)
    // Close other menus
    setActiveDropdown(null)
    setIsProductsMenuOpen(false)
    setIsResourcesMenuOpen(false)
    setIsNewsMenuOpen(false)
  }, [animationComplete])

  const handleStorefrontsMenuClose = useCallback(() => {
    storefrontsMenuTimeoutRef.current = setTimeout(() => {
      setIsStorefrontsMenuOpen(false)
      // CRITICAL: Start auto-hide timer after menu closes
      // Works at ALL scroll positions (including top)
      if (autoHideTimeoutRef.current) {
        clearTimeout(autoHideTimeoutRef.current)
      }
      autoHideTimeoutRef.current = setTimeout(() => {
        setIsAutoHidden(true)
      }, 2000)
    }, 150)
  }, [])

  // Resources menu handlers
  const handleResourcesMenuOpen = useCallback(() => {
    if (!animationComplete) return
    if (Date.now() - lastScrollTime.current < 200) return

    if (resourcesMenuTimeoutRef.current) {
      clearTimeout(resourcesMenuTimeoutRef.current)
      resourcesMenuTimeoutRef.current = null
    }
    // Clear auto-hide timer and show nav
    if (autoHideTimeoutRef.current) {
      clearTimeout(autoHideTimeoutRef.current)
      autoHideTimeoutRef.current = null
    }
    setIsAutoHidden(false)
    setIsResourcesMenuOpen(true)
    // Close other menus
    setActiveDropdown(null)
    setIsProductsMenuOpen(false)
    setIsStorefrontsMenuOpen(false)
    setIsNewsMenuOpen(false)
  }, [animationComplete])

  const handleResourcesMenuClose = useCallback(() => {
    resourcesMenuTimeoutRef.current = setTimeout(() => {
      setIsResourcesMenuOpen(false)
      // CRITICAL: Start auto-hide timer after menu closes
      // Works at ALL scroll positions (including top)
      if (autoHideTimeoutRef.current) {
        clearTimeout(autoHideTimeoutRef.current)
      }
      autoHideTimeoutRef.current = setTimeout(() => {
        setIsAutoHidden(true)
      }, 2000)
    }, 150)
  }, [])

  // News menu handlers
  const handleNewsMenuOpen = useCallback(() => {
    if (!animationComplete) return
    if (Date.now() - lastScrollTime.current < 200) return

    if (newsMenuTimeoutRef.current) {
      clearTimeout(newsMenuTimeoutRef.current)
      newsMenuTimeoutRef.current = null
    }
    // Clear auto-hide timer and show nav
    if (autoHideTimeoutRef.current) {
      clearTimeout(autoHideTimeoutRef.current)
      autoHideTimeoutRef.current = null
    }
    setIsAutoHidden(false)
    setIsNewsMenuOpen(true)
    // Close other menus
    setActiveDropdown(null)
    setIsProductsMenuOpen(false)
    setIsStorefrontsMenuOpen(false)
    setIsResourcesMenuOpen(false)
  }, [animationComplete])

  const handleNewsMenuClose = useCallback(() => {
    newsMenuTimeoutRef.current = setTimeout(() => {
      setIsNewsMenuOpen(false)
      // CRITICAL: Start auto-hide timer after menu closes
      // Works at ALL scroll positions (including top)
      if (autoHideTimeoutRef.current) {
        clearTimeout(autoHideTimeoutRef.current)
      }
      autoHideTimeoutRef.current = setTimeout(() => {
        setIsAutoHidden(true)
      }, 2000)
    }, 150)
  }, [])


  // Header hover handlers for bottom navigation reveal
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

  // Bottom nav hover handler - show nav when hovering
  // Works at ALL scroll positions (including top)
  const handleBottomNavMouseEnter = useCallback(() => {
    if (autoHideTimeoutRef.current) {
      clearTimeout(autoHideTimeoutRef.current)
      autoHideTimeoutRef.current = null
    }
    setIsAutoHidden(false)
  }, [])

  // Bottom nav mouse leave handler - start auto-hide timer
  // CRITICAL: This ensures auto-hide works at ALL scroll positions
  // Timer triggers regardless of whether we're at top (scrollY = 0) or scrolled
  const handleBottomNavMouseLeave = useCallback(() => {
    // Clear any existing timer
    if (autoHideTimeoutRef.current) {
      clearTimeout(autoHideTimeoutRef.current)
      autoHideTimeoutRef.current = null
    }

    // ALWAYS start 2-second auto-hide timer (scroll-independent)
    autoHideTimeoutRef.current = setTimeout(() => {
      setIsAutoHidden(true)
    }, 2000)
  }, [])

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
    <>
    <header
      ref={headerRef}
      className="fixed left-0 right-0 z-50 w-full bg-white shadow-sm"
      style={{
        top: 'var(--announcement-bar-height, 0)'
      }}
    >
      {/* Top Row - Utility Bar (Full Width) */}
      <div className="border-b border-gray-100 w-full bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Left */}
            <div className="flex-shrink-0 z-10">
              <KawaiLogo
                size="md"
                animated={true}
                {...(currentLocationData?.locationName && { dealerName: currentLocationData.locationName })}
                nonClickable={isSignaturePage}
              />
            </div>

            {/* Home Icon + SearchBar - Center (Desktop Only) */}
            {!isSignaturePage && !hidePianoLinks && !isUniversityPage && (
              <div className="hidden md:flex items-center flex-1 max-w-2xl mx-8 gap-3">
                {/* Home Icon */}
                <ContextAwareLink
                  href="/"
                  className="flex-shrink-0 p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50/80 transition-colors rounded-md"
                  aria-label="Home"
                >
                  <Home className="h-5 w-5" />
                </ContextAwareLink>

                {/* SearchBar - Desktop */}
                <SearchBar
                  className="w-full"
                  onOpenChange={setIsSearchOpen}
                />
              </div>
            )}

            {/* Right Side - Cart + CTA/Dealer Link + Mobile Menu */}
            <div className="flex items-center gap-2">
              {/* Find a Dealer Link - Desktop (non-storefront pages) */}
              {!isSignaturePage && !isUniversityPage && !currentLocationData && (
                <motion.div
                  className="hidden lg:flex items-center"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <ContextAwareLink
                    href="/find-a-dealer"
                    className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50/50 font-medium transition-colors rounded-md"
                  >
                    Find a Dealer
                  </ContextAwareLink>
                </motion.div>
              )}

              {/* Visit Showroom CTA - Desktop (dealer location pages) */}
              {currentLocationData && !isLoadingLocation && !isSignaturePage && !isUniversityPage && (
                <motion.div
                  className="hidden lg:flex items-center"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <Button
                    className="bg-kawai-red hover:bg-kawai-red/90 text-white px-4 py-2 text-sm shadow-md hover:shadow-lg transition-all duration-300"
                    asChild
                  >
                    <ContextAwareLink href={`/store/${currentLocationData.slug}/contact`}>
                      Visit Showroom
                    </ContextAwareLink>
                  </Button>
                </motion.div>
              )}

              {/* Cart Icon */}
              {!isSignaturePage && !isUniversityPage && (
                <motion.div
                  className="hidden lg:flex items-center"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35, duration: 0.4 }}
                >
                  <CartIcon onOpen={() => setIsCartOpen(true)} />
                </motion.div>
              )}

              {/* Cart Icon - Mobile */}
              {!isSignaturePage && !isUniversityPage && (
                <div className="lg:hidden flex items-center">
                  <CartIcon onOpen={() => setIsCartOpen(true)} />
                </div>
              )}

              {/* Register Your Piano — mobile visible button */}
              {!isSignaturePage && !hidePianoLinks && !isUniversityPage && registerConfig?.enabled !== false && (
                <button
                  onClick={() => setIsRegisterModalOpen(true)}
                  className="lg:hidden rounded-md bg-kawai-black px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-kawai-charcoal"
                >
                  Register
                </button>
              )}

              {/* Mobile Menu Button */}
              {!isSignaturePage && !hidePianoLinks && !isUniversityPage && (
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
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <X className="h-6 w-6 text-gray-900" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="menu"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Menu className="h-6 w-6 text-gray-900" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>


      {/* Kawai Red Line - Between Top and Bottom Rows */}
      <motion.div
        className="w-full bg-[#A01829]"
        initial={false}
        animate={{
          height: (!isAutoHidden || isProductsMenuOpen || isStorefrontsMenuOpen || isResourcesMenuOpen || isNewsMenuOpen) ? 0 : 6,
        }}
        transition={{
          duration: 0.2,
          ease: [0.4, 0, 0.2, 1],
        }}
      />

      {/* Bottom Row - Main Navigation (Full Width) - Auto-hide on scroll/hover */}
      {!isSignaturePage && !hidePianoLinks && !isUniversityPage && !isSearchOpen && (
        <div
          className="hidden lg:block w-full relative"
          onMouseEnter={handleBottomNavMouseEnter}
          onMouseLeave={handleBottomNavMouseLeave}
        >
          {/* Hover trigger area - always present even when nav is hidden */}
          <div
            className="absolute top-0 left-0 right-0 h-4 z-10"
            style={{
              pointerEvents: isAutoHidden ? 'auto' : 'none',
              cursor: isAutoHidden ? 'pointer' : 'default'
            }}
          />
          <motion.div
            className="w-full bg-white overflow-hidden relative z-20"
            initial={false}
            animate={{
              height: (!isAutoHidden || isProductsMenuOpen || isStorefrontsMenuOpen || isResourcesMenuOpen || isNewsMenuOpen) ? 'auto' : 0,
              opacity: (!isAutoHidden || isProductsMenuOpen || isStorefrontsMenuOpen || isResourcesMenuOpen || isNewsMenuOpen) ? 1 : 0,
            }}
            transition={{
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
          <div className="w-full bg-white border-b-[6px] border-[#A01829]">
          <div className="container mx-auto px-4 sm:px-6">
            <nav>
              <div className={cn(
                "flex items-center transition-all duration-300",
                isScrolled ? 'h-12' : 'h-14'
              )}>
                {/* Left spacer — mirrors the Register button on the right */}
                <div className="flex-1" />

                {/* Centered nav items */}
                <div className="flex items-center gap-8">
                  {/* News Mega Menu */}
                  <div
                    onMouseEnter={animationComplete ? handleNewsMenuOpen : undefined}
                    onMouseLeave={animationComplete ? handleNewsMenuClose : undefined}
                  >
                    <button
                      className={cn(
                        "flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors rounded-md",
                        animationComplete ? "cursor-pointer" : "cursor-default opacity-50"
                      )}
                      disabled={!animationComplete}
                    >
                      <span>News</span>
                      <ChevronDown className={cn("ml-1 h-4 w-4 transition-transform duration-200", isNewsMenuOpen && "rotate-180")} />
                    </button>
                  </div>

                  {/* Official Storefronts Mega Menu */}
                  <div
                    onMouseEnter={storefrontsData && animationComplete ? handleStorefrontsMenuOpen : undefined}
                    onMouseLeave={storefrontsData && animationComplete ? handleStorefrontsMenuClose : undefined}
                  >
                    <button
                      className={cn(
                        "flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors rounded-md",
                        storefrontsData && animationComplete ? "cursor-pointer" : "cursor-default opacity-50"
                      )}
                      disabled={!storefrontsData || !animationComplete}
                    >
                      <span>Official Storefronts</span>
                      <ChevronDown className={cn("ml-1 h-4 w-4 transition-transform duration-200", isStorefrontsMenuOpen && "rotate-180")} />
                    </button>
                  </div>

                  {/* Products Mega Menu - Controlled by feature flag */}
                  {isProductsMenuEnabled && (
                    <div
                      onMouseEnter={productsNavData && animationComplete ? handleProductsMenuOpen : undefined}
                      onMouseLeave={productsNavData && animationComplete ? handleProductsMenuClose : undefined}
                    >
                      <button
                        className={cn(
                          "flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors rounded-md",
                          productsNavData && animationComplete ? "cursor-pointer" : "cursor-default opacity-50"
                        )}
                        disabled={!productsNavData || !animationComplete}
                      >
                        <span>Products</span>
                        <ChevronDown className={cn("ml-1 h-4 w-4 transition-transform duration-200", isProductsMenuOpen && "rotate-180")} />
                      </button>
                    </div>
                  )}

                  {/* Artists Link */}
                  {navigation.filter(item => item.label === 'Artists').map((item) => (
                    <ContextAwareLink
                      key={item.label}
                      href={item.href || '#'}
                      className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors rounded-md"
                    >
                      {item.label}
                    </ContextAwareLink>
                  ))}

                  {/* Resources Mega Menu */}
                  <div
                    onMouseEnter={animationComplete ? handleResourcesMenuOpen : undefined}
                    onMouseLeave={animationComplete ? handleResourcesMenuClose : undefined}
                  >
                    <button
                      className={cn(
                        "flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors rounded-md",
                        animationComplete ? "cursor-pointer" : "cursor-default opacity-50"
                      )}
                      disabled={!animationComplete}
                    >
                      <span>Resources</span>
                      <ChevronDown className={cn("ml-1 h-4 w-4 transition-transform duration-200", isResourcesMenuOpen && "rotate-180")} />
                    </button>
                  </div>
                </div>

                {/* Right column — Register button */}
                <div className="flex-1 flex justify-end">
                  {registerConfig?.enabled !== false && (
                    <button
                      onClick={() => setIsRegisterModalOpen(true)}
                      className="rounded-md bg-kawai-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-kawai-charcoal"
                    >
                      Register Your Piano
                    </button>
                  )}
                </div>
              </div>
            </nav>
          </div>
          </div>
          </motion.div>
        </div>
      )}

      {/* Mobile Menu - Hidden on signature page, concert artist page, and university page */}
      <AnimatePresence>
        {isMenuOpen && !isSignaturePage && !hidePianoLinks && !isUniversityPage && (
          <>
            <motion.div
              className="fixed inset-0 z-[9500] bg-black/20 xl:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
            />
            <motion.div
              ref={mobileMenuRef}
              className="fixed right-0 top-0 bottom-0 z-[9501] w-[min(90vw,28rem)] xl:hidden bg-white border-l border-gray-200/50 shadow-2xl flex flex-col h-screen"
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
              <div className="flex items-center justify-end">
                <button
                  onClick={closeMobileMenu}
                  className="p-2 rounded-md hover:bg-gray-100/80 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6 text-gray-900" />
                </button>
              </div>
            </div>
            
            <nav className="flex-1 p-6 overflow-y-auto min-h-0">
              <div className="space-y-4 pb-6 min-h-full flex flex-col justify-start">
                {/* Home Link - Always goes to global homepage, doesn't preserve dealer context */}
                <Link
                  href="/"
                  className="block py-4 px-6 text-gray-800 hover:text-gray-900 hover:bg-gray-50 font-medium text-xl transition-colors rounded-lg"
                  onClick={closeMobileMenu}
                >
                  Home
                </Link>

                {navigation.map((item) => (
                  <MobileMenuItem
                    key={item.label}
                    item={item}
                    onClose={closeMobileMenu}
                    isOpen={openMobileItems.has(item.label)}
                    onToggle={() => toggleMobileItem(item.label)}
                  />
                ))}

                {/* Find a Dealer Link - Only show on non-storefront pages */}
                {!currentLocationData && (
                  <ContextAwareLink
                    href="/find-a-dealer"
                    className="block py-4 px-6 text-gray-800 hover:text-gray-900 hover:bg-gray-50 font-medium text-xl transition-colors rounded-lg border-2 border-kawai-red text-kawai-red hover:bg-kawai-red hover:text-white"
                    onClick={closeMobileMenu}
                  >
                    Find a Dealer
                  </ContextAwareLink>
                )}
              </div>
            </nav>
            
            {/* Register Your Piano — sidebar bottom */}
            {registerConfig?.enabled !== false && (
              <div className="mt-auto border-t border-gray-200/50 bg-white px-5 py-5 flex-shrink-0">
                <button
                  onClick={() => {
                    closeMobileMenu()
                    setIsRegisterModalOpen(true)
                  }}
                  className="w-full rounded-lg bg-kawai-black px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-kawai-charcoal active:scale-[0.98]"
                >
                  Register Your Piano
                </button>
              </div>
            )}
          </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Storefronts Mega Menu - Rendered at root level for proper positioning */}
      <div
        onMouseEnter={storefrontsData && animationComplete ? handleStorefrontsMenuOpen : undefined}
        onMouseLeave={storefrontsData && animationComplete ? handleStorefrontsMenuClose : undefined}
      >
        <StorefrontsMegaMenu
          storefronts={storefrontsData || []}
          isOpen={isStorefrontsMenuOpen && animationComplete && !isSearchOpen}
          onClose={() => setIsStorefrontsMenuOpen(false)}
          isLoading={!storefrontsData}
          isHeaderScrolled={isScrolled}
        />
      </div>

      {/* Products Mega Menu - Rendered at root level for proper positioning, controlled by feature flag */}
      {isProductsMenuEnabled && (
        <div
          onMouseEnter={productsNavData && animationComplete ? handleProductsMenuOpen : undefined}
          onMouseLeave={productsNavData && animationComplete ? handleProductsMenuClose : undefined}
        >
          <ProductsMegaMenu
            productTypes={productsNavData?.types || []}
            collections={productsNavData?.collections || []}
            isOpen={isProductsMenuOpen && animationComplete && !isSearchOpen}
            onClose={() => setIsProductsMenuOpen(false)}
            isLoading={!productsNavData}
            isHeaderScrolled={isScrolled}
          />
        </div>
      )}

      {/* Resources Mega Menu - Rendered at root level for proper positioning */}
      <div
        onMouseEnter={animationComplete ? handleResourcesMenuOpen : undefined}
        onMouseLeave={animationComplete ? handleResourcesMenuClose : undefined}
      >
        <ResourcesMegaMenu
          isOpen={isResourcesMenuOpen && animationComplete && !isSearchOpen}
          onClose={() => setIsResourcesMenuOpen(false)}
          onRegisterClick={() => setIsRegisterModalOpen(true)}
          registerEnabled={registerConfig?.enabled !== false}
          bannerImageUrl={registerConfig?.bannerImageUrl ?? null}
          bannerTitle={registerConfig?.bannerTitle ?? null}
          bannerDescription={registerConfig?.bannerDescription ?? null}
          isHeaderScrolled={isScrolled}
        />
      </div>

      {/* News Mega Menu - Rendered at root level for proper positioning */}
      <div
        onMouseEnter={animationComplete ? handleNewsMenuOpen : undefined}
        onMouseLeave={animationComplete ? handleNewsMenuClose : undefined}
      >
        <NewsMegaMenu
          isOpen={isNewsMenuOpen && animationComplete && !isSearchOpen}
          onClose={() => setIsNewsMenuOpen(false)}
          isHeaderScrolled={isScrolled}
          newsItems={newsItems}
        />
      </div>

    </header>

    {/* Cart Drawer - rendered outside <header> so its z-[9500] is in the root stacking context,
        above the floating add-to-cart button's z-[9000] which is also in root stacking context.
        (Inside <header z-50>, child z-indexes are capped at that stacking context level.) */}
    <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    <RegisterPianoModal
      isOpen={isRegisterModalOpen}
      onClose={() => setIsRegisterModalOpen(false)}
      bannerImageUrl={registerConfig?.bannerImageUrl ?? null}
      bannerTitle={registerConfig?.bannerTitle ?? null}
      bannerDescription={registerConfig?.bannerDescription ?? null}
      hubspotEmbedUrl={registerConfig?.hubspotEmbedUrl ?? null}
      hubspotFormId={registerConfig?.hubspotFormId ?? null}
      hubspotPortalId={registerConfig?.hubspotPortalId ?? null}
      hubspotRegion={registerConfig?.hubspotRegion ?? null}
    />
    </>
  )
}