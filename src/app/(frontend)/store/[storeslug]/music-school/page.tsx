import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getMusicSchoolByStorefrontSlug } from '@/lib/payload/queries'

type Props = { params: Promise<{ storeslug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { storeslug } = await params
  const school = await getMusicSchoolByStorefrontSlug(storeslug)
  if (!school) return { title: 'Music School' }
  return {
    title: school.metaTitle || `${school.schoolName} | Music School`,
    description: school.metaDescription || school.about || undefined,
  }
}

export default async function MusicSchoolPage({ params }: Props) {
  const { storeslug } = await params
  const school = await getMusicSchoolByStorefrontSlug(storeslug)

  if (!school) notFound()

  const baseUrl = `/store/${storeslug}/music-school`

  return (
    <main className="bg-kawai-pearl min-h-screen">
      {/* Header */}
      <section className="bg-kawai-black text-white py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-kawai-red text-sm font-semibold uppercase tracking-widest mb-3">
            Kawai Piano Gallery
          </p>
          <h1 className="text-4xl md:text-5xl font-[family-name:var(--font-brand-luxury)] mb-4">
            {school.officialName || school.schoolName}
          </h1>
          {school.about && (
            <p className="text-white/70 text-lg leading-relaxed max-w-2xl">
              {school.about}
            </p>
          )}
          <div className="flex flex-wrap gap-4 mt-8">
            <Link
              href={`${baseUrl}/programs`}
              className="bg-kawai-red text-white px-6 py-3 rounded font-semibold hover:bg-kawai-red-700 transition-colors"
            >
              View Programs
            </Link>
            <Link
              href={`${baseUrl}/faculty`}
              className="border border-white/30 text-white px-6 py-3 rounded font-semibold hover:border-white/60 transition-colors"
            >
              Meet Our Faculty
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        {/* Contact & Hours */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Info */}
          {school.contactInfo && (
            <div>
              <h2 className="text-xl font-semibold text-kawai-black mb-4">Contact</h2>
              <address className="not-italic space-y-1 text-kawai-charcoal">
                {school.contactInfo.address && <p>{school.contactInfo.address}</p>}
                {(school.contactInfo.city || school.contactInfo.state) && (
                  <p>
                    {[school.contactInfo.city, school.contactInfo.state, school.contactInfo.zip]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                )}
                {school.contactInfo.phone && (
                  <p>
                    <a href={`tel:${school.contactInfo.phone}`} className="hover:text-kawai-red">
                      {school.contactInfo.phone}
                    </a>
                  </p>
                )}
                {school.contactInfo.email && (
                  <p>
                    <a href={`mailto:${school.contactInfo.email}`} className="hover:text-kawai-red">
                      {school.contactInfo.email}
                    </a>
                  </p>
                )}
                {school.contactInfo.website && (
                  <p>
                    <a
                      href={`https://${school.contactInfo.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-kawai-red"
                    >
                      {school.contactInfo.website}
                    </a>
                  </p>
                )}
              </address>
            </div>
          )}

          {/* Hours */}
          {school.hours && school.hours.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-kawai-black mb-4">Hours</h2>
              <dl className="space-y-1">
                {school.hours.map((h: { day: string; hoursOpen: string; id?: string }) => (
                  <div key={h.id ?? h.day} className="flex justify-between text-kawai-charcoal">
                    <dt className="font-medium">{h.day}</dt>
                    <dd>{h.hoursOpen}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>

        {/* Facilities */}
        {school.facilities && school.facilities.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-kawai-black mb-6">Facilities</h2>
            <ul className="space-y-3">
              {school.facilities.map((f: { name: string; description?: string; id?: string }) => (
                <li key={f.id ?? f.name} className="flex items-start gap-3">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-kawai-red flex-shrink-0" />
                  <div>
                    <span className="font-medium text-kawai-black">{f.name}</span>
                    {f.description && (
                      <p className="text-kawai-charcoal text-sm mt-0.5">{f.description}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Nav links */}
        <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-kawai-neutral">
          <Link
            href={`${baseUrl}/programs`}
            className="p-6 bg-white border border-kawai-neutral rounded-lg hover:border-kawai-red transition-colors group"
          >
            <h3 className="font-semibold text-kawai-black group-hover:text-kawai-red">
              Programs Offered →
            </h3>
            <p className="text-kawai-charcoal text-sm mt-1">
              Piano, voice, group classes, and more
            </p>
          </Link>
          <Link
            href={`${baseUrl}/faculty`}
            className="p-6 bg-white border border-kawai-neutral rounded-lg hover:border-kawai-red transition-colors group"
          >
            <h3 className="font-semibold text-kawai-black group-hover:text-kawai-red">
              Meet Our Faculty →
            </h3>
            <p className="text-kawai-charcoal text-sm mt-1">
              Professional instructors with world-class credentials
            </p>
          </Link>
        </div>
      </div>
    </main>
  )
}
