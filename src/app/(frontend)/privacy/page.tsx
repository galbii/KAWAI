import type { Metadata } from 'next'
import Link from 'next/link'
import { getStaticAlternates } from '@/lib/site-context'

export const metadata: Metadata = {
  title: 'Privacy Policy | Kawai Pianos',
  description:
    'Learn how Kawai America Corporation collects, uses, and protects your personal information when you visit or purchase from kawaius.com.',
  alternates: getStaticAlternates('/privacy'),
}

const EFFECTIVE_DATE = 'April 2, 2026'
const LAST_UPDATED = 'April 2, 2026'

const sections = [
  { id: 'who-we-are', label: 'Who We Are' },
  { id: 'what-we-collect', label: 'What We Collect' },
  { id: 'how-we-use-it', label: 'How We Use It' },
  { id: 'what-we-dont-do', label: "What We Don't Do" },
  { id: 'third-parties', label: 'Third-Party Services' },
  { id: 'data-retention', label: 'Data Retention' },
  { id: 'your-rights', label: 'Your Rights' },
  { id: 'security', label: 'Security' },
  { id: 'cookies', label: 'Cookies' },
  { id: 'changes', label: 'Policy Changes' },
  { id: 'contact', label: 'Contact Us' },
]

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-kawai-pearl">
      {/* Header */}
      <section className="bg-kawai-charcoal text-white py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
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
            <div className="bg-white border border-kawai-neutral rounded-xl p-6 text-kawai-charcoal/80 leading-relaxed">
              Kawai America Corporation operates kawaius.com. We make pianos. We don&apos;t make a
              business out of your personal data. This policy explains what information we collect
              when you visit or purchase from our site, why we collect it, and what we do — and
              don&apos;t do — with it.
            </div>

            {/* Section: Who We Are */}
            <section id="who-we-are" className="scroll-mt-8">
              <SectionHeading>Who We Are</SectionHeading>
              <Prose>
                <p>
                  <strong>Kawai America Corporation</strong> is the US subsidiary of Kawai Musical
                  Instruments Manufacturing Co., Ltd., headquartered in Hamamatsu, Japan. We are
                  the manufacturer and direct seller of Kawai pianos through kawaius.com.
                </p>
                <p>
                  When you purchase from kawaius.com, you are buying directly from Kawai — not a
                  third-party retailer or marketplace. Your data is handled by us, not passed
                  through a dealer network.
                </p>
              </Prose>
            </section>

            {/* Section: What We Collect */}
            <section id="what-we-collect" className="scroll-mt-8">
              <SectionHeading>What We Collect</SectionHeading>

              <SubHeading>Information you give us</SubHeading>
              <ul className="space-y-2 text-kawai-charcoal/80 text-[15px] leading-relaxed mb-6 list-none pl-0">
                {[
                  ['Name, email, phone, address', 'When you make a purchase, fill out a contact form, or sign up for our newsletter'],
                  ['Payment information', 'Processed securely by Stripe. We never store your full card number.'],
                  ['Order and communication history', 'So we can help you if you need support or have a warranty claim'],
                ].map(([label, desc]) => (
                  <li key={label} className="flex gap-3 bg-white border border-kawai-neutral rounded-lg p-4">
                    <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-kawai-red shrink-0 mt-2" />
                    <span>
                      <strong className="text-kawai-charcoal">{label}</strong>
                      {' — '}
                      {desc}
                    </span>
                  </li>
                ))}
              </ul>

              <SubHeading>Information we collect automatically</SubHeading>
              <ul className="space-y-2 text-kawai-charcoal/80 text-[15px] leading-relaxed list-none pl-0">
                {[
                  ['Device and browser information', 'Type, operating system, browser version'],
                  ['Pages visited and time spent', 'To understand how customers navigate the site'],
                  ['Referral source', 'How you found us — Google search, social media, email, etc.'],
                  ['IP address and approximate location', 'For fraud prevention and regional content'],
                ].map(([label, desc]) => (
                  <li key={label} className="flex gap-3 bg-white border border-kawai-neutral rounded-lg p-4">
                    <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-kawai-red shrink-0 mt-2" />
                    <span>
                      <strong className="text-kawai-charcoal">{label}</strong>
                      {' — '}
                      {desc}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Section: How We Use It */}
            <section id="how-we-use-it" className="scroll-mt-8">
              <SectionHeading>How We Use It</SectionHeading>
              <div className="space-y-4">
                {[
                  {
                    heading: 'To fulfill your order',
                    body: 'We share your name, address, and order details with our logistics and delivery partners solely to complete your delivery. They are not permitted to use your data for any other purpose.',
                  },
                  {
                    heading: 'To communicate with you',
                    body: "We'll send order confirmations, shipping updates, and warranty information. If you opt in, we'll send occasional product updates and offers. You can unsubscribe at any time — every email has an unsubscribe link.",
                  },
                  {
                    heading: 'To improve our site',
                    body: 'Aggregated, anonymized analytics help us understand what\'s working and what isn\'t.',
                  },
                  {
                    heading: 'To prevent fraud',
                    body: 'We use your order data to detect and prevent fraudulent transactions.',
                  },
                ].map(({ heading, body }) => (
                  <div key={heading} className="bg-white border border-kawai-neutral rounded-xl p-5">
                    <h3 className="font-semibold text-kawai-charcoal mb-1">{heading}</h3>
                    <p className="text-kawai-charcoal/70 text-[15px] leading-relaxed">{body}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section: What We Don't Do */}
            <section id="what-we-dont-do" className="scroll-mt-8">
              <SectionHeading>What We Don&apos;t Do</SectionHeading>
              <div className="bg-white border border-kawai-neutral rounded-xl divide-y divide-kawai-neutral">
                {[
                  'We do not sell your personal information to third parties. Ever.',
                  'We do not rent or share your contact information with advertisers.',
                  'We do not use your data to build advertising profiles for other platforms beyond standard retargeting pixels, which you can opt out of.',
                ].map((item) => (
                  <div key={item} className="flex gap-3 p-5 text-[15px] text-kawai-charcoal/80 leading-relaxed">
                    <svg className="w-5 h-5 text-kawai-red shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </div>
                ))}
              </div>
            </section>

            {/* Section: Third-Party Services */}
            <section id="third-parties" className="scroll-mt-8">
              <SectionHeading>Third-Party Services</SectionHeading>
              <Prose>
                <p>
                  We use the following services that may process your data. Each operates under its
                  own privacy policy — we configure them to minimize data collection where possible.
                </p>
              </Prose>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm border border-kawai-neutral rounded-xl overflow-hidden">
                  <thead className="bg-kawai-charcoal text-white">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold">Service</th>
                      <th className="text-left px-4 py-3 font-semibold">Purpose</th>
                      <th className="text-left px-4 py-3 font-semibold hidden sm:table-cell">Privacy Policy</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-kawai-neutral bg-white">
                    {[
                      ['Stripe', 'Payment processing', 'stripe.com/privacy'],
                      ['Google Analytics', 'Site analytics', 'policies.google.com/privacy'],
                      ['PostHog', 'Product analytics', 'posthog.com/privacy'],
                      ['Shopify', 'Order management & CRM', 'shopify.com/legal/privacy'],
                      ['Google Maps', 'Dealer locator', 'policies.google.com/privacy'],
                      ['Calendly', 'Consultation scheduling', 'calendly.com/privacy'],
                    ].map(([service, purpose, policyUrl]) => (
                      <tr key={service}>
                        <td className="px-4 py-3 font-medium text-kawai-charcoal">{service}</td>
                        <td className="px-4 py-3 text-kawai-charcoal/70">{purpose}</td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <a
                            href={`https://${policyUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-kawai-red hover:underline"
                          >
                            {policyUrl}
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section: Data Retention */}
            <section id="data-retention" className="scroll-mt-8">
              <SectionHeading>Data Retention</SectionHeading>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  ['Order data', '7 years', 'Accounting and legal compliance'],
                  ['Marketing preferences', 'Until you unsubscribe or request deletion', ''],
                  ['Analytics data', '24 months', 'Deleted after'],
                  ['Support communications', '3 years', ''],
                ].map(([type, period, note]) => (
                  <div key={type} className="bg-white border border-kawai-neutral rounded-xl p-4">
                    <p className="font-semibold text-kawai-charcoal text-sm">{type}</p>
                    <p className="text-kawai-red font-medium text-sm mt-0.5">{period}</p>
                    {note && <p className="text-kawai-charcoal/50 text-xs mt-0.5">{note}</p>}
                  </div>
                ))}
              </div>
            </section>

            {/* Section: Your Rights */}
            <section id="your-rights" className="scroll-mt-8">
              <SectionHeading>Your Rights</SectionHeading>
              <Prose>
                <p>Depending on where you live, you may have the right to:</p>
              </Prose>
              <ul className="mt-4 space-y-2 text-[15px] text-kawai-charcoal/80 list-none pl-0">
                {[
                  ['Access', 'the personal data we hold about you'],
                  ['Correct', 'inaccurate information'],
                  ['Delete', 'your data, subject to legal retention requirements'],
                  ['Opt out', 'of marketing communications at any time'],
                  ['Opt out', 'of the sale or sharing of personal information (we don\'t do this, but you have the right to request it)'],
                ].map(([action, desc], i) => (
                  <li key={i} className="flex gap-3 bg-white border border-kawai-neutral rounded-lg p-4">
                    <span className="font-semibold text-kawai-red shrink-0">{action}</span>
                    <span>{desc}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 space-y-4">
                <div className="bg-white border border-kawai-neutral rounded-xl p-5">
                  <h3 className="font-semibold text-kawai-charcoal mb-1">California Residents (CCPA)</h3>
                  <p className="text-kawai-charcoal/70 text-[15px] leading-relaxed">
                    You have the right to know what personal information we&apos;ve collected,
                    request deletion, and opt out of any sale of personal information. To exercise
                    these rights, email{' '}
                    <a href="mailto:contact@kawaius.com" className="text-kawai-red hover:underline">
                      contact@kawaius.com
                    </a>
                    .
                  </p>
                </div>
                <div className="bg-white border border-kawai-neutral rounded-xl p-5">
                  <h3 className="font-semibold text-kawai-charcoal mb-1">EU / UK Residents (GDPR)</h3>
                  <p className="text-kawai-charcoal/70 text-[15px] leading-relaxed">
                    Our legal basis for processing your data is contractual necessity (to fulfill
                    your order), legitimate interest (analytics and fraud prevention), and consent
                    (marketing). You have the right to lodge a complaint with your local data
                    protection authority.
                  </p>
                </div>
              </div>

              <p className="mt-4 text-[15px] text-kawai-charcoal/70">
                To exercise any of your rights, email{' '}
                <a href="mailto:contact@kawaius.com" className="text-kawai-red hover:underline">
                  contact@kawaius.com
                </a>
                . We&apos;ll respond within 30 days.
              </p>
            </section>

            {/* Section: Security */}
            <section id="security" className="scroll-mt-8">
              <SectionHeading>Security</SectionHeading>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'SSL/TLS encryption on all pages',
                  'Payment data handled by PCI-DSS compliant Stripe — we never touch your card data directly',
                  'Administrative access to customer data requires multi-factor authentication',
                  'Regular security audits of our infrastructure',
                ].map((item) => (
                  <div key={item} className="flex gap-3 bg-white border border-kawai-neutral rounded-xl p-4 text-[15px] text-kawai-charcoal/80 leading-relaxed">
                    <svg className="w-5 h-5 text-kawai-red shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    {item}
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm text-kawai-charcoal/50">
                No system is 100% secure, but we take every reasonable precaution to protect your
                information.
              </p>
            </section>

            {/* Section: Cookies */}
            <section id="cookies" className="scroll-mt-8">
              <SectionHeading>Cookies</SectionHeading>
              <div className="space-y-3">
                {[
                  {
                    type: 'Essential',
                    desc: 'Keeping you logged in, remembering your cart. These cannot be disabled.',
                    canOptOut: false,
                  },
                  {
                    type: 'Analytics',
                    desc: 'Understanding how you use the site — page views, time on page, referral source.',
                    canOptOut: true,
                  },
                  {
                    type: 'Marketing',
                    desc: 'Remarketing pixels from Google and Meta that allow us to show relevant ads.',
                    canOptOut: true,
                  },
                ].map(({ type, desc, canOptOut }) => (
                  <div key={type} className="flex gap-4 bg-white border border-kawai-neutral rounded-xl p-5">
                    <div className="shrink-0">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${canOptOut ? 'bg-kawai-pearl text-kawai-charcoal' : 'bg-kawai-charcoal text-white'}`}>
                        {canOptOut ? 'Optional' : 'Required'}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-kawai-charcoal text-sm mb-1">{type}</p>
                      <p className="text-kawai-charcoal/70 text-[15px] leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-[15px] text-kawai-charcoal/70">
                You can manage cookie preferences via the cookie banner on your first visit, or by
                emailing{' '}
                <a href="mailto:contact@kawaius.com" className="text-kawai-red hover:underline">
                  contact@kawaius.com
                </a>
                .
              </p>
            </section>

            {/* Section: Changes */}
            <section id="changes" className="scroll-mt-8">
              <SectionHeading>Policy Changes</SectionHeading>
              <Prose>
                <p>
                  If we make material changes to this policy, we&apos;ll notify you by email (if
                  you have an account with us) and update the &quot;Last Updated&quot; date at the
                  top of this page. Continued use of the site after a change constitutes acceptance
                  of the updated policy.
                </p>
              </Prose>
            </section>

            {/* Section: Contact */}
            <section id="contact" className="scroll-mt-8">
              <SectionHeading>Contact Us</SectionHeading>
              <div className="bg-white border border-kawai-neutral rounded-xl p-6 space-y-3 text-[15px] text-kawai-charcoal/80">
                <p className="font-semibold text-kawai-charcoal">
                  For privacy questions, data requests, or to exercise your rights:
                </p>
                <p>
                  <span className="font-medium text-kawai-charcoal">Email: </span>
                  <a href="mailto:contact@kawaius.com" className="text-kawai-red hover:underline">
                    contact@kawaius.com
                  </a>
                </p>
                <p>
                  <span className="font-medium text-kawai-charcoal">Mail: </span>
                  Kawai America Corporation, Attn: Privacy, 2055 East University Drive, Rancho Dominguez, CA 90220
                </p>
              </div>
            </section>

            {/* Footer note */}
            <div className="border-t border-kawai-neutral pt-8 text-sm text-kawai-charcoal/40">
              <p>
                This policy applies to kawaius.com only. For questions about our instruments, visit{' '}
                <Link href="/pianos" className="text-kawai-red hover:underline">
                  our piano catalog
                </Link>{' '}
                or{' '}
                <Link href="/contact" className="text-kawai-red hover:underline">
                  contact us
                </Link>
                .
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

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-base font-semibold text-kawai-charcoal mb-3 mt-5">
      {children}
    </h3>
  )
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[15px] text-kawai-charcoal/80 leading-relaxed space-y-3">
      {children}
    </div>
  )
}
