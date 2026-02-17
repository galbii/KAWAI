'use client'

import Image from 'next/image'
import { useState } from 'react'
import { ChevronDownIcon, ChevronUpIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import { getImagePropsWithFallback } from '@/lib/media/r2-utils'
import type { Media, Product } from '@/payload-types'

// Re-exported interface — types will be regenerated on next build
interface ProductTechnicalSpecsRendererProps {
  product?: Product | null
  dataSource?: 'product' | 'manual' | 'hybrid' | null
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
              {category.specifications.map((spec, idx) => (
                <SpecificationRow key={spec.id || idx} spec={spec} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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

  const hasSpecs = productRows.length > 0 || manualCategories.length > 0

  // --- Resolve blueprint image ---
  // Product mode: use the Shopify-synced blueprint URL from the product
  // Manual / hybrid: use the CMS-uploaded blueprintImage field
  const productBlueprintUrl =
    (dataSource === 'product' || dataSource === 'hybrid') && product?.blueprint?.url
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

        {/* Outer layout: [header + specs] left, blueprint right on desktop.
            flex-col-reverse on mobile puts blueprint above header+specs. */}
        <div className="flex flex-col-reverse lg:flex-row gap-12 lg:gap-16 lg:items-start">

          {/* Left column: header + specs */}
          <div className="min-w-0 flex-1">

            {/* Header */}
            <div className="mb-12 md:mb-16">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div className="space-y-3">
                  {header?.showModelNumber && product?.model && (
                    <div className="font-mono text-xs text-kawai-red uppercase tracking-[0.2em] font-semibold">
                      Model: {product.model}
                    </div>
                  )}
                  <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                    {header?.title || 'Technical Specifications'}
                  </h2>
                  {header?.subtitle && (
                    <p className="text-lg md:text-xl opacity-70 font-light tracking-wide max-w-2xl">
                      {header.subtitle}
                    </p>
                  )}
                </div>
                {enableDownload && (
                  <button
                    className="
                      inline-flex items-center gap-2.5 px-6 py-3.5
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
            </div>

            {/* Specifications */}
            {hasSpecs ? (
              <>
                {productRows.length > 0 && (
                  <div>
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
                    {productRows.map((row, idx) => (
                      <SpecificationRow key={row.id || idx} spec={row} />
                    ))}
                  </div>
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

          {/* Right column: blueprint — sticky on desktop, on top on mobile */}
          {hasBlueprintToShow && (
            <div className="flex-none lg:sticky lg:top-0 w-full lg:w-[420px] xl:w-[480px]">
              <div className="relative overflow-hidden rounded-lg shadow-lg w-full max-w-xs mx-auto lg:max-w-none lg:mx-0">
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
          )}
        </div>

        {/* Footer note */}
        <div className="mt-16 pt-8 border-t border-current opacity-30">
          <p className="font-mono text-xs text-center">
            Specifications subject to change without notice. All measurements approximate.
          </p>
        </div>
      </div>
    </section>
  )
}
