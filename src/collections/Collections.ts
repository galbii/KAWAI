import type { CollectionConfig } from 'payload'

/**
 * Collections Collection
 *
 * Automatically synced from Shopify when products are synced.
 * Collections are created/updated when products reference them.
 * Collections with no products are automatically cleaned up.
 */
export const Collections: CollectionConfig = {
  slug: 'collections',
  labels: {
    singular: 'Collection',
    plural: 'Collections',
  },
  admin: {
    group: 'Commerce',
    defaultColumns: ['title', 'handle', 'productCount', 'updatedAt'],
    useAsTitle: 'title',
    description: 'Product collections automatically synced from Shopify',
  },
  access: {
    read: () => true, // Public read access for frontend
  },
  fields: [
    // Basic Collection Information
    {
      name: 'shopifyCollectionId',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'Shopify Collection ID (gid://shopify/Collection/...)',
        readOnly: true,
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Collection title (synced from Shopify)',
      },
    },
    {
      name: 'handle',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'Collection handle/slug (synced from Shopify)',
        readOnly: true,
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Collection description (synced from Shopify)',
      },
    },
    {
      name: 'imageUrl',
      type: 'text',
      admin: {
        description: 'Collection image URL (synced from Shopify)',
        readOnly: true,
      },
    },
    {
      name: 'productCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Number of active products in this collection (auto-calculated)',
        readOnly: true,
      },
    },

    // Shopify Integration Group - Sidebar
    {
      name: 'shopify',
      type: 'group',
      admin: {
        position: 'sidebar',
        description: 'Shopify synchronization metadata',
      },
      fields: [
        {
          name: 'syncStatus',
          type: 'select',
          defaultValue: 'synced',
          options: [
            { label: '🟢 Synced', value: 'synced' },
            { label: '🔴 Error', value: 'error' },
          ],
          admin: {
            description: 'Sync status with Shopify',
            readOnly: true,
          },
        },
        {
          name: 'lastSyncedAt',
          type: 'date',
          admin: {
            description: 'Last sync timestamp',
            readOnly: true,
            date: {
              displayFormat: 'MMM d, yyyy h:mm a',
            },
          },
        },
        {
          name: 'collectionType',
          type: 'select',
          options: [
            { label: 'Custom (Manual)', value: 'custom' },
            { label: 'Smart (Automated)', value: 'smart' },
          ],
          admin: {
            description: 'Collection type in Shopify',
            readOnly: true,
          },
        },
      ],
    },
  ],

  hooks: {
    // Clean up collections with no products
    afterChange: [
      async ({ doc, req, context, operation }) => {
        // Skip if this is already a cleanup operation
        if (context.skipCollectionCleanup) {
          return doc
        }

        // Only check for cleanup after updates
        if (operation === 'update' && doc.productCount === 0) {
          console.log(`[Collections Hook] Collection "${doc.title}" has no products - will be cleaned up`)

          // Delete collection with no products (fire-and-forget)
          setTimeout(async () => {
            try {
              const { getPayload } = await import('payload')
              const config = await import('@payload-config').then(m => m.default)
              const payload = await getPayload({ config })

              // Double-check product count before deleting
              const { docs: products } = await payload.find({
                collection: 'products',
                where: {
                  'shopifyCollections.shopifyCollectionId': {
                    equals: doc.shopifyCollectionId,
                  },
                  status: {
                    equals: 'active',
                  },
                },
                limit: 1,
              })

              if (products.length === 0) {
                await payload.delete({
                  collection: 'collections' as any, // Type assertion needed before type generation
                  id: doc.id,
                  context: { skipCollectionCleanup: true },
                })
                console.log(`[Collections Hook] ✅ Deleted empty collection: ${doc.title}`)
              }
            } catch (error) {
              console.error('[Collections Hook] Error cleaning up collection:', error)
            }
          }, 2000) // 2 second delay to allow product operations to complete
        }

        return doc
      },
    ],
  },
}
