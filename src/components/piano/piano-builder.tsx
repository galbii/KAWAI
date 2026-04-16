'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, X, Plus, ArrowRight, Check,
  Headphones, Package, Layers, Lightbulb, LayoutGrid,
  ChevronRight, ChevronLeft,
} from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import type { PianoForSelector, AccessoryForPage } from '@/lib/payload/queries'
import { BuyNowButton } from './BuyNowButton'
import type { BuyNowItem } from './BuyNowButton'
import { fetchPianoShopifyPrice } from '@/lib/actions/piano-price'
import type { PianoPriceData } from '@/lib/actions/piano-price'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  pianos: PianoForSelector[]
  accessories: AccessoryForPage[]
}

type SlotFill = { accessoryId: string; variationIndex: number | null }
type SlotsState = Record<string, SlotFill | undefined>
type Step = 'select' | 'build'

// ─── Animation Variants ───────────────────────────────────────────────────────

const ease = [0.25, 0.46, 0.45, 0.94] as const

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.045, delayChildren: 0.04 } },
}
const cardVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease } },
}
const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.065, delayChildren: 0.08 } },
}
const listItemVariants = {
  hidden: { opacity: 0, x: -14 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.28, ease } },
}
const pickerListVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.055, delayChildren: 0.05 } },
}
const pickerItemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease } },
}
const infoStaggerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
}
const infoItemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.38, ease } },
}
const step1HeaderVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13, delayChildren: 0.06 } },
}
const step1HeaderItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.48, ease } },
}
const footerCtaVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.12 } },
}
const footerCtaItemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.32, ease } },
}

// ─── Slot definitions ─────────────────────────────────────────────────────────

const SLOT_TYPES = [
  {
    key: 'bench',
    label: 'Bench',
    description: 'Seating & comfort',
    Icon: () => (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <rect x="3" y="13" width="18" height="4" rx="1" />
        <path d="M6 17v2M18 17v2" />
        <path d="M3 13v-2a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2" />
      </svg>
    ),
  },
  {
    key: 'pedal',
    label: 'Pedal',
    description: 'Expression control',
    Icon: () => (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <rect x="4" y="14" width="16" height="5" rx="1" />
        <path d="M8 14V9a4 4 0 0 1 8 0v5" />
        <circle cx="12" cy="9" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  { key: 'cover',      label: 'Cover',      description: 'Protection',       Icon: Layers },
  { key: 'headphones', label: 'Headphones', description: 'Silent playing',   Icon: Headphones },
  { key: 'stand',      label: 'Stand',      description: 'Elevated display', Icon: LayoutGrid },
  { key: 'lamp',       label: 'Lamp',       description: 'Music lighting',   Icon: Lightbulb },
  { key: 'other',      label: 'Accessory',  description: 'Add-on',           Icon: Package },
] as const

const CATEGORY_FILTERS = ['All', 'Grand', 'Digital', 'Upright', 'Hybrid'] as const

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
  if (accessory.variations.length > 1 && variationIndex !== null)
    return accessory.variations[variationIndex]?.price ?? accessory.price?.msrp ?? null
  if (accessory.variations.length === 1)
    return accessory.variations[0]?.price ?? accessory.price?.msrp ?? null
  return accessory.price?.msrp ?? null
}

function resolveImage(accessory: AccessoryForPage, variationIndex: number | null): string | null {
  if (accessory.variations.length > 1 && variationIndex !== null)
    return accessory.variations[variationIndex]?.imageUrl ?? accessory.imageUrl ?? null
  return accessory.imageUrl ?? null
}

// ─── Step 1: Piano Selection Card ─────────────────────────────────────────────

function PianoSelectCard({
  piano,
  onSelect,
}: {
  piano: PianoForSelector
  onSelect: () => void
}) {
  const category = normalizePianoCategory(piano)

  return (
    <motion.button
      onClick={onSelect}
      variants={cardVariants}
      whileHover={{ y: -5, transition: { duration: 0.22, ease } }}
      whileTap={{ scale: 0.97, transition: { duration: 0.1 } }}
      className="group w-full flex flex-col bg-white text-left overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.13)] transition-shadow duration-300 cursor-pointer"
    >
      <div className="relative w-full bg-white overflow-hidden" style={{ aspectRatio: '4 / 3' }}>
        {piano.imageUrl ? (
          <Image
            src={piano.imageUrl}
            alt={piano.name ?? piano.model}
            fill
            className="object-contain p-7 transition-transform duration-500 group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-12 h-12 text-kawai-charcoal/10" viewBox="0 0 32 32" fill="none">
              <rect x="2" y="14" width="28" height="12" rx="1" stroke="currentColor" strokeWidth="0.8" />
              <rect x="4" y="10" width="24" height="4" rx="0.4" stroke="currentColor" strokeWidth="0.8" />
            </svg>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-kawai-red origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-350" />
      </div>

      <div className="px-6 py-5 flex-1 flex flex-col border-t border-kawai-neutral/40">
        <p className="text-[11px] uppercase tracking-[0.3em] text-kawai-charcoal/35 font-[family-name:var(--font-brand-sans)]">
          {category}
        </p>
        <p className="text-[1.25rem] font-[family-name:var(--font-brand-luxury)] text-kawai-black mt-1 leading-snug group-hover:text-kawai-red transition-colors duration-200">
          {piano.model}
        </p>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-kawai-neutral/40">
          {piano.price?.msrp != null ? (
            <p className="text-[14px] font-bold text-kawai-charcoal/55 font-[family-name:var(--font-brand-sans)]">
              {formatPrice(piano.price.msrp)}
            </p>
          ) : (
            <span />
          )}
          <span className="flex items-center gap-1.5 text-kawai-red opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold font-[family-name:var(--font-brand-sans)]">Select</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </motion.button>
  )
}

// ─── Config Panel ─────────────────────────────────────────────────────────────

function ConfigPanel({
  piano,
  pianoCategory,
  availableSlots,
  slots,
  accessories,
  activeSlot,
  equippedItems,
  total,
  buyNowItems,
  onToggleSlot,
  onRemoveSlot,
  onSelectAccessory,
  onClosePicker,
  onChangePiano,
}: {
  piano: PianoForSelector | null
  pianoCategory: string
  availableSlots: typeof SLOT_TYPES[number][]
  slots: SlotsState
  accessories: AccessoryForPage[]
  activeSlot: string | null
  equippedItems: Array<{ slotKey: string; slotLabel: string; accessory: AccessoryForPage; fill: SlotFill }>
  total: number
  buyNowItems: BuyNowItem[]
  onToggleSlot: (slotKey: string) => void
  onRemoveSlot: (slotKey: string) => void
  onSelectAccessory: (accessoryId: string, variationIndex: number | null) => void
  onClosePicker: () => void
  onChangePiano: () => void
}) {
  const activeSlotDef = activeSlot ? SLOT_TYPES.find((s) => s.key === activeSlot) ?? null : null
  const pickerOptions = activeSlot
    ? accessories.filter((a) => (a.accessoryType ?? 'other') === activeSlot)
    : []

  return (
    <div className="flex flex-col h-full bg-[#161614]">
      <div className="flex-1 min-h-0 relative overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>

          {activeSlot === null && (
            <motion.div
              key="slots"
              initial={{ x: -24, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -24, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="absolute inset-0 overflow-y-auto"
            >
              <div className="px-8 pt-7 pb-4">
                <p className="text-[11px] uppercase tracking-[0.42em] text-white/25 font-[family-name:var(--font-brand-sans)]">
                  02 — Add Accessories
                </p>
              </div>

              {availableSlots.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15, duration: 0.4 }}
                  className="px-8 pb-10 text-center"
                >
                  <p className="text-[15px] text-white/20 font-[family-name:var(--font-brand-sans)] italic">
                    No compatible accessories for this model.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  variants={listVariants}
                  initial="hidden"
                  animate="visible"
                  className="divide-y divide-white/[0.05]"
                >
                  {availableSlots.map((slotDef) => {
                    const fill = slots[slotDef.key]
                    const accessory = fill ? (accessories.find((a) => a.id === fill.accessoryId) ?? null) : null
                    const imageUrl = accessory ? resolveImage(accessory, fill?.variationIndex ?? null) : null
                    const price = accessory ? resolvePrice(accessory, fill?.variationIndex ?? null) : null
                    const variation =
                      accessory && accessory.variations.length > 1 && fill?.variationIndex != null
                        ? accessory.variations[fill.variationIndex] : null
                    const { Icon } = slotDef

                    return (
                      <motion.div
                        key={slotDef.key}
                        variants={listItemVariants}
                        className={cn(
                          'relative flex items-center gap-5 px-8 py-6 cursor-pointer group transition-all duration-150',
                          accessory ? 'bg-white/[0.04] hover:bg-white/[0.07]' : 'hover:bg-white/[0.04]',
                        )}
                        onClick={() => onToggleSlot(slotDef.key)}
                        whileHover={{ x: 2, transition: { duration: 0.15 } }}
                      >
                        <div className={cn('absolute left-0 top-0 bottom-0 w-[3px] transition-all duration-200', accessory ? 'bg-kawai-red opacity-40' : 'opacity-0')} />
                        <div className={cn('flex-shrink-0 w-[76px] h-[76px] flex items-center justify-center overflow-hidden transition-colors duration-150', accessory ? 'bg-white/[0.08] relative' : 'text-white/20 group-hover:text-white/45')}>
                          {accessory && imageUrl ? (
                            <div className="relative w-full h-full">
                              <Image src={imageUrl} alt={accessory.name ?? accessory.model} fill className="object-contain p-1.5" sizes="76px" />
                            </div>
                          ) : (
                            <Icon className="w-7 h-7" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn('text-[11px] uppercase tracking-[0.3em] font-bold font-[family-name:var(--font-brand-sans)]', accessory ? 'text-kawai-red/60' : 'text-white/30 group-hover:text-white/50')}>
                            {slotDef.label}
                          </p>
                          {accessory ? (
                            <>
                              <p className="text-[17px] font-[family-name:var(--font-brand-luxury)] text-white mt-1 leading-snug truncate">{accessory.name ?? accessory.model}</p>
                              {variation && <p className="text-[12px] text-white/35 font-[family-name:var(--font-brand-sans)] mt-0.5 uppercase tracking-[0.08em]">{variation.name}</p>}
                            </>
                          ) : (
                            <p className="text-[14px] text-white/30 font-[family-name:var(--font-brand-sans)] mt-1.5 group-hover:text-white/50 transition-colors">{slotDef.description}</p>
                          )}
                        </div>
                        <div className="flex-shrink-0 flex items-center gap-3">
                          {price != null && <span className="text-[16px] font-bold text-white/60 font-[family-name:var(--font-brand-sans)]">{formatPrice(price)}</span>}
                          {accessory ? (
                            <button onClick={(e) => { e.stopPropagation(); onRemoveSlot(slotDef.key) }} className="w-9 h-9 flex items-center justify-center text-white/20 hover:text-kawai-red transition-colors duration-150">
                              <X className="w-4 h-4" />
                            </button>
                          ) : (
                            <div className="w-9 h-9 flex items-center justify-center border border-white/15 text-white/25 group-hover:border-white/40 group-hover:text-white/50 transition-all duration-150">
                              <Plus className="w-4 h-4" />
                            </div>
                          )}
                          <ChevronRight className="w-4 h-4 text-white/15 group-hover:text-white/40 transition-colors duration-150 -mr-1" />
                        </div>
                      </motion.div>
                    )
                  })}
                </motion.div>
              )}
            </motion.div>
          )}

          {activeSlot !== null && activeSlotDef && (
            <motion.div
              key={activeSlot}
              initial={{ x: 24, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 24, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="absolute inset-0 flex flex-col overflow-hidden"
            >
              <button onClick={onClosePicker} className="flex-shrink-0 flex items-center gap-2.5 px-8 py-5 text-white/35 hover:text-white/75 transition-colors duration-150 border-b border-white/[0.06] group">
                <ChevronLeft className="w-4 h-4 transition-transform duration-150 group-hover:-translate-x-0.5" />
                <span className="text-[12px] uppercase tracking-[0.25em] font-bold font-[family-name:var(--font-brand-sans)]">Back</span>
              </button>
              <div className="flex-shrink-0 px-8 pt-6 pb-5 border-b border-white/[0.06]">
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05, duration: 0.25 }}
                  className="text-[11px] uppercase tracking-[0.4em] text-kawai-red font-bold font-[family-name:var(--font-brand-sans)]"
                >
                  Choose
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                  className="text-[2rem] font-[family-name:var(--font-brand-luxury)] text-white leading-tight mt-1.5"
                >
                  {activeSlotDef.label}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15, duration: 0.3 }}
                  className="text-[13px] text-white/30 font-[family-name:var(--font-brand-sans)] mt-1"
                >
                  {activeSlotDef.description}
                </motion.p>
              </div>
              <PickerList options={pickerOptions} currentFill={slots[activeSlot]} onSelect={onSelectAccessory} onAfterSelect={onClosePicker} />
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 border-t border-white/[0.06] px-8 py-7">
        {piano != null && (
          <motion.div
            variants={footerCtaVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={footerCtaItemVariants} className="flex items-baseline justify-between mb-2">
              <span className="text-[11px] uppercase tracking-[0.35em] text-white/25 font-[family-name:var(--font-brand-sans)]">Est. Total</span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={total}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.22, ease }}
                  className="text-[2.5rem] font-bold text-white font-[family-name:var(--font-brand-sans)] leading-none"
                >
                  {total > 0 ? formatPrice(total) : '—'}
                </motion.span>
              </AnimatePresence>
            </motion.div>
            <motion.p variants={footerCtaItemVariants} className="text-[11px] text-white/15 font-[family-name:var(--font-brand-sans)] mb-5 leading-relaxed">
              MSRP. Contact your Kawai dealer for final pricing.
            </motion.p>
            <motion.div variants={footerCtaItemVariants} className="space-y-3">
              <Link href="/find-a-dealer" className="flex items-center justify-center gap-2 w-full py-4 border border-white/12 text-white/45 text-[11px] uppercase tracking-[0.28em] font-bold font-[family-name:var(--font-brand-sans)] hover:border-white/35 hover:text-white/75 transition-all duration-200">
                Find a Dealer <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <BuyNowButton items={buyNowItems} />
            </motion.div>
            <motion.button variants={footerCtaItemVariants} onClick={onChangePiano} className="mt-5 flex items-center gap-1.5 text-[11px] uppercase tracking-[0.22em] text-white/18 hover:text-white/50 transition-colors duration-150 font-[family-name:var(--font-brand-sans)]">
              <ChevronLeft className="w-3 h-3" /> Change model
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

// ─── Picker List ──────────────────────────────────────────────────────────────

function PickerList({
  options,
  currentFill,
  onSelect,
  onAfterSelect,
}: {
  options: AccessoryForPage[]
  currentFill: SlotFill | undefined
  onSelect: (accessoryId: string, variationIndex: number | null) => void
  onAfterSelect?: () => void
}) {
  const [expandedId, setExpandedId] = useState<string | null>(currentFill?.accessoryId ?? null)

  function handleClick(accessory: AccessoryForPage) {
    if (accessory.variations.length <= 1) {
      onSelect(accessory.id, accessory.variations.length === 1 ? 0 : null)
      setTimeout(() => onAfterSelect?.(), 220)
    } else {
      setExpandedId((prev) => (prev === accessory.id ? null : accessory.id))
    }
  }

  if (options.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.35 }}
        className="flex-1 flex items-center justify-center px-8 py-12 text-center"
      >
        <p className="text-[15px] text-white/20 font-[family-name:var(--font-brand-sans)] italic">No accessories available.</p>
      </motion.div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto min-h-0">
      <motion.div
        variants={pickerListVariants}
        initial="hidden"
        animate="visible"
        className="py-1"
      >
        {options.map((accessory) => {
          const isSelected = currentFill?.accessoryId === accessory.id
          const isExpanded = expandedId === accessory.id
          const hasVariants = accessory.variations.length > 1
          const thumb = resolveImage(accessory, isSelected ? (currentFill?.variationIndex ?? null) : null)
          const price = resolvePrice(accessory, isSelected ? (currentFill?.variationIndex ?? null) : null)

          return (
            <motion.div key={accessory.id} variants={pickerItemVariants}>
              <div
                onClick={() => handleClick(accessory)}
                className={cn('flex items-center gap-5 px-8 py-6 cursor-pointer transition-colors duration-150', isSelected ? 'bg-white/[0.09]' : isExpanded ? 'bg-white/[0.05]' : 'hover:bg-white/[0.05]')}
              >
                <div className="relative flex-shrink-0 w-[96px] h-[96px] bg-white/[0.07] overflow-hidden">
                  {thumb ? <Image src={thumb} alt={accessory.name ?? accessory.model} fill className="object-contain p-2" sizes="96px" /> : <div className="absolute inset-0 flex items-center justify-center text-white/15"><Package className="w-7 h-7" /></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] uppercase tracking-[0.1em] text-white/30 font-[family-name:var(--font-brand-sans)]">{accessory.model}</p>
                  <p className="text-[19px] font-[family-name:var(--font-brand-luxury)] text-white/90 mt-0.5 leading-snug truncate">{accessory.name ?? accessory.model}</p>
                  {hasVariants && <p className="text-[12px] text-white/30 font-[family-name:var(--font-brand-sans)] mt-1">{accessory.variations.length} options</p>}
                </div>
                <div className="flex-shrink-0 flex flex-col items-end gap-2.5">
                  {price != null && <span className="text-[16px] font-bold text-white/65 font-[family-name:var(--font-brand-sans)]">{formatPrice(price)}</span>}
                  {isSelected && !hasVariants ? (
                    <div className="w-7 h-7 bg-kawai-red flex items-center justify-center"><Check className="w-3.5 h-3.5 text-white" strokeWidth={3} /></div>
                  ) : hasVariants ? (
                    <ChevronRight className={cn('w-5 h-5 text-white/25 transition-transform duration-200', isExpanded && 'rotate-90')} />
                  ) : null}
                </div>
              </div>

              <AnimatePresence initial={false}>
                {isExpanded && hasVariants && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 pt-2 pb-6 bg-white/[0.03] border-b border-white/[0.05]">
                      <p className="text-[11px] uppercase tracking-[0.3em] text-white/30 font-[family-name:var(--font-brand-sans)] mb-4">Select an option</p>
                      <div className="flex flex-wrap gap-2.5">
                        {accessory.variations.map((v, i) => {
                          const isUnavail = v.available === false
                          const isActivePick = currentFill?.accessoryId === accessory.id && currentFill?.variationIndex === i
                          return (
                            <motion.button
                              key={v.id ?? i}
                              onClick={() => { if (!isUnavail) { onSelect(accessory.id, i); setExpandedId(null); setTimeout(() => onAfterSelect?.(), 220) } }}
                              disabled={isUnavail}
                              initial={{ opacity: 0, scale: 0.92 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: i * 0.04, duration: 0.2 }}
                              whileHover={!isUnavail ? { scale: 1.03, transition: { duration: 0.15 } } : {}}
                              whileTap={!isUnavail ? { scale: 0.96 } : {}}
                              className={cn('flex items-center gap-2.5 px-5 py-3 text-[13px] font-medium font-[family-name:var(--font-brand-sans)] border transition-all duration-150', isActivePick ? 'bg-kawai-red border-kawai-red text-white' : isUnavail ? 'border-white/10 text-white/18 cursor-not-allowed' : 'border-white/18 text-white/60 hover:border-white/55 hover:text-white/90')}
                            >
                              {isActivePick && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                              {v.name}
                              {v.price != null && <span className={cn('text-[12px]', isActivePick ? 'text-white/60' : 'text-white/30')}>{formatPrice(v.price)}</span>}
                            </motion.button>
                          )
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function PianoBuilder({ pianos, accessories }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [showFloating, setShowFloating] = useState(false)
  const triggerRef = useRef<HTMLElement>(null)
  const [step, setStep] = useState<Step>('select')
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<typeof CATEGORY_FILTERS[number]>('All')
  const [selectedPianoId, setSelectedPianoId] = useState<string | null>(null)
  const [slots, setSlots] = useState<SlotsState>({})
  const [activeSlot, setActiveSlot] = useState<string | null>(null)
  const [shopifyPrice, setShopifyPrice] = useState<PianoPriceData | null>(null)
  const [priceLoading, setPriceLoading] = useState(false)

  // Portal mount
  useEffect(() => { setMounted(true) }, [])

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Show floating button when trigger section scrolls out of view
  useEffect(() => {
    const el = triggerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { setShowFloating(!(entry?.isIntersecting ?? true)) },
      { threshold: 0, rootMargin: '0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [mounted])

  // Fetch Shopify price when piano is selected
  useEffect(() => {
    if (!selectedPianoId) { setShopifyPrice(null); return }
    const piano = pianos.find((p) => p.id === selectedPianoId)
    if (!piano) return
    setPriceLoading(true)
    fetchPianoShopifyPrice(piano.model)
      .then(setShopifyPrice)
      .finally(() => setPriceLoading(false))
  }, [selectedPianoId, pianos])

  // ── Derived ───────────────────────────────────────────────────────────────

  const pianoIdsWithAccessories = useMemo(() => {
    const ids = new Set<string>()
    for (const a of accessories) for (const id of a.compatibleProductIds) ids.add(id)
    return ids
  }, [accessories])

  const configurablePianos = useMemo(
    () => pianos.filter((p) => pianoIdsWithAccessories.has(p.id)),
    [pianos, pianoIdsWithAccessories],
  )

  const filteredPianos = useMemo(() => {
    let list = configurablePianos
    if (categoryFilter !== 'All') list = list.filter((p) => normalizePianoCategory(p) === categoryFilter)
    const q = searchQuery.toLowerCase().trim()
    if (q) list = list.filter((p) => p.model.toLowerCase().includes(q) || (p.name ?? '').toLowerCase().includes(q))
    return list
  }, [configurablePianos, categoryFilter, searchQuery])

  const selectedPiano = useMemo(() => pianos.find((p) => p.id === selectedPianoId) ?? null, [pianos, selectedPianoId])
  const activePianoCategory = selectedPiano ? `${normalizePianoCategory(selectedPiano)} Piano` : ''

  const relevantAccessories = useMemo(() => {
    if (!selectedPianoId) return []
    return accessories.filter((a) => a.compatibleProductIds.includes(selectedPianoId))
  }, [selectedPianoId, accessories])

  const availableSlots = useMemo(() => {
    const types = new Set(relevantAccessories.map((a) => a.accessoryType ?? 'other'))
    return SLOT_TYPES.filter((s) => types.has(s.key))
  }, [relevantAccessories])

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

  // Total uses Shopify live price for base; falls back to CMS MSRP
  const pianoBasePrice = shopifyPrice?.min ?? selectedPiano?.price?.msrp ?? 0

  const total = useMemo(
    () =>
      pianoBasePrice +
      equippedItems.reduce((sum, { accessory, fill }) => sum + (resolvePrice(accessory, fill.variationIndex) ?? 0), 0),
    [pianoBasePrice, equippedItems],
  )

  const buyNowItems = useMemo((): BuyNowItem[] => {
    const items: BuyNowItem[] = []
    if (selectedPiano)
      items.push({ shopifyVariantId: selectedPiano.shopifyVariantId ?? null, handle: selectedPiano.slug, quantity: 1 })
    for (const { accessory, fill } of equippedItems) {
      const variantId =
        fill.variationIndex !== null
          ? (accessory.variations[fill.variationIndex]?.shopifyVariantId ?? accessory.variations[0]?.shopifyVariantId)
          : accessory.variations[0]?.shopifyVariantId
      items.push({ shopifyVariantId: variantId ?? null, handle: accessory.slug ?? null, quantity: 1 })
    }
    return items
  }, [selectedPiano, equippedItems])

  if (configurablePianos.length === 0) return null

  // ── Handlers ──────────────────────────────────────────────────────────────

  function handlePianoSelect(id: string) {
    setSelectedPianoId(id); setSlots({}); setActiveSlot(null); setStep('build')
  }
  function handleChangeModel() {
    setStep('select'); setSelectedPianoId(null); setSlots({}); setActiveSlot(null); setSearchQuery(''); setShopifyPrice(null)
  }
  function handleClose() {
    setIsOpen(false)
    setTimeout(() => { setStep('select'); setSelectedPianoId(null); setSlots({}); setActiveSlot(null); setSearchQuery(''); setShopifyPrice(null) }, 400)
  }
  function handleSlotFill(accessoryId: string, variationIndex: number | null) {
    if (!activeSlot) return
    setSlots((prev) => ({ ...prev, [activeSlot]: { accessoryId, variationIndex } }))
  }
  function handleSlotRemove(slotKey: string) {
    setSlots((prev) => { const n = { ...prev }; delete n[slotKey]; return n })
    if (activeSlot === slotKey) setActiveSlot(null)
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Trigger section ────────────────────────────────────────────────── */}
      <section ref={triggerRef} className="bg-white border-t border-kawai-neutral/60">
        <div className="px-12 lg:px-20 py-20 lg:py-28">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-end justify-between gap-12">
            <div>
              <p className="text-[12px] tracking-[0.55em] uppercase text-kawai-red font-bold mb-5 font-[family-name:var(--font-brand-sans)]">
                Piano Builder
              </p>
              <h2
                className="font-[family-name:var(--font-brand-luxury)] text-kawai-black leading-none"
                style={{ fontSize: 'clamp(3rem, 5vw, 5.5rem)' }}
              >
                Compose your<br />
                <em className="not-italic text-kawai-charcoal/20">perfect setup.</em>
              </h2>
              <p className="mt-6 text-[15px] text-kawai-charcoal/40 font-[family-name:var(--font-brand-sans)] max-w-sm leading-relaxed">
                Select a piano, then configure it with compatible accessories — all in one place.
              </p>
            </div>

            <motion.button
              onClick={() => setIsOpen(true)}
              whileHover={{ scale: 1.02, transition: { duration: 0.18 } }}
              whileTap={{ scale: 0.97, transition: { duration: 0.1 } }}
              className="group flex items-center gap-4 px-10 py-5 bg-kawai-black hover:bg-kawai-red transition-colors duration-200 flex-shrink-0"
            >
              <span className="text-[12px] uppercase tracking-[0.38em] font-bold font-[family-name:var(--font-brand-sans)] text-white">
                Launch Builder
              </span>
              <ArrowRight className="w-4 h-4 text-white/60 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-150" />
            </motion.button>
          </div>
        </div>
      </section>

      {/* ── Modal portal ───────────────────────────────────────────────────── */}
      {mounted && createPortal(
        <>
          {/* ── Floating "Try Accessories" trigger ─────────────────────── */}
          <AnimatePresence>
            {showFloating && !isOpen && (
              <motion.button
                key="floating-trigger"
                onClick={() => setIsOpen(true)}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.92 }}
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                whileHover={{ y: -3, scale: 1.04, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.95, transition: { duration: 0.1 } }}
                className="flex fixed bottom-24 md:bottom-8 left-4 md:left-8 z-[99] items-center gap-4 px-6 py-4 md:px-8 md:py-5 bg-kawai-black hover:bg-kawai-red transition-colors duration-200 cursor-pointer group shadow-[0_8px_32px_rgba(0,0,0,0.35),0_2px_8px_rgba(0,0,0,0.2)]"
                aria-label="Open Piano Builder"
              >
                <span className="text-[11px] uppercase tracking-[0.35em] font-bold font-[family-name:var(--font-brand-sans)] text-white">
                  Try Accessories
                </span>
                <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-150 flex-shrink-0" />
              </motion.button>
            )}
          </AnimatePresence>

          <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={handleClose}
                className="fixed inset-0 z-[100] bg-black/55 backdrop-blur-sm"
              />

              {/* Modal panel */}
              <motion.div
                key="modal"
                initial={{ opacity: 0, scale: 0.96, y: 28 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: 16 }}
                transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                className="fixed z-[101] bg-white overflow-hidden flex flex-col"
                style={{
                  inset: '24px',
                  maxWidth: '1700px',
                  maxHeight: 'calc(100vh - 48px)',
                  margin: '0 auto',
                }}
              >
                {/* Close button */}
                <motion.button
                  onClick={handleClose}
                  whileHover={{ rotate: 90, scale: 1.1, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25, duration: 0.25 }}
                  className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center text-kawai-charcoal/30 hover:text-kawai-black bg-white/90 backdrop-blur-sm transition-colors duration-150"
                  aria-label="Close builder"
                >
                  <X className="w-5 h-5" />
                </motion.button>

                {/* Builder content */}
                <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
                  <AnimatePresence mode="wait">

                    {/* ══ Step 1: Select ══════════════════════════════════════ */}
                    {step === 'select' && (
                      <motion.div
                        key="select"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="flex-1 flex flex-col min-h-0 overflow-y-auto"
                      >
                        {/* Header */}
                        <div className="flex-shrink-0 px-5 lg:px-16 pt-8 lg:pt-14 pb-6 lg:pb-10 border-b border-kawai-neutral/60">
                          <motion.div
                            variants={step1HeaderVariants}
                            initial="hidden"
                            animate="visible"
                            className="flex items-end justify-between flex-wrap gap-4"
                          >
                            <div>
                              <motion.p variants={step1HeaderItemVariants} className="text-[11px] tracking-[0.5em] uppercase text-kawai-red font-bold mb-3 font-[family-name:var(--font-brand-sans)]">
                                Step 1 of 2 — Select Piano
                              </motion.p>
                              <motion.h2
                                variants={step1HeaderItemVariants}
                                className="font-[family-name:var(--font-brand-luxury)] text-kawai-black leading-none"
                                style={{ fontSize: 'clamp(2rem, 4vw, 4.5rem)' }}
                              >
                                Choose your <em className="not-italic text-kawai-charcoal/22">piano.</em>
                              </motion.h2>
                            </div>
                            <motion.p variants={step1HeaderItemVariants} className="hidden sm:block text-[15px] text-kawai-charcoal/40 font-[family-name:var(--font-brand-sans)] max-w-xs leading-relaxed self-end pb-1">
                              Select a model to begin configuring your perfect setup.
                            </motion.p>
                          </motion.div>
                        </div>

                        {/* Search + filter */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.18, duration: 0.35, ease }}
                          className="flex-shrink-0 px-5 lg:px-16 py-4 border-b border-kawai-neutral/40"
                        >
                          <div className="flex flex-col gap-3">
                            <div className="relative w-full sm:w-72">
                              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-kawai-charcoal/30 pointer-events-none" />
                              <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search models…"
                                className="w-full pl-11 pr-10 py-3 text-[14px] font-[family-name:var(--font-brand-sans)] text-kawai-black placeholder:text-kawai-charcoal/28 bg-kawai-pearl border border-kawai-neutral/60 focus:outline-none focus:border-kawai-red transition-colors duration-200"
                              />
                              {searchQuery && (
                                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-kawai-charcoal/30 hover:text-kawai-charcoal/70 transition-colors">
                                  <X className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                            <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
                              {CATEGORY_FILTERS.map((cat) => (
                                <button
                                  key={cat}
                                  onClick={() => setCategoryFilter(cat)}
                                  className={cn(
                                    'relative flex-shrink-0 overflow-hidden px-4 py-2 text-[11px] uppercase tracking-[0.22em] font-bold font-[family-name:var(--font-brand-sans)] border transition-colors duration-150',
                                    categoryFilter === cat
                                      ? 'border-kawai-black text-white'
                                      : 'border-kawai-neutral/70 text-kawai-charcoal/45 hover:border-kawai-black hover:text-kawai-black',
                                  )}
                                >
                                  {categoryFilter === cat && (
                                    <motion.span
                                      layoutId="cat-pill"
                                      className="absolute inset-0 bg-kawai-black"
                                      transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                                    />
                                  )}
                                  <span className="relative z-[1]">{cat}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </motion.div>

                        {/* Grid */}
                        <div className="flex-1 px-5 lg:px-16 py-6 lg:py-10">
                          <AnimatePresence mode="wait">
                            {filteredPianos.length > 0 ? (
                              <motion.div
                                key={categoryFilter + '|' + searchQuery}
                                variants={gridVariants}
                                initial="hidden"
                                animate="visible"
                                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5"
                              >
                                {filteredPianos.map((piano) => (
                                  <PianoSelectCard key={piano.id} piano={piano} onSelect={() => handlePianoSelect(piano.id)} />
                                ))}
                              </motion.div>
                            ) : (
                              <motion.div
                                key="empty"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="py-20 flex flex-col items-center gap-4 text-center"
                              >
                                <p className="text-[16px] text-kawai-charcoal/30 font-[family-name:var(--font-brand-sans)]">No models match your search.</p>
                                <motion.button
                                  onClick={() => { setSearchQuery(''); setCategoryFilter('All') }}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="text-[12px] uppercase tracking-[0.25em] text-kawai-red font-bold font-[family-name:var(--font-brand-sans)] hover:opacity-70 transition-opacity"
                                >
                                  Clear filters
                                </motion.button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Explore link */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3, duration: 0.4 }}
                          className="flex-shrink-0 border-t border-kawai-neutral/40 px-5 lg:px-16 py-5"
                        >
                          <Link href="/pianos" onClick={handleClose} className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.28em] font-bold font-[family-name:var(--font-brand-sans)] text-kawai-charcoal/40 hover:text-kawai-red transition-colors duration-150 group">
                            Explore all our products <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-150" />
                          </Link>
                        </motion.div>
                      </motion.div>
                    )}

                    {/* ══ Step 2: Build ════════════════════════════════════════ */}
                    {step === 'build' && (
                      <motion.div
                        key="build"
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.32 }}
                        className="flex-1 flex flex-col min-h-0"
                      >
                        {/* Top bar */}
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, ease }}
                          className="flex-shrink-0 flex items-center justify-between px-8 py-3.5 bg-[#161614]"
                        >
                          <motion.button
                            onClick={handleChangeModel}
                            whileHover={{ x: -2, transition: { duration: 0.15 } }}
                            className="flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] font-bold font-[family-name:var(--font-brand-sans)] text-white/30 hover:text-white/70 transition-colors duration-150 group"
                          >
                            <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-150" />
                            All models
                          </motion.button>
                          <p className="text-[11px] uppercase tracking-[0.45em] font-bold font-[family-name:var(--font-brand-sans)] text-white/18">
                            Step 2 of 2 — Configure
                          </p>
                        </motion.div>

                        {/* Desktop columns */}
                        <div className="hidden lg:flex flex-1 min-h-0">

                          {/* Info column */}
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.12, duration: 0.42, ease }}
                            className="flex-shrink-0 w-[280px] flex flex-col border-r border-kawai-neutral/50 bg-white overflow-hidden"
                          >
                            <AnimatePresence mode="wait">
                              <motion.div
                                key={selectedPianoId}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="flex flex-col h-full"
                              >
                                <motion.div
                                  variants={infoStaggerVariants}
                                  initial="hidden"
                                  animate="visible"
                                  className="flex-1 overflow-y-auto px-8 pt-9 pb-6"
                                >
                                  <motion.p variants={infoItemVariants} className="text-[11px] uppercase tracking-[0.42em] text-kawai-charcoal/30 font-[family-name:var(--font-brand-sans)] mb-6">
                                    01 — Your Piano
                                  </motion.p>
                                  <motion.p variants={infoItemVariants} className="font-[family-name:var(--font-brand-luxury)] text-kawai-black leading-none" style={{ fontSize: 'clamp(1.75rem, 2.2vw, 2.5rem)' }}>
                                    {selectedPiano?.model}
                                  </motion.p>
                                  {activePianoCategory && (
                                    <motion.p variants={infoItemVariants} className="text-[12px] uppercase tracking-[0.25em] text-kawai-charcoal/35 font-[family-name:var(--font-brand-sans)] mt-3">
                                      {activePianoCategory}
                                    </motion.p>
                                  )}

                                  <motion.div variants={infoItemVariants} className="my-7 h-px bg-kawai-neutral/50" />

                                  {/* Live Shopify price */}
                                  <motion.div variants={infoItemVariants}>
                                    {priceLoading ? (
                                      <div className="mb-7">
                                        <div className="h-3 w-20 bg-kawai-neutral/40 animate-pulse mb-3" />
                                        <div className="h-10 w-32 bg-kawai-neutral/40 animate-pulse" />
                                      </div>
                                    ) : shopifyPrice != null ? (
                                      <div className="mb-7">
                                        <p className="text-[10px] uppercase tracking-[0.38em] text-kawai-charcoal/30 font-[family-name:var(--font-brand-sans)] mb-2">
                                          {shopifyPrice.onSale ? 'Sale Price' : 'Starting from'}
                                        </p>
                                        {shopifyPrice.onSale && shopifyPrice.compareAtMin != null && (
                                          <p className="text-[14px] text-kawai-charcoal/35 font-[family-name:var(--font-brand-sans)] line-through mb-1">
                                            {formatPrice(shopifyPrice.compareAtMin)}
                                          </p>
                                        )}
                                        <p className={cn('text-[2.25rem] font-bold font-[family-name:var(--font-brand-sans)] leading-none', shopifyPrice.onSale ? 'text-kawai-red' : 'text-kawai-black')}>
                                          {formatPrice(shopifyPrice.min)}
                                          {shopifyPrice.min !== shopifyPrice.max && (
                                            <span className="text-[1.25rem] text-kawai-charcoal/40 font-normal ml-1">
                                              — {formatPrice(shopifyPrice.max)}
                                            </span>
                                          )}
                                        </p>
                                        <p className="text-[11px] text-kawai-charcoal/30 font-[family-name:var(--font-brand-sans)] mt-1.5">MSRP</p>
                                      </div>
                                    ) : selectedPiano?.price?.msrp != null ? (
                                      <div className="mb-7">
                                        <p className="text-[10px] uppercase tracking-[0.38em] text-kawai-charcoal/30 font-[family-name:var(--font-brand-sans)] mb-2">Starting from</p>
                                        <p className="text-[2.25rem] font-bold text-kawai-black font-[family-name:var(--font-brand-sans)] leading-none">{formatPrice(selectedPiano.price.msrp)}</p>
                                        <p className="text-[11px] text-kawai-charcoal/30 font-[family-name:var(--font-brand-sans)] mt-1.5">MSRP</p>
                                      </div>
                                    ) : null}
                                  </motion.div>

                                  <motion.div variants={infoItemVariants} className="h-px bg-kawai-neutral/50 mb-7" />

                                  <motion.p variants={infoItemVariants} className="text-[12px] text-kawai-charcoal/40 font-[family-name:var(--font-brand-sans)] leading-relaxed">
                                    Configure your {selectedPiano?.model} with compatible accessories using the panel on the right.
                                  </motion.p>
                                </motion.div>

                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.55, duration: 0.35, ease }}
                                  className="flex-shrink-0 p-6 border-t border-kawai-neutral/50"
                                >
                                  <motion.div whileHover={{ scale: 1.02, transition: { duration: 0.18 } }} whileTap={{ scale: 0.97 }}>
                                    <Link
                                      href={`/products/${selectedPiano?.slug ?? ''}`}
                                      onClick={handleClose}
                                      className="flex items-center justify-between w-full px-6 py-4 bg-kawai-black text-white group hover:bg-kawai-red transition-colors duration-200"
                                    >
                                      <span className="text-[11px] uppercase tracking-[0.28em] font-bold font-[family-name:var(--font-brand-sans)]">View Product</span>
                                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-150" />
                                    </Link>
                                  </motion.div>
                                </motion.div>
                              </motion.div>
                            </AnimatePresence>
                          </motion.div>

                          {/* Showcase */}
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.08, duration: 0.5 }}
                            className="flex-1 min-w-0 relative bg-kawai-pearl overflow-hidden border-r border-kawai-neutral/50"
                          >
                            <AnimatePresence mode="wait">
                              <motion.div
                                key={selectedPianoId}
                                initial={{ opacity: 0, scale: 1.02 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                                className="absolute inset-0"
                              >
                                {selectedPiano?.imageUrl ? (
                                  <Image
                                    src={selectedPiano.imageUrl}
                                    alt={selectedPiano.model}
                                    fill
                                    className="object-contain p-16 lg:p-20"
                                    sizes="(max-width: 1440px) calc(100vw - 800px), 60vw"
                                    priority
                                  />
                                ) : (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <svg className="w-40 h-40 text-kawai-charcoal/6" viewBox="0 0 32 32" fill="none">
                                      <rect x="2" y="14" width="28" height="12" rx="1" stroke="currentColor" strokeWidth="0.7" />
                                      <rect x="4" y="10" width="24" height="4" rx="0.4" stroke="currentColor" strokeWidth="0.7" />
                                    </svg>
                                  </div>
                                )}
                              </motion.div>
                            </AnimatePresence>
                          </motion.div>

                          {/* Config panel */}
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.18, duration: 0.42, ease }}
                            className="flex-shrink-0 w-[480px]"
                          >
                            <ConfigPanel
                              piano={selectedPiano}
                              pianoCategory={activePianoCategory}
                              availableSlots={availableSlots as unknown as typeof SLOT_TYPES[number][]}
                              slots={slots}
                              accessories={accessories}
                              activeSlot={activeSlot}
                              equippedItems={equippedItems}
                              total={total}
                              buyNowItems={buyNowItems}
                              onToggleSlot={(key) => setActiveSlot(activeSlot === key ? null : key)}
                              onRemoveSlot={handleSlotRemove}
                              onSelectAccessory={handleSlotFill}
                              onClosePicker={() => setActiveSlot(null)}
                              onChangePiano={handleChangeModel}
                            />
                          </motion.div>

                        </div>

                        {/* Mobile step 2 */}
                        <div className="lg:hidden flex-1 flex flex-col min-h-0">
                          {/* Scrollable content */}
                          <div className="flex-1 overflow-y-auto bg-[#161614]">
                            {selectedPiano?.imageUrl && (
                              <motion.div
                                initial={{ opacity: 0, scale: 1.02 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4, ease }}
                                className="relative w-full bg-kawai-pearl"
                                style={{ aspectRatio: '3 / 2' }}
                              >
                                <Image src={selectedPiano.imageUrl} alt={selectedPiano.model} fill className="object-contain p-6" sizes="100vw" priority />
                              </motion.div>
                            )}
                            {/* Model info row */}
                            <motion.div
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1, duration: 0.3 }}
                              className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]"
                            >
                              <div>
                                <p className="text-[10px] uppercase tracking-[0.4em] text-kawai-red font-bold font-[family-name:var(--font-brand-sans)]">Configure</p>
                                <p className="text-[1.4rem] font-[family-name:var(--font-brand-luxury)] text-white mt-0.5 leading-tight">{selectedPiano?.model}</p>
                              </div>
                              <Link
                                href={`/products/${selectedPiano?.slug ?? ''}`}
                                onClick={handleClose}
                                className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] font-bold font-[family-name:var(--font-brand-sans)] text-white/35 hover:text-white/70 transition-colors flex-shrink-0"
                              >
                                View <ArrowRight className="w-3 h-3" />
                              </Link>
                            </motion.div>
                            {/* Slot list */}
                            <div className="divide-y divide-white/[0.05]">
                              {availableSlots.map((slotDef, i) => {
                                const fill = slots[slotDef.key]
                                const accessory = fill ? (accessories.find((a) => a.id === fill.accessoryId) ?? null) : null
                                const imageUrl = accessory ? resolveImage(accessory, fill?.variationIndex ?? null) : null
                                const price = accessory ? resolvePrice(accessory, fill?.variationIndex ?? null) : null
                                const { Icon } = slotDef
                                return (
                                  <motion.div
                                    key={slotDef.key}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.15 + i * 0.05, duration: 0.28, ease }}
                                  >
                                    <div className={cn('flex items-center gap-4 px-5 py-4 cursor-pointer transition-colors', activeSlot === slotDef.key ? 'bg-white/[0.08]' : accessory ? 'bg-white/[0.04]' : 'active:bg-white/[0.04]')} onClick={() => setActiveSlot(activeSlot === slotDef.key ? null : slotDef.key)}>
                                      <div className={cn('flex-shrink-0 w-[52px] h-[52px] flex items-center justify-center overflow-hidden', accessory ? 'bg-white/[0.08] relative' : 'text-white/25')}>
                                        {accessory && imageUrl ? <div className="relative w-full h-full"><Image src={imageUrl} alt={accessory.name ?? accessory.model} fill className="object-contain p-1" sizes="52px" /></div> : <Icon className="w-5 h-5" />}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className={cn('text-[10px] uppercase tracking-[0.25em] font-bold font-[family-name:var(--font-brand-sans)]', accessory ? 'text-kawai-red/60' : 'text-white/30')}>{slotDef.label}</p>
                                        <p className="text-[15px] font-[family-name:var(--font-brand-luxury)] text-white mt-0.5 truncate">{accessory ? (accessory.name ?? accessory.model) : slotDef.description}</p>
                                      </div>
                                      {price != null && <span className="text-[13px] font-bold text-white/55 font-[family-name:var(--font-brand-sans)] flex-shrink-0">{formatPrice(price)}</span>}
                                      {accessory
                                        ? <button onClick={(e) => { e.stopPropagation(); handleSlotRemove(slotDef.key) }} className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-white/20 hover:text-kawai-red transition-colors"><X className="w-4 h-4" /></button>
                                        : <ChevronRight className="w-4 h-4 text-white/20 flex-shrink-0" />
                                      }
                                    </div>
                                    <AnimatePresence>
                                      {activeSlot === slotDef.key && (
                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden bg-[#1c1a17]">
                                          <PickerList options={relevantAccessories.filter((a) => (a.accessoryType ?? 'other') === slotDef.key)} currentFill={slots[slotDef.key]} onSelect={handleSlotFill} onAfterSelect={() => setActiveSlot(null)} />
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </motion.div>
                                )
                              })}
                            </div>
                          </div>

                          {/* Mobile sticky footer */}
                          <div className="flex-shrink-0 bg-[#161614] border-t border-white/[0.08] px-5 py-4">
                            <div className="flex items-baseline justify-between mb-3">
                              <span className="text-[10px] uppercase tracking-[0.35em] text-white/25 font-[family-name:var(--font-brand-sans)]">Est. Total</span>
                              <AnimatePresence mode="wait">
                                <motion.span
                                  key={total}
                                  initial={{ opacity: 0, y: -8 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: 8 }}
                                  transition={{ duration: 0.2, ease }}
                                  className="text-[1.75rem] font-bold text-white font-[family-name:var(--font-brand-sans)] leading-none"
                                >
                                  {total > 0 ? formatPrice(total) : '—'}
                                </motion.span>
                              </AnimatePresence>
                            </div>
                            <p className="text-[10px] text-white/15 font-[family-name:var(--font-brand-sans)] mb-3">MSRP. Contact your Kawai dealer for final pricing.</p>
                            <div className="flex gap-2">
                              <Link href="/find-a-dealer" className="flex-1 flex items-center justify-center py-3 border border-white/12 text-white/45 text-[10px] uppercase tracking-[0.25em] font-bold font-[family-name:var(--font-brand-sans)] hover:border-white/35 hover:text-white/75 transition-all duration-200">
                                Find Dealer
                              </Link>
                              <div className="flex-1">
                                <BuyNowButton items={buyNowItems} />
                              </div>
                            </div>
                          </div>
                        </div>

                      </motion.div>
                    )}

                  </AnimatePresence>
                </div>
              </motion.div>
            </>
          )}
          </AnimatePresence>
        </>,
        document.body,
      )}
    </>
  )
}
