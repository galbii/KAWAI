'use client'

import Link from 'next/link'

interface FaqLinkItem {
  id: string | number
  question: string
  slug?: string | null
}

export function PopularFaqLinks({ faqs }: { faqs: FaqLinkItem[] }) {
  function trackView(id: string) {
    fetch('/api/faq-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    }).catch(() => {})
  }

  return (
    <ul className="space-y-0">
      {faqs.filter((faq) => faq.slug).map((faq) => (
        <li key={faq.id} className="border-b border-kawai-black/[0.08] last:border-0">
          <Link
            href={`/faq/${faq.slug}`}
            onClick={() => trackView(String(faq.id))}
            className="group flex items-center justify-between py-5 gap-4 transition-colors duration-150"
          >
            <span className="text-base text-kawai-black font-[family-name:var(--font-brand-sans)] leading-snug">
              {faq.question}
            </span>
            <svg
              className="w-4 h-4 text-kawai-black/20 group-hover:text-kawai-red flex-shrink-0 transition-all duration-150 group-hover:translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </li>
      ))}
    </ul>
  )
}
