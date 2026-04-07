import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload/queries'
import { POSTS_SEED_DATA } from '@/lib/data/posts-seed-data'

/**
 * Converts plain text + links array into a Payload Lexical editor state
 * for the content-rich-text block's `content` field.
 *
 * - Splits text on double newlines → paragraphs
 * - Single newlines within a chunk → treated as one paragraph
 * - Links appended at the bottom as clickable link nodes
 */
function buildLexicalContent(text: string, links: string[]) {
  const makeTextNode = (t: string) => ({
    detail: 0,
    format: 0,
    mode: 'normal' as const,
    style: '',
    text: t,
    type: 'text',
    version: 1,
  })

  const makeParagraph = (children: unknown[]) => ({
    children,
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    type: 'paragraph',
    version: 1,
    textFormat: 0,
    textStyle: '',
  })

  const makeLinkNode = (url: string) => ({
    type: 'link',
    version: 2,
    fields: {
      doc: null,
      linkType: 'custom',
      newTab: true,
      url,
    },
    children: [makeTextNode(url)],
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
  })

  // Build paragraph nodes from the plain text
  const paragraphNodes = text
    .split(/\n\n+/)
    .map((chunk) => chunk.replace(/\n/g, ' ').trim())
    .filter(Boolean)
    .map((chunk) => makeParagraph([makeTextNode(chunk)]))

  // Append links section if present
  if (links.length > 0) {
    // "Related Links" label paragraph
    paragraphNodes.push(
      makeParagraph([
        {
          ...makeTextNode('Related Links:'),
          format: 1, // bold
        },
      ]),
    )

    // One paragraph per link
    for (const url of links) {
      paragraphNodes.push(makeParagraph([makeLinkNode(url)]))
    }
  }

  return {
    root: {
      children: paragraphNodes,
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      type: 'root',
      version: 1,
    },
  }
}

/**
 * Parses "Month Day, Year" → ISO date string.
 * Falls back to current date if parsing fails.
 */
function parseDate(dateStr: string): string {
  try {
    const parsed = new Date(dateStr)
    if (!isNaN(parsed.getTime())) return parsed.toISOString()
  } catch {
    // fall through
  }
  return new Date().toISOString()
}

/**
 * POST /api/admin/seed-posts
 *
 * Seeds the posts collection from POSTS_SEED_DATA (derived from kawaius_blogs.csv).
 * Deduplicates by slug — existing records are skipped, not overwritten.
 * Requires an authenticated admin user (payload-token cookie).
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await getPayloadClient()

    // Verify caller is an authenticated admin
    const { user } = await payload.auth({ headers: request.headers })
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if ((user as { role?: string }).role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden — admin only' }, { status: 403 })
    }

    let created = 0
    let skipped = 0
    const errors: string[] = []

    for (const post of POSTS_SEED_DATA) {
      // Deduplicate by slug
      const existing = await payload.find({
        collection: 'posts',
        where: { slug: { equals: post.slug } },
        limit: 1,
        depth: 0,
      })

      if (existing.docs[0]) {
        skipped++
        continue
      }

      // Build excerpt from first ~280 chars of content
      const firstParagraph = post.content.split(/\n\n/)[0]?.trim() ?? ''
      const excerpt = firstParagraph.slice(0, 280).trimEnd()

      // Build rich text Lexical content
      const lexicalContent = buildLexicalContent(post.content, post.links)

      try {
        await payload.create({
          collection: 'posts',
          context: { skipRevalidation: true },
          data: {
            title: post.title,
            slug: post.slug,
            excerpt,
            status: 'published',
            publishedDate: parseDate(post.datePosted),
            featured: false,
            layout: [
              {
                blockType: 'content-rich-text',
                content: lexicalContent,
              },
            ],
          } as any,
        })
        created++
      } catch (err) {
        errors.push(`${post.slug}: ${err instanceof Error ? err.message : String(err)}`)
      }
    }

    return NextResponse.json({
      ok: true,
      total: POSTS_SEED_DATA.length,
      created,
      skipped,
      errors,
    })
  } catch (err) {
    console.error('[seed-posts]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    )
  }
}
