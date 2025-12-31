#!/usr/bin/env node

/**
 * Import Artists from CSV to Payload CMS (Fixed Version)
 * Uses papaparse for proper CSV parsing with multi-line fields
 */

const fs = require('fs')
const path = require('path')
const Papa = require('papaparse')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

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

  // Split by newlines for paragraphs
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
  if (!bioText) return []

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
  console.log('🎹 Starting KAWAI Artists Import (Fixed CSV Parser)...\n')

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

    // Read and parse CSV using papaparse
    const csvPath = path.join(__dirname, 'artists-data.csv')
    console.log(`📄 Reading CSV file: ${csvPath}`)
    const csvContent = fs.readFileSync(csvPath, 'utf-8')

    const parseResult = Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim()
    })

    if (parseResult.errors.length > 0) {
      console.warn('⚠️  CSV parsing warnings:')
      parseResult.errors.forEach(error => {
        console.warn(`   Row ${error.row}: ${error.message}`)
      })
    }

    const artists = parseResult.data
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

      if (!artistName || !artistName.trim()) {
        console.log(`[${i + 1}/${artists.length}] ⏭️  Skipping empty row`)
        continue
      }

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

        // Validate image URL
        let imageUrl = csvArtist['Image URL'] || ''
        if (imageUrl && !imageUrl.startsWith('http')) {
          console.warn(`  ⚠️  Invalid image URL for ${artistName}: ${imageUrl}`)
          imageUrl = ''
        }

        const artistDoc = {
          name: artistName.trim(),
          slug: csvArtist['Slug'] || artistName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
          featured: featured,
          isActive: true,
          imageUrl: imageUrl,
          heroImageUrl: featured && imageUrl ? imageUrl : undefined,
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
        await artistsCollection.insertOne(artistDoc)

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
