import type { CollectionConfig, Condition } from 'payload'
import { imageField, mediaArrayField } from '@/lib/payload/fields'

// Shared conditions for the Promo Popup tab — fields only appear once the promo
// is enabled, and style-specific fields only for their own style. siblingData is
// the successorPromo tab's own data.
const promoEnabled: Condition = (_, siblingData) => Boolean(siblingData?.enabled)

// Docs saved before the style field existed are successor promos
const promoStyleIs = (siblingData: any, style: 'single' | 'successor' | 'bundle'): boolean =>
  Boolean(siblingData?.enabled) && (siblingData?.style ?? 'successor') === style

const singleStyle: Condition = (_, siblingData) => promoStyleIs(siblingData, 'single')
const successorStyle: Condition = (_, siblingData) => promoStyleIs(siblingData, 'successor')
const bundleStyle: Condition = (_, siblingData) => promoStyleIs(siblingData, 'bundle')
// The single and bundle styles both need an explicit CTA target; the successor
// style takes its link from the successor relationship instead.
const needsCtaTarget: Condition = (_, siblingData) =>
  promoStyleIs(siblingData, 'single') || promoStyleIs(siblingData, 'bundle')
// mediaArrayField's admin.condition takes the two-argument form
const bundleStyleCondition = (_data: any, siblingData: any): boolean =>
  promoStyleIs(siblingData, 'bundle')

// CTA target fields — shown for the chosen link type only
const ctaTypeIs =
  (type: 'product' | 'collection' | 'custom'): Condition =>
  (data, siblingData, ctx) =>
    needsCtaTarget(data, siblingData, ctx) && (siblingData?.ctaType ?? 'product') === type

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
    defaultColumns: ['title', 'handle', 'featured', 'productCount', 'updatedAt'],
    useAsTitle: 'title',
    description: 'Product collections automatically synced from Shopify',
  },
  access: {
    read: () => true, // Public read access for frontend
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        // Collection Details Tab
        {
          label: 'Collection Details',
          description: 'Basic collection information synced from Shopify',
          fields: [
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
          ],
        },

        // Content Tab - New for Collection Showcase Block
        {
          label: 'Content',
          description: 'Showcase content used in product collection showcase blocks',
          fields: [
            {
              name: 'youtubeUrl',
              type: 'text',
              admin: {
                description: 'YouTube video URL for banner background (supports youtube.com/watch, youtu.be, embed formats)',
                placeholder: 'https://www.youtube.com/watch?v=...',
              },
            },
            {
              name: 'media',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Fallback image shown when no YouTube URL is set',
              },
            },
            {
              name: 'heading',
              type: 'text',
              admin: {
                description: 'Main heading text for collection banner',
                placeholder: 'Discover the CA Series',
              },
            },
            {
              name: 'subheading',
              type: 'textarea',
              admin: {
                description: 'Subheading or description text for collection banner',
                placeholder: 'Experience the perfect blend of innovation and artistry...',
              },
            },
            {
              name: 'bannerSize',
              type: 'select',
              defaultValue: 'xs',
              options: [
                { label: 'Extra Extra Small (150px)', value: 'xxs' },
                { label: 'Extra Small (250px)', value: 'xs' },
                { label: 'Small (400px)', value: 'small' },
                { label: 'Medium (600px)', value: 'medium' },
                { label: 'Large (800px)', value: 'large' },
                { label: 'Full Screen (100vh)', value: 'fullscreen' },
              ],
              admin: {
                description: 'Banner height',
              },
            },
            {
              name: 'textAlignment',
              type: 'select',
              defaultValue: 'center',
              options: [
                { label: 'Left', value: 'left' },
                { label: 'Center', value: 'center' },
                { label: 'Right', value: 'right' },
              ],
              admin: {
                description: 'Text alignment within the banner',
              },
            },
            {
              name: 'textColor',
              type: 'select',
              defaultValue: 'white',
              options: [
                { label: 'White', value: 'white' },
                { label: 'Black', value: 'black' },
                { label: 'Kawai Red', value: 'kawai-red' },
                { label: 'Kawai Gold', value: 'kawai-gold' },
              ],
              admin: {
                description: 'Text color for heading and subheading',
              },
            },
            {
              name: 'overlayOpacity',
              type: 'number',
              min: 0,
              max: 100,
              defaultValue: 50,
              admin: {
                description: 'Dark overlay opacity (0-100%) for better text readability',
              },
            },
            {
              name: 'headingSize',
              type: 'select',
              defaultValue: 'large',
              options: [
                { label: 'Small (2xl)', value: 'small' },
                { label: 'Medium (3xl)', value: 'medium' },
                { label: 'Large (4xl)', value: 'large' },
                { label: 'Extra Large (5xl)', value: 'xl' },
              ],
              admin: {
                description: 'Heading text size',
              },
            },
            {
              name: 'fontFamily',
              type: 'select',
              defaultValue: 'serif',
              options: [
                { label: 'Serif (Playfair Display)', value: 'serif' },
                { label: 'Sans (Inter)', value: 'sans' },
              ],
              admin: {
                description: 'Font family for heading',
              },
            },
          ],
        },

        // Promo Popup Tab — an interrupting popup on this collection's page.
        // Field name stays `successorPromo` so existing promo data survives.
        {
          name: 'successorPromo',
          label: 'Promo Popup',
          description:
            'Show a popup on this collection page — either pointing visitors to a successor collection, or showcasing a product bundle',
          fields: [
            {
              name: 'enabled',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Enable the popup on this collection page',
              },
            },
            {
              name: 'style',
              type: 'select',
              defaultValue: 'successor',
              options: [
                { label: 'Single — one image, headline and link', value: 'single' },
                { label: 'Successor — point visitors at a newer collection', value: 'successor' },
                { label: 'Bundle — showcase products sold together', value: 'bundle' },
              ],
              admin: {
                description:
                  'Single: one image over centred copy, linking wherever you point it. Successor: the same, with a lineage marque and a link to the replacement collection. Bundle: an image carousel plus the products in the bundle, their separate total crossed out, and the bundle price.',
                condition: promoEnabled,
              },
            },
            {
              name: 'successorCollection',
              type: 'relationship',
              relationTo: 'collections',
              // A collection can't be its own successor
              filterOptions: ({ id }) => (id ? { id: { not_equals: id } } : true),
              admin: {
                description: 'The newer collection to promote — the popup links to its page',
                condition: successorStyle,
              },
            },
            {
              name: 'eyebrow',
              type: 'text',
              admin: {
                description:
                  'Small uppercase label above the popup headline. Leave blank for "The Next Generation" (successor) or "Bundle Offer" (bundle)',
                placeholder: 'Starting October 1',
                condition: promoEnabled,
              },
            },
            {
              name: 'title',
              type: 'text',
              admin: {
                description:
                  'Popup headline. Successor style leaves blank to use "Meet the {successor title}"; single and bundle styles require one',
                placeholder: 'Designer Stand Bundle',
                condition: promoEnabled,
              },
            },
            {
              name: 'message',
              type: 'textarea',
              admin: {
                description: 'Short supporting text under the headline',
                placeholder:
                  'This series has been reimagined. Discover its successor — refined sound, upgraded action, and a new design.',
                condition: promoEnabled,
              },
            },
            {
              name: 'ctaLabel',
              type: 'text',
              admin: {
                description:
                  'Button label. Leave blank for "Explore the New Collection" (successor), "Shop the Bundle" (bundle) or "Learn More" (single)',
                condition: promoEnabled,
              },
            },
            imageField('image', {
              admin: {
                description:
                  "Popup image. Required for the Single style; the Successor style falls back to the successor collection's Shopify image. Bundle style uses the carousel below instead.",
                condition: (data, siblingData, ctx) =>
                  singleStyle(data, siblingData, ctx) || successorStyle(data, siblingData, ctx),
              },
            }),

            // ── Bundle style ──────────────────────────────────────────────────
            {
              name: 'bundleItems',
              type: 'array',
              minRows: 2,
              maxRows: 4,
              admin: {
                description:
                  'The products in the bundle, in showcase order. Each piece shows its thumbnail, model and price, joined by "+". Two to four reads best.',
                condition: bundleStyle,
                initCollapsed: false,
              },
              fields: [
                {
                  name: 'product',
                  type: 'relationship',
                  relationTo: 'products',
                  required: true,
                  admin: {
                    description: 'Pick the product — its model, price and image are pulled in',
                  },
                },
                {
                  name: 'label',
                  type: 'text',
                  admin: {
                    description:
                      "Optional name override — defaults to the product's display label or model",
                    placeholder: 'HML-3 Designer Stand',
                  },
                },
                {
                  name: 'priceOverride',
                  type: 'number',
                  min: 0,
                  admin: {
                    description:
                      "US price override (USD) — defaults to the product's synced MSRP. Set 0 to hide this piece's price.",
                  },
                },
                {
                  name: 'priceOverrideCAD',
                  type: 'number',
                  min: 0,
                  admin: {
                    description:
                      "CA price override (CAD) — defaults to the product's synced CA price. Only used on ca.kawaius.com.",
                  },
                },
                imageField('image', {
                  admin: {
                    description:
                      "Optional thumbnail override — defaults to the product's Shopify image",
                  },
                }),
              ],
            },
            mediaArrayField('bundleMedia', {
              maxRows: 6,
              filterOptions: { mimeType: { contains: 'image' } },
              admin: {
                description:
                  "Bundle imagery carousel shown beside the offer. Leave empty to fall back to the pieces' own product shots.",
                condition: bundleStyleCondition,
              },
            }),
            {
              name: 'bundlePrice',
              type: 'number',
              min: 0,
              admin: {
                description:
                  'Bundle price in USD — shown in red in place of the crossed-out separate total. Leave blank to showcase the bundle without pricing.',
                condition: bundleStyle,
              },
            },
            {
              name: 'bundlePriceCAD',
              type: 'number',
              min: 0,
              admin: {
                description:
                  'Bundle price in CAD — used on ca.kawaius.com. Leave blank and the CA popup shows no pricing (US figures are never shown there).',
                condition: bundleStyle,
              },
            },
            {
              name: 'priceNote',
              type: 'text',
              admin: {
                description: 'Fine print under the bundle price',
                placeholder: 'Until December 1st, at participating dealers',
                condition: bundleStyle,
              },
            },
            {
              name: 'ctaType',
              type: 'select',
              defaultValue: 'product',
              options: [
                { label: 'Product page', value: 'product' },
                { label: 'Collection page', value: 'collection' },
                { label: 'Custom URL', value: 'custom' },
              ],
              admin: {
                description: 'Where the CTA button sends visitors',
                condition: needsCtaTarget,
              },
            },
            {
              name: 'ctaProduct',
              type: 'relationship',
              relationTo: 'products',
              admin: {
                description: 'Product page the CTA links to',
                condition: ctaTypeIs('product'),
              },
            },
            {
              name: 'ctaCollection',
              type: 'relationship',
              relationTo: 'collections',
              admin: {
                description: 'Collection page the CTA links to',
                condition: ctaTypeIs('collection'),
              },
            },
            {
              name: 'ctaUrl',
              type: 'text',
              admin: {
                description: 'Any path or URL — e.g. /find-a-dealer',
                placeholder: '/find-a-dealer',
                condition: ctaTypeIs('custom'),
              },
            },
            {
              name: 'sites',
              type: 'select',
              defaultValue: 'both',
              options: [
                { label: 'Both sites', value: 'both' },
                { label: 'US only (kawaius.com)', value: 'us' },
                { label: 'Canada only (ca.kawaius.com)', value: 'cad' },
              ],
              admin: {
                description:
                  'Which storefront shows this popup. US-market offers (e.g. a US dealer promotion) must be set to US only, or the Canadian site advertises an offer its visitors cannot redeem.',
                condition: promoEnabled,
              },
            },
            {
              name: 'displayFrequency',
              type: 'select',
              defaultValue: 'session',
              options: [
                { label: 'Once per session', value: 'session' },
                { label: 'Once per visitor (persists across visits)', value: 'visitor' },
                { label: 'Every page view', value: 'always' },
              ],
              admin: {
                description: 'How often a visitor sees the popup after dismissing it',
                condition: promoEnabled,
              },
            },
            {
              name: 'delaySeconds',
              type: 'number',
              min: 0,
              max: 60,
              defaultValue: 2,
              admin: {
                description: 'Seconds to wait before the popup slides in',
                condition: promoEnabled,
              },
            },
          ],
        },
      ],
    },

    // Featured flag — controls visibility in the nav mega menu carousel
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Show in the navigation mega menu carousel (Featured Collections)',
        position: 'sidebar',
      },
    },

    // Legacy flag — hides the collection from the product menu dropdown entirely
    {
      name: 'legacy',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description:
          'Mark as a legacy collection. Legacy collections are hidden from the product menu dropdown (featured carousel, footer strip, and category tabs).',
        position: 'sidebar',
      },
    },

    // Priority — controls sort order in the nav footer collection strip
    {
      name: 'collectionPriority',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Higher value = shown first in the nav collection footer. Default 0.',
        position: 'sidebar',
      },
    },

    // Piano category association — controls which category filter tabs reveal this collection
    {
      name: 'pianoCategories',
      type: 'select',
      hasMany: true,
      admin: {
        description:
          'Associate with piano category filters. When a visitor selects Digital, Grand, Upright, Hybrid, or Shigeru Kawai on the /pianos page, only collections tagged here will appear in the collection filter row.',
        position: 'sidebar',
        isClearable: true,
      },
      options: [
        { label: 'Digital', value: 'digital' },
        { label: 'Grand', value: 'grand' },
        { label: 'Upright', value: 'upright' },
        { label: 'Hybrid', value: 'hybrid' },
        { label: 'Shigeru Kawai', value: 'shigeru' },
      ],
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
    afterChange: [
      // ─── Custom Search Index Sync ──────────────────────────────────────────────
      // Bypasses @payloadcms/plugin-search's auto-sync because Payload 3.71.1 has
      // a bug in db-mongodb/queries/parseParams.js:68 where querying polymorphic
      // relationship fields with dotted-path notation throws:
      //   TypeError: Cannot delete property '0' of [object String]
      // We query by collectionHandle (a scalar custom field) instead.
      async ({ doc, operation, req }) => {
        const { payload } = req
        try {
          const collectionTags = [
            { tag: 'collection' },
            ...(doc.shopify?.collectionType ? [{ tag: doc.shopify.collectionType }] : []),
            ...(doc.featured ? [{ tag: 'featured' }] : []),
          ]
          const searchData = {
            doc: { relationTo: 'collections' as const, value: doc.id },
            title: doc.title,
            excerpt: doc.description?.substring(0, 200) || doc.heading || doc.title || '',
            category: 'collection',
            tags: collectionTags,
            collectionHandle: doc.handle,
            collectionTitle: doc.title,
            // Comma-separated piano category values so the search API can match
            // category-term queries ("grand pianos" → all collections tagged 'grand').
            collectionPianoCategories: Array.isArray(doc.pianoCategories)
              ? doc.pianoCategories.join(',')
              : '',
          }

          if (operation === 'create') {
            await payload.create({ collection: 'search', data: { ...searchData, priority: 15 }, depth: 0, req, overrideAccess: true })
          } else {
            // Query by collectionHandle — avoids the broken polymorphic dotted-path query
            const existing = await payload.find({
              collection: 'search',
              where: { collectionHandle: { equals: doc.handle } },
              depth: 0,
              limit: 1,
              req,
            })

            const existingDoc = existing.docs[0]

            if (existingDoc) {
              await payload.update({
                collection: 'search',
                id: existingDoc.id,
                data: { ...searchData, priority: (existingDoc as any).priority ?? 15 },
                depth: 0,
                req,
                overrideAccess: true,
              })
            } else {
              await payload.create({ collection: 'search', data: { ...searchData, priority: 15 }, depth: 0, req, overrideAccess: true })
            }
          }
        } catch (error) {
          payload.logger.error(`Failed to sync collection ${doc.handle} to search index: ${error}`)
        }

        return doc
      },

      // ─── Revalidation + Cleanup ────────────────────────────────────────────────
      async ({ doc, req, context, operation }) => {
        // Revalidate the products navigation cache whenever a collection is saved
        // This ensures featured carousel updates immediately without waiting for the 5-min TTL
        try {
          const { revalidateTag } = await import('next/cache')
          revalidateTag('products-navigation')
          // getNavCollections (footer strip + featured carousel) is tagged 'collections',
          // not 'products-navigation' — bust it too so featured/legacy/priority changes
          // reflect immediately instead of waiting out the 5-min TTL.
          revalidateTag('collections')
        } catch {
          // next/cache unavailable outside Next.js runtime (e.g. in seed scripts) — ignore
        }

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
