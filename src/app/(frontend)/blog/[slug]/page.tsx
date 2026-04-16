import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import { unstable_cache } from 'next/cache'
import { Suspense } from 'react'
import type { Post } from '@/payload-types'
import { resolveMediaUrl } from '@/lib/payload'
import { getPayloadClient } from '@/lib/payload/queries'
import { getSiteAlternates } from '@/lib/site-context'
import { LivePreviewPost } from '@/components/blog/LivePreviewPost'
import { ArticleSidebar } from '@/components/blog/ArticleSidebar'
import { RelatedPosts } from '@/components/blog/RelatedPosts'
import { AdminBarDoc } from '@/components/layout/AdminBarDoc'

// ISR — revalidate every 5 minutes
export const revalidate = 300

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

async function _fetchPostBySlug(slug: string, isDraft: boolean): Promise<Post | null> {
  try {
    const payload = await getPayloadClient()
    const posts = await payload.find({
      collection: 'posts',
      where: {
        slug: { equals: slug },
        ...(isDraft ? {} : { status: { equals: 'published' } }),
      },
      limit: 1,
      depth: 2,
      draft: isDraft,
      overrideAccess: true, // Posts has no versioning — authenticatedOrPublished uses _status which doesn't exist
    })
    return posts.docs[0] ?? null
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
}

function getPostBySlug(slug: string, isDraft: boolean = false): Promise<Post | null> {
  // Never cache draft mode — editor must see live data.
  if (isDraft) return _fetchPostBySlug(slug, true)

  // Cached for production: generateMetadata and BlogPostPage both call this
  // function. unstable_cache deduplicates the MongoDB hit so only one query
  // runs per ISR revalidation cycle regardless of how many callers there are.
  return unstable_cache(
    () => _fetchPostBySlug(slug, false),
    [`post-${slug}`],
    { tags: ['posts', `post-${slug}`], revalidate: 300 },
  )()
}

export async function generateMetadata(props: BlogPostPageProps): Promise<Metadata> {
  const params = await props.params
  const { slug } = params
  const post = await getPostBySlug(slug)

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.',
      robots: { index: false, follow: false },
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaius.com'

  const metaTitle = post.seo?.metaTitle || post.title
  const metaDescription = post.seo?.metaDescription || post.excerpt || post.title

  let ogImageUrl = ''
  if (post.seo?.ogImage) {
    ogImageUrl = resolveMediaUrl(post.seo.ogImage)
  } else if (post.featuredImage) {
    ogImageUrl = resolveMediaUrl(post.featuredImage)
  }

  return {
    title: metaTitle,
    description: metaDescription,
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
    alternates: {
      canonical: `${siteUrl}/blog/${slug}`,
      languages: getSiteAlternates(`/blog/${slug}`),
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: `${siteUrl}/blog/${slug}`,
      images: ogImageUrl ? [{ url: ogImageUrl }] : [],
      type: 'article',
      publishedTime: post.publishedDate || undefined,
      modifiedTime: post.updatedAt,
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

export async function generateStaticParams() {
  try {
    const payload = await getPayloadClient()

    const posts = await payload.find({
      collection: 'posts',
      where: { status: { equals: 'published' } },
      select: { slug: true },
      depth: 0,
      limit: 500,
      overrideAccess: true,
    })

    return posts.docs.map((post) => ({ slug: post.slug }))
  } catch (error) {
    console.error('Error generating static params for blog posts:', error)
    return []
  }
}

export default async function BlogPostPage(props: BlogPostPageProps) {
  try {
    const params = await props.params
    const { slug } = params

    const { isEnabled: isDraftMode } = await draftMode()
    const post = await getPostBySlug(slug, isDraftMode)

    if (!post) {
      notFound()
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaius.com'

    let ogImageUrl = ''
    if (post.seo?.ogImage) {
      ogImageUrl = resolveMediaUrl(post.seo.ogImage)
    } else if (post.featuredImage) {
      ogImageUrl = resolveMediaUrl(post.featuredImage)
    }

    const authors = (post.populatedAuthors ?? [])
      .filter((a): a is { id?: string | null; name?: string | null } => Boolean(a?.name))
      .map((a) => ({ '@type': 'Person', name: a.name, url: `${siteUrl}/blog` }))

    // Estimate reading time from excerpt word count (200 wpm, min 2 min)
    const wordCount = (post.excerpt ?? '').split(/\s+/).filter(Boolean).length
    const readMinutes = Math.max(2, Math.round(wordCount / 200))

    const articleSchema = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt ?? post.title,
      url: `${siteUrl}/blog/${slug}`,
      ...(ogImageUrl && { image: ogImageUrl }),
      ...(post.publishedDate && { datePublished: post.publishedDate }),
      dateModified: post.updatedAt,
      timeRequired: `PT${readMinutes}M`,
      ...(authors.length > 0 && { author: authors.length === 1 ? authors[0] : authors }),
      publisher: {
        '@type': 'Organization',
        name: 'KAWAI Piano',
        url: siteUrl,
      },
    }

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteUrl}/blog` },
        { '@type': 'ListItem', position: 3, name: post.title, item: `${siteUrl}/blog/${slug}` },
      ],
    }

    // RSC slots — server-rendered once, refreshed on save via RefreshRouteOnSave.
    // Layout blocks are now rendered client-side by RenderBlocksClient in LivePreviewPost
    // so they update in real-time as the editor types (no slot needed for layout).
    const sidebarSlot = <ArticleSidebar post={post} />

    // RelatedPosts is an async server component that runs its own DB query.
    // Wrapping in Suspense lets the article body stream to the user immediately
    // while related posts resolve independently below the fold.
    const relatedPostsSlot =
      post.relatedPosts && post.relatedPosts.length > 0 ? (
        <Suspense fallback={null}>
          <RelatedPosts relatedPosts={post.relatedPosts} />
        </Suspense>
      ) : null

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <AdminBarDoc
          collection="posts"
          id={String(post.id)}
          collectionLabels={{ singular: 'Post', plural: 'Posts' }}
        />
        <LivePreviewPost
          initialPost={post}
          isDraftMode={isDraftMode}
          sidebarSlot={sidebarSlot}
          relatedPostsSlot={relatedPostsSlot}
        />
      </>
    )
  } catch (error) {
    console.error('Error loading blog post page:', error)
    notFound()
  }
}
