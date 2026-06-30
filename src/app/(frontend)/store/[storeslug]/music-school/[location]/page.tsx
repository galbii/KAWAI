import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getMusicSchoolByStorefrontSlug, getPayloadClient } from '@/lib/payload/queries'

type ServiceLocation = {
  id?: string
  cityName: string
  slug: string
  headline?: string
  intro?: string
  metaTitle?: string
  metaDescription?: string
  services?: Array<{
    id?: string
    name: string
    description?: string
    ageRange?: string
    price?: string
  }>
}

type Props = { params: Promise<{ storeslug: string; location: string }> }

// --------------------------------------------------------------------------
// generateStaticParams — pre-render all active school × location combos
// --------------------------------------------------------------------------
export async function generateStaticParams() {
  try {
    const payload = await getPayloadClient()

    const result = await payload.find({
      collection: 'music-schools',
      where: { isActive: { equals: true } },
      depth: 1,
      limit: 200,
      select: { serviceLocations: true, storefront: true },
    })

    const params: Array<{ storeslug: string; location: string }> = []

    for (const school of result.docs) {
      const storefrontSlug =
        typeof school.storefront === 'object' && school.storefront !== null
          ? (school.storefront as any).slug
          : null
      if (!storefrontSlug) continue

      const locations: ServiceLocation[] = (school as any).serviceLocations ?? []
      for (const loc of locations) {
        if (loc.slug) {
          params.push({ storeslug: storefrontSlug, location: loc.slug })
        }
      }
    }

    return params
  } catch {
    return []
  }
}

// --------------------------------------------------------------------------
// generateMetadata
// --------------------------------------------------------------------------
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { storeslug, location } = await params
  const school = await getMusicSchoolByStorefrontSlug(storeslug)

  const loc: ServiceLocation | undefined = ((school as any)?.serviceLocations ?? []).find(
    (l: ServiceLocation) => l.slug === location,
  )

  if (!school || !loc) {
    return {
      title: 'Piano Lessons | Kawai Music School',
      robots: { index: false, follow: false },
    }
  }

  const schoolName = school.officialName || school.schoolName
  const headline = loc.headline || `Piano Lessons in ${loc.cityName}`
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaius.com'

  const defaultTitle = `${headline} | ${schoolName}`
  const defaultDescription = loc.intro
    ? loc.intro.slice(0, 160)
    : `${schoolName} offers expert piano lessons in ${loc.cityName}. Private lessons, group classes & more — all on Kawai instruments. Serving ${loc.cityName} and surrounding areas.`

  return {
    title: loc.metaTitle || defaultTitle,
    description: loc.metaDescription || defaultDescription,
    alternates: {
      canonical: `${siteUrl}/store/${storeslug}/music-school/${location}`,
    },
    openGraph: {
      title: loc.metaTitle || defaultTitle,
      description: loc.metaDescription || defaultDescription,
      url: `${siteUrl}/store/${storeslug}/music-school/${location}`,
      siteName: 'Kawai Pianos',
      type: 'website',
      locale: 'en_US',
    },
    robots: { index: true, follow: true },
  }
}

// --------------------------------------------------------------------------
// Page component
// --------------------------------------------------------------------------
export default async function ServiceAreaPage({ params }: Props) {
  const { storeslug, location } = await params
  const school = await getMusicSchoolByStorefrontSlug(storeslug)

  const loc: ServiceLocation | undefined = ((school as any)?.serviceLocations ?? []).find(
    (l: ServiceLocation) => l.slug === location,
  )

  if (!school || !loc) notFound()

  const schoolName = school.officialName || school.schoolName
  const headline = loc.headline || `Piano Lessons in ${loc.cityName}`
  const musicSchoolUrl = `/store/${storeslug}/music-school`
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaius.com'

  // ---------- Structured data ----------
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: schoolName, item: `${siteUrl}${musicSchoolUrl}` },
      { '@type': 'ListItem', position: 3, name: `Piano Lessons in ${loc.cityName}`, item: `${siteUrl}${musicSchoolUrl}/${location}` },
    ],
  }

  const educationalOrgSchema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    '@id': `${siteUrl}${musicSchoolUrl}#school`,
    name: schoolName,
    url: `${siteUrl}${musicSchoolUrl}`,
    areaServed: { '@type': 'City', name: loc.cityName },
    ...(school.contactInfo?.phone ? { telephone: school.contactInfo.phone } : {}),
    ...(school.contactInfo?.address
      ? {
          address: {
            '@type': 'PostalAddress',
            streetAddress: school.contactInfo.address,
            addressLocality: school.contactInfo.city,
            addressRegion: school.contactInfo.state,
            postalCode: school.contactInfo.zip,
            addressCountry: 'US',
          },
        }
      : {}),
    parentOrganization: {
      '@type': 'Organization',
      name: 'KAWAI America Corporation',
      url: 'https://kawaius.com',
    },
  }

  const services = loc.services ?? []
  const faqItems = school.faqs ?? []

  const faqSchema =
    faqItems.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqItems.map((faq: { question: string; answer: string }) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: { '@type': 'Answer', text: faq.answer },
          })),
        }
      : null

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(educationalOrgSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}

      <div className="bg-kawai-pearl min-h-screen">

        {/* ─── HEADER ──────────────────────────────────────────── */}
        <header className="bg-kawai-black border-b border-white/5">
          <div className="max-w-5xl mx-auto px-6 md:pr-24 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src="https://pub-0cc9ed269d544fd29fe51221f6744a6b.r2.dev/media/KMS%20Logo.webp"
                alt={`${schoolName} ${loc.cityName}`}
                className="h-7 w-auto opacity-80"
              />
              <div className="h-4 w-px bg-white/10" />
              <span className="text-white/50 text-[11px] tracking-[0.2em] uppercase font-medium">
                {loc.cityName}
              </span>
            </div>
            <Link
              href={musicSchoolUrl}
              className="inline-flex items-center gap-2 text-white/30 hover:text-white/60 text-[11px] tracking-[0.15em] uppercase transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="currentColor" viewBox="0 0 256 256">
                <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z" />
              </svg>
              Overview
            </Link>
          </div>
        </header>

        {/* ─── HERO ────────────────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-6 md:pr-24 pt-16 pb-12">
          <div className="h-px w-10 bg-kawai-red mb-8" />
          <h1 className="text-4xl md:text-5xl font-[family-name:var(--font-brand-luxury)] text-kawai-black leading-tight mb-6">
            {headline}
          </h1>
          {loc.intro ? (
            <p className="text-kawai-charcoal text-lg leading-relaxed max-w-2xl">
              {loc.intro}
            </p>
          ) : (
            <p className="text-kawai-charcoal text-lg leading-relaxed max-w-2xl">
              {schoolName} is proud to serve families in {loc.cityName} and surrounding areas.
              Our instructors bring professional-level training and a passion for sharing music
              with students of all ages — from young beginners to adult learners returning to
              the piano.
            </p>
          )}
        </section>

        {/* ─── SERVICES ────────────────────────────────────────── */}
        {services.length > 0 && (
          <section className="max-w-5xl mx-auto px-6 md:pr-24 pb-20">
            <div className="h-px bg-kawai-neutral mb-14" />
            <h2 className="text-[10px] font-bold tracking-[0.22em] uppercase text-kawai-charcoal/50 mb-10">
              Services Available in {loc.cityName}
            </h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {services.map((service, i) => (
                <div
                  key={service.id ?? i}
                  className="bg-white border border-kawai-neutral rounded-lg p-6 flex flex-col gap-3 hover:border-kawai-red/30 hover:shadow-sm transition-all"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-kawai-red" />
                  <h3 className="font-semibold text-kawai-black text-lg leading-snug">
                    {service.name}
                  </h3>
                  {service.description && (
                    <p className="text-kawai-charcoal text-sm leading-relaxed">
                      {service.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-auto pt-2">
                    {service.ageRange && (
                      <span className="text-[11px] text-kawai-charcoal/60 border border-kawai-neutral px-2.5 py-1 rounded-full">
                        {service.ageRange}
                      </span>
                    )}
                    {service.price && (
                      <span className="text-[11px] font-semibold text-kawai-red border border-kawai-red/20 px-2.5 py-1 rounded-full">
                        {service.price}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ─── WHY KAWAI ───────────────────────────────────────── */}
        {school.whyChooseBenefits && school.whyChooseBenefits.length > 0 && (
          <section className="bg-kawai-black">
            <div className="max-w-5xl mx-auto px-6 md:pr-24 py-20 md:py-28">
              <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-brand-luxury)] text-white mb-12 leading-tight">
                {school.whyChooseTitle ?? `Why Choose ${schoolName}`}
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {school.whyChooseBenefits.map(
                  (benefit: { title: string; description?: string }, i: number) => (
                    <div key={i} className="flex gap-5 pl-5 border-l-2 border-kawai-red">
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

        {/* ─── FAQ ─────────────────────────────────────────────── */}
        {faqItems.length > 0 && (
          <section className="max-w-5xl mx-auto px-6 md:pr-24 py-20">
            <div className="h-px bg-kawai-neutral mb-14" />
            <h2 className="text-[10px] font-bold tracking-[0.22em] uppercase text-kawai-charcoal/50 mb-10">
              Frequently Asked Questions
            </h2>
            <div className="divide-y divide-kawai-neutral">
              {faqItems.map((faq: { question: string; answer: string }, i: number) => (
                <details key={i} className="group py-5">
                  <summary className="flex justify-between items-center cursor-pointer list-none">
                    <span className="font-semibold text-kawai-black text-base pr-8">
                      {faq.question}
                    </span>
                    <span className="text-kawai-red flex-shrink-0 transition-transform group-open:rotate-45">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z" />
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-3 text-kawai-charcoal text-sm leading-relaxed pr-8">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* ─── CTA — back to music school ──────────────────────── */}
        <section className="bg-kawai-red">
          <div className="max-w-3xl mx-auto px-6 py-20 md:py-28 text-center">
            <p className="text-white/60 text-[11px] tracking-[0.3em] uppercase mb-4">
              Serving {loc.cityName}
            </p>
            <h2 className="text-3xl md:text-5xl font-[family-name:var(--font-brand-luxury)] text-white leading-tight mb-6">
              Ready to Start?
            </h2>
            <p className="text-white/80 text-base md:text-lg leading-relaxed mb-10 max-w-xl mx-auto">
              Visit {schoolName} to meet our faculty, see our facilities, and enroll in lessons.
              We&#39;d love to find the right program for you.
            </p>
            <Link
              href={musicSchoolUrl}
              className="inline-block bg-white text-kawai-red font-bold text-sm tracking-[0.1em] uppercase px-10 py-4 rounded hover:bg-kawai-pearl transition-colors"
            >
              Contact {schoolName} →
            </Link>
          </div>
        </section>

      </div>
    </>
  )
}
