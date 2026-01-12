import type { Payload } from 'payload'
import path from 'path'
import fs from 'fs'
import { pianoPageImages, resolveImagePath, imageExists } from './pianos-page-seed-data'

// Interface for uploaded image result
interface UploadedImage {
  id: string
  url: string
  filename: string
}

/**
 * Upload a single image to the media collection
 * @param payload - Payload instance
 * @param imagePath - Path to the image file (from public directory)
 * @param alt - Alt text for the image
 * @param filename - Desired filename for the uploaded image
 * @returns Promise<UploadedImage | null>
 */
export async function uploadImageToMedia(
  payload: Payload,
  imagePath: string,
  alt: string,
  filename: string
): Promise<UploadedImage | null> {
  try {
    const absolutePath = resolveImagePath(imagePath)
    
    // Check if file exists
    if (!fs.existsSync(absolutePath)) {
      payload.logger.warn(`⚠️ Image not found: ${imagePath}`)
      return null
    }

    // Check if this image already exists in media collection
    const existing = await payload.find({
      collection: 'media',
      where: {
        filename: {
          equals: filename
        }
      },
      limit: 1
    })

    if (existing.docs.length > 0) {
      const existingDoc = existing.docs[0]
      if (existingDoc) {
        payload.logger.info(`📁 Image already exists: ${filename}`)
        return {
          id: existingDoc.id,
          url: existingDoc.url || '',
          filename: existingDoc.filename || filename
        }
      }
    }

    // Upload the image
    payload.logger.info(`📤 Uploading image: ${filename}`)
    const uploadResult = await payload.create({
      collection: 'media',
      data: {
        alt: alt,
      },
      filePath: absolutePath,
    })

    payload.logger.info(`✅ Uploaded: ${filename} (ID: ${uploadResult.id})`)
    
    return {
      id: uploadResult.id,
      url: uploadResult.url || '',
      filename: uploadResult.filename || filename
    }
  } catch (error) {
    payload.logger.error(`❌ Failed to upload ${filename}: ${error instanceof Error ? error.message : String(error)}`)
    return null
  }
}

/**
 * Upload all piano page images and return a mapping of image IDs
 * @param payload - Payload instance
 * @returns Promise<object> - Object with image IDs mapped to keys
 */
export async function uploadAllPianoPageImages(payload: Payload): Promise<{
  heroBackgroundImageId: string | null
  categoryImageIds: Record<string, string | null>
  featuredModelImageIds: Record<string, string | null>
}> {
  payload.logger.info('🖼️ Starting piano page image uploads...')

  // Upload hero background image
  const heroImage = await uploadImageToMedia(
    payload,
    pianoPageImages.heroBackgroundImage.path,
    pianoPageImages.heroBackgroundImage.alt,
    pianoPageImages.heroBackgroundImage.filename
  )

  // Upload category images
  const categoryImageIds: Record<string, string | null> = {}
  for (const [key, imageData] of Object.entries(pianoPageImages.categoryImages)) {
    const uploaded = await uploadImageToMedia(
      payload,
      imageData.path,
      imageData.alt,
      imageData.filename
    )
    categoryImageIds[key] = uploaded?.id || null
  }

  // Upload featured model images
  const featuredModelImageIds: Record<string, string | null> = {}
  for (const [key, imageData] of Object.entries(pianoPageImages.featuredModelImages)) {
    const uploaded = await uploadImageToMedia(
      payload,
      imageData.path,
      imageData.alt,
      imageData.filename
    )
    featuredModelImageIds[key] = uploaded?.id || null
  }

  payload.logger.info('🎉 Piano page image uploads completed!')

  return {
    heroBackgroundImageId: heroImage?.id || null,
    categoryImageIds,
    featuredModelImageIds
  }
}

/**
 * Create fallback image URLs for missing images
 * @param payload - Payload instance
 * @returns Promise<string> - Default image ID
 */
export async function getOrCreateFallbackImage(payload: Payload): Promise<string | null> {
  try {
    // Check if a default/fallback image already exists
    const existing = await payload.find({
      collection: 'media',
      where: {
        or: [
          { filename: { equals: 'default-piano-fallback.jpg' } },
          { alt: { contains: 'default piano' } }
        ]
      },
      limit: 1
    })

    if (existing.docs.length > 0) {
      const existingDoc = existing.docs[0]
      if (existingDoc) {
        return existingDoc.id
      }
    }

    payload.logger.warn('⚠️ No fallback image found, proceeding without fallback')
    return null
  } catch (error) {
    payload.logger.error(`❌ Error getting fallback image: ${error instanceof Error ? error.message : String(error)}`)
    return null
  }
}

/**
 * Validate that all required images exist before seeding
 * @returns object with validation results
 */
export function validateImages(): {
  valid: boolean
  missing: string[]
  existing: string[]
} {
  const missing: string[] = []
  const existing: string[] = []

  // Check hero image
  if (imageExists(pianoPageImages.heroBackgroundImage.path)) {
    existing.push(pianoPageImages.heroBackgroundImage.path)
  } else {
    missing.push(pianoPageImages.heroBackgroundImage.path)
  }

  // Check category images
  for (const imageData of Object.values(pianoPageImages.categoryImages)) {
    if (imageExists(imageData.path)) {
      existing.push(imageData.path)
    } else {
      missing.push(imageData.path)
    }
  }

  // Check featured model images
  for (const imageData of Object.values(pianoPageImages.featuredModelImages)) {
    if (imageExists(imageData.path)) {
      existing.push(imageData.path)
    } else {
      missing.push(imageData.path)
    }
  }

  return {
    valid: missing.length === 0,
    missing,
    existing
  }
}