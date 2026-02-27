'use client'

import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { getImagePropsWithFallback } from '@/lib/media/r2-utils'
import type { Media, Product } from '@/payload-types'
import { parseSpecificationJson, type ParsedSpecRow } from '@/lib/utils/parse-specification-json'
import { Modal } from '@/components/ui/modal'

const INITIAL_VISIBLE = 6

interface ProductTechnicalSpecsRendererProps {
  product?: Product | null
  dataSource?: 'product' | 'manual' | 'hybrid' | 'json' | null
  header?: {
    title?: string | null
    subtitle?: string | null
    showModelNumber?: boolean | null
  } | null
  blueprintImage?: Media | string | null
  blueprintCaption?: string | null
  showGridOverlay?: boolean | null
  categories?: ManualCategory[] | null
  gridColumns?: '1' | '2' | '3' | null
  showGridBackground?: boolean | null
  showRegistrationMarks?: boolean | null
  theme?: 'blueprint' | 'light' | 'charcoal' | null
  enableDownload?: boolean | null
  downloadButtonText?: string | null
}

interface ManualCategory {
  categoryName: string
  specifications?: ManualSpec[] | null
  collapsible?: boolean | null
  defaultExpanded?: boolean | null
}

interface ManualSpec {
  id?: string | null
  label?: string | null
  value?: string | null
  unit?: string | null
  note?: string | null
  highlight?: boolean | null
}

interface SpecRow {
  id?: string
  label: string
  type: string
  value: string
  unit?: string | null
  note?: string | null
  highlight?: boolean | null
}

interface SpecCategory {
  categoryName: string
  specifications: SpecRow[]
  collapsible: boolean
  defaultExpanded: boolean
}

interface SearchableRow {
  id?: string
  label: string
  type?: string
  value: string
  unit?: string
  note?: string
  highlight?: boolean
  subItems?: string[]
}

// ---------------------------------------------------------------------------
// Data transforms
// ---------------------------------------------------------------------------

function transformProductSpecs(productSpecs: NonNullable<Product['specifications']>): SpecRow[] {
  if (!productSpecs || productSpecs.length === 0) return []
  return productSpecs
    .filter((spec) => spec.id && spec.spec)
    .map((spec) => ({
      ...(spec.id ? { id: spec.id } : {}),
      label: spec.spec ?? '',
      type: spec.type ?? '',
      value: spec.details ?? '',
    }))
}

function normaliseManualCategories(cats: ManualCategory[]): SpecCategory[] {
  return cats
    .filter((c) => c.categoryName)
    .map((c) => ({
      categoryName: c.categoryName,
      specifications: (c.specifications || [])
        .filter((s): s is ManualSpec & { label: string; value: string } => !!(s.label && s.value))
        .map((s) => ({
          label: s.label,
          type: '',
          value: s.value,
          ...(s.unit != null ? { unit: s.unit } : {}),
          ...(s.note != null ? { note: s.note } : {}),
          ...(s.highlight != null ? { highlight: s.highlight } : {}),
        })),
      collapsible: c.collapsible ?? false,
      defaultExpanded: c.defaultExpanded ?? true,
    }))
}

function specRowToSearchable(row: SpecRow): SearchableRow {
  return {
    ...(row.id ? { id: row.id } : {}),
    label: row.label,
    ...(row.type ? { type: row.type } : {}),
    value: row.value,
    ...(row.unit != null ? { unit: row.unit } : {}),
    ...(row.note != null ? { note: row.note } : {}),
    ...(row.highlight != null ? { highlight: row.highlight } : {}),
  }
}

function parsedRowToSearchable(row: ParsedSpecRow): SearchableRow {
  return {
    label: row.label,
    ...(row.type ? { type: row.type } : {}),
    value: row.value,
    ...(row.subItems ? { subItems: row.subItems } : {}),
  }
}

// ---------------------------------------------------------------------------
// Highlight — inline match highlighting with a paint-sweep animation
// ---------------------------------------------------------------------------

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function Highlight({
  text,
  query,
}: {
  text: string | undefined | null
  query: string
}) {
  if (!text) return null
  if (!query) return <>{text}</>

  const parts = text.split(new RegExp(`(${escapeRegex(query)})`, 'gi'))

  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <motion.span
            key={`${i}-${part}`}
            className="text-kawai-red rounded-sm px-[2px] relative"
            style={{
              backgroundImage:
                'linear-gradient(rgba(225,25,34,0.12), rgba(225,25,34,0.12))',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'left center',
            }}
            initial={{ backgroundSize: '0% 100%' }}
            animate={{ backgroundSize: '100% 100%' }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1], delay: i * 0.015 }}
          >
            {part}
          </motion.span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  )
}

// ---------------------------------------------------------------------------
// Unified row renderer (modal only — uses Highlight)
// ---------------------------------------------------------------------------

function ModalSpecRow({ row, query }: { row: SearchableRow; query: string }) {
  const valueLines = (row.value || '').split('\n').filter((l) => l.trim())
  const hasSubItems = row.subItems && row.subItems.length > 0
  const isMultiLine = valueLines.length > 1

  return (
    <div
      className={`
        spec-row group relative
        grid grid-cols-[2fr_1fr_3fr] gap-4 md:gap-8
        py-4 border-b border-kawai-charcoal/10
        hover:bg-kawai-red/5 transition-colors duration-200
        ${row.highlight ? 'bg-kawai-red/10 border-kawai-red/30' : ''}
      `}
    >
      {/* Specification */}
      <div className="flex items-start gap-2">
        <span className="text-xs text-kawai-red opacity-60 font-mono mt-1 select-none">›</span>
        <span className="font-mono text-sm text-kawai-charcoal/90 font-medium tracking-tight leading-relaxed">
          <Highlight text={row.label} query={query} />
        </span>
      </div>

      {/* Type */}
      <span className="font-mono text-sm text-kawai-charcoal/60 leading-relaxed">
        {row.type ? <Highlight text={row.type} query={query} /> : '—'}
      </span>

      {/* Details */}
      <div className="flex flex-col gap-1.5">
        {hasSubItems ? (
          <>
            <span className="font-mono text-sm text-kawai-charcoal/80 leading-relaxed">
              <Highlight text={row.value} query={query} />
            </span>
            <ul className="space-y-1">
              {row.subItems!.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-2 w-1 h-1 rounded-full bg-kawai-charcoal/40 flex-shrink-0" />
                  <span className="font-mono text-xs text-kawai-charcoal/60 leading-relaxed">
                    <Highlight text={item} query={query} />
                  </span>
                </li>
              ))}
            </ul>
          </>
        ) : isMultiLine ? (
          <ul className="space-y-1">
            {valueLines.map((line, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-2 w-1 h-1 rounded-full bg-kawai-charcoal/40 flex-shrink-0" />
                <span className="font-mono text-sm text-kawai-charcoal font-semibold leading-relaxed">
                  <Highlight text={line.trim()} query={query} />
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-mono text-sm text-kawai-charcoal font-semibold leading-relaxed">
              <Highlight text={row.value || '—'} query={query} />
            </span>
            {row.unit && (
              <span className="font-mono text-xs text-kawai-charcoal/50 uppercase tracking-wider font-medium">
                <Highlight text={row.unit} query={query} />
              </span>
            )}
          </div>
        )}
        {row.note && (
          <span className="text-xs text-kawai-charcoal/60 italic leading-relaxed">
            <Highlight text={row.note} query={query} />
          </span>
        )}
      </div>

      {/* Hover accent — slides down from top */}
      <motion.div
        className="absolute left-0 top-0 w-0.5 bg-kawai-red origin-top"
        initial={false}
        variants={{
          rest: { scaleY: 0, opacity: 0 },
          hover: { scaleY: 1, opacity: 1 },
        }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        style={{ height: '100%' }}
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Searchable modal
// ---------------------------------------------------------------------------

const rowVariants = {
  hidden: { opacity: 0, y: 5 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.22, ease: [0.4, 0, 0.2, 1], delay: i * 0.03 },
  }),
}

function SpecsModal({
  isOpen,
  onClose,
  title,
  rows,
}: {
  isOpen: boolean
  onClose: () => void
  title: string
  rows: SearchableRow[]
}) {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [shakeKey, setShakeKey] = useState(0)
  const prefersReduced = useReducedMotion()
  const inputRef = useRef<HTMLInputElement>(null)

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setQuery('')
      setFocused(false)
    }
  }, [isOpen])

  const q = query.trim().toLowerCase()

  const filtered = q
    ? rows.filter(
        (row) =>
          row.label.toLowerCase().includes(q) ||
          (row.type?.toLowerCase().includes(q) ?? false) ||
          row.value.toLowerCase().includes(q) ||
          (row.unit?.toLowerCase().includes(q) ?? false) ||
          (row.note?.toLowerCase().includes(q) ?? false) ||
          (row.subItems?.some((s) => s.toLowerCase().includes(q)) ?? false),
      )
    : rows

  const isSearching = q.length > 0
  const hasResults = filtered.length > 0

  // Shake input when search yields nothing
  useEffect(() => {
    if (isSearching && !hasResults) {
      setShakeKey((k) => k + 1)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSearching && !hasResults])

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <motion.div
        className="flex flex-col gap-3 max-h-[75vh] overflow-hidden"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >

        {/* ── Title + count ─────────────────────────────────────── */}
        <div className="flex items-baseline justify-between gap-4 shrink-0 pr-8">
          <h3 className="font-serif text-2xl font-bold text-kawai-charcoal">{title}</h3>
          <AnimatePresence mode="wait">
            <motion.span
              key={`${filtered.length}-${isSearching}`}
              className={`font-mono text-xs whitespace-nowrap tabular-nums ${
                isSearching && !hasResults
                  ? 'text-kawai-red/70'
                  : isSearching
                    ? 'text-kawai-red'
                    : 'text-kawai-charcoal/35'
              }`}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
            >
              {isSearching
                ? hasResults
                  ? `${filtered.length} / ${rows.length}`
                  : '0 matches'
                : `${rows.length} specifications`}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* ── Search input ──────────────────────────────────────── */}
        <motion.div
          key={shakeKey}
          className="relative shrink-0"
          animate={
            prefersReduced
              ? {}
              : shakeKey > 0 && isSearching && !hasResults
                ? { x: [0, -5, 5, -4, 4, -2, 2, 0] }
                : { x: 0 }
          }
          transition={{ duration: 0.35, ease: 'easeInOut' }}
        >
          {/* Animated icon — dims to red on focus */}
          <motion.div
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            animate={{ color: focused || isSearching ? '#E11922' : 'rgba(44,44,44,0.35)' }}
            transition={{ duration: 0.2 }}
          >
            <MagnifyingGlassIcon className="w-4 h-4" aria-hidden="true" />
          </motion.div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                if (query) setQuery('')
                else onClose()
              }
            }}
            placeholder="Search specifications…"
            autoFocus
            className="
              w-full pl-9 pr-9 py-3
              font-mono text-sm
              bg-white
              border border-kawai-neutral
              focus:outline-none
              text-kawai-charcoal placeholder:text-kawai-charcoal/25
              transition-colors duration-200
            "
            style={{
              borderColor: focused || isSearching
                ? isSearching && !hasResults
                  ? 'rgba(225,25,34,0.5)'
                  : '#E11922'
                : undefined,
              boxShadow: focused
                ? isSearching && !hasResults
                  ? '0 0 0 3px rgba(225,25,34,0.08)'
                  : '0 0 0 3px rgba(225,25,34,0.06)'
                : undefined,
            }}
          />

          {/* Animated underline bar */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-[2px] bg-kawai-red origin-center pointer-events-none"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: focused || isSearching ? 1 : 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          />

          {/* Clear button — spins in */}
          <AnimatePresence>
            {query && (
              <motion.button
                initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                transition={{
                  duration: 0.2,
                  ease: [0.34, 1.56, 0.64, 1], // spring overshoot
                }}
                onClick={() => {
                  setQuery('')
                  inputRef.current?.focus()
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-kawai-charcoal/35 hover:text-kawai-red transition-colors duration-150"
                aria-label="Clear search"
              >
                <XMarkIcon className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Column headers ────────────────────────────────────── */}
        <div className="grid grid-cols-[2fr_1fr_3fr] gap-4 md:gap-8 pb-2 border-b-2 border-kawai-red shrink-0">
          <span className="font-mono text-xs text-kawai-red uppercase tracking-[0.15em] font-semibold pl-5">
            Specification
          </span>
          <span className="font-mono text-xs text-kawai-red uppercase tracking-[0.15em] font-semibold">
            Type
          </span>
          <span className="font-mono text-xs text-kawai-red uppercase tracking-[0.15em] font-semibold">
            Details
          </span>
        </div>

        {/* ── Rows ──────────────────────────────────────────────── */}
        <div className="overflow-y-auto flex-1 min-h-0 -mr-2 pr-2">
          <AnimatePresence mode="popLayout" initial={false}>
            {hasResults ? (
              filtered.map((row, i) => (
                <motion.div
                  key={row.id || row.label}
                  layout="position"
                  custom={Math.min(i, 8)}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, transition: { duration: 0.1 } }}
                >
                  <ModalSpecRow row={row} query={query.trim()} />
                </motion.div>
              ))
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                className="flex flex-col items-center justify-center py-16 gap-4"
              >
                {/* Pulsing glass icon */}
                <motion.div
                  animate={
                    prefersReduced
                      ? {}
                      : { scale: [1, 1.08, 1], opacity: [0.2, 0.35, 0.2] }
                  }
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <MagnifyingGlassIcon className="w-9 h-9 text-kawai-charcoal/25" />
                </motion.div>

                <motion.div
                  className="text-center space-y-2"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.22 }}
                >
                  <p className="font-mono text-sm text-kawai-charcoal/45">
                    No specifications match{' '}
                    <span className="text-kawai-charcoal/70 font-medium">"{query}"</span>
                  </p>
                  <p className="font-mono text-xs text-kawai-charcoal/30">
                    Try a different term — specification, type, or value
                  </p>
                </motion.div>

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  onClick={() => {
                    setQuery('')
                    inputRef.current?.focus()
                  }}
                  className="font-mono text-xs text-kawai-red hover:text-kawai-red/70 uppercase tracking-[0.15em] transition-colors duration-150 flex items-center gap-2"
                >
                  <XMarkIcon className="w-3 h-3" />
                  Clear search
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Keyboard hint ─────────────────────────────────────── */}
        <AnimatePresence>
          {isSearching && (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.2 }}
              className="font-mono text-[10px] text-kawai-charcoal/25 shrink-0 text-right"
            >
              esc to clear
            </motion.p>
          )}
        </AnimatePresence>

      </motion.div>
    </Modal>
  )
}

// ---------------------------------------------------------------------------
// Sub-components (inline preview — unchanged)
// ---------------------------------------------------------------------------

function ViewAllButton({ totalCount, onClick }: { totalCount: number; onClick: () => void }) {
  return (
    <div className="mt-4 pt-3 border-t border-kawai-charcoal/10">
      <button
        onClick={onClick}
        className="flex items-center gap-2 font-mono text-xs text-kawai-red uppercase tracking-[0.15em] hover:text-kawai-red/70 transition-colors duration-150"
      >
        <span className="w-3 h-px bg-current" />
        View full spec sheet — {totalCount} specifications
        <svg
          className="w-3 h-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}

const SPECS_COL_HEADERS = (
  <div className="grid grid-cols-[2fr_1fr_3fr] gap-4 md:gap-8 pb-2 border-b-2 border-kawai-red mb-1 shrink-0">
    <span className="font-mono text-xs text-kawai-red uppercase tracking-[0.15em] font-semibold pl-5">
      Specification
    </span>
    <span className="font-mono text-xs text-kawai-red uppercase tracking-[0.15em] font-semibold">
      Type
    </span>
    <span className="font-mono text-xs text-kawai-red uppercase tracking-[0.15em] font-semibold">
      Details
    </span>
  </div>
)

function ProductRowsSection({ rows }: { rows: SpecRow[] }) {
  const [modalOpen, setModalOpen] = useState(false)
  const needsModal = rows.length > INITIAL_VISIBLE
  const visibleRows = needsModal ? rows.slice(0, INITIAL_VISIBLE) : rows
  const searchableRows = rows.map(specRowToSearchable)

  return (
    <div>
      {SPECS_COL_HEADERS}
      <div className="space-y-0">
        {visibleRows.map((row, idx) => (
          <SpecificationRow key={row.id || idx} spec={row} />
        ))}
      </div>
      {needsModal && (
        <ViewAllButton totalCount={rows.length} onClick={() => setModalOpen(true)} />
      )}
      <SpecsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Technical Specifications"
        rows={searchableRows}
      />
    </div>
  )
}

function SpecificationRow({ spec }: { spec: SpecRow }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className={`
        spec-row group relative
        grid grid-cols-[2fr_1fr_3fr] gap-4 md:gap-8
        py-4 border-b border-kawai-charcoal/10
        hover:bg-kawai-red/5 transition-all duration-200
        ${spec.highlight ? 'bg-kawai-red/10 border-kawai-red/30' : ''}
      `}
    >
      <div className="flex items-start gap-2">
        <span className="text-xs text-kawai-red opacity-60 font-mono mt-1 select-none">›</span>
        <span className="font-mono text-sm text-kawai-charcoal/90 font-medium tracking-tight leading-relaxed">
          {spec.label}
        </span>
      </div>
      <span className="font-mono text-sm text-kawai-charcoal/60 leading-relaxed">
        {spec.type || '—'}
      </span>
      <div className="flex flex-col gap-1.5">
        {(() => {
          const lines = (spec.value || '').split('\n').filter((l) => l.trim())
          if (lines.length <= 1) {
            return (
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="font-mono text-sm text-kawai-charcoal font-semibold leading-relaxed">
                  {spec.value || '—'}
                </span>
                {spec.unit && (
                  <span className="font-mono text-xs text-kawai-charcoal/50 uppercase tracking-wider font-medium">
                    {spec.unit}
                  </span>
                )}
              </div>
            )
          }
          return (
            <ul className="space-y-1">
              {lines.map((line, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-2 w-1 h-1 rounded-full bg-kawai-charcoal/40 flex-shrink-0" />
                  <span className="font-mono text-sm text-kawai-charcoal font-semibold leading-relaxed">
                    {line.trim()}
                  </span>
                </li>
              ))}
            </ul>
          )
        })()}
        {spec.note && (
          <span className="text-xs text-kawai-charcoal/60 italic leading-relaxed">{spec.note}</span>
        )}
      </div>
      <div className="absolute left-0 top-0 h-full w-0.5 bg-kawai-red opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
    </motion.div>
  )
}

function SpecificationCategory({ category }: { category: SpecCategory }) {
  const [isExpanded, setIsExpanded] = useState(category.defaultExpanded !== false)
  const [modalOpen, setModalOpen] = useState(false)
  const specs = category.specifications
  const needsModal = specs.length > INITIAL_VISIBLE
  const visibleSpecs = needsModal ? specs.slice(0, INITIAL_VISIBLE) : specs
  const searchableRows = specs.map(specRowToSearchable)

  return (
    <div className="spec-category mb-10">
      <button
        onClick={() => category.collapsible && setIsExpanded(!isExpanded)}
        className={`
          w-full flex items-center justify-between gap-4 mb-6 group
          ${category.collapsible ? 'cursor-pointer' : 'cursor-default'}
        `}
        disabled={!category.collapsible}
        aria-expanded={isExpanded}
        aria-controls={`category-${category.categoryName.replace(/\s+/g, '-')}`}
      >
        <div className="flex items-center gap-3">
          <h3 className="font-serif text-2xl md:text-3xl text-kawai-charcoal font-bold tracking-tight">
            {category.categoryName}
          </h3>
          <div
            className="hidden md:block w-8 h-0.5 bg-kawai-red/30 group-hover:w-12 transition-all duration-300"
            aria-hidden="true"
          />
        </div>
        {category.collapsible && (
          <motion.div
            animate={{ rotate: isExpanded ? 0 : -90 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            {isExpanded ? (
              <ChevronUpIcon className="w-5 h-5 text-kawai-charcoal/40 group-hover:text-kawai-red transition-colors" />
            ) : (
              <ChevronDownIcon className="w-5 h-5 text-kawai-charcoal/40 group-hover:text-kawai-red transition-colors" />
            )}
          </motion.div>
        )}
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            id={`category-${category.categoryName.replace(/\s+/g, '-')}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-[2fr_1fr_3fr] gap-4 md:gap-8 pb-2 border-b-2 border-kawai-red mb-1">
              <span className="font-mono text-xs text-kawai-red uppercase tracking-[0.15em] font-semibold pl-5">
                Specification
              </span>
              <span className="font-mono text-xs text-kawai-red uppercase tracking-[0.15em] font-semibold">
                Type
              </span>
              <span className="font-mono text-xs text-kawai-red uppercase tracking-[0.15em] font-semibold">
                Details
              </span>
            </div>
            <div className="space-y-0">
              {visibleSpecs.map((spec, idx) => (
                <SpecificationRow key={spec.id || idx} spec={spec} />
              ))}
            </div>
            {needsModal && (
              <ViewAllButton totalCount={specs.length} onClick={() => setModalOpen(true)} />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <SpecsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={category.categoryName}
        rows={searchableRows}
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// JSON spec section
// ---------------------------------------------------------------------------

function JsonSpecRow({ row }: { row: ParsedSpecRow }) {
  return (
    <div
      className="
        spec-row group relative
        grid grid-cols-[2fr_1fr_3fr] gap-4 md:gap-8
        py-4 border-b border-kawai-charcoal/10
        hover:bg-kawai-red/5 transition-all duration-200
      "
    >
      <div className="flex items-start gap-2">
        <span className="text-xs text-kawai-red opacity-60 font-mono mt-1 select-none">›</span>
        <span className="font-mono text-sm text-kawai-charcoal/90 font-medium tracking-tight leading-relaxed">
          {row.label}
        </span>
      </div>
      <span className="font-mono text-sm text-kawai-charcoal font-semibold leading-relaxed">
        {row.type ?? '—'}
      </span>
      <div className="flex flex-col gap-1.5">
        <span className="font-mono text-sm text-kawai-charcoal/80 leading-relaxed">
          {row.value}
        </span>
        {row.subItems && row.subItems.length > 0 && (
          <ul className="space-y-1">
            {row.subItems.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-2 w-1 h-1 rounded-full bg-kawai-charcoal/40 flex-shrink-0" />
                <span className="font-mono text-xs text-kawai-charcoal/60 leading-relaxed">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="absolute left-0 top-0 h-full w-0.5 bg-kawai-red opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
    </div>
  )
}

function JsonSpecsSection({ rows }: { rows: ParsedSpecRow[] }) {
  const [modalOpen, setModalOpen] = useState(false)
  const needsModal = rows.length > INITIAL_VISIBLE
  const visibleRows = needsModal ? rows.slice(0, INITIAL_VISIBLE) : rows
  const searchableRows = rows.map(parsedRowToSearchable)

  if (rows.length === 0) {
    return (
      <div className="text-center py-12 opacity-50">
        <p className="font-mono text-sm">No specification data available.</p>
      </div>
    )
  }

  return (
    <div>
      {SPECS_COL_HEADERS}
      <div className="space-y-0">
        {visibleRows.map((row, idx) => (
          <JsonSpecRow key={idx} row={row} />
        ))}
      </div>
      {needsModal && (
        <ViewAllButton totalCount={rows.length} onClick={() => setModalOpen(true)} />
      )}
      <SpecsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Technical Specifications"
        rows={searchableRows}
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main renderer
// ---------------------------------------------------------------------------

export function ProductTechnicalSpecsRenderer({
  product,
  dataSource = 'product',
  header,
  blueprintImage,
  blueprintCaption,
  categories,
  showRegistrationMarks,
  enableDownload,
  downloadButtonText,
}: ProductTechnicalSpecsRendererProps) {
  const productRows: SpecRow[] =
    (dataSource === 'product' || dataSource === 'hybrid') && product?.specifications
      ? transformProductSpecs(product.specifications)
      : []

  const manualCategories: SpecCategory[] =
    dataSource === 'manual' || dataSource === 'hybrid'
      ? normaliseManualCategories(categories || [])
      : []

  const jsonRows: ParsedSpecRow[] =
    dataSource === 'json' && product?.specificationJson
      ? parseSpecificationJson(product.specificationJson as Record<string, unknown>)
      : []

  const hasSpecs = productRows.length > 0 || manualCategories.length > 0 || jsonRows.length > 0

  const productBlueprintUrl =
    (dataSource === 'product' || dataSource === 'hybrid' || dataSource === 'json') &&
    product?.blueprint?.url
      ? product.blueprint.url
      : null

  const productBlueprintAlt =
    product?.blueprint?.alt || blueprintCaption || `${product?.name ?? 'Product'} Blueprint`

  const cmsBlueprint =
    (dataSource === 'manual' || dataSource === 'hybrid') && blueprintImage
      ? getImagePropsWithFallback(blueprintImage, '', 'hero', {
          priority: false,
          sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px',
        })
      : null

  const hasBlueprintToShow = productBlueprintUrl || cmsBlueprint

  return (
    <section
      className="technical-specs-block relative py-16 md:py-24 lg:py-32 overflow-hidden"
      style={{ backgroundColor: '#F2F2F0', color: '#1a1a1a' }}
    >
      {showRegistrationMarks && (
        <>
          <div className="absolute top-8 left-8 w-8 h-8 border-l-2 border-t-2 border-kawai-red opacity-40" aria-hidden="true" />
          <div className="absolute top-8 right-8 w-8 h-8 border-r-2 border-t-2 border-kawai-red opacity-40" aria-hidden="true" />
          <div className="absolute bottom-8 left-8 w-8 h-8 border-l-2 border-b-2 border-kawai-red opacity-40" aria-hidden="true" />
          <div className="absolute bottom-8 right-8 w-8 h-8 border-r-2 border-b-2 border-kawai-red opacity-40" aria-hidden="true" />
        </>
      )}

      <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
        {hasBlueprintToShow ? (
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 lg:items-start">
            <div className="min-w-0 flex-1">
              <div className="lg:hidden mb-8">
                <div className="space-y-3">
                  {header?.showModelNumber && product?.model && (
                    <div className="font-mono text-xs text-kawai-red uppercase tracking-[0.2em] font-semibold">
                      Model: {product.model}
                    </div>
                  )}
                  <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight">
                    {header?.title || 'Technical Specifications'}
                  </h2>
                  {header?.subtitle && (
                    <p className="text-lg md:text-xl opacity-70 font-light tracking-wide max-w-2xl">
                      {header.subtitle}
                    </p>
                  )}
                </div>
              </div>
              <div className="lg:hidden mb-10">
                <div className="relative overflow-hidden rounded-lg shadow-lg w-full">
                  {productBlueprintUrl && (
                    <Image
                      src={productBlueprintUrl}
                      alt={productBlueprintAlt}
                      width={product?.blueprint?.width || 1200}
                      height={product?.blueprint?.height || 800}
                      className="w-full h-auto"
                    />
                  )}
                  {!productBlueprintUrl && cmsBlueprint && (
                    <Image
                      {...cmsBlueprint}
                      alt={blueprintCaption || 'Technical blueprint diagram'}
                      className="w-full h-auto"
                    />
                  )}
                </div>
                {blueprintCaption && (
                  <p className="mt-3 font-mono text-xs uppercase tracking-wider opacity-60 text-center">
                    {blueprintCaption}
                  </p>
                )}
              </div>
              {hasSpecs ? (
                <>
                  {dataSource === 'json' && jsonRows.length > 0 && (
                    <JsonSpecsSection rows={jsonRows} />
                  )}
                  {productRows.length > 0 && dataSource !== 'json' && (
                    <ProductRowsSection rows={productRows} />
                  )}
                  {manualCategories.map((category, idx) => (
                    <SpecificationCategory key={idx} category={category} />
                  ))}
                </>
              ) : (
                <div className="text-center py-12 opacity-50">
                  <p className="font-mono text-sm">
                    No specifications available. Add a product with specifications or switch to Manual mode.
                  </p>
                </div>
              )}
            </div>

            <div className="hidden lg:flex flex-col flex-none lg:sticky lg:top-0 lg:w-[480px] xl:w-[580px] gap-8">
              <div className="space-y-3">
                {header?.showModelNumber && product?.model && (
                  <div className="font-mono text-xs text-kawai-red uppercase tracking-[0.2em] font-semibold">
                    Model: {product.model}
                  </div>
                )}
                <h2 className="font-serif text-4xl xl:text-5xl font-bold leading-tight">
                  {header?.title || 'Technical Specifications'}
                </h2>
                {header?.subtitle && (
                  <p className="text-lg opacity-70 font-light tracking-wide">{header.subtitle}</p>
                )}
                {enableDownload && (
                  <button
                    className="
                      inline-flex items-center gap-2.5 px-6 py-3.5 mt-2
                      bg-kawai-red hover:bg-kawai-red/90
                      text-white font-mono text-sm uppercase tracking-wider font-medium
                      transition-all duration-200
                      border-2 border-kawai-red hover:border-kawai-red/70
                      shadow-lg hover:shadow-xl hover:scale-[1.02]
                    "
                    onClick={() => console.log('Download specifications')}
                    aria-label="Download technical specifications"
                  >
                    <ArrowDownTrayIcon className="w-4 h-4" />
                    {downloadButtonText || 'Download Technical Specs'}
                  </button>
                )}
              </div>
              <div>
                <div className="relative overflow-hidden rounded-lg shadow-lg w-full">
                  {productBlueprintUrl && (
                    <Image
                      src={productBlueprintUrl}
                      alt={productBlueprintAlt}
                      width={product?.blueprint?.width || 1200}
                      height={product?.blueprint?.height || 800}
                      className="w-full h-auto"
                    />
                  )}
                  {!productBlueprintUrl && cmsBlueprint && (
                    <Image
                      {...cmsBlueprint}
                      alt={blueprintCaption || 'Technical blueprint diagram'}
                      className="w-full h-auto"
                    />
                  )}
                </div>
                {blueprintCaption && (
                  <p className="mt-3 font-mono text-xs uppercase tracking-wider opacity-60 text-center">
                    {blueprintCaption}
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-8 lg:gap-12">
            <div className="space-y-3">
              {header?.showModelNumber && product?.model && (
                <div className="font-mono text-xs text-kawai-red uppercase tracking-[0.2em] font-semibold">
                  Model: {product.model}
                </div>
              )}
              <h2 className="font-serif text-4xl md:text-5xl xl:text-6xl font-bold leading-tight">
                {header?.title || 'Technical Specifications'}
              </h2>
              {header?.subtitle && (
                <p className="text-lg md:text-xl opacity-70 font-light tracking-wide max-w-2xl">
                  {header.subtitle}
                </p>
              )}
              {enableDownload && (
                <button
                  className="
                    inline-flex items-center gap-2.5 px-6 py-3.5 mt-2
                    bg-kawai-red hover:bg-kawai-red/90
                    text-white font-mono text-sm uppercase tracking-wider font-medium
                    transition-all duration-200
                    border-2 border-kawai-red hover:border-kawai-red/70
                    shadow-lg hover:shadow-xl hover:scale-[1.02]
                  "
                  onClick={() => console.log('Download specifications')}
                  aria-label="Download technical specifications"
                >
                  <ArrowDownTrayIcon className="w-4 h-4" />
                  {downloadButtonText || 'Download Technical Specs'}
                </button>
              )}
            </div>
            {hasSpecs ? (
              <>
                {dataSource === 'json' && jsonRows.length > 0 && (
                  <JsonSpecsSection rows={jsonRows} />
                )}
                {productRows.length > 0 && dataSource !== 'json' && (
                  <ProductRowsSection rows={productRows} />
                )}
                {manualCategories.map((category, idx) => (
                  <SpecificationCategory key={idx} category={category} />
                ))}
              </>
            ) : (
              <div className="text-center py-12 opacity-50">
                <p className="font-mono text-sm">
                  No specifications available. Add a product with specifications or switch to Manual mode.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
