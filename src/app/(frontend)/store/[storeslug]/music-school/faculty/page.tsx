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
      {/* Header */}
      <section className="bg-kawai-black text-white py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Link
            href={`/store/${storeslug}/music-school`}
            className="text-white/50 hover:text-white text-sm mb-4 inline-block"
          >
            ← {school.officialName || school.schoolName}
          </Link>
          <h1 className="text-4xl md:text-5xl font-[family-name:var(--font-brand-luxury)]">
            Our Faculty
          </h1>
          <p className="text-white/60 mt-3">
            {school.officialName || school.schoolName}
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {faculty.length === 0 ? (
          <p className="text-kawai-charcoal">No faculty listed yet.</p>
        ) : (
          <div className="space-y-8">
            {faculty.map((member, index) => {
              const photo = isMedia(member.photo) ? member.photo : null
              return (
                <article
                  key={member.id ?? member.name}
                  className="bg-white border border-kawai-neutral rounded-lg p-6 md:p-8"
                >
                  <div className="flex items-start gap-6">
                    {/* Photo */}
                    <div className="flex-shrink-0">
                      {photo?.url ? (
                        <Image
                          src={photo.url}
                          alt={member.name}
                          width={96}
                          height={96}
                          className="w-24 h-24 rounded-full object-cover border border-kawai-neutral"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-kawai-pearl border border-kawai-neutral flex items-center justify-center">
                          <span className="text-2xl font-semibold text-kawai-charcoal">
                            {member.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-kawai-charcoal/50 text-sm font-mono">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <h2 className="text-xl font-semibold text-kawai-black">{member.name}</h2>
                      </div>
                      {member.title && (
                        <p className="text-kawai-red font-medium text-sm mt-0.5">{member.title}</p>
                      )}
                      {member.role && member.role !== member.title && (
                        <p className="text-kawai-charcoal text-sm mt-0.5">{member.role}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    {/* Education */}
                    {member.education && member.education.length > 0 && (
                      <div>
                        <h3 className="text-xs font-semibold uppercase tracking-widest text-kawai-charcoal mb-2">
                          Education
                        </h3>
                        <ul className="space-y-1">
                          {member.education.map((edu) => (
                            <li
                              key={edu.id ?? edu.degree}
                              className="text-kawai-charcoal text-sm flex items-start gap-2"
                            >
                              <span className="mt-1.5 w-1 h-1 rounded-full bg-kawai-red flex-shrink-0" />
                              {edu.degree}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Specialties */}
                    {member.specialties && (
                      <div>
                        <h3 className="text-xs font-semibold uppercase tracking-widest text-kawai-charcoal mb-1">
                          Specialties
                        </h3>
                        <p className="text-kawai-charcoal text-sm">{member.specialties}</p>
                      </div>
                    )}

                    {/* Background */}
                    {member.background && (
                      <div>
                        <h3 className="text-xs font-semibold uppercase tracking-widest text-kawai-charcoal mb-1">
                          Background
                        </h3>
                        <p className="text-kawai-charcoal text-sm leading-relaxed">
                          {member.background}
                        </p>
                      </div>
                    )}

                    {/* Teaching Focus */}
                    {member.teachingFocus && (
                      <div>
                        <h3 className="text-xs font-semibold uppercase tracking-widest text-kawai-charcoal mb-1">
                          Teaching Focus
                        </h3>
                        <p className="text-kawai-charcoal text-sm">{member.teachingFocus}</p>
                      </div>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
