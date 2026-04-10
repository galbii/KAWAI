import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload/queries'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const id = body?.id

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    }

    const payload = await getPayloadClient()

    const faq = await payload.findByID({
      collection: 'faqs',
      id,
      depth: 0,
      select: { viewCount: true },
    })

    if (!faq) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    await payload.update({
      collection: 'faqs',
      id,
      data: { viewCount: (faq.viewCount ?? 0) + 1 },
      // Skip cache revalidation — popular FAQ caches refresh on their own 5-min TTL.
      // Without this, every click would nuke the entire FAQ cache.
      context: { skipRevalidation: true },
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
