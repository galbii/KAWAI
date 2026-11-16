/**
 * Which collections appear as pills under each piano tab of the products mega
 * menu. Shared by the menu (client) and the nav server action, which uses it to
 * work out each tab's "Other" pill — products in no pill on that tab.
 */

/** Tab keys double as Product `type` values. Order matters: first match wins. */
export const CATEGORY_COLLECTION_TERMS = {
  digital: ['digital'],
  hybrid: ['hybrid'],
  upright: ['upright'],
  grand: ['grand', 'baby grand', 'baby-grand', 'gl series'],
} as const

export type PianoCategoryKey = keyof typeof CATEGORY_COLLECTION_TERMS

export const PIANO_CATEGORY_KEYS = Object.keys(CATEGORY_COLLECTION_TERMS) as PianoCategoryKey[]

/** Sentinel `nav_col` value for the "Other" pill — not a real collection handle. */
export const OTHER_PILL_HANDLE = '__other'

interface CategorizableCollection {
  title: string
  handle: string
  pianoCategories?: string[] | null
}

/** Fallback for collections without `pianoCategories`: match tab terms in title/handle. */
function getCategoryKeyForCollection(collection: CategorizableCollection): PianoCategoryKey | null {
  const titleLower = collection.title.toLowerCase()
  const handleLower = collection.handle.toLowerCase()
  for (const key of PIANO_CATEGORY_KEYS) {
    const terms: readonly string[] = CATEGORY_COLLECTION_TERMS[key]
    if (terms.some((term) => titleLower.includes(term) || handleLower.includes(term))) return key
  }
  return null
}

/** Collections shown as pills on a tab. Explicit `pianoCategories` wins over term matching. */
export function getCollectionsForCategory<T extends CategorizableCollection>(collections: T[], key: string): T[] {
  return collections.filter((col) => {
    if (col.pianoCategories && col.pianoCategories.length > 0) return col.pianoCategories.includes(key)
    return getCategoryKeyForCollection(col) === key
  })
}
