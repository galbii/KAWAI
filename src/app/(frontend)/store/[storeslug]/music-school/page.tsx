import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getMusicSchoolByStorefrontSlug } from '@/lib/payload/queries'
import { MusicSchoolFacultyCarousel } from '@/components/music-school/MusicSchoolFacultyCarousel'
import type { Media } from '@/payload-types'

function isMedia(val: unknown): val is Media {
  return typeof val === 'object' && val !== null && 'url' in val
}

type Props = { params: Promise<{ storeslug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { storeslug } = await params
  const school = await getMusicSchoolByStorefrontSlug(storeslug)
  const city = school?.contactInfo?.city
  if (!school) return {
    title: 'Piano Lessons | Kawai Music School',
    description: 'Kawai Music School — expert piano instruction for all ages and skill levels.',
  }
  const defaultTitle = city
    ? `Piano Lessons in ${city} | ${school.officialName || school.schoolName}`
    : `${school.officialName || school.schoolName} | Piano Lessons`
  const defaultDescription = city
    ? `${school.officialName || school.schoolName} offers expert piano lessons in ${city} for all ages. Private lessons, group classes, and more on Kawai instruments.`
    : school.about || `Expert piano instruction at ${school.officialName || school.schoolName}. All ages and skill levels welcome.`
  return {
    title: school.metaTitle || defaultTitle,
    description: school.metaDescription || defaultDescription,
  }
}

function MapPinIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256">
      <path d="M128,16a96,96,0,1,0,96,96A96.11,96.11,0,0,0,128,16Zm0,176a80,80,0,1,1,80-80A80.09,80.09,0,0,1,128,192Zm-8-80V80a8,8,0,0,1,16,0v36.69l25.66,14.81a8,8,0,1,1-8,13.86l-28-16.16A8,8,0,0,1,120,112Z"/>
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256">
      <path d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L136.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-23.12c.2-.22.39-.45.57-.68a16,16,0,0,0,1.32-15.06l0-.12L99.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-50.92A16,16,0,0,0,222.37,158.46Z"/>
    </svg>
  )
}

function EnvelopeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256">
      <path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48Zm-96,85.15L52.57,64H203.43ZM98.71,128,40,181.81V74.19Zm11.84,10.85,12,11.05a8,8,0,0,0,10.82,0l12-11.05,58,53.15H52.57ZM157.29,128,216,74.18V181.82Z"/>
    </svg>
  )
}

function GlobeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256">
      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm87.63,96H175.8c-1.71-25.23-10.22-48.57-24.12-66.16A88.2,88.2,0,0,1,215.63,120ZM128,215.89C111.45,211.4,97.31,191.44,88.64,160h78.72C158.69,191.44,144.55,211.4,128,215.89ZM86.41,144H169.59c1.28,10.58,1.28,21.42,0,32H86.41C85.13,165.42,85.13,154.58,86.41,144Zm1.23-16c1.71-25.23,10.22-48.57,24.12-66.16,4.47-.44,9-.67,13.64-.67s9.17.23,13.64.67c13.9,17.59,22.41,40.93,24.12,66.16Zm-2.92-66.73C71.42,79.43,62.91,102.77,61.2,128H21.37A88.2,88.2,0,0,1,84.72,61.27ZM21.37,144H61.2c1.71,25.23,10.22,48.57,24.12,66.16A88.2,88.2,0,0,1,21.37,144Zm130.31,66.16c13.9-17.59,22.41-40.93,24.12-66.16h39.83A88.2,88.2,0,0,1,151.68,210.16Z"/>
    </svg>
  )
}

export default async function MusicSchoolPage({ params }: Props) {
  const { storeslug } = await params
  const school = await getMusicSchoolByStorefrontSlug(storeslug)

  if (!school) notFound()

  const baseUrl = `/store/${storeslug}/music-school`

  const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  const addressParts = [
    school.contactInfo?.address,
    school.contactInfo?.city,
    school.contactInfo?.state,
    school.contactInfo?.zip,
  ].filter(Boolean)
  const fullAddress = addressParts.join(', ')
  const mapEmbedUrl =
    mapsKey && fullAddress
      ? `https://www.google.com/maps/embed/v1/place?key=${mapsKey}&q=${encodeURIComponent(fullAddress)}`
      : null

  return (
    <div className="bg-kawai-pearl min-h-screen">

      {/* ═══ HERO — minimal, video, no description ═══════════════ */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        <video
          autoPlay muted loop playsInline aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/assets/videos/Hero_compressed.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-kawai-black/80" />
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 28px,#fff 28px,#fff 29px)' }}
        />

        <div className="relative z-10 flex flex-col items-center text-center px-6 md:pr-20">
          <img
            src="https://pub-0cc9ed269d544fd29fe51221f6744a6b.r2.dev/media/KMS%20Logo.webp"
            alt={`Kawai Music School${school.contactInfo?.city ? ` ${school.contactInfo.city}` : ''}`}
            className="h-16 md:h-20 w-auto mb-10 opacity-95"
          />
          {school.contactInfo?.city && (
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-6 bg-kawai-red/50" />
              <span className="text-white/40 text-[10px] tracking-[0.4em] uppercase">
                {school.contactInfo.city}
              </span>
              <div className="h-px w-6 bg-kawai-red/50" />
            </div>
          )}
          {/* Visually hidden H1 for SEO — visible heading is the logo above */}
          <h1 className="sr-only">
            {school.metaTitle || `${school.officialName || school.schoolName}${school.contactInfo?.city ? ` — Piano Lessons in ${school.contactInfo.city}` : ' — Piano Lessons'}`}
          </h1>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href={`${baseUrl}/programs`}
              className="bg-kawai-red text-white px-8 py-3 text-xs font-bold tracking-[0.12em] uppercase hover:bg-kawai-red-700 transition-colors rounded"
            >
              Our Programs
            </Link>
            <Link
              href={`${baseUrl}/faculty`}
              className="border border-white/20 text-white/70 px-8 py-3 text-xs font-bold tracking-[0.12em] uppercase hover:border-white/50 hover:text-white transition-all rounded"
            >
              Our Faculty
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-25">
          <div className="w-px h-10 bg-white" />
        </div>
      </section>

      {/* ═══ ABOUT — description lives here, not in hero ══════════ */}
      {school.about && (
        <section className="max-w-6xl mx-auto px-6 py-20 md:pr-24">
          <div className="max-w-2xl">
            <div className="h-px w-10 bg-kawai-red mb-8" />
            <p className="text-kawai-black text-xl md:text-2xl font-[family-name:var(--font-brand-luxury)] leading-relaxed">
              {school.about}
            </p>
          </div>
        </section>
      )}

      {/* ═══ CONTACT, HOURS & MAP ════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-6 pb-16 md:pr-24">
        <div className="h-px bg-kawai-neutral mb-14" />
        <div className="grid lg:grid-cols-12 gap-10">

          <div className="lg:col-span-4 space-y-8">
            {school.contactInfo && (
              <div>
                <h2 className="text-[10px] font-bold tracking-[0.22em] uppercase text-kawai-charcoal/50 mb-5">
                  Contact
                </h2>
                <address className="not-italic space-y-3 text-sm">
                  {(school.contactInfo.address || school.contactInfo.city) && (
                    <div className="flex items-start gap-3 text-kawai-charcoal">
                      <span className="text-kawai-red mt-0.5 flex-shrink-0"><MapPinIcon /></span>
                      <span className="leading-snug">
                        {school.contactInfo.address && <>{school.contactInfo.address}<br /></>}
                        {[school.contactInfo.city, school.contactInfo.state, school.contactInfo.zip].filter(Boolean).join(', ')}
                      </span>
                    </div>
                  )}
                  {school.contactInfo.phone && (
                    <div className="flex items-center gap-3">
                      <span className="text-kawai-red flex-shrink-0"><PhoneIcon /></span>
                      <a href={`tel:${school.contactInfo.phone}`} className="text-kawai-charcoal hover:text-kawai-red transition-colors">
                        {school.contactInfo.phone}
                      </a>
                    </div>
                  )}
                  {school.contactInfo.email && (
                    <div className="flex items-center gap-3">
                      <span className="text-kawai-red flex-shrink-0"><EnvelopeIcon /></span>
                      <a href={`mailto:${school.contactInfo.email}`} className="text-kawai-charcoal hover:text-kawai-red transition-colors break-all">
                        {school.contactInfo.email}
                      </a>
                    </div>
                  )}
                  {school.contactInfo.website && (
                    <div className="flex items-center gap-3">
                      <span className="text-kawai-red flex-shrink-0"><GlobeIcon /></span>
                      <a href={`https://${school.contactInfo.website}`} target="_blank" rel="noopener noreferrer" className="text-kawai-charcoal hover:text-kawai-red transition-colors break-all">
                        {school.contactInfo.website}
                      </a>
                    </div>
                  )}
                </address>
              </div>
            )}

            {school.hours && school.hours.length > 0 && (
              <div>
                <h2 className="text-[10px] font-bold tracking-[0.22em] uppercase text-kawai-charcoal/50 mb-5">
                  Hours
                </h2>
                <dl className="space-y-2.5">
                  {school.hours.map((h: { day: string; hoursOpen: string; id?: string }) => (
                    <div key={h.id ?? h.day} className="flex justify-between text-sm border-b border-kawai-neutral/40 pb-2.5">
                      <dt className="font-medium text-kawai-black">{h.day}</dt>
                      <dd className="text-kawai-charcoal">{h.hoursOpen}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>

          <div className="lg:col-span-8">
            {mapEmbedUrl ? (
              <div className="rounded-lg overflow-hidden border border-kawai-neutral h-72 lg:h-full min-h-[360px]">
                <iframe
                  src={mapEmbedUrl}
                  width="100%" height="100%"
                  style={{ border: 0, display: 'block', minHeight: '360px' }}
                  allowFullScreen loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Map — ${school.officialName || school.schoolName}`}
                />
              </div>
            ) : fullAddress ? (
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(fullAddress)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center h-48 rounded-lg border border-kawai-neutral bg-white hover:border-kawai-red/40 transition-colors text-kawai-charcoal text-sm gap-2"
              >
                <MapPinIcon /> View on Google Maps
              </a>
            ) : null}
          </div>
        </div>
      </section>

      {/* ═══ FACULTY CAROUSEL ════════════════════════════════════ */}
      {school.faculty && school.faculty.length > 0 && (
        <section className="border-t border-kawai-neutral">
          <MusicSchoolFacultyCarousel
            faculty={school.faculty.map((m: any) => ({
              id: m.id,
              name: m.name,
              title: m.title,
              role: m.role,
              photoUrl: isMedia(m.photo) ? (m.photo.url ?? null) : null,
              specialties: m.specialties,
              background: m.background,
            }))}
            schoolName={school.schoolName}
            baseUrl={baseUrl}
          />
        </section>
      )}

      {/* ═══ FACILITIES ══════════════════════════════════════════ */}
      {school.facilities && school.facilities.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-20 md:pr-24">
          <div className="h-px bg-kawai-neutral mb-14" />
          <h2 className="text-[10px] font-bold tracking-[0.22em] uppercase text-kawai-charcoal/50 mb-8">
            Facilities
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {school.facilities.map((f: { name: string; description?: string; id?: string }) => (
              <div
                key={f.id ?? f.name}
                className="bg-white border border-kawai-neutral rounded-lg p-5 hover:border-kawai-red/30 hover:shadow-sm transition-all"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-kawai-red mb-3" />
                <h3 className="font-semibold text-kawai-black text-sm">{f.name}</h3>
                {f.description && (
                  <p className="text-kawai-charcoal text-xs mt-1.5 leading-relaxed">{f.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ═══ TRIAL LESSON CTA ════════════════════════════════════ */}
      {school.trialLesson?.enabled && (
        <section className="bg-kawai-red">
          <div className="max-w-3xl mx-auto px-6 py-20 md:py-28 text-center">
            <h2 className="text-3xl md:text-5xl font-[family-name:var(--font-brand-luxury)] text-white leading-tight mb-6">
              Begin Your Musical Journey
            </h2>
            {school.trialLesson.description && (
              <p className="text-white/80 text-base md:text-lg leading-relaxed mb-10 max-w-xl mx-auto">
                {school.trialLesson.description}
              </p>
            )}
            {(school.trialLesson.ctaLink || school.trialLesson.phone) && (
              <a
                href={
                  school.trialLesson.ctaLink
                    ? school.trialLesson.ctaLink
                    : `tel:${school.trialLesson.phone}`
                }
                {...(!school.trialLesson.ctaLink ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
                className="inline-block bg-white text-kawai-red font-bold text-sm tracking-[0.1em] uppercase px-10 py-4 rounded hover:bg-kawai-pearl transition-colors"
              >
                {school.trialLesson.ctaText ?? 'Schedule a Trial Lesson'}
              </a>
            )}
          </div>
        </section>
      )}
    </div>
  )
}
