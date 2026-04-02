import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service | Kawai Pianos',
  description:
    'Read the Terms of Service for kawai.com — the rules and conditions that govern your use of our website, products, and services.',
  alternates: {
    canonical: '/terms',
  },
}

const EFFECTIVE_DATE = 'April 2, 2026'
const LAST_UPDATED = 'April 2, 2026'

const sections = [
  { id: 'agreement', label: 'Agreement to Terms' },
  { id: 'use-of-site', label: 'Use of This Site' },
  { id: 'products-pricing', label: 'Products & Pricing' },
  { id: 'purchases-checkout', label: 'Purchases & Checkout' },
  { id: 'dealer-storefronts', label: 'Dealer Storefronts' },
  { id: 'lead-forms', label: 'Forms & Communications' },
  { id: 'intellectual-property', label: 'Intellectual Property' },
  { id: 'third-party-services', label: 'Third-Party Services' },
  { id: 'disclaimers', label: 'Disclaimers & Liability' },
  { id: 'governing-law', label: 'Governing Law' },
  { id: 'changes', label: 'Changes to These Terms' },
  { id: 'contact', label: 'Contact Us' },
]

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-kawai-pearl">
      {/* Header */}
      <section className="bg-kawai-charcoal text-white py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
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

          {/* Terms content */}
          <article className="prose prose-kawai max-w-none space-y-12">

            {/* Intro */}
            <div className="bg-white border border-kawai-neutral rounded-xl p-6 text-kawai-charcoal/80 leading-relaxed">
              These Terms of Service govern your use of kawai.com, operated by Kawai America
              Corporation. By accessing or using this site — including browsing our catalog,
              submitting a contact form, or purchasing a piano — you agree to these terms. If you
              don&apos;t agree, please don&apos;t use the site.
            </div>

            {/* Section: Agreement to Terms */}
            <section id="agreement" className="scroll-mt-8">
              <SectionHeading>Agreement to Terms</SectionHeading>
              <Prose>
                <p>
                  These Terms of Service (&quot;Terms&quot;) constitute a legally binding agreement
                  between you and <strong>Kawai America Corporation</strong> (&quot;Kawai,&quot;
                  &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), a US subsidiary of Kawai
                  Musical Instruments Manufacturing Co., Ltd., headquartered in Hamamatsu, Japan.
                </p>
                <p>
                  By using kawai.com — including dealer storefronts hosted on our domain — you
                  confirm that you are at least 18 years old, have read and understood these Terms,
                  and agree to be bound by them. If you are using this site on behalf of a
                  business, you represent that you have authority to bind that business to these
                  Terms.
                </p>
              </Prose>
            </section>

            {/* Section: Use of This Site */}
            <section id="use-of-site" className="scroll-mt-8">
              <SectionHeading>Use of This Site</SectionHeading>
              <Prose>
                <p>You may use kawai.com for lawful purposes only. You agree not to:</p>
              </Prose>
              <div className="mt-4 bg-white border border-kawai-neutral rounded-xl divide-y divide-kawai-neutral">
                {[
                  'Use the site to transmit spam, malicious code, or unauthorized advertising',
                  'Attempt to gain unauthorized access to any part of the site or its infrastructure',
                  'Scrape, crawl, or systematically download content without written permission',
                  'Impersonate Kawai, a dealer, or any other person or entity',
                  'Use the site in any way that could damage, disable, or impair its operation',
                  'Circumvent any security or access-control measures on the site',
                ].map((item) => (
                  <div key={item} className="flex gap-3 p-5 text-[15px] text-kawai-charcoal/80 leading-relaxed">
                    <svg className="w-5 h-5 text-kawai-red shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {item}
                  </div>
                ))}
              </div>
              <Prose>
                <p className="mt-4">
                  We reserve the right to block, suspend, or terminate access for any user who
                  violates these Terms or engages in conduct we determine to be harmful to Kawai,
                  our dealers, or other users.
                </p>
              </Prose>
            </section>

            {/* Section: Products & Pricing */}
            <section id="products-pricing" className="scroll-mt-8">
              <SectionHeading>Products &amp; Pricing</SectionHeading>
              <div className="space-y-4">
                {[
                  {
                    heading: 'Product descriptions',
                    body: 'We make every effort to accurately describe our instruments, including specifications, features, and imagery. However, we do not warrant that product descriptions are error-free, complete, or current. Actual product appearance may vary slightly from photography.',
                  },
                  {
                    heading: 'Pricing',
                    body: 'Prices displayed on kawai.com are in US dollars and are subject to change without notice. We reserve the right to correct pricing errors at any time. In the event a product is listed at an incorrect price, we may cancel or refuse any order placed at that price and notify you accordingly.',
                  },
                  {
                    heading: 'Availability',
                    body: 'Product availability is not guaranteed. We reserve the right to limit quantities or discontinue products at any time. If a product becomes unavailable after your order is placed, we will contact you with options.',
                  },
                  {
                    heading: 'Dealer pricing',
                    body: 'Independent authorized dealers may set their own prices. Prices advertised through dealer storefronts on this site are the responsibility of the individual dealer and may differ from kawai.com direct pricing.',
                  },
                ].map(({ heading, body }) => (
                  <div key={heading} className="bg-white border border-kawai-neutral rounded-xl p-5">
                    <h3 className="font-semibold text-kawai-charcoal mb-1">{heading}</h3>
                    <p className="text-kawai-charcoal/70 text-[15px] leading-relaxed">{body}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section: Purchases & Checkout */}
            <section id="purchases-checkout" className="scroll-mt-8">
              <SectionHeading>Purchases &amp; Checkout</SectionHeading>
              <Prose>
                <p>
                  When you add items to your cart and proceed to checkout, you will be redirected
                  to <strong>Shopify&apos;s hosted checkout</strong>. Payment processing is handled
                  entirely by Shopify and is governed by{' '}
                  <a
                    href="https://www.shopify.com/legal/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-kawai-red hover:underline"
                  >
                    Shopify&apos;s Terms of Service
                  </a>
                  . Kawai does not store or handle your payment card data directly.
                </p>
              </Prose>
              <div className="mt-4 grid sm:grid-cols-2 gap-3">
                {[
                  ['Cart storage', 'Your cart is saved in your browser\'s local storage for up to 7 days. Clearing browser data will remove it.'],
                  ['Order confirmation', 'A confirmation email will be sent once your order is placed. This constitutes acceptance of your order.'],
                  ['Cancellations', 'Orders may be cancelled before shipment. Contact us immediately if you need to cancel. Once shipped, our return policy applies.'],
                  ['Returns & warranty', 'Product returns and warranty claims are governed by the warranty documentation included with your instrument. Contact us at legal@kawai.com for assistance.'],
                ].map(([label, desc]) => (
                  <div key={label} className="bg-white border border-kawai-neutral rounded-xl p-4">
                    <p className="font-semibold text-kawai-charcoal text-sm">{label}</p>
                    <p className="text-kawai-charcoal/70 text-[15px] leading-relaxed mt-1">{desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section: Dealer Storefronts */}
            <section id="dealer-storefronts" className="scroll-mt-8">
              <SectionHeading>Dealer Storefronts</SectionHeading>
              <Prose>
                <p>
                  kawai.com hosts branded storefronts for authorized Kawai dealers (e.g.,{' '}
                  <code className="text-sm bg-kawai-pearl px-1.5 py-0.5 rounded">
                    kawai.com/store/dealer-name
                  </code>
                  ). These pages are operated by independent businesses that are separately owned
                  and managed.
                </p>
              </Prose>
              <div className="mt-4 bg-white border border-kawai-neutral rounded-xl divide-y divide-kawai-neutral">
                {[
                  'Dealer storefronts are maintained by the individual dealer. Kawai is not responsible for the accuracy of dealer-specific information including hours, inventory, pricing, or contact details.',
                  'When you submit a contact form or book an appointment through a dealer storefront, your information is shared with that dealer and with Kawai America. See our Privacy Policy for details.',
                  'Dealers are independent contractors and are not agents or employees of Kawai America Corporation. Kawai is not liable for any acts, omissions, or representations made by dealers.',
                  'Kawai reserves the right to remove or suspend any dealer storefront at any time for any reason.',
                ].map((item) => (
                  <div key={item} className="flex gap-3 p-5 text-[15px] text-kawai-charcoal/80 leading-relaxed">
                    <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-kawai-red shrink-0 mt-2" />
                    {item}
                  </div>
                ))}
              </div>
            </section>

            {/* Section: Forms & Communications */}
            <section id="lead-forms" className="scroll-mt-8">
              <SectionHeading>Forms &amp; Communications</SectionHeading>
              <Prose>
                <p>
                  kawai.com provides contact forms, newsletter signups, consultation booking,
                  warranty registration, and job application forms. By submitting any form you agree
                  to the following:
                </p>
              </Prose>
              <div className="mt-4 space-y-3">
                {[
                  {
                    heading: 'Accuracy of information',
                    body: 'You agree to provide truthful, accurate information. Submitting false contact details or impersonating another person is a violation of these Terms.',
                  },
                  {
                    heading: 'Marketing communications',
                    body: 'If you check the opt-in box on a contact form or sign up for our newsletter, you consent to receiving marketing emails from Kawai. You can unsubscribe at any time via the link in any email.',
                  },
                  {
                    heading: 'Data sharing with third parties',
                    body: 'Form submissions may be processed by third-party services including Shopify (CRM), Meta Conversions API (advertising attribution), HubSpot (warranty), and Calendly (scheduling). These services are bound by their own privacy policies. See our Privacy Policy for a full list.',
                  },
                  {
                    heading: 'Job applications',
                    body: 'Files uploaded as part of a job application (resumes, cover letters) are stored securely and used solely for recruitment purposes. Unsolicited applications may not receive a response. Submission does not create an employment relationship.',
                  },
                ].map(({ heading, body }) => (
                  <div key={heading} className="bg-white border border-kawai-neutral rounded-xl p-5">
                    <h3 className="font-semibold text-kawai-charcoal mb-1">{heading}</h3>
                    <p className="text-kawai-charcoal/70 text-[15px] leading-relaxed">{body}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section: Intellectual Property */}
            <section id="intellectual-property" className="scroll-mt-8">
              <SectionHeading>Intellectual Property</SectionHeading>
              <Prose>
                <p>
                  All content on kawai.com — including text, images, video, audio, product
                  descriptions, logos, design, and code — is owned by or licensed to Kawai America
                  Corporation and is protected by US and international copyright, trademark, and
                  other intellectual property laws.
                </p>
              </Prose>
              <div className="mt-4 bg-white border border-kawai-neutral rounded-xl divide-y divide-kawai-neutral">
                {[
                  [
                    'You may not reproduce, distribute, modify, or create derivative works',
                    'from any site content without prior written permission from Kawai.',
                  ],
                  [
                    'The Kawai name, logo, and Shigeru Kawai mark',
                    'are registered trademarks. Unauthorized use is strictly prohibited.',
                  ],
                  [
                    'Artist content, music recordings, and imagery',
                    'appearing on this site are used with permission and subject to separate agreements. You may not reproduce them.',
                  ],
                  [
                    'Linking to kawai.com',
                    'is permitted provided it does not imply endorsement, misrepresent our content, or link to our pages in a misleading context.',
                  ],
                ].map(([label, desc]) => (
                  <div key={label} className="flex gap-3 p-5 text-[15px] text-kawai-charcoal/80 leading-relaxed">
                    <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-kawai-red shrink-0 mt-2" />
                    <span>
                      <strong className="text-kawai-charcoal">{label}</strong>
                      {' — '}
                      {desc}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Section: Third-Party Services */}
            <section id="third-party-services" className="scroll-mt-8">
              <SectionHeading>Third-Party Services &amp; Embeds</SectionHeading>
              <Prose>
                <p>
                  kawai.com integrates with and embeds content from third-party services. These
                  services operate independently under their own terms and privacy policies. Kawai
                  is not responsible for their content, availability, or data practices.
                </p>
              </Prose>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm border border-kawai-neutral rounded-xl overflow-hidden">
                  <thead className="bg-kawai-charcoal text-white">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold">Service</th>
                      <th className="text-left px-4 py-3 font-semibold">Purpose</th>
                      <th className="text-left px-4 py-3 font-semibold hidden sm:table-cell">Terms / Privacy</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-kawai-neutral bg-white">
                    {[
                      ['Shopify', 'Cart, checkout, and customer CRM', 'shopify.com/legal/terms'],
                      ['Meta (Facebook)', 'Advertising pixel and server-side conversion tracking', 'facebook.com/policy'],
                      ['Google Analytics & GTM', 'Site analytics and tag management', 'policies.google.com/privacy'],
                      ['PostHog', 'Product analytics', 'posthog.com/privacy'],
                      ['Google Maps', 'Dealer locator and map embeds', 'policies.google.com/privacy'],
                      ['Calendly', 'Consultation and appointment scheduling', 'calendly.com/privacy'],
                      ['HubSpot', 'Warranty registration forms', 'legal.hubspot.com/privacy-policy'],
                      ['YouTube', 'Embedded product and brand videos', 'youtube.com/t/terms'],
                      ['Instagram', 'Embedded social content', 'privacycenter.instagram.com'],
                      ['SoundCloud', 'Embedded audio playback', 'soundcloud.com/pages/privacy'],
                      ['Cloudflare R2', 'Media and file storage', 'cloudflare.com/privacypolicy'],
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
              <Prose>
                <p className="mt-4">
                  Links to external websites from kawai.com are provided for convenience only.
                  Kawai does not endorse, control, or take responsibility for the content or
                  practices of any external site.
                </p>
              </Prose>
            </section>

            {/* Section: Disclaimers & Liability */}
            <section id="disclaimers" className="scroll-mt-8">
              <SectionHeading>Disclaimers &amp; Limitation of Liability</SectionHeading>

              <SubHeading>Site provided &quot;as is&quot;</SubHeading>
              <Prose>
                <p>
                  kawai.com is provided on an &quot;as is&quot; and &quot;as available&quot; basis
                  without warranties of any kind — express, implied, or statutory — including but
                  not limited to implied warranties of merchantability, fitness for a particular
                  purpose, or non-infringement. We do not warrant that the site will be
                  uninterrupted, error-free, or free of viruses or other harmful components.
                </p>
              </Prose>

              <SubHeading>Limitation of liability</SubHeading>
              <div className="bg-white border border-kawai-neutral rounded-xl p-5">
                <p className="text-kawai-charcoal/70 text-[15px] leading-relaxed">
                  To the maximum extent permitted by applicable law, Kawai America Corporation
                  shall not be liable for any indirect, incidental, special, consequential, or
                  punitive damages — including loss of profits, data, or goodwill — arising from
                  your use of or inability to use this site or its services, even if we have been
                  advised of the possibility of such damages. Our total liability for any claim
                  arising out of these Terms or your use of the site shall not exceed the greater
                  of (a) the amount you paid to Kawai in the 12 months preceding the claim, or (b)
                  one hundred US dollars ($100).
                </p>
              </div>

              <SubHeading>Dealer and product disclaimer</SubHeading>
              <Prose>
                <p>
                  Product specifications, pricing, and availability are subject to change without
                  notice. Kawai is not liable for any loss resulting from reliance on inaccurate or
                  outdated information on this site. Dealer-specific information (hours, stock,
                  pricing) is the responsibility of the individual dealer.
                </p>
              </Prose>
            </section>

            {/* Section: Governing Law */}
            <section id="governing-law" className="scroll-mt-8">
              <SectionHeading>Governing Law &amp; Disputes</SectionHeading>
              <div className="space-y-4">
                <div className="bg-white border border-kawai-neutral rounded-xl p-5">
                  <h3 className="font-semibold text-kawai-charcoal mb-1">Governing law</h3>
                  <p className="text-kawai-charcoal/70 text-[15px] leading-relaxed">
                    These Terms are governed by the laws of the State of California, without regard
                    to its conflict-of-law provisions. Any dispute arising out of or relating to
                    these Terms or your use of kawai.com shall be subject to the exclusive
                    jurisdiction of the state and federal courts located in Los Angeles County,
                    California.
                  </p>
                </div>
                <div className="bg-white border border-kawai-neutral rounded-xl p-5">
                  <h3 className="font-semibold text-kawai-charcoal mb-1">Informal resolution</h3>
                  <p className="text-kawai-charcoal/70 text-[15px] leading-relaxed">
                    Before filing any formal legal claim, you agree to contact us at{' '}
                    <a href="mailto:legal@kawai.com" className="text-kawai-red hover:underline">
                      legal@kawai.com
                    </a>{' '}
                    and give us 30 days to attempt to resolve the dispute informally.
                  </p>
                </div>
                <div className="bg-white border border-kawai-neutral rounded-xl p-5">
                  <h3 className="font-semibold text-kawai-charcoal mb-1">Severability</h3>
                  <p className="text-kawai-charcoal/70 text-[15px] leading-relaxed">
                    If any provision of these Terms is found to be unenforceable, that provision
                    will be modified to the minimum extent necessary to make it enforceable, and
                    the remaining provisions will remain in full force and effect.
                  </p>
                </div>
              </div>
            </section>

            {/* Section: Changes */}
            <section id="changes" className="scroll-mt-8">
              <SectionHeading>Changes to These Terms</SectionHeading>
              <Prose>
                <p>
                  We may update these Terms from time to time. When we do, we will update the
                  &quot;Last Updated&quot; date at the top of this page. Material changes will be
                  communicated via email to users with an active account or recent purchase history.
                  Continued use of kawai.com after changes are posted constitutes your acceptance
                  of the updated Terms.
                </p>
                <p>
                  We encourage you to review these Terms periodically. You can always find the
                  current version at{' '}
                  <Link href="/terms" className="text-kawai-red hover:underline">
                    kawai.com/terms
                  </Link>
                  .
                </p>
              </Prose>
            </section>

            {/* Section: Contact */}
            <section id="contact" className="scroll-mt-8">
              <SectionHeading>Contact Us</SectionHeading>
              <div className="bg-white border border-kawai-neutral rounded-xl p-6 space-y-3 text-[15px] text-kawai-charcoal/80">
                <p className="font-semibold text-kawai-charcoal">
                  For questions about these Terms or to report a violation:
                </p>
                <p>
                  <span className="font-medium text-kawai-charcoal">Email: </span>
                  <a href="mailto:legal@kawai.com" className="text-kawai-red hover:underline">
                    legal@kawai.com
                  </a>
                </p>
                <p>
                  <span className="font-medium text-kawai-charcoal">Mail: </span>
                  Kawai America Corporation, Attn: Legal, 2055 East University Drive, Rancho Dominguez, CA 90220
                </p>
              </div>
            </section>

            {/* Footer note */}
            <div className="border-t border-kawai-neutral pt-8 text-sm text-kawai-charcoal/40">
              <p>
                These Terms apply to kawai.com and all dealer storefronts hosted on this domain.
                For privacy-related questions, see our{' '}
                <Link href="/privacy" className="text-kawai-red hover:underline">
                  Privacy Policy
                </Link>
                . For product questions, visit{' '}
                <Link href="/pianos" className="text-kawai-red hover:underline">
                  our piano catalog
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
