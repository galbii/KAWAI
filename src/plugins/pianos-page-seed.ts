import type { Config, Plugin } from 'payload'
import { pianoPageSeedData, pianoPageImages } from '../lib/pianos-page-seed-data'

export const pianosPageSeedPlugin = (): Plugin => (config: Config): Config => {
  return {
    ...config,
    onInit: async (payload) => {
      if (config.onInit) await config.onInit(payload)
      
      // Check if we should seed based on environment variable
      if (process.env.PAYLOAD_SEED === 'true') {
        await seedPianosPage(payload)
      }
    },
  }
}

async function seedPianosPage(payload: import('payload').Payload): Promise<void> {
  payload.logger.info('🌱 Checking PianosPage for seeding...')

  try {
    payload.logger.info('🔍 Checking if PianosPage collection exists...')
    
    // Check if PianosPage collection already has data
    const existing = await payload.find({
      collection: 'pianos-page',
      limit: 1
    })

    payload.logger.info(`📊 Found ${existing.docs.length} existing documents`)

    const existingDoc = existing.docs[0]
    if (existing.docs.length > 0 && existingDoc?.heroTitle) {
      payload.logger.info('📝 PianosPage already has data, skipping seed')
      return
    }

    payload.logger.info('🚀 Seeding PianosPage...')

    // Transform seed data - for now, we'll use image paths as strings since we're not uploading media
    // In a real implementation, you'd want to upload media first and use their IDs
    const pianoCategories = pianoPageSeedData.pianoCategories.map(category => {
      const categoryImage = pianoPageImages.categoryImages[category.slug as keyof typeof pianoPageImages.categoryImages]
      return {
        ...category,
        // Remove the image field for now since it needs to be a media ID, not a path
        // image: categoryImage?.path || null
      }
    })

    const featuredModels = pianoPageSeedData.featuredModels.map(model => {
      return {
        ...model,
        // Remove the image field for now since it needs to be a media ID, not a path
        // image: imagePath
      }
    })

    // Create the PianosPage collection data
    const result = await payload.create({
      collection: 'pianos-page',
      data: {
        heroTitle: pianoPageSeedData.heroTitle,
        heroDescription: pianoPageSeedData.heroDescription,
        // Remove heroBackgroundImage for now since it needs to be a media ID, not a path
        // heroBackgroundImage: pianoPageImages.heroBackgroundImage.path,
        heroCta: pianoPageSeedData.heroCta,
        pianoCategories: pianoCategories,
        featuredModelsSection: pianoPageSeedData.featuredModelsSection,
        featuredModels: featuredModels,
        ctaSection: pianoPageSeedData.ctaSection,
        seo: pianoPageSeedData.seo
      } as any // Type assertion to bypass strict type checking during seeding
    })

    payload.logger.info(`✅ Created PianosPage with ${pianoCategories.length} categories and ${featuredModels.length} featured models`)
    payload.logger.info('🎉 PianosPage seeding completed!')

  } catch (error) {
    payload.logger.error(`❌ PianosPage seeding failed: ${error instanceof Error ? error.message : String(error)}`)
    console.error('Full error details:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
  }
}