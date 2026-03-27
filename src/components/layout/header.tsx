'use client'

import Link from 'next/link'
import { createPortal } from 'react-dom'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef, useCallback } from 'react'
import { Menu, X, ChevronDown, Home, MapPin } from 'lucide-react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { KawaiLogo } from '@/components/ui/kawai-logo'
import { CartIcon } from '@/components/cart/CartIcon'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { ProductsMegaMenu } from '@/components/navigation/ProductsMegaMenu'
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

interface QuickLink {
  label: string
  url: string
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
        className="block py-4 px-6 text-kawai-charcoal hover:text-kawai-black hover:bg-kawai-pearl/50 font-medium text-xl transition-colors rounded-lg"
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
            className="flex-1 py-4 px-6 text-kawai-charcoal hover:text-kawai-black hover:bg-kawai-pearl/50 font-medium text-xl transition-colors rounded-lg"
            onClick={onClose}
          >
            {item.label}
          </ContextAwareLink>
          <button
            onClick={onToggle}
            className="p-4 text-kawai-charcoal hover:text-kawai-black hover:bg-kawai-pearl/50 transition-colors rounded-lg"
            aria-expanded={isOpen}
          >
            <ChevronDown className={cn("h-5 w-5 transition-transform duration-200", isOpen && "rotate-180")} />
          </button>
        </div>
      ) : (
        <button
          onClick={onToggle}
          className="flex items-center justify-between w-full py-4 px-6 text-kawai-charcoal hover:text-kawai-black hover:bg-kawai-pearl/50 font-medium text-xl transition-colors rounded-lg"
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
                  className="block py-2 px-4 text-base text-kawai-charcoal hover:text-kawai-black hover:bg-kawai-pearl/50 rounded-lg transition-colors"
                  onClick={onClose}
                >
                  <div className="leading-tight font-medium">
                    {subItem.label}
                  </div>
                  {subItem.description && (
                    <div className="text-xs text-kawai-charcoal/60 mt-0.5">
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
        className="px-4 py-2 text-kawai-charcoal hover:text-kawai-black hover:bg-kawai-pearl/80 font-medium transition-colors rounded-md font-[family-name:var(--font-brand-sans)] tracking-[0.05em] uppercase text-[12px]"
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
            className="px-4 py-2 text-kawai-charcoal hover:text-kawai-black hover:bg-kawai-pearl/80 font-medium transition-colors rounded-md font-[family-name:var(--font-brand-sans)] tracking-[0.05em] uppercase text-[12px]"
          >
            {item.label}
          </ContextAwareLink>
          <button className="px-1 py-2 text-kawai-charcoal hover:text-kawai-black transition-colors">
            <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", isOpen && "rotate-180")} />
          </button>
        </div>
      ) : (
        <button className="flex items-center px-4 py-2 text-kawai-charcoal hover:text-kawai-black hover:bg-kawai-pearl/80 font-medium transition-colors rounded-md font-[family-name:var(--font-brand-sans)] tracking-[0.05em] uppercase text-[12px]">
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
            className="absolute z-50 mt-2 min-w-[900px] max-w-[1400px] bg-white border border-kawai-neutral/50 shadow-xl rounded-xl overflow-hidden"
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
                    className="block px-3 py-2 rounded-lg hover:bg-kawai-pearl transition-colors group/item"
                  >
                    <div className="font-semibold text-kawai-black text-sm group-hover/item:text-kawai-black">
                      {subItem.label}
                    </div>
                    {subItem.description && (
                      <div className="text-xs text-kawai-charcoal/60 mt-1">
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
  hasMusicSchool: boolean
}

interface NewsItem {
  title: string
  description: string
  image?: any
  category: string
  link?: string
}

export interface LatestPost {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  featuredImage?: string | null
  heroVideoUrl?: string | null
  category?: string | null
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
  latestPosts?: LatestPost[]
  registerConfig?: RegisterConfig
  quickLinks?: QuickLink[]
  autoMinimize?: boolean
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

export function Header({ navigation = defaultNavigation, locationData, isSignaturePage = false, hidePianoLinks = false, isUniversityPage = false, isFindADealerPage = false, newsItems = [], latestPosts = [], registerConfig, quickLinks = [], autoMinimize = true }: HeaderProps) {
  const pathname = usePathname()
  const isOnFindADealerPage = isFindADealerPage || pathname.startsWith('/find-a-dealer')
  const [isMounted, setIsMounted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [openMobileItems, setOpenMobileItems] = useState<Set<string>>(new Set())
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [isProductsMenuOpen, setIsProductsMenuOpen] = useState(false)
  const [productsNavData, setProductsNavData] = useState<ProductsNavigation | null>(null)
const [isResourcesMenuOpen, setIsResourcesMenuOpen] = useState(false)
  const [isNewsMenuOpen, setIsNewsMenuOpen] = useState(false)
  const [isShowroomMenuOpen, setIsShowroomMenuOpen] = useState(false)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
  const [currentLocationData, setCurrentLocationData] = useState<DealerLocationData | null>(locationData || null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [animationComplete, setAnimationComplete] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isAutoHidden, setIsAutoHidden] = useState(true)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const productsMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null)
const resourcesMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const newsMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const showroomMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null)
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

  // REMOVED: CSS variable updates were causing scroll jank
  // Mega menus now position themselves directly without needing this

  // Expose --header-bottom so sticky elements (e.g. artist grid header) can track
  // exactly where the header ends. When nav is hidden, only the 6px red line shows.
  useEffect(() => {
    // Utility bar: always 64px (h-16)
    // Bottom nav: 48px (scrolled) or 56px (top) when visible; 6px red line when hidden
    // On mobile/tablet (< 1280px) the desktop bottom nav is `hidden xl:block` — only the
    // 6px mobile red line renders, so navHeight is always 6 on mobile/tablet.
    const isMobile = window.innerWidth < 1280
    const navHeight = isMobile ? 6 : (isAutoHidden ? 6 : (isScrolled ? 48 : 56))
    const totalPx = 64 + navHeight
    document.documentElement.style.setProperty(
      '--header-bottom',
      `calc(${totalPx}px + var(--announcement-bar-height, 0px))`
    )
  }, [isScrolled, isAutoHidden])

  // Mark animation as complete immediately since header has no animations
  useEffect(() => {
    setAnimationComplete(true)
    setIsMounted(true)
  }, [])

  // Auto-hide: show nav on mount, then hide after 2s (only when autoMinimize is enabled)
  useEffect(() => {
    setIsAutoHidden(false)
    if (!autoMinimize) return
    autoHideTimeoutRef.current = setTimeout(() => {
      setIsAutoHidden(true)
    }, 2000)
    return () => {
      if (autoHideTimeoutRef.current) clearTimeout(autoHideTimeoutRef.current)
    }
  }, [autoMinimize])

  // Initialize scroll state based on initial scroll position
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const initialScrollY = window.scrollY
      const isAtTop = initialScrollY <= 50
      setIsScrolled(!isAtTop)
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
        const [storefrontResponse, musicSchoolResponse] = await Promise.all([
          fetch(`/api/storefronts/by-slug/${origin.dealerSlug}`),
          fetch(`/api/music-schools/by-storefront/${origin.dealerSlug}`),
        ])
        const result = await storefrontResponse.json()
        const musicSchoolResult = await musicSchoolResponse.json()

        if (result.success && result.data) {
          const locationData = {
            locationName: result.data.showroomSection?.showroomInfo?.name || origin.dealerSlug,
            slug: origin.dealerSlug,
            hasMusicSchool: musicSchoolResult.hasMusicSchool === true,
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
        if (isResourcesMenuOpen) {
          setIsResourcesMenuOpen(false)
        }
        if (isNewsMenuOpen) {
          setIsNewsMenuOpen(false)
        }
        if (isShowroomMenuOpen) {
          setIsShowroomMenuOpen(false)
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
      if (resourcesMenuTimeoutRef.current) {
        clearTimeout(resourcesMenuTimeoutRef.current)
      }
      if (showroomMenuTimeoutRef.current) {
        clearTimeout(showroomMenuTimeoutRef.current)
      }
      if (newsMenuTimeoutRef.current) {
        clearTimeout(newsMenuTimeoutRef.current)
      }
    }
  }, [isMenuOpen, activeDropdown, isProductsMenuOpen, isResourcesMenuOpen, isNewsMenuOpen])
  
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

      // Close menus on any scroll
      if (isProductsMenuOpen || isResourcesMenuOpen || isNewsMenuOpen) {
        setIsProductsMenuOpen(false)
        setIsResourcesMenuOpen(false)
        setIsNewsMenuOpen(false)
      }
    }
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
    // Close mega menus when opening regular dropdown
    setIsProductsMenuOpen(false)
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
    if (autoHideTimeoutRef.current) {
      clearTimeout(autoHideTimeoutRef.current)
      autoHideTimeoutRef.current = null
    }
    setIsAutoHidden(false)
    setIsProductsMenuOpen(true)
    // Close other menus
    setActiveDropdown(null)
    setIsResourcesMenuOpen(false)
    setIsNewsMenuOpen(false)
  }, [animationComplete])

  const handleProductsMenuClose = useCallback(() => {
    productsMenuTimeoutRef.current = setTimeout(() => {
      setIsProductsMenuOpen(false)
    }, 150)
    if (!autoMinimize) return
    if (autoHideTimeoutRef.current) clearTimeout(autoHideTimeoutRef.current)
    autoHideTimeoutRef.current = setTimeout(() => {
      setIsAutoHidden(true)
    }, 2000)
  }, [autoMinimize])

  // Resources menu handlers
  const handleResourcesMenuOpen = useCallback(() => {
    if (!animationComplete) return
    if (Date.now() - lastScrollTime.current < 200) return

    if (resourcesMenuTimeoutRef.current) {
      clearTimeout(resourcesMenuTimeoutRef.current)
      resourcesMenuTimeoutRef.current = null
    }
    if (autoHideTimeoutRef.current) {
      clearTimeout(autoHideTimeoutRef.current)
      autoHideTimeoutRef.current = null
    }
    setIsAutoHidden(false)
    setIsResourcesMenuOpen(true)
    // Close other menus
    setActiveDropdown(null)
    setIsProductsMenuOpen(false)
    setIsNewsMenuOpen(false)
  }, [animationComplete])

  const handleResourcesMenuClose = useCallback(() => {
    resourcesMenuTimeoutRef.current = setTimeout(() => {
      setIsResourcesMenuOpen(false)
    }, 150)
    if (!autoMinimize) return
    if (autoHideTimeoutRef.current) clearTimeout(autoHideTimeoutRef.current)
    autoHideTimeoutRef.current = setTimeout(() => {
      setIsAutoHidden(true)
    }, 2000)
  }, [autoMinimize])

  // News menu handlers
  const handleNewsMenuOpen = useCallback(() => {
    if (!animationComplete) return
    if (Date.now() - lastScrollTime.current < 200) return

    if (newsMenuTimeoutRef.current) {
      clearTimeout(newsMenuTimeoutRef.current)
      newsMenuTimeoutRef.current = null
    }
    if (autoHideTimeoutRef.current) {
      clearTimeout(autoHideTimeoutRef.current)
      autoHideTimeoutRef.current = null
    }
    setIsAutoHidden(false)
    setIsNewsMenuOpen(true)
    // Close other menus
    setActiveDropdown(null)
    setIsProductsMenuOpen(false)
    setIsResourcesMenuOpen(false)
  }, [animationComplete])

  const handleNewsMenuClose = useCallback(() => {
    newsMenuTimeoutRef.current = setTimeout(() => {
      setIsNewsMenuOpen(false)
    }, 150)
    if (!autoMinimize) return
    if (autoHideTimeoutRef.current) clearTimeout(autoHideTimeoutRef.current)
    autoHideTimeoutRef.current = setTimeout(() => {
      setIsAutoHidden(true)
    }, 2000)
  }, [autoMinimize])

  const handleShowroomMenuOpen = useCallback(() => {
    if (showroomMenuTimeoutRef.current) clearTimeout(showroomMenuTimeoutRef.current)
    setIsShowroomMenuOpen(true)
  }, [])

  const handleShowroomMenuClose = useCallback(() => {
    showroomMenuTimeoutRef.current = setTimeout(() => {
      setIsShowroomMenuOpen(false)
    }, 150)
  }, [])


  // Bottom nav hover reveal handlers
  const handleBottomNavMouseEnter = useCallback(() => {
    if (autoHideTimeoutRef.current) {
      clearTimeout(autoHideTimeoutRef.current)
      autoHideTimeoutRef.current = null
    }
    setIsAutoHidden(false)
  }, [])

  const handleBottomNavMouseLeave = useCallback(() => {
    if (!autoMinimize) return
    if (autoHideTimeoutRef.current) {
      clearTimeout(autoHideTimeoutRef.current)
    }
    autoHideTimeoutRef.current = setTimeout(() => {
      setIsAutoHidden(true)
    }, 2000)
  }, [autoMinimize])

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

  // KMS logo detection — computed before JSX so there's no IIFE inside render
  const isMusicSchoolPage = pathname.includes('/music-school')
  const kmsUrlSlug = isMusicSchoolPage ? (pathname.match(/\/store\/([^/]+)/)?.[1] ?? '') : ''
  const kmsRawName = (currentLocationData?.locationName || kmsUrlSlug)
  const kmsDisplayName = kmsRawName
    .replace(/PIANO GALLERY/gi, '')
    .replace(/KAWAI/gi, '')
    .trim()
    .toUpperCase()
  const kmsMusicSchoolHref = pathname.replace(/\/music-school.*/, '/music-school')

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
      <div className="border-b border-kawai-neutral/60 w-full bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Left */}
            <div className="flex-shrink-0 z-10">
              {isMusicSchoolPage ? (
                <Link
                  href={kmsMusicSchoolHref}
                  className="flex items-end space-x-3"
                >
                  <img
                    src="https://pub-0cc9ed269d544fd29fe51221f6744a6b.r2.dev/media/KMS%20Logo.webp"
                    alt="Kawai Music School"
                    className="h-8 w-auto flex-shrink-0"
                  />
                </Link>
              ) : (
                <KawaiLogo
                  size="md"
                  animated={true}
                  {...(currentLocationData?.locationName && { dealerName: currentLocationData.locationName })}
                  nonClickable={isSignaturePage}
                />
              )}
            </div>

            {/* Home Icon + SearchBar - Center (Desktop Only) */}
            {!isSignaturePage && !hidePianoLinks && !isUniversityPage && (
              <div className="hidden md:flex items-center flex-1 max-w-2xl mx-8 gap-3">
                {/* Home Icon */}
                <ContextAwareLink
                  href="/"
                  className="flex-shrink-0 p-2 text-kawai-charcoal hover:text-kawai-black hover:bg-kawai-pearl transition-colors rounded-md"
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
              {/* Find a Dealer - Desktop (non-storefront pages) */}
              {!isSignaturePage && !isUniversityPage && !currentLocationData && (
                <motion.div
                  className="hidden xl:flex items-center"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <ContextAwareLink
                    href="/find-a-dealer"
                    className="flex items-center gap-2 rounded-md bg-kawai-red px-4 py-2.5 text-[11px] tracking-[0.08em] uppercase font-semibold text-white hover:bg-kawai-red-700 shadow-sm transition-all duration-200 font-[family-name:var(--font-brand-sans)]"
                  >
                    <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                    Find a Dealer
                  </ContextAwareLink>
                </motion.div>
              )}

              {/* Visit Showroom CTA - Desktop (dealer location pages, not on music school pages) */}
              {currentLocationData && !isLoadingLocation && !isSignaturePage && !isUniversityPage && !isMusicSchoolPage && (
                <motion.div
                  className="hidden xl:flex items-center"
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

              {/* Kawai Music School dropdown - Desktop (dealer location pages, only if school exists, not on music school pages) */}
              {currentLocationData?.hasMusicSchool && !isLoadingLocation && !isSignaturePage && !isUniversityPage && !isMusicSchoolPage && (
                <motion.div
                  className="hidden xl:flex items-center"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25, duration: 0.4 }}
                  onMouseEnter={handleShowroomMenuOpen}
                  onMouseLeave={handleShowroomMenuClose}
                >
                  <div className="relative">
                    {/* KMS Logo trigger */}
                    <button
                      className="flex items-center gap-1.5 px-2 py-1.5 rounded-md hover:bg-kawai-pearl transition-colors"
                      aria-label="Kawai Music School"
                      aria-expanded={isShowroomMenuOpen}
                    >
                      <img
                        src="https://pub-0cc9ed269d544fd29fe51221f6744a6b.r2.dev/media/KMS%20Logo.webp"
                        alt="Kawai Music School"
                        className="h-6 w-auto"
                      />
                      <ChevronDown className={cn('h-3 w-3 text-kawai-charcoal transition-transform duration-200', isShowroomMenuOpen && 'rotate-180')} />
                    </button>

                    <AnimatePresence>
                      {isShowroomMenuOpen && (
                        <motion.div
                          className="absolute right-0 top-full mt-1 w-52 bg-white border border-kawai-neutral rounded-lg shadow-brand-medium overflow-hidden z-50"
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.15 }}
                          onMouseEnter={handleShowroomMenuOpen}
                          onMouseLeave={handleShowroomMenuClose}
                        >
                          <div className="px-4 py-3 border-b border-kawai-neutral/50">
                            <img
                              src="https://pub-0cc9ed269d544fd29fe51221f6744a6b.r2.dev/media/KMS%20Logo.webp"
                              alt="Kawai Music School"
                              className="h-5 w-auto"
                            />
                          </div>
                          <ContextAwareLink
                            href={`/store/${currentLocationData.slug}/music-school`}
                            className="block px-4 py-2.5 text-sm text-kawai-charcoal hover:bg-kawai-pearl hover:text-kawai-red transition-colors"
                            onClick={() => setIsShowroomMenuOpen(false)}
                          >
                            Overview
                          </ContextAwareLink>
                          <ContextAwareLink
                            href={`/store/${currentLocationData.slug}/music-school/programs`}
                            className="block px-4 py-2.5 text-sm text-kawai-charcoal hover:bg-kawai-pearl hover:text-kawai-red transition-colors"
                            onClick={() => setIsShowroomMenuOpen(false)}
                          >
                            Programs
                          </ContextAwareLink>
                          <ContextAwareLink
                            href={`/store/${currentLocationData.slug}/music-school/faculty`}
                            className="block px-4 py-2.5 pb-3 text-sm text-kawai-charcoal hover:bg-kawai-pearl hover:text-kawai-red transition-colors"
                            onClick={() => setIsShowroomMenuOpen(false)}
                          >
                            Faculty
                          </ContextAwareLink>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}

              {/* Cart Icon */}
              {!isSignaturePage && !isUniversityPage && (
                <motion.div
                  className="hidden xl:flex items-center"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35, duration: 0.4 }}
                >
                  <CartIcon onOpen={() => setIsCartOpen(true)} />
                </motion.div>
              )}

              {/* Cart Icon - Mobile */}
              {!isSignaturePage && !isUniversityPage && (
                <div className="xl:hidden flex items-center">
                  <CartIcon onOpen={() => setIsCartOpen(true)} />
                </div>
              )}

              {/* Mobile Menu Button */}
              {!isSignaturePage && !hidePianoLinks && !isUniversityPage && (
                <motion.button
                  ref={menuButtonRef}
                  className="xl:hidden p-2 rounded-md transition-colors hover:bg-kawai-pearl focus:outline-none focus:ring-2 focus:ring-kawai-red focus:ring-offset-2"
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
                        <X className="h-6 w-6 text-kawai-black" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="menu"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Menu className="h-6 w-6 text-kawai-black" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>


      {/* Red line — mobile only (desktop gets it from the bottom nav) */}
      {!isSignaturePage && !hidePianoLinks && !isUniversityPage && (
        <div className="xl:hidden w-full h-[6px] bg-[#A01829]" />
      )}

      {/* Bottom Row - Main Navigation (Full Width) - Auto-hides, reveals on hover */}
      {!isSignaturePage && !hidePianoLinks && !isUniversityPage && !isSearchOpen && (
        <div
          className="hidden xl:block w-full"
          onMouseEnter={handleBottomNavMouseEnter}
          onMouseLeave={handleBottomNavMouseLeave}
        >
          {/* Red separator line — visible when nav is hidden */}
          <motion.div
            className="w-full bg-[#A01829] cursor-pointer"
            animate={{ height: isAutoHidden ? 6 : 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          />

          {/* Nav — animates in/out */}
          <motion.div
            animate={{ height: isAutoHidden ? 0 : 'auto', opacity: isAutoHidden ? 0 : 1 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: 'hidden' }}
          >
          <div className="w-full bg-white relative z-20">
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
                        "flex items-center px-3 py-2 font-medium text-kawai-charcoal hover:text-kawai-black hover:bg-kawai-pearl/80 transition-colors rounded-md font-[family-name:var(--font-brand-sans)] tracking-[0.05em] uppercase text-[12px]",
                        animationComplete ? "cursor-pointer" : "cursor-default opacity-50"
                      )}
                      disabled={!animationComplete}
                    >
                      <span>News</span>
                      <ChevronDown className={cn("ml-1 h-4 w-4 transition-transform duration-200", isNewsMenuOpen && "rotate-180")} />
                    </button>
                  </div>

                  {/* Products Mega Menu - Controlled by feature flag */}
                  {isProductsMenuEnabled && (
                    <div
                      onMouseEnter={productsNavData && animationComplete ? handleProductsMenuOpen : undefined}
                      onMouseLeave={productsNavData && animationComplete ? handleProductsMenuClose : undefined}
                      className="flex items-center"
                    >
                      <Link
                        href="/pianos"
                        onClick={() => setIsProductsMenuOpen(false)}
                        className="px-3 py-2 font-medium text-kawai-charcoal hover:text-kawai-black hover:bg-kawai-pearl/80 transition-colors rounded-md font-[family-name:var(--font-brand-sans)] tracking-[0.05em] uppercase text-[12px]"
                      >
                        Products
                      </Link>
                      <ChevronDown className={cn("h-4 w-4 text-kawai-charcoal transition-transform duration-200 -ml-1 mr-1", isProductsMenuOpen && "rotate-180")} />
                    </div>
                  )}

                  {/* Artists Link */}
                  {navigation.filter(item => item.label === 'Artists').map((item) => (
                    <ContextAwareLink
                      key={item.label}
                      href={item.href || '#'}
                      className="px-3 py-2 font-medium text-kawai-charcoal hover:text-kawai-black hover:bg-kawai-pearl/80 transition-colors rounded-md font-[family-name:var(--font-brand-sans)] tracking-[0.05em] uppercase text-[12px]"
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
                        "flex items-center px-3 py-2 font-medium text-kawai-charcoal hover:text-kawai-black hover:bg-kawai-pearl/80 transition-colors rounded-md font-[family-name:var(--font-brand-sans)] tracking-[0.05em] uppercase text-[12px]",
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
                    <Link
                      href="/warranty-registration"
                      className="rounded-md bg-kawai-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-kawai-charcoal"
                    >
                      Register Your Piano
                    </Link>
                  )}
                </div>
              </div>
            </nav>
          </div>
          </div>
          </div>
          </motion.div>
        </div>
      )}

      {/* Mobile Menu — portaled to document.body so it always sits above the portaled search bar */}
      {isMounted && createPortal(
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
                className="fixed right-0 top-0 bottom-0 z-[9501] w-[min(90vw,28rem)] xl:hidden bg-white border-l border-kawai-neutral/50 shadow-2xl flex flex-col h-screen"
                style={{ height: '100vh', minHeight: '100vh' }}
                variants={mobileMenuVariants}
                initial="closed"
                animate="open"
                exit="closed"
              >
                <div className="sticky top-0 bg-white border-b border-kawai-neutral/50 p-4 z-10 flex-shrink-0">
                  <div className="flex items-center justify-end">
                    <button
                      onClick={closeMobileMenu}
                      className="p-2 rounded-md hover:bg-kawai-pearl transition-colors"
                      aria-label="Close menu"
                    >
                      <X className="h-6 w-6 text-kawai-black" />
                    </button>
                  </div>
                </div>

                <nav className="flex-1 p-6 overflow-y-auto min-h-0">
                  <div className="space-y-4 pb-6 min-h-full flex flex-col justify-start">
                    {/* Home */}
                    <Link
                      href="/"
                      className="block py-4 px-6 text-kawai-charcoal hover:text-kawai-black hover:bg-kawai-pearl/50 font-medium text-xl transition-colors rounded-lg"
                      onClick={closeMobileMenu}
                    >
                      Home
                    </Link>

                    {/* Products */}
                    {isProductsMenuEnabled && (
                      <Link
                        href="/pianos"
                        className="block py-4 px-6 text-kawai-charcoal hover:text-kawai-black hover:bg-kawai-pearl/50 font-medium text-xl transition-colors rounded-lg"
                        onClick={closeMobileMenu}
                      >
                        Products
                      </Link>
                    )}

                    {/* Quick Links from CMS — directly under Home */}
                    {quickLinks.length > 0 && (
                      <div className="border-t border-kawai-neutral/60 pt-2">
                        <p className="px-6 pb-2 text-xs font-semibold uppercase tracking-widest text-kawai-charcoal/50">
                          Quick Links
                        </p>
                        {quickLinks.map((link) => (
                          <ContextAwareLink
                            key={link.url}
                            href={link.url}
                            className="block py-3 px-6 text-kawai-charcoal hover:text-kawai-red hover:bg-kawai-pearl/50 font-medium text-base transition-colors rounded-lg"
                            onClick={closeMobileMenu}
                          >
                            {link.label}
                          </ContextAwareLink>
                        ))}
                      </div>
                    )}

                    {/* Nav items (Artists, etc.) */}
                    {navigation.length > 0 && (
                      <div className="border-t border-kawai-neutral/60 pt-2">
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
                    )}
                  </div>
                </nav>

                {/* Bottom CTAs */}
                <div className="mt-auto border-t border-kawai-neutral/50 bg-white px-5 py-5 flex-shrink-0 space-y-3">
                  {registerConfig?.enabled !== false && (
                    <Link
                      href="/warranty-registration"
                      onClick={closeMobileMenu}
                      className="block w-full rounded-lg bg-kawai-black px-5 py-3.5 text-sm font-semibold text-white text-center transition-colors hover:bg-kawai-charcoal active:scale-[0.98]"
                    >
                      Register Your Piano
                    </Link>
                  )}
                  {!currentLocationData && (
                    <ContextAwareLink
                      href="/find-a-dealer"
                      className="block w-full rounded-lg bg-kawai-red px-5 py-3.5 text-sm font-semibold text-white text-center transition-colors hover:bg-kawai-red-700 active:scale-[0.98]"
                      onClick={closeMobileMenu}
                    >
                      Find a Dealer
                    </ContextAwareLink>
                  )}
                  {currentLocationData?.hasMusicSchool && (
                    <div className="border-t border-kawai-neutral/40 pt-3 space-y-1">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-kawai-charcoal/50 px-1 pb-1">
                        Kawai Music School
                      </p>
                      <Link
                        href={`/store/${currentLocationData.slug}/music-school`}
                        onClick={closeMobileMenu}
                        className="block w-full rounded-lg px-4 py-2.5 text-sm text-kawai-charcoal hover:bg-kawai-pearl hover:text-kawai-red transition-colors text-left"
                      >
                        Overview
                      </Link>
                      <Link
                        href={`/store/${currentLocationData.slug}/music-school/programs`}
                        onClick={closeMobileMenu}
                        className="block w-full rounded-lg px-4 py-2.5 text-sm text-kawai-charcoal hover:bg-kawai-pearl hover:text-kawai-red transition-colors text-left"
                      >
                        Programs
                      </Link>
                      <Link
                        href={`/store/${currentLocationData.slug}/music-school/faculty`}
                        onClick={closeMobileMenu}
                        className="block w-full rounded-lg px-4 py-2.5 text-sm text-kawai-charcoal hover:bg-kawai-pearl hover:text-kawai-red transition-colors text-left"
                      >
                        Faculty
                      </Link>
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Products Mega Menu - Rendered at root level for proper positioning, controlled by feature flag */}
      {isProductsMenuEnabled && (
        <div
          onMouseEnter={productsNavData && animationComplete ? handleProductsMenuOpen : undefined}
          onMouseLeave={productsNavData && animationComplete ? handleProductsMenuClose : undefined}
        >
          <ProductsMegaMenu
            productTypes={productsNavData?.types || []}
            collections={productsNavData?.collections || []}
            {...(productsNavData?.allCollections !== undefined && { allCollections: productsNavData.allCollections })}
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
          latestPosts={latestPosts}
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