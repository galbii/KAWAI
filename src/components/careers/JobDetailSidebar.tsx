import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { JobApplyButton } from './JobApplyButton'
import { JobShareButton } from './JobShareButton'

interface JobMeta {
  department?: string | null
  location?: string | null
  type?: string | null
  postedAt?: string | null
}

interface OtherJob {
  id: string
  title: string
  slug: string
  department?: string | null
}

interface Props {
  job: JobMeta
  otherJobs: OtherJob[]
}

function formatType(type: string) {
  return type.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function formatPostedDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2.5">
      <span className="text-[10px] uppercase tracking-[0.2em] text-kawai-charcoal/50 font-[family-name:var(--font-brand-sans)]">
        {label}
      </span>
      <span className="text-[13px] text-kawai-black font-[family-name:var(--font-brand-sans)] text-right">
        {value}
      </span>
    </div>
  )
}

export function JobDetailSidebar({ job, otherJobs }: Props) {
  return (
    <aside className="lg:sticky lg:top-24">
      {/* Primary apply card */}
      <div className="bg-white/70 backdrop-blur-md border border-kawai-neutral/40 rounded-2xl p-6 md:p-7 shadow-brand-subtle">
        {/* Apply CTA — hidden on mobile (replaced by MobileApplyBar) */}
        <div className="hidden lg:block">
          <JobApplyButton />
          <p className="mt-3 text-center text-[11px] text-kawai-charcoal/55 font-[family-name:var(--font-brand-sans)]">
            We reply to every applicant within ~5 business days.
          </p>
        </div>

        {/* Mobile-only intro copy */}
        <p className="lg:hidden text-[12px] text-kawai-charcoal/60 font-[family-name:var(--font-brand-sans)] leading-relaxed">
          Tap <span className="font-semibold text-kawai-black">Apply</span> at the bottom of your screen — we reply to every applicant within ~5 business days.
        </p>

        {/* Divider */}
        <div className="my-5 lg:my-6 h-px bg-kawai-neutral/50" />

        {/* Meta */}
        <div className="flex flex-col divide-y divide-kawai-neutral/40">
          {job.department && <MetaRow label="Department" value={job.department} />}
          {job.type && <MetaRow label="Type" value={formatType(job.type)} />}
          {job.location && <MetaRow label="Location" value={job.location} />}
          {job.postedAt && <MetaRow label="Posted" value={formatPostedDate(job.postedAt)} />}
        </div>

        {/* Share */}
        <div className="mt-5 pt-5 border-t border-kawai-neutral/50 flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-[0.2em] text-kawai-charcoal/50 font-[family-name:var(--font-brand-sans)]">
            Share role
          </span>
          <JobShareButton />
        </div>
      </div>

      {/* Other open roles */}
      {otherJobs.length > 0 && (
        <div className="mt-6 bg-white/45 backdrop-blur-md border border-kawai-neutral/40 rounded-2xl p-6 md:p-7">
          <div className="flex items-center gap-3 mb-4">
            <span aria-hidden className="w-6 h-px bg-kawai-red" />
            <h3 className="text-[10px] uppercase tracking-[0.22em] text-kawai-red font-[family-name:var(--font-brand-sans)]">
              More Open Roles
            </h3>
          </div>
          <ul className="flex flex-col">
            {otherJobs.map((j) => (
              <li key={j.id}>
                <Link
                  href={`/careers/${j.slug}`}
                  className="group flex items-start gap-3 py-3 border-b border-kawai-neutral/40 last:border-b-0 hover:pl-1 transition-all duration-200"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-[family-name:var(--font-brand-luxury)] text-kawai-black leading-snug group-hover:text-kawai-red transition-colors">
                      {j.title}
                    </p>
                    {j.department && (
                      <p className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-kawai-charcoal/55 font-[family-name:var(--font-brand-sans)]">
                        {j.department}
                      </p>
                    )}
                  </div>
                  <ArrowUpRight
                    size={14}
                    strokeWidth={1.6}
                    className="mt-1 shrink-0 text-kawai-charcoal/30 group-hover:text-kawai-red group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                  />
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/careers#openings"
            className="mt-4 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-kawai-black hover:text-kawai-red transition-colors font-[family-name:var(--font-brand-sans)]"
          >
            View all roles
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path
                d="M3 6h6M6 3l3 3-3 3"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      )}
    </aside>
  )
}
