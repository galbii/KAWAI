import type { Metadata } from 'next'
import Link from 'next/link'
import { getStaticAlternates } from '@/lib/site-context'

export const metadata: Metadata = {
  title: 'Return Policy | Kawai Pianos',
  description:
    'Kawai America\'s return policy for instruments purchased directly at kawaius.com — 15-day returns, damage claims, and defective instrument coverage.',
  alternates: getStaticAlternates('/return-policy'),
}

const EFFECTIVE_DATE = 'April 28, 2026'
const LAST_UPDATED = 'August 10, 2026'

const sections = [
  { id: 'overview', label: 'Overview' },
  { id: 'fifteen-day-return', label: '15-Day Return Policy' },
  { id: 'shipping-damage', label: 'Arrived Damaged?' },
  { id: 'defective-instrument', label: 'Defective Instrument' },
  { id: 'how-to-return', label: 'How to Return' },
  { id: 'refunds', label: 'Refunds' },
  { id: 'exclusions', label: 'Exclusions' },
  { id: 'canada', label: 'Orders in Canada' },
  { id: 'contact', label: 'Contact Us' },
]

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-kawai-pearl">
      {/* Header */}
      <section className="bg-kawai-charcoal text-white py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Return Policy</h1>
          <p className="text-gray-300 text-lg">
            Effective: {EFFECTIVE_DATE} &nbsp;·&nbsp; Last updated: {LAST_UPDATED}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 max-w-4xl py-12 lg:py-16">
        <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-12">

          {/* Sticky table of contents — desktop only */}
          <aside className="hidden lg:block">
            <div className="sticky bg-white border border-kawai-neutral rounded-xl p-5" style={{ top: 'calc(var(--header-bottom, 80px) + 1rem)' }}>
              <p className="text-xs font-semibold uppercase tracking-wider text-kawai-charcoal/50 mb-3">
                On this page
              </p>
              <nav className="space-y-1">
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="block text-sm text-kawai-charcoal/70 hover:text-kawai-red transition-colors py-0.5"
                  >
                    {s.label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Policy content */}
          <article className="prose prose-kawai max-w-none space-y-12">

            {/* Intro */}
            <div className="bg-white border border-kawai-neutral rounded-xl p-6 text-kawai-charcoal/80 leading-relaxed" id="overview">
              These policies apply to instruments purchased directly from Kawai America at{' '}
              <strong>kawaius.com</strong> or <strong>ca.kawaius.com</strong>. For instruments
              purchased through an authorized dealer, please contact that dealer directly regarding
              their return and exchange policies.
            </div>

            {/* Section: 15-Day Return Policy */}
            <section id="fifteen-day-return" className="scroll-mt-8">
              <SectionHeading>15-Day Return Policy</SectionHeading>
              <div className="bg-white border border-kawai-neutral rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-semibold bg-kawai-red/10 text-kawai-red px-3 py-1 rounded-full">15 Days from Delivery</span>
                </div>
                <Prose>
                  <p>
                    Changed your mind? No problem. We accept returns on instruments within{' '}
                    <strong>15 days of delivery</strong> — no questions asked. To be eligible, the
                    instrument must be returned in its original packaging and in new, unplayed
                    condition.
                  </p>
                </Prose>
                <div className="mt-4 space-y-2">
                  {[
                    'Instrument must be in new, unplayed condition',
                    'Original packaging and all included materials must be included',
                    'Accessories (bench, headphones, cables, etc.) are not eligible for return',
                    'Original shipping charges are non-refundable',
                    'Return shipping costs are the responsibility of the customer',
                  ].map((item) => (
                    <div key={item} className="flex gap-3 text-[15px] text-kawai-charcoal/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-kawai-red shrink-0 mt-2" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Section: Shipping Damage */}
            <section id="shipping-damage" className="scroll-mt-8">
              <SectionHeading>Arrived Damaged?</SectionHeading>
              <div className="bg-white border border-kawai-neutral rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-semibold bg-kawai-red/10 text-kawai-red px-3 py-1 rounded-full">Report Within 5 Days</span>
                </div>
                <Prose>
                  <p>
                    If your instrument arrives with visible or concealed damage from shipping, please
                    report it <strong>within 5 days of delivery</strong>. When shipping damage is
                    confirmed, return shipping and replacement are on us.
                  </p>
                  <p>
                    To report shipping damage,{' '}
                    <Link href="/technical-support-division" className="text-kawai-red hover:underline">
                      contact our support team
                    </Link>{' '}
                    with:
                  </p>
                </Prose>
                <div className="mt-2 space-y-2">
                  {[
                    'Your model and serial number',
                    'Your original order number',
                    'Photos of the damage — both the instrument and packaging',
                  ].map((item) => (
                    <div key={item} className="flex gap-3 text-[15px] text-kawai-charcoal/80">
                      <svg className="w-4 h-4 text-kawai-red shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Section: Defective Instrument */}
            <section id="defective-instrument" className="scroll-mt-8">
              <SectionHeading>Defective Instrument</SectionHeading>
              <div className="bg-white border border-kawai-neutral rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-semibold bg-kawai-red/10 text-kawai-red px-3 py-1 rounded-full">Report Promptly</span>
                </div>
                <Prose>
                  <p>
                    In the rare event your instrument doesn&apos;t perform as expected, reach out to
                    us as soon as possible. A product specialist will assess the issue and, if a
                    defect is confirmed, we&apos;ll arrange repair or replacement at no cost to you
                    — including shipping both ways.
                  </p>
                </Prose>
                <div className="mt-4 bg-kawai-pearl border border-kawai-neutral rounded-lg p-4 space-y-2 text-[15px] text-kawai-charcoal/80">
                  <p className="font-semibold text-kawai-charcoal text-sm">Reach our product specialists:</p>
                  <p>
                    <Link href="/technical-support-division" className="text-kawai-red hover:underline font-medium">
                      Visit our Technical Support page →
                    </Link>
                  </p>
                  <p className="text-sm text-kawai-charcoal/60">
                    Please have your model, serial number, and order number ready when you contact us.
                  </p>
                </div>
              </div>
            </section>

            {/* Section: How to Return */}
            <section id="how-to-return" className="scroll-mt-8">
              <SectionHeading>How to Return</SectionHeading>
              <div className="space-y-4">
                {[
                  {
                    num: '1',
                    title: 'Contact Support',
                    body: 'Visit our Technical Support page and submit a request with your model, serial number, and original order number. Our team will review your request and send return instructions within 1–2 business days.',
                  },
                  {
                    num: '2',
                    title: 'Pack Your Piano',
                    body: 'Repack the instrument securely in its original box and all original packaging materials. Proper repackaging is required — instruments that arrive damaged due to inadequate packaging may not be eligible for a full refund.',
                  },
                  {
                    num: '3',
                    title: 'Ship It Back',
                    body: 'Once you\'ve shipped the instrument back to us using a trackable carrier, email us the tracking number. We\'ll send a confirmation as soon as we receive and inspect the return.',
                  },
                  {
                    num: '4',
                    title: 'Receive Your Refund',
                    body: 'Once the instrument passes inspection, your refund will be issued to your original payment method within 5–10 business days. Your refund will reflect the full purchase price minus original and return shipping costs.',
                  },
                ].map(({ num, title, body }) => (
                  <div key={num} className="flex gap-5 bg-white border border-kawai-neutral rounded-xl p-5">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-kawai-charcoal text-white text-sm font-bold flex items-center justify-center mt-0.5">
                      {num}
                    </span>
                    <div>
                      <h3 className="font-semibold text-kawai-charcoal mb-1">{title}</h3>
                      <p className="text-kawai-charcoal/70 text-[15px] leading-relaxed">{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section: Refunds */}
            <section id="refunds" className="scroll-mt-8">
              <SectionHeading>Refunds</SectionHeading>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  ['Refund method', 'Original payment method only'],
                  ['Processing time', '5–10 business days after inspection'],
                  ['Shipping deducted', 'Original and return shipping costs are non-refundable'],
                  ['Inspection required', 'Instrument must pass condition inspection before refund is issued'],
                ].map(([label, value]) => (
                  <div key={label} className="bg-white border border-kawai-neutral rounded-xl p-4">
                    <p className="font-semibold text-kawai-charcoal text-sm">{label}</p>
                    <p className="text-kawai-charcoal/70 text-sm mt-0.5 leading-relaxed">{value}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section: Exclusions */}
            <section id="exclusions" className="scroll-mt-8">
              <SectionHeading>Exclusions</SectionHeading>
              <Prose>
                <p>The following are not eligible for return or exchange:</p>
              </Prose>
              <div className="mt-4 bg-white border border-kawai-neutral rounded-xl divide-y divide-kawai-neutral">
                {[
                  'Accessories — benches, headphones, cables, and other add-ons',
                  'Instruments not purchased directly from kawaius.com',
                  'Instruments returned after 15 days from delivery (unless damaged or defective)',
                  'Instruments returned in played, damaged, or altered condition',
                  'Instruments missing original packaging or materials',
                ].map((item) => (
                  <div key={item} className="flex gap-3 p-5 text-[15px] text-kawai-charcoal/80 leading-relaxed">
                    <svg className="w-5 h-5 text-kawai-charcoal/30 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {item}
                  </div>
                ))}
              </div>
            </section>

            {/* Section: Orders in Canada */}
            <section id="canada" className="scroll-mt-8">
              <SectionHeading>Orders in Canada</SectionHeading>
              <div className="bg-white border border-kawai-neutral rounded-xl p-6 space-y-4">
                <Prose>
                  <p>
                    The 15-day return window, shipping damage window, and defective instrument terms
                    above apply equally to orders placed on <strong>ca.kawaius.com</strong>, with the
                    following differences:
                  </p>
                </Prose>
                <div className="mt-2 space-y-2">
                  {[
                    'Refunds are issued in Canadian dollars to your original payment method',
                    'Returns ship to our Canadian returns address, which we will provide when you start a return — please do not ship returns across the border to our California address',
                    'Nothing in this policy limits any right or remedy you have under the consumer protection legislation of your province or territory',
                  ].map((item) => (
                    <div key={item} className="flex gap-3 text-[15px] text-kawai-charcoal/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-kawai-red shrink-0 mt-2" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Section: Contact */}
            <section id="contact" className="scroll-mt-8">
              <SectionHeading>Contact Us</SectionHeading>
              <div className="bg-white border border-kawai-neutral rounded-xl p-6 space-y-4 text-[15px] text-kawai-charcoal/80">
                <p className="font-semibold text-kawai-charcoal">
                  Questions about a return or need to start the process?
                </p>
                <Link
                  href="/technical-support-division"
                  className="flex items-center gap-3 bg-kawai-red text-white rounded-lg px-5 py-3 font-medium text-sm hover:bg-kawai-red-700 transition-colors w-fit"
                >
                  Get help from our support team →
                </Link>
                <p className="text-kawai-charcoal/50 text-sm">
                  You can also reach us by mail: Kawai America Corporation, Attn: Returns,
                  2055 East University Drive, Rancho Dominguez, CA 90220
                </p>
              </div>
            </section>

            {/* Footer note */}
            <div className="border-t border-kawai-neutral pt-8 text-sm text-kawai-charcoal/40">
              <p>
                This policy applies to instruments purchased directly from kawaius.com or
                ca.kawaius.com. For warranty terms, see our{' '}
                <Link href="/warranty" className="text-kawai-red hover:underline">
                  warranty page
                </Link>{' '}
                or{' '}
                <Link href="/warranty-registration" className="text-kawai-red hover:underline">
                  register your instrument
                </Link>
                . This policy forms part of our{' '}
                <Link href="/terms" className="text-kawai-red hover:underline">
                  Terms of Service
                </Link>
                . For dealer purchases, contact your dealer directly.
              </p>
            </div>

          </article>
        </div>
      </div>
    </div>
  )
}

// ─── Local layout helpers ────────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl font-bold text-kawai-charcoal mb-5 pb-3 border-b border-kawai-neutral">
      {children}
    </h2>
  )
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[15px] text-kawai-charcoal/80 leading-relaxed space-y-3">
      {children}
    </div>
  )
}
