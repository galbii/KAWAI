import type { Config, Plugin } from 'payload'
import {
  FAQ_SEED_DATA,
  SEED_FAQ_CATEGORIES,
  SEED_SUPPORT_GROUPS,
} from '@/lib/data/faqs-seed-data'

// ── Lexical rich-text helpers ─────────────────────────────────────────────────

function makeParagraph(text: string) {
  return {
    type: 'paragraph' as const,
    format: '' as const,
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    children: [
      {
        type: 'text' as const,
        format: 0,
        style: '',
        mode: 'normal' as const,
        detail: 0,
        version: 1,
        text,
      },
    ],
  }
}

function toLexical(paragraphs: string[]) {
  return {
    root: {
      type: 'root' as const,
      format: '' as const,
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      children: paragraphs.map(makeParagraph),
    },
  }
}

// ── Plugin ────────────────────────────────────────────────────────────────────

export const faqsSeedPlugin = (): Plugin =>
  (config: Config): Config => {
    const incomingOnInit = config.onInit

    config.onInit = async (payload) => {
      if (incomingOnInit) await incomingOnInit(payload)

      if (process.env.PAYLOAD_SEED !== 'true') return

      payload.logger.info('🌱 Seeding FAQs, support groups, and categories…')

      try {
        // ── 1. Find or create the two new support groups ──────────────────────
        const groupIdMap: Record<string, string> = {}

        for (const group of SEED_SUPPORT_GROUPS) {
          const existing = await payload.find({
            collection: 'support-groups',
            where: { slug: { equals: group.slug } },
            limit: 1,
          })

          if (existing.docs[0]) {
            groupIdMap[group.slug] = existing.docs[0].id as string
            payload.logger.info(`  ↩ Reused group: ${group.name}`)
          } else {
            const created = await payload.create({
              collection: 'support-groups',
              data: group,
            })
            groupIdMap[group.slug] = created.id as string
            payload.logger.info(`  ✓ Created group: ${group.name}`)
          }
        }

        // ── 2. Find or create categories ──────────────────────────────────────
        const categoryIdMap: Record<string, string> = {}

        for (const cat of SEED_FAQ_CATEGORIES) {
          const groupId = groupIdMap[cat.groupSlug]
          if (!groupId) {
            payload.logger.warn(`  ⚠ No group ID for slug "${cat.groupSlug}" — skipping category "${cat.name}"`)
            continue
          }

          const existing = await payload.find({
            collection: 'faq-categories',
            where: { slug: { equals: cat.slug } },
            limit: 1,
          })

          if (existing.docs[0]) {
            categoryIdMap[cat.slug] = existing.docs[0].id as string
            payload.logger.info(`  ↩ Reused category: ${cat.name}`)
          } else {
            const { groupSlug: _, ...catData } = cat
            const created = await payload.create({
              collection: 'faq-categories',
              data: { ...catData, group: groupId },
            })
            categoryIdMap[cat.slug] = created.id as string
            payload.logger.info(`  ✓ Created category: ${cat.name}`)
          }
        }

        // ── 3. Seed FAQs ──────────────────────────────────────────────────────
        let created = 0
        let skipped = 0

        for (const faq of FAQ_SEED_DATA) {
          const groupId = groupIdMap[faq.groupSlug]
          const categoryId = categoryIdMap[faq.categorySlug]

          if (!groupId) {
            payload.logger.warn(`  ⚠ Missing group for FAQ: "${faq.question}" — skipping`)
            skipped++
            continue
          }

          // Deduplicate by question text
          const existing = await payload.find({
            collection: 'faqs',
            where: { question: { equals: faq.question } },
            limit: 1,
          })

          if (existing.docs[0]) {
            skipped++
            continue
          }

          await payload.create({
            collection: 'faqs',
            data: {
              question: faq.question,
              excerpt: faq.excerpt,
              answer: toLexical(faq.answer),
              group: groupId,
              categories: categoryId ? [categoryId] : [],
              status: 'published',
              publishedDate: new Date().toISOString(),
            },
          })
          created++
        }

        payload.logger.info(
          `🎉 FAQ seeding complete — ${created} created, ${skipped} skipped`,
        )
      } catch (err) {
        payload.logger.error(
          `❌ FAQ seeding failed: ${err instanceof Error ? err.message : String(err)}`,
        )
      }
    }

    return { ...config }
  }
