import type { Config, Plugin } from 'payload'

// ── Default Support Groups ────────────────────────────────────────────────────
const DEFAULT_GROUPS = [
  {
    name: 'Owner Hub',
    slug: 'owner-hub',
    heading: 'I Own a Kawai Piano',
    description: 'Get help with your instrument — maintenance, tuning, repairs, and getting the most from your Kawai.',
    isActive: true,
    displayOrder: 1,
    seo: {
      metaTitle: 'Owner Support Hub | Kawai Technical Support',
      metaDescription: 'Support resources for Kawai piano owners. Find answers about maintenance, tuning, warranty, and more.',
    },
  },
  {
    name: 'Buyer Hub',
    slug: 'buyer-hub',
    heading: "I'm Choosing a Kawai Piano",
    description: 'Everything you need to find and purchase the right Kawai for your needs and budget.',
    isActive: true,
    displayOrder: 2,
    seo: {
      metaTitle: "Buyer's Guide | Kawai Technical Support",
      metaDescription: 'Guidance for choosing your Kawai piano — comparisons, financing, finding a dealer, and more.',
    },
  },
  {
    name: 'Technician Resources',
    slug: 'technician-resources',
    heading: 'Technical Resources',
    description: 'Service documentation, technical specifications, and resources for piano technicians.',
    isActive: true,
    displayOrder: 3,
    seo: {
      metaTitle: 'Technician Resources | Kawai Technical Support',
      metaDescription: 'Technical documentation, service manuals, and professional resources for piano technicians.',
    },
  },
]

// ── Default Categories per hub slug ──────────────────────────────────────────
const DEFAULT_CATEGORIES: Array<{
  name: string
  slug: string
  description: string
  icon: string
  color: string
  displayOrder: number
  hubSlug: string
}> = [
  // Owner Hub
  { name: 'Tuning & Maintenance', slug: 'tuning-maintenance', description: 'Piano tuning schedules, humidity care, and general upkeep.', icon: 'wrench', color: '#6366F1', displayOrder: 1, hubSlug: 'owner-hub' },
  { name: 'Repairs & Service',    slug: 'repairs-service',    description: 'Finding a technician and understanding repair options.',     icon: 'tool',   color: '#EC4899', displayOrder: 2, hubSlug: 'owner-hub' },
  { name: 'Warranty',             slug: 'warranty',           description: 'Kawai warranty terms, registration, and claims.',            icon: 'shield', color: '#22C55E', displayOrder: 3, hubSlug: 'owner-hub' },
  { name: 'Moving & Storage',     slug: 'moving-storage',     description: 'Safely moving and storing your piano.',                      icon: 'home',   color: '#F59E0B', displayOrder: 4, hubSlug: 'owner-hub' },
  { name: 'Accessories',          slug: 'accessories',        description: 'Benches, covers, headphones, and compatible accessories.',   icon: 'star',   color: '#2EC4A0', displayOrder: 5, hubSlug: 'owner-hub' },
  // Buyer Hub
  { name: 'Purchasing & Financing', slug: 'purchasing-financing', description: 'Pricing, financing options, and what to expect.',     icon: 'credit-card', color: '#6366F1', displayOrder: 1, hubSlug: 'buyer-hub' },
  { name: 'Product Comparison',     slug: 'product-comparison',   description: 'Compare models across series and price points.',       icon: 'list',        color: '#2EC4A0', displayOrder: 2, hubSlug: 'buyer-hub' },
  { name: 'Where to Buy',           slug: 'where-to-buy',         description: 'Finding an authorized Kawai dealer near you.',         icon: 'map-pin',     color: '#E8A84E', displayOrder: 3, hubSlug: 'buyer-hub' },
  { name: 'New vs Pre-Owned',       slug: 'new-vs-preowned',      description: 'Considerations when buying new or used.',              icon: 'refresh',     color: '#EC4899', displayOrder: 4, hubSlug: 'buyer-hub' },
  // Technician Resources
  { name: 'Service Documentation', slug: 'service-documentation', description: 'Official service manuals and technical bulletins.', icon: 'file-text', color: '#6366F1', displayOrder: 1, hubSlug: 'technician-resources' },
  { name: 'Tuning Standards',      slug: 'tuning-standards',      description: 'Kawai piano tuning specifications and guidance.',  icon: 'sliders',   color: '#2EC4A0', displayOrder: 2, hubSlug: 'technician-resources' },
  { name: 'Parts & Supplies',      slug: 'parts-supplies',        description: 'Ordering genuine Kawai parts and supplies.',       icon: 'package',   color: '#E8A84E', displayOrder: 3, hubSlug: 'technician-resources' },
  { name: 'Digital Piano Service', slug: 'digital-piano-service', description: 'Service guidance for digital and hybrid models.',  icon: 'cpu',       color: '#EC4899', displayOrder: 4, hubSlug: 'technician-resources' },
]

// ── Plugin ────────────────────────────────────────────────────────────────────
export const supportGroupsSeedPlugin = (): Plugin => (config: Config): Config => {
  return {
    ...config,
    onInit: async (payload) => {
      if (config.onInit) await config.onInit(payload)

      // Only seed if collection is empty (safe to run on every startup)
      const { totalDocs } = await payload.count({ collection: 'support-groups' })
      if (totalDocs > 0) return

      payload.logger.info('🌱 Seeding default Support Groups and FAQ Categories…')

      try {
        // 1. Create support groups and capture their IDs
        const groupIdMap: Record<string, string> = {}

        for (const group of DEFAULT_GROUPS) {
          const created = await payload.create({
            collection: 'support-groups',
            data: group,
          })
          groupIdMap[group.slug] = created.id as string
          payload.logger.info(`  ✓ Created hub: ${group.name}`)
        }

        // 2. Create categories linked to their hub group
        const catCount = await payload.count({ collection: 'faq-categories' })
        if (catCount.totalDocs === 0) {
          for (const cat of DEFAULT_CATEGORIES) {
            const { hubSlug, ...catData } = cat
            const groupId = groupIdMap[hubSlug]
            if (!groupId) continue
            await payload.create({
              collection: 'faq-categories',
              data: { ...catData, group: groupId },
            })
            payload.logger.info(`  ✓ Created category: ${cat.name} → ${hubSlug}`)
          }
        }

        payload.logger.info('🎉 Support Groups seeding complete!')
      } catch (err) {
        payload.logger.error(`❌ Support Groups seeding failed: ${err instanceof Error ? err.message : String(err)}`)
      }
    },
  }
}
