'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'

interface FaqItem {
  question: string
  answer: string
}

interface UniversityFaqRendererProps {
  block: {
    sectionHeading?: string
    subheading?: string
    faqs?: FaqItem[]
    background?: 'light' | 'white' | 'dark'
  }
}

const bgMap: Record<string, string> = {
  light: 'bg-kawai-pearl',
  white: 'bg-white',
  dark: 'bg-kawai-black',
}

const headingColorMap: Record<string, string> = {
  light: 'text-kawai-black',
  white: 'text-kawai-black',
  dark: 'text-white',
}

const subheadingColorMap: Record<string, string> = {
  light: 'text-kawai-charcoal',
  white: 'text-kawai-charcoal',
  dark: 'text-white/70',
}

const itemBgMap: Record<string, string> = {
  light: 'bg-white border-kawai-neutral',
  white: 'bg-kawai-pearl border-kawai-neutral',
  dark: 'bg-white/5 border-white/10',
}

const questionColorMap: Record<string, string> = {
  light: 'text-kawai-black hover:bg-kawai-pearl/60',
  white: 'text-kawai-black hover:bg-kawai-pearl/60',
  dark: 'text-white hover:bg-white/5',
}

const answerColorMap: Record<string, string> = {
  light: 'text-kawai-charcoal',
  white: 'text-kawai-charcoal',
  dark: 'text-white/80',
}

const chevronColorMap: Record<string, string> = {
  light: 'text-kawai-charcoal',
  white: 'text-kawai-charcoal',
  dark: 'text-white/60',
}

export const UniversityFaqRenderer: React.FC<UniversityFaqRendererProps> = ({ block }) => {
  const { sectionHeading, subheading, faqs = [], background = 'light' } = block
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i)

  return (
    <section className={cn('py-24', bgMap[background] ?? bgMap.light)}>
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        {(sectionHeading || subheading) && (
          <div className="text-center mb-16">
            {sectionHeading && (
              <h2 className={cn('text-3xl md:text-4xl font-bold mb-4', headingColorMap[background])}>
                {sectionHeading}
              </h2>
            )}
            <div className="w-16 h-1 bg-kawai-red mx-auto mb-6 rounded-full" />
            {subheading && (
              <p className={cn('text-lg max-w-2xl mx-auto', subheadingColorMap[background])}>
                {subheading}
              </p>
            )}
          </div>
        )}

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i
            return (
              <div
                key={i}
                className={cn('border rounded-xl overflow-hidden transition-shadow', itemBgMap[background], isOpen && 'shadow-brand-medium')}
              >
                <button
                  type="button"
                  className={cn(
                    'w-full px-6 py-5 text-left flex justify-between items-center gap-4 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-kawai-red',
                    questionColorMap[background]
                  )}
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                >
                  <span className="text-base md:text-lg font-medium leading-snug">{faq.question}</span>
                  {/* Chevron */}
                  <svg
                    className={cn(
                      'w-5 h-5 shrink-0 transition-transform duration-300',
                      chevronColorMap[background],
                      isOpen && 'rotate-180'
                    )}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Answer — CSS-driven height transition */}
                <div
                  className={cn(
                    'grid transition-all duration-300 ease-in-out',
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  )}
                >
                  <div className="overflow-hidden">
                    <div className={cn('px-6 pb-5 leading-relaxed text-base', answerColorMap[background])}>
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
