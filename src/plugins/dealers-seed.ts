import type { Config, Plugin } from 'payload'
import { DEALER_SEED_DATA } from '@/lib/data/dealers-seed-data'

export const dealersSeedPlugin = (): Plugin =>
  (config: Config): Config => {
    const incomingOnInit = config.onInit

    config.onInit = async (payload) => {
      if (incomingOnInit) await incomingOnInit(payload)

      if (process.env.PAYLOAD_SEED !== 'true') return

      payload.logger.info('🌱 Seeding Dealers…')

      try {
        let created = 0
        let skipped = 0

        for (const dealer of DEALER_SEED_DATA) {
          // Deduplicate by slug
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
          } catch (createErr) {
            payload.logger.warn(
              `  ⚠ Skipped "${dealer.slug}": ${createErr instanceof Error ? createErr.message : String(createErr)}`,
            )
          }
        }

        payload.logger.info(
          `🎉 Dealer seeding complete — ${created} created, ${skipped} skipped`,
        )
      } catch (err) {
        payload.logger.error(
          `❌ Dealer seeding failed: ${err instanceof Error ? err.message : String(err)}`,
        )
      }
    }

    return { ...config }
  }
