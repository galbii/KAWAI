import { getPayload } from 'payload'
import config from '../src/payload.config'

async function main() {
  const payload = await getPayload({ config })

  const cmsPage = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'artists' }, _status: { equals: 'published' } },
    limit: 1,
    depth: 0,
  })
  console.log(`\nCMS page with slug 'artists': ${cmsPage.docs.length > 0 ? 'EXISTS' : 'NONE'}`)
  if (cmsPage.docs[0]) {
    const layout = (cmsPage.docs[0] as any).layout || []
    console.log(`  Blocks in CMS page: ${layout.map((b: any) => b.blockType).join(', ')}`)
  }

  const allArtists = await payload.find({
    collection: 'artists',
    limit: 1000,
    depth: 1,
  })

  const total = allArtists.docs.length
  const current = allArtists.docs.filter((a: any) => a.isActive === true).length
  const legacy = allArtists.docs.filter((a: any) => a.isActive === false).length
  const undef = allArtists.docs.filter((a: any) => a.isActive === undefined || a.isActive === null).length

  console.log(`\nArtist counts:`)
  console.log(`  Total: ${total}`)
  console.log(`  isActive=true (current): ${current}`)
  console.log(`  isActive=false (legacy): ${legacy}`)
  console.log(`  isActive undefined/null: ${undef}`)

  const hasImg = (a: any): boolean => {
    if (a.image && typeof a.image === 'object' && a.image.url) return true
    return Boolean(a.imageUrl)
  }

  const legacyDocs = allArtists.docs.filter((a: any) => a.isActive === false)
  const legacyWithImg = legacyDocs.filter(hasImg).length
  console.log(`\nLegacy artists with featured image: ${legacyWithImg} / ${legacyDocs.length}`)

  if (legacyDocs.length > 0 && legacyDocs.length <= 30) {
    console.log(`\nLegacy artists detail:`)
    for (const a of legacyDocs as any[]) {
      const imgKind = a.image && typeof a.image === 'object' && a.image.url
        ? 'upload'
        : a.imageUrl ? 'url' : 'NONE'
      console.log(`  - ${a.name} | image=${imgKind} | slug=${a.slug}`)
    }
  }

  const currentDocs = allArtists.docs.filter((a: any) => a.isActive === true)
  const currentWithoutImg = currentDocs.filter((a: any) => !hasImg(a))
  console.log(`\nCurrent artists missing featured image: ${currentWithoutImg.length} / ${currentDocs.length}`)
  if (currentWithoutImg.length > 0 && currentWithoutImg.length <= 30) {
    for (const a of currentWithoutImg as any[]) {
      console.log(`  - ${a.name} | slug=${a.slug}`)
    }
  }

  process.exit(0)
}

main().catch((err) => { console.error(err); process.exit(1) })
