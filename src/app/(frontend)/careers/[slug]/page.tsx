import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { getJobBySlug, getAllJobSlugs, getRecentJobs } from '@/lib/payload/queries'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { JobDetailHero } from '@/components/careers/JobDetailHero'
import { JobDetailSidebar } from '@/components/careers/JobDetailSidebar'
import { JobDetailFooter } from '@/components/careers/JobDetailFooter'
import { ApplicationForm } from '@/components/careers/ApplicationForm'
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
    <main className="bg-kawai-pearl min-h-screen pb-24 lg:pb-0">
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

      {/* Apply form — inline, scroll target for the Apply Now buttons */}
      <section
        id="apply"
        className="relative bg-kawai-pearl border-t border-kawai-neutral/50 scroll-mt-24"
      >
        <div
          aria-hidden
          className="absolute pointer-events-none inset-0 z-0"
          style={{
            background:
              'radial-gradient(ellipse 55% 60% at 20% 30%, rgba(225,25,34,0.04) 0%, transparent 60%)',
          }}
        />
        <div className="relative z-10 px-8 md:px-16 lg:px-24 py-16 md:py-24">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-6 justify-center">
              <span aria-hidden className="w-10 h-px bg-kawai-red" />
              <span className="text-[10px] uppercase tracking-[0.22em] text-kawai-red font-[family-name:var(--font-brand-sans)]">
                Apply
              </span>
              <span aria-hidden className="w-10 h-px bg-kawai-red" />
            </div>
            <h2 className="text-center text-3xl md:text-[2.5rem] font-[family-name:var(--font-brand-luxury)] text-kawai-black leading-tight mb-3">
              Apply for this role
            </h2>
            <p className="text-center text-kawai-charcoal/70 font-[family-name:var(--font-brand-sans)] leading-relaxed mb-12">
              Tell us a little about yourself. We reply to every applicant within ~5 business days.
            </p>
            <div className="bg-white/80 backdrop-blur-md border border-kawai-neutral/40 rounded-2xl shadow-brand-subtle p-6 md:p-10">
              <ApplicationForm jobId={String(job.id)} jobTitle={job.title ?? ''} />
            </div>
          </div>
        </div>
      </section>

      <JobDetailFooter />

      {/* Persistent mobile apply CTA — scrolls to #apply */}
      <Suspense fallback={null}>
        <MobileApplyBar jobTitle={job.title ?? ''} />
      </Suspense>
    </main>
  )
}
