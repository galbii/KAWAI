import type { Metadata } from 'next'
import Link from 'next/link'
import { getStaticAlternates } from '@/lib/site-context'

export const metadata: Metadata = {
  title: 'Terms of Service | Kawai Pianos',
  description:
    'Read the Terms of Service for kawaius.com — the rules and conditions that govern your use of our website, products, and services.',
  alternates: getStaticAlternates('/terms'),
}

const EFFECTIVE_DATE = 'April 2, 2026'
const LAST_UPDATED = 'August 10, 2026'

const sections = [
  { id: 'agreement', label: 'Agreement to Terms' },
  { id: 'use-of-site', label: 'Use of This Site' },
  { id: 'products-pricing', label: 'Products & Pricing' },
  { id: 'purchases-checkout', label: 'Purchases & Checkout' },
  { id: 'shipping-delivery', label: 'Shipping & Delivery' },
  { id: 'returns-warranty', label: 'Returns & Warranty' },
  { id: 'dealer-storefronts', label: 'Dealer Storefronts' },
  { id: 'lead-forms', label: 'Forms & Communications' },
  { id: 'intellectual-property', label: 'Intellectual Property' },
  { id: 'copyright-dmca', label: 'Copyright Complaints (DMCA)' },
  { id: 'third-party-services', label: 'Third-Party Services' },
  { id: 'disclaimers', label: 'Disclaimers & Liability' },
  { id: 'governing-law', label: 'Governing Law' },
  { id: 'canada', label: 'Customers in Canada' },
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
              These Terms of Service govern your use of kawaius.com and ca.kawaius.com, operated by
              Kawai America Corporation. By accessing or using either site — including browsing our
              catalog, submitting a contact form, or purchasing a piano — you agree to these terms.
              If you don&apos;t agree, please don&apos;t use the site.
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
                  By using kawaius.com — including dealer storefronts hosted on our domain — you
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
                <p>You may use kawaius.com for lawful purposes only. You agree not to:</p>
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
                    body: 'Prices displayed on kawaius.com are in US dollars and are subject to change without notice. We reserve the right to correct pricing errors at any time. In the event a product is listed at an incorrect price, we may cancel or refuse any order placed at that price and notify you accordingly.',
                  },
                  {
                    heading: 'Availability',
                    body: 'Product availability is not guaranteed. We reserve the right to limit quantities or discontinue products at any time. If a product becomes unavailable after your order is placed, we will contact you with options.',
                  },
                  {
                    heading: 'Dealer pricing',
                    body: 'Independent authorized dealers may set their own prices. Prices advertised through dealer storefronts on this site are the responsibility of the individual dealer and may differ from kawaius.com direct pricing.',
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
                  ['Returns & warranty', 'See the Returns & Warranty section below for full details, including our 15-day return window.'],
                ].map(([label, desc]) => (
                  <div key={label} className="bg-white border border-kawai-neutral rounded-xl p-4">
                    <p className="font-semibold text-kawai-charcoal text-sm">{label}</p>
                    <p className="text-kawai-charcoal/70 text-[15px] leading-relaxed mt-1">{desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section: Shipping & Delivery */}
            <section id="shipping-delivery" className="scroll-mt-8">
              <SectionHeading>Shipping &amp; Delivery</SectionHeading>
              <Prose>
                <p>
                  For orders placed directly on this site, we ship in-stock items within{' '}
                  <strong>5–10 business days</strong> of order confirmation unless a different
                  timeframe is stated on the product page at the time you order. Acoustic pianos and
                  other large instruments ship by freight carrier, and the carrier will contact you
                  separately to schedule a delivery appointment after the instrument leaves our
                  warehouse.
                </p>
              </Prose>
              <div className="mt-4 bg-white border border-kawai-neutral rounded-xl p-5">
                <h3 className="font-semibold text-kawai-charcoal mb-1">If we can&apos;t ship on time</h3>
                <p className="text-kawai-charcoal/70 text-[15px] leading-relaxed">
                  If we are unable to ship your order within the stated timeframe, we will notify you,
                  provide a revised shipping date, and give you the option to cancel your order for a
                  full refund. If we cannot provide a revised date, or if you do not accept the
                  revised date, we will cancel the order and refund you in full.
                </p>
              </div>
              <Prose>
                <p className="mt-4">
                  Delivery timeframes are estimates and do not account for delays caused by the
                  carrier, weather, or other circumstances outside our control. Risk of loss passes
                  to you upon delivery.
                </p>
              </Prose>
            </section>

            {/* Section: Returns & Warranty */}
            <section id="returns-warranty" className="scroll-mt-8">
              <SectionHeading>Returns &amp; Warranty</SectionHeading>
              <Prose>
                <p>
                  Instruments purchased directly from this site may be returned within{' '}
                  <strong>15 days of delivery</strong>, subject to the conditions set out in our{' '}
                  <Link href="/return-policy" className="text-kawai-red hover:underline">
                    Return Policy
                  </Link>
                  , which is incorporated into these Terms. Instruments purchased from an authorized
                  dealer are subject to that dealer&apos;s return policy, not ours.
                </p>
                <p>
                  Every new Kawai instrument comes with a written manufacturer&apos;s warranty. You
                  can read the full warranty terms before you buy at{' '}
                  <Link href="/warranty" className="text-kawai-red hover:underline">
                    kawaius.com/warranty
                  </Link>{' '}
                  —{' '}
                  <Link href="/warranty/acoustic" className="text-kawai-red hover:underline">
                    acoustic
                  </Link>{' '}
                  and{' '}
                  <Link href="/warranty/digital" className="text-kawai-red hover:underline">
                    digital
                  </Link>{' '}
                  warranties are published separately. You may also request a free printed copy of
                  any warranty before purchase by writing to us at the address in the Contact
                  section below.
                </p>
              </Prose>
            </section>

            {/* Section: Dealer Storefronts */}
            <section id="dealer-storefronts" className="scroll-mt-8">
              <SectionHeading>Dealer Storefronts</SectionHeading>
              <Prose>
                <p>
                  kawaius.com hosts branded storefronts for authorized Kawai dealers (e.g.,{' '}
                  <code className="text-sm bg-kawai-pearl px-1.5 py-0.5 rounded">
                    kawaius.com/store/dealer-name
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
                  kawaius.com provides contact forms, newsletter signups, consultation booking,
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
                  All content on kawaius.com — including text, images, video, audio, product
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
                    'Linking to kawaius.com',
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

            {/* Section: Copyright Complaints (DMCA) */}
            <section id="copyright-dmca" className="scroll-mt-8">
              <SectionHeading>Copyright Complaints (DMCA)</SectionHeading>
              <Prose>
                <p>
                  This site hosts content supplied by authorized dealers, artists, and other third
                  parties. If you believe material on kawaius.com infringes your copyright, you may
                  send a notice to our designated copyright agent under the Digital Millennium
                  Copyright Act.
                </p>
                <p>Your notice must include all of the following:</p>
              </Prose>
              <div className="mt-4 bg-white border border-kawai-neutral rounded-xl divide-y divide-kawai-neutral">
                {[
                  'A physical or electronic signature of the copyright owner or a person authorized to act on their behalf',
                  'Identification of the copyrighted work you claim has been infringed',
                  'Identification of the material you claim is infringing, with enough detail for us to locate it (including the URL)',
                  'Your name, mailing address, telephone number, and email address',
                  'A statement that you have a good-faith belief the use is not authorized by the copyright owner, its agent, or the law',
                  'A statement, under penalty of perjury, that the information in your notice is accurate and that you are the copyright owner or authorized to act on their behalf',
                ].map((item) => (
                  <div key={item} className="flex gap-3 p-5 text-[15px] text-kawai-charcoal/80 leading-relaxed">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-kawai-red shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
              <div className="mt-4 bg-white border border-kawai-neutral rounded-xl p-6 space-y-2 text-[15px] text-kawai-charcoal/80">
                <p className="font-semibold text-kawai-charcoal">Designated Copyright Agent</p>
                <p>
                  <span className="font-medium text-kawai-charcoal">Email: </span>
                  <a href="mailto:copyright@kawaius.com" className="text-kawai-red hover:underline">
                    copyright@kawaius.com
                  </a>
                </p>
                <p>
                  <span className="font-medium text-kawai-charcoal">Mail: </span>
                  Kawai America Corporation, Attn: Copyright Agent, 2055 East University Drive,
                  Rancho Dominguez, CA 90220
                </p>
              </div>
              <Prose>
                <p className="mt-4">
                  We will respond to properly submitted notices by removing or disabling access to
                  the material in question. If you believe your material was removed in error, you
                  may submit a counter-notice to the same address. We may terminate the accounts or
                  storefronts of repeat infringers.
                </p>
              </Prose>
            </section>

            {/* Section: Third-Party Services */}
            <section id="third-party-services" className="scroll-mt-8">
              <SectionHeading>Third-Party Services &amp; Embeds</SectionHeading>
              <Prose>
                <p>
                  kawaius.com integrates with and embeds content from third-party services. These
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
                  Links to external websites from kawaius.com are provided for convenience only.
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
                  kawaius.com is provided on an &quot;as is&quot; and &quot;as available&quot; basis
                  without warranties of any kind — express, implied, or statutory — including but
                  not limited to implied warranties of merchantability, fitness for a particular
                  purpose, or non-infringement. We do not warrant that the site will be
                  uninterrupted, error-free, or free of viruses or other harmful components.
                </p>
                <p>
                  <strong>
                    This disclaimer applies to the website and its content — not to the instruments
                    we sell.
                  </strong>{' '}
                  Kawai instruments are covered by a written manufacturer&apos;s warranty, and
                  nothing in these Terms limits, modifies, or disclaims that warranty or any implied
                  warranty that accompanies it.
                </p>
                <p>
                  Some states and provinces do not allow the exclusion of implied warranties or the
                  limitation of incidental or consequential damages, so some of the exclusions and
                  limitations in this section may not apply to you. In that case, our liability is
                  limited to the minimum extent permitted by applicable law. This section gives you
                  specific legal rights, and you may also have other rights that vary by
                  jurisdiction.
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
                    these Terms or your use of kawaius.com shall be subject to the exclusive
                    jurisdiction of the state and federal courts located in Los Angeles County,
                    California.
                  </p>
                </div>
                <div className="bg-white border border-kawai-neutral rounded-xl p-5">
                  <h3 className="font-semibold text-kawai-charcoal mb-1">Informal resolution</h3>
                  <p className="text-kawai-charcoal/70 text-[15px] leading-relaxed">
                    Before filing any formal legal claim, you agree to contact us at{' '}
                    <a href="mailto:contact@kawaius.com" className="text-kawai-red hover:underline">
                      contact@kawaius.com
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

              {/*
                ───────────────────────────────────────────────────────────────────
                DRAFT — BINDING ARBITRATION & CLASS ACTION WAIVER — NOT YET LIVE
                ───────────────────────────────────────────────────────────────────
                Deliberately commented out pending outside-counsel review. Do NOT
                uncomment without sign-off.

                Why this matters: this is the primary structural defense against
                privacy class actions (CIPA / wiretap-theory pixel claims), which
                target California retail sites heavily. The site runs the Meta
                Pixel on an opt-out basis for US visitors (see
                src/components/CookieConsentBanner.tsx), which is the exact fact
                pattern those suits plead.

                IMPORTANT — this clause is close to worthless while the Terms are
                browsewrap (footer link only). Enforceability depends on assent.
                Before going live, pair it with clickwrap: a checkbox at checkout
                and "By submitting, you agree to the Terms" on every lead form.
                Right now only ContactFormWithUTM.tsx carries that line.

                Counsel should confirm: the 30-day opt-out mechanism (usually what
                keeps these enforceable), the arbitration provider and rules, who
                pays fees, and the small-claims carve-out.

                <div className="mt-4 space-y-4">
                  <div className="bg-white border border-kawai-neutral rounded-xl p-5">
                    <h3 className="font-semibold text-kawai-charcoal mb-1">
                      Binding arbitration
                    </h3>
                    <p className="text-kawai-charcoal/70 text-[15px] leading-relaxed">
                      Except as set out below, you and Kawai agree that any dispute, claim, or
                      controversy arising out of or relating to these Terms, your use of this site,
                      or any product purchased through it will be resolved by binding individual
                      arbitration administered by [PROVIDER] under its consumer arbitration rules,
                      rather than in court. The arbitrator, and not any federal, state, or local
                      court, has exclusive authority to resolve any dispute about the
                      interpretation, applicability, enforceability, or formation of this
                      agreement to arbitrate. Judgment on the award may be entered in any court
                      with jurisdiction.
                    </p>
                  </div>
                  <div className="bg-white border border-kawai-neutral rounded-xl p-5">
                    <h3 className="font-semibold text-kawai-charcoal mb-1">
                      Class action waiver
                    </h3>
                    <p className="text-kawai-charcoal/70 text-[15px] leading-relaxed">
                      You and Kawai agree that each may bring claims against the other only in an
                      individual capacity, and not as a plaintiff or class member in any purported
                      class, collective, consolidated, or representative proceeding. The arbitrator
                      may not consolidate more than one person&apos;s claims and may not preside
                      over any form of class or representative proceeding. If this class action
                      waiver is found to be unenforceable as to a particular claim, that claim —
                      and only that claim — will be severed and brought in court.
                    </p>
                  </div>
                  <div className="bg-white border border-kawai-neutral rounded-xl p-5">
                    <h3 className="font-semibold text-kawai-charcoal mb-1">
                      Your right to opt out
                    </h3>
                    <p className="text-kawai-charcoal/70 text-[15px] leading-relaxed">
                      You may opt out of this arbitration agreement within 30 days of first
                      accepting these Terms by sending written notice to Kawai America
                      Corporation, Attn: Legal, 2055 East University Drive, Rancho Dominguez, CA
                      90220, or by emailing legal@kawaius.com with the subject line
                      &quot;Arbitration Opt-Out.&quot; Your notice must include your name, address,
                      and a clear statement that you do not wish to resolve disputes through
                      arbitration. Opting out will not affect any other part of these Terms, and
                      we will not treat it as a reason to refuse you service.
                    </p>
                  </div>
                  <div className="bg-white border border-kawai-neutral rounded-xl p-5">
                    <h3 className="font-semibold text-kawai-charcoal mb-1">
                      Exceptions
                    </h3>
                    <p className="text-kawai-charcoal/70 text-[15px] leading-relaxed">
                      Either party may bring an individual claim in small claims court, and either
                      party may seek injunctive relief in court to protect its intellectual
                      property rights. Nothing in this section prevents you from reporting a
                      concern to any government agency, and this arbitration agreement does not
                      apply where it is prohibited by applicable law — including, without
                      limitation, for consumers resident in Canada, whose rights are described in
                      the Customers in Canada section below.
                    </p>
                  </div>
                </div>
                ───────────────────────────────────────────────────────────────────
              */}
            </section>

            {/* Section: Customers in Canada */}
            <section id="canada" className="scroll-mt-8">
              <SectionHeading>Customers in Canada</SectionHeading>
              <Prose>
                <p>
                  We operate a Canadian version of this site at{' '}
                  <strong>ca.kawaius.com</strong>, where prices are shown in Canadian dollars and
                  checkout is handled through our Canadian store. These Terms apply there as well,
                  with the following differences.
                </p>
              </Prose>
              <div className="mt-4 space-y-4">
                {[
                  {
                    heading: 'Your consumer rights are not waived',
                    body: 'Nothing in these Terms limits any right or remedy you have under the consumer protection legislation of your province or territory. Where those laws conflict with these Terms — including the governing law and jurisdiction provisions above — the legislation of your province or territory prevails, and you may bring a claim in the courts of your own province.',
                  },
                  {
                    heading: 'Marketing emails (CASL)',
                    body: 'We send commercial electronic messages to Canadian recipients only with your consent, or where we have implied consent because of an existing business relationship or a recent inquiry. Every message identifies Kawai America Corporation, includes our contact information, and contains a working unsubscribe link that we honor promptly.',
                  },
                  {
                    heading: 'Privacy',
                    body: 'Personal information collected from Canadian visitors is handled in accordance with PIPEDA and, for Quebec residents, Quebec\'s Law 25. See our Privacy Policy for your access, correction, and withdrawal-of-consent rights.',
                  },
                  {
                    heading: 'Pricing, duties, and taxes',
                    body: 'Prices on ca.kawaius.com are in Canadian dollars. Applicable federal and provincial taxes are calculated at checkout. Products ordered from the Canadian store ship within Canada.',
                  },
                ].map(({ heading, body }) => (
                  <div key={heading} className="bg-white border border-kawai-neutral rounded-xl p-5">
                    <h3 className="font-semibold text-kawai-charcoal mb-1">{heading}</h3>
                    <p className="text-kawai-charcoal/70 text-[15px] leading-relaxed">{body}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section: Changes */}
            <section id="changes" className="scroll-mt-8">
              <SectionHeading>Changes to These Terms</SectionHeading>
              <Prose>
                <p>
                  We may update these Terms from time to time. When we do, we will update the
                  &quot;Last Updated&quot; date at the top of this page. If we make a material
                  change, we will give reasonable advance notice — by posting a notice on this site
                  and, where we have your email address and the change affects an order you have
                  placed, by email. Changes are not retroactive and do not apply to any order placed
                  before the change took effect. Continued use of the site after changes are posted
                  constitutes your acceptance of the updated Terms.
                </p>
                <p>
                  We encourage you to review these Terms periodically. You can always find the
                  current version at{' '}
                  <Link href="/terms" className="text-kawai-red hover:underline">
                    kawaius.com/terms
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
                  <a href="mailto:contact@kawaius.com" className="text-kawai-red hover:underline">
                    contact@kawaius.com
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
                These Terms apply to kawaius.com and ca.kawaius.com, including all dealer
                storefronts hosted on those domains. For privacy-related questions, see our{' '}
                <Link href="/privacy" className="text-kawai-red hover:underline">
                  Privacy Policy
                </Link>
                . For returns, see our{' '}
                <Link href="/return-policy" className="text-kawai-red hover:underline">
                  Return Policy
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
