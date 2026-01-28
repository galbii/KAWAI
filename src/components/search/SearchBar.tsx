'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, X, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

interface SearchResult {
  id: string
  title: string
  doc: {
    value: {
      slug: string
      category?: string
      tags?: string[]
    }
    relationTo: 'pages'
  }
  excerpt?: string
}

interface SearchBarProps {
  className?: string
}

export function SearchBar({ className }: SearchBarProps) {
  // State management
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Auto-focus search input on mount
  useEffect(() => {
    // Small delay to ensure header animation completes
    const timer = setTimeout(() => {
      inputRef.current?.focus()
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Debounced search effect (300ms)
  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      setIsOpen(false)
      return
    }

    setIsLoading(true)
    const timeoutId = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        if (!response.ok) throw new Error('Search failed')

        const data = await response.json()
        setResults(data.results || [])
        setIsOpen(true)
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

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Navigate to result
  const navigateToResult = useCallback((result: SearchResult) => {
    router.push(`/${result.doc.value.slug}`)
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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen || results.length === 0) return

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          setSelectedIndex((prev) => (prev + 1) % results.length)
          break
        case 'ArrowUp':
          event.preventDefault()
          setSelectedIndex((prev) => (prev - 1 + results.length) % results.length)
          break
        case 'Enter':
          event.preventDefault()
          if (results[selectedIndex]) {
            navigateToResult(results[selectedIndex])
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
  }, [isOpen, results, selectedIndex, navigateToResult])

  // Scroll selected item into view
  useEffect(() => {
    const selectedElement = document.getElementById(`search-result-${selectedIndex}`)
    if (selectedElement) {
      selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }, [selectedIndex])

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* Search Input */}
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
          onFocus={() => query.length >= 2 && results.length > 0 && setIsOpen(true)}
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

      {/* Results Dropdown with AnimatePresence */}
      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'absolute left-0 right-0 z-50 mt-2 max-h-96 overflow-y-auto',
              'rounded-md border border-gray-200 bg-white shadow-lg',
              'divide-y divide-gray-100'
            )}
          >
            {results.map((result, index) => (
              <button
                key={result.id}
                id={`search-result-${index}`}
                onClick={() => navigateToResult(result)}
                className={cn(
                  'w-full px-4 py-3 text-left transition-colors',
                  'hover:bg-gray-50 focus:bg-gray-50 focus:outline-none',
                  index === selectedIndex && 'bg-gray-50'
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {result.title}
                    </h3>
                    {result.excerpt && (
                      <p className="mt-1 text-xs text-gray-600 line-clamp-2">
                        {result.excerpt}
                      </p>
                    )}
                    <div className="mt-2 flex flex-wrap gap-2">
                      {result.doc.value.category && (
                        <span className="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                          {result.doc.value.category}
                        </span>
                      )}
                      {result.doc.value.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Search className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* No Results State */}
      <AnimatePresence>
        {isOpen && !isLoading && query.length >= 2 && results.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'absolute left-0 right-0 z-50 mt-2',
              'rounded-md border border-gray-200 bg-white shadow-lg',
              'px-4 py-8 text-center'
            )}
          >
            <Search className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No results found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search terms or browse our collections
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
