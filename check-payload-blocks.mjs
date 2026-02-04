import config from './src/payload.config.ts'

console.log('Checking blocks registered in payload.config.ts...\n')

const blocks = config.blocks || []

console.log(`Total blocks registered: ${blocks.length}\n`)

blocks.forEach((block, index) => {
  if (block === undefined || block === null) {
    console.log(`❌ Block at index ${index} is ${block}`)
  } else if (!block.slug) {
    console.log(`⚠️  Block at index ${index} exists but has no slug:`, block)
  } else {
    console.log(`✓ [${index}] ${block.slug}`)
  }
})

const undefinedBlocks = blocks.filter(b => b === undefined || b === null)
if (undefinedBlocks.length > 0) {
  console.log(`\n❌ Found ${undefinedBlocks.length} undefined blocks!`)
  process.exit(1)
} else {
  console.log('\n✅ All blocks are defined')
}
