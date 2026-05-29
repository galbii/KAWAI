import { MongoClient } from 'mongodb'

/* eslint-disable @typescript-eslint/no-explicit-any */
const DISPLAY_SAMPLES = 12
const SAMPLES_PER_TYPE = Number(process.env.SPT ?? 50)

async function main() {
  const uri = process.env.DATABASE_URI
  if (!uri) throw new Error('DATABASE_URI not set')
  const client = new MongoClient(uri)
  await client.connect()
  const db = client.db()

  // Featured collections: handle -> collectionPriority (for the action's score step)
  const cols = (await db
    .collection('collections')
    .find({}, { projection: { title: 1, handle: 1, featured: 1, pianoCategories: 1, collectionPriority: 1 } })
    .toArray()) as any[]
  const featuredHandleScore = new Map<string, number>()
  for (const c of cols) if (c.featured === true) featuredHandleScore.set(c.handle, c.collectionPriority ?? 0)

  const handlesForCat = (cat: string) =>
    new Set(
      cols
        .filter((c) => c.featured === true && Array.isArray(c.pianoCategories) && c.pianoCategories.includes(cat))
        .map((c) => c.handle),
    )

  async function replicate(type: string, cat: string) {
    const docs = (await db
      .collection('products')
      .find(
        { status: 'active', 'visibility.showInCatalog': true, type, 'shopify.shopifyStatus': { $ne: 'UNLISTED' } },
        { projection: { model: 1, type: 1, featured: 1, visibility: 1, updatedAt: 1, shopifyCollections: 1 } },
      )
      .toArray()) as any[]

    const norm = docs.map((d) => ({
      model: d.model,
      isFeatured: d.featured === true || d.visibility?.featured === true,
      sortOrder: d.visibility?.sortOrder ?? null,
      updatedAt: d.updatedAt,
      collectionIds: Array.isArray(d.shopifyCollections)
        ? d.shopifyCollections.map((c: any) => c?.handle).filter(Boolean)
        : [],
    }))

    // 1) DB sort: -featured, sortOrder asc (nulls first, as Mongo does), -updatedAt, name
    norm.sort((a, b) => {
      if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1
      const ao = a.sortOrder ?? -Infinity
      const bo = b.sortOrder ?? -Infinity
      if (ao !== bo) return ao - bo
      const at = new Date(a.updatedAt).getTime()
      const bt = new Date(b.updatedAt).getTime()
      if (at !== bt) return bt - at
      return String(a.model).localeCompare(String(b.model))
    })
    // 2) slice to samplesPerType
    const sampled = norm.slice(0, SAMPLES_PER_TYPE)
    // 3) action sort: isFeatured, then featured-collection score
    const score = (p: any) =>
      p.collectionIds.reduce((max: number, h: string) => {
        const s = featuredHandleScore.get(h)
        return s !== undefined && s > max ? s : max
      }, -Infinity)
    sampled.sort((a, b) => {
      if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1
      const diff = score(b) - score(a)
      if (diff !== 0) return diff
      return 0
    })
    // 4) slice to DISPLAY_SAMPLES
    const top = sampled.slice(0, DISPLAY_SAMPLES)
    // 5) component sort: isFeatured, then in featured collection for this category
    const fset = handlesForCat(cat)
    top.sort((a, b) => {
      if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1
      const ain = a.collectionIds.some((h: string) => fset.has(h))
      const bin = b.collectionIds.some((h: string) => fset.has(h))
      if (ain !== bin) return ain ? -1 : 1
      return 0
    })

    const withSort = norm.filter((p) => p.sortOrder !== null).length
    const inAnyFeatCol = norm.filter((p) => p.collectionIds.some((h: string) => fset.has(h))).length
    console.log(`\n===== ${type.toUpperCase()} (${cat}) — ${docs.length} products | ${withSort} have sortOrder | ${inAnyFeatCol} in a featured ${cat} collection =====`)
    console.log(`Featured collections tagged '${cat}': ${[...fset].join(', ') || '(NONE)'}`)
    console.log('FINAL DROPDOWN ORDER (top 12):')
    top.forEach((p, i) =>
      console.log(
        `  ${String(i + 1).padStart(2)}. ${String(p.model).padEnd(8)} ${p.isFeatured ? '★FEAT' : '     '} sortOrder:${String(p.sortOrder ?? '-').padStart(4)} inFeatCol:${p.collectionIds.some((h: string) => fset.has(h)) ? 'Y' : '.'} cols:[${p.collectionIds.join(',')}]`,
      ),
    )
  }

  await replicate('digital', 'digital')
  await replicate('grand', 'grand')
  await replicate('upright', 'upright')

  await client.close()
  process.exit(0)
}
main().catch((e) => {
  console.error(e)
  process.exit(1)
})
