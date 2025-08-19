import type { Config, Plugin } from 'payload'
import { pianoPageSeedData } from '../lib/pianos-page-seed-data'
import { uploadAllPianoPageImages, validateImages } from '../lib/seed-image-utils'

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
    // Check if PianosPage singleton already has data
    const existing = await payload.findGlobal({
      slug: 'pianos-page',
    })

    if (existing && existing.heroTitle) {
      payload.logger.info('📝 PianosPage already has data, skipping seed')
      return
    }

    payload.logger.info('🚀 Seeding PianosPage...')

    // Validate images before proceeding
    const imageValidation = validateImages()
    if (!imageValidation.valid) {
      payload.logger.warn(`⚠️ Missing ${imageValidation.missing.length} images:`)
      imageValidation.missing.forEach(path => payload.logger.warn(`   - ${path}`))
      payload.logger.info(`✅ Found ${imageValidation.existing.length} images, proceeding with available images`)
    }

    // Upload all images and get their IDs
    const imageIds = await uploadAllPianoPageImages(payload)

    // Transform seed data to include image IDs
    const pianoCategories = pianoPageSeedData.pianoCategories.map(category => {
      const categoryImageId = imageIds.categoryImageIds[category.slug]
      return {
        ...category,
        image: categoryImageId || null
      }
    })

    const featuredModels = pianoPageSeedData.featuredModels.map(model => {
      let imageId = null
      
      // Map model names to image keys
      if (model.name === 'GX-7 BLAK') {
        imageId = imageIds.featuredModelImageIds.gx7blak
      } else if (model.name === 'CA99') {
        imageId = imageIds.featuredModelImageIds.ca99
      } else if (model.name === 'NOVUS NV-10S') {
        imageId = imageIds.featuredModelImageIds.nv10s
      }

      return {
        ...model,
        image: imageId || null
      }
    })

    // Create the PianosPage global data
    const result = await payload.updateGlobal({
      slug: 'pianos-page',
      data: {
        heroTitle: pianoPageSeedData.heroTitle,
        heroDescription: pianoPageSeedData.heroDescription,
        heroBackgroundImage: imageIds.heroBackgroundImageId || null,
        heroCta: pianoPageSeedData.heroCta,
        pianoCategories: pianoCategories,
        featuredModelsSection: pianoPageSeedData.featuredModelsSection,
        featuredModels: featuredModels,
        ctaSection: pianoPageSeedData.ctaSection,
        seo: pianoPageSeedData.seo
      } as any // Type assertion to bypass strict type checking during seeding
    })

    payload.logger.info(`✅ Created PianosPage with ${pianoCategories.length} categories and ${featuredModels.length} featured models`)
    payload.logger.info(`📸 Uploaded ${Object.values(imageIds.categoryImageIds).filter(Boolean).length + Object.values(imageIds.featuredModelImageIds).filter(Boolean).length + (imageIds.heroBackgroundImageId ? 1 : 0)} images`)
    payload.logger.info('🎉 PianosPage seeding completed!')

  } catch (error) {
    payload.logger.error('❌ PianosPage seeding failed:', error)
  }
}