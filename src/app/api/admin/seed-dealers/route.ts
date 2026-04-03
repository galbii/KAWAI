import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload/queries'
import { DEALER_SEED_DATA } from '@/lib/data/dealers-seed-data'

/**
 * POST /api/admin/seed-dealers
 *
 * Seeds the dealers collection from DEALER_SEED_DATA.
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

    for (const dealer of DEALER_SEED_DATA) {
      const existing = await payload.find({
        collection: 'dealers',
        where: { slug: { equals: dealer.slug } },
        limit: 1,
        depth: 0,
      })

      if (existing.docs[0]) {
        skipped++
        continue
      }

      try {
        await payload.create({
          collection: 'dealers',
          context: { skipRevalidation: true },
          data: {
            dealerName: dealer.dealerName,
            slug: dealer.slug,
            isActive: dealer.isActive,
            isFeatured: dealer.isFeatured,
            dealerIdentification: dealer.dealerIdentification,
            dealerType: 'dealer',
            contactInfo: {
              phone: dealer.phone,
              fax: dealer.fax,
              email: dealer.email,
              website: dealer.website,
            },
            address: {
              street: dealer.street,
              city: dealer.city,
              state: dealer.state,
              zipCode: dealer.zipCode,
              country: dealer.country,
            },
            ...(dealer.latitude !== undefined && dealer.longitude !== undefined
              ? { coordinates: { latitude: dealer.latitude, longitude: dealer.longitude } }
              : {}),
            shigeruKawaiDealer: dealer.shigeruKawaiDealer,
            acousticPianoDealer: dealer.acousticPianoDealer,
            digitalPianoDealer: dealer.digitalPianoDealer,
            professionalProductDealer: dealer.professionalProductDealer,
            description: dealer.description,
            ...(dealer.metaTitle || dealer.metaDescription
              ? { seo: { metaTitle: dealer.metaTitle, metaDescription: dealer.metaDescription } }
              : {}),
          } as any,
        })
        created++
      } catch (err) {
        errors.push(`${dealer.slug}: ${err instanceof Error ? err.message : String(err)}`)
      }
    }

    return NextResponse.json({
      ok: true,
      total: DEALER_SEED_DATA.length,
      created,
      skipped,
      errors,
    })
  } catch (err) {
    console.error('[seed-dealers]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    )
  }
}
