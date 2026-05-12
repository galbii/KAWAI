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
import { TallyEmbed } from '@/components/careers/TallyEmbed'

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

      {/* 6. Apply */}
      <section id="apply" className="bg-kawai-pearl border-t border-kawai-neutral/50 py-28 md:py-36 px-8 md:px-16 lg:px-24">
        <div className="max-w-screen-xl mx-auto">
          <div className="mb-16">
            <div className="w-10 h-px bg-kawai-red mb-8" />
            <h2 className="text-[2.25rem] md:text-[2.75rem] font-[family-name:var(--font-brand-luxury)] text-kawai-black leading-tight mb-4">
              Apply
            </h2>
            <p className="text-sm text-kawai-charcoal/50 font-[family-name:var(--font-brand-sans)] max-w-sm leading-relaxed">
              If you do not see an open role that fits, you are welcome to introduce yourself. We review every application.
            </p>
          </div>
          <TallyEmbed />
        </div>
      </section>

    </main>
  )
}
