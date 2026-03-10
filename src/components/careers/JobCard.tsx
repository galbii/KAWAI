import Link from 'next/link'
import { cn } from '@/lib/utils'

export type { JobListingItem } from './JobListingsPanel'
import type { JobListingItem } from './JobListingsPanel'

export function JobCard({ job, index }: { job: JobListingItem; index?: number }) {
  return (
    <Link
      href={`/careers/${job.slug}`}
      className={cn(
        'group flex items-center gap-6 py-5 border-b border-kawai-neutral/60',
        'hover:bg-kawai-pearl/40 transition-colors duration-150 px-3 -mx-3 rounded',
      )}
    >
      {index !== undefined && (
        <span className="text-sm font-mono text-kawai-red w-7 flex-shrink-0 font-[family-name:var(--font-brand-sans)]">
          {String(index).padStart(2, '0')}
        </span>
      )}
      <span className="flex-1 text-xl font-[family-name:var(--font-brand-luxury)] text-kawai-black group-hover:text-kawai-red transition-colors duration-200">
        {job.title}
      </span>
      {job.department && (
        <span className="hidden md:block text-[10px] uppercase tracking-[0.16em] text-kawai-charcoal/50 font-[family-name:var(--font-brand-sans)]">
          {job.department}
        </span>
      )}
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        className="text-kawai-charcoal/30 group-hover:text-kawai-black transition-colors duration-200 flex-shrink-0"
        aria-hidden="true"
      >
        <path
          d="M3 9h12M9 3l6 6-6 6"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  )
}
