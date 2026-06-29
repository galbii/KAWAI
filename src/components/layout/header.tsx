'use client'

import Link from 'next/link'
import { createPortal } from 'react-dom'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef, useCallback } from 'react'
import { Menu, X, ChevronDown, ChevronRight, Home, MapPin, Newspaper, Layers, Store } from 'lucide-react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { KawaiLogo } from '@/components/ui/kawai-logo'
import { CartIcon } from '@/components/cart/CartIcon'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { ProductsMegaMenu } from '@/components/navigation/ProductsMegaMenu'
import { ResourcesMegaMenu } from '@/components/navigation/ResourcesMegaMenu'
import type { ResourceLink, StoreLocationNavItem } from '@/components/layout/header-dynamic'
import { RegisterPianoModal } from '@/components/navigation/RegisterPianoModal'
import { NewsMegaMenu } from '@/components/navigation/NewsMegaMenu'
import { RecentsDropdown } from '@/components/navigation/RecentsDropdown'
import { SearchBar } from '@/components/search/SearchBar'
import { cn } from '@/lib/utils'
import { useNavigationContext } from '@/contexts/NavigationContext'
import { usePageHistory } from '@/contexts/PageHistoryContext'
import { formatHistoryTitle, formatHistoryTime } from '@/lib/page-history-storage'
import { getContextAwareUrl } from '@/lib/navigation-utils'
import { fetchPayloadProductsNavigation } from '@/lib/actions/payload-products-navigation'
import type { ProductsNavigation } from '@/lib/payload/products-navigation'
import { MobileProductsSheet } from '@/components/navigation/mobile/MobileProductsSheet'
import { MobileResourcesSheet } from '@/components/navigation/mobile/MobileResourcesSheet'
import { MobileNewsSheet } from '@/components/navigation/mobile/MobileNewsSheet'
import { MobileShigeruSheet } from '@/components/navigation/mobile/MobileShigeruSheet'

// ── Social icons ─────────────────────────────────────────────────────────────

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  )
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.27 8.27 0 004.84 1.55V6.79a4.85 4.85 0 01-1.07-.1z" />
    </svg>
  )
}

function XSocialIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.738l7.73-8.835L1.254 2.25H8.08l4.261 5.636 5.903-5.636zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

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

  const calculatePosition = useCallback(() => {
    if (!buttonRef.current) return
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
      positioning.left = -Math.max(0, dropdownWidth - spaceOnRight)
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

    const effectiveMaxHeight = positioning.maxHeight === 'none'
      ? maxDropdownHeight
      : parseInt(positioning.maxHeight)
    const maxItemsPerColumn = Math.floor(effectiveMaxHeight / 40)
    const totalItems = item.dropdown?.length || 0
    const optimalColumns = Math.min(4, Math.ceil(totalItems / Math.max(maxItemsPerColumn, 1)))

    setColumnConfig({
      columns: Math.max(1, optimalColumns),
      maxItemsPerColumn: Math.max(5, maxItemsPerColumn)
    })
    setDropdownPosition(positioning)
  }, [item.dropdown])

  const handleMouseEnter = useCallback(() => {
    onOpen(item.label)
    calculatePosition()
  }, [item.label, onOpen, calculatePosition])

  const handleMouseLeave = useCallback(() => {
    onClose()
  }, [onClose])

  useEffect(() => {
    const handleResize = () => {
      if (isOpen) calculatePosition()
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isOpen, calculatePosition])

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
  backgroundVideo?: any
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
  isFindADealerPage?: boolean
  hideLogo?: boolean
  newsItems?: NewsItem[]
  latestPosts?: LatestPost[]
  registerConfig?: RegisterConfig
  quickLinks?: QuickLink[]
  resourceLinks?: ResourceLink[]
  storeLocations?: StoreLocationNavItem[]
  /** 'cad' hides storefronts/showrooms from the resources mega menu — CA has no physical Kawai showrooms */
  site?: 'us' | 'cad'
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

// Position-based scroll thresholds with hysteresis — see comment above the
// useMotionValueEvent handler for the full state machine.
const COMPACT_ENTER_Y = 60
const COMPACT_EXIT_Y = 20
const HIDE_ENTER_Y = 200
const HIDE_EXIT_Y = 80

export function Header({ navigation = defaultNavigation, locationData, isSignaturePage = false, hidePianoLinks = false, isFindADealerPage = false, newsItems = [], latestPosts = [], registerConfig, quickLinks = [], resourceLinks, storeLocations, site = 'us', autoMinimize = true }: HeaderProps) {
  const pathname = usePathname()
  const isOnFindADealerPage = isFindADealerPage || pathname.startsWith('/find-a-dealer')
  const [isMounted, setIsMounted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [openMobileItems, setOpenMobileItems] = useState<Set<string>>(new Set())
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [productsNavData, setProductsNavData] = useState<ProductsNavigation | null>(null)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
  const [currentLocationData, setCurrentLocationData] = useState<DealerLocationData | null>(locationData || null)
const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isAutoHidden, setIsAutoHidden] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const autoHideTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastScrollEventAt = useRef(0)
  const isScrolledRef = useRef(false)
  const isAutoHiddenRef = useRef(false)
  const isBottomNavHoveredRef = useRef(false)
  const menuOpenedAtY = useRef<number | null>(null)

  // Derive Shigeru collection thumbnail — same source as desktop BannerOnlyView
  const shigeruCol = (productsNavData?.allCollections ?? productsNavData?.collections ?? [])
    .find((c) => c.pianoCategories?.includes('shigeru-kawai') || c.handle === 'shigeru-kawai')
  const shigeruYtId = shigeruCol?.youtubeUrl?.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/)?.[1] ?? null
  const shigeruImageUrl = shigeruYtId
    ? `https://img.youtube.com/vi/${shigeruYtId}/maxresdefault.jpg`
    : shigeruCol?.imageUrl ?? shigeruCol?.mediaUrl ?? null

  // Derived menu open states for readability
  const isProductsMenuOpen = activeMenu === 'products'
  const isResourcesMenuOpen = activeMenu === 'resources'
  const isNewsMenuOpen = activeMenu === 'news'
  const isShowroomMenuOpen = activeMenu === 'showroom'

  // Page history — independent of activeMenu so it doesn't conflict with mega menus
  const { history: recentHistory, isInitialized: isHistoryInitialized } = usePageHistory()
  const [isRecentsOpen, setIsRecentsOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const recentsTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const activeDropdown = activeMenu
  const [activeMobileSheet, setActiveMobileSheet] = useState<'products' | 'resources' | 'news' | 'shigeru' | null>(null)

  // Feature flag: Control Products menu visibility
  // Only show Products menu if feature flag is enabled (NEXT_PUBLIC_SHOW_PRODUCTS_MENU=true)
  const isProductsMenuEnabled = process.env.NEXT_PUBLIC_SHOW_PRODUCTS_MENU === 'true'

  // Fetch products navigation data on mount
  useEffect(() => {
    const loadProductsNav = async () => {
      try {
        const navData = await fetchPayloadProductsNavigation()
        setProductsNavData(navData)
      } catch (error) {
        console.error('[Header] Failed to load products navigation:', error)
      }
    }
    loadProductsNav()
  }, [])

  // REMOVED: CSS variable updates were causing scroll jank
  // Mega menus now position themselves directly without needing this

  // Expose --header-bottom so sticky elements (e.g. artist grid header) can track
  // exactly where the header ends. When nav is hidden, only the 6px red line shows.
  useEffect(() => {
    const updateHeaderBottom = () => {
      const isMobile = window.innerWidth < 1280
      const navHeight = isMobile ? 6 : (isAutoHidden ? 6 : (isScrolled ? 48 : 56))
      const totalPx = 64 + navHeight
      document.documentElement.style.setProperty(
        '--header-bottom',
        `calc(${totalPx}px + var(--announcement-bar-height, 0px) + var(--admin-bar-height, 0px))`
      )
    }
    updateHeaderBottom()
    window.addEventListener('resize', updateHeaderBottom)
    return () => window.removeEventListener('resize', updateHeaderBottom)
  }, [isScrolled, isAutoHidden])

  useEffect(() => {
    setIsMounted(true)
    setIsDesktop(window.innerWidth >= 1280)
    const handleResize = () => setIsDesktop(window.innerWidth >= 1280)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // When autoMinimize is disabled, always show the bottom nav.
  useEffect(() => {
    if (!autoMinimize) {
      isAutoHiddenRef.current = false
      setIsAutoHidden(false)
    }
  }, [autoMinimize])

  // Initialize scroll state based on initial scroll position.
  // Important: if the page mounts already scrolled (back-nav, refresh on a deep page),
  // we want the header to start in the correct state — not at "top" defaults.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const initialY = window.scrollY
    const initialScrolled = initialY > COMPACT_ENTER_Y
    isScrolledRef.current = initialScrolled
    setIsScrolled(initialScrolled)
    if (autoMinimize) {
      const initialHidden = initialY > HIDE_ENTER_Y
      isAutoHiddenRef.current = initialHidden
      setIsAutoHidden(initialHidden)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  // Location data is server-driven: show banner only on /store/* pages.
  // locationData is non-null when HeaderDynamic detects a /store/* pathname.
  useEffect(() => {
    if (isMounted) {
      setCurrentLocationData(locationData ?? null)
    }
  }, [locationData, isMounted])
  
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
        setActiveMenu(null)
      }
    }

    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('keydown', handleEscape)
      if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current)
    }
  }, [isMenuOpen])
  
  // ============================================================================
  // Scroll Detection Logic — position-based with hysteresis
  // ============================================================================
  // No direction tracking. Two booleans are derived from scrollY with two-value
  // thresholds (hysteresis) so rubber-band oscillation around a single value can
  // never flip the state. The gap between enter and exit absorbs trackpad jitter.
  //
  //   isScrolled  → compact nav (h-12 vs h-14) + mega menu top offset
  //                 enters at 60px, exits at 20px
  //   isAutoHidden → bottom nav collapses to a 6px red line
  //                 enters at 200px, exits at 80px
  //
  // Open mega menus close only if the user scrolls > 250px from where they opened
  // the menu (tracked in menuOpenedAtY). This replaces the old single-frame
  // movement threshold that was easily tripped by one fling of the trackpad.
  // ============================================================================

  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (latest) => {
    lastScrollEventAt.current = Date.now()

    // Compact state — symmetric hysteresis around the page-near-top region.
    if (!isScrolledRef.current && latest > COMPACT_ENTER_Y) {
      isScrolledRef.current = true
      setIsScrolled(true)
    } else if (isScrolledRef.current && latest < COMPACT_EXIT_Y) {
      isScrolledRef.current = false
      setIsScrolled(false)
    }

    // Auto-hidden state — gated by autoMinimize, menu-open, and active hover.
    if (autoMinimize && !isMenuOpen && !isBottomNavHoveredRef.current) {
      if (!isAutoHiddenRef.current && latest > HIDE_ENTER_Y) {
        isAutoHiddenRef.current = true
        setIsAutoHidden(true)
      } else if (isAutoHiddenRef.current && latest < HIDE_EXIT_Y) {
        isAutoHiddenRef.current = false
        setIsAutoHidden(false)
      }
    }

    // Close any open mega menu if the user has scrolled meaningfully away.
    if (
      activeMenu &&
      menuOpenedAtY.current !== null &&
      Math.abs(latest - menuOpenedAtY.current) > 250
    ) {
      setActiveMenu(null)
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

  // Generic menu open helper. Tracks the scrollY at open time so the scroll
  // handler can close the menu only if the user scrolls meaningfully away.
  const openMenu = useCallback((key: string) => {
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current)
      menuTimeoutRef.current = null
    }
    if (autoHideTimeoutRef.current) {
      clearTimeout(autoHideTimeoutRef.current)
      autoHideTimeoutRef.current = null
    }
    menuOpenedAtY.current = scrollY.get()
    setIsAutoHidden(false)
    setActiveMenu(key)
  }, [scrollY])

  const closeMenu = useCallback(() => {
    menuTimeoutRef.current = setTimeout(() => {
      menuOpenedAtY.current = null
      setActiveMenu(null)
    }, 500)
  }, [])

  // If the mouse passes over a menu trigger within 200ms of a scroll event,
  // skip opening — prevents accidental menu opens while the user is scrolling.
  const isRecentlyScrolling = useCallback(
    () => Date.now() - lastScrollEventAt.current < 200,
    []
  )

  // Desktop dropdown handlers (for generic nav items with dropdowns)
  const handleDropdownOpen = useCallback((itemLabel: string) => {
    openMenu(itemLabel)
  }, [openMenu])

  const handleDropdownClose = useCallback(() => {
    closeMenu()
  }, [closeMenu])

  // Products menu handlers
  const handleProductsMenuOpen = useCallback(() => {
    if (!isMounted || isRecentlyScrolling()) return
    openMenu('products')
  }, [isMounted, isRecentlyScrolling, openMenu])

  const handleProductsMenuClose = useCallback(() => {
    closeMenu()
  }, [closeMenu])

  // Resources menu handlers
  const handleResourcesMenuOpen = useCallback(() => {
    if (!isMounted || isRecentlyScrolling()) return
    openMenu('resources')
  }, [isMounted, isRecentlyScrolling, openMenu])

  const handleResourcesMenuClose = useCallback(() => {
    closeMenu()
  }, [closeMenu])

  // News menu handlers
  const handleNewsMenuOpen = useCallback(() => {
    if (!isMounted || isRecentlyScrolling()) return
    openMenu('news')
  }, [isMounted, isRecentlyScrolling, openMenu])

  const handleNewsMenuClose = useCallback(() => {
    closeMenu()
  }, [closeMenu])

  // Recents popup — independent of activeMenu; triggered by hovering the whole header
  const openRecents = useCallback(() => {
    if (!isMounted || !isHistoryInitialized || recentHistory.length === 0 || !isDesktop) return
    if (recentsTimeoutRef.current) clearTimeout(recentsTimeoutRef.current)
    setIsRecentsOpen(true)
  }, [isMounted, isHistoryInitialized, recentHistory.length, isDesktop])

  const closeRecents = useCallback(() => {
    recentsTimeoutRef.current = setTimeout(() => setIsRecentsOpen(false), 700)
  }, [])

  const handleShowroomMenuOpen = useCallback(() => {
    if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current)
    setActiveMenu('showroom')
  }, [])

  const handleShowroomMenuClose = useCallback(() => {
    menuTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null)
    }, 400)
  }, [])


  // Bottom nav hover reveal handlers. `isBottomNavHoveredRef` gates the scroll
  // handler so a scroll-down event while the user is hovering doesn't yank the
  // nav out from under their cursor.
  const handleBottomNavMouseEnter = useCallback(() => {
    if (autoHideTimeoutRef.current) {
      clearTimeout(autoHideTimeoutRef.current)
      autoHideTimeoutRef.current = null
    }
    isBottomNavHoveredRef.current = true
    if (isAutoHiddenRef.current) {
      isAutoHiddenRef.current = false
      setIsAutoHidden(false)
    }
  }, [])

  const handleBottomNavMouseLeave = useCallback(() => {
    isBottomNavHoveredRef.current = false
    // Re-hide only if the user is scrolled past the hide threshold — otherwise
    // leave the nav visible at the top of the page.
    if (autoMinimize && scrollY.get() > HIDE_ENTER_Y) {
      autoHideTimeoutRef.current = setTimeout(() => {
        isAutoHiddenRef.current = true
        setIsAutoHidden(true)
      }, 400)
    }
  }, [autoMinimize, scrollY])

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
      className="fixed left-0 right-0 z-50 w-full bg-white shadow-sm cursor-pointer"
      style={{
        top: 'calc(var(--admin-bar-height, 0px) + var(--announcement-bar-height, 0px))'
      }}
      onClick={handleHeaderClick}
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
            {!isSignaturePage && !hidePianoLinks && (
              <div className="hidden md:flex items-center flex-1 max-w-2xl mx-8 gap-3">
                {/* Home Icon */}
                <ContextAwareLink
                  href="/"
                  className="flex-shrink-0 p-2 text-kawai-charcoal hover:text-kawai-black hover:bg-kawai-pearl transition-colors rounded-md"
                  aria-label="Kawai — Home"
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
              {!isSignaturePage && !currentLocationData && (
                <motion.div
                  className="hidden xl:flex items-center"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <ContextAwareLink
                    href="/find-a-dealer"
                    className="flex items-center gap-2 rounded-full bg-kawai-red border border-white/20 px-5 py-2.5 text-[11px] tracking-[0.08em] uppercase font-semibold text-white hover:brightness-95 hover:border-white/35 shadow-[0_2px_12px_rgba(225,25,34,0.3)] transition-all duration-200 font-[family-name:var(--font-brand-sans)]"
                  >
                    <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                    Find a Dealer
                  </ContextAwareLink>
                </motion.div>
              )}

              {/* Visit Showroom CTA - Desktop (dealer location pages, not on music school pages) */}
              {currentLocationData && currentLocationData.slug && !isSignaturePage && !isMusicSchoolPage && (
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
              {currentLocationData?.hasMusicSchool && !isSignaturePage && !isMusicSchoolPage && (
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
                            onClick={() => setActiveMenu(null)}
                          >
                            Overview
                          </ContextAwareLink>
                          <ContextAwareLink
                            href={`/store/${currentLocationData.slug}/music-school/programs`}
                            className="block px-4 py-2.5 text-sm text-kawai-charcoal hover:bg-kawai-pearl hover:text-kawai-red transition-colors"
                            onClick={() => setActiveMenu(null)}
                          >
                            Programs
                          </ContextAwareLink>
                          <ContextAwareLink
                            href={`/store/${currentLocationData.slug}/music-school/faculty`}
                            className="block px-4 py-2.5 pb-3 text-sm text-kawai-charcoal hover:bg-kawai-pearl hover:text-kawai-red transition-colors"
                            onClick={() => setActiveMenu(null)}
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
              {!isSignaturePage && (
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
              {!isSignaturePage && (
                <div className="xl:hidden flex items-center">
                  <CartIcon onOpen={() => setIsCartOpen(true)} />
                </div>
              )}

              {/* Mobile Menu Button */}
              {!isSignaturePage && !hidePianoLinks && (
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
      {!isSignaturePage && !hidePianoLinks && (
        <div className="xl:hidden w-full h-[6px] bg-[#A01829]" />
      )}

      {/* Bottom Row - Main Navigation (Full Width) - Auto-hides, reveals on hover */}
      {!isSignaturePage && !hidePianoLinks && !isSearchOpen && (
        <div
          className="hidden xl:block w-full"
          onMouseEnter={handleBottomNavMouseEnter}
          onMouseLeave={handleBottomNavMouseLeave}
        >
          {/* Red separator line — visible when nav is hidden. Uses the same CSS
              transition (duration + easing) as the nav max-height below so the
              two layers never desync mid-animation. */}
          <div
            className="w-full bg-[#A01829] cursor-pointer"
            style={{
              height: isAutoHidden ? '6px' : '0px',
              transition: 'height 0.25s cubic-bezier(0.4,0,0.2,1)',
            }}
          />

          {/* Nav — animates in/out using max-height (layout-safe, compositor-friendly) */}
          <div
            style={{
              overflow: 'hidden',
              maxHeight: isAutoHidden ? '0px' : '56px',
              opacity: isAutoHidden ? 0 : 1,
              transition: 'max-height 0.25s cubic-bezier(0.4,0,0.2,1), opacity 0.2s cubic-bezier(0.4,0,0.2,1)',
            }}
          >
          <div className="w-full bg-white relative z-20">
          <div className="w-full bg-white border-b-[6px] border-[#A01829]">
          <div className="container mx-auto px-4 sm:px-6">
            <nav>
              <div className={cn(
                "flex items-center transition-[height] duration-300",
                isScrolled ? 'h-12' : 'h-14'
              )}>
                {/* Left spacer — mirrors the Register button on the right */}
                {/* Left spacer */}
                <div className="flex-1" />

                {/* Centered nav items */}
                <div className="flex items-center gap-8">
                  {/* News Mega Menu */}
                  <div
                    onMouseEnter={isMounted ? handleNewsMenuOpen : undefined}
                    onMouseLeave={isMounted ? handleNewsMenuClose : undefined}
                  >
                    <button
                      className={cn(
                        "px-3 py-2 font-medium text-kawai-charcoal transition-all duration-200 rounded-md font-[family-name:var(--font-brand-sans)] tracking-[0.05em] uppercase text-[12px]",
                        "hover:text-kawai-red/75 hover:bg-kawai-red/[0.06]",
                        isNewsMenuOpen ? "text-kawai-red/80 bg-kawai-red/[0.07]" : "",
                        isMounted ? "cursor-pointer" : "cursor-default opacity-50"
                      )}
                      disabled={!isMounted}
                    >
                      News
                    </button>
                  </div>

                  {/* Products Mega Menu - Controlled by feature flag */}
                  {isProductsMenuEnabled && (
                    <div
                      onMouseEnter={productsNavData && isMounted ? handleProductsMenuOpen : undefined}
                      onMouseLeave={productsNavData && isMounted ? handleProductsMenuClose : undefined}
                    >
                      <Link
                        href="/pianos"
                        onClick={() => setActiveMenu(null)}
                        className={cn(
                          "block px-3 py-2 font-medium text-kawai-charcoal transition-all duration-200 rounded-md font-[family-name:var(--font-brand-sans)] tracking-[0.05em] uppercase text-[12px]",
                          "hover:text-kawai-red/75 hover:bg-kawai-red/[0.06]",
                          isProductsMenuOpen && "text-kawai-red/80 bg-kawai-red/[0.07]"
                        )}
                      >
                        Products
                      </Link>
                    </div>
                  )}

                  {/* Support Link */}
                  <ContextAwareLink
                    href="/technical-support-division"
                    className="px-3 py-2 font-medium text-kawai-charcoal hover:text-kawai-red/75 hover:bg-kawai-red/[0.06] transition-all duration-200 rounded-md font-[family-name:var(--font-brand-sans)] tracking-[0.05em] uppercase text-[12px]"
                  >
                    Support
                  </ContextAwareLink>

                  {/* Resources Mega Menu */}
                  <div
                    onMouseEnter={isMounted ? handleResourcesMenuOpen : undefined}
                    onMouseLeave={isMounted ? handleResourcesMenuClose : undefined}
                  >
                    <button
                      className={cn(
                        "px-3 py-2 font-medium text-kawai-charcoal transition-all duration-200 rounded-md font-[family-name:var(--font-brand-sans)] tracking-[0.05em] uppercase text-[12px]",
                        "hover:text-kawai-red/75 hover:bg-kawai-red/[0.06]",
                        isResourcesMenuOpen ? "text-kawai-red/80 bg-kawai-red/[0.07]" : "",
                        isMounted ? "cursor-pointer" : "cursor-default opacity-50"
                      )}
                      disabled={!isMounted}
                    >
                      Resources
                    </button>
                  </div>

                  {/* Artists Link — placed just before Shigeru Kawai */}
                  <ContextAwareLink
                    href="/artists"
                    className="px-3 py-2 font-medium text-kawai-charcoal hover:text-kawai-red/75 hover:bg-kawai-red/[0.06] transition-all duration-200 rounded-md font-[family-name:var(--font-brand-sans)] tracking-[0.05em] uppercase text-[12px]"
                  >
                    Artists
                  </ContextAwareLink>

                  {/* Shigeru Kawai — image link, no dropdown */}
                  <Link
                    href="/shigeru"
                    className="flex items-center px-2 py-1 rounded-md hover:bg-kawai-gold/[0.06] transition-all duration-200"
                    aria-label="Shigeru Kawai"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://pub-0cc9ed269d544fd29fe51221f6744a6b.r2.dev/media/Shigeru-Kawai-scaled-2966385513.webp"
                      alt="Shigeru Kawai"
                      className="h-8 w-auto object-contain"
                    />
                  </Link>

                </div>

                {/* Right column — History toggle + Register button */}
                <div className="flex-1 flex items-center justify-end gap-3">
                  {registerConfig?.enabled !== false && (
                    <Link
                      href="/warranty-registration"
                      className="rounded-full bg-kawai-black border border-white/20 px-5 py-2 text-sm font-medium text-white hover:bg-kawai-charcoal hover:border-white/30 shadow-[0_2px_12px_rgba(0,0,0,0.25)] transition-all duration-200"
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
          </div>
        </div>
      )}

      {/* Mobile Menu — portaled to document.body so it always sits above the portaled search bar */}
      {isMounted && createPortal(
        <AnimatePresence>
          {isMenuOpen && !isSignaturePage && !hidePianoLinks && (
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

                    {/* Social links — top of mobile nav */}
                    <div className="pb-2 border-b border-kawai-neutral/60">
                      <p className="mb-3 px-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-kawai-charcoal/40">
                        Follow Kawai
                      </p>
                      <div className="flex items-center gap-3 px-1">
                        <a
                          href="https://www.instagram.com/kawaipianosus/"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Instagram"
                          className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
                          style={{ background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)' }}
                        >
                          <InstagramIcon className="w-5 h-5 text-white" />
                        </a>
                        <a
                          href="https://www.facebook.com/KawaiPianosUS/"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Facebook"
                          className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
                        >
                          <FacebookIcon className="w-5 h-5 text-white" />
                        </a>
                        <a
                          href="https://www.tiktok.com/@kawaipianosus"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="TikTok"
                          className="w-10 h-10 rounded-full bg-[#010101] flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
                        >
                          <TikTokIcon className="w-[18px] h-[18px] text-white" />
                        </a>
                        <a
                          href="https://x.com/KawaiPianosUS"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="X / Twitter"
                          className="w-10 h-10 rounded-full bg-black flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
                        >
                          <XSocialIcon className="w-4 h-4 text-white" />
                        </a>
                      </div>
                    </div>

                    {/* Home */}
                    <Link
                      href="/"
                      className="block py-4 px-6 text-kawai-charcoal hover:text-kawai-black hover:bg-kawai-pearl/50 font-medium text-xl transition-colors rounded-lg"
                      onClick={closeMobileMenu}
                    >
                      Home
                    </Link>

                    {/* Feature nav: Products / News / Resources as sheet launchers */}
                    <div className="border-t border-kawai-neutral/60 pt-2">
                      <p className="px-6 pb-2 text-xs font-semibold uppercase tracking-widest text-kawai-charcoal/50">
                        Explore
                      </p>

                      {isProductsMenuEnabled && (
                        <button
                          onClick={() => setActiveMobileSheet('products')}
                          className="flex items-center justify-between w-full py-4 px-6 text-kawai-charcoal hover:text-kawai-black hover:bg-kawai-pearl/50 font-medium text-base transition-colors rounded-lg group"
                        >
                          <span className="flex items-center gap-3">
                            <Layers className="w-5 h-5 text-kawai-charcoal/50 group-hover:text-kawai-red transition-colors" />
                            Browse Pianos
                          </span>
                          <ChevronRight className="w-4 h-4 text-kawai-charcoal/30 group-hover:text-kawai-red group-hover:translate-x-0.5 transition-all" />
                        </button>
                      )}

                      <button
                        onClick={() => setActiveMobileSheet('news')}
                        className="flex items-center justify-between w-full py-4 px-6 text-kawai-charcoal hover:text-kawai-black hover:bg-kawai-pearl/50 font-medium text-base transition-colors rounded-lg group"
                      >
                        <span className="flex items-center gap-3">
                          <Newspaper className="w-5 h-5 text-kawai-charcoal/50 group-hover:text-kawai-red transition-colors" />
                          News & Stories
                        </span>
                        <ChevronRight className="w-4 h-4 text-kawai-charcoal/30 group-hover:text-kawai-red group-hover:translate-x-0.5 transition-all" />
                      </button>

                      <button
                        onClick={() => setActiveMobileSheet('resources')}
                        className="flex items-center justify-between w-full py-4 px-6 text-kawai-charcoal hover:text-kawai-black hover:bg-kawai-pearl/50 font-medium text-base transition-colors rounded-lg group"
                      >
                        <span className="flex items-center gap-3">
                          <Store className="w-5 h-5 text-kawai-charcoal/50 group-hover:text-kawai-red transition-colors" />
                          Official Stores & Resources
                        </span>
                        <ChevronRight className="w-4 h-4 text-kawai-charcoal/30 group-hover:text-kawai-red group-hover:translate-x-0.5 transition-all" />
                      </button>

                      <button
                        onClick={() => setActiveMobileSheet('shigeru')}
                        className="relative w-full overflow-hidden rounded-xl group mx-6"
                        style={{ width: 'calc(100% - 48px)', height: '90px' }}
                        aria-label="Explore Shigeru Kawai"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="https://pub-0cc9ed269d544fd29fe51221f6744a6b.r2.dev/media/Shigeru-Kawai-scaled-2966385513.webp"
                          alt="Shigeru Kawai"
                          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                          style={{ background: '#ffffff' }}
                        />
                      </button>
                    </div>

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

                    {/* Recently Visited — below quick links, only when history exists */}
                    {isHistoryInitialized && recentHistory.length > 0 && (
                      <div className="border-t border-kawai-neutral/60 pt-2">
                        <p className="px-6 pb-2 text-xs font-semibold uppercase tracking-widest text-kawai-charcoal/50">
                          Recents
                        </p>
                        {recentHistory.map((entry) => (
                          <Link
                            key={`${entry.path}-${entry.visitedAt}`}
                            href={entry.path}
                            onClick={closeMobileMenu}
                            className="group flex items-center justify-between py-3 px-6 border-l-[3px] border-transparent hover:border-kawai-red hover:bg-kawai-pearl/50 transition-[border-color,background-color] duration-150 rounded-r-lg"
                          >
                            <div className="flex flex-col min-w-0 flex-1">
                              <span className="text-kawai-charcoal group-hover:text-kawai-black font-medium text-base truncate transition-colors">
                                {formatHistoryTitle(entry.title, entry.path)}
                              </span>
                              <span className="text-kawai-neutral/60 text-xs mt-0.5 truncate">
                                {entry.path}
                              </span>
                            </div>
                            <span className="text-kawai-neutral/50 text-xs ml-3 shrink-0">
                              {formatHistoryTime(entry.visitedAt)}
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Nav items (Artists, etc.) — skip items handled by sheets above */}
                    {navigation.filter((item) => !['News', 'Resources'].includes(item.label)).length > 0 && (
                      <div className="border-t border-kawai-neutral/60 pt-2">
                        {navigation
                          .filter((item) => !['News', 'Resources'].includes(item.label))
                          .map((item) => (
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
                      className="block w-full rounded-full bg-kawai-black border border-white/20 px-5 py-3.5 text-sm font-semibold text-white text-center hover:bg-kawai-charcoal hover:border-white/40 hover:brightness-150 shadow-[0_2px_12px_rgba(0,0,0,0.25)] transition-all duration-200 active:scale-[0.97]"
                    >
                      Register Your Piano
                    </Link>
                  )}
                  {!currentLocationData && (
                    <ContextAwareLink
                      href="/find-a-dealer"
                      className="block w-full rounded-full bg-kawai-red border border-white/20 px-5 py-3.5 text-sm font-semibold text-white text-center hover:border-white/50 hover:shadow-[0_0_24px_rgba(225,25,34,0.55),0_4px_16px_rgba(225,25,34,0.35)] hover:brightness-110 shadow-[0_2px_12px_rgba(225,25,34,0.3)] transition-all duration-200 active:scale-[0.97]"
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
          onMouseEnter={productsNavData && isMounted ? handleProductsMenuOpen : undefined}
          onMouseLeave={productsNavData && isMounted ? handleProductsMenuClose : undefined}
        >
          <ProductsMegaMenu
            productTypes={productsNavData?.types || []}
            collections={productsNavData?.collections || []}
            {...(productsNavData?.allCollections !== undefined && { allCollections: productsNavData.allCollections })}
            accessories={productsNavData?.accessories || []}
            isOpen={isProductsMenuOpen && isMounted && !isSearchOpen}
            onClose={() => setActiveMenu(null)}
            isLoading={!productsNavData}
            isHeaderScrolled={isScrolled}
          />
        </div>
      )}

      {/* Resources Mega Menu - Rendered at root level for proper positioning */}
      <div
        onMouseEnter={isMounted ? handleResourcesMenuOpen : undefined}
        onMouseLeave={isMounted ? handleResourcesMenuClose : undefined}
      >
        <ResourcesMegaMenu
          isOpen={isResourcesMenuOpen && isMounted && !isSearchOpen}
          onClose={() => setActiveMenu(null)}
          onRegisterClick={() => setIsRegisterModalOpen(true)}
          registerEnabled={registerConfig?.enabled !== false}
          bannerImageUrl={registerConfig?.bannerImageUrl ?? null}
          bannerTitle={registerConfig?.bannerTitle ?? null}
          bannerDescription={registerConfig?.bannerDescription ?? null}
          {...(resourceLinks !== undefined && { resourceLinks })}
          storeLocations={storeLocations}
          site={site}
          isHeaderScrolled={isScrolled}
        />
      </div>

      {/* News Mega Menu - Rendered at root level for proper positioning */}
      <div
        onMouseEnter={isMounted ? handleNewsMenuOpen : undefined}
        onMouseLeave={isMounted ? handleNewsMenuClose : undefined}
      >
        <NewsMegaMenu
          isOpen={isNewsMenuOpen && isMounted && !isSearchOpen}
          onClose={() => setActiveMenu(null)}
          isHeaderScrolled={isScrolled}
          newsItems={newsItems}
          latestPosts={latestPosts}
        />
      </div>

      {/* Recents Popup — right edge, desktop only, triggered by hovering the header */}
      {isMounted && isHistoryInitialized && isDesktop && (
        <RecentsDropdown
          isOpen={isRecentsOpen && !isSearchOpen}
          onClose={() => setIsRecentsOpen(false)}
          history={recentHistory}
          onPanelMouseEnter={openRecents}
          onPanelMouseLeave={closeRecents}
          onTabMouseEnter={openRecents}
        />
      )}

    </header>

    {/* Cart Drawer - rendered outside <header> so its z-[9500] is in the root stacking context,
        above the floating add-to-cart button's z-[9000] which is also in root stacking context.
        (Inside <header z-50>, child z-indexes are capped at that stacking context level.) */}
    <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

    {/* Mobile sheets — rendered outside <header> to escape stacking context */}
    {isMounted && (
      <>
        <MobileProductsSheet
          isOpen={activeMobileSheet === 'products'}
          onBack={() => setActiveMobileSheet(null)}
          onNavigate={() => { setActiveMobileSheet(null); closeMobileMenu() }}
          productsNavData={productsNavData}
          isLoading={!productsNavData}
        />
        <MobileNewsSheet
          isOpen={activeMobileSheet === 'news'}
          onBack={() => setActiveMobileSheet(null)}
          onNavigate={() => { setActiveMobileSheet(null); closeMobileMenu() }}
          newsItems={newsItems}
          latestPosts={latestPosts}
        />
        <MobileResourcesSheet
          isOpen={activeMobileSheet === 'resources'}
          onBack={() => setActiveMobileSheet(null)}
          onNavigate={() => { setActiveMobileSheet(null); closeMobileMenu() }}
          storeLocations={storeLocations}
          site={site}
          {...(resourceLinks !== undefined && { resourceLinks })}
          registerEnabled={registerConfig?.enabled !== false}
        />
        <MobileShigeruSheet
          isOpen={activeMobileSheet === 'shigeru'}
          onBack={() => setActiveMobileSheet(null)}
          onNavigate={() => { setActiveMobileSheet(null); closeMobileMenu() }}
          imageUrl={shigeruImageUrl}
        />
      </>
    )}

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