'use client'

import Image from 'next/image'
import { useState } from 'react'
import { ChevronDownIcon, ChevronUpIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import { getImagePropsWithFallback } from '@/lib/media/r2-utils'
import type { Media, Product } from '@/payload-types'
import { parseSpecificationJson, type ParsedSpecRow } from '@/lib/utils/parse-specification-json'
import { Modal } from '@/components/ui/modal'

const INITIAL_VISIBLE = 6

// Re-exported interface — types will be regenerated on next build
interface ProductTechnicalSpecsRendererProps {
  product?: Product | null
  dataSource?: 'product' | 'manual' | 'hybrid' | 'json' | null
  header?: {
    title?: string | null
    subtitle?: string | null
    showModelNumber?: boolean | null
  } | null
  // CMS-uploaded blueprint (manual / hybrid modes)
  blueprintImage?: Media | string | null
  blueprintCaption?: string | null
  showGridOverlay?: boolean | null
  // Manual category entries
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

// Internal normalised spec shape used by both sources
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

/**
 * Transform product specifications from the Products collection into a flat row list.
 * Preserves spec, type, and details as individual columns.
 */
function transformProductSpecs(
  productSpecs: NonNullable<Product['specifications']>,
): SpecRow[] {
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

/**
 * Normalise manually-entered categories into the shared SpecCategory shape.
 */
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
// Sub-components
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

function SpecsModal({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <div className="flex flex-col gap-4 max-h-[75vh] overflow-hidden">
        <h3 className="font-serif text-2xl font-bold text-kawai-charcoal shrink-0 pr-8">{title}</h3>
        <div className="shrink-0">{SPECS_COL_HEADERS}</div>
        <div className="overflow-y-auto flex-1 min-h-0 -mr-2 pr-2">
          {children}
        </div>
      </div>
    </Modal>
  )
}

function ProductRowsSection({ rows }: { rows: SpecRow[] }) {
  const [modalOpen, setModalOpen] = useState(false)
  const needsModal = rows.length > INITIAL_VISIBLE
  const visibleRows = needsModal ? rows.slice(0, INITIAL_VISIBLE) : rows

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
      >
        <div className="space-y-0">
          {rows.map((row, idx) => (
            <SpecificationRow key={row.id || idx} spec={row} />
          ))}
        </div>
      </SpecsModal>
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
      {/* Specification */}
      <div className="flex items-start gap-2">
        <span className="text-xs text-kawai-red opacity-60 font-mono mt-1 select-none">›</span>
        <span className="font-mono text-sm text-kawai-charcoal/90 font-medium tracking-tight leading-relaxed">
          {spec.label}
        </span>
      </div>

      {/* Type */}
      <span className="font-mono text-sm text-kawai-charcoal/60 leading-relaxed">
        {spec.type || '—'}
      </span>

      {/* Details */}
      <div className="flex flex-col gap-1.5">
        {(() => {
          const lines = (spec.value || '').split('\n').filter(l => l.trim())
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

      {/* Hover accent */}
      <div
        className="absolute left-0 top-0 h-full w-0.5 bg-kawai-red
                   opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      />
    </motion.div>
  )
}

function SpecificationCategory({ category }: { category: SpecCategory }) {
  const [isExpanded, setIsExpanded] = useState(category.defaultExpanded !== false)
  const [modalOpen, setModalOpen] = useState(false)

  const specs = category.specifications
  const needsModal = specs.length > INITIAL_VISIBLE
  const visibleSpecs = needsModal ? specs.slice(0, INITIAL_VISIBLE) : specs

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
            className="hidden md:block w-8 h-0.5 bg-kawai-red/30
                       group-hover:w-12 transition-all duration-300"
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
            {/* Column headers */}
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
      >
        <div className="space-y-0">
          {specs.map((spec, idx) => (
            <SpecificationRow key={spec.id || idx} spec={spec} />
          ))}
        </div>
      </SpecsModal>
    </div>
  )
}

// ---------------------------------------------------------------------------
// JSON spec section (dataSource === 'json')
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
      {/* Specification label */}
      <div className="flex items-start gap-2">
        <span className="text-xs text-kawai-red opacity-60 font-mono mt-1 select-none">›</span>
        <span className="font-mono text-sm text-kawai-charcoal/90 font-medium tracking-tight leading-relaxed">
          {row.label}
        </span>
      </div>

      {/* Type / name (middle column) */}
      <span className="font-mono text-sm text-kawai-charcoal font-semibold leading-relaxed">
        {row.type ?? '—'}
      </span>

      {/* Details: value + sub-items */}
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

      {/* Hover accent bar */}
      <div
        className="absolute left-0 top-0 h-full w-0.5 bg-kawai-red
                   opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      />
    </div>
  )
}

function JsonSpecsSection({ rows }: { rows: ParsedSpecRow[] }) {
  const [modalOpen, setModalOpen] = useState(false)
  const needsModal = rows.length > INITIAL_VISIBLE
  const visibleRows = needsModal ? rows.slice(0, INITIAL_VISIBLE) : rows

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
      >
        <div className="space-y-0">
          {rows.map((row, idx) => (
            <JsonSpecRow key={idx} row={row} />
          ))}
        </div>
      </SpecsModal>
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
  // --- Resolve product spec rows (flat) ---
  const productRows: SpecRow[] =
    (dataSource === 'product' || dataSource === 'hybrid') && product?.specifications
      ? transformProductSpecs(product.specifications)
      : []

  // --- Resolve manual categories ---
  const manualCategories: SpecCategory[] =
    dataSource === 'manual' || dataSource === 'hybrid'
      ? normaliseManualCategories(categories || [])
      : []

  // --- Resolve JSON spec rows ---
  const jsonRows: ParsedSpecRow[] =
    dataSource === 'json' && product?.specificationJson
      ? parseSpecificationJson(product.specificationJson as Record<string, unknown>)
      : []

  const hasSpecs = productRows.length > 0 || manualCategories.length > 0 || jsonRows.length > 0

  // --- Resolve blueprint image ---
  // Product mode: use the Shopify-synced blueprint URL from the product
  // Manual / hybrid: use the CMS-uploaded blueprintImage field
  const productBlueprintUrl =
    (dataSource === 'product' || dataSource === 'hybrid' || dataSource === 'json') && product?.blueprint?.url
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
      {/* Corner registration marks */}
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
          /* Two-column layout: specs left, [heading + blueprint] right on desktop.
             Mobile: heading → blueprint → specs stacked. */
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 lg:items-start">

            {/* Left column: specs only (desktop) / heading + blueprint + specs (mobile) */}
            <div className="min-w-0 flex-1">

              {/* Header — mobile only */}
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

              {/* Blueprint — mobile only (between header and specs) */}
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

              {/* Specifications */}
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

            {/* Right column: heading + blueprint — desktop only, sticky */}
            <div className="hidden lg:flex flex-col flex-none lg:sticky lg:top-0 lg:w-[480px] xl:w-[580px] gap-8">

              {/* Header — desktop */}
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
                  <p className="text-lg opacity-70 font-light tracking-wide">
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

              {/* Blueprint */}
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
          /* Single-column layout (no blueprint): header at top, specs below */
          <div className="flex flex-col gap-8 lg:gap-12">

            {/* Header — full width */}
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

            {/* Specifications — single column */}
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
