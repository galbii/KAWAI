/**
 * Pure selection helpers for the Related Products block.
 *
 * The renderer (RelatedProductsRenderer) fetches documents; these functions
 * decide ordering and membership so the logic stays unit-testable without a
 * Payload instance.
 */

type WithId = { id: string }
type WithType = WithId & { type?: string | null }

/**
 * Normalize a Payload relationship value (`hasMany`) into an ordered list of
 * string ids. Values may be plain ids or populated docs depending on depth.
 */
export function extractRelationshipIds(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  const ids: string[] = []
  for (const entry of value) {
    if (typeof entry === 'string') {
      ids.push(entry)
    } else if (typeof entry === 'object' && entry !== null && 'id' in entry) {
      const id = (entry as { id: unknown }).id
      if (typeof id === 'string') ids.push(id)
      else if (typeof id === 'number') ids.push(String(id))
    }
  }
  return ids
}

/**
 * MongoDB `in` queries do not preserve order — restore the editor's pick
 * order. Ids without a matching doc (deleted/inactive) are skipped; docs not
 * in the id list are dropped.
 */
export function orderByIds<T extends WithId>(docs: T[], ids: string[]): T[] {
  const byId = new Map(docs.map((d) => [d.id, d]))
  const result: T[] = []
  for (const id of ids) {
    const doc = byId.get(id)
    if (doc) result.push(doc)
  }
  return result
}

/** Remove duplicate ids (first occurrence wins) and cap at `limit`. */
export function dedupeWithLimit<T extends WithId>(docs: T[], limit: number): T[] {
  const seen = new Set<string>()
  const result: T[] = []
  for (const doc of docs) {
    if (!seen.has(doc.id) && result.length < limit) {
      seen.add(doc.id)
      result.push(doc)
    }
  }
  return result
}

/** Sort so non-accessories come first — pianos fill visible slots before accessories. */
export function nonAccessoriesFirst<T extends WithType>(docs: T[]): T[] {
  return [...docs].sort((a, b) => {
    const aIsAccessory = a.type === 'accessory' ? 1 : 0
    const bIsAccessory = b.type === 'accessory' ? 1 : 0
    return aIsAccessory - bIsAccessory
  })
}

/**
 * Curated picks lead in editor order; auto-discovered results fill any
 * remaining slots up to `limit`, never repeating a curated pick.
 */
export function mergeCuratedWithAuto<T extends WithId>(
  curated: T[],
  auto: T[],
  limit: number,
): T[] {
  return dedupeWithLimit([...curated, ...auto], limit)
}
