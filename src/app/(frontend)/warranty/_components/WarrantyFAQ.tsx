import Link from 'next/link'

const faqs = [
  {
    q: 'How long is my Kawai warranty?',
    a: 'Acoustic pianos — including all Kawai grand, upright, and Shigeru Kawai models — carry a full ten (10) year transferable warranty. Digital and hybrid pianos carry a 3- or 5-year limited warranty depending on series.',
  },
  {
    q: 'Is the acoustic piano warranty transferable?',
    a: 'Yes. The Kawai acoustic piano warranty is a Full Ten Year Transferable Warranty, meaning coverage continues for the full ten years from the original purchase date even if the instrument changes ownership.',
  },
  {
    q: 'What voids my Kawai warranty?',
    a: 'Accidental damage, abuse, modification, negligence, improper repair or service, removal or alteration of the factory serial number, and damage from extremes of temperature or humidity are not covered. Routine maintenance, tuning, regulation, voicing, and normal wear and tear are also excluded.',
  },
  {
    q: 'How do I register my Kawai piano?',
    a: 'Register your instrument online at the Kawai warranty registration page. Registration takes less than two minutes, confirms your purchase date, and ensures your coverage is on file should you ever need warranty service.',
  },
  {
    q: 'How do I file a warranty claim?',
    a: 'Contact your authorized Kawai dealer or reach Kawai America Corporation Technical Services at 1-800-421-2177. Authorization by Kawai is required prior to any warranty repair. Do not return any product without a written Return Authorization.',
  },
  {
    q: 'Does the warranty apply outside the United States and Canada?',
    a: 'No. The Kawai warranty applies only to pianos located in and purchased from authorized Kawai dealers in the United States and Canada.',
  },
] as const

export function WarrantyFAQ() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <section id="faq" aria-labelledby="faq-heading" className="scroll-mt-[8rem]">
      <h2
        id="faq-heading"
        className="text-[11px] font-semibold uppercase tracking-widest text-kawai-charcoal/40 mb-6"
      >
        Frequently asked
      </h2>
      <div>
        {faqs.map((f) => (
          <details
            key={f.q}
            className="group border-t border-kawai-neutral last:border-b"
          >
            <summary className="cursor-pointer list-none py-4 flex items-center justify-between gap-4 hover:text-kawai-red transition-colors">
              <span className="text-[15px] font-medium text-kawai-charcoal group-hover:text-kawai-red transition-colors">
                {f.q}
              </span>
              <svg
                className="w-4 h-4 text-kawai-charcoal/40 shrink-0 transition-transform duration-200 group-open:rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p className="pb-5 text-[14px] text-kawai-charcoal/70 leading-relaxed max-w-2xl">
              {f.a}
            </p>
          </details>
        ))}
      </div>
      <p className="mt-6 text-[13px] text-kawai-charcoal/55">
        Still have questions?{' '}
        <Link href="/find-a-dealer" className="text-kawai-red hover:underline">
          Contact your nearest dealer
        </Link>
        {' '}or call{' '}
        <a href="tel:+18004212177" className="text-kawai-red hover:underline">1-800-421-2177</a>.
      </p>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  )
}
