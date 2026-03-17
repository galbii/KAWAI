import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getMusicSchoolByStorefrontSlug } from '@/lib/payload/queries'
import type { Media } from '@/payload-types'

type Props = { params: Promise<{ storeslug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { storeslug } = await params
  const school = await getMusicSchoolByStorefrontSlug(storeslug)
  if (!school) return { title: 'Faculty' }
  return {
    title: `Faculty | ${school.officialName || school.schoolName}`,
    description: `Meet the professional instructors at ${school.officialName || school.schoolName}.`,
  }
}

function isMedia(val: unknown): val is Media {
  return typeof val === 'object' && val !== null && 'url' in val
}

export default async function FacultyPage({ params }: Props) {
  const { storeslug } = await params
  const school = await getMusicSchoolByStorefrontSlug(storeslug)

  if (!school) notFound()

  const faculty: Array<{
    id?: string
    name: string
    title?: string
    role?: string
    photo?: Media | string | null
    specialties?: string
    teachingFocus?: string
    background?: string
    education?: Array<{ degree?: string; id?: string }>
  }> = school.faculty ?? []

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
              Faculty
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

      {/* ─── FACULTY — alternating full-bleed layout ──────────── */}
      {faculty.length === 0 ? (
        <p className="text-kawai-charcoal text-sm p-16">No faculty listed yet.</p>
      ) : (
        <div>
          {faculty.map((member, index) => {
            const photo = isMedia(member.photo) ? member.photo : null
            const isEven = index % 2 === 0
            const initials = member.name
              .split(' ')
              .map((n: string) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()

            return (
              <article
                key={member.id ?? member.name}
                className="border-b border-kawai-neutral"
              >
                <div className="grid md:grid-cols-2 min-h-[480px] md:min-h-[560px]">

                  {/* IMAGE COLUMN */}
                  <div
                    className={[
                      'relative bg-kawai-black overflow-hidden min-h-[320px] md:min-h-0',
                      isEven ? 'md:order-1' : 'md:order-2',
                    ].join(' ')}
                  >
                    {photo?.url ? (
                      <Image
                        src={photo.url}
                        alt={member.name}
                        fill
                        className="object-cover object-top"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-kawai-black">
                        <span className="text-white/20 text-7xl md:text-8xl font-[family-name:var(--font-brand-luxury)] select-none">
                          {initials}
                        </span>
                      </div>
                    )}
                    {/* Subtle overlay gradient toward content side */}
                    <div
                      className={[
                        'absolute inset-y-0 w-16 from-transparent to-kawai-pearl hidden md:block',
                        isEven ? 'right-0 bg-gradient-to-r' : 'left-0 bg-gradient-to-l',
                      ].join(' ')}
                    />
                  </div>

                  {/* CONTENT COLUMN */}
                  <div
                    className={[
                      'flex flex-col justify-center px-8 py-10 md:px-12 lg:px-16 md:py-16',
                      isEven ? 'md:order-2' : 'md:order-1',
                    ].join(' ')}
                  >
                    <span className="text-[11px] font-mono text-kawai-charcoal/25 mb-5 block">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-brand-luxury)] text-kawai-black leading-tight mb-2">
                      {member.name}
                    </h2>

                    {member.title && (
                      <p className="text-kawai-red text-sm font-medium tracking-wide mb-1">
                        {member.title}
                      </p>
                    )}
                    {member.role && member.role !== member.title && (
                      <p className="text-kawai-charcoal text-sm mb-6">{member.role}</p>
                    )}
                    {!member.role && member.title && <div className="mb-6" />}

                    <div className="space-y-5">
                      {member.education && member.education.length > 0 && (
                        <div>
                          <h3 className="text-[9px] font-bold tracking-[0.25em] uppercase text-kawai-charcoal/40 mb-2">
                            Education
                          </h3>
                          <ul className="space-y-1.5">
                            {member.education.map((edu) => (
                              <li
                                key={edu.id ?? edu.degree}
                                className="flex items-start gap-2.5 text-kawai-charcoal text-sm leading-snug"
                              >
                                <span className="mt-2 w-1 h-1 rounded-full bg-kawai-red flex-shrink-0" />
                                {edu.degree}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {member.specialties && (
                        <div>
                          <h3 className="text-[9px] font-bold tracking-[0.25em] uppercase text-kawai-charcoal/40 mb-1.5">
                            Specialties
                          </h3>
                          <p className="text-kawai-charcoal text-sm leading-relaxed">{member.specialties}</p>
                        </div>
                      )}

                      {member.background && (
                        <div>
                          <h3 className="text-[9px] font-bold tracking-[0.25em] uppercase text-kawai-charcoal/40 mb-1.5">
                            Background
                          </h3>
                          <p className="text-kawai-charcoal text-sm leading-relaxed">{member.background}</p>
                        </div>
                      )}

                      {member.teachingFocus && (
                        <div>
                          <h3 className="text-[9px] font-bold tracking-[0.25em] uppercase text-kawai-charcoal/40 mb-1.5">
                            Teaching Focus
                          </h3>
                          <p className="text-kawai-charcoal text-sm leading-relaxed">{member.teachingFocus}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </main>
  )
}
