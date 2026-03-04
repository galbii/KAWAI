import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload/queries'

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim() ?? ''
  if (q.length < 2) return NextResponse.json({ docs: [] })

  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'faqs',
      where: {
        status: { equals: 'published' },
        or: [
          { question: { contains: q } },
          { excerpt: { contains: q } },
        ],
      },
      select: {
        question: true,
        slug: true,
        excerpt: true,
        supportHub: true,
        categories: true,
      },
      depth: 1,
      limit: 8,
    })
    return NextResponse.json({ docs: result.docs })
  } catch (err) {
    console.error('[FAQ Search]', err)
    return NextResponse.json({ docs: [] }, { status: 500 })
  }
}
