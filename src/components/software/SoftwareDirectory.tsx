'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { buildTree, filterModels, SERIES_LABELS } from '@/lib/software/grouping'
import type { SoftwareModel } from '@/lib/software/types'
import { ModelRow } from './ModelRow'

interface Props {
  models: SoftwareModel[]
}

/**
 * The /software register: a sticky series index with search, and one ruled list of
 * every instrument.
 *
 * Filtering runs entirely on the client over ~55 records, so typing is instant and
 * the index prunes itself — `buildTree` drops empty groups, so searching "nv"
 * collapses the page to Hybrid Pianos alone.
 */
export function SoftwareDirectory({ models }: Props) {
  const [query, setQuery] = useState('')
  const [activeSeries, setActiveSeries] = useState<string | null>(null)

  const filtered = useMemo(() => filterModels(models, query), [models, query])
  const tree = useMemo(() => buildTree(filtered), [filtered])

  const sectionRefs = useRef(new Map<string, HTMLElement>())
  const registerSection = useCallback((key: string, el: HTMLElement | null) => {
    if (el) sectionRefs.current.set(key, el)
    else sectionRefs.current.delete(key)
  }, [])

  // Scroll-spy. Driven by scroll position rather than IntersectionObserver: the
  // series headings are sticky, so they never leave the top of the viewport and an
  // observer would either never fire or report every heading at once. Instead, the
  // active series is simply the last one whose section has passed the read line.
  useEffect(() => {
    let frame = 0

    const update = () => {
      frame = 0
      const READ_LINE = 140
      let current: string | null = null
      for (const [key, el] of sectionRefs.current) {
        if (el.getBoundingClientRect().top <= READ_LINE) current = key
      }
      setActiveSeries(current)
    }

    const onScroll = () => {
      if (frame === 0) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      if (frame !== 0) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [tree])

  const jumpTo = useCallback((key: string) => {
    const el = sectionRefs.current.get(key)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setActiveSeries(key)
  }, [])

  return (
    <>
      <section className="bg-kawai-black">
        <div className="mx-auto w-full max-w-7xl px-4 pb-11 pt-12 sm:px-6 sm:pb-12 sm:pt-14 lg:px-8">
          <h1 className="font-[family-name:var(--font-brand-serif)] text-5xl leading-[1.05] text-white sm:text-6xl">
            Software &amp; firmware
          </h1>
          <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-white/65">
            System updates for Kawai digital and hybrid instruments with a ‘USB to Device’ port.
            Find your model, then read the instructions before you begin.
          </p>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-14">
          {/* Index — sticky, with search pinned to its top. */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <SearchField id="software-search" value={query} onChange={setQuery} />
              <nav
                aria-label="Instrument series"
                className="mt-8 max-h-[calc(100vh-15rem)] overflow-y-auto pb-6"
              >
                {tree.map((cat) => (
                  <div key={cat.category} className="mb-7 last:mb-0">
                    <div className="mb-2.5 text-[13px] font-medium text-kawai-black">
                      {cat.label}
                    </div>
                    <ul>
                      {cat.series.map((s) => {
                        const key = `${cat.category}:${s.series}`
                        const isActive = activeSeries === key
                        return (
                          <li key={key}>
                            <button
                              type="button"
                              onClick={() => jumpTo(key)}
                              aria-current={isActive ? 'true' : undefined}
                              className={[
                                'flex w-full items-baseline justify-between border-l py-1.5 pl-3.5 pr-1 text-left text-[13px] transition-colors',
                                isActive
                                  ? 'border-kawai-red font-medium text-kawai-red'
                                  : 'border-kawai-neutral text-kawai-charcoal/80 hover:border-kawai-charcoal hover:text-kawai-black',
                              ].join(' ')}
                            >
                              <span>{SERIES_LABELS[s.series] ?? s.series}</span>
                              <span className="ml-2 tabular-nums text-kawai-charcoal/45">
                                {s.count}
                              </span>
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                ))}
              </nav>
            </div>
          </aside>

          <div className="min-w-0 max-w-4xl">
            <div className="mb-8 lg:hidden">
              <SearchField id="software-search-mobile" value={query} onChange={setQuery} />
            </div>

            {/* Result count is announced, not displayed — the pruned list is the visual answer. */}
            <p role="status" aria-live="polite" className="sr-only">
              {query.trim() === ''
                ? `Showing all ${models.length} instruments`
                : `${filtered.length} instruments match ${query}`}
            </p>

            {tree.length === 0 ? (
              <EmptyState query={query} onClear={() => setQuery('')} />
            ) : (
              tree.map((cat) => (
                <section key={cat.category} className="mb-16 last:mb-0">
                  <h2 className="border-b-2 border-kawai-black pb-2 text-sm font-medium text-kawai-black">
                    {cat.label}
                  </h2>

                  {cat.series.map((s) => {
                    const key = `${cat.category}:${s.series}`
                    return (
                      <section
                        key={key}
                        data-series-key={key}
                        ref={(el) => registerSection(key, el)}
                        className="mt-7 scroll-mt-24 first:mt-5"
                      >
                        {/* Sticky so the series you are reading stays named while you scroll. */}
                        <h3 className="sticky top-20 z-10 -mx-2 border-b border-kawai-neutral/60 bg-kawai-pearl/95 px-2 pb-1.5 pt-2 text-[13px] font-medium text-kawai-charcoal backdrop-blur-sm">
                          {SERIES_LABELS[s.series] ?? s.series}
                        </h3>
                        <div>
                          {s.models.map((m) => (
                            <ModelRow key={m.slug} model={m} />
                          ))}
                        </div>
                      </section>
                    )
                  })}
                </section>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  )
}

function SearchField({
  id,
  value,
  onChange,
}: {
  id: string
  value: string
  onChange: (next: string) => void
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[13px] font-medium text-kawai-black">
        Find your model
      </label>
      <div className="relative">
        <SearchIcon />
        <input
          id={id}
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="ES920, CA701…"
          aria-label="Search for your Kawai model"
          className="h-11 w-full rounded-sm border border-kawai-neutral bg-white pl-9 pr-3 text-[15px] text-kawai-black shadow-sm transition-colors placeholder:text-kawai-charcoal/40 hover:border-kawai-charcoal/50 focus:border-kawai-red focus:outline-none focus:ring-2 focus:ring-kawai-red/15"
        />
        {value ? (
          <button
            type="button"
            onClick={() => onChange('')}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-sm text-kawai-charcoal/60 transition-colors hover:bg-kawai-pearl hover:text-kawai-black"
          >
            <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
              <path d="m4 4 8 8M12 4l-8 8" />
            </svg>
          </button>
        ) : null}
      </div>
    </div>
  )
}

function EmptyState({ query, onClear }: { query: string; onClear: () => void }) {
  return (
    <div className="border-t border-kawai-neutral/60 py-16">
      <p className="text-[15px] text-kawai-black">No instrument matches “{query}”.</p>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-kawai-charcoal/75">
        Search the model number printed on the instrument, such as ES920 or CA701. Only models
        with a ‘USB to Device’ port receive firmware updates.
      </p>
      <button
        type="button"
        onClick={onClear}
        className="mt-5 text-sm text-kawai-red underline underline-offset-4 transition-colors hover:text-kawai-red-700"
      >
        Clear search
      </button>
    </div>
  )
}

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-kawai-charcoal/50"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <circle cx="7" cy="7" r="4.5" />
      <path d="m10.5 10.5 3 3" />
    </svg>
  )
}
