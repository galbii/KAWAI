const { MongoClient } = require('mongodb')
require('dotenv').config({ path: '.env.local' })

async function checkArtist() {
  const client = new MongoClient(process.env.DATABASE_URI)
  await client.connect()
  const db = client.db()
  
  // Get a sample artist
  const artist = await db.collection('artists').findOne({ slug: 'alfa' })
  
  console.log('Sample Artist (Alfa):')
  console.log('='.repeat(60))
  console.log('Name:', artist.name)
  console.log('Slug:', artist.slug)
  console.log('Featured:', artist.featured)
  console.log('Active:', artist.isActive)
  console.log('Genre:', artist.genre)
  console.log('Instrument:', artist.instrument)
  console.log('Image URL:', artist.imageUrl)
  console.log('Social Links:', artist.socialLinks.length)
  console.log('\nSocial Links:')
  artist.socialLinks.forEach(link => {
    console.log(`  - ${link.platform}: ${link.url}`)
  })
  console.log('\nBio (Lexical format):')
  console.log('  Root type:', artist.bio.root.type)
  console.log('  Paragraphs:', artist.bio.root.children.length)
  console.log('\nShort Bio:')
  console.log('  ', artist.shortBio)
  
  // Get total count
  const count = await db.collection('artists').countDocuments()
  console.log('\n' + '='.repeat(60))
  console.log('Total artists in database:', count)
  
  await client.close()
}

checkArtist()
