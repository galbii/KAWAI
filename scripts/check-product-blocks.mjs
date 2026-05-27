import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config })

const models = ['MP5', 'K600', 'CA99', 'ES7', 'CN39', 'MP10', 'K2', 'CR40']

for (const model of models) {
  const { docs } = await payload.find({
    collection: 'products',
    where: { model: { equals: model } },
    limit: 1,
    depth: 0,
  })
  const product = docs[0]
  if (!product) {
    console.log(`${model}: NOT FOUND`)
    continue
  }
  const blockTypes = (product.pageContent || []).map(b => b.blockType)
  const hasShowcase = blockTypes.includes('product-collection-showcase')
  console.log(`\n${model} (${product.id}): ${blockTypes.length} blocks, hasCollectionShowcase=${hasShowcase}`)
  console.log(`  blocks: ${blockTypes.join(', ')}`)
  if (hasShowcase) {
    const showcase = product.pageContent.find(b => b.blockType === 'product-collection-showcase')
    console.log(`  collection field:`, showcase.collection, '| enabled:', showcase.enabled)
  }
}

process.exit(0)
