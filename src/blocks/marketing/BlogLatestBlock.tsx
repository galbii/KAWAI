import type { MarketingBlogLatestBlock } from '@/payload-types'
import type { Post } from '@/payload-types'
import { getPayloadClient } from '@/lib/payload/queries'
import { BlogLatestClient } from '@/components/blog/BlogLatestClient'

export async function BlogLatestBlock({
  postLimit,
  columns,
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
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'posts',
      where: { status: { equals: 'published' } },
      limit: 200,
      sort: '-publishedDate',
      depth: 2,
      overrideAccess: true,
    })
    allPosts = result.docs as Post[]
  } catch (error) {
    console.error('[BlogLatestBlock] Error fetching posts:', error)
  }

  if (!allPosts.length) return null

  return (
    <section className="bg-kawai-pearl py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-5xl lg:text-7xl font-[family-name:var(--font-brand-serif)] font-semibold leading-[1.0] tracking-tight text-kawai-black mb-4">
            Latest News &amp; Articles
          </h2>
          <div className="flex items-center">
            <div className="w-10 h-px bg-kawai-red" />
            <div className="flex-1 h-px bg-kawai-neutral" />
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
