'use client'

import { useState, useMemo, useRef, useCallback } from 'react'
import Link from 'next/link'
import { Search, X, Package, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { cn, formatPrice } from '@/lib/utils'
import type { PianoForSelector, AccessoryForPage } from '@/lib/payload/queries'

// ─── Types / constants ────────────────────────────────────────────────────────

interface Props {
  pianos: PianoForSelector[]
  accessories: AccessoryForPage[]
}

const CATEGORIES = ['All', 'Grand', 'Digital', 'Upright', 'Hybrid'] as const
type Category = (typeof CATEGORIES)[number]

const ACCESSORY_TYPE_LABELS: Record<string, string> = {
  bench: 'Bench',
  pedal: 'Pedal',
  cover: 'Cover',
  headphones: 'Headphones',
  stand: 'Stand',
  lamp: 'Lamp',
  other: 'Other',
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function normalizePianoCategory(piano: PianoForSelector): Category | 'Other' {
  const type = piano.type?.toLowerCase()
  if (type === 'grand') return 'Grand'
  if (type === 'shigeru') return 'Grand'
  if (type === 'digital') return 'Digital'
  if (type === 'upright') return 'Upright'
  if (type === 'hybrid') return 'Hybrid'
  const cat = (piano.category ?? '').toLowerCase()
  if (cat.includes('grand') || cat.includes('shigeru')) return 'Grand'
  if (cat.includes('digital') || cat.includes('concert artist')) return 'Digital'
  if (cat.includes('upright') || cat.includes('vertical')) return 'Upright'
  if (cat.includes('hybrid') || cat.includes('anytime') || cat.includes('novus')) return 'Hybrid'
  return 'Other'
}

// ─── Piano Filmstrip Card ─────────────────────────────────────────────────────

function PianoFilmstripCard({
  piano,
  isSelected,
  onSelect,
}: {
  piano: PianoForSelector
  isSelected: boolean
  onSelect: (id: string) => void
}) {
  const categoryLabel = normalizePianoCategory(piano)

  return (
    <motion.button
      onClick={() => onSelect(piano.id)}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        'flex-shrink-0 w-[260px] snap-start text-left focus-visible:outline-none transition-all duration-200 flex flex-col',
        isSelected
          ? 'bg-white shadow-brand-medium ring-1 ring-kawai-neutral'
          : 'bg-white border border-kawai-neutral/60 hover:shadow-brand-subtle',
      )}
      aria-pressed={isSelected}
    >
      {/* Image */}
      <div className="relative bg-white overflow-hidden aspect-[4/3]">
        {piano.imageUrl ? (
          // eslint-disable-next-line
          <img
            src={piano.imageUrl}
            alt={piano.name ?? piano.model}
            className="w-full h-full object-contain p-6"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[#F0EDE8]">
            <svg className="w-10 h-10 text-kawai-charcoal/20" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <rect x="2" y="14" width="28" height="12" rx="1" stroke="currentColor" strokeWidth="1.2" />
              <rect x="4" y="10" width="24" height="4" rx="0.4" stroke="currentColor" strokeWidth="1.2" />
              <rect x="5.5" y="6" width="3" height="7" rx="0.3" fill="currentColor" opacity="0.25" />
              <rect x="10.5" y="6" width="3" height="7" rx="0.3" fill="currentColor" opacity="0.25" />
              <rect x="15.5" y="6" width="3" height="7" rx="0.3" fill="currentColor" opacity="0.25" />
              <rect x="20.5" y="6" width="3" height="7" rx="0.3" fill="currentColor" opacity="0.25" />
            </svg>
          </div>
        )}
        {/* Selected red bottom border */}
        <div className={cn(
          'absolute bottom-0 left-0 right-0 h-[3px] bg-kawai-red transition-transform duration-200 origin-left',
          isSelected ? 'scale-x-100' : 'scale-x-0',
        )} />
      </div>

      {/* Info */}
      <div className="px-5 pt-4 pb-5 flex flex-col gap-1">
        <p className="text-[10px] uppercase tracking-[0.22em] text-kawai-charcoal/45 font-[family-name:var(--font-brand-sans)]">
          {categoryLabel === 'Other' ? (piano.type ?? 'Piano') : categoryLabel}
        </p>
        <div className="flex items-center justify-between">
          <p className={cn(
            'text-xl font-[family-name:var(--font-brand-luxury)] leading-tight transition-colors duration-200',
            isSelected ? 'text-kawai-red' : 'text-kawai-black',
          )}>
            {piano.model}
          </p>
          {isSelected && (
            <motion.span
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-[10px] uppercase tracking-[0.18em] text-kawai-red font-medium font-[family-name:var(--font-brand-sans)]"
            >
              Selected →
            </motion.span>
          )}
        </div>
      </div>
    </motion.button>
  )
}

// ─── Accessory Grid Card ──────────────────────────────────────────────────────

function GridAccessoryCard({ accessory, index }: { accessory: AccessoryForPage; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index, 8) * 0.05, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/products/${accessory.slug ?? accessory.model}`}
        className="group relative flex flex-col bg-kawai-pearl hover:bg-white transition-colors duration-300 h-full"
      >
        {/* Image */}
        <div className="relative aspect-square bg-white overflow-hidden">
          {accessory.accessoryType && (
            <div className="absolute top-3 left-3 z-10">
              <span className="px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] font-[family-name:var(--font-brand-sans)] bg-kawai-black/5 text-kawai-charcoal">
                {ACCESSORY_TYPE_LABELS[accessory.accessoryType] ?? accessory.accessoryType}
              </span>
            </div>
          )}
          {accessory.imageUrl ? (
            // eslint-disable-next-line
            <img
              src={accessory.imageUrl}
              alt={accessory.name ?? accessory.model}
              className="w-full h-full object-contain p-8 transition-all duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#F0EDE8]">
              <Package className="w-10 h-10 text-kawai-charcoal/20" strokeWidth={1} />
              <span className="text-[10px] uppercase tracking-[0.25em] text-kawai-charcoal/30 font-[family-name:var(--font-brand-sans)]">
                {accessory.model}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col flex-1 p-6">
          <p className="text-[10px] uppercase tracking-[0.3em] text-kawai-charcoal/50 mb-1 font-[family-name:var(--font-brand-sans)]">
            {accessory.model}
          </p>
          <h3 className="text-base leading-snug font-[family-name:var(--font-brand-luxury)] text-kawai-black group-hover:text-kawai-red transition-colors duration-200 line-clamp-2 mb-auto">
            {accessory.name ?? accessory.model}
          </h3>
          <div className="mt-4 pt-4 border-t border-kawai-neutral/60">
            {accessory.price?.msrp != null ? (
              <div>
                <span className="text-[10px] font-bold tracking-widest text-kawai-red uppercase font-[family-name:var(--font-brand-sans)]">
                  MSRP
                </span>
                <p className="text-lg font-bold text-kawai-black font-[family-name:var(--font-brand-sans)]">
                  {formatPrice(accessory.price.msrp as number)}
                </p>
              </div>
            ) : (
              <p className="text-sm text-kawai-charcoal/40 font-[family-name:var(--font-brand-sans)]">
                Contact for Price
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function AccessoriesPageContent({ pianos, accessories }: Props) {
  const [selectedPianoId, setSelectedPianoId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const [activeAccessoryType, setActiveAccessoryType] = useState<string | null>(null)
  const [filmstripOpen, setFilmstripOpen] = useState(false)

  const stickyRef = useRef<HTMLDivElement>(null)
  const scrollToFilters = useCallback(() => {
    stickyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const selectedPiano = useMemo(
    () => pianos.find((p) => p.id === selectedPianoId) ?? null,
    [pianos, selectedPianoId],
  )

  const pianoIdsWithAccessories = useMemo(() => {
    const ids = new Set<string>()
    for (const a of accessories) {
      for (const id of a.compatibleProductIds) ids.add(id)
    }
    return ids
  }, [accessories])

  const filteredPianos = useMemo(
    () =>
      pianos.filter((piano) => {
        if (!pianoIdsWithAccessories.has(piano.id)) return false
        if (activeCategory !== 'All' && normalizePianoCategory(piano) !== activeCategory) return false
        if (search.trim()) {
          const q = search.toLowerCase()
          return piano.model.toLowerCase().includes(q) || (piano.name ?? '').toLowerCase().includes(q)
        }
        return true
      }),
    [pianos, pianoIdsWithAccessories, activeCategory, search],
  )

  const compatibleAccessories = useMemo(() => {
    if (!selectedPianoId) return []
    return accessories.filter((a) => a.compatibleProductIds.includes(selectedPianoId))
  }, [accessories, selectedPianoId])

  const availableTypes = useMemo(() => {
    const source = selectedPianoId ? compatibleAccessories : accessories
    const types = Array.from(new Set(source.map((a) => a.accessoryType).filter(Boolean))) as string[]
    const order = ['bench', 'pedal', 'cover', 'headphones', 'stand', 'lamp', 'other']
    return types.sort((a, b) => (order.indexOf(a) ?? 99) - (order.indexOf(b) ?? 99))
  }, [accessories, compatibleAccessories, selectedPianoId])

  const filteredByType = useMemo(() => {
    const source = selectedPianoId ? compatibleAccessories : accessories
    if (!activeAccessoryType) return source
    return source.filter((a) => a.accessoryType === activeAccessoryType)
  }, [accessories, compatibleAccessories, selectedPianoId, activeAccessoryType])

  const handlePianoSelect = (id: string) => {
    setSelectedPianoId((prev) => (prev === id ? null : id))
    setActiveAccessoryType(null)
    scrollToFilters()
  }

  const handleCategorySelect = (cat: Category) => {
    setActiveCategory(cat)
    scrollToFilters()
  }

  const handleTypeSelect = (type: string | null) => {
    setActiveAccessoryType(type)
    scrollToFilters()
  }

  return (
    <div className="min-h-screen bg-kawai-pearl">

      {/* ── 1. Hero ──────────────────────────────────────────────────────── */}
      <section className="bg-kawai-black text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-20 pb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex items-end justify-between"
          >
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-kawai-red font-medium mb-4 font-[family-name:var(--font-brand-sans)]">
                Piano Accessories
              </p>
              <h2 className="text-4xl md:text-[52px] font-[family-name:var(--font-brand-luxury)] leading-none tracking-[-0.01em]">
                Find the perfect<br />complement.
              </h2>
            </div>
            <p className="hidden md:block text-white/25 text-sm max-w-[220px] text-right leading-relaxed font-[family-name:var(--font-brand-sans)]">
              Select a model to discover benches, pedals, covers, and more — matched to your instrument.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── 2. Sticky control panel ──────────────────────────────────────── */}
      <div
        ref={stickyRef}
        className="sticky z-40 bg-white border-b border-kawai-neutral shadow-sm"
        style={{ top: 'var(--header-bottom, 70px)' }}
      >
        {/* Filter by Product trigger row */}
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-12">
            <button
              onClick={() => setFilmstripOpen((o) => !o)}
              className="flex items-center gap-2.5 group focus-visible:outline-none"
              aria-expanded={filmstripOpen}
            >
              <span className="text-[10px] uppercase tracking-[0.22em] font-medium text-kawai-charcoal/50 group-hover:text-kawai-black transition-colors duration-150 font-[family-name:var(--font-brand-sans)]">
                Filter by Product
              </span>
              <motion.div
                animate={{ rotate: filmstripOpen ? 180 : 0 }}
                transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
              >
                <ChevronDown size={14} className="text-kawai-charcoal/40 group-hover:text-kawai-black transition-colors duration-150" />
              </motion.div>
            </button>

            {selectedPiano && (
              <div className="flex items-center gap-3">
                <span className="text-[10px] uppercase tracking-[0.18em] text-kawai-charcoal/40 font-[family-name:var(--font-brand-sans)]">
                  {selectedPiano.model}
                </span>
                <button
                  onClick={() => { setSelectedPianoId(null); setActiveAccessoryType(null) }}
                  className="flex items-center gap-1 text-[10px] uppercase tracking-[0.1em] text-kawai-charcoal/40 hover:text-kawai-red transition-colors duration-150 font-[family-name:var(--font-brand-sans)]"
                  aria-label="Clear selection"
                >
                  <X size={11} />
                  <span>Clear</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Collapsible filmstrip panel */}
        <AnimatePresence initial={false}>
          {filmstripOpen && (
            <motion.div
              key="filmstrip-panel"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden border-t border-kawai-neutral/40"
            >
              {/* Search row */}
              <div className="border-b border-kawai-neutral/60">
                <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center gap-3">
                  <Search className="flex-shrink-0 h-4 w-4 text-kawai-charcoal/40 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search by piano model or series…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full py-3.5 text-sm text-kawai-black placeholder:text-kawai-charcoal/35 bg-transparent focus:outline-none font-[family-name:var(--font-brand-sans)]"
                    aria-label="Search pianos"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch('')}
                      className="flex-shrink-0 text-kawai-charcoal/40 hover:text-kawai-black transition-colors duration-150"
                      aria-label="Clear search"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Category tabs */}
              <div className="max-w-7xl mx-auto px-6 lg:px-10">
                <div className="flex items-center h-11 gap-2">
                  <div className="flex-1 min-w-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <LayoutGroup id="acc-category-tabs">
                      <nav className="flex items-center min-w-max" aria-label="Piano categories">
                        {CATEGORIES.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => handleCategorySelect(cat)}
                            className={cn(
                              'relative px-4 py-2 text-xs uppercase tracking-[0.1em] font-medium transition-colors duration-200',
                              'font-[family-name:var(--font-brand-sans)] focus-visible:outline-2 focus-visible:outline-kawai-red whitespace-nowrap',
                              activeCategory === cat ? 'text-white' : 'text-kawai-charcoal hover:text-kawai-black',
                            )}
                          >
                            {activeCategory === cat && (
                              <motion.span
                                layoutId="acc-cat-pill"
                                className="absolute inset-0 bg-kawai-black"
                                style={{ borderRadius: 0 }}
                                transition={{ type: 'spring', bounce: 0.18, duration: 0.42 }}
                                aria-hidden
                              />
                            )}
                            <span className="relative z-10">{cat}</span>
                          </button>
                        ))}
                      </nav>
                    </LayoutGroup>
                  </div>
                </div>
              </div>

              {/* Piano filmstrip */}
              <div className="border-t border-kawai-neutral/40">
                <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5">
                  {filteredPianos.length === 0 ? (
                    <p className="py-4 text-center text-sm text-kawai-charcoal/40 font-[family-name:var(--font-brand-sans)]">
                      No models match your search.
                    </p>
                  ) : (
                    <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      {filteredPianos.map((piano) => (
                        <PianoFilmstripCard
                          key={piano.id}
                          piano={piano}
                          isSelected={piano.id === selectedPianoId}
                          onSelect={(id) => { handlePianoSelect(id); setFilmstripOpen(false) }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Type filter — only when multiple types present */}
        {availableTypes.length > 1 && (
          <div className="border-t border-kawai-neutral/40">
            <div className="max-w-7xl mx-auto px-6 lg:px-10 py-2.5 flex items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <span className="flex-shrink-0 text-[10px] uppercase tracking-[0.2em] text-kawai-charcoal/40 font-[family-name:var(--font-brand-sans)] mr-3">
                Type
              </span>
              <LayoutGroup id="acc-type-tabs">
                {[null, ...availableTypes].map((type) => (
                  <button
                    key={type ?? 'all'}
                    onClick={() => handleTypeSelect(type)}
                    className={cn(
                      'relative px-3 py-1.5 text-xs uppercase tracking-[0.1em] font-medium transition-colors duration-200',
                      'font-[family-name:var(--font-brand-sans)] focus-visible:outline-2 focus-visible:outline-kawai-red',
                      activeAccessoryType === type ? 'text-white' : 'text-kawai-charcoal hover:text-kawai-black',
                    )}
                  >
                    {activeAccessoryType === type && (
                      <motion.span
                        layoutId="acc-type-pill"
                        className="absolute inset-0 bg-kawai-black"
                        style={{ borderRadius: 0 }}
                        transition={{ type: 'spring', bounce: 0.18, duration: 0.42 }}
                        aria-hidden
                      />
                    )}
                    <span className="relative z-10">
                      {type === null ? 'All' : (ACCESSORY_TYPE_LABELS[type] ?? type)}
                    </span>
                  </button>
                ))}
              </LayoutGroup>
            </div>
          </div>
        )}
      </div>

      {/* ── 3. Collection grid ───────────────────────────────────────────── */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">

          {/* Heading */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedPiano?.id ?? 'all'}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mb-10"
            >
              <p className="text-[10px] tracking-[0.3em] uppercase text-kawai-red font-medium mb-2 font-[family-name:var(--font-brand-sans)]">
                {selectedPiano ? 'Compatible Accessories' : 'Complete Range'}
              </p>
              <div className="flex items-end justify-between">
                <h2 className="text-4xl md:text-5xl font-[family-name:var(--font-brand-luxury)] text-kawai-black leading-none">
                  {selectedPiano ? selectedPiano.model : 'The Collection'}
                </h2>
                <span className="hidden md:block text-sm text-kawai-charcoal/40 font-[family-name:var(--font-brand-sans)] pb-1">
                  {filteredByType.length} {filteredByType.length === 1 ? 'item' : 'items'}
                </span>
              </div>
              <div className="mt-4 w-8 h-px bg-kawai-black/15" />
            </motion.div>
          </AnimatePresence>

          {/* Grid or empty states */}
          {accessories.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-base font-[family-name:var(--font-brand-luxury)] text-kawai-charcoal/40 italic mb-5">
                No accessories available at this time.
              </p>
              <Link href="/find-a-dealer" className="text-[10px] tracking-[0.2em] uppercase font-[family-name:var(--font-brand-sans)] text-kawai-red hover:underline">
                Contact a dealer for recommendations →
              </Link>
            </div>
          ) : filteredByType.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-base font-[family-name:var(--font-brand-luxury)] text-kawai-charcoal/40 italic mb-5">
                {selectedPiano
                  ? `No ${activeAccessoryType ? (ACCESSORY_TYPE_LABELS[activeAccessoryType] ?? activeAccessoryType).toLowerCase() + 's' : 'accessories'} listed for the ${selectedPiano.model} yet.`
                  : `No ${activeAccessoryType ? (ACCESSORY_TYPE_LABELS[activeAccessoryType] ?? activeAccessoryType).toLowerCase() + 's' : 'accessories'} found.`}
              </p>
              <Link href="/find-a-dealer" className="text-[10px] tracking-[0.2em] uppercase font-[family-name:var(--font-brand-sans)] text-kawai-red hover:underline">
                Contact a dealer →
              </Link>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedPiano?.id ?? 'all'}-${activeAccessoryType ?? 'all'}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
              >
                {filteredByType.map((accessory, i) => (
                  <GridAccessoryCard key={accessory.id} accessory={accessory} index={i} />
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>
    </div>
  )
}
