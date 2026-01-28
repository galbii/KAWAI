'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Search, X, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface SearchResult {
  id: string
  title: string
  doc: {
    value: {
      slug: string
      imageUrl?: string
      category?: string
    }
    relationTo: 'products' | 'pages'
  }
  excerpt?: string
  category?: string
  tags?: string[]
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

  // Collection-aware URL routing
  const getResultUrl = (result: SearchResult): string => {
    const collectionSlug = result.doc.relationTo
    const slug = result.doc.value.slug

    if (collectionSlug === 'products') {
      return `/products/${slug}`
    }

    if (collectionSlug === 'pages') {
      return `/${slug}`
    }

    return `/${slug}`
  }

  // Get visual indicator
  const getResultIcon = (relationTo: string, category?: string): string => {
    if (relationTo === 'products') {
      if (category === 'digital') return '🎹'
      if (category === 'grand') return '🎼'
      if (category === 'hybrid') return '🎛️'
      if (category === 'upright') return '🎵'
      return '🎹'
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

  // Close search when user scrolls
  useEffect(() => {
    if (!isOpen) return

    const handleScroll = () => {
      setIsOpen(false)
      setQuery('')
      setResults([])
      inputRef.current?.blur()
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isOpen])

  // Notify parent when search open state changes
  useEffect(() => {
    onOpenChange?.(isOpen && query.length >= 2)
  }, [isOpen, query, onOpenChange])

  // Navigate to result
  const navigateToResult = useCallback((result: SearchResult) => {
    router.push(getResultUrl(result))
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
      if (!isOpen || filteredResults.length === 0) return

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          setSelectedIndex((prev) => (prev + 1) % filteredResults.length)
          break
        case 'ArrowUp':
          event.preventDefault()
          setSelectedIndex((prev) => (prev - 1 + filteredResults.length) % filteredResults.length)
          break
        case 'Enter':
          event.preventDefault()
          if (filteredResults[selectedIndex]) {
            navigateToResult(filteredResults[selectedIndex])
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
  }, [isOpen, filteredResults, selectedIndex, navigateToResult])

  // Scroll selected item into view
  useEffect(() => {
    const selectedElement = document.getElementById(`search-result-${selectedIndex}`)
    if (selectedElement) {
      selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }, [selectedIndex])

  return (
    <>
      {/* Input Field (stays in header) */}
      <div ref={containerRef} className={cn('relative', className)}>
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
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[10000] bg-black/20"
                onClick={() => setIsOpen(false)}
              />

              {/* Overlay Container */}
              <div className="fixed inset-0 z-[10001] flex items-center justify-center p-8 pointer-events-none">
                <motion.div
                  ref={overlayRef}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full max-w-5xl pointer-events-auto"
                  style={{ height: '70vh', maxHeight: '600px' }}
                >
                {/* Glass Container */}
                <div className="h-full backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 dark:border-white/10 flex flex-col overflow-hidden bg-gradient-to-br from-white/10 via-white/5 to-transparent">

                  {/* Header */}
                  <div className="flex-shrink-0 p-6 pb-4 border-b border-white/20 dark:border-white/10 bg-white/10 backdrop-blur-sm">
                    {/* Search Info */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-kawai-red to-red-700 flex items-center justify-center">
                          <Search className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Search Results
                          </h2>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {query}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <X className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>

                    {/* Category Filters */}
                    <div className="flex items-center gap-2">
                      {(['all', 'products', 'pages'] as CategoryFilter[]).map((category) => (
                        <button
                          key={category}
                          onClick={() => setCategoryFilter(category)}
                          className={cn(
                            'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                            categoryFilter === category
                              ? 'bg-kawai-red text-white shadow-md'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                          )}
                        >
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </button>
                      ))}
                      {filteredResults.length > 0 && (
                        <span className="ml-auto text-sm text-gray-500">
                          {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Results */}
                  <div className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
                    <div className="w-full">
                      {filteredResults.length === 0 && !isLoading ? (
                      <div className="flex flex-col items-center justify-center h-full py-12">
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
                      <div className="space-y-3">
                        {filteredResults.map((result, index) => (
                          <motion.button
                            key={result.id}
                            id={`search-result-${index}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03 }}
                            onClick={() => navigateToResult(result)}
                            className={cn(
                              'w-full p-5 rounded-xl text-left transition-all',
                              'border backdrop-blur-md',
                              index === selectedIndex
                                ? 'bg-gradient-to-r from-kawai-red/20 to-red-600/20 border-kawai-red/50 shadow-lg scale-[1.02]'
                                : 'bg-white/80 dark:bg-gray-900/80 border-white/20 dark:border-white/10 hover:bg-white/90 dark:hover:bg-gray-900/90 hover:scale-[1.01]'
                            )}
                          >
                            <div className="flex items-center gap-5">
                              {/* Image or Icon */}
                              {result.doc.value.imageUrl ? (
                                <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                                  <Image
                                    src={result.doc.value.imageUrl}
                                    alt={result.title}
                                    width={80}
                                    height={80}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="flex-shrink-0 w-20 h-20 rounded-lg bg-white/30 dark:bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                                  <span className="text-4xl">
                                    {getResultIcon(result.doc.relationTo, result.category)}
                                  </span>
                                </div>
                              )}

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 truncate">
                                  {result.title}
                                </h3>
                                {result.excerpt && (
                                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                                    {result.excerpt}
                                  </p>
                                )}
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="inline-flex items-center rounded-full bg-kawai-red/10 px-3 py-1 text-xs font-medium text-kawai-red">
                                    {getCollectionLabel(result.doc.relationTo)}
                                  </span>
                                  {result.category && (
                                    <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 text-xs text-gray-600 dark:text-gray-400">
                                      {result.category}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Selected Indicator */}
                              {index === selectedIndex && (
                                <div className="flex-shrink-0">
                                  <div className="w-8 h-8 rounded-full bg-kawai-red flex items-center justify-center">
                                    <span className="text-white text-sm">→</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    )}
                    </div>
                  </div>

                  {/* Footer Hint */}
                  <div className="flex-shrink-0 px-6 py-4 border-t border-white/20 dark:border-white/10 bg-white/10 backdrop-blur-sm">
                    <div className="flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <kbd className="px-2 py-1 rounded bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700">↑↓</kbd>
                        <span>Navigate</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <kbd className="px-2 py-1 rounded bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700">Enter</kbd>
                        <span>Select</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <kbd className="px-2 py-1 rounded bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700">Esc</kbd>
                        <span>Close</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>,
      document.body
    )}
    </>
  )
}
