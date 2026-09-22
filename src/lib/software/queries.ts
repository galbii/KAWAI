import 'server-only'

import { unstable_cache } from 'next/cache'
import { getPayloadClient } from '@/lib/payload/queries'
import type { SoftwareCategory, SoftwareModel } from './types'

/**
 * Named alias, not an inline annotation: an inline `Promise<{ ... }>` inside an
 * unstable_cache argument fails to parse in this toolchain.
 */
type SoftwareModelList = SoftwareModel[]

interface RawDownload {
  label?: string | null
  version?: string | null
  fileUrl?: string | null
  fileBytes?: number | null
  instructionsUrl?: string | null
}

interface RawRelease {
  slug?: string | null
  model?: string | null
  category?: string | null
  series?: string | null
  aliases?: { name?: string | null }[] | null
  downloads?: RawDownload[] | null
  notes?: string | null
}

const CATEGORIES: SoftwareCategory[] = ['digital', 'hybrid', 'anytime']

function toModel(doc: RawRelease): SoftwareModel | null {
  const model = doc.model?.trim()
  const slug = doc.slug?.trim()
  if (!model || !slug) return null

  const downloads = (doc.downloads ?? [])
    .filter((d): d is RawDownload & { fileUrl: string } => Boolean(d?.fileUrl))
    .map((d) => ({
      label: d.label?.trim() || 'System',
      version: d.version?.trim() ?? '',
      fileUrl: d.fileUrl,
      fileBytes: d.fileBytes ?? null,
      instructionsUrl: d.instructionsUrl?.trim() || null,
    }))

  // A model with no usable download has nothing to offer — drop it rather than
  // render a row whose buttons go nowhere.
  if (downloads.length === 0) return null

  const category = CATEGORIES.includes(doc.category as SoftwareCategory)
    ? (doc.category as SoftwareCategory)
    : 'digital'

  const aliases = (doc.aliases ?? [])
    .map((a) => a?.name?.trim())
    .filter((n): n is string => Boolean(n))

  return {
    slug,
    model,
    aliases: aliases.length > 0 ? aliases : [model],
    category,
    series: (doc.series ?? '').toUpperCase() || 'OTHER',
    downloads,
    ...(doc.notes?.trim() ? { notes: doc.notes.trim() } : {}),
  }
}

/**
 * Every active firmware release, shaped for the /software page.
 *
 * depth: 0 — this collection has no relationships, so there is nothing to populate.
 */
export const getSoftwareReleases = unstable_cache(
  async (): Promise<SoftwareModelList> => {
    const payload = await getPayloadClient()

    const result = await payload.find({
      collection: 'software-releases',
      where: { isActive: { equals: true } },
      select: {
        slug: true,
        model: true,
        category: true,
        series: true,
        aliases: true,
        downloads: true,
        notes: true,
      },
      depth: 0,
      limit: 500,
      pagination: false,
    })

    return (result.docs as RawRelease[])
      .map(toModel)
      .filter((m): m is SoftwareModel => m !== null)
  },
  ['software-releases-all'],
  { tags: ['software-releases'], revalidate: 3600 },
)
