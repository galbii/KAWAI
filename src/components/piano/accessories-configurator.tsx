'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Check, Plus, Minus, ArrowRight, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn, formatPrice } from '@/lib/utils'
import type { PianoForSelector, AccessoryForPage, AccessoryVariation } from '@/lib/payload/queries'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  pianos: PianoForSelector[]
  accessories: AccessoryForPage[]
}

// Map<accessoryId, variationIndex | null>
// presence in map = equipped; null value = no variants on this accessory
type EquippedMap = Map<string, number | null>

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

const TYPE_ORDER = ['bench', 'pedal', 'cover', 'headphones', 'stand', 'lamp', 'other']

// ─── Helpers ─────────────────────────────────────────────────────────────────

function normalizePianoCategory(piano: PianoForSelector): Category | 'Other' {
  const type = piano.type?.toLowerCase()
  if (type === 'grand' || type === 'shigeru') return 'Grand'
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

function resolvePrice(
  accessory: AccessoryForPage,
  variationIndex: number | null,
): number | null {
  const hasMultiVariants = accessory.variations.length > 1
  if (hasMultiVariants && variationIndex !== null) {
    return accessory.variations[variationIndex]?.price ?? accessory.price?.msrp ?? null
  }
  // single variation — use its price if present
  if (accessory.variations.length === 1) {
    return accessory.variations[0]?.price ?? accessory.price?.msrp ?? null
  }
  return accessory.price?.msrp ?? null
}

function resolveImage(accessory: AccessoryForPage, variationIndex: number | null): string | null {
  const hasMultiVariants = accessory.variations.length > 1
  if (hasMultiVariants && variationIndex !== null) {
    const varImg = accessory.variations[variationIndex]?.imageUrl
    if (varImg) return varImg
  }
  return accessory.imageUrl ?? null
}

// ─── Piano Card ───────────────────────────────────────────────────────────────

function PianoCard({
  piano,
  isSelected,
  onSelect,
}: {
  piano: PianoForSelector
  isSelected: boolean
  onSelect: () => void
}) {
  return (
    <button
      onClick={onSelect}
      aria-pressed={isSelected}
      className={cn(
        'relative text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kawai-red transition-all duration-200',
        isSelected
          ? 'ring-2 ring-kawai-red'
          : 'ring-1 ring-white/10 hover:ring-white/30',
      )}
    >
      {/* Image */}
      <div className="relative aspect-square bg-[#1b1916] overflow-hidden">
        {piano.imageUrl ? (
          <Image
            src={piano.imageUrl}
            alt={piano.name ?? piano.model}
            fill
            className="object-contain p-3 transition-transform duration-300 group-hover:scale-[1.04]"
            sizes="(max-width: 640px) 33vw, (max-width: 1024px) 20vw, 14vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-7 h-7 text-white/10"
              viewBox="0 0 32 32"
              fill="none"
              aria-hidden="true"
            >
              <rect x="2" y="14" width="28" height="12" rx="1" stroke="currentColor" strokeWidth="1.2" />
              <rect x="4" y="10" width="24" height="4" rx="0.4" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </div>
        )}

        {/* Selected check badge */}
        {isSelected && (
          <div className="absolute top-2 right-2 w-5 h-5 bg-kawai-red flex items-center justify-center">
            <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
          </div>
        )}
      </div>

      {/* Label */}
      <div
        className={cn(
          'px-2.5 py-2 transition-colors duration-200',
          isSelected ? 'bg-kawai-red' : 'bg-[#1b1916] group-hover:bg-white/5',
        )}
      >
        <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-white truncate font-[family-name:var(--font-brand-sans)]">
          {piano.model}
        </p>
      </div>
    </button>
  )
}

// ─── Variation Picker ─────────────────────────────────────────────────────────

function VariationPicker({
  variations,
  selectedIndex,
  onChange,
}: {
  variations: AccessoryVariation[]
  selectedIndex: number
  onChange: (index: number) => void
}) {
  return (
    <div className="flex flex-wrap gap-1.5 mt-2.5">
      {variations.map((v, i) => {
        const isUnavailable = v.available === false
        const isActive = selectedIndex === i
        return (
          <button
            key={v.id ?? i}
            onClick={() => !isUnavailable && onChange(i)}
            disabled={isUnavailable}
            title={isUnavailable ? `${v.name} — unavailable` : v.name}
            className={cn(
              'px-2.5 py-1 text-[10px] uppercase tracking-[0.1em] font-medium transition-all duration-150',
              'font-[family-name:var(--font-brand-sans)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-kawai-red',
              isActive
                ? 'bg-kawai-black text-white'
                : isUnavailable
                ? 'bg-kawai-neutral/30 text-kawai-charcoal/25 cursor-not-allowed line-through'
                : 'bg-kawai-neutral/50 text-kawai-charcoal hover:bg-kawai-black hover:text-white',
            )}
          >
            {v.name}
          </button>
        )
      })}
    </div>
  )
}

// ─── Accessory Equip Row ──────────────────────────────────────────────────────

function AccessoryEquipRow({
  accessory,
  isEquipped,
  variationIndex,
  onToggle,
  onVariationChange,
}: {
  accessory: AccessoryForPage
  isEquipped: boolean
  variationIndex: number | null
  onToggle: () => void
  onVariationChange: (index: number) => void
}) {
  const hasMultiVariants = accessory.variations.length > 1
  const effectiveVarIdx = hasMultiVariants ? (variationIndex ?? 0) : null
  const price = resolvePrice(accessory, effectiveVarIdx)
  const imageUrl = resolveImage(accessory, effectiveVarIdx)

  return (
    <motion.div
      layout
      className={cn(
        'flex gap-4 p-4 transition-colors duration-200',
        isEquipped
          ? 'bg-white ring-1 ring-kawai-red/25'
          : 'bg-white/70 hover:bg-white',
      )}
    >
      {/* Thumbnail */}
      <div className="relative flex-shrink-0 w-[60px] h-[60px] bg-kawai-pearl overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={accessory.name ?? accessory.model}
            fill
            className="object-contain p-1.5"
            sizes="60px"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-5 h-5 text-kawai-charcoal/15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="2" y="8" width="20" height="13" rx="1" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[9px] uppercase tracking-[0.3em] text-kawai-charcoal/40 font-[family-name:var(--font-brand-sans)]">
              {accessory.model}
            </p>
            <h4 className="text-sm leading-snug font-[family-name:var(--font-brand-luxury)] text-kawai-black mt-0.5">
              {accessory.name ?? accessory.model}
            </h4>
          </div>

          {/* Price */}
          <div className="flex-shrink-0 text-right">
            {price != null ? (
              <>
                <span className="block text-[9px] uppercase tracking-widest text-kawai-red font-bold font-[family-name:var(--font-brand-sans)]">
                  MSRP
                </span>
                <span className="text-sm font-bold text-kawai-black font-[family-name:var(--font-brand-sans)]">
                  {formatPrice(price)}
                </span>
              </>
            ) : (
              <span className="text-xs text-kawai-charcoal/35 font-[family-name:var(--font-brand-sans)]">
                Contact
              </span>
            )}
          </div>
        </div>

        {/* Variation picker — only when 2+ variants */}
        {hasMultiVariants && (
          <VariationPicker
            variations={accessory.variations}
            selectedIndex={effectiveVarIdx ?? 0}
            onChange={onVariationChange}
          />
        )}
      </div>

      {/* Equip toggle */}
      <div className="flex-shrink-0 self-center">
        <button
          onClick={onToggle}
          aria-label={isEquipped ? `Remove ${accessory.name ?? accessory.model}` : `Add ${accessory.name ?? accessory.model}`}
          className={cn(
            'w-8 h-8 flex items-center justify-center transition-all duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kawai-red',
            isEquipped
              ? 'bg-kawai-red text-white hover:bg-red-700'
              : 'bg-kawai-black/8 text-kawai-charcoal hover:bg-kawai-black hover:text-white',
          )}
        >
          {isEquipped ? (
            <Minus className="w-3.5 h-3.5" />
          ) : (
            <Plus className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </motion.div>
  )
}

// ─── Summary Panel ────────────────────────────────────────────────────────────

function SummaryPanel({
  selectedPiano,
  equippedAccessories,
  equipped,
  onRemove,
}: {
  selectedPiano: PianoForSelector | null
  equippedAccessories: AccessoryForPage[]
  equipped: EquippedMap
  onRemove: (id: string) => void
}) {
  const total = equippedAccessories.reduce((sum, a) => {
    const varIdx = equipped.get(a.id) ?? null
    return sum + (resolvePrice(a, a.variations.length > 1 ? varIdx : null) ?? 0)
  }, 0)

  return (
    <div className="bg-kawai-black text-white flex flex-col h-full">
      <div className="p-6 border-b border-white/10">
        <p className="text-[9px] tracking-[0.4em] uppercase text-kawai-red font-bold mb-1 font-[family-name:var(--font-brand-sans)]">
          Your Setup
        </p>
        <h3 className="text-lg font-[family-name:var(--font-brand-luxury)] leading-tight">
          {selectedPiano?.model ?? 'No piano selected'}
        </h3>
        {selectedPiano?.name && (
          <p className="text-xs text-white/35 mt-0.5 font-[family-name:var(--font-brand-sans)]">
            {selectedPiano.name}
          </p>
        )}
      </div>

      {/* Item list */}
      <div className="flex-1 overflow-y-auto p-6">
        {equippedAccessories.length === 0 ? (
          <p className="text-xs text-white/25 italic font-[family-name:var(--font-brand-sans)] leading-relaxed">
            Select accessories below to add them to your setup.
          </p>
        ) : (
          <ul className="space-y-4">
            {equippedAccessories.map((a) => {
              const varIdx = equipped.get(a.id) ?? null
              const hasMultiVariants = a.variations.length > 1
              const variation = hasMultiVariants && varIdx !== null ? a.variations[varIdx] : null
              const price = resolvePrice(a, hasMultiVariants ? varIdx : null)

              return (
                <li
                  key={a.id}
                  className="flex items-start justify-between gap-3 pb-4 border-b border-white/8"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-white font-[family-name:var(--font-brand-sans)] truncate leading-snug">
                      {a.name ?? a.model}
                    </p>
                    {variation && (
                      <p className="text-[10px] text-white/35 font-[family-name:var(--font-brand-sans)] mt-0.5">
                        {variation.name}
                      </p>
                    )}
                    {price != null && (
                      <p className="text-[11px] font-medium text-white/50 font-[family-name:var(--font-brand-sans)] mt-0.5">
                        {formatPrice(price)}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => onRemove(a.id)}
                    aria-label={`Remove ${a.name ?? a.model}`}
                    className="flex-shrink-0 mt-0.5 text-white/20 hover:text-kawai-red transition-colors duration-150"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {/* Total + CTA */}
      {equippedAccessories.length > 0 && (
        <div className="p-6 border-t border-white/10">
          <div className="flex items-baseline justify-between mb-1">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-[family-name:var(--font-brand-sans)]">
              Est. Total
            </p>
            <p className="text-xl font-bold text-white font-[family-name:var(--font-brand-sans)]">
              {total > 0 ? formatPrice(total) : '—'}
            </p>
          </div>
          <p className="text-[9px] text-white/20 font-[family-name:var(--font-brand-sans)] mb-5 leading-relaxed">
            MSRP pricing. Contact your authorized Kawai dealer for availability.
          </p>
          <Link
            href="/find-a-dealer"
            className="flex items-center justify-center gap-2 w-full py-3.5 bg-kawai-red text-white text-[10px] uppercase tracking-[0.2em] font-bold font-[family-name:var(--font-brand-sans)] hover:bg-red-700 transition-colors duration-200"
          >
            Find a Dealer
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}
    </div>
  )
}

// ─── Mobile Summary Bar ───────────────────────────────────────────────────────

function MobileSummaryBar({
  count,
  total,
}: {
  count: number
  total: number
}) {
  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 80, opacity: 0 }}
      transition={{ type: 'spring', bounce: 0.1, duration: 0.4 }}
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-kawai-black border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] text-white/40 font-[family-name:var(--font-brand-sans)] uppercase tracking-[0.2em]">
            {count} {count === 1 ? 'item' : 'items'} selected
          </p>
          <p className="text-base font-bold text-white font-[family-name:var(--font-brand-sans)]">
            {total > 0 ? formatPrice(total) : '—'}
          </p>
        </div>
        <Link
          href="/find-a-dealer"
          className="flex items-center gap-2 px-5 py-3 bg-kawai-red text-white text-[10px] uppercase tracking-[0.15em] font-bold font-[family-name:var(--font-brand-sans)] hover:bg-red-700 transition-colors duration-200 flex-shrink-0"
        >
          Find a Dealer
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </motion.div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function AccessoryConfigurator({ pianos, accessories }: Props) {
  const [selectedPianoId, setSelectedPianoId] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const [equipped, setEquipped] = useState<EquippedMap>(new Map())

  // Piano IDs that have at least one active compatible accessory
  const pianoIdsWithAccessories = useMemo(() => {
    const ids = new Set<string>()
    for (const a of accessories) {
      for (const id of a.compatibleProductIds) ids.add(id)
    }
    return ids
  }, [accessories])

  // Only show pianos that actually have accessories
  const configurablePianos = useMemo(
    () => pianos.filter((p) => pianoIdsWithAccessories.has(p.id)),
    [pianos, pianoIdsWithAccessories],
  )

  // Category tabs — only show categories that exist in the configurable set
  const availableCategories = useMemo(() => {
    const cats = new Set(configurablePianos.map(normalizePianoCategory))
    return CATEGORIES.filter((c) => c === 'All' || cats.has(c))
  }, [configurablePianos])

  const displayPianos = useMemo(
    () =>
      activeCategory === 'All'
        ? configurablePianos
        : configurablePianos.filter((p) => normalizePianoCategory(p) === activeCategory),
    [configurablePianos, activeCategory],
  )

  const selectedPiano = useMemo(
    () => pianos.find((p) => p.id === selectedPianoId) ?? null,
    [pianos, selectedPianoId],
  )

  const compatibleAccessories = useMemo(() => {
    if (!selectedPianoId) return []
    return accessories.filter((a) => a.compatibleProductIds.includes(selectedPianoId))
  }, [accessories, selectedPianoId])

  // Group by accessoryType in canonical order
  const groupedAccessories = useMemo(() => {
    const groups: Record<string, AccessoryForPage[]> = {}
    for (const a of compatibleAccessories) {
      const key = a.accessoryType ?? 'other'
      if (!groups[key]) groups[key] = []
      groups[key]!.push(a)
    }
    return TYPE_ORDER.filter((t) => groups[t]).map((t) => ({
      type: t,
      items: groups[t]!,
    }))
  }, [compatibleAccessories])

  // Equipped items in compatible order (preserves grouping order)
  const equippedAccessories = useMemo(
    () => compatibleAccessories.filter((a) => equipped.has(a.id)),
    [compatibleAccessories, equipped],
  )

  const mobileTotal = useMemo(
    () =>
      equippedAccessories.reduce((sum, a) => {
        const varIdx = equipped.get(a.id) ?? null
        return sum + (resolvePrice(a, a.variations.length > 1 ? varIdx : null) ?? 0)
      }, 0),
    [equippedAccessories, equipped],
  )

  // Nothing to configure if no pianos have accessories yet
  if (configurablePianos.length === 0) return null

  // ─── Handlers ───────────────────────────────────────────────────────────────

  function handlePianoSelect(id: string) {
    setSelectedPianoId((prev) => (prev === id ? null : id))
    setEquipped(new Map()) // reset selection when switching piano
  }

  function handleToggle(accessoryId: string) {
    setEquipped((prev) => {
      const next = new Map(prev)
      if (next.has(accessoryId)) {
        next.delete(accessoryId)
      } else {
        const acc = accessories.find((a) => a.id === accessoryId)
        if (!acc) return prev
        // Auto-select first available variation
        const firstAvailableIdx = acc.variations.findIndex((v) => v.available !== false)
        const defaultIdx = acc.variations.length > 1 ? Math.max(firstAvailableIdx, 0) : null
        next.set(accessoryId, defaultIdx)
      }
      return next
    })
  }

  function handleVariationChange(accessoryId: string, index: number) {
    setEquipped((prev) => {
      const next = new Map(prev)
      next.set(accessoryId, index)
      return next
    })
  }

  function handleRemove(accessoryId: string) {
    setEquipped((prev) => {
      const next = new Map(prev)
      next.delete(accessoryId)
      return next
    })
  }

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <section className="bg-kawai-black">

      {/* ── Section header ──────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-20 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <p className="text-[10px] tracking-[0.35em] uppercase text-kawai-red font-bold mb-4 font-[family-name:var(--font-brand-sans)]">
            Accessory Configurator
          </p>
          <h2 className="text-3xl md:text-[2.75rem] font-[family-name:var(--font-brand-luxury)] text-white leading-none mb-3">
            Build your setup.
          </h2>
          <p className="text-sm text-white/35 font-[family-name:var(--font-brand-sans)] max-w-sm leading-relaxed">
            Choose a piano model, then equip it with compatible accessories and preferred variations.
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="w-full h-px bg-white/8" />
      </div>

      {/* ── Step 1: Piano selector ───────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">

        {/* Step label + category tabs */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-7">
          <p className="text-[10px] uppercase tracking-[0.35em] text-white/35 font-[family-name:var(--font-brand-sans)]">
            01 — Select Piano
          </p>
          {availableCategories.length > 2 && (
            <nav className="flex gap-1" aria-label="Piano categories">
              {availableCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    'px-3 py-1.5 text-[10px] uppercase tracking-[0.1em] font-medium transition-all duration-150',
                    'font-[family-name:var(--font-brand-sans)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-kawai-red',
                    activeCategory === cat
                      ? 'bg-white text-kawai-black'
                      : 'text-white/40 hover:text-white',
                  )}
                >
                  {cat}
                </button>
              ))}
            </nav>
          )}
        </div>

        {/* Piano grid — only models that have accessories */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5">
          {displayPianos.map((piano) => (
            <PianoCard
              key={piano.id}
              piano={piano}
              isSelected={piano.id === selectedPianoId}
              onSelect={() => handlePianoSelect(piano.id)}
            />
          ))}
        </div>
      </div>

      {/* ── Step 2: Accessory equip area ─────────────────────────────────────── */}
      <AnimatePresence initial={false}>
        {selectedPiano && (
          <motion.div
            key="equip-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/8">
              <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">

                {/* Step 2 label */}
                <div className="flex items-center justify-between mb-8">
                  <p className="text-[10px] uppercase tracking-[0.35em] text-white/35 font-[family-name:var(--font-brand-sans)]">
                    02 — Choose Accessories
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-white/20 font-[family-name:var(--font-brand-sans)]">
                    {compatibleAccessories.length}{' '}
                    {compatibleAccessories.length === 1 ? 'item' : 'items'} available
                  </p>
                </div>

                {/* Layout: accessory list (left) + sticky summary (right) */}
                <div className="flex gap-8 items-start">

                  {/* ── Accessory groups ─────────────────────────────────── */}
                  <div className="flex-1 min-w-0 space-y-8">
                    {compatibleAccessories.length === 0 ? (
                      <p className="text-sm text-white/25 italic font-[family-name:var(--font-brand-sans)]">
                        No accessories are currently available for the {selectedPiano.model}.
                      </p>
                    ) : (
                      groupedAccessories.map(({ type, items }) => (
                        <div key={type}>
                          <p className="text-[10px] uppercase tracking-[0.3em] text-kawai-red font-bold mb-3 font-[family-name:var(--font-brand-sans)]">
                            {ACCESSORY_TYPE_LABELS[type] ?? type}
                            <span className="text-white/15 font-normal ml-2 tracking-normal">
                              ×{items.length}
                            </span>
                          </p>
                          <div className="space-y-2">
                            {items.map((accessory) => (
                              <AccessoryEquipRow
                                key={accessory.id}
                                accessory={accessory}
                                isEquipped={equipped.has(accessory.id)}
                                variationIndex={equipped.get(accessory.id) ?? null}
                                onToggle={() => handleToggle(accessory.id)}
                                onVariationChange={(i) => handleVariationChange(accessory.id, i)}
                              />
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* ── Sticky summary (desktop only) ─────────────────────── */}
                  <div
                    className="hidden lg:flex flex-col flex-shrink-0 w-72 sticky overflow-hidden"
                    style={{ top: 'var(--header-bottom, 80px)', maxHeight: 'calc(100vh - var(--header-bottom, 80px) - 40px)' }}
                  >
                    <SummaryPanel
                      selectedPiano={selectedPiano}
                      equippedAccessories={equippedAccessories}
                      equipped={equipped}
                      onRemove={handleRemove}
                    />
                  </div>

                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile summary bar (fixed bottom) ───────────────────────────────── */}
      <AnimatePresence>
        {equippedAccessories.length > 0 && (
          <MobileSummaryBar count={equippedAccessories.length} total={mobileTotal} />
        )}
      </AnimatePresence>

    </section>
  )
}
