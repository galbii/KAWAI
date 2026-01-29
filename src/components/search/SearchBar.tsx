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

  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Track mounted state for portal
  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

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

  // Filter results by category
  const filteredResults = results.filter(result => {
    if (categoryFilter === 'all') return true
    return result.doc.relationTo === categoryFilter
  })

  // Separate storefronts, products, and pages
  const storefrontResults = filteredResults.filter(r => r.doc.relationTo === 'storefronts')
  const productResults = filteredResults.filter(r => r.doc.relationTo === 'products')
  const pageResults = filteredResults.filter(r => r.doc.relationTo === 'pages')

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

    console.log('🗂️ Products grouped by category:', Object.keys(grouped).map(k => `${k} (${grouped[k]?.length ?? 0})`))
    return grouped
  }, [productResults])

  // Get available categories dynamically (whatever exists in the data)
  const availableCategories = useMemo(() => {
    const categories = Object.keys(productsByCategory)
    console.log('Available categories:', categories)
    console.log('Products by category:', categories.map(key => `${key}: ${productsByCategory[key]?.length ?? 0}`))
    return categories
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

    console.log(`📍 Selected category: "${categoryToShow}" → ${products.length} products`)

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
  useEffect(() => {
    if (!isOpen) return

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
  }, [isOpen, isMouseOverOverlay])

  // Notify parent when search open state changes
  useEffect(() => {
    onOpenChange?.(isOpen && query.length >= 2)
  }, [isOpen, query, onOpenChange])

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
    setSelectedIndex(0)
    inputRef.current?.blur()
  }, [])

  // Click outside handler
  useEffect(() => {
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
  }, [isOpen])

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
      {/* Input Field (stays in header) - Ensure it's above overlay */}
      <div ref={containerRef} className={cn('relative z-[10002]', className)}>
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
          {isOpen && (
            <>
              {/* Backdrop - Dark overlay that starts below header top row + red line */}
              <div
                className="fixed z-[10000] bg-black/40"
                style={{ top: '70px', left: 0, right: 0, bottom: 0 }}
                onClick={() => setIsOpen(false)}
              />

              {/* Overlay Container - Positioned below header top row + red line */}
              <div
                className="fixed z-[10001] flex items-center justify-center p-4 md:p-8 pointer-events-none"
                style={{ top: '70px', left: 0, right: 0, bottom: 0 }}
                onKeyDown={handleKeyboardNavigation}
              >
                <div
                  ref={overlayRef}
                  className="w-full max-w-7xl pointer-events-auto"
                  style={{ height: '85vh', maxHeight: '900px' }}
                  onClick={(e) => e.stopPropagation()}
                  onMouseEnter={() => setIsMouseOverOverlay(true)}
                  onMouseLeave={() => setIsMouseOverOverlay(false)}
                >
                  {/* Glass Container - Ultra-transparent glassmorphism */}
                  <div className="h-full backdrop-blur-3xl rounded-2xl shadow-2xl border border-kawai-neutral/20 flex flex-col overflow-hidden bg-kawai-black/30">

                    {/* Header */}
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

                    {/* Results */}
                    <div className="flex-1 overflow-y-auto p-6">
                      {/* Welcome Screen - Show when search is empty */}
                      {query.length < 2 ? (
                        <div className="flex flex-col items-center justify-center h-full gap-8">
                          {/* Small KAWAI Logo */}
                          <div className="flex items-center justify-center">
                            <KawaiLogo
                              size="sm"
                              animated={false}
                              nonClickable={true}
                            />
                          </div>

                          {/* Greeting Message */}
                          <div className="text-center">
                            <h2 className="text-3xl font-bold text-kawai-pearl mb-2">
                              Welcome to KAWAI
                            </h2>
                            <p className="text-kawai-neutral">
                              Find showrooms, explore pianos, or get started with these quick links
                            </p>
                          </div>

                          {/* Quick Links */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
                            <button
                              onClick={() => {
                                router.push('/instrumental-to-life')
                                clearSearch()
                              }}
                              className="group p-6 rounded-xl bg-kawai-black/40 backdrop-blur-xl border border-kawai-neutral/30 hover:border-kawai-red transition-all hover:scale-105 duration-300"
                            >
                              <div className="flex flex-col items-center gap-3 text-center">
                                <div className="w-12 h-12 rounded-full bg-kawai-red/20 flex items-center justify-center group-hover:bg-kawai-red/30 transition-colors">
                                  <span className="text-2xl">🎹</span>
                                </div>
                                <h3 className="font-semibold text-kawai-pearl group-hover:text-kawai-red transition-colors">
                                  Instrumental to Life
                                </h3>
                                <p className="text-xs text-kawai-neutral">
                                  Discover our story and mission
                                </p>
                              </div>
                            </button>

                            <button
                              onClick={() => {
                                router.push('/find-a-dealer')
                                clearSearch()
                              }}
                              className="group p-6 rounded-xl bg-kawai-black/40 backdrop-blur-xl border border-kawai-neutral/30 hover:border-kawai-red transition-all hover:scale-105 duration-300"
                            >
                              <div className="flex flex-col items-center gap-3 text-center">
                                <div className="w-12 h-12 rounded-full bg-kawai-red/20 flex items-center justify-center group-hover:bg-kawai-red/30 transition-colors">
                                  <span className="text-2xl">📍</span>
                                </div>
                                <h3 className="font-semibold text-kawai-pearl group-hover:text-kawai-red transition-colors">
                                  Find a Dealer
                                </h3>
                                <p className="text-xs text-kawai-neutral">
                                  Locate a showroom near you
                                </p>
                              </div>
                            </button>

                            <button
                              onClick={() => {
                                router.push('/register-my-piano')
                                clearSearch()
                              }}
                              className="group p-6 rounded-xl bg-kawai-black/40 backdrop-blur-xl border border-kawai-neutral/30 hover:border-kawai-red transition-all hover:scale-105 duration-300"
                            >
                              <div className="flex flex-col items-center gap-3 text-center">
                                <div className="w-12 h-12 rounded-full bg-kawai-red/20 flex items-center justify-center group-hover:bg-kawai-red/30 transition-colors">
                                  <span className="text-2xl">📝</span>
                                </div>
                                <h3 className="font-semibold text-kawai-pearl group-hover:text-kawai-red transition-colors">
                                  Register My Piano
                                </h3>
                                <p className="text-xs text-kawai-neutral">
                                  Register your instrument
                                </p>
                              </div>
                            </button>
                          </div>
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
                              <div className="flex items-center gap-2 mb-4 px-2">
                                <div className="h-1 w-8 bg-kawai-red rounded-full" />
                                <h3 className="text-sm font-bold text-kawai-pearl uppercase tracking-wide">
                                  Showroom Locations ({storefrontResults.length})
                                </h3>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {storefrontResults.map((result, index) => {
                                  const slug = result.storefrontSlug || (typeof result.doc.value === 'object' ? result.doc.value.slug : '')
                                  // Format slug for display: "st-louis" → "ST LOUIS"
                                  const displaySlug = slug.toUpperCase().replace(/-/g, ' ')

                                  return (
                                    <button
                                      key={result.id}
                                      id={`search-result-${index}`}
                                      onClick={() => navigateToResult(result)}
                                      className={cn(
                                        "group aspect-square rounded-xl overflow-hidden transition-all relative hover:scale-105 duration-300 border border-kawai-red/30 hover:border-kawai-red bg-gradient-to-br from-kawai-black/40 via-kawai-black/30 to-kawai-red/10 backdrop-blur-xl",
                                        selectedIndex === index && "ring-2 ring-kawai-red ring-offset-2 ring-offset-black/80 scale-105"
                                      )}
                                    >
                                      {/* Minimal card design: Logo + Slug */}
                                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-6">
                                        {/* KAWAI Logo */}
                                        <div className="w-full flex items-center justify-center opacity-90 group-hover:opacity-100 transition-opacity">
                                          <KawaiLogo
                                            size="sm"
                                            animated={false}
                                            nonClickable={true}
                                          />
                                        </div>

                                        {/* Location Slug */}
                                        <div className="text-center">
                                          <h4 className="font-bold text-kawai-pearl text-lg tracking-wider group-hover:text-kawai-red transition-colors">
                                            {displaySlug}
                                          </h4>
                                        </div>
                                      </div>

                                      {/* Subtle hover gradient overlay */}
                                      <div className="absolute inset-0 bg-gradient-to-t from-kawai-red/0 to-kawai-red/0 group-hover:from-kawai-red/10 group-hover:to-transparent transition-all duration-300" />
                                    </button>
                                  )
                                })}
                              </div>
                            </div>
                          )}

                          {/* Separator between Storefronts and Products */}
                          {storefrontResults.length > 0 && productResults.length > 0 && (
                            <div className="border-t border-kawai-neutral/20 my-6" />
                          )}

                          {/* Category Switcher - Show if there are categorized products */}
                          {productResults.length > 0 && (
                            <div>
                              {/* Category Tabs */}
                              <div className="flex items-center gap-2 mb-4 px-2 overflow-x-auto">
                                {availableCategories.map((categoryKey) => {
                                  const count = productsByCategory[categoryKey]?.length || 0
                                  const isSelected = selectedProductCategory === categoryKey

                                  return (
                                    <button
                                      key={categoryKey}
                                      onClick={() => setSelectedProductCategory(categoryKey)}
                                      className={cn(
                                        'flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all backdrop-blur-xl',
                                        isSelected
                                          ? 'bg-kawai-red text-white shadow-md'
                                          : 'bg-kawai-black/40 text-kawai-pearl hover:bg-kawai-black/60 border border-kawai-neutral/40'
                                      )}
                                    >
                                      {getCategoryLabel(categoryKey)} ({count})
                                    </button>
                                  )
                                })}
                              </div>

                              {/* Selected Category Products */}
                              <div>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                  {displayedProducts.map((result, productIndex) => {
                                      // Calculate global index (offset by storefronts)
                                      const index = storefrontResults.length + productIndex

                                      // Use denormalized fields from search doc (not from relationship)
                                      // This avoids issues with polymorphic relationship depth not populating
                                      const model = result.productModel || result.title
                                      const imageUrl = result.productImageUrl
                                      const productType = result.productType || 'piano'
                                      const category = result.productCategory || result.category
                                      const slug = result.productSlug || (typeof result.doc.value === 'object' ? result.doc.value.slug : '')

                                      return (
                                        <button
                                          key={result.id}
                                          id={`search-result-${index}`}
                                          onClick={() => navigateToResult(result)}
                                          className={cn(
                                            "group rounded-xl overflow-hidden text-left transition-all relative hover:scale-105 duration-300 border border-kawai-neutral/30 hover:border-kawai-red/60 bg-kawai-black/20",
                                            selectedIndex === index && "ring-2 ring-kawai-red ring-offset-2 ring-offset-black/80 scale-105"
                                          )}
                                        >
                                          {/* Image Container - Top Section */}
                                          <div className="relative aspect-square w-full bg-kawai-black/30 backdrop-blur-xl border-b border-kawai-neutral/30">
                                            {imageUrl ? (
                                              <Image
                                                src={imageUrl}
                                                alt={model}
                                                width={300}
                                                height={300}
                                                className="w-full h-full object-cover"
                                              />
                                            ) : (
                                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-kawai-black/50 to-kawai-black/30">
                                                <span className="text-6xl opacity-40">
                                                  {getResultIcon(result.doc.relationTo, category)}
                                                </span>
                                              </div>
                                            )}

                                          </div>

                                          {/* Model Info - Bottom Section */}
                                          <div className="p-3 bg-kawai-black/40 backdrop-blur-xl border-t border-kawai-neutral/30">
                                            <h4 className="font-bold text-kawai-pearl text-sm text-center truncate group-hover:text-kawai-red transition-colors">
                                              {model}
                                            </h4>
                                          </div>
                                        </button>
                                      )
                                    })}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Separator between Products and Pages */}
                          {displayedProducts.length > 0 && pageResults.length > 0 && (
                            <div className="border-t border-kawai-neutral/20 my-6" />
                          )}

                          {/* Separator between Storefronts and Pages (when no products) */}
                          {storefrontResults.length > 0 && productResults.length === 0 && pageResults.length > 0 && (
                            <div className="border-t border-kawai-neutral/20 my-6" />
                          )}

                          {/* Pages Section */}
                          {pageResults.length > 0 && (
                            <div>
                              <div className="flex items-center gap-2 mb-4 px-2">
                                <div className="h-1 w-8 bg-kawai-red rounded-full" />
                                <h3 className="text-sm font-bold text-kawai-pearl uppercase tracking-wide">
                                  Pages ({pageResults.length})
                                </h3>
                              </div>
                              <div className="space-y-2">
                                {pageResults.map((result, pageIndex) => {
                                  // Calculate global index (offset by storefronts and displayed products)
                                  const resultIndex = storefrontResults.length + displayedProducts.length + pageIndex
                                  return (
                                    <button
                                      key={result.id}
                                      id={`search-result-${resultIndex}`}
                                      onClick={() => navigateToResult(result)}
                                      className={cn(
                                        "w-full p-4 rounded-xl text-left transition-all border backdrop-blur-xl hover:scale-[1.02] bg-kawai-black/40 border-kawai-neutral/30 hover:border-kawai-red/60 hover:bg-kawai-black/60 group",
                                        selectedIndex === resultIndex && "ring-2 ring-kawai-red ring-offset-2 ring-offset-black/80 scale-[1.02]"
                                      )}
                                    >
                                      <div className="flex items-center gap-4">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-kawai-red/20 backdrop-blur-xl flex items-center justify-center border border-kawai-neutral/40">
                                          <span className="text-2xl">📄</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <h4 className="font-medium text-kawai-pearl mb-1 truncate group-hover:text-kawai-red transition-colors">
                                            {result.title}
                                          </h4>
                                          {result.excerpt && (
                                            <p className="text-sm text-kawai-neutral line-clamp-1">
                                              {result.excerpt}
                                            </p>
                                          )}
                                        </div>
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

                    {/* Filters at Bottom */}
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
                  </div>
                </div>
              </div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}
