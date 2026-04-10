import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload/queries'

/**
 * Daily cron: decrement every FAQ's viewCount by 1 (floor 0).
 * This creates a recency-weighted popularity ranking — FAQs that were
 * clicked recently stay popular; old spikes decay naturally over time.
 *
 * Scheduled via vercel.json: "0 0 * * *" (midnight UTC daily).
 * Vercel automatically passes Authorization: Bearer ${CRON_SECRET}.
 */
export async function GET(request: Request) {
  const auth = request.headers.get('authorization')

  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = await getPayloadClient()

  let page = 1
  let totalDecayed = 0
  let hasMore = true

  while (hasMore) {
    const { docs, hasNextPage } = await payload.find({
      collection: 'faqs',
      where: { viewCount: { greater_than: 0 } },
      select: { viewCount: true },
      depth: 0,
      limit: 100,
      page,
    })

    if (docs.length === 0) break

    await Promise.all(
      docs.map((faq) =>
        payload.update({
          collection: 'faqs',
          id: faq.id,
          data: { viewCount: Math.max(0, (faq.viewCount ?? 1) - 1) },
          // Skip revalidation — popular caches refresh on their own 5-min TTL.
          context: { skipRevalidation: true },
        })
      )
    )

    totalDecayed += docs.length
    hasMore = hasNextPage ?? false
    page++
  }

  return NextResponse.json({
    ok: true,
    decayed: totalDecayed,
    timestamp: new Date().toISOString(),
  })
}
