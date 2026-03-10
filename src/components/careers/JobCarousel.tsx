import { JobCard } from './JobCard'
import type { JobListingItem } from './JobCard'

export function JobCarousel({ jobs }: { jobs: JobListingItem[] }) {
  if (!jobs.length) return null
  return (
    <section className="px-8 md:px-16 lg:px-24 py-16 border-t border-kawai-neutral">
      <p className="text-xs tracking-widest uppercase text-kawai-charcoal/60 font-[family-name:var(--font-brand-sans)] mb-8">
        Recent Openings
      </p>
      <div>
        {jobs.map((job, i) => (
          <JobCard key={job.id} job={job} index={i + 1} />
        ))}
      </div>
    </section>
  )
}
