/**
 * Product Generation Hooks and Utilities
 * 
 * This file contains hooks for bidirectional synchronization between PianoModel and Product collections.
 * When a PianoModel is created/updated, a corresponding Product is automatically created/updated.
 * Changes in either collection are synchronized with proper loop prevention.
 */

import type { 
  CollectionAfterChangeHook, 
  CollectionBeforeDeleteHook, 
  CollectionBeforeChangeHook 
} from 'payload'
import type { PianoModel, Product } from '../../payload-types'
import { getTemplateForCategory } from '../blocks/templates'

/**
 * Generate a slug from a string with robust validation
 */
function generateSlug(text: string): string {
  if (!text || typeof text !== 'string') {
    return ''
  }
  
  const slug = text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
  
  // Return empty string if slug is invalid after processing
  // This allows the fallback chain to work properly
  return slug || ''
}

/**
 * Get product category from productline relationship
 */
async function getCategoryFromProductline(productlineId: string, payload: any): Promise<string> {
  try {
    const productline = await payload.findByID({
      collection: 'productlines',
      id: productlineId,
      depth: 0
    })
    return productline?.category || 'digital'
  } catch (error) {
    console.warn('Could not fetch productline category, defaulting to digital:', error)
    return 'digital'
  }
}

/**
 * Cross-collection slug validation to ensure uniqueness
 */
async function validateUniqueSlug(slug: string, excludeId: string | undefined, payload: any): Promise<void> {
  if (!slug) return

  // Check across both products and piano models (even though piano models no longer have slugs directly)
  const productCheck = await payload.find({
    collection: 'products',
    where: {
      and: [
        { slug: { equals: slug } },
        ...(excludeId ? [{ id: { not_equals: excludeId } }] : [])
      ]
    },
    limit: 1
  })

  if (productCheck.docs.length > 0) {
    throw new Error(`Slug "${slug}" is already in use by another product`)
  }
}

/**
 * Ensure slug uniqueness by appending a number if needed
 */
async function ensureUniqueSlug(baseSlug: string, excludeId: string | undefined, payload: any): Promise<string> {
  let slug = baseSlug
  let counter = 1
  
  while (true) {
    try {
      await validateUniqueSlug(slug, excludeId, payload)
      return slug
    } catch (error) {
      slug = `${baseSlug}-${counter}`
      counter++
      
      // Prevent infinite loops
      if (counter > 100) {
        return `${baseSlug}-${Date.now()}`
      }
    }
  }
}

/**
 * Transform PianoModel data into Product data structure
 */
function transformPianoModelToProduct(pianoModel: PianoModel, category: string): Partial<Product> {
  return {
    type: 'piano', // Always piano type for auto-generated products
    name: pianoModel.name,
    title: pianoModel.name,
    description: pianoModel.description,
    category: category as any,
    status: pianoModel.status === 'active' ? 'active' : 'draft',
    mainImage: pianoModel.image,
    
    // Transform pricing data
    price: {
      currency: pianoModel.pricing?.currency || 'USD',
      amount: pianoModel.pricing?.msrp || undefined,
      saleAmount: pianoModel.pricing?.salePrice || undefined,
      priceText: pianoModel.pricing?.priceText || undefined,
      showPrice: pianoModel.pricing?.showPrice !== false
    },
    
    // Transform finishes
    finishes: pianoModel.availableFinishes?.map(finish => ({
      name: finish.name,
      image: finish.image,
      priceModifier: finish.priceModifier || 0,
      available: finish.available !== false
    })) || [],
    
    // Default buy button configuration
    buyButton: {
      text: 'Contact for Details',
      link: '/contact',
      style: 'primary',
      showButton: true
    },
    
    // Transform product data
    productData: {
      model: pianoModel.model,
      brand: 'Kawai',
      series: typeof pianoModel.productline === 'object' ? pianoModel.productline.name : undefined,
      weight: pianoModel.specifications?.weight,
      dimensions: {
        width: pianoModel.specifications?.dimensions?.width,
        depth: pianoModel.specifications?.dimensions?.depth,
        height: pianoModel.specifications?.dimensions?.height
      }
    },
    
    // Visibility settings
    visibility: {
      featured: pianoModel.featured || false,
      showInCatalog: true,
      allowReviews: true,
      sortOrder: pianoModel.sortOrder
    },
    
    // Inventory settings
    inventory: {
      trackStock: false,
      inStock: pianoModel.status === 'active'
    },
    
    // SEO data
    seo: {
      metaTitle: `${pianoModel.name} - Kawai Piano`,
      metaDescription: pianoModel.shortDescription || pianoModel.description,
      ogImage: pianoModel.image
    }
  }
}

/**
 * Transform relevant Product data back to PianoModel data structure
 */
function transformProductToPianoModel(product: Product): Partial<PianoModel> {
  // Map product status to piano model status
  let pianoStatus: 'active' | 'discontinued' | 'coming-soon' | 'limited-edition' = 'active'
  if (product.status === 'discontinued') pianoStatus = 'discontinued'
  else if (product.status === 'coming-soon') pianoStatus = 'coming-soon'  
  else if (product.status === 'limited-edition') pianoStatus = 'limited-edition'
  // 'draft' and other statuses default to 'active'
  
  return {
    name: product.name,
    // Note: slug is no longer in PianoModel
    description: product.description,
    status: pianoStatus,
    image: product.mainImage,
    
    // Transform pricing data back
    pricing: {
      currency: product.price?.currency || 'USD',
      msrp: product.price?.amount || undefined,
      salePrice: product.price?.saleAmount || undefined,
      priceText: product.price?.priceText || undefined,
      showPrice: product.price?.showPrice !== false
    },
    
    // Transform finishes back
    availableFinishes: product.finishes?.map(finish => ({
      name: finish.name,
      image: finish.image,
      priceModifier: finish.priceModifier || 0,
      available: finish.available !== false,
      description: ''
    })) || [],
    
    // Visibility settings
    featured: product.visibility?.featured || false,
    sortOrder: product.visibility?.sortOrder
  }
}

/**
 * Hook for PianoModel afterChange - automatically create or update Product
 */
export const pianoModelAfterChangeHook: CollectionAfterChangeHook<PianoModel> = async ({
  doc,
  previousDoc,
  operation,
  req
}) => {
  console.log(`🎹 PianoModel afterChange START: ${operation} operation for ${doc.name} (ID: ${doc.id})`)
  console.log(`🔍 Piano model doc keys:`, Object.keys(doc))
  
  // Prevent infinite loops
  if (req.context?.preventPianoSync === true) {
    console.log(`🔄 Skipping product generation for ${doc.id} - preventPianoSync context`)
    return doc
  }

  const { payload } = req
  
  // Skip if auto-generation is disabled for this piano model
  if (doc.autoGenerateProduct === false) {
    console.log(`❌ Auto-product generation disabled for piano model ${doc.id}, skipping`)
    return doc
  }
  
  console.log(`✅ Auto-product generation enabled for piano model ${doc.id}`)
  
  try {
    // Skip if no productline (required for category determination)
    if (!doc.productline) {
      console.warn(`⚠️  PianoModel ${doc.id} has no productline, skipping product generation`)
      return doc
    }
    
    const productlineId = typeof doc.productline === 'object' ? doc.productline.id : doc.productline
    console.log(`📊 Getting category for productline ${productlineId}`)
    const category = await getCategoryFromProductline(productlineId, payload)
    console.log(`📊 Category determined: ${category}`)
    
    if (operation === 'create') {
      // Create new product
      console.log(`🆕 Creating new product for piano model ${doc.id}`)
      
      const transformedData = transformPianoModelToProduct(doc, category)
      console.log(`🔄 Transformed piano model data:`, JSON.stringify(transformedData, null, 2))
      
      const productData: Partial<Product> = {
        ...transformedData,
        pianoModel: doc.id,
        slug: doc.slug, // Use piano model's slug
        dataSource: 'pianomodel' // New products default to pianomodel sync
        // pageContent: [] // Empty - users can add blocks manually if needed
      }
      
      console.log(`📦 About to create product with data:`)
      console.log(`🔍 Product data keys:`, Object.keys(productData))
      console.log(`🔍 Product name: "${productData.name}"`)
      console.log(`🔍 Product slug: "${productData.slug}"`)
      console.log(`📦 Creating product with context: { preventProductSync: true }`)
      
      try {
        console.log(`🚀 Calling payload.create for products collection...`)
        const createdProduct = await payload.create({
          collection: 'products',
          data: productData as any,
          context: { preventProductSync: true } // Prevent loops
        })
        
        console.log(`✅ Product created successfully with ID: ${createdProduct.id}`)

        console.log(`✅ Created product ${createdProduct.id} for piano model ${doc.id}`)
        
        // Update piano model with product reference
        await payload.update({
          collection: 'piano-models',
          id: doc.id,
          data: {
            product: createdProduct.id
          },
          context: { preventPianoSync: true }
        })
        
        console.log(`🔗 Updated piano model ${doc.id} with product reference ${createdProduct.id}`)
        
      } catch (productCreateError: any) {
        console.error(`❌ Failed to create product for piano model ${doc.id}:`, productCreateError)
        
        // Log the specific validation errors if available
        if (productCreateError?.data) {
          console.error(`🔍 Validation errors:`, JSON.stringify(productCreateError.data, null, 2))
        }
        
        throw productCreateError // Re-throw so the outer catch can handle it
      }
      
    } else if (operation === 'update' && doc.product) {
      // Update existing product
      console.log(`🔄 Updating existing product ${doc.product} for piano model ${doc.id}`)
      
      const transformedData = transformPianoModelToProduct(doc, category)
      
      await payload.update({
        collection: 'products',
        id: String(doc.product),
        data: {
          ...transformedData,
          pianoModel: doc.id
          // No slug update - let Products collection handle slug generation if name changed
        },
        context: { preventProductSync: true }
      })
      
      console.log(`✅ Updated product ${doc.product} for piano model ${doc.id}`)
    }
    
  } catch (error) {
    console.error(`❌ Error in pianoModelAfterChangeHook for model ${doc.id}:`, error)
    // Don't throw - we don't want to break the piano model save operation
  }
  
  return doc
}

/**
 * Hook for PianoModel beforeDelete - handle product cleanup
 */
export const pianoModelBeforeDeleteHook: CollectionBeforeDeleteHook = async ({
  id,
  req
}) => {
  const { payload } = req
  
  try {
    const pianoModel = await payload.findByID({
      collection: 'piano-models',
      id: String(id),
      depth: 0
    })

    if (pianoModel?.product) {
      // Delete the associated product
      await payload.delete({
        collection: 'products',
        id: String(pianoModel.product)
      })
      
      console.log(`Deleted associated product ${pianoModel.product} for piano model ${id}`)
    }
  } catch (error) {
    console.error(`Error in pianoModelBeforeDeleteHook for model ${id}:`, error)
    // Continue with deletion even if cleanup fails
  }
}

/**
 * Hook for Product afterChange - sync changes back to PianoModel
 */
export const productAfterChangeHook: CollectionAfterChangeHook<Product> = async ({
  doc,
  previousDoc,
  operation,
  req
}) => {
  // Prevent infinite loops
  if (req.context?.preventProductSync === true) {
    return
  }

  const { payload } = req

  // Only sync if this is a piano product with a linked piano model
  if (doc.type !== 'piano' || !doc.pianoModel) {
    return
  }

  try {
    // Sync relevant changes back to piano model
    const transformedData = transformProductToPianoModel(doc)
    
    await payload.update({
      collection: 'piano-models',
      id: String(doc.pianoModel),
      data: transformedData,
      context: { preventPianoSync: true }
    })
    
    console.log(`Synced product ${doc.id} changes back to piano model ${doc.pianoModel}`)
    
  } catch (error) {
    console.error(`Error in productAfterChangeHook for product ${doc.id}:`, error)
    // Don't throw - we don't want to break the product save operation
  }
}

/**
 * Hook for Product beforeChange - validation for piano products
 */
export const productBeforeChangeHook: CollectionBeforeChangeHook<Product> = async ({
  data,
  req,
  operation
}) => {
  console.log(`🔍 productBeforeChangeHook: operation=${operation}, context=${JSON.stringify(req.context)}, productName=${data.name}`)
  
  // Skip validation if called from within hooks to prevent loops
  if (req.context?.preventProductSync || req.context?.preventPianoSync) {
    console.log(`✅ Skipping validation due to context - preventProductSync: ${req.context?.preventProductSync}, preventPianoSync: ${req.context?.preventPianoSync}`)
    return data
  }

  const { payload } = req

  try {
    // Validate type and pianoModel relationship
    if (data.type === 'piano' && !data.pianoModel) {
      throw new Error('Piano products must be linked to a piano model')
    }
    
    if (data.type !== 'piano' && data.pianoModel) {
      throw new Error('Non-piano products cannot be linked to piano models')
    }

    // Validate unique pianoModel relationship
    if (data.pianoModel) {
      const existing = await payload.find({
        collection: 'products',
        where: {
          and: [
            { pianoModel: { equals: data.pianoModel } },
            ...(operation === 'update' && data.id ? [{ id: { not_equals: data.id } }] : [])
          ]
        },
        limit: 1
      })
      
      if (existing.docs.length > 0) {
        throw new Error(`Another product (${existing.docs[0].name}) is already linked to this piano model. Each piano model can only be linked to one product.`)
      }
    }

    // Validate unique slug
    if (data.slug) {
      await validateUniqueSlug(
        data.slug, 
        operation === 'update' && data.id ? String(data.id) : undefined, 
        payload
      )
    }

  } catch (error) {
    console.error('Error in productBeforeChangeHook:', error)
    throw error // Throw validation errors to prevent save
  }
  
  return data
}

/**
 * Hook for Product beforeDelete - handle piano model cleanup
 */
export const productBeforeDeleteHook: CollectionBeforeDeleteHook = async ({
  id,
  req
}) => {
  const { payload } = req
  
  try {
    const product = await payload.findByID({
      collection: 'products',
      id: String(id)
    })
    
    // If this is a piano product linked to a piano model, unlink it
    if (product.type === 'piano' && product.pianoModel) {
      console.log(`🔗 Unlinking piano model ${product.pianoModel} from deleted product ${id}`)
      
      await payload.update({
        collection: 'piano-models',
        id: String(product.pianoModel),
        data: {
          product: null // Remove the product reference
        },
        context: { preventPianoSync: true }
      })
      
      console.log(`✅ Unlinked piano model ${product.pianoModel} from product ${id}`)
    }
  } catch (error) {
    console.error(`Error in productBeforeDeleteHook for product ${id}:`, error)
    // Continue with deletion even if unlinking fails
  }
}