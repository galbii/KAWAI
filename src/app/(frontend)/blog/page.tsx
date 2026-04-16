import { Metadata } from 'next'
import type { Where } from 'payload'
import { draftMode } from 'next/headers'
import { unstable_cache } from 'next/cache'
import { BlogIndexClient } from '@/components/blog/BlogIndexClient'
import { getPayloadClient } from '@/lib/payload/queries'
import { getSiteAlternates } from '@/lib/site-context'
import { Hero as PageHero } from '@/components/Hero'
import { RenderBlocks } from '@/components/RenderBlocks'
import type { Post, Page } from '@/payload-types'

export const revalidate = 300

interface BlogPageProps {
  searchParams: Promise<{ category?: string }>
}

const getCachedBlogPage = unstable_cache(
  async (): Promise<Page | null> => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'pages',
      where: { slug: { equals: 'blog' }, _status: { equals: 'published' } },
      limit: 1,
      depth: 1,
      overrideAccess: true,
    })
    return (result.docs[0] as Page) ?? null
  },
  ['blog-page'],
  { tags: ['pages'], revalidate: 3600 },
)

async function getBlogPage(): Promise<Page | null> {
  const { isEnabled: isDraftMode } = await draftMode()
  if (isDraftMode) {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'pages',
      where: { slug: { equals: 'blog' } },
      limit: 1,
      depth: 1,
      draft: true,
      overrideAccess: true,
    })
    return (result.docs[0] as Page) ?? null
  }
  return getCachedBlogPage()
}

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaius.com'
  const page = await getBlogPage()

  if (page) {
    const metaTitle = page.seo?.metaTitle || `${page.title} | Kawai Pianos`
    const metaDescription = page.seo?.metaDescription || page.title
    return {
      title: { absolute: metaTitle },
      description: metaDescription,
      robots: { index: true, follow: true },
      alternates: {
        canonical: `${siteUrl}/blog`,
        languages: getSiteAlternates('/blog'),
      },
      openGraph: {
        title: metaTitle,
        description: metaDescription,
        url: `${siteUrl}/blog`,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: metaTitle,
        description: metaDescription,
      },
    }
  }

  return {
    title: 'The KAWAI Journal | Notes & Stories',
    description:
      'Explore our piano journal featuring education guides, product news, artist spotlights, maintenance tips, and more from KAWAI Piano Gallery.',
    robots: { index: true, follow: true },
    alternates: {
      canonical: `${siteUrl}/blog`,
      languages: getSiteAlternates('/blog'),
    },
    openGraph: {
      title: 'The KAWAI Journal | Notes & Stories',
      description:
        'Explore our piano journal featuring education guides, product news, artist spotlights, and more.',
      url: `${siteUrl}/blog`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'The KAWAI Journal | Notes & Stories',
      description:
        'Explore our piano journal featuring education guides, product news, artist spotlights, and more.',
    },
  }
}

interface PostsResult {
  featuredPost: Post | null
  gridPosts: Post[]
}

async function _fetchPosts(category?: string): Promise<PostsResult> {
  try {
    const payload = await getPayloadClient()

    const baseWhere: Where = { status: { equals: 'published' } }
    if (category) baseWhere['categories'] = { contains: category }

    // depth: 1 is enough — blog cards only need the featured image (one level).
    // depth: 2 was doubling MongoDB work with no benefit on the index page.
    const [featuredResult, allResult] = await Promise.all([
      payload.find({
        collection: 'posts',
        where: { ...baseWhere, featured: { equals: true } },
        limit: 1,
        sort: '-publishedDate',
        depth: 1,
        overrideAccess: true,
      }),
      payload.find({
        collection: 'posts',
        where: baseWhere,
        limit: 50,
        sort: '-publishedDate',
        depth: 1,
        overrideAccess: true,
      }),
    ])

    const featuredPost = (featuredResult.docs[0] as Post) ?? null
    const allPosts = allResult.docs as Post[]
    const heroPost: Post | null = featuredPost ?? allPosts[0] ?? null
    const heroId = heroPost?.id
    const gridPosts = heroId ? allPosts.filter((p) => p.id !== heroId) : allPosts

    return { featuredPost: heroPost, gridPosts }
  } catch (error) {
    console.error('Error fetching posts:', error)
    return { featuredPost: null, gridPosts: [] }
  }
}

function getPosts(category?: string): Promise<PostsResult> {
  return unstable_cache(
    () => _fetchPosts(category),
    [`blog-index-posts-${category ?? 'all'}`],
    { tags: ['posts'], revalidate: 300 },
  )()
}

const BLOG_DESCRIPTION =
  'Explore our piano journal featuring education guides, product news, artist spotlights, and more.'

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaius.com'
  const page = await getBlogPage()

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteUrl}/blog` },
    ],
  }

  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'The KAWAI Journal',
    description: BLOG_DESCRIPTION,
    url: `${siteUrl}/blog`,
    publisher: { '@type': 'Organization', name: 'KAWAI Piano', url: siteUrl },
  }

  const schemas = (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  )

  if (page) {
    return (
      <>
        {schemas}
        {page.hero && <PageHero hero={page.hero} />}
        {page.layout?.length ? <RenderBlocks blocks={page.layout} /> : null}
      </>
    )
  }

  const { category } = await searchParams
  const { featuredPost, gridPosts } = await getPosts(category)

  const heroIsFeatured = featuredPost?.featured === true

  return (
    <>
      {schemas}
      <BlogIndexClient
        featuredPost={featuredPost}
        heroIsFeatured={heroIsFeatured}
        gridPosts={gridPosts}
        {...(category !== undefined && { category })}
      />
    </>
  )
}
