'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { ProductHit } from './types'

const VALID_TYPES = new Set(['digital', 'grand', 'upright', 'hybrid', 'shigeru'])

interface ProductSearchInputProps {
  onPick: (hit: ProductHit) => void
}

export function ProductSearchInput({ onPick }: ProductSearchInputProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ProductHit[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([])
      setLoading(false)
      return
    }
    const controller = new AbortController()
    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=8`, {
          signal: controller.signal,
        })
        if (!res.ok) {
          setResults([])
          return
        }
        const data = await res.json()
        const filtered: ProductHit[] = (data.results ?? [])
          .filter(
            (r: ProductHit) =>
              r.doc?.relationTo === 'products' &&
              r.productType &&
              VALID_TYPES.has(r.productType),
          )
          .slice(0, 6)
        setResults(filtered)
      } catch (err) {
        if ((err as Error).name !== 'AbortError') setResults([])
      } finally {
        setLoading(false)
      }
    }, 200)

    return () => {
      controller.abort()
      clearTimeout(timer)
    }
  }, [query])

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div ref={containerRef} className="relative">
      <label htmlFor="warranty-search" className="sr-only">
        Search by model
      </label>
      <div
        className={cn(
          'flex items-center gap-3 border-b-2 py-3 transition-colors',
          open || query ? 'border-kawai-charcoal' : 'border-kawai-neutral',
        )}
      >
        <Search className="w-5 h-5 text-kawai-charcoal/40 shrink-0" />
        <input
          ref={inputRef}
          id="warranty-search"
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search your model — CA901, K-300, GX-2…"
          className="flex-1 bg-transparent outline-none text-lg text-kawai-charcoal placeholder:text-kawai-charcoal/40"
          autoComplete="off"
        />
        {loading && <Loader2 className="w-4 h-4 text-kawai-charcoal/40 animate-spin shrink-0" />}
        {query && !loading && (
          <button
            onClick={() => {
              setQuery('')
              setResults([])
              inputRef.current?.focus()
            }}
            aria-label="Clear"
            className="text-kawai-charcoal/40 hover:text-kawai-charcoal transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Results — minimal list, no card chrome */}
      {open && results.length > 0 && (
        <ul
          role="listbox"
          className="absolute z-20 left-0 right-0 mt-1 bg-white border border-kawai-neutral rounded-lg shadow-sm overflow-hidden"
        >
          {results.map((hit) => (
            <li key={hit.id}>
              <button
                onClick={() => onPick(hit)}
                className="w-full flex items-center gap-4 px-4 py-3 hover:bg-kawai-pearl transition-colors text-left"
              >
                <div className="w-10 h-10 bg-kawai-pearl rounded shrink-0 relative overflow-hidden">
                  {hit.productImageUrl ? (
                    <Image
                      src={hit.productImageUrl}
                      alt=""
                      fill
                      className="object-contain"
                      sizes="40px"
                      unoptimized
                    />
                  ) : null}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-kawai-charcoal truncate">
                    {hit.productModel ? hit.productModel.toUpperCase() : hit.title}
                  </p>
                  <p className="text-[12px] text-kawai-charcoal/50 truncate">{hit.title}</p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Empty result state */}
      {open && query.length >= 2 && !loading && results.length === 0 && (
        <p className="absolute z-20 left-0 right-0 mt-2 text-[13px] text-kawai-charcoal/50">
          No piano found. Try a model number like CA901 or K-300, or pick a category below.
        </p>
      )}
    </div>
  )
}
