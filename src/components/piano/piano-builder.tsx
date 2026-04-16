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

// ─── Piano Model Card ─────────────────────────────────────────────────────────

function PianoModelCard({
  piano,
  isSelected,
  onSelect,
}: {
  piano: PianoForSelector
  isSelected: boolean
  onSelect: () => void
}) {
  return (
    <motion.button
      onClick={onSelect}
      aria-pressed={isSelected}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'relative flex-shrink-0 w-[240px] text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kawai-red',
        'transition-opacity duration-200',
        !isSelected && 'hover:opacity-90',
      )}
    >
      <div
        className={cn(
          'relative w-full aspect-[4/3] bg-white overflow-hidden transition-all duration-300',
          isSelected
            ? 'shadow-[0_8px_40px_rgba(0,0,0,0.14)]'
            : 'shadow-[0_1px_4px_rgba(0,0,0,0.06)] group-hover:shadow-[0_6px_24px_rgba(0,0,0,0.10)]',
        )}
      >
        {piano.imageUrl ? (
          <Image
            src={piano.imageUrl}
            alt={piano.name ?? piano.model}
            fill
            className="object-contain p-5"
            sizes="240px"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-12 h-12 text-kawai-charcoal/15" viewBox="0 0 32 32" fill="none">
              <rect x="2" y="14" width="28" height="12" rx="1" stroke="currentColor" strokeWidth="1.2" />
              <rect x="4" y="10" width="24" height="4" rx="0.4" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </div>
        )}
        {isSelected && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-3 right-3 w-6 h-6 bg-kawai-red flex items-center justify-center"
          >
            <Check className="w-3 h-3 text-white" strokeWidth={3} />
          </motion.div>
        )}
      </div>

      <div className="pt-3 pb-1">
        <p className={cn(
          'text-[12px] font-bold uppercase tracking-[0.18em] font-[family-name:var(--font-brand-sans)] transition-colors duration-200',
          isSelected ? 'text-kawai-red' : 'text-kawai-black group-hover:text-kawai-red',
        )}>
          {piano.model}
        </p>
        <p className="text-[10px] uppercase tracking-[0.14em] text-kawai-charcoal/30 font-[family-name:var(--font-brand-sans)] mt-0.5">
          {normalizePianoCategory(piano)}
        </p>
      </div>

      <div className={cn(
        'absolute bottom-0 left-0 right-0 h-[2px] bg-kawai-red transition-transform duration-300 origin-left',
        isSelected ? 'scale-x-100' : 'scale-x-0',
      )} />
    </motion.button>
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
  const [pendingId, setPendingId] = useState<string | null>(
    currentFill?.accessoryId ?? (options.length === 1 ? (options[0]?.id ?? null) : null),
  )
  const [pendingVarIdx, setPendingVarIdx] = useState<number | null>(
    currentFill?.variationIndex ?? null,
  )

  const pendingAccessory = options.find((a) => a.id === pendingId) ?? null
  const confirmPrice = pendingAccessory ? resolvePrice(pendingAccessory, pendingVarIdx) : null

  function handleConfirm() {
    if (!pendingId) return
    onSelect(pendingId, pendingVarIdx)
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
          const isSelected = pendingId === accessory.id
          const thumb = resolveImage(accessory, isSelected ? pendingVarIdx : null)
          const price = resolvePrice(accessory, isSelected ? pendingVarIdx : null)

          return (
            <div
              key={accessory.id}
              onClick={() => { setPendingId(accessory.id); if (!isSelected) setPendingVarIdx(null) }}
              className={cn(
                'flex items-center gap-5 px-6 py-4 cursor-pointer transition-colors duration-150',
                isSelected ? 'bg-kawai-pearl/50' : 'hover:bg-kawai-pearl/30',
              )}
            >
              {/* Radio dot */}
              <div className="flex-shrink-0">
                <div className={cn(
                  'w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-150',
                  isSelected ? 'border-kawai-red' : 'border-kawai-neutral',
                )}>
                  {isSelected && <div className="w-2 h-2 rounded-full bg-kawai-red" />}
                </div>
              </div>

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

                {isSelected && accessory.variations.length > 1 && (
                  <div className="flex flex-wrap gap-2 mt-2.5" onClick={(e) => e.stopPropagation()}>
                    {accessory.variations.map((v, i) => {
                      const isUnavail = v.available === false
                      return (
                        <button
                          key={v.id ?? i}
                          onClick={() => !isUnavail && setPendingVarIdx(i)}
                          disabled={isUnavail}
                          className={cn(
                            'px-3 py-1 text-[10px] uppercase tracking-[0.1em] font-medium transition-all duration-150 font-[family-name:var(--font-brand-sans)]',
                            pendingVarIdx === i
                              ? 'bg-kawai-black text-white'
                              : isUnavail
                              ? 'bg-kawai-neutral/20 text-kawai-charcoal/25 cursor-not-allowed line-through'
                              : 'bg-kawai-neutral/40 text-kawai-charcoal hover:bg-kawai-black hover:text-white',
                          )}
                        >
                          {v.name}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="flex-shrink-0 text-right">
                {price != null ? (
                  <p className="text-[15px] font-bold text-kawai-black font-[family-name:var(--font-brand-sans)]">
                    {formatPrice(price)}
                  </p>
                ) : (
                  <p className="text-[12px] text-kawai-charcoal/30 font-[family-name:var(--font-brand-sans)]">Contact</p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-4 px-6 py-4 border-t border-kawai-neutral/40 bg-kawai-pearl/30">
        <div className="min-w-0">
          {pendingAccessory ? (
            <p className="text-[13px] font-[family-name:var(--font-brand-luxury)] text-kawai-black truncate">
              {pendingAccessory.name ?? pendingAccessory.model}
              {confirmPrice != null && (
                <span className="ml-2 text-[12px] font-bold font-[family-name:var(--font-brand-sans)] text-kawai-charcoal/55">
                  — {formatPrice(confirmPrice)}
                </span>
              )}
            </p>
          ) : (
            <p className="text-[12px] text-kawai-charcoal/30 font-[family-name:var(--font-brand-sans)]">
              Select an option above
            </p>
          )}
        </div>
        <button
          onClick={handleConfirm}
          disabled={!pendingId}
          className={cn(
            'flex-shrink-0 px-6 py-2.5 text-[10px] uppercase tracking-[0.22em] font-bold font-[family-name:var(--font-brand-sans)] transition-all duration-200',
            pendingId
              ? 'bg-kawai-black text-white hover:bg-kawai-red'
              : 'bg-kawai-neutral/30 text-kawai-charcoal/25 cursor-not-allowed',
          )}
        >
          Add to Build
        </button>
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
      {/* Thumbnail */}
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

      {/* Details */}
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

      {/* Price + remove */}
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

// ─── Build Checkout Panel ─────────────────────────────────────────────────────

function BuildCheckout({
  pianoLabel,
  pianoCategory,
  equippedItems,
  total,
  buyNowItems,
  onRemoveSlot,
}: {
  pianoLabel: string
  pianoCategory: string
  equippedItems: Array<{ slotKey: string; slotLabel: string; accessory: AccessoryForPage; fill: SlotFill }>
  total: number
  buyNowItems: BuyNowItem[]
  onRemoveSlot: (slotKey: string) => void
}) {
  return (
    <div className="bg-[#161614] text-white flex flex-col h-full overflow-hidden border border-white/[0.05]">

      {/* Piano header */}
      <div className="px-6 pt-6 pb-5 border-b border-white/[0.06]">
        <p className="text-[8px] uppercase tracking-[0.5em] text-kawai-red font-bold font-[family-name:var(--font-brand-sans)] mb-2">
          Your Build
        </p>
        <p className="text-[1.25rem] font-[family-name:var(--font-brand-luxury)] leading-tight tracking-wide">
          {pianoLabel}
        </p>
        <p className="text-[8px] uppercase tracking-[0.25em] text-white/20 font-[family-name:var(--font-brand-sans)] mt-1">
          {pianoCategory}
        </p>
      </div>

      {/* Line items */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {equippedItems.length === 0 ? (
          <div className="px-6 py-12 flex flex-col items-center justify-center gap-3 text-center">
            <div className="w-8 h-px bg-white/10" />
            <p className="text-[12px] text-white/22 font-[family-name:var(--font-brand-sans)] leading-relaxed">
              Select accessories to<br />build your setup.
            </p>
            <div className="w-8 h-px bg-white/10" />
          </div>
        ) : (
          <ul className="py-1">
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

      {/* Summary + CTAs */}
      <div className="flex-shrink-0 border-t border-white/[0.06] px-6 py-5">
        {equippedItems.length > 0 && (
          <div className="mb-5">
            <div className="flex items-baseline justify-between">
              <span className="text-[9px] uppercase tracking-[0.3em] text-white/25 font-[family-name:var(--font-brand-sans)]">
                Est. Total
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

        {/* CTAs */}
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

    // Add the piano — variant ID from Payload sync; slug as handle fallback for live lookup
    if (selectedPiano) {
      items.push({
        shopifyVariantId: selectedPiano.shopifyVariantId ?? null,
        handle: selectedPiano.slug,
        quantity: 1,
      })
    }

    // Add each equipped accessory — prefer stored variant ID, fall back to handle lookup
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

      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <div className="max-w-[1600px] mx-auto px-8 lg:px-16 pt-20 pb-14">
        <div className="flex items-end justify-between flex-wrap gap-8">
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
            Select your piano, then equip it with compatible accessories.
          </p>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-8 lg:px-16">
        <div className="w-full h-px bg-kawai-neutral/60" />
      </div>

      {/* ── Step 1: Piano selector ────────────────────────────────────────────── */}
      <div className="max-w-[1600px] mx-auto px-8 lg:px-16 py-12">

        <div className="flex items-center gap-6 mb-8 flex-wrap">
          <p className="text-[11px] uppercase tracking-[0.4em] text-kawai-charcoal/35 font-[family-name:var(--font-brand-sans)] flex-shrink-0">
            01 — Your Piano
          </p>
          <div className="flex-1 min-w-[240px] max-w-md relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-kawai-charcoal/30 pointer-events-none" />
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                if (customPianoName) { setCustomPianoName(null); setSlots({}) }
              }}
              onKeyDown={(e) => { if (e.key === 'Enter' && showCustomOption) handleCustomConfirm() }}
              placeholder={isConfiguring ? (activePianoLabel ?? 'Search models…') : 'Search or enter your model…'}
              className="w-full pl-11 pr-4 py-3 text-[13px] font-[family-name:var(--font-brand-sans)] text-kawai-black placeholder:text-kawai-charcoal/30 bg-kawai-pearl border border-kawai-neutral/60 focus:outline-none focus:border-kawai-red transition-colors duration-200"
            />
          </div>
          {isConfiguring && (
            <button
              onClick={handleReset}
              className="text-[10px] uppercase tracking-[0.25em] text-kawai-charcoal/30 hover:text-kawai-red transition-colors duration-150 font-[family-name:var(--font-brand-sans)]"
            >
              Start over
            </button>
          )}
        </div>

        <AnimatePresence>
          {showCustomOption && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="mb-7"
            >
              <button
                onClick={handleCustomConfirm}
                className="flex items-center gap-3 px-5 py-3.5 bg-kawai-pearl border border-dashed border-kawai-neutral hover:border-kawai-red hover:bg-white transition-all duration-200 group"
              >
                <Plus className="w-4 h-4 text-kawai-charcoal/35 group-hover:text-kawai-red transition-colors duration-150" />
                <span className="text-[12px] font-[family-name:var(--font-brand-sans)] text-kawai-charcoal/55 group-hover:text-kawai-black transition-colors duration-150">
                  Use <strong className="text-kawai-black font-semibold">&ldquo;{searchQuery.trim()}&rdquo;</strong> as my piano
                </span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-5 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x">
          {customPianoName && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-shrink-0 w-[240px] snap-start"
            >
              <div className="relative w-full aspect-[4/3] bg-kawai-pearl flex items-center justify-center shadow-[0_8px_40px_rgba(0,0,0,0.12)]">
                <svg className="w-12 h-12 text-kawai-charcoal/20" viewBox="0 0 32 32" fill="none">
                  <rect x="2" y="14" width="28" height="12" rx="1" stroke="currentColor" strokeWidth="1.2" />
                  <rect x="4" y="10" width="24" height="4" rx="0.4" stroke="currentColor" strokeWidth="1.2" />
                </svg>
                <div className="absolute top-3 right-3 w-6 h-6 bg-kawai-red flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </div>
              </div>
              <div className="pt-3">
                <p className="text-[12px] font-bold uppercase tracking-[0.18em] font-[family-name:var(--font-brand-sans)] text-kawai-red truncate">
                  {customPianoName}
                </p>
                <p className="text-[10px] uppercase tracking-[0.15em] text-kawai-charcoal/28 font-[family-name:var(--font-brand-sans)] mt-0.5">
                  My piano
                </p>
              </div>
              <div className="h-[2px] bg-kawai-red mt-1.5" />
            </motion.div>
          )}

          {(searchQuery.trim() ? filteredPianos : configurablePianos).map((piano) => (
            <div key={piano.id} className="flex-shrink-0 snap-start">
              <PianoModelCard
                piano={piano}
                isSelected={piano.id === selectedPianoId}
                onSelect={() => handlePianoSelect(piano.id)}
              />
            </div>
          ))}
        </div>

        {searchQuery.trim() && filteredPianos.length === 0 && !showCustomOption && (
          <p className="mt-5 text-[13px] text-kawai-charcoal/30 font-[family-name:var(--font-brand-sans)] italic">
            No catalog models match — type above and press Enter to use your own model.
          </p>
        )}
      </div>

      {/* ── Step 2: Two-column configurator ──────────────────────────────────── */}
      <AnimatePresence initial={false}>
        {isConfiguring && availableSlots.length > 0 && (
          <motion.div
            key="configurator"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden border-t border-kawai-neutral/60"
          >
            <div className="max-w-[1600px] mx-auto px-8 lg:px-16 py-14">
              <div className="grid lg:grid-cols-[1fr_420px] gap-10 items-start">

                {/* ── Left: image + slot grid ───────────────────────────────── */}
                <div className="min-w-0">

                  {/* Large piano image */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedPianoId ?? 'custom'}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="relative w-full bg-kawai-pearl mb-10 overflow-hidden"
                      style={{ aspectRatio: '16 / 8' }}
                    >
                      {selectedPiano?.imageUrl ? (
                        <Image
                          src={selectedPiano.imageUrl}
                          alt={selectedPiano.model}
                          fill
                          className="object-contain p-10 lg:p-16"
                          sizes="(max-width: 1024px) 100vw, calc(100vw - 480px)"
                          priority
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg className="w-24 h-24 text-kawai-charcoal/10" viewBox="0 0 32 32" fill="none">
                            <rect x="2" y="14" width="28" height="12" rx="1" stroke="currentColor" strokeWidth="1" />
                            <rect x="4" y="10" width="24" height="4" rx="0.4" stroke="currentColor" strokeWidth="1" />
                            <rect x="5.5" y="6" width="3" height="7" rx="0.3" fill="currentColor" opacity="0.18" />
                            <rect x="10.5" y="6" width="3" height="7" rx="0.3" fill="currentColor" opacity="0.18" />
                            <rect x="15.5" y="6" width="3" height="7" rx="0.3" fill="currentColor" opacity="0.18" />
                            <rect x="20.5" y="6" width="3" height="7" rx="0.3" fill="currentColor" opacity="0.18" />
                          </svg>
                        </div>
                      )}

                      {/* Model label bottom-left */}
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

                      {/* Change model */}
                      <button
                        onClick={handleReset}
                        className="absolute top-4 right-4 text-[9px] uppercase tracking-[0.3em] text-kawai-charcoal/40 hover:text-kawai-red transition-colors duration-150 font-[family-name:var(--font-brand-sans)] bg-white/80 px-3 py-2"
                      >
                        Change
                      </button>
                    </motion.div>
                  </AnimatePresence>

                  {/* Slot section label */}
                  <p className="text-[11px] uppercase tracking-[0.4em] text-kawai-charcoal/30 font-[family-name:var(--font-brand-sans)] mb-6">
                    02 — Equip Your Setup
                    {customPianoName && (
                      <span className="ml-3 text-kawai-charcoal/18 normal-case tracking-normal lowercase">
                        — showing all accessories
                      </span>
                    )}
                  </p>

                  {/* Slot grid */}
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

                  {/* Inline picker dropdown */}
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
                </div>

                {/* ── Right: checkout panel ─────────────────────────────────── */}
                {activePianoLabel && (
                  <div
                    className="hidden lg:flex flex-col sticky overflow-hidden"
                    style={{
                      top: 'var(--header-bottom, 80px)',
                      maxHeight: 'calc(100vh - var(--header-bottom, 80px) - 48px)',
                    }}
                  >
                    <BuildCheckout
                      pianoLabel={activePianoLabel}
                      pianoCategory={activePianoCategory}
                      equippedItems={equippedItems}
                      total={total}
                      buyNowItems={buyNowItems}
                      onRemoveSlot={handleSlotRemove}
                    />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
              <BuyNowButton
                items={buyNowItems}
                className="px-5 py-3 w-auto"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  )
}
