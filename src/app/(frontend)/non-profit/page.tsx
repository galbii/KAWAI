import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_URLS } from '@/lib/site-context'

// US-only page: "State tax exemption certificate" is a US sales-tax concept, so
// this deliberately uses a bare canonical instead of getStaticAlternates() —
// there is no en-CA equivalent to point hreflang at.
export const metadata: Metadata = {
  title: 'Tax-Exempt Purchases | Kawai Pianos',
  description:
    'Purchasing a Kawai piano for a tax-exempt organization? Email your contact info and State tax exemption certificate to contact@kawaius.com to be set up as a tax-exempt customer.',
  alternates: { canonical: `${SITE_URLS.us}/non-profit` },
}

const SERIF = 'var(--font-buena-park)' // Playfair Display — display headings
const SANS = 'var(--font-brand-sans)' // Inter — body
const LABEL = 'var(--font-oswald)' // Oswald — condensed eyebrows / captions

const LINK =
  'text-kawai-red-700 underline underline-offset-4 decoration-1 hover:decoration-2 hover:text-kawai-red transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kawai-red-700 rounded-sm'

export default function NonProfitPage() {
  return (
    <div className="bg-kawai-pearl">
      {/* ── Masthead ─────────────────────────────────────────────────────── */}
      <section className="bg-kawai-black text-white">
        <div className="container mx-auto px-6 max-w-4xl py-12 md:py-16">
          <p
            className="text-xs uppercase tracking-[0.32em] text-kawai-red-400 mb-4"
            style={{ fontFamily: LABEL }}
          >
            Kawai America Corporation
          </p>
          <h1
            className="text-3xl md:text-4xl font-bold tracking-tight"
            style={{ fontFamily: SERIF }}
          >
            Tax-Exempt Purchases
          </h1>
          <p
            className="mt-4 max-w-xl text-base md:text-lg leading-relaxed text-white/80"
            style={{ fontFamily: SANS }}
          >
            For schools, churches, universities, and other non-profit organizations buying a Kawai
            instrument.
          </p>
        </div>
      </section>

      {/* ── Statement ────────────────────────────────────────────────────── */}
      <section className="container mx-auto px-6 max-w-2xl py-16 md:py-24">
        <div
          className="bg-white border border-kawai-neutral rounded-xl p-7 md:p-9"
          style={{ fontFamily: SANS }}
        >
          <h2
            className="text-xl md:text-2xl font-bold text-kawai-charcoal mb-4"
            style={{ fontFamily: SERIF }}
          >
            How to set up tax-exempt status
          </h2>

          <p className="text-[17px] leading-relaxed text-kawai-charcoal/85">
            If you are purchasing for a tax-exempt organization, please email your contact info and
            State tax exemption certificate to{' '}
            <a href="mailto:contact@kawaius.com" className={LINK}>
              contact@kawaius.com
            </a>
            . We will confirm once we have you set up as a tax-exempt customer so you can complete
            your purchase.
          </p>

          <a
            href="mailto:contact@kawaius.com?subject=Tax-Exempt%20Purchase%20Request"
            className="mt-7 inline-flex items-center gap-2 bg-kawai-red text-white rounded-lg px-5 py-3 font-medium text-sm hover:bg-kawai-red-700 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kawai-red-700"
          >
            Email contact@kawaius.com →
          </a>
        </div>

        <p
          className="mt-8 text-sm leading-relaxed text-kawai-charcoal/60"
          style={{ fontFamily: SANS }}
        >
          This applies to instruments purchased directly from Kawai America at kawaius.com. If you
          are buying through an authorized dealer, please arrange tax exemption with that dealer —{' '}
          <Link href="/find-a-dealer" className={LINK}>
            find a dealer near you
          </Link>
          .
        </p>
      </section>
    </div>
  )
}
