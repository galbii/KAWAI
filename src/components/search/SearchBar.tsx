'use client'

import { useState, useEffect, useRef, useCallback, useMemo, Fragment } from 'react'
import { createPortal } from 'react-dom'
import { hidesMobileSearch } from '@/lib/search/mobile-search-visibility'
import { Search, X, Loader2 } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { KawaiLogo } from '@/components/ui/kawai-logo'
import { usePageHistory } from '@/contexts/PageHistoryContext'
import { formatHistoryTitle, formatHistoryTime } from '@/lib/page-history-storage'

// Module-level constants — avoids new object/Set on every component render
const PIANO_CATEGORY_PRIORITY: Record<string, number> = {
  grand: 1, upright: 2, digital: 3, hybrid: 4,
}
const ACCESSORY_CATEGORY_TYPES = new Set(['accessory', 'accessories', 'software'])

// Infer relationTo from the doc field, falling back to denormalized fields when
// the polymorphic relationship isn't populated (depth:0 or missing doc field).
function getRelationTo(result: { doc?: { relationTo?: string }; storefrontSlug?: string; productSlug?: string; collectionHandle?: string; pageSlug?: string }): string {
  if (result.doc?.relationTo) return result.doc.relationTo
  if (result.storefrontSlug) return 'storefronts'
  if (result.productSlug) return 'products'
  if (result.collectionHandle) return 'collections'
  if (result.pageSlug) return 'pages'
  return ''
}

interface SearchResult {
  id: string
  title: string
  doc: {
    value: {
      slug: string
      imageUrl?: string
      category?: string
      model?: string
      name?: string
      type?: string
    }
    relationTo: 'products' | 'pages' | 'storefronts' | 'collections'
  }
  excerpt?: string
  category?: string
  tags?: string[]
  // Denormalized product fields (stored directly in search doc)
  productModel?: string
  productImageUrl?: string
  productType?: string // piano, accessory, software
  productCategory?: string // digital, grand, upright, hybrid (pianos only)
  productSlug?: string
  // Denormalized page fields (stored directly in search doc)
  pageSlug?: string
  // Denormalized storefront fields (stored directly in search doc)
  storefrontSlug?: string
  storefrontLocationName?: string
  storefrontLocationText?: string
  storefrontEstablishedText?: string
  storefrontAddress?: string
  storefrontPhone?: string
  storefrontCity?: string
  storefrontRegion?: string
  // Denormalized collection fields (stored directly in search doc)
  collectionHandle?: string
  collectionTitle?: string
}

interface SearchBarProps {
  className?: string
  onOpenChange?: (isOpen: boolean) => void
}

interface QuickLink {
  label: string
  url: string
}

type CategoryFilter = 'all' | 'storefronts' | 'products' | 'collections' | 'pages'

export function SearchBar({ className, onOpenChange }: SearchBarProps) {
  const pathname = usePathname()
  // Route list and matching rules live in lib/search so they can be tested
  // without mounting this component. See mobile-search-visibility.ts.
  const hideMobileSearch = hidesMobileSearch(pathname)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all')
  const [selectedProductCategory, setSelectedProductCategory] = useState<string>('')
  const [isMounted, setIsMounted] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const [isInputFocused, setIsInputFocused] = useState(false)
  const [announcementBarHeight, setAnnouncementBarHeight] = useState(0)
  const [adminBarHeight, setAdminBarHeight] = useState(0)
  const [visualViewportHeight, setVisualViewportHeight] = useState(0)
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>([
    { label: 'Instrumental to Life', url: '/instrumental-to-life' },
    { label: 'Find a Dealer', url: '/find-a-dealer' },
    { label: 'Register My Piano', url: '/register-my-piano' },
    { label: 'Kawai Exclusive Offers', url: '/explore' },
  ])

  const { history: recentHistory, isInitialized: isHistoryInitialized } = usePageHistory()

  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const mobileInputRef = useRef<HTMLInputElement>(null)
  const resultsContainerRef = useRef<HTMLDivElement>(null)
  const measuringKeyboardRef = useRef(false)
  const abortControllerRef = useRef<AbortController | null>(null)
  const router = useRouter()

  // Measure keyboard height - returns true if keyboard detected
  const measureKeyboardHeight = useCallback(() => {
    if (typeof window === 'undefined' || !window.visualViewport || !isMobile) return false

    const visualViewport = window.visualViewport
    const layoutHeight = window.innerHeight
    const visualHeight = visualViewport.height
    const newHeight = layoutHeight - visualHeight

    if (newHeight > 150) {
      setKeyboardHeight(newHeight)
      return true // Keyboard detected
    }

    return false // No keyboard yet
  }, [isMobile])

  // Start polling for keyboard with requestAnimationFrame
  const startKeyboardDetection = useCallback(() => {
    if (measuringKeyboardRef.current) return // Already polling

    measuringKeyboardRef.current = true

    const poll = () => {
      if (!measuringKeyboardRef.current) return

      const detected = measureKeyboardHeight()

      if (!detected) {
        // Keep polling until keyboard detected (checks every frame)
        requestAnimationFrame(poll)
      } else {
        // Stop polling once keyboard is found
        measuringKeyboardRef.current = false
      }
    }

    // Start polling immediately
    requestAnimationFrame(poll)
  }, [measureKeyboardHeight])

  // Track mounted state for portal and detect mobile
  useEffect(() => {
    setIsMounted(true)

    // Detect mobile device and initialize visual viewport height
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth < 768
      setIsMobile(isMobileDevice)

      // Initialize visual viewport height on mobile
      if (isMobileDevice && window.visualViewport) {
        setVisualViewportHeight(window.visualViewport.height)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => {
      setIsMounted(false)
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  // Read announcement bar and admin bar heights from CSS variables
  useEffect(() => {
    const updateBarHeights = () => {
      const style = getComputedStyle(document.documentElement)
      setAnnouncementBarHeight(parseInt(style.getPropertyValue('--announcement-bar-height')) || 0)
      setAdminBarHeight(parseInt(style.getPropertyValue('--admin-bar-height')) || 0)
    }

    updateBarHeights()

    const observer = new MutationObserver(updateBarHeights)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style'],
    })

    return () => observer.disconnect()
  }, [])

  // Fetch quick links from HomePage collection
  useEffect(() => {
    const fetchQuickLinks = async () => {
      try {
        const response = await fetch('/api/search-quick-links')
        const result = await response.json()

        if (result.success && result.data) {
          setQuickLinks(result.data)
        }
      } catch (error) {
        console.error('Failed to fetch quick links:', error)
        // Keep using default links on error
      }
    }

    fetchQuickLinks()
  }, [])

  // Detect keyboard on mobile using visualViewport API
  // This handles keyboard closing and provides backup detection
  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return

    const visualViewport = window.visualViewport

    const handleViewportResize = () => {
      if (!isMobile || !visualViewport) return

      // Calculate keyboard height (difference between layout and visual viewport)
      const layoutHeight = window.innerHeight
      const visualHeight = visualViewport.height
      const newKeyboardHeight = layoutHeight - visualHeight

      // Update visual viewport height for results container sizing
      setVisualViewportHeight(visualHeight)

      // Update keyboard height (set to 0 when keyboard closes)
      setKeyboardHeight(newKeyboardHeight > 150 ? newKeyboardHeight : 0)

      // Stop any active polling when resize event provides measurement
      if (newKeyboardHeight > 150 || newKeyboardHeight < 150) {
        measuringKeyboardRef.current = false
      }
    }

    // Initial measurement
    handleViewportResize()

    // Listen to visualViewport resize (fires when keyboard opens/closes)
    visualViewport.addEventListener('resize', handleViewportResize)
    visualViewport.addEventListener('scroll', handleViewportResize)

    return () => {
      visualViewport.removeEventListener('resize', handleViewportResize)
      visualViewport.removeEventListener('scroll', handleViewportResize)
    }
  }, [isMobile])

  // Global keyboard shortcut: Press "L" to focus search
  useEffect(() => {
    const handleGlobalKeyPress = (event: KeyboardEvent) => {
      // Check if user is not already typing in an input/textarea
      const target = event.target as HTMLElement
      const isTyping = ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable

      // Press "L" to focus search (only when not typing elsewhere)
      if (event.key === 'l' && !isTyping && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault()
        inputRef.current?.focus()
        inputRef.current?.select()
      }
    }

    document.addEventListener('keydown', handleGlobalKeyPress)
    return () => document.removeEventListener('keydown', handleGlobalKeyPress)
  }, [])

  const getResultUrl = (result: SearchResult): string => {
    const collectionSlug = getRelationTo(result)

    if (collectionSlug === 'storefronts') {
      // Use denormalized storefrontSlug for reliable navigation
      const slug = result.storefrontSlug || (typeof result.doc.value === 'object' ? result.doc.value.slug : '')
      return `/store/${slug}`
    }

    if (collectionSlug === 'products') {
      // Use denormalized productSlug for reliable navigation
      const slug = result.productSlug || (typeof result.doc.value === 'object' ? result.doc.value.slug : '')
      return `/products/${slug}`
    }

    if (collectionSlug === 'collections') {
      // Collection pages live at /pianos/{handle}
      const handle = result.collectionHandle || (typeof result.doc.value === 'object' ? result.doc.value.slug : '')
      return `/pianos/${handle}`
    }

    if (collectionSlug === 'pages') {
      // Use denormalized pageSlug for reliable navigation (with fallback to relationship)
      const slug = result.pageSlug || (typeof result.doc.value === 'object' ? result.doc.value.slug : result.doc.value)
      return `/${slug}`
    }

    // Fallback
    const slug = typeof result.doc.value === 'object' ? result.doc.value.slug : result.doc.value
    return `/${slug}`
  }

  // Get visual indicator (simple mapping)
  const getResultIcon = (relationTo: string, category?: string): string => {
    if (relationTo === 'storefronts') return '🏢'
    if (relationTo === 'products') {
      // Simple icon mapping based on category name
      const iconMap: Record<string, string> = {
        digital: '🎹',
        grand: '🎼',
        hybrid: '🎛️',
        upright: '🎵',
        accessory: '🔧',
        software: '💿',
      }
      return iconMap[category?.toLowerCase() || ''] || '🎹'
    }
    if (relationTo === 'pages') return '📄'
    return '📋'
  }

  // Get readable collection label
  const getCollectionLabel = (relationTo: string): string => {
    if (relationTo === 'storefronts') return 'Storefront'
    if (relationTo === 'products') return 'Product'
    if (relationTo === 'pages') return 'Page'
    return 'Result'
  }

  // Filter results by category - memoized to prevent recalculation on every render
  const filteredResults = useMemo(() => {
    return results.filter(result => {
      if (categoryFilter === 'all') return true
      return getRelationTo(result) === categoryFilter
    })
  }, [results, categoryFilter])

  // Separate storefronts, products, and pages - memoized
  const storefrontResults = useMemo(() =>
    filteredResults.filter(r => getRelationTo(r) === 'storefronts'),
    [filteredResults]
  )

  const productResults = useMemo(() =>
    filteredResults.filter(r => getRelationTo(r) === 'products'),
    [filteredResults]
  )

  const pageResults = useMemo(() =>
    filteredResults.filter(r => getRelationTo(r) === 'pages'),
    [filteredResults]
  )

  const collectionResults = useMemo(() =>
    filteredResults.filter(r => getRelationTo(r) === 'collections'),
    [filteredResults]
  )

  const getProductSortPriority = useCallback((result: SearchResult): number => {
    // Check productType first, then fall back to the general category field so
    // accessories that have a null productType (e.g. not yet re-synced) still
    // sort after pianos.
    const typeNorm = (result.productType || result.category || 'other').toLowerCase()
    if (ACCESSORY_CATEGORY_TYPES.has(typeNorm)) return 99
    const catNorm = (result.productType || result.productCategory || 'other').toLowerCase()
    return PIANO_CATEGORY_PRIORITY[catNorm] ?? 50
  }, [])

  // Group products by type. All accessory variants ('accessory', 'accessories',
  // 'software') collapse into a single 'Accessories' bucket so they share one tab.
  const productsByCategory = useMemo(() => {
    const grouped = productResults.reduce((acc, result) => {
      const typeNorm = (result.productType || result.category || '').toLowerCase()
      const key = ACCESSORY_CATEGORY_TYPES.has(typeNorm)
        ? 'Accessories'
        : result.productType || result.productCategory || 'Other'
      if (!acc[key]) acc[key] = []
      acc[key].push(result)
      return acc
    }, {} as Record<string, SearchResult[]>)
    return grouped
  }, [productResults])

  // Get available categories sorted: pianos first, Accessories last.
  // Prepend an 'all' tab whenever more than one category exists.
  const availableCategories = useMemo(() => {
    const cats = Object.keys(productsByCategory).sort((a, b) => {
      const aLow = a.toLowerCase()
      const bLow = b.toLowerCase()
      const aIsAccessory = aLow === 'accessories' || ACCESSORY_CATEGORY_TYPES.has(aLow)
      const bIsAccessory = bLow === 'accessories' || ACCESSORY_CATEGORY_TYPES.has(bLow)
      const aPriority = PIANO_CATEGORY_PRIORITY[aLow] ?? (aIsAccessory ? 99 : 50)
      const bPriority = PIANO_CATEGORY_PRIORITY[bLow] ?? (bIsAccessory ? 99 : 50)
      return aPriority - bPriority
    })
    return cats.length > 1 ? ['all', ...cats] : cats
  }, [productsByCategory])

  // Auto-generate label from category name (capitalize words)
  const getCategoryLabel = (category: string): string => {
    if (category === 'all') return 'All'
    return category
      .split(/[-_\s]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  // Auto-select 'all' (or first category) when results change
  useEffect(() => {
    if (availableCategories.length === 0) {
      setSelectedProductCategory('')
      return
    }
    setSelectedProductCategory((current) => {
      if (current && availableCategories.includes(current)) return current
      return availableCategories.includes('all') ? 'all' : (availableCategories[0] ?? '')
    })
    setSelectedIndex(0)
  }, [availableCategories])

  // Reset selection when category or filter changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [selectedProductCategory, categoryFilter])

  // Get products for the selected tab.
  // 'all' shows every product sorted by category priority (pianos before accessories).
  const displayedProducts = useMemo(() => {
    if (selectedProductCategory === 'all' || !selectedProductCategory) {
      return productResults.slice().sort((a, b) => getProductSortPriority(a) - getProductSortPriority(b))
    }
    return productsByCategory[selectedProductCategory] ?? []
  }, [selectedProductCategory, productsByCategory, productResults, getProductSortPriority])

  // Debounced search — AbortController cancels in-flight fetches when query changes,
  // preventing stale responses from overwriting fresher results and corrupting category state.
  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    const timeoutId = setTimeout(async () => {
      // Cancel any previous in-flight request
      abortControllerRef.current?.abort()
      const controller = new AbortController()
      abortControllerRef.current = controller

      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        })
        if (!response.ok) throw new Error('Search failed')

        const data = await response.json()
        setResults(data.results || [])
        setSelectedIndex(0)
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return
        console.error('Search error:', error)
        setResults([])
      } finally {
        if (!controller.signal.aborted) setIsLoading(false)
      }
    }, 300)

    return () => {
      clearTimeout(timeoutId)
      abortControllerRef.current?.abort()
    }
  }, [query])

  // Track if mouse is over the overlay to prevent closing on scroll
  const [isMouseOverOverlay, setIsMouseOverOverlay] = useState(false)

  // Close search when user scrolls (but not when hovering over results)
  // Disabled on mobile to prevent keyboard open/close from triggering unwanted closes
  useEffect(() => {
    if (!isOpen || isMobile) return

    const handleScroll = () => {
      // Don't close if user is hovering over the search results
      if (isMouseOverOverlay) return

      setIsOpen(false)
      setQuery('')
      setResults([])
      inputRef.current?.blur()
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isOpen, isMouseOverOverlay, isMobile])

  // Notify parent when search open state changes
  useEffect(() => {
    onOpenChange?.(isOpen && query.length >= 2)
  }, [isOpen, query, onOpenChange])

  // Prevent body scroll when mobile search is open
  useEffect(() => {
    if (!isMobile || !isOpen) return

    // Store original overflow style
    const originalOverflow = document.body.style.overflow
    const originalPosition = document.body.style.position

    // Lock scroll
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.width = '100%'

    return () => {
      // Restore original styles
      document.body.style.overflow = originalOverflow
      document.body.style.position = originalPosition
      document.body.style.width = ''
    }
  }, [isMobile, isOpen])

  // Clear search
  const clearSearch = useCallback(() => {
    setQuery('')
    setResults([])
    setIsOpen(false)
    setIsMobileSearchOpen(false)
    setIsInputFocused(false)
    setSelectedIndex(0)
    setCategoryFilter('all')
    setSelectedProductCategory('')
    inputRef.current?.blur()
    mobileInputRef.current?.blur()
    onOpenChange?.(false)
    measuringKeyboardRef.current = false
  }, [onOpenChange])

  // Navigate to result
  const navigateToResult = useCallback((result: SearchResult) => {
    const url = getResultUrl(result)
    router.push(url)
    clearSearch()
  }, [router, clearSearch])

  const openMobileSearch = useCallback(() => {
    setIsMobileSearchOpen(true)
    setIsOpen(true)
    onOpenChange?.(true)
    // Focus input after modal opens
    setTimeout(() => {
      mobileInputRef.current?.focus()
    }, 100)
  }, [onOpenChange])

  // Click outside handler - Disabled on mobile to prevent interference with keyboard/touch events
  useEffect(() => {
    if (isMobile) return

    const handleClickOutside = (event: MouseEvent) => {
      if (
        overlayRef.current &&
        !overlayRef.current.contains(event.target as Node) &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }

    return undefined
  }, [isOpen, isMobile])

  // Keyboard navigation handler (consolidated into single function for overlay onKeyDown)
  const handleKeyboardNavigation = useCallback((event: React.KeyboardEvent) => {
    // Check if user is actively typing in the search input
    const isTypingInInput = document.activeElement === inputRef.current

    // If typing in input, only handle Escape
    if (isTypingInInput) {
      if (event.key === 'Escape') {
        event.preventDefault()
        setIsOpen(false)
        inputRef.current?.blur()
      }
      return
    }

    // Combine all displayed sections for navigation
    const allDisplayedResults = [...storefrontResults, ...collectionResults, ...displayedProducts, ...pageResults]
    if (allDisplayedResults.length === 0) return

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % allDisplayedResults.length)
        break
      case 'ArrowUp':
        event.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + allDisplayedResults.length) % allDisplayedResults.length)
        break
      case 'Tab': {
        event.preventDefault()
        // Section offsets: storefronts → collections → products → pages
        const collOffset = storefrontResults.length
        const prodOffset = collOffset + collectionResults.length
        const pageOffset = prodOffset + displayedProducts.length
        if (event.shiftKey) {
          if (selectedIndex >= pageOffset) {
            setSelectedIndex(displayedProducts.length > 0 ? prodOffset : collOffset > 0 ? collOffset : 0)
          } else if (selectedIndex >= prodOffset) {
            setSelectedIndex(collectionResults.length > 0 ? collOffset : 0)
          } else if (selectedIndex >= collOffset) {
            setSelectedIndex(0)
          } else {
            setSelectedIndex(pageResults.length > 0 ? pageOffset : displayedProducts.length > 0 ? prodOffset - 1 : collectionResults.length > 0 ? collOffset - 1 : 0)
          }
        } else {
          if (selectedIndex < storefrontResults.length) {
            setSelectedIndex(collectionResults.length > 0 ? collOffset : displayedProducts.length > 0 ? prodOffset : pageOffset)
          } else if (selectedIndex < prodOffset) {
            setSelectedIndex(displayedProducts.length > 0 ? prodOffset : pageResults.length > 0 ? pageOffset : 0)
          } else if (selectedIndex < pageOffset) {
            setSelectedIndex(pageResults.length > 0 ? pageOffset : 0)
          } else {
            setSelectedIndex(0)
          }
        }
        break
      }
      case 'Home':
        event.preventDefault()
        setSelectedIndex(0)
        break
      case 'End':
        event.preventDefault()
        setSelectedIndex(allDisplayedResults.length - 1)
        break
      case '1':
        event.preventDefault()
        setCategoryFilter('all')
        setSelectedIndex(0)
        break
      case '2':
        event.preventDefault()
        setCategoryFilter('storefronts')
        setSelectedIndex(0)
        break
      case '3':
        event.preventDefault()
        setCategoryFilter('products')
        setSelectedIndex(0)
        break
      case '4':
        event.preventDefault()
        setCategoryFilter('collections')
        setSelectedIndex(0)
        break
      case '5':
        event.preventDefault()
        setCategoryFilter('pages')
        setSelectedIndex(0)
        break
      case 'Enter':
        event.preventDefault()
        if (allDisplayedResults[selectedIndex]) {
          navigateToResult(allDisplayedResults[selectedIndex])
        }
        break
      case 'Escape':
        event.preventDefault()
        setIsOpen(false)
        inputRef.current?.blur()
        break
    }
  }, [storefrontResults, collectionResults, displayedProducts, pageResults, selectedIndex, navigateToResult])

  // Scroll selected item into view
  useEffect(() => {
    const selectedElement = document.getElementById(`search-result-${selectedIndex}`)
    if (selectedElement) {
      selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }, [selectedIndex])

  // Reset scroll position when modal opens or query changes
  useEffect(() => {
    if (isOpen && resultsContainerRef.current) {
      resultsContainerRef.current.scrollTop = 0
    }
  }, [isOpen, query])


  // ── Animation variants ──────────────────────────────────────────────────
  const backdropVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.18, ease: 'easeOut' as const } },
    exit: { opacity: 0, transition: { duration: 0.14, ease: 'easeIn' as const } },
  }

  const overlayVariants = {
    hidden: { opacity: 0, y: -10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.4, 0, 0.2, 1] as const } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.16, ease: [0.4, 0, 0.2, 1] as const } },
  }

  const sectionContainerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
  }

  const sectionVariants = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const } },
  }

  const quickLinksContainerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.055, delayChildren: 0.12 } },
  }

  const quickLinkItemVariants = {
    hidden: { opacity: 0, x: -5 },
    show: { opacity: 1, x: 0, transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const } },
  }
  // ────────────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Desktop Input Field (stays in header) - Hidden on mobile */}
      <div ref={containerRef} className={cn('relative z-[9002] hidden md:block', className)}>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-kawai-muted" />
          </div>
          <input
            ref={inputRef}
            type="text"
            aria-label="Search showrooms, pianos, and products"
            placeholder="Search showrooms, pianos, products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              setIsFocused(true)
              setIsOpen(true) // Always open on focus, show welcome screen if empty
            }}
            onBlur={() => setIsFocused(false)}
            onKeyDown={(e) => {
              // Allow all typing keys (including space) and only handle Escape
              if (e.key === 'Escape') {
                e.preventDefault()
                setIsOpen(false)
                inputRef.current?.blur()
              }
              // Stop propagation so document handler doesn't interfere with typing
              if (e.key === ' ' || e.key === 'Spacebar') {
                e.stopPropagation()
              }
            }}
            className={cn(
              'w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-10',
              'text-sm text-gray-900 placeholder-gray-500',
              'focus:border-kawai-red focus:outline-none focus:ring-2 focus:ring-kawai-red',
              'transition-colors duration-200'
            )}
          />
          {/* Keyboard Hint - Show when not focused and empty (large screens only) */}
          {query.length === 0 && !isFocused && (
            <div className="pointer-events-none absolute inset-y-0 right-12 hidden lg:flex items-center">
              <div className="flex items-center gap-1.5 text-xs text-kawai-muted">
                <span>Press</span>
                <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-gray-600 font-mono text-xs">
                  L
                </kbd>
              </div>
            </div>
          )}
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            ) : query.length > 0 ? (
              <button
                onClick={clearSearch}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Clear search"
              >
                <X className="h-5 w-5" />
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Glassmorphism Results Overlay */}
      {isMounted && createPortal(
        <Fragment>
          <AnimatePresence>
            {(isOpen || (isMobile && isInputFocused)) && (
              <motion.div
                key="search-backdrop"
                variants={backdropVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                className="fixed z-[9000] bg-black/40"
                style={{
                  top: isMobile ? 0 : `${64 + announcementBarHeight + adminBarHeight}px`,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  // Disable pointer events while the exit animation plays so the fading
                  // backdrop doesn't intercept clicks on page content underneath it.
                  pointerEvents: (isOpen || (isMobile && isInputFocused)) ? 'auto' : 'none',
                }}
                onClick={() => {
                  setIsOpen(false)
                  setIsMobileSearchOpen(false)
                }}
              />
            )}
          </AnimatePresence>
          <AnimatePresence>
            {(isOpen || (isMobile && isInputFocused)) && (
              <motion.div
                key="search-overlay"
                variants={overlayVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                className={cn(
                  "fixed z-[9004] pointer-events-none",
                  isMobile
                    ? "px-4 pb-4" // Padding around the glass card
                    : "flex items-center justify-center p-4 md:p-8" // Centered on desktop
                )}
                style={
                  isMobile
                    ? {
                        // Anchor to bottom, just above the floating search input (~88px tall)
                        bottom: keyboardHeight > 0
                          ? `${keyboardHeight + 88}px`
                          : 'calc(88px + env(safe-area-inset-bottom))',
                        left: 0,
                        right: 0,
                        // Cap height so it never fills more than ~65% of screen
                        maxHeight: keyboardHeight > 0 && visualViewportHeight > 0
                          ? `${visualViewportHeight - keyboardHeight - 104}px`
                          : 'calc(65vh - env(safe-area-inset-bottom))',
                        // overflow: hidden enforces maxHeight so content clips instead of overflowing
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                      }
                    : { top: `${64 + announcementBarHeight + adminBarHeight}px`, left: 0, right: 0, bottom: 0 }
                }
                onKeyDown={handleKeyboardNavigation}
              >
                <div
                  ref={overlayRef}
                  className={cn(
                    "pointer-events-auto",
                    isMobile
                      ? "w-full flex flex-col h-full min-h-0" // h-full fills the constrained outer container
                      : "w-full max-w-7xl" // Centered card on desktop
                  )}
                  style={isMobile ? undefined : { height: '85vh', maxHeight: '900px' }}
                  onClick={(e) => e.stopPropagation()}
                  onMouseEnter={() => setIsMouseOverOverlay(true)}
                  onMouseLeave={() => setIsMouseOverOverlay(false)}
                >
                  {/* Search Results Container */}
                  <div className={cn(
                    "rounded-xl overflow-hidden shadow-2xl border border-kawai-neutral/20 flex flex-col",
                    isMobile ? "border-0 rounded-none shadow-none h-full min-h-0" : "bg-kawai-black/60 backdrop-blur-2xl"
                  )}
                  style={isMobile ? undefined : { height: '100%' }}>
                  {/* Glass Container - Floating glassmorphic design */}
                  <div className={cn(
                    "flex flex-col overflow-hidden",
                    isMobile
                      ? "h-full min-h-0 rounded-3xl shadow-2xl backdrop-blur-3xl bg-kawai-black/40 border border-kawai-neutral/20"
                      : "h-full rounded-2xl shadow-2xl border border-kawai-neutral/20 backdrop-blur-3xl bg-kawai-black/30"
                  )}>

                    {/* Header - Desktop only */}
                    {!isMobile && (
                      <div className="flex-shrink-0 px-6 py-3 border-b border-kawai-neutral/30 bg-kawai-black/40 backdrop-blur-xl">
                        <div className="flex items-center justify-between">
                          <h2 className="text-lg font-semibold text-kawai-pearl">
                            Search Results
                          </h2>
                          <button
                            onClick={clearSearch}
                            className="text-kawai-neutral hover:text-kawai-pearl transition-colors"
                            aria-label="Close search"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Mobile Filter Chips - Horizontal Scroll */}
                    {isMobile && query.length >= 2 && (
                      <div className="flex-shrink-0 border-b border-gray-200/50">
                        <div className="overflow-x-auto scrollbar-hide px-4 py-3">
                          <div className="flex gap-2 min-w-min">
                            {(['all', 'storefronts', 'products', 'collections', 'pages'] as CategoryFilter[]).map((category) => (
                              <button
                                key={category}
                                onClick={() => setCategoryFilter(category)}
                                className={cn(
                                  'relative flex-shrink-0 px-4 py-2.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap overflow-hidden',
                                  categoryFilter === category
                                    ? 'text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                )}
                              >
                                {categoryFilter === category && (
                                  <motion.div
                                    layoutId="mobile-filter-active"
                                    className="absolute inset-0 bg-kawai-red rounded-full"
                                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                                  />
                                )}
                                <span className="relative z-10">{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Quick Links - Sticky at top on mobile, hidden on desktop */}
                    {isMobile && query.length < 2 && (
                      <div className="flex-shrink-0 border-b border-gray-200/50">
                        <motion.div
                          className="p-4 space-y-1"
                          variants={quickLinksContainerVariants}
                          initial="hidden"
                          animate="show"
                        >
                          {/* Quick Links Header */}
                          <div className="flex items-center gap-2 mb-4 px-2">
                            <div className="h-px flex-1 bg-kawai-neutral/20" />
                            <h3 className="text-xs font-medium text-kawai-neutral uppercase tracking-widest">
                              Quick Links
                            </h3>
                            <div className="h-px flex-1 bg-kawai-neutral/20" />
                          </div>
                          {quickLinks.map((link, index) => (
                            <motion.button
                              key={index}
                              variants={quickLinkItemVariants}
                              onClick={() => {
                                router.push(link.url)
                                clearSearch()
                              }}
                              className="group w-full px-6 py-4 text-left transition-all duration-200 hover:bg-kawai-red/5 border-l-2 border-transparent hover:border-kawai-red rounded-lg"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-kawai-pearl font-light text-lg tracking-wide group-hover:text-kawai-red transition-colors">
                                  {link.label}
                                </span>
                                <svg
                                  className="w-5 h-5 text-kawai-neutral group-hover:text-kawai-red transition-all group-hover:translate-x-1"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </motion.button>
                          ))}
                        </motion.div>
                      </div>
                    )}

                    {/* Recently Visited — mobile, shown below Quick Links */}
                    {isMobile && query.length < 2 && isHistoryInitialized && recentHistory.length > 0 && (
                      <div className="flex-shrink-0 border-b border-gray-200/50">
                        <div className="px-4 pt-4 pb-2">
                          <span
                            className="block px-2 mb-3 text-kawai-neutral/50 font-[family-name:var(--font-brand-sans)] uppercase tracking-[0.45em] select-none"
                            style={{ fontSize: '8px' }}
                          >
                            Recents
                          </span>
                          {recentHistory.map((entry) => (
                            <button
                              key={`${entry.path}-${entry.visitedAt}`}
                              onClick={() => { router.push(entry.path); clearSearch() }}
                              className="group w-full flex items-center justify-between px-4 py-3.5 text-left border-l-2 border-transparent hover:border-kawai-red transition-[border-color] duration-200"
                            >
                              <div className="flex flex-col min-w-0 flex-1 mr-3">
                                <span className="text-kawai-pearl/80 font-[family-name:var(--font-brand-sans)] text-sm font-light group-hover:text-kawai-pearl transition-colors truncate">
                                  {formatHistoryTitle(entry.title, entry.path)}
                                </span>
                                <span className="text-kawai-neutral/40 text-[10px] mt-0.5 truncate">
                                  {entry.path}
                                </span>
                              </div>
                              <span className="text-kawai-neutral/40 font-[family-name:var(--font-brand-sans)] whitespace-nowrap shrink-0" style={{ fontSize: '10px' }}>
                                {formatHistoryTime(entry.visitedAt)}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Results */}
                    <div
                      ref={resultsContainerRef}
                      className={cn(
                        "flex-1 overflow-y-auto overscroll-contain min-h-0",
                        isMobile ? "p-4 pb-6" : "p-6",
                      )}
                      style={
                        isMobile
                          ? {
                              paddingTop: query.length >= 2 ? '0' : '1rem',
                              WebkitOverflowScrolling: 'touch',
                            }
                          : undefined
                      }
                    >
                      {/* Welcome Screen - desktop only */}
                      {query.length < 2 && !isMobile ? (
                        <div className="flex flex-col items-center justify-center h-full">

                          {/* Logo */}
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
                            className="mb-8"
                          >
                            <KawaiLogo size="sm" animated={false} nonClickable={true} />
                          </motion.div>

                          {/* Red separator — draws in from center */}
                          <motion.div
                            initial={{ scaleX: 0, opacity: 0 }}
                            animate={{ scaleX: 1, opacity: 1 }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.42 }}
                            className={isHistoryInitialized && recentHistory.length > 0 ? "h-px bg-kawai-red mb-4" : "h-px bg-kawai-red mb-9"}
                            style={{ width: '28px', transformOrigin: 'center' }}
                          />

                          {/* Recently Visited — desktop, shown above Quick Links */}
                          {isHistoryInitialized && recentHistory.length > 0 && (
                            <motion.div
                              className="w-full max-w-sm mb-5"
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
                            >
                              <span
                                className="block px-6 mb-3 text-kawai-pearl/30 font-[family-name:var(--font-brand-sans)] uppercase tracking-[0.45em] select-none"
                                style={{ fontSize: '8px' }}
                              >
                                Recents
                              </span>
                              <nav className="w-full">
                                {recentHistory.map((entry) => (
                                  <button
                                    key={`${entry.path}-${entry.visitedAt}`}
                                    onClick={() => { router.push(entry.path); clearSearch() }}
                                    className="group w-full flex items-center justify-between px-6 py-3 border-b border-kawai-neutral/10 last:border-0 border-l-2 border-l-transparent hover:border-l-kawai-red transition-[border-color] duration-200"
                                  >
                                    <span className="text-kawai-pearl/55 text-sm font-light truncate group-hover:text-kawai-pearl/90 transition-colors duration-200 text-left">
                                      {formatHistoryTitle(entry.title, entry.path)}
                                    </span>
                                    <span
                                      className="text-kawai-neutral/40 font-[family-name:var(--font-brand-sans)] whitespace-nowrap ml-4 shrink-0"
                                      style={{ fontSize: '10px' }}
                                    >
                                      {formatHistoryTime(entry.visitedAt)}
                                    </span>
                                  </button>
                                ))}
                              </nav>
                            </motion.div>
                          )}

                          {/* Navigation links */}
                          <motion.nav
                            className="w-full max-w-sm"
                            variants={quickLinksContainerVariants}
                            initial="hidden"
                            animate="show"
                            transition={{ staggerChildren: 0.06, delayChildren: 0.58 }}
                          >
                            {quickLinks.map((link, index) => (
                              <motion.button
                                key={index}
                                variants={quickLinkItemVariants}
                                onClick={() => {
                                  router.push(link.url)
                                  clearSearch()
                                }}
                                className="group w-full flex items-center justify-between px-6 py-3.5 border-b border-kawai-neutral/10 last:border-0 hover:bg-kawai-red/5 transition-colors duration-200"
                              >
                                <span className="text-kawai-pearl/50 text-sm font-light tracking-[0.1em] uppercase whitespace-nowrap group-hover:text-kawai-pearl/90 transition-colors duration-200">
                                  {link.label}
                                </span>
                                <svg
                                  className="w-3 h-3 text-kawai-red opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </motion.button>
                            ))}
                          </motion.nav>
                        </div>
                      ) : query.length >= 2 && isLoading && filteredResults.length === 0 ? (
                        // Loading state — keep this branch separate so the results motion.div
                        // only mounts when children are ready. If it mounted empty here, Framer
                        // Motion would complete the hidden→show stagger with no children, then
                        // newly-arriving children would be stuck at opacity:0 (v12 behavior).
                        null
                      ) : query.length >= 2 && filteredResults.length === 0 && !isLoading ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                          className="flex flex-col items-center justify-center h-full"
                        >
                          <div className="w-16 h-16 rounded-full bg-kawai-black/40 backdrop-blur-xl flex items-center justify-center mb-4 border border-kawai-neutral/40">
                            <Search className="w-8 h-8 text-kawai-red" />
                          </div>
                          <h3 className="text-lg font-semibold text-kawai-pearl mb-2">
                            No results found
                          </h3>
                          <p className="text-sm text-kawai-neutral text-center max-w-sm">
                            Try adjusting your search or browse our collections
                          </p>
                        </motion.div>
                      ) : (
                        <motion.div
                          className="space-y-6"
                          variants={sectionContainerVariants}
                          initial="hidden"
                          animate="show"
                        >
                          {/* Storefronts Section - Shown FIRST (highest priority) */}
                          {storefrontResults.length > 0 && (
                            <motion.div variants={sectionVariants}>
                              <div className="flex items-center gap-2 mb-3 px-2">
                                <div className="h-px flex-1 bg-kawai-neutral/20" />
                                <h3 className="text-xs font-medium text-kawai-neutral uppercase tracking-widest">
                                  Showrooms
                                </h3>
                                <div className="h-px flex-1 bg-kawai-neutral/20" />
                              </div>
                              <div className="space-y-1">
                                {storefrontResults.map((result, index) => {
                                  const slug = result.storefrontSlug || (typeof result.doc.value === 'object' ? result.doc.value.slug : '')
                                  const displaySlug = slug.toUpperCase()

                                  return (
                                    <button
                                      key={result.id}
                                      id={`search-result-${index}`}
                                      onClick={() => navigateToResult(result)}
                                      className={cn(
                                        "group w-full px-6 py-4 text-left transition-all duration-200 hover:bg-kawai-red/5 border-l-2 border-transparent hover:border-kawai-red",
                                        selectedIndex === index && "bg-kawai-red/10 border-kawai-red"
                                      )}
                                    >
                                      <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-4 flex-1 min-w-0">
                                          {/* KAWAI Logo */}
                                          <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center bg-white/10 rounded-lg border border-kawai-neutral/20 p-2">
                                            <KawaiLogo size="sm" animated={false} nonClickable={true} />
                                          </div>

                                          {/* Text Content */}
                                          <div className="flex-1 min-w-0">
                                            <span className="text-kawai-pearl font-medium text-base tracking-wider group-hover:text-kawai-red transition-colors">
                                              {displaySlug}
                                            </span>
                                            {result.storefrontCity && result.storefrontRegion && (
                                              <p className="text-xs text-kawai-neutral mt-0.5">
                                                {result.storefrontCity}, {result.storefrontRegion}
                                              </p>
                                            )}
                                          </div>
                                        </div>

                                        {/* Arrow Icon */}
                                        <svg
                                          className="w-5 h-5 flex-shrink-0 text-kawai-neutral group-hover:text-kawai-red transition-all group-hover:translate-x-1"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                        >
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                                        </svg>
                                      </div>
                                    </button>
                                  )
                                })}
                              </div>
                            </motion.div>
                          )}

                          {/* Collections Section */}
                          {collectionResults.length > 0 && (
                            <motion.div variants={sectionVariants}>
                              <div className="flex items-center gap-2 mb-3 px-2">
                                <div className="h-px flex-1 bg-kawai-neutral/20" />
                                <h3 className="text-xs font-medium text-kawai-neutral uppercase tracking-widest">
                                  Collections
                                </h3>
                                <div className="h-px flex-1 bg-kawai-neutral/20" />
                              </div>
                              <div className="space-y-1">
                                {collectionResults.map((result, colIndex) => {
                                  const index = storefrontResults.length + colIndex
                                  const title = result.collectionTitle || result.title
                                  return (
                                    <button
                                      key={result.id}
                                      id={`search-result-${index}`}
                                      onClick={() => navigateToResult(result)}
                                      className={cn(
                                        "group w-full px-6 py-4 text-left transition-all duration-200 hover:bg-kawai-red/5 border-l-2 border-transparent hover:border-kawai-red",
                                        selectedIndex === index && "bg-kawai-red/10 border-kawai-red"
                                      )}
                                    >
                                      <div className="flex items-center justify-between">
                                        <div className="flex-1 min-w-0">
                                          <span className="text-kawai-pearl font-light text-base tracking-wide group-hover:text-kawai-red transition-colors">
                                            {title}
                                          </span>
                                          {result.excerpt && (
                                            <p className="text-xs text-kawai-neutral mt-0.5 line-clamp-1">
                                              {result.excerpt}
                                            </p>
                                          )}
                                        </div>
                                        <svg
                                          className="w-5 h-5 ml-4 flex-shrink-0 text-kawai-neutral group-hover:text-kawai-red transition-all group-hover:translate-x-1"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                        >
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                                        </svg>
                                      </div>
                                    </button>
                                  )
                                })}
                              </div>
                            </motion.div>
                          )}

                          {/* Category Switcher */}
                          {productResults.length > 0 && (
                            <motion.div variants={sectionVariants}>
                              {/* Category Tabs */}
                              {availableCategories.length > 1 && (
                                <div className="flex items-center gap-2 mb-3 px-2">
                                  <div className="h-px flex-1 bg-kawai-neutral/20" />
                                  <div className={cn(
                                    "flex items-center gap-2",
                                    isMobile && "overflow-x-auto scrollbar-hide"
                                  )}>
                                    {availableCategories.map((categoryKey) => {
                                      const isSelected = selectedProductCategory === categoryKey

                                      return (
                                        <button
                                          key={categoryKey}
                                          onClick={() => setSelectedProductCategory(categoryKey)}
                                          className={cn(
                                            'relative pb-1 px-3 py-1 text-xs font-medium uppercase tracking-widest transition-colors whitespace-nowrap',
                                            isSelected
                                              ? 'text-kawai-red'
                                              : 'text-kawai-neutral hover:text-kawai-pearl'
                                          )}
                                        >
                                          {getCategoryLabel(categoryKey)}
                                          {isSelected && (
                                            <motion.div
                                              layoutId="product-category-underline"
                                              className="absolute bottom-0 left-3 right-3 h-px bg-kawai-red"
                                              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                                            />
                                          )}
                                        </button>
                                      )
                                    })}
                                  </div>
                                  <div className="h-px flex-1 bg-kawai-neutral/20" />
                                </div>
                              )}

                              {/* Products as line items */}
                              {availableCategories.length === 1 && (
                                <div className="flex items-center gap-2 mb-3 px-2">
                                  <div className="h-px flex-1 bg-kawai-neutral/20" />
                                  <h3 className="text-xs font-medium text-kawai-neutral uppercase tracking-widest">
                                    Products
                                  </h3>
                                  <div className="h-px flex-1 bg-kawai-neutral/20" />
                                </div>
                              )}

                              <div className="space-y-1">
                                {displayedProducts.map((result, productIndex) => {
                                  // Calculate global index (offset by storefronts + collections)
                                  const index = storefrontResults.length + collectionResults.length + productIndex

                                  const model = result.productModel || result.title
                                  const category = result.productCategory || result.category
                                  const categoryLabel = category ? getCategoryLabel(category) : null
                                  const imageUrl = result.productImageUrl

                                  return (
                                    <button
                                      key={result.id}
                                      id={`search-result-${index}`}
                                      onClick={() => navigateToResult(result)}
                                      className={cn(
                                        "group w-full px-6 py-4 text-left transition-all duration-200 hover:bg-kawai-red/5 border-l-2 border-transparent hover:border-kawai-red",
                                        selectedIndex === index && "bg-kawai-red/10 border-kawai-red"
                                      )}
                                    >
                                      <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-4 flex-1 min-w-0">
                                          {/* Product Image */}
                                          <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-white/5 border border-kawai-neutral/20">
                                            {imageUrl ? (
                                              <Image
                                                src={imageUrl}
                                                alt={model}
                                                width={64}
                                                height={64}
                                                className="w-full h-full object-cover"
                                              />
                                            ) : (
                                              <div className="w-full h-full flex items-center justify-center text-2xl">
                                                {getResultIcon('products', category)}
                                              </div>
                                            )}
                                          </div>

                                          {/* Text Content */}
                                          <div className="flex-1 min-w-0">
                                            <span className="text-kawai-pearl font-light text-base tracking-wide group-hover:text-kawai-red transition-colors">
                                              {model}
                                            </span>
                                            {categoryLabel && (
                                              <p className="text-xs text-kawai-neutral mt-0.5">
                                                {categoryLabel}
                                              </p>
                                            )}
                                          </div>
                                        </div>

                                        {/* Arrow Icon */}
                                        <svg
                                          className="w-5 h-5 flex-shrink-0 text-kawai-neutral group-hover:text-kawai-red transition-all group-hover:translate-x-1"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                        >
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                                        </svg>
                                      </div>
                                    </button>
                                  )
                                })}
                              </div>
                            </motion.div>
                          )}

                          {/* Pages Section */}
                          {pageResults.length > 0 && (
                            <motion.div variants={sectionVariants}>
                              <div className="flex items-center gap-2 mb-3 px-2">
                                <div className="h-px flex-1 bg-kawai-neutral/20" />
                                <h3 className="text-xs font-medium text-kawai-neutral uppercase tracking-widest">
                                  Pages
                                </h3>
                                <div className="h-px flex-1 bg-kawai-neutral/20" />
                              </div>
                              <div className="space-y-1">
                                {pageResults.map((result, pageIndex) => {
                                  // Calculate global index (offset by storefronts and displayed products)
                                  const resultIndex = storefrontResults.length + collectionResults.length + displayedProducts.length + pageIndex
                                  return (
                                    <button
                                      key={result.id}
                                      id={`search-result-${resultIndex}`}
                                      onClick={() => navigateToResult(result)}
                                      className={cn(
                                        "group w-full px-6 py-4 text-left transition-all duration-200 hover:bg-kawai-red/5 border-l-2 border-transparent hover:border-kawai-red",
                                        selectedIndex === resultIndex && "bg-kawai-red/10 border-kawai-red"
                                      )}
                                    >
                                      <div className="flex items-center justify-between">
                                        <div className="flex-1 min-w-0">
                                          <span className="text-kawai-pearl font-light text-base tracking-wide group-hover:text-kawai-red transition-colors">
                                            {result.title}
                                          </span>
                                          {result.excerpt && (
                                            <p className="text-xs text-kawai-neutral mt-0.5 line-clamp-1">
                                              {result.excerpt}
                                            </p>
                                          )}
                                        </div>
                                        <svg
                                          className="w-5 h-5 ml-4 flex-shrink-0 text-kawai-neutral group-hover:text-kawai-red transition-all group-hover:translate-x-1"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                        >
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                                        </svg>
                                      </div>
                                    </button>
                                  )
                                })}
                              </div>
                            </motion.div>
                          )}
                        </motion.div>
                      )}
                    </div>

                    {/* Filters at Bottom - Desktop only */}
                    {!isMobile && (
                      <div className="flex-shrink-0 px-6 py-4 border-t border-kawai-neutral/30 bg-kawai-black/40 backdrop-blur-xl">
                        <div className="flex items-center justify-between">
                          {/* Only show filters when there are search results */}
                          {query.length >= 2 && (
                            <div className="flex items-center gap-2">
                              {(['all', 'storefronts', 'products', 'collections', 'pages'] as CategoryFilter[]).map((category) => (
                                <button
                                  key={category}
                                  onClick={() => setCategoryFilter(category)}
                                  className={cn(
                                    'relative px-4 py-2 rounded-lg text-sm font-medium transition-colors backdrop-blur-xl overflow-hidden',
                                    categoryFilter === category
                                      ? 'text-white'
                                      : 'bg-kawai-black/60 text-kawai-pearl hover:bg-kawai-black/80 border border-kawai-neutral/40 hover:border-kawai-red/60'
                                  )}
                                >
                                  {categoryFilter === category && (
                                    <motion.div
                                      layoutId="desktop-filter-active"
                                      className="absolute inset-0 bg-kawai-red rounded-lg"
                                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                                    />
                                  )}
                                  <span className="relative z-10">{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Welcome message when empty */}
                          {query.length < 2 && (
                            <div className="text-sm text-kawai-neutral">
                              Start typing to search showrooms, pianos, and products
                            </div>
                          )}
                          <div className="flex items-center gap-4">
                            {/* Show result count only when searching */}
                            {query.length >= 2 && filteredResults.length > 0 && (
                              <span className="text-sm text-kawai-neutral">
                                {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''}
                              </span>
                            )}

                            {/* Show keyboard shortcuts only when there are results to navigate */}
                            {query.length >= 2 && filteredResults.length > 0 && (
                              <div className="flex items-center gap-3 text-xs text-kawai-neutral">
                                <div className="flex items-center gap-1">
                                  <kbd className="px-1.5 py-0.5 bg-kawai-black/60 border border-kawai-neutral/40 rounded text-kawai-pearl font-mono text-[10px]">
                                    ↑↓
                                  </kbd>
                                  <span>Navigate</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <kbd className="px-1.5 py-0.5 bg-kawai-black/60 border border-kawai-neutral/40 rounded text-kawai-pearl font-mono text-[10px]">
                                    Tab
                                  </kbd>
                                  <span>Jump Section</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <kbd className="px-1.5 py-0.5 bg-kawai-black/60 border border-kawai-neutral/40 rounded text-kawai-pearl font-mono text-[10px]">
                                    1-4
                                  </kbd>
                                  <span>Filter</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <kbd className="px-1.5 py-0.5 bg-kawai-black/60 border border-kawai-neutral/40 rounded text-kawai-pearl font-mono text-[10px]">
                                    ↵
                                  </kbd>
                                  <span>Select</span>
                                </div>
                              </div>
                            )}

                            {/* Simple Esc hint when showing welcome screen */}
                            {query.length < 2 && (
                              <div className="flex items-center gap-1.5 text-xs text-kawai-neutral">
                                <span>Press</span>
                                <kbd className="px-1.5 py-0.5 bg-kawai-black/60 border border-kawai-neutral/40 rounded text-kawai-pearl font-mono text-[10px]">
                                  Esc
                                </kbd>
                                <span>to close</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </Fragment>,
        document.body
      )}

      {/* Floating Glassmorphic Search Input - Mobile Only - Always visible but hides when keyboard opens for other inputs - Portaled to body */}
      {/* Hidden on the routes in MOBILE_SEARCH_HIDDEN_PREFIXES (find-a-dealer has its own search; /signup* lead pages keep focus on the offer form) */}
      {isMounted && !hideMobileSearch && createPortal(
        <div
          data-hide-on-3d-viewer
          className="fixed left-0 right-0 z-[9003] md:hidden transition-all duration-200 ease-out"
          style={{
            // Hide when keyboard is open but search input is not focused (user is typing in another form)
            opacity: (keyboardHeight > 0 && !isInputFocused) ? 0 : 1,
            pointerEvents: (keyboardHeight > 0 && !isInputFocused) ? 'none' : 'auto',
            // Position above keyboard when keyboard is open AND search is focused
            bottom: (isInputFocused && keyboardHeight > 0) ? `${keyboardHeight}px` : '0',
            padding: '1rem',
            paddingBottom: (isInputFocused && keyboardHeight > 0) ? '1rem' : 'calc(1rem + env(safe-area-inset-bottom))',
          }}
        >
          <div className="max-w-3xl mx-auto">
            {/* Glassmorphic Input Container */}
            <div className="relative backdrop-blur-3xl bg-white/70 rounded-2xl shadow-2xl border border-white/40 overflow-hidden transition-all duration-300 hover:shadow-3xl">
              {/* Inner glow effect for glassmorphism */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />

              <div className="relative flex items-center gap-3 p-4">
                {/* Search Icon */}
                <div className="flex-shrink-0 pointer-events-none">
                  <Search className="h-6 w-6 text-kawai-red" />
                </div>

                {/* Input Field */}
                <input
                  ref={mobileInputRef}
                  type="text"
                  aria-label="Search showrooms, pianos, and products"
                  placeholder="Search showrooms, pianos..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => {
                    setIsInputFocused(true)
                    setIsOpen(true)
                    setIsMobileSearchOpen(true)
                    onOpenChange?.(true)
                    // Immediately set estimated keyboard height for instant UI adjustment
                    // This prevents the UI from being cut off before detection completes
                    // Default mobile keyboard is typically 260-350px, we use 300px as estimate
                    if (isMobile) {
                      setKeyboardHeight(300)
                    }
                    // Start proactive keyboard detection for precise adjustment
                    startKeyboardDetection()
                  }}
                  onBlur={() => {
                    setIsInputFocused(false)
                    // Don't auto-close - let user explicitly close with X or backdrop
                  }}
                  className="flex-1 bg-transparent text-base text-gray-900 placeholder-gray-500 focus:outline-none font-medium"
                />

                {/* Loading, Clear, or Close Button */}
                <div className="flex-shrink-0">
                  {isLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin text-kawai-red" />
                  ) : (isOpen || query.length > 0 || isInputFocused) ? (
                    <button
                      onClick={() => {
                        // If there's text, clear it; if empty, close search
                        if (query.length > 0) {
                          setQuery('')
                        } else {
                          clearSearch()
                        }
                      }}
                      className="p-2 text-gray-600 hover:text-kawai-red transition-colors rounded-full hover:bg-kawai-red/10 min-w-[40px] min-h-[40px] flex items-center justify-center"
                      aria-label={query.length > 0 ? "Clear search" : "Close search"}
                    >
                      <X className="h-6 w-6" />
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
