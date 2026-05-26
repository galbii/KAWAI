import type { Metadata } from 'next'
import Link from 'next/link'
import { getSiteAlternates } from '@/lib/site-context'
import { HubSpotEmbed } from '@/components/forms/HubSpotEmbed'

export const revalidate = 86400

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaius.com'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Submit a Support Request | Kawai Technical Support',
    description:
      "Can't find the answer you need? Submit a support request and the Kawai technical team will get back to you as soon as possible.",
    alternates: {
      canonical: '/technical-support-division/request',
      languages: getSiteAlternates('/technical-support-division/request'),
    },
  }
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Support Center',
          item: `${siteUrl}/technical-support-division`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Submit a Request',
          item: `${siteUrl}/technical-support-division/request`,
        },
      ],
    },
    {
      '@type': 'ContactPage',
      name: 'Kawai Technical Support Request',
      url: `${siteUrl}/technical-support-division/request`,
      description: 'Submit a support request to the Kawai technical support team.',
    },
  ],
}

export default function SupportRequestPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-white">
        {/* Hero */}
        <section className="relative bg-white pt-40 pb-20 md:pt-52 md:pb-28 overflow-hidden border-b border-black/[0.06]">
          {/* Ghost backdrop */}
          <div aria-hidden className="absolute inset-0 flex items-end justify-end pointer-events-none select-none overflow-hidden">
            <span className="text-[22vw] font-bold leading-none text-kawai-black/[0.03] font-[family-name:var(--font-brand-sans)] translate-y-[15%] translate-x-[5%]">
              TSD
            </span>
          </div>

          <div className="relative max-w-screen-2xl mx-auto px-10 md:px-16 xl:px-24">
            {/* Breadcrumb back link */}
            <div className="flex items-center gap-4 mb-12">
              <div className="h-px w-10 bg-kawai-red" />
              <Link
                href="/technical-support-division"
                className="inline-flex items-center gap-2 text-kawai-red hover:text-kawai-red/70 transition-colors duration-200 text-[10px] tracking-[0.5em] uppercase font-semibold font-[family-name:var(--font-brand-sans)]"
              >
                Support Center
              </Link>
              <span className="text-kawai-black/20 text-[10px] font-[family-name:var(--font-brand-sans)]">/</span>
              <p className="text-[10px] text-kawai-black/40 tracking-[0.5em] uppercase font-semibold font-[family-name:var(--font-brand-sans)]">
                Submit a Request
              </p>
            </div>

            <h1 className="font-[family-name:var(--font-brand-serif)] font-light text-7xl md:text-8xl lg:text-[7rem] xl:text-[8.5rem] text-kawai-black leading-[0.92] tracking-tight mb-8 max-w-5xl">
              Contact Support
            </h1>
            <p className="text-kawai-black/50 text-lg font-[family-name:var(--font-brand-sans)] leading-relaxed max-w-xl">
              Submit a support request and our team will get back to you as soon as possible.
              Most requests are answered within one business day.
            </p>
          </div>
        </section>

        {/* Form + sidebar */}
        <section className="bg-white py-24 md:py-32">
          <div className="max-w-screen-2xl mx-auto px-10 md:px-20 xl:px-28">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 xl:gap-24 items-start">

              {/* Left — sticky sidebar */}
              <div className="lg:sticky lg:top-44 space-y-10">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-px w-8 bg-kawai-red" />
                    <p className="text-[10px] text-kawai-red tracking-[0.5em] uppercase font-semibold font-[family-name:var(--font-brand-sans)]">
                      Get in Touch
                    </p>
                  </div>
                  <h2 className="font-[family-name:var(--font-brand-serif)] font-light text-4xl md:text-5xl text-kawai-black leading-[0.95] tracking-tight">
                    Still have<br />questions?
                  </h2>
                  <p className="mt-5 text-kawai-black/55 text-sm font-[family-name:var(--font-brand-sans)] leading-relaxed max-w-xs">
                    Describe your issue as clearly as possible — include your piano model, serial number, and any steps you&apos;ve already tried.
                  </p>
                </div>

                {/* Quick links */}
                <div className="pt-8 border-t border-kawai-neutral/60">
                  <p className="text-[9px] text-kawai-black/30 tracking-[0.4em] uppercase font-[family-name:var(--font-brand-sans)] mb-5">
                    Before you submit
                  </p>
                  <ul className="space-y-3">
                    <li>
                      <Link
                        href="/technical-support-division"
                        className="inline-flex items-center gap-2 text-kawai-black/60 hover:text-kawai-black text-sm font-[family-name:var(--font-brand-sans)] transition-colors duration-200 group"
                      >
                        <span className="w-1 h-1 rounded-full bg-kawai-red/40 group-hover:bg-kawai-red transition-colors duration-200 flex-shrink-0" />
                        Browse the Support Center
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/technical-support-division/owner-hub"
                        className="inline-flex items-center gap-2 text-kawai-black/60 hover:text-kawai-black text-sm font-[family-name:var(--font-brand-sans)] transition-colors duration-200 group"
                      >
                        <span className="w-1 h-1 rounded-full bg-kawai-red/40 group-hover:bg-kawai-red transition-colors duration-200 flex-shrink-0" />
                        Owner Hub — setup &amp; care
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/technical-support-division/technician-resources"
                        className="inline-flex items-center gap-2 text-kawai-black/60 hover:text-kawai-black text-sm font-[family-name:var(--font-brand-sans)] transition-colors duration-200 group"
                      >
                        <span className="w-1 h-1 rounded-full bg-kawai-red/40 group-hover:bg-kawai-red transition-colors duration-200 flex-shrink-0" />
                        Technician Resources
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Right — HubSpot form (auto-resizing) */}
              <div>
                <HubSpotEmbed
                  src="https://share.hsforms.com/22f9oRT3pQ96WhrVrK5C4jwd39hb"
                  title="Kawai Technical Support Request"
                  className="w-full border-0 block"
                  initialHeight={1100}
                />
              </div>

            </div>
          </div>
        </section>
      </div>
    </>
  )
}
