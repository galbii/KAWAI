import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload/queries'
import { getImagePropsWithFallback } from '@/lib/media/r2-utils'
import type { Artist, Media, Product } from '@/payload-types'
import { cn } from '@/lib/utils'
import { Instagram, Youtube, Music, Globe, Facebook, Twitter, Linkedin } from 'lucide-react'

// Enable ISR with 15-minute revalidation
export const revalidate = 900

// Pre-generate all active artist pages at build time
export async function generateStaticParams() {
  try {
    const payload = await getPayloadClient()

    const artists = await payload.find({
      collection: 'artists',
      where: {
        isActive: {
          equals: true
        }
      },
      limit: 100,
      select: {
        slug: true
      }
    })

    console.log(`✅ [SEO] Pre-rendering ${artists.docs.length} artist pages for Google indexing`)

    return artists.docs.map((artist: any) => ({
      slug: artist.slug
    }))
  } catch (error) {
    console.error('❌ [SEO] Error generating static params for artists:', error)
    return []
  }
}

async function getArtist(slug: string) {
  try {
    const payload = await getPayloadClient()

    const artists = await payload.find({
      collection: 'artists',
      where: {
        and: [
          {
            slug: {
              equals: slug
            }
          },
          {
            isActive: {
              equals: true
            }
          }
        ]
      },
      limit: 1
    })

    if (!artists.docs.length) {
      return null
    }

    return artists.docs[0] as Artist
  } catch (error) {
    console.error('Error fetching artist:', error)
    return null
  }
}

// Generate metadata for SEO
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  try {
    const { slug } = await params
    const artist = await getArtist(slug)

    if (!artist) {
      return {
        title: 'Artist Not Found',
        description: 'The requested artist could not be found.',
        robots: {
          index: false,
          follow: false,
        }
      }
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaipianos.com'
    const defaultTitle = `${artist.name} | KAWAI Artist`
    const defaultDescription = artist.shortBio || `Discover ${artist.name}, a talented musician who performs on KAWAI pianos. Explore their profile, performances, and connection to KAWAI.`

    // Get OG image
    let ogImageUrl = ''
    if (artist.seo?.ogImage) {
      ogImageUrl = typeof artist.seo.ogImage === 'string'
        ? artist.seo.ogImage
        : (artist.seo.ogImage as Media)?.url || ''
    } else if (artist.image) {
      ogImageUrl = typeof artist.image === 'string'
        ? artist.image
        : (artist.image as Media)?.url || ''
    }

    return {
      title: artist.seo?.metaTitle || defaultTitle,
      description: artist.seo?.metaDescription || defaultDescription,
      keywords: artist.seo?.keywords,
      alternates: {
        canonical: `${siteUrl}/artists/${slug}`
      },
      robots: {
        index: true,
        follow: true,
      },
      openGraph: {
        title: artist.seo?.metaTitle || defaultTitle,
        description: artist.seo?.metaDescription || defaultDescription,
        url: `${siteUrl}/artists/${slug}`,
        siteName: 'KAWAI Pianos',
        type: 'profile',
        locale: 'en_US',
        images: ogImageUrl ? [{
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: artist.name,
        }] : []
      },
      twitter: {
        card: 'summary_large_image',
        title: artist.seo?.metaTitle || defaultTitle,
        description: artist.seo?.metaDescription || defaultDescription,
      }
    }
  } catch (error) {
    console.error(`[SEO] Error generating metadata for artist:`, error)
    return {
      title: 'KAWAI Artist | KAWAI Pianos',
      description: 'Discover talented musicians who perform on KAWAI pianos.',
    }
  }
}

function getSocialIcon(platform: string) {
  const iconClass = "w-5 h-5"

  switch (platform) {
    case 'instagram':
      return <Instagram className={iconClass} />
    case 'youtube':
      return <Youtube className={iconClass} />
    case 'spotify':
    case 'apple-music':
    case 'soundcloud':
    case 'bandcamp':
      return <Music className={iconClass} />
    case 'facebook':
      return <Facebook className={iconClass} />
    case 'twitter':
      return <Twitter className={iconClass} />
    case 'linkedin':
      return <Linkedin className={iconClass} />
    case 'website':
      return <Globe className={iconClass} />
    default:
      return <Globe className={iconClass} />
  }
}

function getPlatformLabel(platform: string): string {
  const labels: Record<string, string> = {
    'website': 'Website',
    'instagram': 'Instagram',
    'youtube': 'YouTube',
    'spotify': 'Spotify',
    'apple-music': 'Apple Music',
    'soundcloud': 'SoundCloud',
    'facebook': 'Facebook',
    'twitter': 'X / Twitter',
    'tiktok': 'TikTok',
    'linkedin': 'LinkedIn',
    'bandcamp': 'Bandcamp',
    'other': 'Link'
  }
  return labels[platform] || platform
}

// Serialize rich text content to plain HTML
function serializeRichText(content: any): string {
  if (!content || !content.root) return ''

  function serializeNode(node: any): string {
    if (!node) return ''

    if (node.type === 'text') {
      let text = node.text || ''
      // Lexical format is a bitmask number, not an array
      // 1 = bold, 2 = italic, 4 = strikethrough, 8 = underline, etc.
      const format = node.format || 0
      if (format & 1) text = `<strong>${text}</strong>` // bold
      if (format & 2) text = `<em>${text}</em>` // italic
      if (format & 8) text = `<u>${text}</u>` // underline
      if (format & 4) text = `<s>${text}</s>` // strikethrough
      return text
    }

    if (node.children) {
      const childrenHtml = node.children.map((child: any) => serializeNode(child)).join('')

      switch (node.type) {
        case 'paragraph':
          return `<p class="mb-4 text-gray-700 leading-relaxed">${childrenHtml}</p>`
        case 'heading':
          const level = node.tag || 'h2'
          const headingClasses = level === 'h1' ? 'text-3xl font-bold text-kawai-charcoal mt-10 mb-6' :
                                 level === 'h2' ? 'text-2xl font-bold text-kawai-charcoal mt-8 mb-4' :
                                 'text-xl font-bold text-kawai-charcoal mt-6 mb-3'
          return `<${level} class="${headingClasses}">${childrenHtml}</${level}>`
        case 'list':
          const listTag = node.listType === 'number' ? 'ol' : 'ul'
          const listClass = node.listType === 'number' ? 'list-decimal list-inside mb-4 space-y-2 text-gray-700' : 'list-disc list-inside mb-4 space-y-2 text-gray-700'
          return `<${listTag} class="${listClass}">${childrenHtml}</${listTag}>`
        case 'listitem':
          return `<li>${childrenHtml}</li>`
        case 'link':
          return `<a href="${node.url || '#'}" class="text-kawai-red hover:underline" target="_blank" rel="noopener noreferrer">${childrenHtml}</a>`
        case 'quote':
          return `<blockquote class="border-l-4 border-kawai-red pl-4 py-2 mb-4 italic text-gray-600">${childrenHtml}</blockquote>`
        default:
          return childrenHtml
      }
    }

    return ''
  }

  return serializeNode(content.root)
}

export default async function ArtistPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const artist = await getArtist(slug)

  if (!artist) {
    notFound()
  }

  // Get image URL directly without preset dimensions since we're using fill
  const imageUrl = (() => {
    if (artist.image && typeof artist.image === 'object') {
      return (artist.image as Media).url || artist.imageUrl || '/images/defaults/artist-placeholder.jpg'
    }
    return artist.imageUrl || '/images/defaults/artist-placeholder.jpg'
  })()

  const bioHtml = artist.bio ? serializeRichText(artist.bio) : ''

  return (
    <div className="min-h-screen bg-gradient-to-br from-kawai-pearl via-white to-gray-50">
      {/* Hero Section */}
      <section className="relative bg-kawai-charcoal text-white overflow-hidden">
        <div className="container mx-auto px-6 py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Artist Image */}
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={imageUrl}
                alt={artist.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Artist Info */}
            <div>
              <div className="mb-6">
                <Link
                  href="/artists"
                  className="inline-flex items-center gap-2 text-kawai-red hover:text-kawai-red/80 transition-colors mb-6 group"
                >
                  <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="font-medium">Back to Artists</span>
                </Link>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold mb-4">
                {artist.name}
              </h1>

              <div className="flex gap-3 mb-6 flex-wrap">
                {artist.genre && (
                  <span className="bg-kawai-red/20 text-white px-4 py-2 rounded-full text-sm font-medium">
                    {artist.genre.charAt(0).toUpperCase() + artist.genre.slice(1)}
                  </span>
                )}
                {artist.instrument && (
                  <span className="bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium">
                    {artist.instrument.charAt(0).toUpperCase() + artist.instrument.slice(1)} Piano
                  </span>
                )}
              </div>

              {artist.shortBio && (
                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  {artist.shortBio}
                </p>
              )}

              {/* Social Links */}
              {artist.socialLinks && artist.socialLinks.length > 0 && (
                <div className="flex gap-3 flex-wrap">
                  {artist.socialLinks.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors backdrop-blur-sm"
                      title={link.label || getPlatformLabel(link.platform || '')}
                    >
                      {getSocialIcon(link.platform || 'website')}
                      <span className="text-sm font-medium">
                        {link.label || getPlatformLabel(link.platform || '')}
                      </span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Biography Section */}
      {bioHtml && (
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-kawai-charcoal mb-8">
                Biography
              </h2>
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: bioHtml }}
              />
            </div>
          </div>
        </section>
      )}

      {/* Achievements Section */}
      {artist.achievements && artist.achievements.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-kawai-charcoal mb-8">
                Notable Achievements
              </h2>
              <ul className="grid md:grid-cols-2 gap-4">
                {artist.achievements.map((achievement, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 bg-kawai-pearl p-4 rounded-lg"
                  >
                    <svg className="w-6 h-6 text-kawai-red flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-gray-700">{achievement.achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Featured Video Section */}
      {artist.featuredVideo?.youtubeId && (
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-kawai-charcoal mb-8">
                {artist.featuredVideo.title || 'Featured Performance'}
              </h2>
              <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
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
          </div>
        </section>
      )}

      {/* KAWAI Piano Section */}
      {artist.kawaiModel && (
        <section className="py-16 bg-kawai-charcoal text-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {artist.name}'s KAWAI Piano
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                {typeof artist.kawaiModel === 'object' && (artist.kawaiModel as Product).name}
              </p>
              <Link
                href={`/products/${typeof artist.kawaiModel === 'object' ? (artist.kawaiModel as Product).slug : ''}`}
                className="inline-flex items-center gap-2 bg-kawai-red text-white px-8 py-4 rounded-lg hover:bg-kawai-red/90 transition-colors font-medium shadow-lg hover:shadow-xl"
              >
                Explore This Piano
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-kawai-pearl to-white rounded-2xl p-12 text-center shadow-xl">
            <h2 className="text-3xl md:text-4xl font-bold text-kawai-charcoal mb-4">
              Explore More KAWAI Artists
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Discover other talented musicians who perform on KAWAI pianos
            </p>
            <Link
              href="/artists"
              className="inline-flex items-center gap-2 bg-kawai-red text-white px-8 py-4 rounded-lg hover:bg-kawai-red/90 transition-colors font-medium shadow-lg hover:shadow-xl"
            >
              View All Artists
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
