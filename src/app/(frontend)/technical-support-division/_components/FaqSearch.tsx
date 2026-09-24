'use client'

import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
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

/** The register itself, offered when the query names the errand, not a model. */
interface SoftwareDestination {
  title: string
  description: string
  href: string
}

/** A firmware match resolves to an anchor on /software, not a page of its own. */
interface FirmwareResult {
  slug: string
  model: string
  series: string
  categoryLabel: string
  versions: string
}

export interface FaqSearchProps {
  placeholder?: string
  autoFocus?: boolean
  variant?: 'hero' | 'inline' | 'landing' | 'floating'
  backHref?: string
  backLabel?: string
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
  backHref,
  backLabel = 'Support Center',
}: FaqSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [firmware, setFirmware] = useState<FirmwareResult[]>([])
  const [destination, setDestination] = useState<SoftwareDestination | null>(null)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const router = useRouter()

  const search = useCallback((q: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (q.length < 2) { setResults([]); setFirmware([]); setDestination(null); setOpen(false); setLoading(false); return }
    setLoading(true)
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/faq-search?q=${encodeURIComponent(q)}`)
        const data = await res.json()
        setResults(data.docs ?? [])
        setFirmware(data.firmware ?? [])
        setDestination(data.destination ?? null)
        setOpen(true)
        setActiveIndex(-1)
      } catch { setResults([]); setFirmware([]); setDestination(null) }
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

  // One flat list of destinations in rendered order — answers first, then firmware —
  // so arrow keys walk both sections as a single run. Entries stay index-aligned with
  // the rendered rows (a slug-less FAQ still holds its slot as null).
  const navHrefs = useMemo(
    () => [
      ...(destination ? [destination.href] : []),
      ...results.map((r) => (r.slug ? `/faq/${r.slug}` : null)),
      ...firmware.map((f) => `/software#${f.slug}`),
    ],
    [destination, results, firmware],
  )

  /** Rows above the answers, so the answer list can offset its own indices. */
  const leadCount = destination ? 1 : 0

  const hasAnything = results.length > 0 || firmware.length > 0 || destination !== null

  const go = useCallback((href: string | null) => {
    if (!href) return
    router.push(href)
    setOpen(false)
    setQuery('')
  }, [router])

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') { setQuery(''); setOpen(false); return }
    if (!open || navHrefs.length === 0) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(i => Math.min(i + 1, navHrefs.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(i => Math.max(i - 1, -1)) }
    if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault()
      go(navHrefs[activeIndex] ?? null)
    }
  }

  const isHero = variant === 'hero'
  const isLanding = variant === 'landing'
  const isFloating = variant === 'floating'

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Input */}
      <div className="relative group">
        <div className={cn(
          'absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none z-10',
          isFloating && 'left-4',
        )}>
          <svg
            className={cn(
              'transition-all duration-200',
              isFloating ? 'w-4 h-4' : 'w-5 h-5',
              loading
                ? 'animate-pulse text-kawai-red'
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
          onFocus={() => hasAnything && setOpen(true)}
          aria-label="Search support articles and firmware"
          placeholder={placeholder}
          className={cn(
            'w-full font-[family-name:var(--font-brand-sans)] transition-all duration-200 focus:outline-none',
            // Landing variant — prominent pill, large
            isLanding && 'h-16 pl-14 pr-12 rounded-full text-lg bg-white border border-kawai-neutral/70 text-kawai-black placeholder:text-kawai-charcoal/30 shadow-sm focus:ring-2 focus:ring-kawai-red/15 focus:border-kawai-red/40',
            // Hero variant
            isHero && 'h-16 pl-14 pr-12 rounded-2xl text-base bg-white border border-kawai-neutral/70 text-kawai-black placeholder:text-kawai-charcoal/30 shadow-sm focus:ring-2 focus:ring-kawai-red/15 focus:border-kawai-red/40',
            // Floating variant — compact, light for white bar bg
            isFloating && 'h-10 pl-10 pr-10 rounded-xl text-sm bg-white border border-kawai-neutral/50 text-kawai-black placeholder:text-kawai-charcoal/30 focus:border-kawai-red/40 focus:ring-2 focus:ring-kawai-red/10 focus:outline-none',
            // Inline variant
            !isLanding && !isHero && !isFloating && 'h-16 pl-14 pr-12 rounded-2xl text-base bg-white border border-kawai-neutral/70 text-kawai-black placeholder:text-kawai-charcoal/30 shadow-sm focus:ring-2 focus:ring-kawai-red/15 focus:border-kawai-red/40',
          )}
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setOpen(false); inputRef.current?.focus() }}
            className={cn(
              'absolute right-5 top-1/2 -translate-y-1/2 transition-colors',
              isFloating && 'right-3',
              'text-kawai-charcoal/30 hover:text-kawai-charcoal/60'
            )}
            aria-label="Clear search"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Back link — shown below input on hero variant when backHref provided */}
      {backHref && isHero && (
        <div className="mt-3">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-kawai-black/60 hover:text-kawai-black transition-colors duration-200 text-[11px] tracking-[0.2em] uppercase font-[family-name:var(--font-brand-sans)]"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            {backLabel}
          </Link>
        </div>
      )}

      {/* Dropdown — search engine results style */}
      <AnimatePresence>
        {open && hasAnything && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-kawai-neutral/50 shadow-2xl overflow-hidden z-30 max-h-[70vh] overflow-y-auto"
          >
            {/* A query that names the errand outright — "firmware", "software update" —
                is asking for the register itself, so the page leads the list. */}
            {destination && (
              <ul
                role="listbox"
                aria-label="Software pages"
                className={cn(
                  'divide-y divide-kawai-neutral/30',
                  (results.length > 0 || firmware.length > 0) && 'border-b-2 border-kawai-neutral/50',
                )}
              >
                <li role="option" aria-selected={activeIndex === 0}>
                  <button
                    onClick={() => go(destination.href)}
                    onMouseEnter={() => setActiveIndex(0)}
                    className={cn(
                      'group w-full text-left px-5 py-4 transition-colors duration-100',
                      activeIndex === 0 ? 'bg-kawai-pearl' : 'hover:bg-kawai-pearl/50'
                    )}
                  >
                    <p className="text-[10px] text-kawai-red/60 font-medium mb-1 font-[family-name:var(--font-brand-sans)]">
                      kawaius.com › software
                    </p>
                    <p className="text-sm font-semibold text-kawai-black leading-snug mb-1 font-[family-name:var(--font-brand-sans)] group-hover:text-kawai-red transition-colors duration-100">
                      {destination.title}
                    </p>
                    <p className="text-xs text-kawai-charcoal/50 line-clamp-2 leading-relaxed font-[family-name:var(--font-brand-sans)]">
                      {destination.description}
                    </p>
                  </button>
                </li>
              </ul>
            )}

            {/* Answers next — a question is what most people arrive with. */}
            {results.length > 0 && (
              <ul role="listbox" aria-label="Support answers" className="divide-y divide-kawai-neutral/30">
                {results.map((result, i) => {
                  const index = leadCount + i
                  const cat = Array.isArray(result.categories) && result.categories.length > 0
                    ? result.categories[0]
                    : null
                  const hubLabel = result.supportHub ? HUB_LABEL[result.supportHub] : null

                  // Build breadcrumb path string
                  const pathParts = ['support']
                  if (hubLabel) pathParts.push(hubLabel)
                  if (cat?.name) pathParts.push(cat.name)
                  const pathString = pathParts.join(' › ')

                  return (
                    <li key={result.id} role="option" aria-selected={activeIndex === index}>
                      <button
                        onClick={() => go(result.slug ? `/faq/${result.slug}` : null)}
                        onMouseEnter={() => setActiveIndex(index)}
                        className={cn(
                          'group w-full text-left px-5 py-4 transition-colors duration-100',
                          activeIndex === index ? 'bg-kawai-pearl' : 'hover:bg-kawai-pearl/50'
                        )}
                      >
                        {/* Path breadcrumb — like Google's green URL */}
                        <p className="text-[10px] text-kawai-red/60 font-medium mb-1 font-[family-name:var(--font-brand-sans)]">
                          kawaius.com › {pathString}
                        </p>

                        {/* Question — the search result title */}
                        <p className="text-sm font-semibold text-kawai-black leading-snug mb-1 font-[family-name:var(--font-brand-sans)] group-hover:text-kawai-red transition-colors duration-100">
                          {result.question}
                        </p>

                        {/* Excerpt — the snippet */}
                        {result.excerpt && (
                          <p className="text-xs text-kawai-charcoal/50 line-clamp-2 leading-relaxed font-[family-name:var(--font-brand-sans)]">
                            {result.excerpt}
                          </p>
                        )}
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}

            {/* Firmware — its own section, under the answers. */}
            {firmware.length > 0 && (
              <div className={cn((results.length > 0 || destination) && 'border-t-2 border-kawai-neutral/50')}>
                <div className="flex items-center gap-2 bg-kawai-pearl/60 px-5 py-2.5">
                  <FirmwareIcon className="h-3.5 w-3.5 flex-shrink-0 text-kawai-red" />
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-kawai-charcoal/50 font-[family-name:var(--font-brand-sans)]">
                    Software &amp; Firmware
                  </p>
                </div>

                <ul role="listbox" aria-label="Firmware downloads" className="divide-y divide-kawai-neutral/30">
                  {firmware.map((fw, i) => {
                    const index = leadCount + results.length + i
                    return (
                      <li key={fw.slug} role="option" aria-selected={activeIndex === index}>
                        <button
                          onClick={() => go(`/software#${fw.slug}`)}
                          onMouseEnter={() => setActiveIndex(index)}
                          className={cn(
                            'group w-full text-left px-5 py-4 transition-colors duration-100',
                            activeIndex === index ? 'bg-kawai-pearl' : 'hover:bg-kawai-pearl/50'
                          )}
                        >
                          <p className="text-[10px] text-kawai-red/60 font-medium mb-1 font-[family-name:var(--font-brand-sans)]">
                            kawaius.com › software › {fw.categoryLabel}
                          </p>

                          <p className="text-sm font-semibold text-kawai-black leading-snug mb-1 font-[family-name:var(--font-brand-sans)] group-hover:text-kawai-red transition-colors duration-100">
                            {fw.model}
                            <span className="ml-2 font-normal text-kawai-charcoal/50">
                              system update
                            </span>
                          </p>

                          {fw.versions && (
                            <p className="text-xs text-kawai-charcoal/50 leading-relaxed font-[family-name:var(--font-brand-sans)]">
                              {fw.versions}
                            </p>
                          )}
                        </button>
                      </li>
                    )
                  })}
                </ul>

                {!destination && (
                  <Link
                    href="/software"
                    onClick={() => { setOpen(false); setQuery('') }}
                    className="flex items-center justify-between gap-2 border-t border-kawai-neutral/30 px-5 py-3 text-xs font-medium text-kawai-charcoal/50 transition-colors hover:bg-kawai-pearl/50 hover:text-kawai-black font-[family-name:var(--font-brand-sans)]"
                  >
                    Browse all software &amp; firmware
                    <span aria-hidden="true">→</span>
                  </Link>
                )}
              </div>
            )}
          </motion.div>
        )}

        {open && query.length >= 2 && !loading && !hasAnything && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-kawai-neutral/50 shadow-2xl overflow-hidden z-30 px-5 py-6 text-center"
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

function FirmwareIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <path d="M15 2v2M9 2v2M15 20v2M9 20v2M2 15h2M2 9h2M20 15h2M20 9h2" />
    </svg>
  )
}
