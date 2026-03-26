import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getMusicSchoolByStorefrontSlug } from '@/lib/payload/queries'
import { cn } from '@/lib/utils'

type Props = { params: Promise<{ storeslug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { storeslug } = await params
  const school = await getMusicSchoolByStorefrontSlug(storeslug)
  if (!school) return { title: 'Programs' }
  return {
    title: `Programs | ${school.officialName || school.schoolName}`,
    description: `Music programs offered at ${school.officialName || school.schoolName} including private lessons, group classes, and more.`,
  }
}

export default async function ProgramsPage({ params }: Props) {
  const { storeslug } = await params
  const school = await getMusicSchoolByStorefrontSlug(storeslug)

  if (!school) notFound()

  const programs: Array<{
    id?: string
    name: string
    description?: string
    ageRange?: string
    duration?: string
    price?: string
  }> = school.programs ?? []

  return (
    <main className="bg-kawai-pearl min-h-screen">

      {/* ─── SLIM HEADER ──────────────────────────────────────── */}
      <header className="bg-kawai-black border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 md:pr-24 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src="https://pub-0cc9ed269d544fd29fe51221f6744a6b.r2.dev/media/KMS%20Logo.webp"
              alt="Kawai Music School"
              className="h-7 w-auto opacity-80"
            />
            <div className="h-4 w-px bg-white/10" />
            <h1 className="text-white/60 text-[11px] tracking-[0.2em] uppercase font-medium">
              Programs
            </h1>
          </div>
          <Link
            href={`/store/${storeslug}/music-school`}
            className="inline-flex items-center gap-2 text-white/30 hover:text-white/60 text-[11px] tracking-[0.15em] uppercase transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="currentColor" viewBox="0 0 256 256">
              <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"/>
            </svg>
            Overview
          </Link>
        </div>
      </header>

      {/* ─── EDITORIAL PROGRAMS LIST ──────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 md:pr-24">
        {programs.length === 0 ? (
          <p className="text-kawai-charcoal text-sm py-16">No programs listed yet.</p>
        ) : (
          <>
            {/* Intro rule */}
            <div className="pt-14 pb-2 flex items-baseline justify-between">
              <span className="text-[10px] tracking-[0.25em] uppercase text-kawai-charcoal/40 font-medium">
                {programs.length} Program{programs.length !== 1 ? 's' : ''}
              </span>
              {school.contactInfo?.city && (
                <span className="text-[10px] tracking-[0.2em] uppercase text-kawai-charcoal/30">
                  {school.contactInfo.city}
                </span>
              )}
            </div>

            {/* Programs — editorial rows */}
            <div>
              {programs.map((program, index) => (
                <div
                  key={program.id ?? program.name}
                  className="border-t border-kawai-neutral py-10 md:py-14 grid grid-cols-12 gap-x-6 gap-y-4"
                >
                  {/* Index */}
                  <div className="col-span-1 pt-1">
                    <span className="text-[11px] font-mono text-kawai-charcoal/25 select-none">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Main content */}
                  <div className="col-span-11 md:col-span-8">
                    <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-brand-luxury)] text-kawai-black leading-tight mb-4">
                      {program.name}
                    </h2>

                    {/* Meta tags */}
                    {(program.ageRange || program.duration) && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {program.ageRange && (
                          <span className="text-[11px] text-kawai-charcoal/60 border border-kawai-neutral px-2.5 py-1 rounded-full">
                            Ages {program.ageRange}
                          </span>
                        )}
                        {program.duration && (
                          <span className="text-[11px] text-kawai-charcoal/60 border border-kawai-neutral px-2.5 py-1 rounded-full">
                            {program.duration}
                          </span>
                        )}
                      </div>
                    )}

                    {program.description && (
                      <p className="text-kawai-charcoal leading-relaxed text-[15px] max-w-xl">
                        {program.description}
                      </p>
                    )}

                    {/* Price on mobile (inline) */}
                    {program.price && (
                      <div className="mt-4 md:hidden">
                        <span className="text-kawai-red font-semibold text-base">{program.price}</span>
                      </div>
                    )}
                  </div>

                  {/* Price on desktop (right column) */}
                  {program.price && (
                    <div className="hidden md:flex col-span-3 items-start justify-end pt-1.5">
                      <span className="text-kawai-red font-semibold text-lg font-[family-name:var(--font-brand-luxury)]">
                        {program.price}
                      </span>
                    </div>
                  )}
                </div>
              ))}
              <div className="border-t border-kawai-neutral" />
            </div>
          </>
        )}
      </div>

      {/* ─── WHY CHOOSE BENEFITS ──────────────────────────────────── */}
      {school.whyChooseBenefits && school.whyChooseBenefits.length > 0 && (
        <section className="bg-kawai-black">
          <div className="max-w-5xl mx-auto px-6 md:pr-24 py-20 md:py-28">
            <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-brand-luxury)] text-white mb-12 leading-tight">
              {school.whyChooseTitle ?? 'Why Choose Kawai Piano Lessons'}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {school.whyChooseBenefits.map(
                (benefit: { title: string; description?: string }, i: number) => (
                  <div
                    key={i}
                    className="flex gap-5 pl-5 border-l-2 border-kawai-red"
                  >
                    <div>
                      <h3 className="text-white font-bold text-base leading-snug mb-2">
                        {benefit.title}
                      </h3>
                      {benefit.description && (
                        <p className="text-kawai-pearl/60 text-sm leading-relaxed">
                          {benefit.description}
                        </p>
                      )}
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </section>
      )}

      {/* ─── GROUP CLASSES ────────────────────────────────────────── */}
      {school.groupClasses && school.groupClasses.length > 0 && (
        <section className="bg-kawai-pearl border-t border-kawai-neutral">
          <div className="max-w-5xl mx-auto px-6 md:pr-24 py-20 md:py-28">
            <div className="mb-12">
              <span className="text-[10px] tracking-[0.25em] uppercase text-kawai-charcoal/40 font-medium block mb-3">
                Ensemble &amp; Community
              </span>
              <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-brand-luxury)] text-kawai-black leading-tight">
                Group Classes
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {school.groupClasses.map(
                (
                  cls: {
                    name: string
                    description?: string
                    ageRange?: string
                    studentsMin?: number
                    studentsMax?: number
                    tuition?: number
                    schedule?: string
                    sessionsInfo?: string
                    isHighlighted?: boolean
                  },
                  i: number,
                ) => (
                  <div
                    key={i}
                    className={cn(
                      'bg-white border rounded-lg p-6 flex flex-col gap-3 transition-all hover:shadow-md',
                      cls.isHighlighted
                        ? 'border-kawai-red/40 shadow-sm'
                        : 'border-kawai-neutral',
                    )}
                  >
                    <h3 className="text-kawai-black text-xl font-[family-name:var(--font-brand-luxury)] leading-snug">
                      {cls.name}
                    </h3>

                    <div className="flex flex-wrap gap-2">
                      {cls.ageRange && (
                        <span className="text-[11px] font-medium text-kawai-charcoal/70 border border-kawai-neutral px-2.5 py-1 rounded-full">
                          Ages {cls.ageRange}
                        </span>
                      )}
                      {(cls.studentsMin != null || cls.studentsMax != null) && (
                        <span className="text-[11px] font-medium text-kawai-charcoal/70 border border-kawai-neutral px-2.5 py-1 rounded-full">
                          {cls.studentsMin != null && cls.studentsMax != null
                            ? `${cls.studentsMin}–${cls.studentsMax} students`
                            : cls.studentsMin != null
                              ? `${cls.studentsMin}+ students`
                              : `Up to ${cls.studentsMax} students`}
                        </span>
                      )}
                    </div>

                    {cls.tuition != null && (
                      <p className="text-kawai-red font-bold text-lg">
                        ${cls.tuition.toLocaleString()}
                        <span className="text-kawai-charcoal/40 text-sm font-normal ml-1">/ mo</span>
                      </p>
                    )}

                    {cls.schedule && (
                      <div className="flex items-center gap-2 text-kawai-charcoal text-sm">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="13"
                          height="13"
                          fill="currentColor"
                          viewBox="0 0 256 256"
                          className="flex-shrink-0 text-kawai-charcoal/40"
                          aria-hidden="true"
                        >
                          <path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Zm-68-76a12,12,0,1,1-12-12A12,12,0,0,1,140,132Zm44,0a12,12,0,1,1-12-12A12,12,0,0,1,184,132Zm-88,40a12,12,0,1,1-12-12A12,12,0,0,1,96,172Zm44,0a12,12,0,1,1-12-12A12,12,0,0,1,140,172Zm44,0a12,12,0,1,1-12-12A12,12,0,0,1,184,172Z" />
                        </svg>
                        {cls.schedule}
                      </div>
                    )}

                    {cls.sessionsInfo && (
                      <p className="text-kawai-charcoal/60 text-xs leading-relaxed">
                        {cls.sessionsInfo}
                      </p>
                    )}

                    {cls.description && (
                      <p className="text-kawai-charcoal text-sm leading-relaxed border-t border-kawai-neutral/50 pt-3 mt-auto">
                        {cls.description}
                      </p>
                    )}
                  </div>
                ),
              )}
            </div>
          </div>
        </section>
      )}

      <div className="max-w-5xl mx-auto px-6 md:pr-24">
        {programs.length > 0 && (
          <>
            {/* CTA */}
            {school.contactInfo?.phone && (
              <div className="py-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-kawai-charcoal/40 mb-1">Ready to enroll?</p>
                  <p className="text-kawai-black text-lg font-[family-name:var(--font-brand-luxury)]">
                    Call us to register or learn more
                  </p>
                </div>
                <a
                  href={`tel:${school.contactInfo.phone}`}
                  className="flex-shrink-0 bg-kawai-red text-white px-7 py-3 rounded text-sm font-semibold tracking-wide hover:bg-kawai-red-700 transition-colors"
                >
                  {school.contactInfo.phone}
                </a>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
