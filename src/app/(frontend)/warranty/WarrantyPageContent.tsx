'use client'

import { useState } from 'react'
import Link from 'next/link'
import { WarrantyTabPills, WarrantyTabPanel, tabs } from './WarrantyTabs'

const sections = [
  { id: 'coverage', label: 'Coverage by Series' },
  { id: 'covered', label: "What's Covered" },
  { id: 'not-covered', label: "What's Not Covered" },
  { id: 'service', label: 'Service & Claims' },
  { id: 'register', label: 'Register Your Instrument' },
]

export default function WarrantyPageContent() {
  const [activeTab, setActiveTab] = useState<string>(tabs[0]!.id)

  return (
    <>
      {/* Series selection — full-width sticky band, above the grid */}
      <div
        className="sticky z-10 bg-kawai-pearl/95 backdrop-blur-sm border-b border-kawai-neutral"
        style={{ top: 'var(--header-bottom, 80px)' }}
      >
        <div className="container mx-auto px-6 max-w-4xl py-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-kawai-charcoal/50 mb-2">
            Select your series
          </p>
          <WarrantyTabPills activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>

    <div className="container mx-auto px-6 max-w-4xl py-12 lg:py-16">
      <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-12">

        {/* Sticky table of contents — desktop only */}
        <aside className="hidden lg:block">
          <div
            className="sticky bg-white border border-kawai-neutral rounded-xl p-5"
            style={{ top: 'calc(var(--header-bottom, 80px) + 6rem)' }}
          >
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

        {/* Warranty content */}
        <article className="prose prose-kawai max-w-none space-y-12">

          {/* Intro */}
          <div className="bg-white border border-kawai-neutral rounded-xl p-6 text-kawai-charcoal/80 leading-relaxed">
            Kawai America Corporation backs every instrument with a limited warranty covering
            defects in materials and workmanship. Select your product series above, or read on for
            full coverage details.
          </div>

          {/* Section: Coverage by Series */}
          <section id="coverage" className="scroll-mt-[11rem]">
            <SectionHeading>Coverage by Series</SectionHeading>
            <WarrantyTabPanel activeTab={activeTab} />
          </section>

          {/* Section: What's Covered */}
          <section id="covered" className="scroll-mt-[11rem]">
            <SectionHeading>What&apos;s Covered</SectionHeading>
            <div className="bg-white border border-kawai-neutral rounded-xl divide-y divide-kawai-neutral">
              {[
                'Manufacturing defects in materials and workmanship',
                'Electronic components and circuit boards',
                'Key action and touch response mechanisms',
                'Speaker and amplification systems',
                'Cabinet and structural components',
                'Power supply components',
                'Return shipping to your location (USA/Canada) when repairs are covered',
              ].map((item) => (
                <div
                  key={item}
                  className="flex gap-3 p-5 text-[15px] text-kawai-charcoal/80 leading-relaxed"
                >
                  <svg
                    className="w-5 h-5 text-kawai-red shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {item}
                </div>
              ))}
            </div>
          </section>

          {/* Section: What's Not Covered */}
          <section id="not-covered" className="scroll-mt-[11rem]">
            <SectionHeading>What&apos;s Not Covered</SectionHeading>
            <div className="bg-white border border-kawai-neutral rounded-xl divide-y divide-kawai-neutral">
              {[
                'Damage from accident, negligence, misuse, abuse, or improper installation',
                'Shipping damage — claims must be filed directly with the carrier',
                'Repair or attempted repair by anyone other than Kawai or an authorized service provider',
                'Units with altered, defaced, or removed serial numbers',
                'Normal wear and tear or periodic maintenance',
                'Deterioration from perspiration, corrosive atmosphere, extreme temperature, or humidity',
                'Action noise caused by normal wear and tear',
                'Damage from power line surge, electrical abnormalities, lightning, or acts of God',
                'RFI/EMI interference from improper grounding or use of uncertified equipment',
                'Any alteration, erasure, or forgery of proof-of-purchase documents',
              ].map((item) => (
                <div
                  key={item}
                  className="flex gap-3 p-5 text-[15px] text-kawai-charcoal/80 leading-relaxed"
                >
                  <svg
                    className="w-5 h-5 text-kawai-charcoal/30 shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  {item}
                </div>
              ))}
            </div>
          </section>

          {/* Section: Service & Claims */}
          <section id="service" className="scroll-mt-[11rem]">
            <SectionHeading>Service &amp; Claims</SectionHeading>
            <div className="text-[15px] text-kawai-charcoal/80 leading-relaxed space-y-3">
              <p>
                Warranty service is performed exclusively through Kawai&apos;s Authorized Service
                Provider network. To initiate a warranty claim, contact your nearest authorized
                dealer or reach Kawai America Corporation directly.
              </p>
            </div>
            <div className="mt-5 bg-white border border-kawai-neutral rounded-xl p-6 space-y-3 text-[15px] text-kawai-charcoal/80">
              <p className="font-semibold text-kawai-charcoal">Kawai America Corporation</p>
              <p>Technical Services Division</p>
              <p>
                <span className="font-medium text-kawai-charcoal">Phone: </span>
                <a href="tel:+18004212177" className="text-kawai-red hover:underline">
                  1-800-421-2177
                </a>
              </p>
              <p>
                <span className="font-medium text-kawai-charcoal">Address: </span>
                2055 East University Drive, Rancho Dominguez, CA 90220
              </p>
              <p className="text-[13px] text-kawai-charcoal/50 pt-1">
                Do not return any product to the above address without a written Return
                Authorization issued in advance by Kawai.
              </p>
            </div>
          </section>

          {/* Section: Register Your Instrument */}
          <section id="register" className="scroll-mt-[11rem]">
            <SectionHeading>Register Your Instrument</SectionHeading>
            <div className="text-[15px] text-kawai-charcoal/80 leading-relaxed space-y-3">
              <p>
                Activate your warranty by registering your instrument. Registration confirms your
                purchase date and unlocks exclusive owner benefits including free learning platform
                access.
              </p>
            </div>
            <div className="mt-5 bg-white border border-kawai-neutral rounded-xl p-6">
              <p className="text-kawai-charcoal/70 text-[15px] leading-relaxed mb-5">
                Registration takes less than two minutes and ensures your coverage is on file if
                you ever need to make a claim.
              </p>
              <Link
                href="/warranty-registration"
                className="inline-flex items-center gap-2 bg-kawai-red hover:bg-kawai-red-700 !text-white font-semibold px-7 py-3 rounded-full transition-colors duration-200 text-sm no-underline"
              >
                Register Now →
              </Link>
            </div>
          </section>

          {/* Footer note */}
          <div className="border-t border-kawai-neutral pt-8 text-sm text-kawai-charcoal/40">
            <p>
              This warranty applies to the original owner only and is not transferable. It covers
              instruments purchased through authorized Kawai dealers in the United States and Canada
              and used exclusively in those territories. For questions about your instrument, visit{' '}
              <Link href="/pianos" className="text-kawai-red hover:underline">
                our piano catalog
              </Link>{' '}
              or{' '}
              <Link href="/find-a-dealer" className="text-kawai-red hover:underline">
                find an authorized dealer
              </Link>
              .
            </p>
          </div>

        </article>
      </div>
    </div>
    </>
  )
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl font-bold text-kawai-charcoal mb-5 pb-3 border-b border-kawai-neutral">
      {children}
    </h2>
  )
}
