import type { Config, Plugin } from 'payload'

// Legacy groups removed — support groups are now seeded by faqsSeedPlugin only.
const DEFAULT_GROUPS: { name: string; slug: string; heading: string; description: string; isActive: boolean; displayOrder: number; seo: { metaTitle: string; metaDescription: string } }[] = []
const DEFAULT_CATEGORIES: { name: string; slug: string; description: string; icon: string; color: string; displayOrder: number; hubSlug: string }[] = []

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
