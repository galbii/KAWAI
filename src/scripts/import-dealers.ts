import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import Papa from 'papaparse'
import { config as dotenvConfig } from 'dotenv'

// Load environment variables from .env.local FIRST before importing payload
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const envPath = path.resolve(__dirname, '../../.env.local')
dotenvConfig({ path: envPath })

// Verify critical environment variables are loaded
if (!process.env.PAYLOAD_SECRET) {
  console.error('❌ PAYLOAD_SECRET is not set in environment variables')
  process.exit(1)
}
if (!process.env.DATABASE_URI) {
  console.error('❌ DATABASE_URI is not set in environment variables')
  process.exit(1)
}

console.log('✅ Environment variables loaded successfully')

// Import getPayload (doesn't evaluate config)
import { getPayload } from 'payload'

interface CSVDealer {
  ID: string
  'Store Name': string
  Address: string
  'Address 2': string
  City: string
  State: string
  ZIP: string
  Categories: string
  Latitude: string
  Longitude: string
  Published: string
}

// Helper function to generate URL-friendly slug from dealer name
function generateSlug(name: string, city?: string): string {
  let slug = name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim()

  // If city is provided, append it to ensure uniqueness
  if (city) {
    const citySlug = city
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
    slug = `${slug}-${citySlug}`
  }

  return slug
}

// Valid dealer tag types (must match Dealers collection)
type DealerTag =
  | 'authorized-dealer'
  | 'full-service'
  | 'grand-specialist'
  | 'digital-specialist'
  | 'tuning'
  | 'repair'
  | 'restoration'
  | 'moving'
  | 'rentals'
  | 'financing'
  | 'trade-ins'
  | 'virtual-consult'
  | 'education'
  | 'performance'

// Map CSV categories to our tag system
function mapCategoriesToTags(categories: string): DealerTag[] {
  const tags: DealerTag[] = []

  if (categories.includes('Acoustic Pianos')) {
    tags.push('authorized-dealer')
  }
  if (categories.includes('Digital Pianos')) {
    tags.push('digital-specialist')
  }

  // Add some default tags for all dealers
  tags.push('full-service')

  return tags
}

// Parse CSV using papaparse
function parseCSV(csvContent: string): CSVDealer[] {
  const result = Papa.parse<CSVDealer>(csvContent, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
  })

  if (result.errors.length > 0) {
    console.warn('⚠️  CSV parsing warnings:')
    result.errors.forEach(error => {
      console.warn(`   - Row ${error.row}: ${error.message}`)
    })
  }

  return result.data
}

async function importDealers() {
  console.log('🎹 Starting KAWAI Dealer Import...\n')

  try {
    // Dynamically import config after env vars are set
    const { default: config } = await import('@/payload.config')

    // Initialize Payload
    const payload = await getPayload({ config })
    console.log('✅ Payload CMS initialized\n')

    // Read CSV file
    const csvPath = path.resolve(__dirname, '../../dealers.csv')
    console.log(`📄 Reading CSV from: ${csvPath}`)

    if (!fs.existsSync(csvPath)) {
      throw new Error(`CSV file not found at ${csvPath}`)
    }

    const csvContent = fs.readFileSync(csvPath, 'utf-8')
    const dealers = parseCSV(csvContent)

    console.log(`📊 Found ${dealers.length} dealers in CSV\n`)

    let successCount = 0
    let errorCount = 0
    const errors: Array<{ dealer: string; error: string }> = []

    // Import each dealer
    for (const csvDealer of dealers) {
      try {
        const dealerName = csvDealer['Store Name']
        if (!dealerName) {
          console.log(`⏭️  Skipping row with no store name`)
          continue
        }

        // Build full address
        let fullAddress = csvDealer.Address
        if (csvDealer['Address 2']) {
          fullAddress += `, ${csvDealer['Address 2']}`
        }

        // Parse coordinates
        const latitude = parseFloat(csvDealer.Latitude)
        const longitude = parseFloat(csvDealer.Longitude)

        if (isNaN(latitude) || isNaN(longitude)) {
          console.log(`⚠️  Skipping ${dealerName} - Invalid coordinates`)
          errors.push({ dealer: dealerName, error: 'Invalid coordinates' })
          errorCount++
          continue
        }

        // Prepare dealer data matching our schema
        // Use city in slug to ensure uniqueness for dealers with same name in different cities
        const dealerData = {
          dealerName,
          slug: generateSlug(dealerName, csvDealer.City),
          dealerType: ['acoustic-digital'] as ('professional-products' | 'acoustic-digital')[], // Default dealer type
          isActive: csvDealer.Published === 'Yes',
          isFeatured: false,

          // Contact info (empty for now - can be added manually later)
          contactInfo: {
            phone: '',
            email: '',
            website: '',
          },

          // Address
          address: {
            street: fullAddress,
            city: csvDealer.City,
            state: csvDealer.State,
            zipCode: csvDealer.ZIP,
            country: 'USA',
          },

          // Coordinates
          coordinates: {
            latitude,
            longitude,
          },

          // Tags mapped from categories
          tags: mapCategoriesToTags(csvDealer.Categories),

          // Optional fields - can be populated later
          description: '',
          hours: [],
          specialties: '',

          // Service area
          serviceArea: {
            primaryMarkets: [
              { market: csvDealer.City }
            ],
            statesServed: [
              { state: csvDealer.State }
            ],
          },
        }

        // Create dealer in Payload
        await payload.create({
          collection: 'dealers',
          data: dealerData,
          overrideAccess: true, // Skip access control for seed script
          draft: false, // Publish immediately
        })

        successCount++
        console.log(`✅ Imported: ${dealerName} (${csvDealer.City}, ${csvDealer.State})`)

      } catch (error) {
        errorCount++
        const errorMessage = error instanceof Error ? error.message : String(error)
        console.error(`❌ Failed to import ${csvDealer['Store Name']}: ${errorMessage}`)
        errors.push({ dealer: csvDealer['Store Name'], error: errorMessage })
      }
    }

    // Summary
    console.log('\n' + '='.repeat(60))
    console.log('📊 Import Summary')
    console.log('='.repeat(60))
    console.log(`✅ Successfully imported: ${successCount} dealers`)
    console.log(`❌ Failed: ${errorCount} dealers`)
    console.log(`📈 Total processed: ${dealers.length} rows`)

    if (errors.length > 0) {
      console.log('\n⚠️  Errors encountered:')
      errors.forEach(({ dealer, error }) => {
        console.log(`   - ${dealer}: ${error}`)
      })
    }

    console.log('\n✨ Import complete!')
    process.exit(0)

  } catch (error) {
    console.error('\n❌ Fatal error during import:')
    console.error(error)
    process.exit(1)
  }
}

// Run the import
importDealers()
