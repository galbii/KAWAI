#!/usr/bin/env node

/**
 * KAWAI Piano Database CSV to Payload CMS Products Collection Migration Script
 * 
 * This script migrates piano data from a WooCommerce CSV export to Payload CMS Products collection.
 * It handles product lines, models, finishes, pricing, and generates proper slugs and relationships.
 * 
 * Usage: node scripts/migrate-csv-to-products.js
 * Requirements: Node.js, CSV file at /Users/chancenoonan/dev/code/KAWAI/update_productDB.csv
 */

import fs from 'fs'
import csv from 'csv-parser'
import path from 'path'

// Configuration
const CSV_FILE_PATH = '/Users/chancenoonan/dev/code/KAWAI/update_productDB.csv'
const BATCH_SIZE = 10 // Process in batches to avoid overwhelming the database
const DRY_RUN = process.env.DRY_RUN === 'true' // Set DRY_RUN=true to test without writing

// Progress tracking
let totalProcessed = 0
let successCount = 0
let errorCount = 0
let skippedCount = 0

// Data structures for tracking
const productLineMap = new Map() // Track created product lines
const processedModels = new Set() // Track processed piano models to avoid duplicates

/**
 * Initialize Payload CMS using API endpoint
 */
async function initPayload() {
  console.log('🚀 Connecting to Payload server at http://localhost:3001...')
  
  // Test connection to make sure server is running
  try {
    const response = await fetch('http://localhost:3001/api/productlines?limit=1')
    if (!response.ok) {
      throw new Error('Server not responding')
    }
    console.log('✅ Payload server is running and accessible')
    return true
  } catch (error) {
    throw new Error('❌ Cannot connect to Payload server. Make sure it\'s running on port 3001')
  }
}

/**
 * Create or find a product line for the given piano category and series
 */
async function ensureProductLine(category, seriesName) {
  const lineKey = `${category}-${seriesName}`
  
  if (productLineMap.has(lineKey)) {
    return productLineMap.get(lineKey)
  }
  
  try {
    const slug = seriesName.toLowerCase().replace(/\s+/g, '-')
    
    // First try to find existing product line
    const findResponse = await fetch(`http://localhost:3001/api/productlines?where[slug][equals]=${slug}&limit=1`)
    const findResult = await findResponse.json()
    
    if (findResult.docs.length > 0) {
      const productLine = findResult.docs[0]
      productLineMap.set(lineKey, productLine)
      console.log(`  📁 Found existing product line: ${productLine.name}`)
      return productLine
    }
    
    // Create new product line
    if (!DRY_RUN) {
      const createResponse = await fetch('http://localhost:3001/api/productlines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: seriesName,
          slug: slug,
          category: category,
          description: `${seriesName} - Premium piano collection from Kawai`,
          featured: false,
          sortOrder: 100
        })
      })
      
      if (!createResponse.ok) {
        throw new Error(`Failed to create product line: ${await createResponse.text()}`)
      }
      
      const productLine = await createResponse.json()
      productLineMap.set(lineKey, productLine)
      console.log(`  ✨ Created product line: ${productLine.name} (${productLine.category})`)
      return productLine
    } else {
      console.log(`  🔍 [DRY RUN] Would create product line: ${seriesName} (${category})`)
      return { id: 'dry-run-id', name: seriesName, category }
    }
  } catch (error) {
    console.error(`  ❌ Error creating product line ${seriesName}:`, error.message)
    throw error
  }
}

/**
 * Parse piano category from CSV categories field
 */
function parsePianoCategory(categoriesField) {
  if (!categoriesField) return null
  
  const categories = categoriesField.toLowerCase()
  
  if (categories.includes('grand')) return 'grand'
  if (categories.includes('upright')) return 'upright'  
  if (categories.includes('digital')) return 'digital'
  if (categories.includes('hybrid')) return 'hybrid'
  
  return null
}

/**
 * Extract model name and series from product name
 */
function parseModelInfo(productName) {
  // Extract Kawai model pattern (e.g., "GL-40", "K-200", "CA99")
  const modelMatch = productName.match(/Kawai\s+([A-Z]+-?\d+[A-Z]?)/i)
  if (!modelMatch) return null
  
  const model = modelMatch[1].toUpperCase()
  
  // Determine series from model prefix
  let seriesName = ''
  if (model.startsWith('GL-') || model.startsWith('GL')) {
    seriesName = 'GL Series'
  } else if (model.startsWith('GX-')) {
    seriesName = 'GX BLAK Series'
  } else if (model.startsWith('K-') || model.startsWith('K')) {
    seriesName = 'K Series'
  } else if (model.startsWith('CA')) {
    seriesName = 'CA Concert Artist Series'
  } else if (model.startsWith('CN')) {
    seriesName = 'CN Series'
  } else if (model.startsWith('ES')) {
    seriesName = 'ES Portable Series'
  } else if (model.startsWith('MP')) {
    seriesName = 'MP Series'
  } else if (model.startsWith('NV')) {
    seriesName = 'NOVUS NV Series'
  } else {
    seriesName = `${model.charAt(0)} Series` // Fallback
  }
  
  return { model, seriesName }
}

/**
 * Parse finish options from attribute fields
 */
function parseFinishes(row) {
  const finishes = []
  
  // Check all attribute fields for finish options
  for (let i = 1; i <= 5; i++) {
    const nameCol = `Attribute ${i} name`
    const valueCol = `Attribute ${i} value(s)`
    
    if (row[nameCol] === 'Finish Options' && row[valueCol]) {
      const finishNames = row[valueCol].split(',').map(f => f.trim()).filter(f => f)
      
      finishNames.forEach(finishName => {
        finishes.push({
          name: finishName,
          available: true,
          priceModifier: 0
        })
      })
      break
    }
  }
  
  return finishes
}

/**
 * Extract pricing information
 */
function parsePricing(row) {
  const pricing = {
    currency: 'USD',
    showPrice: true,
    contactForPricing: false
  }
  
  // Extract MSRP from regular price or short description
  const regularPrice = row['Regular price']
  const shortDesc = row['Short description'] || ''
  
  // Try to extract price from various fields
  const priceRegex = /\$([0-9,]+)/
  
  if (regularPrice) {
    const match = regularPrice.match(priceRegex)
    if (match) {
      pricing.msrp = parseInt(match[1].replace(/,/g, ''))
    }
  }
  
  if (!pricing.msrp && shortDesc) {
    const match = shortDesc.match(priceRegex)
    if (match) {
      pricing.msrp = parseInt(match[1].replace(/,/g, ''))
    }
  }
  
  // Handle sale price
  const salePrice = row['Sale price']
  if (salePrice) {
    const match = salePrice.match(priceRegex)
    if (match) {
      pricing.salePrice = parseInt(match[1].replace(/,/g, ''))
    }
  }
  
  return pricing
}

/**
 * Extract key features from description
 */
function parseKeyFeatures(description) {
  if (!description) return []
  
  const features = []
  
  // Extract list items (HTML <li> tags)
  const listItemRegex = /<li>(.*?)<\/li>/g
  let match
  
  while ((match = listItemRegex.exec(description)) !== null) {
    const feature = match[1]
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&quot;/g, '"') // Replace HTML entities
      .replace(/&amp;/g, '&')
      .trim()
    
    if (feature && feature.length > 0) {
      features.push({ feature })
    }
  }
  
  return features.slice(0, 8) // Limit to 8 key features
}

/**
 * Extract dimensions from attribute fields
 */
function parseDimensions(row) {
  const dimensions = {}
  
  // Look for Length, Width, Height, Weight attributes
  for (let i = 1; i <= 5; i++) {
    const nameCol = `Attribute ${i} name`
    const valueCol = `Attribute ${i} value(s)`
    
    const attrName = row[nameCol]
    const attrValue = row[valueCol]
    
    if (attrName && attrValue) {
      switch (attrName.toLowerCase()) {
        case 'length':
          dimensions.depth = attrValue
          break
        case 'width':
          dimensions.width = attrValue
          break
        case 'height':
          dimensions.height = attrValue
          break
        case 'weight':
          dimensions.weight = attrValue
          break
      }
    }
  }
  
  return dimensions
}

/**
 * Process a single CSV row and create a Product
 */
async function processRow(row) {
  try {
    const productName = row.Name
    if (!productName || !productName.includes('Kawai')) {
      skippedCount++
      return
    }
    
    // Skip variations, process only main products
    if (row.Type === 'variation') {
      skippedCount++
      return
    }
    
    console.log(`\n📝 Processing: ${productName}`)
    
    // Parse model information
    const modelInfo = parseModelInfo(productName)
    if (!modelInfo) {
      console.log(`  ⚠️  Could not parse model info from: ${productName}`)
      skippedCount++
      return
    }
    
    const { model, seriesName } = modelInfo
    
    // Skip if already processed this model
    const modelKey = `${model}-${seriesName}`
    if (processedModels.has(modelKey)) {
      console.log(`  ⏭️  Model ${model} already processed`)
      skippedCount++
      return
    }
    
    // Determine piano category
    const category = parsePianoCategory(row.Categories)
    if (!category) {
      console.log(`  ⚠️  Could not determine category for: ${productName}`)
      skippedCount++
      return
    }
    
    // Ensure product line exists
    const productLine = await ensureProductLine(category, seriesName)
    
    // Parse additional data
    const finishes = parseFinishes(row)
    const pricing = parsePricing(row)
    const keyFeatures = parseKeyFeatures(row.Description)
    const dimensions = parseDimensions(row)
    
    // Generate slug
    const slug = model.toLowerCase().replace(/[^a-z0-9]/g, '-')
    
    // Prepare product data
    const productData = {
      type: 'piano',
      name: `Kawai ${model}`,
      slug,
      category,
      status: 'active',
      description: row.Description ? row.Description.replace(/<[^>]*>/g, '').substring(0, 500) : `${productName} from Kawai`,
      shortDescription: row['Short description'] ? row['Short description'].replace(/<[^>]*>/g, '').substring(0, 200) : '',
      price: pricing,
      finishes,
      productline: productLine.id,
      series: seriesName,
      model,
      keyFeatures,
      specifications: {
        dimensions: {
          width: dimensions.width || '',
          depth: dimensions.depth || '',
          height: dimensions.height || ''
        },
        weight: dimensions.weight || '',
        keys: 88, // Default for most pianos
        pedals: 3   // Default for most pianos
      },
      brand: 'Kawai',
      buyButton: {
        text: 'Contact for Details',
        showButton: true,
        style: 'primary'
      },
      visibility: {
        featured: false,
        showInCatalog: true,
        allowReviews: true
      },
      seo: {
        metaTitle: `${productName} | Kawai Pianos`,
        metaDescription: `Discover the ${productName}. ${row['Short description'] || 'Premium piano from Kawai.'}`.substring(0, 160),
        keywords: `kawai, piano, ${model.toLowerCase()}, ${category} piano`
      }
    }
    
    // Create the product
    if (!DRY_RUN) {
      const createResponse = await fetch('http://localhost:3001/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      })
      
      if (!createResponse.ok) {
        const errorText = await createResponse.text()
        throw new Error(`Failed to create product: ${errorText}`)
      }
      
      const product = await createResponse.json()
      console.log(`  ✅ Created product: ${product.name} (ID: ${product.id})`)
      successCount++
      processedModels.add(modelKey)
    } else {
      console.log(`  🔍 [DRY RUN] Would create product: ${productData.name}`)
      console.log(`     - Category: ${productData.category}`)
      console.log(`     - Series: ${productData.series}`)
      console.log(`     - Finishes: ${productData.finishes.length}`)
      console.log(`     - MSRP: $${productData.price.msrp || 'N/A'}`)
      successCount++
      processedModels.add(modelKey)
    }
    
  } catch (error) {
    console.error(`  ❌ Error processing row:`, error.message)
    errorCount++
  }
}

/**
 * Main migration function
 */
async function migrate() {
  console.log('🎹 KAWAI Piano CSV to Payload Products Migration')
  console.log('=' .repeat(50))
  
  if (DRY_RUN) {
    console.log('🔍 DRY RUN MODE - No data will be written')
  }
  
  // Check CSV file exists
  if (!fs.existsSync(CSV_FILE_PATH)) {
    throw new Error(`CSV file not found: ${CSV_FILE_PATH}`)
  }
  
  // Initialize connection to Payload
  await initPayload()
  
  // Read and process CSV
  console.log(`📖 Reading CSV file: ${CSV_FILE_PATH}`)
  
  const rows = []
  
  return new Promise((resolve, reject) => {
    fs.createReadStream(CSV_FILE_PATH)
      .pipe(csv())
      .on('data', (row) => {
        rows.push(row)
      })
      .on('end', async () => {
        console.log(`📊 Found ${rows.length} rows in CSV`)
        
        try {
          // Process rows in batches
          for (let i = 0; i < rows.length; i += BATCH_SIZE) {
            const batch = rows.slice(i, i + BATCH_SIZE)
            console.log(`\n🔄 Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(rows.length / BATCH_SIZE)}`)
            
            for (const row of batch) {
              await processRow(row)
              totalProcessed++
            }
            
            // Small delay between batches
            await new Promise(resolve => setTimeout(resolve, 100))
          }
          
          // Final statistics
          console.log('\n' + '='.repeat(50))
          console.log('📈 Migration Summary:')
          console.log(`   Total Processed: ${totalProcessed}`)
          console.log(`   ✅ Successful: ${successCount}`)
          console.log(`   ❌ Errors: ${errorCount}`)
          console.log(`   ⏭️  Skipped: ${skippedCount}`)
          console.log(`   📁 Product Lines Created: ${productLineMap.size}`)
          console.log(`   🎹 Unique Models: ${processedModels.size}`)
          
          if (DRY_RUN) {
            console.log('\n🔍 DRY RUN COMPLETED - No data was written to the database')
          } else {
            console.log('\n🎉 Migration completed successfully!')
          }
          
          resolve()
        } catch (error) {
          reject(error)
        }
      })
      .on('error', (error) => {
        reject(error)
      })
  })
}

/**
 * Error handling and process cleanup
 */
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})

// Run migration if this script is executed directly
migrate()
  .then(() => {
    console.log('🏁 Migration script completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Migration failed:', error)
    process.exit(1)
  })

export { migrate }