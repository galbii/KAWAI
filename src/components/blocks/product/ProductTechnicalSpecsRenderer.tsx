'use client'

import Image from 'next/image'
import { useState } from 'react'
import {
  ArrowDownTrayIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import { getImagePropsWithFallback } from '@/lib/media/r2-utils'
import type { Media, Product } from '@/payload-types'
import { parseSpecificationJson } from '@/lib/utils/parse-specification-json'
import { trackFileDownload } from '@/lib/analytics/unified-tracking'

const INITIAL_VISIBLE = 10

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
  categories?: ManualCategory[] | null
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

/** Unified row shape for every data source (product specs, JSON specs, manual). */
interface SpecRow {
  id?: string
  label: string
  type?: string
  value: string
  subItems?: string[]
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
// Data transforms — everything normalises into SpecRow
// ---------------------------------------------------------------------------

function transformProductSpecs(productSpecs: NonNullable<Product['specifications']>): SpecRow[] {
  if (!productSpecs || productSpecs.length === 0) return []
  return productSpecs
    .filter((spec) => spec.id && spec.spec)
    .map((spec) => {
      const lines = (spec.details ?? '').split('\n').map((l) => l.trim()).filter(Boolean)
      return {
        ...(spec.id ? { id: spec.id } : {}),
        label: spec.spec ?? '',
        value: lines[0] ?? '—',
        ...(lines.length > 1 ? { subItems: lines.slice(1) } : {}),
      }
    })
}

function transformJsonSpecs(specificationJson: Record<string, unknown>): SpecRow[] {
  return parseSpecificationJson(specificationJson).map((row) => ({
    label: row.label,
    ...(row.type ? { type: row.type } : {}),
    value: row.value,
    ...(row.subItems && row.subItems.length > 0 ? { subItems: row.subItems } : {}),
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
          value: s.value,
          ...(s.unit != null ? { unit: s.unit } : {}),
          ...(s.note != null ? { note: s.note } : {}),
          ...(s.highlight != null ? { highlight: s.highlight } : {}),
        })),
      collapsible: c.collapsible ?? false,
      defaultExpanded: c.defaultExpanded ?? true,
    }))
}

function rowMatches(row: SpecRow, q: string): boolean {
  return (
    row.label.toLowerCase().includes(q) ||
    (row.type?.toLowerCase().includes(q) ?? false) ||
    row.value.toLowerCase().includes(q) ||
    (row.unit?.toLowerCase().includes(q) ?? false) ||
    (row.note?.toLowerCase().includes(q) ?? false) ||
    (row.subItems?.some((s) => s.toLowerCase().includes(q)) ?? false)
  )
}

// ---------------------------------------------------------------------------
// Highlight — marks filter matches inline
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
          <mark key={i} className="bg-kawai-red/10 text-inherit rounded-[2px]">
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
// Documents — quiet download links for manual, brochures, technical drawing
// ---------------------------------------------------------------------------

function DocumentLink({
  label,
  fileUrl,
  productName,
  documentType,
}: {
  label: string
  fileUrl: string
  productName: string
  documentType: 'owners_manual' | 'brochure' | 'technical_specs'
}) {
  return (
    <a
      href={fileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-2 text-sm text-kawai-charcoal transition-colors hover:text-kawai-red"
      onClick={() => {
        trackFileDownload({
          blockType: 'product-technical-specs',
          blockData: {},
          fileName: label,
          fileUrl,
          additionalProps: { product_name: productName, document_type: documentType },
        })
      }}
      aria-label={`Download ${label}${productName ? ` for ${productName}` : ''} (PDF)`}
    >
      <ArrowDownTrayIcon className="h-3.5 w-3.5 flex-shrink-0 text-kawai-charcoal/50 transition-colors group-hover:text-kawai-red" />
      <span className="underline decoration-kawai-neutral underline-offset-4 transition-colors group-hover:decoration-kawai-red/50">
        {label}
      </span>
    </a>
  )
}

// ---------------------------------------------------------------------------
// Ledger row
// ---------------------------------------------------------------------------

function LedgerRow({ row, query }: { row: SpecRow; query: string }) {
  return (
    <div
      className={cn(
        'border-b border-kawai-neutral/60 py-3.5 md:grid md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-10 md:py-4',
        row.highlight && 'border-l-2 border-l-kawai-red bg-white/70 pl-4',
      )}
    >
      <div className="text-sm leading-relaxed text-kawai-charcoal/75">
        <Highlight text={row.label} query={query} />
      </div>
      <div className="mt-1 md:mt-0">
        {row.type && (
          <div className="text-xs uppercase tracking-wide text-kawai-charcoal/55">
            <Highlight text={row.type} query={query} />
          </div>
        )}
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="text-[15px] font-medium leading-relaxed text-kawai-black tabular-nums">
            <Highlight text={row.value || '—'} query={query} />
          </span>
          {row.unit && <span className="text-xs text-kawai-charcoal/60">{row.unit}</span>}
        </div>
        {row.subItems && row.subItems.length > 0 && (
          <ul className="mt-1.5 space-y-1">
            {row.subItems.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm leading-relaxed text-kawai-charcoal/75">
                <span aria-hidden="true" className="select-none text-kawai-charcoal/40">
                  –
                </span>
                <span>
                  <Highlight text={item} query={query} />
                </span>
              </li>
            ))}
          </ul>
        )}
        {row.note && <p className="mt-1 text-xs italic text-kawai-muted">{row.note}</p>}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Ledger — a rows list that opens with the block's single red rule
// ---------------------------------------------------------------------------

function Ledger({ rows, query }: { rows: SpecRow[]; query: string }) {
  const [expanded, setExpanded] = useState(false)
  const isFiltering = query.length > 0
  const needsToggle = !isFiltering && rows.length > INITIAL_VISIBLE
  const visibleRows = needsToggle && !expanded ? rows.slice(0, INITIAL_VISIBLE) : rows

  if (rows.length === 0) return null

  return (
    <div className="border-t-2 border-kawai-red">
      {visibleRows.map((row, idx) => (
        <LedgerRow key={row.id || `${row.label}-${idx}`} row={row} query={query} />
      ))}
      {needsToggle && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full border-b border-kawai-neutral/60 py-3.5 text-center text-sm text-kawai-charcoal/70 transition-colors hover:text-kawai-red"
        >
          {expanded ? 'Show fewer' : `Show all ${rows.length} specifications`}
        </button>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Category section (manual / hybrid modes)
// ---------------------------------------------------------------------------

function CategorySection({ category, query }: { category: SpecCategory; query: string }) {
  const [isExpanded, setIsExpanded] = useState(category.defaultExpanded !== false)
  const isFiltering = query.length > 0
  const effectiveExpanded = isFiltering ? true : isExpanded
  const specs = category.specifications
  const sectionId = `specs-${category.categoryName.replace(/\s+/g, '-').toLowerCase()}`

  if (specs.length === 0 && isFiltering) return null

  const heading = (
    <span className="flex items-baseline gap-3">
      <h3 className="font-serif text-xl font-bold tracking-tight text-kawai-black md:text-2xl">
        {category.categoryName}
      </h3>
      {isFiltering && specs.length > 0 && (
        <span className="text-xs text-kawai-muted tabular-nums">
          {specs.length} match{specs.length !== 1 ? 'es' : ''}
        </span>
      )}
    </span>
  )

  return (
    <section className="mt-10 first:mt-0">
      {category.collapsible && !isFiltering ? (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="group flex w-full items-center justify-between gap-4 border-b border-kawai-black/70 pb-3"
          aria-expanded={effectiveExpanded}
          aria-controls={sectionId}
        >
          {heading}
          <ChevronDownIcon
            className={cn(
              'h-5 w-5 text-kawai-charcoal/50 transition-transform duration-200 group-hover:text-kawai-red',
              effectiveExpanded && 'rotate-180',
            )}
          />
        </button>
      ) : (
        <div className="border-b border-kawai-black/70 pb-3">{heading}</div>
      )}
      {effectiveExpanded && (
        <div id={sectionId}>
          {specs.map((row, idx) => (
            <LedgerRow key={row.id || `${row.label}-${idx}`} row={row} query={query} />
          ))}
        </div>
      )}
    </section>
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
  enableDownload,
  downloadButtonText,
}: ProductTechnicalSpecsRendererProps) {
  const [query, setQuery] = useState('')

  // --- Rows -----------------------------------------------------------------

  const flatRows: SpecRow[] =
    dataSource === 'json' && product?.specificationJson
      ? transformJsonSpecs(product.specificationJson as Record<string, unknown>)
      : (dataSource === 'product' || dataSource === 'hybrid') && product?.specifications
        ? transformProductSpecs(product.specifications)
        : []

  const manualCategories: SpecCategory[] =
    dataSource === 'manual' || dataSource === 'hybrid'
      ? normaliseManualCategories(categories || [])
      : []

  const q = query.trim().toLowerCase()

  const filteredFlatRows = q ? flatRows.filter((r) => rowMatches(r, q)) : flatRows
  const filteredCategories = q
    ? manualCategories
        .map((cat) => ({ ...cat, specifications: cat.specifications.filter((r) => rowMatches(r, q)) }))
        .filter((cat) => cat.specifications.length > 0)
    : manualCategories

  const totalCount =
    flatRows.length + manualCategories.reduce((acc, c) => acc + c.specifications.length, 0)
  const filteredCount =
    filteredFlatRows.length + filteredCategories.reduce((acc, c) => acc + c.specifications.length, 0)
  const hasSpecs = totalCount > 0

  // --- Blueprint ------------------------------------------------------------

  const productBlueprintUrl =
    (dataSource === 'product' || dataSource === 'hybrid' || dataSource === 'json') &&
    product?.blueprint?.url
      ? product.blueprint.url
      : null

  const cmsBlueprint =
    (dataSource === 'manual' || dataSource === 'hybrid') && blueprintImage
      ? getImagePropsWithFallback(blueprintImage, '', 'hero', {
          priority: false,
          sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1024px',
        })
      : null

  const hasBlueprint = Boolean(productBlueprintUrl || cmsBlueprint)

  // --- Documents ------------------------------------------------------------

  const productName = product?.name ?? ''
  const ownersManualUrl = product?.ownersManualUrl || null
  const brochures = (product?.brochures || []).filter(
    (b): b is typeof b & { url: string } => Boolean(b.url),
  )
  const blueprintDownloadUrl = enableDownload && productBlueprintUrl ? productBlueprintUrl : null
  const hasDocuments = Boolean(ownersManualUrl || brochures.length > 0 || blueprintDownloadUrl)

  const modelLabel = product?.modelLabel || product?.model || null

  return (
    <section className="technical-specs-block border-y border-kawai-neutral/60 bg-kawai-pearl py-16 md:py-24">
      <div className="container mx-auto max-w-5xl px-4 md:px-8">
        {/* Header */}
        <div className="max-w-3xl">
          {header?.showModelNumber && modelLabel && (
            <p className="text-sm font-medium text-kawai-charcoal/60">{modelLabel}</p>
          )}
          <h2 className="mt-2 font-serif text-4xl font-bold leading-tight text-kawai-black md:text-5xl">
            {header?.title || 'Technical Specifications'}
          </h2>
          {header?.subtitle && (
            <p className="mt-4 text-base font-light leading-relaxed text-kawai-muted md:text-lg">
              {header.subtitle}
            </p>
          )}
        </div>

        {/* Documents — plain download links, placed where they can't be missed */}
        {hasDocuments && (
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 border-y border-kawai-neutral/70 py-4">
            <span className="text-sm text-kawai-muted">Documents</span>
            {ownersManualUrl && (
              <DocumentLink
                label="Owner's Manual"
                fileUrl={ownersManualUrl}
                productName={productName}
                documentType="owners_manual"
              />
            )}
            {brochures.map((brochure, idx) => (
              <DocumentLink
                key={brochure.id || brochure.url}
                label={brochure.name || (brochures.length > 1 ? `Brochure ${idx + 1}` : 'Brochure')}
                fileUrl={brochure.url}
                productName={productName}
                documentType="brochure"
              />
            ))}
            {blueprintDownloadUrl && (
              <DocumentLink
                label={downloadButtonText || 'Technical drawing'}
                fileUrl={blueprintDownloadUrl}
                productName={productName}
                documentType="technical_specs"
              />
            )}
          </div>
        )}

        {/* Blueprint plate — the drawing page of the dossier */}
        {hasBlueprint && (
          <figure className="mt-10 rounded-xl border border-kawai-neutral/80 bg-white p-4 md:mt-12 md:p-8">
            {productBlueprintUrl ? (
              <Image
                src={productBlueprintUrl}
                alt={product?.blueprint?.alt || blueprintCaption || `${productName || 'Product'} technical drawing`}
                width={product?.blueprint?.width || 1200}
                height={product?.blueprint?.height || 800}
                className="h-auto w-full"
              />
            ) : (
              cmsBlueprint && (
                <Image
                  {...cmsBlueprint}
                  alt={blueprintCaption || 'Technical drawing'}
                  className="h-auto w-full"
                />
              )
            )}
            {blueprintCaption && (
              <figcaption className="mt-4 text-center text-xs text-kawai-muted">
                {blueprintCaption}
              </figcaption>
            )}
          </figure>
        )}

        {/* Ledger */}
        {hasSpecs && (
          <div className="mt-10 md:mt-12">
            {/* Search bar */}
            <label
              className={cn(
                'mb-5 flex items-center gap-3 rounded-lg border bg-white px-4 shadow-sm transition-colors',
                'border-kawai-neutral focus-within:border-kawai-charcoal/60',
              )}
            >
              <MagnifyingGlassIcon className="h-4 w-4 flex-shrink-0 text-kawai-charcoal/45" aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape' && query) setQuery('')
                }}
                aria-label="Search specifications"
                placeholder="Search specifications…"
                className="w-full bg-transparent py-3 text-[15px] text-kawai-black outline-none placeholder:text-kawai-charcoal/45 [&::-webkit-search-cancel-button]:hidden"
              />
              <span
                className="flex-shrink-0 text-xs text-kawai-muted tabular-nums whitespace-nowrap"
                aria-live="polite"
              >
                {q
                  ? filteredCount === 0
                    ? 'No matches'
                    : `${filteredCount} of ${totalCount}`
                  : `${totalCount} specs`}
              </span>
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="flex-shrink-0 rounded-full p-1 text-kawai-charcoal/40 transition-colors hover:bg-kawai-red/5 hover:text-kawai-red"
                  aria-label="Clear search"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              )}
            </label>

            {filteredFlatRows.length > 0 && <Ledger rows={filteredFlatRows} query={q} />}

            {filteredCategories.map((category, idx) => (
              <CategorySection key={`${category.categoryName}-${idx}`} category={category} query={q} />
            ))}

            {q && filteredCount === 0 && (
              <div className="border-t-2 border-kawai-red py-12 text-center">
                <p className="text-sm text-kawai-muted">
                  No specifications match &ldquo;{query}&rdquo;.
                </p>
                <button
                  onClick={() => setQuery('')}
                  className="mt-2 text-sm text-kawai-red transition-colors hover:text-kawai-red/70"
                >
                  Clear filter
                </button>
              </div>
            )}
          </div>
        )}

        {!hasSpecs && (
          <div className="mt-10 border-t-2 border-kawai-red py-12 text-center">
            <p className="text-sm text-kawai-muted">
              No specifications are available for this product yet.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
