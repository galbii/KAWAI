import mongoose from 'mongoose'

/**
 * Drop the orphaned `landing-pages` collection.
 *
 * It is an abandoned earlier attempt at what `signup-campaigns` now does, with
 * no code referencing it. Destructive, so it dry-runs by default: pass
 * `--commit` to actually drop.
 */
const DRY_RUN = !process.argv.includes('--commit')

async function main() {
  await mongoose.connect(process.env.DATABASE_URI!, { family: 4 })
  const db = mongoose.connection.db!

  const names = (await db.listCollections().toArray()).map((c) => c.name)
  if (!names.includes('landing-pages')) {
    console.log('landing-pages does not exist — nothing to do')
    return mongoose.disconnect()
  }

  const docs = await db.collection('landing-pages').find({}).toArray()
  console.log(`landing-pages holds ${docs.length} document(s):`)
  for (const doc of docs) {
    console.log(`  ${doc._id}  slug=${doc.slug}  title=${doc.title}`)
  }

  if (DRY_RUN) {
    console.log('\nDRY RUN — re-run with --commit to drop.')
    return mongoose.disconnect()
  }

  await db.collection('landing-pages').drop()
  console.log('Dropped landing-pages.')
  await mongoose.disconnect()
}

main()
