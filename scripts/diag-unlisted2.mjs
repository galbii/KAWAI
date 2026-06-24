import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config })

// Replicate EXACTLY what _getCatalogProductsDirect now does (post-fix), minus unstable_cache.
const result = await payload.find({
  collection: 'products',
  where: {
    status: { not_equals: 'draft' },
  },
  select: {
    model: true,
    status: true,
    shopify: true,
    type: true,
  },
  sort: 'visibility.sortOrder,name',
  limit: 500,
  depth: 0,
})

const mapped = result.docs.map((doc) => ({
  model: doc.model,
  status: doc.status ?? null,
  shopifyStatus: doc?.shopify?.shopifyStatus ?? null,
}))

const unlistedInResult = mapped.filter((p) => p.shopifyStatus === 'UNLISTED')
console.log(`\nTotal fetched: ${mapped.length}`)
console.log(`UNLISTED in result set: ${unlistedInResult.length}`)
console.log(`Sample UNLISTED:`, unlistedInResult.slice(0, 5))
console.log(`Sample mapping shape:`, mapped.slice(0, 3))

process.exit(0)
