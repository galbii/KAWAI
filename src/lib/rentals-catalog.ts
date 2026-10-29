import { unstable_cache } from 'next/cache'
import { getPayloadClient } from '@/lib/payload/queries'

/**
 * Catalogue data for the rental pages' "regularly available" models and
 * featured finishes. Model codes come from the storefront (or the defaults in
 * `@/lib/rentals`); names and photos come from the product catalogue so they
 * stay in step with Shopify.
 */

export interface RentalCatalogModel {
  /** Catalogue model code — what stores type and what finishes match on. */
  model: string
  /** Display label, e.g. 'GL-10'. */
  label: string
  name: string
  slug: string
  imageUrl: string | null
  /** Finish name → that variant's photo, for featured finishes. */
  finishImages: Array<{ finish: string; imageUrl: string }>
}

type CatalogDoc = {
  model?: string | null
  modelLabel?: string | null
  name?: string | null
  slug?: string | null
  imageUrl?: string | null
  variations?: Array<{ name?: string | null; imageUrl?: string | null }> | null
}

/** Placeholder art Shopify uses for finishes it has no photo of. */
const isPlaceholder = (url: string) => /\/Missing-/i.test(url)

export function getRentalCatalog(models: readonly string[]): Promise<RentalCatalogModel[]> {
  const wanted = [...new Set(models.map((m) => m.trim()).filter(Boolean))]
  if (wanted.length === 0) return Promise.resolve([])

  return unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'products',
        where: { and: [{ status: { equals: 'active' } }, { model: { in: wanted } }] },
        select: { model: true, modelLabel: true, name: true, slug: true, imageUrl: true, variations: true },
        depth: 0,
        limit: wanted.length * 2,
        pagination: false,
      })

      const byModel = new Map<string, RentalCatalogModel>()
      for (const doc of result.docs as CatalogDoc[]) {
        if (!doc.model || !doc.slug || byModel.has(doc.model)) continue
        byModel.set(doc.model, {
          model: doc.model,
          label: doc.modelLabel || doc.model,
          name: doc.name || doc.model,
          slug: doc.slug,
          imageUrl: doc.imageUrl && !isPlaceholder(doc.imageUrl) ? doc.imageUrl : null,
          finishImages: (doc.variations ?? [])
            .filter((v): v is { name: string; imageUrl: string } =>
              Boolean(v.name && v.imageUrl && !isPlaceholder(v.imageUrl)),
            )
            .map((v) => ({ finish: v.name, imageUrl: v.imageUrl })),
        })
      }

      // Keep the store's order; models missing from the catalogue drop out.
      return wanted.flatMap((m) => byModel.get(m) ?? [])
    },
    [`rental-catalog-${wanted.join('+')}`],
    { tags: ['products'], revalidate: 3600 },
  )()
}

/** Photo of a model in a given finish, e.g. GL-10 in "Polished Snow White". */
export function finishImageOf(
  catalog: RentalCatalogModel[],
  model: string,
  match: string | null,
): string | null {
  if (!model || !match) return null
  const entry = catalog.find((c) => c.model.toLowerCase() === model.toLowerCase())
  const needle = match.toLowerCase()
  return entry?.finishImages.find((f) => f.finish.toLowerCase().includes(needle))?.imageUrl ?? null
}
