import { Metadata } from 'next'
import type { Where } from 'payload'
import { BlogIndexClient } from '@/components/blog/BlogIndexClient'
import { getPayloadClient } from '@/lib/payload/queries'
import type { Post } from '@/payload-types'

export const revalidate = 300

interface BlogPageProps {
  searchParams: Promise<{ category?: string }>
}

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaipianos.com'
  return {
    title: 'The KAWAI Journal | Notes & Stories',
    description:
      'Explore our piano journal featuring education guides, product news, artist spotlights, maintenance tips, and more from KAWAI Piano Gallery.',
    alternates: { canonical: `${siteUrl}/blog` },
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

async function getPosts(category?: string): Promise<PostsResult> {
  try {
    const payload = await getPayloadClient()

    const baseWhere: Where = {
      status: { equals: 'published' },
    }

    if (category) {
      baseWhere['categories'] = { contains: category }
    }

    // Run both queries in parallel
    const [featuredResult, allResult] = await Promise.all([
      // Query 1: find the featured post (limit 1)
      payload.find({
        collection: 'posts',
        where: {
          ...baseWhere,
          featured: { equals: true },
        },
        limit: 1,
        sort: '-publishedDate',
        depth: 2,
        overrideAccess: true,
      }),
      // Query 2: all published posts sorted by date
      payload.find({
        collection: 'posts',
        where: baseWhere,
        limit: 50,
        sort: '-publishedDate',
        depth: 2,
        overrideAccess: true,
      }),
    ])

    const featuredPost = (featuredResult.docs[0] as Post) ?? null
    const allPosts = allResult.docs as Post[]

    // Use the featured post as hero; fall back to first chronological post
    const heroPost: Post | null = featuredPost ?? allPosts[0] ?? null

    // Exclude the hero from the grid to avoid duplication
    const heroId = heroPost?.id
    const gridPosts = heroId ? allPosts.filter((p) => p.id !== heroId) : allPosts

    return { featuredPost: heroPost, gridPosts }
  } catch (error) {
    console.error('Error fetching posts:', error)
    return { featuredPost: null, gridPosts: [] }
  }
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { category } = await searchParams
  const { featuredPost, gridPosts } = await getPosts(category)

  // Determine whether the hero is a truly featured post (has featured flag set)
  const heroIsFeatured = featuredPost?.featured === true

  return (
    <BlogIndexClient
      featuredPost={featuredPost}
      heroIsFeatured={heroIsFeatured}
      gridPosts={gridPosts}
      {...(category !== undefined && { category })}
    />
  )
}
