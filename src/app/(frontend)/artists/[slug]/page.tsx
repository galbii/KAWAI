import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import { unstable_cache } from 'next/cache'
import { Trophy } from 'lucide-react'
import { getPayloadClient } from '@/lib/payload/queries'
import type { Artist, Media, Page, Product } from '@/payload-types'
import { RenderBlocks } from '@/components/RenderBlocks'
import { AdminBarDoc } from '@/components/layout/AdminBarDoc'
import { LexicalSerializer } from '@/lib/lexical/LexicalSerializer'
import { generatePersonSchema } from '@/lib/seo/schemas'
import { ArtistSidebar } from '@/components/artists/ArtistSidebar'
import { ArtistRightPanel } from '@/components/artists/ArtistRightPanel'
import { ArtistProfileLayout } from '@/components/artists/ArtistProfileLayout'
import { RecentWorkCarousel } from '@/components/artists/RecentWorkCarousel'
import { ArtistGalleryCarousel } from '@/components/artists/ArtistGalleryCarousel'

export const revalidate = 900

export async function generateStaticParams() {
  try {
    const payload = await getPayloadClient()
    const artists = await payload.find({
      collection: 'artists',
      where: { isActive: { equals: true } },
      limit: 100,
      select: { slug: true },
    })
    return artists.docs
      .filter((artist: any) => typeof artist.slug === 'string' && artist.slug.length > 0)
      .map((artist: any) => ({ slug: artist.slug }))
  } catch {
    return []
  }
}

function getArtist(slug: string, isDraftMode: boolean): Promise<Artist | null> {
  if (isDraftMode) {
    return (async () => {
      try {
        const payload = await getPayloadClient()
        const result = await payload.find({
          collection: 'artists',
          where: { slug: { equals: slug } },
          draft: true,
          overrideAccess: true,
          depth: 1,
          limit: 1,
        })
        return (result.docs[0] as Artist) ?? null
      } catch {
        return null
      }
    })()
  }

  return unstable_cache(
    async () => {
      try {
        const payload = await getPayloadClient()
        const result = await payload.find({
          collection: 'artists',
          where: {
            and: [
              { slug: { equals: slug } },
              { isActive: { equals: true } },
            ],
          },
          depth: 1,
          limit: 1,
        })
        return (result.docs[0] as Artist) ?? null
      } catch {
        return null
      }
    },
    [`artist-${slug}`],
    { tags: [`artist-${slug}`, 'artists'], revalidate: 3600 },
  )()
}

async function getCMSArtistPage(slug: string): Promise<Page | null> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'pages',
      where: { slug: { equals: slug }, _status: { equals: 'published' } },
      depth: 2,
      limit: 1,
    })
    return (result.docs[0] as Page) ?? null
  } catch {
    return null
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  try {
    const { slug } = await params
    const artist = await getArtist(slug, false)

    if (!artist) {
      return {
        title: 'Artist Not Found',
        robots: { index: false, follow: false },
      }
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaius.com'
    const modelName =
      artist.kawaiModel && typeof artist.kawaiModel === 'object'
        ? (artist.kawaiModel as Product).name ?? null
        : null
    const topAchievement = artist.achievements?.[0]?.achievement ?? null
    const recentWorkTitles = (artist.recentWork ?? []).map(w => w.title).join(', ')

    const defaultTitle = `${artist.name} | KAWAI Artist`
    const defaultDescription =
      [
        artist.shortBio,
        modelName ? `Performs on the ${modelName}.` : null,
        topAchievement,
      ]
        .filter(Boolean)
        .join(' ') || `Discover ${artist.name}, a KAWAI piano artist.`

    const keywords = [
      artist.name,
      'KAWAI artist',
      'KAWAI piano',
      modelName,
      artist.genre,
      artist.instrument ? `${artist.instrument} piano` : null,
      ...(artist.achievements ?? []).map(a => a.achievement),
      recentWorkTitles || null,
      artist.seo?.keywords,
    ]
      .filter(Boolean)
      .join(', ')

    let ogImageUrl = ''
    if (artist.seo?.ogImage) {
      ogImageUrl =
        typeof artist.seo.ogImage === 'string'
          ? artist.seo.ogImage
          : (artist.seo.ogImage as Media)?.url || ''
    } else if (artist.image) {
      ogImageUrl =
        typeof artist.image === 'string'
          ? artist.image
          : (artist.image as Media)?.url || ''
    }

    return {
      title: artist.seo?.metaTitle || defaultTitle,
      description: artist.seo?.metaDescription || defaultDescription,
      keywords,
      alternates: { canonical: `${siteUrl}/artists/${slug}` },
      robots: { index: true, follow: true },
      openGraph: {
        title: artist.seo?.metaTitle || defaultTitle,
        description: artist.seo?.metaDescription || defaultDescription,
        url: `${siteUrl}/artists/${slug}`,
        siteName: 'Kawai Pianos',
        type: 'profile',
        locale: 'en_US',
        images: ogImageUrl
          ? [{ url: ogImageUrl, width: 1200, height: 630, alt: artist.name }]
          : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: artist.seo?.metaTitle || defaultTitle,
        description: artist.seo?.metaDescription || defaultDescription,
      },
    }
  } catch {
    return { title: 'KAWAI Artist | Kawai Pianos' }
  }
}

export default async function ArtistPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { isEnabled: isDraftMode } = await draftMode()

  const cmsPage = await getCMSArtistPage(slug)
  if (cmsPage?.layout?.length) {
    return (
      <div className="min-h-screen">
        <RenderBlocks blocks={cmsPage.layout} />
      </div>
    )
  }

  const artist = await getArtist(slug, isDraftMode)
  if (!artist) notFound()

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaius.com'

  // Resolve image — prioritise Media object, fallback to imageUrl, then placeholder
  const imageUrl = (() => {
    if (artist.image && typeof artist.image === 'object') {
      return (artist.image as Media).url || artist.imageUrl || '/images/defaults/artist-placeholder.jpg'
    }
    return artist.imageUrl || '/images/defaults/artist-placeholder.jpg'
  })()

  // Resolve kawaiModel for sidebar
  const kawaiModelData =
    artist.kawaiModel && typeof artist.kawaiModel === 'object'
      ? {
          name: (artist.kawaiModel as Product).name ?? null,
          slug: (artist.kawaiModel as Product).slug,
          imageUrl: (artist.kawaiModel as Product).imageUrl ?? null,
        }
      : null

  // Social URLs for schema sameAs
  const socialUrls = (artist.socialLinks ?? []).map((l: any) => l.url).filter(Boolean) as string[]

  // Enhanced JSON-LD @graph
  const personSchema = generatePersonSchema({
    name: artist.name,
    url: `${siteUrl}/artists/${artist.slug}`,
    sameAs: socialUrls,
    ...(artist.shortBio ? { description: artist.shortBio } : {}),
    ...(imageUrl !== '/images/defaults/artist-placeholder.jpg' ? { image: imageUrl } : {}),
    ...(artist.instrument ? { instrument: artist.instrument } : {}),
    ...(artist.genre ? { genre: artist.genre } : {}),
  })

  const awardsSchemas = (artist.achievements ?? []).map(a => ({
    '@type': 'Award',
    name: a.achievement,
    recipient: { '@type': 'Person', name: artist.name },
  }))

  const recentWorkSchemas = (artist.recentWork ?? []).map(w => ({
    '@type': 'CreativeWork',
    name: w.title,
    ...(w.description ? { description: w.description } : {}),
    ...(w.date ? { dateCreated: w.date } : {}),
    ...(w.link ? { url: w.link } : {}),
    creator: { '@type': 'Person', name: artist.name },
  }))

  const ldJson = {
    '@context': 'https://schema.org',
    '@graph': [personSchema, ...awardsSchemas, ...recentWorkSchemas],
  }

  return (
    <div className="min-h-screen bg-white">
      <AdminBarDoc
        collection="artists"
        id={String(artist.id)}
        collectionLabels={{ singular: 'Artist', plural: 'Artists' }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(ldJson).replace(/</g, '\\u003c'),
        }}
      />

      {/* 3-column layout — no separate hero, image carries the page */}
      <div className="bg-white">
        <ArtistProfileLayout
          sidebar={
            <ArtistSidebar
              name={artist.name}
              imageUrl={imageUrl}
              heroImageUrl={artist.heroImageUrl ?? null}
              genre={artist.genre ?? null}
              instrument={artist.instrument ?? null}
              region={artist.region ?? null}
              shortBio={artist.shortBio ?? null}
              isShigeruArtist={artist.isShigeruArtist ?? null}
              socialLinks={artist.socialLinks as any}
            />
          }
          main={
            <div className="space-y-5 lg:space-y-8 px-4 py-5 lg:px-0 lg:py-0">
              {/* Bio */}
              {artist.bio && (
                <div className="bg-white rounded-2xl border border-kawai-neutral/50 p-5 md:p-8 lg:p-10">
                  <p className="text-xs font-semibold uppercase tracking-widest text-kawai-red mb-4 lg:mb-6">
                    Biography
                  </p>
                  <LexicalSerializer content={artist.bio as any} />
                </div>
              )}

              {/* Featured Video */}
              {artist.featuredVideo?.youtubeId && (
                <div className="bg-white rounded-2xl border border-kawai-neutral/50 p-5 md:p-8 lg:p-10">
                  <p className="text-xs font-semibold uppercase tracking-widest text-kawai-red mb-3 lg:mb-4">
                    Featured Performance
                  </p>
                  <h2 className="text-xl lg:text-2xl font-bold text-kawai-black mb-4 lg:mb-6">
                    {artist.featuredVideo.title || 'Watch Live'}
                  </h2>
                  <div className="aspect-video rounded-xl overflow-hidden shadow-brand-premium">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${artist.featuredVideo.youtubeId}`}
                      title={artist.featuredVideo.title || 'Featured Performance'}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                </div>
              )}

              {/* Achievements (hidden on xl+ where right panel shows) */}
              {artist.achievements && artist.achievements.length > 0 && (
                <div className="xl:hidden bg-kawai-pearl rounded-2xl p-5 md:p-6">
                  <p className="text-xs font-semibold uppercase tracking-widest text-kawai-red mb-4">
                    Notable Achievements
                  </p>
                  <ul className="space-y-3">
                    {artist.achievements.map((a, i) => (
                      <li key={a.id ?? i} className="flex items-start gap-3 text-sm text-kawai-charcoal">
                        <Trophy className="w-4 h-4 text-kawai-gold shrink-0 mt-0.5" />
                        {a.achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Quote (hidden on xl+ where right panel shows) */}
              {artist.quote?.text && (
                <div className="xl:hidden bg-kawai-charcoal rounded-2xl p-5 md:p-6 relative overflow-hidden">
                  <span
                    className="absolute -top-2 -left-1 text-kawai-red text-[80px] font-serif leading-none opacity-20 select-none"
                    aria-hidden="true"
                  >
                    &ldquo;
                  </span>
                  <p className="relative italic text-white text-sm md:text-base leading-relaxed">
                    {artist.quote.text}
                  </p>
                </div>
              )}
            </div>
          }
          rightPanel={
            <ArtistRightPanel
              kawaiModel={kawaiModelData}
              achievements={artist.achievements as any}
              quote={artist.quote as any}
              region={artist.region ?? null}
              socialLinks={artist.socialLinks as any}
            />
          }
        />
      </div>

      {/* Photo Gallery */}
      {artist.gallery && artist.gallery.length > 0 && (
        <ArtistGalleryCarousel
          gallery={artist.gallery as any}
          artistName={artist.name}
        />
      )}

      {/* Recent Work Carousel */}
      {artist.recentWork && artist.recentWork.length > 0 && (
        <RecentWorkCarousel
          works={artist.recentWork as any}
          artistName={artist.name}
        />
      )}

      {/* Footer CTA */}
      <section className="bg-kawai-charcoal py-20">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col items-center gap-10">
          {/* Logo */}
          <img
            src="/images/instrumental-to-life-logo.svg"
            alt="Instrumental to Life — KAWAI"
            className="w-56 md:w-72 opacity-90"
          />

          {/* Two CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/artists"
              className="inline-flex items-center border border-white/25 text-white hover:border-white/60 hover:bg-white/5 transition-all duration-200 rounded-full px-7 py-3 text-sm font-semibold tracking-wide"
            >
              All Artists
            </Link>
            <Link
              href="/pianos"
              className="inline-flex items-center bg-kawai-red text-white hover:bg-kawai-red-700 transition-all duration-200 rounded-full px-7 py-3 text-sm font-semibold tracking-wide shadow-brand-red-glow"
            >
              Browse All Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
