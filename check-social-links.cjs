const { MongoClient } = require('mongodb')
require('dotenv').config({ path: '.env.local' })

async function checkSocialLinks() {
  const client = new MongoClient(process.env.DATABASE_URI)
  await client.connect()
  const db = client.db()
  
  // Get artists with social links
  const artistsWithLinks = await db.collection('artists').find({ 
    'socialLinks.0': { $exists: true } 
  }).limit(5).toArray()
  
  console.log('Artists with social links:')
  console.log('='.repeat(60))
  artistsWithLinks.forEach(artist => {
    console.log(`\n${artist.name} (${artist.socialLinks.length} links):`)
    artist.socialLinks.forEach(link => {
      console.log(`  - ${link.platform}: ${link.url}`)
    })
  })
  
  const totalWithLinks = await db.collection('artists').countDocuments({
    'socialLinks.0': { $exists: true }
  })
  
  console.log('\n' + '='.repeat(60))
  console.log(`Total artists with social links: ${totalWithLinks}`)
  
  await client.close()
}

checkSocialLinks()
