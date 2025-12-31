import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import Image from 'next/image'
import type { Post, User, Media } from '@/payload-types'
import { resolveMediaUrl } from '@/lib/payload'
import { BlocksList } from '@/lib/blocks/BlockRenderer'
import { LivePreviewPost } from '@/components/blog/LivePreviewPost'
import { ReadingProgressBar } from '@/components/blog/ReadingProgressBar'
import { StickyHeaderBar } from '@/components/blog/StickyHeaderBar'
import { ArticleSidebar } from '@/components/blog/ArticleSidebar'

// Use ISR (Incremental Static Regeneration) for better SEO and performance
// Pages are statically generated and revalidated every 5 minutes
export const revalidate = 300

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

// Fetch post by slug
async function getPostBySlug(slug: string, isDraft: boolean = false): Promise<Post | null> {
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
        // In draft mode, show all posts. In production, only show published
        ...(isDraft ? {} : { status: { equals: 'published' } }),
      },
      limit: 1,
      depth: 2, // Populate relationships (author, media)
      draft: isDraft, // Enable draft content when in preview mode
      overrideAccess: isDraft, // Bypass access control in preview mode
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

    // Check if draft mode is enabled
    const { isEnabled: isDraftMode } = await draftMode()

    console.log(`[Blog Post Page] Loading post: slug="${slug}", isDraftMode=${isDraftMode}`)

    const post = await getPostBySlug(slug, isDraftMode)

    if (!post) {
      console.error(`[Blog Post Page] Post not found: slug="${slug}", isDraftMode=${isDraftMode}`)
      notFound()
    }

    console.log(`[Blog Post Page] Post loaded successfully: title="${post.title}", status=${post.status}`)

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

    // Calculate read time (estimate: 200 words per minute)
    const wordCount = post.excerpt?.split(' ').length || 0
    const readTime = Math.ceil(wordCount / 200) || 5 // Default to 5 min

    // Get first category for display
    const primaryCategory = post.categories?.[0] || ''
    const categoryLabel = categoryLabels[primaryCategory] || primaryCategory

    return (
      <LivePreviewPost post={post} isDraftMode={isDraftMode}>
        {/* Reading Progress Bar */}
        <ReadingProgressBar />

        {/* Sticky Header Bar */}
        <StickyHeaderBar
          title={post.title}
          category={categoryLabel}
          readTime={readTime}
        />

      <div className="min-h-screen bg-kawai-pearl">
        {/* Cinematic Hero Section */}
        {hasFeaturedImage && (
          <div
            className="relative w-full h-[50vh] md:h-[60vh] lg:h-[65vh] bg-gray-900"
            data-blog-hero
          >
            <Image
              src={featuredImageUrl}
              alt={post.title}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            {/* Gradient overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

            {/* Hero Content */}
            <div className="absolute inset-0 flex flex-col justify-end">
              <div className="max-w-7xl mx-auto w-full px-6 md:px-12 lg:px-16 pb-12 md:pb-16">
                {/* Category badges */}
                {post.categories && post.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {post.categories.slice(0, 3).map((category) => (
                      <span
                        key={category}
                        className="inline-block px-3 py-1.5 text-xs font-semibold uppercase tracking-wider bg-kawai-red/90 text-white rounded-full backdrop-blur-sm"
                      >
                        {categoryLabels[category] || category}
                      </span>
                    ))}
                  </div>
                )}

                {/* Title */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight max-w-5xl">
                  {post.title}
                </h1>

                {/* Metadata strip */}
                <div className="mt-6 flex flex-wrap items-center gap-4 text-white/80 text-sm">
                  <span>{authorName}</span>
                  {formattedDate && (
                    <>
                      <span>•</span>
                      <time dateTime={post.publishedDate || undefined}>
                        {formattedDate}
                      </time>
                    </>
                  )}
                  <span>•</span>
                  <span>{readTime} min read</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Two-Column Article Layout */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Main Content Column */}
            <article className="flex-1 min-w-0">
              <div className="max-w-3xl mx-auto lg:mx-0 bg-white rounded-lg shadow-sm p-8 md:p-12">

                {/* Rich Text Content */}
                {post.content && (
                  <div className="prose prose-lg max-w-none">
                    {/* Lead paragraph (excerpt) */}
                    {post.excerpt && (
                      <p className="text-xl font-medium text-gray-800 leading-relaxed mb-8">
                        {post.excerpt}
                      </p>
                    )}

                    {/* Placeholder for rich text content - Phase 2 will add Lexical serializer */}
                    <div className="text-lg text-gray-700 leading-relaxed space-y-6">
                      <p>
                        Rich text content will be rendered here by the Lexical serializer (Phase 2).
                      </p>
                      <p className="text-gray-600 italic text-base">
                        For now, this is placeholder text to demonstrate the layout and typography system.
                      </p>
                    </div>
                  </div>
                )}

                {/* Content Blocks (if any) */}
                {post.contentBlocks && post.contentBlocks.length > 0 && (
                  <div className="mt-12 space-y-8">
                    {/* TODO: Render content blocks in Phase 2 */}
                    <p className="text-sm text-gray-500 italic">
                      Content blocks will render here (Image, Video, Spacer, etc.)
                    </p>
                  </div>
                )}

                {/* Back to Blog Link */}
                <div className="mt-16 pt-8 border-t border-gray-200">
                  <a
                    href="/blog"
                    className="inline-flex items-center text-kawai-red hover:text-kawai-red/80 font-medium transition-colors"
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
              </div>
            </article>

            {/* Sidebar Column (desktop only) */}
            <ArticleSidebar post={post} />
          </div>
        </div>
      </div>
      </LivePreviewPost>
    )
  } catch (error) {
    console.error('Error loading blog post page:', error)
    notFound()
  }
}
