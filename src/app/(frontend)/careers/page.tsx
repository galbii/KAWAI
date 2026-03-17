import { Metadata } from 'next'
import { getOpenJobs } from '@/lib/payload/queries'
import { CareersHero } from '@/components/careers/CareersHero'
import { JobGrid } from '@/components/careers/JobGrid'
import { LifeAtKawai } from '@/components/careers/LifeAtKawai'
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
      <CareersHero />
      <LifeAtKawai />
      <JobGrid jobs={openJobs} />

      {/* CTA */}
      <section className="px-8 md:px-16 lg:px-24 py-20 border-t border-kawai-neutral/60 bg-white">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h3 className="text-2xl md:text-3xl font-[family-name:var(--font-brand-luxury)] text-kawai-black mb-2">
              Don&apos;t see the right role?
            </h3>
            <p className="text-sm text-kawai-charcoal/60 font-[family-name:var(--font-brand-sans)]">
              We&apos;re always interested in exceptional people.
            </p>
          </div>
          <a
            href="mailto:careers@kawaipianos.com"
            className="text-sm uppercase tracking-[0.14em] font-[family-name:var(--font-brand-sans)] text-kawai-charcoal border-b border-kawai-red pb-0.5 hover:text-kawai-red transition-colors duration-200 whitespace-nowrap"
          >
            Get in Touch →
          </a>
        </div>
      </section>
    </main>
  )
}
