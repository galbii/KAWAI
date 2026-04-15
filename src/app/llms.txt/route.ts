import 'server-only'
import { NextResponse } from 'next/server'
import { unstable_cache } from 'next/cache'
import { getPayloadClient } from '@/lib/payload/queries'

export const revalidate = 300

// Named types required — inline generics inside unstable_cache cause a parse error
// (see CLAUDE.md: "unstable_cache inline type annotation" gotcha)
type LlmsPost = { title: string; slug: string; excerpt: string | null }
type LlmsNewsItem = { title: string; description: string | null; link: string | null }

const getRecentPostsForLlms = unstable_cache(
  async (): Promise<LlmsPost[]> => {
    try {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'posts',
        where: { status: { equals: 'published' } },
        select: { title: true, slug: true, excerpt: true },
        sort: '-publishedDate',
        limit: 8,
        depth: 0,
      })
      return result.docs.map(doc => ({
        title: String(doc.title ?? ''),
        slug: String(doc.slug ?? ''),
        excerpt: typeof doc.excerpt === 'string' ? doc.excerpt : null,
      }))
    } catch {
      return []
    }
  },
  ['llms-txt-recent-posts'],
  { tags: ['posts'], revalidate: 300 }
)

const getNewsItemsForLlms = unstable_cache(
  async (): Promise<LlmsNewsItem[]> => {
    try {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'home-page',
        select: { newsItems: true },
        depth: 0,
        limit: 1,
      })
      const items = (result as any)?.docs?.[0]?.newsItems ?? []
      return items.slice(0, 5).map((item: any) => ({
        title: String(item.title ?? ''),
        description: typeof item.description === 'string' ? item.description : null,
        link: typeof item.link === 'string' ? item.link : null,
      }))
    } catch {
      return []
    }
  },
  ['llms-txt-news-items'],
  { tags: ['home-page'], revalidate: 300 }
)

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kawaius.com'

  const [posts, newsItems] = await Promise.all([
    getRecentPostsForLlms(),
    getNewsItemsForLlms(),
  ])

  const newsSection = newsItems.length > 0
    ? [
        '## Latest News',
        '',
        ...newsItems.map(n =>
          n.link
            ? `- [${n.title}](${n.link})${n.description ? `: ${n.description}` : ''}`
            : `- ${n.title}${n.description ? `: ${n.description}` : ''}`
        ),
      ].join('\n')
    : ''

  const postsSection = posts.length > 0
    ? [
        '## Recent Blog Posts',
        '',
        ...posts.map(p =>
          `- [${p.title}](${siteUrl}/blog/${p.slug})${p.excerpt ? `: ${p.excerpt}` : ''}`
        ),
      ].join('\n')
    : ''

  const sections = [
    `# Kawai America — Piano Manufacturer & Dealer Network`,
    `> Official US retailer for Kawai acoustic and digital pianos. Family-owned since 1927. 212 authorized dealers across the US and Canada.`,
    ``,
    `## Piano Catalog`,
    ``,
    `- [Grand Pianos](${siteUrl}/pianos/grand): Shigeru Kawai SK series, GX BLAK, GL series. Concert-grade to home performance.`,
    `- [Upright Pianos](${siteUrl}/pianos/upright): K Series and ND Series. Space-efficient with rich tone.`,
    `- [Digital Pianos](${siteUrl}/pianos/digital): CA, CN, ES, KDP series. Wooden-key action with acoustic sampling.`,
    `- [Hybrid Pianos](${siteUrl}/pianos/hybrid): Novus and AnyTime series. Acoustic touch, silent practice capability.`,
    `- [Shigeru Kawai](${siteUrl}/pianos/shigeru-kawai): Hand-crafted concert grands, pinnacle of Kawai artistry.`,
    ``,
    `## Key Pages`,
    ``,
    `- [Find a Dealer](${siteUrl}/find-a-dealer): Locate 212+ authorized Kawai dealers in the US and Canada`,
    `- [Artists](${siteUrl}/artists): Kawai concert artists and ambassadors`,
    `- [Blog](${siteUrl}/blog): Piano guides, artist features, product news`,
    `- [Technical Support](${siteUrl}/technical-support-division): Manuals, downloads, service`,
    ``,
    `## Full AI Knowledge Base`,
    ``,
    `- [Complete Reference](${siteUrl}/llms-full.txt): Full product specs, competitive analysis, dealer network details, and FAQ for AI systems`,
    ``,
    newsSection,
    ``,
    postsSection,
  ].filter(s => s !== undefined).join('\n')

  return new NextResponse(sections, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=300, stale-while-revalidate=60',
    },
  })
}
