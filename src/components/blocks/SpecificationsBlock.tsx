'use client'

import { useState } from 'react'

const INITIAL_VISIBLE = 6

interface SpecificationsBlockProps {
  dataSource?: 'manual' | 'pianomodel' | 'hybrid' | null
  pianoModel?: any
  specifications?: Array<{
    category?: string | null
    specs?: Array<{
      label: string
      value: string
    }> | null
  }> | null
  layout?: {
    columns?: number | null
    showCategories?: boolean | null
    compact?: boolean | null
  }
}

function SpecCategorySection({
  category,
  showCategories,
  compact,
}: {
  category: { category?: string | null; specs: Array<{ label: string; value: string }> }
  showCategories: boolean
  compact: boolean
}) {
  const [expanded, setExpanded] = useState(false)
  const specs = category.specs
  const needsToggle = specs.length > INITIAL_VISIBLE
  const visibleSpecs = needsToggle && !expanded ? specs.slice(0, INITIAL_VISIBLE) : specs
  const hiddenCount = specs.length - INITIAL_VISIBLE

  return (
    <div>
      {showCategories && category.category && (
        <div className="mb-5">
          <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-kawai-red font-semibold mb-2.5">
            {category.category}
          </h3>
          <div className="h-px bg-kawai-charcoal/12" />
        </div>
      )}

      <div>
        {visibleSpecs.map((spec, i) => {
          const lines = (spec.value || '').split('\n').filter(l => l.trim())
          return (
            <div
              key={i}
              className={[
                'flex justify-between items-start gap-8',
                compact ? 'py-2.5' : 'py-3.5',
                i > 0 ? 'border-t border-kawai-charcoal/8' : '',
              ].join(' ')}
            >
              <span className="text-sm text-kawai-charcoal/60 font-medium flex-1 min-w-0 leading-relaxed">
                {spec.label}
              </span>
              {lines.length <= 1 ? (
                <span className="font-mono text-sm text-kawai-charcoal font-semibold text-right flex-shrink-0 leading-relaxed">
                  {spec.value || '—'}
                </span>
              ) : (
                <ul className="text-right flex-shrink-0 space-y-0.5">
                  {lines.map((line, j) => (
                    <li key={j} className="font-mono text-sm text-kawai-charcoal font-semibold leading-relaxed">
                      {line.trim()}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )
        })}
      </div>

      {needsToggle && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 group flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-kawai-red hover:text-kawai-red/70 transition-colors duration-150"
        >
          <span className="w-3 h-px bg-current" />
          {expanded ? 'Show less' : `Show ${hiddenCount} more`}
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
      )}
    </div>
  )
}

export function SpecificationsBlock({
  specifications = [],
  layout = {},
}: SpecificationsBlockProps) {
  if (!specifications || specifications.length === 0) return null

  const columns = layout.columns || 2
  const showCategories = layout.showCategories !== false
  const compact = layout.compact || false

  const columnClasses: Record<number, string> = {
    1: 'grid-cols-1 max-w-2xl',
    2: 'grid-cols-1 lg:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  }
  const gridClass = columnClasses[Math.min(columns, 3)] ?? columnClasses[2]
  const spacingClass = compact ? 'py-12' : 'py-16 lg:py-24'

  const validSpecifications = specifications.filter(c => c.specs && c.specs.length > 0)
  if (validSpecifications.length === 0) return null

  return (
    <section className={`${spacingClass} bg-white`}>
      <div className="max-w-7xl mx-auto px-6">

        {/* Section header */}
        <div className="mb-14">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-kawai-red font-semibold mb-4">
            Specifications
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-kawai-charcoal leading-tight">
            Technical Specifications
          </h2>
          <div className="mt-5 w-10 h-0.5 bg-kawai-red" />
        </div>

        {/* Specifications grid */}
        <div className={`grid ${gridClass} gap-12 lg:gap-16 xl:gap-20`}>
          {validSpecifications.map((category, i) => (
            <SpecCategorySection
              key={i}
              category={category as { category?: string | null; specs: Array<{ label: string; value: string }> }}
              showCategories={showCategories}
              compact={compact}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-kawai-charcoal/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-kawai-charcoal/35">
            Specifications subject to change without notice.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-kawai-charcoal hover:bg-kawai-red text-white font-mono text-[11px] uppercase tracking-[0.15em] font-medium transition-colors duration-200"
          >
            Contact Our Experts
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>

      </div>
    </section>
  )
}
