import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload/queries'
import { REDIRECTS_SEED_DATA } from '@/lib/data/redirects-seed-data'

/**
 * POST /api/admin/seed-redirects
 *
 * Seeds the redirects collection from REDIRECTS_SEED_DATA (derived from kawaius_redirect_map.csv).
 * Deduplicates by `from` path — existing records are skipped, not overwritten.
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

    for (const redirect of REDIRECTS_SEED_DATA) {
      const existing = await payload.find({
        collection: 'redirects',
        where: { from: { equals: redirect.from } },
        limit: 1,
        depth: 0,
      })

      if (existing.docs[0]) {
        skipped++
        continue
      }

      try {
        await payload.create({
          collection: 'redirects',
          context: { skipRevalidation: true },
          data: {
            from: redirect.from,
            to: {
              type: 'url',
              url: redirect.toUrl,
            },
            redirectType: '301',
            isActive: true,
            notes: redirect.notes,
          } as any,
        })
        created++
      } catch (err) {
        errors.push(`${redirect.from}: ${err instanceof Error ? err.message : String(err)}`)
      }
    }

    // Single revalidation after all records are created
    if (created > 0) {
      const baseURL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
      fetch(`${baseURL}/api/revalidate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: process.env.REVALIDATION_SECRET,
          tag: 'redirects',
        }),
      }).catch((err) => console.error('[seed-redirects] Revalidation error:', err))
    }

    return NextResponse.json({
      ok: true,
      total: REDIRECTS_SEED_DATA.length,
      created,
      skipped,
      errors,
    })
  } catch (err) {
    console.error('[seed-redirects]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    )
  }
}
