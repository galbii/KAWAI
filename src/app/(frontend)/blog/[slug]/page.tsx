import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import type { Post, User, Media } from '@/payload-types'
import { resolveMediaUrl } from '@/lib/payload'
import { BlocksList } from '@/lib/blocks/BlockRenderer'

// Use ISR (Incremental Static Regeneration) for better SEO and performance
// Pages are statically generated and revalidated every 5 minutes
export const revalidate = 300

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

// Fetch post by slug
async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const { getPayload } = await import('payload')
    const configPromise = await import('@payload-config')
    const payload = await getPayload({ config: configPromise.default })

    const posts = await payload.find({
      collection: 'posts',
      where: {
        slug: {
          equals: slug,
        },
        status: {
          equals: 'published',
        },
      },
      limit: 1,
      depth: 2, // Populate relationships (author, media)
    })

    return posts.docs[0] || null
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
}

// Generate metadata for dynamic post pages
export async function generateMetadata(props: BlogPostPageProps): Promise<Metadata> {
  const params = await props.params
  const { slug } = params
  const post = await getPostBySlug(slug)

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.',
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaipianos.com'

  // Use SEO overrides if available, otherwise fallback to defaults
  const metaTitle = post.seo?.metaTitle || post.title
  const metaDescription = post.seo?.metaDescription || post.excerpt || post.title

  // Resolve OG image (use seo.ogImage, then featuredImage, then default)
  let ogImageUrl = ''
  if (post.seo?.ogImage) {
    ogImageUrl = resolveMediaUrl(post.seo.ogImage)
  } else if (post.featuredImage) {
    ogImageUrl = resolveMediaUrl(post.featuredImage)
  }

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: {
      canonical: `${siteUrl}/blog/${slug}`,
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: `${siteUrl}/blog/${slug}`,
      images: ogImageUrl ? [{ url: ogImageUrl }] : [],
      type: 'article',
      publishedTime: post.publishedDate || undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: ogImageUrl ? [ogImageUrl] : [],
    },
    keywords: post.seo?.keywords || post.tags || undefined,
  }
}

// Pre-generate all published post pages at build time for optimal SEO
export async function generateStaticParams() {
  try {
    const { getPayload } = await import('payload')
    const configPromise = await import('@payload-config')
    const payload = await getPayload({ config: configPromise.default })

    const posts = await payload.find({
      collection: 'posts',
      where: {
        status: {
          equals: 'published',
        },
      },
      limit: 500,
      select: {
        slug: true,
      },
    })

    console.log(`✅ [SEO] Pre-rendering ${posts.docs.length} blog post pages for Google indexing`)

    return posts.docs.map((post) => ({
      slug: post.slug,
    }))
  } catch (error) {
    console.error('❌ [SEO] Error generating static params for blog posts:', error)
    return []
  }
}

// Blog post detail page component
export default async function BlogPostPage(props: BlogPostPageProps) {
  try {
    const params = await props.params
    const { slug } = params
    const post = await getPostBySlug(slug)

    if (!post) {
      notFound()
    }

    // Resolve featured image
    const featuredImageUrl = resolveMediaUrl(post.featuredImage)
    const hasFeaturedImage = featuredImageUrl && featuredImageUrl !== ''

    // Format publish date
    const formattedDate = post.publishedDate
      ? new Date(post.publishedDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : null

    // Get author name
    const authorName = typeof post.author === 'object' && post.author !== null
      ? (post.author as User).email || 'KAWAI Piano Gallery'
      : 'KAWAI Piano Gallery'

    // Category labels
    const categoryLabels: Record<string, string> = {
      'education': 'Piano Education',
      'product-news': 'Product News',
      'artists': 'Artist Spotlights',
      'maintenance': 'Maintenance & Care',
      'buying-guides': 'Buying Guides',
      'events': 'Events',
      'company-news': 'Company News',
      'technology': 'Technology',
    }

    return (
      <div className="min-h-screen bg-kawai-pearl">
        {/* Featured Image Hero */}
        {hasFeaturedImage && (
          <div className="relative w-full h-[400px] md:h-[500px] bg-gray-900">
            <Image
              src={featuredImageUrl}
              alt={post.title}
              fill
              priority
              className="object-cover opacity-90"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        )}

        {/* Article Container */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Article Header */}
          <header className={hasFeaturedImage ? '-mt-32 relative z-10 mb-12' : 'mb-12'}>
            <div className={hasFeaturedImage ? 'bg-white rounded-lg shadow-lg p-8' : ''}>
              {/* Categories */}
              {post.categories && post.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.categories.map((category) => (
                    <span
                      key={category}
                      className="inline-block px-3 py-1 text-sm font-medium text-kawai-red bg-kawai-red/10 rounded"
                    >
                      {categoryLabels[category] || category}
                    </span>
                  ))}
                </div>
              )}

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-kawai-charcoal mb-4">
                {post.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span>{authorName}</span>
                </div>
                {formattedDate && (
                  <>
                    <span className="text-gray-400">•</span>
                    <time dateTime={post.publishedDate || undefined}>
                      {formattedDate}
                    </time>
                  </>
                )}
              </div>
            </div>
          </header>

          {/* Article Content */}
          <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
            {/* Rich Text Content */}
            {post.content && (
              <div className="prose prose-lg max-w-none mb-12">
                {/* TODO: Agent 3 will add proper rich text serializer */}
                {/* For now, display a placeholder */}
                <div className="text-gray-700 leading-relaxed">
                  {post.excerpt && (
                    <p className="text-xl font-medium text-gray-800 mb-6">
                      {post.excerpt}
                    </p>
                  )}
                  <p className="text-gray-600 italic">
                    Rich text content will be rendered here by the Lexical serializer.
                  </p>
                </div>
              </div>
            )}

            {/* Layout Blocks (optional additional content) */}
            {/* TODO: Add layout blocks to Post collection if needed */}
          </div>

          {/* Back to Blog Link */}
          <div className="mt-12">
            <a
              href="/blog"
              className="inline-flex items-center text-kawai-red hover:underline font-medium"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Blog
            </a>
          </div>
        </article>
      </div>
    )
  } catch (error) {
    console.error('Error loading blog post page:', error)
    notFound()
  }
}
