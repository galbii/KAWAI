'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface FaqItem {
  id: string | number
  question: string
  slug: string | null
  excerpt?: string | null
}

interface Props {
  faqs: FaqItem[]
  isDark?: boolean
}

export function ProductFaqAccordion({ faqs, isDark = false }: Props) {
  const [openId, setOpenId] = useState<string | number | null>(null)

  return (
    <ul className="divide-y-0">
      {faqs.map((faq, index) => {
        const isOpen = openId === faq.id

        return (
          <motion.li
            key={faq.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: index * 0.05,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className={cn(
              'transition-all duration-200',
              isOpen
                ? cn(
                    'border-l-2 border-kawai-red rounded-lg my-1 overflow-hidden',
                    isDark ? 'bg-white/10' : 'bg-white',
                  )
                : cn(
                    'border-b',
                    isDark ? 'border-white/10' : 'border-kawai-neutral/50',
                  ),
            )}
          >
            <button
              onClick={() => setOpenId(isOpen ? null : faq.id)}
              className={cn(
                'w-full flex items-center justify-between text-left transition-all duration-200 min-h-[44px] group/btn',
                isOpen ? 'px-6 py-4' : 'px-5 py-4',
                !isOpen && (isDark ? 'hover:bg-white/5' : 'hover:bg-kawai-red/[0.03]'),
              )}
              aria-expanded={isOpen}
              aria-controls={`pfaq-${faq.id}`}
            >
              <span
                className={cn(
                  'text-base md:text-lg font-medium pr-6 leading-snug transition-colors duration-200 font-[family-name:var(--font-brand-sans)]',
                  isOpen
                    ? isDark
                      ? 'text-white'
                      : 'text-kawai-black'
                    : isDark
                      ? 'text-white/80 group-hover/btn:text-white'
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
                    isOpen
                      ? 'text-kawai-red'
                      : isDark
                        ? 'text-white/30'
                        : 'text-kawai-charcoal/40',
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
                  id={`pfaq-${faq.id}`}
                  initial={{ height: 0, opacity: 0, y: -4 }}
                  animate={{ height: 'auto', opacity: 1, y: 0 }}
                  exit={{ height: 0, opacity: 0, y: -4 }}
                  transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <div
                    className={cn(
                      'px-6 pb-5 pt-0 border-t',
                      isDark ? 'border-white/10' : 'border-kawai-neutral/40',
                    )}
                  >
                    {faq.excerpt && (
                      <p
                        className={cn(
                          'text-base leading-relaxed mb-4 pt-4 font-[family-name:var(--font-brand-sans)]',
                          isDark ? 'text-white/70' : 'text-kawai-charcoal/70',
                        )}
                      >
                        {faq.excerpt}
                      </p>
                    )}
                    {faq.slug && (
                      <Link
                        href={`/faq/${faq.slug}`}
                        className="inline-flex items-center gap-1.5 text-kawai-red text-sm font-medium hover:gap-2.5 transition-all duration-200 font-[family-name:var(--font-brand-sans)]"
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
          </motion.li>
        )
      })}
    </ul>
  )
}
