'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CategoryItem {
  id: string
  name: string
  slug: string
  color?: string | null
}

interface SearchResult {
  id: string
  question: string
  slug: string | null
  excerpt?: string | null
  supportHub?: 'owner-hub' | 'buyer-hub' | 'technician-resources' | null
  categories?: CategoryItem[]
}

export interface FaqSearchProps {
  placeholder?: string
  autoFocus?: boolean
  variant?: 'hero' | 'inline'
}

const HUB_LABEL: Record<string, string> = {
  'owner-hub': 'Owner Hub',
  'buyer-hub': 'Buyer Hub',
  'technician-resources': 'Technician',
}

export function FaqSearch({
  placeholder = 'Search for answers…',
  autoFocus = false,
  variant = 'inline',
}: FaqSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const router = useRouter()

  const search = useCallback((q: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (q.length < 2) { setResults([]); setOpen(false); setLoading(false); return }
    setLoading(true)
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/faq-search?q=${encodeURIComponent(q)}`)
        const data = await res.json()
        setResults(data.docs ?? [])
        setOpen(true)
        setActiveIndex(-1)
      } catch { setResults([]) }
      finally { setLoading(false) }
    }, 300)
  }, [])

  useEffect(() => {
    search(query)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query, search])

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [])

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') { setQuery(''); setOpen(false); return }
    if (!open || !results.length) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(i => Math.min(i + 1, results.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(i => Math.max(i - 1, -1)) }
    if (e.key === 'Enter' && activeIndex >= 0) {
      const r = results[activeIndex]
      if (r?.slug) { router.push(`/faq/${r.slug}`); setOpen(false) }
    }
  }

  function navigateTo(slug: string | null) {
    if (slug) { router.push(`/faq/${slug}`); setOpen(false); setQuery('') }
  }

  const isHero = variant === 'hero'

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Input */}
      <div className="relative group">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none z-10">
          <svg
            className={cn(
              'w-5 h-5 transition-all duration-200',
              loading
                ? 'animate-pulse text-kawai-red'
                : isHero
                  ? 'text-white/50 group-focus-within:text-white/80'
                  : 'text-kawai-charcoal/40 group-focus-within:text-kawai-charcoal/70'
            )}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="search"
          autoFocus={autoFocus}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder={placeholder}
          className={cn(
            'w-full h-16 pl-14 pr-12 rounded-2xl text-base font-[family-name:var(--font-brand-sans)] transition-all duration-200 focus:outline-none',
            isHero
              ? 'bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-white/40 focus:bg-white/15 focus:border-white/50 focus:ring-2 focus:ring-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)]'
              : 'bg-white border border-kawai-neutral/70 text-kawai-black placeholder:text-kawai-charcoal/30 shadow-sm focus:ring-2 focus:ring-kawai-red/15 focus:border-kawai-red/40'
          )}
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setOpen(false); inputRef.current?.focus() }}
            className={cn(
              'absolute right-5 top-1/2 -translate-y-1/2 transition-colors',
              isHero ? 'text-white/40 hover:text-white/70' : 'text-kawai-charcoal/30 hover:text-kawai-charcoal/60'
            )}
            aria-label="Clear search"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown — always white */}
      <AnimatePresence>
        {open && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-kawai-neutral/50 shadow-2xl overflow-hidden z-50"
          >
            <ul role="listbox" className="py-1">
              {results.map((result, i) => {
                const cat = Array.isArray(result.categories) && result.categories.length > 0
                  ? result.categories[0]
                  : null
                const hubLabel = result.supportHub ? HUB_LABEL[result.supportHub] : null

                return (
                  <li key={result.id} role="option" aria-selected={activeIndex === i}>
                    <button
                      onClick={() => navigateTo(result.slug)}
                      onMouseEnter={() => setActiveIndex(i)}
                      className={cn(
                        'w-full text-left px-4 py-3.5 flex items-start gap-3.5 transition-colors duration-100',
                        activeIndex === i ? 'bg-kawai-pearl' : 'hover:bg-kawai-pearl/50'
                      )}
                    >
                      {/* Question mark icon */}
                      <div className="flex-shrink-0 mt-0.5 w-7 h-7 rounded-lg bg-kawai-pearl flex items-center justify-center">
                        <svg className="w-3.5 h-3.5 text-kawai-charcoal/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                        </svg>
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Badges row */}
                        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                          {cat && (
                            <span
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-md"
                              style={cat.color
                                ? { backgroundColor: `${cat.color}18`, color: cat.color }
                                : { backgroundColor: '#f0f0f0', color: '#666' }
                              }
                            >
                              {cat.name}
                            </span>
                          )}
                          {hubLabel && (
                            <span className="text-[10px] text-kawai-charcoal/40 font-medium">
                              {hubLabel}
                            </span>
                          )}
                        </div>
                        {/* Question */}
                        <p className="text-sm font-medium text-kawai-black leading-snug font-[family-name:var(--font-brand-sans)]">
                          {result.question}
                        </p>
                        {/* Excerpt */}
                        {result.excerpt && (
                          <p className="text-xs text-kawai-charcoal/50 mt-0.5 line-clamp-1 font-[family-name:var(--font-brand-sans)]">
                            {result.excerpt}
                          </p>
                        )}
                      </div>

                      <svg className="w-3.5 h-3.5 text-kawai-charcoal/25 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </li>
                )
              })}
            </ul>
            <div className="px-4 py-2 border-t border-kawai-neutral/30 bg-kawai-pearl/40 flex items-center justify-between">
              <p className="text-[10px] text-kawai-charcoal/35 font-[family-name:var(--font-brand-sans)]">
                ↑↓ navigate · Enter to open · Esc to close
              </p>
              <p className="text-[10px] text-kawai-charcoal/35 font-[family-name:var(--font-brand-sans)]">
                {results.length} result{results.length !== 1 ? 's' : ''}
              </p>
            </div>
          </motion.div>
        )}

        {open && query.length >= 2 && !loading && results.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-kawai-neutral/50 shadow-2xl overflow-hidden z-50 px-5 py-6 text-center"
          >
            <p className="text-sm font-medium text-kawai-black mb-1 font-[family-name:var(--font-brand-sans)]">
              No results for &ldquo;{query}&rdquo;
            </p>
            <p className="text-xs text-kawai-charcoal/40 font-[family-name:var(--font-brand-sans)]">
              Try different keywords or browse a topic below
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
