import type { Block, FieldHook } from 'payload'

/**
 * Auto-populate collection field based on product's shopifyCollections
 *
 * This hook finds the first matching collection from the product's shopifyCollections
 * and sets it as the default value for the relationship field.
 *
 * @param data - The full parent document (Product) data
 * @param value - Current field value (collection ID or undefined)
 * @param req - Request object with payload instance
 */
const autoPopulateCollection: FieldHook = async ({
  data,
  req,
  value,
  operation,
}) => {
  // If value already exists (user manually selected), don't override
  if (value) {
    console.log('[CollectionShowcase] Value already set, skipping auto-population')
    return value
  }

  console.log(`[CollectionShowcase] Running auto-population (operation: ${operation})`)

  // data is the full Product document (or partial during update)
  // Check if product has shopifyCollections array
  if (!data?.shopifyCollections || !Array.isArray(data.shopifyCollections) || data.shopifyCollections.length === 0) {
    console.log('[CollectionShowcase] ⚠️ No shopifyCollections found on product')
    return value // No collections to auto-populate from
  }

  // Get the first collection from the product
  // You can customize this logic to select a specific collection by title/handle
  const firstShopifyCollection = data.shopifyCollections[0]

  if (!firstShopifyCollection) {
    console.log('[CollectionShowcase] ⚠️ shopifyCollections array is empty')
    return value
  }

  console.log('[CollectionShowcase] First shopifyCollection:', {
    title: firstShopifyCollection.title,
    shopifyCollectionId: firstShopifyCollection.shopifyCollectionId,
    handle: firstShopifyCollection.handle,
  })

  if (!firstShopifyCollection.shopifyCollectionId && !firstShopifyCollection.handle) {
    console.log('[CollectionShowcase] ⚠️ First collection has no identifier')
    return value // No identifier to match on
  }

  try {
    // Build query to find matching Collection document
    const whereQuery: any = {}

    // Try to match by shopifyCollectionId first (most reliable)
    if (firstShopifyCollection.shopifyCollectionId) {
      whereQuery.shopifyCollectionId = { equals: firstShopifyCollection.shopifyCollectionId }
    } else if (firstShopifyCollection.handle) {
      // Fallback to handle if no ID
      whereQuery.handle = { equals: firstShopifyCollection.handle }
    }

    console.log('[CollectionShowcase] Querying Collections with:', whereQuery)

    // Query Collections collection
    const { docs: matchingCollections } = await req.payload.find({
      collection: 'collections',
      where: whereQuery,
      limit: 1,
      depth: 0, // Only need ID
      overrideAccess: false, // Respect access control
      req, // Pass req for transaction context
    })

    // Return the matched collection ID, or create the collection if it doesn't exist
    if (matchingCollections.length > 0) {
      const collection = matchingCollections[0]
      if (!collection) {
        console.log('[CollectionShowcase] ⚠️ Collection at index 0 is undefined')
        return value
      }
      console.log(`[CollectionShowcase] ✅ Auto-populated collection: ${collection.title || collection.id} (ID: ${collection.id})`)
      return collection.id
    } else {
      // Collection doesn't exist — create it now so the relationship field resolves.
      // No `req` passed so it runs in its own transaction and commits immediately.
      console.log(`[CollectionShowcase] 🆕 Collection not found, creating: ${firstShopifyCollection.title}`)
      const newCollection = await req.payload.create({
        collection: 'collections',
        data: {
          shopifyCollectionId: firstShopifyCollection.shopifyCollectionId,
          title: firstShopifyCollection.title,
          handle: firstShopifyCollection.handle,
          productCount: 0,
        },
        context: { skipCollectionCleanup: true },
      })
      console.log(`[CollectionShowcase] ✅ Created collection: ${firstShopifyCollection.title} (ID: ${newCollection.id})`)
      return newCollection.id
    }
  } catch (error) {
    console.error('[CollectionShowcase] ❌ Error auto-populating collection:', error)
  }

  return value // Return original value if no match found
}

export const CollectionShowcase: Block = {
  slug: 'product-collection-showcase',
  labels: {
    singular: '🎯 Collection Showcase',
    plural: 'Collection Showcases',
  },
  imageURL: 'https://via.placeholder.com/300x200?text=Collection+Showcase',
  imageAltText: 'Showcase a collection with media, heading, and description - auto-detects collection from product',
  interfaceName: 'ProductCollectionShowcaseBlock',
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Toggle to show or hide this collection showcase',
      },
    },
    {
      name: 'collection',
      type: 'relationship',
      relationTo: 'collections',
      required: true,
      maxDepth: 1, // Fetch collection with content fields
      hooks: {
        beforeChange: [autoPopulateCollection],
      },
      filterOptions: ({ data }) => {
        // Filter to only show collections that this product belongs to
        // This makes manual selection easier and prevents selecting unrelated collections
        if (data?.shopifyCollections && Array.isArray(data.shopifyCollections) && data.shopifyCollections.length > 0) {
          // Get all collection IDs from the product
          const collectionIds = data.shopifyCollections
            .map((c: any) => c.shopifyCollectionId)
            .filter(Boolean)

          if (collectionIds.length > 0) {
            return {
              shopifyCollectionId: {
                in: collectionIds,
              },
            }
          }
        }

        // If no collections, show all (fallback)
        return true
      },
      admin: {
        description:
          'Collection to showcase (auto-populated from product collections, can be manually changed)',
      },
    },
    {
      name: 'bannerSize',
      type: 'select',
      options: [
        { label: 'Extra Extra Small (150px)', value: 'xxs' },
        { label: 'Extra Small (250px)', value: 'xs' },
        { label: 'Small (400px)', value: 'small' },
        { label: 'Medium (600px)', value: 'medium' },
        { label: 'Large (800px)', value: 'large' },
        { label: 'Full Screen (100vh)', value: 'fullscreen' },
      ],
      admin: {
        description: 'Optional: Override banner height (uses collection default if not set)',
        isClearable: true,
      },
    },
    {
      name: 'customSubheading',
      type: 'textarea',
      admin: {
        description: 'Optional: Override the collection subheading with product-specific text',
        placeholder: 'Leave empty to use the collection\'s default subheading',
      },
    },
    {
      name: 'overrideYoutubeUrl',
      type: 'text',
      admin: {
        description: 'Optional: YouTube URL to override the collection\'s default video on this block only.',
        placeholder: 'https://www.youtube.com/watch?v=...',
      },
    },
  ],
}
