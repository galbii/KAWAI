import { unstable_cache } from 'next/cache'
import type { MarketingBlogLatestBlock } from '@/payload-types'
import type { Post } from '@/payload-types'
import { getPayloadClient } from '@/lib/payload/queries'
import { BlogLatestClient } from '@/components/blog/BlogLatestClient'

function getFilteredPosts(filterByTags?: string[] | null): Promise<Post[]> {
  const key =
    filterByTags?.length
      ? `blog-posts-tags-${[...filterByTags].sort().join(',')}`
      : 'blog-posts-all'

  return unstable_cache(
    async (): Promise<Post[]> => {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'posts',
        where: {
          status: { equals: 'published' },
          ...(filterByTags?.length ? { tags: { in: filterByTags } } : {}),
        },
        limit: 200,
        sort: '-publishedDate',
        depth: 1,
        overrideAccess: true,
      })
      return result.docs as Post[]
    },
    [key],
    { tags: ['posts'], revalidate: 300 },
  )()
}

export async function BlogLatestBlock({
  eyebrow,
  heading,
  postLimit,
  columns,
  filterByTags,
  showCta,
  ctaLabel,
  ctaHref,
  showSecondaryCta,
  secondaryCtaLabel,
  secondaryCtaHref,
}: MarketingBlogLatestBlock) {
  const pageSize = postLimit ?? 3
  const cols = columns === '2' ? 2 : 3

  let allPosts: Post[] = []

  try {
    allPosts = await getFilteredPosts(filterByTags)
  } catch (error) {
    console.error('[BlogLatestBlock] Error fetching posts:', error)
  }

  if (!allPosts.length) return null

  return (
    <section className="bg-kawai-pearl py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-kawai-red font-[family-name:var(--font-brand-sans)] mb-3">
              {eyebrow || 'From the Blog'}
            </p>
            <h2 className="text-5xl lg:text-6xl font-[family-name:var(--font-brand-serif)] font-semibold leading-[1.0] tracking-tight text-kawai-black">
              {heading || 'Latest News & Articles'}
            </h2>
          </div>
        </div>

        <BlogLatestClient
          allPosts={allPosts}
          pageSize={pageSize}
          cols={cols}
          showCta={showCta !== false}
          ctaLabel={ctaLabel || 'View all posts'}
          ctaHref={ctaHref || '/blog'}
          showSecondaryCta={showSecondaryCta === true}
          secondaryCtaLabel={secondaryCtaLabel ?? null}
          secondaryCtaHref={secondaryCtaHref ?? null}
        />
      </div>
    </section>
  )
}
