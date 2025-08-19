import type { Config, Plugin } from 'payload'
import { defaultProductLines } from '../lib/default-productlines'

export const productlinesSeedPlugin = (): Plugin => (config: Config): Config => {
  return {
    ...config,
    onInit: async (payload) => {
      if (config.onInit) await config.onInit(payload)
      
      // Check if we should seed based on environment variable
      if (process.env.PAYLOAD_SEED === 'true') {
        await seedProductLines(payload)
      }
    },
  }
}

async function seedProductLines(payload: import('payload').Payload): Promise<void> {
  payload.logger.info('🌱 Checking Product Lines for seeding...')

  try {
    // Check if collection is empty
    const existing = await payload.find({
      collection: 'productlines',
      limit: 1,
      pagination: false,
    })

    if (existing.docs.length > 0) {
      payload.logger.info('📝 Product Lines already exist, skipping seed')
      return
    }

    payload.logger.info('🚀 Seeding Product Lines...')

    // Create each product line
    for (const productLineData of defaultProductLines) {
      try {
        const result = await payload.create({
          collection: 'productlines',
          data: {
            name: productLineData.name,
            slug: productLineData.slug,
            category: productLineData.category,
            description: productLineData.description,
            highlight: productLineData.highlight,
            featured: productLineData.featured,
            sortOrder: productLineData.sortOrder,
            // Note: slides will need images uploaded via admin interface
            slides: productLineData.slides?.map(slide => ({
              title: slide.title,
              // Placeholder - actual images should be uploaded through admin
              image: null
            })) || []
          }
        })

        payload.logger.info(`✅ Created: ${result.name} (${result.category})`)
      } catch (error) {
        payload.logger.error(`❌ Failed to create ${productLineData.name}:`, error)
      }
    }

    payload.logger.info('🎉 Product Lines seeding completed!')
  } catch (error) {
    payload.logger.error('❌ Product Lines seeding failed:', error)
  }
}