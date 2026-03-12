import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export const revalidate = 3600

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params

    const payload = await getPayload({ config })

    // Get storefront ID from slug
    const storefrontResult = await payload.find({
      collection: 'storefronts',
      where: { slug: { equals: slug } },
      depth: 0,
      limit: 1,
    })

    const storefrontId = storefrontResult.docs[0]?.id
    if (!storefrontId) {
      return NextResponse.json({ hasMusicSchool: false })
    }

    const musicSchoolResult = await payload.find({
      collection: 'music-schools',
      where: {
        storefront: { equals: storefrontId },
        isActive: { equals: true },
      },
      depth: 0,
      limit: 1,
    })

    return NextResponse.json({ hasMusicSchool: musicSchoolResult.docs.length > 0 })
  } catch (error) {
    console.error('Error checking music school:', error)
    return NextResponse.json({ hasMusicSchool: false })
  }
}
