import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import type { Post, User } from '@/payload-types'
import { resolveMediaUrl } from '@/lib/payload'
import { getPayloadClient } from '@/lib/payload/queries'
import { LivePreviewPost } from '@/components/blog/LivePreviewPost'
import { ReadingProgressBar } from '@/components/blog/ReadingProgressBar'
import { StickyHeaderBar } from '@/components/blog/StickyHeaderBar'
import { ArticleSidebar } from '@/components/blog/ArticleSidebar'
import { RelatedPosts } from '@/components/blog/RelatedPosts'
import { BlogPostClient } from '@/components/blog/BlogPostClient'

// ISR — revalidate every 5 minutes
export const revalidate = 300

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

async function getPostBySlug(slug: string, isDraft: boolean = false): Promise<Post | null> {
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
      overrideAccess: true, // Posts has no versioning — authenticatedOrPublished returns { _status: ... }
    })                      // which would throw since _status doesn't exist. Filter by status in where instead.

    return posts.docs[0] ?? null
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
}

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

    const featuredImageUrl = resolveMediaUrl(post.featuredImage)
    const hasFeaturedImage = featuredImageUrl && featuredImageUrl !== ''

    const formattedDate = post.publishedDate
      ? new Date(post.publishedDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : null

    const authorName =
      Array.isArray(post.authors) && post.authors.length > 0 && typeof post.authors[0] === 'object'
        ? (post.authors[0] as User).email || 'KAWAI Piano Gallery'
        : 'KAWAI Piano Gallery'

    const categoryLabels: Record<string, string> = {
      education: 'Piano Education',
      'product-news': 'Product News',
      artists: 'Artist Spotlights',
      maintenance: 'Maintenance & Care',
      'buying-guides': 'Buying Guides',
      events: 'Events',
      'company-news': 'Company News',
      technology: 'Technology',
    }

    const wordCount = post.excerpt?.split(' ').length || 0
    const readTime = Math.ceil(wordCount / 200) || 5

    const firstCategory = post.categories?.[0]
    const primaryCategory =
      typeof firstCategory === 'object' && firstCategory !== null
        ? firstCategory.slug || ''
        : typeof firstCategory === 'string'
          ? firstCategory
          : ''
    const categoryLabel = categoryLabels[primaryCategory] || primaryCategory

    return (
      <LivePreviewPost post={post} isDraftMode={isDraftMode}>
        {/* Reading Progress Bar */}
        <ReadingProgressBar />

        {/* Sticky Header Bar */}
        <StickyHeaderBar title={post.title} category={categoryLabel} readTime={readTime} />

        <BlogPostClient
          post={post}
          featuredImageUrl={featuredImageUrl}
          hasFeaturedImage={!!hasFeaturedImage}
          formattedDate={formattedDate}
          authorName={authorName}
          categoryLabels={categoryLabels}
          readTime={readTime}
          sidebarSlot={<ArticleSidebar post={post} />}
          relatedPostsSlot={
            post.relatedPosts && post.relatedPosts.length > 0
              ? <RelatedPosts relatedPosts={post.relatedPosts} />
              : null
          }
        />
      </LivePreviewPost>
    )
  } catch (error) {
    console.error('Error loading blog post page:', error)
    notFound()
  }
}
