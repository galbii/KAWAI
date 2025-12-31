#!/usr/bin/env node

/**
 * Import Artists from CSV to Payload CMS (Simple Version)
 *
 * This script uses Payload's REST API to import artists
 */

const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

/**
 * Parse CSV file accounting for multi-line bio fields
 */
function parseCSV(csvContent) {
  const lines = csvContent.split('\n')
  const headers = ['Artist Name', 'Slug', 'Category', 'Image URL', 'Bio']
  const artists = []

  let currentArtist = null
  let inBioField = false
  let bioContent = ''

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]

    if (!line.trim()) continue

    // Check if this is a new artist row (starts with a name, not a URL continuation)
    const isNewRow = !inBioField && line.match(/^[^,]+,/)

    if (isNewRow || (!inBioField && currentArtist === null)) {
      // Save previous artist if exists
      if (currentArtist) {
        currentArtist['Bio'] = bioContent.trim().replace(/^"|"$/g, '')
        artists.push(currentArtist)
      }

      // Parse new row
      const parts = []
      let current = ''
      let inQuotes = false

      for (let j = 0; j < line.length; j++) {
        const char = line[j]
        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === ',' && !inQuotes) {
          parts.push(current)
          current = ''
        } else {
          current += char
        }
      }
      parts.push(current)

      currentArtist = {}
      headers.forEach((header, index) => {
        if (parts[index] !== undefined) {
          currentArtist[header] = parts[index].trim().replace(/^"|"$/g, '')
        }
      })

      // Check if bio field continues on next lines
      if (parts[4] && !line.endsWith('"')) {
        inBioField = true
        bioContent = parts[4]
      } else {
        bioContent = parts[4] || ''
        inBioField = false
      }
    } else if (inBioField) {
      // Continuation of bio field
      bioContent += '\n' + line
      if (line.trim().endsWith('"')) {
        inBioField = false
      }
    }
  }

  // Don't forget last artist
  if (currentArtist) {
    currentArtist['Bio'] = bioContent.trim().replace(/^"|"$/g, '')
    artists.push(currentArtist)
  }

  return artists
}

/**
 * Convert plain text to Lexical richText format
 */
function convertTextToLexical(text) {
  if (!text || text.trim() === '') {
    return {
      root: {
        type: 'root',
        format: '',
        indent: 0,
        version: 1,
        children: [{
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          children: [],
          direction: 'ltr'
        }],
        direction: 'ltr'
      }
    }
  }

  // Split by newlines
  const paragraphs = text.split('\n').filter(p => p.trim())

  const children = paragraphs.map(paragraph => ({
    type: 'paragraph',
    format: '',
    indent: 0,
    version: 1,
    children: [{
      type: 'text',
      format: 0,
      version: 1,
      text: paragraph
    }],
    direction: 'ltr'
  }))

  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children,
      direction: 'ltr'
    }
  }
}

/**
 * Extract social media links from bio text
 */
function extractSocialLinks(bioText) {
  const links = []
  const patterns = [
    { platform: 'website', regex: /(?:Official Website|Official Site|Website):\s*(https?:\/\/[^\s\n]+)/gi },
    { platform: 'facebook', regex: /(?:Facebook):\s*(https?:\/\/[^\s\n]+)/gi },
    { platform: 'twitter', regex: /(?:Twitter):\s*(https?:\/\/[^\s\n]+)/gi },
    { platform: 'youtube', regex: /(?:YouTube|Youtube):\s*(https?:\/\/[^\s\n]+)/gi },
    { platform: 'instagram', regex: /(?:Instagram):\s*(https?:\/\/[^\s\n]+)/gi },
    { platform: 'tiktok', regex: /(?:TikTok):\s*(https?:\/\/[^\s\n]+)/gi },
  ]

  for (const { platform, regex } of patterns) {
    let match
    while ((match = regex.exec(bioText)) !== null) {
      const url = match[1].trim()
      if (url && !links.some(l => l.url === url)) {
        links.push({ platform, url })
      }
    }
  }

  return links
}

/**
 * Main import function using MongoDB directly
 */
async function importArtists() {
  console.log('🎹 Starting KAWAI Artists Import (Direct MongoDB)...\n')

  try {
    // Connect to MongoDB
    const { MongoClient } = require('mongodb')
    const mongoUri = process.env.DATABASE_URI

    if (!mongoUri) {
      throw new Error('DATABASE_URI not found in environment variables')
    }

    console.log('📦 Connecting to MongoDB...')
    const client = new MongoClient(mongoUri)
    await client.connect()
    const db = client.db()
    const artistsCollection = db.collection('artists')
    console.log('✅ Connected to MongoDB\n')

    // Read and parse CSV
    const csvPath = path.join(__dirname, 'artists-data.csv')
    console.log(`📄 Reading CSV file: ${csvPath}`)
    const csvContent = fs.readFileSync(csvPath, 'utf-8')
    const artists = parseCSV(csvContent)
    console.log(`✅ Parsed ${artists.length} artists from CSV\n`)

    // Stats
    const stats = {
      total: artists.length,
      successful: 0,
      failed: 0,
      errors: [],
      imported: []
    }

    // Import each artist
    console.log('🎨 Importing artists...\n')
    for (let i = 0; i < artists.length; i++) {
      const csvArtist = artists[i]
      const artistName = csvArtist['Artist Name']

      try {
        console.log(`[${i + 1}/${artists.length}] Processing: ${artistName}`)

        const socialLinks = extractSocialLinks(csvArtist['Bio'] || '')
        const bioLexical = convertTextToLexical(csvArtist['Bio'] || '')
        const bioText = csvArtist['Bio'] || ''
        const shortBio = bioText.substring(0, 277) + (bioText.length > 277 ? '...' : '')

        // Determine featured status
        const featured = bioText.length > 1500 || socialLinks.length >= 3 || i < 10

        // Map category
        const categoryMap = {
          'acoustic-piano': { genre: 'classical', instrument: 'grand' },
          'digital-piano': { genre: 'contemporary', instrument: 'digital' },
          'piano': { genre: 'other', instrument: 'multiple' }
        }
        const mapping = categoryMap[csvArtist['Category']] || { genre: 'other', instrument: 'multiple' }

        const artistDoc = {
          name: artistName,
          slug: csvArtist['Slug'] || artistName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
          featured: featured,
          isActive: true,
          imageUrl: csvArtist['Image URL'] || '',
          heroImageUrl: featured ? csvArtist['Image URL'] : undefined,
          shortBio: shortBio,
          bio: bioLexical,
          genre: mapping.genre,
          instrument: mapping.instrument,
          socialLinks: socialLinks.map(link => ({
            platform: link.platform,
            url: link.url
          })),
          createdAt: new Date(),
          updatedAt: new Date()
        }

        // Insert into MongoDB
        const result = await artistsCollection.insertOne(artistDoc)

        stats.successful++
        stats.imported.push({
          name: artistName,
          slug: artistDoc.slug,
          featured: artistDoc.featured,
          socialLinksCount: socialLinks.length
        })

        console.log(`  ✅ Imported: ${artistName} (slug: ${artistDoc.slug}, featured: ${artistDoc.featured})`)

      } catch (error) {
        stats.failed++
        stats.errors.push({
          artist: artistName,
          error: error.message
        })
        console.error(`  ❌ Failed: ${artistName} - ${error.message}`)
      }
    }

    await client.close()

    // Print summary
    console.log('\n' + '='.repeat(60))
    console.log('📊 IMPORT SUMMARY')
    console.log('='.repeat(60))
    console.log(`Total artists in CSV: ${stats.total}`)
    console.log(`Successfully imported: ${stats.successful}`)
    console.log(`Failed: ${stats.failed}`)
    console.log(`Featured artists: ${stats.imported.filter(a => a.featured).length}`)

    if (stats.successful > 0) {
      console.log('\n🎉 Sample of imported artists:')
      stats.imported.slice(0, 15).forEach(artist => {
        console.log(`  - ${artist.name} (${artist.slug})${artist.featured ? ' ⭐ FEATURED' : ''}`)
      })
    }

    if (stats.errors.length > 0) {
      console.log('\n❌ Errors encountered:')
      stats.errors.forEach(err => {
        console.log(`  - ${err.artist}: ${err.error}`)
      })
    }

    console.log('\n📋 Field Mapping:')
    console.log('  CSV Column -> Collection Field')
    console.log('  Artist Name -> name')
    console.log('  Slug -> slug')
    console.log('  Category -> genre + instrument')
    console.log('  Image URL -> imageUrl (+ heroImageUrl for featured)')
    console.log('  Bio -> bio (converted to Lexical richText)')
    console.log('  Bio URLs -> socialLinks (extracted)')

    console.log('\n✅ Import complete!')
    process.exit(0)

  } catch (error) {
    console.error('\n💥 Fatal error during import:', error)
    process.exit(1)
  }
}

// Run the import
importArtists()
