'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export interface JobListingItem {
  id: string
  title: string
  slug: string
  department?: string | null
  location?: string | null
  type?: string | null
  postedAt?: string | null
  descriptionSnippet?: string | null
}

interface Props {
  jobs: JobListingItem[]
}

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      delay: Math.min(i * 0.04, 0.4),
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),
}

export function JobListingsPanel({ jobs }: Props) {
  const [activeDept, setActiveDept] = useState('All')
  const [activeType, setActiveType] = useState('All')
  const [activeJob, setActiveJob] = useState<JobListingItem | null>(null)

  const departments = useMemo(
    () => ['All', ...Array.from(new Set(jobs.map((j) => j.department).filter(Boolean) as string[]))],
    [jobs],
  )

  const types = useMemo(
    () => ['All', ...Array.from(new Set(jobs.map((j) => j.type).filter(Boolean) as string[]))],
    [jobs],
  )

  const filteredJobs = useMemo(() => {
    return jobs.filter((j) => {
      const deptMatch = activeDept === 'All' || j.department === activeDept
      const typeMatch = activeType === 'All' || j.type === activeType
      return deptMatch && typeMatch
    })
  }, [jobs, activeDept, activeType])

  return (
    <section id="openings" className="relative bg-kawai-pearl overflow-hidden">
      {/* Radial gradient orb */}
      <div
        className="absolute pointer-events-none inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 80% 80%, rgba(213,199,140,0.07) 0%, transparent 55%)',
        }}
      />

      {/* Sticky glass filter bar */}
      <div className="relative z-10 px-8 md:px-16 lg:px-24 py-6 border-b border-kawai-neutral/30 bg-white/60 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[10px] uppercase tracking-[0.18em] text-kawai-charcoal/50 font-[family-name:var(--font-brand-sans)] mr-2">
            Department
          </span>
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setActiveDept(dept)}
              className={cn(
                'px-4 py-2 text-sm border rounded-full transition-all duration-150 font-[family-name:var(--font-brand-sans)]',
                activeDept === dept
                  ? 'bg-kawai-black border-kawai-black text-white'
                  : 'border-kawai-neutral text-kawai-charcoal hover:border-kawai-charcoal hover:bg-white/80',
              )}
            >
              {dept}
            </button>
          ))}

          {types.length > 1 && <div className="w-px h-5 bg-kawai-neutral mx-1" />}
          {types.length > 1 &&
            types.map((type) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={cn(
                  'px-4 py-2 text-sm border rounded-full transition-all duration-150 font-[family-name:var(--font-brand-sans)]',
                  activeType === type
                    ? 'border-kawai-red text-kawai-red bg-kawai-red/5'
                    : 'border-kawai-neutral text-kawai-charcoal hover:border-kawai-charcoal hover:bg-white/80',
                )}
              >
                {type === 'All'
                  ? 'All Types'
                  : type.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
              </button>
            ))}
        </div>
      </div>

      {/* Section header */}
      <div className="relative z-10 px-8 md:px-16 lg:px-24 pt-12 pb-4 flex items-baseline justify-between">
        <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-brand-luxury)] text-kawai-black">
          Open Positions
        </h2>
        <span className="text-sm text-kawai-charcoal/40 font-[family-name:var(--font-brand-sans)]">
          {filteredJobs.length} {filteredJobs.length === 1 ? 'role' : 'roles'}
        </span>
      </div>

      {/* Job list */}
      <div className="relative z-10 px-8 md:px-16 lg:px-24 pb-20">
        {filteredJobs.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-2xl font-[family-name:var(--font-brand-luxury)] text-kawai-charcoal/40 italic">
              No positions match your filters.
            </p>
          </div>
        ) : (
          <motion.div variants={listVariants} initial="hidden" animate="visible">
            <div className="h-px bg-kawai-neutral/40" />
            {filteredJobs.map((job, i) => (
              <motion.div key={job.id} variants={itemVariants} custom={i}>
                <button onClick={() => setActiveJob(job)} className="w-full text-left group">
                  <div className="flex items-center gap-6 py-6 border-b border-kawai-neutral/40 hover:bg-white/70 hover:backdrop-blur-sm transition-all duration-150 px-3 -mx-3 rounded-xl">
                    {/* Index */}
                    <span className="text-sm font-mono text-kawai-red w-7 flex-shrink-0 font-[family-name:var(--font-brand-sans)]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {/* Title */}
                    <span className="flex-1 text-xl md:text-2xl font-[family-name:var(--font-brand-luxury)] text-kawai-black group-hover:text-kawai-red transition-colors duration-200">
                      {job.title}
                    </span>
                    {/* Meta (desktop) */}
                    <div className="hidden md:flex items-center gap-6">
                      {job.department && (
                        <span className="text-[10px] uppercase tracking-[0.16em] text-kawai-charcoal/50 font-[family-name:var(--font-brand-sans)]">
                          {job.department}
                        </span>
                      )}
                      {job.type && (
                        <span className="text-[10px] uppercase tracking-[0.16em] text-kawai-charcoal/50 font-[family-name:var(--font-brand-sans)]">
                          {job.type.replace('-', ' ')}
                        </span>
                      )}
                      {job.location && (
                        <span className="text-[10px] uppercase tracking-[0.16em] text-kawai-charcoal/40 font-[family-name:var(--font-brand-sans)]">
                          {job.location}
                        </span>
                      )}
                    </div>
                    {/* Arrow */}
                    <span className="text-kawai-charcoal/30 group-hover:text-kawai-black transition-colors duration-200 flex-shrink-0">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                        <path
                          d="M4 10h12M10 4l6 6-6 6"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </div>
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Job Detail Drawer */}
      <AnimatePresence>
        {activeJob && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[200] bg-black/30 backdrop-blur-[2px]"
              onClick={() => setActiveJob(null)}
            />

            {/* Frosted glass drawer panel */}
            <motion.div
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-[201] w-full max-w-md md:max-w-lg bg-white/85 backdrop-blur-xl overflow-y-auto flex flex-col shadow-2xl border-l border-white/60"
            >
              {/* Top bar */}
              <div className="flex items-center justify-between px-8 py-6 border-b border-kawai-neutral/30 flex-shrink-0">
                {activeJob.department && (
                  <span className="text-[10px] uppercase tracking-[0.18em] text-kawai-red font-[family-name:var(--font-brand-sans)]">
                    {activeJob.department}
                  </span>
                )}
                <button
                  onClick={() => setActiveJob(null)}
                  className="ml-auto p-2 text-kawai-charcoal/50 hover:text-kawai-black transition-colors"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 px-8 py-10">
                {/* Title */}
                <h3 className="text-4xl md:text-5xl font-[family-name:var(--font-brand-luxury)] text-kawai-black leading-tight mb-6">
                  {activeJob.title}
                </h3>

                {/* Metadata chips */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {activeJob.department && (
                    <span className="inline-flex items-center px-3 py-1.5 bg-kawai-black text-white text-xs uppercase tracking-[0.12em] font-[family-name:var(--font-brand-sans)] rounded-md">
                      {activeJob.department}
                    </span>
                  )}
                  {activeJob.type && (
                    <span className="inline-flex items-center px-3 py-1.5 border border-kawai-neutral/50 bg-white/50 text-kawai-charcoal text-xs uppercase tracking-[0.12em] font-[family-name:var(--font-brand-sans)] rounded-md">
                      {activeJob.type.replace('-', ' ')}
                    </span>
                  )}
                  {activeJob.location && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-kawai-neutral/50 bg-white/50 text-kawai-charcoal text-xs uppercase tracking-[0.12em] font-[family-name:var(--font-brand-sans)] rounded-md">
                      <svg width="10" height="12" viewBox="0 0 10 12" fill="none" aria-hidden="true">
                        <path d="M5 0C2.79 0 1 1.79 1 4c0 2.5 4 8 4 8s4-5.5 4-8c0-2.21-1.79-4-4-4Z" fill="currentColor" fillOpacity="0.5"/>
                        <circle cx="5" cy="4" r="1.5" fill="currentColor"/>
                      </svg>
                      {activeJob.location}
                    </span>
                  )}
                </div>

                {/* Divider */}
                <div className="h-px bg-kawai-neutral/30 mb-8" />

                {/* Description snippet */}
                {activeJob.descriptionSnippet ? (
                  <p className="text-sm text-kawai-charcoal/70 font-[family-name:var(--font-brand-sans)] leading-relaxed">
                    {activeJob.descriptionSnippet}
                  </p>
                ) : (
                  <p className="text-sm text-kawai-charcoal/40 font-[family-name:var(--font-brand-sans)] leading-relaxed italic">
                    View the full role description on the position page.
                  </p>
                )}

                {/* Posted date */}
                {activeJob.postedAt && (
                  <p className="mt-6 text-[11px] uppercase tracking-[0.14em] text-kawai-charcoal/40 font-[family-name:var(--font-brand-sans)]">
                    Posted {new Date(activeJob.postedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                )}
              </div>

              {/* CTA Footer */}
              <div className="flex-shrink-0 px-8 py-6 border-t border-kawai-neutral/25 bg-white/70 backdrop-blur-sm">
                <Link
                  href={`/careers/${activeJob.slug}#apply`}
                  className="block w-full py-4 text-center bg-kawai-red text-white text-sm font-medium tracking-[0.06em] uppercase font-[family-name:var(--font-brand-sans)] rounded-xl hover:bg-kawai-black transition-colors duration-200"
                >
                  Apply Now
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  )
}
