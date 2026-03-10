import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getJobBySlug, getAllJobSlugs } from '@/lib/payload/queries'
import { ApplicationForm } from '@/components/careers'
import { RichText } from '@payloadcms/richtext-lexical/react'

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

  return (
    <main className="bg-kawai-pearl min-h-screen">
      {/* Header */}
      <div className="px-8 md:px-16 lg:px-24 pt-16 pb-12 border-b border-kawai-neutral/60">
        <a
          href="/careers"
          className="text-[10px] uppercase tracking-[0.18em] text-kawai-charcoal/40 hover:text-kawai-charcoal transition-colors font-[family-name:var(--font-brand-sans)] block mb-8"
        >
          ← Careers
        </a>
        {job.department && (
          <span className="text-[10px] uppercase tracking-[0.2em] text-kawai-red font-[family-name:var(--font-brand-sans)] block mb-3">
            {job.department}
          </span>
        )}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-[family-name:var(--font-brand-luxury)] text-kawai-black leading-tight mb-8">
          {job.title}
        </h1>
        <div className="flex flex-wrap gap-8 text-[11px] uppercase tracking-[0.16em] text-kawai-charcoal/50 font-[family-name:var(--font-brand-sans)]">
          {job.location && <span>{job.location}</span>}
          {job.type && <span>{job.type.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</span>}
        </div>
      </div>

      {/* Description */}
      {job.description && (
        <div className="px-8 md:px-16 lg:px-24 py-16 max-w-3xl">
          <div className="prose prose-lg max-w-none text-kawai-charcoal prose-headings:font-[family-name:var(--font-brand-luxury)] prose-headings:text-kawai-black">
            <RichText data={job.description} />
          </div>
        </div>
      )}

      {/* Application form */}
      <div id="apply" className="px-8 md:px-16 lg:px-24 py-16 border-t border-kawai-neutral/60">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-[family-name:var(--font-brand-luxury)] text-kawai-black mb-8">
            Apply Now
          </h2>
          <div className="h-px bg-kawai-neutral/60 mb-10" />
          <ApplicationForm jobId={String(job.id)} jobTitle={job.title} />
        </div>
      </div>
    </main>
  )
}
