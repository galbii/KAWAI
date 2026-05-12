import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload/queries'
import { ARTISTS_SEED_DATA } from '@/lib/data/artists-seed-data'

function buildLexicalBio(text: string) {
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

  const paragraphNodes = text
    .split(/\n\n+/)
    .map((chunk) => chunk.replace(/\n/g, ' ').trim())
    .filter(Boolean)
    .map((chunk) => makeParagraph([makeTextNode(chunk)]))

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
 * POST /api/admin/seed-artists
 *
 * Seeds the artists collection from ARTISTS_SEED_DATA.
 * Deduplicates by slug — existing records are skipped, not overwritten.
 * Requires an authenticated admin user (payload-token cookie).
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await getPayloadClient()

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

    for (const artist of ARTISTS_SEED_DATA) {
      const existing = await payload.find({
        collection: 'artists',
        where: { slug: { equals: artist.slug } },
        limit: 1,
        depth: 0,
      })

      if (existing.docs[0]) {
        skipped++
        continue
      }

      try {
        await payload.create({
          collection: 'artists',
          context: { disableRevalidate: true },
          data: {
            name: artist.name,
            slug: artist.slug,
            genre: artist.genre,
            isActive: artist.isActive,
            isShigeruArtist: artist.isShigeruArtist,
            ...(artist.region ? { region: artist.region } : {}),
            shortBio: artist.shortBio,
            bio: buildLexicalBio(artist.bio),
            ...(artist.audienceMetrics ? { audienceMetrics: artist.audienceMetrics } : {}),
            socialLinks: artist.socialLinks.map((link) => ({
              platform: link.platform,
              url: link.url,
              ...(link.label ? { label: link.label } : {}),
            })),
            ...(artist.internalNotes ? { internalNotes: artist.internalNotes } : {}),
            _status: 'published',
          } as any,
        })
        created++
      } catch (err) {
        errors.push(`${artist.slug}: ${err instanceof Error ? err.message : String(err)}`)
      }
    }

    return NextResponse.json({
      ok: true,
      total: ARTISTS_SEED_DATA.length,
      created,
      skipped,
      errors,
    })
  } catch (err) {
    console.error('[seed-artists]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    )
  }
}
