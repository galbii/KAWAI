import type { Config, Plugin } from 'payload'
import { ARTISTS_SEED_DATA } from '@/lib/data/artists-seed-data'

// Wraps a plain-text bio string into Payload's Lexical editor JSON format.
// Splits on double newlines to produce separate paragraphs.
function buildLexicalBio(text: string) {
  const makeTextNode = (t: string) => ({
    detail: 0,
    format: 0,
    mode: 'normal' as const,
    style: '',
    text: t,
    type: 'text',
    version: 1,
  })

  const makeParagraph = (children: unknown[]) => ({
    children,
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    type: 'paragraph',
    version: 1,
    textFormat: 0,
    textStyle: '',
  })

  const paragraphNodes = text
    .split(/\n\n+/)
    .map((chunk) => chunk.replace(/\n/g, ' ').trim())
    .filter(Boolean)
    .map((chunk) => makeParagraph([makeTextNode(chunk)]))

  return {
    root: {
      children: paragraphNodes,
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      type: 'root',
      version: 1,
    },
  }
}

export const artistsSeedPlugin = (): Plugin =>
  (config: Config): Config => {
    const incomingOnInit = config.onInit

    config.onInit = async (payload) => {
      if (incomingOnInit) await incomingOnInit(payload)

      if (process.env.PAYLOAD_SEED !== 'true') return

      payload.logger.info('🌱 Seeding Artists…')

      let created = 0
      let skipped = 0

      for (const artist of ARTISTS_SEED_DATA) {
        // Deduplicate by slug
        const existing = await payload.find({
          collection: 'artists',
          where: { slug: { equals: artist.slug } },
          limit: 1,
          depth: 0,
        })

        if (existing.docs[0]) {
          skipped++
          continue
        }

        try {
          await payload.create({
            collection: 'artists',
            context: { disableRevalidate: true },
            data: {
              name: artist.name,
              slug: artist.slug,
              genre: artist.genre,
              isActive: artist.isActive,
              isShigeruArtist: artist.isShigeruArtist,
              ...(artist.region ? { region: artist.region } : {}),
              shortBio: artist.shortBio,
              bio: buildLexicalBio(artist.bio),
              ...(artist.audienceMetrics
                ? {
                    audienceMetrics: {
                      instagramFollowers: artist.audienceMetrics.instagramFollowers,
                      youtubeSubscribers: artist.audienceMetrics.youtubeSubscribers,
                      spotifyMonthlyListeners: artist.audienceMetrics.spotifyMonthlyListeners,
                    },
                  }
                : {}),
              socialLinks: artist.socialLinks.map((link) => ({
                platform: link.platform,
                url: link.url,
                ...(link.label ? { label: link.label } : {}),
              })),
              ...(artist.internalNotes ? { internalNotes: artist.internalNotes } : {}),
              _status: 'published',
            } as any,
          })
          created++
        } catch (err) {
          payload.logger.warn(
            `  ⚠ Skipped "${artist.slug}": ${err instanceof Error ? err.message : String(err)}`,
          )
        }
      }

      payload.logger.info(
        `🎉 Artist seeding complete — ${created} created, ${skipped} skipped`,
      )
    }

    return config
  }
