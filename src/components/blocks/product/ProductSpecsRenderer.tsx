'use client'

import React, { useState } from 'react'
import type { ProductSpecificationsBlock } from '@/payload-types'
import { cn } from '@/lib/utils'

const INITIAL_VISIBLE = 6

interface ProductSpecsRendererProps extends ProductSpecificationsBlock {}

type CategoryItem = NonNullable<ProductSpecificationsBlock['categories']>[number]

// ---------------------------------------------------------------------------
// Table style
// ---------------------------------------------------------------------------

function TableCategory({
  category,
  compact,
  alternateRows,
}: {
  category: CategoryItem
  compact: boolean
  alternateRows: boolean
}) {
  const specs = category.specifications ?? []
  const [expanded, setExpanded] = useState(false)
  const needsToggle = specs.length > INITIAL_VISIBLE
  const visibleSpecs = needsToggle && !expanded ? specs.slice(0, INITIAL_VISIBLE) : specs
  const hiddenCount = specs.length - INITIAL_VISIBLE

  return (
    <div className="overflow-hidden border border-kawai-charcoal/15">
      {/* Category header */}
      <div className="flex items-center gap-3 px-6 py-3 bg-kawai-charcoal">
        <div className="w-0.5 h-3.5 bg-kawai-red flex-shrink-0" aria-hidden="true" />
        <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-white font-semibold">
          {category.categoryName}
        </h3>
      </div>

      {/* Spec rows */}
      <div>
        {visibleSpecs.map((spec, i) => (
          <div
            key={i}
            className={cn(
              'grid grid-cols-[2fr_3fr] gap-6 px-6',
              compact ? 'py-2.5' : 'py-3.5',
              i > 0 && 'border-t border-kawai-charcoal/8',
              alternateRows && i % 2 !== 0 && 'bg-kawai-charcoal/[0.02]',
              spec.highlight && 'bg-kawai-red/5 border-l-2 border-l-kawai-red'
            )}
          >
            <span className="text-sm text-kawai-muted font-medium leading-relaxed">
              {spec.label}
            </span>
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="font-mono text-sm text-kawai-charcoal font-semibold leading-relaxed">
                {spec.value}
              </span>
              {spec.note && (
                <span className="font-mono text-xs text-kawai-muted italic">
                  {spec.note}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Expand toggle */}
      {needsToggle && (
        <div className="px-6 py-3 border-t border-kawai-charcoal/10 bg-kawai-charcoal/[0.02]">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-kawai-red hover:text-kawai-red/70 transition-colors duration-150"
          >
            <span className="w-3 h-px bg-current" />
            {expanded ? 'Show less' : `Show ${hiddenCount} more specifications`}
            <svg
              className={`w-3 h-3 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Cards style
// ---------------------------------------------------------------------------

function CardsCategory({ category }: { category: CategoryItem }) {
  const specs = category.specifications ?? []
  const [expanded, setExpanded] = useState(false)
  const needsToggle = specs.length > INITIAL_VISIBLE
  const visibleSpecs = needsToggle && !expanded ? specs.slice(0, INITIAL_VISIBLE) : specs
  const hiddenCount = specs.length - INITIAL_VISIBLE

  return (
    <div className="border border-kawai-charcoal/15 dark:border-gray-700 overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-3 border-b border-kawai-charcoal/10 dark:border-gray-700 bg-kawai-charcoal/[0.03] dark:bg-gray-800">
        <div className="w-0.5 h-3.5 bg-kawai-red flex-shrink-0" aria-hidden="true" />
        <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-kawai-charcoal dark:text-white font-semibold">
          {category.categoryName}
        </h3>
      </div>
      <dl className="divide-y divide-kawai-charcoal/8 dark:divide-gray-800">
        {visibleSpecs.map((spec, i) => (
          <div
            key={i}
            className={cn(
              'px-5 py-3.5',
              spec.highlight && 'bg-kawai-red/5 border-l-2 border-l-kawai-red'
            )}
          >
            <dt className="font-mono text-[10px] uppercase tracking-[0.1em] text-kawai-muted dark:text-gray-400 mb-1">
              {spec.label}
            </dt>
            <dd className="font-mono text-sm font-semibold text-kawai-charcoal dark:text-white">
              {spec.value}
              {spec.note && (
                <span className="ml-2 text-xs font-normal text-kawai-muted italic">
                  {spec.note}
                </span>
              )}
            </dd>
          </div>
        ))}
      </dl>
      {needsToggle && (
        <div className="px-5 py-3 border-t border-kawai-charcoal/10 dark:border-gray-800">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-kawai-red hover:text-kawai-red/70 transition-colors"
          >
            {expanded ? 'Show less' : `+${hiddenCount} more`}
          </button>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// List style
// ---------------------------------------------------------------------------

function ListCategory({ category }: { category: CategoryItem }) {
  const specs = category.specifications ?? []
  const [expanded, setExpanded] = useState(false)
  const needsToggle = specs.length > INITIAL_VISIBLE
  const visibleSpecs = needsToggle && !expanded ? specs.slice(0, INITIAL_VISIBLE) : specs
  const hiddenCount = specs.length - INITIAL_VISIBLE

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-0.5 h-5 bg-kawai-red flex-shrink-0" aria-hidden="true" />
        <h3 className="font-serif text-xl font-bold text-kawai-charcoal dark:text-white">
          {category.categoryName}
        </h3>
      </div>
      <dl className="divide-y divide-kawai-charcoal/10 dark:divide-gray-700">
        {visibleSpecs.map((spec, i) => (
          <div
            key={i}
            className={cn(
              'flex justify-between items-start gap-6 py-3.5',
              spec.highlight && 'bg-kawai-red/5 -mx-4 px-4'
            )}
          >
            <dt className="text-sm font-medium text-kawai-muted dark:text-gray-300 flex-1">
              {spec.label}
            </dt>
            <dd className="font-mono text-sm font-semibold text-kawai-charcoal dark:text-white text-right flex-shrink-0">
              {spec.value}
              {spec.note && (
                <span className="ml-2 text-xs font-normal text-kawai-muted">
                  {spec.note}
                </span>
              )}
            </dd>
          </div>
        ))}
      </dl>
      {needsToggle && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-kawai-red hover:text-kawai-red/70 transition-colors"
        >
          <span className="w-3 h-px bg-current" />
          {expanded ? 'Show less' : `Show ${hiddenCount} more`}
        </button>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main renderer
// ---------------------------------------------------------------------------

export function ProductSpecsRenderer({
  header,
  categories,
  layout,
}: ProductSpecsRendererProps) {
  if (!categories || categories.length === 0) return null

  const style = layout?.style || 'table'
  const compactMode = layout?.compactMode ?? false
  const alternateRows = layout?.alternateRows ?? true

  return (
    <section className="my-12 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        {(header?.title || header?.description) && (
          <div className="mb-10">
            {header?.title && (
              <>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-kawai-charcoal dark:text-white leading-tight">
                  {header.title}
                </h2>
                <div className="mt-4 w-10 h-0.5 bg-kawai-red" />
              </>
            )}
            {header?.description && (
              <p className="mt-4 text-base text-kawai-muted dark:text-gray-400 max-w-2xl">
                {header.description}
              </p>
            )}
          </div>
        )}

        {/* Table style */}
        {style === 'table' && (
          <div className="space-y-5">
            {categories.map((category, i) => (
              <TableCategory
                key={i}
                category={category}
                compact={compactMode}
                alternateRows={alternateRows}
              />
            ))}
          </div>
        )}

        {/* Cards style */}
        {style === 'cards' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((category, i) => (
              <CardsCategory key={i} category={category} />
            ))}
          </div>
        )}

        {/* List style */}
        {style === 'list' && (
          <div className="space-y-10">
            {categories.map((category, i) => (
              <ListCategory key={i} category={category} />
            ))}
          </div>
        )}

      </div>
    </section>
  )
}
