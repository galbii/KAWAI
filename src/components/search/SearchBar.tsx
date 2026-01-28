'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { Search, X, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { AnimatePresence } from 'framer-motion'
import Image from 'next/image'

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
    relationTo: 'products' | 'pages'
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
}

interface SearchBarProps {
  className?: string
  onOpenChange?: (isOpen: boolean) => void
}

type CategoryFilter = 'all' | 'products' | 'pages'

export function SearchBar({ className, onOpenChange }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all')
  const [selectedProductCategory, setSelectedProductCategory] = useState<string>('')
  const [isMounted, setIsMounted] = useState(false)

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

    if (collectionSlug === 'products') {
      // Use denormalized productSlug for reliable navigation
      const slug = result.productSlug || (typeof result.doc.value === 'object' ? result.doc.value.slug : '')
      return `/products/${slug}`
    }

    if (collectionSlug === 'pages') {
      // Pages use doc.value.slug (usually populated)
      const slug = typeof result.doc.value === 'object' ? result.doc.value.slug : result.doc.value
      return `/${slug}`
    }

    // Fallback
    const slug = typeof result.doc.value === 'object' ? result.doc.value.slug : result.doc.value
    return `/${slug}`
  }

  // Get visual indicator (simple mapping)
  const getResultIcon = (relationTo: string, category?: string): string => {
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
    if (relationTo === 'products') return 'Product'
    if (relationTo === 'pages') return 'Page'
    return 'Result'
  }

  // Filter results by category
  const filteredResults = results.filter(result => {
    if (categoryFilter === 'all') return true
    return result.doc.relationTo === categoryFilter
  })

  // Separate products and pages
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

  // Reset selection when category changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [selectedProductCategory])

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
    if (query.length < 2) {
      setResults([])
      setIsOpen(false)
      return
    }

    setIsLoading(true)
    setIsOpen(true)

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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if user is actively typing in the search input
      const isTypingInInput = document.activeElement === inputRef.current

      // If typing in input, only handle Escape
      if (isTypingInInput) {
        if (event.key === 'Escape') {
          event.preventDefault()
          setIsOpen(false)
          inputRef.current?.blur()
        }
        // Let all other keys (including Space) pass through for typing
        return
      }

      // Handle navigation keys only when NOT typing in input
      if (!isOpen) return

      // Combine displayed products and pages for navigation
      const allDisplayedResults = [...displayedProducts, ...pageResults]
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
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, displayedProducts, pageResults, selectedIndex, navigateToResult])

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
            placeholder="Search pianos, products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length >= 2 && setIsOpen(true)}
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
          {isOpen && query.length >= 2 && (
            <>
              {/* Backdrop - Dark background overlay */}
              <div
                className="fixed inset-0 z-[10000] bg-black/40"
                onClick={() => setIsOpen(false)}
              />

              {/* Overlay Container */}
              <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 md:p-8 pointer-events-none">
                <div
                  ref={overlayRef}
                  className="w-full max-w-7xl pointer-events-auto"
                  style={{ height: '85vh', maxHeight: '900px' }}
                  onClick={(e) => e.stopPropagation()}
                  onMouseEnter={() => setIsMouseOverOverlay(true)}
                  onMouseLeave={() => setIsMouseOverOverlay(false)}
                >
                  {/* Glass Container - Transparent with blur */}
                  <div className="h-full backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 dark:border-white/10 flex flex-col overflow-hidden bg-gradient-to-br from-white/10 via-white/5 to-transparent dark:from-gray-900/10 dark:via-gray-900/5 dark:to-transparent">

                    {/* Results */}
                    <div className="flex-1 overflow-y-auto p-6">
                      {filteredResults.length === 0 && !isLoading ? (
                        <div className="flex flex-col items-center justify-center h-full">
                          <div className="w-16 h-16 rounded-full bg-white/20 dark:bg-white/10 backdrop-blur-md flex items-center justify-center mb-4">
                            <Search className="w-8 h-8 text-gray-400" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            No results found
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-sm">
                            Try adjusting your search or browse our collections
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-6">
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
                                        'flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                                        isSelected
                                          ? 'bg-kawai-red text-white shadow-md'
                                          : 'bg-white/60 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-800/80 border border-white/30'
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
                                  {displayedProducts.map((result, index) => {
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
                                          className="group rounded-xl overflow-hidden text-left transition-all relative hover:scale-105 duration-300"
                                        >
                                          {/* Image Container - Top Section */}
                                          <div className="relative aspect-square w-full bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border-b border-white/20">
                                            {imageUrl ? (
                                              <Image
                                                src={imageUrl}
                                                alt={model}
                                                width={300}
                                                height={300}
                                                className="w-full h-full object-cover"
                                              />
                                            ) : (
                                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white/20 to-white/10 dark:from-gray-700/20 dark:to-gray-800/10">
                                                <span className="text-6xl opacity-40">
                                                  {getResultIcon(result.doc.relationTo, category)}
                                                </span>
                                              </div>
                                            )}

                                          </div>

                                          {/* Model Info - Bottom Section */}
                                          <div className="p-3 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border border-white/20 dark:border-white/10">
                                            <h4 className="font-bold text-gray-900 dark:text-white text-sm text-center truncate">
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
                            <div className="border-t border-white/20 dark:border-white/10 my-6" />
                          )}

                          {/* Pages Section */}
                          {pageResults.length > 0 && (
                            <div>
                              <div className="flex items-center gap-2 mb-4 px-2">
                                <div className="h-1 w-8 bg-gray-400 dark:bg-gray-600 rounded-full" />
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide">
                                  Pages ({pageResults.length})
                                </h3>
                              </div>
                              <div className="space-y-2">
                                {pageResults.map((result, pageIndex) => {
                                  const resultIndex = productResults.length + pageIndex
                                  return (
                                    <button
                                      key={result.id}
                                      id={`search-result-${resultIndex}`}
                                      onClick={() => navigateToResult(result)}
                                      className="w-full p-4 rounded-xl text-left transition-all border backdrop-blur-md hover:scale-[1.02] bg-white/80 dark:bg-gray-900/80 border-white/20 dark:border-white/10 hover:bg-white/90 dark:hover:bg-gray-900/90"
                                    >
                                      <div className="flex items-center gap-4">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-white/50 dark:bg-white/10 backdrop-blur-md flex items-center justify-center">
                                          <span className="text-2xl">📄</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <h4 className="font-medium text-gray-900 dark:text-white mb-1 truncate">
                                            {result.title}
                                          </h4>
                                          {result.excerpt && (
                                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
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
                    <div className="flex-shrink-0 px-6 py-4 border-t border-white/20 dark:border-white/10 bg-white/10 dark:bg-gray-900/10 backdrop-blur-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {(['all', 'products', 'pages'] as CategoryFilter[]).map((category) => (
                            <button
                              key={category}
                              onClick={() => setCategoryFilter(category)}
                              className={cn(
                                'px-4 py-2 rounded-lg text-sm font-medium transition-all backdrop-blur-sm',
                                categoryFilter === category
                                  ? 'bg-kawai-red text-white shadow-md'
                                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                              )}
                            >
                              {category.charAt(0).toUpperCase() + category.slice(1)}
                            </button>
                          ))}
                        </div>
                        {filteredResults.length > 0 && (
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''}
                          </span>
                        )}
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
