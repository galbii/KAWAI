import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import type { Post } from '@/payload-types'
import { resolveMediaUrl } from '@/lib/payload'
import { getPayloadClient } from '@/lib/payload/queries'
import { LivePreviewPost } from '@/components/blog/LivePreviewPost'
import { ArticleSidebar } from '@/components/blog/ArticleSidebar'
import { RelatedPosts } from '@/components/blog/RelatedPosts'

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

    // RSC slots — server-rendered once, refreshed on save via RefreshRouteOnSave.
    // Layout blocks are now rendered client-side by RenderBlocksClient in LivePreviewPost
    // so they update in real-time as the editor types (no slot needed for layout).
    const sidebarSlot = <ArticleSidebar post={post} />

    const relatedPostsSlot =
      post.relatedPosts && post.relatedPosts.length > 0 ? (
        <RelatedPosts relatedPosts={post.relatedPosts} />
      ) : null

    return (
      <LivePreviewPost
        initialPost={post}
        isDraftMode={isDraftMode}
        sidebarSlot={sidebarSlot}
        relatedPostsSlot={relatedPostsSlot}
      />
    )
  } catch (error) {
    console.error('Error loading blog post page:', error)
    notFound()
  }
}
