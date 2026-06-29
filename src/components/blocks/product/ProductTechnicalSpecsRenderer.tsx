'use client'

import Image from 'next/image'
import { useState, useRef } from 'react'
import {
  ChevronDownIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { getImagePropsWithFallback } from '@/lib/media/r2-utils'
import type { Media, Product } from '@/payload-types'
import { parseSpecificationJson, type ParsedSpecRow } from '@/lib/utils/parse-specification-json'
import { trackFileDownload } from '@/lib/analytics/unified-tracking'

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

// ---------------------------------------------------------------------------
// Highlight — marks query matches inline
// ---------------------------------------------------------------------------

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function Highlight({ text, query }: { text: string | undefined | null; query: string }) {
  if (!text) return null
  if (!query) return <>{text}</>
  const parts = text.split(new RegExp(`(${escapeRegex(query)})`, 'gi'))
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <mark key={i} className="bg-kawai-red/15 text-kawai-red not-italic rounded-[2px] px-[1px]">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  )
}

// ---------------------------------------------------------------------------
// Column headers (2-column)
// ---------------------------------------------------------------------------

const SPECS_COL_HEADERS = (
  <div className="grid grid-cols-[2fr_3fr] gap-6 md:gap-10 pb-2.5 border-b-2 border-kawai-red mb-1">
    <span className="text-[10px] text-kawai-red uppercase tracking-[0.2em] font-semibold">
      Specification
    </span>
    <span className="text-[10px] text-kawai-red uppercase tracking-[0.2em] font-semibold">
      Details
    </span>
  </div>
)

// ---------------------------------------------------------------------------
// ShowMoreButton
// ---------------------------------------------------------------------------

function ShowMoreButton({
  expanded,
  hiddenCount,
  onToggle,
}: {
  expanded: boolean
  hiddenCount: number
  onToggle: () => void
}) {
  return (
    <div className="mt-6 flex justify-center">
      <button
        onClick={onToggle}
        className={cn(
          'group flex items-center gap-2 px-5 py-2.5 rounded-full',
          'border border-kawai-charcoal/12 hover:border-kawai-red/35',
          'text-xs text-kawai-muted hover:text-kawai-red',
          'bg-white hover:bg-kawai-red/[0.025]',
          'shadow-sm hover:shadow-md',
          'transition-all duration-200',
        )}
      >
        {expanded ? 'Show less' : `Show ${hiddenCount} more`}
        <motion.span
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
          className="flex items-center"
        >
          <ChevronDownIcon className="w-3.5 h-3.5" />
        </motion.span>
      </button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sticky search bar
// ---------------------------------------------------------------------------

function SpecSearchBar({
  query,
  onChange,
  resultCount,
  totalCount,
}: {
  query: string
  onChange: (q: string) => void
  resultCount: number
  totalCount: number
}) {
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const isSearching = query.length > 0
  const noResults = isSearching && resultCount === 0

  return (
    <div
      className={cn(
        'relative flex items-center rounded-xl border transition-all duration-200',
        focused || isSearching
          ? noResults
            ? 'border-kawai-red/40 shadow-[0_0_0_3px_rgba(225,25,34,0.07)]'
            : 'border-kawai-red/50 shadow-[0_0_0_3px_rgba(225,25,34,0.06)]'
          : 'border-kawai-charcoal/12 shadow-sm hover:border-kawai-charcoal/20',
        'bg-white',
      )}
    >
      {/* Search icon */}
      <motion.div
        className="absolute left-4 pointer-events-none"
        animate={{ color: focused || isSearching ? '#E11922' : 'rgba(44,44,44,0.28)' }}
        transition={{ duration: 0.2 }}
      >
        <MagnifyingGlassIcon className="w-4 h-4" />
      </motion.div>

      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={(e) => {
          if (e.key === 'Escape' && query) onChange('')
        }}
        placeholder="Search specifications…"
        className="w-full pl-11 pr-28 py-3.5 text-sm text-kawai-charcoal placeholder:text-kawai-charcoal/28 bg-transparent outline-none"
      />

      {/* Result count */}
      <AnimatePresence mode="wait">
        <motion.span
          key={`${resultCount}-${isSearching}`}
          className={cn(
            'absolute right-10 text-xs tabular-nums whitespace-nowrap',
            noResults
              ? 'text-kawai-red/55'
              : isSearching
                ? 'text-kawai-charcoal/38'
                : 'text-kawai-charcoal/22',
          )}
          initial={{ opacity: 0, y: -3 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 3 }}
          transition={{ duration: 0.14 }}
        >
          {isSearching
            ? noResults
              ? 'No results'
              : `${resultCount} of ${totalCount}`
            : `${totalCount} specs`}
        </motion.span>
      </AnimatePresence>

      {/* Clear button */}
      <AnimatePresence>
        {query && (
          <motion.button
            initial={{ opacity: 0, scale: 0.6, rotate: -45 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.6, rotate: 45 }}
            transition={{ duration: 0.16, ease: [0.34, 1.56, 0.64, 1] }}
            onClick={() => {
              onChange('')
              inputRef.current?.focus()
            }}
            className="absolute right-3.5 p-1.5 rounded-full text-kawai-charcoal/28 hover:text-kawai-red hover:bg-kawai-red/5 transition-colors duration-150"
            aria-label="Clear search"
          >
            <XMarkIcon className="w-3.5 h-3.5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

// ---------------------------------------------------------------------------
// SpecificationRow — self-contained animation with index-based stagger
// ---------------------------------------------------------------------------

function SpecificationRow({
  spec,
  query = '',
  index = 0,
}: {
  spec: SpecRow
  query?: string
  index?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
        delay: Math.min(index, 10) * 0.035,
      }}
      className={cn(
        'spec-row group relative',
        'grid grid-cols-[2fr_3fr] gap-6 md:gap-10',
        'py-4 border-b border-kawai-charcoal/[0.07]',
        'hover:bg-kawai-red/[0.025] transition-colors duration-150',
        spec.highlight && 'bg-kawai-red/[0.04] border-l-2 border-l-kawai-red pl-3',
      )}
    >
      <span className="text-sm text-kawai-muted leading-relaxed">
        <Highlight text={spec.label} query={query} />
      </span>
      <div className="flex flex-col gap-1.5">
        {(() => {
          const lines = (spec.value || '').split('\n').filter((l) => l.trim())
          if (lines.length <= 1) {
            return (
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="font-mono text-sm text-kawai-charcoal font-semibold leading-relaxed">
                  <Highlight text={spec.value || '—'} query={query} />
                </span>
                {spec.unit && (
                  <span className="text-[11px] text-kawai-charcoal/38 uppercase tracking-wider">
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
                  <span className="mt-[7px] w-1 h-1 rounded-full bg-kawai-charcoal/28 flex-shrink-0" />
                  <span className="font-mono text-sm text-kawai-charcoal font-semibold leading-relaxed">
                    <Highlight text={line.trim()} query={query} />
                  </span>
                </li>
              ))}
            </ul>
          )
        })()}
        {spec.note && (
          <span className="text-xs text-kawai-muted italic leading-relaxed">{spec.note}</span>
        )}
      </div>
      <div className="absolute left-0 top-0 h-full w-[2px] bg-kawai-red opacity-0 group-hover:opacity-60 transition-opacity duration-200" />
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// JsonSpecRow — self-contained animation with index-based stagger
// ---------------------------------------------------------------------------

function JsonSpecRow({
  row,
  query = '',
  index = 0,
}: {
  row: ParsedSpecRow
  query?: string
  index?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
        delay: Math.min(index, 10) * 0.035,
      }}
      className="spec-row group relative grid grid-cols-[2fr_3fr] gap-6 md:gap-10 py-4 border-b border-kawai-charcoal/[0.07] hover:bg-kawai-red/[0.025] transition-colors duration-150"
    >
      <span className="text-sm text-kawai-muted leading-relaxed">
        <Highlight text={row.label} query={query} />
      </span>
      <div className="flex flex-col gap-1.5">
        <span className="font-mono text-sm text-kawai-charcoal font-semibold leading-relaxed">
          <Highlight text={row.value} query={query} />
        </span>
        {row.subItems && row.subItems.length > 0 && (
          <ul className="space-y-1">
            {row.subItems.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-[7px] w-1 h-1 rounded-full bg-kawai-charcoal/28 flex-shrink-0" />
                <span className="text-xs text-kawai-muted leading-relaxed">
                  <Highlight text={item} query={query} />
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="absolute left-0 top-0 h-full w-[2px] bg-kawai-red opacity-0 group-hover:opacity-60 transition-opacity duration-200" />
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// ProductRowsSection
// ---------------------------------------------------------------------------

function ProductRowsSection({ rows, query }: { rows: SpecRow[]; query: string }) {
  const [expanded, setExpanded] = useState(false)
  const isSearching = query.length > 0
  const needsToggle = !isSearching && rows.length > INITIAL_VISIBLE
  const hiddenCount = rows.length - INITIAL_VISIBLE
  const visibleRows = needsToggle && !expanded ? rows.slice(0, INITIAL_VISIBLE) : rows

  if (rows.length === 0 && isSearching) return null

  return (
    <div>
      {SPECS_COL_HEADERS}
      <div className="space-y-0">
        {visibleRows.map((row, idx) => (
          <SpecificationRow
            key={row.id || `${row.label}-${idx}`}
            spec={row}
            query={query}
            index={idx}
          />
        ))}
      </div>
      {needsToggle && (
        <ShowMoreButton
          expanded={expanded}
          hiddenCount={hiddenCount}
          onToggle={() => setExpanded(!expanded)}
        />
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// JsonSpecsSection
// ---------------------------------------------------------------------------

function JsonSpecsSection({ rows, query }: { rows: ParsedSpecRow[]; query: string }) {
  const [expanded, setExpanded] = useState(false)
  const isSearching = query.length > 0
  const needsToggle = !isSearching && rows.length > INITIAL_VISIBLE
  const hiddenCount = rows.length - INITIAL_VISIBLE
  const visibleRows = needsToggle && !expanded ? rows.slice(0, INITIAL_VISIBLE) : rows

  if (rows.length === 0) {
    return isSearching ? null : (
      <div className="text-center py-12 text-kawai-muted">
        <p className="text-sm">No specification data available.</p>
      </div>
    )
  }

  return (
    <div>
      {SPECS_COL_HEADERS}
      <div className="space-y-0">
        {visibleRows.map((row, idx) => (
          <JsonSpecRow
            key={`${row.label}-${idx}`}
            row={row}
            query={query}
            index={idx}
          />
        ))}
      </div>
      {needsToggle && (
        <ShowMoreButton
          expanded={expanded}
          hiddenCount={hiddenCount}
          onToggle={() => setExpanded(!expanded)}
        />
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// SpecificationCategory
// ---------------------------------------------------------------------------

function SpecificationCategory({ category, query }: { category: SpecCategory; query: string }) {
  const [isExpanded, setIsExpanded] = useState(category.defaultExpanded !== false)
  const [specsExpanded, setSpecsExpanded] = useState(false)
  const specs = category.specifications
  const isSearching = query.length > 0
  const needsToggle = !isSearching && specs.length > INITIAL_VISIBLE
  const hiddenCount = specs.length - INITIAL_VISIBLE
  const visibleSpecs = needsToggle && !specsExpanded ? specs.slice(0, INITIAL_VISIBLE) : specs

  // Auto-expand when searching
  const effectiveExpanded = isSearching ? true : isExpanded

  if (specs.length === 0 && isSearching) return null

  return (
    <div className="spec-category mb-8">
      <button
        onClick={() => !isSearching && category.collapsible && setIsExpanded(!isExpanded)}
        className={cn(
          'w-full flex items-center justify-between gap-4 mb-5 group',
          category.collapsible && !isSearching ? 'cursor-pointer' : 'cursor-default',
        )}
        disabled={!category.collapsible || isSearching}
        aria-expanded={effectiveExpanded}
        aria-controls={`category-${category.categoryName.replace(/\s+/g, '-')}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-0.5 h-5 bg-kawai-red flex-shrink-0" aria-hidden="true" />
          <h3 className="font-serif text-xl md:text-2xl text-kawai-charcoal font-bold tracking-tight">
            {category.categoryName}
          </h3>
          {isSearching && specs.length > 0 && (
            <span className="text-xs text-kawai-muted tabular-nums">
              {specs.length} match{specs.length !== 1 ? 'es' : ''}
            </span>
          )}
        </div>
        {category.collapsible && !isSearching && (
          <motion.div
            animate={{ rotate: effectiveExpanded ? 180 : 0 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
          >
            <ChevronDownIcon className="w-5 h-5 text-kawai-muted group-hover:text-kawai-red transition-colors" />
          </motion.div>
        )}
      </button>

      {/*
        Opacity-only animation avoids the overflow-hidden + Framer Motion height:auto
        clipping bug where newly added rows (from Show more) get cut off.
      */}
      <AnimatePresence initial={false}>
        {effectiveExpanded && (
          <motion.div
            id={`category-${category.categoryName.replace(/\s+/g, '-')}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="grid grid-cols-[2fr_3fr] gap-6 md:gap-10 pb-2.5 border-b-2 border-kawai-red mb-1">
              <span className="text-[10px] text-kawai-red uppercase tracking-[0.2em] font-semibold">
                Specification
              </span>
              <span className="text-[10px] text-kawai-red uppercase tracking-[0.2em] font-semibold">
                Details
              </span>
            </div>
            <div className="space-y-0">
              {visibleSpecs.map((spec, idx) => (
                <SpecificationRow
                  key={spec.id || `${spec.label}-${idx}`}
                  spec={spec}
                  query={query}
                  index={idx}
                />
              ))}
            </div>
            {needsToggle && (
              <ShowMoreButton
                expanded={specsExpanded}
                hiddenCount={hiddenCount}
                onToggle={() => setSpecsExpanded(!specsExpanded)}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Download button
// ---------------------------------------------------------------------------

function DownloadButton({
  text,
  fileUrl,
  productName,
}: {
  text: string
  fileUrl: string
  productName: string
}) {
  return (
    <button
      className={cn(
        'group inline-flex items-center gap-2.5 px-6 py-3 mt-2',
        'border border-kawai-charcoal/18 hover:border-kawai-red/50',
        'text-sm text-kawai-charcoal/70 hover:text-kawai-red',
        'bg-white hover:bg-kawai-red/[0.025]',
        'shadow-sm hover:shadow-md',
        'transition-all duration-200 rounded-lg',
      )}
      onClick={() => {
        trackFileDownload({
          blockType: 'product-technical-specs',
          blockData: {},
          fileName: text,
          fileUrl,
          additionalProps: { product_name: productName },
        })
        if (fileUrl) window.open(fileUrl, '_blank')
      }}
      aria-label="Download technical specifications"
    >
      <ArrowDownTrayIcon className="w-4 h-4 transition-transform duration-200 group-hover:translate-y-0.5" />
      {text}
    </button>
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
  const [query, setQuery] = useState('')

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

  // Filter based on query
  const q = query.trim().toLowerCase()

  const filteredProductRows = q
    ? productRows.filter(
        (r) =>
          r.label.toLowerCase().includes(q) ||
          r.value.toLowerCase().includes(q) ||
          (r.unit?.toLowerCase().includes(q) ?? false),
      )
    : productRows

  const filteredJsonRows = q
    ? jsonRows.filter(
        (r) =>
          r.label.toLowerCase().includes(q) ||
          r.value.toLowerCase().includes(q) ||
          (r.subItems?.some((s) => s.toLowerCase().includes(q)) ?? false),
      )
    : jsonRows

  const filteredManualCategories = q
    ? manualCategories
        .map((cat) => ({
          ...cat,
          specifications: cat.specifications.filter(
            (s) =>
              s.label.toLowerCase().includes(q) ||
              s.value.toLowerCase().includes(q) ||
              (s.note?.toLowerCase().includes(q) ?? false),
          ),
        }))
        .filter((cat) => cat.specifications.length > 0)
    : manualCategories

  const totalCount =
    productRows.length +
    jsonRows.length +
    manualCategories.reduce((acc, c) => acc + c.specifications.length, 0)

  const filteredCount =
    filteredProductRows.length +
    filteredJsonRows.length +
    filteredManualCategories.reduce((acc, c) => acc + c.specifications.length, 0)

  const hasSpecs = totalCount > 0

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

  const downloadFileUrl = productBlueprintUrl || ''
  const downloadText = downloadButtonText || 'Download Technical Specs'
  const productName = product?.name ?? ''

  // Sticky search bar — stays visible while scrolling through specs
  const stickySearch = hasSpecs ? (
    <div className="sticky top-[70px] xl:top-[118px] z-20 bg-white/95 backdrop-blur-sm -mx-4 md:-mx-8 px-4 md:px-8 py-3 mb-6 border-b border-kawai-charcoal/[0.06]">
      <SpecSearchBar
        query={query}
        onChange={setQuery}
        resultCount={filteredCount}
        totalCount={totalCount}
      />
    </div>
  ) : null

  const specsContent = (
    <div className="flex flex-col gap-8">
      {filteredProductRows.length > 0 && dataSource !== 'json' && (
        <ProductRowsSection rows={filteredProductRows} query={q} />
      )}
      {filteredJsonRows.length > 0 && dataSource === 'json' && (
        <JsonSpecsSection rows={filteredJsonRows} query={q} />
      )}
      {filteredManualCategories.map((category, idx) => (
        <SpecificationCategory key={idx} category={category} query={q} />
      ))}

      {/* No results state */}
      {q && filteredCount === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-14 flex flex-col items-center gap-3"
        >
          <MagnifyingGlassIcon className="w-8 h-8 text-kawai-charcoal/18" />
          <p className="text-sm text-kawai-muted">
            No specifications match{' '}
            <span className="text-kawai-muted font-medium">"{query}"</span>
          </p>
          <button
            onClick={() => setQuery('')}
            className="text-xs text-kawai-red hover:text-kawai-red/70 transition-colors"
          >
            Clear search
          </button>
        </motion.div>
      )}

      {!hasSpecs && (
        <div className="text-center py-12 text-kawai-muted">
          <p className="text-sm">
            No specifications available. Add a product with specifications or switch to Manual mode.
          </p>
        </div>
      )}
    </div>
  )

  return (
    <section className="technical-specs-block relative py-16 md:py-24 lg:py-32 bg-white">
      {showRegistrationMarks && (
        <>
          <div className="absolute top-8 left-8 w-8 h-8 border-l-2 border-t-2 border-kawai-red opacity-30" aria-hidden="true" />
          <div className="absolute top-8 right-8 w-8 h-8 border-r-2 border-t-2 border-kawai-red opacity-30" aria-hidden="true" />
          <div className="absolute bottom-8 left-8 w-8 h-8 border-l-2 border-b-2 border-kawai-red opacity-30" aria-hidden="true" />
          <div className="absolute bottom-8 right-8 w-8 h-8 border-r-2 border-b-2 border-kawai-red opacity-30" aria-hidden="true" />
        </>
      )}

      <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
        {hasBlueprintToShow ? (
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 lg:items-start">
            {/* Left: search + specs */}
            <div className="min-w-0 flex-1">
              {/* Mobile header */}
              <div className="lg:hidden mb-8 space-y-3">
                {header?.showModelNumber && product?.model && (
                  <div className="text-xs text-kawai-red uppercase tracking-[0.22em] font-medium">
                    Model: {product.model}
                  </div>
                )}
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-kawai-charcoal leading-tight">
                  {header?.title || 'Technical Specifications'}
                </h2>
                {header?.subtitle && (
                  <p className="text-base md:text-lg text-kawai-muted font-light leading-relaxed max-w-2xl">
                    {header.subtitle}
                  </p>
                )}
              </div>
              {/* Mobile blueprint */}
              <div className="lg:hidden mb-10">
                <div className="relative overflow-hidden rounded-xl shadow-md w-full">
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
                  <p className="mt-3 text-xs uppercase tracking-wider text-kawai-muted text-center">
                    {blueprintCaption}
                  </p>
                )}
              </div>
              {stickySearch}
              {specsContent}
            </div>

            {/* Right: sticky header + blueprint */}
            <div className="hidden lg:flex flex-col flex-none lg:sticky lg:top-8 lg:w-[440px] xl:w-[520px] gap-8">
              <div className="space-y-4">
                {header?.showModelNumber && product?.model && (
                  <div className="text-xs text-kawai-red uppercase tracking-[0.22em] font-medium">
                    Model: {product.model}
                  </div>
                )}
                <h2 className="font-serif text-4xl xl:text-5xl font-bold text-kawai-charcoal leading-tight">
                  {header?.title || 'Technical Specifications'}
                </h2>
                {header?.subtitle && (
                  <p className="text-base text-kawai-muted font-light leading-relaxed">
                    {header.subtitle}
                  </p>
                )}
                {enableDownload && (
                  <DownloadButton
                    text={downloadText}
                    fileUrl={downloadFileUrl}
                    productName={productName}
                  />
                )}
              </div>
              <div>
                <div className="relative overflow-hidden rounded-xl shadow-md w-full">
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
                  <p className="mt-3 text-xs uppercase tracking-wider text-kawai-muted text-center">
                    {blueprintCaption}
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-0">
            <div className="space-y-4 mb-8">
              {header?.showModelNumber && product?.model && (
                <div className="text-xs text-kawai-red uppercase tracking-[0.22em] font-medium">
                  Model: {product.model}
                </div>
              )}
              <h2 className="font-serif text-4xl md:text-5xl xl:text-6xl font-bold text-kawai-charcoal leading-tight">
                {header?.title || 'Technical Specifications'}
              </h2>
              {header?.subtitle && (
                <p className="text-base md:text-lg text-kawai-muted font-light leading-relaxed max-w-2xl">
                  {header.subtitle}
                </p>
              )}
              {enableDownload && (
                <DownloadButton
                  text={downloadText}
                  fileUrl={downloadFileUrl}
                  productName={productName}
                />
              )}
            </div>
            {stickySearch}
            {specsContent}
          </div>
        )}
      </div>
    </section>
  )
}
