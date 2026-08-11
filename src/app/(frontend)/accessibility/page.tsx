import type { Metadata } from 'next'
import Link from 'next/link'
import { getStaticAlternates } from '@/lib/site-context'

// ─────────────────────────────────────────────────────────────────────────────
// DRAFT — pending legal/counsel review before this is treated as final.
// Wording is deliberately effort-framed ("committed to", "strive to follow"). Do
// NOT change it to an absolute compliance claim (e.g. "this site is fully WCAG
// 2.1 AA compliant") — in an active ADA matter an over-claim can be used as a
// false-advertising / deceptive-practices argument. Counsel should confirm the
// response commitment and the contact line.
// ─────────────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Accessibility Statement | Kawai Pianos',
  description:
    'Kawai America is committed to digital accessibility for people with disabilities and is continually working to improve the experience on kawaius.com.',
  alternates: getStaticAlternates('/accessibility'),
}

const LAST_REVIEWED = 'August 10, 2026'

const SERIF = 'var(--font-buena-park)' // Playfair Display — display headings
const SANS = 'var(--font-brand-sans)' // Inter — body
const LABEL = 'var(--font-oswald)' // Oswald — condensed eyebrows / captions

const LINK =
  'text-kawai-red-700 underline underline-offset-4 decoration-1 hover:decoration-2 hover:text-kawai-red transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kawai-red-700 rounded-sm'

export default function AccessibilityStatementPage() {
  return (
    <div className="bg-kawai-pearl">
      {/* ── Masthead (kept modest) ───────────────────────────────────────── */}
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
            Accessibility Statement
          </h1>
          <p
            className="mt-4 max-w-xl text-base md:text-lg leading-relaxed text-white/80"
            style={{ fontFamily: SANS }}
          >
            Everyone should be able to experience Kawai. We are committed to making this website work
            for all of our visitors.
          </p>
          <p
            className="mt-6 text-[11px] uppercase tracking-[0.28em] text-white/70"
            style={{ fontFamily: LABEL }}
          >
            Last reviewed — {LAST_REVIEWED}
          </p>
        </div>
      </section>

      {/* ── Signature: piano-key transition (decorative) ─────────────────── */}
      <div
        aria-hidden="true"
        className="h-4 w-full"
        style={{
          background:
            'repeating-linear-gradient(90deg, #FFFFFF 0, #FFFFFF 26px, #1E1B16 26px, #1E1B16 28px)',
        }}
      />

      {/* ── Statement (headings enlarged) ────────────────────────────────── */}
      <section className="container mx-auto px-6 max-w-2xl py-16 md:py-24 space-y-16">
        <Block label="Our Commitment">
          <p>
            Kawai America Corporation is committed to ensuring that our website is accessible to
            people with disabilities. We want everyone to be able to explore our instruments, find a
            dealer, and reach us — and we are continually working to improve the experience for all
            of our visitors.
          </p>
        </Block>

        <Block label="The Standard">
          <p>
            We strive to follow the{' '}
            <a
              href="https://www.w3.org/WAI/WCAG21/quickref/?levels=aaa"
              target="_blank"
              rel="noopener noreferrer"
              className={LINK}
            >
              Web Content Accessibility Guidelines (WCAG) 2.1, Level AA
            </a>{' '}
            — the internationally recognized standard for accessible web content. Improving
            accessibility is an ongoing commitment, and we continue to review and enhance our website
            as it evolves.
          </p>
        </Block>

        <Block label="Get in Touch">
          <p>
            If you have any questions or feedback about the accessibility of this website — or if you
            would like information in a different format — please contact us and we will be glad to
            help. It is helpful to include the web address of the page and a description of what you
            need.
          </p>

          <div className="mt-8 border border-kawai-neutral bg-white rounded-2xl p-7 md:p-8">
            <p
              className="text-[11px] uppercase tracking-[0.3em] text-kawai-muted mb-2"
              style={{ fontFamily: LABEL }}
            >
              Call us
            </p>
            <a
              href="tel:+18004212177"
              className="inline-block text-3xl md:text-4xl font-bold text-kawai-black tracking-tight hover:text-kawai-red transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kawai-red-700 rounded-sm"
              style={{ fontFamily: SERIF }}
            >
              1-800-421-2177
            </a>

            <div className="mt-6 pt-6 border-t border-kawai-neutral space-y-1.5 text-[15px] leading-relaxed text-kawai-charcoal">
              <p>
                <span className="font-semibold text-kawai-black">By email — </span>
                <a href="mailto:accessibility@kawaius.com" className={LINK}>
                  accessibility@kawaius.com
                </a>
              </p>
              <p>
                <span className="font-semibold text-kawai-black">By mail — </span>
                Kawai America Corporation, Attn: Accessibility, 2055 East University Drive, Rancho
                Dominguez, CA 90220
              </p>
              <p className="text-kawai-muted">
                We aim to acknowledge accessibility feedback within five business days, and we will
                tell you what we intend to do about it.
              </p>
            </div>
          </div>
        </Block>

        <Block label="Ongoing Work">
          <p>
            Accessibility is not a one-time project. We review this website on an ongoing basis, and
            we work to address issues as we find them or as they are reported to us. Some content —
            including older material, embedded third-party media, and content supplied by
            independent dealers — may not yet meet the standard we are working toward. We welcome
            reports about any of it.
          </p>
          <p className="mt-5">
            If any part of this website prevents you from finding the information you need, please
            contact us using the details above and we will work with you to provide that information
            in another way.
          </p>
        </Block>

        <p className="pt-4 text-sm text-kawai-muted" style={{ fontFamily: SANS }}>
          This statement applies to kawaius.com and ca.kawaius.com. See also our{' '}
          <Link href="/privacy" className={LINK}>
            Privacy Policy
          </Link>{' '}
          and{' '}
          <Link href="/terms" className={LINK}>
            Terms of Service
          </Link>
          .
        </p>
      </section>
    </div>
  )
}

// ─── Layout helpers ──────────────────────────────────────────────────────────

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section>
      <span className="block h-[3px] w-10 bg-kawai-red mb-4" aria-hidden="true" />
      <h2
        className="text-3xl md:text-4xl font-bold text-kawai-black tracking-tight mb-5"
        style={{ fontFamily: SERIF }}
      >
        {label}
      </h2>
      <div className="text-lg leading-[1.75] text-kawai-charcoal" style={{ fontFamily: SANS }}>
        {children}
      </div>
    </section>
  )
}
