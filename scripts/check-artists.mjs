import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config })

// Check for CMS page with slug 'artists'
const cmsPage = await payload.find({
  collection: 'pages',
  where: { slug: { equals: 'artists' }, _status: { equals: 'published' } },
  limit: 1,
  depth: 0,
})
console.log(`\nCMS page with slug 'artists': ${cmsPage.docs.length > 0 ? 'EXISTS' : 'NONE'}`)
if (cmsPage.docs[0]) {
  const layout = cmsPage.docs[0].layout || []
  console.log(`  Blocks in CMS page: ${layout.map(b => b.blockType).join(', ')}`)
}

// Count artists by isActive
const allArtists = await payload.find({
  collection: 'artists',
  limit: 1000,
  depth: 1,
})

const total = allArtists.docs.length
const current = allArtists.docs.filter((a) => a.isActive === true).length
const legacy = allArtists.docs.filter((a) => a.isActive === false).length
const undef = allArtists.docs.filter((a) => a.isActive === undefined || a.isActive === null).length

console.log(`\nArtist counts:`)
console.log(`  Total: ${total}`)
console.log(`  isActive=true (current): ${current}`)
console.log(`  isActive=false (legacy): ${legacy}`)
console.log(`  isActive undefined/null: ${undef}`)

// Image presence
const hasImg = (a) => {
  if (a.image && typeof a.image === 'object' && a.image.url) return true
  return Boolean(a.imageUrl)
}

const legacyDocs = allArtists.docs.filter((a) => a.isActive === false)
const legacyWithImg = legacyDocs.filter(hasImg).length
console.log(`\nLegacy artists with featured image: ${legacyWithImg} / ${legacyDocs.length}`)

if (legacyDocs.length > 0 && legacyDocs.length <= 30) {
  console.log(`\nLegacy artists detail:`)
  for (const a of legacyDocs) {
    const imgKind = a.image && typeof a.image === 'object' && a.image.url
      ? 'upload'
      : a.imageUrl ? 'url' : 'NONE'
    console.log(`  - ${a.name} | image=${imgKind} | slug=${a.slug}`)
  }
}

const currentDocs = allArtists.docs.filter((a) => a.isActive === true)
const currentWithoutImg = currentDocs.filter((a) => !hasImg(a))
console.log(`\nCurrent artists missing featured image: ${currentWithoutImg.length} / ${currentDocs.length}`)
if (currentWithoutImg.length > 0 && currentWithoutImg.length <= 30) {
  for (const a of currentWithoutImg) {
    console.log(`  - ${a.name} | slug=${a.slug}`)
  }
}

process.exit(0)
