import type { MarketingBlogGridBlock } from '@/payload-types'
import type { Post } from '@/payload-types'
import { getPayloadClient } from '@/lib/payload/queries'
import { BlogGridClient } from '@/components/blog/BlogGridClient'

export async function BlogGridBlock({
  heading,
  tagline,
  postLimit,
  showFeatured,
  showHeading,
  youtubeUrl,
}: MarketingBlogGridBlock) {
  const limit = postLimit ?? 6

  let featuredPost: Post | null = null
  let gridPosts: Post[] = []

  try {
    const payload = await getPayloadClient()

    const [featuredResult, allResult] = await Promise.all([
      payload.find({
        collection: 'posts',
        where: {
          status: { equals: 'published' },
          featured: { equals: true },
        },
        limit: 1,
        sort: '-publishedDate',
        depth: 2,
        overrideAccess: true,
      }),
      payload.find({
        collection: 'posts',
        where: {
          status: { equals: 'published' },
        },
        limit: limit + 1, // +1 so we can exclude the hero from the grid without under-fetching
        sort: '-publishedDate',
        depth: 2,
        overrideAccess: true,
      }),
    ])

    const hero: Post | null = (featuredResult.docs[0] as Post) ?? (allResult.docs[0] as Post) ?? null
    const allPosts = allResult.docs as Post[]

    const heroId = hero?.id
    const remaining = heroId ? allPosts.filter((p) => p.id !== heroId) : allPosts

    featuredPost = hero
    gridPosts = remaining.slice(0, limit)
  } catch (error) {
    console.error('[BlogGridBlock] Error fetching posts:', error)
  }

  const heroIsFeatured = featuredPost?.featured === true

  return (
    <BlogGridClient
      heading={heading ?? 'The KAWAI Journal'}
      tagline={
        tagline ??
        'Notes on craft, artistry, and the enduring world of the piano'
      }
      featuredPost={featuredPost}
      heroIsFeatured={heroIsFeatured}
      gridPosts={gridPosts}
      showFeatured={showFeatured ?? true}
      showHeading={showHeading ?? true}
      youtubeUrl={youtubeUrl ?? null}
    />
  )
}
