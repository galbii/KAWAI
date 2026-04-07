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
  const pageSize = postLimit ?? 6

  let featuredPost: Post | null = null
  let allGridPosts: Post[] = []

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
      // Fetch all published posts for client-side pagination
      payload.find({
        collection: 'posts',
        where: {
          status: { equals: 'published' },
        },
        limit: 200,
        sort: '-publishedDate',
        depth: 2,
        overrideAccess: true,
      }),
    ])

    const hero: Post | null = (featuredResult.docs[0] as Post) ?? (allResult.docs[0] as Post) ?? null
    const allPosts = allResult.docs as Post[]

    // Exclude the hero from the grid so it doesn't appear twice
    const heroId = hero?.id
    allGridPosts = heroId ? allPosts.filter((p) => p.id !== heroId) : allPosts

    featuredPost = hero
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
      allGridPosts={allGridPosts}
      pageSize={pageSize}
      showFeatured={showFeatured ?? true}
      showHeading={showHeading ?? true}
      youtubeUrl={youtubeUrl ?? null}
    />
  )
}
