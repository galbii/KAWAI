'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { CyclingQuestions } from './CyclingQuestions'

export interface FaqItem {
  id: string
  question: string
  slug: string
  excerpt?: string | null
  categories?: Array<{ id: string; name: string; slug: string; color?: string | null }>
}

export interface FaqGroup {
  categoryName: string
  categorySlug: string
  color?: string
  faqs: FaqItem[]
}

interface HubFaqAccordionProps {
  groups: FaqGroup[]
  hubLabel: string
  featuredFaqs: FaqItem[]
  allQuestions: string[]
}

function FaqAccordionItem({
  faq,
  isOpen,
  onToggle,
  hubPath,
  groupName,
}: {
  faq: FaqItem
  isOpen: boolean
  onToggle: () => void
  hubPath: string
  groupName?: string | undefined
}) {
  return (
    <div className="relative border-b border-black/[0.08] last:border-0 group/item bg-white hover:bg-kawai-pearl transition-colors duration-300">
      {/* Red left accent bar — grows on hover */}
      <div className="absolute left-0 top-0 w-[2px] h-0 bg-kawai-red group-hover/item:h-full transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]" />

      <button
        onClick={() => {
          if (!isOpen) {
            fetch('/api/faq-view', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id: faq.id }),
            }).catch(() => {})
          }
          onToggle()
        }}
        className="w-full text-left py-8 pl-5 group/btn transition-colors duration-300"
        aria-expanded={isOpen}
      >
        <p className="text-xs text-kawai-red font-[family-name:var(--font-brand-sans)] tracking-wide mb-2 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300">
          kawaius.com &rsaquo; {hubPath}{groupName ? ` \u203a ${groupName}` : ''}
        </p>
        <p className="text-xl md:text-2xl font-light text-kawai-black group-hover/item:translate-x-1 transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] font-[family-name:var(--font-brand-serif)] leading-snug">
          {faq.question}
        </p>
        {faq.excerpt && !isOpen && (
          <p className="text-sm text-kawai-black/40 group-hover/item:text-kawai-black/60 mt-2 line-clamp-2 font-[family-name:var(--font-brand-sans)] leading-relaxed transition-colors duration-300">
            {faq.excerpt}
          </p>
        )}
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="ml-5 border-l-2 border-l-kawai-red pl-6 pr-2 py-5 mb-6 bg-black/[0.02]">
              {faq.excerpt ? (
                <p className="text-kawai-black/80 text-base leading-relaxed mb-5 font-[family-name:var(--font-brand-sans)]">
                  {faq.excerpt}
                </p>
              ) : (
                <p className="text-kawai-black/30 text-base italic mb-5 font-[family-name:var(--font-brand-sans)]">
                  No preview available.
                </p>
              )}
              {faq.slug && (
                <Link
                  href={`/faq/${faq.slug}`}
                  className="inline-flex items-center gap-2 text-kawai-red text-sm font-medium font-[family-name:var(--font-brand-sans)] hover:gap-3 transition-all duration-200"
                >
                  Read full answer
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function HubFaqAccordion({ groups, hubLabel, featuredFaqs, allQuestions }: HubFaqAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string | null>('__popular__')

  const hubPath = hubLabel.toLowerCase().replace(/\s+/g, '-')

  const visibleGroups =
    activeCategory === null || activeCategory === '__popular__'
      ? groups
      : groups.filter((g) => g.categorySlug === activeCategory)

  if (groups.length === 0) {
    return (
      <div className="bg-white">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="py-32 text-center max-w-5xl mx-auto px-6"
        >
          <p className="text-kawai-black font-medium text-lg mb-2 font-[family-name:var(--font-brand-sans)]">
            Coming soon
          </p>
          <p className="text-kawai-black/60 text-sm font-[family-name:var(--font-brand-sans)]">
            Support articles are on their way.
          </p>
        </motion.div>
      </div>
    )
  }

  // Flatten FAQs for 3-column display
  const displayFaqs: FaqItem[] =
    activeCategory === '__popular__'
      ? featuredFaqs
      : visibleGroups.flatMap((g) => g.faqs)

  // Build a map of faq id → group name for breadcrumbs
  const faqGroupMap = new Map<string, string>()
  for (const g of visibleGroups) {
    for (const f of g.faqs) {
      faqGroupMap.set(f.id, g.categoryName)
    }
  }

  // Distribute evenly into 3 columns
  const total = displayFaqs.length
  const col1End = Math.ceil(total / 3)
  const col2End = Math.ceil((total * 2) / 3)
  const faqColumns = [
    displayFaqs.slice(0, col1End),
    displayFaqs.slice(col1End, col2End),
    displayFaqs.slice(col2End),
  ]

  return (
    <div className="bg-white">
      {/* CYCLING QUESTIONS */}
      <CyclingQuestions questions={allQuestions} />

      {/* CATEGORY FILTER TABS */}
      {groups.length > 0 && (
        <div className="max-w-screen-2xl mx-auto px-10 md:px-20 xl:px-28 border-b border-black/[0.08]">
          <div className="flex items-end overflow-x-auto scrollbar-none">
            {featuredFaqs.length > 0 && (
              <button
                onClick={() => setActiveCategory('__popular__')}
                className={cn(
                  'flex-shrink-0 text-base font-medium px-6 py-5 border-b-2 transition-all duration-200 font-[family-name:var(--font-brand-sans)] tracking-wide whitespace-nowrap',
                  activeCategory === '__popular__'
                    ? 'border-b-kawai-red text-kawai-black bg-black/[0.03]'
                    : 'border-b-transparent text-kawai-black/60 hover:text-kawai-black hover:border-b-black/20 bg-transparent',
                )}
              >
                Popular
              </button>
            )}
            {groups.map((group) => (
              <button
                key={group.categorySlug}
                onClick={() => setActiveCategory(group.categorySlug)}
                className={cn(
                  'flex-shrink-0 text-base font-medium px-6 py-5 border-b-2 transition-all duration-200 font-[family-name:var(--font-brand-sans)] tracking-wide whitespace-nowrap',
                  activeCategory === group.categorySlug
                    ? 'border-b-kawai-red text-kawai-black bg-black/[0.03]'
                    : 'border-b-transparent text-kawai-black/60 hover:text-kawai-black hover:border-b-black/20 bg-transparent',
                )}
              >
                {group.categoryName}
                <span className="opacity-30 ml-1.5 text-sm">{group.faqs.length}</span>
              </button>
            ))}
            <button
              onClick={() => setActiveCategory(null)}
              className={cn(
                'flex-shrink-0 ml-auto text-base font-medium px-6 py-5 border-b-2 transition-all duration-200 font-[family-name:var(--font-brand-sans)] tracking-wide whitespace-nowrap',
                activeCategory === null
                  ? 'border-b-kawai-red text-kawai-black bg-black/[0.03]'
                  : 'border-b-transparent text-kawai-black/60 hover:text-kawai-black hover:border-b-black/20 bg-transparent',
              )}
            >
              All
            </button>
          </div>
        </div>
      )}

      {/* 3-COLUMN FAQ GRID */}
      <div className="max-w-screen-2xl mx-auto px-10 md:px-20 xl:px-28 py-16 pb-32">
        {displayFaqs.length === 0 ? (
          <p className="text-kawai-black/40 text-base font-[family-name:var(--font-brand-sans)] py-16 text-center">
            No articles in this category yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-16 items-start">
            {faqColumns.map((colFaqs, colIdx) => (
              <div key={colIdx}>
                {colFaqs.map((faq) => (
                  <FaqAccordionItem
                    key={faq.id}
                    faq={faq}
                    isOpen={openId === faq.id}
                    onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
                    hubPath={hubPath}
                    groupName={
                      activeCategory === '__popular__'
                        ? faq.categories?.[0]?.name
                        : faqGroupMap.get(faq.id)
                    }
                  />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
