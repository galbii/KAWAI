import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getJobBySlug, getAllJobSlugs, getRecentJobs } from '@/lib/payload/queries'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { JobDetailHero } from '@/components/careers/JobDetailHero'
import { JobDetailSidebar } from '@/components/careers/JobDetailSidebar'
import { JobDetailFooter } from '@/components/careers/JobDetailFooter'
import { MobileApplyBar } from '@/components/careers/MobileApplyBar'

export const revalidate = 3600

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const jobs = await getAllJobSlugs()
  return jobs.map((j) => ({ slug: j.slug ?? '' })).filter((j) => j.slug !== '')
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params
  const job = await getJobBySlug(slug)
  if (!job) return { title: 'Position Not Found | KAWAI' }
  return {
    title: `${job.title} | Careers at KAWAI`,
    description: `${job.title} - ${job.location ?? 'KAWAI Piano'}. Apply now.`,
  }
}

export default async function JobDetailPage(props: Props) {
  const { slug } = await props.params
  const job = await getJobBySlug(slug)
  if (!job) notFound()

  const recent = await getRecentJobs(6)
  const otherJobs = recent
    .filter((j) => j.slug !== slug)
    .slice(0, 4)
    .map((j) => ({
      id: String(j.id),
      title: j.title ?? '',
      slug: j.slug ?? '',
      department: j.department ?? null,
    }))

  return (
    <div className="bg-kawai-pearl min-h-screen pb-24 lg:pb-0">
      <JobDetailHero
        title={job.title ?? ''}
        department={job.department ?? null}
        location={job.location ?? null}
        type={job.type ?? null}
        postedAt={job.postedAt ?? null}
      />

      {/* Body — two columns on lg+, single column on mobile */}
      <section className="relative px-8 md:px-16 lg:px-24 pt-14 md:pt-20 pb-20 md:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Description */}
          <article className="lg:col-span-7 xl:col-span-8 min-w-0">
            {job.description && (
              <div
                className="
                  prose prose-lg max-w-none
                  text-kawai-charcoal
                  font-[family-name:var(--font-brand-sans)]
                  prose-p:leading-[1.75] prose-p:text-[16.5px]
                  prose-headings:font-[family-name:var(--font-brand-luxury)]
                  prose-headings:text-kawai-black
                  prose-headings:tracking-tight
                  prose-h2:text-[1.75rem] md:prose-h2:text-[2rem]
                  prose-h2:leading-tight
                  prose-h2:mt-14 prose-h2:mb-5
                  prose-h2:pl-5 prose-h2:border-l-2 prose-h2:border-kawai-red
                  prose-h3:text-xl md:prose-h3:text-[1.35rem]
                  prose-h3:mt-10 prose-h3:mb-3
                  prose-h4:text-base prose-h4:uppercase prose-h4:tracking-[0.16em]
                  prose-h4:text-kawai-charcoal prose-h4:mt-8 prose-h4:mb-2
                  prose-strong:text-kawai-black
                  prose-a:text-kawai-red prose-a:no-underline hover:prose-a:underline
                  prose-ul:my-5 prose-ol:my-5
                  prose-li:my-1.5 prose-li:text-[16.5px]
                  prose-li:marker:text-kawai-red
                  prose-blockquote:border-l-2 prose-blockquote:border-kawai-red
                  prose-blockquote:not-italic prose-blockquote:text-kawai-black
                  prose-blockquote:font-[family-name:var(--font-brand-luxury)]
                  prose-blockquote:text-xl prose-blockquote:leading-snug
                "
              >
                <RichText data={job.description} />
              </div>
            )}
            {/* Apply Now buttons scroll here — the end of the description, where the editor
                will have written the application instructions (email, URL, etc.). */}
            <div id="apply" className="scroll-mt-[40vh]" aria-hidden />
          </article>

          {/* Sidebar */}
          <div className="lg:col-span-5 xl:col-span-4">
            <JobDetailSidebar
              job={{
                department: job.department ?? null,
                location: job.location ?? null,
                type: job.type ?? null,
                postedAt: job.postedAt ?? null,
              }}
              otherJobs={otherJobs}
            />
          </div>
        </div>
      </section>

      <JobDetailFooter />

      {/* Persistent mobile apply CTA — scrolls to #apply */}
      <MobileApplyBar jobTitle={job.title ?? ''} />
    </div>
  )
}
