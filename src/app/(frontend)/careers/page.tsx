import { Metadata } from 'next'
import { getOpenJobs } from '@/lib/payload/queries'
import { CareersHero } from '@/components/careers/CareersHero'
import { MissionBanner } from '@/components/careers/MissionBanner'
import { LifeAtKawai } from '@/components/careers/LifeAtKawai'
import { BenefitsSection } from '@/components/careers/BenefitsSection'
import { JobGrid } from '@/components/careers/JobGrid'
import type { JobListingItem } from '@/components/careers/JobListingsPanel'
import { extractTextFromRichText } from '@/lib/utils'
import { getCMSPageMetadata } from '@/lib/seo/cms-page-metadata'

export const revalidate = 3600

const fallbackMetadata: Metadata = {
  title: 'Careers | KAWAI Piano',
  description: 'Join the KAWAI team. View open positions in sales, technology, service, and more.',
}

export async function generateMetadata(): Promise<Metadata> {
  return getCMSPageMetadata('careers', fallbackMetadata)
}

function toJobListingItem(doc: {
  id: string | number
  title?: string | null
  slug?: string | null
  department?: string | null
  location?: string | null
  type?: string | null
  postedAt?: string | null
  description?: unknown
}): JobListingItem {
  const rawText = doc.description ? extractTextFromRichText(doc.description as any) : null
  const descriptionSnippet = rawText ? rawText.substring(0, 160).trim() + (rawText.length > 160 ? '…' : '') : null
  return {
    id: String(doc.id),
    title: doc.title ?? '',
    slug: doc.slug ?? '',
    ...(doc.department != null ? { department: doc.department } : {}),
    ...(doc.location != null ? { location: doc.location } : {}),
    ...(doc.type != null ? { type: doc.type } : {}),
    ...(doc.postedAt != null ? { postedAt: doc.postedAt } : {}),
    ...(descriptionSnippet != null ? { descriptionSnippet } : {}),
  }
}

export default async function CareersPage() {
  const openJobDocs = await getOpenJobs()
  const openJobs: JobListingItem[] = openJobDocs.map(toJobListingItem)

  return (
    <main className="bg-kawai-pearl min-h-screen">
      {/* 1. Full-screen editorial hero */}
      <CareersHero />

      {/* 2. Mission statement — red banner */}
      <MissionBanner />

      {/* 3. Values pillars + culture quote */}
      <LifeAtKawai />

      {/* 4. Benefits grid */}
      <BenefitsSection />

      {/* 5. Open positions */}
      <JobGrid jobs={openJobs} />

      {/* 6. CTA */}
      <section className="px-8 md:px-16 lg:px-24 py-20 border-t border-kawai-neutral/60 bg-white">
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="w-8 h-px bg-kawai-red mb-6" />
            <h3 className="text-2xl md:text-3xl font-[family-name:var(--font-brand-luxury)] text-kawai-black mb-2">
              Don&apos;t see the right role?
            </h3>
            <p className="text-sm text-kawai-charcoal/50 font-[family-name:var(--font-brand-sans)]">
              We&apos;re always interested in exceptional people. Reach out — we read every note.
            </p>
          </div>
          <a
            href="mailto:careers@kawaipianos.com"
            className="flex-shrink-0 inline-flex items-center gap-3 px-8 py-3.5 bg-kawai-black text-white text-sm font-medium uppercase tracking-[0.1em] font-[family-name:var(--font-brand-sans)] hover:bg-kawai-red transition-colors duration-200 self-start md:self-auto"
          >
            Get in Touch
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
              <path
                d="M2.5 7.5h10M8 3l4.5 4.5L8 12"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </section>
    </main>
  )
}
