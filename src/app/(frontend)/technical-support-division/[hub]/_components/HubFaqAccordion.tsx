'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import Link from 'next/link'
import { cn } from '@/lib/utils'

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
}

export function HubFaqAccordion({ groups }: HubFaqAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map())

  function handleCategoryClick(slug: string) {
    setActiveCategory(slug)
    const el = sectionRefs.current.get(slug)
    if (el) {
      // Account for the sticky nav bar height (~56px)
      const offset = 64
      const top = el.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  function setSectionRef(slug: string) {
    return (el: HTMLElement | null) => {
      if (el) {
        sectionRefs.current.set(slug, el)
      } else {
        sectionRefs.current.delete(slug)
      }
    }
  }

  if (groups.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="py-24 text-center"
      >
        <div className="text-kawai-neutral mb-6">
          <svg
            className="w-14 h-14 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
            />
          </svg>
        </div>
        <p className="text-kawai-black font-medium text-lg mb-2 font-[family-name:var(--font-brand-sans)]">
          Coming soon
        </p>
        <p className="text-kawai-charcoal/50 text-sm max-w-xs mx-auto leading-relaxed mb-8 font-[family-name:var(--font-brand-sans)]">
          Support articles for this section are on their way. Contact your Kawai dealer for immediate assistance.
        </p>
        <Link
          href="/find-a-dealer"
          className="inline-flex items-center gap-2 bg-kawai-red text-white px-5 py-2.5 rounded-lg hover:bg-kawai-red/90 transition-colors font-medium text-sm min-h-[44px] font-[family-name:var(--font-brand-sans)]"
        >
          Find a Dealer
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </motion.div>
    )
  }

  return (
    <div>
      {/* Sticky category nav — frosted glass */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm shadow-[0_2px_8px_rgba(0,0,0,0.06)] border-b border-kawai-neutral/40">
        <div className="container mx-auto max-w-3xl px-6">
          <LayoutGroup id="category-pills">
            <div className="flex items-center gap-1 overflow-x-auto py-3.5 scrollbar-hide">
              {/* All pill */}
              <button
                onClick={() => {
                  setActiveCategory(null)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                className="relative flex-shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-medium min-h-[36px] font-[family-name:var(--font-brand-sans)] transition-colors duration-150"
              >
                {activeCategory === null && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-kawai-black rounded-lg"
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                )}
                <span
                  className={cn(
                    'relative z-10 transition-colors duration-150',
                    activeCategory === null ? 'text-white' : 'text-kawai-charcoal/60 hover:text-kawai-black',
                  )}
                >
                  All Questions
                </span>
              </button>

              {groups.map((group) => (
                <button
                  key={group.categorySlug}
                  onClick={() => handleCategoryClick(group.categorySlug)}
                  className="relative flex-shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-medium min-h-[36px] font-[family-name:var(--font-brand-sans)] transition-colors duration-150"
                >
                  {activeCategory === group.categorySlug && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 bg-kawai-black rounded-lg"
                      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                    />
                  )}
                  <span
                    className={cn(
                      'relative z-10 transition-colors duration-150',
                      activeCategory === group.categorySlug
                        ? 'text-white'
                        : 'text-kawai-charcoal/60 hover:text-kawai-black',
                    )}
                  >
                    {group.categoryName}
                    <span className="ml-1.5 text-[10px] opacity-60">
                      · {group.faqs.length}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </LayoutGroup>
        </div>
      </div>

      {/* FAQ groups */}
      <div className="container mx-auto max-w-3xl px-6 py-10 space-y-0">
        {groups.map((group, groupIndex) => (
          <motion.section
            key={group.categorySlug}
            id={`category-${group.categorySlug}`}
            ref={setSectionRef(group.categorySlug)}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{
              duration: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className={groupIndex > 0 ? 'pt-16' : 'pt-2'}
          >
            {/* Category overline treatment */}
            <div className="mb-8">
              <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-kawai-charcoal/40 font-[family-name:var(--font-brand-sans)] mb-3">
                {group.categoryName}
              </p>
              <div className="border-b border-kawai-neutral/60" />
            </div>

            {/* FAQ items — flat list with border-b separators */}
            <div>
              {group.faqs.map((faq, faqIndex) => {
                const isOpen = openId === faq.id
                return (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: faqIndex * 0.04,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    className={cn(
                      'transition-all duration-200',
                      isOpen
                        ? 'border-l-2 border-kawai-red bg-white rounded-lg my-1 overflow-hidden'
                        : 'border-b border-kawai-neutral/50',
                    )}
                  >
                    <button
                      onClick={() => setOpenId(isOpen ? null : faq.id)}
                      className={cn(
                        'w-full px-5 py-4 flex items-center justify-between text-left transition-all duration-200 min-h-[44px] group/btn',
                        isOpen
                          ? 'px-6'
                          : 'hover:bg-kawai-red/[0.03]',
                      )}
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${faq.id}`}
                    >
                      <span
                        className={cn(
                          'text-base md:text-lg font-medium pr-6 leading-snug transition-colors duration-200 font-[family-name:var(--font-brand-sans)]',
                          isOpen
                            ? 'text-kawai-black'
                            : 'text-kawai-black group-hover/btn:text-kawai-red',
                        )}
                      >
                        {faq.question}
                      </span>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                        className="flex-shrink-0 w-5 h-5 flex items-center justify-center"
                      >
                        <svg
                          className={cn(
                            'w-4 h-4 transition-colors duration-200',
                            isOpen ? 'text-kawai-red' : 'text-kawai-charcoal/40',
                          )}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </motion.div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={`faq-answer-${faq.id}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-5 pt-0 border-t border-kawai-neutral/40">
                            {faq.excerpt ? (
                              <p className="text-kawai-charcoal/70 leading-relaxed text-base mb-4 font-[family-name:var(--font-brand-sans)] pt-4">
                                {faq.excerpt}
                              </p>
                            ) : (
                              <p className="text-kawai-charcoal/40 text-sm mb-4 italic font-[family-name:var(--font-brand-sans)] pt-4">
                                No preview available.
                              </p>
                            )}
                            {faq.slug && (
                              <Link
                                href={`/faq/${faq.slug}`}
                                className="inline-flex items-center gap-1.5 text-kawai-red text-sm font-medium hover:gap-2.5 transition-all duration-200 font-[family-name:var(--font-brand-sans)]"
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
                  </motion.div>
                )
              })}
            </div>
          </motion.section>
        ))}
      </div>
    </div>
  )
}
