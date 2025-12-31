#!/usr/bin/env node

/**
 * Import Artists from CSV to Payload CMS
 *
 * This script imports artist data from artists-data.csv into the Payload CMS Artists collection.
 * It handles:
 * - CSV parsing with multi-line bio content
 * - Converting plain text bios to Lexical richText format
 * - Extracting social media URLs from bio text
 * - Mapping CSV columns to collection fields
 * - Generating slugs and setting defaults
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'
import { loadEnv } from '@next/env'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables
const projectDir = __dirname
loadEnv(projectDir)

// Dynamically import the config
const configPath = path.join(__dirname, 'src', 'payload.config.ts')
let config

/**
 * Parse CSV file accounting for multi-line bio fields
 */
function parseCSV(csvContent) {
  const lines = csvContent.split('\n')
  const headers = lines[0].split(',').map(h => h.trim())
  const artists = []

  let currentArtist = {}
  let currentField = ''
  let inQuotes = false
  let currentLine = 1

  while (currentLine < lines.length) {
    const line = lines[currentLine].trim()

    if (!line) {
      currentLine++
      continue
    }

    // If we're not in quotes, this is a new artist row
    if (!inQuotes) {
      if (Object.keys(currentArtist).length > 0) {
        artists.push(currentArtist)
      }
      currentArtist = {}

      // Parse the line
      const parts = []
      let current = ''
      let quoted = false

      for (let i = 0; i < line.length; i++) {
        const char = line[i]

        if (char === '"') {
          quoted = !quoted
        } else if (char === ',' && !quoted) {
          parts.push(current.trim())
          current = ''
        } else {
          current += char
        }
      }
      parts.push(current.trim())

      // Map parts to headers
      headers.forEach((header, index) => {
        if (parts[index]) {
          currentArtist[header] = parts[index].replace(/^"|"$/g, '')
        }
      })

      // Check if bio field ends with a quote - if not, it's multi-line
      if (currentArtist['Bio'] && !line.endsWith('"')) {
        inQuotes = true
        currentField = 'Bio'
      }
    } else {
      // We're in a multi-line bio field
      currentArtist[currentField] += '\n' + line

      // Check if this line ends the quote
      if (line.endsWith('"')) {
        currentArtist[currentField] = currentArtist[currentField].replace(/^"|"$/g, '')
        inQuotes = false
      }
    }

    currentLine++
  }

  // Don't forget the last artist
  if (Object.keys(currentArtist).length > 0) {
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
        children: [
          {
            type: 'paragraph',
            format: '',
            indent: 0,
            version: 1,
            children: []
          }
        ],
        direction: 'ltr'
      }
    }
  }

  // Split by newlines to create paragraphs
  const paragraphs = text.split('\n').filter(p => p.trim())

  const children = paragraphs.map(paragraph => {
    // Extract URLs from the paragraph for link conversion
    const urlRegex = /(https?:\/\/[^\s]+)/g
    const parts = []
    let lastIndex = 0
    let match

    while ((match = urlRegex.exec(paragraph)) !== null) {
      // Add text before the URL
      if (match.index > lastIndex) {
        const textBefore = paragraph.substring(lastIndex, match.index)
        if (textBefore.trim()) {
          parts.push({
            type: 'text',
            format: 0,
            version: 1,
            text: textBefore
          })
        }
      }

      // Add the URL as a link
      parts.push({
        type: 'link',
        format: '',
        indent: 0,
        version: 2,
        rel: 'noopener noreferrer',
        target: '_blank',
        url: match[0],
        children: [
          {
            type: 'text',
            format: 0,
            version: 1,
            text: match[0]
          }
        ]
      })

      lastIndex = match.index + match[0].length
    }

    // Add remaining text
    if (lastIndex < paragraph.length) {
      const remainingText = paragraph.substring(lastIndex)
      if (remainingText.trim()) {
        parts.push({
          type: 'text',
          format: 0,
          version: 1,
          text: remainingText
        })
      }
    }

    // If no URLs found, just add the whole paragraph as text
    if (parts.length === 0) {
      parts.push({
        type: 'text',
        format: 0,
        version: 1,
        text: paragraph
      })
    }

    return {
      type: 'paragraph',
      format: '',
      indent: 0,
      version: 1,
      children: parts,
      direction: 'ltr'
    }
  })

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
  const socialPatterns = [
    { platform: 'website', regex: /(?:Official Website|Official Site|Website):\s*(https?:\/\/[^\s]+)/gi },
    { platform: 'facebook', regex: /(?:Facebook):\s*(https?:\/\/(?:www\.)?facebook\.com\/[^\s]+)/gi },
    { platform: 'twitter', regex: /(?:Twitter):\s*(https?:\/\/(?:www\.)?twitter\.com\/[^\s]+)/gi },
    { platform: 'youtube', regex: /(?:YouTube|Youtube):\s*(https?:\/\/(?:www\.)?youtube\.com\/[^\s]+)/gi },
    { platform: 'instagram', regex: /(?:Instagram):\s*(https?:\/\/(?:www\.)?instagram\.com\/[^\s]+)/gi },
    { platform: 'spotify', regex: /(?:Spotify):\s*(https?:\/\/(?:open\.)?spotify\.com\/[^\s]+)/gi },
    { platform: 'soundcloud', regex: /(?:SoundCloud|Soundcloud):\s*(https?:\/\/(?:www\.)?soundcloud\.com\/[^\s]+)/gi },
    { platform: 'tiktok', regex: /(?:TikTok|Tiktok):\s*(https?:\/\/(?:www\.)?tiktok\.com\/[^\s]+)/gi },
  ]

  for (const { platform, regex } of socialPatterns) {
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
 * Map CSV category to genre field
 */
function mapCategoryToGenre(category) {
  const mapping = {
    'acoustic-piano': 'classical',
    'digital-piano': 'contemporary',
    'piano': 'other'
  }
  return mapping[category] || 'other'
}

/**
 * Map CSV category to instrument field
 */
function mapCategoryToInstrument(category) {
  const mapping = {
    'acoustic-piano': 'grand',
    'digital-piano': 'digital',
    'piano': 'multiple'
  }
  return mapping[category] || 'multiple'
}

/**
 * Determine if artist should be featured based on bio length and prominence
 */
function shouldBeFeatured(artist, index) {
  const bioLength = artist['Bio']?.length || 0
  const hasMultipleSocialLinks = extractSocialLinks(artist['Bio'] || '').length >= 3

  // Feature artists with substantial bios (>1500 chars) or multiple social links
  // Also feature first 10 artists for initial showcase
  return bioLength > 1500 || hasMultipleSocialLinks || index < 10
}

/**
 * Main import function
 */
async function importArtists() {
  console.log('🎹 Starting KAWAI Artists Import...\n')

  try {
    // Initialize Payload CMS
    console.log('📦 Initializing Payload CMS...')
    const payload = await getPayload({ config })
    console.log('✅ Payload CMS initialized\n')

    // Read and parse CSV file
    const csvPath = path.join(__dirname, 'artists-data.csv')
    console.log(`📄 Reading CSV file: ${csvPath}`)
    const csvContent = fs.readFileSync(csvPath, 'utf-8')
    const artists = parseCSV(csvContent)
    console.log(`✅ Parsed ${artists.length} artists from CSV\n`)

    // Import statistics
    const stats = {
      total: artists.length,
      successful: 0,
      failed: 0,
      errors: [],
      imported: []
    }

    // Process each artist
    console.log('🎨 Importing artists...\n')
    for (let i = 0; i < artists.length; i++) {
      const csvArtist = artists[i]
      const artistName = csvArtist['Artist Name']

      try {
        console.log(`[${i + 1}/${artists.length}] Processing: ${artistName}`)

        // Extract social media links from bio
        const socialLinks = extractSocialLinks(csvArtist['Bio'] || '')

        // Convert bio to Lexical format
        const bioLexical = convertTextToLexical(csvArtist['Bio'] || '')

        // Generate short bio (first 280 chars of bio text)
        const bioText = csvArtist['Bio'] || ''
        const shortBio = bioText.substring(0, 277) + (bioText.length > 277 ? '...' : '')

        // Prepare artist data for Payload
        const artistData = {
          name: artistName,
          slug: csvArtist['Slug'] || artistName.toLowerCase().replace(/\s+/g, '-'),
          featured: shouldBeFeatured(csvArtist, i),
          isActive: true,
          imageUrl: csvArtist['Image URL'] || '',
          heroImageUrl: shouldBeFeatured(csvArtist, i) ? csvArtist['Image URL'] : undefined,
          shortBio: shortBio,
          bio: bioLexical,
          genre: mapCategoryToGenre(csvArtist['Category']),
          instrument: mapCategoryToInstrument(csvArtist['Category']),
          socialLinks: socialLinks.map(link => ({
            platform: link.platform,
            url: link.url,
            label: undefined // Use default platform name
          }))
        }

        // Create artist in Payload CMS
        const result = await payload.create({
          collection: 'artists',
          data: artistData
        })

        stats.successful++
        stats.imported.push({
          name: artistName,
          slug: result.slug,
          featured: result.featured,
          socialLinksCount: socialLinks.length
        })

        console.log(`  ✅ Imported: ${artistName} (slug: ${result.slug}, featured: ${result.featured})`)

      } catch (error) {
        stats.failed++
        stats.errors.push({
          artist: artistName,
          error: error.message
        })
        console.error(`  ❌ Failed: ${artistName} - ${error.message}`)
      }
    }

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
      stats.imported.slice(0, 10).forEach(artist => {
        console.log(`  - ${artist.name} (${artist.slug})${artist.featured ? ' ⭐ FEATURED' : ''}`)
      })
    }

    if (stats.errors.length > 0) {
      console.log('\n❌ Errors encountered:')
      stats.errors.forEach(err => {
        console.log(`  - ${err.artist}: ${err.error}`)
      })
    }

    // Field mapping info
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
