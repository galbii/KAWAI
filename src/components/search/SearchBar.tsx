'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { Search, X, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { KawaiLogo } from '@/components/ui/kawai-logo'

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
    relationTo: 'products' | 'pages' | 'storefronts'
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
}

interface SearchBarProps {
  className?: string
  onOpenChange?: (isOpen: boolean) => void
}

interface QuickLink {
  label: string
  url: string
}

type CategoryFilter = 'all' | 'storefronts' | 'products' | 'pages'

export function SearchBar({ className, onOpenChange }: SearchBarProps) {
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
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>([
    { label: 'Instrumental to Life', url: '/instrumental-to-life' },
    { label: 'Find a Dealer', url: '/find-a-dealer' },
    { label: 'Register My Piano', url: '/register-my-piano' },
    { label: 'Kawai Exclusive Offers', url: '/explore' },
  ])

  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const mobileInputRef = useRef<HTMLInputElement>(null)
  const measuringKeyboardRef = useRef(false)
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

    // Detect mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => {
      setIsMounted(false)
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  // Read announcement bar height from CSS variable
  useEffect(() => {
    const updateAnnouncementBarHeight = () => {
      const height = getComputedStyle(document.documentElement)
        .getPropertyValue('--announcement-bar-height')
      const heightValue = parseInt(height) || 0
      setAnnouncementBarHeight(heightValue)
    }

    // Initial read
    updateAnnouncementBarHeight()

    // Watch for changes to the CSS variable
    const observer = new MutationObserver(updateAnnouncementBarHeight)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style']
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

      // Update keyboard height (set to 0 when keyboard closes)
      setKeyboardHeight(newKeyboardHeight > 150 ? newKeyboardHeight : 0)

      // Stop any active polling when resize event provides measurement
      if (newKeyboardHeight > 150 || newKeyboardHeight < 150) {
        measuringKeyboardRef.current = false
      }
    }

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

  // Collection-aware URL routing
  const getResultUrl = (result: SearchResult): string => {
    const collectionSlug = result.doc.relationTo

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
      return result.doc.relationTo === categoryFilter
    })
  }, [results, categoryFilter])

  // Separate storefronts, products, and pages - memoized
  const storefrontResults = useMemo(() =>
    filteredResults.filter(r => r.doc.relationTo === 'storefronts'),
    [filteredResults]
  )

  const productResults = useMemo(() =>
    filteredResults.filter(r => r.doc.relationTo === 'products'),
    [filteredResults]
  )

  const pageResults = useMemo(() =>
    filteredResults.filter(r => r.doc.relationTo === 'pages'),
    [filteredResults]
  )

  // Group products dynamically by their category field (simple and flexible)
  const productsByCategory = useMemo(() => {
    const grouped = productResults.reduce((acc, result) => {
      // Use productCategory as the primary grouping key
      // Fallback to productType if no category, then 'Other' if neither exists
      const category = result.productCategory || result.productType || 'Other'

      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(result)

      return acc
    }, {} as Record<string, SearchResult[]>)

    return grouped
  }, [productResults])

  // Get available categories dynamically (whatever exists in the data)
  const availableCategories = useMemo(() => {
    return Object.keys(productsByCategory)
  }, [productsByCategory])

  // Auto-generate label from category name (capitalize words)
  const getCategoryLabel = (category: string): string => {
    return category
      .split(/[-_\s]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  // Auto-select first category when results change
  useEffect(() => {
    if (availableCategories.length === 0) {
      setSelectedProductCategory('')
      return
    }

    // Keep current selection if it's still valid, otherwise select first category
    setSelectedProductCategory((current) => {
      if (current && availableCategories.includes(current)) {
        return current // Keep current selection
      }
      return availableCategories[0] ?? '' // Default to first category or empty string
    })

    setSelectedIndex(0)
  }, [availableCategories])

  // Reset selection when category or filter changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [selectedProductCategory, categoryFilter])

  // Get products for selected category
  // Memoize to prevent unnecessary recalculations
  const displayedProducts = useMemo(() => {
    // If no category is selected but we have available categories, show the first one's products
    const categoryToShow = selectedProductCategory || availableCategories[0]
    const products = categoryToShow ? productsByCategory[categoryToShow] || [] : []

    return products
  }, [selectedProductCategory, productsByCategory, availableCategories])

  // Debounced search
  useEffect(() => {
    // Clear results if query is too short, but keep overlay open if focused
    if (query.length < 2) {
      setResults([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    const timeoutId = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        if (!response.ok) throw new Error('Search failed')

        const data = await response.json()
        setResults(data.results || [])
        setSelectedIndex(0)
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
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

  // Navigate to result
  const navigateToResult = useCallback((result: SearchResult) => {
    const url = getResultUrl(result)
    console.log('Navigating to:', url, {
      title: result.title,
      relationTo: result.doc.relationTo,
      productSlug: result.productSlug,
    })
    router.push(url)
    clearSearch()
  }, [router])

  // Clear search
  const clearSearch = useCallback(() => {
    setQuery('')
    setResults([])
    setIsOpen(false)
    setIsMobileSearchOpen(false)
    setIsInputFocused(false)
    setSelectedIndex(0)
    setCategoryFilter('all')
    inputRef.current?.blur()
    mobileInputRef.current?.blur()
    onOpenChange?.(false)
    // Stop any active keyboard polling
    measuringKeyboardRef.current = false
  }, [onOpenChange])

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

    // Combine displayed storefronts, products and pages for navigation
    const allDisplayedResults = [...storefrontResults, ...displayedProducts, ...pageResults]
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
      case 'Tab':
        event.preventDefault()
        // Jump to next section
        if (event.shiftKey) {
          // Shift+Tab - Jump to previous section
          if (selectedIndex >= storefrontResults.length + displayedProducts.length) {
            // On pages → jump to first product (or first storefront if no products)
            setSelectedIndex(displayedProducts.length > 0 ? storefrontResults.length : 0)
          } else if (selectedIndex >= storefrontResults.length) {
            // On products → jump to first storefront
            setSelectedIndex(0)
          } else {
            // On storefronts → wrap to first page (or last product if no pages)
            if (pageResults.length > 0) {
              setSelectedIndex(storefrontResults.length + displayedProducts.length)
            } else if (displayedProducts.length > 0) {
              setSelectedIndex(storefrontResults.length + displayedProducts.length - 1)
            }
          }
        } else {
          // Tab - Jump to next section
          if (selectedIndex < storefrontResults.length) {
            // On storefronts → jump to first product (or first page if no products)
            setSelectedIndex(displayedProducts.length > 0 ? storefrontResults.length : storefrontResults.length + displayedProducts.length)
          } else if (selectedIndex < storefrontResults.length + displayedProducts.length) {
            // On products → jump to first page (or first storefront if no pages)
            setSelectedIndex(pageResults.length > 0 ? storefrontResults.length + displayedProducts.length : 0)
          } else {
            // On pages → wrap to first storefront
            setSelectedIndex(0)
          }
        }
        break
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
  }, [storefrontResults, displayedProducts, pageResults, selectedIndex, navigateToResult])

  // Scroll selected item into view
  useEffect(() => {
    const selectedElement = document.getElementById(`search-result-${selectedIndex}`)
    if (selectedElement) {
      selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }, [selectedIndex])


  return (
    <>
      {/* Desktop Input Field (stays in header) - Hidden on mobile */}
      <div ref={containerRef} className={cn('relative z-[10002] hidden md:block', className)}>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            ref={inputRef}
            type="text"
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
          {/* Keyboard Hint - Show when not focused and empty */}
          {query.length === 0 && !isFocused && (
            <div className="pointer-events-none absolute inset-y-0 right-12 flex items-center">
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
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
        <AnimatePresence>
          {(isOpen || (isMobile && isInputFocused)) && (
            <>
              {/* Backdrop - Dark overlay covering full screen */}
              <div
                className="fixed z-[10000] bg-black/40"
                style={{
                  // 120px = 64px (top bar) + 56px (bottom nav at top), plus dynamic announcement bar height
                  top: isMobile ? 0 : `${120 + announcementBarHeight}px`,
                  left: 0,
                  right: 0,
                  // On mobile, stop backdrop before the input area to prevent click-through
                  bottom: isMobile && keyboardHeight > 0
                    ? `${keyboardHeight + 80}px`
                    : 0
                }}
                onClick={() => {
                  setIsOpen(false)
                  setIsMobileSearchOpen(false)
                }}
              />

              {/* Overlay Container - Floating on mobile, centered on desktop */}
              <div
                className={cn(
                  "fixed z-[10001] pointer-events-none",
                  isMobile
                    ? "flex flex-col p-2" // Add padding on mobile for floating effect
                    : "flex items-center justify-center p-4 md:p-8" // Centered on desktop
                )}
                style={
                  isMobile
                    ? {
                        top: 0,
                        left: 0,
                        right: 0,
                        // Dynamically adjust bottom spacing based on keyboard height
                        bottom: keyboardHeight > 0
                          ? `${keyboardHeight + 80}px` // Input height + keyboard height
                          : 'calc(100px + env(safe-area-inset-bottom))' // Default spacing
                      }
                    : { top: `${120 + announcementBarHeight}px`, left: 0, right: 0, bottom: 0 } // 64px (top bar) + 56px (bottom nav) + announcement bar
                }
                onKeyDown={handleKeyboardNavigation}
              >
                <div
                  ref={overlayRef}
                  className={cn(
                    "pointer-events-auto",
                    isMobile
                      ? "w-full h-full flex flex-col" // Full screen on mobile with flex column for bottom input
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
                    isMobile ? "flex-1 border-0 rounded-none shadow-none" : "bg-kawai-black/60 backdrop-blur-2xl"
                  )}
                  style={isMobile ? undefined : { height: '100%' }}>
                  {/* Glass Container - Floating glassmorphic design */}
                  <div className={cn(
                    "flex flex-col overflow-hidden",
                    isMobile
                      ? "h-full mx-4 my-4 rounded-3xl shadow-2xl backdrop-blur-3xl bg-kawai-black/40 border border-kawai-neutral/20" // Floating with margins on mobile
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
                            {(['all', 'storefronts', 'products', 'pages'] as CategoryFilter[]).map((category) => (
                              <button
                                key={category}
                                onClick={() => setCategoryFilter(category)}
                                className={cn(
                                  'flex-shrink-0 px-4 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap',
                                  categoryFilter === category
                                    ? 'bg-kawai-red text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                )}
                              >
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Quick Links - Sticky at top on mobile, hidden on desktop */}
                    {isMobile && query.length < 2 && (
                      <div className="flex-shrink-0 border-b border-gray-200/50">
                        <div className="p-4 space-y-1">
                          {/* Quick Links Header */}
                          <div className="flex items-center gap-2 mb-4 px-2">
                            <div className="h-px flex-1 bg-kawai-neutral/20" />
                            <h3 className="text-xs font-medium text-kawai-neutral uppercase tracking-widest">
                              Quick Links
                            </h3>
                            <div className="h-px flex-1 bg-kawai-neutral/20" />
                          </div>
                          {quickLinks.map((link, index) => (
                            <button
                              key={index}
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
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Results */}
                    <div className={cn(
                      "flex-1 overflow-y-auto overscroll-contain",
                      isMobile ? "p-4 pb-6" : "p-6", // Tighter padding on mobile for floating feel
                      // Add momentum scrolling on iOS for smooth experience
                      isMobile && "-webkit-overflow-scrolling-touch"
                    )}
                    style={
                      isMobile
                        ? {
                            paddingTop: isMobile && query.length >= 2 ? '0' : 'calc(1rem + env(safe-area-inset-top))',
                            // Ensure proper scrolling when keyboard is open
                            maxHeight: keyboardHeight > 0 ? '100%' : undefined,
                          }
                        : undefined
                    }
                    >
                      {/* Welcome Screen - Show when search is empty (desktop only now) */}
                      {query.length < 2 && !isMobile ? (
                        <div className={cn(
                          "flex flex-col items-center h-full",
                          isMobile ? "justify-start pt-8" : "justify-center gap-12"
                        )}>
                          {/* Small KAWAI Logo - Desktop only */}
                          {!isMobile && (
                            <div className="flex items-center justify-center">
                              <KawaiLogo
                                size="sm"
                                animated={false}
                                nonClickable={true}
                              />
                            </div>
                          )}

                          {/* Sequential Greeting Message with Buena Park font - Desktop only */}
                          {!isMobile && (
                            <div className="text-center px-4 relative" style={{ minHeight: '180px' }}>
                              <div className="absolute inset-0 flex items-center justify-center">
                                {/* "Welcome," - Fades in then out */}
                                <h2
                                  className="text-kawai-pearl absolute text-5xl"
                                  style={{
                                    fontFamily: 'var(--font-buena-park), serif',
                                    fontWeight: 400,
                                    letterSpacing: '0.02em',
                                    animation: 'fadeInOut 3s ease-in-out forwards'
                                  }}
                                >
                                  Welcome,
                                </h2>

                                {/* "Instrumental to Life." - Fades in after Welcome fades out */}
                                <h3
                                  className="text-kawai-pearl absolute text-4xl"
                                  style={{
                                    fontFamily: 'var(--font-buena-park), serif',
                                    fontWeight: 300,
                                    letterSpacing: '0.03em',
                                    animation: 'fadeInAfter 3s ease-in-out 2s forwards',
                                    opacity: 0
                                  }}
                                >
                                  Instrumental to Life.
                                </h3>
                              </div>
                            </div>
                          )}

                          {/* Quick Links - Desktop only (mobile has sticky version at top) */}
                          {!isMobile && (
                            <div className="w-full max-w-md space-y-1">
                              {/* Quick Links Header */}
                              <div className="flex items-center gap-2 mb-4 px-2">
                                <div className="h-px flex-1 bg-kawai-neutral/20" />
                                <h3 className="text-xs font-medium text-kawai-neutral uppercase tracking-widest">
                                  Quick Links
                                </h3>
                                <div className="h-px flex-1 bg-kawai-neutral/20" />
                              </div>
                              {quickLinks.map((link, index) => (
                                <button
                                  key={index}
                                  onClick={() => {
                                    router.push(link.url)
                                    clearSearch()
                                  }}
                                  className="group w-full px-6 py-4 text-left transition-all duration-200 hover:bg-kawai-red/5 border-l-2 border-transparent hover:border-kawai-red"
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
                                </button>
                              ))}
                            </div>
                          )}

                          {/* CSS for sequential fade animation */}
                          <style jsx>{`
                            @keyframes fadeInOut {
                              0% {
                                opacity: 0;
                                transform: translateY(10px);
                              }
                              15% {
                                opacity: 1;
                                transform: translateY(0);
                              }
                              50% {
                                opacity: 1;
                                transform: translateY(0);
                              }
                              65% {
                                opacity: 0;
                                transform: translateY(-10px);
                              }
                              100% {
                                opacity: 0;
                                transform: translateY(-10px);
                              }
                            }

                            @keyframes fadeInAfter {
                              0% {
                                opacity: 0;
                                transform: translateY(10px);
                              }
                              20% {
                                opacity: 1;
                                transform: translateY(0);
                              }
                              100% {
                                opacity: 1;
                                transform: translateY(0);
                              }
                            }
                          `}</style>
                        </div>
                      ) : filteredResults.length === 0 && !isLoading ? (
                        <div className="flex flex-col items-center justify-center h-full">
                          <div className="w-16 h-16 rounded-full bg-kawai-black/40 backdrop-blur-xl flex items-center justify-center mb-4 border border-kawai-neutral/40">
                            <Search className="w-8 h-8 text-kawai-red" />
                          </div>
                          <h3 className="text-lg font-semibold text-kawai-pearl mb-2">
                            No results found
                          </h3>
                          <p className="text-sm text-kawai-neutral text-center max-w-sm">
                            Try adjusting your search or browse our collections
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {/* Storefronts Section - Shown FIRST (highest priority) */}
                          {storefrontResults.length > 0 && (
                            <div>
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
                            </div>
                          )}

                          {/* Category Switcher */}
                          {productResults.length > 0 && (
                            <div>
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
                                            'px-3 py-1 text-xs font-medium uppercase tracking-widest transition-all whitespace-nowrap',
                                            isSelected
                                              ? 'text-kawai-red'
                                              : 'text-kawai-neutral hover:text-kawai-pearl'
                                          )}
                                        >
                                          {getCategoryLabel(categoryKey)}
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
                                  // Calculate global index (offset by storefronts)
                                  const index = storefrontResults.length + productIndex

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
                            </div>
                          )}

                          {/* Pages Section */}
                          {pageResults.length > 0 && (
                            <div>
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
                                  const resultIndex = storefrontResults.length + displayedProducts.length + pageIndex
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
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Filters at Bottom - Desktop only */}
                    {!isMobile && (
                      <div className="flex-shrink-0 px-6 py-4 border-t border-kawai-neutral/30 bg-kawai-black/40 backdrop-blur-xl">
                        <div className="flex items-center justify-between">
                          {/* Only show filters when there are search results */}
                          {query.length >= 2 && (
                            <div className="flex items-center gap-2">
                              {(['all', 'storefronts', 'products', 'pages'] as CategoryFilter[]).map((category) => (
                                <button
                                  key={category}
                                  onClick={() => setCategoryFilter(category)}
                                  className={cn(
                                    'px-4 py-2 rounded-lg text-sm font-medium transition-all backdrop-blur-xl',
                                    categoryFilter === category
                                      ? 'bg-kawai-red text-white shadow-md'
                                      : 'bg-kawai-black/60 text-kawai-pearl hover:bg-kawai-black/80 border border-kawai-neutral/40 hover:border-kawai-red/60'
                                  )}
                                >
                                  {category.charAt(0).toUpperCase() + category.slice(1)}
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
            </div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Floating Glassmorphic Search Input - Mobile Only - Always Visible - Portaled to body */}
      {isMounted && createPortal(
        <div
          className="fixed left-0 right-0 z-[10003] md:hidden transition-all duration-200 ease-out"
          style={{
            // Position above keyboard when keyboard is open
            bottom: keyboardHeight > 0 ? `${keyboardHeight}px` : '0',
            padding: '1rem',
            paddingBottom: keyboardHeight > 0 ? '1rem' : 'calc(1rem + env(safe-area-inset-bottom))',
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

                {/* Loading or Clear Button */}
                <div className="flex-shrink-0">
                  {isLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin text-kawai-red" />
                  ) : query.length > 0 ? (
                    <button
                      onClick={() => setQuery('')}
                      className="p-2 text-gray-500 hover:text-kawai-red transition-colors rounded-full hover:bg-kawai-red/10 min-w-[40px] min-h-[40px] flex items-center justify-center"
                      aria-label="Clear search"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  ) : null}
                </div>

                {/* Close Button - Show when overlay is open, has text, or input is focused */}
                {(isOpen || query.length > 0 || isInputFocused) && (
                  <div className="flex-shrink-0">
                    <button
                      onClick={clearSearch}
                      className="p-2 text-gray-600 hover:text-kawai-red transition-colors rounded-full hover:bg-kawai-red/10 min-w-[40px] min-h-[40px] flex items-center justify-center"
                      aria-label="Close search"
                    >
                      <X className="h-6 w-6 font-bold" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
