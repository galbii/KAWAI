import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config })

// 1) Are there ANY products whose Shopify status is UNLISTED?
const unlisted = await payload.find({
  collection: 'products',
  where: { 'shopify.shopifyStatus': { equals: 'UNLISTED' } },
  limit: 50,
  depth: 0,
})

console.log(`\n=== Products with shopify.shopifyStatus === 'UNLISTED': ${unlisted.totalDocs} ===`)
for (const p of unlisted.docs) {
  console.log(`  ${p.model.padEnd(14)} status=${String(p.status).padEnd(13)} shopifyStatus=${p?.shopify?.shopifyStatus} type=${p.type}`)
}

// 2) Distribution of shopifyStatus across all products
const all = await payload.find({ collection: 'products', limit: 1000, depth: 0, select: { model: true, status: true, shopify: true, type: true } })
const dist = {}
for (const p of all.docs) {
  const k = `${p?.shopify?.shopifyStatus ?? 'NONE'}`
  dist[k] = (dist[k] ?? 0) + 1
}
console.log(`\n=== shopifyStatus distribution across ${all.totalDocs} products ===`)
console.log(dist)

// 3) Distribution of Payload status
const sdist = {}
for (const p of all.docs) {
  const k = `${p.status ?? 'NONE'}`
  sdist[k] = (sdist[k] ?? 0) + 1
}
console.log(`\n=== Payload status distribution ===`)
console.log(sdist)

process.exit(0)
