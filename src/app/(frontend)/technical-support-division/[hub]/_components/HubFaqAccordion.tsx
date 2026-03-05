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

export function HubFaqAccordion({ groups, hubLabel, featuredFaqs, allQuestions }: HubFaqAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const hubPath = hubLabel.toLowerCase().replace(/\s+/g, '-')

  const visibleGroups =
    activeCategory === null
      ? groups
      : groups.filter((g) => g.categorySlug === activeCategory)

  if (groups.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="py-24 text-center max-w-3xl mx-auto px-6"
      >
        <p className="text-kawai-black font-medium text-lg mb-2 font-[family-name:var(--font-brand-sans)]">
          Coming soon
        </p>
        <p className="text-kawai-charcoal/40 text-sm font-[family-name:var(--font-brand-sans)]">
          Support articles are on their way.
        </p>
      </motion.div>
    )
  }

  return (
    <div>
      {/* SECTION 1 — POPULAR QUESTIONS */}
      {featuredFaqs.length > 0 && (
        <div className="max-w-3xl mx-auto px-6 pt-10 pb-2">
          <div className="flex items-center gap-4 mb-5">
            <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-kawai-charcoal/30 font-[family-name:var(--font-brand-sans)]">
              Popular Questions
            </span>
            <div className="flex-1 h-px bg-kawai-neutral/40" />
          </div>

          {featuredFaqs.map((faq, i) => {
            const isOpen = openId === faq.id
            const cat = faq.categories?.[0]
            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="border-b border-kawai-neutral/25 last:border-0"
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full text-left py-4 group/btn"
                  aria-expanded={isOpen}
                >
                  <p className="text-sm font-semibold text-kawai-black group-hover/btn:text-kawai-red transition-colors duration-150 font-[family-name:var(--font-brand-sans)] mb-0.5">
                    {faq.question}
                  </p>
                  <p className="text-[11px] text-kawai-red/50 font-[family-name:var(--font-brand-sans)]">
                    kawaipianos.com &rsaquo; {hubPath}{cat ? ` \u203a ${cat.name}` : ''}
                  </p>
                  {faq.excerpt && !isOpen && (
                    <p className="text-xs text-kawai-charcoal/45 mt-1 line-clamp-1 font-[family-name:var(--font-brand-sans)] leading-relaxed">
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
                      <div className="bg-kawai-pearl/50 rounded-xl px-5 py-4 mb-3 border border-kawai-neutral/30">
                        {faq.excerpt ? (
                          <p className="text-kawai-charcoal/70 text-sm leading-relaxed mb-3 font-[family-name:var(--font-brand-sans)]">
                            {faq.excerpt}
                          </p>
                        ) : (
                          <p className="text-kawai-charcoal/40 text-sm italic mb-3 font-[family-name:var(--font-brand-sans)]">
                            No preview available.
                          </p>
                        )}
                        {faq.slug && (
                          <Link
                            href={`/faq/${faq.slug}`}
                            className="inline-flex items-center gap-1.5 text-kawai-red text-sm font-medium font-[family-name:var(--font-brand-sans)] hover:gap-2.5 transition-all duration-200"
                          >
                            Read full answer
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* SECTION 2 — CYCLING QUESTIONS "People also ask" */}
      <CyclingQuestions questions={allQuestions} />

      {/* SECTION 3 — CATEGORY FILTER CHIPS */}
      {groups.length > 0 && (
        <div className="max-w-3xl mx-auto px-6 py-5 border-b border-kawai-neutral/25">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory(null)}
              className={cn(
                'text-xs font-medium px-3.5 py-1.5 rounded-full border transition-all duration-200 font-[family-name:var(--font-brand-sans)]',
                activeCategory === null
                  ? 'bg-kawai-black text-white border-kawai-black'
                  : 'text-kawai-charcoal/55 border-kawai-neutral/60 hover:border-kawai-black/40 hover:text-kawai-black bg-transparent',
              )}
            >
              All
            </button>
            {groups.map((group) => (
              <button
                key={group.categorySlug}
                onClick={() =>
                  setActiveCategory(
                    activeCategory === group.categorySlug ? null : group.categorySlug,
                  )
                }
                className={cn(
                  'text-xs font-medium px-3.5 py-1.5 rounded-full border transition-all duration-200 font-[family-name:var(--font-brand-sans)]',
                  activeCategory === group.categorySlug
                    ? 'bg-kawai-black text-white border-kawai-black'
                    : 'text-kawai-charcoal/55 border-kawai-neutral/60 hover:border-kawai-black/40 hover:text-kawai-black bg-transparent',
                )}
              >
                {group.categoryName}{' '}
                <span className="opacity-40 ml-1">{group.faqs.length}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4 — GROUPED RESULTS */}
      <div className="max-w-3xl mx-auto px-6 pb-20">
        {visibleGroups.map((group, gi) => (
          <motion.section
            key={group.categorySlug}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={gi > 0 ? 'pt-12' : 'pt-8'}
          >
            <div className="flex items-center gap-4 mb-5">
              <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-kawai-charcoal/25 whitespace-nowrap font-[family-name:var(--font-brand-sans)]">
                {group.categoryName}
              </span>
              <div className="flex-1 h-px bg-kawai-neutral/35" />
              <span className="text-[10px] text-kawai-charcoal/20 font-[family-name:var(--font-brand-sans)]">
                {group.faqs.length}
              </span>
            </div>

            {group.faqs.map((faq, fi) => {
              const isOpen = openId === faq.id
              return (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.28,
                    delay: fi * 0.04,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  className="border-b border-kawai-neutral/20 last:border-0"
                >
                  <button
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                    className="w-full text-left py-3.5 group/btn"
                    aria-expanded={isOpen}
                  >
                    <p className="text-sm font-semibold text-kawai-black group-hover/btn:text-kawai-red transition-colors duration-150 font-[family-name:var(--font-brand-sans)] mb-0.5">
                      {faq.question}
                    </p>
                    <p className="text-[11px] text-kawai-red/50 font-[family-name:var(--font-brand-sans)]">
                      kawaipianos.com &rsaquo; {hubPath} &rsaquo; {group.categoryName}
                    </p>
                    {faq.excerpt && !isOpen && (
                      <p className="text-xs text-kawai-charcoal/45 mt-1 line-clamp-1 font-[family-name:var(--font-brand-sans)] leading-relaxed">
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
                        <div className="bg-kawai-pearl/50 rounded-xl px-5 py-4 mb-3 border border-kawai-neutral/25">
                          {faq.excerpt ? (
                            <p className="text-kawai-charcoal/70 text-sm leading-relaxed mb-3 font-[family-name:var(--font-brand-sans)]">
                              {faq.excerpt}
                            </p>
                          ) : (
                            <p className="text-kawai-charcoal/40 text-sm italic mb-3 font-[family-name:var(--font-brand-sans)]">
                              No preview available.
                            </p>
                          )}
                          {faq.slug && (
                            <Link
                              href={`/faq/${faq.slug}`}
                              className="inline-flex items-center gap-1.5 text-kawai-red text-sm font-medium font-[family-name:var(--font-brand-sans)] hover:gap-2.5 transition-all duration-200"
                            >
                              Read full answer
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </Link>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </motion.section>
        ))}
      </div>
    </div>
  )
}
