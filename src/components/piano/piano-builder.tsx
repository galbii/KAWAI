'use client'

import { useState, useMemo, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { Search, X, Plus, ArrowRight, Check, Headphones, Package, Layers, Lightbulb, LayoutGrid } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import type { PianoForSelector, AccessoryForPage } from '@/lib/payload/queries'
import { BuyNowButton } from './BuyNowButton'
import type { BuyNowItem } from './BuyNowButton'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  pianos: PianoForSelector[]
  accessories: AccessoryForPage[]
}

type SlotFill = {
  accessoryId: string
  variationIndex: number | null
}

type SlotsState = Record<string, SlotFill | undefined>

// ─── Slot type definitions ────────────────────────────────────────────────────

const SLOT_TYPES = [
  {
    key: 'bench',
    label: 'Bench',
    description: 'Seating',
    Icon: () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
        <rect x="3" y="13" width="18" height="4" rx="1" />
        <path d="M6 17v2M18 17v2" />
        <path d="M3 13v-2a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2" />
      </svg>
    ),
  },
  {
    key: 'pedal',
    label: 'Pedal',
    description: 'Control',
    Icon: () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
        <rect x="4" y="14" width="16" height="5" rx="1" />
        <path d="M8 14V9a4 4 0 0 1 8 0v5" />
        <circle cx="12" cy="9" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    key: 'cover',
    label: 'Cover',
    description: 'Protection',
    Icon: Layers,
  },
  {
    key: 'headphones',
    label: 'Headphones',
    description: 'Silent play',
    Icon: Headphones,
  },
  {
    key: 'stand',
    label: 'Stand',
    description: 'Display',
    Icon: LayoutGrid,
  },
  {
    key: 'lamp',
    label: 'Lamp',
    description: 'Lighting',
    Icon: Lightbulb,
  },
  {
    key: 'other',
    label: 'Accessory',
    description: 'Add-on',
    Icon: Package,
  },
] as const

// ─── Helpers ─────────────────────────────────────────────────────────────────

function normalizePianoCategory(piano: PianoForSelector): string {
  const type = piano.type?.toLowerCase() ?? ''
  const cat = (piano.category ?? '').toLowerCase()
  if (type === 'grand' || type === 'shigeru' || cat.includes('grand') || cat.includes('shigeru')) return 'Grand'
  if (type === 'digital' || cat.includes('digital') || cat.includes('concert artist')) return 'Digital'
  if (type === 'upright' || cat.includes('upright') || cat.includes('vertical')) return 'Upright'
  if (type === 'hybrid' || cat.includes('hybrid') || cat.includes('anytime') || cat.includes('novus')) return 'Hybrid'
  return 'Other'
}

function resolvePrice(accessory: AccessoryForPage, variationIndex: number | null): number | null {
  if (accessory.variations.length > 1 && variationIndex !== null) {
    return accessory.variations[variationIndex]?.price ?? accessory.price?.msrp ?? null
  }
  if (accessory.variations.length === 1) return accessory.variations[0]?.price ?? accessory.price?.msrp ?? null
  return accessory.price?.msrp ?? null
}

function resolveImage(accessory: AccessoryForPage, variationIndex: number | null): string | null {
  if (accessory.variations.length > 1 && variationIndex !== null) {
    return accessory.variations[variationIndex]?.imageUrl ?? accessory.imageUrl ?? null
  }
  return accessory.imageUrl ?? null
}

// ─── Piano List Card (left column) ───────────────────────────────────────────

function PianoListCard({
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
        'relative w-full flex items-center gap-4 px-5 py-3.5 text-left group focus-visible:outline-none transition-colors duration-150',
        isSelected ? 'bg-kawai-pearl' : 'hover:bg-kawai-pearl/50',
      )}
    >
      {/* Active bar */}
      <div className={cn(
        'absolute left-0 top-0 bottom-0 w-[3px] bg-kawai-red transition-opacity duration-200',
        isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-30',
      )} />

      {/* Thumbnail */}
      <div className="relative flex-shrink-0 w-[72px] h-[54px] bg-white overflow-hidden">
        {piano.imageUrl ? (
          <Image
            src={piano.imageUrl}
            alt={piano.name ?? piano.model}
            fill
            className="object-contain p-1.5"
            sizes="72px"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-6 h-6 text-kawai-charcoal/15" viewBox="0 0 32 32" fill="none">
              <rect x="2" y="14" width="28" height="12" rx="1" stroke="currentColor" strokeWidth="1.2" />
              <rect x="4" y="10" width="24" height="4" rx="0.4" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className={cn(
          'text-[12px] font-bold uppercase tracking-[0.15em] font-[family-name:var(--font-brand-sans)] transition-colors duration-150 truncate',
          isSelected ? 'text-kawai-red' : 'text-kawai-black group-hover:text-kawai-red',
        )}>
          {piano.model}
        </p>
        <p className="text-[10px] uppercase tracking-[0.12em] text-kawai-charcoal/30 font-[family-name:var(--font-brand-sans)] mt-0.5">
          {normalizePianoCategory(piano)}
        </p>
      </div>

      {isSelected && (
        <div className="flex-shrink-0 w-5 h-5 bg-kawai-red flex items-center justify-center">
          <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
        </div>
      )}
    </button>
  )
}

// ─── Slot Card ────────────────────────────────────────────────────────────────

function SlotCard({
  slotDef,
  fill,
  accessories,
  isActive,
  onOpen,
  onRemove,
}: {
  slotDef: (typeof SLOT_TYPES)[number]
  fill: SlotFill | undefined
  accessories: AccessoryForPage[]
  isActive: boolean
  onOpen: () => void
  onRemove: () => void
}) {
  const filled = fill !== undefined
  const accessory = filled ? (accessories.find((a) => a.id === fill.accessoryId) ?? null) : null
  const imageUrl = accessory ? resolveImage(accessory, fill?.variationIndex ?? null) : null
  const price = accessory ? resolvePrice(accessory, fill?.variationIndex ?? null) : null
  const variation =
    accessory && accessory.variations.length > 1 && fill?.variationIndex != null
      ? accessory.variations[fill.variationIndex]
      : null

  const { Icon } = slotDef

  if (filled && accessory) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06),_0_6px_20px_rgba(0,0,0,0.05)] group"
      >
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-kawai-red" />

        <div className="pl-5 pr-5 pt-5 pb-4 flex gap-4 items-start">
          <div className="relative flex-shrink-0 w-20 h-20 bg-kawai-pearl overflow-hidden">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={accessory.name ?? accessory.model}
                fill
                className="object-contain p-1.5"
                sizes="80px"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-kawai-charcoal/20">
                <Icon className="w-6 h-6" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-[9px] uppercase tracking-[0.28em] text-kawai-red font-bold font-[family-name:var(--font-brand-sans)]">
              {slotDef.label}
            </p>
            <p className="text-[14px] leading-snug font-[family-name:var(--font-brand-luxury)] text-kawai-black mt-1 line-clamp-2">
              {accessory.name ?? accessory.model}
            </p>
            <div className="flex items-center gap-2 mt-2">
              {variation && (
                <span className="px-2 py-0.5 text-[9px] uppercase tracking-[0.12em] bg-kawai-pearl text-kawai-charcoal font-[family-name:var(--font-brand-sans)]">
                  {variation.name}
                </span>
              )}
              {price != null && (
                <span className="text-[13px] font-bold text-kawai-black font-[family-name:var(--font-brand-sans)]">
                  {formatPrice(price)}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={onRemove}
            aria-label={`Remove ${accessory.name ?? accessory.model}`}
            className="flex-shrink-0 w-7 h-7 flex items-center justify-center text-kawai-charcoal/20 hover:text-kawai-red transition-colors duration-150"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={onOpen}
          className="w-full border-t border-kawai-neutral/40 py-2.5 text-[9px] uppercase tracking-[0.25em] text-kawai-charcoal/30 hover:text-kawai-red hover:bg-kawai-pearl transition-all duration-150 font-[family-name:var(--font-brand-sans)] opacity-0 group-hover:opacity-100"
        >
          Change
        </button>
      </motion.div>
    )
  }

  return (
    <motion.button
      layout
      onClick={onOpen}
      className={cn(
        'relative w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kawai-red group',
        'transition-all duration-200',
        isActive
          ? 'bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06),_0_6px_20px_rgba(0,0,0,0.08)] ring-1 ring-kawai-red/30'
          : 'bg-kawai-pearl/60 hover:bg-white hover:shadow-[0_1px_4px_rgba(0,0,0,0.06),_0_4px_16px_rgba(0,0,0,0.05)]',
      )}
      style={{
        backgroundImage: isActive
          ? 'none'
          : 'repeating-linear-gradient(0deg,transparent,transparent 7px,rgba(0,0,0,0.028) 7px,rgba(0,0,0,0.028) 8px),repeating-linear-gradient(90deg,transparent,transparent 7px,rgba(0,0,0,0.028) 7px,rgba(0,0,0,0.028) 8px)',
      }}
    >
      <div className="p-6 flex flex-col items-center justify-center gap-3 min-h-[160px]">
        <div className={cn(
          'transition-colors duration-200',
          isActive ? 'text-kawai-red' : 'text-kawai-charcoal/25 group-hover:text-kawai-charcoal/50',
        )}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="text-center">
          <p className={cn(
            'text-[11px] uppercase tracking-[0.22em] font-bold font-[family-name:var(--font-brand-sans)] transition-colors duration-200',
            isActive ? 'text-kawai-red' : 'text-kawai-charcoal/40 group-hover:text-kawai-charcoal/70',
          )}>
            {slotDef.label}
          </p>
          <p className="text-[10px] text-kawai-charcoal/25 font-[family-name:var(--font-brand-sans)] mt-0.5">
            {slotDef.description}
          </p>
        </div>
        <div className={cn(
          'w-8 h-8 flex items-center justify-center border transition-all duration-200',
          isActive
            ? 'border-kawai-red text-kawai-red'
            : 'border-kawai-charcoal/20 text-kawai-charcoal/30 group-hover:border-kawai-charcoal/50 group-hover:text-kawai-charcoal/60',
        )}>
          <Plus className="w-4 h-4" />
        </div>
      </div>
    </motion.button>
  )
}

// ─── Inline Picker Dropdown ───────────────────────────────────────────────────
// Selecting an accessory adds it to the build immediately — no confirm step.
// Multi-variant accessories expand inline; clicking a variant fires onSelect.

function InlinePickerDropdown({
  slotLabel,
  options,
  currentFill,
  onSelect,
  onClose,
}: {
  slotLabel: string
  options: AccessoryForPage[]
  currentFill: SlotFill | undefined
  onSelect: (accessoryId: string, variationIndex: number | null) => void
  onClose: () => void
}) {
  // For multi-variant accessories, track which one is expanded
  const [expandedId, setExpandedId] = useState<string | null>(
    currentFill?.accessoryId ?? null,
  )

  function handleAccessoryClick(accessory: AccessoryForPage) {
    if (accessory.variations.length <= 1) {
      // Single/no variant → add immediately
      onSelect(accessory.id, accessory.variations.length === 1 ? 0 : null)
    } else {
      // Multi-variant → expand to pick a variant
      setExpandedId((prev) => (prev === accessory.id ? null : accessory.id))
    }
  }

  function handleVariantClick(accessoryId: string, varIdx: number, available: boolean) {
    if (!available) return
    onSelect(accessoryId, varIdx)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="mt-3 bg-white border border-kawai-neutral/60 shadow-[0_4px_24px_rgba(0,0,0,0.07)]"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-kawai-neutral/40">
        <div className="flex items-center gap-4">
          <p className="text-[9px] uppercase tracking-[0.45em] text-kawai-red font-bold font-[family-name:var(--font-brand-sans)]">
            Choose
          </p>
          <span className="w-px h-4 bg-kawai-neutral/60" />
          <h4 className="text-base font-[family-name:var(--font-brand-luxury)] text-kawai-black leading-none">
            {slotLabel}
          </h4>
          {options[0] && options.some((o) => o.variations.length > 1) && (
            <span className="text-[10px] text-kawai-charcoal/30 font-[family-name:var(--font-brand-sans)]">
              — select a variant to add
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center text-kawai-charcoal/30 hover:text-kawai-black transition-colors duration-150"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Options */}
      <div className="max-h-[420px] overflow-y-auto divide-y divide-kawai-neutral/25">
        {options.map((accessory) => {
          const isExpanded = expandedId === accessory.id
          const isCurrentlySelected = currentFill?.accessoryId === accessory.id
          const thumb = resolveImage(accessory, isCurrentlySelected ? (currentFill?.variationIndex ?? null) : null)
          const price = resolvePrice(accessory, isCurrentlySelected ? (currentFill?.variationIndex ?? null) : null)
          const hasVariants = accessory.variations.length > 1

          return (
            <div key={accessory.id}>
              <div
                onClick={() => handleAccessoryClick(accessory)}
                className={cn(
                  'flex items-center gap-5 px-6 py-4 cursor-pointer transition-colors duration-150',
                  isExpanded ? 'bg-kawai-pearl/60' : 'hover:bg-kawai-pearl/30',
                )}
              >
                {/* Thumbnail */}
                <div className="relative flex-shrink-0 w-16 h-16 bg-white border border-kawai-neutral/40 overflow-hidden">
                  {thumb ? (
                    <Image
                      src={thumb}
                      alt={accessory.name ?? accessory.model}
                      fill
                      className="object-contain p-1.5"
                      sizes="64px"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-kawai-charcoal/15">
                      <Package className="w-5 h-5" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-kawai-charcoal/35 font-[family-name:var(--font-brand-sans)]">
                    {accessory.model}
                  </p>
                  <p className="text-[15px] leading-snug font-[family-name:var(--font-brand-luxury)] text-kawai-black mt-0.5">
                    {accessory.name ?? accessory.model}
                  </p>
                  {hasVariants && (
                    <p className="text-[10px] text-kawai-charcoal/35 font-[family-name:var(--font-brand-sans)] mt-0.5">
                      {accessory.variations.length} options available
                    </p>
                  )}
                </div>

                {/* Price + indicator */}
                <div className="flex-shrink-0 flex items-center gap-3">
                  {price != null && (
                    <p className="text-[15px] font-bold text-kawai-black font-[family-name:var(--font-brand-sans)]">
                      {formatPrice(price)}
                    </p>
                  )}
                  {isCurrentlySelected && !hasVariants && (
                    <div className="w-5 h-5 bg-kawai-red flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                    </div>
                  )}
                  {hasVariants && (
                    <div className={cn(
                      'w-5 h-5 flex items-center justify-center border transition-all duration-150',
                      isExpanded
                        ? 'border-kawai-red text-kawai-red rotate-45'
                        : 'border-kawai-neutral/50 text-kawai-charcoal/30',
                    )}>
                      <Plus className="w-3 h-3" />
                    </div>
                  )}
                </div>
              </div>

              {/* Variant picker — inline expand */}
              <AnimatePresence initial={false}>
                {isExpanded && hasVariants && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4 pt-1 flex flex-wrap gap-2 bg-kawai-pearl/40 border-b border-kawai-neutral/25">
                      <p className="w-full text-[9px] uppercase tracking-[0.3em] text-kawai-charcoal/35 font-[family-name:var(--font-brand-sans)] mb-1">
                        Select option to add
                      </p>
                      {accessory.variations.map((v, i) => {
                        const isUnavail = v.available === false
                        const isActivePick = currentFill?.accessoryId === accessory.id && currentFill?.variationIndex === i
                        return (
                          <button
                            key={v.id ?? i}
                            onClick={() => handleVariantClick(accessory.id, i, !isUnavail)}
                            disabled={isUnavail}
                            className={cn(
                              'flex items-center gap-2.5 px-3.5 py-2 text-[11px] font-medium transition-all duration-150 font-[family-name:var(--font-brand-sans)] border',
                              isActivePick
                                ? 'bg-kawai-red text-white border-kawai-red'
                                : isUnavail
                                ? 'bg-kawai-neutral/10 text-kawai-charcoal/25 border-kawai-neutral/30 cursor-not-allowed line-through'
                                : 'bg-white text-kawai-black border-kawai-neutral/60 hover:border-kawai-red hover:text-kawai-red',
                            )}
                          >
                            {isActivePick && <Check className="w-3 h-3" strokeWidth={3} />}
                            {v.name}
                            {v.price != null && (
                              <span className={cn('ml-1', isActivePick ? 'text-white/70' : 'text-kawai-charcoal/40')}>
                                {formatPrice(v.price)}
                              </span>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

// ─── Checkout Line Item ───────────────────────────────────────────────────────

function CheckoutLineItem({
  slotKey,
  slotLabel,
  accessory,
  fill,
  onRemove,
}: {
  slotKey: string
  slotLabel: string
  accessory: AccessoryForPage
  fill: SlotFill
  onRemove: (key: string) => void
}) {
  const price = resolvePrice(accessory, fill.variationIndex)
  const imageUrl = resolveImage(accessory, fill.variationIndex)
  const variation =
    accessory.variations.length > 1 && fill.variationIndex != null
      ? accessory.variations[fill.variationIndex]
      : null

  return (
    <li className="flex items-start gap-4 px-6 py-5 border-b border-white/[0.06]">
      <div className="relative flex-shrink-0 w-14 h-14 bg-white/[0.06] overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={accessory.name ?? accessory.model}
            fill
            className="object-contain p-1"
            sizes="56px"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white/15">
            <Package className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[9px] uppercase tracking-[0.35em] text-kawai-red font-bold font-[family-name:var(--font-brand-sans)]">
          {slotLabel}
        </p>
        <p className="text-[14px] text-white font-[family-name:var(--font-brand-luxury)] mt-0.5 truncate leading-snug">
          {accessory.name ?? accessory.model}
        </p>
        {variation && (
          <p className="text-[10px] text-white/30 font-[family-name:var(--font-brand-sans)] mt-0.5">
            {variation.name}
          </p>
        )}
      </div>

      <div className="flex-shrink-0 flex items-center gap-2.5 pt-0.5">
        {price != null && (
          <span className="text-[13px] font-medium text-white/50 font-[family-name:var(--font-brand-sans)]">
            {formatPrice(price)}
          </span>
        )}
        <button
          onClick={() => onRemove(slotKey)}
          aria-label={`Remove ${slotLabel}`}
          className="text-white/15 hover:text-kawai-red transition-colors duration-150"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </li>
  )
}

// ─── Build Summary Panel (right column) ──────────────────────────────────────

function BuildSummary({
  piano,
  pianoCategory,
  equippedItems,
  total,
  buyNowItems,
  onRemoveSlot,
  onChangePiano,
}: {
  piano: PianoForSelector | null
  pianoCategory: string
  equippedItems: Array<{ slotKey: string; slotLabel: string; accessory: AccessoryForPage; fill: SlotFill }>
  total: number
  buyNowItems: BuyNowItem[]
  onRemoveSlot: (slotKey: string) => void
  onChangePiano: () => void
}) {
  const isEmpty = !piano && equippedItems.length === 0

  return (
    <div className="bg-[#161614] text-white flex flex-col h-full overflow-hidden border-l border-white/[0.05]">

      {/* Panel header */}
      <div className="px-6 pt-6 pb-4 border-b border-white/[0.06] flex-shrink-0">
        <p className="text-[8px] uppercase tracking-[0.5em] text-kawai-red font-bold font-[family-name:var(--font-brand-sans)]">
          Your Build
        </p>
        {piano ? (
          <p className="text-[1.2rem] font-[family-name:var(--font-brand-luxury)] leading-tight tracking-wide mt-1.5">
            {piano.model}
          </p>
        ) : (
          <p className="text-[1rem] text-white/20 font-[family-name:var(--font-brand-luxury)] mt-1.5 italic">
            No piano selected
          </p>
        )}
        {pianoCategory && (
          <p className="text-[8px] uppercase tracking-[0.25em] text-white/20 font-[family-name:var(--font-brand-sans)] mt-1">
            {pianoCategory}
          </p>
        )}
      </div>

      {/* Item list */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {isEmpty ? (
          <div className="px-6 py-14 flex flex-col items-center justify-center gap-3 text-center">
            <div className="w-8 h-px bg-white/10" />
            <p className="text-[12px] text-white/20 font-[family-name:var(--font-brand-sans)] leading-relaxed">
              Select a piano and<br />choose your accessories.
            </p>
            <div className="w-8 h-px bg-white/10" />
          </div>
        ) : (
          <ul className="py-1">

            {/* Piano as first line item */}
            {piano && (
              <li className="flex items-start gap-4 px-6 py-5 border-b border-white/[0.06]">
                <div className="relative flex-shrink-0 w-14 h-14 bg-white/[0.06] overflow-hidden">
                  {piano.imageUrl ? (
                    <Image
                      src={piano.imageUrl}
                      alt={piano.model}
                      fill
                      className="object-contain p-1"
                      sizes="56px"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-white/15">
                      <svg className="w-5 h-5" viewBox="0 0 32 32" fill="none">
                        <rect x="2" y="14" width="28" height="12" rx="1" stroke="currentColor" strokeWidth="1.2" />
                        <rect x="4" y="10" width="24" height="4" rx="0.4" stroke="currentColor" strokeWidth="1.2" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] uppercase tracking-[0.35em] text-white/35 font-bold font-[family-name:var(--font-brand-sans)]">
                    Piano
                  </p>
                  <p className="text-[14px] text-white font-[family-name:var(--font-brand-luxury)] mt-0.5 truncate leading-snug">
                    {piano.name ?? piano.model}
                  </p>
                  <p className="text-[10px] text-white/25 font-[family-name:var(--font-brand-sans)] mt-0.5 uppercase tracking-[0.12em]">
                    {pianoCategory}
                  </p>
                </div>
                <button
                  onClick={onChangePiano}
                  className="flex-shrink-0 pt-0.5 text-[9px] uppercase tracking-[0.2em] text-white/20 hover:text-white/60 transition-colors duration-150 font-[family-name:var(--font-brand-sans)]"
                >
                  Change
                </button>
              </li>
            )}

            {/* Accessory line items */}
            {equippedItems.map((item) => (
              <CheckoutLineItem
                key={item.slotKey}
                slotKey={item.slotKey}
                slotLabel={item.slotLabel}
                accessory={item.accessory}
                fill={item.fill}
                onRemove={onRemoveSlot}
              />
            ))}
          </ul>
        )}
      </div>

      {/* Totals + CTAs */}
      <div className="flex-shrink-0 border-t border-white/[0.06] px-6 py-5">
        {equippedItems.length > 0 && (
          <div className="mb-5">
            <div className="flex items-baseline justify-between">
              <span className="text-[9px] uppercase tracking-[0.3em] text-white/25 font-[family-name:var(--font-brand-sans)]">
                Accessories Est.
              </span>
              <span className="text-[1.5rem] font-bold text-white font-[family-name:var(--font-brand-sans)] leading-none">
                {total > 0 ? formatPrice(total) : '—'}
              </span>
            </div>
            <p className="text-[8px] text-white/15 font-[family-name:var(--font-brand-sans)] mt-2 leading-relaxed">
              MSRP. Contact your Kawai dealer for final pricing.
            </p>
          </div>
        )}

        <div className="space-y-2">
          <Link
            href="/find-a-dealer"
            className="flex items-center justify-center gap-2 w-full py-3 border border-white/12 text-white/50 text-[9px] uppercase tracking-[0.3em] font-bold font-[family-name:var(--font-brand-sans)] hover:border-white/35 hover:text-white/80 transition-all duration-200"
          >
            Find a Dealer
            <ArrowRight className="w-3 h-3" />
          </Link>
          <BuyNowButton items={buyNowItems} />
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function PianoBuilder({ pianos, accessories }: Props) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPianoId, setSelectedPianoId] = useState<string | null>(null)
  const [customPianoName, setCustomPianoName] = useState<string | null>(null)
  const [slots, setSlots] = useState<SlotsState>({})
  const [activeSlot, setActiveSlot] = useState<string | null>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const pianoIdsWithAccessories = useMemo(() => {
    const ids = new Set<string>()
    for (const a of accessories) {
      for (const id of a.compatibleProductIds) ids.add(id)
    }
    return ids
  }, [accessories])

  const configurablePianos = useMemo(
    () => pianos.filter((p) => pianoIdsWithAccessories.has(p.id)),
    [pianos, pianoIdsWithAccessories],
  )

  const filteredPianos = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return configurablePianos
    return configurablePianos.filter(
      (p) => p.model.toLowerCase().includes(q) || (p.name ?? '').toLowerCase().includes(q),
    )
  }, [configurablePianos, searchQuery])

  const showCustomOption =
    searchQuery.trim().length >= 2 &&
    filteredPianos.length === 0 &&
    !configurablePianos.some(
      (p) =>
        p.model.toLowerCase() === searchQuery.toLowerCase().trim() ||
        (p.name ?? '').toLowerCase() === searchQuery.toLowerCase().trim(),
    )

  const selectedPiano = useMemo(
    () => pianos.find((p) => p.id === selectedPianoId) ?? null,
    [pianos, selectedPianoId],
  )

  const isConfiguring = selectedPianoId !== null || customPianoName !== null
  const activePianoLabel = customPianoName ?? selectedPiano?.model ?? null
  const activePianoCategory = selectedPiano
    ? `${normalizePianoCategory(selectedPiano)} Piano`
    : customPianoName
    ? 'My Piano'
    : ''

  const relevantAccessories = useMemo(() => {
    if (customPianoName) return accessories
    if (!selectedPianoId) return []
    return accessories.filter((a) => a.compatibleProductIds.includes(selectedPianoId))
  }, [selectedPianoId, customPianoName, accessories])

  const availableSlots = useMemo(() => {
    const types = new Set(relevantAccessories.map((a) => a.accessoryType ?? 'other'))
    return SLOT_TYPES.filter((s) => types.has(s.key))
  }, [relevantAccessories])

  const pickerOptions = useMemo(() => {
    if (!activeSlot) return []
    return relevantAccessories.filter((a) => (a.accessoryType ?? 'other') === activeSlot)
  }, [relevantAccessories, activeSlot])

  const equippedItems = useMemo(() => {
    return availableSlots
      .filter((s) => slots[s.key] !== undefined)
      .map((s) => {
        const fill = slots[s.key]!
        const accessory = accessories.find((a) => a.id === fill.accessoryId)
        if (!accessory) return null
        return { slotKey: s.key, slotLabel: s.label, accessory, fill }
      })
      .filter((x): x is NonNullable<typeof x> => x !== null)
  }, [availableSlots, slots, accessories])

  const total = useMemo(
    () =>
      equippedItems.reduce(
        (sum, { accessory, fill }) => sum + (resolvePrice(accessory, fill.variationIndex) ?? 0),
        0,
      ),
    [equippedItems],
  )

  const buyNowItems = useMemo((): BuyNowItem[] => {
    const items: BuyNowItem[] = []
    if (selectedPiano) {
      items.push({
        shopifyVariantId: selectedPiano.shopifyVariantId ?? null,
        handle: selectedPiano.slug,
        quantity: 1,
      })
    }
    for (const { accessory, fill } of equippedItems) {
      const variantId =
        fill.variationIndex !== null
          ? (accessory.variations[fill.variationIndex]?.shopifyVariantId ?? accessory.variations[0]?.shopifyVariantId)
          : accessory.variations[0]?.shopifyVariantId
      items.push({
        shopifyVariantId: variantId ?? null,
        handle: accessory.slug ?? null,
        quantity: 1,
      })
    }
    return items
  }, [selectedPiano, equippedItems])

  if (configurablePianos.length === 0) return null

  function handlePianoSelect(id: string) {
    setSelectedPianoId(id)
    setCustomPianoName(null)
    setSlots({})
    setActiveSlot(null)
    setSearchQuery('')
  }

  function handleCustomConfirm() {
    const name = searchQuery.trim()
    if (!name) return
    setCustomPianoName(name)
    setSelectedPianoId(null)
    setSlots({})
    setActiveSlot(null)
    setSearchQuery('')
  }

  function handleReset() {
    setSelectedPianoId(null)
    setCustomPianoName(null)
    setSlots({})
    setActiveSlot(null)
    setSearchQuery('')
  }

  function handleSlotFill(accessoryId: string, variationIndex: number | null) {
    if (!activeSlot) return
    setSlots((prev) => ({ ...prev, [activeSlot]: { accessoryId, variationIndex } }))
    setActiveSlot(null)
  }

  function handleSlotRemove(slotKey: string) {
    setSlots((prev) => {
      const next = { ...prev }
      delete next[slotKey]
      return next
    })
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <section className="bg-white border-t border-kawai-neutral/60">

      {/* ── Section header ────────────────────────────────────────────────────── */}
      <div className="px-8 lg:px-16 pt-16 pb-12 border-b border-kawai-neutral/60">
        <div className="flex items-end justify-between flex-wrap gap-8 max-w-[1600px] mx-auto">
          <div>
            <p className="text-[11px] tracking-[0.5em] uppercase text-kawai-red font-bold mb-4 font-[family-name:var(--font-brand-sans)]">
              Build Your Setup
            </p>
            <h2
              className="font-[family-name:var(--font-brand-luxury)] text-kawai-black leading-none"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
            >
              Compose your<br />
              <em className="not-italic text-kawai-charcoal/25">perfect instrument.</em>
            </h2>
          </div>
          <p className="text-[14px] text-kawai-charcoal/40 font-[family-name:var(--font-brand-sans)] max-w-sm leading-relaxed self-end pb-1">
            Pick your piano, then add accessories. Your build updates live on the right.
          </p>
        </div>
      </div>

      {/* ── Three-column builder ───────────────────────────────────────────────── */}
      <div
        className="grid lg:grid-cols-[300px_1fr_400px]"
        style={{ minHeight: 'calc(100vh - 160px)' }}
      >

        {/* ── Col 1: Piano selector ──────────────────────────────────────────── */}
        <div className="border-r border-kawai-neutral/60 flex flex-col lg:max-h-[calc(100vh-160px)] lg:sticky lg:top-0">

          {/* Sticky search header */}
          <div className="px-5 pt-5 pb-4 border-b border-kawai-neutral/40 bg-white flex-shrink-0">
            <p className="text-[10px] uppercase tracking-[0.4em] text-kawai-charcoal/35 font-[family-name:var(--font-brand-sans)] mb-3">
              01 — Your Piano
            </p>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-kawai-charcoal/30 pointer-events-none" />
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  if (customPianoName) { setCustomPianoName(null); setSlots({}) }
                }}
                onKeyDown={(e) => { if (e.key === 'Enter' && showCustomOption) handleCustomConfirm() }}
                placeholder="Search models…"
                className="w-full pl-10 pr-4 py-2.5 text-[12px] font-[family-name:var(--font-brand-sans)] text-kawai-black placeholder:text-kawai-charcoal/30 bg-kawai-pearl border border-kawai-neutral/60 focus:outline-none focus:border-kawai-red transition-colors duration-200"
              />
            </div>

            {/* Custom model suggestion */}
            <AnimatePresence>
              {showCustomOption && (
                <motion.button
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  onClick={handleCustomConfirm}
                  className="w-full mt-2 flex items-center gap-2 px-3 py-2.5 bg-white border border-dashed border-kawai-neutral hover:border-kawai-red transition-all duration-200 group overflow-hidden"
                >
                  <Plus className="w-3.5 h-3.5 text-kawai-charcoal/30 group-hover:text-kawai-red flex-shrink-0 transition-colors" />
                  <span className="text-[11px] font-[family-name:var(--font-brand-sans)] text-kawai-charcoal/50 group-hover:text-kawai-black transition-colors truncate">
                    Use &ldquo;{searchQuery.trim()}&rdquo;
                  </span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Scrollable piano list */}
          <div className="flex-1 overflow-y-auto py-2">

            {/* Custom piano entry (if set) */}
            {customPianoName && (
              <div className="relative flex items-center gap-4 px-5 py-3.5 bg-kawai-pearl">
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-kawai-red" />
                <div className="flex-shrink-0 w-[72px] h-[54px] bg-white flex items-center justify-center">
                  <svg className="w-6 h-6 text-kawai-charcoal/20" viewBox="0 0 32 32" fill="none">
                    <rect x="2" y="14" width="28" height="12" rx="1" stroke="currentColor" strokeWidth="1.2" />
                    <rect x="4" y="10" width="24" height="4" rx="0.4" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold uppercase tracking-[0.15em] text-kawai-red font-[family-name:var(--font-brand-sans)] truncate">
                    {customPianoName}
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.12em] text-kawai-charcoal/30 font-[family-name:var(--font-brand-sans)] mt-0.5">
                    My piano
                  </p>
                </div>
                <div className="flex-shrink-0 w-5 h-5 bg-kawai-red flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                </div>
              </div>
            )}

            {(searchQuery.trim() ? filteredPianos : configurablePianos).map((piano) => (
              <PianoListCard
                key={piano.id}
                piano={piano}
                isSelected={piano.id === selectedPianoId}
                onSelect={() => handlePianoSelect(piano.id)}
              />
            ))}

            {searchQuery.trim() && filteredPianos.length === 0 && !showCustomOption && (
              <p className="px-5 py-4 text-[12px] text-kawai-charcoal/30 font-[family-name:var(--font-brand-sans)] italic">
                No models match.
              </p>
            )}
          </div>

          {/* Reset footer */}
          {(isConfiguring || searchQuery) && (
            <div className="flex-shrink-0 px-5 py-3 border-t border-kawai-neutral/40">
              <button
                onClick={handleReset}
                className="text-[9px] uppercase tracking-[0.25em] text-kawai-charcoal/28 hover:text-kawai-red transition-colors duration-150 font-[family-name:var(--font-brand-sans)]"
              >
                Start over
              </button>
            </div>
          )}
        </div>

        {/* ── Col 2: Accessory configuration ────────────────────────────────── */}
        <div className="overflow-y-auto lg:max-h-[calc(100vh-160px)]">
          <AnimatePresence mode="wait">
            {!isConfiguring ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full min-h-[400px] px-10 text-center gap-4"
              >
                <div className="w-10 h-px bg-kawai-neutral" />
                <p className="text-[14px] text-kawai-charcoal/30 font-[family-name:var(--font-brand-sans)] leading-relaxed">
                  Select a piano from the left<br />to configure your setup.
                </p>
                <div className="w-10 h-px bg-kawai-neutral" />
              </motion.div>
            ) : (
              <motion.div
                key="configurator"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="p-8 lg:p-10"
              >
                {/* Piano image */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedPianoId ?? 'custom'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="relative w-full bg-kawai-pearl mb-10 overflow-hidden"
                    style={{ aspectRatio: '16 / 7' }}
                  >
                    {selectedPiano?.imageUrl ? (
                      <Image
                        src={selectedPiano.imageUrl}
                        alt={selectedPiano.model}
                        fill
                        className="object-contain p-10 lg:p-14"
                        sizes="(max-width: 1024px) 100vw, calc(100vw - 700px)"
                        priority
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-24 h-24 text-kawai-charcoal/10" viewBox="0 0 32 32" fill="none">
                          <rect x="2" y="14" width="28" height="12" rx="1" stroke="currentColor" strokeWidth="1" />
                          <rect x="4" y="10" width="24" height="4" rx="0.4" stroke="currentColor" strokeWidth="1" />
                        </svg>
                      </div>
                    )}

                    {/* Piano label */}
                    <div className="absolute bottom-0 left-0 right-0 px-6 py-5 bg-gradient-to-t from-kawai-pearl/90 to-transparent">
                      <p className="text-[10px] uppercase tracking-[0.45em] text-kawai-red font-bold font-[family-name:var(--font-brand-sans)]">
                        {activePianoCategory}
                      </p>
                      <p
                        className="font-[family-name:var(--font-brand-luxury)] text-kawai-black leading-none mt-1"
                        style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}
                      >
                        {activePianoLabel}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Step label */}
                <p className="text-[11px] uppercase tracking-[0.4em] text-kawai-charcoal/30 font-[family-name:var(--font-brand-sans)] mb-6">
                  02 — Equip Your Setup
                  {customPianoName && (
                    <span className="ml-3 text-kawai-charcoal/18 normal-case tracking-normal lowercase">
                      — showing all accessories
                    </span>
                  )}
                </p>

                {/* Slot grid */}
                {availableSlots.length > 0 ? (
                  <>
                    <LayoutGroup id="slots">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {availableSlots.map((slotDef) => (
                          <SlotCard
                            key={slotDef.key}
                            slotDef={slotDef}
                            fill={slots[slotDef.key]}
                            accessories={accessories}
                            isActive={activeSlot === slotDef.key}
                            onOpen={() => setActiveSlot(activeSlot === slotDef.key ? null : slotDef.key)}
                            onRemove={() => handleSlotRemove(slotDef.key)}
                          />
                        ))}
                      </div>
                    </LayoutGroup>

                    {/* Inline picker */}
                    <AnimatePresence>
                      {activeSlot && pickerOptions.length > 0 && (
                        <InlinePickerDropdown
                          key={activeSlot}
                          slotLabel={SLOT_TYPES.find((s) => s.key === activeSlot)?.label ?? activeSlot}
                          options={pickerOptions}
                          currentFill={slots[activeSlot]}
                          onSelect={handleSlotFill}
                          onClose={() => setActiveSlot(null)}
                        />
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <p className="text-[13px] text-kawai-charcoal/30 font-[family-name:var(--font-brand-sans)] italic">
                    No compatible accessories found for this model.
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Col 3: Build summary ───────────────────────────────────────────── */}
        <div className="lg:max-h-[calc(100vh-160px)] lg:sticky lg:top-0">
          <BuildSummary
            piano={selectedPiano}
            pianoCategory={activePianoCategory}
            equippedItems={equippedItems}
            total={total}
            buyNowItems={buyNowItems}
            onRemoveSlot={handleSlotRemove}
            onChangePiano={handleReset}
          />
        </div>

      </div>

      {/* ── Mobile summary bar ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isConfiguring && equippedItems.length > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', bounce: 0.1, duration: 0.4 }}
            className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-kawai-black border-t border-white/10 px-6 py-5 flex items-center justify-between gap-4"
          >
            <div>
              <p className="text-[9px] uppercase tracking-[0.3em] text-kawai-red font-bold font-[family-name:var(--font-brand-sans)]">
                {equippedItems.length} {equippedItems.length === 1 ? 'item' : 'items'}
              </p>
              <p className="text-xl font-bold text-white font-[family-name:var(--font-brand-sans)] leading-none mt-1">
                {total > 0 ? formatPrice(total) : '—'}
              </p>
            </div>
            <div className="flex gap-2.5">
              <Link
                href="/find-a-dealer"
                className="flex items-center gap-1.5 px-5 py-3 border border-white/20 text-white/65 text-[10px] uppercase tracking-[0.18em] font-bold font-[family-name:var(--font-brand-sans)] hover:border-white/50 transition-all duration-200"
              >
                Find Dealer
              </Link>
              <BuyNowButton items={buyNowItems} className="px-5 py-3 w-auto" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  )
}
