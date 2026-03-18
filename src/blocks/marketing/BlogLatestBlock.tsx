import type { MarketingBlogLatestBlock } from '@/payload-types'
import type { Post } from '@/payload-types'
import { getPayloadClient } from '@/lib/payload/queries'
import { BlogCardAnimated } from '@/components/blog/BlogCardAnimated'

export async function BlogLatestBlock({ postLimit, columns }: MarketingBlogLatestBlock) {
  const limit = postLimit ?? 3
  const cols = columns === '2' ? 2 : 3

  let posts: Post[] = []

  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'posts',
      where: { status: { equals: 'published' } },
      limit,
      sort: '-publishedDate',
      depth: 2,
      overrideAccess: true,
    })
    posts = result.docs as Post[]
  } catch (error) {
    console.error('[BlogLatestBlock] Error fetching posts:', error)
  }

  if (!posts.length) return null

  return (
    <section className="bg-kawai-pearl py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={
            cols === 2
              ? 'grid grid-cols-1 md:grid-cols-2 gap-8'
              : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
          }
        >
          {posts.map((post, i) => (
            <BlogCardAnimated key={post.id} post={post} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
