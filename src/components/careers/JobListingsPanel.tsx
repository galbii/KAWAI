'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Clock, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

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

const EASE = [0.16, 1, 0.3, 1] as const

const gridVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: EASE },
  },
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

function daysSince(date: string) {
  const diff = Date.now() - new Date(date).getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

export function JobListingsPanel({ jobs }: Props) {
  const [activeDept, setActiveDept] = useState('All')
  const [activeType, setActiveType] = useState('All')

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
      {/* Ambient radial orb */}
      <div
        className="absolute pointer-events-none inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 80% 80%, rgba(213,199,140,0.07) 0%, transparent 55%)',
        }}
      />

      {/* Sticky glass filter bar */}
      <div className="relative z-20 px-8 md:px-16 lg:px-24 py-6 border-b border-kawai-neutral/30 bg-white/60 backdrop-blur-sm sticky top-0">
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
                {type === 'All' ? 'All Types' : formatType(type)}
              </button>
            ))}
        </div>
      </div>

      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: EASE }}
        className="relative z-10 px-8 md:px-16 lg:px-24 pt-20 pb-12 flex items-end justify-between gap-6"
      >
        <div>
          <div className="w-10 h-px bg-kawai-red mb-6" />
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-[family-name:var(--font-brand-luxury)] text-kawai-black leading-tight">
            Open Positions
          </h2>
        </div>
        <span className="text-sm text-kawai-charcoal/40 font-[family-name:var(--font-brand-sans)] whitespace-nowrap pb-2">
          {filteredJobs.length} {filteredJobs.length === 1 ? 'role' : 'roles'}
        </span>
      </motion.div>

      {/* Job cards grid */}
      <div className="relative z-10 px-8 md:px-16 lg:px-24 pb-28">
        {filteredJobs.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-2xl font-[family-name:var(--font-brand-luxury)] text-kawai-charcoal/40 italic">
              No positions match your filters.
            </p>
          </div>
        ) : (
          <motion.div
            variants={gridVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-5"
          >
            {filteredJobs.map((job, i) => {
              const isNew = job.postedAt ? daysSince(job.postedAt) < 14 : false
              return (
                <motion.div key={job.id} variants={cardVariants}>
                  <Link
                    href={`/careers/${job.slug}`}
                    className="group relative block h-full overflow-hidden rounded-2xl border border-kawai-neutral/25 bg-white/65 backdrop-blur-md shadow-brand-subtle hover:shadow-brand-medium hover:bg-white/90 hover:-translate-y-1 hover:border-kawai-neutral/40 transition-all duration-300"
                  >
                    {/* Vertical red accent — grows on hover */}
                    <span
                      aria-hidden
                      className="absolute left-0 top-10 bottom-10 w-[2px] bg-kawai-red origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-out"
                    />

                    {/* Faint corner glyph (decorative) */}
                    <span
                      aria-hidden
                      className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-kawai-red/0 group-hover:bg-kawai-red/[0.03] transition-colors duration-500 blur-2xl"
                    />

                    <div className="relative flex flex-col p-8 md:p-10 min-h-[440px]">
                      {/* Top row: index + department + freshness */}
                      <div className="flex items-start justify-between mb-12">
                        <div className="flex items-center gap-4">
                          <span className="text-xs font-mono text-kawai-red font-[family-name:var(--font-brand-sans)]">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          {job.department && (
                            <>
                              <span aria-hidden className="w-6 h-px bg-kawai-charcoal/20" />
                              <span className="text-[10px] uppercase tracking-[0.2em] text-kawai-charcoal/60 font-[family-name:var(--font-brand-sans)]">
                                {job.department}
                              </span>
                            </>
                          )}
                        </div>
                        {isNew && (
                          <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-kawai-red font-[family-name:var(--font-brand-sans)]">
                            <span className="relative flex h-1.5 w-1.5">
                              <span className="absolute inline-flex h-full w-full rounded-full bg-kawai-red opacity-60 animate-ping" />
                              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-kawai-red" />
                            </span>
                            Just Posted
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-3xl md:text-[2.5rem] font-[family-name:var(--font-brand-luxury)] text-kawai-black leading-[1.1] tracking-tight mb-6 group-hover:text-kawai-red transition-colors duration-300">
                        {job.title}
                      </h3>

                      {/* Snippet */}
                      {job.descriptionSnippet && (
                        <p className="text-[15px] text-kawai-charcoal/65 font-[family-name:var(--font-brand-sans)] leading-relaxed line-clamp-3 mb-10">
                          {job.descriptionSnippet}
                        </p>
                      )}

                      {/* Spacer to push meta + footer to bottom */}
                      <div className="flex-1" />

                      {/* Meta row: type + location */}
                      {(job.type || job.location) && (
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-6">
                          {job.type && (
                            <span className="inline-flex items-center gap-2 text-[13px] text-kawai-charcoal font-[family-name:var(--font-brand-sans)]">
                              <Clock size={13} strokeWidth={1.5} className="text-kawai-charcoal/40" />
                              {formatType(job.type)}
                            </span>
                          )}
                          {job.location && (
                            <span className="inline-flex items-center gap-2 text-[13px] text-kawai-charcoal font-[family-name:var(--font-brand-sans)]">
                              <MapPin size={13} strokeWidth={1.5} className="text-kawai-charcoal/40" />
                              {job.location}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Footer: posted date + CTA */}
                      <div className="flex items-center justify-between pt-5 border-t border-kawai-neutral/30">
                        {job.postedAt ? (
                          <span className="text-[10px] uppercase tracking-[0.16em] text-kawai-charcoal/40 font-[family-name:var(--font-brand-sans)]">
                            Posted {formatPostedDate(job.postedAt)}
                          </span>
                        ) : (
                          <span />
                        )}
                        <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-kawai-black font-[family-name:var(--font-brand-sans)] group-hover:text-kawai-red transition-colors duration-300">
                          View Role
                          <ArrowUpRight
                            size={14}
                            strokeWidth={1.6}
                            className="transform transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </div>
    </section>
  )
}
