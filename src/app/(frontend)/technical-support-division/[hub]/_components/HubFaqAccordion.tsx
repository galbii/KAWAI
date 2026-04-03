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
  const [activeCategory, setActiveCategory] = useState<string | null>('__popular__')

  const hubPath = hubLabel.toLowerCase().replace(/\s+/g, '-')

  const visibleGroups =
    activeCategory === null || activeCategory === '__popular__'
      ? groups
      : groups.filter((g) => g.categorySlug === activeCategory)

  if (groups.length === 0) {
    return (
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
    )
  }

  return (
    <div>
      {/* SECTION 1 — CYCLING QUESTIONS "People also ask" */}
      <CyclingQuestions questions={allQuestions} />

      {/* SECTION 2 — CATEGORY FILTER TABS */}
      {groups.length > 0 && (
        <div className="max-w-7xl mx-auto px-8 md:px-16 border-b border-kawai-black/[0.08]">
          <div className="flex items-end overflow-x-auto scrollbar-none">
            {/* Popular — far left */}
            {featuredFaqs.length > 0 && (
              <button
                onClick={() => setActiveCategory('__popular__')}
                className={cn(
                  'flex-shrink-0 text-base font-medium px-6 py-5 border-b-2 transition-all duration-200 font-[family-name:var(--font-brand-sans)] tracking-wide whitespace-nowrap',
                  activeCategory === '__popular__'
                    ? 'border-b-kawai-red text-kawai-black bg-kawai-black/[0.04]'
                    : 'border-b-transparent text-kawai-black/70 hover:text-kawai-black hover:border-b-kawai-black/20 bg-transparent',
                )}
              >
                Popular
              </button>
            )}

            {/* Category tabs */}
            {groups.map((group) => (
              <button
                key={group.categorySlug}
                onClick={() => setActiveCategory(group.categorySlug)}
                className={cn(
                  'flex-shrink-0 text-base font-medium px-6 py-5 border-b-2 transition-all duration-200 font-[family-name:var(--font-brand-sans)] tracking-wide whitespace-nowrap',
                  activeCategory === group.categorySlug
                    ? 'border-b-kawai-red text-kawai-black bg-kawai-black/[0.04]'
                    : 'border-b-transparent text-kawai-black/70 hover:text-kawai-black hover:border-b-kawai-black/20 bg-transparent',
                )}
              >
                {group.categoryName}{' '}
                <span className="opacity-30 ml-1.5">{group.faqs.length}</span>
              </button>
            ))}

            {/* All — pushed to far right */}
            <button
              onClick={() => setActiveCategory(null)}
              className={cn(
                'flex-shrink-0 ml-auto text-base font-medium px-6 py-5 border-b-2 transition-all duration-200 font-[family-name:var(--font-brand-sans)] tracking-wide whitespace-nowrap',
                activeCategory === null
                  ? 'border-b-kawai-red text-kawai-black bg-kawai-black/[0.04]'
                  : 'border-b-transparent text-kawai-black/70 hover:text-kawai-black hover:border-b-kawai-black/20 bg-transparent',
              )}
            >
              All
            </button>
          </div>
        </div>
      )}

      {/* SECTION 3 — POPULAR QUESTIONS (shown when Popular tab active) */}
      {featuredFaqs.length > 0 && activeCategory === '__popular__' && (
        <div className="max-w-7xl mx-auto px-8 md:px-16 pt-20 pb-8">
          <div className="flex items-center gap-6 mb-12">
            <span className="text-[10px] font-semibold tracking-[0.45em] uppercase text-kawai-black/60 whitespace-nowrap font-[family-name:var(--font-brand-sans)]">
              Popular Questions
            </span>
            <div className="flex-1 h-px bg-kawai-black/[0.07]" />
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
                className="border-b border-kawai-black/[0.08] last:border-0"
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full text-left py-10 group/btn"
                  aria-expanded={isOpen}
                >
                  <p className="text-2xl md:text-3xl lg:text-4xl font-light text-kawai-black group-hover/btn:text-kawai-black transition-colors duration-200 font-[family-name:var(--font-brand-serif)] mb-3 leading-snug">
                    {faq.question}
                  </p>
                  <p className="text-xs text-kawai-red/40 font-[family-name:var(--font-brand-sans)] tracking-wide">
                    kawaius.com &rsaquo; {hubPath}{cat ? ` \u203a ${cat.name}` : ''}
                  </p>
                  {faq.excerpt && !isOpen && (
                    <p className="text-base text-kawai-black mt-3 line-clamp-1 font-[family-name:var(--font-brand-sans)] leading-relaxed">
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
                      <div className="bg-[#F5F3F0] border-l-[3px] border-l-kawai-red/50 px-10 py-9 mb-6">
                        {faq.excerpt ? (
                          <p className="text-kawai-black text-lg leading-relaxed mb-6 font-[family-name:var(--font-brand-sans)]">
                            {faq.excerpt}
                          </p>
                        ) : (
                          <p className="text-kawai-black/30 text-lg italic mb-6 font-[family-name:var(--font-brand-sans)]">
                            No preview available.
                          </p>
                        )}
                        {faq.slug && (
                          <Link
                            href={`/faq/${faq.slug}`}
                            className="inline-flex items-center gap-2 text-kawai-red text-base font-medium font-[family-name:var(--font-brand-sans)] hover:gap-3 transition-all duration-200"
                          >
                            Read full answer
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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

      {/* SECTION 4 — GROUPED RESULTS (hidden when Popular tab active) */}
      {activeCategory !== '__popular__' && <div className="max-w-7xl mx-auto px-8 md:px-16 pb-40">
        {visibleGroups.map((group, gi) => (
          <motion.section
            key={group.categorySlug}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={gi > 0 ? 'pt-20' : 'pt-14'}
          >
            <div className="flex items-center gap-6 mb-10">
              <span className="text-[10px] font-semibold tracking-[0.45em] uppercase text-kawai-black/60 whitespace-nowrap font-[family-name:var(--font-brand-sans)]">
                {group.categoryName}
              </span>
              <div className="flex-1 h-px bg-kawai-black/[0.07]" />
              <span className="text-xs text-kawai-black/50 font-[family-name:var(--font-brand-sans)]">
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
                  transition={{ duration: 0.28, delay: fi * 0.04, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="border-b border-kawai-black/[0.07] last:border-0"
                >
                  <button
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                    className="w-full text-left py-9 group/btn"
                    aria-expanded={isOpen}
                  >
                    <p className="text-2xl md:text-3xl font-light text-kawai-black group-hover/btn:text-kawai-black transition-colors duration-200 font-[family-name:var(--font-brand-serif)] mb-3 leading-snug">
                      {faq.question}
                    </p>
                    <p className="text-xs text-kawai-red/35 font-[family-name:var(--font-brand-sans)] tracking-wide">
                      kawaius.com &rsaquo; {hubPath} &rsaquo; {group.categoryName}
                    </p>
                    {faq.excerpt && !isOpen && (
                      <p className="text-base text-kawai-black mt-3 line-clamp-1 font-[family-name:var(--font-brand-sans)] leading-relaxed">
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
                        <div className="bg-[#F5F3F0] border-l-[3px] border-l-kawai-red/50 px-10 py-9 mb-6">
                          {faq.excerpt ? (
                            <p className="text-kawai-black text-lg leading-relaxed mb-6 font-[family-name:var(--font-brand-sans)]">
                              {faq.excerpt}
                            </p>
                          ) : (
                            <p className="text-kawai-black/30 text-lg italic mb-6 font-[family-name:var(--font-brand-sans)]">
                              No preview available.
                            </p>
                          )}
                          {faq.slug && (
                            <Link
                              href={`/faq/${faq.slug}`}
                              className="inline-flex items-center gap-2 text-kawai-red text-base font-medium font-[family-name:var(--font-brand-sans)] hover:gap-3 transition-all duration-200"
                            >
                              Read full answer
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
          </motion.section>
        ))}
      </div>}
    </div>
  )
}
