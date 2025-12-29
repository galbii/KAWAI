import { MongoClient } from 'mongodb'
import { config as dotenvConfig } from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const envPath = path.resolve(__dirname, '../../.env.local')
dotenvConfig({ path: envPath })

async function fixDealerIndex() {
  console.log('🔧 Fixing Dealer Collection Indexes...\n')

  const databaseUri = process.env.DATABASE_URI
  if (!databaseUri) {
    console.error('❌ DATABASE_URI not found in environment variables')
    process.exit(1)
  }

  const client = new MongoClient(databaseUri)

  try {
    await client.connect()
    console.log('✅ Connected to MongoDB\n')

    const db = client.db()
    const dealersCollection = db.collection('dealers')

    // List all indexes
    console.log('📋 Current indexes on dealers collection:')
    const indexes = await dealersCollection.indexes()
    indexes.forEach(index => {
      console.log(`   - ${index.name}:`, JSON.stringify(index.key))
    })
    console.log()

    // Drop the unique index on dealerName if it exists
    try {
      await dealersCollection.dropIndex('dealerName_1')
      console.log('✅ Dropped unique index on dealerName')
    } catch (error: any) {
      if (error.codeName === 'IndexNotFound') {
        console.log('ℹ️  No dealerName unique index found (already removed or never existed)')
      } else {
        throw error
      }
    }

    // Verify final indexes
    console.log('\n📋 Final indexes on dealers collection:')
    const finalIndexes = await dealersCollection.indexes()
    finalIndexes.forEach(index => {
      console.log(`   - ${index.name}:`, JSON.stringify(index.key))
    })

    console.log('\n✨ Index fix complete!')

  } catch (error) {
    console.error('\n❌ Error fixing indexes:')
    console.error(error)
    process.exit(1)
  } finally {
    await client.close()
    console.log('\n🔌 Disconnected from MongoDB')
    process.exit(0)
  }
}

fixDealerIndex()
