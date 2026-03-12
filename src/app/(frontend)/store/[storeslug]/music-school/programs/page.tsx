import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getMusicSchoolByStorefrontSlug } from '@/lib/payload/queries'

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
            Programs Offered
          </h1>
          <p className="text-white/60 mt-3">
            {school.officialName || school.schoolName}
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {programs.length === 0 ? (
          <p className="text-kawai-charcoal">No programs listed yet.</p>
        ) : (
          <ul className="space-y-6">
            {programs.map((program) => (
              <li
                key={program.id ?? program.name}
                className="bg-white border border-kawai-neutral rounded-lg p-6"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <h2 className="text-lg font-semibold text-kawai-black">{program.name}</h2>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {program.ageRange && (
                      <span className="bg-kawai-pearl border border-kawai-neutral px-2 py-1 rounded text-kawai-charcoal">
                        Ages: {program.ageRange}
                      </span>
                    )}
                    {program.duration && (
                      <span className="bg-kawai-pearl border border-kawai-neutral px-2 py-1 rounded text-kawai-charcoal">
                        {program.duration}
                      </span>
                    )}
                    {program.price && (
                      <span className="bg-kawai-red/10 border border-kawai-red/20 px-2 py-1 rounded text-kawai-red font-medium">
                        {program.price}
                      </span>
                    )}
                  </div>
                </div>
                {program.description && (
                  <p className="text-kawai-charcoal mt-3 leading-relaxed">{program.description}</p>
                )}
              </li>
            ))}
          </ul>
        )}

        {/* CTA */}
        {school.contactInfo?.phone && (
          <div className="mt-12 bg-kawai-black text-white rounded-lg p-8 text-center">
            <h2 className="text-2xl font-[family-name:var(--font-brand-luxury)] mb-2">
              Ready to Get Started?
            </h2>
            <p className="text-white/70 mb-6">
              Call us to register or learn more about our programs.
            </p>
            <a
              href={`tel:${school.contactInfo.phone}`}
              className="bg-kawai-red text-white px-8 py-3 rounded font-semibold hover:bg-kawai-red-700 transition-colors inline-block"
            >
              {school.contactInfo.phone}
            </a>
          </div>
        )}
      </div>
    </main>
  )
}
